with open('hok_admin/src/components/Pages/components/PageSettingsPartsCard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add import
imp_target = "import { DepositPageSettingsCard } from './deposit/DepositPageSettingsCard';"
imp_care = "import { DepositPageSettingsCard } from './deposit/DepositPageSettingsCard';\nimport { CarePageSettingsCard } from './care/CarePageSettingsCard';"
if imp_target in text and 'CarePageSettingsCard' not in text:
    text = text.replace(imp_target, imp_care, 1)

# 2. Add isCare block
care_block = """  const isCare = page.slug === '/care-policy' || page.slug === 'care-policy' || page.slug === 'care-damage' || page.slug === '/care-damage';

  if (isCare) {
    return (
      <CarePageSettingsCard
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        onOpenAnswersView={() => onJumpToPart('answers')}
      />
    );
  }

  const isDeposit = page.slug === '/deposit-policy' || page.slug === 'deposit-policy';"""

dep_target = "  const isDeposit = page.slug === '/deposit-policy' || page.slug === 'deposit-policy';"
if dep_target in text and 'isCare' not in text:
    text = text.replace(dep_target, care_block, 1)

with open('hok_admin/src/components/Pages/components/PageSettingsPartsCard.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated PageSettingsPartsCard.tsx with Care successfully')
