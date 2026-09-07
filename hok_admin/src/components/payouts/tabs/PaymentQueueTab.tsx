import React, { useState } from "react";
import { Payout } from "../../../services/payoutApi";
import * as payoutApi from "../../../services/payoutApi";
import toast from "react-hot-toast";

// Inline WhatsApp Icon Component
const WhatsAppIcon = () => (
  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  </span>
);

interface PaymentQueueTabProps {
  payouts?: Payout[];
  setPayouts?: React.Dispatch<React.SetStateAction<Payout[]>>;
  setPending?: React.Dispatch<React.SetStateAction<number>>;
  setPaid?: React.Dispatch<React.SetStateAction<number>>;
}

export default function PaymentQueueTab({ payouts = [], setPayouts, setPending, setPaid }: PaymentQueueTabProps) {
  const pendingPayouts = payouts.filter(p => p.status === 'Pending');

  const handleApprove = async (payout: Payout, amtStr: string, approvedBy: string) => {
    if (!setPayouts || !setPending || !setPaid) return;
    try {
      const updated = await payoutApi.markPaid(payout.id, { paidBy: approvedBy });
      setPayouts(prev => prev.map(p => p.id === payout.id ? updated : p));
      setPending(value => Math.max(0, value - updated.listerShare));
      setPaid(value => value + updated.listerShare);
      toast.success("Payout approved and marked as Paid.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to mark payout paid');
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">
        AWAITING APPROVAL ({pendingPayouts.length})
      </div>

      {pendingPayouts.length === 0 && (
        <div className="py-8 text-center text-sm text-stone-500">No pending payouts awaiting approval.</div>
      )}

      {pendingPayouts.map(payout => (
        <PayoutCard key={payout.id} payout={payout} onApprove={handleApprove} />
      ))}
    </div>
  );
}

function PayoutCard({ payout, onApprove }: { payout: Payout, onApprove: (payout: Payout, amtStr: string, approvedBy: string) => void }) {
  const [pct, setPct] = useState("55");
  const [amt, setAmt] = useState(payout.listerShare.toString());
  const [approvedBy, setApprovedBy] = useState("Priya (Ops)");
  const [reason, setReason] = useState("Automated pending payout generation for completed order.");

  const transactionAmt = payout.transactionAmount || (payout.listerShare + payout.hokCommission);
  const proposedHokCommission = transactionAmt - Number(amt);

  return (
    <div className="overflow-hidden rounded-md border border-[#E7E0D6] bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-[#E7E0D6] bg-white px-6 py-4 text-sm">
        <span className="font-medium text-[#B88E36]">{payout.listerName}</span>
        <WhatsAppIcon />
        <span className="text-stone-300">·</span>
        <span className="font-medium text-[#B88E36]">{payout.productName}</span>
        <span className="rounded bg-[#E6F4EA] px-2 py-0.5 text-xs font-semibold text-[#137333]">{payout.mode}</span>
        <span className="ml-auto text-sm text-[#78716C]">due {new Date(payout.dueDate).toLocaleDateString()}</span>
      </div>

      <div className="p-6">
        <p className="mb-3 text-xs text-[#78716C]">
          Order ID: <span className="font-medium text-[#B88E36]">{payout.orderId}</span>
        </p>

        <div className="mb-4 rounded-md border border-[#EFE8D8] bg-[#FAF5EB] p-3 text-xs leading-relaxed text-[#524B45]">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#8C827A]">DECISION CONTEXT</span>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-transparent outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">TRANSACTION VALUE</label>
              <div className="text-2xl font-bold text-[#1E1412]">₹{transactionAmt.toLocaleString('en-IN')}</div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">PAYOUT %</label>
              <input type="text" value={pct} onChange={(e) => setPct(e.target.value)} className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none" />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">APPROVED BY</label>
              <select value={approvedBy} onChange={(e) => setApprovedBy(e.target.value)} className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none">
                <option value="Soumya (Platform Admin)">Soumya (Platform Admin)</option>
                <option value="Rohit (Lister Ops)">Rohit (Lister Ops)</option>
                <option value="Admin User">Admin User</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">PAYOUT AMOUNT (₹)</label>
              <input type="text" value={amt} onChange={(e) => setAmt(e.target.value)} className="w-full rounded-md border-[#C39A38] bg-[#FAF8F5] px-3 py-2 text-2xl font-bold text-[#C39A38] focus:outline-none shadow-[0_0_0_1px_#C39A38]" />
            </div>

            <div className="rounded border border-[#E5DFD5] p-3 text-xs text-[#78716C] bg-[#FAFAFA]">
              <div className="flex justify-between border-b border-[#E5DFD5] pb-2 mb-2">
                <span>Proposed Payout Amount</span><span className="font-medium text-[#1E1412]">₹{Number(amt).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5DFD5] pb-2 mb-2">
                <span>Current HOK Commission</span><span className="font-medium text-[#1E1412]">₹{payout.hokCommission.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Proposed HOK Commission</span><span className="font-medium text-[#1E1412]">₹{proposedHokCommission.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button className="flex-1 rounded-md border border-[#E5DFD5] bg-white px-4 py-3 text-sm font-medium text-[#78716C] transition hover:bg-[#F8F5F1]">
                Save Draft
              </button>
              <button onClick={() => onApprove(payout, amt, approvedBy)} className="flex-1 rounded-md border border-transparent bg-[#1E1412] px-4 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-[#3E2923] shadow-md">
                APPROVE & PAY ₹{Number(amt).toLocaleString('en-IN')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}