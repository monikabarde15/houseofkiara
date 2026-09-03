import React, { useState } from 'react';
import { Search, Plus, Award, Save, ExternalLink, Percent, Globe, MessageSquare } from 'lucide-react';
import { Designer } from '../types';
import * as designerApi from '../services/designerApi';
import toast from 'react-hot-toast';

interface DesignersViewProps {
  designers: Designer[];
  onAddDesigner: (newDesigner: Designer) => void;
  onUpdateDesigner: (updatedDesigner: Designer) => void;
}

export default function DesignersView({ designers, onAddDesigner, onUpdateDesigner }: DesignersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDesigner, setEditingDesigner] = useState<Designer | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Editable fields
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editFounded, setEditFounded] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editManager, setEditManager] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCommission, setEditCommission] = useState('');
  const [editPayout, setEditPayout] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);
  const [editStatus, setEditStatus] = useState<'Active' | 'Suspended'>('Active');

  const startEditing = (d: Designer) => {
    setEditingDesigner(d);
    setIsAdding(false);
    setEditName(d.name);
    setEditBio(d.bio || '');
    setEditFounded(d.foundedYear || '');
    setEditWebsite(d.website || '');
    setEditInstagram(d.instagram || '');
    setEditLocation(d.location || '');
    setEditManager(d.accountManager || '');
    setEditEmail(d.contactEmail || '');
    setEditPhone(d.contactPhone || '');
    setEditCommission(d.commissionOverride || '');
    setEditPayout(d.payoutTerms || '');
    setEditFeatured(d.featured);
    setEditStatus(d.status);
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditingDesigner(null);
    setEditName('');
    setEditBio('');
    setEditFounded('');
    setEditWebsite('');
    setEditInstagram('');
    setEditLocation('');
    setEditManager('');
    setEditEmail('');
    setEditPhone('');
    setEditCommission('');
    setEditPayout('');
    setEditFeatured(false);
    setEditStatus('Active');
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error("Designer name is required.");
      return;
    }

    try {
      if (isAdding) {
        const newD: Designer = {
          id: "DSGN-" + Math.floor(100 + Math.random() * 900),
          name: editName,
          slug: editName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          activeListings: 0,
          featured: editFeatured,
          status: editStatus,
          bio: editBio,
          foundedYear: editFounded,
          website: editWebsite,
          instagram: editInstagram,
          location: editLocation,
          accountManager: editManager,
          contactEmail: editEmail,
          contactPhone: editPhone,
          commissionOverride: editCommission,
          payoutTerms: editPayout
        };
        await designerApi.createDesigner(newD as any);
        onAddDesigner(newD);
        setIsAdding(false);
        toast.success("Designer added successfully to database!");
      } else if (editingDesigner) {
        const updated: Designer = {
          ...editingDesigner,
          name: editName,
          bio: editBio,
          foundedYear: editFounded,
          website: editWebsite,
          instagram: editInstagram,
          location: editLocation,
          accountManager: editManager,
          contactEmail: editEmail,
          contactPhone: editPhone,
          commissionOverride: editCommission,
          payoutTerms: editPayout,
          featured: editFeatured,
          status: editStatus
        };
        await designerApi.updateDesigner(updated.id, updated as any);
        onUpdateDesigner(updated);
        setEditingDesigner(null);
        toast.success("Designer profile updated in database!");
      }
    } catch (err) {
      console.error("Failed to save designer via API:", err);
      if (isAdding) {
        onAddDesigner({
          id: "DSGN-" + Math.floor(100 + Math.random() * 900),
          name: editName,
          slug: editName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          activeListings: 0,
          featured: editFeatured,
          status: editStatus,
          bio: editBio,
          foundedYear: editFounded,
          website: editWebsite,
          instagram: editInstagram,
          location: editLocation,
          accountManager: editManager,
          contactEmail: editEmail,
          contactPhone: editPhone,
          commissionOverride: editCommission,
          payoutTerms: editPayout
        });
        setIsAdding(false);
      } else if (editingDesigner) {
        onUpdateDesigner({
          ...editingDesigner,
          name: editName,
          bio: editBio,
          foundedYear: editFounded,
          website: editWebsite,
          instagram: editInstagram,
          location: editLocation,
          accountManager: editManager,
          contactEmail: editEmail,
          contactPhone: editPhone,
          commissionOverride: editCommission,
          payoutTerms: editPayout,
          featured: editFeatured,
          status: editStatus
        });
        setEditingDesigner(null);
      }
    }
  };

  const filteredDesigners = designers.filter(d => 
    (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.location && (d.location || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (editingDesigner || isAdding) {
    return (
      <div className="space-y-6 text-xs font-sans">
        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setEditingDesigner(null); setIsAdding(false); }}
              className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded text-stone-600 font-semibold cursor-pointer"
            >
              ← Back to designers
            </button>
            <h2 className="text-xl font-serif text-stone-900 font-bold ml-2">
              {isAdding ? "Add New Designer Label" : `Edit: ${editName}`}
            </h2>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Designer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Core details */}
            <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-stone-900 text-sm">Brand Profile details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Designer Label Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Founded Year</label>
                  <input
                    type="text"
                    value={editFounded}
                    onChange={(e) => setEditFounded(e.target.value)}
                    placeholder="E.g., 1999"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-stone-500 font-medium">Brand Bio & Philosophy</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={4}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Location Headquarters</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="E.g., Kolkata, India"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Website URL</label>
                  <input
                    type="text"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    placeholder="https://"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Instagram Handle</label>
                  <input
                    type="text"
                    value={editInstagram}
                    onChange={(e) => setEditInstagram(e.target.value)}
                    placeholder="@sabyasachiofficial"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>
            </div>

            {/* Commercial terms */}
            <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-stone-900 text-sm">Commercial Contracts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Commission Override % (Blank for standard 25%)</label>
                  <input
                    type="text"
                    value={editCommission}
                    onChange={(e) => setEditCommission(e.target.value)}
                    placeholder="E.g., 30"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Payout Terms Schedule</label>
                  <input
                    type="text"
                    value={editPayout}
                    onChange={(e) => setEditPayout(e.target.value)}
                    placeholder="E.g., 30 days post rental"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Account Status / Featuring */}
            <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-stone-900 text-sm">Curation settings</h3>
              <div className="space-y-3 font-sans">
                <label className="flex items-center gap-2 font-medium text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editFeatured}
                    onChange={(e) => setEditFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-[#c5a880] focus:ring-[#c5a880]"
                  />
                  <span>Feature Label on Homepage</span>
                </label>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Label Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Manager / Relations */}
            <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-stone-900 text-sm">HOK Relations Manager</h3>
              <div className="space-y-3 font-sans">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Relations Manager Name</label>
                  <input
                    type="text"
                    value={editManager}
                    onChange={(e) => setEditManager(e.target.value)}
                    placeholder="Siddharth Sen"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Contact Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="partners@brand.com"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Contact Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-stone-900 font-medium">Designers & Couture Labels</h2>
          <p className="text-xs text-stone-500 mt-1">
            Manage custom designers partnership terms, active listings quotas, and commercial commission agreements.
          </p>
        </div>
        <button
          onClick={startAdding}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white text-xs font-semibold rounded cursor-pointer transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Designer Label</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search designers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDesigners.map(d => (
          <div key={d.id} className="bg-white rounded-lg border border-stone-200/80 shadow-sm p-5 hover:shadow transition relative flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#fcf9f5] rounded border border-[#eae1d8] text-[#c5a880]">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-stone-950 text-sm">{d.name}</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">Est. {d.foundedYear || 'Unknown'} | {d.location || 'India'}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {d.featured && (
                    <span className="bg-green-50 text-green-700 text-[8px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border border-green-100">
                      Featured
                    </span>
                  )}
                  <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold border ${
                    d.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-rose-50 text-rose-700 border-rose-100'
                  }`}>
                    {d.status}
                  </span>
                </div>
              </div>

              <p className="text-stone-500 font-sans leading-relaxed my-3 line-clamp-3">
                {d.bio || "No brand philosophy or biography description configured yet."}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-stone-600 bg-stone-50 p-2.5 rounded border border-stone-100/50 mt-2 mb-4">
                <p>Active Listings: <span className="font-bold text-stone-800">{d.activeListings} items</span></p>
                <p>Commission Rate: <span className="font-bold text-stone-800">{d.commissionOverride || 'Standard 25'}%</span></p>
                <p className="col-span-2 truncate">Website: <a href={d.website} target="_blank" rel="noreferrer" className="text-[#c5a880] hover:underline font-semibold">{d.website || 'N/A'}</a></p>
              </div>
            </div>

            <div className="flex gap-2 justify-end border-t border-stone-100 pt-3">
              <button
                onClick={() => startEditing(d)}
                className="px-3 py-1.5 border border-stone-200 hover:border-[#c5a880] text-stone-700 hover:bg-stone-50 rounded text-xs font-semibold cursor-pointer transition flex items-center gap-1"
              >
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
