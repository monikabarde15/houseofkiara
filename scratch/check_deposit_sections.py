with open('hok_admin/src/components/Pages/data/depositRegistry.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r"title:\s*['\"]([^'\"]+)['\"],\s*italicWord:\s*['\"]([^'\"]+)['\"]", text)
print(f"Found {len(matches)} sections with title and italicWord:")
for t, w in matches:
    print(f"  {t} -> italic: '{w}'")
