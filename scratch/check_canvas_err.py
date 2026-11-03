with open('hok_admin/src/components/Pages/components/PagePaperCanvas.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('scratch/canvas_err.txt', 'w', encoding='utf-8') as out:
    for i in range(310, 345):
        if i < len(lines):
            out.write(f"{i+1}: {lines[i]}")
