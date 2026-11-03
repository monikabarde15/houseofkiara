with open('hok_admin/src/components/Pages/data/canonicalPageContents.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

old_pat = r"'deposit-policy':\s*\{.*?\n  \},"

new_content = """'deposit-policy': {
    slug: 'deposit-policy',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'five-steps', label: 'Five steps' },
      { id: 'opening', label: 'Opening' },
      { id: 'at-a-glance', label: 'At a glance' },
      { id: 'worked-example', label: 'Worked example' },
      { id: 'sections', label: 'Sections' },
      { id: 'answers', label: 'Answers', count: 61 },
      { id: 'related-policies', label: 'Related policies' },
      { id: 'cant-find-it', label: "Can't find it" }
    ],
    hero: {
      tagline: 'A FULLY REFUNDABLE DEPOSIT',
      headingPrefix: 'Security deposit ',
      headingGoldItalic: 'policy',
      lead: 'Everything you need to know about how your deposit is requested, held, and returned. Written in plain words, with every rule, timeline, and deduction worked out in public.',
      searchPlaceholder: 'Search deposit questions, like "when is it due" or "normal wear"',
      popularQuestions: [
        'When is my deposit due?',
        'When do I get my deposit back?',
        'What counts as normal wear?',
        'How is a deduction worked out?'
      ]
    },
    opening: {
      sideLabel: 'Opening note',
      text: 'Every piece at House of Kaira carries a story, often one its owner holds dear. Your refundable security deposit keeps that story safe for the next person who wears it. It remains yours throughout: when your piece returns on time and as it left us, every rupee is returned to you.'
    }
  },"""

text, count = re.subn(old_pat, new_content, text, count=1, flags=re.DOTALL)
if count > 0:
    with open('hok_admin/src/components/Pages/data/canonicalPageContents.ts', 'w', encoding='utf-8') as f:
        f.write(text)
    print(f'Replaced {count} occurrence')
else:
    print('Pattern not matched')
