with open('hok_admin/src/components/Pages/data/pageAnswersRegistry.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('scratch/answers_reg_care.txt', 'w', encoding='utf-8') as out:
    for i in range(15, 60):
        out.write(f"{i+1}: {lines[i]}")
