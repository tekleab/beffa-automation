#!/usr/bin/env bash
# scripts/fetch-company.sh
# Scans ALL companies via /api/users/me and finds the one with an open fiscal period.
# Exports BEFFA_COMPANY and BEFFA_YEAR to GITHUB_ENV (or prints them for local use).
set -uo pipefail

BASE="${API_URL:-${BASE_URL:-http://localhost:8001}}"
BASE="${BASE%/api}"
PERIOD="${BEFFA_PERIOD:-yearly}"
CALENDAR="${BEFFA_CALENDAR:-ec}"
BASE_YEAR="${BEFFA_YEAR:-2019}"
TODAY=$(date -u +"%Y-%m-%dT00:00:00Z")

echo "[INFO] Logging in to ERP..."
LOGIN_BODY=$(python3 -c "
import urllib.request, json
req = urllib.request.Request(
  '${BASE}/api/users/login?year=${BASE_YEAR}&period=${PERIOD}&calendar=${CALENDAR}&month=6',
  data=json.dumps({'email':'${BEFFA_USER}','password':'${BEFFA_PASS}'}).encode(),
  headers={'Content-Type':'application/json'}, method='POST')
print(urllib.request.urlopen(req, timeout=15).read().decode())
" 2>/dev/null || echo "{}")

TOKEN=$(echo "$LOGIN_BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('auth_token',d.get('token','')))" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "[WARN] Auth failed — keeping existing BEFFA_COMPANY=${BEFFA_COMPANY:-sample}"
  exit 0
fi
echo "[OK] Token acquired."

# Fetch all company names from /api/users/me
COMPANY_NAMES=$(python3 -c "
import urllib.request, json
req = urllib.request.Request('${BASE}/api/users/me', headers={'Authorization':'Bearer ${TOKEN}'})
d = json.loads(urllib.request.urlopen(req, timeout=15).read())
cos = d.get('user', d).get('companies', [])
print('\n'.join(c.get('name','') for c in cos if c.get('name')))
" 2>/dev/null || echo "")

if [ -z "$COMPANY_NAMES" ]; then
  echo "[WARN] No companies returned — keeping existing BEFFA_COMPANY=${BEFFA_COMPANY:-sample}"
  exit 0
fi

echo "[INFO] Companies found: $(echo "$COMPANY_NAMES" | wc -l | tr -d ' ')"

YEARS_TO_TRY="${BASE_YEAR} $((BASE_YEAR+1)) $((BASE_YEAR-1)) $((BASE_YEAR+2)) $((BASE_YEAR-2))"
FOUND_COMPANY=""
FOUND_YEAR=""

while IFS= read -r CO; do
  [ -z "$CO" ] && continue
  for YEAR in $YEARS_TO_TRY; do
    QS="year=${YEAR}&period=${PERIOD}&calendar=${CALENDAR}"

    # Probe today's date — a 422 with NO period-error text means the period is open
    # (the ERP returns po_items/account validation errors instead)
    PROBE=$(python3 -c "
import urllib.request, json
req = urllib.request.Request(
  '${BASE}/api/purchase-orders?${QS}',
  data=json.dumps({'po_date':'${TODAY}','purchase_type_id':4,'po_items':[]}).encode(),
  headers={'Authorization':'Bearer ${TOKEN}','Content-Type':'application/json','x-company':'${CO}'},
  method='POST')
try:
  r = urllib.request.urlopen(req, timeout=10)
  print(r.read().decode())
except urllib.error.HTTPError as e:
  print(e.read().decode())
" 2>/dev/null || echo "network_error")

    # Period is open when response has NO period-error AND has ERP validation content
    if ! echo "$PROBE" | grep -qi "not within the current period\|outside the open period\|current period\|network_error"; then
      if echo "$PROBE" | grep -qi "account_payable\|currency_id\|po_items\|purchase_type\|vendor_id"; then
        echo "[OK] Open period found: company=\"${CO}\" year=${YEAR}"
        FOUND_COMPANY="$CO"
        FOUND_YEAR="$YEAR"
        break 2
      fi
    fi
  done
done <<< "$COMPANY_NAMES"

if [ -z "$FOUND_COMPANY" ]; then
  echo "[WARN] No company with an open period found — keeping existing BEFFA_COMPANY=${BEFFA_COMPANY:-sample}"
  exit 0
fi

echo "[RESULT] BEFFA_COMPANY=${FOUND_COMPANY}  BEFFA_YEAR=${FOUND_YEAR}"

if [ -n "${GITHUB_ENV:-}" ]; then
  echo "BEFFA_COMPANY=${FOUND_COMPANY}" >> "$GITHUB_ENV"
  echo "BEFFA_YEAR=${FOUND_YEAR}"       >> "$GITHUB_ENV"
else
  echo "export BEFFA_COMPANY=\"${FOUND_COMPANY}\""
  echo "export BEFFA_YEAR=\"${FOUND_YEAR}\""
fi
