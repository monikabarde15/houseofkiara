import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Search, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Category, getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryApi';
import { uploadFile } from '../services/uploadApi';

export default function CategoriesView({ onEditingChange }: { onEditingChange: (isEditing: boolean) => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCats = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (e) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const openModal = (category: Category | null) => {
    setSelectedCategory(category);
    if (category) {
      setFormData({ name: category.name, description: category.description || '', image: category.image || '' });
    } else {
      setFormData({ name: '', description: '', image: '' });
    }
    setIsModalOpen(true);
    onEditingChange(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    onEditingChange(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Name is required');
    
    setIsSubmitting(true);
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        const created = await createCategory(formData.name);
        if (formData.description || formData.image) {
          await updateCategory(created.id, { description: formData.description, image: formData.image });
        }
        toast.success('Category created successfully');
      }
      fetchCats();
      closeModal();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted');
        fetchCats();
      } catch (err) {
        toast.error('Failed to delete category');
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use formData.name if editing an existing category or typed a new one, else "uncategorized"
    const catName = formData.name.trim() || 'uncategorized';
    // Remove special chars and convert space to hyphen for folder name just in case, though backend will do it too
    const folderName = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    setIsSubmitting(true);
    toast.loading('Uploading image...', { id: 'cat-upload' });
    try {
      const uploaded = await uploadFile(file, folderName);
      setFormData(prev => ({ ...prev, image: uploaded.url }));
      toast.success('Image uploaded successfully', { id: 'cat-upload' });
    } catch (err) {
      toast.error('Failed to upload image', { id: 'cat-upload' });
    } finally {
      setIsSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">Categories</h1>
          <p className="text-sm text-stone-500">Manage product categories, descriptions, and banners.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-stone-200"
            />
          </div>
          <button
            onClick={() => openModal(null)}
            className="flex items-center gap-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(cat => (
            <div key={cat.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              <div className="h-48 bg-stone-100 relative">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                    <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                    <span className="text-xs uppercase tracking-widest font-semibold">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => openModal(cat)} className="bg-white text-stone-900 p-2 rounded-full hover:bg-stone-100 shadow-sm" title="Edit">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id, cat.name)} className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 shadow-sm" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-stone-500 line-clamp-2 flex-1">{cat.description || 'No description provided.'}</p>
                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <span>ID: {cat.id.split('-').pop()}</span>
                  <span>/{cat.slug}</span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-stone-500 bg-white rounded-xl border border-stone-200 border-dashed">
              No categories found. Try adjusting your search or add a new one.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <h2 className="font-serif text-xl font-bold text-stone-900">
                {selectedCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-stone-100 rounded-full transition-colors text-stone-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bridal Lehenga"
                  className="w-full p-2.5 bg-[#fcf9f5] border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C7A55C]/50 focus:border-[#C7A55C]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description for SEO and category page header..."
                  className="w-full p-2.5 bg-[#fcf9f5] border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C7A55C]/50 focus:border-[#C7A55C] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Category Banner Image</label>
                <div className="flex gap-4 items-start">
                  <div className="h-24 w-24 rounded-lg border border-stone-200 bg-stone-50 overflow-hidden flex-shrink-0 relative">
                    {formData.image ? (
                      <>
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="absolute top-1 right-1 bg-white rounded-full p-0.5 text-rose-500 hover:text-rose-600 shadow-sm">
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <ImageIcon className="h-6 w-6 opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Image URL or upload below"
                      className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded flex-1 text-xs focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">OR</span>
                    </div>
                    <label className={`inline-flex items-center justify-center px-4 py-2 border border-stone-200 rounded-lg text-xs font-semibold ${isSubmitting ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'bg-white text-stone-700 hover:bg-stone-50 cursor-pointer'} transition-colors w-full`}>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} ref={fileInputRef} disabled={isSubmitting} />
                      {isSubmitting ? 'Uploading...' : 'Upload from device'}
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button type="button" onClick={closeModal} className="px-5 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm font-bold text-stone-900 bg-[#C7A55C] hover:bg-[#b8931f] rounded-lg transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
