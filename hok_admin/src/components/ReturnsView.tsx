import React, { useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import toast from "react-hot-toast";
import { Order } from "../types";

interface ReturnsViewProps {
  orders: Order[];
  setView: (view: string) => void;
  setSelectedOrderId: (id: string) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
  initialTab?: "pipeline" | "ledger" | "released" | "receivables" | "settings";
}

const parseLocalDay = (raw: any): Date | null => {
  if (!raw) return null;
  const s = String(raw).trim();
  const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymd) return new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const toYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const addDays = (d: Date, n: number) => {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  copy.setDate(copy.getDate() + n);
  return copy;
};

const diffDays = (a: Date, b: Date) =>
  Math.round((a.getTime() - b.getTime()) / 86400000);

const fmtShort = (d: Date) =>
  `${d.getDate()} ${d.toLocaleString("en-GB", { month: "short" })}`;

const money = (v: number) => `₹${Math.round(v || 0).toLocaleString("en-IN")}`;

const RESOLVED_DEPOSIT_STATUSES = [
  "released",
  "partial",
  "partially released",
  "forfeited",
  "refunded",
];

const WhatsAppBadgeIcon = () => (
  <svg className="h-3.5 w-3.5 fill-current shrink-0" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
  </svg>
);

export default function ReturnsView({
  orders,
  setView,
  setSelectedOrderId,
  onUpdateOrder,
  initialTab = "pipeline",
}: ReturnsViewProps) {
  const [demoDate, setDemoDate] = useState(() => toYMD(new Date()));
  const [activeTab, setActiveTab] = useState<
    "pipeline" | "ledger" | "released" | "receivables" | "settings"
  >(initialTab);

  // Filters on Ledger & Released tabs
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [ledgerFilter, setLedgerFilter] = useState("All");
  const [releasedSearch, setReleasedSearch] = useState("");

  const overdueRef = useRef<HTMLDivElement | null>(null);
  const dueTodayRef = useRef<HTMLDivElement | null>(null);
  const awaitingReleaseRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Log Return / Decide Deposit modals
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);
  const [returnCondition, setReturnCondition] = useState<"A" | "B" | "C" | "D">(
    "A",
  );
  const [returnNotes, setReturnNotes] = useState("");

  const [decideModalOrder, setDecideModalOrder] = useState<Order | null>(null);
  const [deductionAmount, setDeductionAmount] = useState("0");
  const [releaseReason, setReleaseReason] = useState("");

  // Deposit settings state (persisted locally)
  const [tPlusDays, setTPlusDays] = useState<number>(() => {
    const saved = Number(localStorage.getItem("hok_deposit_tplus"));
    return saved >= 1 ? saved : 3;
  });
  const [lateFeeDailyPct, setLateFeeDailyPct] = useState<number>(() => {
    const saved = Number(localStorage.getItem("hok_deposit_late_pct"));
    return saved >= 0 && !isNaN(saved) && localStorage.getItem("hok_deposit_late_pct") !== null
      ? saved
      : 25;
  });

  const refDate = useMemo(
    () => parseLocalDay(demoDate) || parseLocalDay(toYMD(new Date()))!,
    [demoDate],
  );

  const openOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setView(`order_detail:${orderId}`);
  };

  const openWhatsApp = (
    phoneRaw: string,
    customerName: string,
    oid: string,
    product: string,
  ) => {
    const firstName = (customerName || "Customer").split(" ")[0];
    const digits = String(phoneRaw || "").replace(/\D/g, "");
    const cleanPhone = digits.length === 10 ? `91${digits}` : digits;
    const text = encodeURIComponent(
      `Hi ${firstName}, checking in from House of Kaira regarding the return/deposit for ${product} (${oid}).`,
    );
    window.open(
      cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${text}`
        : `https://wa.me/?text=${text}`,
      "_blank",
    );
  };

  // Enrich all rental + deposit + refunded orders dynamically from live orders API
  const computed = useMemo(() => {
    const weekEnd = addDays(refDate, 7);

    const trackedOrders = orders
      .map((o: any) => {
        const item = (Array.isArray(o.items) && o.items[0]) || o;
        const rStart = parseLocalDay(
          o.rentalStartDate || item.rentalStartDate || item.startDate,
        );
        const rEnd = parseLocalDay(
          o.rentalEndDate || item.rentalEndDate || item.endDate || rStart,
        );
        const dueRaw =
          o.returnLogistics?.returnDate ||
          item.returnDueDate ||
          o.rentalEndDate ||
          item.rentalEndDate;
        const dueDate = parseLocalDay(dueRaw) || (rEnd ? rEnd : null);

        const rawDeposit = Number(
          o.deposit ?? o.depositHeld ?? item.deposit ?? 0,
        );
        const orderGross = Number(
          o.grandTotal || o.amount || o.orderValue || item.amount || 0,
        );

        const decisionObj = o.depositDecision || item.depositDecision || null;
        const decisionStatusRaw = String(decisionObj?.status || "").trim();
        const rawOrderDepStatus = String(o.depositStatus || "").trim();

        const hasExplicitRefund =
          String(o.paymentStatus || "").toLowerCase() === "refunded" ||
          rawOrderDepStatus.toLowerCase() === "refunded" ||
          Boolean(o.refund && (o.refund.amount > 0 || o.refund.status === "Processed")) ||
          RESOLVED_DEPOSIT_STATUSES.includes(decisionStatusRaw.toLowerCase()) ||
          RESOLVED_DEPOSIT_STATUSES.includes(rawOrderDepStatus.toLowerCase());

        const statusStr = String(o.status || "Confirmed");
        const stLower = statusStr.toLowerCase();

        const isRental =
          String(o.mode || item.mode || "").toLowerCase() === "rental" ||
          Boolean(rStart) ||
          rawDeposit > 0;

        // Include all rental orders AND any non-rental order that was cancelled/refunded
        if (!isRental && !hasExplicitRefund && stLower !== "cancelled") {
          return null;
        }

        const deposit =
          rawDeposit > 0
            ? rawDeposit
            : hasExplicitRefund
              ? Number(
                decisionObj?.releasedAmount ||
                decisionObj?.deductedAmount ||
                o.refund?.amount ||
                orderGross ||
                0,
              )
              : stLower === "cancelled"
                ? orderGross
                : 0;

        const rawId = String(o.orderId || o.id || o._id || "");
        const displayId = rawId.startsWith("HOK-ORD-")
          ? rawId
          : `HOK-ORD-${rawId}`;
        const pName =
          item.productName || o.productName || "Rental Designer Piece";

        const tsMatch = rawId.match(/HOK-ORD-(\d{13})/);
        const bookedDay =
          parseLocalDay(o.orderDate || o.createdAt || o.invoiceDate) ||
          (tsMatch ? parseLocalDay(new Date(Number(tsMatch[1]))) : null);

        const resolvedDueDate =
          dueDate ||
          (rStart ? addDays(rStart, 3) : null) ||
          (bookedDay ? addDays(bookedDay, 4) : addDays(refDate, 3));

        const isPhysicallyOut = [
          "dispatched",
          "shipped",
          "delivered",
          "return sent",
          "return due",
        ].includes(stLower);
        const isReturnedAwaitingDecision = stLower === "returned";
        const isOrderSettledComplete = [
          "complete",
          "completed",
          "processed",
        ].includes(stLower);

        // Priority 1: Explicit refund / release / partial / forfeited decision ALWAYS wins!
        let depStatusRaw = "Pending";
        if (
          decisionStatusRaw &&
          RESOLVED_DEPOSIT_STATUSES.includes(decisionStatusRaw.toLowerCase())
        ) {
          depStatusRaw =
            decisionStatusRaw.toLowerCase() === "partial"
              ? "Partially Released"
              : decisionStatusRaw;
        } else if (
          rawOrderDepStatus &&
          RESOLVED_DEPOSIT_STATUSES.includes(rawOrderDepStatus.toLowerCase())
        ) {
          depStatusRaw =
            rawOrderDepStatus.toLowerCase() === "partial"
              ? "Partially Released"
              : rawOrderDepStatus;
        } else if (
          String(o.paymentStatus || "").toLowerCase() === "refunded" ||
          Boolean(o.refund && (o.refund.amount > 0 || o.refund.status === "Processed"))
        ) {
          depStatusRaw = "Refunded";
        } else if (isOrderSettledComplete) {
          depStatusRaw = stLower === "processed" ? "Refunded" : "Released";
        } else if (isReturnedAwaitingDecision) {
          depStatusRaw = decisionStatusRaw || "Pending";
        } else if (
          rawOrderDepStatus.toLowerCase() === "held" ||
          rawOrderDepStatus.toLowerCase() === "collected" ||
          (isPhysicallyOut &&
            (!rawOrderDepStatus ||
              rawOrderDepStatus.toLowerCase() === "none"))
        ) {
          depStatusRaw = "Held";
        } else if (rawOrderDepStatus && rawOrderDepStatus !== "None") {
          depStatusRaw = rawOrderDepStatus;
        }

        const deductedVal = Number(decisionObj?.deductedAmount ?? 0);
        const releasedVal =
          decisionObj?.releasedAmount !== undefined &&
            (Number(decisionObj.releasedAmount) > 0 || deductedVal > 0)
            ? Number(decisionObj.releasedAmount)
            : o.refund?.amount !== undefined
              ? Number(o.refund.amount)
              : Math.max(0, deposit - deductedVal);

        const settlementNote =
          decisionObj?.reason ||
          decisionObj?.releaseNote ||
          o.refund?.note ||
          (o.refund?.refundId
            ? `Refund ID: ${o.refund.refundId}`
            : isOrderSettledComplete
              ? `Order ${statusStr.toLowerCase()} — deposit refunded`
              : "");

        const rentalAmt = Number(
          o.orderValue || item.amount || o.amount || 0,
        );
        const rentalDays =
          rStart && rEnd ? Math.max(1, diffDays(rEnd, rStart) + 1) : 4;
        const dailyRate =
          Math.round((rentalAmt / rentalDays) * (lateFeeDailyPct / 100)) ||
          1000;

        return {
          raw: o as Order,
          rawId,
          displayId,
          isRental,
          mode: item.mode || o.mode || (isRental ? "Rental" : "Buy"),
          productId: item.productId || o.productId || "",
          productName: pName,
          designer: item.designer || o.designer || "House of Kaira",
          customerName: o.customerName || "Customer",
          firstName: String(o.customerName || "Customer").split(" ")[0],
          phone: o.customerPhone || "",
          city: String(o.customerCity || o.address || "India").split(",")[0],
          status: statusStr,
          isPhysicallyOut,
          hasExplicitDueDate: Boolean(dueDate),
          rStart,
          rEnd,
          dueDate: resolvedDueDate,
          deposit,
          releasedVal,
          deductedVal,
          settlementNote,
          depStatus: depStatusRaw,
          dailyLateFee: dailyRate,
          receivedDate: parseLocalDay(
            o.conditionAssessment?.receivedDate ||
            item.returnCondition?.receivedDate ||
            o.returnedAt,
          ),
          grade:
            o.conditionAssessment?.grade ||
            item.returnCondition?.grade ||
            "A",
        };
      })
      .filter(Boolean) as any[];

    const overdue: any[] = [];
    const dueToday: any[] = [];
    const cancelledRefundDue: any[] = [];
    const returnedDecisionPending: any[] = [];
    const dueThisWeek: any[] = [];
    const activeHeldBeyondWeek: any[] = [];
    const dueAfterWeek: any[] = [];

    trackedOrders.forEach((entry) => {
      const st = entry.status.toLowerCase();
      const depSt = entry.depStatus.toLowerCase();
      const isResolved = RESOLVED_DEPOSIT_STATUSES.includes(depSt);

      if (st === "cancelled") {
        if (entry.deposit > 0 && !isResolved && depSt !== "none") {
          cancelledRefundDue.push(entry);
        }
        return;
      }

      // If deposit/refund is already resolved, it lives in Released & Deducted (not pending in pipeline)
      if (isResolved) {
        return;
      }

      if (!entry.isRental) {
        return;
      }

      if (st === "returned") {
        if (entry.deposit > 0) {
          const retDay = entry.receivedDate || entry.dueDate || refDate;
          const releaseDeadline = addDays(retDay, tPlusDays);
          const daysLeft = diffDays(releaseDeadline, refDate);
          returnedDecisionPending.push({
            ...entry,
            retDay,
            releaseDeadline,
            daysLeft,
          });
        }
        return;
      }

      const delta = diffDays(entry.dueDate, refDate);
      const isOut = entry.isPhysicallyOut;

      let nextBooking: any = null;
      if (delta < 0 && isOut) {
        nextBooking = trackedOrders.find(
          (other) =>
            other.rawId !== entry.rawId &&
            other.status.toLowerCase() === "confirmed" &&
            ((entry.productId &&
              other.productId &&
              String(entry.productId) === String(other.productId)) ||
              entry.productName === other.productName) &&
            other.rStart &&
            other.rStart >= refDate,
        );
      }

      if (delta < 0 && isOut) {
        const daysLate = Math.abs(delta);
        overdue.push({
          ...entry,
          daysLate,
          accruedLateFee: daysLate * entry.dailyLateFee,
          nextBooking,
        });
      } else if (
        delta === 0 &&
        (isOut || st === "confirmed" || depSt === "held")
      ) {
        dueToday.push({ ...entry, isOut });
      } else if (delta >= 1 && entry.dueDate <= weekEnd) {
        dueThisWeek.push({
          ...entry,
          daysUntilDue: delta,
          awaitingDispatch: !isOut,
          depositUncollected:
            entry.deposit > 0 && ["pending", "not collected"].includes(depSt),
        });
      } else if (depSt === "held" || isOut) {
        activeHeldBeyondWeek.push({
          ...entry,
          daysUntilDue: Math.max(0, delta),
          awaitingDispatch: !isOut,
        });
      } else if (entry.dueDate > weekEnd) {
        dueAfterWeek.push(entry);
      }
    });

    dueAfterWeek.sort(
      (a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0),
    );
    returnedDecisionPending.sort(
      (a, b) =>
        (a.releaseDeadline?.getTime() || 0) -
        (b.releaseDeadline?.getTime() || 0),
    );

    const totalLateFees = overdue.reduce(
      (s, x) => s + (x.accruedLateFee || 0),
      0,
    );

    const piecesHoldingDeposit = trackedOrders.filter((x) => {
      const st = x.status.toLowerCase();
      const depSt = x.depStatus.toLowerCase();
      return (
        x.isRental &&
        x.deposit > 0 &&
        st !== "cancelled" &&
        !RESOLVED_DEPOSIT_STATUSES.includes(depSt) &&
        depSt !== "none"
      );
    });
    const totalDepositsHeld = piecesHoldingDeposit.reduce(
      (s, x) => s + x.deposit,
      0,
    );

    const isPendingDeposit = (statusVal: string) =>
      ["pending", "not collected", "unpaid", "due"].includes(
        String(statusVal || "").toLowerCase(),
      );

    const collectBeforeShip = trackedOrders.filter(
      (x) =>
        x.isRental &&
        x.status.toLowerCase() === "confirmed" &&
        x.deposit > 0 &&
        isPendingDeposit(x.depStatus),
    );

    const receivables = trackedOrders.filter(
      (x) =>
        x.isRental &&
        x.status.toLowerCase() !== "cancelled" &&
        x.deposit > 0 &&
        isPendingDeposit(x.depStatus),
    );

    const resolvedLedger = trackedOrders.filter((x) =>
      RESOLVED_DEPOSIT_STATUSES.includes(x.depStatus.toLowerCase()),
    );

    const ledgerEntries = trackedOrders.filter(
      (x) => x.deposit > 0 || RESOLVED_DEPOSIT_STATUSES.includes(x.depStatus.toLowerCase()),
    );

    return {
      allRentals: trackedOrders,
      ledgerEntries,
      overdue,
      dueToday,
      cancelledRefundDue,
      returnedDecisionPending,
      dueThisWeek,
      activeHeldBeyondWeek,
      dueAfterWeek,
      totalLateFees,
      totalDepositsHeld,
      piecesHoldingCount: piecesHoldingDeposit.length,
      collectBeforeShipCount: collectBeforeShip.length,
      receivables,
      resolvedLedger,
    };
  }, [orders, refDate, tPlusDays, lateFeeDailyPct]);

  const totalActionThings =
    computed.overdue.length +
    computed.collectBeforeShipCount +
    computed.returnedDecisionPending.length +
    computed.cancelledRefundDue.length;

  const pipelineBadgeCount =
    computed.overdue.length +
    computed.returnedDecisionPending.length +
    computed.cancelledRefundDue.length;

  const filteredLedger = useMemo(() => {
    const q = ledgerSearch.trim().toLowerCase();
    return computed.ledgerEntries.filter((x) => {
      const matchSearch =
        !q ||
        x.displayId.toLowerCase().includes(q) ||
        x.customerName.toLowerCase().includes(q) ||
        x.productName.toLowerCase().includes(q);
      const ds = x.depStatus.toLowerCase();
      const matchStatus =
        ledgerFilter === "All" ||
        (ledgerFilter === "Held" && ds === "held") ||
        (ledgerFilter === "Pending" && ds === "pending") ||
        (ledgerFilter === "Released" && ds === "released") ||
        (ledgerFilter === "Refunded" && ds === "refunded") ||
        (ledgerFilter === "Deducted" &&
          (ds === "partially released" || ds === "partial" || ds === "forfeited"));
      return matchSearch && matchStatus;
    });
  }, [computed.ledgerEntries, ledgerSearch, ledgerFilter]);

  const filteredReleased = useMemo(() => {
    const q = releasedSearch.trim().toLowerCase();
    if (!q) return computed.resolvedLedger;
    return computed.resolvedLedger.filter(
      (x) =>
        x.displayId.toLowerCase().includes(q) ||
        x.customerName.toLowerCase().includes(q) ||
        x.productName.toLowerCase().includes(q) ||
        x.depStatus.toLowerCase().includes(q),
    );
  }, [computed.resolvedLedger, releasedSearch]);

  const handleConfirmLogReturn = () => {
    if (!returnModalOrder) return;
    const todayIso = toYMD(new Date());
    const updated: Order = {
      ...returnModalOrder,
      status: "Returned",
      depositStatus: "Held",
      conditionAssessment: {
        receivedDate: todayIso,
        receivedBy: "Soumya",
        grade: returnCondition,
        notes: returnNotes || "Logged via Returns & Deposits pipeline.",
      },
      depositDecision: {
        status: "Pending",
        releasedAmount: 0,
        deductedAmount: 0,
        reason: "Awaiting T+3 deposit release decision",
        date: todayIso,
      },
    };
    onUpdateOrder(updated);
    setReturnModalOrder(null);
    toast.success("Return logged! Piece moved to Deposit Decision Pending.");
  };

  const handleConfirmDepositDecision = (
    mode: "Released" | "Partial" | "Forfeited",
  ) => {
    if (!decideModalOrder) return;
    const isCancelled =
      String(decideModalOrder.status || "").toLowerCase() === "cancelled";
    const dep = Number(
      decideModalOrder.deposit ||
      (decideModalOrder as any).grandTotal ||
      decideModalOrder.amount ||
      0,
    );
    const deduct =
      mode === "Released"
        ? 0
        : mode === "Forfeited"
          ? dep
          : Math.min(dep, Math.max(0, Number(deductionAmount) || 0));
    const released = Math.max(0, dep - deduct);

    const topDepStatus =
      isCancelled && mode === "Released"
        ? "Refunded"
        : mode === "Partial"
          ? "Partially Released"
          : mode;

    const decisionStatus =
      isCancelled && mode === "Released" ? "Refunded" : mode;

    const updated: Order = {
      ...decideModalOrder,
      status: isCancelled ? "Cancelled" : "Complete",
      depositStatus: topDepStatus as any,
      depositDecision: {
        ...(decideModalOrder.depositDecision || {}),
        status: decisionStatus as any,
        releasedAmount: released,
        deductedAmount: deduct,
        reason:
          releaseReason ||
          (isCancelled
            ? "Cancelled order deposit refunded"
            : mode === "Released"
              ? `Full deposit released within T+${tPlusDays}`
              : mode),
        date: toYMD(new Date()),
      },
    };
    onUpdateOrder(updated);
    setDecideModalOrder(null);
    setActiveTab("released");
    toast.success(
      `Deposit ${topDepStatus.toLowerCase()} (${money(released)} refunded).`,
    );
  };

  const handleMarkDepositCollected = (ord: Order) => {
    const updated: Order = {
      ...ord,
      depositStatus: "Held",
    };
    onUpdateOrder(updated);
    toast.success("Security deposit marked as Held!");
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    setActiveTab("pipeline");
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <div className="min-h-full bg-[#f8f6f2] text-[#2b2118] font-sans space-y-5">
      {/* Section Header */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#c08829]">
          OPERATIONS
        </div>
        <h1
          className="text-[26px] font-medium text-[#2b2118] mt-0.5"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Returns &amp; Deposits
        </h1>
        <p className="mt-1.5 max-w-[760px] text-[13px] leading-[1.55] text-[#7d756b]">
          The inbound half of the studio — every rental piece due back, chased,
          received, and its deposit resolved inside the T+{tPlusDays} promise.
          This queue routes into each order&apos;s Return &amp; Condition and
          Deposit Decision tabs; nothing is assessed or released from here
          directly, so there is only ever one write path.
        </p>
      </div>

      {/* Action Strip ("X THINGS HERE") */}
      {totalActionThings > 0 && (
        <div className="flex flex-wrap items-center gap-2.5 rounded-[6px] border border-[#ecd0c6] bg-[#fdf3ef] px-4 py-2.5 text-[12px]">
          <strong className="uppercase tracking-wider text-[#b44b32] text-[11px] font-bold mr-1">
            {totalActionThings} THINGS HERE
          </strong>
          {computed.overdue.length > 0 && (
            <button
              type="button"
              onClick={() => scrollToSection(overdueRef)}
              className="rounded border border-[#e5d9cf] bg-white px-2.5 py-1 text-[11.5px] font-medium text-[#3b332b] hover:bg-[#faf7f2] cursor-pointer"
            >
              <strong>{computed.overdue.length}</strong> returns overdue →
            </button>
          )}
          {computed.cancelledRefundDue.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("pipeline")}
              className="rounded border border-[#e5d9cf] bg-white px-2.5 py-1 text-[11.5px] font-medium text-[#3b332b] hover:bg-[#faf7f2] cursor-pointer"
            >
              <strong>{computed.cancelledRefundDue.length}</strong> cancelled
              refunds due →
            </button>
          )}
          {computed.collectBeforeShipCount > 0 && (
            <button
              type="button"
              onClick={() => setView("dispatch")}
              className="rounded border border-[#e5d9cf] bg-white px-2.5 py-1 text-[11.5px] font-medium text-[#3b332b] hover:bg-[#faf7f2] cursor-pointer"
            >
              <strong>{computed.collectBeforeShipCount}</strong> deposits to
              collect before the piece ships →
            </button>
          )}
          {computed.returnedDecisionPending.length > 0 && (
            <button
              type="button"
              onClick={() => scrollToSection(awaitingReleaseRef)}
              className="rounded border border-[#e5d9cf] bg-white px-2.5 py-1 text-[11.5px] font-medium text-[#3b332b] hover:bg-[#faf7f2] cursor-pointer"
            >
              <strong>{computed.returnedDecisionPending.length}</strong>{" "}
              deposits awaiting T+{tPlusDays} release →
            </button>
          )}
          {computed.receivables.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("receivables")}
              className="rounded border border-[#e5d9cf] bg-white px-2.5 py-1 text-[11.5px] font-medium text-[#3b332b] hover:bg-[#faf7f2] cursor-pointer"
            >
              <strong>{computed.receivables.length}</strong> deposits still to
              collect →
            </button>
          )}
        </div>
      )}

      {/* Demo Date Row */}
      <div className="flex flex-wrap items-center gap-2.5 text-[12.5px] text-[#5c5347]">
        <span>Demo date:</span>
        <input
          type="date"
          value={demoDate}
          onChange={(e) => setDemoDate(e.target.value)}
          className="rounded-[5px] border border-[#dcd4c6] bg-white px-2.5 py-1 text-[12.5px] text-[#2b2118] outline-none focus:border-[#c08829]"
        />
        <span className="text-[#9a9184]">
          — shared with the Operations Calendar &amp; Dispatch Schedule
        </span>
      </div>

      {/* 4 Gold-Top Metric Cards — all clickable & synced */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <button
          type="button"
          onClick={() => scrollToSection(overdueRef)}
          className="text-left rounded-[4px] border border-[#e8e1d5] border-t-2 border-t-[#c7a35e] bg-white px-5 py-3.5 shadow-[0_1px_2px_rgba(43,33,24,0.04)] hover:border-[#c7a35e] transition cursor-pointer"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#8f8679]">
            OVERDUE RETURNS
          </div>
          <div
            className={`mt-1.5 text-[22px] ${computed.overdue.length > 0 ? "text-[#b84c33]" : "text-[#2b2118]"}`}
            style={{ fontFamily: "Georgia, serif" }}
          >
            {computed.overdue.length}
          </div>
          <div
            className={`mt-1 text-[11.5px] ${computed.totalLateFees > 0 ? "text-[#b84c33]" : "text-[#968d80]"}`}
          >
            {computed.totalLateFees > 0
              ? `late fees accruing ${money(computed.totalLateFees)}`
              : "no overdue returns"}
          </div>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection(dueTodayRef)}
          className="text-left rounded-[4px] border border-[#e8e1d5] border-t-2 border-t-[#c7a35e] bg-white px-5 py-3.5 shadow-[0_1px_2px_rgba(43,33,24,0.04)] hover:border-[#c7a35e] transition cursor-pointer"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#8f8679]">
            DUE BACK TODAY
          </div>
          <div
            className="mt-1.5 text-[22px] text-[#2b2118]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {computed.dueToday.length}
          </div>
          <div className="mt-1 text-[11.5px] text-[#968d80]">
            {computed.dueToday.length === 0
              ? "no pickups to chase"
              : `${computed.dueToday.length} pickup${computed.dueToday.length > 1 ? "s" : ""} to chase`}
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setLedgerFilter("All");
            setActiveTab("ledger");
          }}
          className="text-left rounded-[4px] border border-[#e8e1d5] border-t-2 border-t-[#c7a35e] bg-white px-5 py-3.5 shadow-[0_1px_2px_rgba(43,33,24,0.04)] hover:border-[#c7a35e] transition cursor-pointer"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#8f8679]">
            DEPOSITS HELD
          </div>
          <div
            className="mt-1.5 text-[22px] text-[#b59457]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {money(computed.totalDepositsHeld)}
          </div>
          <div className="mt-1 text-[11.5px] text-[#968d80]">
            across {computed.piecesHoldingCount} piece
            {computed.piecesHoldingCount === 1 ? "" : "s"} out or awaiting
            decision
          </div>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection(awaitingReleaseRef)}
          className="text-left rounded-[4px] border border-[#e8e1d5] border-t-2 border-t-[#c7a35e] bg-white px-5 py-3.5 shadow-[0_1px_2px_rgba(43,33,24,0.04)] hover:border-[#c7a35e] transition cursor-pointer"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#8f8679]">
            AWAITING RELEASE DECISION
          </div>
          <div
            className="mt-1.5 text-[22px] text-[#b59457]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {computed.returnedDecisionPending.length}
          </div>
          <div className="mt-1 text-[11.5px] text-[#968d80]">
            {computed.returnedDecisionPending.length > 0
              ? `next T+${tPlusDays} deadline ${fmtShort(computed.returnedDecisionPending[0].releaseDeadline)}`
              : `all T+${tPlusDays} releases clear`}
          </div>
        </button>
      </div>

      {/* 5 Tabs */}
      <div className="flex flex-wrap items-center gap-6 border-b border-[#e5dfd4]">
        {[
          {
            id: "pipeline",
            label: "Return Pipeline",
            badge: pipelineBadgeCount,
          },
          {
            id: "ledger",
            label: "Deposit Ledger",
            badge: computed.ledgerEntries.length,
          },
          {
            id: "released",
            label: "Released & Deducted",
            badge: computed.resolvedLedger.length,
          },
          {
            id: "receivables",
            label: "Receivables",
            badge: computed.receivables.length,
          },
          { id: "settings", label: "Deposit Settings" },
        ].map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-2.5 text-[13px] border-b-2 transition-colors cursor-pointer inline-flex items-center gap-1.5 ${isActive
                ? "border-[#2b2118] font-semibold text-[#2b2118]"
                : "border-transparent font-medium text-[#8a8174] hover:text-[#2b2118]"
                }`}
            >
              <span>{t.label}</span>
              {typeof t.badge === "number" && t.badge > 0 && (
                <span className="rounded-full bg-[#efe7d6] px-1.5 py-0.5 text-[10.5px] font-bold text-[#8c6d32]">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: RETURN PIPELINE */}
      {activeTab === "pipeline" && (
        <div className="space-y-6">
          {/* 1. OVERDUE RETURNS */}
          <div ref={overdueRef}>
            {computed.overdue.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#b44b32]">
                  <span>⚠ OVERDUE RETURNS</span>
                  <span className="rounded-full bg-[#f5e3dc] px-2 py-0.5 text-[10px] text-[#b44b32]">
                    {computed.overdue.length}
                  </span>
                </div>

                {computed.overdue.map((item) => (
                  <div
                    key={item.rawId}
                    className="flex flex-col md:flex-row md:items-start justify-between gap-4 rounded-[8px] border border-[#dc8b78] bg-white p-4 shadow-2xs"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex flex-col items-center justify-center w-[48px] h-[48px] rounded-[6px] border border-[#e6dcd0] bg-[#fbf8f3] shrink-0">
                        <span className="text-[15px] font-bold text-[#2b2118] leading-none">
                          {item.dueDate.getDate()}
                        </span>
                        <span className="text-[9.5px] font-semibold uppercase text-[#8a8174] mt-0.5">
                          {item.dueDate.toLocaleString("en-GB", {
                            month: "short",
                          })}
                        </span>
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[14px] font-semibold text-[#b88940]">
                            ⚠ {item.productName}
                          </span>
                          <span className="text-[14px] font-semibold text-[#2b2118]">
                            — {item.designer}
                          </span>
                          <span className="rounded bg-[#fbe6e1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#b44b32]">
                            {item.daysLate} DAY{item.daysLate > 1 ? "S" : ""}{" "}
                            LATE
                          </span>
                        </div>
                        <p className="text-[12.5px] text-[#7d756b]">
                          {item.displayId} · {item.customerName} · {item.city} ·
                          return was due {fmtShort(item.dueDate)}
                        </p>
                        <p className="text-[12.5px] font-medium text-[#b44b32]">
                          Late fee accruing: {money(item.accruedLateFee)} (
                          {money(item.dailyLateFee)}/day × {item.daysLate}) ·{" "}
                          {money(item.deposit)} deposit held
                        </p>

                        {item.nextBooking && (
                          <div className="mt-2 rounded border border-[#efd2c9] bg-[#fdf4f1] px-3 py-2 text-[12px] text-[#a6422b]">
                            ⚠ Booked next by {item.nextBooking.customerName} (
                            {item.nextBooking.displayId}) — dispatching{" "}
                            {fmtShort(addDays(item.nextBooking.rStart, -2))}.
                            Until this piece is back, cleaned and inspected,
                            that dispatch is at risk. Chase today.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 min-w-[156px]">
                      <button
                        type="button"
                        onClick={() =>
                          openWhatsApp(
                            item.phone,
                            item.customerName,
                            item.displayId,
                            item.productName,
                          )
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-[5px] bg-[#25b561] hover:bg-[#1fa055] px-3 py-1.5 text-[12px] font-semibold text-white cursor-pointer"
                      >
                        <WhatsAppBadgeIcon /> WhatsApp {item.firstName}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReturnModalOrder(item.raw);
                          setReturnCondition("A");
                          setReturnNotes("");
                        }}
                        className="rounded-[5px] bg-[#c5a467] hover:bg-[#b59355] px-3 py-1.5 text-[12px] font-semibold text-[#2b2118] cursor-pointer"
                      >
                        Log Return →
                      </button>
                      <button
                        type="button"
                        onClick={() => openOrder(item.rawId)}
                        className="rounded-[5px] border border-[#dcd4c6] bg-white hover:bg-[#faf7f2] px-3 py-1.5 text-[12px] font-medium text-[#2b2118] cursor-pointer"
                      >
                        View Order →
                      </button>
                      {item.nextBooking && (
                        <button
                          type="button"
                          onClick={() => openOrder(item.nextBooking.rawId)}
                          className="rounded-[5px] border border-[#dcd4c6] bg-white hover:bg-[#faf7f2] px-3 py-1.5 text-[12px] font-medium text-[#2b2118] cursor-pointer"
                        >
                          View Next Booking →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. DUE BACK TODAY */}
          <div ref={dueTodayRef} className="space-y-2.5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#3a332a]">
              <span>DUE BACK TODAY</span>
              <span className="rounded-full bg-[#ebe5da] px-2 py-0.5 text-[10px] text-[#6e665b]">
                {computed.dueToday.length}
              </span>
            </div>

            {computed.dueToday.length === 0 ? (
              <div className="rounded-[6px] border border-[#ebe5da] bg-[#fdfbf8] py-8 text-center text-[13px] text-[#968d80]">
                No returns due today.
              </div>
            ) : (
              computed.dueToday.map((item) => (
                <div
                  key={item.rawId}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-[8px] border border-[#e8e1d5] bg-white p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center w-[48px] h-[48px] rounded-[6px] bg-[#f3ede2] shrink-0">
                      <span className="text-[15px] font-bold text-[#2b2118] leading-none">
                        {item.dueDate.getDate()}
                      </span>
                      <span className="text-[9.5px] font-semibold uppercase text-[#8a8174] mt-0.5">
                        {item.dueDate.toLocaleString("en-GB", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold">
                        <span className="text-[#b8925a]">
                          {item.productName}
                        </span>{" "}
                        <span className="text-[#2b2118]">
                          — {item.designer}
                        </span>
                      </div>
                      <p className="text-[12.5px] text-[#7d756b] mt-0.5">
                        {item.displayId} · {item.customerName} · {item.city} ·
                        due back today · {money(item.deposit)} deposit
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 min-w-[156px]">
                    <button
                      type="button"
                      onClick={() =>
                        openWhatsApp(
                          item.phone,
                          item.customerName,
                          item.displayId,
                          item.productName,
                        )
                      }
                      className="inline-flex items-center justify-center gap-1.5 rounded-[5px] bg-[#25b561] hover:bg-[#1fa055] px-3 py-1.5 text-[12px] font-semibold text-white cursor-pointer"
                    >
                      <WhatsAppBadgeIcon /> WhatsApp {item.firstName}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReturnModalOrder(item.raw);
                        setReturnCondition("A");
                        setReturnNotes("");
                      }}
                      className="rounded-[5px] bg-[#c5a467] hover:bg-[#b59355] px-3 py-1.5 text-[12px] font-semibold text-[#2b2118] cursor-pointer"
                    >
                      Log Return →
                    </button>
                    <button
                      type="button"
                      onClick={() => openOrder(item.rawId)}
                      className="rounded-[5px] border border-[#dcd4c6] bg-white hover:bg-[#faf7f2] px-3 py-1.5 text-[12px] font-medium text-[#2b2118] cursor-pointer"
                    >
                      View Order →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 3. CANCELLED — DEPOSIT REFUND DUE */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#3a332a]">
              <span>CANCELLED — DEPOSIT REFUND DUE</span>
              <span className="rounded-full bg-[#ebe5da] px-2 py-0.5 text-[10px] text-[#6e665b]">
                {computed.cancelledRefundDue.length}
              </span>
            </div>

            {computed.cancelledRefundDue.length === 0 ? (
              <div className="rounded-[6px] border border-[#ebe5da] bg-[#fdfbf8] py-8 text-center text-[13px] text-[#968d80]">
                No cancelled orders holding a deposit.
              </div>
            ) : (
              computed.cancelledRefundDue.map((item) => (
                <div
                  key={item.rawId}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-[8px] border border-[#e8e1d5] bg-white p-4"
                >
                  <div>
                    <div className="text-[14px] font-semibold">
                      <span className="text-[#b8925a]">{item.productName}</span>{" "}
                      — {item.designer}
                    </div>
                    <p className="text-[12.5px] text-[#7d756b] mt-0.5">
                      {item.displayId} · {item.customerName} · {item.city} ·{" "}
                      {money(item.deposit)} refund due
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 min-w-[156px]">
                    <button
                      type="button"
                      onClick={() => {
                        setDecideModalOrder(item.raw);
                        setDeductionAmount("0");
                        setReleaseReason("Cancelled order deposit refund");
                      }}
                      className="rounded-[5px] bg-[#c5a467] hover:bg-[#b59355] px-3 py-1.5 text-[12px] font-semibold text-[#2b2118] cursor-pointer"
                    >
                      Refund Deposit →
                    </button>
                    <button
                      type="button"
                      onClick={() => openOrder(item.rawId)}
                      className="rounded-[5px] border border-[#dcd4c6] bg-white hover:bg-[#faf7f2] px-3 py-1.5 text-[12px] font-medium text-[#2b2118] cursor-pointer"
                    >
                      View Order →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 4. RETURNED — DEPOSIT DECISION PENDING */}
          <div ref={awaitingReleaseRef} className="space-y-2.5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#3a332a]">
              <span>RETURNED — DEPOSIT DECISION PENDING</span>
              <span className="rounded-full bg-[#ebe5da] px-2 py-0.5 text-[10px] text-[#6e665b]">
                {computed.returnedDecisionPending.length}
              </span>
            </div>

            {computed.returnedDecisionPending.length === 0 ? (
              <div className="rounded-[6px] border border-[#ebe5da] bg-[#fdfbf8] py-8 text-center text-[13px] text-[#968d80]">
                No returned pieces awaiting deposit decision.
              </div>
            ) : (
              computed.returnedDecisionPending.map((item) => (
                <div
                  key={item.rawId}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-[8px] border border-[#e8e1d5] bg-white p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center w-[48px] h-[48px] rounded-[6px] bg-[#f3ede2] shrink-0">
                      <span className="text-[15px] font-bold text-[#2b2118] leading-none">
                        {item.retDay.getDate()}
                      </span>
                      <span className="text-[9.5px] font-semibold uppercase text-[#8a8174] mt-0.5">
                        {item.retDay.toLocaleString("en-GB", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-semibold text-[#b8925a]">
                          {item.productName}
                        </span>
                        <span className="text-[14px] font-semibold text-[#2b2118]">
                          — {item.designer}
                        </span>
                        <span className="rounded bg-[#f5efe2] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8a6d32]">
                          {item.grade === "A" || item.grade === "B"
                            ? "NORMAL WEAR"
                            : `GRADE ${item.grade}`}
                        </span>
                      </div>
                      <p className="text-[12.5px] text-[#7d756b]">
                        {item.displayId} · {item.customerName} · returned{" "}
                        {fmtShort(item.retDay)}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#5c5347]">
                        <span>{money(item.deposit)} held ·</span>
                        <span className="rounded bg-[#f7eedb] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8c6b28]">
                          T+{tPlusDays} · RELEASE BY{" "}
                          {fmtShort(item.releaseDeadline).toUpperCase()} (
                          {item.daysLeft >= 0
                            ? `${item.daysLeft}D LEFT`
                            : `${Math.abs(item.daysLeft)}D OVERDUE`}
                          )
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 min-w-[156px]">
                    <button
                      type="button"
                      onClick={() => {
                        setDecideModalOrder(item.raw);
                        setDeductionAmount("0");
                        setReleaseReason("");
                      }}
                      className="rounded-[5px] bg-[#c5a467] hover:bg-[#b59355] px-3 py-1.5 text-[12px] font-semibold text-[#2b2118] cursor-pointer"
                    >
                      Decide Deposit →
                    </button>
                    <button
                      type="button"
                      onClick={() => openOrder(item.rawId)}
                      className="rounded-[5px] border border-[#dcd4c6] bg-white hover:bg-[#faf7f2] px-3 py-1.5 text-[12px] font-medium text-[#2b2118] cursor-pointer"
                    >
                      View Order →
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openWhatsApp(
                          item.phone,
                          item.customerName,
                          item.displayId,
                          item.productName,
                        )
                      }
                      className="inline-flex items-center justify-center gap-1.5 rounded-[5px] bg-[#25b561] hover:bg-[#1fa055] px-3 py-1.5 text-[12px] font-semibold text-white cursor-pointer"
                    >
                      <WhatsAppBadgeIcon /> WhatsApp {item.firstName}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 5. DUE BACK THIS WEEK */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#3a332a]">
              <span>DUE BACK THIS WEEK</span>
              <span className="rounded-full bg-[#ebe5da] px-2 py-0.5 text-[10px] text-[#6e665b]">
                {computed.dueThisWeek.length}
              </span>
            </div>

            {computed.dueThisWeek.length === 0 ? (
              <div className="rounded-[6px] border border-[#ebe5da] bg-[#fdfbf8] py-8 text-center text-[13px] text-[#968d80]">
                No other returns due back this week.
              </div>
            ) : (
              computed.dueThisWeek.map((item) => (
                <div
                  key={item.rawId}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-[8px] border border-[#e8e1d5] bg-white p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center w-[48px] h-[48px] rounded-[6px] bg-[#f3ede2] shrink-0">
                      <span className="text-[15px] font-bold text-[#2b2118] leading-none">
                        {item.dueDate.getDate()}
                      </span>
                      <span className="text-[9.5px] font-semibold uppercase text-[#8a8174] mt-0.5">
                        {item.dueDate.toLocaleString("en-GB", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-semibold text-[#b8925a]">
                          {item.productName}
                        </span>
                        <span className="text-[14px] font-semibold text-[#2b2118]">
                          — {item.designer}
                        </span>
                        {item.awaitingDispatch && (
                          <span className="rounded bg-[#f1eee8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#787065]">
                            AWAITING DISPATCH
                          </span>
                        )}
                      </div>
                      <p className="text-[12.5px] text-[#7d756b] mt-0.5">
                        {item.displayId} · {item.customerName} · {item.city} ·
                        due back {fmtShort(item.dueDate)} (in{" "}
                        {item.daysUntilDue}d) · {money(item.deposit)} deposit
                        {item.depositUncollected && (
                          <span className="text-[#b44b32] font-semibold">
                            {" "}
                            · collect before dispatch
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 min-w-[156px]">
                    {item.awaitingDispatch ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setView("dispatch")}
                          className="rounded-[5px] border border-[#dcd4c6] bg-white hover:bg-[#faf7f2] px-3 py-1.5 text-[12px] font-medium text-[#2b2118] cursor-pointer"
                        >
                          Dispatch Schedule →
                        </button>
                        <button
                          type="button"
                          onClick={() => openOrder(item.rawId)}
                          className="rounded-[5px] border border-[#dcd4c6] bg-white hover:bg-[#faf7f2] px-3 py-1.5 text-[12px] font-medium text-[#2b2118] cursor-pointer"
                        >
                          View Order →
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            openWhatsApp(
                              item.phone,
                              item.customerName,
                              item.displayId,
                              item.productName,
                            )
                          }
                          className="inline-flex items-center justify-center gap-1.5 rounded-[5px] bg-[#25b561] hover:bg-[#1fa055] px-3 py-1.5 text-[12px] font-semibold text-white cursor-pointer"
                        >
                          <WhatsAppBadgeIcon /> WhatsApp {item.firstName}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReturnModalOrder(item.raw);
                            setReturnCondition("A");
                            setReturnNotes("");
                          }}
                          className="rounded-[5px] bg-[#c5a467] hover:bg-[#b59355] px-3 py-1.5 text-[12px] font-semibold text-[#2b2118] cursor-pointer"
                        >
                          Log Return →
                        </button>
                        <button
                          type="button"
                          onClick={() => openOrder(item.rawId)}
                          className="rounded-[5px] border border-[#dcd4c6] bg-white hover:bg-[#faf7f2] px-3 py-1.5 text-[12px] font-medium text-[#2b2118] cursor-pointer"
                        >
                          View Order →
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 6. ACTIVE RENTALS — DEPOSIT HELD */}
          {computed.activeHeldBeyondWeek.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#3a332a]">
                <span>ACTIVE RENTALS — DEPOSIT HELD</span>
                <span className="rounded-full bg-[#ebe5da] px-2 py-0.5 text-[10px] text-[#6e665b]">
                  {computed.activeHeldBeyondWeek.length}
                </span>
              </div>

              {computed.activeHeldBeyondWeek.map((item) => (
                <div
                  key={item.rawId}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-[8px] border border-[#e8e1d5] bg-white p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center w-[48px] h-[48px] rounded-[6px] bg-[#f3ede2] shrink-0">
                      <span className="text-[15px] font-bold text-[#2b2118] leading-none">
                        {item.dueDate.getDate()}
                      </span>
                      <span className="text-[9.5px] font-semibold uppercase text-[#8a8174] mt-0.5">
                        {item.dueDate.toLocaleString("en-GB", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-semibold text-[#b8925a]">
                          {item.productName}
                        </span>
                        <span className="text-[14px] font-semibold text-[#2b2118]">
                          — {item.designer}
                        </span>
                        <span className="rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                          HELD SECURELY
                        </span>
                      </div>
                      <p className="text-[12.5px] text-[#7d756b] mt-0.5">
                        {item.displayId} · {item.customerName} · {item.city} ·{" "}
                        {item.hasExplicitDueDate
                          ? `due back ${fmtShort(item.dueDate)}`
                          : `status: ${item.status}`}{" "}
                        · {money(item.deposit)} deposit held
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 min-w-[156px]">
                    <button
                      type="button"
                      onClick={() =>
                        openWhatsApp(
                          item.phone,
                          item.customerName,
                          item.displayId,
                          item.productName,
                        )
                      }
                      className="inline-flex items-center justify-center gap-1.5 rounded-[5px] bg-[#25b561] hover:bg-[#1fa055] px-3 py-1.5 text-[12px] font-semibold text-white cursor-pointer"
                    >
                      <WhatsAppBadgeIcon /> WhatsApp {item.firstName}
                    </button>
                    {!item.awaitingDispatch && (
                      <button
                        type="button"
                        onClick={() => {
                          setReturnModalOrder(item.raw);
                          setReturnCondition("A");
                          setReturnNotes("");
                        }}
                        className="rounded-[5px] bg-[#c5a467] hover:bg-[#b59355] px-3 py-1.5 text-[12px] font-semibold text-[#2b2118] cursor-pointer"
                      >
                        Log Return →
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openOrder(item.rawId)}
                      className="rounded-[5px] border border-[#dcd4c6] bg-white hover:bg-[#faf7f2] px-3 py-1.5 text-[12px] font-medium text-[#2b2118] cursor-pointer"
                    >
                      View Order →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Card: Pieces due back after this week */}
          {computed.dueAfterWeek.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[8px] border border-[#e8e1d5] bg-[#f4f0e8] px-5 py-4">
              <div>
                <div className="text-[13.5px] font-semibold text-[#2b2118]">
                  {computed.dueAfterWeek.length} more piece
                  {computed.dueAfterWeek.length > 1 ? "s" : ""} due back after
                  this week
                </div>
                <p className="text-[12px] text-[#7d756b] mt-0.5">
                  Earliest: {computed.dueAfterWeek[0].productName} —{" "}
                  {fmtShort(computed.dueAfterWeek[0].dueDate)} (
                  {computed.dueAfterWeek[0].displayId}). The full picture lives
                  on the Operations Calendar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setView("calendar")}
                className="rounded-[5px] border border-[#dcd4c6] bg-white hover:bg-[#faf7f2] px-4 py-2 text-[12px] font-semibold text-[#2b2118] shrink-0 cursor-pointer"
              >
                Open Calendar →
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DEPOSIT LEDGER */}
      {activeTab === "ledger" && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8a8174]" />
              <input
                type="text"
                placeholder="Search order, customer, or piece..."
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                className="w-full rounded-[6px] border border-[#dcd4c6] bg-white pl-9 pr-3 py-1.5 text-[12.5px] outline-none focus:border-[#c08829]"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["All", "Held", "Pending", "Released", "Refunded", "Deducted"].map(
                (f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setLedgerFilter(f)}
                    className={`rounded-[5px] px-3 py-1.5 text-[11.5px] font-medium border cursor-pointer transition ${ledgerFilter === f
                      ? "border-[#2b2118] bg-[#2b2118] text-white"
                      : "border-[#dcd4c6] bg-white text-[#5c5347] hover:bg-[#faf7f2]"
                      }`}
                  >
                    {f}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="rounded-[8px] border border-[#e8e1d5] bg-white overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#f7f4ef] text-[10px] font-bold uppercase tracking-wider text-[#91887b] border-b border-[#e8e1d5]">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Piece</th>
                  <th className="px-4 py-3">Deposit</th>
                  <th className="px-4 py-3">Order Status</th>
                  <th className="px-4 py-3">Deposit Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee9e0]">
                {filteredLedger.map((x) => {
                  const ds = x.depStatus.toLowerCase();
                  const badgeCls =
                    ds === "held"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : ds === "released" || ds === "refunded"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : ds === "partially released" ||
                          ds === "partial" ||
                          ds === "forfeited"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-[#f5efe2] text-[#8a6d32]";
                  return (
                    <tr key={x.rawId} className="hover:bg-[#fdfbf8]">
                      <td className="px-4 py-3 font-semibold">{x.displayId}</td>
                      <td className="px-4 py-3">{x.customerName}</td>
                      <td className="px-4 py-3">{x.productName}</td>
                      <td className="px-4 py-3 font-semibold">
                        {money(x.deposit)}
                      </td>
                      <td className="px-4 py-3">{x.status}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[11px] font-semibold ${badgeCls}`}
                        >
                          {x.depStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                        {ds === "held" && (
                          <button
                            type="button"
                            onClick={() => {
                              setDecideModalOrder(x.raw);
                              setDeductionAmount("0");
                              setReleaseReason("");
                            }}
                            className="rounded bg-[#c5a467] hover:bg-[#b59355] px-2.5 py-1 text-[11.5px] font-semibold text-[#2b2118] cursor-pointer"
                          >
                            Decide Deposit →
                          </button>
                        )}
                        {ds === "pending" &&
                          x.status.toLowerCase() !== "cancelled" && (
                            <button
                              type="button"
                              onClick={() => handleMarkDepositCollected(x.raw)}
                              className="rounded border border-[#c5a467] bg-[#fcf8f0] hover:bg-[#f5ebd8] px-2.5 py-1 text-[11.5px] font-semibold text-[#8a6d32] cursor-pointer"
                            >
                              Mark Held
                            </button>
                          )}
                        <button
                          type="button"
                          onClick={() => openOrder(x.rawId)}
                          className="rounded border border-[#dcd4c6] bg-white px-2.5 py-1 text-[11.5px] font-medium hover:bg-[#faf7f2] cursor-pointer"
                        >
                          View Order →
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredLedger.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-[#968d80]"
                    >
                      No security deposits match your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RELEASED & DEDUCTED */}
      {activeTab === "released" && (
        <div className="space-y-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8a8174]" />
            <input
              type="text"
              placeholder="Search refunded / released order or customer..."
              value={releasedSearch}
              onChange={(e) => setReleasedSearch(e.target.value)}
              className="w-full rounded-[6px] border border-[#dcd4c6] bg-white pl-9 pr-3 py-1.5 text-[12.5px] outline-none focus:border-[#c08829]"
            />
          </div>

          <div className="rounded-[8px] border border-[#e8e1d5] bg-white overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#f7f4ef] text-[10px] font-bold uppercase tracking-wider text-[#91887b] border-b border-[#e8e1d5]">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Piece</th>
                  <th className="px-4 py-3">Released</th>
                  <th className="px-4 py-3">Deducted</th>
                  <th className="px-4 py-3">Outcome</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee9e0]">
                {filteredReleased.map((x) => {
                  const ds = x.depStatus.toLowerCase();
                  const outcomeCls =
                    ds === "forfeited"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : ds === "partially released" || ds === "partial"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200";
                  return (
                    <tr key={x.rawId} className="hover:bg-[#fdfbf8]">
                      <td className="px-4 py-3 font-semibold">{x.displayId}</td>
                      <td className="px-4 py-3">{x.customerName}</td>
                      <td className="px-4 py-3">{x.productName}</td>
                      <td className="px-4 py-3 text-[#4c7042] font-semibold">
                        {money(x.releasedVal)}
                      </td>
                      <td className="px-4 py-3 text-[#b44b32] font-semibold">
                        {money(x.deductedVal)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-start gap-0.5">
                          <span
                            className={`rounded px-2 py-0.5 text-[11px] font-semibold ${outcomeCls}`}
                          >
                            {x.depStatus}
                          </span>
                          {x.settlementNote && (
                            <span className="text-[11px] text-[#8a8174] line-clamp-1 max-w-[240px]">
                              {x.settlementNote}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openOrder(x.rawId)}
                          className="rounded border border-[#dcd4c6] bg-white px-2.5 py-1 text-[11.5px] font-medium hover:bg-[#faf7f2] cursor-pointer"
                        >
                          View Order →
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredReleased.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-[#968d80]"
                    >
                      No released, refunded, or deducted deposits yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RECEIVABLES */}
      {activeTab === "receivables" && (
        <div className="space-y-3">
          {computed.receivables.length === 0 ? (
            <div className="rounded-[6px] border border-[#ebe5da] bg-[#fdfbf8] py-10 text-center text-[13px] text-[#968d80]">
              All active rental deposits have been collected.
            </div>
          ) : (
            computed.receivables.map((x) => (
              <div
                key={x.rawId}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[8px] border border-[#e8e1d5] bg-white p-4"
              >
                <div>
                  <div className="text-[14px] font-semibold">
                    <span className="text-[#b8925a]">{x.productName}</span> —{" "}
                    {x.designer}
                  </div>
                  <p className="text-[12.5px] text-[#7d756b] mt-0.5">
                    {x.displayId} · {x.customerName} · {x.city} ·{" "}
                    <strong className="text-[#b44b32]">
                      {money(x.deposit)} pending collection
                    </strong>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMarkDepositCollected(x.raw)}
                    className="rounded-[5px] bg-[#c5a467] hover:bg-[#b59355] px-3 py-1.5 text-[12px] font-semibold text-[#2b2118] cursor-pointer"
                  >
                    Mark Deposit Held →
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openWhatsApp(
                        x.phone,
                        x.customerName,
                        x.displayId,
                        x.productName,
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-[5px] bg-[#25b561] px-3 py-1.5 text-[12px] font-semibold text-white cursor-pointer"
                  >
                    <WhatsAppBadgeIcon /> Chase Deposit
                  </button>
                  <button
                    type="button"
                    onClick={() => openOrder(x.rawId)}
                    className="rounded-[5px] border border-[#dcd4c6] bg-white px-3 py-1.5 text-[12px] font-medium cursor-pointer"
                  >
                    View Order →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 5: DEPOSIT SETTINGS */}
      {activeTab === "settings" && (
        <div className="max-w-xl rounded-[8px] border border-[#e8e1d5] bg-white p-6 space-y-4">
          <h3 className="text-[15px] font-semibold text-[#2b2118]">
            Studio Deposit &amp; Return SLA Rules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block text-[12px] font-semibold text-[#6e665b]">
              Inspection &amp; Release Promise (T+N Days)
              <input
                type="number"
                min={1}
                max={14}
                value={tPlusDays}
                onChange={(e) => setTPlusDays(Number(e.target.value) || 3)}
                className="mt-1.5 w-full rounded border border-[#dcd4c6] px-3 py-2 text-[13px] text-[#2b2118]"
              />
            </label>
            <label className="block text-[12px] font-semibold text-[#6e665b]">
              Daily Late Fee (% of per-day rental)
              <input
                type="number"
                min={0}
                max={200}
                value={lateFeeDailyPct}
                onChange={(e) =>
                  setLateFeeDailyPct(Number(e.target.value) || 25)
                }
                className="mt-1.5 w-full rounded border border-[#dcd4c6] px-3 py-2 text-[13px] text-[#2b2118]"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem("hok_deposit_tplus", String(tPlusDays));
              localStorage.setItem(
                "hok_deposit_late_pct",
                String(lateFeeDailyPct),
              );
              toast.success("Deposit SLA settings saved & applied!");
            }}
            className="rounded-[5px] bg-[#c5a467] hover:bg-[#b59355] px-4 py-2 text-[12.5px] font-semibold text-[#2b2118] cursor-pointer"
          >
            Save Rules
          </button>
        </div>
      )}

      {/* Log Return Modal */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[8px] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#ebe5da] pb-3">
              <h3 className="text-[16px] font-semibold">
                Log Return — {returnModalOrder.id}
              </h3>
              <button
                type="button"
                onClick={() => setReturnModalOrder(null)}
                className="text-[#8a8174] hover:text-[#2b2118] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <label className="block text-[12px] font-semibold text-[#5c5347]">
              Condition Grade on Arrival
              <select
                value={returnCondition}
                onChange={(e) => setReturnCondition(e.target.value as any)}
                className="mt-1 w-full rounded border border-[#dcd4c6] px-3 py-2 text-[13px]"
              >
                <option value="A">Grade A — Normal Wear (Pristine)</option>
                <option value="B">Grade B — Minor Cleaning Needed</option>
                <option value="C">Grade C — Repairable Damage</option>
                <option value="D">Grade D — Severe Damage</option>
              </select>
            </label>
            <label className="block text-[12px] font-semibold text-[#5c5347]">
              Inspection Notes
              <textarea
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                rows={3}
                placeholder="Record Zardozi / hem / stain inspection notes..."
                className="mt-1 w-full rounded border border-[#dcd4c6] px-3 py-2 text-[13px]"
              />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReturnModalOrder(null)}
                className="rounded border border-[#dcd4c6] px-4 py-1.5 text-[12.5px] font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogReturn}
                className="rounded bg-[#c5a467] px-4 py-1.5 text-[12.5px] font-semibold text-[#2b2118] cursor-pointer"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decide Deposit Modal */}
      {decideModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[8px] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#ebe5da] pb-3">
              <h3 className="text-[16px] font-semibold">
                Decide Deposit — {decideModalOrder.id}
              </h3>
              <button
                type="button"
                onClick={() => setDecideModalOrder(null)}
                className="text-[#8a8174] hover:text-[#2b2118] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[13px] text-[#6e665b]">
              Deposit / Refund amount:{" "}
              <strong className="text-[#2b2118]">
                {money(
                  decideModalOrder.deposit ||
                  (decideModalOrder as any).grandTotal ||
                  decideModalOrder.amount ||
                  0,
                )}
              </strong>
            </p>
            <label className="block text-[12px] font-semibold text-[#5c5347]">
              Deduction Amount (₹) — leave 0 for full release
              <input
                type="number"
                min={0}
                max={
                  decideModalOrder.deposit ||
                  (decideModalOrder as any).grandTotal ||
                  decideModalOrder.amount ||
                  0
                }
                value={deductionAmount}
                onChange={(e) => setDeductionAmount(e.target.value)}
                className="mt-1 w-full rounded border border-[#dcd4c6] px-3 py-2 text-[13px]"
              />
            </label>
            <label className="block text-[12px] font-semibold text-[#5c5347]">
              Decision Note
              <input
                type="text"
                value={releaseReason}
                onChange={(e) => setReleaseReason(e.target.value)}
                placeholder="e.g. Normal wear, full refund approved"
                className="mt-1 w-full rounded border border-[#dcd4c6] px-3 py-2 text-[13px]"
              />
            </label>
            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDecideModalOrder(null)}
                className="rounded border border-[#dcd4c6] px-3 py-1.5 text-[12px] font-medium cursor-pointer"
              >
                Cancel
              </button>
              {Number(deductionAmount) > 0 ? (
                <button
                  type="button"
                  onClick={() =>
                    handleConfirmDepositDecision(
                      Number(deductionAmount) >=
                        Number(
                          decideModalOrder.deposit ||
                          (decideModalOrder as any).grandTotal ||
                          decideModalOrder.amount ||
                          0,
                        )
                        ? "Forfeited"
                        : "Partial",
                    )
                  }
                  className="rounded bg-[#b44b32] px-4 py-1.5 text-[12px] font-semibold text-white cursor-pointer"
                >
                  Deduct &amp; Release Balance
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleConfirmDepositDecision("Released")}
                  className="rounded bg-[#25b561] px-4 py-1.5 text-[12px] font-semibold text-white cursor-pointer"
                >
                  Release Full{" "}
                  {money(
                    decideModalOrder.deposit ||
                    (decideModalOrder as any).grandTotal ||
                    decideModalOrder.amount ||
                    0,
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
