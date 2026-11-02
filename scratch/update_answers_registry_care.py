with open('hok_admin/src/components/Pages/data/pageAnswersRegistry.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "const CARE_ANSWERS: AnswerItem[] = [" in line:
        skip = True
        continue
    if skip:
        if line.strip() == "];":
            skip = False
            continue
        continue
    new_lines.append(line)

text = "".join(new_lines)
if "import { CARE_ANSWERS } from './careAnswers';" not in text:
    text = text.replace("import { DEPOSIT_ANSWERS } from './depositAnswers';", "import { DEPOSIT_ANSWERS } from './depositAnswers';\nimport { CARE_ANSWERS } from './careAnswers';")

with open('hok_admin/src/components/Pages/data/pageAnswersRegistry.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print('Cleanly replaced placeholder CARE_ANSWERS with import')
