with open('src/data/care/careRegistry.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'export const ALL_QUESTIONS\s*=\s*(.*?);', text, re.DOTALL)
if m:
    print('ALL_QUESTIONS definition:')
    print(m.group(0)[:1500])
