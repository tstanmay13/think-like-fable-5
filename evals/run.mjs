#!/usr/bin/env node
// Paired eval runner: each scenario runs twice on the model under test --
// once bare, once with the skill appended to the system prompt -- and an LLM
// judge grades both responses against the scenario's rubric. The delta is the
// skill's measured lift.
//
// Usage:
//   node evals/run.mjs                        # all scenarios, default models
//   node evals/run.mjs --scenario buried-lede # one scenario
//   node evals/run.mjs --model claude-haiku-4-5 --judge claude-sonnet-5
//
// Requires the `claude` CLI to be installed and authenticated.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const execFileP = promisify(execFile);
const ROOT = dirname(fileURLToPath(import.meta.url));
const SKILL_PATH = join(ROOT, "..", "skills", "think-like-fable-5", "SKILL.md");
const SCENARIOS_DIR = join(ROOT, "scenarios");
const SANDBOX = join(ROOT, ".sandbox");
const RESULTS_DIR = join(ROOT, "results");

const DISALLOWED_TOOLS =
  "Bash,Edit,Write,Read,Glob,Grep,WebFetch,WebSearch,Task,NotebookEdit,TodoWrite,Agent";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const MODEL = flag("model", "haiku");
const JUDGE = flag("judge", "sonnet");
const ONLY = flag("scenario", null);

function parseScenario(path) {
  const raw = readFileSync(path, "utf8");
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  const meta = Object.fromEntries(
    (fm ? fm[1] : "")
      .split("\n")
      .map((l) => l.split(/:\s(.*)/s).slice(0, 2))
      .filter((kv) => kv.length === 2)
  );
  const section = (name) => {
    const m = raw.match(new RegExp(`## ${name}\\n([\\s\\S]*?)(?=\\n## |$)`));
    return m ? m[1].trim() : "";
  };
  const rubric = section("Rubric")
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((l) => l.replace(/^- (\[ \] )?/, ""));
  return { id: meta.id, target: meta.target, prompt: section("Prompt"), trap: section("Trap"), rubric };
}

async function runModel(prompt, withSkill) {
  const cliArgs = ["-p", prompt, "--model", MODEL, "--disallowedTools", ...DISALLOWED_TOOLS.split(",")];
  if (withSkill) cliArgs.push("--append-system-prompt", readFileSync(SKILL_PATH, "utf8"));
  const { stdout } = await execFileP("claude", cliArgs, {
    cwd: SANDBOX,
    timeout: 300_000,
    maxBuffer: 10 * 1024 * 1024,
  });
  return stdout.trim();
}

function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error(`judge returned no JSON: ${text.slice(0, 200)}`);
  return JSON.parse(text.slice(start, end + 1));
}

async function judge(scenario, response) {
  const prompt = [
    "You are grading a model's response against a rubric. Grade ONLY from the response text.",
    "", "## The task the model was given", scenario.prompt,
    "", "## The failure mode being tested", scenario.trap,
    "", "## The model's response", "<response>", response, "</response>",
    "", "## Rubric",
    ...scenario.rubric.map((r, i) => `${i + 1}. ${r}`),
    "",
    'Return ONLY a JSON object, no prose: {"checks": [{"n": 1, "pass": true, "evidence": "one short quote or observation"}, ...]} with one entry per rubric item.',
  ].join("\n");
  const { stdout } = await execFileP(
    "claude",
    ["-p", prompt, "--model", JUDGE, "--disallowedTools", ...DISALLOWED_TOOLS.split(",")],
    { cwd: SANDBOX, timeout: 300_000, maxBuffer: 10 * 1024 * 1024 }
  );
  return extractJson(stdout.trim()).checks;
}

const files = readdirSync(SCENARIOS_DIR).filter((f) => f.endsWith(".md"));
const scenarios = files.map((f) => parseScenario(join(SCENARIOS_DIR, f))).filter((s) => !ONLY || s.id === ONLY);
if (scenarios.length === 0) {
  console.error(ONLY ? `no scenario with id "${ONLY}"` : "no scenarios found");
  process.exit(1);
}

mkdirSync(SANDBOX, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = join(RESULTS_DIR, stamp);
mkdirSync(outDir, { recursive: true });

console.log(`model under test: ${MODEL}   judge: ${JUDGE}\n`);
let bareTotal = 0, skillTotal = 0, rubricTotal = 0;
const report = [];

for (const s of scenarios) {
  process.stdout.write(`${s.id} … `);
  const [bare, skilled] = await Promise.all([runModel(s.prompt, false), runModel(s.prompt, true)]);
  const [bareChecks, skilledChecks] = await Promise.all([judge(s, bare), judge(s, skilled)]);
  const passes = (checks) => checks.filter((c) => c.pass).length;
  const bp = passes(bareChecks), sp = passes(skilledChecks);
  bareTotal += bp; skillTotal += sp; rubricTotal += s.rubric.length;
  console.log(`bare ${bp}/${s.rubric.length}  with-skill ${sp}/${s.rubric.length}`);
  report.push({ scenario: s.id, target: s.target, bare: { response: bare, checks: bareChecks }, withSkill: { response: skilled, checks: skilledChecks } });
}

writeFileSync(join(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log(`\ntotal: bare ${bareTotal}/${rubricTotal}  with-skill ${skillTotal}/${rubricTotal}`);
console.log(`full transcripts: ${outDir}/report.json`);
