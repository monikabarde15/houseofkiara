with open('src/data/deposit/depositRegistry.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
secs = re.findall(r"id:\s*'([a-z0-9-]+)',\s*number:\s*'(\d\d)',\s*title:\s*'([^']+)',\s*italicWord:\s*'([^']+)',\s*barLabel:\s*'([^']+)',\s*description:\s*'([^']+)'", text)
print(f"Total sections in storefront: {len(secs)}")
for s in secs:
    print(s)
