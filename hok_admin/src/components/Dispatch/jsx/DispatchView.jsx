import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { TodayTab, TomorrowTab, ThisWeekTab } from "../tabs";
import "./../css/DispatchView.css";

const parseLocalDay = (raw) => {
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

const toYMD = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const addDays = (d, n) => {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  copy.setDate(copy.getDate() + n);
  return copy;
};

export default function DispatchView({
  orders = [],
  setView,
  setSelectedOrderId,
  onUpdateOrder,
}) {
  const [activeTab, setActiveTab] = useState("today");
  const [demoDate, setDemoDate] = useState("");

  const realToday = useMemo(() => parseLocalDay(toYMD(new Date())), []);
  const pickedDate = useMemo(
    () => (demoDate ? parseLocalDay(demoDate) : null),
    [demoDate],
  );

  const { todayList, tomorrowList, weekList, conflictList, rotationItems } =
    useMemo(() => {
      const tomorrowDate = addDays(realToday, 1);
      const weekEnd = addDays(realToday, 7);

      const outboundStatuses = ["confirmed", "packed", "processing"];
      const inFieldRentals = orders.filter((o) => {
        const st = String(o.status || "").toLowerCase();
        return ["dispatched", "shipped", "delivered", "return sent", "return due"].includes(st);
      });

      const todayArr = [];
      const tomorrowArr = [];
      const weekArr = [];
      const conflictsArr = [];
      const rotationArr = [];

      orders.forEach((o) => {
        const statusLower = String(o.status || "").toLowerCase();
        const item = (Array.isArray(o.items) && o.items[0]) || o;
        const pName = item.productName || o.productName || "";
        if (!pName) return;

        const rawId = o.orderId || o.id || o._id || "";
        const displayId = String(rawId).startsWith("HOK-")
          ? String(rawId)
          : `HOK-ORD-${rawId}`;

        // Returned / Complete pieces -> Back in rotation
        if (["returned", "complete"].includes(statusLower)) {
          const retRaw =
            o.conditionAssessment?.receivedDate ||
            o.returnLogistics?.returnDate ||
            o.rentalEndDate ||
            item.rentalEndDate ||
            o.updatedAt;
          const retDate = parseLocalDay(retRaw);
          if (retDate) {
            rotationArr.push({
              orderId: item.productId || o.productId || displayId,
              day: String(retDate.getDate()),
              month: retDate
                .toLocaleString("en-GB", { month: "short" })
                .toUpperCase(),
              subtitle: `${pName} available for new bookings since ${retDate.getDate()} ${retDate.toLocaleString("en-GB", { month: "short" })}`,
            });
          }
          return;
        }

        if (!outboundStatuses.includes(statusLower)) return;

        const rStart = parseLocalDay(
          o.rentalStartDate || item.rentalStartDate || item.startDate,
        );
        const rEnd = parseLocalDay(
          o.rentalEndDate || item.rentalEndDate || item.endDate || rStart,
        );
        const explicitDisp = parseLocalDay(
          o.dispatchDetails?.date ||
            item.dispatch?.date ||
            o.dispatchDate ||
            item.dispatchDate,
        );
        const dispDate =
          explicitDisp ||
          (rStart ? addDays(rStart, -2) : parseLocalDay(o.orderDate || o.createdAt)) ||
          realToday;

        const courier =
          o.dispatchDetails?.courierPartner ||
          item.dispatch?.courierPartner ||
          "";
        const tracking =
          o.dispatchDetails?.trackingNumber ||
          item.dispatch?.trackingNumber ||
          "awaiting AWB";
        const deposit = Number(
          o.deposit ?? o.depositHeld ?? item.deposit ?? 0,
        );
        const depStatus = String(o.depositStatus || "Pending").toLowerCase();
        const depositCollected =
          deposit <= 0 ||
          ["held", "collected", "paid", "released"].includes(depStatus);

        const rentalDatesLabel =
          rStart && rEnd
            ? `${rStart.getDate()} ${rStart.toLocaleString("en-GB", { month: "short" })}–${rEnd.getDate()} ${rEnd.toLocaleString("en-GB", { month: "short", year: "numeric" })}`
            : `${o.mode || item.mode || "Buy"} Order`;

        const warnings = [];
        if (!courier) warnings.push("Courier not yet assigned");

        const cardData = {
          rawOrder: o,
          rawOrderId: rawId,
          orderId: displayId,
          day: String(dispDate.getDate()),
          month: dispDate
            .toLocaleString("en-GB", { month: "short" })
            .toUpperCase(),
          itemName: pName,
          designer: item.designer || o.designer || "House of Kaira",
          pieces: Array.isArray(o.items) ? o.items.length : 1,
          customer: o.customerName || "Customer",
          phone: o.customerPhone || "",
          city: String(o.customerCity || o.address || "India").split(",")[0],
          rentalDates: rentalDatesLabel,
          size: item.size || "M",
          deposit,
          depositCollected,
          courier: courier || "TBD",
          trackingId: tracking || "awaiting AWB",
          warnings: warnings.length > 0 ? warnings : undefined,
        };

        // Check active rental overlap conflict
        const conflicting = inFieldRentals.find((other) => {
          if ((other.id || other.orderId) === rawId) return false;
          const otherItem = (Array.isArray(other.items) && other.items[0]) || other;
          const samePiece =
            (item.productId &&
              otherItem.productId &&
              String(item.productId) === String(otherItem.productId)) ||
            pName === (otherItem.productName || other.productName);
          if (!samePiece) return false;
          const rawOtherEnd = parseLocalDay(
            other.rentalEndDate || otherItem.rentalEndDate,
          );
          if (!rawOtherEnd) return false;
          // Overdue piece (still out past its end date) is occupied until today
          const otherEnd = rawOtherEnd < realToday ? realToday : rawOtherEnd;
          const clearDate = addDays(otherEnd, 3);
          return clearDate > dispDate;
        });

        const dispTime = dispDate.getTime();
        const todayTime = realToday.getTime();
        const tomTime = tomorrowDate.getTime();
        const weekEndTime = weekEnd.getTime();
        const pickedTime = pickedDate ? pickedDate.getTime() : null;

        if (dispTime === todayTime && (!pickedTime || dispTime === pickedTime)) {
          todayArr.push(cardData);
        } else if (dispTime === tomTime && (!pickedTime || dispTime === pickedTime)) {
          tomorrowArr.push(cardData);
        }

        const matchesWeek = pickedTime
          ? dispTime === pickedTime
          : dispTime <= weekEndTime;

        if (matchesWeek) {
          if (conflicting) {
            const otherItem =
              (Array.isArray(conflicting.items) && conflicting.items[0]) ||
              conflicting;
            const rawEnd = parseLocalDay(
              conflicting.rentalEndDate || otherItem.rentalEndDate,
            );
            const otherEnd = rawEnd && rawEnd < realToday ? realToday : rawEnd;
            const clearDate = otherEnd ? addDays(otherEnd, 3) : dispDate;
            const otherId = conflicting.orderId || conflicting.id;
            conflictsArr.push({
              ...cardData,
              conflictingOrderId: otherId,
              conflictMessage: `Due to dispatch ${dispDate.getDate()} ${dispDate.toLocaleString("en-GB", { month: "short" })}, but this piece is rented to ${conflicting.customerName} (${otherId}) until ${otherEnd ? `${otherEnd.getDate()} ${otherEnd.toLocaleString("en-GB", { month: "short" })}` : "return"}, then in its post-return cleaning window until ${clearDate.getDate()} ${clearDate.toLocaleString("en-GB", { month: "short" })}. Earliest possible dispatch: ${clearDate.getDate()} ${clearDate.toLocaleString("en-GB", { month: "short" })}.`,
            });
          } else {
            weekArr.push(cardData);
          }
        }
      });

      return {
        todayList: todayArr,
        tomorrowList: tomorrowArr,
        weekList: weekArr,
        conflictList: conflictsArr,
        rotationItems: rotationArr.slice(0, 5),
      };
    }, [orders, realToday, pickedDate]);

  const handleViewOrder = (orderId) => {
    if (!orderId) return;
    setSelectedOrderId?.(orderId);
    setView?.(`order_detail:${orderId}`);
  };

  const handleMarkDispatched = (rawOrder) => {
    if (!rawOrder || !onUpdateOrder) return;
    const todayIso = toYMD(new Date());
    const courier = rawOrder.dispatchDetails?.courierPartner || "Delhivery";
    const cLow = String(courier).toLowerCase();
    const awbPrefix = cLow.includes("dhl")
      ? "DHL"
      : cLow.includes("blue")
        ? "DEL"
        : "DEL";
    const generatedAwb =
      awbPrefix === "DHL"
        ? `DHL${Math.floor(10000 + Math.random() * 90000)}`
        : `DEL${Math.floor(10000000 + Math.random() * 90000000)}IN`;
    const cleanExisting = String(rawOrder.dispatchDetails?.trackingNumber || "")
      .trim()
      .toUpperCase()
      .replace(/[\s\-_]+/g, "");
    onUpdateOrder({
      ...rawOrder,
      status: "Dispatched",
      dispatchDetails: {
        dispatchedBy: "Admin",
        date: rawOrder.dispatchDetails?.date || todayIso,
        courierPartner: courier,
        trackingNumber: cleanExisting || generatedAwb,
      },
    });
    toast.success(`Order ${rawOrder.orderId || rawOrder.id} marked Dispatched!`);
  };

  const tabs = [
    { key: "today", label: "Today", count: todayList.length },
    { key: "tomorrow", label: "Tomorrow", count: tomorrowList.length },
    {
      key: "week",
      label: "This Week",
      count: weekList.length + conflictList.length,
    },
  ];

  const renderTab = () => {
    if (activeTab === "today") {
      return (
        <TodayTab
          orders={todayList}
          onViewOrder={handleViewOrder}
          onMarkDispatched={handleMarkDispatched}
        />
      );
    }
    if (activeTab === "tomorrow") {
      return (
        <TomorrowTab
          orders={tomorrowList}
          onViewOrder={handleViewOrder}
          onMarkDispatched={handleMarkDispatched}
        />
      );
    }
    return (
      <ThisWeekTab
        orders={weekList}
        conflictOrders={conflictList}
        rotationItems={rotationItems}
        onViewOrder={handleViewOrder}
        onMarkDispatched={handleMarkDispatched}
        onViewCalendar={() => setView?.("calendar")}
      />
    );
  };

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
          <label>Demo date:</label>
          <input
            type="date"
            value={demoDate}
            onChange={(e) => setDemoDate(e.target.value)}
          />
          <span className="dispatch-date-note">
            — shared with the Operations Calendar's demo date
          </span>
        </div>

        <div className="dispatch-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`dispatch-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="dispatch-tab-content">{renderTab()}</div>
      </div>
    </div>
  );
}
