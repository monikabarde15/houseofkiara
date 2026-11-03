with open('hok_admin/src/components/Pages/components/PageDefaultPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# 1. Add isCare
slug_target = "const isDeposit = page.slug === '/deposit-policy' || page.slug === 'deposit-policy';"
slug_care = "const isDeposit = page.slug === '/deposit-policy' || page.slug === 'deposit-policy';\n  const isCare = page.slug === '/care-policy' || page.slug === 'care-policy' || page.slug === 'care-damage' || page.slug === '/care-damage';"
if slug_target in text and 'isCare' not in text:
    text = text.replace(slug_target, slug_care, 1)

# 2. Add careChecks
checks_target = "const depositChecks: any[] = [];"
checks_care = "const depositChecks: any[] = [];\n  const careChecks: any[] = [];"
if checks_target in text and 'careChecks' not in text:
    text = text.replace(checks_target, checks_care, 1)

# 3. Add careFigures
fig_block = """  const careFigures = [
    { key: 'problem_window', label: 'Tell us about a problem within', value: '24 hours', count: '8×' },
    { key: 'deduction_reply_within', label: 'Time to reply to a deduction', value: '2 business days', count: '3×' },
    { key: 'deduction_notice_within', label: 'Deduction explained within', value: '2 business days', count: '3×' },
    { key: 'support_hours', label: 'Hours we answer', value: '10 AM to 8 PM IST', count: '2×' },
    { key: 'rental_arrival', label: 'A rental arrives', value: '1 day', count: '1×' },
    { key: 'inspect_within', label: 'Returned piece inspected within', value: '24 hours', count: '1×' }
  ];\n\n"""

dep_fig_target = "const figures = isDeposit ? depositFigures :"
if dep_fig_target in text and 'careFigures' not in text:
    text = text.replace(dep_fig_target, fig_block + "const figures = isCare ? careFigures : isDeposit ? depositFigures :")

# 4. checks selector
text = text.replace("const checks = isDeposit ? depositChecks :", "const checks = isCare ? careChecks : isDeposit ? depositChecks :")

# 5. Version
text = text.replace("isDeposit ? 'Version 4' :", "isCare ? 'Version 3' : isDeposit ? 'Version 4' :")

# 6. Last reviewed
text = text.replace("isDeposit ? '6 October 2026' :", "isCare ? '7 October 2026' : isDeposit ? '6 October 2026' :")

# 7. Built from
text = text.replace("isDeposit ? 'hok_deposit_policy_v4' :", "isCare ? 'hok_care_policy_v3' : isDeposit ? 'hok_deposit_policy_v4' :")

# 8. Figures count All X
text = text.replace("All {isDeposit ? 28 :", "All {isCare ? 13 : isDeposit ? 28 :")

with open('hok_admin/src/components/Pages/components/PageDefaultPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated PageDefaultPanel.tsx with Care settings successfully')
