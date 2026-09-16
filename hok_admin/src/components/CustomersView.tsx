import React, { useState } from 'react';
import { Search, Eye, Mail, Phone, MapPin, User, Save, ListFilter, AlertTriangle, MessageCircle, ChevronLeft, ExternalLink, Trash2, X, Loader2 } from 'lucide-react';
import { Customer, Order, Product, SavedAddress, CustomerOccasion, Offer } from '../types';
import * as customerApi from '../services/customerApi';
import * as orderApi from '../services/orderApi';
import * as offerApi from '../services/offerApi';
import toast from 'react-hot-toast';

interface CustomersViewProps {
  customers: Customer[];
  orders: Order[];
  products: Product[];
  onUpdateCustomer: (updated: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  setView: (view: string) => void;
  setSelectedOrderId: (id: string) => void;
  onEditingChange?: (isEditing: boolean) => void;
}

export default function CustomersView({
  customers,
  orders,
  products,
  onUpdateCustomer,
  onDeleteCustomer,
  setView,
  setSelectedOrderId,
  onEditingChange,
}: CustomersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [detailOrders, setDetailOrders] = useState<Order[]>([]);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
  const [occasions, setOccasions] = useState<CustomerOccasion[]>([]);
  const [newOccasionName, setNewOccasionName] = useState('');
  const [newOccasionDate, setNewOccasionDate] = useState('');
  // TODO(backend): Customer.communicationLog?: { id: string; message: string; channel: string; timestamp: string }[]

  // Local card state: Communication Log tab & inline card
  const [commLog, setCommLog] = useState<Array<{ id: string; message: string; channel: string; timestamp: string }>>([]);
  const [newCommMessage, setNewCommMessage] = useState('');
  const [newCommChannel, setNewCommChannel] = useState<'WhatsApp' | 'Instagram' | 'Phone' | 'Email' | 'In Person' | 'Note'>('WhatsApp');

  const isEditingOrAdding = !!(editingCustomer || isAddingCustomer);



  React.useEffect(() => {
    onEditingChange?.(isEditingOrAdding);
  }, [isEditingOrAdding, onEditingChange]);

  const [customerOffers, setCustomerOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);

  React.useEffect(() => {
    if (activeTab === 'Offers' && editingCustomer) {
      setOffersLoading(true);
      offerApi.getOffers().then(allOffers => {
        const matching = allOffers.filter(o => 
          (o.customerId && o.customerId === (editingCustomer.customerId || editingCustomer.id)) ||
          (o.customerEmail && o.customerEmail === editingCustomer.email) || 
          (o.customerName && o.customerName === editingCustomer.name) ||
          (o.phone && o.phone === editingCustomer.phone)
        );
        setCustomerOffers(matching);
      }).catch(err => {
        console.error("Failed to load offers", err);
      }).finally(() => {
        setOffersLoading(false);
      });
    }
  }, [activeTab, editingCustomer]);

  const startEditing = (customer: Customer) => {
    setIsAddingCustomer(false);
    setEditingCustomer(customer);
    setDetailOrders(orders);
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
    setEditPreferredOccasions(customer.preferences?.preferredOccasions || '');
    setEditSilhouettes(customer.preferences?.preferredSilhouettes || '');
    setEditNewsletter(customer.preferences?.newsletter || false);
    setEditWhatsapp(customer.preferences?.whatsappNotifications || false);
    setEditMarketingOptIn(customer.preferences?.marketingOptIn || false);
    setEditNotes(customer.internalNotes || '');
    setEditStatus(customer.status);

    // Rehydrate a customer detail page from the database so all tabs use the
    // same up-to-date orders, totals, deposits, and rental history.
    Promise.all([
      customerApi.getCustomerById(customer.customerId || customer.id),
      orderApi.getOrders(),
    ]).then(([freshCustomer, freshOrders]) => {
      setEditingCustomer(freshCustomer);
      setDetailOrders(freshOrders);
    }).catch((error) => {
      console.error('Unable to refresh customer detail data:', error);
    });

    setAddresses(customer.addresses || []);
    setNewAddressLabel('');
    setNewAddressText('');
    setOccasions(customer.occasions || []);
    setNewOccasionName('');
    setNewOccasionDate('');
  };

  const startAdding = () => {
    setIsAddingCustomer(true);
    setEditingCustomer(null);
    setActiveTab('Profile');
    setEditName('');
    setEditEmail('');
    setEditPhone('');
    setEditLocation('');
    setEditAddress('');
    setEditGstin('');
    setEditInstagram('');
    setEditBirthDate('');
    setEditReferrer('');
    setEditSize('');
    setEditSilhouettes('');
    setEditNewsletter(false);
    setEditWhatsapp(false);
    setEditMarketingOptIn(false);
    setEditNotes('');
    setEditStatus('Active');
    setEditSource('Manual (WhatsApp)');
    setEditFlagReason('');
    setEditPreferredOccasions('');
    setAddresses([]);
    setNewAddressLabel('');
    setNewAddressText('');
    setOccasions([]);
    setNewOccasionName('');
    setNewOccasionDate('');
  };

  const handleSaveCustomer = async () => {
    if (!isAddingCustomer && !editingCustomer) return;
    const isNew = isAddingCustomer || !editingCustomer;
    let nextCustId = 'CUST-00001';
    if (!editingCustomer) {
      const existingCustIds = customers
        .map(c => c.id || c.customerId)
        .filter(id => id && id.startsWith('CUST-'))
        .map(id => parseInt(id.replace('CUST-', ''), 10))
        .filter(num => !isNaN(num));
      const maxId = existingCustIds.length > 0 ? Math.max(...existingCustIds) : 0;
      nextCustId = `CUST-${String(maxId + 1).padStart(5, '0')}`;
    }
    const customerId = editingCustomer ? (editingCustomer.customerId || editingCustomer.id) : nextCustId;

    // Ensure valid email formatting
    let formattedEmail = editEmail.trim();
    if (!formattedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formattedEmail)) {
      formattedEmail = `contact_${Date.now()}@hok.local`;
    }

    // Determine primary address string from editAddress field or first item in addresses array
    const primaryAddress = editAddress.trim() || (addresses.length > 0 ? addresses[0].address : (editingCustomer?.address || ''));

    const savedCustomer: Customer = {
      id: customerId,
      customerId: customerId,
      name: editName.trim() || (isNew ? 'New Customer' : editingCustomer?.name || ''),
      email: formattedEmail,
      phone: editPhone.trim() || (editingCustomer?.phone || ''),
      location: editLocation.trim() || (editingCustomer?.location || 'India'),
      address: primaryAddress,
      gstin: editGstin,
      instagram: editInstagram,
      birthDate: editBirthDate,
      referrer: editReferrer,
      status: editStatus,
      source: editSource,
      preferences: {
        preferredSize: editSize,
        preferredOccasions: editPreferredOccasions,
        preferredSilhouettes: editSilhouettes,
        newsletter: editNewsletter,
        whatsappNotifications: editWhatsapp,
        marketingOptIn: editMarketingOptIn
      },
      addresses: addresses,
      occasions: occasions,
      internalNotes: editNotes,
      joinedDate: editingCustomer?.joinedDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      ordersCount: editingCustomer?.ordersCount || 0,
      totalSpent: editingCustomer?.totalSpent || 0,
      lifetimeValue: editingCustomer?.lifetimeValue || editingCustomer?.totalSpent || 0,
      wishlistCount: editingCustomer?.wishlistCount || 0,
      lastOrderDate: editingCustomer?.lastOrderDate || '—'
    };

    let finalCustomer = savedCustomer;
    let apiSuccess = false;
    try {
      if (isNew) {
        const res = await customerApi.createCustomer(savedCustomer);
        if (res && res.id) {
          finalCustomer = res;
          apiSuccess = true;
        }
      } else {
        const res = await customerApi.updateCustomer(savedCustomer);
        if (res && res.id) {
          finalCustomer = res;
          apiSuccess = true;
        }
      }
    } catch (err: any) {
      console.error("Backend API Error on Save:", err);
      toast.error("Error saving customer to database: " + (err.message || "Failed to reach server"));
    }

    onUpdateCustomer(finalCustomer);
    setEditingCustomer(finalCustomer);
    setIsAddingCustomer(false);
    if (apiSuccess) {
      toast.success(isNew ? "New customer record created & saved to database successfully!" : "Customer profile updated in database successfully!");
    }
  };

