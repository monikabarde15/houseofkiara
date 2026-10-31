with open('hok_admin/src/components/Pages/components/PageLevelTwoHeader.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'isRefunds' in line or 'refund' in line.lower() or 'reviewed' in line.lower():
        print(f"--- Line {i+1} ---")
        for j in range(max(0, i-2), min(len(lines), i+6)):
            print(f"{j+1}: {lines[j].rstrip()}")
