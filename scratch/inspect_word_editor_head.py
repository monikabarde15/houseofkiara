with open('hok_admin/src/components/Pages/components/WordEditorPanel.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(0, min(len(lines), 60)):
    print(f"{i+1}: {lines[i].rstrip()}")
