import json
import re

with open('scratch/parsed_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

def clean_text(s):
    # remove spec token bracket annotations if needed, e.g. [window_standard]
    s = s.replace("[window_standard]", "3 days")
    s = s.replace("[gst_rental]", "18%")
    s = s.replace("[gst_preloved]", "5%")
    s = s.replace("[free_delivery_min]", "₹5,000")
    s = s.replace("[rental_cancel_full]", "7 days")
    s = s.replace("[payout_cycle]", "3 working days")
    s = s.replace("[deposit_refund_window]", "3 to 5 business days")
    s = s.replace("[support_whatsapp]", "+91 93401 39300")
    s = s.replace("[support_email]", "hello@houseofkaira.com")
    # clean dashes: ZERO DASH CONSTRAINT!
    # replace en-dash or em-dash or spaced hyphens with comma, colon, or appropriate wording
    s = s.replace("—", ", ")
    s = s.replace("–", ", ")
    s = s.replace(" - ", ", ")
    # remove strange artifacts
    s = s.replace("", "")
    return s.strip()

for q in questions[:10]:
    print(f"=== {q['id']} ({q['question']}) ===")
    full_str = " ".join([l.strip() for l in q['text'] if l.strip()])
    print(clean_text(full_str)[:200])
