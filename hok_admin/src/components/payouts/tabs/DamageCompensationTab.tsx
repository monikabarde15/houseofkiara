import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Payout } from "../../../services/payoutApi";

const WhatsAppIcon = () => (
  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  </span>
);

interface DamageCompensationTabProps {
  payouts?: Payout[];
}

export default function DamageCompensationTab({ payouts = [] }: DamageCompensationTabProps) {
  const damagePayouts = payouts.filter(p => p.mode === 'Damage Comp.');

  return (
    <div className="space-y-4 text-xs font-sans">
      <div className="rounded-md border border-[#EFE0B8] bg-[#FDF6E3] px-5 py-3.5 text-[13px] leading-relaxed text-[#6b5a2e]">
        Damage compensation records are created automatically when a partial or full deposit deduction is processed on a returned rental. The lister is owed compensation because their piece was damaged during a customer's rental — HOK passes a portion of the deducted deposit to the lister, absorbing the rest.
      </div>

      {damagePayouts.length === 0 && (
        <div className="bg-white p-8 rounded-lg border border-stone-200/80 shadow-sm text-center text-stone-400">
          No damage compensation records pending approval.
        </div>
      )}

      {damagePayouts.map(r => (
        <DamageCompCard key={r.id} record={r} />
      ))}
    </div>
  );
}

function DamageCompCard({ record }: { record: Payout }) {
  const [compPct, setCompPct] = useState("60");
  const [compAmt, setCompAmt] = useState(record.listerShare.toString());
  const [approvedBy, setApprovedBy] = useState("Priya (Ops)");
  const [reason, setReason] = useState("Damage compensation generated automatically.");

  const handleApprove = () => {
    toast.success(`Approved compensation payout for ${record.listerName} — ${record.productName}`);
  };

  const transactionVal = record.transactionAmount || record.listerShare + record.hokCommission;

  return (
    <div className="overflow-hidden rounded-md border border-[#E7CBC0] bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-[#E7CBC0] bg-[#FCF0EE] px-6 py-4 text-sm">
        <span className="font-medium text-[#B45309]">{record.listerName}</span>
        <WhatsAppIcon />
        <span className="text-[#D4A574]">·</span>
        <span className="font-medium text-[#B45309]">{record.productName}</span>
        <span className="rounded bg-[#FEF3C7] px-2 py-0.5 text-xs font-semibold text-[#B45309]">Damage Comp.</span>
        <span className="ml-auto text-sm text-[#9A3412]">due {new Date(record.dueDate).toLocaleDateString()}</span>
      </div>

      <div className="p-6">
        <div className="mb-4 rounded-md border border-[#EFE8D8] bg-[#FAF5EB] p-3.5 text-xs leading-relaxed text-[#524B45]">
          Customer deposit deduction was applied for damage. Review the compensation split.
        </div>
        <p className="mb-1 text-xs font-semibold text-[#B88E36] hover:underline cursor-pointer">
          Related order: {record.orderId} →
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mt-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">TRANSACTION VALUE</label>
              <div className="text-2xl font-bold text-[#1E1412]">₹{transactionVal.toLocaleString('en-IN')}</div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">COMPENSATION %</label>
                  <input type="text" value={compPct} onChange={(e) => setCompPct(e.target.value)} className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">APPROVED BY</label>
              <select value={approvedBy} onChange={(e) => setApprovedBy(e.target.value)} className="w-full rounded-md border border-[#FBD38D] bg-[#FFFDF5] px-3 py-2 text-sm font-medium text-[#742A2A] focus:border-[#DD6B20] focus:outline-none">
                <option value="Priya (Ops)">Priya (Ops)</option>
              </select>
            </div>
            
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">REASON FOR THIS SPLIT</label>
              <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-md border border-[#FBD38D] bg-[#FFFDF5] p-3 text-sm text-[#742A2A] focus:border-[#DD6B20] focus:outline-none" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#DD6B20]">COMP. AMOUNT (₹)</label>
              <input type="text" value={compAmt} onChange={(e) => setCompAmt(e.target.value)} className="w-full rounded-md border border-transparent bg-[#FFFDF5] px-3 py-2 text-2xl font-bold text-[#DD6B20] focus:outline-none shadow-[0_0_0_1px_#DD6B20_inset]" />
            </div>

            <div className="flex gap-2 pt-2 mt-auto">
              <button className="flex-1 rounded-md border border-[#FBD38D] bg-white px-4 py-3 text-sm font-medium text-[#DD6B20] transition hover:bg-[#FFFDF5]">Hold</button>
              <button onClick={handleApprove} className="flex-1 rounded-md border border-transparent bg-[#9C4221] px-4 py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:bg-[#742A2A]">APPROVE COMP. ₹{Number(compAmt).toLocaleString('en-IN')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}