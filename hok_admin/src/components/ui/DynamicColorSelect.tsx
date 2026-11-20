import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Plus, Search, Star, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  ColorOption,
  createColor,
  getColors,
} from "../../services/categoryApi";
import {
  COLOR_FAMILIES,
  COLOR_PALETTE,
  findPaletteByName,
  nearestPaletteColor,
  normalizeHex,
  resolveFamily,
} from "../../utils/colorPalette";

type ColorEntry = { name: string; hex: string; family: string };

interface Props {
  /** Legacy comma-separated text (`product.color`) */
  colorText: string;
  /** Structured colours (`product.colors`), first = primary */
  colors: ColorEntry[];
  onChange: (list: ColorEntry[]) => void;
  className?: string;
}

// Resolve any CSS colour name the browser knows ("salmon", "teal") to hex
const cssNameToHex = (name: string): string => {
  try {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return "";
    ctx.fillStyle = "#000001";
    ctx.fillStyle = name.replace(/\s+/g, "").toLowerCase();
    const v = String(ctx.fillStyle);
    return v === "#000001" ? "" : normalizeHex(v);
  } catch {
    return "";
  }
};

const toEntry = (name: string, hex?: string, family?: string): ColorEntry => {
  const p = findPaletteByName(name);
  const h = normalizeHex(hex) || p?.hex || cssNameToHex(name) || "";
  return {
    name: name.trim(),
    hex: h,
    family: family || resolveFamily(name, h) || "",
  };
};

const borderFor = (hex: string) =>
  ["#FFFFFF", "#FFFAFA", "#FFFFF0", "#FAF9F6", "#FFFDD0"].includes(
    (hex || "").toUpperCase(),
  )
    ? "1px solid #d6d3d1"
    : "1px solid rgba(0,0,0,0.08)";

