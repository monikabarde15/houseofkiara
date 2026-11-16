import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Payout } from "../../../services/payoutApi";
import * as payoutApi from "../../../services/payoutApi";
import { Order } from "../../../types";

const WhatsAppIcon = ({ onClick }: { onClick?: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    title="WhatsApp Lister"
    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm cursor-pointer hover:opacity-90"
  >
    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  </button>
);

interface DamageCompensationTabProps {
  payouts?: Payout[];
  orders?: Order[];
  listers?: any[];
  setPayouts?: React.Dispatch<React.SetStateAction<Payout[]>>;
  setPending?: React.Dispatch<React.SetStateAction<number>>;
  setPaid?: React.Dispatch<React.SetStateAction<number>>;
  onSelectOrder?: (orderId: string) => void;
  onSelectLister?: (listerId: string) => void;
}

const formatDateLabel = (raw?: string) => {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function DamageCompensationTab({
  payouts = [],
  orders = [],
  listers = [],
  setPayouts,
  setPending,
  setPaid,
  onSelectOrder,
  onSelectLister,
}: DamageCompensationTabProps) {
  const damagePayouts = payouts.filter(
    (p) => p.mode === "Damage Comp." || p.mode === "Damage Compensation",
  );
  const [assignees, setAssignees] = useState<string[]>(["Priya (Ops)"]);

  useEffect(() => {
    payoutApi
      .getAdmins()
      .then((admins) => {
        const uniqueNames = Array.from(
          new Set(admins.map((a) => a.name).filter(Boolean)),
        );
        if (uniqueNames.length > 0) setAssignees(uniqueNames);
      })
      .catch(() => {});
  }, []);

  const openWhatsApp = (listerName: string, listerId?: string) => {
    const match = listers.find(
      (l: any) =>
        (listerId && (l.id === listerId || l.listerId === listerId)) ||
        (l.name && l.name.toLowerCase() === (listerName || "").toLowerCase()),
    );
    const digits = String(match?.phone || match?.whatsapp || "").replace(/\D/g, "");
    const cleanPhone =
      digits.length === 10 ? `91${digits}` : digits.length > 10 ? digits : "";
    const msg = encodeURIComponent(
      `Hi ${listerName}, writing from House of Kaira regarding your damage compensation payout.`,
    );
    window.open(
      cleanPhone ? `https://wa.me/${cleanPhone}?text=${msg}` : `https://wa.me/?text=${msg}`,
      "_blank",
    );
  };

  const handleApprove = async (
    record: Payout,
    compAmtNum: number,
    compPctNum: number,
    hokRetainsNum: number,
    approvedBy: string,
    reason: string,
  ) => {
    if (!setPayouts || !setPending || !setPaid) return;
    try {
      const updated = await payoutApi.markPaid(record.id, {
        paidBy: approvedBy,
        notes: reason,
        listerShare: compAmtNum,
        payoutPercentage: compPctNum,
        hokCommission: hokRetainsNum,
      });
      setPayouts((prev) => prev.map((p) => (p.id === record.id ? updated : p)));
      setPending((value) =>
        Math.max(0, value - (record.listerShare || compAmtNum)),
      );
      setPaid((value) => value + (updated.listerShare || compAmtNum));
      toast.success("Compensation payout approved and marked Paid!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to approve compensation payout",
      );
    }
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Explanatory banner */}
      <div className="rounded-md border border-[#EFE0B8] bg-[#FDF6E3] px-5 py-3.5 text-[13px] leading-relaxed text-[#6b5a2e]">
        Damage compensation records are created automatically when a partial or
        full deposit deduction is processed on a returned rental. The lister is
        owed compensation because their piece was damaged during a customer's
        rental — HOK passes a portion of the deducted deposit to the lister,
        absorbing the rest.
      </div>

      {damagePayouts.length === 0 && (
        <div className="bg-white p-8 rounded-lg border border-stone-200/80 shadow-sm text-center text-stone-400">
          No damage compensation records pending approval.
        </div>
      )}

      {damagePayouts.map((record) => {
        const matchedOrder: any = orders.find(
          (o: any) =>
            o.id === record.orderId ||
            o.orderId === record.orderId ||
            o.orderNumber === record.orderId,
        );
        const companionRental = payouts.find(
          (p) =>
            p.orderId === record.orderId &&
            p.id !== record.id &&
            p.mode !== "Damage Comp." &&
            p.mode !== "Damage Compensation",
        );

        return (
          <DamageCompCard
            key={record.id}
            record={record}
            matchedOrder={matchedOrder}
            companionRental={companionRental}
            assignees={assignees}
            onApprove={handleApprove}
            onWhatsApp={() => openWhatsApp(record.listerName, record.listerId)}
            onSelectOrder={onSelectOrder}
            onSelectLister={onSelectLister}
          />
        );
      })}
    </div>
  );
}

function DamageCompCard({
  record,
  matchedOrder,
  companionRental,
  assignees,
  onApprove,
  onWhatsApp,
  onSelectOrder,
  onSelectLister,
}: {
  record: Payout;
  matchedOrder?: any;
  companionRental?: Payout;
  assignees: string[];
  onApprove: (
    record: Payout,
    compAmtNum: number,
    compPctNum: number,
    hokRetainsNum: number,
    approvedBy: string,
    reason: string,
  ) => void;
  onWhatsApp: () => void;
  onSelectOrder?: (orderId: string) => void;
  onSelectLister?: (listerId: string) => void;
}) {
  const deductedFromCustomer =
    Number(matchedOrder?.depositDecision?.deductedAmount) ||
    Number(record.transactionAmount) ||
    (Number(record.listerShare) || 0) + (Number(record.hokCommission) || 0);

  const transactionValue =
    Number(companionRental?.transactionAmount) ||
    Number(matchedOrder?.amount) ||
    Number(matchedOrder?.orderValue) ||
    deductedFromCustomer;

  const standardPayoutPercent = companionRental?.payoutPercentage || 55;
  const standardPayoutAmount =
    Number(companionRental?.listerShare) ||
    Math.round(transactionValue * (standardPayoutPercent / 100));
  const hokCommissionRent = Math.max(0, transactionValue - standardPayoutAmount);

  const initCompAmt =
    Number(record.listerShare) || Math.round(deductedFromCustomer * 0.6);
  const initCompPct =
    deductedFromCustomer > 0
      ? Math.round((initCompAmt / deductedFromCustomer) * 100)
      : 60;

  const returnCondition =
    matchedOrder?.returnCondition?.notes ||
    matchedOrder?.depositDecision?.reason ||
    "Damage recorded on return — agreed deduction per rental agreement";

  const [compensationToLister, setCompensationToLister] = useState(
    String(initCompAmt),
  );
  const [compensationPercent, setCompensationPercent] = useState(
    String(initCompPct),
  );
  const [reason, setReason] = useState(
    record.notes ||
      `Customer deposit deduction of ₹${deductedFromCustomer.toLocaleString("en-IN")}. ${initCompPct}% of deduction passed to ${record.listerName} as damage compensation per HOK policy.`,
  );
  const [approvedBy, setApprovedBy] = useState(
    record.submissionAssignedTo && record.submissionAssignedTo !== "Unassigned"
      ? record.submissionAssignedTo
      : assignees[0] || "Priya (Ops)",
  );

  const handleAmtChange = (val: string) => {
    setCompensationToLister(val);
    const num = parseFloat(val.replace(/,/g, ""));
    if (!isNaN(num) && deductedFromCustomer > 0) {
      setCompensationPercent(
        String(Math.round((num / deductedFromCustomer) * 100)),
      );
    }
  };

  const handlePctChange = (val: string) => {
    setCompensationPercent(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setCompensationToLister(
        String(Math.round(deductedFromCustomer * (num / 100))),
      );
    }
  };

  const compAmount = Number(String(compensationToLister).replace(/,/g, "")) || 0;
  const compPctNum = Number(compensationPercent) || 0;
  const hokRetains = Math.max(0, deductedFromCustomer - compAmount);
  const totalPayoutToLister = standardPayoutAmount + compAmount;
  const totalToHok = hokCommissionRent + hokRetains;

  return (
    <div className="overflow-hidden rounded-md border border-[#E7E0D6] bg-white shadow-sm">
      {/* Card header */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-[#E7E0D6] bg-white px-6 py-4 text-sm">
        <button
          type="button"
          onClick={() => onSelectLister?.(record.listerId || record.listerName)}
          className="font-medium text-[#B88E36] hover:underline cursor-pointer"
        >
          {record.listerName}
        </button>
        <WhatsAppIcon onClick={onWhatsApp} />
        <span className="text-stone-300">·</span>
        <span className="font-medium text-[#B88E36]">{record.productName}</span>
        <span className="rounded bg-[#EDE9FE] px-2 py-0.5 text-xs font-semibold text-[#5B21B6]">
          Damage Compensation
        </span>
        <span className="ml-auto text-sm text-[#78716C]">
          due {formatDateLabel(record.dueDate)}
        </span>
      </div>

      <div className="p-6">
        {/* Context banner */}
        <div className="mb-4 rounded-md border border-[#EFE8D8] bg-[#FAF5EB] p-3.5 text-xs leading-relaxed text-[#524B45]">
          Customer deposit deduction of ₹
          {deductedFromCustomer.toLocaleString("en-IN")} was applied for damage.
          Standard payout for this rental would be ₹
          {standardPayoutAmount.toLocaleString("en-IN")} (
          {standardPayoutPercent}% of ₹
          {transactionValue.toLocaleString("en-IN")}). Who keeps the deduction
          is your call below — lister compensation vs the repair cost HOK bears.
        </div>

        <p
          onClick={() => onSelectOrder?.(record.orderId)}
          className="mb-1 text-xs font-semibold text-[#B88E36] hover:underline cursor-pointer"
        >
          Related order: {record.orderId} →
        </p>
        <p className="mb-4 text-xs text-[#78716C]">
          Return condition: {returnCondition}
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left column */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                Transaction Value
              </label>
              <div className="text-2xl font-bold text-[#1E1412]">
                ₹{transactionValue.toLocaleString("en-IN")}
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                    Standard Payout %
                  </label>
                  <div className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412]">
                    {standardPayoutPercent}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                    Standard Payout (₹)
                  </label>
                  <div className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412]">
                    {standardPayoutAmount}
                  </div>
                </div>
              </div>
              <p className="mt-1.5 text-xs text-[#78716C]">
                Standard rental split
              </p>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                HOK Commission (Rent)
              </label>
              <div className="text-2xl font-bold text-[#1E1412]">
                ₹{hokCommissionRent.toLocaleString("en-IN")}
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
                ₹{deductedFromCustomer.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  Compensation to Lister (₹)
                </label>
                <input
                  type="text"
                  value={compensationToLister}
                  onChange={(e) => handleAmtChange(e.target.value)}
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  ...or % of deduction
                </label>
                <input
                  type="text"
                  value={compensationPercent}
                  onChange={(e) => handlePctChange(e.target.value)}
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
                ₹{hokRetains.toLocaleString("en-IN")}
              </div>
            </div>

            <hr className="my-2 border-[#E7E0D6]" />

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                Total payout to lister
              </div>
              <div className="font-serif text-xl font-semibold italic text-[#2D5A27]">
                ₹{totalPayoutToLister.toLocaleString("en-IN")}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                Total to HOK (commission + retained)
              </div>
              <div className="font-serif text-lg italic text-[#1E1412]">
                ₹{totalToHok.toLocaleString("en-IN")}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                Reason
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
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
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
              >
                {assignees.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t border-[#E7E0D6] bg-[#FAF8F5] px-6 py-3.5">
        {record.status === "Paid" ? (
          <span className="rounded bg-[#E6F5E7] px-3 py-1.5 text-xs font-semibold text-[#5A8A4E]">
            Approved & Paid
          </span>
        ) : (
          <button
            type="button"
            onClick={() =>
              onApprove(
                record,
                compAmount,
                compPctNum,
                hokRetains,
                approvedBy,
                reason,
              )
            }
            className="rounded-md bg-[#C39A38] px-4 py-1.5 text-sm font-semibold text-[#1E1412] shadow-sm transition-colors hover:bg-[#B38A28] cursor-pointer"
          >
            Approve Compensation Payout
          </button>
        )}
      </div>
    </div>
  );
}
