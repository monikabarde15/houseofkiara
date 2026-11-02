with open('hok_admin/src/components/Pages/data/canonicalPageContents.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r"['\"]care-policy['\"]\s*:\s*\{.*?\n  \},", text, re.DOTALL)
if m:
    with open('scratch/care_entry.txt', 'w', encoding='utf-8') as out:
        out.write(m.group(0))
    print('Wrote care-policy to scratch/care_entry.txt')
else:
    print('Pattern not matched')
