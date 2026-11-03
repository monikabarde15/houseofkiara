with open('hok_admin/src/components/Pages/components/PageDefaultPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = """          ))}
        </div>
      </div>

      {/* 5. Section: Figures on this page (Spec §7.7, §8.6, Screen 44) */}"""

replace = """          ))}
        </div>
        )}
      </div>

      {/* 5. Section: Figures on this page (Spec §7.7, §8.6, Screen 44) */}"""

if target in text:
    text = text.replace(target, replace, 1)
    with open('hok_admin/src/components/Pages/components/PageDefaultPanel.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Fixed ternary closing in PageDefaultPanel.tsx')
else:
    print('Target not found')
