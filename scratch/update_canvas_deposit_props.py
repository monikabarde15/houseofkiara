with open('hok_admin/src/components/Pages/components/PagePaperCanvas.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = """        ) : isDeposit ? (
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

replace = """        ) : isDeposit ? (
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

if target in text:
    text = text.replace(target, replace, 1)
    with open('hok_admin/src/components/Pages/components/PagePaperCanvas.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated DepositPaperSection props in PagePaperCanvas.tsx')
else:
    print('Target block not matched')
