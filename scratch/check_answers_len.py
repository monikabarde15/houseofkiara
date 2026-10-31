with open('hok_admin/src/components/Pages/data/depositAnswers.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", text)
print('Total questions in depositAnswers.ts:', len(matches))
