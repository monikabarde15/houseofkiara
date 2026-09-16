import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Product, Lister } from '../types/product';
import * as productApi from '../../services/productApi';
import { getDesigners } from '../../services/designerApi';
import { useProductEditor } from '../hooks/useProductEditor';
import { ProductHeader } from './ProductHeader';
import { ProductFilters } from './ProductFilters';
import { ProductTable } from './ProductTable';
import { ProductTabs } from './ProductTabs';
import { CoreDetailsTab } from './tabs/CoreDetailsTab';
import { PricingTaxTab } from './tabs/PricingTaxTab';
import { ImagesTab } from './tabs/ImagesTab';
import { SEOTab } from './tabs/SEOTab';
import { RelatedProductsTab } from './tabs/RelatedProductsTab';
import { AvailabilityCalendarTab } from './tabs/AvailabilityCalendarTab';
import { PayoutHistoryTab } from './tabs/PayoutHistoryTab';
import { ActivityLogTab } from './tabs/ActivityLogTab';
import { ProductSidebar } from './ProductSidebar';
import toast from 'react-hot-toast';

type ProductTab = 'Core' | 'Pricing' | 'Images' | 'Related Products' | 'SEO' | 'Calendar' | 'Payout History' | 'Activity Log';

interface ProductsViewProps {
  products: Product[];
  orders?: any[];
  offers?: any[];
  promoCodes?: any[];
  loading?: boolean;
  onAddProduct: (newProduct: Product) => Promise<any> | any;
  onUpdateProduct: (updatedProduct: Product) => Promise<any> | any;
  listers: any[];
  onEditingChange?: (isEditing: boolean) => void;
  onViewOrder?: (orderId: string) => void;
  onAddCustomer?: (newCustomer: any) => void;
  onAddOrder?: (newOrder: any) => void;
  customers?: any[];
}

const CATEGORIES = ['All Categories', 'Bridal Lehenga', 'Lehenga', 'Anarkali', 'Sherwani', 'Saree'];

