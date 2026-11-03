with open('hok_admin/src/components/Pages/components/PagePaperView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('scratch/word_editor_usage.txt', 'w', encoding='utf-8') as out:
    for i, line in enumerate(lines):
        if 'WordEditorPanel' in line:
            for j in range(max(0, i-5), min(len(lines), i+25)):
                out.write(f"{j+1}: {lines[j]}")
            break
