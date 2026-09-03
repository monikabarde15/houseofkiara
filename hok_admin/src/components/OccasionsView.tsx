import React, { useState } from 'react';
import { Layers, Check, Plus, Trash2, Sliders, ChevronRight, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OccasionsView() {
  const [occasions, setOccasions] = useState([
    { id: "1", name: "Bridal Lehenga / Wedding", duration: "4 Days Standard", minDeposit: 15000, activeListings: 14 },
    { id: "2", name: "Mehendi / Haldi Ceremony", duration: "4 Days Standard", minDeposit: 5000, activeListings: 8 },
    { id: "3", name: "Cocktail Party & Sangeet", duration: "4 Days Standard", minDeposit: 8000, activeListings: 12 },
    { id: "4", name: "Reception Formalwear", duration: "4 Days Standard", minDeposit: 10000, activeListings: 9 },
    { id: "5", name: "Roka & Engagement", duration: "4 Days Standard", minDeposit: 6000, activeListings: 7 }
  ]);

  const [sizes, setSizes] = useState([
    { code: "XS", chest: "32 in", waist: "25 in", hip: "35 in", standard: "UK 4 / US 0" },
    { code: "S", chest: "34 in", waist: "27 in", hip: "37 in", standard: "UK 8 / US 4" },
    { code: "M", chest: "36 in", waist: "29 in", hip: "39 in", standard: "UK 10 / US 6" },
    { code: "L", chest: "38 in", waist: "31 in", hip: "41 in", standard: "UK 12 / US 8" },
    { code: "XL", chest: "40 in", waist: "33 in", hip: "43 in", standard: "UK 14 / US 10" },
    { code: "XXL", chest: "42 in", waist: "35 in", hip: "45 in", standard: "UK 16 / US 12" }
  ]);

  const [newOccasionName, setNewOccasionName] = useState('');
  const [newOccasionDeposit, setNewOccasionDeposit] = useState('');

  const [selectedSizeCode, setSelectedSizeCode] = useState<string | null>("M");
  const [sizeChest, setSizeChest] = useState("36 in");
  const [sizeWaist, setSizeWaist] = useState("29 in");
  const [sizeHip, setSizeHip] = useState("39 in");
  const [sizeStandard, setSizeStandard] = useState("UK 10 / US 6");

  const handleAddOccasion = () => {
    if (!newOccasionName.trim()) return;
    const newO = {
      id: String(occasions.length + 1),
      name: newOccasionName,
      duration: "4 Days Standard",
      minDeposit: Number(newOccasionDeposit) || 5000,
      activeListings: 0
    };
    setOccasions([...occasions, newO]);
    setNewOccasionName('');
    setNewOccasionDeposit('');
    toast.success("Occasion type added successfully!");
  };

  const handleDeleteOccasion = (id: string) => {
    setOccasions(occasions.filter(o => o.id !== id));
  };

  const handleSelectSize = (code: string) => {
    const s = sizes.find(sz => sz.code === code);
    if (s) {
      setSelectedSizeCode(code);
      setSizeChest(s.chest);
      setSizeWaist(s.waist);
      setSizeHip(s.hip);
      setSizeStandard(s.standard);
    }
  };

  const handleSaveSize = () => {
    if (!selectedSizeCode) return;
    setSizes(sizes.map(s => {
      if (s.code === selectedSizeCode) {
        return {
          ...s,
          chest: sizeChest,
          waist: sizeWaist,
          hip: sizeHip,
          standard: sizeStandard
        };
      }
      return s;
    }));
    toast.success(`Size chart configuration for ${selectedSizeCode} updated successfully!`);
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      <div>
        <h2 className="text-2xl font-serif text-stone-900 font-medium">Occasions & Sizing Presets</h2>
        <p className="text-xs text-stone-500 mt-1">
          Configure size chart measurements (chest, waist, hips offsets) and wedding event occasion categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occasions block */}
        <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-2">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Wedding Occasions Settings</h3>
            <Layers className="h-4 w-4 text-stone-400" />
          </div>

          <div className="space-y-2">
            {occasions.map(o => (
              <div key={o.id} className="p-3 bg-[#fcf9f5] border border-stone-100 rounded flex justify-between items-center">
                <div>
                  <span className="font-bold text-stone-850">{o.name}</span>
                  <p className="text-[10px] text-stone-400 mt-0.5">{o.duration} | Default Deposit: ₹{o.minDeposit.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded">
                    {o.activeListings} Live Listings
                  </span>
                  <button 
                    onClick={() => handleDeleteOccasion(o.id)}
                    className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                    title="Delete Occasion"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Form */}
          <div className="border-t border-stone-100 pt-4 space-y-3">
            <h4 className="font-bold text-stone-850">Create New Occasion Category</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="E.g., Sangeet Couture"
                value={newOccasionName}
                onChange={(e) => setNewOccasionName(e.target.value)}
                className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
              />
              <input
                type="number"
                placeholder="Min Deposit (₹)"
                value={newOccasionDeposit}
                onChange={(e) => setNewOccasionDeposit(e.target.value)}
                className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
              />
            </div>
            <button
              onClick={handleAddOccasion}
              className="px-3 py-1.5 bg-[#1e1412] text-white hover:bg-[#2c1d1a] rounded font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Occasion Category</span>
            </button>
          </div>
        </div>

        {/* Sizing presets block */}
        <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-2">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Measurement Sizing Presets</h3>
            <Sliders className="h-4 w-4 text-stone-400" />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {sizes.map(s => (
              <button
                key={s.code}
                onClick={() => handleSelectSize(s.code)}
                className={`px-3 py-1.5 border rounded font-bold text-xs cursor-pointer transition ${
                  selectedSizeCode === s.code 
                    ? 'bg-[#c5a880] border-[#c5a880] text-white shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-350 text-stone-700'
                }`}
              >
                {s.code}
              </button>
            ))}
          </div>

          {selectedSizeCode && (
            <div className="bg-[#fcf9f5] p-4 rounded border border-stone-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#c5a880] text-xs uppercase">Configuring Size: {selectedSizeCode}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Chest Fit</label>
                  <input
                    type="text"
                    value={sizeChest}
                    onChange={(e) => setSizeChest(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Waist Fit</label>
                  <input
                    type="text"
                    value={sizeWaist}
                    onChange={(e) => setSizeWaist(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Hip Fit</label>
                  <input
                    type="text"
                    value={sizeHip}
                    onChange={(e) => setSizeHip(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">Standard Sizing Label Match</label>
                  <input
                    type="text"
                    value={sizeStandard}
                    onChange={(e) => setSizeStandard(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveSize}
                className="px-3.5 py-1.5 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded font-bold text-xs flex items-center gap-1 cursor-pointer transition"
              >
                <Save className="h-4 w-4" />
                <span>Save Size chart</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
