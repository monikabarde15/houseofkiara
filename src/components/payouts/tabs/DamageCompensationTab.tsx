import React, { useState } from 'react';

// ============================================================
// WHATSAPP ICON — same glyph used across Payment Queue / All
// Payouts / By Product, kept local so this file can drop in
// standalone. If you've already centralized this in a shared
// components file, delete this copy and import that one instead.
// ============================================================
const WhatsAppIcon = () => (
  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  </span>
);

// ============================================================
// TYPES
// TODO(backend): replace DamageCompRecord + MOCK_DAMAGE_COMP with
// real data (filter your payouts source to type === 'Damage Comp.'
// and status === 'Pending Approval', same records that show up in
// the Payment Queue tab). This tab is just a focused, damage-comp-
// only view of the same underlying data.
// ============================================================
interface DamageCompRecord {
  id: string;
  listerName: string;
  productName: string;
  orderId: string;
  dueDate: string;
  transactionValue: number;
  standardPayoutPercent: string;
  standardPayoutAmount: string;
  hokCommissionRent: number;
  deductedFromCustomer: number;
  returnCondition: string;
  compensationToLister: string;   // editable — ₹ amount
  compensationPercent: string;    // editable — % of deduction
  reason: string;
  approvedBy: string;
}

// TODO(backend): swap for real fetched data
const MOCK_DAMAGE_COMP: DamageCompRecord[] = [
  {
    id: 'dc1',
    listerName: 'Meera Joshi',
    productName: 'Rajputana Silk Bridal Lehenga',
    orderId: 'HOK-ORD-008',
    dueDate: '24 Mar 2026',
    transactionValue: 16500,
    standardPayoutPercent: '55',
    standardPayoutAmount: '9075',
    hokCommissionRent: 7425,
    deductedFromCustomer: 15000,
    returnCondition: 'Minor embroidery tear on hem — agreed deduction per rental agreement',
    compensationToLister: '9000',
    compensationPercent: '60',
    reason: 'Rental #2 of piece. Customer caused embroidery tear. ₹15,000 deducted from deposit. 60% of deduction passed to Meera Joshi as damage compensation per HOK policy.',
    approvedBy: 'Priya (Ops)',
  },
];

