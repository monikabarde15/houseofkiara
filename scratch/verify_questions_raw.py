with open('scratch/care_questions_raw.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
qids = re.findall(r'id:\s*"([^"]+)"', text)
print(f"Total question ids: {len(qids)}")

# Check sharedWithDeposit
shared = re.findall(r'sharedWithDeposit:\s*true', text)
print(f"Total sharedWithDeposit: {len(shared)}")
