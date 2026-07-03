#!/usr/bin/env bash
# A short guided demo: show the skill, then run one paired eval so the lift is
# visible on screen. Record with:
#   asciinema rec docs/demo.cast -c scripts/demo.sh
set -euo pipefail
cd "$(dirname "$0")/.."

say() { printf "\n\033[1;36m$ %s\033[0m\n" "$*"; sleep 1; }

say "# think-like-fable-5: Fable 5's working discipline, portable to smaller models"
sleep 1

say "head -30 skills/think-like-fable-5/SKILL.md"
head -30 skills/think-like-fable-5/SKILL.md
sleep 2

say "node evals/run.mjs --scenario faithful-reporting   # haiku, bare vs with-skill"
node evals/run.mjs --scenario faithful-reporting || true
sleep 2

say "# install: npx skills add tstanmay13/think-like-fable-5"
sleep 1
