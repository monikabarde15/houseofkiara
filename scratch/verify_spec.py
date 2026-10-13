import re
import os
import pypdf

# 1. Read spec
spec_pdf_path = r"C:\Users\MOHAN SHARMA\.gemini\antigravity\brain\9b80c376-4895-42ce-b372-542a471803e3\.user_uploaded\media_1791870829752_a2cf3584.pdf"
pdf = pypdf.PdfReader(spec_pdf_path)

q_spec = []
for p in range(42, 55): # pages 43-55
    txt = pdf.pages[p].extract_text()
    for line in txt.split("\n"):
        parts = line.strip().split()
        if len(parts) >= 2 and any(parts[0].startswith(x) for x in ['r-', 'p-', 'd-', 'c-', 'x-', 'k-', 'l-', 'y-', 'e-', 'w-', 'g-', 'q-']):
            q_spec.append(parts[0])

print(f"Total Questions in Spec: {len(q_spec)}")

# 2. Read pricingRegistry.js
with open(r"src/data/pricing/pricingRegistry.js", "r", encoding="utf-8") as f:
    code = f.read()

# Match questions inside PRICING_SECTIONS
q_code = []
for match in re.finditer(r'id:\s*["\']([a-z0-9-]+)["\']', code):
    qid = match.group(1)
    if any(qid.startswith(x) for x in ['r-', 'p-', 'd-', 'c-', 'x-', 'k-', 'l-', 'y-', 'e-', 'w-', 'g-', 'q-']):
        if qid not in q_code and not qid.startswith("s-"):
            q_code.append(qid)

print(f"Total Questions in Code: {len(q_code)}")

diff_spec_not_code = [q for q in q_spec if q not in q_code]
diff_code_not_spec = [q for q in q_code if q not in q_spec]

print("In Spec but not in Code:", diff_spec_not_code)
print("In Code but not in Spec:", diff_code_not_spec)
