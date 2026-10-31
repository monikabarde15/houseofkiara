with open('hok_admin/src/components/Pages/data/canonicalPageContents.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r"['\"]deposit-policy['\"]\s*:\s*\{.*?parts:\s*\[(.*?)\].*?\}", text, re.DOTALL)
if m:
    print('Parts:', m.group(1))
else:
    print('Pattern not matched')
