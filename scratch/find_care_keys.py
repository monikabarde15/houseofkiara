with open('hok_admin/src/components/Pages/data/canonicalPageContents.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r"['\"]([^'\"]*care[^'\"]*)['\"]\s*:", text)
print('Care keys:', matches)
