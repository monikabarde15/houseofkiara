import re
import json

with open('scratch/parsed_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Loaded {len(questions)} parsed questions.")

# Let's inspect tag parsing
def parse_tag(tag_str):
    if not tag_str:
        return None
    # e.g. "One price for 3 days [window_standard]  (neutral, gold deep)"
    # or "Always included  (good news, sage)"
    # or "Daily rate per day  (neutral, gold deep)"
    tone = "neutral"
    color = "gold-deep"
    text = tag_str
    
    m = re.search(r'\(([^)]+)\)', tag_str)
    if m:
        meta = m.group(1).lower()
        if "sage" in meta or "good" in meta:
            tone = "good"
            color = "sage"
        elif "terra" in meta or "caution" in meta or "warning" in meta:
            tone = "caution"
            color = "terracotta"
        else:
            tone = "neutral"
            color = "gold-deep"
        text = tag_str[:m.start()].strip()
    
    # replace tokens in text
    text = text.replace("[window_standard]", "3 days")
    text = text.replace("[gst_rental]", "18%")
    text = text.replace("[gst_preloved]", "5%")
    text = text.replace("[free_delivery_min]", "₹5,000")
    text = text.replace("[rental_cancel_full]", "7 days")
    text = text.replace("[payout_cycle]", "3 working days")
    text = text.replace("[deposit_refund_window]", "3 to 5 business days")
    
    return {
        "text": text,
        "tone": tone,
        "color": color
    }

# Check all tags
tags = [parse_tag(q['tag']) for q in questions if q['tag']]
print(f"Total tags: {len(tags)}")
for t in tags[:10]:
    print(" ", t)
