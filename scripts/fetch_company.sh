#!/usr/bin/env bash
# scripts/fetch_company.sh
# ------------------------------------------------------------
# 1. Logs in with BEFFA_USER / BEFFA_PASS to get a fresh Bearer token.
# 2. Calls the company/settings endpoint.
# 3. Extracts the X-Company header and writes BEFFA_COMPANY to $GITHUB_ENV.
# ------------------------------------------------------------
set -euo pipefail

BASE="${BASE_URL:-http://168.119.175.142:8001}"
YEAR="${BEFFA_YEAR:-2018}"
PERIOD="${BEFFA_PERIOD:-yearly}"
CALENDAR="${BEFFA_CALENDAR:-ec}"

echo "[INFO] Fetching fresh auth token from ERP..."

# Step 1: Login and capture the Bearer token
LOGIN_RESPONSE=$(curl -s -X POST "${BASE}/api/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${BEFFA_USER}\",\"password\":\"${BEFFA_PASS}\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token // .token // empty')

if [ -z "$TOKEN" ]; then
  echo "[ERROR] Could not retrieve auth token. Check BEFFA_USER and BEFFA_PASS secrets."
  exit 1
fi

echo "[OK] Token acquired."

# Step 2: Fetch company settings and capture x-company header
API_URL="${BASE}/api/company/settings?year=${YEAR}&period=${PERIOD}&calendar=${CALENDAR}"

COMPANY=$(curl -sS -D - \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Accept: application/json" \
  "${API_URL}" -o /dev/null \
  | grep -i '^x-company:' | awk -F': ' '{print $2}' | tr -d '\r')

if [ -z "$COMPANY" ]; then
  echo "[WARN] x-company header not found. Falling back to 'sample'."
  COMPANY="sample"
fi

echo "[RESULT] Company resolved: ${COMPANY}"
echo "BEFFA_COMPANY=${COMPANY}" >> "$GITHUB_ENV"
