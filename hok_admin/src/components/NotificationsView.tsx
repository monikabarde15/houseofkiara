import React, { useState } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  PhoneCall, 
  Check, 
  Clock, 
  Trash2, 
  Mail, 
  MessageSquare, 
  CheckCheck, 
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Send,
  User,
  Package,
  Calendar,
  DollarSign
} from 'lucide-react';

interface NotificationItem {
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

import { notificationApi } from '../services/notificationApi';

export default function NotificationsView() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'system' | 'whatsapp'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch real notifications from PostgreSQL Database API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications(notifications.map(n => ({ ...n, unread: false })));
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  const handleClear = async (id: string) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Filtered notifications logic
  const filteredNotifications = notifications.filter(n => {
    // Tab filter
    if (activeTab === 'unread' && !n.unread) return false;
    if (activeTab === 'system' && n.category !== 'System' && n.category !== 'Security') return false;
    if (activeTab === 'whatsapp' && n.channel !== 'WhatsApp' && n.category !== 'WhatsApp') return false;

    // Category dropdown filter
    if (selectedCategory !== 'all' && n.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;

    // Search query filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      return n.title.toLowerCase().includes(query) || 
             n.message.toLowerCase().includes(query) ||
             n.channel.toLowerCase().includes(query);
    }

    return true;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Order':
        return <Package className="h-4 w-4 text-stone-700" />;
      case 'Lister':
        return <User className="h-4 w-4 text-amber-700" />;
      case 'Customer':
        return <DollarSign className="h-4 w-4 text-emerald-700" />;
      case 'WhatsApp':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'Security':
        return <ShieldAlert className="h-4 w-4 text-rose-600" />;
      default:
        return <Bell className="h-4 w-4 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-6 text-xs font-sans max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-serif text-stone-900 font-semibold tracking-tight">Notifications & Messaging Log</h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#C7A55C] text-[#2A2118] text-[11px] font-bold">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time activity logs, automated background alerts, WhatsApp status logs, and staff task updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 rounded-md text-stone-700 font-medium text-xs cursor-pointer transition shadow-2xs"
            >
              <CheckCheck className="h-4 w-4 text-emerald-600" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
      </div>

      {/* Control Bar: Tabs, Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 rounded-lg border border-stone-200/80 shadow-2xs">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-stone-100/80 p-1 rounded-md">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md font-medium text-xs transition cursor-pointer ${
              activeTab === 'all' 
                ? 'bg-white text-stone-900 shadow-2xs' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Logs ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1.5 rounded-md font-medium text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'unread' 
                ? 'bg-white text-stone-900 shadow-2xs' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="h-4 w-4 rounded-full bg-[#C7A55C] text-white text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3 py-1.5 rounded-md font-medium text-xs transition cursor-pointer ${
              activeTab === 'whatsapp' 
                ? 'bg-white text-stone-900 shadow-2xs' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            WhatsApp Logs
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-3 py-1.5 rounded-md font-medium text-xs transition cursor-pointer ${
              activeTab === 'system' 
                ? 'bg-white text-stone-900 shadow-2xs' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            System & Security
          </button>
        </div>

        {/* Search Input & Category Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#C7A55C] focus:border-[#C7A55C]"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#C7A55C]"
          >
            <option value="all">All Categories</option>
            <option value="order">Orders</option>
            <option value="lister">Listers</option>
            <option value="customer">Customers</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="security">Security</option>
          </select>
        </div>
      </div>

      {/* Notifications List Container */}
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-2xs overflow-hidden divide-y divide-stone-100">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="h-8 w-8 text-stone-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-stone-700">No Notifications Found</h3>
            <p className="text-xs text-stone-500 mt-1">
              There are no activity logs matching your selected filters or search parameters.
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => n.unread && handleMarkAsRead(n.id)}
              className={`p-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                n.unread ? 'bg-[#FCF9F5]/90 hover:bg-[#F9F4EB]' : 'hover:bg-stone-50/70'
              }`}
            >
              {/* Left Column: Icon + Text */}
              <div className="flex gap-3.5 items-start">
                <div className={`p-2.5 rounded-lg shrink-0 border ${getPriorityStyle(n.priority)}`}>
                  {getCategoryIcon(n.category)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-stone-900 text-xs">
                      {n.title}
                    </span>
                    
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                      {n.channel}
                    </span>

                    {n.priority === 'High' && (
                      <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-rose-100 text-rose-700 border border-rose-200 uppercase tracking-wider">
                        High Priority
                      </span>
                    )}
                  </div>

                  <p className="text-stone-600 text-xs leading-relaxed max-w-3xl">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-3 pt-0.5 text-[10.5px] text-stone-400">
                    <span className="flex items-center gap-1 font-medium text-stone-500">
                      <Clock className="h-3 w-3 text-stone-400" />
                      {n.time}
                    </span>
                    <span>•</span>
                    <span>{n.date}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions & Unread Indicator */}
              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                {n.actionText && (
                  <button className="px-3 py-1 bg-[#C7A55C] hover:bg-[#B9974B] text-[#2A2118] font-medium text-xs rounded transition shadow-2xs cursor-pointer">
                    {n.actionText}
                  </button>
                )}

                {n.unread ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C7A55C] shadow-2xs" title="Unread" />
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-stone-200" title="Read" />
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear(n.id);
                  }}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                  title="Remove Notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
