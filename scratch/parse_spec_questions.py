import re
import json

with open('scratch/spec_copy_deck.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

current_sec = None
current_side = 'pay'
questions = []
q = None

for line in lines:
    line = line.strip()
    if not line:
        continue
    
    # check for section change
    sec_match = re.search(r'(\d\d)\s+([A-Za-z &]+)\s+italic:\s*([^\xa0\n\?]+)[\xa0\?\s]+bar label:\s*([^\xa0\n\?]+)[\xa0\?\s]+id:\s*([a-z0-9-]+)', line)
    if sec_match:
        sec_num, sec_title, sec_italic, sec_bar, sec_id = sec_match.groups()
        if sec_id == 's-share':
            current_side = 'earn'
        current_sec = {
            'num': sec_num.strip(),
            'title': sec_title.strip(),
            'italic': sec_italic.strip(),
            'bar': sec_bar.strip(),
            'id': sec_id.strip(),
            'side': current_side
        }
        continue
    
    # check for question id
    parts = line.split(maxsplit=1)
    if len(parts) == 2 and any(parts[0].startswith(x) for x in ['r-', 'p-', 'd-', 'c-', 'x-', 'k-', 'l-', 'y-', 'e-']):
        if q:
            questions.append(q)
        q = {
            'id': parts[0],
            'question': parts[1],
            'section': current_sec,
            'side': current_side,
            'tag': None,
            'text': [],
            'keywords': []
        }
        continue
    
    if q:
        if line.startswith('Tag:'):
            q['tag'] = line[4:].strip()
        elif line.startswith('Search keywords:'):
            q['keywords'] = line[16:].strip()
        elif not line.startswith('--- PAGE') and not 'House of Kaira' in line:
            q['text'].append(line)

if q:
    questions.append(q)

print(f"Parsed {len(questions)} questions.")
with open('scratch/parsed_questions.json', 'w', encoding='utf-8') as out:
    json.dump(questions, out, indent=2)

for i, qu in enumerate(questions):
    print(f"{i+1}. [{qu['id']}] ({qu['side']} / {qu['section']['id'] if qu['section'] else 'NONE'}): {qu['question']}")
