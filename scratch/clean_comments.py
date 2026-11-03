import os

dir_path = 'hok_admin/src/components/Pages/components/deposit'
for root, _, files in os.walk(dir_path):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                text = file.read()
            text = text.replace('— ADMIN PANEL —', '· ADMIN PANEL ·')
            text = text.replace('Admin panel v217 —', 'Admin panel v217 ·')
            with open(path, 'w', encoding='utf-8') as file:
                file.write(text)

print('Cleaned header comments in deposit files')
