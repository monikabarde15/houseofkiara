import pypdf
import json

pdf = pypdf.PdfReader(r"C:\Users\MOHAN SHARMA\.gemini\antigravity\brain\9b80c376-4895-42ce-b372-542a471803e3\.user_uploaded\media_1791870829752_a2cf3584.pdf")

full_text = []
for p in range(42, 55): # pages 43 to 55
    full_text.append(f"--- PAGE {p+1} ---")
    full_text.append(pdf.pages[p].extract_text())

with open(r"scratch/spec_copy_deck.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(full_text))

print("Dumped spec copy deck to scratch/spec_copy_deck.txt")
