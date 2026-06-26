#!/usr/bin/env bash
set -euo pipefail

mkdir -p .codex/spec-audit

echo "== Specs present ==" | tee .codex/spec-audit/00-specs.txt
find docs -maxdepth 1 -type f -name '*.md' -print | sort | tee -a .codex/spec-audit/00-specs.txt

echo "== Screen headings ==" | tee .codex/spec-audit/01-screen-headings.txt
python3 - <<'PY' | tee -a .codex/spec-audit/01-screen-headings.txt
from pathlib import Path
import re

for name in ['screen-spec.md', 'screen-spec-member-portal.md']:
    p = Path('docs') / name
    if not p.exists():
        continue
    print(f'\n# {p}')
    for i, line in enumerate(p.read_text(errors='replace').splitlines(), 1):
        if re.match(r'^(#{1,3})\s+(S|MP)\d{2,3}\s+—', line):
            print(f'{i}: {line}')
PY

echo "== Source files ==" | tee .codex/spec-audit/02-source-files.txt
find sfpcl-lms/src -type f | sort | tee -a .codex/spec-audit/02-source-files.txt

echo "== Screen ID references in source ==" | tee .codex/spec-audit/03-screen-id-source-refs.txt
rg --sort path -n "\b(S[0-9]{2,3}|MP[0-9]{2,3})\b|Sanction|Documentation|Disbursement|Repayment|NOC|KYC|Appraisal|Borrower|Member|Compliance|Audit" sfpcl-lms/src \
  | tee -a .codex/spec-audit/03-screen-id-source-refs.txt || true

echo "== Existing component/style primitives ==" | tee .codex/spec-audit/04-components-styles.txt
find sfpcl-lms/src -type f \( -iname '*component*' -o -path '*components*' -o -iname '*.css' -o -iname '*.tsx' \) | sort \
  | tee -a .codex/spec-audit/04-components-styles.txt

echo "== Package checks ==" | tee .codex/spec-audit/05-checks.txt
(cd sfpcl-lms && npm run build) 2>&1 \
  | sed -E 's/✓ built in [0-9.]+s/✓ built in <duration>/' \
  | tee -a .codex/spec-audit/05-checks.txt
