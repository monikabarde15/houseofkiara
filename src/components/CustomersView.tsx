import React, { useState } from 'react';
import { Search, Eye, Mail, Phone, MapPin, User, Save, ListFilter, AlertTriangle } from 'lucide-react';
import { Customer, Order, Product } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  orders: Order[];
  products: Product[];
  onUpdateCustomer: (updated: Customer) => void;
  setView: (view: string) => void;
  setSelectedOrderId: (id: string) => void;
}

export default function CustomersView({ 
  customers, 
  orders, 
  products, 
  onUpdateCustomer,
  setView,
  setSelectedOrderId
}: CustomersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<'Profile' | 'History' | 'Wishlist' | 'Settings'>('Profile');

  // Customer Edit Fields
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editGstin, setEditGstin] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editReferrer, setEditReferrer] = useState('');
  const [editSize, setEditSize] = useState('');
  const [editSilhouettes, setEditSilhouettes] = useState('');
  const [editNewsletter, setEditNewsletter] = useState(false);
  const [editWhatsapp, setEditWhatsapp] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Suspended'>('Active');

  const startEditing = (customer: Customer) => {
    setEditingCustomer(customer);
    setActiveTab('Profile');
    setEditName(customer.name);
    setEditEmail(customer.email);
    setEditPhone(customer.phone);
    setEditLocation(customer.location);
    setEditAddress(customer.address || '');
    setEditGstin(customer.gstin || '');
    setEditInstagram(customer.instagram || '');
    setEditBirthDate(customer.birthDate || '');
    setEditReferrer(customer.referrer || '');
    setEditSize(customer.preferences?.preferredSize || '');
    setEditSilhouettes(customer.preferences?.preferredSilhouettes || '');
    setEditNewsletter(customer.preferences?.newsletter || false);
    setEditWhatsapp(customer.preferences?.whatsappNotifications || false);
    setEditNotes(customer.internalNotes || '');
    setEditStatus(customer.status);
  };

  const handleSaveCustomer = () => {
    if (!editingCustomer) return;
    const updated: Customer = {
      ...editingCustomer,
      name: editName,
      email: editEmail,
      phone: editPhone,
      location: editLocation,
      address: editAddress,
      gstin: editGstin,
      instagram: editInstagram,
      birthDate: editBirthDate,
      referrer: editReferrer,
      status: editStatus,
      preferences: {
        preferredSize: editSize,
        preferredSilhouettes: editSilhouettes,
        newsletter: editNewsletter,
        whatsappNotifications: editWhatsapp
      },
      internalNotes: editNotes
    };
    onUpdateCustomer(updated);
    setEditingCustomer(updated);
    alert("Customer profile successfully updated!");
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All Statuses' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getCustomerOrders = (email: string) => {
    return orders.filter(o => o.customerEmail === email);
  };

  if (editingCustomer) {
    const custOrders = getCustomerOrders(editingCustomer.email);
    return (
      <div className="space-y-6 text-xs font-sans">
        
        {/* Back and title bar */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setEditingCustomer(null)}
              className="px-3 py-1 bg-stone-50 hover:bg-stone-100 rounded text-stone-600 font-semibold cursor-pointer"
            >
              ← Back to list
            </button>
            <h2 className="text-xl font-serif text-stone-900 font-bold ml-2">Edit Customer: {editingCustomer.name}</h2>
          </div>
          <button
            onClick={handleSaveCustomer}
            className="px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile</span>
          </button>
        </div>

        {/* Top summary card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#fcf9f5] p-5 rounded-lg border border-stone-150">
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Customer Status</span>
            <p className="mt-1">
              <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                editStatus === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {editStatus}
              </span>
            </p>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Orders count</span>
            <p className="text-lg font-serif font-bold text-stone-850 mt-1">{custOrders.length} Completed</p>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Lifetime value</span>
            <p className="text-lg font-serif font-bold text-stone-850 mt-1">
              ₹{custOrders.reduce((sum, o) => sum + o.amount, 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Joined Date</span>
            <p className="text-sm font-semibold text-stone-700 mt-1">{editingCustomer.joinedDate}</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-stone-200 gap-1 select-none font-semibold overflow-x-auto whitespace-nowrap scrollbar-none pb-px">
          {(['Profile', 'History', 'Wishlist', 'Settings'] as const).map(tab => {
            const labels = {
              Profile: 'Contact Information',
              History: 'Order History',
              Wishlist: 'Wishlist & Favorites',
              Settings: 'Account Settings'
            };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 border-b-2 text-xs transition cursor-pointer ${
                  isActive ? 'border-[#c5a880] text-stone-900 font-bold' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Tab contents */}
        {activeTab === 'Profile' && (
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Contact & KYC Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">City Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">GSTIN (Optional)</label>
                <input
                  type="text"
                  value={editGstin}
                  onChange={(e) => setEditGstin(e.target.value)}
                  placeholder="27AAAAA1111A1Z1"
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs uppercase"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Instagram Handle</label>
                <input
                  type="text"
                  value={editInstagram}
                  onChange={(e) => setEditInstagram(e.target.value)}
                  placeholder="@handle"
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-stone-500 font-medium">Billing & Delivery Address</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
            </div>

            {/* Client Sizing Preferences */}
            <div className="border-t border-stone-100 pt-4 space-y-4">
              <h4 className="font-bold text-stone-800">Sizing & Client Preferences</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Preferred Size</label>
                  <input
                    type="text"
                    value={editSize}
                    onChange={(e) => setEditSize(e.target.value)}
                    placeholder="E.g. S, M, XL"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Preferred Silhouettes</label>
                  <input
                    type="text"
                    value={editSilhouettes}
                    onChange={(e) => setEditSilhouettes(e.target.value)}
                    placeholder="E.g. Saree, Lehenga, Sherwani"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 font-medium text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editNewsletter}
                    onChange={(e) => setEditNewsletter(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-[#c5a880] focus:ring-[#c5a880]"
                  />
                  <span>Subscribed to Email Newsletters</span>
                </label>
                <label className="flex items-center gap-2 font-medium text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-[#c5a880] focus:ring-[#c5a880]"
                  />
                  <span>Enable Auto WhatsApp Notifications</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'History' && (
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Rented & Purchased Orders</h3>
            {custOrders.length === 0 ? (
              <p className="text-stone-400">No orders logged under this client.</p>
            ) : (
              <div className="space-y-2">
                {custOrders.map(o => (
                  <div 
                    key={o.id}
                    onClick={() => {
                      setSelectedOrderId(o.id);
                      setView(`order_detail:${o.id}`);
                    }}
                    className="p-3 bg-[#fcf9f5] hover:bg-[#f3eadf] rounded border border-stone-100 flex justify-between items-center cursor-pointer transition"
                  >
                    <div>
                      <span className="font-bold text-stone-800">{o.productName}</span>
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5">ID: {o.id} | Mode: {o.mode}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-stone-900">₹{o.amount.toLocaleString('en-IN')}</span>
                      <p className="text-[10px] text-stone-400 mt-0.5">Status: <span className="font-semibold">{o.status}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Wishlist' && (
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Customer Wishlist (Saved Items)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.slice(0, 3).map(p => (
                <div key={p.id} className="p-3 bg-stone-50 rounded border border-stone-100 space-y-2">
                  <img src={p.images[0]} alt={p.name} className="h-32 w-full object-cover rounded" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-stone-800 text-xs truncate block">{p.name}</span>
                    <span className="text-[10px] text-[#c5a880] font-semibold">{p.designer}</span>
                    <p className="text-[11px] font-bold text-stone-900 mt-1">₹{p.rentalPrice.toLocaleString('en-IN')} / Day</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Account Operations & Flagging</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">VIP / Admin Notes (Non-customer facing)</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  placeholder="Only visible to Kaira staff..."
                />
              </div>

              {/* Status flag and Suspend button */}
              <div className="p-4 bg-rose-50 border border-rose-100 rounded flex justify-between items-center mt-3">
                <div className="flex gap-2 text-stone-600">
                  <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
                  <div>
                    <p className="font-bold text-rose-800">Suspend Customer Account</p>
                    <p className="text-stone-500 mt-0.5">Suspended users cannot place future rental holds or complete bookings.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextSt = editStatus === 'Active' ? 'Suspended' : 'Active';
                    setEditStatus(nextSt);
                    alert(`Account status changed to ${nextSt}`);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold cursor-pointer transition"
                >
                  {editStatus === 'Active' ? "Suspend Account" : "Un-suspend Account"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif text-stone-900 font-medium">Customers</h2>
        <p className="text-xs text-stone-500 mt-1">
          Registered luxury circles. Click a row to edit full contact profiles, preferences, sizing, and see rental historical logs.
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search by customer name, email, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 bg-white border border-stone-250 rounded text-xs text-stone-700 font-semibold outline-none"
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Active">Active Only</option>
          <option value="Suspended">Suspended Only</option>
        </select>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-400 font-sans uppercase font-bold text-[10px] border-b border-stone-150 tracking-wider">
                <th className="px-5 py-3.5">Customer Name / Contact</th>
                <th className="px-5 py-3.5">City / Location</th>
                <th className="px-5 py-3.5">Orders count</th>
                <th className="px-5 py-3.5">Lifetime Value</th>
                <th className="px-5 py-3.5">Last Order Date</th>
                <th className="px-5 py-3.5">Wishlist Items</th>
                <th className="px-5 py-3.5">Joined Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600 font-sans">
              {filteredCustomers.map(c => (
                <tr key={c.id} className="hover:bg-[#fcf9f5] transition">
                  <td className="px-5 py-4">
                    <div className="font-bold text-stone-850">{c.name}</div>
                    <span className="text-[10px] text-stone-400 font-mono">{c.email}</span>
                  </td>
                  <td className="px-5 py-4 font-medium">{c.location}</td>
                  <td className="px-5 py-4 font-bold text-stone-700">{getCustomerOrders(c.email).length} Orders</td>
                  <td className="px-5 py-4 font-semibold text-stone-900">
                    ₹{getCustomerOrders(c.email).reduce((sum, o) => sum + o.amount, 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-stone-400">{c.lastOrderDate}</td>
                  <td className="px-5 py-4 text-stone-500 font-semibold">{c.wishlistCount} Items</td>
                  <td className="px-5 py-4 text-stone-400">{c.joinedDate}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                      c.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => startEditing(c)}
                      className="px-2.5 py-1.5 border border-stone-200 hover:border-[#c5a880] text-stone-600 hover:text-stone-900 rounded bg-white hover:bg-stone-50 transition cursor-pointer font-semibold inline-flex items-center gap-1 text-[11px]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
