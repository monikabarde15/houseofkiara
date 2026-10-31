with open('hok_admin/src/components/Pages/data/depositRegistry.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
questions = re.findall(r"id:\s*'[a-z0-9-]+',\s*question:", text)
print('Total questions in depositRegistry.ts:', len(questions))
