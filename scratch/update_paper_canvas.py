with open('hok_admin/src/components/Pages/components/PagePaperCanvas.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# 1. Add import
imp_target = "import { RefundsPaperSection } from './refunds/RefundsPaperSection';"
imp_replace = "import { RefundsPaperSection } from './refunds/RefundsPaperSection';\nimport { DepositPaperSection } from './deposit/DepositPaperSection';"
if imp_target in text and 'DepositPaperSection' not in text:
    text = text.replace(imp_target, imp_replace, 1)

# 2. Add isDeposit condition
slug_target = """  const isRefunds =
    page.slug === 'refunds' ||
    page.slug === '/refunds';"""
slug_replace = """  const isRefunds =
    page.slug === 'refunds' ||
    page.slug === '/refunds';

  const isDeposit =
    page.slug === 'deposit-policy' ||
    page.slug === '/deposit-policy';"""
if slug_target in text and 'isDeposit' not in text:
    text = text.replace(slug_target, slug_replace, 1)

# 3. Add DepositPaperSection component render
render_target = """        ) : isRefunds ? (
          /* Refund & Cancellation Policy Paper View (Spec \ufffd8.12, Screen 49/58) */
          <RefundsPaperSection
            page={page}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onOpenAnswersView={onOpenAnswersView}
            onSelectFigure={onSelectFigure}
            onNavigateToPage={onSelectPage}
            hiddenParts={hiddenParts}
          />"""

# fallback regex for render target
render_pat = r"(\)\s*:\s*isRefunds\s*\?\s*\(\s*/\*.*?\*/\s*<RefundsPaperSection.*?/>)"
render_add = r"""\1 : isDeposit ? (
          /* Deposit Policy Paper View (Spec § 8.13, Screen 51) */
          <DepositPaperSection
            page={page}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onOpenAnswersView={onOpenAnswersView}
            onSelectFigure={onSelectFigure}
            onNavigateToPage={onSelectPage}
            hiddenParts={hiddenParts}
          />"""

text, count = re.subn(render_pat, render_add, text, count=1, flags=re.DOTALL)
print('Render replacement count:', count)

with open('hok_admin/src/components/Pages/components/PagePaperCanvas.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('PagePaperCanvas updated successfully')
