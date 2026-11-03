with open('hok_admin/src/components/Pages/components/PagePaperCanvas.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# 1. Add import
imp_target = "import { DepositPaperSection } from './deposit/DepositPaperSection';"
imp_replace = "import { DepositPaperSection } from './deposit/DepositPaperSection';\nimport { CarePaperSection } from './care/CarePaperSection';"
if imp_target in text and 'CarePaperSection' not in text:
    text = text.replace(imp_target, imp_replace, 1)

# 2. Add isCare
care_decl = """  const isCare =
    page.slug === 'care-policy' ||
    page.slug === '/care-policy' ||
    page.slug === 'care-damage' ||
    page.slug === '/care-damage';"""

slug_target = """  const isDeposit =
    page.slug === 'deposit-policy' ||
    page.slug === '/deposit-policy';"""

if slug_target in text and 'isCare' not in text:
    text = text.replace(slug_target, slug_target + "\n\n" + care_decl, 1)

# 3. Mount CarePaperSection in paper view
mount_target = """        ) : isDeposit ? (
          /* Deposit Policy Paper View (Spec § 8.13, Screen 51) */
          <DepositPaperSection
            page={page}
            activePartId={activePartId}
            onSelectPart={onSelectPart}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onOpenAnswersView={onOpenAnswersView}
            onSelectFigure={onSelectFigure}
            onNavigateToPage={onSelectPage}
            hiddenParts={hiddenParts}
          />"""

mount_replace = """        ) : isDeposit ? (
          /* Deposit Policy Paper View (Spec § 8.13, Screen 51) */
          <DepositPaperSection
            page={page}
            activePartId={activePartId}
            onSelectPart={onSelectPart}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onOpenAnswersView={onOpenAnswersView}
            onSelectFigure={onSelectFigure}
            onNavigateToPage={onSelectPage}
            hiddenParts={hiddenParts}
          />
        ) : isCare ? (
          /* Care, Cleaning & Damage Policy Paper View (Spec § 8.14, Screen 52) */
          <CarePaperSection
            page={page}
            activePartId={activePartId}
            onSelectPart={onSelectPart}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onOpenAnswersView={onOpenAnswersView}
            onSelectFigure={onSelectFigure}
            onNavigateToPage={onSelectPage}
            hiddenParts={hiddenParts}
          />"""

if mount_target in text and 'CarePaperSection' in text:
    text = text.replace(mount_target, mount_replace, 1)

with open('hok_admin/src/components/Pages/components/PagePaperCanvas.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated PagePaperCanvas.tsx with CarePaperSection successfully')
