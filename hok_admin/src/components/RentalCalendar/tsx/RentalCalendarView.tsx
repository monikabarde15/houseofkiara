import React, { useState, useMemo } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import CalendarLegend from "./CalendarLegend";
import Sidebar from "./Sidebar";
import {
  CalendarEvent,
  CalendarViewMode,
  DispatchCard,
  AgendaEntry,
  GanttOrderRow,
  AgendaActionType,
} from "../types";
import "../css/RentalCalendarView.css";
import AgendaView from "./agenda/AgendaView";
import GanttView from "./gantt/GanttView";
import AddTaskModal from "./AddTaskModal";
import { Order } from "../../../types";

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

interface RentalCalendarViewProps {
  orders?: Order[];
  tasks?: CalendarEvent[];
  onAddTask?: (task: Partial<CalendarEvent>) => void;
  onSaveChanges?: () => void;
  onViewLiveSite?: () => void;
}

const RentalCalendarView: React.FC<RentalCalendarViewProps> = ({
  orders = [],
  tasks = [],
  onAddTask,
  onSaveChanges,
  onViewLiveSite,
}) => {
  const currentDate = new Date();
  const [month, setMonth] = useState(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
  );
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");

  const currentDemoDateStr = `${String(currentDate.getDate()).padStart(2, "0")}/${String(currentDate.getMonth() + 1).padStart(2, "0")}/${currentDate.getFullYear()}`;
  const [demoDate, setDemoDate] = useState(currentDemoDateStr);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayISO = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
  const monthLabel = MONTH_FORMATTER.format(month);
  const sidebarMonthLabel = `${month.toLocaleString("default", { month: "long" }).toUpperCase()} ${month.getFullYear()}`;

  const goToMonth = (delta: number) => {
    setMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1),
    );
  };

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleSaveTask = (newTask: CalendarEvent) => {
    if (onAddTask) onAddTask(newTask);
    setIsModalOpen(false);
  };

  // Convert real orders and custom tasks to Calendar Events, Dispatches, Agenda, and Gantt formats
  const { events, dispatches, agendaEntries, ganttRows } = useMemo(() => {
    const parseLocalDay = (raw: any): Date | null => {
      if (!raw) return null;
      const s = String(raw).trim();
      const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (ymd) {
        return new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
      }
      const d = new Date(s);
      if (isNaN(d.getTime())) return null;
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    };

    const toISO = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const formatOrderId = (rawId: any) => {
      const s = String(rawId || "");
      return s.startsWith("HOK-ORD-") ? s : `HOK-ORD-${s}`;
    };

    const activeOrders = orders.filter(
      (o: any) => String(o.status || "").toLowerCase() !== "cancelled",
    );
    const newEvents: CalendarEvent[] = [];
    const newDispatches: DispatchCard[] = [];
    const newAgenda: AgendaEntry[] = [];
    const newGantt: GanttOrderRow[] = [];

    activeOrders.forEach((order: any) => {
      const item = order.items?.[0] || order;
      const pName = item.productName || order.productName || "";
      if (!pName || pName === "Unknown Product") return;
      const pDesigner = item.designer || order.designer || "House of Kaira";
      const rStartStr = order.rentalStartDate || item.rentalStartDate || "";
      const rEndStr = order.rentalEndDate || item.rentalEndDate || "";
      const savedDispStr =
        order.dispatchDetails?.date ||
        item.dispatch?.date ||
        order.dispatchDate ||
        item.dispatchDate ||
        "";
      const tsMatch = String(order.orderId || order.id || "").match(
        /HOK-ORD-(\d{13})/,
      );
      const bookedDateObj =
        parseLocalDay(order.orderDate || order.createdAt || order.invoiceDate) ||
        (tsMatch ? parseLocalDay(new Date(Number(tsMatch[1]))) : null);

      const oid = formatOrderId(order.orderId || order.id || order._id);
      const isRental =
        (order.mode === "Rental" || item.mode === "Rental" || Boolean(rStartStr)) &&
        Boolean(rStartStr);

      if (!isRental) {
        const dispDate = parseLocalDay(savedDispStr) || bookedDateObj;
        if (!dispDate) return;
        const modeLabel = item.mode || order.mode || "Buy";
        const carrier =
          order.dispatchDetails?.courierPartner ||
          item.dispatch?.courierPartner ||
          "TBD";
        const detail = {
          customerName: order.customerName,
          customerLocation: (
            order.address ||
            order.customerCity ||
            "India"
          ).split(",")[0],
          customerPhone: order.customerPhone || "N/A",
          orderPlaced: bookedDateObj
            ? bookedDateObj.toLocaleDateString("en-GB")
            : dispDate.toLocaleDateString("en-GB"),
          productName: pName,
          productSubtitle: `${pDesigner} · ${modeLabel}`,
          rentalPeriodLabel: `Booked ${dispDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} (${modeLabel})`,
          dispatchByLabel: dispDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          carrierLabel: carrier,
          rentalAmountLabel: `₹${Number(order.grandTotal || order.amount || item.amount || 0).toLocaleString("en-IN")}`,
          securityDepositLabel: "₹0",
          depositStatusLabel: "N/A",
        };

        newEvents.push({
          id: `disp_${oid}`,
          type: "dispatched",
          title: `Dispatch (${modeLabel}): ${pName}`,
          date: toISO(dispDate),
          orderId: oid,
          detail,
        });

        const todayTime = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
        ).getTime();
        const isDispatchToday = dispDate.getTime() === todayTime;
        const dateStr = `${dispDate.getDate()} ${dispDate.toLocaleString("en-GB", { month: "short" }).toUpperCase()}`;

        newDispatches.push({
          id: `side_disp_${oid}`,
          dateLabel: isDispatchToday
            ? `✦ TODAY — ${dateStr} · DISPATCH`
            : `${dateStr} · DISPATCH`,
          isToday: isDispatchToday,
          title: pName,
          subtitle: `${order.customerName} · ${modeLabel} · ${carrier}`,
          orderId: oid,
        });

        newAgenda.push({
          id: `agenda_${oid}_dispatched`,
          date: dispDate.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
          }),
          isoDate: toISO(dispDate),
          type: "dispatched" as AgendaActionType,
          orderId: oid,
          customer: order.customerName,
          product: pName,
          note: `${modeLabel} order · Dispatch via ${carrier}`,
          done: order.status === "Dispatched" || order.status === "Shipped",
          detail: {
            title: `Dispatch (${modeLabel}) — ${pName}`,
            subtitle: `${modeLabel} order · Dispatch via ${carrier}`,
            dueDate: dispDate.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            relatedOrderId: oid,
            relatedCustomer: order.customerName,
          },
        });
        return;
      }

      const start = parseLocalDay(rStartStr);
      const end = parseLocalDay(rEndStr || rStartStr);
      if (!start || !end) return;

      const defaultDisp = new Date(start);
      defaultDisp.setDate(defaultDisp.getDate() - 2);
      const dispatchDate = parseLocalDay(savedDispStr) || defaultDisp;

      const returnDate =
        parseLocalDay(order.returnLogistics?.returnDate || item.returnDueDate) ||
        (() => {
          const r = new Date(end);
          r.setDate(r.getDate() + 1);
          return r;
        })();

      const cleaningDate = new Date(returnDate);
      cleaningDate.setDate(cleaningDate.getDate() + 1);

      const detail = {
        customerName: order.customerName,
        customerLocation: (
          order.address ||
          order.customerCity ||
          "Unknown"
        ).split(",")[0],
        customerPhone: order.customerPhone || "N/A",
        orderPlaced: bookedDateObj
          ? bookedDateObj.toLocaleDateString("en-GB")
          : order.invoiceDate
            ? new Date(order.invoiceDate).toLocaleDateString("en-GB")
            : "Unknown",
        productName: pName,
        productSubtitle: `${pDesigner} · Rental`,
        rentalPeriodLabel: `${start.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} – ${end.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`,
        dispatchByLabel: dispatchDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        carrierLabel:
          order.dispatchDetails?.courierPartner ||
          item.dispatch?.courierPartner ||
          "TBD",
        rentalAmountLabel: `₹${Number(order.grandTotal || order.amount || item.amount || 0).toLocaleString("en-IN")}`,
        securityDepositLabel: `₹${Number(item.deposit || order.depositHeld || order.deposit || 0).toLocaleString("en-IN")}`,
        depositStatusLabel:
          item.depositDecision?.status ||
          order.depositStatus ||
          "Pending",
      };

      // Events
      newEvents.push({
        id: `disp_${oid}`,
        type: "dispatched",
        title: `Dispatch: ${pName}`,
        date: toISO(dispatchDate),
        orderId: oid,
        detail,
      });
      newEvents.push({
        id: `rent_${oid}`,
        type: "rental-starts",
        title: `Rental Starts: ${pName}`,
        date: toISO(start),
        orderId: oid,
        detail,
      });
      newEvents.push({
        id: `ret_${oid}`,
        type: "return-due",
        title: `Return Due: ${pName}`,
        date: toISO(returnDate),
        orderId: oid,
        detail,
      });

      // Dispatches (Sidebar)
      const todayTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      ).getTime();
      const isDispatchToday = dispatchDate.getTime() === todayTime;
      const dateStr = `${dispatchDate.getDate()} ${dispatchDate.toLocaleString("en-GB", { month: "short" }).toUpperCase()}`;

      newDispatches.push({
        id: `side_disp_${oid}`,
        dateLabel: isDispatchToday
          ? `✦ TODAY — ${dateStr} · DISPATCH`
          : `${dateStr} · DISPATCH`,
        isToday: isDispatchToday,
        title: pName,
        subtitle: `${order.customerName} · Dispatch via ${detail.carrierLabel}`,
        orderId: oid,
      });

      const pushAgenda = (
        type: string,
        dDate: Date,
        noteStr: string,
        titlePre: string,
      ) => {
        newAgenda.push({
          id: `agenda_${oid}_${type}`,
          date: dDate.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
          }),
          isoDate: toISO(dDate),
          type: type as AgendaActionType,
          orderId: oid,
          customer: order.customerName,
          product: pName,
          note: noteStr,
          done: order.status === "Dispatched" && type === "prep-dispatch",
          detail: {
            title: `${titlePre} — ${pName}`,
            subtitle: noteStr,
            dueDate: dDate.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            relatedOrderId: oid,
            relatedCustomer: order.customerName,
          },
        });
      };

      const prepDate = new Date(dispatchDate);
      prepDate.setDate(prepDate.getDate() - 2);

      pushAgenda(
        "prep-dispatch",
        prepDate,
        "T-2 reminder — prepare packaging and waybill.",
        "Prep Dispatch",
      );
      pushAgenda(
        "dispatched",
        dispatchDate,
        `Dispatch via ${detail.carrierLabel}`,
        "Dispatched",
      );
      pushAgenda(
        "rental-starts",
        start,
        `Rental window ${start.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}–${end.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`,
        "Rental Starts",
      );
      pushAgenda(
        "return-due",
        returnDate,
        "Return due — deposit held",
        "Return Due",
      );
      pushAgenda(
        "cleaning",
        cleaningDate,
        "Day 1 of 3 — post-return cleaning window",
        "Cleaning",
      );

      // Gantt
      newGantt.push({
        id: `gantt_${oid}`,
        orderId: oid,
        customer: order.customerName,
        product: pName,
        segments: [
          { type: "dispatch", start: toISO(dispatchDate), end: toISO(start) },
          { type: "rental", start: toISO(start), end: toISO(end) },
          { type: "return", start: toISO(end), end: toISO(returnDate) },
          {
            type: "cleaning",
            start: toISO(returnDate),
            end: toISO(cleaningDate),
          },
        ],
      });
    });

    const combinedEvents = [...newEvents, ...tasks];
    // Map custom tasks to the agenda, month, and gantt views
    const taskAgenda = tasks.map((t) => {
      const tDate = new Date(t.date);

      // If it's a Dispatch task, add it to the dispatches sidebar
      if (t.title && (t.title.includes("Dispatch") || t.type === "Dispatch")) {
        const todayTime = new Date().setHours(0, 0, 0, 0);
        const isDispatchToday = tDate.getTime() === todayTime;
        const dateStr = `${tDate.getDate()} ${tDate.toLocaleString("default", { month: "short" }).toUpperCase()}`;

        newDispatches.push({
          id: `side_disp_task_${t.id}`,
          dateLabel: isDispatchToday
            ? `✦ TODAY — ${dateStr} · DISPATCH`
            : `${dateStr} · DISPATCH`,
          isToday: isDispatchToday,
          title: t.title.split(": ")[1] || t.title,
          subtitle: `Custom Task · ${t.title.split(": ")[0] || "Dispatch Prep"}`,
          orderId: t.orderId || "Custom",
        });
      }

      return {
        id: t.id,
        date: tDate.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        isoDate: t.date,
        type: "internal-task" as AgendaActionType,
        orderId: t.orderId || "N/A",
        customer: t.assignee || "Assigned: User",
        product: t.title,
        note: t.description || "Internal task reminder.",
        done: t.status === "Completed",
        detail: {
          title: t.title,
          subtitle: t.description || "Custom task",
          dueDate: tDate.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          relatedOrderId: t.orderId || "N/A",
          relatedCustomer: t.assignee || "System",
        },
      };
    });

    return {
      events: combinedEvents,
      dispatches: newDispatches,
      agendaEntries: [...newAgenda, ...taskAgenda],
      ganttRows: newGantt,
    };
  }, [orders, tasks]);

  return (
    <div className="rental-calendar-page">
      <div className="rental-calendar-page__intro">
        <div className="rental-calendar-page__eyebrow">OPERATIONS</div>
        <h1 className="rental-calendar-page__heading">Rental Calendar</h1>
        <p className="rental-calendar-page__description">
          Complete operational view — every dispatch, rental window, return, and
          deposit event. Click any event to open the order. Use the sidebar for
          today&apos;s actions.
        </p>
      </div>

      <div className="rental-calendar-page__panel">
        <CalendarHeader
          monthLabel={monthLabel}
          viewMode={viewMode}
          demoDate={demoDate}
          onPrevMonth={() => goToMonth(-1)}
          onNextMonth={() => goToMonth(1)}
          onViewModeChange={setViewMode}
          onDemoDateChange={setDemoDate}
          onAddTask={handleAddTask}
          onExport={() => {}}
        />

        <div className="rental-calendar-page__content">
          <div className="rental-calendar-page__main">
            {viewMode === "month" && (
              <>
                <CalendarGrid
                  month={month}
                  events={events}
                  todayISO={todayISO}
                />
                <CalendarLegend />
              </>
            )}

            {viewMode === "agenda" && <AgendaView entries={agendaEntries} />}

            {viewMode === "gantt" && (
              <GanttView month={month} rows={ganttRows} />
            )}
          </div>

          <Sidebar monthLabel={sidebarMonthLabel} dispatches={dispatches} />
        </div>
      </div>

      {isModalOpen && (
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default RentalCalendarView;
