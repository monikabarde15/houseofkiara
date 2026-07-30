// src/components/products/ProductsView.tsx

import React, { useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Product, Lister, ProductTab } from '../types/product';
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

interface ProductsViewProps {
  products: Product[];
  loading?: boolean;
  onAddProduct: (newProduct: Product) => void | Promise<void>;
  onUpdateProduct: (updatedProduct: Product) => void | Promise<void>;
  listers: Lister[];
  onEditingChange?: (isEditing: boolean) => void;
}

const CATEGORIES = ['All Categories', 'Bridal Lehenga', 'Lehenga', 'Anarkali', 'Sherwani', 'Saree'];

export default function ProductsView({
  products,
  loading = false,
  onAddProduct,
  onUpdateProduct,
  listers,
  onEditingChange,
}: ProductsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedMode, setSelectedMode] = useState('All Modes');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [sortOption, setSortOption] = useState('Sort: Recent');

  const {
    state,
    formData,
    startEditing,
    startAdding,
    setActiveTab,
    updateFormField,
    cancelEditing,
    setUploadingImages,
  } = useProductEditor();

  const isEditing = !!(state.editingProduct || state.isAdding);

  React.useEffect(() => {
    onEditingChange?.(isEditing);
  }, [isEditing, onEditingChange]);

  const handleEditWithTab = (product: Product, initialTab?: ProductTab) => {
    startEditing(product);
    if (initialTab) {
      setActiveTab(initialTab);
    }
  };

  const filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.designer.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      (p.sku && p.sku.toLowerCase().includes(term)) ||
      p.id.toLowerCase().includes(term);

    const matchesCat = selectedCategory === 'All Categories' || p.category === selectedCategory;
    const matchesMode = selectedMode === 'All Modes' || p.listingModes.includes(selectedMode as any);
    const matchesStatus =
      selectedStatus === 'All Statuses' ||
      (p.status as string) === selectedStatus ||
      (selectedStatus === 'Sold' && ((p.status as string) === 'Sold' || p.name.includes('Sherwani')));

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

  const handleSave = async () => {
    // Validation
    if (!formData.name?.trim() || formData.name.trim().length < 3) {
      return alert('Listing title must be at least 3 characters.');
    }
    if (!formData.designer?.trim()) {
      return alert('Designer / Brand is required.');
    }
    if (!formData.listingModes?.length) {
      return alert('Select at least one listing mode.');
    }
    if (formData.listingModes?.includes('Rental') && Number(formData.rentalPrice || 0) <= 0) {
      return alert('Rental price must be greater than zero for Rental listings.');
    }
    if (
      (formData.listingModes?.includes('Buy') || formData.listingModes?.includes('Preloved')) &&
      Number(formData.listingPrice || 0) <= 0
    ) {
      return alert('Listing price must be greater than zero for Buy / Preloved listings.');
    }
    if (Number(formData.commissionRate || 0) < 0 || Number(formData.commissionRate || 0) > 100) {
      return alert('Commission must be between 0% and 100%.');
    }

    if (state.isAdding) {
      const newProduct: Product = {
        id: 'HOK-PRD-' + Math.floor(100 + Math.random() * 900),
        name: formData.name || '',
        designer: formData.designer || '',
        listerId: formData.listerId || undefined,
        listerName: listers.find(l => l.id === formData.listerId)?.name || undefined,
        description: formData.description || '',
        category: formData.category || 'Bridal Lehenga',
        occasion: formData.occasion || '',
        material: formData.material || '',
        embellishments: formData.embellishments || '',
        sizes: formData.sizes || [],
        listingModes: formData.listingModes || ['Rental'],
        condition: formData.condition || 'Excellent',
        availability: 'Available Now',
        status: formData.status || 'Review',
        rentalPrice: Number(formData.rentalPrice || 0),
        securityDeposit: Number(formData.securityDeposit || 0),
        listingPrice: Number(formData.listingPrice || 0),
        commissionRate: Number(formData.commissionRate || 25),
        minimumDurationDays: 4,
        extensionWindowDays: 2,
        cleaningBufferDays: Number(formData.cleaningBufferDays || 2),
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
        cleaningFee: Number(formData.cleaningFee || 0),
        extensionPrice: Number(formData.extensionPrice || 0),
        measurements: {
          bust: formData.measurements?.bust || '',
          waist: formData.measurements?.waist || '',
          hips: formData.measurements?.hips || '',
          length: formData.measurements?.length || '',
        },
        relatedProductIds: formData.relatedProductIds || [],
        blockedDates: [],
      };
      await onAddProduct(newProduct);
      alert('Product added successfully!');
    } else if (state.editingProduct) {
      const updated: Product = {
        ...state.editingProduct,
        name: formData.name || state.editingProduct.name,
        designer: formData.designer || state.editingProduct.designer,
        listerId: formData.listerId || undefined,
        listerName: listers.find(l => l.id === formData.listerId)?.name || undefined,
        description: formData.description || state.editingProduct.description,
        category: formData.category || state.editingProduct.category,
        occasion: formData.occasion || state.editingProduct.occasion,
        material: formData.material || state.editingProduct.material,
        embellishments: formData.embellishments || state.editingProduct.embellishments,
        sizes: formData.sizes || state.editingProduct.sizes,
        listingModes: formData.listingModes || state.editingProduct.listingModes,
        condition: formData.condition || state.editingProduct.condition,
        status: formData.status || state.editingProduct.status,
        rentalPrice: Number(formData.rentalPrice ?? state.editingProduct.rentalPrice),
        securityDeposit: Number(formData.securityDeposit ?? state.editingProduct.securityDeposit),
        listingPrice: Number(formData.listingPrice ?? state.editingProduct.listingPrice),
        commissionRate: Number(formData.commissionRate ?? state.editingProduct.commissionRate),
        cleaningBufferDays: Number(formData.cleaningBufferDays ?? state.editingProduct.cleaningBufferDays),
        images: formData.images?.length ? formData.images : state.editingProduct.images,
        seoTitle: formData.seoTitle || state.editingProduct.seoTitle || '',
        seoDescription: formData.seoDescription || state.editingProduct.seoDescription || '',
        urlSlug: formData.urlSlug || state.editingProduct.urlSlug || '',
        sku: formData.sku || state.editingProduct.sku || '',
        color: formData.color || state.editingProduct.color || '',
        craft: formData.craft || state.editingProduct.craft || '',
        technique: formData.technique || state.editingProduct.technique || '',
        story: formData.story || state.editingProduct.story || '',
        tags: formData.tags || state.editingProduct.tags || [],
        taxRate: Number(formData.taxRate ?? (state.editingProduct.taxRate || 0)),
        cleaningFee: Number(formData.cleaningFee ?? (state.editingProduct.cleaningFee || 0)),
        extensionPrice: Number(formData.extensionPrice ?? (state.editingProduct.extensionPrice || 0)),
        measurements: {
          bust: formData.measurements?.bust || state.editingProduct.measurements?.bust || '',
          waist: formData.measurements?.waist || state.editingProduct.measurements?.waist || '',
          hips: formData.measurements?.hips || state.editingProduct.measurements?.hips || '',
          length: formData.measurements?.length || state.editingProduct.measurements?.length || '',
        },
        relatedProductIds: formData.relatedProductIds || state.editingProduct.relatedProductIds || [],
      };
      await onUpdateProduct(updated);
      alert('Product details updated!');
    }
    cancelEditing();
  };

  // ================= Editor view (adding or editing a product) =================
  if (state.editingProduct || state.isAdding) {
    return (
      <div className="text-xs font-sans">
        <header className="border-b border-[#E8E0D6] bg-white px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={cancelEditing}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-[#E6DED3] bg-white px-3 text-[12px] font-medium text-[#6F675D] hover:bg-[#FAF8F5]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
              <div className="flex items-center gap-2 text-[13px]">
                <span className="text-[#9B9287]">Products</span>
                <span className="text-[#C3BAAF]">/</span>
                <span className="font-semibold text-[#2C2926]">
                  {formData.name || state.editingProduct?.name || 'New Product'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!state.isAdding && (
                <button
                  onClick={() => window.open(`/product/${state.editingProduct?.urlSlug}`, '_blank')}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-[#E5DDD3] bg-white px-4 text-[13px] font-medium text-[#38332D] hover:bg-[#FAF8F5]"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Live Site
                </button>
              )}
              <button
                onClick={handleSave}
                className="inline-flex h-9 items-center rounded-md bg-[#C7A55C] px-5 text-[13px] font-semibold text-[#2B2218] hover:bg-[#B9974B]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </header>

        <div className="px-6 pt-6 space-y-6">
          <div>
            <ProductHeader
              isEditing={!!state.editingProduct}
              isAdding={state.isAdding}
              productName={formData.name}
              onSave={handleSave}
              onAdd={startAdding}
              showAddButton={false}
            />

            <div className="mt-4">
              <ProductTabs
                activeTab={state.activeTab}
                onTabChange={setActiveTab}
                isAdding={state.isAdding}
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 space-y-6">
              {state.activeTab === 'Core' && (
                <CoreDetailsTab formData={formData} onFieldChange={updateFormField} listers={listers} />
              )}
              {state.activeTab === 'Pricing' && (
                <PricingTaxTab formData={formData} onFieldChange={updateFormField} />
              )}
              {state.activeTab === 'Images' && (
                <ImagesTab
                  formData={formData}
                  onFieldChange={updateFormField}
                  uploadingImages={state.uploadingImages}
                  setUploadingImages={setUploadingImages}
                />
              )}
              {state.activeTab === 'Related Products' && (
                <RelatedProductsTab
                  formData={formData}
                  onFieldChange={updateFormField}
                  allProducts={products}
                  currentProductId={state.editingProduct?.id}
                />
              )}
              {state.activeTab === 'SEO' && (
                <SEOTab formData={formData} onFieldChange={updateFormField} />
              )}
              {state.activeTab === 'Calendar' && state.editingProduct && (
                <AvailabilityCalendarTab
                  editingProduct={state.editingProduct}
                  onUpdateProduct={onUpdateProduct}
                  loading={state.loading}
                />
              )}
              {state.activeTab === 'Payout History' && state.editingProduct && (
                <PayoutHistoryTab payoutHistory={state.payoutHistory} loading={state.loading} />
              )}
              {state.activeTab === 'Activity Log' && state.editingProduct && (
                <ActivityLogTab activityLog={state.activityLog} loading={state.loading} />
              )}
            </div>

            {state.editingProduct && (
              <ProductSidebar
                product={state.editingProduct}
                onViewLive={() => window.open(`/product/${state.editingProduct?.urlSlug}`, '_blank')}
                onArchive={() => {
                  if (confirm('Archive this product?')) {
                    updateFormField('status', 'Archived');
                    handleSave();
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ================= Main products list view =================
  return (
    <div className="space-y-5 text-xs font-sans">

      
      {/* Header section with Catalogue title and View Live / Save buttons */}
      <ProductHeader
        isEditing={false}
        isAdding={false}
        onSave={handleSave}
        onAdd={startAdding}
      />

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-[#EBE5DF] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-semibold tracking-wider text-[#8C847A] uppercase">
            LIVE PIECES
          </div>
          <div className="text-[26px] font-serif text-[#2B2520] font-normal my-0.5 leading-tight">
            5
          </div>
          <div className="text-[12px] text-[#8A8177]">
            1 draft · 1 paused
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-[#EBE5DF] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-semibold tracking-wider text-[#8C847A] uppercase">
            PORTFOLIO REVENUE (PAID)
          </div>
          <div className="text-[26px] font-serif text-[#2B2520] font-normal my-0.5 leading-tight">
            ₹55,000
          </div>
          <div className="text-[12px] text-[#8A8177]">
            HOK retained ₹15,875
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-[#EBE5DF] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-semibold tracking-wider text-[#8C847A] uppercase">
            IN RENTAL TODAY
          </div>
          <div className="text-[26px] font-serif text-[#C04838] font-normal my-0.5 leading-tight">
            2
          </div>
          <div className="text-[12px] text-[#8A8177]">
            2 booked in next 7 days
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-[#EBE5DF] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="text-[11px] font-semibold tracking-wider text-[#8C847A] uppercase">
            NEEDS ATTENTION
          </div>
          <div className="text-[26px] font-serif text-[#C04838] font-normal my-0.5 leading-tight">
            4
          </div>
          <div className="text-[12px] text-[#8A8177]">
            flagged on the rows below
          </div>
        </div>
      </div>

      {/* Filter and toolbar section */}
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

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-[#EBE5DF] shadow-sm overflow-hidden">
        <ProductTable 
          products={filteredProducts} 
          loading={loading} 
          onEdit={handleEditWithTab} 
        />
      </div>
    </div>
  );
}