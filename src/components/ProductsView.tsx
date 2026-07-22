import React, { useEffect, useState } from 'react';
import { Search, Eye, Plus, Edit, Save, Calendar as CalendarIcon, Image as ImageIcon, Link, Settings2, Trash2 } from 'lucide-react';
import { Product, Lister } from '../types';
import * as productSectionsApi from '../services/productSectionsApi';
import { uploadFile } from '../services/uploadApi';

interface ProductsViewProps {
  products: Product[];
  loading?: boolean;
  onAddProduct: (newProduct: Product) => void | Promise<void>;
  onUpdateProduct: (updatedProduct: Product) => void | Promise<void>;
  listers: Lister[];
}

export default function ProductsView({ products, loading = false, onAddProduct, onUpdateProduct, listers }: ProductsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editTab, setEditTab] = useState<'Core' | 'Pricing' | 'Images' | 'SEO' | 'Calendar' | 'Related Products' | 'Payout History' | 'Activity Log'>('Core');
  const [sectionLoading, setSectionLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [payoutHistory, setPayoutHistory] = useState<any[]>([]);
  const [activityLog, setActivityLog] = useState<any[]>([]);

  // Product editable fields
  const [editName, setEditName] = useState('');
  const [editDesigner, setEditDesigner] = useState('');
  const [editListerId, setEditListerId] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCat, setEditCat] = useState('');
  const [editOccasion, setEditOccasion] = useState('');
  const [editMat, setEditMat] = useState('');
  const [editEmbellish, setEditEmbellish] = useState('');
  const [editSizes, setEditSizes] = useState<string[]>([]);
  const [editModes, setEditModes] = useState<('Rental' | 'Preloved' | 'Buy')[]>([]);
  const [editCondition, setEditCondition] = useState('');
  const [editStatus, setEditStatus] = useState<'Live' | 'Archived' | 'Review'>('Live');
  const [editRentalPrice, setEditRentalPrice] = useState(0);
  const [editSecurityDeposit, setEditSecurityDeposit] = useState(0);
  const [editListingPrice, setEditListingPrice] = useState(0);
  const [editCommission, setEditCommission] = useState(25);
  const [editBuffer, setEditBuffer] = useState(2);
  const [editImg, setEditImg] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editSeoTitle, setEditSeoTitle] = useState('');
  const [editSeoDesc, setEditSeoDesc] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editCraft, setEditCraft] = useState('');
  const [editTechnique, setEditTechnique] = useState('');
  const [editStory, setEditStory] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editTaxRate, setEditTaxRate] = useState(0);
  const [editCleaningFee, setEditCleaningFee] = useState(0);
  const [editExtensionPrice, setEditExtensionPrice] = useState(0);
  const [editBust, setEditBust] = useState(''); const [editWaist, setEditWaist] = useState(''); const [editHips, setEditHips] = useState(''); const [editLength, setEditLength] = useState(''); const [editRelated, setEditRelated] = useState<string[]>([]);

  // Manual Block Dates
  const [blockFrom, setBlockFrom] = useState('');
  const [blockTo, setBlockTo] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [externalOrderId, setExternalOrderId] = useState(''); const [externalCustomer, setExternalCustomer] = useState(''); const [externalFrom, setExternalFrom] = useState(''); const [externalTo, setExternalTo] = useState(''); const [externalAmount, setExternalAmount] = useState(0);

  useEffect(() => {
    if (!editingProduct || isAdding) return;
    setSectionLoading(true);
    Promise.all([productSectionsApi.getCalendar(editingProduct.id), productSectionsApi.getPayoutHistory(editingProduct.id), productSectionsApi.getActivity(editingProduct.id)])
      .then(([calendar, payout, activity]) => { setEditingProduct(p => p ? { ...p, blockedDates: calendar.blockedDates || [], bookingHistory: calendar.bookingHistory || [] } : p); setPayoutHistory(payout || []); setActivityLog(activity || []); })
      .catch((error) => console.error('Unable to load product sections:', error)).finally(() => setSectionLoading(false));
  }, [editingProduct?.id, isAdding]);

  const startEditing = (p: Product) => {
    setEditingProduct(p);
    setIsAdding(false);
    setEditTab('Core');
    setEditName(p.name);
    setEditDesigner(p.designer);
    setEditListerId((p as any).listerId || '');
    setEditDesc(p.description);
    setEditCat(p.category);
    setEditOccasion(p.occasion);
    setEditMat(p.material);
    setEditEmbellish(p.embellishments);
    setEditSizes(p.sizes);
    setEditModes(p.listingModes);
    setEditCondition(p.condition);
    setEditStatus(p.status);
    setEditRentalPrice(p.rentalPrice);
    setEditSecurityDeposit(p.securityDeposit);
    setEditListingPrice(p.listingPrice);
    setEditCommission(p.commissionRate || 25);
    setEditBuffer(p.cleaningBufferDays || 2);
    setEditImg(p.images[0] || '');
    setEditImages(p.images || []);
    setEditSeoTitle(p.seoTitle || '');
    setEditSeoDesc(p.seoDescription || '');
    setEditSlug(p.urlSlug || '');
    setEditSku(p.sku || ''); setEditColor(p.color || ''); setEditCraft(p.craft || ''); setEditTechnique(p.technique || ''); setEditStory(p.story || ''); setEditTags((p.tags || []).join(', ')); setEditTaxRate(p.gstRate || p.taxRate || 0); setEditCleaningFee(p.cleaningFee || 0); setEditExtensionPrice(p.extensionPrice || 0);
    setEditBust(p.measurements?.bust || ''); setEditWaist(p.measurements?.waist || ''); setEditHips(p.measurements?.hips || ''); setEditLength(p.measurements?.length || ''); setEditRelated(p.relatedProductIds || []);
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditingProduct(null);
    setEditTab('Core');
    setEditName('');
    setEditDesigner('Sabyasachi');
    setEditListerId('');
    setEditDesc('');
    setEditCat('Bridal Lehenga');
    setEditOccasion('Wedding');
    setEditMat('Silk Organza');
    setEditEmbellish('Zardozi');
    setEditSizes(['S', 'M']);
    setEditModes(['Rental']);
    setEditCondition('Excellent');
    setEditStatus('Review');
    setEditRentalPrice(5000);
    setEditSecurityDeposit(10000);
    setEditListingPrice(150000);
    setEditCommission(25);
    setEditBuffer(2);
    setEditImg('https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=60');
    setEditImages([]);
    setEditSeoTitle('');
    setEditSeoDesc('');
    setEditSlug('');
    setEditSku(''); setEditColor(''); setEditCraft(''); setEditTechnique(''); setEditStory(''); setEditTags(''); setEditTaxRate(0); setEditCleaningFee(0); setEditExtensionPrice(0);
    setEditBust(''); setEditWaist(''); setEditHips(''); setEditLength(''); setEditRelated([]);
  };

  const handleSaveProduct = async () => {
    if (!editName.trim() || editName.trim().length < 3) return alert('Listing title must be at least 3 characters.');
    if (!editDesigner.trim()) return alert('Designer / Brand is required.');
    if (!editModes.length) return alert('Select at least one listing mode.');
    if (editModes.includes('Rental') && Number(editRentalPrice) <= 0) return alert('Rental price must be greater than zero for Rental listings.');
    if ((editModes.includes('Buy') || editModes.includes('Preloved')) && Number(editListingPrice) <= 0) return alert('Listing price must be greater than zero for Buy / Preloved listings.');
    if (Number(editCommission) < 0 || Number(editCommission) > 100) return alert('Commission must be between 0% and 100%.');
    if (Number(editBuffer) >=  Number(4)) return alert('Cleaning buffer must be less than the minimum rental duration.');
    if (isAdding) {
      const newProd: Product = {
        id: "HOK-PRD-" + Math.floor(100 + Math.random() * 900),
        name: editName,
        designer: editDesigner,
        listerId: editListerId || undefined,
        listerName: listers.find(l => l.id === editListerId)?.name || undefined,
        description: editDesc,
        category: editCat,
        occasion: editOccasion,
        material: editMat,
        embellishments: editEmbellish,
        sizes: editSizes,
        listingModes: editModes,
        condition: editCondition,
        availability: "Available Now",
        status: editStatus,
        rentalPrice: Number(editRentalPrice),
        securityDeposit: Number(editSecurityDeposit),
        listingPrice: Number(editListingPrice),
        commissionRate: Number(editCommission),
        minimumDurationDays: 4,
        extensionWindowDays: 2,
        cleaningBufferDays: Number(editBuffer),
        images: editImages.length ? editImages : [editImg],
        seoTitle: editSeoTitle,
        seoDescription: editSeoDesc,
        urlSlug: editSlug || editName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: editSku, color: editColor, craft: editCraft, technique: editTechnique, story: editStory, tags: editTags.split(',').map(t => t.trim()).filter(Boolean), taxRate: Number(editTaxRate), cleaningFee: Number(editCleaningFee), extensionPrice: Number(editExtensionPrice),
        measurements: { bust: editBust, waist: editWaist, hips: editHips, length: editLength }, relatedProductIds: editRelated,
        blockedDates: []
      };
      await onAddProduct(newProd);
      setIsAdding(false);
      alert("Product added successfully!");
    } else if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: editName,
        designer: editDesigner,
        listerId: editListerId || undefined,
        listerName: listers.find(l => l.id === editListerId)?.name || undefined,
        description: editDesc,
        category: editCat,
        occasion: editOccasion,
        material: editMat,
        embellishments: editEmbellish,
        sizes: editSizes,
        listingModes: editModes,
        condition: editCondition,
        status: editStatus,
        rentalPrice: Number(editRentalPrice),
        securityDeposit: Number(editSecurityDeposit),
        listingPrice: Number(editListingPrice),
        commissionRate: Number(editCommission),
        cleaningBufferDays: Number(editBuffer),
        images: editImages.length ? editImages : [editImg],
        seoTitle: editSeoTitle,
        seoDescription: editSeoDesc,
        urlSlug: editSlug
        , sku: editSku, color: editColor, craft: editCraft, technique: editTechnique, story: editStory, tags: editTags.split(',').map(t => t.trim()).filter(Boolean), taxRate: Number(editTaxRate), cleaningFee: Number(editCleaningFee), extensionPrice: Number(editExtensionPrice)
        , measurements: { bust: editBust, waist: editWaist, hips: editHips, length: editLength }, relatedProductIds: editRelated
      };
      await onUpdateProduct(updated);
      setEditingProduct(updated);
      alert("Product details updated!");
    }
  };

  const handleAddBlockDates = () => {
    if (!editingProduct || !blockFrom || !blockTo || !blockReason) return;
    const currentBlocks = editingProduct.blockedDates || [];
    const updated = {
      ...editingProduct,
      blockedDates: [...currentBlocks, { from: blockFrom, to: blockTo, reason: blockReason }]
    };
    onUpdateProduct(updated);
    setEditingProduct(updated);
    setBlockFrom('');
    setBlockTo('');
    setBlockReason('');
    alert("Date range blocked on manual stock calendars successfully!");
  };

  const handleRemoveBlockDates = (index: number) => {
    if (!editingProduct || !editingProduct.blockedDates) return;
    const updatedBlocks = [...editingProduct.blockedDates];
    updatedBlocks.splice(index, 1);
    const updated = {
      ...editingProduct,
      blockedDates: updatedBlocks
    };
    onUpdateProduct(updated);
    setEditingProduct(updated);
    alert("Blocked date range cleared.");
  };
  const handleAddExternalBooking = async () => { if (!editingProduct || !externalOrderId || !externalCustomer || !externalFrom || !externalTo) return alert('Order ID, customer and dates are required.'); try { await productSectionsApi.addExternalBooking(editingProduct.id, { orderId: externalOrderId, customerName: externalCustomer, startDate: externalFrom, endDate: externalTo, amount: externalAmount }); const calendar = await productSectionsApi.getCalendar(editingProduct.id); setEditingProduct(p => p ? { ...p, blockedDates: calendar.blockedDates || [], bookingHistory: calendar.bookingHistory || [] } : p); setExternalOrderId(''); setExternalCustomer(''); setExternalFrom(''); setExternalTo(''); setExternalAmount(0); alert('External booking added.'); } catch (error) { alert(error instanceof Error ? error.message : 'Unable to add external booking'); } };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.designer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All Categories' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['All Categories', 'Bridal Lehenga', 'Lehenga', 'Anarkali', 'Sherwani', 'Saree'];

  if (editingProduct || isAdding) {
    return (
      <div className="space-y-6 text-xs font-sans">
        
        {/* Navigation bar */}
        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setEditingProduct(null); setIsAdding(false); }}
              className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded text-stone-600 font-semibold cursor-pointer"
            >
              ← Back to products
            </button>
            <h2 className="text-xl font-serif text-stone-900 font-bold ml-2">
              {isAdding ? "Add New Product" : `Edit: ${editName}`}
            </h2>
          </div>
          <button
            onClick={handleSaveProduct}
            className="px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Product</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-200 gap-1 select-none font-semibold overflow-x-auto whitespace-nowrap scrollbar-none pb-px">
          {(['Core', 'Pricing', 'Images', 'SEO', 'Calendar', 'Related Products', 'Payout History', 'Activity Log'] as const).map(tab => {
            const labels = {
              Core: 'Core Details',
              Pricing: 'Pricing & Taxes',
              Images: 'Images Carousel',
              SEO: 'SEO Parameters',
              Calendar: 'Availability Calendar'
            };
            if (isAdding && tab === 'Calendar') return null; // block scheduling for new creations
            if (isAdding && (tab === 'Payout History' || tab === 'Activity Log')) return null;
            const isActive = editTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setEditTab(tab)}
                className={`px-4 py-2 border-b-2 text-xs transition cursor-pointer ${
                  isActive ? 'border-[#c5a880] text-stone-900 font-bold' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Tab view containers */}
        {editTab === 'Core' && (
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Product Description & Specs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Listing Title</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Designer / Brand</label>
                <input
                  type="text"
                  value={editDesigner}
                  onChange={(e) => setEditDesigner(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Lister / Owner</label>
                <select value={editListerId} onChange={e => setEditListerId(e.target.value)} className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs">
                  <option value="">Select lister (optional)</option>
                  {listers.map(l => <option key={l.id} value={l.id}>{l.name} — {l.id}</option>)}
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-stone-500 font-medium">Full Description</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={4}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1"><label className="text-stone-500 font-medium">SKU</label><input value={editSku} onChange={e => setEditSku(e.target.value)} className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" /></div>
              <div className="space-y-1"><label className="text-stone-500 font-medium">Colour</label><input value={editColor} onChange={e => setEditColor(e.target.value)} className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" /></div>
              <div className="space-y-1"><label className="text-stone-500 font-medium">Craft / Technique</label><input value={editCraft} onChange={e => setEditCraft(e.target.value)} className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" /></div>
              <div className="space-y-1"><label className="text-stone-500 font-medium">Technique</label><input value={editTechnique} onChange={e => setEditTechnique(e.target.value)} className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" /></div>
              <div className="space-y-1 md:col-span-2"><label className="text-stone-500 font-medium">Story / Product Notes</label><textarea value={editStory} onChange={e => setEditStory(e.target.value)} rows={3} className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" /></div>
              <div className="space-y-1 md:col-span-2"><label className="text-stone-500 font-medium">Tags (comma separated)</label><input value={editTags} onChange={e => setEditTags(e.target.value)} placeholder="Featured, Red, New Arrival" className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" /></div>
              <div className="md:col-span-2"><label className="text-stone-500 font-medium">Measurements (inches)</label><div className="mt-1 grid grid-cols-2 md:grid-cols-4 gap-2"><input placeholder="Bust" value={editBust} onChange={e => setEditBust(e.target.value)} className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" /><input placeholder="Waist" value={editWaist} onChange={e => setEditWaist(e.target.value)} className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" /><input placeholder="Hips" value={editHips} onChange={e => setEditHips(e.target.value)} className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" /><input placeholder="Length" value={editLength} onChange={e => setEditLength(e.target.value)} className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" /></div></div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Product Category</label>
                <select
                  value={editCat}
                  onChange={(e) => setEditCat(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                >
                  <option value="Bridal Lehenga">Bridal Lehenga</option>
                  <option value="Lehenga">Lehenga Only</option>
                  <option value="Anarkali">Anarkali Suit</option>
                  <option value="Sherwani">Sherwani Menswear</option>
                  <option value="Saree">Saree / Draped Saree</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Occasions suitable</label>
                <input
                  type="text"
                  value={editOccasion}
                  onChange={(e) => setEditOccasion(e.target.value)}
                  placeholder="Wedding, Sangeet..."
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Material Composition</label>
                <input
                  type="text"
                  value={editMat}
                  onChange={(e) => setEditMat(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Embellishments</label>
                <input
                  type="text"
                  value={editEmbellish}
                  onChange={(e) => setEditEmbellish(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Condition Grade</label>
                <input
                  type="text"
                  value={editCondition}
                  onChange={(e) => setEditCondition(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Status on Storefront</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                >
                  <option value="Live">Live / Active</option>
                  <option value="Archived">Archived / Hidden</option>
                  <option value="Review">Under Review</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {editTab === 'Pricing' && (
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Commercial Settings & commission</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Rental Price (4 Days cycle) - ₹</label>
                <input
                  type="number"
                  value={editRentalPrice}
                  onChange={(e) => setEditRentalPrice(Number(e.target.value))}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Security Deposit held - ₹</label>
                <input
                  type="number"
                  value={editSecurityDeposit}
                  onChange={(e) => setEditSecurityDeposit(Number(e.target.value))}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Listing Retail Price (For Preloved/Buy) - ₹</label>
                <input
                  type="number"
                  value={editListingPrice}
                  onChange={(e) => setEditListingPrice(Number(e.target.value))}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">HOK Platform Commission %</label>
                <input
                  type="number"
                  value={editCommission}
                  onChange={(e) => setEditCommission(Number(e.target.value))}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1"><label className="text-stone-500 font-medium">Extension Price / Day - ₹</label><input type="number" min="0" value={editExtensionPrice} onChange={e => setEditExtensionPrice(Number(e.target.value))} className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" /></div>
              <div className="space-y-1"><label className="text-stone-500 font-medium">Cleaning Fee - ₹</label><input type="number" min="0" value={editCleaningFee} onChange={e => setEditCleaningFee(Number(e.target.value))} className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" /></div>
              <div className="space-y-1"><label className="text-stone-500 font-medium">GST / Tax %</label><input type="number" min="0" max="100" value={editTaxRate} onChange={e => setEditTaxRate(Number(e.target.value))} className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" /></div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Cleaning Buffer (Days)</label>
                <input
                  type="number"
                  value={editBuffer}
                  onChange={(e) => setEditBuffer(Number(e.target.value))}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {editTab === 'Images' && (
          <div className="bg-white p-5 rounded-lg border border-[#e8dfd8] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Visual Assets Carousels</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Primary Image URL</label>
                <input
                  type="text"
                  value={editImg}
                  onChange={(e) => setEditImg(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <button type="button" onClick={() => { if (editImg.trim()) { setEditImages(images => [...images, editImg.trim()]); setEditImg(''); } }} className="rounded bg-[#1e1412] px-3 py-2 text-xs font-bold text-white">Add Image</button>
              <label className="inline-flex cursor-pointer rounded border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700"><input type="file" accept="image/*,video/*" multiple className="hidden" onChange={async e => { const input = e.currentTarget; const files = Array.from(input.files || []) as File[]; if (!files.length) return; setUploadingImages(true); try { const uploaded = await Promise.all(files.map(file => uploadFile(file, 'products'))); setEditImages(images => [...images, ...uploaded.map(file => file.url)]); } catch (error) { alert(error instanceof Error ? error.message : 'Image upload failed'); } finally { setUploadingImages(false); input.value = ''; } }} />{uploadingImages ? 'Uploading...' : 'Upload images/video'}</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{editImages.map((image, index) => <div key={`${image}-${index}`} className="rounded border border-stone-200 p-2"><img src={image} alt={`Product ${index + 1}`} className="h-28 w-full rounded object-cover" /><div className="mt-2 flex justify-between text-[10px]"><button type="button" disabled={index === 0} onClick={() => setEditImages(images => { const next = [...images]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; return next; })}>←</button><button type="button" onClick={() => setEditImages(images => images.filter((_, i) => i !== index))} className="text-rose-600">Remove</button><button type="button" disabled={index === editImages.length - 1} onClick={() => setEditImages(images => { const next = [...images]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; return next; })}>→</button></div></div>)}</div>
              {editImg && (
                <div className="border border-stone-100 p-2 w-fit rounded">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block mb-1">Image Preview</span>
                  <img src={editImg} alt="Preview" className="h-40 w-40 object-cover rounded" />
                </div>
              )}
            </div>
          </div>
        )}

        {editTab === 'SEO' && (
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">SEO & URL Slugs</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Meta Title Tag</label>
                <input
                  type="text"
                  value={editSeoTitle}
                  onChange={(e) => setEditSeoTitle(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Meta Description</label>
                <textarea
                  value={editSeoDesc}
                  onChange={(e) => setEditSeoDesc(e.target.value)}
                  rows={3}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">URL Slug</label>
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {editTab === 'Related Products' && editingProduct && <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4"><h3 className="font-serif font-bold text-stone-900 text-sm">Related Products</h3><p className="text-xs text-stone-500">Select products that should appear together on the product page.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-2">{products.filter(p => p.id !== editingProduct.id).map(p => <label key={p.id} className="flex items-center gap-2 rounded border border-stone-200 p-3 text-xs"><input type="checkbox" checked={editRelated.includes(p.id)} onChange={e => setEditRelated(current => e.target.checked ? [...current, p.id] : current.filter(id => id !== p.id))} />{p.name}</label>)}</div></div>}

        {editTab === 'Calendar' && editingProduct && (
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Availability Block Dates & Bookings</h3>

            {/* Block calendar manually */}
            <div className="bg-[#fcf9f5] p-4 rounded border border-stone-150 space-y-3">
              <h4 className="font-bold text-stone-850">Block calendar dates manually (E.g. dry cleaning, repairs, photoshoots)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-500">From Date</label>
                  <input
                    type="date"
                    value={blockFrom}
                    onChange={(e) => setBlockFrom(e.target.value)}
                    className="w-full p-1.5 bg-white border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500">To Date</label>
                  <input
                    type="date"
                    value={blockTo}
                    onChange={(e) => setBlockTo(e.target.value)}
                    className="w-full p-1.5 bg-white border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500">Reason</label>
                  <input
                    type="text"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="Dry cleaning, photoshoot..."
                    className="w-full p-1.5 bg-white border border-stone-200 rounded text-xs"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddBlockDates}
                className="px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white rounded text-xs font-bold transition cursor-pointer"
              >
                Block These Dates
              </button>
            </div>

            {/* Currently Blocked Dates list */}
            <div className="bg-[#fcf9f5] p-4 rounded border border-stone-150 space-y-3"><h4 className="font-bold text-stone-800">Add External Booking</h4><div className="grid grid-cols-1 md:grid-cols-5 gap-2"><input placeholder="Order ID" value={externalOrderId} onChange={e => setExternalOrderId(e.target.value)} className="p-2 bg-white border rounded text-xs" /><input placeholder="Customer name" value={externalCustomer} onChange={e => setExternalCustomer(e.target.value)} className="p-2 bg-white border rounded text-xs" /><input type="date" value={externalFrom} onChange={e => setExternalFrom(e.target.value)} className="p-2 bg-white border rounded text-xs" /><input type="date" value={externalTo} onChange={e => setExternalTo(e.target.value)} className="p-2 bg-white border rounded text-xs" /><input type="number" placeholder="Amount" value={externalAmount} onChange={e => setExternalAmount(Number(e.target.value))} className="p-2 bg-white border rounded text-xs" /></div><button type="button" onClick={handleAddExternalBooking} className="rounded bg-[#1e1412] px-4 py-2 text-xs font-bold text-white">Save External Booking</button></div>
            <div>
              <h4 className="font-bold text-stone-800 border-b border-stone-100 pb-2">Currently Blocked Date Ranges</h4>
              {!editingProduct.blockedDates || editingProduct.blockedDates.length === 0 ? (
                <p className="text-stone-400 mt-2">No custom date ranges blocked manually.</p>
              ) : (
                <div className="space-y-2 mt-2">
                  {editingProduct.blockedDates.map((block, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 bg-stone-50 border border-stone-100 rounded">
                      <div>
                        <span className="font-semibold text-stone-700">
                          {new Date(block.from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(block.to).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <p className="text-[10px] text-stone-400 mt-0.5">Reason: {block.reason}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlockDates(idx)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        title="Remove Block"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Historic Booking List */}
            <div>
              <h4 className="font-bold text-stone-800 border-b border-stone-100 pb-2">Historical Booking Records</h4>
              {!editingProduct.bookingHistory || editingProduct.bookingHistory.length === 0 ? (
                <p className="text-stone-400 mt-2">No historical bookings logged under this piece.</p>
              ) : (
                <div className="space-y-2 mt-2">
                  {editingProduct.bookingHistory.map((h, idx) => (
                    <div key={idx} className="p-3 bg-stone-50 rounded border border-stone-100 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-stone-700">Renter: {h.customerName}</span>
                        <p className="text-[10px] text-stone-400 font-mono mt-0.5">Order: {h.orderId} | Status: {h.status}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-stone-850">₹{h.amount.toLocaleString('en-IN')}</span>
                        <p className="text-[10px] text-stone-400 mt-0.5">{new Date(h.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {editTab === 'Payout History' && editingProduct && (
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Payout History for this Product</h3>
            {sectionLoading ? <p className="text-stone-400">Loading payout history...</p> : payoutHistory.length === 0 ? <p className="text-stone-400">No payout records found.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b text-stone-400 uppercase text-[10px]"><th className="py-2">Payout</th><th>Order</th><th>Transaction</th><th>Lister Share</th><th>Commission</th><th>Status</th></tr></thead><tbody>{payoutHistory.map(p => <tr key={p.id || p._id} className="border-b border-stone-100"><td className="py-3 font-mono">{p.payoutId || p.id}</td><td>{p.orderId}</td><td>₹{Number(p.transactionAmount || 0).toLocaleString('en-IN')}</td><td>₹{Number(p.netPayout ?? p.listerShare ?? 0).toLocaleString('en-IN')}</td><td>₹{Number(p.hokCommission || 0).toLocaleString('en-IN')}</td><td>{p.status}</td></tr>)}</tbody></table></div>}
          </div>
        )}

        {editTab === 'Activity Log' && editingProduct && (
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Product Activity Log</h3>
            {sectionLoading ? <p className="text-stone-400">Loading activity...</p> : activityLog.length === 0 ? <p className="text-stone-400">No activity recorded.</p> : <div className="space-y-2">{activityLog.map((a, i) => <div key={i} className="p-3 bg-stone-50 border border-stone-100 rounded flex justify-between"><div><b>{a.action}</b><p className="text-stone-500">{a.remarks}</p></div><span className="text-stone-400">{a.user}</span></div>)}</div>}
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-stone-900 font-medium">Products</h2>
          <p className="text-xs text-stone-500 mt-1">
            Complete inventory manager. Edit any row to open the full product editor with availability calendar.
          </p>
        </div>
        <button
          onClick={startAdding}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white text-xs font-semibold rounded cursor-pointer transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search products by title, designer, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 bg-white border border-[#eae1d8] rounded text-xs text-stone-700 font-semibold outline-none focus:border-[#c5a880]"
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-400 font-sans uppercase font-bold text-[10px] border-b border-stone-150 tracking-wider">
                <th className="px-5 py-3.5">Asset</th>
                <th className="px-5 py-3.5">Product Name</th>
                <th className="px-5 py-3.5">Designer</th>
                <th className="px-5 py-3.5">Modes</th>
                <th className="px-5 py-3.5">Rates / Prices</th>
                <th className="px-5 py-3.5">Condition</th>
                <th className="px-5 py-3.5">Calendar Status</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600 font-sans">
              {loading ? <tr><td colSpan={9} className="px-5 py-12 text-center text-stone-400">Loading products from API...</td></tr> : filteredProducts.length === 0 ? <tr><td colSpan={9} className="px-5 py-12 text-center text-stone-400">No products found.</td></tr> : filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-[#fcf9f5] transition">
                  <td className="px-5 py-3">
                    <img src={p.images[0]} alt={p.name} className="h-10 w-10 object-cover rounded-md border border-stone-150" />
                  </td>
                  <td className="px-5 py-3 font-bold text-stone-850 max-w-[180px] truncate">{p.name}</td>
                  <td className="px-5 py-3 font-semibold text-[#c5a880]">{p.designer}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      {p.listingModes.map(m => (
                        <span key={m} className="px-1.5 py-0.2 rounded bg-stone-50 border border-stone-200 text-[8px] uppercase tracking-wider font-bold">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {p.rentalPrice > 0 ? (
                      <div className="font-semibold text-stone-800">
                        ₹{p.rentalPrice.toLocaleString('en-IN')} / 4d
                        <p className="text-[9px] text-stone-400 font-normal">Deposit: ₹{p.securityDeposit.toLocaleString('en-IN')}</p>
                      </div>
                    ) : (
                      <span className="font-semibold text-stone-800">₹{p.listingPrice.toLocaleString('en-IN')} Sale</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-stone-500 font-medium">{p.condition}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                      p.availability === 'Available Now'
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {p.availability}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                      p.status === 'Live' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-stone-50 text-stone-500 border border-stone-200'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => startEditing(p)}
                      className="px-2.5 py-1.5 border border-stone-200 hover:border-[#c5a880] text-stone-600 hover:text-stone-900 rounded bg-white hover:bg-stone-50 transition cursor-pointer font-semibold inline-flex items-center gap-1 text-[11px]"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
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
