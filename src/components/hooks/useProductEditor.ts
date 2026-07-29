// src/hooks/useProductEditor.ts

import { useState, useCallback } from 'react';
import { Product, ProductTab, PayoutRecord, ActivityLog } from '../types/product';
import * as productSectionsApi from '../../services/productSectionsApi';

interface ProductEditorState {
  isAdding: boolean;
  editingProduct: Product | null;
  activeTab: ProductTab;
  loading: boolean;
  uploadingImages: boolean;
  payoutHistory: PayoutRecord[];
  activityLog: ActivityLog[];
}

export function useProductEditor() {
  const [state, setState] = useState<ProductEditorState>({
    isAdding: false,
    editingProduct: null,
    activeTab: 'Core',
    loading: false,
    uploadingImages: false,
    payoutHistory: [],
    activityLog: [],
  });

  const [formData, setFormData] = useState<Partial<Product>>({});

  const loadProductSections = useCallback(async (productId: string) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const [calendar, payout, activity] = await Promise.all([
        productSectionsApi.getCalendar(productId),
        productSectionsApi.getPayoutHistory(productId),
        productSectionsApi.getActivity(productId),
      ]);
      
      setState(prev => ({
        ...prev,
        editingProduct: prev.editingProduct 
          ? { 
              ...prev.editingProduct, 
              blockedDates: calendar.blockedDates || [], 
              bookingHistory: calendar.bookingHistory || [] 
            } 
          : null,
        payoutHistory: payout || [],
        activityLog: activity || [],
        loading: false,
      }));
    } catch (error) {
      console.error('Unable to load product sections:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const startEditing = useCallback((product: Product) => {
    setState(prev => ({
      ...prev,
      editingProduct: product,
      isAdding: false,
      activeTab: 'Core',
      payoutHistory: [],
      activityLog: [],
    }));
    setFormData(product);
    loadProductSections(product.id);
  }, [loadProductSections]);

  const startAdding = useCallback(() => {
    const defaultProduct: Partial<Product> = {
      name: '',
      designer: 'Sabyasachi',
      description: '',
      category: 'Bridal Lehenga',
      occasion: 'Wedding',
      material: 'Silk Organza',
      embellishments: 'Zardozi',
      sizes: ['S', 'M'],
      listingModes: ['Rental'],
      condition: 'Excellent',
      status: 'Review',
      rentalPrice: 5000,
      securityDeposit: 10000,
      listingPrice: 150000,
      commissionRate: 25,
      cleaningBufferDays: 2,
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=60'],
      taxRate: 0,
      cleaningFee: 0,
      extensionPrice: 0,
      relatedProductIds: [],
    };

    setState(prev => ({
      ...prev,
      editingProduct: null,
      isAdding: true,
      activeTab: 'Core',
      payoutHistory: [],
      activityLog: [],
      loading: false,
    }));
    setFormData(defaultProduct);
  }, []);

  const setActiveTab = useCallback((tab: ProductTab) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  const updateFormField = useCallback(<K extends keyof Product>(field: K, value: Product[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const cancelEditing = useCallback(() => {
    setState(prev => ({
      ...prev,
      editingProduct: null,
      isAdding: false,
      activeTab: 'Core',
    }));
    setFormData({});
  }, []);

  const setUploadingImages = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, uploadingImages: loading }));
  }, []);

  return {
    state,
    formData,
    setFormData,
    startEditing,
    startAdding,
    setActiveTab,
    updateFormField,
    cancelEditing,
    loadProductSections,
    setUploadingImages,
  };
}