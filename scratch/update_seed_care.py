with open('hok_admin/src/components/Pages/data/seedPages.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

old_pat = r"id:\s*'page_care_policy'.*?statusBadge:\s*'Live'"
new_content = """id: 'page_care_policy',
    slug: '/care-policy',
    title: 'Care, Cleaning & Damage Policy',
    group: 'policies',
    builtFrom: 'hok_care_policy_v3',
    summary: 'The care journey from arrival to return, and the one test that decides normal wear from damage. Eleven answers are shared word for word with the Deposit Policy.',
    health: 'clean',
    version: 'Version 3',
    lastPublished: '7 October 2026',
    lastEditor: 'Soumya A.',
    wordsCount: 3450,
    figuresCount: 13,
    checksCount: 0,
    highChecksCount: 0,
    mediumChecksCount: 0,
    lowChecksCount: 0,
    isBuilt: true,
    hasScheduled: false,
    datesLine: 'Version 3, reviewed 7 October 2026',
    countsLine: 'The care journey from arrival to return, prints 13 figures',
    healthLine: 'Nothing to look at',
    statusBadge: 'Live'"""

text, count = re.subn(old_pat, new_content, text, count=1, flags=re.DOTALL)
if count > 0:
    with open('hok_admin/src/components/Pages/data/seedPages.ts', 'w', encoding='utf-8') as f:
        f.write(text)
    print(f'Updated seedPages.ts ({count} occurrence)')
else:
    print('Pattern not matched in seedPages.ts')
