import React, { useState } from "react";
import { Order } from "../types";
import toast from "react-hot-toast";
import "./Dispatch/css/DispatchView.css";
import "./Dispatch/css/DispatchItemCard.css";
import "./Dispatch/css/DepositWarning.css";

// ============================================================
// WHATSAPP ICON
// ============================================================
const WhatsAppIcon = () => (
  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm mr-1.5">
    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  </span>
);

function DepositWarning({ amount }: { amount: number }) {
  return (
    <div className="deposit-warning">
      <span className="deposit-warning-icon">⚠</span>
      <span>
        Deposit ₹{Number(amount).toLocaleString("en-IN")} not yet collected —
        record it on the order before this piece leaves the studio. Mark
        Dispatched will ask for an explicit override.
      </span>
    </div>
  );
}

interface DispatchViewProps {
  orders: Order[];
  setView: (view: string) => void;
  setSelectedOrderId: (id: string) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
}

const toLocalYMD = (d: Date = new Date()): string => {
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const normalizeDateToYMD = (raw: any): string => {
  if (!raw) return "";
  const str = String(raw).trim();
  if (!str) return "";
  const ymd = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymd) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`;
  const dmy = str.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? "" : toLocalYMD(parsed);
};

const addDaysYMD = (ymdStr: string, delta: number): string => {
  const m = ymdStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return ymdStr;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  d.setDate(d.getDate() + delta);
  return toLocalYMD(d);
};

const formatHumanDate = (raw: any): string => {
  const ymd = normalizeDateToYMD(raw);
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function DispatchView({
  orders,
  setView,
  setSelectedOrderId,
  onUpdateOrder,
}: DispatchViewProps) {
  const [activeTab, setActiveTab] = useState<"Today" | "Tomorrow" | "Week">(
    "Week",
  );

  // Helper to format date badge
  const formatDateForDisplay = (dateString: string) => {
    const ymd = normalizeDateToYMD(dateString);
    if (!ymd) return { day: "--", month: "---" };
    const [y, m, d] = ymd.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    if (isNaN(dt.getTime())) return { day: "--", month: "---" };
    return {
      day: dt.getDate().toString(),
      month: dt.toLocaleString("en-GB", { month: "short" }).toUpperCase(),
    };
  };

  const [filterDateStr, setFilterDateStr] = useState<string>(() =>
    toLocalYMD(new Date()),
  );

  const todayKey = normalizeDateToYMD(filterDateStr) || toLocalYMD(new Date());
  const tomorrowKey = addDaysYMD(todayKey, 1);
  const weekEndKey = addDaysYMD(todayKey, 7);

  const getBookedYMD = (order: any): string => {
    const direct = normalizeDateToYMD(
      order.orderDate || order.createdAt || order.invoiceDate,
    );
    if (direct) return direct;
    const rawId = String(order.orderId || order.id || "");
    const tsMatch = rawId.match(/HOK-ORD-(\d{13})/);
    if (tsMatch) {
      return toLocalYMD(new Date(Number(tsMatch[1])));
    }
    return "";
  };

  const getDispatchDate = (order: any): string => {
    const item = order.items?.[0] || order;
    const explicit =
      normalizeDateToYMD(order.dispatchDetails?.date) ||
      normalizeDateToYMD(item.dispatch?.date) ||
      normalizeDateToYMD(order.dispatchDate) ||
      normalizeDateToYMD(item.dispatchDate);
    if (explicit) return explicit;

    const rStart = normalizeDateToYMD(
      order.rentalStartDate || item.rentalStartDate,
    );
    if (rStart) {
      return addDaysYMD(rStart, -2);
    }
    return getBookedYMD(order);
  };

  const hasSavedLogistics = (o: any): boolean => {
    const item = o.items?.[0] || {};
    return Boolean(
      o.dispatchDetails?.date ||
        o.dispatchDetails?.dispatchedBy ||
        o.dispatchDetails?.trackingNumber ||
        o.dispatchDetails?.courierPartner ||
        item.dispatch?.date ||
        item.dispatch?.dispatchedBy ||
        item.dispatch?.trackingNumber ||
        item.dispatch?.courierPartner ||
        o.returnLogistics?.returnDate ||
        o.returnLogistics?.returnMethod,
    );
  };

  const isValidDispatch = (o: any) => {
    const pName = o.items?.[0]?.productName || o.productName;
    return !!pName && !!o.customerName && pName !== "Unknown Product";
  };

  const isActiveStatus = (status: string) =>
    status === "Confirmed" ||
    status === "Packed" ||
    status === "Dispatched" ||
    status === "Shipped";

  const dispatchToday = orders
    .filter((o: any) => {
      if (!isValidDispatch(o) || !isActiveStatus(o.status)) return false;
      const dDate = getDispatchDate(o);
      if (!dDate) return false;
      if (dDate === todayKey) return true;
      if (
        (o.status === "Confirmed" || o.status === "Packed") &&
        dDate <= todayKey
      )
        return true;
      return false;
    })
    .sort((a, b) => getDispatchDate(a).localeCompare(getDispatchDate(b)));

  const dispatchTomorrow = orders
    .filter((o: any) => {
      if (!isValidDispatch(o) || !isActiveStatus(o.status)) return false;
      return getDispatchDate(o) === tomorrowKey;
    })
    .sort((a, b) => getDispatchDate(a).localeCompare(getDispatchDate(b)));

  const dispatchWeek = orders
    .filter((o: any) => {
      if (!isValidDispatch(o) || !isActiveStatus(o.status)) return false;
      const dDate = getDispatchDate(o);
      if (!dDate) return false;

      if (
        (o.status === "Confirmed" || o.status === "Packed") &&
        dDate <= weekEndKey
      )
        return true;
      if (
        (o.status === "Dispatched" || o.status === "Shipped") &&
        dDate >= todayKey &&
        dDate <= weekEndKey
      )
        return true;
      return false;
    })
    .sort((a, b) => getDispatchDate(a).localeCompare(getDispatchDate(b)));

  const dispatchAll = orders
    .filter((o: any) => {
      if (!isValidDispatch(o)) return false;
      if (o.status === "Cancelled") return false;
      return isActiveStatus(o.status) || hasSavedLogistics(o);
    })
    .sort((a, b) => getDispatchDate(b).localeCompare(getDispatchDate(a)));

  const handleMarkDispatched = (
    order: Order,
    depositNeeded: boolean,
    depositCollected: boolean,
  ) => {
    if (depositNeeded && !depositCollected) {
      if (
        !window.confirm(
          `Deposit for order ${order.id} has NOT been collected yet. Are you sure you want to mark this as Dispatched and override the block?`,
        )
      ) {
        return;
      }
    }
    const existingDisp: any =
      order.dispatchDetails || (order as any).items?.[0]?.dispatch || {};
    const resolvedDate =
      normalizeDateToYMD(existingDisp.date) ||
      normalizeDateToYMD((order as any).dispatchDate) ||
      toLocalYMD(new Date());
    const resolvedCourier = existingDisp.courierPartner || "Delhivery";
    const resolvedHandledBy = existingDisp.dispatchedBy || resolvedCourier;
    const cLow = String(resolvedCourier).toLowerCase();
    const cleanExisting = String(existingDisp.trackingNumber || "")
      .trim()
      .toUpperCase()
      .replace(/[\s\-_]+/g, "");
    const resolvedTracking =
      cleanExisting ||
      (cLow.includes("dhl")
        ? `DHL${Math.floor(10000 + Math.random() * 90000)}`
        : `DEL${Math.floor(10000000 + Math.random() * 90000000)}IN`);

    const updated: any = {
      ...order,
      status: "Dispatched",
      dispatchDate: resolvedDate,
      dispatchDetails: {
        dispatchedBy: resolvedHandledBy,
        date: resolvedDate,
        trackingNumber: resolvedTracking,
        courierPartner: resolvedCourier,
      },
    };
    onUpdateOrder(updated);
  };

  const handleWhatsApp = (
    phone: string | undefined,
    name: string | undefined,
  ) => {
    if (!phone) {
      toast.error("No phone number found for this customer");
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${cleanPhone}`;
    window.open(url, "_blank");
  };

  const handlePrintLabel = () => {
    toast.success("Preparing shipping label for printing...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const currentList =
    activeTab === "Today"
      ? dispatchToday
      : activeTab === "Tomorrow"
        ? dispatchTomorrow
        : dispatchWeek;

  return (
    <div className="dispatch-page">
      <div className="dispatch-body">
        <span className="dispatch-eyebrow">OPERATIONS</span>
        <h1 className="dispatch-title">Dispatch Schedule</h1>
        <p className="dispatch-subtitle">
          Everything leaving the studio today, tomorrow, and this week. Mark
          dispatched, print labels, and jump to any order.
        </p>

        <div className="dispatch-date-row">
          <label>Filter Date:</label>
          <input
            type="date"
            value={filterDateStr}
            onChange={(e) => setFilterDateStr(e.target.value)}
            className="border border-stone-200 rounded px-2 py-1 text-sm outline-none focus:border-[#c5a880]"
          />
        </div>

        <div className="dispatch-tabs">
          {[
            { key: "Today", label: "Today", count: dispatchToday.length },
            {
              key: "Tomorrow",
              label: "Tomorrow",
              count: dispatchTomorrow.length,
            },
            { key: "Week", label: "This Week", count: dispatchWeek.length },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`dispatch-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="dispatch-tab-content">
          {currentList.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs font-sans">
              No dispatches scheduled for this period.
            </div>
          ) : (
            <div className="space-y-6">
              {currentList.map((order: any) => {
                const item = order.items?.[0] || order;
                const dDate = getDispatchDate(order);
                const dateParts = formatDateForDisplay(dDate || todayKey);

                const actualDeposit = Number(
                  order.depositHeld ??
                    order.deposit ??
                    item?.deposit ??
                    order.securityDeposit ??
                    0,
                );
                const depositNeeded = actualDeposit > 0;
                const depositCollected =
                  order.depositStatus === "Held" ||
                  order.depositStatus === "Released" ||
                  order.depositStatus === "Partially Released" ||
                  order.paymentStatus === "Paid";
                const pieces = order.items?.length || item.quantity || 1;
                const rStart = order.rentalStartDate || item.rentalStartDate;
                const rEnd = order.rentalEndDate || item.rentalEndDate;
                const bookedYMD = getBookedYMD(order);
                const orderMode = item.mode || order.mode || "Rental";
                const rentalDates =
                  rStart && rEnd
                    ? `${formatHumanDate(rStart)} – ${formatHumanDate(rEnd)}`
                    : bookedYMD
                      ? `${formatHumanDate(bookedYMD)} (${orderMode})`
                      : `${orderMode}`;
                const pName =
                  item.productName || order.productName || "Unknown Product";
                const pDesigner = item.designer || order.designer || "Unknown";
                const oId = order.orderId || order.id || order._id;

                const handledBy =
                  order.dispatchDetails?.dispatchedBy ||
                  item.dispatch?.dispatchedBy ||
                  "";
                const courier =
                  order.dispatchDetails?.courierPartner ||
                  item.dispatch?.courierPartner ||
                  handledBy ||
                  "TBD";
                const tracking =
                  order.dispatchDetails?.trackingNumber ||
                  item.dispatch?.trackingNumber ||
                  "";

                return (
                  <div key={oId}>
                    <div className="dispatch-card">
                      <div className="dispatch-card-date">
                        <span className="day">{dateParts.day}</span>
                        <span className="month">{dateParts.month}</span>
                      </div>

                      <div className="dispatch-card-info">
                        <h3>
                          {pName} — {pDesigner}
                          {pieces > 1 && (
                            <span className="pieces-badge">
                              {pieces} PIECES
                            </span>
                          )}
                        </h3>
                        <p>
                          {oId} · {order.customerName} ·{" "}
                          {(
                            order.address ||
                            order.customerCity ||
                            ""
                          ).substring(0, 20)}
                          ... · {rentalDates} · Size: {item.size || "M"} · Dep:
                          ₹{Number(actualDeposit).toLocaleString("en-IN")}
                        </p>

                        <p>
                          {handledBy && handledBy !== courier
                            ? `Handled By: ${handledBy} · `
                            : ""}
                          Courier: {courier} · Tracking:{" "}
                          {!tracking ? (
                            <span className="tracking-pending">
                              awaiting AWB
                            </span>
                          ) : (
                            tracking
                          )}
                        </p>
                      </div>

                      <div className="dispatch-card-actions">
                        <button
                          className="btn-whatsapp flex items-center"
                          onClick={() =>
                            handleWhatsApp(
                              order.customerPhone,
                              order.customerName,
                            )
                          }
                        >
                          <WhatsAppIcon /> WhatsApp{" "}
                          {order.customerName?.split(" ")[0]}
                        </button>
                        <button
                          className="btn-outline"
                          onClick={() => {
                            setSelectedOrderId(oId);
                            setView(`order_detail:${oId}`);
                          }}
                        >
                          View Order →
                        </button>
                        <button
                          className="btn-outline"
                          onClick={handlePrintLabel}
                        >
                          Print Label
                        </button>

                        {(order.status === "Confirmed" ||
                          order.status === "Packed") && (
                          <button
                            className="btn-mark-dispatched"
                            onClick={() =>
                              handleMarkDispatched(
                                order,
                                depositNeeded,
                                depositCollected,
                              )
                            }
                          >
                            Mark Dispatched
                          </button>
                        )}
                      </div>
                    </div>

                    {depositNeeded && !depositCollected && (
                      <DepositWarning amount={actualDeposit} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
