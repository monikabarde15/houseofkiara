// services/notificationApi.ts

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  date: string;
  category: 'System' | 'Order' | 'Lister' | 'Customer' | 'Security' | 'WhatsApp';
  channel: 'Email' | 'WhatsApp' | 'System' | 'KYC' | 'Dashboard';
  unread: boolean;
  priority: 'High' | 'Medium' | 'Low';
  actionUrl?: string;
  actionText?: string;
}

const API_BASE = '/api/notifications';

export const notificationApi = {
  // Get all notifications from real DB
  getNotifications: async (): Promise<NotificationItem[]> => {
    const res = await fetch(API_BASE);
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch notifications');
    }
    return json.data;
  },

  // Mark all notifications as read in DB
  markAllRead: async (): Promise<void> => {
    const res = await fetch(`${API_BASE}/read-all`, { method: 'PUT' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to mark notifications read');
    }
  },

  // Mark single notification as read in DB
  markAsRead: async (id: string): Promise<NotificationItem> => {
    const res = await fetch(`${API_BASE}/${id}/read`, { method: 'PUT' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to mark notification read');
    }
    return json.data;
  },

  // Delete notification from DB
  deleteNotification: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to delete notification');
    }
  },
};
