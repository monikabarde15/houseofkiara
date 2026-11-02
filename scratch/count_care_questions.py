with open('src/data/care/careRegistry.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'id:\s*"([a-z0-9-]+)",\s*section:', text)
print(f"Total questions in ALL_QUESTIONS: {len(matches)}")
print("Sample IDs:", matches[:10])

# Count by sectionName
secs = re.findall(r'sectionName:\s*"([^"]+)"', text)
from collections import Counter
counts = Counter(secs)
print("Questions by sectionName:")
for s, c in counts.items():
    print(f"  {s}: {c}")
