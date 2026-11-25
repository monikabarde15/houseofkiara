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
import { Order, Product } from "../../../types";
import { useTeamPermissions } from "../../TeamPermissions";

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

interface RentalCalendarViewProps {
  orders?: Order[];
  products?: Product[];
  tasks?: CalendarEvent[];
  onAddTask?: (task: Partial<CalendarEvent>) => void;
  onSelectOrder?: (orderId: string) => void;
  onSaveChanges?: () => void;
  onViewLiveSite?: () => void;
}

const RentalCalendarView: React.FC<RentalCalendarViewProps> = ({
  orders = [],
  products = [],
  tasks = [],
  onAddTask,
  onSelectOrder,
  onSaveChanges,
  onViewLiveSite,
}) => {
  const { canEditSection, refuseDoor, hasDecision, refuseDecision } =
    useTeamPermissions();
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
    if (!canEditSection("calendar")) {
      refuseDoor("calendar");
      return;
    }
    setIsModalOpen(true);
  };

  const handleSaveTask = (newTask: CalendarEvent) => {
    if (onAddTask) onAddTask(newTask);
    setIsModalOpen(false);
  };

  // Convert real rental orders (web + admin) and custom tasks to Mohan's exact Calendar Events, Dispatches, Agenda, and Gantt formats
  const { events, dispatches, agendaEntries, ganttRows } = useMemo(() => {
    const parseLocalDay = (raw: any): Date | null => {
      if (!raw) return null;
      const s = String(raw).trim();
      const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (ymd) {
        return new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
      }
      const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (dmy) {
        return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
      }
      const d = new Date(s);
      if (isNaN(d.getTime())) return null;
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    };

    const toISO = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const formatOrderId = (rawId: any) => {
      const s = String(rawId || "");
      return s.startsWith("HOK-") || s.startsWith("EXT-")
        ? s
        : `HOK-ORD-${s}`;
    };

    const seenOrderIds = new Set<string>();
    const validOrders: any[] = [];

    orders.forEach((o: any) => {
      if (String(o.status || "").toLowerCase() === "cancelled") return;
      const rawKey = String(o.orderId || o.id || o._id || "");
      if (rawKey) {
        seenOrderIds.add(rawKey);
        seenOrderIds.add(formatOrderId(rawKey));
      }
      validOrders.push(o);
    });

    const newEvents: CalendarEvent[] = [];
    const newDispatches: DispatchCard[] = [];
    const newAgenda: AgendaEntry[] = [];
    const newGantt: GanttOrderRow[] = [];

    const viewYear = month.getFullYear();
    const viewMonthIdx = month.getMonth();

    validOrders.forEach((order: any) => {
      const rawItems =
        Array.isArray(order.items) && order.items.length > 0
          ? order.items
          : [order];

      rawItems.forEach((item: any, itemIdx: number) => {
        const modeLower = String(item.mode || order.mode || "").toLowerCase();
        const rStartStr =
          item.rentalStartDate ||
          item.startDate ||
          order.rentalStartDate ||
          order.startDate ||
          (modeLower === "rental"
            ? item.dispatchDate ||
              order.dispatchDate ||
              order.orderDate ||
              order.createdAt ||
              ""
            : "");
        const rEndStr =
          item.rentalEndDate ||
          item.endDate ||
          order.rentalEndDate ||
          order.endDate ||
          rStartStr;

        const isRental =
          (modeLower === "rental" || Boolean(rStartStr)) &&
          Boolean(rStartStr);
        if (!isRental) return;

        const start = parseLocalDay(rStartStr);
        const parsedEnd = parseLocalDay(rEndStr || rStartStr);
        if (!start) return;
        const end = parsedEnd && parsedEnd >= start ? parsedEnd : start;

        const savedDispStr =
          item.dispatch?.date ||
          order.dispatchDetails?.date ||
          item.dispatchDate ||
          order.dispatchDate ||
          "";
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

        const pName = item.productName || order.productName || "Unknown Product";
        const pDesigner = item.designer || order.designer || "Unknown";
        const oid = formatOrderId(order.orderId || order.id || order._id);
        const uidSuffix = rawItems.length > 1 ? `_${itemIdx}` : "";

        const tsMatch = String(order.orderId || order.id || "").match(
          /HOK-ORD-(\d{13})/,
        );
        const bookedDateObj =
          parseLocalDay(order.orderDate || order.createdAt || order.invoiceDate) ||
          (tsMatch ? parseLocalDay(new Date(Number(tsMatch[1]))) : null);

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
            item.dispatch?.courierPartner ||
            order.dispatchDetails?.courierPartner ||
            "TBD",
          rentalAmountLabel: `₹${Number(item.amount || order.orderValue || order.amount || 0).toLocaleString("en-IN")}`,
          securityDepositLabel: `₹${Number(item.deposit || order.depositHeld || 0).toLocaleString("en-IN")}`,
          depositStatusLabel:
            item.depositDecision?.status ||
            order.depositStatus ||
            "Pending",
        };

        // Mohan's exact Events
        newEvents.push({
          id: `disp_${oid}${uidSuffix}`,
          type: "dispatched",
          title: `Dispatch: ${pName}`,
          date: toISO(dispatchDate),
          orderId: oid,
          detail,
        });
        newEvents.push({
          id: `rent_${oid}${uidSuffix}`,
          type: "rental-starts",
          title: `Rental Starts: ${pName}`,
          date: toISO(start),
          orderId: oid,
          detail,
        });
        newEvents.push({
          id: `ret_${oid}${uidSuffix}`,
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
        const dateStr = `${dispatchDate.getDate()} ${dispatchDate.toLocaleString("default", { month: "short" }).toUpperCase()}`;

        newDispatches.push({
          id: `side_disp_${oid}${uidSuffix}`,
          dateLabel: isDispatchToday
            ? `✦ TODAY — ${dateStr} · DISPATCH`
            : `${dateStr} · DISPATCH`,
          isToday: isDispatchToday,
          title: pName,
          subtitle: `${order.customerName} · Dispatch via ${detail.carrierLabel}`,
          orderId: oid,
        });

        // Agenda entries matching Mohan's exact format
        const pushAgenda = (
          type: string,
          dDate: Date,
          noteStr: string,
          titlePre: string,
        ) => {
          newAgenda.push({
            id: `agenda_${oid}${uidSuffix}_${type}`,
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

        // Gantt matching Mohan's ganttMockData day structure ({ day, type })
        const dayTypeMap = new Map<
          number,
          "dispatch" | "rental" | "return" | "deposit"
        >();
        const setIfInMonth = (
          d: Date,
          segType: "dispatch" | "rental" | "return" | "deposit",
        ) => {
          if (d.getFullYear() === viewYear && d.getMonth() === viewMonthIdx) {
            dayTypeMap.set(d.getDate(), segType);
          }
        };

        setIfInMonth(dispatchDate, "dispatch");
        const cur = new Date(start);
        let guard = 0;
        while (cur <= end && guard < 60) {
          setIfInMonth(cur, "rental");
          cur.setDate(cur.getDate() + 1);
          guard += 1;
        }
        setIfInMonth(returnDate, "return");
        const depositReleaseDate = new Date(returnDate);
        depositReleaseDate.setDate(depositReleaseDate.getDate() + 3);
        setIfInMonth(depositReleaseDate, "deposit");

        if (dayTypeMap.size > 0) {
          newGantt.push({
            id: `gantt_${oid}${uidSuffix}`,
            orderId: oid,
            customer: order.customerName,
            product: pName,
            segments: Array.from(dayTypeMap.entries()).map(([day, type]) => ({
              day,
              type,
            })),
          });
        }
      });
    });

    const combinedEvents = [...newEvents, ...tasks];
    const taskAgenda = tasks.map((t) => {
      const tDate = new Date(t.date);

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
  }, [orders, products, tasks, month]);

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
          onExport={() => {
            if (!hasDecision("download_lists")) {
              refuseDecision("download_lists");
              return;
            }
          }}
        />

        <div className="rental-calendar-page__content">
          <div className="rental-calendar-page__main">
            {viewMode === "month" && (
              <>
                <CalendarGrid
                  month={month}
                  events={events}
                  todayISO={todayISO}
                  onEventClick={(ev) => {
                    if (
                      ev.orderId &&
                      ev.orderId !== "Custom" &&
                      ev.orderId !== "N/A"
                    ) {
                      onSelectOrder?.(ev.orderId);
                    }
                  }}
                />
                <CalendarLegend />
              </>
            )}

            {viewMode === "agenda" && <AgendaView entries={agendaEntries} />}

            {viewMode === "gantt" && (
              <GanttView month={month} rows={ganttRows} />
            )}
          </div>

          <Sidebar
            monthLabel={sidebarMonthLabel}
            dispatches={dispatches}
            onSelectDispatch={(disp) => {
              if (disp.orderId && disp.orderId !== "Custom") {
                onSelectOrder?.(disp.orderId);
              }
            }}
          />
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
