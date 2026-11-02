with open('src/data/care/careRegistry.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
import json

m = re.search(r'export const ALL_QUESTIONS\s*=\s*(\[.*?\]);\s*$', text, re.DOTALL)
if not m:
    # Try finding up to the end of ALL_QUESTIONS array
    start = text.find('export const ALL_QUESTIONS = [')
    if start != -1:
        end = text.rfind('];')
        content = text[start + len('export const ALL_QUESTIONS = '):end + 1]
        with open('scratch/care_questions_raw.js', 'w', encoding='utf-8') as out:
            out.write(content)
        print('Wrote scratch/care_questions_raw.js')
    else:
        print('Could not find ALL_QUESTIONS')
else:
    with open('scratch/care_questions_raw.js', 'w', encoding='utf-8') as out:
        out.write(m.group(1))
    print('Wrote scratch/care_questions_raw.js via regex')
