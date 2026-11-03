with open('src/data/care/careRegistry.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Let's inspect exports
for name in ['WEAR_VS_DAMAGE_DATA', 'PIECE_BY_PIECE_DATA', 'OUR_CARE_DATA', 'PIECES_YOU_OWN_DATA']:
    m = re.search(rf'export const {name}\s*=\s*(.*?);\n\nexport const', text, re.DOTALL)
    if m:
        with open(f'scratch/{name}.txt', 'w', encoding='utf-8') as out:
            out.write(m.group(1))
        print(f'Wrote scratch/{name}.txt')
    else:
        print(f'Could not match {name}')
