with open('hok_admin/src/components/Pages/components/PageLevelTwoHeader.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('scratch/header_row3.txt', 'w', encoding='utf-8') as out:
    for i in range(180, 270):
        if i < len(lines):
            out.write(f"{i+1}: {lines[i]}")