  const handleAddAddress = () => {
    if (!newAddressLabel.trim() || !newAddressText.trim()) return;
    const newAddr: SavedAddress = {
      id: `addr_${Date.now()}`,
      label: newAddressLabel.trim().toUpperCase(),
      address: newAddressText.trim(),
      isDefault: addresses.length === 0
    };
    setAddresses(prev => [...prev, newAddr]);
    setNewAddressLabel('');
    setNewAddressText('');

    if (editingCustomer) {
      customerApi.addCustomerAddress(editingCustomer.id, newAddr).catch(() => {});
    }
  };

  const handleAddOccasion = () => {
    if (!newOccasionName.trim()) return;
    const newOcc: CustomerOccasion = {
      id: `occ_${Date.now()}`,
      occasion: newOccasionName.trim(),
      date: newOccasionDate
    };
    setOccasions(prev => [...prev, newOcc]);
    setNewOccasionName('');
    setNewOccasionDate('');

    if (editingCustomer) {
      customerApi.addCustomerOccasion(editingCustomer.id, newOcc).catch(() => {});
    }
  };

  const handleLogCommunication = () => {
    if (!newCommMessage.trim()) return;
    setCommLog(prev => [
      { id: `comm_${Date.now()}`, message: newCommMessage.trim(), channel: newCommChannel, timestamp: new Date().toLocaleString('en-IN') },
      ...prev
    ]);
    setNewCommMessage('');
  };

