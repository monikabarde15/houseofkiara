with open('hok_admin/src/components/Pages/data/canonicalPageContents.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

care_canonical = """  'care-policy': {
    slug: 'care-policy',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'if-something-happens', label: 'If something happens' },
      { id: 'our-one-request', label: 'Our one request' },
      { id: 'moment-by-moment', label: 'Moment by moment' },
      { id: 'wear-or-damage', label: 'Wear or damage' },
      { id: 'piece-by-piece', label: 'Piece by piece' },
      { id: 'our-care', label: 'Our care' },
      { id: 'restoring', label: 'Restoring' },
      { id: 'pieces-you-own', label: 'Pieces you own' },
      { id: 'answers', label: 'Answers', count: 57 },
      { id: 'related-policies', label: 'Related policies' },
      { id: 'cant-find-it', label: "Can't find it" }
    ],
    hero: {
      tagline: 'OUR PROMISE TO EVERY PIECE',
      headingPrefix: 'Care, cleaning & ',
      headingGoldItalic: 'damage',
      lead: 'How we look after every piece, how you can too, and what happens in the rare moment something goes wrong, explained simply and fairly.',
      searchPlaceholder: 'Search care rules, like "dry cleaning" or "hem dust"',
      popularQuestions: [
        'How do you decide which it is?',
        'Can I use safety pins or fashion tape?',
        'Can I steam or iron out a crease?',
        'I spilled something on it'
      ]
    },
    opening: {
      sideLabel: 'Our one request',
      text: 'We ask one thing of everyone who rents with us: treat the piece as your own. It was part of someone\'s most special day, and it will be part of someone else\'s next. The cleaning is always ours, and so are the gentle signs of a wonderful evening.'
    }
  },"""

# Replace 'care-damage': { ... } with 'care-policy' and 'care-damage'
old_pat = r"'care-damage':\s*\{.*?\n  \},"
text, count = re.subn(old_pat, care_canonical + "\n  'care-damage': " + care_canonical.strip().replace("'care-policy':", ""), text, count=1, flags=re.DOTALL)

with open('hok_admin/src/components/Pages/data/canonicalPageContents.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated canonicalPageContents.ts with care-policy, count:', count)
