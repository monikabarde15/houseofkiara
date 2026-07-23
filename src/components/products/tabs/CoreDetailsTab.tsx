// src/components/products/tabs/CoreDetailsTab.tsx

import React from 'react';
import { Product, Lister } from '../../../types/product';

interface CoreDetailsTabProps {
  formData: Partial<Product>;
  onFieldChange: <K extends keyof Product>(field: K, value: Product[K]) => void;
  listers: Lister[];
}

export function CoreDetailsTab({ formData, onFieldChange, listers }: CoreDetailsTabProps) {
  return (
    <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
      <h3 className="font-serif font-bold text-stone-900 text-sm">Product Description & Specs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Listing Title</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => onFieldChange('name', e.target.value)}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Designer / Brand</label>
          <input
            type="text"
            value={formData.designer || ''}
            onChange={(e) => onFieldChange('designer', e.target.value)}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Lister / Owner</label>
          <select 
            value={formData.listerId || ''} 
            onChange={e => onFieldChange('listerId', e.target.value)}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
          >
            <option value="">Select lister (optional)</option>
            {listers.map(l => (
              <option key={l.id} value={l.id}>{l.name} — {l.id}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-stone-500 font-medium">Full Description</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => onFieldChange('description', e.target.value)}
            rows={4}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">SKU</label>
          <input 
            value={formData.sku || ''} 
            onChange={e => onFieldChange('sku', e.target.value)} 
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Colour</label>
          <input 
            value={formData.color || ''} 
            onChange={e => onFieldChange('color', e.target.value)} 
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Craft / Technique</label>
          <input 
            value={formData.craft || ''} 
            onChange={e => onFieldChange('craft', e.target.value)} 
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Technique</label>
          <input 
            value={formData.technique || ''} 
            onChange={e => onFieldChange('technique', e.target.value)} 
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" 
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-stone-500 font-medium">Story / Product Notes</label>
          <textarea 
            value={formData.story || ''} 
            onChange={e => onFieldChange('story', e.target.value)} 
            rows={3} 
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" 
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-stone-500 font-medium">Tags (comma separated)</label>
          <input 
            value={formData.tags?.join(', ') || ''} 
            onChange={e => onFieldChange('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} 
            placeholder="Featured, Red, New Arrival" 
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" 
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-stone-500 font-medium">Measurements (inches)</label>
          <div className="mt-1 grid grid-cols-2 md:grid-cols-4 gap-2">
            <input 
              placeholder="Bust" 
              value={formData.measurements?.bust || ''} 
              onChange={e => onFieldChange('measurements', { ...formData.measurements, bust: e.target.value })} 
              className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" 
            />
            <input 
              placeholder="Waist" 
              value={formData.measurements?.waist || ''} 
              onChange={e => onFieldChange('measurements', { ...formData.measurements, waist: e.target.value })} 
              className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" 
            />
            <input 
              placeholder="Hips" 
              value={formData.measurements?.hips || ''} 
              onChange={e => onFieldChange('measurements', { ...formData.measurements, hips: e.target.value })} 
              className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" 
            />
            <input 
              placeholder="Length" 
              value={formData.measurements?.length || ''} 
              onChange={e => onFieldChange('measurements', { ...formData.measurements, length: e.target.value })} 
              className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs" 
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Product Category</label>
          <select
            value={formData.category || 'Bridal Lehenga'}
            onChange={(e) => onFieldChange('category', e.target.value)}
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
            value={formData.occasion || ''}
            onChange={(e) => onFieldChange('occasion', e.target.value)}
            placeholder="Wedding, Sangeet..."
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Material Composition</label>
          <input
            type="text"
            value={formData.material || ''}
            onChange={(e) => onFieldChange('material', e.target.value)}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Embellishments</label>
          <input
            type="text"
            value={formData.embellishments || ''}
            onChange={(e) => onFieldChange('embellishments', e.target.value)}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Condition Grade</label>
          <input
            type="text"
            value={formData.condition || ''}
            onChange={(e) => onFieldChange('condition', e.target.value)}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Status on Storefront</label>
          <select
            value={formData.status || 'Live'}
            onChange={(e) => onFieldChange('status', e.target.value as Product['status'])}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
          >
            <option value="Live">Live / Active</option>
            <option value="Archived">Archived / Hidden</option>
            <option value="Review">Under Review</option>
          </select>
        </div>
      </div>
    </div>
  );
}