import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  getCategories,
  createCategory,
  Category,
} from "../../services/categoryApi";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onCategoryCreated?: (newCat: Category) => void;
  className?: string;
  placeholder?: string;
}

export default function DynamicCategorySelect({
  value,
  onChange,
  onCategoryCreated,
  className = "",
  placeholder = "Select categories...",
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showNewBox, setShowNewBox] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      if (Array.isArray(data)) {
        const valid = data.filter(
          (c) => c && c.name && String(c.name).trim() !== "",
        );
        setCategories(valid);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  // Parse comma-separated selected categories cleanly
  const selectedList = useMemo(() => {
    if (!value) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    String(value)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((item) => {
        const k = item.toLowerCase();
        if (!seen.has(k)) {
          seen.add(k);
          out.push(item);
        }
      });
    return out;
  }, [value]);

  const isSelected = (catName: string): boolean =>
    selectedList.some((s) => s.toLowerCase() === catName.trim().toLowerCase());

  const toggleCategory = (catName: string) => {
    const clean = catName.trim();
    if (!clean) return;
    let next: string[];
    if (isSelected(clean)) {
      next = selectedList.filter(
        (s) => s.toLowerCase() !== clean.toLowerCase(),
      );
    } else {
      next = [...selectedList, clean];
    }
    onChange(next.join(", "));
  };

  const removeCategory = (catName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = selectedList.filter(
      (s) => s.toLowerCase() !== catName.trim().toLowerCase(),
    );
    onChange(next.join(", "));
  };

  const handleQuickCreateCategory = async (overrideName?: string) => {
    const trimmed = String(overrideName ?? newCategoryName).trim();
    if (!trimmed) {
      toast.error("Please enter a category name.");
      return;
    }

    const existing = categories.find(
      (c) => c.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) {
      if (!isSelected(existing.name)) {
        onChange([...selectedList, existing.name].join(", "));
      }
      setNewCategoryName("");
      setShowNewBox(false);
      setSearch("");
      toast.success(`Selected existing category "${existing.name}"`);
      return;
    }

    setIsLoading(true);
    try {
      const newCat = await createCategory(trimmed);
      setCategories((prev) =>
        [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)),
      );
      onCategoryCreated?.(newCat);
      const next = isSelected(newCat.name)
        ? selectedList
        : [...selectedList, newCat.name];
      onChange(next.join(", "));
      setNewCategoryName("");
      setShowNewBox(false);
      setSearch("");
      toast.success(`Category "${newCat.name}" created & selected!`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add category");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Trigger with Multi-Select Chips */}
      <div
        onClick={() => setIsOpen((o) => !o)}
        className={`flex min-h-[38px] items-center justify-between gap-2 cursor-pointer bg-[#fcf9f5] border border-stone-200 rounded px-2.5 py-1.5 text-xs focus-within:ring-1 focus-within:ring-stone-400 ${className}`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selectedList.length > 0 ? (
            selectedList.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 rounded border border-[#dfd5c5] bg-white px-2 py-0.5 text-[11.5px] font-medium text-stone-800 shadow-2xs"
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={(e) => removeCategory(cat, e)}
                  title={`Remove ${cat}`}
                  className="text-stone-400 hover:text-[#b4442e] cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="px-0.5 text-stone-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-stone-400 shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-stone-200 rounded-md shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 border-b border-stone-100 px-3 py-2 bg-[#fdfcfb]">
            <Search className="h-3.5 w-3.5 text-stone-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full bg-transparent text-xs text-stone-800 placeholder-stone-400 outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-52 overflow-y-auto divide-y divide-stone-50">
            {filtered.length > 0 ? (
              filtered.map((cat) => {
                const checked = isSelected(cat.name);
                return (
                  <button
                    type="button"
                    key={cat.id || cat.name}
                    onClick={() => toggleCategory(cat.name)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs cursor-pointer transition-colors hover:bg-stone-50 ${
                      checked
                        ? "bg-amber-50/70 text-amber-950 font-semibold"
                        : "text-stone-700"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        checked
                          ? "border-[#C7A55C] bg-[#C7A55C] text-[#2A2118]"
                          : "border-stone-300 bg-white"
                      }`}
                    >
                      {checked && <Check className="h-3 w-3 stroke-[2.5]" />}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2.5 text-xs text-stone-400 italic">
                No matching categories found
              </div>
            )}
          </div>

          {/* + Create new category... (same pattern as Designer & Lister) */}
          <button
            type="button"
            onClick={() => {
              if (search.trim()) {
                setNewCategoryName(search.trim());
              }
              setShowNewBox(true);
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-1.5 border-t border-stone-200 bg-[#faf7f2] hover:bg-[#f3ede2] px-3 py-2 text-left text-xs font-semibold text-[#8F5E16] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>
              {search.trim()
                ? `Create new category "${search.trim()}"...`
                : "Create new category..."}
            </span>
          </button>
        </div>
      )}

      {/* Simple Single-Line Inline Create Row (exact match to Designer & Lister) */}
      {showNewBox && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            autoFocus
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleQuickCreateCategory();
              }
              if (e.key === "Escape") {
                setShowNewBox(false);
              }
            }}
            placeholder="Enter new category name..."
            className="flex-1 rounded border border-[#D8CFC2] bg-white px-2.5 py-1.5 text-xs text-stone-800 outline-none focus:border-[#C7A55C]"
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickCreateCategory()}
            className="rounded bg-[#C7A55C] hover:bg-[#B8954B] px-3 py-1.5 text-xs font-semibold text-[#2A2118] disabled:opacity-60 cursor-pointer shrink-0"
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
          <button
            type="button"
            onClick={() => setShowNewBox(false)}
            className="rounded border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 cursor-pointer shrink-0"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
