import os
import re

dir_path = 'hok_admin/src/components/Pages/components/deposit'
bad_dashes = []

for root, _, files in os.walk(dir_path):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                lines = file.readlines()
            for idx, line in enumerate(lines):
                # Ignore comment lines and imports/props
                stripped = line.strip()
                if stripped.startswith('//') or stripped.startswith('/*') or stripped.startswith('*'):
                    continue
                # Check for em-dash, en-dash, or spaced hyphen in JSX string or text
                if '—' in line or '–' in line or ' - ' in line:
                    bad_dashes.append((f, idx + 1, stripped))

print(f"Total potential dash issues found: {len(bad_dashes)}")
for f, l, s in bad_dashes:
    print(f"{f}:{l} -> {s}")
