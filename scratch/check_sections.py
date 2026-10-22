import re
import json

with open('scratch/parsed_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Loaded {len(questions)} parsed questions.")

# Group questions by section
sections_map = {}
for q in questions:
    sec = q['section']
    sec_id = sec['id']
    if sec_id not in sections_map:
        sections_map[sec_id] = {
            'id': sec_id,
            'side': sec['side'],
            'number': sec['num'],
            'title': sec['title'],
            'italic': sec['italic'],
            'barLabel': sec['bar'],
            'questions': []
        }
    sections_map[sec_id]['questions'].append(q)

print(f"Total sections: {len(sections_map)}")
for s_id, s_data in sections_map.items():
    print(f"  [{s_id}] ({s_data['side']}): {len(s_data['questions'])} questions")