export default function DynamicColorSelect({
  colorText,
  colors,
  onChange,
  className = "",
}: Props) {
  // Show built-in palette instantly; live master list replaces it when loaded
  const [options, setOptions] = useState<ColorOption[]>(() =>
    COLOR_PALETTE.map((c: ColorEntry) => ({ ...c })),
  );
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newHex, setNewHex] = useState("#C62828");
  const [newFamily, setNewFamily] = useState("Red");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getColors().then((data) => {
      if (data.length === 0) return;
      // Keep any colour added while the list was loading
      setOptions((prev) => {
        const map = new Map<string, ColorOption>();
        [...data, ...prev.filter((p) => !COLOR_PALETTE.some((c: ColorEntry) => c.name === p.name))].forEach(
          (o) => map.set(o.name.toLowerCase(), o),
        );
        return Array.from(map.values());
      });
    });
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Selected list: structured colours, else derived from legacy text
  const selected: ColorEntry[] = useMemo(() => {
    if (Array.isArray(colors) && colors.length > 0) return colors;
    return String(colorText || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((n) => {
        const opt = options.find(
          (o) => o.name.toLowerCase() === n.toLowerCase(),
        );
        return opt ? { name: opt.name, hex: opt.hex, family: opt.family } : toEntry(n);
      });
  }, [colors, colorText, options]);

  const isSelected = (name: string) =>
    selected.some((s) => s.name.toLowerCase() === name.toLowerCase());

  const toggle = (opt: ColorEntry) => {
    if (isSelected(opt.name)) {
      onChange(selected.filter((s) => s.name.toLowerCase() !== opt.name.toLowerCase()));
    } else {
      onChange([...selected, { name: opt.name, hex: opt.hex, family: opt.family }]);
    }
  };

  const remove = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((s) => s.name.toLowerCase() !== name.toLowerCase()));
  };

  const makePrimary = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const hit = selected.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (!hit) return;
    onChange([hit, ...selected.filter((s) => s !== hit)]);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = [...options].sort((a, b) => a.name.localeCompare(b.name));
    if (!q) return list;
    return list.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        (o.family || "").toLowerCase().includes(q),
    );
  }, [options, search]);

  // ---- Create box: picker -> auto name/family, name -> auto hex/family ----
  const openCreate = (prefill: string) => {
    if (prefill) {
      const e = toEntry(prefill);
      setNewName(prefill);
      if (e.hex) setNewHex(e.hex);
      if (e.family) setNewFamily(e.family);
    } else {
      const near = nearestPaletteColor(newHex);
      setNewName(near?.name || "");
      if (near?.family) setNewFamily(near.family);
    }
    setShowNew(true);
    setIsOpen(false);
  };

  const onPickHex = (hex: string) => {
    const h = normalizeHex(hex);
    if (!h) return;
    setNewHex(h);
    const near = nearestPaletteColor(h);
    if (near) {
      setNewName(near.name);
      setNewFamily(near.family);
    }
  };

  const onTypeName = (name: string) => {
    setNewName(name);
    const p = findPaletteByName(name);
    const hex = p?.hex || cssNameToHex(name);
    if (hex) {
      setNewHex(hex);
      setNewFamily(p?.family || resolveFamily(name, hex) || newFamily);
    }
  };

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return toast.error("Please enter a colour name.");
    const hex = normalizeHex(newHex);
    if (!hex) return toast.error("Please pick a colour.");
    const entry: ColorEntry = { name, hex, family: newFamily };

    // Instant: add to product + list right away, save to master list in background
    setOptions((prev) => [
      ...prev.filter((o) => o.name.toLowerCase() !== name.toLowerCase()),
      entry,
    ]);
    const rest = selected.filter(
      (s) => s.name.toLowerCase() !== name.toLowerCase(),
    );
    onChange([...rest, entry]);
    setShowNew(false);
    setSearch("");
    toast.success(`Colour "${name}" added`);

    createColor(entry).catch((err: any) => {
      console.warn("Colour master save failed:", err?.message);
      toast.error(`"${name}" added to this product, but not saved to colour list`);
    });
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        onClick={() => setIsOpen((o) => !o)}
        className={`flex min-h-[38px] items-center justify-between gap-2 cursor-pointer bg-[#fcf9f5] border border-stone-200 rounded px-2.5 py-1.5 text-xs ${className}`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selected.length > 0 ? (
            selected.map((c, i) => (
              <span
                key={c.name}
                className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11.5px] font-medium shadow-2xs ${
                  i === 0
                    ? "border-[#C7A55C] bg-amber-50 text-stone-900"
                    : "border-[#dfd5c5] bg-white text-stone-800"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ background: c.hex || "#ccc", border: borderFor(c.hex) }}
                />
                <span>{c.name}</span>
                {i === 0 ? (
                  <span
                    title="Primary colour"
                    className="text-[9.5px] font-semibold uppercase tracking-wide text-[#8F5E16]"
                  >
                    Primary
                  </span>
                ) : (
                  <button
                    type="button"
                    title="Make primary"
                    onClick={(e) => makePrimary(c.name, e)}
                    className="text-stone-300 hover:text-[#C7A55C] cursor-pointer"
                  >
                    <Star className="h-3 w-3" />
                  </button>
                )}
                <button
                  type="button"
                  title={`Remove ${c.name}`}
                  onClick={(e) => remove(c.name, e)}
                  className="text-stone-400 hover:text-[#b4442e] cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="px-0.5 text-stone-400">Select colours...</span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-stone-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {selected.length > 1 && (
        <p className="mt-1 text-[10.5px] text-stone-400">
          First colour is primary (shown in web filter). Click ☆ to make another
          colour primary.
        </p>
      )}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-stone-200 rounded-md shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 border-b border-stone-100 px-3 py-2 bg-[#fdfcfb]">
            <Search className="h-3.5 w-3.5 text-stone-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colours or family (e.g. red)..."
              className="w-full bg-transparent text-xs text-stone-800 placeholder-stone-400 outline-none"
            />
          </div>
          <div className="max-h-56 overflow-y-auto divide-y divide-stone-50">
            {filtered.length > 0 ? (
              filtered.map((o) => {
                const checked = isSelected(o.name);
                return (
                  <button
                    type="button"
                    key={o.name}
                    onClick={() => toggle(o)}
                    className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs cursor-pointer hover:bg-stone-50 ${
                      checked ? "bg-amber-50/70 font-semibold" : "text-stone-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-4 w-4 rounded-full shrink-0"
                        style={{ background: o.hex || "#ccc", border: borderFor(o.hex) }}
                      />
                      <span>{o.name}</span>
                      <span className="text-[10px] text-stone-400">{o.family}</span>
                    </span>
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
                No matching colours found
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => openCreate(search.trim())}
            className="flex w-full items-center gap-1.5 border-t border-stone-200 bg-[#faf7f2] hover:bg-[#f3ede2] px-3 py-2 text-left text-xs font-semibold text-[#8F5E16] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>
              {search.trim()
                ? `Create new colour "${search.trim()}"...`
                : "Create new colour..."}
            </span>
          </button>
        </div>
      )}

      {showNew && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            type="color"
            value={newHex}
            onChange={(e) => onPickHex(e.target.value)}
            title="Pick colour"
            className="h-[30px] w-9 cursor-pointer rounded border border-[#D8CFC2] bg-white p-0.5"
          />
          <input
            type="text"
            autoFocus
            value={newName}
            onChange={(e) => onTypeName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
              if (e.key === "Escape") setShowNew(false);
            }}
            placeholder="Colour name (e.g. Light Pink)"
            className="flex-1 min-w-[120px] rounded border border-[#D8CFC2] bg-white px-2.5 py-1.5 text-xs text-stone-800 outline-none focus:border-[#C7A55C]"
          />
          <select
            value={newFamily}
            onChange={(e) => setNewFamily(e.target.value)}
            title="Colour family (web filter circle)"
            className="rounded border border-[#D8CFC2] bg-white px-2 py-1.5 text-xs text-stone-800 outline-none"
          >
            {COLOR_FAMILIES.map((f: { name: string }) => (
              <option key={f.name} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
          <span className="text-[10.5px] font-mono text-stone-400">{newHex}</span>
          <button
            type="button"
            onClick={handleCreate}
            className="rounded bg-[#C7A55C] hover:bg-[#B8954B] px-3 py-1.5 text-xs font-semibold text-[#2A2118] cursor-pointer"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowNew(false)}
            className="rounded border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
