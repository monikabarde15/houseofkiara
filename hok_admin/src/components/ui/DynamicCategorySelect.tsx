import React, { useState, useEffect, useRef } from 'react';
import { getCategories, createCategory, Category } from '../../services/categoryApi';
import { ChevronDown, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function DynamicCategorySelect({ value, onChange, className = '', placeholder = "Select or type category..." }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleAddNew = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!search.trim()) return;

    setIsLoading(true);
    try {
      const newCat = await createCategory(search.trim());
      setCategories(prev => [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)));
      onChange(newCat.name);
      setIsOpen(false);
      setSearch('');
      toast.success(`Category "${newCat.name}" added successfully`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add category');
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const exactMatch = categories.find(c => c.name.toLowerCase() === search.toLowerCase().trim());

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between cursor-text bg-[#fcf9f5] border border-stone-200 rounded px-3 py-2 text-xs ${className}`}
      >
        {isOpen ? (
          <input 
            type="text"
            className="w-full bg-transparent focus:outline-none placeholder-stone-400"
            placeholder={placeholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        ) : (
          <span className={value ? "text-stone-900" : "text-stone-400"}>
            {value || placeholder}
          </span>
        )}
        <ChevronDown className="h-4 w-4 text-stone-400 ml-2 shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-stone-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map(cat => (
              <div
                key={cat.id}
                onClick={() => { onChange(cat.name); setIsOpen(false); setSearch(''); }}
                className={`px-3 py-2 text-xs cursor-pointer hover:bg-stone-50 ${value === cat.name ? 'bg-amber-50 text-amber-900 font-medium' : 'text-stone-700'}`}
              >
                {cat.name}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-xs text-stone-500 italic">No exact matches found</div>
          )}

          {search.trim() && !exactMatch && (
            <div 
              onClick={handleAddNew}
              className="px-3 py-2 text-xs cursor-pointer border-t border-stone-100 bg-stone-50 hover:bg-amber-50 text-amber-700 font-semibold flex items-center gap-1.5"
            >
              {isLoading ? (
                <span className="animate-pulse">Adding...</span>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  Add "{search}"
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
