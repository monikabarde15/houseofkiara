import React, { useState, useEffect, useMemo } from "react";
import { Payout } from "../../../services/payoutApi";
import * as payoutApi from "../../../services/payoutApi";
import { Order, Product } from "../../../types";
import toast from "react-hot-toast";

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

interface PaymentQueueTabProps {
  payouts?: Payout[];
  orders?: Order[];
  products?: Product[];
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

export default function PaymentQueueTab({
  payouts = [],
  orders = [],
  products = [],
  listers = [],
  setPayouts,
  setPending,
  setPaid,
  onSelectOrder,
  onSelectLister,
}: PaymentQueueTabProps) {
  const pendingPayouts = useMemo(
    () =>
      payouts.filter(
        (p) => p.status === "Pending" || p.status === "Pending Approval",
      ),
    [payouts],
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

  // Compute chronological rental index per product across all rental payouts
  const rentalNumberById = useMemo(() => {
    const map: Record<string, number> = {};
    const byProduct: Record<string, Payout[]> = {};
    payouts
      .filter((p) => {
        const m = String(p.mode || "").toLowerCase();
        return !m.includes("damage") && !m.includes("preloved") && !m.includes("buy");
      })
      .forEach((p) => {
        const key = (p.productName || p.productId || "piece").toLowerCase();
        if (!byProduct[key]) byProduct[key] = [];
        byProduct[key].push(p);
      });
    Object.values(byProduct).forEach((arr) => {
      arr
        .slice()
        .sort(
          (a, b) =>
            new Date(a.dueDate || a.createdAt || 0).getTime() -
            new Date(b.dueDate || b.createdAt || 0).getTime(),
        )
        .forEach((p, idx) => {
          map[p.id] = idx + 1;
        });
    });
    return map;
  }, [payouts]);

  const openWhatsAppForLister = (listerName: string, listerId?: string) => {
    const match = listers.find(
      (l: any) =>
        (listerId && (l.id === listerId || l.listerId === listerId)) ||
        (l.name && l.name.toLowerCase() === (listerName || "").toLowerCase()),
    );
    const digits = String(match?.phone || match?.whatsapp || "").replace(/\D/g, "");
    const cleanPhone =
      digits.length === 10 ? `91${digits}` : digits.length > 10 ? digits : "";
    const msg = encodeURIComponent(
      `Hi ${listerName}, writing from House of Kaira regarding your payout.`,
    );
    window.open(
      cleanPhone ? `https://wa.me/${cleanPhone}?text=${msg}` : `https://wa.me/?text=${msg}`,
      "_blank",
    );
  };

  const handleHold = async (
    payout: Payout,
    amtStr: string,
    pctStr: string,
    approvedBy: string,
    reason: string,
  ) => {
    if (!setPayouts) return;
    try {
      const parsedAmt = Number(String(amtStr).replace(/,/g, "")) || 0;
      const parsedPct = Number(pctStr) || 0;
      const transactionAmount =
        payout.transactionAmount ||
        (payout.listerShare ?? 0) + (payout.hokCommission ?? 0);
      const updated = await payoutApi.updatePayout(payout.id, {
        listerShare: parsedAmt,
        payoutPercentage: parsedPct,
        hokCommission: Math.max(0, transactionAmount - parsedAmt),
        submissionAssignedTo: approvedBy,
        notes: `[ON HOLD] ${reason}`,
      });
      setPayouts((prev) => prev.map((p) => (p.id === payout.id ? updated : p)));
      toast.success("Payout put on hold and split saved.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to hold payout",
      );
    }
  };

  const handleApprove = async (
    payout: Payout,
    amtStr: string,
    pctStr: string,
    approvedBy: string,
    reason: string,
    hokCommOverride?: number,
  ) => {
    if (!setPayouts || !setPending || !setPaid) return;
    try {
      const parsedAmt = Number(String(amtStr).replace(/,/g, "")) || 0;
      const parsedPct = Number(pctStr) || 0;
      const transactionAmount =
        payout.transactionAmount ||
        (payout.listerShare ?? 0) + (payout.hokCommission ?? 0);
      const finalHokComm =
        hokCommOverride !== undefined
          ? hokCommOverride
          : Math.max(0, transactionAmount - parsedAmt);

      const updated = await payoutApi.markPaid(payout.id, {
        paidBy: approvedBy,
        notes: reason,
        listerShare: parsedAmt,
        payoutPercentage: parsedPct,
        hokCommission: finalHokComm,
      });

      setPayouts((prev) => prev.map((p) => (p.id === payout.id ? updated : p)));
      setPending((value) => Math.max(0, value - (payout.listerShare || parsedAmt)));
      setPaid((value) => value + (updated.listerShare || parsedAmt));
      toast.success("Payout approved and marked Paid!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to approve payout",
      );
    }
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Header Label */}
      <div className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">
        AWAITING APPROVAL ({pendingPayouts.length})
      </div>

      {pendingPayouts.length === 0 && (
        <div className="rounded-md border border-[#E7E0D6] bg-white p-8 text-center text-sm text-[#78716C] shadow-sm">
          No pending payouts awaiting approval.
        </div>
      )}

      {pendingPayouts.map((payout) => {
        const isDamageComp =
          payout.mode === "Damage Comp." || payout.mode === "Damage Compensation";
        const matchedOrder: any = orders.find(
          (o: any) =>
            o.id === payout.orderId ||
            o.orderId === payout.orderId ||
            o.orderNumber === payout.orderId,
        );
        const matchedProduct: any = products.find(
          (p: any) =>
            (payout.productId &&
              (p.id === payout.productId ||
                p.productId === payout.productId ||
                p._id === payout.productId)) ||
            (p.name &&
              payout.productName &&
              p.name.toLowerCase() === payout.productName.toLowerCase()),
        );

        if (isDamageComp) {
          return (
            <DamageQueueCard
              key={payout.id}
              payout={payout}
              allPayouts={payouts}
              matchedOrder={matchedOrder}
              assignees={assignees}
              onApprove={handleApprove}
              onWhatsApp={() =>
                openWhatsAppForLister(payout.listerName, payout.listerId)
              }
              onSelectOrder={onSelectOrder}
              onSelectLister={onSelectLister}
            />
          );
        }

        return (
          <StandardQueueCard
            key={payout.id}
            payout={payout}
            allPayouts={payouts}
            rentalNumber={rentalNumberById[payout.id] || 1}
            matchedOrder={matchedOrder}
            matchedProduct={matchedProduct}
            assignees={assignees}
            onHold={handleHold}
            onApprove={handleApprove}
            onWhatsApp={() =>
              openWhatsAppForLister(payout.listerName, payout.listerId)
            }
            onSelectOrder={onSelectOrder}
            onSelectLister={onSelectLister}
          />
        );
      })}
    </div>
  );
}

function StandardQueueCard({
  payout,
  allPayouts,
  rentalNumber,
  matchedOrder,
  matchedProduct,
  assignees,
  onHold,
  onApprove,
  onWhatsApp,
  onSelectOrder,
  onSelectLister,
}: {
  payout: Payout;
  allPayouts: Payout[];
  rentalNumber: number;
  matchedOrder?: any;
  matchedProduct?: any;
  assignees: string[];
  onHold: (
    payout: Payout,
    amt: string,
    pct: string,
    approvedBy: string,
    reason: string,
  ) => void;
  onApprove: (
    payout: Payout,
    amt: string,
    pct: string,
    approvedBy: string,
    reason: string,
  ) => void;
  onWhatsApp: () => void;
  onSelectOrder?: (orderId: string) => void;
  onSelectLister?: (listerId: string) => void;
}) {
  const modeLower = String(payout.mode || "Rental").toLowerCase();
  const isPreloved = modeLower.includes("preloved") || modeLower.includes("buy") || modeLower.includes("sale");
  const transactionVal =
    Number(payout.transactionAmount) ||
    (Number(payout.listerShare) || 0) + (Number(payout.hokCommission) || 0);

  const pieceDefaultPct = isPreloved
    ? 75
    : Number(matchedProduct?.payoutPercentage) ||
      (100 - (Number(matchedProduct?.commissionRate) || 40));

  const initialPct =
    payout.payoutPercentage ||
    (transactionVal > 0 && payout.listerShare
      ? Math.round((payout.listerShare / transactionVal) * 100)
      : pieceDefaultPct);

  const initialAmt =
    Number(payout.listerShare) || Math.round(transactionVal * (initialPct / 100));

  // Same-product payout stats for Decision Context
  const samePiecePayouts = allPayouts.filter(
    (p) =>
      p.productName &&
      payout.productName &&
      p.productName.toLowerCase() === payout.productName.toLowerCase(),
  );
  const lastPiecePayout = samePiecePayouts[samePiecePayouts.length - 1] || payout;
  const lastSplitPct =
    lastPiecePayout.payoutPercentage ||
    (lastPiecePayout.transactionAmount
      ? Math.round(
          ((lastPiecePayout.listerShare || 0) / lastPiecePayout.transactionAmount) *
            100,
        )
      : initialPct);
  const avgPiecePct =
    samePiecePayouts.length > 0
      ? Math.round(
          samePiecePayouts.reduce((s, p) => {
            const tx =
              p.transactionAmount || (p.listerShare || 0) + (p.hokCommission || 0) || 1;
            return s + ((p.listerShare || 0) / tx) * 100;
          }, 0) / samePiecePayouts.length,
        )
      : initialPct;
  const conditionLabel = matchedProduct?.condition || "Excellent";
  const timesRentedCount =
    Number(matchedProduct?.timesRented) || samePiecePayouts.length || 1;

  // Order & Deposit safety check
  const orderStatus = matchedOrder?.status || "Confirmed";
  const orderStatusLower = String(orderStatus).toLowerCase();
  const rawDepStatus =
    matchedOrder?.depositDecision?.status ||
    matchedOrder?.depositStatus ||
    (["dispatched", "shipped", "delivered", "return sent"].includes(orderStatusLower)
      ? "Held"
      : orderStatusLower === "returned" || orderStatusLower === "complete"
        ? "Released"
        : "Pending");

  const isSafeToPay = isPreloved
    ? orderStatusLower === "delivered" ||
      orderStatusLower === "complete" ||
      orderStatusLower === "completed" ||
      orderStatusLower === "processed"
    : orderStatusLower === "returned" ||
      orderStatusLower === "complete" ||
      orderStatusLower === "completed" ||
      orderStatusLower === "processed";

  const buildDefaultReason = (pctNum: number) =>
    isPreloved
      ? `Preloved sale — standard ${pctNum}% lister split applied.`
      : `Rental #${rentalNumber} of this piece — condition ${conditionLabel.toLowerCase()}, ${pctNum}% lister split applied.`;

  const [pct, setPct] = useState(String(initialPct));
  const [amt, setAmt] = useState(String(initialAmt));
  const [userEditedReason, setUserEditedReason] = useState(Boolean(payout.notes));
  const [reason, setReason] = useState(
    payout.notes
      ? payout.notes.replace(/^\[ON HOLD\]\s*/, "")
      : buildDefaultReason(initialPct),
  );
  const [approvedBy, setApprovedBy] = useState(
    payout.submissionAssignedTo && payout.submissionAssignedTo !== "Unassigned"
      ? payout.submissionAssignedTo
      : assignees[0] || "Priya (Ops)",
  );

  useEffect(() => {
    if (
      (!approvedBy || approvedBy === "Unassigned") &&
      assignees.length > 0
    ) {
      setApprovedBy(assignees[0]);
    }
  }, [assignees, approvedBy]);

  const handlePctChange = (val: string) => {
    setPct(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const nextAmt = Math.round(transactionVal * (num / 100));
      setAmt(String(nextAmt));
      if (!userEditedReason) setReason(buildDefaultReason(Math.round(num)));
    }
  };

  const handleAmtChange = (val: string) => {
    setAmt(val);
    const num = parseFloat(val.replace(/,/g, ""));
    if (!isNaN(num) && transactionVal > 0) {
      const nextPct = Math.round((num / transactionVal) * 100);
      setPct(String(nextPct));
      if (!userEditedReason) setReason(buildDefaultReason(nextPct));
    }
  };

  const parsedAmtNum = Number(String(amt).replace(/,/g, "")) || 0;
  const hokCommissionNum = Math.max(0, transactionVal - parsedAmtNum);

  return (
    <div className="overflow-hidden rounded-md border border-[#E7E0D6] bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-[#E7E0D6] bg-white px-6 py-4 text-sm">
        <button
          type="button"
          onClick={() => onSelectLister?.(payout.listerId || payout.listerName)}
          className="font-medium text-[#B88E36] hover:underline cursor-pointer"
        >
          {payout.listerName}
        </button>
        <WhatsAppIcon onClick={onWhatsApp} />
        <span className="text-stone-300">·</span>
        <span className="font-medium text-[#B88E36]">{payout.productName}</span>
        {isPreloved ? (
          <span className="rounded bg-[#FDF3E7] px-2 py-0.5 text-xs font-semibold text-[#9A3412]">
            Preloved
          </span>
        ) : (
          <span className="rounded bg-[#E6F4EA] px-2 py-0.5 text-xs font-semibold text-[#137333]">
            Rental
          </span>
        )}
        <span className="ml-auto text-sm text-[#78716C]">
          due {formatDateLabel(payout.dueDate)}
        </span>
      </div>

      <div className="p-6">
        <p className="mb-3 text-xs text-[#78716C]">
          {isPreloved
            ? "Preloved sale of this piece · "
            : `Rental #${rentalNumber} of this product · `}
          <button
            type="button"
            onClick={() => onSelectOrder?.(payout.orderId)}
            className="font-medium text-[#B88E36] hover:underline cursor-pointer"
          >
            {payout.orderId}
          </button>
        </p>

        <div className="mb-4 rounded-md border border-[#EFE8D8] bg-[#FAF5EB] p-3 text-xs leading-relaxed text-[#524B45]">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#8C827A]">
            DECISION CONTEXT
          </span>
          Last split <strong className="text-[#1E1412]">{lastSplitPct}%</strong>{" "}
          ({isPreloved ? "" : `Rental #${rentalNumber} · `}
          {formatDateLabel(lastPiecePayout.dueDate)})
          {samePiecePayouts.length > 1 && (
            <>
              {" "}
              · piece avg{" "}
              <strong className="text-[#1E1412]">{avgPiecePct}%</strong> across{" "}
              {samePiecePayouts.length}
            </>
          )}{" "}
          · default <strong className="text-[#1E1412]">{pieceDefaultPct}%</strong>{" "}
          · condition {conditionLabel} · rented{" "}
          <strong className="text-[#1E1412]">{timesRentedCount}×</strong>
        </div>

        {matchedOrder && !isSafeToPay ? (
          <div className="mb-5 rounded-md border border-[#F87171]/40 bg-[#FDF2F2] p-3 text-xs font-medium text-[#991B1B]">
            ⚠ <strong>Not safe to pay yet.</strong>{" "}
            {isPreloved
              ? `Sale not delivered yet.`
              : `Piece not back yet — order is ${orderStatus}.`}{" "}
            Order: <strong>{orderStatus}</strong> · Deposit:{" "}
            <strong>{rawDepStatus}</strong>
          </div>
        ) : (
          <p className="mb-5 text-xs text-[#78716C]">
            Order:{" "}
            <strong className="font-semibold text-[#1E1412]">
              {matchedOrder ? orderStatus : "Returned"}
            </strong>{" "}
            · Deposit:{" "}
            <strong className="font-semibold text-[#1E1412]">
              {matchedOrder ? rawDepStatus : "Released"}
            </strong>
          </p>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                TRANSACTION VALUE
              </label>
              <div className="text-2xl font-bold text-[#1E1412]">
                ₹{transactionVal.toLocaleString("en-IN")}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                PAYOUT %
              </label>
              <input
                type="text"
                value={pct}
                onChange={(e) => handlePctChange(e.target.value)}
                className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
              />
              <p className="mt-1.5 text-xs text-[#78716C]">
                Suggested — type either the % or the ₹ below (piece default{" "}
                {pieceDefaultPct}%)
              </p>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                APPROVED BY
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

          {/* Right Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  PAYOUT AMOUNT (₹)
                </label>
                <input
                  type="text"
                  value={amt}
                  onChange={(e) => handleAmtChange(e.target.value)}
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-lg font-bold text-[#2D6A4F] focus:border-[#C39A38] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  HOK COMMISSION
                </label>
                <div className="text-2xl font-bold text-[#1E1412]">
                  ₹{hokCommissionNum.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                REASON FOR THIS SPLIT
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => {
                  setUserEditedReason(true);
                  setReason(e.target.value);
                }}
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
        <button
          type="button"
          onClick={() => onHold(payout, amt, pct, approvedBy, reason)}
          className="rounded-md border border-[#E5DFD5] bg-white px-4 py-1.5 text-sm font-medium text-[#1E1412] shadow-sm hover:bg-stone-50 cursor-pointer"
        >
          Hold
        </button>
        <button
          type="button"
          onClick={() => onApprove(payout, amt, pct, approvedBy, reason)}
          className="rounded-md bg-[#C39A38] px-4 py-1.5 text-sm font-semibold text-[#1E1412] shadow-sm transition-colors hover:bg-[#B38A28] cursor-pointer"
        >
          Approve Payout
        </button>
      </div>
    </div>
  );
}

function DamageQueueCard({
  payout,
  allPayouts,
  matchedOrder,
  assignees,
  onApprove,
  onWhatsApp,
  onSelectOrder,
  onSelectLister,
}: {
  payout: Payout;
  allPayouts: Payout[];
  matchedOrder?: any;
  assignees: string[];
  onApprove: (
    payout: Payout,
    amt: string,
    pct: string,
    approvedBy: string,
    reason: string,
    hokCommOverride?: number,
  ) => void;
  onWhatsApp: () => void;
  onSelectOrder?: (orderId: string) => void;
  onSelectLister?: (listerId: string) => void;
}) {
  // Find companion rental payout for same order if present
  const companionRental = allPayouts.find(
    (p) =>
      p.orderId === payout.orderId &&
      p.id !== payout.id &&
      p.mode !== "Damage Comp." &&
      p.mode !== "Damage Compensation",
  );

  const deductedFromCustomer =
    Number(matchedOrder?.depositDecision?.deductedAmount) ||
    Number(payout.transactionAmount) ||
    (Number(payout.listerShare) || 0) + (Number(payout.hokCommission) || 0);

  const rentTransactionVal =
    Number(companionRental?.transactionAmount) ||
    Number(matchedOrder?.amount) ||
    Number(matchedOrder?.orderValue) ||
    deductedFromCustomer;

  const initStdPct = companionRental?.payoutPercentage || 55;
  const initStdAmt =
    Number(companionRental?.listerShare) ||
    Math.round(rentTransactionVal * (initStdPct / 100));

  const initCompAmt =
    Number(payout.listerShare) || Math.round(deductedFromCustomer * 0.6);
  const initCompPct =
    deductedFromCustomer > 0
      ? Math.round((initCompAmt / deductedFromCustomer) * 100)
      : 60;

  const returnCondText =
    matchedOrder?.returnCondition?.notes ||
    matchedOrder?.depositDecision?.reason ||
    "Damage recorded on return — agreed deduction per rental agreement";

  const [stdPct, setStdPct] = useState(String(initStdPct));
  const [stdAmt, setStdAmt] = useState(String(initStdAmt));
  const [compAmt, setCompAmt] = useState(String(initCompAmt));
  const [compPct, setCompPct] = useState(String(initCompPct));
  const [reason, setReason] = useState(
    payout.notes ||
      `Customer deposit deduction of ₹${deductedFromCustomer.toLocaleString("en-IN")}. ${initCompPct}% of deduction passed to ${payout.listerName} as damage compensation per HOK policy.`,
  );
  const [approvedBy, setApprovedBy] = useState(
    payout.submissionAssignedTo && payout.submissionAssignedTo !== "Unassigned"
      ? payout.submissionAssignedTo
      : assignees[0] || "Priya (Ops)",
  );

  const handleStdPctChange = (val: string) => {
    setStdPct(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setStdAmt(String(Math.round(rentTransactionVal * (num / 100))));
    }
  };

  const handleStdAmtChange = (val: string) => {
    setStdAmt(val);
    const num = parseFloat(val.replace(/,/g, ""));
    if (!isNaN(num) && rentTransactionVal > 0) {
      setStdPct(String(Math.round((num / rentTransactionVal) * 100)));
    }
  };

  const handleCompAmtChange = (val: string) => {
    setCompAmt(val);
    const num = parseFloat(val.replace(/,/g, ""));
    if (!isNaN(num) && deductedFromCustomer > 0) {
      setCompPct(String(Math.round((num / deductedFromCustomer) * 100)));
    }
  };

  const handleCompPctChange = (val: string) => {
    setCompPct(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setCompAmt(String(Math.round(deductedFromCustomer * (num / 100))));
    }
  };

  const stdAmtNum = Number(String(stdAmt).replace(/,/g, "")) || 0;
  const compAmtNum = Number(String(compAmt).replace(/,/g, "")) || 0;
  const hokCommissionRent = Math.max(0, rentTransactionVal - stdAmtNum);
  const hokRetains = Math.max(0, deductedFromCustomer - compAmtNum);
  const totalPayoutToLister = stdAmtNum + compAmtNum;
  const totalToHok = hokCommissionRent + hokRetains;

  return (
    <div className="overflow-hidden rounded-md border border-[#E7E0D6] bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-[#E7E0D6] bg-white px-6 py-4 text-sm">
        <button
          type="button"
          onClick={() => onSelectLister?.(payout.listerId || payout.listerName)}
          className="font-medium text-[#B88E36] hover:underline cursor-pointer"
        >
          {payout.listerName}
        </button>
        <WhatsAppIcon onClick={onWhatsApp} />
        <span className="text-stone-300">·</span>
        <span className="font-medium text-[#B88E36]">{payout.productName}</span>
        <span className="rounded bg-[#EDE9FE] px-2 py-0.5 text-xs font-semibold text-[#5B21B6]">
          Damage Compensation
        </span>
        <span className="ml-auto text-sm text-[#78716C]">
          due {formatDateLabel(payout.dueDate)}
        </span>
      </div>

      <div className="p-6">
        <div className="mb-4 rounded-md border border-[#EFE8D8] bg-[#FAF5EB] p-3.5 text-xs leading-relaxed text-[#524B45]">
          Customer deposit deduction of ₹
          {deductedFromCustomer.toLocaleString("en-IN")} was applied for damage.
          Standard payout for this rental would be ₹
          {stdAmtNum.toLocaleString("en-IN")} ({stdPct}% of ₹
          {rentTransactionVal.toLocaleString("en-IN")}). Who keeps the deduction
          is your call below — lister compensation vs the repair cost HOK bears.
        </div>

        <p
          onClick={() => onSelectOrder?.(payout.orderId)}
          className="mb-1 text-xs font-semibold text-[#B88E36] hover:underline cursor-pointer"
        >
          Related order: {payout.orderId} →
        </p>
        <p className="mb-4 text-xs text-[#78716C]">
          Return condition: {returnCondText}
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                TRANSACTION VALUE
              </label>
              <div className="text-2xl font-bold text-[#1E1412]">
                ₹{rentTransactionVal.toLocaleString("en-IN")}
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                    STANDARD PAYOUT %
                  </label>
                  <input
                    type="text"
                    value={stdPct}
                    onChange={(e) => handleStdPctChange(e.target.value)}
                    className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                    STANDARD PAYOUT (₹)
                  </label>
                  <input
                    type="text"
                    value={stdAmt}
                    onChange={(e) => handleStdAmtChange(e.target.value)}
                    className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                  />
                </div>
              </div>
              <p className="mt-1.5 text-xs text-[#78716C]">
                Type either side
              </p>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                HOK COMMISSION (RENT)
              </label>
              <div className="text-2xl font-bold text-[#1E1412]">
                ₹{hokCommissionRent.toLocaleString("en-IN")}
              </div>
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
              <div className="text-xl font-bold text-[#991B1B]">
                ₹{deductedFromCustomer.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  COMPENSATION TO LISTER (₹)
                </label>
                <input
                  type="text"
                  value={compAmt}
                  onChange={(e) => handleCompAmtChange(e.target.value)}
                  className="w-full rounded-md border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-2 text-sm font-medium text-[#1E1412] focus:border-[#C39A38] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                  ...OR % OF DEDUCTION
                </label>
                <input
                  type="text"
                  value={compPct}
                  onChange={(e) => handleCompPctChange(e.target.value)}
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
                ₹{hokRetains.toLocaleString("en-IN")}
              </div>
            </div>

            <hr className="my-2 border-[#E7E0D6]" />

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                TOTAL PAYOUT TO LISTER
              </div>
              <div className="font-serif text-xl font-semibold italic text-[#2D5A27]">
                ₹{totalPayoutToLister.toLocaleString("en-IN")}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                TOTAL TO HOK (COMMISSION + RETAINED)
              </div>
              <div className="font-serif text-lg italic text-[#1E1412]">
                ₹{totalToHok.toLocaleString("en-IN")}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                REASON
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
                APPROVED BY
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
        <button
          type="button"
          onClick={() =>
            onApprove(payout, compAmt, compPct, approvedBy, reason, hokRetains)
          }
          className="rounded-md bg-[#C39A38] px-4 py-1.5 text-sm font-semibold text-[#1E1412] shadow-sm transition-colors hover:bg-[#B38A28] cursor-pointer"
        >
          Approve Compensation Payout
        </button>
      </div>
    </div>
  );
}
