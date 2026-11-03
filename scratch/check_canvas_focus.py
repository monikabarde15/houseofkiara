with open('hok_admin/src/components/Pages/components/PagePaperCanvas.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('scratch/canvas_focus.txt', 'w', encoding='utf-8') as out:
    for i, line in enumerate(lines):
        if 'onFocusField' in line or 'focusedField' in line:
            out.write(f"{i+1}: {line}")
