import re
import json

with open('scratch/care_questions_raw.js', 'r', encoding='utf-8') as f:
    raw = f.read()

# Let's extract each question block
# Blocks look like { ... }
# We can use node or regex to parse JSON-like objects
# Let's write a small node script to load scratch/care_questions_raw.js and export json