export default function DamageCompensationTab() {
  // One editable-state object per record, keyed by record id, so
  // each card's inputs are independent even though they all render
  // from the same MOCK_DAMAGE_COMP list.
  const [edits, setEdits] = useState<Record<string, Pick<DamageCompRecord, 'compensationToLister' | 'compensationPercent' | 'reason' | 'approvedBy'>>>(
    Object.fromEntries(
      MOCK_DAMAGE_COMP.map(r => [r.id, {
        compensationToLister: r.compensationToLister,
        compensationPercent: r.compensationPercent,
        reason: r.reason,
        approvedBy: r.approvedBy,
      }])
    )
  );

  const updateEdit = (id: string, field: keyof (typeof edits)[string], value: string) => {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleApprove = (record: DamageCompRecord) => {
    // TODO(backend): submit edits[record.id] to your payout-approval endpoint.
    alert(`Approved compensation payout for ${record.listerName} — ${record.productName}`);
  };

  return (
    <div className="space-y-4 text-xs font-sans">

      {/* Explanatory banner */}
      <div className="rounded-md border border-[#EFE0B8] bg-[#FDF6E3] px-5 py-3.5 text-[13px] leading-relaxed text-[#6b5a2e]">
        Damage compensation records are created automatically when a partial or full deposit deduction is processed on a returned rental. The lister is owed compensation because their piece was damaged during a customer's rental — HOK passes a portion of the deducted deposit to the lister, absorbing the rest.
      </div>

      {MOCK_DAMAGE_COMP.length === 0 && (
        <div className="bg-white p-8 rounded-lg border border-stone-200/80 shadow-sm text-center text-stone-400">
          No damage compensation records pending approval.
        </div>
      )}

      {MOCK_DAMAGE_COMP.map((record) => {
        const edit = edits[record.id];

        // Live-computed figures, same formulas as the Payment Queue card:
        // HOK retains = deducted - compensation to lister
        // Total payout to lister = standard payout + compensation
        // Total to HOK = HOK commission (rent) + HOK retained
        const compAmount = Number(edit.compensationToLister) || 0;
        const hokRetains = record.deductedFromCustomer - compAmount;
        const totalPayoutToLister = Number(record.standardPayoutAmount) + compAmount;
        const totalToHok = record.hokCommissionRent + hokRetains;

        return (
          <div key={record.id} className="overflow-hidden rounded-md border border-[#E7E0D6] bg-white shadow-sm">

            {/* Card header */}
            <div className="flex flex-wrap items-center gap-2.5 border-b border-[#E7E0D6] bg-white px-6 py-4 text-sm">
              <span className="font-medium text-[#B88E36]">{record.listerName}</span>
              <WhatsAppIcon />
              <span className="text-stone-300">·</span>
              <span className="font-medium text-[#B88E36]">{record.productName}</span>
              <span className="rounded bg-[#EDE9FE] px-2 py-0.5 text-xs font-semibold text-[#5B21B6]">
                Damage Compensation
              </span>
              <span className="ml-auto text-sm text-[#78716C]">due {record.dueDate}</span>
            </div>

            <div className="p-6">
              {/* Context banner */}
              <div className="mb-4 rounded-md border border-[#EFE8D8] bg-[#FAF5EB] p-3.5 text-xs leading-relaxed text-[#524B45]">
                Customer deposit deduction of ₹{record.deductedFromCustomer.toLocaleString('en-IN')} was applied for damage. Standard payout for this rental would be ₹{Number(record.standardPayoutAmount).toLocaleString('en-IN')} ({record.standardPayoutPercent}% of ₹{record.transactionValue.toLocaleString('en-IN')}). Who keeps the deduction is your call below — lister compensation vs the repair cost HOK bears.
              </div>

              <p className="mb-1 text-xs font-semibold text-[#B88E36] hover:underline cursor-pointer">
                Related order: {record.orderId} →
              </p>
              <p className="mb-4 text-xs text-[#78716C]">
                Return condition: {record.returnCondition}
              </p>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                {/* Left column */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                      Transaction Value
                    </label>
                    <div className="text-2xl font-bold text-[#1E1412]">
                      ₹{record.transactionValue.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                          Standard Payout %
                        </label>
                        <div className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412]">
                          {record.standardPayoutPercent}
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                          Standard Payout (₹)
                        </label>
                        <div className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412]">
                          {record.standardPayoutAmount}
                        </div>
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-[#78716C]">
                      Rental #2 — type either side
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                      HOK Commission (Rent)
                    </label>
                    <div className="text-2xl font-bold text-[#1E1412]">
                      ₹{record.hokCommissionRent.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-3">
                  <div>
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                      Deduction — who keeps it
                    </span>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                      Deducted from customer
                    </div>
                    <div className="text-xl font-bold text-[#991B1B]">
                      ₹{record.deductedFromCustomer.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                        Compensation to Lister (₹)
                      </label>
                      <input
                        type="text"
                        value={edit.compensationToLister}
                        onChange={(e) => updateEdit(record.id, 'compensationToLister', e.target.value)}
                        className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                        ...or % of deduction
                      </label>
                      <input
                        type="text"
                        value={edit.compensationPercent}
                        onChange={(e) => updateEdit(record.id, 'compensationPercent', e.target.value)}
                        className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-[#78716C]">
                    Type either side · the rest covers costs HOK bears
                  </p>

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                      HOK retains (repair cost)
                    </div>
                    <div className="font-serif text-lg italic text-[#8C6B20]">
                      ₹{hokRetains.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <hr className="my-2 border-[#E7E0D6]" />

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                      Total payout to lister
                    </div>
                    <div className="font-serif text-xl font-semibold italic text-[#2D5A27]">
                      ₹{totalPayoutToLister.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                      Total to HOK (commission + retained)
                    </div>
                    <div className="font-serif text-lg italic text-[#1E1412]">
                      ₹{totalToHok.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                      Reason
                    </label>
                    <textarea
                      rows={3}
                      value={edit.reason}
                      onChange={(e) => updateEdit(record.id, 'reason', e.target.value)}
                      className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] p-3 text-sm text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-[#78716C]">
                      Updates with the numbers until you edit it yourself
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                      Approved by
                    </label>
                    <select
                      value={edit.approvedBy}
                      onChange={(e) => updateEdit(record.id, 'approvedBy', e.target.value)}
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
              <button
                onClick={() => handleApprove(record)}
                className="rounded-md bg-[#C39A38] px-4 py-1.5 text-sm font-semibold text-[#1E1412] shadow-sm transition-colors hover:bg-[#B38A28]"
              >
                Approve Compensation Payout
              </button>
            </div>
          </div>
        );
      })}

    </div>
  );
}