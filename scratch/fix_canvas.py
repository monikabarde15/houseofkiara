with open('hok_admin/src/components/Pages/components/PagePaperCanvas.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = "hiddenParts={hiddenParts}\n          /> : isDeposit ? ("
replace = "hiddenParts={hiddenParts}\n          />\n        ) : isDeposit ? ("

if target in text:
    text = text.replace(target, replace, 1)
    with open('hok_admin/src/components/Pages/components/PagePaperCanvas.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Fixed syntax in PagePaperCanvas.tsx')
else:
    print('Target not found')
