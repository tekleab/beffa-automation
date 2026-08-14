#!/usr/bin/env bash
# scripts/fetch-company.sh
set -uo pipefail

BASE="${API_URL:-${BASE_URL:-http://localhost:8001}}"
# Strip trailing /api if present to avoid double /api/api
BASE="${BASE%/api}"
YEAR="${BEFFA_YEAR:-2019}"
PERIOD="${BEFFA_PERIOD:-yearly}"
CALENDAR="${BEFFA_CALENDAR:-ec}"

echo "[INFO] Fetching fresh auth token from ERP..."

LOGIN_URL="${BASE}/api/users/login?year=${YEAR}&period=${PERIOD}&calendar=${CALENDAR}&month=6"

LOGIN_RESPONSE=$(curl -s --max-time 10 -X POST "${LOGIN_URL}" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${BEFFA_USER}\",\"password\":\"${BEFFA_PASS}\"}" 2>/dev/null || echo "{}")

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.auth_token // empty' 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "[WARN] Could not retrieve auth token. Using default BM Tech."
  echo "BEFFA_COMPANY=BM Tech" >> "$GITHUB_ENV"
  exit 0
fi

echo "[OK] Token acquired."

# Fetch companies from /users/me
ME_RESPONSE=$(curl -s --max-time 10 \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Accept: application/json" \
  "${BASE}/api/users/me" 2>/dev/null || echo "{}")

# Look specifically for BM Tech in the user's company list
COMPANY=$(echo "$ME_RESPONSE" | jq -r '(.user.companies // .companies // [])[] | select(.name | test("BM Tech"; "i")) | .name' 2>/dev/null | head -n 1 || echo "")

if [ -z "$COMPANY" ]; then
  # Fallback to BM Tech
  COMPANY="BM Tech"
fi

echo "[RESULT] Company resolved: ${COMPANY}"
echo "BEFFA_COMPANY=${COMPANY}" >> "$GITHUB_ENV"
