with open('hok_admin/src/components/Pages/components/PageDefaultPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# 1. Add isDeposit
slug_target = "const isRefunds = page.slug === '/refunds' || page.slug === 'refunds';"
slug_replace = "const isRefunds = page.slug === '/refunds' || page.slug === 'refunds';\n  const isDeposit = page.slug === '/deposit-policy' || page.slug === 'deposit-policy';"
if slug_target in text and 'isDeposit' not in text:
    text = text.replace(slug_target, slug_replace, 1)

# 2. Add depositFigures and depositChecks
fig_target = "const figures = isFaq ? faqFigures"
fig_insert = """  const depositChecks: any[] = [];

  const depositFigures = [
    { key: 'deposit_refund_window', label: 'Deposit returned within', value: '3 to 5 business days', count: '14×' },
    { key: 'gst_rate', label: 'GST on a rental', value: '18%', count: '4×' },
    { key: 'inspect_within', label: 'Returned piece inspected within', value: '24 hours', count: '4×' },
    { key: 'deposit_due_before', label: 'Deposit due', value: '10 days', count: '4×' },
    { key: 'deposit_receipt_within', label: 'Deposit receipt confirmed within', value: '48 hours', count: '3×' },
    { key: 'deduction_reply_within', label: 'Time to reply to a deduction', value: '2 business days', count: '3×' }
  ];\n\n"""
if 'depositFigures' not in text:
    text = text.replace(fig_target, fig_insert + fig_target, 1)

# 3. Update checks selector
text = re.sub(r'const checks = (isFaq\s*\?)', r'const checks = isDeposit ? depositChecks : \1', text)

# 4. Update figures selector
text = re.sub(r'const figures = (isFaq\s*\?)', r'const figures = isDeposit ? depositFigures : \1', text)

# 5. Version
text = re.sub(r"isTerms \? 'Version 1\.0' :", "isDeposit ? 'Version 4' : isTerms ? 'Version 1.0' :", text)

# 6. Last reviewed
text = re.sub(r"isTerms \? '26 September 2026' :", "isDeposit ? '6 October 2026' : isTerms ? '26 September 2026' :", text)

# 7. Built from
text = re.sub(r"isAbout \? 'hok_about_us' :", "isDeposit ? 'hok_deposit_policy_v4' : isAbout ? 'hok_about_us' :", text)

# 8. All X for figures
text = re.sub(r"All \{isFaq \? 29 :", "All {isDeposit ? 28 : isFaq ? 29 :", text)

# 9. All X button for checks: hide if checks.length === 0
# Replace To look at section checks rendering if checks.length === 0
to_look_at_old = """          {onOpenChecks && (
            <button
              type="button"
              onClick={onOpenChecks}
              className="text-[#8a6a36] hover:underline cursor-pointer"
            >
              All {isFaq ? 14 : isContact ? 2 : isAbout ? 9 : isHowItWorks ? 31 : isListYourPiece ? 30 : isTerms ? 9 : (page.checksCount || checks.length)}
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {checks.map(check => ("""

to_look_at_new = """          {onOpenChecks && checks.length > 0 && (
            <button
              type="button"
              onClick={onOpenChecks}
              className="text-[#8a6a36] hover:underline cursor-pointer"
            >
              All {isFaq ? 14 : isContact ? 2 : isAbout ? 9 : isHowItWorks ? 31 : isListYourPiece ? 30 : isTerms ? 9 : (page.checksCount || checks.length)}
            </button>
          )}
        </div>

        {checks.length === 0 ? (
          <p className="text-xs text-[#8a7f73]">
            Nothing to look at on this page.
          </p>
        ) : (
          <div className="space-y-2.5">
            {checks.map(check => ("""

if to_look_at_old in text:
    text = text.replace(to_look_at_old, to_look_at_new, 1)
    # Also find closing </div> after checks.map
    # replace the closing </div> of checks with </div>)}
    text = re.sub(r'(\s+\)\)}\s+</div>)(\s+/\* 5\. Section: Figures)', r'\1\n        )}\2', text, count=1)

with open('hok_admin/src/components/Pages/components/PageDefaultPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('PageDefaultPanel updated successfully')