  const openDeleteModal = (customer: Customer) => {
    setDeleteTarget(customer);
    setDeleteConfirmed(false);
    setDeleting(false);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setDeleteConfirmed(false);
    setDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !deleteConfirmed || deleting) return;
    const idToDelete = deleteTarget.customerId || deleteTarget.id;
    setDeleting(true);
    try {
      await customerApi.deleteCustomer(idToDelete);
      onDeleteCustomer(idToDelete);
      setDeleteTarget(null);
      setDeleteConfirmed(false);
      setDeleting(false);
      toast.success(`Customer "${deleteTarget.name}" deleted from database successfully.`);
    } catch (err: any) {
      console.error("Backend API Error on Delete:", err);
      toast.error("Error deleting customer from database: " + (err.message || "Failed to reach server"));
      setDeleting(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    if (!c.name || c.name.trim() === '') return false;
    
    const sTerm = searchTerm.toLowerCase();
    const cName = c.name || '';
    const cEmail = c.email || '';
    const cLocation = c.location || '';
    
    const matchesSearch = cName.toLowerCase().includes(sTerm) ||
      cEmail.toLowerCase().includes(sTerm) ||
      cLocation.toLowerCase().includes(sTerm);
    const matchesStatus = selectedStatus === 'All Statuses' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getCustomerOrders = (cust: Customer) => {
    const sourceOrders = editingCustomer && (cust.customerId || cust.id) === (editingCustomer.customerId || editingCustomer.id)
      ? detailOrders
      : orders;
    const customerId = cust.customerId || cust.id;
    return sourceOrders.filter((order) => order.customerId === customerId);
  };

  if (editingCustomer || isAddingCustomer) {
    const custOrders = editingCustomer ? getCustomerOrders(editingCustomer) : [];
    return (
      <div className="min-h-full bg-[#FAF7F2] font-sans text-xs text-[#2A241F]">
        {/* Fixed Top Bar Header */}
        <header className="border-b border-[#E8E0D6] bg-white px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Back Button & Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setEditingCustomer(null); setIsAddingCustomer(false); }}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-[#E6DED3] bg-white px-3 text-[12px] font-medium text-[#6F675D] hover:bg-[#FAF8F5] transition shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-1.5 text-[13px]">
                <span className="text-[#9C9287]">Customers</span>
                <span className="text-[#C3BAAF]">›</span>
                <span className="font-semibold text-[#2C2926]">
                  {isAddingCustomer ? 'New Customer' : editingCustomer?.name}
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open('/', '_blank')}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#E5DDD3] bg-white px-3.5 text-[12px] font-medium text-[#38332D] hover:bg-[#FAF8F5] transition shadow-2xs cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#6F675D]" />
                <span>View Live Site</span>
              </button>
              <button
                onClick={handleSaveCustomer}
                className="inline-flex h-8 items-center rounded-md bg-[#C7A55C] hover:bg-[#B9974B] px-4 text-[12px] font-semibold text-[#2A2118] transition shadow-2xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Soft Green Banner Notice (when adding manual contact) */}
          {isAddingCustomer && (
            <div className="bg-[#F3F9F3] border border-[#D0EBD0] rounded-md p-3.5 px-4 text-[12.5px] text-[#2D6A35] leading-relaxed">
              Creating a <span className="font-semibold">manual (WhatsApp) contact</span> — fill in Contact Information below and press Save to create the record. Website signups appear here automatically; manual contacts are merged into the signup account if the customer registers later with the same phone or email.
            </div>
          )}

          {/* Dark Customer Hero Card */}
          <div className="bg-[#181521] rounded-xl px-7 py-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm">
            <div className="flex items-center gap-5">
              {/* Avatar Circle */}
              <div className="w-14 h-14 rounded-full bg-[#C7A55C] flex items-center justify-center text-xl font-bold text-[#2D2418] shrink-0 shadow-inner">
                {isAddingCustomer ? (
                  <span className="text-2xl font-normal">+</span>
                ) : (
                  editingCustomer?.name
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .substring(0, 2)
                )}
              </div>

              {/* Customer Details */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-white tracking-tight">
                  {isAddingCustomer ? 'New Customer' : editingCustomer?.name}
                </h2>
                <p className="text-[#A89F91] text-[12.5px] mt-1 font-normal">
                  {isAddingCustomer ? (
                    "Manual (WhatsApp) contact — fill Contact Information below and press Save to create."
                  ) : (
                    `${editingCustomer?.email} • ${editingCustomer?.phone} • ${editingCustomer?.location} • Joined ${editingCustomer?.joinedDate}`
                  )}
                </p>

                {!isAddingCustomer && (
                  <div className="flex flex-wrap gap-8 mt-4 text-xs">
                    <div>
                      <div className="text-2xl font-bold text-white leading-tight">
                        {custOrders.length}
                      </div>
                      <div className="uppercase text-[10px] tracking-wider text-[#A89F91] mt-0.5 font-medium">
                        Orders
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white leading-tight">
                        ₹{custOrders.reduce((sum, o) => sum + Number(o.amount || (o as any).orderValue || (o as any).grandTotal || 0), 0).toLocaleString("en-IN")}
                      </div>
                      <div className="uppercase text-[10px] tracking-wider text-[#A89F91] mt-0.5 font-medium">
                        Lifetime Value
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white leading-tight">
                        ₹{custOrders.filter(o => o.depositStatus === 'Held' || ['Dispatched', 'Shipped', 'Delivered', 'Return Sent'].includes(o.status)).reduce((sum, o) => sum + Number(o.deposit || (o as any).depositHeld || 0), 0).toLocaleString("en-IN")}
                      </div>
                      <div className="uppercase text-[10px] tracking-wider text-[#A89F91] mt-0.5 font-medium">
                        Deposits Held
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white leading-tight">
                        {editingCustomer?.wishlistCount || 0}
                      </div>
                      <div className="uppercase text-[10px] tracking-wider text-[#A89F91] mt-0.5 font-medium">
                        Wishlist
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Status & Actions */}
            <div className="flex flex-col items-start sm:items-end gap-3 shrink-0 self-stretch sm:self-auto justify-between">
              <div className="flex items-center gap-2">
                {!isAddingCustomer && (
                  <span className="px-2.5 py-0.5 rounded border border-stone-600 text-[10px] uppercase tracking-wider text-stone-300">
                    WEBSITE SIGNUP
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded bg-[#E8F2E8] text-[#3E7A4A] text-[11px] font-medium">
                  Active
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button className="bg-[#22C55E] hover:bg-[#16A34A] px-4 py-2 rounded text-white font-medium text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs">
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Customer
                </button>
                <button className="border border-[#4A4452] hover:bg-white/10 px-4 py-2 rounded text-white font-medium text-xs transition cursor-pointer shadow-2xs">
                  Email
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="border-b border-[#E8E1D9]">
            <nav className="flex gap-7 overflow-x-auto scrollbar-none whitespace-nowrap">
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
                    className={`py-2.5 text-[13px] transition cursor-pointer relative font-medium ${
                      isActive
                        ? 'text-[#2B2520] font-semibold'
                        : 'text-[#8C847A] hover:text-[#2B2520]'
                    }`}
                  >
                    {tab}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C7A55C] rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'Profile' && (
            <div className="space-y-6">
              {/* Row 1: Track Record + Fit & Measurements */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Track Record */}
                <div className="border border-[#EBE5DF] rounded-lg overflow-hidden bg-white shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="px-5 py-3 border-b border-[#EBE5DF] bg-white font-semibold text-stone-900 text-xs">
                      Track Record
                    </div>
                    {isAddingCustomer ? (
                      <div className="p-10 text-center text-[#A0988E] text-xs font-normal">
                        Track record builds automatically from her first order.
                      </div>
                    ) : (
                      <div className="p-5 space-y-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Rentals completed</span>
                          <span className="font-medium text-stone-900">0 • 1 upcoming</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">On-time returns</span>
                          <span className="font-medium text-stone-900">—</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Late returns / fees</span>
                          <span className="font-medium text-stone-900">None</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Damage deductions</span>
                          <span className="font-medium text-stone-900">None</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Cancelled orders</span>
                          <span className="font-medium text-stone-900">None</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Refunds issued</span>
                          <span className="font-medium text-stone-900">None</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Promos used</span>
                          <span className="font-medium text-stone-900">None</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Delivery incidents</span>
                          <span className="font-medium text-stone-900">None</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Outstanding dues</span>
                          <span className="font-medium text-stone-900">None</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="px-5 py-3 bg-[#FAF7F2] text-[11px] text-[#8C847A] border-t border-[#EBE5DF]">
                    Derived live from this customer's orders, deposit decisions and late-fee receivables — nothing here is entered by hand.
                  </div>
                </div>

                {/* Fit & Measurements */}
                <div className="border border-[#EBE5DF] rounded-lg overflow-hidden bg-white shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="px-5 py-3 border-b border-[#EBE5DF] bg-white font-semibold text-stone-900 text-xs">
                      Fit & Measurements
                    </div>
                    {isAddingCustomer ? (
                      <div className="p-10 text-center text-[#A0988E] text-xs font-normal">
                        Captured automatically from the first custom-fit order.
                      </div>
                    ) : (
                      <>
                        <div className="p-6 text-center text-[#A0988E]">
                          No measurements on file yet — they're captured automatically the first time she requests a custom fit on an order.
                        </div>
                        <div className="px-6 pb-4 text-xs text-stone-600">
                          Sizes rented so far: <span className="font-medium">{editSize || '—'}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="px-5 py-3 bg-[#FAF7F2] text-[11px] text-[#8C847A] border-t border-[#EBE5DF]">
                    Captured automatically from custom-fit requests on orders, so repeat renters never re-send measurements.
                  </div>
                </div>
              </div>

              {/* Row 2: Contact Information + Preferences & Account */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-white rounded-lg border border-[#EBE5DF] shadow-2xs overflow-hidden flex flex-col justify-between">
                  <div className="p-5 space-y-4">
                    <h3 className="font-serif font-bold text-stone-900 text-sm">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#6F675D] uppercase tracking-wider block">FULL NAME</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs focus:border-[#C7A55C] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#6F675D] uppercase tracking-wider block">EMAIL</label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="email@domain.com"
                          className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs focus:border-[#C7A55C] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#6F675D] uppercase tracking-wider block">PHONE (WHATSAPP)</label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="+91 98200 45871"
                          className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs focus:border-[#C7A55C] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#6F675D] uppercase tracking-wider block">CITY</label>
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          placeholder="Mumbai"
                          className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs focus:border-[#C7A55C] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#6F675D] uppercase tracking-wider block">GSTIN (OPTIONAL)</label>
                        <input
                          type="text"
                          value={editGstin}
                          onChange={(e) => setEditGstin(e.target.value)}
                          placeholder="For B2B invoicing"
                          className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs uppercase focus:border-[#C7A55C] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#6F675D] uppercase tracking-wider block">DATE OF BIRTH (OPTIONAL)</label>
                        <input
                          type="text"
                          value={editBirthDate}
                          onChange={(e) => setEditBirthDate(e.target.value)}
                          placeholder="dd/mm/yyyy"
                          className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs focus:border-[#C7A55C] outline-none"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] font-semibold text-[#6F675D] uppercase tracking-wider block">REFERRED BY</label>
                        <input
                          type="text"
                          value={editReferrer}
                          onChange={(e) => setEditReferrer(e.target.value)}
                          placeholder="Platform / Friend / Instagram..."
                          className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs focus:border-[#C7A55C] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-2.5 bg-[#FAF7F2] border-t border-[#EBE5DF] flex justify-end">
                    <button
                      onClick={handleSaveCustomer}
                      className="bg-[#C7A55C] hover:bg-[#B9974B] text-[#2A2118] font-semibold px-4 py-1.5 rounded-md text-xs transition cursor-pointer shadow-2xs"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Preferences & Account */}
                <div className="bg-white rounded-lg border border-[#EBE5DF] shadow-2xs overflow-hidden flex flex-col justify-between">
                  <div className="p-5 space-y-4">
                    <h3 className="font-serif font-bold text-stone-900 text-sm">
                      Preferences & Account
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#6F675D] uppercase tracking-wider block">PREFERRED SIZES</label>
                        <input
                          type="text"
                          value={editSize}
                          onChange={(e) => setEditSize(e.target.value)}
                          placeholder="e.g. S, M, 36"
                          className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs focus:border-[#C7A55C] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#6F675D] uppercase tracking-wider block">PREFERRED OCCASIONS</label>
                        <input
                          type="text"
                          value={editPreferredOccasions}
                          onChange={(e) => setEditPreferredOccasions(e.target.value)}
                          placeholder="e.g. Wedding, Sangeet"
                          className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs focus:border-[#C7A55C] outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="uppercase text-[10px] tracking-wider font-bold text-stone-400 block">
                        WHATSAPP UPDATES
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                        <span
                          onClick={() => setEditWhatsapp(!editWhatsapp)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${editWhatsapp ? 'bg-[#C7A55C]' : 'bg-stone-300'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editWhatsapp ? 'translate-x-4' : 'translate-x-0.5'}`} />
                        </span>
                        <span className="text-stone-600 font-medium text-xs">Bookings, dispatch, returns</span>
                      </label>
                    </div>

                    <div className="space-y-3">
                      <label className="uppercase text-[10px] tracking-wider font-bold text-stone-400 block">
                        EMAIL NOTIFICATIONS
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                        <span
                          onClick={() => setEditNewsletter(!editNewsletter)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${editNewsletter ? 'bg-[#C7A55C]' : 'bg-stone-300'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editNewsletter ? 'translate-x-4' : 'translate-x-0.5'}`} />
                        </span>
                        <span className="text-stone-600 font-medium text-xs">Orders, rentals, deposits</span>
                      </label>
                    </div>

                    <div className="space-y-3">
                      <label className="uppercase text-[10px] tracking-wider font-bold text-stone-400 block">
                        NEW ARRIVALS & OFFERS
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                        <span
                          onClick={() => setEditMarketingOptIn(!editMarketingOptIn)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${editMarketingOptIn ? 'bg-[#C7A55C]' : 'bg-stone-300'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editMarketingOptIn ? 'translate-x-4' : 'translate-x-0.5'}`} />
                        </span>
                        <span className="text-stone-600 font-medium text-xs">Curated picks, occasions</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block">ACCOUNT CREATED</label>
                        <input
                          type="text"
                          readOnly
                          value={isAddingCustomer ? 'Manual creation' : (editingCustomer?.joinedDate || '15 Mar 2026')}
                          className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs text-[#2A241F] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block">LAST LOGIN</label>
                        <input
                          type="text"
                          readOnly
                          value={isAddingCustomer ? '—' : '21 Jun 2026, 13:55'}
                          className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs text-[#2A241F] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-2.5 bg-[#FAF7F2] border-t border-[#EBE5DF] flex justify-end">
                    <button
                      onClick={handleSaveCustomer}
                      className="bg-[#C7A55C] hover:bg-[#B9974B] text-[#2A2118] font-semibold px-4 py-1.5 rounded-md text-xs transition cursor-pointer shadow-2xs"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: Saved Addresses + Occasions */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Saved Addresses */}
                <div className="bg-white rounded-lg border border-[#EBE5DF] shadow-2xs overflow-hidden flex flex-col justify-between">
                  <div className="p-5 space-y-3">
                    <h3 className="font-serif font-bold text-stone-900 text-sm">
                      Saved Addresses
                    </h3>

                    {/* Saved Addresses List */}
                    {addresses.length === 0 ? (
                      <p className="text-stone-400 text-xs py-2 border-b border-[#EBE5DF]">No saved addresses yet — add one below.</p>
                    ) : (
                      <div className="space-y-2 pt-1 border-b border-[#EBE5DF] pb-4">
                        {addresses.map((a, idx) => (
                          <div key={a.id || idx} className="flex items-center justify-between text-xs py-1">
                            <div className="flex items-center gap-3">
                              <span className="uppercase text-[10px] font-semibold tracking-wider text-[#8C847A] w-16 shrink-0">
                                {a.label}
                              </span>
                              <span className="text-[#2A241F] font-normal">{a.address}</span>
                            </div>
                            {(a.isDefault || idx === 0) && (
                              <span className="px-1.5 py-0.5 rounded border border-[#E2DAD1] text-[9px] uppercase tracking-wider text-[#8C847A] font-semibold shrink-0">
                                DEFAULT
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Address Form */}
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-[#8C847A] uppercase tracking-wider block">LABEL</label>
                          <input
                            type="text"
                            value={newAddressLabel}
                            onChange={(e) => setNewAddressLabel(e.target.value)}
                            placeholder="Home / Office / Venue..."
                            className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs focus:border-[#C7A55C] outline-none"
                          />
                        </div>
                        <button
                          onClick={handleAddAddress}
                          className="border border-[#E2DAD1] bg-white hover:bg-[#FAF8F5] text-[#2A2118] font-semibold px-4 py-2 rounded-md text-xs transition cursor-pointer shadow-2xs whitespace-nowrap"
                        >
                          + Add Address
                        </button>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-[#8C847A] uppercase tracking-wider block">ADDRESS</label>
                        <textarea
                          value={newAddressText}
                          onChange={(e) => setNewAddressText(e.target.value)}
                          rows={2}
                          placeholder="Full delivery address with pincode"
                          className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs focus:border-[#C7A55C] outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Occasions */}
                <div className="bg-white rounded-lg border border-[#EBE5DF] shadow-2xs overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="p-5 pb-3">
                      <h3 className="font-serif font-bold text-stone-900 text-sm">
                        Occasions
                      </h3>
                    </div>

                    {occasions.length === 0 ? (
                      <div className="p-5 py-6 text-center text-[#A0988E] text-xs font-normal border-y border-dashed border-[#EBE5DF]">
                        No occasions on file — add the date she's dressing for.
                      </div>
                    ) : (
                      <div className="p-5 space-y-2 border-y border-[#EBE5DF]">
                        {occasions.map((o, idx) => (
                          <div key={o.id || idx} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-0">
                            <span className="text-[#2A241F] font-semibold">{o.occasion}</span>
                            <span className="text-[#8C847A] font-normal">{o.date || '—'}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="p-5 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-[#8C847A] uppercase tracking-wider block">OCCASION</label>
                          <input
                            type="text"
                            value={newOccasionName}
                            onChange={(e) => setNewOccasionName(e.target.value)}
                            placeholder="Sister's wedding, Sangeet..."
                            className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs focus:border-[#C7A55C] outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-[#8C847A] uppercase tracking-wider block">DATE</label>
                          <input
                            type="text"
                            value={newOccasionDate}
                            onChange={(e) => setNewOccasionDate(e.target.value)}
                            placeholder="dd/mm/yyyy"
                            className="w-full p-2 bg-[#FCF9F5] border border-[#E5DDD3] rounded-md text-xs focus:border-[#C7A55C] outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={handleAddOccasion}
                          className="border border-[#E2DAD1] bg-white hover:bg-[#FAF8F5] text-[#2A2118] font-semibold px-4 py-1.5 rounded-md text-xs transition cursor-pointer shadow-2xs"
                        >
                          + Add Occasion
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-2.5 bg-[#FAF7F2] text-[11px] text-[#8C847A] border-t border-[#EBE5DF]">
                    The dates she's dressing for — the anchor for proactive, celebration-led follow-ups.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================ END PROFILE TAB ============================ */}

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
                          <span className={`px-2 py-1 rounded text-[10px] ${o.mode === 'Rental' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                            {o.mode}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold text-stone-900">
                          ₹{o.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-4 text-stone-500">
                          {o.mode === 'Rental' && (o as any).rentalStartDate && (o as any).rentalEndDate 
                            ? `${(o as any).rentalStartDate} to ${(o as any).rentalEndDate}` 
                            : (o as any).date || (o as any).createdAt?.split('T')[0] || '—'}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] ${o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
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
                Wishlist — {editingCustomer?.name || 'New Customer'} ({editingCustomer?.wishlistCount || 0} item{(editingCustomer?.wishlistCount || 0) === 1 ? '' : 's'})
              </h3>
            </div>

            <div className="p-5">
              {(!editingCustomer?.wishlist || editingCustomer.wishlist.length === 0) ? (
                <p className="text-stone-400 text-center py-6">No saved items yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {products.filter(p => editingCustomer.wishlist?.includes(p.productId || p.id || '')).map(p => (
                    <div
                      key={p.id}
                      className="border border-stone-200 rounded-lg overflow-hidden bg-white hover:shadow-sm transition"
                    >
                      <img
                        src={p.images?.[0] || ''}
                        alt={p.name}
                        className="h-40 w-full object-cover"
                      />
                      <div className="p-3 space-y-0.5">
                        <div className="font-semibold text-stone-900 text-xs truncate">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {p.designer} · {p.condition || 'Preloved'}
                        </div>
                        <div className="text-sm font-bold text-stone-900 pt-1">
                          ₹{(p.rentalPrice || 0).toLocaleString('en-IN')}
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
                  Cart — {editingCustomer?.name || 'New Customer'} (0 items)
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
                    {custOrders.filter(o => o.mode === 'Rental' || o.items?.some(i => i.mode === 'Rental')).map(o => {
                      const firstRentalItem = o.items?.find(i => i.mode === 'Rental') || o.items?.[0] || o as any;
                      const startDate = firstRentalItem.rentalStartDate || o.rentalStartDate;
                      const endDate = firstRentalItem.rentalEndDate || o.rentalEndDate || firstRentalItem.returnDueDate;
                      let daysDiff = '—';
                      if (endDate) {
                        const parsedEnd = new Date(endDate);
                        if (!isNaN(parsedEnd.getTime())) {
                          const diff = Math.ceil((parsedEnd.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                          if (diff > 0) daysDiff = `${diff} days left`;
                          else if (diff === 0) daysDiff = 'Due today';
                          else daysDiff = `${Math.abs(diff)} days overdue`;
                        }
                      }
                      
                      return (
                        <tr key={o.id} className="hover:bg-[#fcf9f5] transition-colors">
                          <td className="px-5 py-4 font-mono text-[11px] text-stone-500">
                            {o.id}
                          </td>
                          <td className="px-5 py-4 font-semibold text-stone-900">
                            {firstRentalItem.productName || o.productName}
                          </td>
                          <td className="px-5 py-4 text-stone-500">
                            {startDate && endDate ? `${startDate} to ${endDate}` : (startDate || endDate || (o as any).date || '—')}
                          </td>
                          <td className="px-5 py-4 text-stone-500">
                            {endDate || '—'}
                          </td>
                          <td className="px-5 py-4 text-stone-500">
                            {['Returned', 'Complete', 'Processed'].includes(o.status) ? 'Returned' : daysDiff}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] ${['Dispatched', 'Shipped', 'Delivered'].includes(o.status) ? 'bg-blue-100 text-blue-700' : ['Returned', 'Complete', 'Processed'].includes(o.status) ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
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
                  <span>
                    Held ₹{custOrders.filter(o => o.mode === 'Rental' && (o.depositStatus === 'Held' || ['Dispatched', 'Shipped', 'Delivered', 'Return Sent'].includes(o.status))).reduce((sum, o) => sum + (o.deposit || 0), 0).toLocaleString('en-IN')} 
                    {' · '} 
                    To collect ₹{custOrders.filter(o => o.mode === 'Rental' && o.status === 'Confirmed' && o.depositStatus !== 'Held').reduce((sum, o) => sum + (o.deposit || 0), 0).toLocaleString('en-IN')}
                  </span>
                  <button 
                    onClick={() => setView('returns')}
                    className="border border-stone-300 px-3 py-1.5 rounded-md font-medium hover:bg-stone-50 whitespace-nowrap">
                    Open Deposit Ledger →
                  </button>
                </div>
              </div>

              {custOrders.filter(o => o.mode === 'Rental' && (o.deposit || 0) > 0).length === 0 ? (
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
                      {custOrders.filter(o => o.mode === 'Rental' && (o.deposit || 0) > 0).map(o => {
                        const isHeld = o.depositStatus === 'Held' || ['Dispatched', 'Shipped', 'Delivered', 'Return Sent'].includes(o.status);
                        const isPending = o.status === 'Confirmed' && o.depositStatus !== 'Held';
                        const isPhysicalReturnComplete = ['Returned', 'Complete', 'Processed'].includes(o.status);
                        
                        let depositStatus = 'Pending Collection';
                        if (isPhysicalReturnComplete) depositStatus = o.depositDecision?.status || 'Released';
                        else if (isHeld) depositStatus = 'Held';

                        const isDepositPendingRefund = isPhysicalReturnComplete && depositStatus === 'Pending';
                        const isDepositDeducted = isPhysicalReturnComplete && (depositStatus === 'Partial' || depositStatus === 'Forfeited');
                        const isDepositFullyReleased = isPhysicalReturnComplete && depositStatus === 'Released';

                        let badgeColor = 'bg-stone-200 text-stone-600';
                        if (isHeld) badgeColor = 'bg-blue-100 text-blue-700';
                        else if (isDepositPendingRefund) badgeColor = 'bg-amber-100 text-amber-700';
                        else if (isDepositDeducted) badgeColor = 'bg-rose-100 text-rose-700';
                        else if (isDepositFullyReleased) badgeColor = 'bg-green-100 text-green-700';

                        let displayStatus = depositStatus;
                        if (isDepositPendingRefund && o.depositDecision?.issueSource === 'Customer') displayStatus = 'Customer Request';
                        else if (isDepositPendingRefund && o.depositDecision?.issueStatus === 'Reported') displayStatus = 'Issue Reported';
                        else if (isDepositPendingRefund) displayStatus = 'Refund Pending';

                        return (
                          <tr key={o.id} className="hover:bg-[#fcf9f5] transition-colors">
                            <td className="px-5 py-4 font-mono text-[11px] text-[#c5a880]">
                              {o.id}
                            </td>
                            <td className="px-5 py-4 font-semibold text-stone-900">
                              {o.productName}
                            </td>
                            <td className="px-5 py-4 font-semibold text-stone-900">
                              ₹{(o.deposit || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-medium tracking-wide ${badgeColor}`}>
                                {displayStatus}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-stone-500">
                              {isPending ? (
                                <>
                                  Collect by {o.rentalStartDate || 'dispatch'} · <span className="text-[#b45309] font-medium">pending</span>
                                  <div className="text-[11px] text-stone-400">before dispatch</div>
                                </>
                              ) : isHeld ? (
                                <>
                                  Held securely
                                  <div className="text-[11px] text-stone-400">
                                    {o.status === 'Confirmed' ? 'awaiting dispatch' : 'awaiting return'}
                                  </div>
                                </>
                              ) : isDepositPendingRefund ? (
                                <>
                                  <span className="text-amber-600 font-medium">
                                    {o.depositDecision?.issueSource === 'Customer' ? 'Customer Dispute/Request' : o.depositDecision?.issueStatus === 'Reported' ? 'Admin Reviewing Damage' : 'Awaiting Release'}
                                  </span>
                                  <div className="text-[11px] text-stone-400">action required</div>
                                </>
                              ) : isDepositDeducted ? (
                                <>
                                  Resolved
                                  <div className="text-[11px] text-rose-500 font-medium">₹{o.depositDecision?.deductedAmount?.toLocaleString('en-IN')} deducted</div>
                                </>
                              ) : (
                                <>
                                  Resolved
                                  <div className="text-[11px] text-green-600 font-medium">full deposit released</div>
                                </>
                              )}
                            </td>
                            <td className="px-5 py-4 text-right flex justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setSelectedOrderId(o.id);
                                  setView(`order_detail:${o.id}`);
                                }}
                                className="px-3 py-1.5 bg-white border border-stone-200 hover:border-[#c5a880] text-stone-700 hover:bg-stone-50 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                              >
                                View Order
                              </button>
                              {isPending && (
                                <button 
                                  onClick={() => {
                                    setSelectedOrderId(o.id);
                                    setView('returns');
                                  }}
                                  className="text-[#c5a880] hover:text-[#b49870] font-medium transition flex items-center gap-1 cursor-pointer"
                                >
                                  Collect
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
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
                Offers & Enquiries — {editingCustomer?.name || 'New Customer'} ({customerOffers.length})
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
                    <th className="px-5 py-3">Coupon</th>
                    <th className="px-5 py-3">Counter</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-600">
                  {offersLoading ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-6 text-center text-stone-400">Loading offers...</td>
                    </tr>
                  ) : customerOffers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-6 text-center text-stone-400">No offers or enquiries found for this customer.</td>
                    </tr>
                  ) : (
                    customerOffers.map(offer => {
                      const linkedOrder = getCustomerOrders(editingCustomer!).find((order: any) =>
                        String(order.orderId || order.id || '') === String((offer as any).linkedOrderId || '') ||
                        String((order as any).offerId || '') === String(offer.id || '')
                      );
                      const coupon = (linkedOrder as any)?.promoCode || '';
                      const couponDiscount = Number((linkedOrder as any)?.promoDiscount || (linkedOrder as any)?.discount || 0);
                      return (
                      <tr key={offer.id} onClick={() => setView('offers')} className="hover:bg-[#fcf9f5] transition-colors cursor-pointer">
                        <td className="px-5 py-4 font-mono text-[11px] text-stone-500">
                          {offer.id}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-stone-900">{offer.productName}</div>
                          {/* <div className="text-[11px] text-stone-400">Designer if available</div> */}
                        </td>
                        <td className="px-5 py-4 font-semibold text-stone-900">
                          ₹{offer.marketPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#c5a880]">
                          ₹{offer.offerPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-4 text-stone-600">
                          {coupon ? <><span className="font-semibold text-emerald-700">{coupon}</span>{couponDiscount > 0 && <span className="block text-[10px] text-stone-400">₹{couponDiscount.toLocaleString('en-IN')}</span>}</> : '—'}
                        </td>
                        <td className="px-5 py-4 text-stone-400">
                          ₹{Math.max(0, Number(offer.counterPrice || 0)).toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] ${offer.status === 'Accepted' ? 'bg-green-100 text-green-700' : offer.status === 'Declined' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {offer.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-stone-500">
                          {new Date(offer.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    )})
                  )}
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
                onChange={(e) => setNewCommChannel(e.target.value as typeof newCommChannel)}
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
                      {isAddingCustomer ? 'Manual creation' : (editingCustomer?.joinedDate || '—')}
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
                      {isAddingCustomer ? 'Manual creation' : (editingCustomer?.joinedDate || '—')} · via Signup form
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

        <h2 className="text-2xl font-serif text-stone-700">
          Customers
        </h2>

        <p className="text-xs text-stone-500 max-w-xl leading-5">
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

        <div className="flex gap-3 items-center">
          <button
            onClick={() => {
              const toastId = toast.loading('Refreshing customers...');
              customerApi.getCustomers().then(res => {
                if (Array.isArray(res)) {
                  res.forEach(c => onUpdateCustomer(c));
                  toast.success('List refreshed successfully!', { id: toastId });
                }
              }).catch(() => toast.error('Failed to refresh data', { id: toastId }));
            }}
            className="border border-stone-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-50 transition cursor-pointer"
          >
            Refresh
          </button>
          <button
            onClick={startAdding}
            className="bg-[#C7A55C] hover:bg-[#B9974B] text-[#2A2118] font-semibold px-4 py-2 rounded-md text-xs transition cursor-pointer shadow-2xs">
            + Add Customer
          </button>
          <button
            className="border border-stone-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-50 cursor-pointer"
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
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600 font-sans">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-stone-400">
                    No customers found. Click "+ Add Customer" to create a record.
                  </td>
                </tr>
              ) : (
                filteredCustomers.slice((currentPage - 1) * 10, currentPage * 10).map(c => (
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
                  <td className="px-5 py-4">{c.location}</td>
                  {/* Modes */}
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <span className="bg-green-100 text-green-700 px-2 rounded text-[10px]">R</span>
                      <span className="bg-orange-100 text-orange-700 px-2 rounded text-[10px]">P</span>
                    </div>
                  </td>
                  {/* Orders */}
                  {(() => {
                    const cOrders = getCustomerOrders(c);
                    const dispCount = cOrders.length;
                    const orderSum = cOrders.reduce((sum, o) => sum + Number(o.amount || (o as any).orderValue || (o as any).grandTotal || 0), 0);
                    const dispSpent = orderSum;
                    return (
                      <>
                        <td className="px-5 py-4 font-medium">
                          <span className="inline-flex items-center justify-center font-bold px-2.5 py-0.5 rounded-full text-xs bg-stone-100 text-stone-900 border border-stone-200">
                            {dispCount}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-stone-900">
                          ₹{dispSpent.toLocaleString("en-IN")}
                        </td>
                      </>
                    );
                  })()}
                  {/* Last Order */}
                  <td className="px-5 py-4">{c.lastOrderDate}</td>
                  {/* Joined */}
                  <td className="px-5 py-4">{c.joinedDate}</td>
                  {/* Source */}
                  <td className="px-5 py-4 text-stone-500">{c.source || '—'}</td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs">{c.status}</span>
                  </td>
                  {/* Actions: View + Delete */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEditing(c)}
                        className="inline-flex items-center gap-1.5 border border-stone-300 rounded-md px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 whitespace-nowrap cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                      <button
                        onClick={() => openDeleteModal(c)}
                        className="inline-flex items-center gap-1.5 border border-rose-200 rounded-md px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 whitespace-nowrap cursor-pointer"
                        title={`Delete ${c.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {filteredCustomers.length > 10 && (
        <div className="flex items-center justify-between bg-white px-4 py-4 border border-stone-200/80 sm:px-6 rounded-lg mt-4 shadow-sm">
          <div className="flex flex-1 items-center justify-between">
            <div>
              <p className="text-xs text-stone-500 font-sans">
                Showing <span className="font-semibold text-stone-800">{((currentPage - 1) * 10) + 1}</span> to <span className="font-semibold text-stone-800">{Math.min(currentPage * 10, filteredCustomers.length)}</span> of <span className="font-semibold text-stone-800">{filteredCustomers.length}</span> results
              </p>
            </div>
            <div>
              <nav className="inline-flex rounded-md gap-2" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded px-3 py-1.5 text-[#c5a880] border border-stone-200 bg-white hover:bg-[#fcf9f5] hover:border-[#c5a880] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition shadow-xs"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs font-semibold ml-1">Prev</span>
                </button>
                <div className="relative inline-flex items-center px-4 py-1.5 text-xs font-bold text-[#3d2d14] bg-[#fcf9f5] border border-stone-200 rounded shadow-inner">
                  Page {currentPage} of {Math.ceil(filteredCustomers.length / 10)}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(Math.ceil(filteredCustomers.length / 10), currentPage + 1))}
                  disabled={currentPage >= Math.ceil(filteredCustomers.length / 10)}
                  className="relative inline-flex items-center rounded px-3 py-1.5 text-[#c5a880] border border-stone-200 bg-white hover:bg-[#fcf9f5] hover:border-[#c5a880] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition shadow-xs"
                >
                  <span className="text-xs font-semibold mr-1">Next</span>
                  <ChevronLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-stone-100">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50">
                  <Trash2 className="h-5 w-5 text-rose-600" />
                </span>
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    Delete customer?
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    This will permanently remove <span className="font-semibold text-stone-700">{deleteTarget.name}</span> from the database.
                  </p>
                </div>
              </div>
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="text-stone-400 hover:text-stone-600 transition cursor-pointer disabled:opacity-40"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex gap-3">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Deleting a customer is permanent and cannot be undone. Their order history,
                  addresses, occasions and profile data will be removed from the system.
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={deleteConfirmed}
                  onChange={(e) => setDeleteConfirmed(e.target.checked)}
                  disabled={deleting}
                  className="mt-0.5 h-4 w-4 rounded border-stone-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-xs text-stone-600 leading-relaxed">
                  I understand this permanently deletes this customer's record and cannot be undone.
                </span>
              </label>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 bg-stone-50 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="border border-stone-300 bg-white px-4 py-2 rounded-md text-xs font-medium text-stone-700 hover:bg-stone-100 transition disabled:opacity-40 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={!deleteConfirmed || deleting}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-md text-xs font-semibold text-white transition cursor-pointer"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Customer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
