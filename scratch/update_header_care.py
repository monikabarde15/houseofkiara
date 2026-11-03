with open('hok_admin/src/components/Pages/components/PageLevelTwoHeader.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add isCare
slug_target = "const isDeposit = page.slug === '/deposit-policy' || page.slug === 'deposit-policy';"
slug_care = "const isDeposit = page.slug === '/deposit-policy' || page.slug === 'deposit-policy';\n  const isCare = page.slug === '/care-policy' || page.slug === 'care-policy' || page.slug === 'care-damage' || page.slug === '/care-damage';"
if slug_target in text and 'isCare' not in text:
    text = text.replace(slug_target, slug_care, 1)

# 2. Add version string for isCare
ver_target = """          ) : isDeposit ? (
            <span className="text-xs text-[#73675a]">
              Version 4, reviewed 6 October 2026
            </span>"""
ver_care = """          ) : isCare ? (
            <span className="text-xs text-[#73675a]">
              Version 3, reviewed 7 October 2026
            </span>
          ) : isDeposit ? (
            <span className="text-xs text-[#73675a]">
              Version 4, reviewed 6 October 2026
            </span>"""
if ver_target in text and 'isCare ?' not in text:
    text = text.replace(ver_target, ver_care, 1)

with open('hok_admin/src/components/Pages/components/PageLevelTwoHeader.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated PageLevelTwoHeader.tsx with Care successfully')
