with open('src/data/care/careRegistry.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find sections and questions
print("=== Popular links ===")
m_pop = re.findall(r'CARE_POPULAR_LINKS\s*=\s*\[(.*?)\];', text, re.DOTALL)
if m_pop:
    print(m_pop[0].strip())

print("\n=== All Questions summary ===")
q_matches = re.findall(r"id:\s*'([a-z0-9-]+)',\s*question:\s*'([^']+)'", text)
print(f"Total questions: {len(q_matches)}")
for qid, qtext in q_matches[:10]:
    print(f"  {qid}: {qtext}")
