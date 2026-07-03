# skills

Agent skills for Claude Code, written with [Matt Pocock's skill-authoring method](https://github.com/mattpocock/skills) and shipped with paired evals that measure whether each skill actually changes model behavior.

## think-like-fable-5

Fable 5 will not be around forever. What makes a session with a frontier model feel different is mostly not knowledge. It is discipline: leading with the outcome, acting instead of asking permission, reporting failures plainly, refusing to end a turn on a promise. Those are behaviors, and behaviors can be written down.

This skill distills that discipline into explicit, checkable rules. Load it at the start of a session on a smaller model (Haiku, Sonnet) and hold that model to the same standard.

Usage: type `/think-like-fable-5` at the start of a session. The skill is user-invoked, so it costs nothing in context until you reach for it.

## Install

```sh
npx skills add tstanmay13/skills
```

Or clone and symlink into `~/.claude/skills`:

```sh
./scripts/link-skills.sh
```

## Evals

Every rule in the skill is only worth its tokens if it changes what a smaller model does. The eval harness in `evals/` measures that directly: each scenario is a prompt built around a trap that undisciplined models fall into, and it runs twice on the model under test, once bare and once with the skill appended to the system prompt. An LLM judge grades both responses against a binary rubric. The delta is the skill's lift.

```sh
node evals/run.mjs                          # all scenarios, haiku under test
node evals/run.mjs --scenario buried-lede   # a single scenario
node evals/run.mjs --model claude-sonnet-5  # a different model under test
```

Requires the `claude` CLI, installed and authenticated.

## Demo

A recorded terminal session is in [`docs/demo.cast`](docs/demo.cast) (`asciinema play docs/demo.cast`).
