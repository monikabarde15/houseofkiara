import React, { useState, useMemo } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarLegend from './CalendarLegend';
import Sidebar from './Sidebar';
import { CalendarEvent, CalendarViewMode, DispatchCard, AgendaEntry, GanttOrderRow, AgendaActionType } from '../types';
import '../css/RentalCalendarView.css';
import AgendaView from './agenda/AgendaView';
import GanttView from './gantt/GanttView';
import AddTaskModal from './AddTaskModal';
import { Order } from '../../types';

const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

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
  const [month, setMonth] = useState(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)); 
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  
  const currentDemoDateStr = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
  const [demoDate, setDemoDate] = useState(currentDemoDateStr);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayISO = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  const monthLabel = MONTH_FORMATTER.format(month);
  const sidebarMonthLabel = `${month.toLocaleString('default', {month: 'long'}).toUpperCase()} ${month.getFullYear()}`;

  const goToMonth = (delta: number) => {
    setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
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
    const validOrders = orders.filter(o => o.mode === 'Rental' && (o.rentalStartDate || (o as any).items?.[0]?.rentalStartDate));
    const newEvents: CalendarEvent[] = [];
    const newDispatches: DispatchCard[] = [];
    const newAgenda: AgendaEntry[] = [];
    const newGantt: GanttOrderRow[] = [];

    validOrders.forEach(order => {
      const item = (order as any).items?.[0] || order;
      if (!item.rentalStartDate || !item.rentalEndDate) return;

      const start = new Date(item.rentalStartDate);
      const end = new Date(item.rentalEndDate);
      
      const dispatchDate = new Date(start);
      dispatchDate.setDate(dispatchDate.getDate() - 2); // default dispatch 2 days before

      const returnDate = new Date(end);
      returnDate.setDate(returnDate.getDate() + 1); // return 1 day after end

      const cleaningDate = new Date(end);
      cleaningDate.setDate(cleaningDate.getDate() + 2);

      const pName = item.productName || order.productName || 'Unknown Product';
      const pDesigner = item.designer || order.designer || 'Unknown';

      const detail = {
        customerName: order.customerName,
        customerLocation: (order.address || (order as any).customerCity || 'Unknown').split(',')[0],
        customerPhone: order.customerPhone || 'N/A',
        orderPlaced: order.invoiceDate ? new Date(order.invoiceDate).toLocaleDateString('en-GB') : 'Unknown',
        productName: pName,
        productSubtitle: `${pDesigner} · Rental`,
        rentalPeriodLabel: `${start.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})} – ${end.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}`,
        dispatchByLabel: dispatchDate.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}),
        carrierLabel: item.dispatch?.courierPartner || (order as any).dispatchDetails?.courierPartner || 'TBD',
        rentalAmountLabel: `₹${((item.amount || order.amount) || 0).toLocaleString('en-IN')}`,
        securityDepositLabel: `₹${((item.deposit || (order as any).depositHeld) || 0).toLocaleString('en-IN')}`,
        depositStatusLabel: item.depositDecision?.status || (order as any).depositStatus || 'Pending'
      };

      const toISO = (d: Date) => d.toISOString().split('T')[0];
      
      // Events
      newEvents.push({ id: `disp_${order.id || (order as any)._id}`, type: 'dispatched', title: `Dispatch: ${pName}`, date: toISO(dispatchDate), orderId: order.id || (order as any)._id, detail });
      newEvents.push({ id: `rent_${order.id || (order as any)._id}`, type: 'rental-starts', title: `Rental Starts: ${pName}`, date: toISO(start), orderId: order.id || (order as any)._id, detail });
      newEvents.push({ id: `ret_${order.id || (order as any)._id}`, type: 'return-due', title: `Return Due: ${pName}`, date: toISO(returnDate), orderId: order.id || (order as any)._id, detail });
      
      // Dispatches (Sidebar)
      const todayTime = new Date().setHours(0,0,0,0);
      const isDispatchToday = dispatchDate.getTime() === todayTime;
      const dateStr = `${dispatchDate.getDate()} ${dispatchDate.toLocaleString('default', {month: 'short'}).toUpperCase()}`;
      
      newDispatches.push({
        id: `side_disp_${order.id || (order as any)._id}`,
        dateLabel: isDispatchToday ? `✦ TODAY — ${dateStr} · DISPATCH` : `${dateStr} · DISPATCH`,
        isToday: isDispatchToday,
        title: pName,
        subtitle: `${order.customerName} · Dispatch via ${detail.carrierLabel}`,
        orderId: `HOK-ORD-${order.id || (order as any)._id}`
      });

      // Agenda entries exactly matching the mock data structure
      const pushAgenda = (
        type: string, 
        dDate: Date, 
        noteStr: string,
        titlePre: string
      ) => {
        newAgenda.push({
          id: `agenda_${order.id || (order as any)._id}_${type}`,
          date: dDate.toLocaleDateString('en-GB', {weekday: 'short', day: 'numeric', month: 'short'}),
          isoDate: toISO(dDate),
          type: type as AgendaActionType,
          orderId: `HOK-ORD-${order.id || (order as any)._id}`,
          customer: order.customerName,
          product: pName,
          note: noteStr,
          done: order.status === 'Dispatched' && type === 'prep-dispatch',
          detail: {
            title: `${titlePre} — ${pName}`,
            subtitle: noteStr,
            dueDate: dDate.toLocaleDateString('en-GB', {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'}),
            relatedOrderId: `HOK-ORD-${order.id || (order as any)._id}`,
            relatedCustomer: order.customerName,
          }
        });
      };

      const prepDate = new Date(dispatchDate);
      prepDate.setDate(prepDate.getDate() - 2);

      pushAgenda('prep-dispatch', prepDate, 'T-2 reminder — prepare packaging and waybill.', 'Prep Dispatch');
      pushAgenda('dispatched', dispatchDate, `Dispatch via ${detail.carrierLabel}`, 'Dispatched');
      pushAgenda('rental-starts', start, `Rental window ${start.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})}–${end.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})}`, 'Rental Starts');
      pushAgenda('return-due', returnDate, 'Return due — deposit held', 'Return Due');
      pushAgenda('cleaning', cleaningDate, 'Day 1 of 3 — post-return cleaning window', 'Cleaning');

      // Gantt
      newGantt.push({
        id: `gantt_${order.id || (order as any)._id}`,
        customer: order.customerName,
        product: pName,
        segments: [
          { type: 'dispatch', start: toISO(dispatchDate), end: toISO(start) },
          { type: 'rental', start: toISO(start), end: toISO(end) },
          { type: 'return', start: toISO(end), end: toISO(returnDate) },
          { type: 'cleaning', start: toISO(returnDate), end: toISO(cleaningDate) }
        ]
      });
    });

    const combinedEvents = [...newEvents, ...tasks];
    // Map custom tasks to the agenda, month, and gantt views
    const taskAgenda = tasks.map(t => {
      const tDate = new Date(t.date);
      
      // If it's a Dispatch task, add it to the dispatches sidebar
      if (t.title && (t.title.includes('Dispatch') || t.type === 'Dispatch')) {
        const todayTime = new Date().setHours(0,0,0,0);
        const isDispatchToday = tDate.getTime() === todayTime;
        const dateStr = `${tDate.getDate()} ${tDate.toLocaleString('default', {month: 'short'}).toUpperCase()}`;
        
        newDispatches.push({
          id: `side_disp_task_${t.id}`,
          dateLabel: isDispatchToday ? `✦ TODAY — ${dateStr} · DISPATCH` : `${dateStr} · DISPATCH`,
          isToday: isDispatchToday,
          title: t.title.split(': ')[1] || t.title,
          subtitle: `Custom Task · ${t.title.split(': ')[0] || 'Dispatch Prep'}`,
          orderId: t.orderId || 'Custom'
        });
      }

      return {
        id: t.id,
        date: tDate.toLocaleDateString('en-GB', {weekday: 'short', day: 'numeric', month: 'short'}),
        isoDate: t.date,
        type: 'internal-task' as AgendaActionType,
        orderId: t.orderId || 'N/A',
        customer: t.assignee || 'Assigned: User',
        product: t.title,
        note: t.description || 'Internal task reminder.',
        done: t.status === 'Completed',
        detail: {
          title: t.title,
          subtitle: t.description || 'Custom task',
          dueDate: tDate.toLocaleDateString('en-GB', {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'}),
          relatedOrderId: t.orderId || 'N/A',
          relatedCustomer: t.assignee || 'System',
        }
      };
    });

    return { events: combinedEvents, dispatches: newDispatches, agendaEntries: [...newAgenda, ...taskAgenda], ganttRows: newGantt };
  }, [orders, tasks]);

  return (
    <div className="rental-calendar-page">
      <div className="rental-calendar-page__intro">
        <div className="rental-calendar-page__eyebrow">OPERATIONS</div>
        <h1 className="rental-calendar-page__heading">Rental Calendar</h1>
        <p className="rental-calendar-page__description">
          Complete operational view — every dispatch, rental window, return, and deposit event.
          Click any event to open the order. Use the sidebar for today&apos;s actions.
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

          {viewMode === 'month' && (
            <>
              <CalendarGrid month={month} events={events} todayISO={todayISO} />
              <CalendarLegend />
            </>
          )}

          {viewMode === 'agenda' && <AgendaView entries={agendaEntries} />}

          {viewMode === 'gantt' && <GanttView month={month} rows={ganttRows} />}
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