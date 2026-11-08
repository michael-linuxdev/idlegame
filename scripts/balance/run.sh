#!/usr/bin/env bash
# Bundle + run the balance simulator. Usage: scripts/balance/run.sh engaged 48
set -euo pipefail
out="${TMPDIR:-/tmp}/gartenerbe-sim.mjs"
npx rolldown scripts/balance/sim.ts --format esm --platform node -o "$out" >/dev/null
node "$out" "$@"
