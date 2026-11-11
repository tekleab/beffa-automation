#!/usr/bin/env bash
set -e

# Ensure Bun is in PATH if installed in ~/.bun
if [ -d "$HOME/.bun/bin" ]; then
  export PATH="$HOME/.bun/bin:$PATH"
fi

# Detect test runner: prefer bun x, fallback to npx
if command -v bun >/dev/null 2>&1; then
  RUNNER="bun x playwright test"
else
  RUNNER="npx playwright test"
fi

echo "🚀 Running tests with: $RUNNER"
echo "Target: ${*:-tests/sales/customer.spec.ts --project=Sales}"
echo "---------------------------------------------------------"

if [ $# -eq 0 ]; then
  eval $RUNNER tests/sales/customer.spec.ts --project=Sales
else
  eval $RUNNER "$@"
fi
