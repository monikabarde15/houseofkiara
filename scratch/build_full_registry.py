import re
import json

with open('scratch/parsed_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Section metadata
section_meta = {
    "s-renting": {
        "num": "01",
        "title": "Renting a piece",
        "italic": "piece",
        "barLabel": "Renting",
        "side": "pay",
        "desc": "How a rental is priced, and everything its price includes."
    },
    "s-preloved": {
        "num": "02",
        "title": "Buying preloved",
        "italic": "preloved",
        "barLabel": "Preloved",
        "side": "pay",
        "desc": "The price of a preloved piece, offers, and buying from outside India."
    },
    "s-deposit": {
        "num": "03",
        "title": "Your deposit",
        "italic": "deposit",
        "barLabel": "Deposit",
        "side": "pay",
        "desc": "Held in safekeeping while a rental is in your care, and returned once it is home with us."
    },
    "s-delivery": {
        "num": "04",
        "title": "Delivery charges",
        "italic": "charges",
        "barLabel": "Delivery",
        "side": "pay",
        "desc": "When delivery is on us, and what faster delivery costs."
    },
    "s-extras": {
        "num": "05",
        "title": "Extra days and late returns",
        "italic": "late returns",
        "barLabel": "Extra days",
        "side": "pay",
        "desc": "Keeping a piece longer, returning it late, and missed deliveries or pickups."
    },
    "s-cancel": {
        "num": "06",
        "title": "Cancellations and refunds",
        "italic": "refunds",
        "barLabel": "Cancellations",
        "side": "pay",
        "desc": "What comes back to you if your plans change, and how quickly."
    },
    "s-damage": {
        "num": "07",
        "title": "If something happens",
        "italic": "happens",
        "barLabel": "Damage and loss",
        "side": "pay",
        "desc": "Normal wear is never charged. Here is what applies beyond it."
    },
    "s-paying": {
        "num": "08",
        "title": "How you pay",
        "italic": "pay",
        "barLabel": "Paying",
        "side": "pay",
        "desc": "Ways to pay, promo codes and your GST invoice."
    },
    "s-share": {
        "num": "01",
        "title": "Your share",
        "italic": "share",
        "barLabel": "Your share",
        "side": "earn",
        "desc": "How your share is set, and what it is calculated on."
    },
    "s-costs": {
        "num": "02",
        "title": "What listing costs",
        "italic": "costs",
        "barLabel": "Costs",
        "side": "earn",
        "desc": "Listing is free. These are the only costs that can ever be yours."
    },
    "s-payouts": {
        "num": "03",
        "title": "Your payouts",
        "italic": "payouts",
        "barLabel": "Payouts",
        "side": "earn",
        "desc": "When you are paid, where, and with what record."
    },
    "s-tax": {
        "num": "04",
        "title": "Tax and your PAN",
        "italic": "your PAN",
        "barLabel": "Tax",
        "side": "earn",
        "desc": "GST, tax deducted from payouts, and the tax on your own earnings."
    },
    "s-prices": {
        "num": "05",
        "title": "Prices and offers",
        "italic": "offers",
        "barLabel": "Prices and offers",
        "side": "earn",
        "desc": "How the price of your piece is set, and how offers work."
    }
}

def clean_text_dashes(text):
    text = text.replace("—", ", ")
    text = text.replace("–", ", ")
    text = text.replace(" - ", ", ")
    # remove bracket tokens cleanly
    text = re.sub(r'\s*\[[a-z_]+\]', '', text)
    # clean out any strange glyphs
    text = text.replace("\u2018", "'").replace("\u2019", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2022", "*")
    return text.strip()

def parse_tag(tag_str):
    if not tag_str:
        return None
    tone = "neutral"
    color = "gold-deep"
    text = tag_str
    
    m = re.search(r'\(([^)]+)\)', tag_str)
    if m:
        meta = m.group(1).lower()
        if "sage" in meta or "good" in meta:
            tone = "good"
            color = "sage"
        elif "terra" in meta or "caution" in meta:
            tone = "caution"
            color = "terracotta"
        else:
            tone = "neutral"
            color = "gold-deep"
        text = tag_str[:m.start()].strip()
    
    text = clean_text_dashes(text)
    return {
        "text": text,
        "tone": tone,
        "color": color
    }

# Process each question into formatted JS object
processed_questions = []
for q in questions:
    sec_id = q['section']['id']
    sec_info = section_meta[sec_id]
    
    tag_obj = parse_tag(q['tag'])
    
    # Process text lines
    raw_lines = [l.strip() for l in q['text'] if l.strip() and not l.startswith('---') and not 'House of Kaira' in l]
    
    # Detect bullets vs paragraphs
    content_blocks = []
    bullet_items = []
    
    for l in raw_lines:
        clean_l = clean_text_dashes(l)
        if clean_l.startswith("*") or clean_l.startswith("•") or clean_l.startswith("·"):
            bullet_items.append(clean_l.lstrip("*•· ").strip())
        elif bullet_items:
            # flush bullets
            content_blocks.append({"type": "list", "items": list(bullet_items)})
            bullet_items = []
            if clean_l.startswith("Note:") or clean_l.startswith("Please note:"):
                content_blocks.append({"type": "note", "text": clean_l})
            else:
                content_blocks.append({"type": "paragraph", "text": clean_l})
        else:
            if clean_l.startswith("Note:") or clean_l.startswith("Please note:"):
                content_blocks.append({"type": "note", "text": clean_l})
            else:
                content_blocks.append({"type": "paragraph", "text": clean_l})
                
    if bullet_items:
        content_blocks.append({"type": "list", "items": list(bullet_items)})
        
    # Extract keywords
    kws = [k.strip() for k in clean_text_dashes(q['keywords']).split() if k.strip()]
    
    # Summary for search result / accordion preview
    first_p = ""
    for b in content_blocks:
        if b['type'] == 'paragraph':
            first_p = b['text']
            break
    summary = first_p if first_p else clean_text_dashes(q['question'])
    if len(summary) > 160:
        summary = summary[:157] + "..."
        
    processed_questions.append({
        "id": q['id'],
        "side": sec_info['side'],
        "sectionId": sec_id,
        "question": clean_text_dashes(q['question']),
        "tag": tag_obj,
        "summary": summary,
        "content": content_blocks,
        "keywords": kws
    })

print(f"Processed {len(processed_questions)} questions.")

# Group by section
sections_data = []
for sec_id, s_info in section_meta.items():
    sec_qs = [qu for qu in processed_questions if qu['sectionId'] == sec_id]
    sections_data.append({
        "id": sec_id,
        "side": s_info['side'],
        "number": s_info['num'],
        "title": s_info['title'],
        "italic": s_info['italic'],
        "barLabel": s_info['barLabel'],
        "summary": s_info['desc'],
        "questions": sec_qs
    })

with open('scratch/sections_built.json', 'w', encoding='utf-8') as f:
    json.dump(sections_data, f, indent=2)

print("Saved sections_built.json successfully.")
