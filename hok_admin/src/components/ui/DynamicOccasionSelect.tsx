import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  getOccasions,
  createOccasion,
  OccasionOption,
} from "../../services/categoryApi";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function DynamicOccasionSelect({
  value,
  onChange,
  className = "",
  placeholder = "Select occasions...",
}: Props) {
  const [occasions, setOccasions] = useState<OccasionOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showNewBox, setShowNewBox] = useState(false);
  const [newOccasionName, setNewOccasionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOccasions();
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

  const fetchOccasions = async () => {
    try {
      const data = await getOccasions();
      if (Array.isArray(data)) {
        setOccasions(
          data.filter((o) => o && o.name && String(o.name).trim() !== ""),
        );
      }
    } catch (err) {
      console.error("Failed to fetch occasions:", err);
    }
  };

  // Parse comma-separated selected occasions cleanly
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

  // Also ensure any custom occasion already saved on this product shows in the dropdown list
  const allOptions = useMemo(() => {
    const map = new Map<string, OccasionOption>();
    occasions.forEach((o) => map.set(o.name.toLowerCase(), o));
    selectedList.forEach((s) => {
      if (!map.has(s.toLowerCase())) {
        map.set(s.toLowerCase(), {
          id: s.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name: s,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [occasions, selectedList]);

  const isSelected = (occName: string): boolean =>
    selectedList.some((s) => s.toLowerCase() === occName.trim().toLowerCase());

  const toggleOccasion = (occName: string) => {
    const clean = occName.trim();
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

  const removeOccasion = (occName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = selectedList.filter(
      (s) => s.toLowerCase() !== occName.trim().toLowerCase(),
    );
    onChange(next.join(", "));
  };

  const handleQuickCreateOccasion = async (overrideName?: string) => {
    const trimmed = String(overrideName ?? newOccasionName).trim();
    if (!trimmed) {
      toast.error("Please enter an occasion name.");
      return;
    }

    const existing = allOptions.find(
      (o) => o.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) {
      if (!isSelected(existing.name)) {
        onChange([...selectedList, existing.name].join(", "));
      }
      setNewOccasionName("");
      setShowNewBox(false);
      setSearch("");
      toast.success(`Selected existing occasion "${existing.name}"`);
      return;
    }

    setIsLoading(true);
    try {
      const created = await createOccasion(trimmed);
      setOccasions((prev) =>
        [...prev, created].sort((a, b) => a.name.localeCompare(b.name)),
      );
      const next = isSelected(created.name)
        ? selectedList
        : [...selectedList, created.name];
      onChange(next.join(", "));
      setNewOccasionName("");
      setShowNewBox(false);
      setSearch("");
      toast.success(`Occasion "${created.name}" created & selected!`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add occasion");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allOptions;
    return allOptions.filter((o) => o.name.toLowerCase().includes(q));
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
            selectedList.map((occ) => (
              <span
                key={occ}
                className="inline-flex items-center gap-1 rounded border border-[#dfd5c5] bg-white px-2 py-0.5 text-[11.5px] font-medium text-stone-800 shadow-2xs"
              >
                <span>{occ}</span>
                <button
                  type="button"
                  onClick={(e) => removeOccasion(occ, e)}
                  title={`Remove ${occ}`}
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
              placeholder="Search occasions..."
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
              filtered.map((occ) => {
                const checked = isSelected(occ.name);
                return (
                  <button
                    type="button"
                    key={occ.id || occ.name}
                    onClick={() => toggleOccasion(occ.name)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs cursor-pointer transition-colors hover:bg-stone-50 ${
                      checked
                        ? "bg-amber-50/70 text-amber-950 font-semibold"
                        : "text-stone-700"
                    }`}
                  >
                    <span>{occ.name}</span>
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
                No matching occasions found
              </div>
            )}
          </div>

          {/* + Create new occasion... (exact match to Category, Designer & Lister) */}
          <button
            type="button"
            onClick={() => {
              if (search.trim()) {
                setNewOccasionName(search.trim());
              }
              setShowNewBox(true);
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-1.5 border-t border-stone-200 bg-[#faf7f2] hover:bg-[#f3ede2] px-3 py-2 text-left text-xs font-semibold text-[#8F5E16] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>
              {search.trim()
                ? `Create new occasion "${search.trim()}"...`
                : "Create new occasion..."}
            </span>
          </button>
        </div>
      )}

      {/* Simple Single-Line Inline Create Row */}
      {showNewBox && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            autoFocus
            value={newOccasionName}
            onChange={(e) => setNewOccasionName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleQuickCreateOccasion();
              }
              if (e.key === "Escape") {
                setShowNewBox(false);
              }
            }}
            placeholder="Enter new occasion name..."
            className="flex-1 rounded border border-[#D8CFC2] bg-white px-2.5 py-1.5 text-xs text-stone-800 outline-none focus:border-[#C7A55C]"
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickCreateOccasion()}
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
