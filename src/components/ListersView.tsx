import React, { useState } from 'react';
import { Search, Check, X, ShieldAlert, Eye, Save, Landmark, HelpCircle, CheckCircle, Clock } from 'lucide-react';
import { Lister, ListerSubmission, Product } from '../types';

interface ListersViewProps {
  listers: Lister[];
  submissions: ListerSubmission[];
  onUpdateLister: (updated: Lister) => void;
  onUpdateSubmission: (updated: ListerSubmission) => void;
  onCreateLister: (lister: Lister) => Promise<void>;
  products: Product[];
  onUpdateProduct: (product: Product) => Promise<void>;
}

export default function ListersView({ 
  listers, 
  submissions, 
  onUpdateLister, 
  onUpdateSubmission,
  onCreateLister,
  products,
  onUpdateProduct
}: ListersViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'Database' | 'Submissions'>('Database');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingLister, setEditingLister] = useState<Lister | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Editable Lister Fields
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editReferrer, setEditReferrer] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Pending Review' | 'Suspended'>('Active');
  const [editBankHolder, setEditBankHolder] = useState('');
  const [editBankNum, setEditBankNum] = useState('');
  const [editBankIfsc, setEditBankIfsc] = useState('');
  const [editBankName, setEditBankName] = useState('');
  const [editVerified, setEditVerified] = useState(false);
  const [editNotes, setEditNotes] = useState('');

  const startEditing = (l: Lister) => {
    setEditingLister(l);
    setEditName(l.name);
    setEditEmail(l.email);
    setEditPhone(l.phone);
    setEditLocation(l.location);
    setEditInstagram(l.instagram || '');
    setEditReferrer(l.referrer || '');
    setEditStatus(l.status);
    setEditBankHolder(l.bankDetails?.accountHolder || '');
    setEditBankNum(l.bankDetails?.accountNumber || '');
    setEditBankIfsc(l.bankDetails?.ifsc || '');
    setEditBankName(l.bankDetails?.bankName || '');
    setEditVerified(l.verified || false);
    setEditNotes(l.internalNotes || '');
  };
  const startAdding = () => {
    setIsAdding(true);
    setEditingLister({ id: `new-${Date.now()}`, name: '', email: '', phone: '', location: '', listingsCount: 0, totalEarned: 0, pendingPayout: 0, status: 'Active', joinedDate: new Date().toISOString().slice(0, 10), verified: false, bankDetails: { accountHolder: '', accountNumber: '', ifsc: '', bankName: '' } });
    setEditName(''); setEditEmail(''); setEditPhone(''); setEditLocation(''); setEditInstagram(''); setEditReferrer(''); setEditStatus('Active'); setEditBankHolder(''); setEditBankNum(''); setEditBankIfsc(''); setEditBankName(''); setEditVerified(false); setEditNotes('');
  };

  const handleSaveLister = async () => {
    if (!editingLister) return;
    const updated: Lister = {
      ...editingLister,
      name: editName,
      email: editEmail,
      phone: editPhone,
      location: editLocation,
      instagram: editInstagram,
      referrer: editReferrer,
      status: editStatus,
      bankDetails: {
        accountHolder: editBankHolder,
        accountNumber: editBankNum,
        ifsc: editBankIfsc.toUpperCase(),
        bankName: editBankName
      },
      verified: editVerified,
      internalNotes: editNotes
    };
    if (isAdding) await onCreateLister(updated); else onUpdateLister(updated);
    setEditingLister(null);
    setIsAdding(false);
    alert(isAdding ? "Lister created successfully!" : "Lister profile updated successfully!");
  };

  const handleApproveSubmission = (sub: ListerSubmission) => {
    const updatedSub: ListerSubmission = {
      ...sub,
      status: 'Approved'
    };
    onUpdateSubmission(updatedSub);
    alert(`Submission ID ${sub.id} Approved! A draft product has been generated based on this item.`);
  };

  const handleRejectSubmission = (sub: ListerSubmission) => {
    const updatedSub: ListerSubmission = {
      ...sub,
      status: 'Rejected'
    };
    onUpdateSubmission(updatedSub);
    alert(`Submission ID ${sub.id} marked as Rejected.`);
  };

  const filteredListers = listers.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubmissions = products.filter(p => {
    const text = `${p.name} ${p.listerName || ''} ${p.category}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  }).map(p => ({ id: p.id, productName: p.name, category: p.category, listerName: p.listerName || 'Unassigned', submittedDate: (p as any).createdAt || '—', retailPrice: p.listingPrice, originalYear: '—', condition: p.condition, description: p.description, status: p.status === 'Review' ? 'Pending' : p.status === 'Live' ? 'Approved' : 'Rejected', listerId: p.listerId, sourceProduct: p })) as any[];

  if (editingLister) {
    return (
      <div className="space-y-6 text-xs font-sans">
        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setEditingLister(null)}
              className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded text-stone-600 font-semibold cursor-pointer"
            >
              ← Back to listers
            </button>
            <h2 className="text-xl font-serif text-stone-900 font-bold ml-2">Edit Lister Profile: {editName}</h2>
          </div>
          <button
            onClick={handleSaveLister}
            className="px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white text-xs font-semibold rounded cursor-pointer"
          >
            Save Lister
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Core Lister Details */}
            <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-stone-900 text-sm">Personal details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Lister Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Instagram Handle</label>
                  <input
                    type="text"
                    value={editInstagram}
                    onChange={(e) => setEditInstagram(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Referrer Code / Channel</label>
                  <input
                    type="text"
                    value={editReferrer}
                    onChange={(e) => setEditReferrer(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bank details */}
            <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <Landmark className="h-4 w-4 text-stone-600" />
                <h3 className="font-serif font-bold text-stone-900 text-sm">Banking & Payout Credentials</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Account Holder Name</label>
                  <input
                    type="text"
                    value={editBankHolder}
                    onChange={(e) => setEditBankHolder(e.target.value)}
                    placeholder="Same as legal name"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Bank Name</label>
                  <input
                    type="text"
                    value={editBankName}
                    onChange={(e) => setEditBankName(e.target.value)}
                    placeholder="HDFC, ICICI..."
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Account Number</label>
                  <input
                    type="text"
                    value={editBankNum}
                    onChange={(e) => setEditBankNum(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">IFSC Code</label>
                  <input
                    type="text"
                    value={editBankIfsc}
                    onChange={(e) => setEditBankIfsc(e.target.value)}
                    placeholder="HDFC0001234"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column sidebar details */}
          <div className="space-y-6 font-sans">
            <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-stone-900 text-sm">Trust & Security</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 font-medium text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editVerified}
                    onChange={(e) => setEditVerified(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-[#c5a880] focus:ring-[#c5a880]"
                  />
                  <span>Bank details Verified</span>
                </label>

                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Lister Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-3">
              <h3 className="font-serif font-bold text-stone-900 text-sm">Internal Staff Notes</h3>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="KYC verified via passport/aadhaar, regular lister, high quality lehengas..."
                rows={5}
                className="w-full p-2.5 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs font-sans">
      <div className="flex justify-between items-center border-b border-stone-100 pb-3">
        <div>
          <h2 className="text-2xl font-serif text-stone-900 font-medium">Listers & Consignments</h2>
          <p className="text-xs text-stone-500 mt-1">
            Browse registered private listers consigning wardrobes, and approve/reject their submitted pieces.
          </p>
        </div>
        <button onClick={startAdding} className="px-4 py-2 bg-[#c6a05c] text-[#332817] rounded text-xs font-bold hover:bg-[#b58d49]">+ Add Lister</button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-1 select-none font-semibold overflow-x-auto whitespace-nowrap scrollbar-none pb-px">
        <button
          onClick={() => setActiveSubTab('Database')}
          className={`px-4 py-2 border-b-2 text-xs transition cursor-pointer ${
            activeSubTab === 'Database' ? 'border-[#c5a880] text-stone-900 font-bold' : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Lister Directory ({listers.length})
        </button>
        <button
          onClick={() => setActiveSubTab('Submissions')}
          className={`px-4 py-2 border-b-2 text-xs transition cursor-pointer ${
            activeSubTab === 'Submissions' ? 'border-[#c5a880] text-stone-900 font-bold' : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Incoming Submissions ({products.filter(p => p.status === 'Review').length} Pending)
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
        <input
          type="text"
          placeholder={activeSubTab === 'Database' ? "Search by name, city, email..." : "Search product submissions..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
        />
      </div>

      {activeSubTab === 'Database' ? (
        <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-400 font-sans uppercase font-bold text-[10px] border-b border-stone-150 tracking-wider">
                  <th className="px-5 py-3.5">Lister Details</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Listings</th>
                  <th className="px-5 py-3.5">Total Earned</th>
                  <th className="px-5 py-3.5">Pending Payout</th>
                  <th className="px-5 py-3.5">KYC Verified</th>
                  <th className="px-5 py-3.5">Joined</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-600">
                {filteredListers.map(l => (
                  <tr key={l.id} className="hover:bg-[#fcf9f5] transition">
                    <td className="px-5 py-4">
                      <div className="font-bold text-stone-850">{l.name}</div>
                      <span className="text-[10px] text-stone-400 font-mono">{l.email}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-700">{l.location}</td>
                    <td className="px-5 py-4 font-bold text-[#c5a880]"><div>{products.filter(p => p.listerId === l.id).length || l.listingsCount} Items</div><div className="mt-1 max-w-[220px] whitespace-normal text-[10px] font-normal text-stone-500">{products.filter(p => p.listerId === l.id).map(p => p.name).join(', ') || 'No assigned products'}</div></td>
                    <td className="px-5 py-4 font-semibold text-stone-900">₹{Number((l as any).totalEarnings ?? (l as any).totalEarned ?? 0).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 font-bold text-amber-700">₹{Number(l.pendingPayout ?? 0).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        l.verified ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-stone-100 text-stone-500 border border-stone-200'
                      }`}>
                        {l.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-stone-400">{l.joinedDate}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                        l.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : l.status === 'Suspended' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => startEditing(l)}
                        className="px-2.5 py-1.5 border border-stone-200 hover:border-[#c5a880] text-stone-600 hover:text-stone-950 rounded bg-white hover:bg-[#fcf9f5] transition cursor-pointer font-bold flex items-center gap-1 text-[11px] ml-auto"
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
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white p-8 text-center text-stone-400 border border-stone-200 rounded-lg">
              No product submissions matching filter.
            </div>
          ) : (
            filteredSubmissions.map(s => (
              <div key={s.id} className="bg-white rounded-lg border border-stone-200/80 p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="font-serif font-bold text-stone-900 text-sm">
                      {s.productName} <span className="font-sans text-xs text-stone-400">({s.category})</span>
                    </h3>
                    <p className="text-[10px] text-stone-500">
                      Submitted by: <span className="font-bold text-stone-850">{s.listerName}</span> — date: {s.submittedDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                      s.status === 'Pending' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                        : s.status === 'Approved' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-stone-600 font-sans leading-relaxed">
                  <div className="space-y-1">
                    <p>Estimated Retail Value: <span className="font-bold text-stone-850">₹{s.retailPrice.toLocaleString('en-IN')}</span></p>
                    <p>Year of Original Purchase: <span className="font-bold text-stone-850">{s.originalYear}</span></p>
                  </div>
                  <div className="space-y-1">
                    <p>Garment Condition: <span className="font-bold text-amber-700">{s.condition}</span></p>
                  </div>
                  <div className="md:col-span-3 space-y-1 bg-stone-50 p-2.5 rounded border border-stone-100/50">
                    <p className="font-semibold text-stone-800">Lister description notes:</p>
                    <p className="text-stone-500">{s.description}</p>
                  </div>
                </div>

                {s.status === 'Pending' && (
                  <div className="flex justify-end gap-2 border-t border-stone-100 pt-3">
                    <button
                      onClick={() => onUpdateProduct({ ...s.sourceProduct, status: 'Archived' }).then(() => alert('Product rejected and archived.')).catch((error) => alert(error instanceof Error ? error.message : 'Unable to reject product'))}
                      className="px-3 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-700 rounded text-xs font-semibold cursor-pointer transition flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      <span>Reject Submission</span>
                    </button>
                    <button
                      onClick={() => onUpdateProduct({ ...s.sourceProduct, status: 'Live' }).then(() => alert('Product approved and published.')).catch((error) => alert(error instanceof Error ? error.message : 'Unable to approve product'))}
                      className="px-3 py-1.5 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded text-xs font-semibold cursor-pointer transition flex items-center gap-1"
                    >
                      <Check className="h-4 w-4" />
                      <span>Approve & Create Draft Listing</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
