import React, { useState } from "react";

// Inline WhatsApp Icon Component
const WhatsAppIcon = () => (
  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  </span>
);

export default function PaymentQueueTab() {
  // State for interactive inputs across cards
  const [card1, setCard1] = useState({
    pct: "55",
    amt: "4675",
    reason:
      "Third rental of this piece — condition holding well, minor wear noted. Standard progressive decrease applied.",
    approvedBy: "Priya (Ops)",
  });

  const [card2, setCard2] = useState({
    stdPct: "55",
    stdAmt: "9075",
    compAmt: "9000",
    compPct: "60",
    reason:
      "Rental #2 of piece. Customer caused embroidery tear. ₹15,000 deducted from deposit. 60% of deduction passed to Meera Joshi as damage compensation per HOK policy.",
    approvedBy: "Priya (Ops)",
  });

  const [card3, setCard3] = useState({
    pct: "60",
    amt: "3900",
    reason:
      "First rental — standard first-rental default applied, no adjustments needed.",
    approvedBy: "Priya (Ops)",
  });

  const [card4, setCard4] = useState({
    pct: "55",
    amt: "4675",
    reason:
      "Fourth rental of this piece — returned in excellent condition, no wear beyond standard. Standard progressive rate applied.",
    approvedBy: "Priya (Ops)",
  });

  const [card5, setCard5] = useState({
    pct: "75",
    amt: "71250",
    reason: "Preloved sale — standard 75% lister split applied.",
    approvedBy: "Priya (Ops)",
  });

  return (
    <div className="space-y-6 pt-2">
      {/* Header Label */}
      <div className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">
        AWAITING APPROVAL (5)
      </div>

      {/* CARD 1: Crimson Zardozi Bridal Lehenga (Rental #3) */}
      <div className="overflow-hidden rounded-md border border-[#E7E0D6] bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[#E7E0D6] bg-white px-6 py-4 text-sm">
          <span className="font-medium text-[#B88E36]">Meera Joshi</span>
          <WhatsAppIcon />
          <span className="text-stone-300">·</span>
          <span className="font-medium text-[#B88E36]">
            Crimson Zardozi Bridal Lehenga
          </span>
          <span className="rounded bg-[#E6F4EA] px-2 py-0.5 text-xs font-semibold text-[#137333]">
            Rental
          </span>
          <span className="ml-auto text-sm text-[#78716C]">due 24 Mar 2026</span>
        </div>

        <div className="p-6">
          <p className="mb-3 text-xs text-[#78716C]">
            Rental #3 of this product ·{" "}
            <span className="font-medium text-[#B88E36]">HOK-ORD-001</span>
          </p>

          <div className="mb-4 rounded-md border border-[#EFE8D8] bg-[#FAF5EB] p-3 text-xs leading-relaxed text-[#524B45]">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#8C827A]">
              DECISION CONTEXT
            </span>
            Last split <strong className="text-[#1E1412]">55%</strong> (Rental #4 · 29 Mar 2026) · piece avg{" "}
            <strong className="text-[#1E1412]">59%</strong> across 4 · default{" "}
            <strong className="text-[#1E1412]">45%</strong> · condition Excellent · rented{" "}
            <strong className="text-[#1E1412]">6×</strong>
          </div>

          <p className="mb-5 text-xs text-[#78716C]">
            Order: <strong className="font-semibold text-[#1E1412]">Returned</strong> · Deposit:{" "}
            <strong className="font-semibold text-[#1E1412]">Released</strong>
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  TRANSACTION VALUE
                </label>
                <div className="text-2xl font-bold text-[#1E1412]">₹8,500</div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  PAYOUT %
                </label>
                <input
                  type="text"
                  value={card1.pct}
                  onChange={(e) => setCard1({ ...card1, pct: e.target.value })}
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-[#78716C]">
                  Suggested — type either the % or the ₹ below (piece default 45%)
                </p>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  APPROVED BY
                </label>
                <select
                  value={card1.approvedBy}
                  onChange={(e) =>
                    setCard1({ ...card1, approvedBy: e.target.value })
                  }
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                >
                  <option value="Priya (Ops)">Priya (Ops)</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                    PAYOUT AMOUNT (₹)
                  </label>
                  <input
                    type="text"
                    value={card1.amt}
                    onChange={(e) =>
                      setCard1({ ...card1, amt: e.target.value })
                    }
                    className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-lg font-bold text-[#2D6A4F] focus:border-[#C39A38] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                    HOK COMMISSION
                  </label>
                  <div className="text-2xl font-bold text-[#1E1412]">
                    ₹3,825
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  REASON FOR THIS SPLIT
                </label>
                <textarea
                  rows={3}
                  value={card1.reason}
                  onChange={(e) =>
                    setCard1({ ...card1, reason: e.target.value })
                  }
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] p-3 text-sm text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                />
                <p className="mt-1 text-xs text-[#78716C]">
                  Updates with the numbers until you edit it yourself
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[#E7E0D6] bg-[#FAF8F5] px-6 py-3.5">
          <button className="rounded-md border border-[#E5DFD5] bg-white px-4 py-1.5 text-sm font-medium text-[#1E1412] shadow-sm hover:bg-stone-50">
            Hold
          </button>
          <button className="rounded-md bg-[#C39A38] px-4 py-1.5 text-sm font-semibold text-[#1E1412] shadow-sm transition-colors hover:bg-[#B38A28]">
            Approve Payout
          </button>
        </div>
      </div>

      {/* CARD 2: Rajputana Silk Bridal Lehenga (Damage Compensation) */}
      <div className="overflow-hidden rounded-md border border-[#E7E0D6] bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[#E7E0D6] bg-white px-6 py-4 text-sm">
          <span className="font-medium text-[#B88E36]">Meera Joshi</span>
          <WhatsAppIcon />
          <span className="text-stone-300">·</span>
          <span className="font-medium text-[#B88E36]">
            Rajputana Silk Bridal Lehenga
          </span>
          <span className="rounded bg-[#EDE9FE] px-2 py-0.5 text-xs font-semibold text-[#5B21B6]">
            Damage Compensation
          </span>
          <span className="ml-auto text-sm text-[#78716C]">due 24 Mar 2026</span>
        </div>

        <div className="p-6">
          <div className="mb-4 rounded-md border border-[#EFE8D8] bg-[#FAF5EB] p-3.5 text-xs leading-relaxed text-[#524B45]">
            Customer deposit deduction of ₹15,000 was applied for damage. Standard payout for Rental #2 would be ₹9,075 (55% of ₹16,500). Who keeps the deduction is your call below — lister compensation vs the repair cost HOK bears.
          </div>

          <p className="mb-1 text-xs font-semibold text-[#B88E36] hover:underline cursor-pointer">
            Related order: HOK-ORD-008 →
          </p>
          <p className="mb-4 text-xs text-[#78716C]">
            Return condition: Minor embroidery tear on hem — agreed deduction per rental agreement
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  TRANSACTION VALUE
                </label>
                <div className="text-2xl font-bold text-[#1E1412]">₹16,500</div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                      STANDARD PAYOUT %
                    </label>
                    <input
                      type="text"
                      value={card2.stdPct}
                      onChange={(e) =>
                        setCard2({ ...card2, stdPct: e.target.value })
                      }
                      className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                      STANDARD PAYOUT (₹)
                    </label>
                    <input
                      type="text"
                      value={card2.stdAmt}
                      onChange={(e) =>
                        setCard2({ ...card2, stdAmt: e.target.value })
                      }
                      className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                    />
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-[#78716C]">
                  Rental #2 — type either side
                </p>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  HOK COMMISSION (RENT)
                </label>
                <div className="text-2xl font-bold text-[#1E1412]">₹7,425</div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <div>
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  DEDUCTION — WHO KEEPS IT
                </span>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  DEDUCTED FROM CUSTOMER
                </div>
                <div className="text-xl font-bold text-[#991B1B]">₹15,000</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                    COMPENSATION TO LISTER (₹)
                  </label>
                  <input
                    type="text"
                    value={card2.compAmt}
                    onChange={(e) =>
                      setCard2({ ...card2, compAmt: e.target.value })
                    }
                    className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                    ...OR % OF DEDUCTION
                  </label>
                  <input
                    type="text"
                    value={card2.compPct}
                    onChange={(e) =>
                      setCard2({ ...card2, compPct: e.target.value })
                    }
                    className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-xs text-[#78716C]">
                Type either side · the rest covers costs HOK bears
              </p>

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  HOK RETAINS (REPAIR COST)
                </div>
                <div className="font-serif text-lg italic text-[#8C6B20]">
                  ₹6,000
                </div>
              </div>

              <hr className="my-2 border-[#E7E0D6]" />

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  TOTAL PAYOUT TO LISTER
                </div>
                <div className="font-serif text-xl font-semibold italic text-[#2D5A27]">
                  ₹18,075
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  TOTAL TO HOK (COMMISSION + RETAINED)
                </div>
                <div className="font-serif text-lg italic text-[#1E1412]">
                  ₹13,425
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  REASON
                </label>
                <textarea
                  rows={3}
                  value={card2.reason}
                  onChange={(e) =>
                    setCard2({ ...card2, reason: e.target.value })
                  }
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] p-3 text-sm text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                />
                <p className="mt-1 text-xs text-[#78716C]">
                  Updates with the numbers until you edit it yourself
                </p>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  APPROVED BY
                </label>
                <select
                  value={card2.approvedBy}
                  onChange={(e) =>
                    setCard2({ ...card2, approvedBy: e.target.value })
                  }
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                >
                  <option value="Priya (Ops)">Priya (Ops)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#E7E0D6] bg-[#FAF8F5] px-6 py-3.5">
          <button className="rounded-md bg-[#C39A38] px-4 py-1.5 text-sm font-semibold text-[#1E1412] shadow-sm transition-colors hover:bg-[#B38A28]">
            Approve Compensation Payout
          </button>
        </div>
      </div>

      {/* CARD 3: Rose Georgette Anarkali (Warning Banner) */}
      <div className="overflow-hidden rounded-md border border-[#E7E0D6] bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[#E7E0D6] bg-white px-6 py-4 text-sm">
          <span className="font-medium text-[#B88E36]">Aishwarya Sharma</span>
          <WhatsAppIcon />
          <span className="text-stone-300">·</span>
          <span className="font-medium text-[#B88E36]">
            Rose Georgette Anarkali
          </span>
          <span className="rounded bg-[#E6F4EA] px-2 py-0.5 text-xs font-semibold text-[#137333]">
            Rental
          </span>
          <span className="ml-auto text-sm text-[#78716C]">due 28 Mar 2026</span>
        </div>

        <div className="p-6">
          <p className="mb-3 text-xs text-[#78716C]">
            Rental #1 of this product ·{" "}
            <span className="font-medium text-[#B88E36]">HOK-ORD-003</span>
          </p>

          <div className="mb-4 rounded-md border border-[#EFE8D8] bg-[#FAF5EB] p-3 text-xs leading-relaxed text-[#524B45]">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#8C827A]">
              DECISION CONTEXT
            </span>
            Last split <strong className="text-[#1E1412]">60%</strong> (Rental #1 · 28 Mar 2026) · default{" "}
            <strong className="text-[#1E1412]">40%</strong> · condition Good · rented{" "}
            <strong className="text-[#1E1412]">5×</strong>
          </div>

          <div className="mb-5 rounded-md border border-[#F87171]/40 bg-[#FDF2F2] p-3 text-xs font-medium text-[#991B1B]">
            ⚠ <strong>Not safe to pay yet.</strong> Piece not back yet — order is Shipped. Order:{" "}
            <strong>Shipped</strong> · Deposit: <strong>Held</strong>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  TRANSACTION VALUE
                </label>
                <div className="text-2xl font-bold text-[#1E1412]">₹6,500</div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  PAYOUT %
                </label>
                <input
                  type="text"
                  value={card3.pct}
                  onChange={(e) => setCard3({ ...card3, pct: e.target.value })}
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-[#78716C]">
                  Suggested — type either the % or the ₹ below (piece default 40%)
                </p>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  APPROVED BY
                </label>
                <select
                  value={card3.approvedBy}
                  onChange={(e) =>
                    setCard3({ ...card3, approvedBy: e.target.value })
                  }
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                >
                  <option value="Priya (Ops)">Priya (Ops)</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                    PAYOUT AMOUNT (₹)
                  </label>
                  <input
                    type="text"
                    value={card3.amt}
                    onChange={(e) =>
                      setCard3({ ...card3, amt: e.target.value })
                    }
                    className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-lg font-bold text-[#2D6A4F] focus:border-[#C39A38] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                    HOK COMMISSION
                  </label>
                  <div className="text-2xl font-bold text-[#1E1412]">
                    ₹2,600
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  REASON FOR THIS SPLIT
                </label>
                <textarea
                  rows={3}
                  value={card3.reason}
                  onChange={(e) =>
                    setCard3({ ...card3, reason: e.target.value })
                  }
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] p-3 text-sm text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                />
                <p className="mt-1 text-xs text-[#78716C]">
                  Updates with the numbers until you edit it yourself
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[#E7E0D6] bg-[#FAF8F5] px-6 py-3.5">
          <button className="rounded-md border border-[#E5DFD5] bg-white px-4 py-1.5 text-sm font-medium text-[#1E1412] shadow-sm hover:bg-stone-50">
            Hold
          </button>
          <button className="rounded-md bg-[#C39A38] px-4 py-1.5 text-sm font-semibold text-[#1E1412] shadow-sm transition-colors hover:bg-[#B38A28]">
            Approve Payout
          </button>
        </div>
      </div>

      {/* CARD 4: Crimson Zardozi Bridal Lehenga (Rental #4) */}
      <div className="overflow-hidden rounded-md border border-[#E7E0D6] bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[#E7E0D6] bg-white px-6 py-4 text-sm">
          <span className="font-medium text-[#B88E36]">Meera Joshi</span>
          <WhatsAppIcon />
          <span className="text-stone-300">·</span>
          <span className="font-medium text-[#B88E36]">
            Crimson Zardozi Bridal Lehenga
          </span>
          <span className="rounded bg-[#E6F4EA] px-2 py-0.5 text-xs font-semibold text-[#137333]">
            Rental
          </span>
          <span className="ml-auto text-sm text-[#78716C]">due 29 Mar 2026</span>
        </div>

        <div className="p-6">
          <p className="mb-3 text-xs text-[#78716C]">
            Rental #4 of this product ·{" "}
            <span className="font-medium text-[#B88E36]">HOK-ORD-009</span>
          </p>

          <div className="mb-4 rounded-md border border-[#EFE8D8] bg-[#FAF5EB] p-3 text-xs leading-relaxed text-[#524B45]">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#8C827A]">
              DECISION CONTEXT
            </span>
            Last split <strong className="text-[#1E1412]">55%</strong> (Rental #4 · 29 Mar 2026) · piece avg{" "}
            <strong className="text-[#1E1412]">59%</strong> across 4 · default{" "}
            <strong className="text-[#1E1412]">45%</strong> · condition Excellent · rented{" "}
            <strong className="text-[#1E1412]">6×</strong>
          </div>

          <p className="mb-5 text-xs text-[#78716C]">
            Order: <strong className="font-semibold text-[#1E1412]">Partially Returned</strong> · Deposit:{" "}
            <strong className="font-semibold text-[#1E1412]">Partially Released</strong>
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  TRANSACTION VALUE
                </label>
                <div className="text-2xl font-bold text-[#1E1412]">₹8,500</div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  PAYOUT %
                </label>
                <input
                  type="text"
                  value={card4.pct}
                  onChange={(e) => setCard4({ ...card4, pct: e.target.value })}
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-[#78716C]">
                  Suggested — type either the % or the ₹ below (piece default 45%)
                </p>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  APPROVED BY
                </label>
                <select
                  value={card4.approvedBy}
                  onChange={(e) =>
                    setCard4({ ...card4, approvedBy: e.target.value })
                  }
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                >
                  <option value="Priya (Ops)">Priya (Ops)</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                    PAYOUT AMOUNT (₹)
                  </label>
                  <input
                    type="text"
                    value={card4.amt}
                    onChange={(e) =>
                      setCard4({ ...card4, amt: e.target.value })
                    }
                    className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-lg font-bold text-[#2D6A4F] focus:border-[#C39A38] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                    HOK COMMISSION
                  </label>
                  <div className="text-2xl font-bold text-[#1E1412]">
                    ₹3,825
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  REASON FOR THIS SPLIT
                </label>
                <textarea
                  rows={3}
                  value={card4.reason}
                  onChange={(e) =>
                    setCard4({ ...card4, reason: e.target.value })
                  }
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] p-3 text-sm text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                />
                <p className="mt-1 text-xs text-[#78716C]">
                  Updates with the numbers until you edit it yourself
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[#E7E0D6] bg-[#FAF8F5] px-6 py-3.5">
          <button className="rounded-md border border-[#E5DFD5] bg-white px-4 py-1.5 text-sm font-medium text-[#1E1412] shadow-sm hover:bg-stone-50">
            Hold
          </button>
          <button className="rounded-md bg-[#C39A38] px-4 py-1.5 text-sm font-semibold text-[#1E1412] shadow-sm transition-colors hover:bg-[#B38A28]">
            Approve Payout
          </button>
        </div>
      </div>

      {/* CARD 5: Gulabi Silk Bridal Lehenga (Preloved Sale) */}
      <div className="overflow-hidden rounded-md border border-[#E7E0D6] bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[#E7E0D6] bg-white px-6 py-4 text-sm">
          <span className="font-medium text-[#B88E36]">Meera Joshi</span>
          <WhatsAppIcon />
          <span className="text-stone-300">·</span>
          <span className="font-medium text-[#B88E36]">
            Gulabi Silk Bridal Lehenga
          </span>
          <span className="rounded bg-[#FDF3E7] px-2 py-0.5 text-xs font-semibold text-[#9A3412]">
            Preloved
          </span>
          <span className="ml-auto text-sm text-[#78716C]">due 29 Mar 2026</span>
        </div>

        <div className="p-6">
          <p className="mb-3 text-xs text-[#78716C]">
            Preloved sale of this piece ·{" "}
            <span className="font-medium text-[#B88E36]">HOK-ORD-009</span>
          </p>

          <div className="mb-4 rounded-md border border-[#EFE8D8] bg-[#FAF5EB] p-3 text-xs leading-relaxed text-[#524B45]">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#8C827A]">
              DECISION CONTEXT
            </span>
            Last split <strong className="text-[#1E1412]">75%</strong> ( · 29 Mar 2026) · default{" "}
            <strong className="text-[#1E1412]">40%</strong> · condition Excellent · rented{" "}
            <strong className="text-[#1E1412]">4×</strong>
          </div>

          <div className="mb-5 rounded-md border border-[#F87171]/40 bg-[#FDF2F2] p-3 text-xs font-medium text-[#991B1B]">
            ⚠ <strong>Not safe to pay yet.</strong> Sale not delivered yet. Order:{" "}
            <strong>Partially Returned</strong> · Deposit: <strong>Partially Released</strong>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  TRANSACTION VALUE
                </label>
                <div className="text-2xl font-bold text-[#1E1412]">
                  ₹95,000
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  PAYOUT %
                </label>
                <input
                  type="text"
                  value={card5.pct}
                  onChange={(e) => setCard5({ ...card5, pct: e.target.value })}
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-[#78716C]">
                  Suggested — type either the % or the ₹ below (piece default 75%)
                </p>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  APPROVED BY
                </label>
                <select
                  value={card5.approvedBy}
                  onChange={(e) =>
                    setCard5({ ...card5, approvedBy: e.target.value })
                  }
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                >
                  <option value="Priya (Ops)">Priya (Ops)</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                    PAYOUT AMOUNT (₹)
                  </label>
                  <input
                    type="text"
                    value={card5.amt}
                    onChange={(e) =>
                      setCard5({ ...card5, amt: e.target.value })
                    }
                    className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-lg font-bold text-[#2D6A4F] focus:border-[#C39A38] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                    HOK COMMISSION
                  </label>
                  <div className="text-2xl font-bold text-[#1E1412]">
                    ₹23,750
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  REASON FOR THIS SPLIT
                </label>
                <textarea
                  rows={3}
                  value={card5.reason}
                  onChange={(e) =>
                    setCard5({ ...card5, reason: e.target.value })
                  }
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] p-3 text-sm text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                />
                <p className="mt-1 text-xs text-[#78716C]">
                  Updates with the numbers until you edit it yourself
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[#E7E0D6] bg-[#FAF8F5] px-6 py-3.5">
          <button className="rounded-md border border-[#E5DFD5] bg-white px-4 py-1.5 text-sm font-medium text-[#1E1412] shadow-sm hover:bg-stone-50">
            Hold
          </button>
          <button className="rounded-md bg-[#C39A38] px-4 py-1.5 text-sm font-semibold text-[#1E1412] shadow-sm transition-colors hover:bg-[#B38A28]">
            Approve Payout
          </button>
        </div>
      </div>
    </div>
  );
}