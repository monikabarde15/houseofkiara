with open('scratch/moment_tabs.json', 'r', encoding='utf-8') as f:
    text = f.read()

import re
tabs = re.findall(r'id:\s*"([^"]+)",\s*num:\s*(\d),\s*title:\s*"([^"]+)"', text)
for tid, num, title in tabs:
    print(f'{num}: {title} ({tid})')
