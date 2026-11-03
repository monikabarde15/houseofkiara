with open('hok_admin/src/components/Pages/components/PageDefaultPanel.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'isRefunds' in line:
        print(f"--- Line {i+1} ---")
        for j in range(max(0, i-3), min(len(lines), i+8)):
            print(f"{j+1}: {lines[j].rstrip()}")
