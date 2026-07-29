import React, { useState } from 'react';
import { Search, Eye, Mail, Phone, MapPin, User, Save, ListFilter, AlertTriangle, MessageCircle, } from 'lucide-react';
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

  // ============================================================
  // TAB STATE
  // Part 1/9 = Profile (built below)
  // Parts 2-9 (Order History, Wishlist, Cart, Rentals, Deposits,
  // Offers, Communication Log, Account Settings) still use the
  // OLD tab names for now ('History' | 'Wishlist' | 'Settings')
  // so nothing breaks. We'll widen this union as each part ships.
  // ============================================================
 const [activeTab, setActiveTab] = useState<
  | 'Profile'
  | 'Order History'
  | 'Wishlist'
  | 'Cart'
  | 'Rentals'
  | 'Deposits'
  | 'Offers'
  | 'Communication Log'
  | 'Account Settings'
>('Profile');

  // ============================================================
  // CUSTOMER EDIT FIELDS (existing — unchanged, backend-bound)
  // These map 1:1 to Customer type fields and flow into
  // handleSaveCustomer() -> onUpdateCustomer(updated)
  // ============================================================
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
  // UI-only — see TODO(backend) note in Account Settings tab
  const [editSource, setEditSource] = useState('Website');
  const [editFlagReason, setEditFlagReason] = useState('');

  // ============================================================
  // UI-ONLY STATE — NEW (Profile redesign)
  // None of these exist on the Customer type yet. They are kept
  // as local state so the visual redesign can ship WITHOUT any
  // backend/type changes. Each block below has a TODO(backend)
  // comment showing exactly what to add to Customer + how to
  // wire it into startEditing() / handleSaveCustomer() once the
  // backend supports it. Until then these fields are decorative
  // and reset every time you open a different customer.
  // ============================================================

  // TODO(backend): Customer.preferredOccasions?: string
  const [editPreferredOccasions, setEditPreferredOccasions] = useState('');

  // TODO(backend): Customer.notificationPrefs?: {
  //   whatsappUpdates: boolean; emailNotifications: boolean; marketingOptIn: boolean;
  // }
  // NOTE: editWhatsapp/editNewsletter above already exist and are backend-bound —
  // reuse THOSE for the two toggles that map to real fields; only the 3rd
  // ("New Arrivals & Offers") is genuinely new, tracked separately below.
  const [editMarketingOptIn, setEditMarketingOptIn] = useState(false);

  // TODO(backend): Customer.addresses?: { id: string; label: string; address: string; isDefault?: boolean }[]
  const [addresses, setAddresses] = useState<{ id: string; label: string; address: string; isDefault?: boolean }[]>([]);
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [newAddressText, setNewAddressText] = useState('');

  // TODO(backend): Customer.occasions?: { id: string; occasion: string; date: string }[]
  const [occasions, setOccasions] = useState<{ id: string; occasion: string; date: string }[]>([]);
  const [newOccasionName, setNewOccasionName] = useState('');
  const [newOccasionDate, setNewOccasionDate] = useState('');
  // TODO(backend): Customer.communicationLog?: { id: string; message: string; channel: string; timestamp: string }[]
  // Seeded with sample entries matching the reference PDF for now.
  const SEED_COMM_LOG = [
    { id: 'comm_1', message: 'Dispatch notification sent — AWB BD90455102IN', channel: 'WhatsApp', timestamp: '22 Jun 2026, 12:35' },
    { id: 'comm_2', message: 'Offer OFR-203 accepted — preloved sale confirmation sent', channel: 'WhatsApp', timestamp: '21 Jun 2026, 14:10' },
    { id: 'comm_3', message: 'Rental confirmation sent', channel: 'WhatsApp', timestamp: '21 Mar 2026, 14:05' },
  ];
  const [commLog, setCommLog] = useState<{ id: string; message: string; channel: string; timestamp: string }[]>(SEED_COMM_LOG);
  const [newCommMessage, setNewCommMessage] = useState('');
  const [newCommChannel, setNewCommChannel] = useState('WhatsApp');

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

    // UI-only resets (see TODO(backend) notes above) —
    // once Customer carries these fields, hydrate from `customer` here too.
    setEditPreferredOccasions('');
    setEditMarketingOptIn(false);
    setAddresses([]);
    setNewAddressLabel('');
    setNewAddressText('');
    setOccasions([]);
    setNewOccasionName('');
    setNewOccasionDate('');
  };

  const handleSaveCustomer = () => {
    if (!editingCustomer) return;
    // NOTE: payload shape is UNCHANGED from the original — none of the new
    // UI-only fields (addresses, occasions, preferredOccasions, marketingOptIn)
    // are sent to onUpdateCustomer, since Customer doesn't have room for them
    // yet. Add them into this object once the backend/type support lands.
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

  // UI-only handlers for the new Saved Addresses / Occasions cards.
  // Pure local state — safe no-ops as far as the backend is concerned.
  const handleAddAddress = () => {
    if (!newAddressLabel.trim() || !newAddressText.trim()) return;
    setAddresses(prev => [
      ...prev,
      { id: `addr_${Date.now()}`, label: newAddressLabel.trim(), address: newAddressText.trim() }
    ]);
    setNewAddressLabel('');
    setNewAddressText('');
  };

  const handleAddOccasion = () => {
    if (!newOccasionName.trim()) return;
    setOccasions(prev => [
      ...prev,
      { id: `occ_${Date.now()}`, occasion: newOccasionName.trim(), date: newOccasionDate }
    ]);
    setNewOccasionName('');
    setNewOccasionDate('');
  };
  const handleLogCommunication = () => {
    if (!newCommMessage.trim()) return;
    setCommLog(prev => [
      { id: `comm_${Date.now()}`, message: newCommMessage.trim(), channel: newCommChannel, timestamp: new Date().toLocaleString('en-IN') },
      ...prev
    ]);
    setNewCommMessage('');
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
        {/* Hero Header */}

<div className="space-y-6">

  {/* Breadcrumb */}

  <div className="flex items-center gap-2 text-sm text-stone-500">

    <button
      onClick={() => setEditingCustomer(null)}
      className="px-3 py-1 border border-stone-200 rounded hover:bg-stone-50"
    >
      ← Back
    </button>

    <span>Customers</span>

    <span>›</span>

    <span className="font-medium text-stone-800">
      {editingCustomer.name}
    </span>

  </div>

  {/* Dark Customer Card */}

  <div className="bg-[#181521] rounded-xl px-8 py-6 text-white flex justify-between items-center">

    <div className="flex gap-5">

      {/* Avatar */}

      <div className="w-20 h-20 rounded-full bg-[#d2ae63] flex items-center justify-center text-3xl font-bold text-[#2d2418]">

        {editingCustomer.name
          .split(" ")
          .map(n => n[0])
          .join("")
          .substring(0,2)}

      </div>

      {/* Details */}

      <div>

        <h2 className="text-4xl font-serif">

          {editingCustomer.name}

        </h2>

        <p className="text-stone-300 mt-2">

          {editingCustomer.email}

          {" • "}

          {editingCustomer.phone}

          {" • "}

          {editingCustomer.location}

          {" • Joined "}

          {editingCustomer.joinedDate}

        </p>

        <div className="flex gap-10 mt-6">

          <div>

            <div className="text-3xl font-bold">

              {custOrders.length}

            </div>

            <div className="uppercase text-xs text-stone-400">

              Orders

            </div>

          </div>

          <div>

            <div className="text-3xl font-bold">

              ₹{custOrders.reduce((sum,o)=>sum+o.amount,0).toLocaleString("en-IN")}

            </div>

            <div className="uppercase text-xs text-stone-400">

              Lifetime Value

            </div>

          </div>

          <div>

            <div className="text-3xl font-bold">

              ₹0

            </div>

            <div className="uppercase text-xs text-stone-400">

              Deposits Held

            </div>

          </div>

          <div>

            <div className="text-3xl font-bold">

              {editingCustomer.wishlistCount}

            </div>

            <div className="uppercase text-xs text-stone-400">

              Wishlist

            </div>

          </div>

        </div>

      </div>

    </div>

    {/* Right Side */}

    <div className="flex flex-col items-end gap-3">

      <div className="flex gap-2">

        <span className="px-3 py-1 rounded border border-stone-500 text-xs uppercase">

          WEBSITE SIGNUP

        </span>

        <span className="px-3 py-1 rounded bg-green-100 text-green-700 text-xs">

          Active

        </span>

      </div>

      <div className="flex gap-3">

        <button className="bg-[#22c55e] hover:bg-[#16a34a] px-5 py-3 rounded text-white font-medium">

          WhatsApp Customer

        </button>

        <button className="border border-stone-500 px-5 py-3 rounded text-white">

          Email

        </button>

      </div>

    </div>

  </div>

</div>

        {/* Top summary card */}
        {/* Track Record */}

<div className="bg-white border border-stone-200 rounded-lg px-4 py-2 flex items-center gap-4 flex-wrap">

  <span className="uppercase text-[11px] tracking-wider font-bold text-stone-400">
    TRACK RECORD
  </span>

  <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-sm">
    🟢 0 rentals completed
  </span>

  <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-sm">
    🟢 0 on-time • 0 late
  </span>

  <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-sm">
    🟢 No damage
  </span>

  <span className="px-3 py-1 rounded-full bg-[#fff8eb] text-[#8a6a2c] text-sm">
    🟡 1 upcoming
  </span>

  <span className="px-3 py-1 rounded-full bg-[#fff3ec] text-[#b45309] text-sm">
    🟠 Deposit to collect — ₹25,000
  </span>

</div>

        {/* ============================================================ */}
        {/* TAB CONTROLS                                                  */}
        {/* Kept as-is structurally. Label text now matches the 9-tab     */}
        {/* target design; the underlying activeTab state still only      */}
        {/* distinguishes 'Profile' | 'History' | 'Wishlist' | 'Settings'  */}
        {/* until Parts 2-9 ship, so the other tab buttons are wired to    */}
        {/* their nearest existing state value for now (see TODO markers  */}
        {/* inline). Swap these over one at a time as each part lands.    */}
        {/* ============================================================ */}
        <div className="flex border-b border-stone-200 gap-1 select-none font-semibold overflow-x-auto whitespace-nowrap scrollbar-none pb-px">
          {(
  [
    "Profile",
    "Order History",
    "Wishlist",
    "Cart",
    "Rentals",
    "Deposits",
    "Offers",
    "Communication Log",
    "Account Settings",
  ] as const
).map((tab) => {
  const isActive = activeTab === tab;
  return (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 border-b-2 text-xs transition cursor-pointer ${
        isActive ? 'border-[#c5a880] text-stone-900 font-bold' : 'border-transparent text-stone-500 hover:text-stone-800'
      }`}
    >
      {tab}
    </button>
  );
})}
        </div>

        {/* ============================================================ */}
        {/* PART 1/9 — PROFILE TAB                                        */}
        {/* Redesigned to match Admin Panel-customer.pdf reference.       */}
        {/* Contains: Track Record, Fit & Measurements, Contact           */}
        {/* Information, Preferences & Account, Saved Addresses,          */}
        {/* Occasions. Everything backend-bound keeps its original prop   */}
        {/* name; new UI-only sections are clearly marked.                */}
        {/* ============================================================ */}
        {activeTab === 'Profile' && (
          <div className="space-y-6">

            {/* ---- Row 1: Track Record + Fit & Measurements ---- */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              {/* Track Record (backend-derived, read-only) */}
              <div className="border border-stone-200 rounded-lg overflow-hidden bg-white">
                <div className="px-5 py-3 border-b bg-white font-semibold">
                  Track Record
                </div>
                <div className="p-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Rentals completed</span>
                    <span>0 • 1 upcoming</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">On-time returns</span>
                    <span>—</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Late returns / fees</span>
                    <span>None</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Damage deductions</span>
                    <span>None</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Cancelled orders</span>
                    <span>None</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Refunds issued</span>
                    <span>None</span>
                  </div>
                  {/* NEW row — matches reference PDF */}
                  <div className="flex justify-between">
                    <span className="text-stone-500">Promos used</span>
                    <span>None</span>
                  </div>
                  {/* NEW row — matches reference PDF */}
                  <div className="flex justify-between">
                    <span className="text-stone-500">Delivery incidents</span>
                    <span>None</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Outstanding dues</span>
                    <span>None</span>
                  </div>
                </div>
                <div className="px-5 py-3 bg-stone-50 text-xs text-stone-500">
                  Derived live from this customer's orders, deposit decisions and late-fee receivables — nothing here is entered by hand.
                </div>
              </div>

              {/* Fit & Measurements */}
              <div className="border border-stone-200 rounded-lg overflow-hidden bg-white">
                <div className="px-5 py-3 border-b bg-white font-semibold">
                  Fit & Measurements
                </div>
                <div className="p-6 text-center text-stone-400">
                  No measurements on file yet — they're captured automatically the first time she requests a custom fit on an order.
                </div>
                {/* NEW — "Sizes rented so far" line. Backed by existing
                    editSize field as a stand-in until order-level size
                    history exists on the backend. */}
                <div className="px-6 pb-4 text-sm text-stone-600">
                  Sizes rented so far: <span className="font-medium">{editSize || '—'}</span>
                </div>
                <div className="px-5 py-3 bg-stone-50 text-xs text-stone-500">
                  Captured automatically from custom-fit requests on orders, so repeat renters never re-send measurements.
                </div>
              </div>

            </div>

            {/* ---- Row 2: Contact Information ---- */}
            <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-stone-900 text-sm">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                  <label className="text-stone-500 font-medium">Phone Number (WhatsApp)</label>
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
                    placeholder="For B2B invoicing"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Date of Birth (Optional)</label>
                  <input
                    type="date"
                    value={editBirthDate}
                    onChange={(e) => setEditBirthDate(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
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
                {/* Referred By — state already existed (editReferrer) but
                    wasn't rendered before. Now wired up, matches PDF. */}
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Referred By</label>
                  <input
                    type="text"
                    value={editReferrer}
                    onChange={(e) => setEditReferrer(e.target.value)}
                    placeholder="Instagram, friend referral, walk-in..."
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1 xl:col-span-2">
                  <label className="text-stone-500 font-medium">Billing & Delivery Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveCustomer}
                  className="bg-[#d2ae63] hover:bg-[#c49d4f] text-[#3d2d14] font-semibold px-4 py-2 rounded-md text-sm transition flex items-center gap-2"
                >
                  <Save className="h-4 w-4" /> Save
                </button>
              </div>
            </div>

            {/* ---- Row 3: Preferences & Account (NEW CARD) ---- */}
            <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-stone-900 text-sm">
                Preferences & Account
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Preferred Sizes</label>
                  <input
                    type="text"
                    value={editSize}
                    onChange={(e) => setEditSize(e.target.value)}
                    placeholder="E.g. S, M, XL or numeric sizes"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                {/* UI-only for now — see TODO(backend) at top of file */}
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Preferred Occasions</label>
                  <input
                    type="text"
                    value={editPreferredOccasions}
                    onChange={(e) => setEditPreferredOccasions(e.target.value)}
                    placeholder="E.g. Wedding, Sangeet, Cocktail"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="uppercase text-[11px] tracking-wider font-bold text-stone-400">
                  WhatsApp Updates
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                  <span
                    onClick={() => setEditWhatsapp(!editWhatsapp)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${editWhatsapp ? 'bg-[#c5a880]' : 'bg-stone-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editWhatsapp ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </span>
                  <span className="text-stone-600 font-medium">Bookings, dispatch, returns</span>
                </label>
              </div>

              <div className="space-y-3">
                <label className="uppercase text-[11px] tracking-wider font-bold text-stone-400">
                  Email Notifications
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                  <span
                    onClick={() => setEditNewsletter(!editNewsletter)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${editNewsletter ? 'bg-[#c5a880]' : 'bg-stone-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editNewsletter ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </span>
                  <span className="text-stone-600 font-medium">Orders, rentals, deposits</span>
                </label>
              </div>

              {/* UI-only for now — see TODO(backend) at top of file */}
              <div className="space-y-3">
                <label className="uppercase text-[11px] tracking-wider font-bold text-stone-400">
                  New Arrivals & Offers
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                  <span
                    onClick={() => setEditMarketingOptIn(!editMarketingOptIn)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${editMarketingOptIn ? 'bg-[#c5a880]' : 'bg-stone-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editMarketingOptIn ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </span>
                  <span className="text-stone-600 font-medium">Curated picks, occasions</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                <div className="space-y-1 pt-3">
                  <label className="text-stone-500 font-medium">Account Created</label>
                  {/* Backed by existing joinedDate field — no new backend needed */}
                  <div className="w-full p-2 bg-stone-50 border border-stone-200 rounded text-xs text-stone-600">
                    {editingCustomer.joinedDate}
                  </div>
                </div>
                <div className="space-y-1 pt-3">
                  <label className="text-stone-500 font-medium">Last Login</label>
                  {/* TODO(backend): Customer.lastLogin?: string — placeholder until available */}
                  <div className="w-full p-2 bg-stone-50 border border-stone-200 rounded text-xs text-stone-400 italic">
                    Not tracked yet
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveCustomer}
                  className="bg-[#d2ae63] hover:bg-[#c49d4f] text-[#3d2d14] font-semibold px-4 py-2 rounded-md text-sm transition flex items-center gap-2"
                >
                  <Save className="h-4 w-4" /> Save
                </button>
              </div>
            </div>

            {/* ---- Row 4: Saved Addresses (NEW CARD, UI-only) ---- */}
            <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-stone-900 text-sm">
                Saved Addresses
              </h3>

              {addresses.length === 0 ? (
                <p className="text-stone-400">No saved addresses yet — add one below.</p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {addresses.map(a => (
                    <div key={a.id} className="py-3 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="uppercase text-[10px] font-bold text-stone-400 pt-0.5 w-16 shrink-0">
                          {a.label}
                        </span>
                        <span className="text-stone-700">{a.address}</span>
                      </div>
                      {a.isDefault && (
                        <span className="px-2 py-0.5 rounded border border-stone-300 text-[10px] uppercase text-stone-500 shrink-0">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end pt-2 border-t border-stone-100">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Label</label>
                  <input
                    type="text"
                    value={newAddressLabel}
                    onChange={(e) => setNewAddressLabel(e.target.value)}
                    placeholder="Home / Office / Venue..."
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Address</label>
                  <input
                    type="text"
                    value={newAddressText}
                    onChange={(e) => setNewAddressText(e.target.value)}
                    placeholder="Full delivery address with pincode"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <button
                  onClick={handleAddAddress}
                  className="border border-stone-300 px-4 py-2 rounded-md text-xs font-medium hover:bg-stone-50 whitespace-nowrap"
                >
                  + Add Address
                </button>
              </div>
            </div>

            {/* ---- Row 5: Occasions (NEW CARD, UI-only) ---- */}
            <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-stone-900 text-sm">
                Occasions
              </h3>

              {occasions.length === 0 ? (
                <p className="text-stone-400 text-center py-4">
                  No occasions on file — add the date she's dressing for.
                </p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {occasions.map(o => (
                    <div key={o.id} className="py-3 flex items-center justify-between">
                      <span className="text-stone-700 font-medium">{o.occasion}</span>
                      <span className="text-stone-500">{o.date || '—'}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end pt-2 border-t border-stone-100">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Occasion</label>
                  <input
                    type="text"
                    value={newOccasionName}
                    onChange={(e) => setNewOccasionName(e.target.value)}
                    placeholder="Sister's wedding, Sangeet..."
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Date</label>
                  <input
                    type="date"
                    value={newOccasionDate}
                    onChange={(e) => setNewOccasionDate(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <button
                  onClick={handleAddOccasion}
                  className="border border-stone-300 px-4 py-2 rounded-md text-xs font-medium hover:bg-stone-50 whitespace-nowrap"
                >
                  + Add Occasion
                </button>
              </div>

              <p className="text-xs text-stone-400 pt-1">
                The dates she's dressing for — the anchor for proactive, celebration-led follow-ups.
              </p>
            </div>

          </div>
        )}
        {/* ============================ END PART 1/9 — PROFILE ============================ */}

        {/* ============================================================ */}
        {/* PARTS 2-9 BELOW — UNCHANGED FOR NOW                           */}
        {/* (History / Wishlist / Settings still use their original      */}
        {/* markup and original activeTab values so nothing breaks.       */}
        {/* We'll replace each block in turn: Order History next.)        */}
        {/* ============================================================ */}

       {activeTab === 'Order History' && (
  <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
    <h3 className="font-serif font-bold text-stone-900 text-sm">Rented & Purchased Orders</h3>
    {custOrders.length === 0 ? (
      <p className="text-stone-400">No orders logged under this client.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-600">
            {custOrders.map(o => (
              <tr key={o.id} className="hover:bg-[#fcf9f5] transition-colors">
                <td className="px-4 py-4 font-mono text-[11px] text-stone-500">{o.id}</td>
                <td className="px-4 py-4">
                  <div className="font-semibold text-stone-900">{o.productName}</div>
                  {/* Shows a designer/brand line only if that field exists on Order */}
                  {(o as any).designer && (
                    <div className="text-[11px] text-stone-400">{(o as any).designer}</div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] ${
                    o.mode === 'Rental' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {o.mode}
                  </span>
                </td>
                <td className="px-4 py-4 font-semibold text-stone-900">
                  ₹{o.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-4 text-stone-500">
                  {(o as any).date || '—'}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] ${
                    o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedOrderId(o.id);
                      setView(`order_detail:${o.id}`);
                    }}
                    className="border border-stone-300 rounded-md px-3 py-1.5 text-xs hover:bg-stone-50"
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

        {/* ============================================================ */}
        {/* PART 2/9 — WISHLIST TAB                                       */}
        {/* Redesigned to match Admin Panel-customer.pdf reference.       */}
        {/* Still UI-only: renders from the same `products` prop slice    */}
        {/* as before (first 3 catalogue products) since there's no       */}
        {/* backend-tracked wishlist relationship yet.                    */}
        {/* TODO(backend): Customer.wishlist?: { productId: string }[]    */}
        {/* — swap products.slice(0,3) for the real saved items once      */}
        {/* that exists, and drop the "Preloved" placeholder tag for a    */}
        {/* real product condition field if/when one is added.            */}
        {/* ============================================================ */}
        {activeTab === 'Wishlist' && (
          <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-sm">
                Wishlist — {editingCustomer.name} ({editingCustomer.wishlistCount} item{editingCustomer.wishlistCount === 1 ? '' : 's'})
              </h3>
            </div>

            <div className="p-5">
              {products.slice(0, 3).length === 0 ? (
                <p className="text-stone-400 text-center py-6">No saved items yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {products.slice(0, 3).map(p => (
                    <div
                      key={p.id}
                      className="border border-stone-200 rounded-lg overflow-hidden bg-white hover:shadow-sm transition"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-40 w-full object-cover"
                      />
                      <div className="p-3 space-y-0.5">
                        <div className="font-semibold text-stone-900 text-xs truncate">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {p.designer} · Preloved
                        </div>
                        <div className="text-sm font-bold text-stone-900 pt-1">
                          ₹{p.rentalPrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-5 py-3 bg-stone-50 text-xs text-stone-500">
              What she's saved — the natural opener for a WhatsApp nudge when a saved piece drops in price or frees up for her dates.
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PART 3/9 — CART TAB                                           */}
        {/* Matches Admin Panel-customer.pdf reference. This is a NEW     */}
        {/* tab — there was no Cart UI before, so nothing existing is     */}
        {/* removed here. Entirely UI-only: local empty-array state,      */}
        {/* not wired to Customer or Order types.                         */}
        {/* TODO(backend): Customer.cart?: {                              */}
        {/*   id: string; productId: string; mode: 'Rental' | 'Purchase'; */}
        {/*   size: string; dates: string; price: number; deposit: number;*/}
        {/*   available: boolean;                                        */}
        {/* }[] — once this exists, replace the two empty arrays below    */}
        {/* with the real cart data and drop these placeholder consts.    */}
        {/* ============================================================ */}
        {activeTab === 'Cart' && (
          <div className="space-y-6">

            {/* Cart summary / WhatsApp nudge card */}
            <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100">
                <h3 className="font-serif font-bold text-stone-900 text-sm">
                  Cart — {editingCustomer.name} (0 items)
                </h3>
              </div>
              <div className="p-8 text-center text-stone-400">
                Her cart is empty right now.
              </div>
              <div className="px-5 py-3 bg-stone-50 text-xs text-stone-500">
                Opens a chat with a pre-filled note about what's waiting in her bag — nothing is sent automatically.
              </div>
            </div>

            {/* Items in cart table */}
            <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100">
                <h3 className="font-serif font-bold text-stone-900 text-sm">
                  Items in Cart
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200">
                      <th className="px-5 py-3">Piece</th>
                      <th className="px-5 py-3">Mode</th>
                      <th className="px-5 py-3">Size</th>
                      <th className="px-5 py-3">Dates</th>
                      <th className="px-5 py-3">Price</th>
                      <th className="px-5 py-3">Deposit</th>
                      <th className="px-5 py-3">Availability</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={7} className="px-5 py-6 text-center text-stone-400">
                        Nothing in the cart.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 bg-stone-50 text-xs text-stone-500">
                A cart never blocks dates — availability is checked live against the piece calendar (bookings + buffers). To convert, confirm dates on the piece calendar; that creates a Draft order per the standard flow.
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* PART 4/9 — RENTALS TAB                                        */}
        {/* Matches Admin Panel-customer.pdf reference. NEW tab — no      */}
        {/* existing code removed. Filters this customer's real Order     */}
        {/* records where mode === 'Rental' (uses existing Order fields   */}
        {/* only), but rental-period/return-due/days-left have no home    */}
        {/* on the Order type yet, so those three cells stay placeholder  */}
        {/* text until the backend carries them.                         */}
        {/* TODO(backend): Order.rentalStart?: string,                   */}
        {/*   Order.rentalEnd?: string, Order.rentalStatus?:              */}
        {/*   'Upcoming' | 'Active' | 'Returned' | 'Overdue'               */}
        {/* — once these exist, compute Return Due / Days / Status from   */}
        {/* them instead of showing "—".                                 */}
        {/* ============================================================ */}
        {activeTab === 'Rentals' && (
          <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-sm">
                Rentals — Upcoming, Active & Past
              </h3>
            </div>

            {custOrders.filter(o => o.mode === 'Rental').length === 0 ? (
              <div className="p-8 text-center text-stone-400">
                No rentals on file for this customer yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200">
                      <th className="px-5 py-3">Order</th>
                      <th className="px-5 py-3">Piece</th>
                      <th className="px-5 py-3">Rental Period</th>
                      <th className="px-5 py-3">Return Due</th>
                      <th className="px-5 py-3">Days</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-600">
                    {custOrders.filter(o => o.mode === 'Rental').map(o => (
                      <tr key={o.id} className="hover:bg-[#fcf9f5] transition-colors">
                        <td className="px-5 py-4 font-mono text-[11px] text-stone-500">
                          {o.id}
                        </td>
                        <td className="px-5 py-4 font-semibold text-stone-900">
                          {o.productName}
                        </td>
                        <td className="px-5 py-4 text-stone-500">
                          {(o as any).date || '—'}
                        </td>
                        <td className="px-5 py-4 text-stone-500">
                          —
                        </td>
                        <td className="px-5 py-4 text-stone-500">
                          —
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-1 rounded text-[10px] bg-amber-100 text-amber-700">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* PART 5/9 — DEPOSITS TAB                                       */}
        {/* Matches Admin Panel-customer.pdf reference. NEW tab — no      */}
        {/* existing code removed. Deposit amounts/status/due-dates have  */}
        {/* no home on Order yet, so the ledger row below uses            */}
        {/* placeholder text for those cells; only Order/Piece come from  */}
        {/* real data (custOrders).                                      */}
        {/* TODO(backend): Order.depositAmount?: number,                 */}
        {/*   Order.depositStatus?: 'Pending Collection' | 'Held' |       */}
        {/*   'Released', Order.depositDueDate?: string                   */}
        {/* — once these exist, replace the placeholders below and       */}
        {/* compute the "Held / To collect" summary line from real data   */}
        {/* instead of the hardcoded ₹0 / ₹25,000 shown in the header      */}
        {/* card above (Track Record row already has this same TODO).     */}
        {/* ============================================================ */}
        {activeTab === 'Deposits' && (
          <div className="space-y-6">

            {/* Deposit Coordination */}
            <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100 flex justify-between items-center">
                <h3 className="font-serif font-bold text-stone-900 text-sm">
                  Deposit Coordination
                </h3>
                <button className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-4 py-2 rounded-md text-xs font-medium flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Customer
                </button>
              </div>
              <div className="p-5 text-stone-500">
                Deposits are collected and released over WhatsApp/UPI — the button opens a chat with a pre-filled deposit note for this customer.
              </div>
            </div>

            {/* Deposit History */}
            <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100 flex justify-between items-center flex-wrap gap-3">
                <h3 className="font-serif font-bold text-stone-900 text-sm">
                  Deposit History
                </h3>
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span>Held ₹0 · To collect ₹25,000 — by 23 Mar 2026</span>
                  <button className="border border-stone-300 px-3 py-1.5 rounded-md font-medium hover:bg-stone-50 whitespace-nowrap">
                    Open Deposit Ledger →
                  </button>
                </div>
              </div>

              {custOrders.filter(o => o.mode === 'Rental').length === 0 ? (
                <div className="p-8 text-center text-stone-400">
                  No deposits on file for this customer yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200">
                        <th className="px-5 py-3">Order</th>
                        <th className="px-5 py-3">Piece</th>
                        <th className="px-5 py-3">Deposit</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Due / Standing</th>
                        <th className="px-5 py-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-600">
                      {custOrders.filter(o => o.mode === 'Rental').map(o => (
                        <tr key={o.id} className="hover:bg-[#fcf9f5] transition-colors">
                          <td className="px-5 py-4 font-mono text-[11px] text-[#c5a880]">
                            {o.id}
                          </td>
                          <td className="px-5 py-4 font-semibold text-stone-900">
                            {o.productName}
                          </td>
                          <td className="px-5 py-4 font-semibold text-stone-900">
                            ₹25,000
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2 py-1 rounded text-[10px] bg-stone-200 text-stone-600">
                              Pending Collection
                            </span>
                          </td>
                          <td className="px-5 py-4 text-stone-500">
                            Collect by 23 Mar 2026 · <span className="text-[#b45309] font-medium">today</span>
                            <div className="text-[11px] text-stone-400">before dispatch</div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button className="bg-[#d2ae63] hover:bg-[#c49d4f] text-[#3d2d14] font-semibold px-3 py-1.5 rounded-md text-xs whitespace-nowrap">
                              Record receipt →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* PART 6/9 — OFFERS TAB                                         */}
        {/* Matches Admin Panel-customer.pdf reference. NEW tab — no      */}
        {/* existing code removed. There's no Offer/Enquiry type or       */}
        {/* relationship on Customer/Order yet, so this renders a single  */}
        {/* placeholder row matching the reference screenshot rather than */}
        {/* mapping over real data.                                      */}
        {/* TODO(backend): Customer.offers?: {                           */}
        {/*   id: string; productName: string; designer: string;         */}
        {/*   listedPrice: number; offeredPrice: number;                  */}
        {/*   counterPrice?: number; status: 'Accepted' | 'Countered' |   */}
        {/*   'Declined' | 'Pending'; receivedDate: string;               */}
        {/* }[] — once this exists (likely sourced from the Offers &      */}
        {/* Enquiries module in the sidebar), map over the real array     */}
        {/* here instead of the single hardcoded row below, and wire the  */}
        {/* row click to navigate into that module as the footer note     */}
        {/* describes.                                                    */}
        {/* ============================================================ */}
        {activeTab === 'Offers' && (
          <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-sm">
                Offers & Enquiries — {editingCustomer.name} (1)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200">
                    <th className="px-5 py-3">Offer</th>
                    <th className="px-5 py-3">Piece</th>
                    <th className="px-5 py-3">Listed</th>
                    <th className="px-5 py-3">Offered</th>
                    <th className="px-5 py-3">Counter</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-600">
                  <tr className="hover:bg-[#fcf9f5] transition-colors cursor-pointer">
                    <td className="px-5 py-4 font-mono text-[11px] text-stone-500">
                      OFR-203
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-stone-900">Charcoal Silk Bandhgala</div>
                      <div className="text-[11px] text-stone-400">Manish Malhotra</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-900">
                      ₹38,000
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#c5a880]">
                      ₹32,000
                    </td>
                    <td className="px-5 py-4 text-stone-400">
                      —
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 rounded text-[10px] bg-green-100 text-green-700">
                        Accepted
                      </span>
                    </td>
                    <td className="px-5 py-4 text-stone-500">
                      22 May 2026
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 bg-stone-50 text-xs text-stone-500">
              Make an Offer applies to preloved pieces only — never rental or Buy New. Click a row to open it in Offers & Enquiries.
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PART 7/9 — COMMUNICATION LOG TAB                              */}
        {/* Matches Admin Panel-customer.pdf reference. NEW tab — no      */}
        {/* existing code removed. Seeded with the 3 sample entries from  */}
        {/* the reference PDF as local state; "Log Communication" appends */}
        {/* to that local list only — nothing is sent to onUpdateCustomer */}
        {/* or persisted, since Customer has no communicationLog field.   */}
        {/* TODO(backend): Customer.communicationLog?: {                 */}
        {/*   id: string; message: string; channel: string;               */}
        {/*   timestamp: string;                                          */}
        {/* }[] — once this exists, hydrate commLog from `customer` in    */}
        {/* startEditing() (like the other UI-only sections above) and    */}
        {/* send new entries through onUpdateCustomer / a dedicated API   */}
        {/* call instead of local state.                                  */}
        {/* ============================================================ */}
        {activeTab === 'Communication Log' && (
          <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100 flex justify-between items-center">
              <h3 className="font-serif font-bold text-stone-900 text-sm">
                Communication Log
              </h3>
              <span className="text-stone-400">
                System notifications and manual notes, newest first
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {commLog.length === 0 ? (
                <div className="p-8 text-center text-stone-400">
                  No communication logged yet.
                </div>
              ) : (
                commLog.map(entry => (
                  <div key={entry.id} className="px-5 py-4 flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-stone-900">
                        {entry.message}
                      </div>
                      <div className="text-stone-400 mt-0.5">
                        {entry.timestamp} · {entry.channel}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-5 border-t border-stone-100 flex gap-3 items-start">
              <textarea
                value={newCommMessage}
                onChange={(e) => setNewCommMessage(e.target.value)}
                placeholder="Log a note or communication..."
                rows={2}
                className="flex-1 p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs resize-none"
              />
              <select
                value={newCommChannel}
                onChange={(e) => setNewCommChannel(e.target.value)}
                className="p-2 border border-stone-200 rounded text-xs"
              >
                <option>WhatsApp</option>
                <option>Instagram</option>
                <option>Phone</option>
                <option>Email</option>
                <option>In Person</option>
                <option>Note</option>
              </select>
              <button
                onClick={handleLogCommunication}
                className="border border-stone-300 px-4 py-2 rounded-md text-xs font-medium hover:bg-stone-50 whitespace-nowrap"
              >
                Log Communication
              </button>
            </div>
          </div>
        )}

      {/* ============================================================ */}
        {/* PART 8/9 — ACCOUNT SETTINGS TAB                               */}
        {/* Redesigned to match Admin Panel-customer.pdf reference.       */}
        {/* editNotes and editStatus are UNCHANGED — same fields, same    */}
        {/* handleSaveCustomer() flow, same onUpdateCustomer payload as   */}
        {/* before. "Flag Reason" and "Source" have no home on Customer   */}
        {/* yet, so they're local UI-only state (safe no-ops), and the    */}
        {/* Consent & Privacy card below is a static reference-matching   */}
        {/* placeholder since there's no consent-log data yet.            */}
        {/* TODO(backend): Customer.flagReason?: string,                 */}
        {/*   Customer.source?: string — once these exist, hydrate them   */}
        {/*   in startEditing() and add them to the handleSaveCustomer()   */}
        {/*   payload like the other real fields.                         */}
        {/* TODO(backend): Customer.consentLog?: { id: string; label:     */}
        {/*   string; grantedDate: string; source: string }[],            */}
        {/*   Customer.idVerification?: { type: string; verifiedDate:    */}
        {/*   string } — once these exist, replace the hardcoded rows in  */}
        {/* the Consent & Privacy card with real data.                    */}
        {/* ============================================================ */}
        {activeTab === 'Account Settings' && (
          <div className="space-y-6">

            {/* Account Settings */}
            <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100">
                <h3 className="font-serif font-bold text-stone-900 text-sm">
                  Account Settings
                </h3>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-stone-500 font-medium uppercase text-[11px] tracking-wider">
                      Account Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as 'Active' | 'Suspended')}
                      className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-500 font-medium uppercase text-[11px] tracking-wider">
                      Customer Since
                    </label>
                    <div className="w-full p-2 bg-stone-50 border border-stone-200 rounded text-xs text-stone-600">
                      {editingCustomer.joinedDate}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 font-medium uppercase text-[11px] tracking-wider">
                    Source
                  </label>
                  <input
                    type="text"
                    value={editSource}
                    onChange={(e) => setEditSource(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 font-medium uppercase text-[11px] tracking-wider">
                    Flag Reason (if flagged)
                  </label>
                  <textarea
                    value={editFlagReason}
                    onChange={(e) => setEditFlagReason(e.target.value)}
                    rows={3}
                    placeholder="Describe any concerns or issues with this account..."
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 font-medium uppercase text-[11px] tracking-wider">
                    Internal Notes
                  </label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={3}
                    placeholder="Only visible to Kaira staff..."
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  />
                </div>
              </div>

              <div className="px-5 py-3 bg-stone-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const nextSt = editStatus === 'Active' ? 'Suspended' : 'Active';
                    setEditStatus(nextSt);
                  }}
                  className="border border-rose-300 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-md text-xs font-semibold transition"
                >
                  {editStatus === 'Active' ? "Suspend Account" : "Un-suspend Account"}
                </button>
                <button
                  onClick={handleSaveCustomer}
                  className="bg-[#d2ae63] hover:bg-[#c49d4f] text-[#3d2d14] font-semibold px-4 py-2 rounded-md text-xs transition flex items-center gap-2"
                >
                  <Save className="h-4 w-4" /> Save
                </button>
              </div>
            </div>

            {/* Consent & Privacy — DPDP */}
            <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100">
                <h3 className="font-serif font-bold text-stone-900 text-sm">
                  Consent & Privacy — DPDP
                </h3>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700 shrink-0 mt-0.5">
                    Granted
                  </span>
                  <div>
                    <div className="text-stone-700">
                      Service updates — bookings, dispatch, returns (WhatsApp/Email)
                    </div>
                    <div className="text-stone-400 text-[11px] mt-0.5">
                      {editingCustomer.joinedDate} · via Signup form
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-3 border-t border-stone-100">
                  <label className="text-stone-500 font-medium uppercase text-[11px] tracking-wider">
                    ID Verification (High-Deposit Rentals)
                  </label>
                  <div className="w-full p-2 bg-stone-50 border border-stone-200 rounded text-xs text-stone-600">
                    PAN — verified 21 Mar 2026
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-stone-50 text-xs text-stone-500">
                Consent entries are appended automatically when notification toggles are saved — the log is the audit trail, never edited by hand. Documents are verified and returned; HOK stores only the verification fact, never the document. Deletion requests under the DPDP Act are handled in the backend and remove the account plus derived data.
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
<div className="space-y-1">
  <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#c5a880]">
    OPERATIONS
  </p>

  <h2 className="text-4xl font-serif text-stone-900">
    Customers
  </h2>

  <p className="text-sm text-stone-500 max-w-3xl leading-7">
    Every account holder and manual (WhatsApp) contact, with orders,
    deposits and track record derived live from order data.
    Click any row to open the full profile.
  </p>
</div>

      {/* Filters row */}
<div className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

  <div className="flex flex-1 flex-wrap gap-3">

    <div className="relative min-w-[320px] flex-1">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />

      <input
        type="text"
        placeholder="Search by name, email, phone, city..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:border-[#c5a880]"
      />
    </div>

    <select
      value={selectedStatus}
      onChange={(e) => setSelectedStatus(e.target.value)}
      className="px-4 py-2 border border-stone-200 rounded-md text-sm"
    >
      <option>All Statuses</option>
      <option>Active</option>
      <option>Suspended</option>
    </select>

    <select
      className="px-4 py-2 border border-stone-200 rounded-md text-sm"
    >
      <option>All Sources</option>
      <option>Website</option>
      <option>Manual - WA</option>
    </select>

  </div>

  <div className="flex gap-3">

    <button
      className="bg-[#d2ae63] hover:bg-[#c49d4f] text-[#3d2d14] font-semibold px-4 py-2 rounded-md text-sm transition">
      + Add Customer
    </button>

    <button
      className="border border-stone-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-50"
    >
      Export CSV
    </button>

  </div>

</div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200">

  <th className="px-5 py-3">Customer</th>

  <th className="px-5 py-3">Location</th>

  <th className="px-5 py-3">Modes</th>

  <th className="px-5 py-3">Orders</th>

  <th className="px-5 py-3">Lifetime Value</th>

  <th className="px-5 py-3">Last Order</th>

  <th className="px-5 py-3">Joined</th>

  <th className="px-5 py-3">Source</th>

  <th className="px-5 py-3">Status</th>

  <th className="px-5 py-3 text-right">View</th>

</tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600 font-sans">
              {filteredCustomers.map(c => (
                <tr
  key={c.id}
  className="hover:bg-[#fcf9f5] transition-colors border-b border-stone-100"
>
  {/* Customer */}
  <td className="px-5 py-4">
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <div className="font-semibold text-stone-900">
          {c.name}
        </div>

        <div className="text-[11px] text-stone-500">
          {c.email}
        </div>
      </div>

      <span className="flex items-center justify-center w-7 h-7 rounded bg-[#22c55e]">
  <MessageCircle className="w-4 h-4 text-white" />
</span>
    </div>
  </td>

  {/* Location */}
  <td className="px-5 py-4">
    {c.location}
  </td>

  {/* Modes */}
  <td className="px-5 py-4">
    <div className="flex gap-1">
      <span className="bg-green-100 text-green-700 px-2 rounded text-[10px]">
        R
      </span>

      <span className="bg-orange-100 text-orange-700 px-2 rounded text-[10px]">
        P
      </span>
    </div>
  </td>

  {/* Orders */}
  <td className="px-5 py-4 font-medium">
    {getCustomerOrders(c.email).length}
  </td>

  {/* Lifetime */}
  <td className="px-5 py-4 font-semibold">
    ₹{getCustomerOrders(c.email)
      .reduce((sum, o) => sum + o.amount, 0)
      .toLocaleString("en-IN")}
  </td>

  {/* Last Order */}
  <td className="px-5 py-4">
    {c.lastOrderDate}
  </td>

  {/* Joined */}
  <td className="px-5 py-4">
    {c.joinedDate}
  </td>

  {/* Source */}
  <td className="px-5 py-4 text-stone-500">
    Website
  </td>

  {/* Status */}
  <td className="px-5 py-4">
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs">
      {c.status}
    </span>
  </td>

  {/* View */}
  <td className="px-5 py-4 text-right">
    <button
      onClick={() => startEditing(c)}
      className="border border-stone-300 rounded-md px-4 py-2 text-sm hover:bg-stone-50"
    >
      View →
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