export default function ProductsView({
  products,
  orders = [],
  offers = [],
  promoCodes = [],
  loading = false,
  onAddProduct,
  onUpdateProduct,
  listers,
  onEditingChange,
  onViewOrder,
  onAddCustomer,
  onAddOrder,
  customers = [],
}: ProductsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isFinalSaving, setIsFinalSaving] = useState(false);

  const [selectedMode, setSelectedMode] = useState('All Modes');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [sortOption, setSortOption] = useState('Sort: Recent');
  const [dbDesigners, setDbDesigners] = useState<any[]>([]);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        setDbDesigners(await getDesigners());
      } catch (e) {
        console.warn('Failed to fetch designers:', e);
      }
    };
    fetchDesigners();
  }, []);

  const {
    state,
    formData,
    setFormData,
    startEditing,
    startAdding,
    setActiveTab,
    updateFormField,
    cancelEditing,
    setUploadingImages,
  } = useProductEditor();

  const resetForm = () => {
    setFormData({});
    console.log("🔄 Form reset for new product.");
  };

  const fetchProduct = async (productId: string) => {
    try {
      console.log('📤 Fetching product:', productId);
      const productData = await productApi.getProductById(productId);
      if (productData) {
        console.log('✅ Product fetched:', productData);
        const safeData = {
          ...productData,
          id: productData.id || productData._id || productData.productId,
          _id: productData._id || productData.id || productData.productId,
        };
        startEditing(safeData);
        await new Promise((r) => setTimeout(r, 100));
        setFormData(safeData);
        updateFormField('name', safeData.name || '');
        updateFormField('designer', safeData.designer || '');
        updateFormField('listerId', safeData.listerId || '');
        updateFormField('productId', safeData.productId || '');
        updateFormField('_id', safeData._id || '');
        setActiveTab('Core');
        console.log('✅ Product loaded successfully with ID:', safeData.productId);
      } else {
        toast.error(`Product with ID ${productId} not found`);
      }
    } catch (error: any) {
      console.error('❌ Error fetching product:', error);
      toast.error(error.message || 'Error connecting to server');
    }
  };

  const isEditing = !!(state.editingProduct || state.isAdding);
  useEffect(() => {
    onEditingChange?.(isEditing);
  }, [isEditing, onEditingChange]);

  useEffect(() => {
    if (state.editingProduct) {
      const updatedInList = products.find(p => p.id === state.editingProduct?.id || (p as any)._id === state.editingProduct?._id || p.productId === state.editingProduct?.productId);
      if (updatedInList) {
        startEditing(updatedInList);
      }
    }
  }, [products]);

  const validProducts = products.filter(p => p.id && p.name && p.name !== 'undefined');

  const filteredProducts = validProducts.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    const pName = p.name || '';
    const pDesigner = p.designer || '';
    const pCategory = p.category || '';
    const pListingModes = p.listingModes || [];

    const matchesSearch =
      !term ||
      pName.toLowerCase().includes(term) ||
      pDesigner.toLowerCase().includes(term) ||
      pCategory.toLowerCase().includes(term) ||
      (p.sku && (p.sku || '').toLowerCase().includes(term)) ||
      (p.id && (p.id || '').toLowerCase().includes(term));

    const matchesCat = selectedCategory === 'All Categories' || p.category === selectedCategory;
    const matchesMode = selectedMode === 'All Modes' || pListingModes.includes(selectedMode as any);
    const matchesStatus =
      selectedStatus === 'All Statuses' ||
      (p.status as string) === selectedStatus ||
      (selectedStatus === 'Sold' && ((p.status as string) === 'Sold' || pName.includes('Sherwani')));

    return matchesSearch && matchesCat && matchesMode && matchesStatus;
  }).sort((a, b) => {
    if (sortOption === 'Price: Low to High') {
      const priceA = a.rentalPrice || a.listingPrice || 0;
      const priceB = b.rentalPrice || b.listingPrice || 0;
      return priceA - priceB;
    }
    if (sortOption === 'Price: High to Low') {
      const priceA = a.rentalPrice || a.listingPrice || 0;
      const priceB = b.rentalPrice || b.listingPrice || 0;
      return priceB - priceA;
    }
    if (sortOption === 'Name: A-Z') {
      return a.name.localeCompare(b.name);
    }
    return 0; // Default: Recent
  });

  const handleEditWithTab = (product: Product, initialTab?: ProductTab) => {
    startEditing(product);
    if (initialTab) {
      setActiveTab(initialTab);
    }
  };

  const handleSave = async () => {
    if (isSaving || isFinalSaving) {
      console.log('⏳ Save already in progress...');
      return;
    }

    if (!formData.name?.trim() || formData.name.trim().length < 3) {
      toast.error('Listing title must be at least 3 characters.');
      return;
    }
    if (!formData.designer?.trim()) {
      toast.error('Designer / Brand is required.');
      return;
    }
    if (!formData.listingModes?.length) {
      toast.success('Select at least one listing mode.');
      return;
    }
    if (formData.listingModes?.includes('RENTAL') && Number(formData.rentalPrice || 0) <= 0) {
      toast.error('Rental price must be greater than zero for Rental listings.');
      return;
    }
    if (
      (formData.listingModes?.includes('BUY NEW') || formData.listingModes?.includes('PRELOVED')) &&
      Number(formData.listingPrice || 0) <= 0
    ) {
      toast.error('Listing price must be greater than zero for Buy / Preloved listings.');
      return;
    }
    if (Number(formData.commissionRate || 0) < 0 || Number(formData.commissionRate || 0) > 100) {
      toast.error('Commission must be between 0% and 100%.');
      return;
    }

    setIsSaving(true);
    setIsFinalSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      let savedProduct: Product | null = null;

      if (state.isAdding) {
        const newProduct: Product = {
          productId: `HOK-PRD-${Date.now()}`,
          name: formData.name || '',
          designer: formData.designer || '',
          listerId: formData.listerId || undefined,
          description: formData.description || '',
          category: formData.category || 'Bridal Lehenga',
          occasion: formData.occasion || '',
          material: formData.material || '',
          embellishments: formData.embellishments || '',
          threadYarnDetail: formData.threadYarnDetail || '',
          setIncludes: formData.setIncludes || '',
          origin: formData.origin || '',
          weight: formData.weight || '',
          sizes: formData.sizes || [],
          listingModes: formData.listingModes || ['RENTAL'],
          condition: formData.condition || 'Excellent',
          availability: 'Available Now',
          status: formData.status || 'Review',
          rentalPrice: Number(formData.rentalPrice || 0),
          extendedWindowPrice: Number(formData.extendedWindowPrice || 0),
          perDayRate: Number(formData.perDayRate || 0),
          securityDeposit: Number(formData.securityDeposit || 0),
          listingPrice: Number(formData.listingPrice || 0),
          originalRetailPrice: Number(formData.originalRetailPrice || 0),
          resalePayoutPercentage: Number(formData.resalePayoutPercentage || 0),
          minimumOffer: Number(formData.minimumOffer || 0),
          commissionRate: Number(formData.commissionRate || 25),
          minimumDurationDays: Number(formData.minimumDurationDays || 4),
          extensionWindowDays: Number(formData.extensionWindowDays || 2),
          cleaningBufferDays: Number(formData.cleaningBufferDays || 2),
          preRentalBufferDays: Number(formData.preRentalBufferDays || 2),
          postRentalBufferDays: Number(formData.postRentalBufferDays || 3),
          deliveryTiming: formData.deliveryTiming || '',
          images: formData.images?.length ? formData.images : [formData.images?.[0] || ''],
          seoTitle: formData.seoTitle || '',
          seoDescription: formData.seoDescription || '',
          urlSlug: formData.urlSlug || formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
          sku: formData.sku || '',
          color: formData.color || '',
          craft: formData.craft || '',
          technique: formData.technique || '',
          story: formData.story || '',
          tags: formData.tags || [],
          taxRate: Number(formData.taxRate || 0),
          gstRate: Number(formData.gstRate || 0),
          cleaningFee: Number(formData.cleaningFee || 0),
          extensionPrice: Number(formData.extensionPrice || 0),
          payoutPercentage: Number(formData.payoutPercentage || 0),
          payoutTerms: formData.payoutTerms || '',
          measurements: {
            bust: formData.measurements?.bust || '',
            waist: formData.measurements?.waist || '',
            hips: formData.measurements?.hips || '',
            length: formData.measurements?.length || '',
          },
          measurementsCm: formData.measurementsCm || {},
          bestSuitedForHeight: formData.bestSuitedForHeight || '',
          subtitle: formData.subtitle || '',
          honestDisclosure: formData.honestDisclosure || '',
          relatedProductIds: formData.relatedProductIds || [],
          blockedDates: formData.blockedDates || [],
          bookingHistory: formData.bookingHistory || [],
          externalBookings: formData.externalBookings || [],
          activityLog: formData.activityLog || [],
          timesRented: 0,
          rating: 0,
          reviewCount: 0,
          ...formData,
        };

        const result = await onAddProduct(newProduct);
        savedProduct = result as Product;
        console.log('✅ Product created:', savedProduct);

      } else if (state.editingProduct) {
        const updated: Product = {
          ...state.editingProduct,
          ...formData,
          name: formData.name || state.editingProduct.name,
          designer: formData.designer || state.editingProduct.designer,
          listerId: formData.listerId !== undefined ? (formData.listerId || undefined) : state.editingProduct.listerId,
          description: formData.description !== undefined ? formData.description : state.editingProduct.description,
          category: formData.category || state.editingProduct.category,
          occasion: formData.occasion !== undefined ? formData.occasion : state.editingProduct.occasion,
          material: formData.material !== undefined ? formData.material : state.editingProduct.material,
          embellishments: formData.embellishments !== undefined ? formData.embellishments : state.editingProduct.embellishments,
          sizes: formData.sizes || state.editingProduct.sizes,
          listingModes: formData.listingModes || state.editingProduct.listingModes || ['RENTAL'],
          condition: formData.condition || state.editingProduct.condition,
          status: formData.status || state.editingProduct.status,
          rentalPrice: Number(formData.rentalPrice ?? state.editingProduct.rentalPrice ?? 0),
          securityDeposit: Number(formData.securityDeposit ?? state.editingProduct.securityDeposit ?? 0),
          listingPrice: Number(formData.listingPrice ?? state.editingProduct.listingPrice ?? 0),
          commissionRate: Number(formData.commissionRate ?? state.editingProduct.commissionRate ?? 25),
          cleaningBufferDays: Number(formData.cleaningBufferDays ?? state.editingProduct.cleaningBufferDays ?? 2),
          preRentalBufferDays: Number(formData.preRentalBufferDays ?? state.editingProduct.preRentalBufferDays ?? 2),
          postRentalBufferDays: Number(formData.postRentalBufferDays ?? state.editingProduct.postRentalBufferDays ?? 3),
          deliveryTiming: formData.deliveryTiming !== undefined ? formData.deliveryTiming : state.editingProduct.deliveryTiming,
          images: formData.images?.length ? formData.images : state.editingProduct.images,
          seoTitle: formData.seoTitle !== undefined ? formData.seoTitle : (state.editingProduct.seoTitle || ''),
          seoDescription: formData.seoDescription !== undefined ? formData.seoDescription : (state.editingProduct.seoDescription || ''),
          urlSlug: formData.urlSlug || state.editingProduct.urlSlug || '',
          sku: formData.sku !== undefined ? formData.sku : (state.editingProduct.sku || ''),
          color: formData.color !== undefined ? formData.color : (state.editingProduct.color || ''),
          craft: formData.craft !== undefined ? formData.craft : (state.editingProduct.craft || ''),
          technique: formData.technique !== undefined ? formData.technique : (state.editingProduct.technique || ''),
          story: formData.story !== undefined ? formData.story : (state.editingProduct.story || ''),
          tags: formData.tags || state.editingProduct.tags || [],
          taxRate: Number(formData.taxRate ?? state.editingProduct.taxRate ?? 0),
          gstRate: Number(formData.gstRate ?? state.editingProduct.gstRate ?? 0),
          cleaningFee: Number(formData.cleaningFee ?? state.editingProduct.cleaningFee ?? 0),
          extensionPrice: Number(formData.extensionPrice ?? state.editingProduct.extensionPrice ?? 0),
          payoutPercentage: Number(formData.payoutPercentage ?? state.editingProduct.payoutPercentage ?? 0),
          payoutTerms: formData.payoutTerms !== undefined ? formData.payoutTerms : state.editingProduct.payoutTerms,
          measurements: {
            bust: formData.measurements?.bust !== undefined ? formData.measurements.bust : (state.editingProduct.measurements?.bust || ''),
            waist: formData.measurements?.waist !== undefined ? formData.measurements.waist : (state.editingProduct.measurements?.waist || ''),
            hips: formData.measurements?.hips !== undefined ? formData.measurements.hips : (state.editingProduct.measurements?.hips || ''),
            length: formData.measurements?.length !== undefined ? formData.measurements.length : (state.editingProduct.measurements?.length || ''),
          },
          measurementsCm: formData.measurementsCm || state.editingProduct.measurementsCm || {},
          bestSuitedForHeight: formData.bestSuitedForHeight !== undefined ? formData.bestSuitedForHeight : (state.editingProduct.bestSuitedForHeight || ''),
          subtitle: formData.subtitle !== undefined ? formData.subtitle : (state.editingProduct.subtitle || ''),
          honestDisclosure: formData.honestDisclosure !== undefined ? formData.honestDisclosure : (state.editingProduct.honestDisclosure || ''),
          relatedProductIds: formData.relatedProductIds || state.editingProduct.relatedProductIds || [],
          timesRented: formData.timesRented ?? state.editingProduct.timesRented ?? 0,
          rating: formData.rating ?? state.editingProduct.rating ?? 0,
          reviewCount: formData.reviewCount ?? state.editingProduct.reviewCount ?? 0,
          ...formData,
        };

        const result = await onUpdateProduct(updated);
        savedProduct = result as Product;
        console.log('✅ Product updated:', savedProduct);
      }

      if (savedProduct) {
        const productWithId = {
          ...savedProduct,
          productId: savedProduct.productId || savedProduct._id || savedProduct.id,
          _id: savedProduct._id || savedProduct.id || savedProduct.productId,
        };
        startEditing(productWithId);
        setFormData(productWithId);
        updateFormField('productId', productWithId.productId);
        updateFormField('_id', productWithId._id);
        console.log('✅ Product state updated with ID:', productWithId.productId);
      }

      setSaveSuccess(true);
      setIsSaving(false);
      setIsFinalSaving(false);

    } catch (error) {
      console.error('❌ Save error:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save product');
      toast.error('❌ Failed to save product!');
      setIsFinalSaving(false);
      setIsSaving(false);
    }
  };

  const handleDuplicate = async () => {
    if (!formData.productId && !state.editingProduct) {
      toast.error("No product to duplicate!");
      return;
    }
    if (isSaving || isFinalSaving) return;

    setIsSaving(true);
    setIsFinalSaving(true);

    try {
      const originalProduct = state.editingProduct || formData;
      const duplicateProduct: Product = {
        ...originalProduct,
        productId: `HOK-PRD-${Date.now()}`,
        name: `${originalProduct.name} (Draft)`,
        status: 'Draft',
        images: [...(originalProduct.images || [])],
        tags: [...(originalProduct.tags || [])],
        sizes: [...(originalProduct.sizes || [])],
        measurements: { ...(originalProduct.measurements || {}) },
        measurementsCm: { ...(originalProduct.measurementsCm || {}) },
        listingModes: [...(originalProduct.listingModes || ['RENTAL'])],
        blockedDates: [],
        bookingHistory: [],
        externalBookings: [],
        activityLog: [],
        relatedProductIds: [],
        timesRented: 0,
        rating: 0,
        reviewCount: 0,
      } as any;

      const result = await onAddProduct(duplicateProduct);
      const savedProduct = result as Product;
      console.log('✅ Duplicate created:', savedProduct);

      toast.success('📋 Product duplicated as draft!');
      setIsSaving(false);
      setIsFinalSaving(false);

    } catch (error) {
      console.error('❌ Duplicate error:', error);
      toast.error('❌ Failed to duplicate product!');
      setIsFinalSaving(false);
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!formData.productId && !state.editingProduct) {
      toast.error("No product to archive!");
      return;
    }
    if (!window.confirm('Are you sure you want to archive this product?')) return;
    if (isSaving || isFinalSaving) return;

    setIsSaving(true);
    setIsFinalSaving(true);

    try {
      const updatedProduct = {
        ...state.editingProduct,
        status: 'Archived'
      } as Product;

      const result = await onUpdateProduct(updatedProduct);
      console.log('✅ Product archived:', result);

      toast.success('🗑️ Product archived successfully!');
      setIsSaving(false);
      setIsFinalSaving(false);

    } catch (error) {
      console.error('❌ Archive error:', error);
      toast.error('❌ Failed to archive product!');
      setIsFinalSaving(false);
      setIsSaving(false);
    }
  };

  // ✅ RENDER: Editing Mode
  if (state.editingProduct || state.isAdding) {
    return (
      <div className="text-xs font-sans relative">
        <header className="sticky top-0 z-40 bg-white border-b border-[#E8E0D6]">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <button onClick={cancelEditing} className="inline-flex h-8 items-center gap-1 rounded-md border border-[#E6DED3] bg-white px-3 text-[12px] font-medium text-[#6F675D] hover:bg-[#FAF8F5]">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <div className="flex items-center gap-2 text-[13px]">
                <span className="text-[#9B9287]">Products</span>
                <span className="text-[#C3BAAF]">/</span>
                <span className="font-semibold text-[#2C2926]">{formData.name || state.editingProduct?.name || 'New Product'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!state.isAdding && (
                <button onClick={() => window.open(`/product/${state.editingProduct?.urlSlug}`, '_blank')} className="inline-flex h-9 items-center gap-2 rounded-md border border-[#E5DDD3] bg-white px-4 text-[13px] font-medium text-[#38332D] hover:bg-[#FAF8F5]">
                  <ExternalLink className="h-4 w-4" /> View Live Site
                </button>
              )}
              <button onClick={handleSave} disabled={isSaving || isFinalSaving} className={`inline-flex h-9 items-center rounded-md px-5 text-[13px] font-semibold text-[#2B2218] transition-all duration-200 ${(isSaving || isFinalSaving) ? 'bg-gray-300 cursor-not-allowed opacity-70' : 'bg-[#C7A55C] hover:bg-[#B9974B] active:scale-95'}`}>
                {(isSaving || isFinalSaving) ? (
                  <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#2B2218]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Saving...</>
                ) : ('Save Changes')}
              </button>
            </div>
          </div>
        </header>

        <div className="h-[57px]" />

        <div className="px-6 pt-6 space-y-6">
          <div>
            {(() => {
              const history = (state.editingProduct?.bookingHistory || []) as any[];
              const activeBooking = history.find(b => b.startDate && b.endDate && b.status !== 'Cancelled');
              const timesRented = state.editingProduct?.timesRented || history.length || 0;
              const bookingEarned = history
                .filter(b => b.status === 'Confirmed' || b.status === 'Completed' || b.status === 'Delivered' || b.amount)
                .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
              const earnedAmount = (state.editingProduct as any)?.earnedAmount !== undefined
                ? Number((state.editingProduct as any).earnedAmount)
                : bookingEarned;

              let rentalStatus = 'Not Rented';
              let currentRenterName: string | undefined;
              let currentOrderId: string | undefined;
              let rentUntil: string | undefined;
              let nextFreeDate: string | undefined;

              if (activeBooking) {
                rentalStatus = 'In Rental';
                currentRenterName = activeBooking.customerName;
                currentOrderId = activeBooking.orderId;
                rentUntil = activeBooking.endDate;
                const endD = new Date(activeBooking.endDate);
                if (!isNaN(endD.getTime())) {
                  endD.setDate(endD.getDate() + 3);
                  nextFreeDate = endD.toISOString().slice(0, 10);
                }
              }

              return (
                <ProductHeader
                  isEditing={!!state.editingProduct}
                  isAdding={state.isAdding}
                  productName={state.editingProduct?.name || formData.name}
                  designer={state.editingProduct?.designer || formData.designer}
                  sku={state.editingProduct?.sku || formData.sku}
                  listingMode={state.editingProduct?.listingModes?.[0] || formData.listingModes?.[0]}
                  condition={state.editingProduct?.condition || formData.condition}
                  size={state.editingProduct?.sizes?.[0] || formData.sizes?.[0]}
                  status={state.editingProduct?.status || formData.status}
                  listerName={
                    state.editingProduct?.listerName ||
                    listers.find((l: any) => (l.listerId || l._id || l.id) === (formData.listerId || state.editingProduct?.listerId) || l.name === (formData.listerId || state.editingProduct?.listerId))?.name ||
                    formData.listerId ||
                    state.editingProduct?.listerId
                  }
                  rentedCount={timesRented}
                  rentalStatus={rentalStatus}
                  currentRenterName={currentRenterName}
                  currentOrderId={currentOrderId}
                  rentUntil={rentUntil}
                  nextFreeDate={nextFreeDate}
                  earnedAmount={earnedAmount}
                  isSaving={isFinalSaving}
                  onSave={handleSave}
                  onAdd={startAdding}
                  showAddButton={false}
                  onDuplicate={handleDuplicate}
                  onArchive={handleArchive}
                />
              );
            })()}
            <div className="mt-4">
              <ProductTabs activeTab={state.activeTab} onTabChange={setActiveTab} isAdding={state.isAdding} />
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="min-w-0 flex-1 space-y-6">
              {state.activeTab === 'Core' && (
                <CoreDetailsTab
                  formData={formData}
                  onFieldChange={updateFormField}
                  listers={listers}
                  designers={dbDesigners}
                  onSave={(savedProduct) => {
                    if (savedProduct) {
                      const productWithId = { ...savedProduct, productId: savedProduct.productId || savedProduct._id || savedProduct.id, _id: savedProduct._id || savedProduct.id || savedProduct.productId };
                      startEditing(productWithId);
                      setFormData(productWithId);
                      updateFormField('productId', productWithId.productId);
                      updateFormField('_id', productWithId._id);
                    }
                    handleSave();
                  }}
                  productId={state.editingProduct?.productId}
                  isSaving={isFinalSaving}
                />
              )}
              {state.activeTab === 'Pricing' && (<PricingTaxTab formData={formData} onFieldChange={updateFormField} isAdding={state.isAdding} />)}
              {state.activeTab === 'Images' && (<ImagesTab formData={formData} onFieldChange={updateFormField} uploadingImages={state.uploadingImages} setUploadingImages={setUploadingImages} />)}
              {state.activeTab === 'Related Products' && (<RelatedProductsTab formData={formData} onFieldChange={updateFormField} allProducts={products} currentProductId={state.editingProduct?._id} />)}
              {state.activeTab === 'SEO' && (<SEOTab formData={formData} onFieldChange={updateFormField} />)}
              {state.activeTab === 'Calendar' && state.editingProduct && (
                <AvailabilityCalendarTab
                  editingProduct={state.editingProduct}
                  onUpdateProduct={(updatedProd) => {
                    startEditing(updatedProd);
                    setFormData(updatedProd);
                  }}
                  onOpenGlobalCalendar={() => { }}
                  orders={orders}
                  offers={offers}
                  promoCodes={promoCodes}
                  loading={state.loading}
                  onViewOrder={onViewOrder}
                  customers={customers}
                  onAddOrder={(newOrder) => {
                    if (onUpdateProduct) {
                      onUpdateProduct({
                        ...state.editingProduct!,
                        bookingHistory: [...(state.editingProduct?.bookingHistory || []), newOrder]
                      } as any);
                    }
                    if (onAddOrder) {
                      onAddOrder(newOrder);
                    }
                  }}
                  onAddCustomer={onAddCustomer}
                />
              )}
              {state.activeTab === 'Payout History' && (state.editingProduct || state.isAdding) && (
                <PayoutHistoryTab
                  payoutHistory={state.editingProduct ? state.payoutHistory : []}
                  loading={state.editingProduct ? state.loading : false}
                  isAdding={state.isAdding}
                />
              )}
              {state.activeTab === "Activity Log" && (
                state.isAdding ? (
                  <div className="overflow-hidden rounded-lg border border-[#E8E0D6] bg-white shadow-sm">
                    <div className="border-b border-[#EEE8E1] px-5 py-3">
                      <h3 className="text-[15px] font-semibold text-[#2F2B27]">Activity Log</h3>
                    </div>
                    <div className="px-5 py-6">
                      <p className="text-[13px] text-[#9B9388]">No activity yet — this piece's story starts here.</p>
                    </div>
                  </div>
                ) : state.editingProduct ? (
                  <ActivityLogTab activityLog={state.activityLog} loading={state.loading} />
                ) : null
              )}
            </div>

            {(state.editingProduct || state.isAdding) && (
              <div className="w-full lg:w-[340px] lg:shrink-0">
                <ProductSidebar
                  product={(state.editingProduct || formData) as Product}
                  isNew={state.isAdding}
                  onViewLive={() =>
                    state.editingProduct?.urlSlug &&
                    window.open(`/product/${state.editingProduct.urlSlug}`, '_blank')
                  }
                  onArchive={() => {
                    if (!state.editingProduct) return;
                    if (confirm('Archive this product?')) {
                      updateFormField('status', 'Archived');
                      handleSave();
                    }
                  }}
                  onOpenGlobalCalendar={() => {
                    console.log('Open global rental calendar');
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const liveCount = filteredProducts.filter(p => p.status === 'Live' || p.status === 'Active' || p.status === 'Published').length;
  const draftCount = filteredProducts.filter(p => p.status === 'Draft' || p.status === 'Pending Review').length;
  const pausedCount = filteredProducts.filter(p => p.status === 'Archived' || p.status === 'Paused' || p.status === 'Inactive').length;

  // Dynamic portfolio revenue calculation using real DB orders prop
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.orderValue || o.grandTotal || o.amount || 0), 0);
  const hokRetained = orders.reduce((sum, o) => {
    const val = Number(o.orderValue || o.grandTotal || o.amount || 0);
    const listerPayout = Number(o.listerPayout || Math.round(val * 0.45));
    return sum + (val - listerPayout);
  }, 0);

  // Active rentals count from DB orders
  const inRental = orders.filter(o => o.status === 'Confirmed' || o.status === 'Dispatched' || o.status === 'Shipped' || o.status === 'In Rental').length;
  const needsAttention = filteredProducts.filter(p => p.status === 'Pending Review' || p.status === 'Review' || p.status === 'Draft').length;

  return (
    <div className="space-y-6 text-xs font-sans">
      <ProductHeader isEditing={false} isAdding={false} onBack={() => { }} onSave={() => { }} onAdd={startAdding} />

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={CATEGORIES}
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onAddProduct={startAdding}
      />

      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="space-y-5 text-xs font-sans p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#EBE5DF] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="text-[11px] font-semibold tracking-wider text-[#8C847A] uppercase">LIVE PIECES</div>
              <div className="text-[26px] font-serif text-[#2B2520] font-normal my-0.5 leading-tight">{liveCount}</div>
              <div className="text-[12px] text-[#8A8177]">{draftCount} draft · {pausedCount} paused</div>
            </div>
            <div className="bg-white border border-[#EBE5DF] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="text-[11px] font-semibold tracking-wider text-[#8C847A] uppercase">PORTFOLIO REVENUE (PAID)</div>
              <div className="text-[26px] font-serif text-[#2B2520] font-normal my-0.5 leading-tight">₹{totalRevenue.toLocaleString('en-IN')}</div>
              <div className="text-[12px] text-[#8A8177]">HOK retained ₹{hokRetained.toLocaleString('en-IN')}</div>
            </div>
            <div className="bg-white border border-[#EBE5DF] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="text-[11px] font-semibold tracking-wider text-[#8C847A] uppercase">IN RENTAL TODAY</div>
              <div className="text-[26px] font-serif text-[#C04838] font-normal my-0.5 leading-tight">{inRental}</div>
              <div className="text-[12px] text-[#8A8177]">active rentals</div>
            </div>
            <div className="bg-white border border-[#EBE5DF] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="text-[11px] font-semibold tracking-wider text-[#8C847A] uppercase">NEEDS ATTENTION</div>
              <div className="text-[26px] font-serif text-[#C04838] font-normal my-0.5 leading-tight">{needsAttention}</div>
              <div className="text-[12px] text-[#8A8177]">flagged on the rows below</div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#EBE5DF] shadow-sm overflow-hidden">
            <ProductTable
              products={filteredProducts}
              loading={loading}
              onEdit={handleEditWithTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
