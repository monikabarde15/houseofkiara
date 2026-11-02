with open('hok_admin/src/components/Pages/data/canonicalPageContents.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("someone's", "someone\\'s")
text = text.replace("else's", "else\\'s")

with open('hok_admin/src/components/Pages/data/canonicalPageContents.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed apostrophes in canonicalPageContents.ts')
