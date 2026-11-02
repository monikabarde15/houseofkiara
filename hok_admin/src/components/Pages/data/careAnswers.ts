/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Registry: Care Policy Answers (Spec § 8.14, 57 items)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { AnswerItem, AnswerParagraph, StatusTagTone } from '../types/answers.types';

const TONE_MAP: Record<string, StatusTagTone> = {
  sage: 'good-news',
  ochre: 'worth-knowing',
  rust: 'not-possible'
};

export const CARE_ANSWERS: AnswerItem[] = [
  {
    id: 'l-wear',
    question: "What counts as normal wear?",
    section: "Wear or damage",
    side: 'rentals',
    statusTag: { label: "Never charged", tone: TONE_MAP['sage'] || 'good-news' },
    paragraphs: [
      {
        id: 'l-wear_p_0',
        kind: 'paragraph',
        text: "The gentle signs of a piece being worn and enjoyed: a few loose threads, a little embellishment loss, light creasing. These are expected, and they are never taken from your deposit.",
        sharedFrom: {
          pageName: 'Deposit Policy',
          questionTitle: "What counts as normal wear?"
        }
      },
      {
        id: 'l-wear_p_1',
        kind: 'paragraph',
        text: "Our simple test: if our regular cleaning and small touch-ups after every rental put it right, it is normal wear."
      }
    ],
    searchWords: "normal wear tear loose thread crease small bead gentle signs",
    linkName: 'l-wear',
    isShared: true,
    appearsIn: ['Care, Cleaning & Damage Policy', "Wear or damage"],
    orderIndex: 1
  },
  {
    id: 'l-damage',
    question: "What counts as damage?",
    section: "Wear or damage",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'l-damage_p_0',
        kind: 'paragraph',
        text: "Anything beyond normal wear, such as stains, tears, burns, significant bead or embroidery loss, or any alteration to the piece. It is assessed when the piece returns to us, against the photographs and video we take before dispatch.",
        sharedFrom: {
          pageName: 'Deposit Policy',
          questionTitle: "What counts as damage?"
        }
      },
      {
        id: 'l-damage_p_1',
        kind: 'paragraph',
        text: "Put simply, it is damage if it needs specialist stain treatment, a karigar's repair or new materials, or cannot be put right at all."
      }
    ],
    searchWords: "damage what counts stain tear burn alteration",
    linkName: 'l-damage',
    isShared: true,
    appearsIn: ['Care, Cleaning & Damage Policy', "Wear or damage"],
    orderIndex: 2
  },
  {
    id: 'l-test',
    question: "How do you decide which it is?",
    section: "Wear or damage",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'l-test_p_0',
        kind: 'paragraph',
        text: "With one simple test, applied to every piece in the same way. If our regular cleaning and small touch-ups after every rental put it right, it is normal wear, and it is never charged. If it needs specialist stain treatment, a karigar's repair or new materials, or cannot be put right at all, it is damage."
      },
      {
        id: 'l-test_p_1',
        kind: 'paragraph',
        text: "We decide against the photographs and video we take just before dispatch, so only what is new is ever considered."
      }
    ],
    searchWords: "decide which test how judge assess fair",
    linkName: 'l-test',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Wear or damage"],
    orderIndex: 3
  },
  {
    id: 'l-sweat',
    question: "What about perspiration?",
    section: "Wear or damage",
    side: 'rentals',
    statusTag: { label: "Never charged", tone: TONE_MAP['sage'] || 'good-news' },
    paragraphs: [
      {
        id: 'l-sweat_p_0',
        kind: 'paragraph',
        text: "Never charged, even when it needs more than our regular cleaning. A celebration is warm, joyful and full of dancing, and natural perspiration is simply part of it."
      }
    ],
    searchWords: "perspiration sweat sweating underarm heat summer",
    linkName: 'l-sweat',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Wear or damage"],
    orderIndex: 4
  },
  {
    id: 'l-marks',
    question: "There is a makeup, perfume or deodorant mark on it",
    section: "Wear or damage",
    side: 'rentals',
    statusTag: { label: "Usually on us", tone: TONE_MAP['sage'] || 'good-news' },
    paragraphs: [
      {
        id: 'l-marks_p_0',
        kind: 'paragraph',
        text: "A light mark that lifts out in our regular cleaning is normal wear, and it is never charged. A heavy mark that needs specialist treatment, or one that will not lift at all, is assessed as damage."
      },
      {
        id: 'l-marks_p_1',
        kind: 'paragraph',
        text: "The kindest protection is simple: dress once your makeup, perfume and deodorant have dried."
      }
    ],
    searchWords: "makeup foundation lipstick perfume deodorant mark stain kajal",
    linkName: 'l-marks',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Wear or damage"],
    orderIndex: 5
  },
  {
    id: 'l-small',
    question: "A hook, button or a few sequins came loose",
    section: "Wear or damage",
    side: 'rentals',
    statusTag: { label: "Normal wear", tone: TONE_MAP['sage'] || 'good-news' },
    paragraphs: [
      {
        id: 'l-small_p_0',
        kind: 'paragraph',
        text: "That is normal wear. We re-stitch hooks and buttons and replace a few beads or sequins as part of our care after every rental."
      },
      {
        id: 'l-small_p_1',
        kind: 'paragraph',
        text: "If you need to, hold it in place for the evening with a safety pin through the lining, and leave the rest to us."
      }
    ],
    searchWords: "hook button sequin bead came loose fell off popped thread",
    linkName: 'l-small',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Wear or damage"],
    orderIndex: 6
  },
  {
    id: 'l-stains',
    question: "Which marks are most often assessed as damage?",
    section: "Wear or damage",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'l-stains_p_0',
        kind: 'paragraph',
        text: "The ones that set quickly into silk and fine embroidery: mehendi, haldi, sindoor, gulal and colour, red wine, oil and rich gravies. They usually need specialist treatment, and some cannot be fully lifted."
      },
      {
        id: 'l-stains_p_1',
        kind: 'paragraph',
        text: "A little care at those moments goes a long way: see what to do at a haldi or colour ceremony."
      }
    ],
    searchWords: "stains which worst mehendi haldi sindoor wine oil gravy colour holi gulal",
    linkName: 'l-stains',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Wear or damage"],
    orderIndex: 7
  },
  {
    id: 'a-check',
    question: "What should I do when my piece arrives?",
    section: "When it arrives",
    side: 'rentals',
    statusTag: { label: "Within 24 hours", tone: TONE_MAP['gold'] || 'good-news' },
    paragraphs: [
      {
        id: 'a-check_p_0',
        kind: 'paragraph',
        text: "Open it within 24 hours of delivery, in good light, and look it over before you wear it: the front and back, the hem, the embroidery and every part listed with it."
      },
      {
        id: 'a-check_p_1',
        kind: 'paragraph',
        text: "If you notice a mark or anything amiss, send us a photo straight away, before you wear it. We note it on your booking, so it is never counted against you."
      }
    ],
    searchWords: "arrives arrival check inspect open delivery look",
    linkName: 'a-check',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "When it arrives"],
    orderIndex: 8
  },
  {
    id: 'a-listed',
    question: "There is a mark the listing already mentions",
    section: "When it arrives",
    side: 'rentals',
    statusTag: { label: "Never counted against you", tone: TONE_MAP['sage'] || 'good-news' },
    paragraphs: [
      {
        id: 'a-listed_p_0',
        kind: 'paragraph',
        text: "Anything already photographed or noted on the listing is part of the piece's history, and it is never counted against you."
      }
    ],
    searchWords: "listing already mentioned disclosed photographed history existing mark",
    linkName: 'a-listed',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "When it arrives"],
    orderIndex: 9
  },
  {
    id: 'a-fit',
    question: "It does not fit",
    section: "When it arrives",
    side: 'rentals',
    statusTag: { label: "Swap within 24 hours", tone: TONE_MAP['gold'] || 'good-news' },
    paragraphs: [
      {
        id: 'a-fit_p_0',
        kind: 'paragraph',
        text: "This is rare, because we check every piece against the measurements you share with us. Try it on the day it arrives, and if it does not fit, message us within 24 hours of delivery with a photo, and we will arrange a swap."
      },
      {
        id: 'a-fit_p_1',
        kind: 'paragraph',
        text: "Please do not alter it to make it fit. Our Refund & Cancellation Policy explains the rest."
      }
    ],
    searchWords: "fit fitting size tight loose does not fit swap",
    linkName: 'a-fit',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "When it arrives"],
    orderIndex: 10
  },
  {
    id: 'a-store',
    question: "How should I keep it until my event?",
    section: "When it arrives",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'a-store_p_0',
        kind: 'paragraph',
        text: "On its padded hanger, inside its garment bag, somewhere cool and dry and away from direct sunlight. Keep it clear of pets, perfume bottles and anything damp."
      }
    ],
    searchWords: "store keep hang hanger until event where wardrobe",
    linkName: 'a-store',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "When it arrives"],
    orderIndex: 11
  },
  {
    id: 'a-crease',
    question: "Can I steam or iron out a crease?",
    section: "When it arrives",
    side: 'rentals',
    statusTag: { label: "Please do not", tone: TONE_MAP['terracotta'] || 'good-news' },
    paragraphs: [
      {
        id: 'a-crease_p_0',
        kind: 'paragraph',
        text: "Please do not. Your piece arrives pressed and ready to wear, and light creases from travel usually soften once it has hung for a few hours. Steam and heat can melt sequins, tarnish zari and mark delicate silk, so any harm from them is treated as damage."
      },
      {
        id: 'a-crease_p_1',
        kind: 'paragraph',
        text: "If a crease still worries you, send us a photo and we will advise you."
      }
    ],
    searchWords: "steam iron press crease wrinkle travel creases",
    linkName: 'a-crease',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "When it arrives"],
    orderIndex: 12
  },
  {
    id: 'a-fresh',
    question: "It does not feel fresh",
    section: "When it arrives",
    side: 'rentals',
    statusTag: { label: "Tell us within 24 hours", tone: TONE_MAP['gold'] || 'good-news' },
    paragraphs: [
      {
        id: 'a-fresh_p_0',
        kind: 'paragraph',
        text: "That should never happen: every piece is professionally cleaned and checked before it leaves us. Message us within 24 hours of delivery with a photo, and we will put it right before your event."
      }
    ],
    searchWords: "fresh smell clean hygiene not clean odour",
    linkName: 'a-fresh',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "When it arrives"],
    orderIndex: 13
  },
  {
    id: 'w-makeup',
    question: "Can I wear perfume and makeup?",
    section: "Getting ready",
    side: 'rentals',
    statusTag: { label: "Yes, with care", tone: TONE_MAP['sage'] || 'good-news' },
    paragraphs: [
      {
        id: 'w-makeup_p_0',
        kind: 'paragraph',
        text: "Of course. Apply perfume, makeup and hairspray before you dress and let them dry, and never spray perfume directly onto the fabric."
      },
      {
        id: 'w-makeup_p_1',
        kind: 'paragraph',
        text: "For a piece you slip over your head, a light scarf over your face keeps foundation and lipstick off the neckline."
      }
    ],
    searchWords: "perfume makeup hairspray foundation lipstick deodorant spray",
    linkName: 'w-makeup',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Getting ready"],
    orderIndex: 14
  },
  {
    id: 'w-jewel',
    question: "Will my jewellery harm it?",
    section: "Getting ready",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'w-jewel_p_0',
        kind: 'paragraph',
        text: "Heavy jewellery is one of the most common causes of pulled threads. Put it on after you dress, take it off before you undress, and lift it clear of net, organza and embroidery, where clasps and settings catch."
      }
    ],
    searchWords: "jewellery jewelry necklace earrings kundan polki bangles snag catch pull",
    linkName: 'w-jewel',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Getting ready"],
    orderIndex: 15
  },
  {
    id: 'w-pins',
    question: "Can I use safety pins or fashion tape?",
    section: "Getting ready",
    side: 'rentals',
    statusTag: { label: "Yes, gently", tone: TONE_MAP['sage'] || 'good-news' },
    paragraphs: [
      {
        id: 'w-pins_p_0',
        kind: 'paragraph',
        text: "Fashion tape and safety pins are absolutely fine for small adjustments on the day. Pin gently through the lining or a plain part of the fabric, never through embroidery, zari or sheer fabric, as a mark, snag or tear from a pin counts as damage."
      },
      {
        id: 'w-pins_p_1',
        kind: 'paragraph',
        text: "Fashion tape works best on the lining, rather than on the outer fabric."
      }
    ],
    searchWords: "safety pin pins tape fashion tape adjust fit dupatta pallu",
    linkName: 'w-pins',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Getting ready"],
    orderIndex: 16
  },
  {
    id: 'w-alter',
    question: "Can I alter it to fit?",
    section: "Getting ready",
    side: 'rentals',
    statusTag: { label: "Please do not", tone: TONE_MAP['terracotta'] || 'good-news' },
    paragraphs: [
      {
        id: 'w-alter_p_0',
        kind: 'paragraph',
        text: "Please do not alter it in any way, including stitching, hemming, cutting or taking in. Any alteration is treated as damage."
      },
      {
        id: 'w-alter_p_1',
        kind: 'paragraph',
        text: "If the fit worries you, message us before your event and we will help you find a way that works."
      }
    ],
    searchWords: "alter alteration tailor stitch hem take in cut adjust",
    linkName: 'w-alter',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Getting ready"],
    orderIndex: 17
  },
  {
    id: 'w-mehendi',
    question: "I have fresh mehendi",
    section: "Getting ready",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'w-mehendi_p_0',
        kind: 'paragraph',
        text: "Wait until the paste is completely off before you dress, and keep the oils used to darken it away from the fabric. Fresh henna stains silk and embroidery for good, so it is worth the extra hour."
      }
    ],
    searchWords: "mehendi henna fresh paste hands oil dark",
    linkName: 'w-mehendi',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Getting ready"],
    orderIndex: 18
  },
  {
    id: 'w-food',
    question: "Can I eat and drink in it?",
    section: "At the celebration",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'w-food_p_0',
        kind: 'paragraph',
        text: "Of course, it is a celebration. Keep deep colours like red wine, coffee and rich gravies at a careful distance, and if anything splashes, blot it straight away."
      }
    ],
    searchWords: "eat drink food wine coffee gravy dinner",
    linkName: 'w-food',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "At the celebration"],
    orderIndex: 19
  },
  {
    id: 'w-colour',
    question: "I am wearing it to a haldi or a colour ceremony",
    section: "At the celebration",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'w-colour_p_0',
        kind: 'paragraph',
        text: "Turmeric, sindoor and colour are part of the joy, and they also set into silk faster than anything else. Keep your dupatta gathered close, stand back when colour is in the air, and blot any splash straight away."
      },
      {
        id: 'w-colour_p_1',
        kind: 'paragraph',
        text: "A mark that lifts in our regular cleaning is normal wear. One that needs specialist treatment is assessed like any other stain."
      }
    ],
    searchWords: "haldi holi colour color gulal turmeric sindoor ceremony",
    linkName: 'w-colour',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "At the celebration"],
    orderIndex: 20
  },
  {
    id: 'w-fire',
    question: "I will be near the sacred fire, diyas or sparklers",
    section: "At the celebration",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'w-fire_p_0',
        kind: 'paragraph',
        text: "Keep your dupatta and pallu gathered close during the pheras, and near diyas, candles and sparklers. Delicate net and organza can catch a spark in a moment, and a burn cannot be undone."
      }
    ],
    searchWords: "fire pheras diya candle sparkler havan flame burn",
    linkName: 'w-fire',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "At the celebration"],
    orderIndex: 21
  },
  {
    id: 'w-outdoor',
    question: "My celebration is outdoors",
    section: "At the celebration",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'w-outdoor_p_0',
        kind: 'paragraph',
        text: "Lift your hem on grass, sand and stone steps, keep the piece dry if it rains, and watch for rough surfaces, nails and chair edges. Water, mud and rough edges can harm a piece in a moment."
      }
    ],
    searchWords: "outdoor garden beach lawn rain monsoon sand grass destination",
    linkName: 'w-outdoor',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "At the celebration"],
    orderIndex: 22
  },
  {
    id: 'w-twice',
    question: "Can I wear it more than once?",
    section: "At the celebration",
    side: 'rentals',
    statusTag: { label: "Yes", tone: TONE_MAP['sage'] || 'good-news' },
    paragraphs: [
      {
        id: 'w-twice_p_0',
        kind: 'paragraph',
        text: "Yes, it is yours to enjoy for your whole rental window. Hang it to air between wears, and tell us about anything that happened at the first event before the next one."
      }
    ],
    searchWords: "wear twice two functions more than once again",
    linkName: 'w-twice',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "At the celebration"],
    orderIndex: 23
  },
  {
    id: 'h-spill',
    question: "I spilled something on it",
    section: "At the celebration",
    side: 'rentals',
    statusTag: { label: "Blot, never rub", tone: TONE_MAP['gold'] || 'good-news' },
    paragraphs: [
      {
        id: 'h-spill_p_0',
        kind: 'paragraph',
        text: "Press a clean tissue or cloth gently onto the spill to lift what you can, working from the outside in, and never rub. Please do not use water, soda, salt, talc or any home remedy, as they can set a mark for good."
      },
      {
        id: 'h-spill_p_1',
        kind: 'paragraph',
        text: "Then send us a photo on WhatsApp. The sooner we know, the more our specialists can usually save."
      }
    ],
    searchWords: "spill spilled stain wine food drink accident splash",
    linkName: 'h-spill',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "At the celebration"],
    orderIndex: 24
  },
  {
    id: 'h-tear',
    question: "Something tore, snagged or came loose",
    section: "At the celebration",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'h-tear_p_0',
        kind: 'paragraph',
        text: "Please do not pull a loose thread or try to stitch it. If you need to, hold it in place with a safety pin through the lining, and send us a photo."
      },
      {
        id: 'h-tear_p_1',
        kind: 'paragraph',
        text: "Our karigars can restore far more than you might expect, especially when they see it early."
      }
    ],
    searchWords: "tear torn snag snagged pulled thread rip loose",
    linkName: 'h-tear',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "At the celebration"],
    orderIndex: 25
  },
  {
    id: 'h-tell',
    question: "Should I tell you now, or wait until it is back?",
    section: "At the celebration",
    side: 'rentals',
    statusTag: { label: "Tell us straight away", tone: TONE_MAP['gold'] || 'good-news' },
    paragraphs: [
      {
        id: 'h-tell_p_0',
        kind: 'paragraph',
        text: "Please tell us straight away. Telling us never counts against you, and the sooner we know, the more our specialists can usually save, which keeps any cost to you as small as possible."
      }
    ],
    searchWords: "tell inform report wait later now",
    linkName: 'h-tell',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "At the celebration"],
    orderIndex: 26
  },
  {
    id: 'h-night',
    question: "It happened late at night",
    section: "At the celebration",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'h-night_p_0',
        kind: 'paragraph',
        text: "Send us the photo anyway. We reply from 10 AM to 8 PM IST, and your message shows exactly when you told us, so you have told us straight away."
      }
    ],
    searchWords: "night late hours closed reply weekend",
    linkName: 'h-night',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "At the celebration"],
    orderIndex: 27
  },
  {
    id: 'h-guest',
    question: "Someone else spilled something on me",
    section: "At the celebration",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'h-guest_p_0',
        kind: 'paragraph',
        text: "It happens at every celebration, and we understand. While the piece is with you it is in your care, so it is looked at in the same way whoever caused it. Blot it, send us a photo, and we will do everything we can to restore it."
      }
    ],
    searchWords: "guest someone else caused not my fault spilled on me",
    linkName: 'h-guest',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "At the celebration"],
    orderIndex: 28
  },
  {
    id: 'h-keep',
    question: "Can I keep wearing it after a spill?",
    section: "At the celebration",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'h-keep_p_0',
        kind: 'paragraph',
        text: "Yes. Blot it, send us a photo, and enjoy the rest of your evening. Simply avoid touching or rubbing the mark."
      }
    ],
    searchWords: "keep wearing continue after spill rest of evening",
    linkName: 'h-keep',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "At the celebration"],
    orderIndex: 29
  },
  {
    id: 'af-air',
    question: "What should I do with it after my event?",
    section: "After the celebration",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'af-air_p_0',
        kind: 'paragraph',
        text: "Take your jewellery off first, open every hook and zip fully, and step out of it gently. Then hang it overnight on its padded hanger to air, away from sunlight and damp, before you pack it."
      },
      {
        id: 'af-air_p_1',
        kind: 'paragraph',
        text: "There is nothing to clean: all cleaning is ours."
      }
    ],
    searchWords: "after event take off undress hang air overnight",
    linkName: 'af-air',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "After the celebration"],
    orderIndex: 30
  },
  {
    id: 'r-clean',
    question: "Should I clean it before sending it back?",
    section: "After the celebration",
    side: 'rentals',
    statusTag: { label: "Please do not", tone: TONE_MAP['terracotta'] || 'good-news' },
    paragraphs: [
      {
        id: 'r-clean_p_0',
        kind: 'paragraph',
        text: "Please do not. Professional cleaning after every rental is taken care of by us and included in your rental fee. Washing, steaming or spot cleaning at home can harm delicate work, and damage caused this way is treated like any other damage.",
        sharedFrom: {
          pageName: 'Deposit Policy',
          questionTitle: "Should I clean it before sending it back?"
        }
      }
    ],
    searchWords: "wash clean before returning dry clean steam iron",
    linkName: 'r-clean',
    isShared: true,
    appearsIn: ['Care, Cleaning & Damage Policy', "After the celebration"],
    orderIndex: 31
  },
  {
    id: 'r-how',
    question: "How do I send the piece back?",
    section: "Sending it back",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'r-how_p_0',
        kind: 'paragraph',
        text: "Whichever suits you best:\n• Drop it off at the courier's nearest office, using the prepaid label in your packaging.\n• Book a pickup from your door: message us and we will arrange it.",
        sharedFrom: {
          pageName: 'Deposit Policy',
          questionTitle: "How do I send the piece back?"
        }
      },
      {
        id: 'r-how_p_1',
        kind: 'paragraph',
        text: "Either way, please pack the piece as it arrived, in its garment bag, and keep the courier's receipt until your deposit is back with you."
      }
    ],
    searchWords: "send back return how drop off pickup courier label",
    linkName: 'r-how',
    isShared: true,
    appearsIn: ['Care, Cleaning & Damage Policy', "Sending it back"],
    orderIndex: 32
  },
  {
    id: 'r-pack',
    question: "How do I pack it?",
    section: "Sending it back",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'r-pack_p_0',
        kind: 'paragraph',
        text: "Let it air overnight on its hanger, then pack it as it arrived, folded loosely in its tissue and garment bag. Fold along the plainer panels rather than across heavy embroidery, and keep every part together."
      }
    ],
    searchWords: "pack packing fold tissue box garment bag",
    linkName: 'r-pack',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Sending it back"],
    orderIndex: 33
  },
  {
    id: 'r-parts',
    question: "What needs to go back?",
    section: "Sending it back",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'r-parts_p_0',
        kind: 'paragraph',
        text: "Everything that arrived with it: the piece itself and every part listed with it, such as the dupatta, blouse, belt, can-can or potli."
      }
    ],
    searchWords: "parts what goes back dupatta blouse belt potli can-can included",
    linkName: 'r-parts',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Sending it back"],
    orderIndex: 34
  },
  {
    id: 'x-part',
    question: "A part of the piece did not come back",
    section: "Sending it back",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'x-part_p_0',
        kind: 'paragraph',
        text: "Please tell us as soon as you notice. If it is found and sent back, only any late days apply. If it is lost, only the cost of replacing that part is deducted, never the value of the whole piece.",
        sharedFrom: {
          pageName: 'Deposit Policy',
          questionTitle: "A part of the piece did not come back"
        }
      }
    ],
    searchWords: "missing part dupatta blouse belt not returned piece incomplete",
    linkName: 'x-part',
    isShared: true,
    appearsIn: ['Care, Cleaning & Damage Policy', "Sending it back"],
    orderIndex: 35
  },
  {
    id: 'r-label',
    question: "I have lost the return label or garment bag",
    section: "Sending it back",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'r-label_p_0',
        kind: 'paragraph',
        text: "Your return label comes printed in your packaging. If it goes missing, simply message us and we will send you a copy to print. Any clean, sturdy bag will do for the journey back.",
        sharedFrom: {
          pageName: 'Deposit Policy',
          questionTitle: "I have lost the return label or garment bag"
        }
      }
    ],
    searchWords: "lost label garment bag packaging print copy",
    linkName: 'r-label',
    isShared: true,
    appearsIn: ['Care, Cleaning & Damage Policy', "Sending it back"],
    orderIndex: 36
  },
  {
    id: 'r-resp',
    question: "Who is responsible for the piece on its way back?",
    section: "Sending it back",
    side: 'rentals',
    statusTag: { label: "We are", tone: TONE_MAP['sage'] || 'good-news' },
    paragraphs: [
      {
        id: 'r-resp_p_0',
        kind: 'paragraph',
        text: "We are, from the moment you hand it to our courier and receive a receipt. If anything happens to it after that, you are never charged for it, and your deposit is protected. That is why the receipt matters: please keep it until your deposit is back with you.",
        sharedFrom: {
          pageName: 'Deposit Policy',
          questionTitle: "Who is responsible for the piece on its way back?"
        }
      }
    ],
    searchWords: "responsible journey back lost in transit courier receipt who",
    linkName: 'r-resp',
    isShared: true,
    appearsIn: ['Care, Cleaning & Damage Policy', "Sending it back"],
    orderIndex: 37
  },
  {
    id: 'pc-lehenga',
    question: "Caring for a lehenga",
    section: "Care, piece by piece",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'pc-lehenga_p_0',
        kind: 'bullet',
        text: "Hang the skirt by its inner loops, so its weight rests evenly and the waistband keeps its shape.\n• Gather the skirt before you sit, and lift the hem on stairs, where heels catch the hem and can-can.\n• Pin your dupatta through its plain edge or the blouse lining, never through the embroidered border.\n• When you pack it, fold along the plainer panels, and send back the can-can and every layer with it."
      }
    ],
    searchWords: "lehenga skirt can-can bridal choli",
    linkName: 'pc-lehenga',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Care, piece by piece"],
    orderIndex: 38
  },
  {
    id: 'pc-saree',
    question: "Caring for a saree",
    section: "Care, piece by piece",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'pc-saree_p_0',
        kind: 'bullet',
        text: "A pre-draped or pre-stitched saree is set for you: wear it as it is, without re-pleating or re-stitching.\n• Pin pleats and pallu through the plain fall or the lining, never through zari or embroidery.\n• Keep the hem just off the floor, and lift it on stairs, where heels and jewellery snag a delicate border.\n• Fold it loosely along its original lines, with tissue between the folds."
      }
    ],
    searchWords: "saree sari drape pleats pallu pre-draped pre-stitched",
    linkName: 'pc-saree',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Care, piece by piece"],
    orderIndex: 39
  },
  {
    id: 'pc-sets',
    question: "Caring for an anarkali, sharara or kurta set",
    section: "Care, piece by piece",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'pc-sets_p_0',
        kind: 'bullet',
        text: "Slip an anarkali over your head with a light scarf over your face, so makeup stays off the neckline.\n• Lift sharara and gharara flares on stairs and steps, and keep them clear of wet ground.\n• Keep the dupatta, belt and every layer together, so each part comes back with the set."
      }
    ],
    searchWords: "anarkali sharara gharara kurta set suit",
    linkName: 'pc-sets',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Care, piece by piece"],
    orderIndex: 40
  },
  {
    id: 'pc-gowns',
    question: "Caring for a gown or Indo-western piece",
    section: "Care, piece by piece",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'pc-gowns_p_0',
        kind: 'bullet',
        text: "Gather a train or long hem when you walk outdoors, and let it rest on a clean surface when you sit.\n• Corsets, drapes and capes are shaped to fit as they are: please do not adjust their boning, seams or drapes.\n• Hang it by its inner loops on its padded hanger, so the shoulders and bodice keep their shape."
      }
    ],
    searchWords: "gown indo-western indo western cape corset drape train",
    linkName: 'pc-gowns',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Care, piece by piece"],
    orderIndex: 41
  },
  {
    id: 'pc-men',
    question: "Caring for a sherwani or bandhgala",
    section: "Care, piece by piece",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'pc-men_p_0',
        kind: 'bullet',
        text: "Button and unbutton slowly, especially on embroidered fronts, where the threads take the most strain.\n• Let deodorant dry fully before you dress, as a close-fitting jacket meets it at every seam.\n• Return everything listed with your outfit, such as a safa or stole.\n• Hang it on its shaped hanger with the shoulders supported, and keep the buttons fastened."
      }
    ],
    searchWords: "sherwani bandhgala achkan jodhpuri menswear groom safa stole",
    linkName: 'pc-men',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Care, piece by piece"],
    orderIndex: 42
  },
  {
    id: 'o-clean',
    question: "Who cleans the pieces?",
    section: "Our care",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'o-clean_p_0',
        kind: 'paragraph',
        text: "Our partner specialists in couture care clean every piece professionally before and after every rental. Each one is then checked by hand and pressed, and nothing is ever dispatched without it, because hygiene is never negotiable for us."
      }
    ],
    searchWords: "who cleans cleaning dry clean hygiene specialists partner",
    linkName: 'o-clean',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Our care"],
    orderIndex: 43
  },
  {
    id: 'o-cost',
    question: "Do I pay for cleaning?",
    section: "Our care",
    side: 'rentals',
    statusTag: { label: "Never", tone: TONE_MAP['sage'] || 'good-news' },
    paragraphs: [
      {
        id: 'o-cost_p_0',
        kind: 'paragraph',
        text: "Never. Our professional cleaning and pressing after every rental is included in your rental fee, and it is never taken from your deposit."
      }
    ],
    searchWords: "pay cleaning cost charge fee included free",
    linkName: 'o-cost',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Our care"],
    orderIndex: 44
  },
  {
    id: 'o-record',
    question: "How do you know what happened during my rental?",
    section: "Our care",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'o-record_p_0',
        kind: 'paragraph',
        text: "We photograph and film every piece just before it is dispatched. When it returns, we compare it with that record, so only what is new is ever considered, and you can see both side by side if we ever need to talk about a mark."
      }
    ],
    searchWords: "photos video record before dispatch evidence proof condition know",
    linkName: 'o-record',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Our care"],
    orderIndex: 45
  },
  {
    id: 'o-repair',
    question: "Who repairs a piece if it needs it?",
    section: "Our care",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'o-repair_p_0',
        kind: 'paragraph',
        text: "Our own trusted karigars and specialists, who work with couture every day. Please never take a rental to your own tailor or cleaner: we look after every repair ourselves."
      }
    ],
    searchWords: "repair who fixes karigar tailor own tailor",
    linkName: 'o-repair',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "Our care"],
    orderIndex: 46
  },
  {
    id: 'x-amount',
    question: "How is a deduction worked out?",
    section: "If a piece needs restoring",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'x-amount_p_0',
        kind: 'paragraph',
        text: "It is the fair, reasonable cost of restoring the piece, considered case by case, because no two pieces or repairs are alike. It can include:\n• specialist cleaning or repair\n• materials, such as matching thread, beads or fabric\n• the skilled hand work involved, which for intricate embellishment can take days",
        sharedFrom: {
          pageName: 'Deposit Policy',
          questionTitle: "How is a deduction worked out?"
        }
      },
      {
        id: 'x-amount_p_1',
        kind: 'paragraph',
        text: "We only ever charge what restoring it truly costs, never a penalty, and we always show you how the amount was reached. Our Deposit Policy shows a worked example."
      }
    ],
    searchWords: "how much deduction amount worked out calculated cost price repair restoration",
    linkName: 'x-amount',
    isShared: true,
    appearsIn: ['Care, Cleaning & Damage Policy', "If a piece needs restoring"],
    orderIndex: 47
  },
  {
    id: 'x-notice',
    question: "How will I hear about a deduction?",
    section: "If a piece needs restoring",
    side: 'rentals',
    statusTag: { label: "Within 2 business days", tone: TONE_MAP['gold'] || 'good-news' },
    paragraphs: [
      {
        id: 'x-notice_p_0',
        kind: 'paragraph',
        text: "Within 2 business days of your piece reaching us, we will message you with:\n• photographs and video of what we found\n• our own photographs and video of the piece from just before dispatch, so you can compare the two\n• the amount, and how it was worked out\n• the invoice for the work, wherever there is one",
        sharedFrom: {
          pageName: 'Deposit Policy',
          questionTitle: "How will I hear about a deduction?"
        }
      },
      {
        id: 'x-notice_p_1',
        kind: 'paragraph',
        text: "Nothing is deducted before you have seen all of this."
      }
    ],
    searchWords: "how will i know deduction notified told photos evidence",
    linkName: 'x-notice',
    isShared: true,
    appearsIn: ['Care, Cleaning & Damage Policy', "If a piece needs restoring"],
    orderIndex: 48
  },
  {
    id: 'x-reply',
    question: "Can I respond to a deduction?",
    section: "If a piece needs restoring",
    side: 'rentals',
    statusTag: { label: "2 business days to reply", tone: TONE_MAP['gold'] || 'good-news' },
    paragraphs: [
      {
        id: 'x-reply_p_0',
        kind: 'paragraph',
        text: "Of course. You have 2 business days to share anything you would like us to consider, such as your own photographs from when the piece arrived. We review it against our records and then confirm the final amount. Where the photographs and video clearly show the damage, the deduction stands.",
        sharedFrom: {
          pageName: 'Deposit Policy',
          questionTitle: "Can I respond to a deduction?"
        }
      },
      {
        id: 'x-reply_p_1',
        kind: 'paragraph',
        text: "If you remain unhappy, you can write to our Grievance Officer, whose details are on our Contact page."
      }
    ],
    searchWords: "disagree reply respond dispute challenge deduction unfair",
    linkName: 'x-reply',
    isShared: true,
    appearsIn: ['Care, Cleaning & Damage Policy', "If a piece needs restoring"],
    orderIndex: 49
  },
  {
    id: 'x-long',
    question: "What if the repair takes a while?",
    section: "If a piece needs restoring",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'x-long_p_0',
        kind: 'paragraph',
        text: "Some hand work takes weeks. In that case, we hold only our estimate of the cost and return the rest of your deposit as usual. Once the work is complete, we settle the difference: if it cost less than the estimate, we return the difference; if it cost more, we share the invoice and talk it through with you first.",
        sharedFrom: {
          pageName: 'Deposit Policy',
          questionTitle: "What if the repair takes a while?"
        }
      }
    ],
    searchWords: "repair takes long weeks estimate invoice later",
    linkName: 'x-long',
    isShared: true,
    appearsIn: ['Care, Cleaning & Damage Policy', "If a piece needs restoring"],
    orderIndex: 50
  },
  {
    id: 'p-care',
    question: "How do I care for a preloved piece?",
    section: "A piece that is yours to keep",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'p-care_p_0',
        kind: 'paragraph',
        text: "Every preloved piece is professionally cleaned before it leaves us, and arrives checked and pressed. Because each one is made differently, its own care notes are on its page, written for its fabric and craftsmanship. You can open it any time from your order in My Account."
      },
      {
        id: 'p-care_p_1',
        kind: 'paragraph',
        text: "A few things hold true for every one of them:\n• Store it in breathable cotton or muslin, never plastic, somewhere cool, dry and dark.\n• Refold it along different lines every few months, so zari and embroidery never rest on one fold for long.\n• Keep perfume, deodorant and hairspray off the fabric.\n• Air it now and then, especially through the monsoon, and keep naphthalene or neem wrapped so it never touches the fabric."
      }
    ],
    searchWords: "preloved bought own care store storage muslin naphthalene neem",
    linkName: 'p-care',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "A piece that is yours to keep"],
    orderIndex: 51
  },
  {
    id: 'p-cleaned',
    question: "Is my preloved piece cleaned before it reaches me?",
    section: "A piece that is yours to keep",
    side: 'rentals',
    statusTag: { label: "Yes", tone: TONE_MAP['sage'] || 'good-news' },
    paragraphs: [
      {
        id: 'p-cleaned_p_0',
        kind: 'paragraph',
        text: "Yes. Every preloved piece is professionally cleaned before it leaves us, and arrives checked and pressed."
      },
      {
        id: 'p-cleaned_p_1',
        kind: 'paragraph',
        text: "A piece that has never been worn is checked and pressed instead of cleaned, so it stays exactly as new."
      }
    ],
    searchWords: "cleaned before clean hygiene fresh preloved arrive dry clean washed worn unworn",
    linkName: 'p-cleaned',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "A piece that is yours to keep"],
    orderIndex: 52
  },
  {
    id: 'p-clean',
    question: "How should I have it cleaned in future?",
    section: "A piece that is yours to keep",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'p-clean_p_0',
        kind: 'paragraph',
        text: "Only when it needs it, and only by a dry cleaner who specialises in hand-embroidered pieces, as every clean is a little wear of its own. Do have it cleaned before you store it for a long while, as perspiration and small marks can set over time."
      }
    ],
    searchWords: "clean dry clean preloved how often specialist",
    linkName: 'p-clean',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "A piece that is yours to keep"],
    orderIndex: 53
  },
  {
    id: 'p-repair',
    question: "A thread or bead has come loose",
    section: "A piece that is yours to keep",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'p-repair_p_0',
        kind: 'paragraph',
        text: "Please do not pull it. A karigar can secure it in minutes, and the sooner it is done, the less there is to repair."
      }
    ],
    searchWords: "loose thread bead repair preloved fix karigar",
    linkName: 'p-repair',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "A piece that is yours to keep"],
    orderIndex: 54
  },
  {
    id: 'p-flaw',
    question: "Something is not as described in the listing",
    section: "A piece that is yours to keep",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'p-flaw_p_0',
        kind: 'paragraph',
        text: "Please tell us straight away. Our Refund & Cancellation Policy explains exactly what to do, and how quickly to let us know."
      }
    ],
    searchWords: "not as described flaw defect hidden preloved claim",
    linkName: 'p-flaw',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "A piece that is yours to keep"],
    orderIndex: 55
  },
  {
    id: 'p-next',
    question: "Can I rent it out or sell it through House of Kaira later?",
    section: "A piece that is yours to keep",
    side: 'rentals',
    statusTag: { label: "Yes", tone: TONE_MAP['sage'] || 'good-news' },
    paragraphs: [
      {
        id: 'p-next_p_0',
        kind: 'paragraph',
        text: "Yes, and we would love to give it its next chapter. When you are ready, list your piece and our team will guide you through it."
      }
    ],
    searchWords: "sell rent list later next chapter resell",
    linkName: 'p-next',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "A piece that is yours to keep"],
    orderIndex: 56
  },
  {
    id: 'p-lister',
    question: "I list my pieces with House of Kaira. How is my piece protected?",
    section: "A piece that is yours to keep",
    side: 'rentals',
    statusTag: undefined,
    paragraphs: [
      {
        id: 'p-lister_p_0',
        kind: 'paragraph',
        text: "Our Seller Guidelines set out how we look after your piece while it is with us and with a renter, and how you are protected if it is ever damaged."
      }
    ],
    searchWords: "lister listing my piece protected damaged renter compensation",
    linkName: 'p-lister',
    isShared: false,
    appearsIn: ['Care, Cleaning & Damage Policy', "A piece that is yours to keep"],
    orderIndex: 57
  },
];

export default CARE_ANSWERS;
