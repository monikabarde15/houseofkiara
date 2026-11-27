import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  getSizes,
  createSize,
  deleteSize,
  SizeOption,
} from "../../services/categoryApi";
import { Check, ChevronDown, Plus, Search, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  value: string[];
  onChange: (sizes: string[]) => void;
  className?: string;
  placeholder?: string;
}

const makeSizeId = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") || name.trim().toLowerCase();

export default function DynamicSizeSelect({
  value,
  onChange,
  className = "",
  placeholder = "Select size(s)...",
}: Props) {
  const [sizeOptions, setSizeOptions] = useState<SizeOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showNewBox, setShowNewBox] = useState(false);
  const [newSizeName, setNewSizeName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingName, setDeletingName] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSizes();
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
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const fetchSizes = async () => {
    try {
      const data = await getSizes();
      if (Array.isArray(data)) {
        setSizeOptions(
          data.filter((s) => s && s.name && String(s.name).trim() !== ""),
        );
      }
    } catch (err) {
      console.error("Failed to fetch sizes:", err);
    }
  };

  const selectedList = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    (Array.isArray(value) ? value : [])
      .map((s) => String(s || "").trim())
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

  const allOptions = useMemo(() => {
    const seen = new Set<string>();
    const out: SizeOption[] = [];
    sizeOptions.forEach((opt) => {
      const clean = String(opt?.name || "").trim();
      if (!clean) return;
      const k = clean.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        out.push({ id: opt.id || makeSizeId(clean), name: clean });
      }
    });
    selectedList.forEach((sel) => {
      const k = sel.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        out.push({ id: makeSizeId(sel), name: sel });
      }
    });
    return out;
  }, [sizeOptions, selectedList]);

  const isSelected = (sizeName: string): boolean =>
    selectedList.some((s) => s.toLowerCase() === sizeName.trim().toLowerCase());

  const toggleSize = (sizeName: string) => {
    const clean = sizeName.trim();
    if (!clean) return;
    const next = isSelected(clean)
      ? selectedList.filter((s) => s.toLowerCase() !== clean.toLowerCase())
      : [...selectedList, clean];
    onChange(next);
  };

  const removeSelectedChip = (sizeName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(
      selectedList.filter(
        (s) => s.toLowerCase() !== sizeName.trim().toLowerCase(),
      ),
    );
  };

  const handleDeleteOptionFromDb = async (
    sizeName: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const clean = sizeName.trim();
    if (!clean || deletingName) return;
    setDeletingName(clean);
    try {
      await deleteSize(clean);
      setSizeOptions((prev) =>
        prev.filter((o) => o.name.trim().toLowerCase() !== clean.toLowerCase()),
      );
      if (isSelected(clean)) {
        onChange(
          selectedList.filter((s) => s.toLowerCase() !== clean.toLowerCase()),
        );
      }
      toast.success(`Removed size "${clean}" from list`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove size");
    } finally {
      setDeletingName(null);
    }
  };

  const handleQuickCreateSize = async (overrideName?: string) => {
    const trimmed = String(overrideName ?? newSizeName).trim();
    if (!trimmed) {
      toast.error("Please enter a size name.");
      return;
    }

    const existing = allOptions.find(
      (s) => s.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) {
      if (!isSelected(existing.name)) {
        onChange([...selectedList, existing.name]);
      }
      setNewSizeName("");
      setShowNewBox(false);
      setSearch("");
      toast.success(`Selected existing size "${existing.name}"`);
      return;
    }

    setIsLoading(true);
    try {
      const created = await createSize(trimmed);
      const createdName = created?.name || trimmed;
      setSizeOptions((prev) => {
        const exists = prev.some(
          (o) => o.name.trim().toLowerCase() === createdName.toLowerCase(),
        );
        return exists
          ? prev
          : [...prev, { id: created?.id || makeSizeId(createdName), name: createdName }];
      });
      if (!isSelected(createdName)) {
        onChange([...selectedList, createdName]);
      }
      setNewSizeName("");
      setShowNewBox(false);
      setSearch("");
      toast.success(`Size "${createdName}" saved & selected!`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add size");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allOptions;
    return allOptions.filter((s) => s.name.toLowerCase().includes(q));
  }, [allOptions, search]);

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Trigger with Multi-Select Chips */}
      <div
        onClick={() => setIsOpen((o) => !o)}
        className={`flex min-h-[38px] items-center justify-between gap-2 cursor-pointer bg-[#fcf9f5] border border-stone-200 rounded px-2.5 py-1.5 text-xs focus-within:ring-1 focus-within:ring-stone-400 ${className}`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selectedList.length > 0 ? (
            selectedList.map((sz) => (
              <span
                key={sz}
                className="inline-flex items-center gap-1 rounded border border-[#dfd5c5] bg-white px-2 py-0.5 text-[11.5px] font-medium text-stone-800 shadow-2xs"
              >
                <span>{sz}</span>
                <button
                  type="button"
                  onClick={(e) => removeSelectedChip(sz, e)}
                  title={`Remove ${sz}`}
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
              placeholder="Search sizes..."
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
              filtered.map((sz) => {
                const checked = isSelected(sz.name);
                const isDeleting = deletingName === sz.name;
                return (
                  <div
                    key={sz.id || sz.name}
                    onClick={() => toggleSize(sz.name)}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs cursor-pointer transition-colors hover:bg-stone-50 ${
                      checked
                        ? "bg-amber-50/70 text-amber-950 font-semibold"
                        : "text-stone-700"
                    }`}
                  >
                    <span className="flex-1 truncate">{sz.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={(e) => handleDeleteOptionFromDb(sz.name, e)}
                        title={`Delete "${sz.name}" from database`}
                        className="p-0.5 text-stone-400 hover:text-[#b4442e] cursor-pointer disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          checked
                            ? "border-[#C7A55C] bg-[#C7A55C] text-[#2A2118]"
                            : "border-stone-300 bg-white"
                        }`}
                      >
                        {checked && <Check className="h-3 w-3 stroke-[2.5]" />}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-2.5 text-xs text-stone-400 italic">
                No matching sizes found
              </div>
            )}
          </div>

          {/* + Add new size... */}
          <button
            type="button"
            onClick={() => {
              if (search.trim()) {
                setNewSizeName(search.trim());
              }
              setShowNewBox(true);
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-1.5 border-t border-stone-200 bg-[#faf7f2] hover:bg-[#f3ede2] px-3 py-2 text-left text-xs font-semibold text-[#8F5E16] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>
              {search.trim()
                ? `Add new size "${search.trim()}"...`
                : "Add new size..."}
            </span>
          </button>
        </div>
      )}

      {/* Inline Add Size Row */}
      {showNewBox && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            autoFocus
            value={newSizeName}
            onChange={(e) => setNewSizeName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleQuickCreateSize();
              }
              if (e.key === "Escape") {
                setShowNewBox(false);
              }
            }}
            placeholder="Enter new size (e.g. XS, 38, Custom)..."
            className="flex-1 rounded border border-[#D8CFC2] bg-white px-2.5 py-1.5 text-xs text-stone-800 outline-none focus:border-[#C7A55C]"
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickCreateSize()}
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
