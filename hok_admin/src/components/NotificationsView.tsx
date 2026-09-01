import React, { useState } from 'react';
import { Bell, ShieldAlert, PhoneCall, Check, Clock, Trash2, Mail } from 'lucide-react';

export default function NotificationsView() {
  const [notifications, setNotifications] = useState([
    { id: "1", type: "Security Deposit", message: "Deposit ₹15,000 released in full for order HOK-ORD-001", time: "10 mins ago", unread: true, channel: "System / Email" },
    { id: "2", type: "New Submission", message: "Consignment review request received from lister Meera Joshi", time: "1 hour ago", unread: true, channel: "Dashboard / Whatsapp" },
    { id: "3", type: "Offer Received", message: "Offer of ₹32,000 received on Ivory Embroidered Sherwani", time: "3 hours ago", unread: false, channel: "System" },
    { id: "4", type: "Lister Registered", message: "New private wardrobe lister Aishwarya Sharma registered successfully", time: "1 day ago", unread: false, channel: "System / KYC" },
    { id: "5", type: "Dispatch Overdue", message: "Order HOK-ORD-003 is awaiting physical dry clean clearance", time: "2 days ago", unread: false, channel: "Warning" }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleClear = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      <div className="flex justify-between items-center border-b border-stone-100 pb-3">
        <div>
          <h2 className="text-2xl font-serif text-stone-900 font-medium">Notifications & Activity Logs</h2>
          <p className="text-xs text-stone-500 mt-1">
            Browse automated background actions, dry cleaning alerts, WhatsApp delivery receipts, and staff activity records.
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="px-3.5 py-1.5 border border-stone-200 hover:border-stone-350 hover:bg-stone-50 rounded text-stone-700 font-bold text-xs cursor-pointer transition"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden divide-y divide-stone-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-stone-400">
            No system notifications logged in this cycle.
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-4 transition flex justify-between items-center gap-4 ${
                n.unread ? 'bg-[#fcf9f5]' : 'hover:bg-stone-50/50'
              }`}
            >
              <div className="flex gap-3 items-start">
                <div className={`p-2 rounded text-xs shrink-0 ${
                  n.type === 'Dispatch Overdue' 
                    ? 'bg-rose-50 text-rose-700 border border-rose-100'
                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                }`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-850 text-xs uppercase tracking-wider">{n.type}</span>
                    <span className="text-[10px] text-[#c5a880] font-semibold font-mono">({n.channel})</span>
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-stone-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{n.time}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {n.unread && (
                  <span className="h-2 w-2 rounded-full bg-[#c5a880]" />
                )}
                <button
                  onClick={() => handleClear(n.id)}
                  className="p-1 text-stone-400 hover:text-stone-700 transition cursor-pointer"
                  title="Remove Notification"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
