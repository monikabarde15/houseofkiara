with open('hok_admin/src/components/Pages/components/PageDefaultPanel.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('scratch/panel_err.txt', 'w', encoding='utf-8') as out:
    for i in range(260, 325):
        if i < len(lines):
            out.write(f"{i+1}: {lines[i]}")
