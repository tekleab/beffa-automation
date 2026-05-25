#!/usr/bin/env bash
# scripts/fetch_company.sh
# ------------------------------------------------------------
# Retrieves the company identifier from the ERP settings endpoint
# and exports it to the GitHub Actions environment.
# Uses BEFFA_TOKEN (or BEFFA_PASS) for Bearer auth.
# ------------------------------------------------------------
set -euo pipefail

API_URL="http://168.119.175.142:8001/api/company/settings?year=${BEFFA_YEAR}&period=${BEFFA_PERIOD}&calendar=${BEFFA_CALENDAR}"
TOKEN="${BEFFA_TOKEN:-${BEFFA_PASS}}"

# Try to read the X-Company header (preferred)
company=$(curl -s -D - -H "Authorization: Bearer $TOKEN" "$API_URL" -o /dev/null |
          grep -i '^x-company:' | awk -F': ' '{print $2}' | tr -d '\r')

# Fallback: if header missing, pull a field from the JSON payload (e.g., seeding_status as placeholder)
if [ -z "$company" ]; then
  payload=$(curl -s -H "Authorization: Bearer $TOKEN" "$API_URL")
  # use a safe default; you can adjust to any JSON key you prefer
  company=$(echo "$payload" | jq -r '.seeding_status // "sample"')
fi

# Export to GitHub Actions env file
echo "BEFFA_COMPANY=$company" >> "$GITHUB_ENV"
