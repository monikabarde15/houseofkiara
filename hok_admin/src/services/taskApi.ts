import { apiRequest } from './apiClient';
import { CalendarEvent } from '../components/RentalCalendar/types';

export const getTasks = async () => {
  const response = await apiRequest('/tasks');
  return (response?.data || response) as unknown as CalendarEvent[];
};

export const getTask = async (id: string) => {
  const response = await apiRequest(`/tasks/${encodeURIComponent(id)}`);
  return (response?.data || response) as unknown as CalendarEvent;
};

export const createTask = async (task: Partial<CalendarEvent>) => {
  const response = await apiRequest('/tasks', { method: 'POST', body: JSON.stringify(task) });
  return (response?.data || response) as unknown as CalendarEvent;
};

export const updateTask = async (id: string, task: Partial<CalendarEvent>) => {
  const response = await apiRequest(`/tasks/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(task) });
  return (response?.data || response) as unknown as CalendarEvent;
};

export const deleteTask = async (id: string) => {
  const response = await apiRequest(`/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' });
  return response;
};
