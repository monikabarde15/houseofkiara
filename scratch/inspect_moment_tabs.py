with open('src/data/care/careRegistry.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'export const MOMENT_TABS\s*=\s*(\[.*?\]);', text, re.DOTALL)
if m:
    with open('scratch/moment_tabs.json', 'w', encoding='utf-8') as out:
        out.write(m.group(1))
    print('Wrote MOMENT_TABS to scratch/moment_tabs.json')
else:
    print('MOMENT_TABS not found')
