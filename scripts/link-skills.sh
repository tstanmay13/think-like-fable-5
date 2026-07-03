#!/usr/bin/env bash
# Symlink every skill in this repo into ~/.claude/skills so Claude Code picks
# them up without an install step. Safe to re-run.
set -euo pipefail
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET_DIR="$HOME/.claude/skills"
mkdir -p "$TARGET_DIR"
for skill in "$REPO_DIR"/skills/*/; do
  name="$(basename "$skill")"
  ln -sfn "${skill%/}" "$TARGET_DIR/$name"
  echo "linked $name -> $TARGET_DIR/$name"
done
