// Barrel export for the Rental Calendar section.
// Lets consumers do: import RentalCalendarView from '@/components/RentalCalendar/tsx';
// instead of reaching into individual files.

export { default } from './RentalCalendarView';
export { default as RentalCalendarView } from './RentalCalendarView';
export { default as CalendarHeader } from './CalendarHeader';
export { default as CalendarGrid } from './CalendarGrid';
export { default as CalendarLegend } from './CalendarLegend';
export { default as EventPill } from './EventPill';
export { default as Sidebar } from './Sidebar';
export { default as AgendaView } from './agenda/AgendaView';
export { default as AgendaTable } from './agenda/AgendaTable';
export { default as AgendaRow } from './agenda/AgendaRow';
export { default as AgendaFilterBar } from './agenda/AgendaFilterBar';

export * from '../types';
export * from '../mockdata';