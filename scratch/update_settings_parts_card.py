with open('hok_admin/src/components/Pages/components/PageSettingsPartsCard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add import
imp_target = "import { RefundsPageSettingsCard } from './refunds/RefundsPageSettingsCard';"
imp_replace = "import { RefundsPageSettingsCard } from './refunds/RefundsPageSettingsCard';\nimport { DepositPageSettingsCard } from './deposit/DepositPageSettingsCard';"
if imp_target in text and 'DepositPageSettingsCard' not in text:
    text = text.replace(imp_target, imp_replace, 1)

# 2. Add isDeposit condition
deposit_block = """  const isDeposit = page.slug === '/deposit-policy' || page.slug === 'deposit-policy';

  if (isDeposit) {
    return (
      <DepositPageSettingsCard
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        onOpenAnswersView={() => onJumpToPart('answers')}
      />
    );
  }

  const isRefunds = page.slug === '/refunds' || page.slug === 'refunds';"""

ref_target = "  const isRefunds = page.slug === '/refunds' || page.slug === 'refunds';"
if ref_target in text and 'isDeposit' not in text:
    text = text.replace(ref_target, deposit_block, 1)

with open('hok_admin/src/components/Pages/components/PageSettingsPartsCard.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('PageSettingsPartsCard updated successfully')
