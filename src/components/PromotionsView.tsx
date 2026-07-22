import React, { useState } from 'react';
import { Search, Plus, Trash2, Tag, Percent, Calendar, Check, Play, SquareTerminal } from 'lucide-react';
import { PromoCode } from '../types';

interface PromotionsViewProps {
  promoCodes: PromoCode[];
  onAddPromoCode: (newCode: PromoCode) => void;
  onUpdatePromoCode: (updatedCode: PromoCode) => void;
  onDeletePromoCode: (id: string) => void;
}

export default function PromotionsView({ 
  promoCodes, 
  onAddPromoCode, 
  onUpdatePromoCode, 
  onDeletePromoCode 
}: PromotionsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Form Fields
  const [newCode, setNewCode] = useState('');
  const [newVal, setNewVal] = useState('');
  const [newType, setNewType] = useState<'Percentage' | 'Flat'>('Percentage');
  const [newMinOrder, setNewMinOrder] = useState('1000');
  const [newMaxUses, setNewMaxUses] = useState('500');
  const [newExpiry, setNewExpiry] = useState('2026-12-31');

  const handleCreate = () => {
    if (!newCode.trim() || !newVal) {
      alert("Please provide a valid code name and discount value.");
      return;
    }
    const newPromo: PromoCode = {
      id: "PRM-" + Math.floor(100 + Math.random() * 900),
      code: newCode.trim().toUpperCase(),
      discountValue: Number(newVal),
      discountType: newType,
      minOrderValue: Number(newMinOrder),
      usageCount: 0,
      maxUses: Number(newMaxUses),
      expiryDate: newExpiry,
      status: 'Active',
      applicableModes: ['Rental', 'Preloved', 'Buy'],
      maxUsesPerCustomer: 1
    };
    onAddPromoCode(newPromo);
    setIsAdding(false);
    setNewCode('');
    setNewVal('');
    alert("Promo code generated successfully!");
  };

  const handleToggleStatus = (promo: PromoCode) => {
    const updated: PromoCode = {
      ...promo,
      status: promo.status === 'Active' ? 'Expired' : 'Active'
    };
    onUpdatePromoCode(updated);
  };

  const filteredCodes = promoCodes.filter(p =>
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-xs font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-stone-900 font-medium">Promotions & Coupons</h2>
          <p className="text-xs text-stone-500 mt-1">
            Create, distribute and analyze coupon codes to boost luxury fashion rental conversions.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white text-xs font-semibold rounded cursor-pointer transition"
        >
          <Plus className="h-4 w-4" />
          <span>{isAdding ? "Cancel" : "Create Promo Code"}</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-stone-900 text-sm">Add New Promo Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-stone-500 font-medium">Promo Code String (Caps)</label>
              <input
                type="text"
                placeholder="E.g., KAIRAFEST"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-500 font-medium">Discount Value</label>
              <input
                type="number"
                placeholder="E.g., 20"
                value={newVal}
                onChange={(e) => setNewVal(e.target.value)}
                className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-500 font-medium">Discount Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Flat">Flat Cash (₹)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-stone-500 font-medium">Minimum Order Value (₹)</label>
              <input
                type="number"
                value={newMinOrder}
                onChange={(e) => setNewMinOrder(e.target.value)}
                className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-500 font-medium">Max Usages Limit (Total)</label>
              <input
                type="number"
                value={newMaxUses}
                onChange={(e) => setNewMaxUses(e.target.value)}
                className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-500 font-medium">Expiry Date</label>
              <input
                type="date"
                value={newExpiry}
                onChange={(e) => setNewExpiry(e.target.value)}
                className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded text-xs font-semibold cursor-pointer transition"
          >
            Generate Code
          </button>
        </div>
      )}

      {/* Filter row */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
        <input
          type="text"
          placeholder="Search codes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredCodes.map(promo => (
          <div key={promo.id} className="bg-white rounded-lg border border-stone-200/80 p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-start border-b border-stone-100 pb-3">
              <div className="flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-[#c5a880]" />
                <span className="font-bold text-stone-900 text-sm">{promo.code}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                promo.status === 'Active' 
                  ? 'bg-green-50 text-green-700 border border-green-100' 
                  : 'bg-stone-100 text-stone-500 border border-stone-200'
              }`}>
                {promo.status}
              </span>
            </div>

            <div className="space-y-1.5 leading-relaxed text-stone-600 text-[11px]">
              <p>Discount: <span className="font-bold text-stone-900">
                {promo.discountType === 'Percentage' ? `${promo.discountValue}% Off` : `₹${promo.discountValue} Off`}
              </span></p>
              <p>Min Order Value: <span className="font-bold text-stone-800">₹{promo.minOrderValue.toLocaleString('en-IN')}</span></p>
              <p>Usages: <span className="font-bold text-stone-800">{promo.usageCount} / {promo.maxUses} times</span></p>
              <p>Expires: <span className="font-bold text-stone-400">{promo.expiryDate}</span></p>
            </div>

            <div className="flex gap-2 justify-end border-t border-stone-100 pt-3">
              <button
                onClick={() => handleToggleStatus(promo)}
                className="px-2.5 py-1.5 border border-stone-200 hover:border-stone-350 text-stone-600 rounded font-semibold text-[10px] uppercase cursor-pointer"
              >
                {promo.status === 'Active' ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this promo code?")) {
                    onDeletePromoCode(promo.id);
                  }
                }}
                className="p-1.5 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                title="Delete Promo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
