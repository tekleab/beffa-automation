#!/usr/bin/env bash
# scripts/fetch_company.sh
# ------------------------------------------------------------
# 1. Logs in using the correct ERP endpoint to get a fresh token.
# 2. Calls /api/company/settings to verify connectivity.
# 3. Reads the X-Company header and writes BEFFA_COMPANY to $GITHUB_ENV.
# Falls back to 'sample' if API is unreachable (e.g., in cloud CI).
# ------------------------------------------------------------
set -uo pipefail

BASE="${BASE_URL:-http://168.119.175.142:8001}"
YEAR="${BEFFA_YEAR:-2018}"
PERIOD="${BEFFA_PERIOD:-yearly}"
CALENDAR="${BEFFA_CALENDAR:-ec}"

echo "[INFO] Fetching fresh auth token from ERP..."

# Step 1: Login — matches AuthManager endpoint exactly
LOGIN_URL="${BASE}/users/login?year=${YEAR}&period=${PERIOD}&calendar=${CALENDAR}&month=6"

LOGIN_RESPONSE=$(curl -s --max-time 10 -X POST "${LOGIN_URL}" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${BEFFA_USER}\",\"password\":\"${BEFFA_PASS}\"}" 2>/dev/null || echo "{}")

# Token field is 'auth_token' (from AuthManager.ts line 50)
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.auth_token // empty' 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "[WARN] Could not retrieve auth token. Falling back to 'sample'."
  echo "BEFFA_COMPANY=sample" >> "$GITHUB_ENV"
  exit 0
fi

echo "[OK] Token acquired."

# Step 2: Fetch company settings
API_URL="${BASE}/api/company/settings?year=${YEAR}&period=${PERIOD}&calendar=${CALENDAR}"

COMPANY=$(curl -sS --max-time 10 -D - \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Accept: application/json" \
  "${API_URL}" -o /dev/null 2>/dev/null \
  | grep -i '^x-company:' | awk -F': ' '{print $2}' | tr -d '\r' || echo "")

if [ -z "$COMPANY" ]; then
  echo "[WARN] x-company header not found. Falling back to 'sample'."
  COMPANY="sample"
fi

echo "[RESULT] Company resolved: ${COMPANY}"
echo "BEFFA_COMPANY=${COMPANY}" >> "$GITHUB_ENV"
