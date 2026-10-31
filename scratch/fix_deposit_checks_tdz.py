with open('hok_admin/src/components/Pages/components/PageDefaultPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove depositChecks from line 186
target_remove = "    const depositChecks: any[] = [];\n\n"
if target_remove in text:
    text = text.replace(target_remove, "")
else:
    # Try alternative spacing
    import re
    text = re.sub(r'\s*const depositChecks:\s*any\[\]\s*=\s*\[\];\s*', '\n\n', text)

# 2. Insert depositChecks right above const checks =
target_checks = "  const checks = isDeposit ? depositChecks :"
insert_checks = "  const depositChecks: any[] = [];\n\n  const checks = isDeposit ? depositChecks :"

if target_checks in text:
    text = text.replace(target_checks, insert_checks, 1)
    with open('hok_admin/src/components/Pages/components/PageDefaultPanel.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Moved depositChecks before initialization successfully')
else:
    print('Target checks not found')
