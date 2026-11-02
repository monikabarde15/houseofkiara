with open('src/data/care/careRegistry.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
exports = re.findall(r'export const (\w+)', text)
print('Exports in careRegistry.js:', exports)
