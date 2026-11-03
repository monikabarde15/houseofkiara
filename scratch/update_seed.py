with open('hok_admin/src/components/Pages/data/seedPages.ts', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

import re

old_pat = r"id:\s*'page_deposit_policy'.*?statusBadge:\s*'Live'"
new_content = """id: 'page_deposit_policy',
    slug: '/deposit-policy',
    title: 'Deposit Policy',
    group: 'policies',
    builtFrom: 'hok_deposit_policy_v4',
    summary: 'The deposit from request to refund, with a worked example a customer can switch between.',
    health: 'clean',
    version: 'Version 4',
    lastPublished: '6 October 2026',
    lastEditor: 'Soumya A.',
    wordsCount: 3890,
    figuresCount: 28,
    checksCount: 0,
    highChecksCount: 0,
    mediumChecksCount: 0,
    lowChecksCount: 0,
    isBuilt: true,
    hasScheduled: false,
    datesLine: 'Version 4, reviewed 6 October 2026',
    countsLine: 'The deposit from request to refund, prints 28 figures',
    healthLine: 'Nothing to look at',
    statusBadge: 'Live'"""

text, count = re.subn(old_pat, new_content, text, count=1, flags=re.DOTALL)
if count > 0:
    with open('hok_admin/src/components/Pages/data/seedPages.ts', 'w', encoding='utf-8') as f:
        f.write(text)
    print(f'Replaced {count} occurrence')
else:
    print('Pattern not found')
