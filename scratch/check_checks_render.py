with open('hok_admin/src/components/Pages/components/PageDefaultPanel.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('scratch/panel_lines.txt', 'w', encoding='utf-8') as out:
    for i in range(240, 310):
        if i < len(lines):
            out.write(f"{i+1}: {lines[i]}")
