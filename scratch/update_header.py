with open('hok_admin/src/components/Pages/components/PageLevelTwoHeader.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add isDeposit declaration
slug_target = "const isRefunds = page.slug === '/refunds' || page.slug === 'refunds';"
slug_replace = "const isRefunds = page.slug === '/refunds' || page.slug === 'refunds';\n  const isDeposit = page.slug === '/deposit-policy' || page.slug === 'deposit-policy';"
if slug_target in text and 'isDeposit' not in text:
    text = text.replace(slug_target, slug_replace, 1)

# 2. Add version string for isDeposit
ver_target = """          ) : isRefunds ? (
            <span className="text-xs text-[#73675a]">
              Version 7, reviewed 23 September 2026
            </span>"""
ver_replace = """          ) : isDeposit ? (
            <span className="text-xs text-[#73675a]">
              Version 4, reviewed 6 October 2026
            </span>
          ) : isRefunds ? (
            <span className="text-xs text-[#73675a]">
              Version 7, reviewed 23 September 2026
            </span>"""
if ver_target in text and 'isDeposit ?' not in text:
    text = text.replace(ver_target, ver_replace, 1)

with open('hok_admin/src/components/Pages/components/PageLevelTwoHeader.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('PageLevelTwoHeader updated successfully')
