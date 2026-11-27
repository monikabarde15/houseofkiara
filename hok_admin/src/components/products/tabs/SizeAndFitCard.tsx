import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Search } from "lucide-react";
import { Product } from "../../types/product";
import {
  SizeFitMasterOptions,
  SizeFitOptionListType,
  addCategoryPieceOption,
  addSizeFitOption,
  getSizeFitOptions,
} from "../../../services/categoryApi";
import {
  CANCAN_OPTIONS,
  CLOSURE_OPTIONS,
  HOW_IT_FITS_OPTIONS,
  MASTER_GARMENT_PIECES,
  MEASURED_BY_OPTIONS,
  PADDED_OPTIONS,
  SIZE_GUIDES,
  GarmentDetailKey,
  GarmentMeasurementValue,
  GarmentSetPiece,
  HEIGHT_OPTIONS,
  adaptClosureForGender,
  adaptFitDescForGender,
  computeSizeFitSummary,
  createEmptySetPiece,
  getAddOptionsForCategory,
  getClosureOptionsForGender,
  getDisplayKindLabel,
  getGenderAwarePieceDef,
  getHowItFitsOptionsForGender,
  getMasterPieceDef,
  hydrateSizeFitSetFromProduct,
  inchesToCmLabel,
  normalizeSizeFitGender,
  parseNumericMeasure,
} from "../utils/sizeFitEngine";

interface SizeAndFitCardProps {
  formData: Partial<Product>;
  onFieldChange: <K extends keyof Product>(field: K, value: Product[K]) => void;
  onSaveSizeAndFit: () => Promise<void> | void;
  designers?: Array<{ id: string; name: string }>;
  onDesignerCreated?: (newDesigner: any) => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
}

const DEFAULT_DYNAMIC_OPTIONS: SizeFitMasterOptions = {
  masterPieces: MASTER_GARMENT_PIECES,
  categoryPieces: {},
  categoryAllowedPieces: {},
  categoryAddOptions: {},
  sizeGuides: SIZE_GUIDES,
  measuredByOptions: MEASURED_BY_OPTIONS,
  howItFitsOptions: HOW_IT_FITS_OPTIONS,
  closureOptions: CLOSURE_OPTIONS.filter(Boolean),
  paddedOptions: PADDED_OPTIONS.filter(Boolean),
  cancanOptions: CANCAN_OPTIONS.filter(Boolean),
  heightOptions: HEIGHT_OPTIONS,
  designerLabels: [],
};

const parseHeightBoundsFromLegacy = (
  bestSuited?: string,
): { from: string; to: string } => {
  const raw = String(bestSuited || "").trim();
  if (!raw) return { from: "", to: "" };
  const matches = raw.match(/\d'\d{1,2}"/g);
  if (matches && matches.length >= 2) {
    return { from: matches[0], to: matches[1] };
  }
  if (matches && matches.length === 1) {
    return { from: matches[0], to: "" };
  }
  return { from: "", to: "" };
};

const withCurrentOption = (list: string[], currentValue?: string): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list || []) {
    const clean = String(item || "").trim();
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
  }
  const currClean = String(currentValue || "").trim();
  if (currClean && !seen.has(currClean.toLowerCase())) {
    out.push(currClean);
  }
  return out;
};

type DynamicListFieldType = Exclude<SizeFitOptionListType, "designerLabels">;

interface DynamicOptionSelectProps {
  value: string;
  options: string[];
  placeholder?: string;
  listType: DynamicListFieldType;
  className?: string;
  addLabel?: string;
  onChange: (value: string) => void;
  onOptionPersisted: (
    listType: DynamicListFieldType,
    value: string,
    updatedList?: string[],
  ) => void;
}

function DynamicOptionSelect({
  value,
  options,
  placeholder,
  listType,
  className,
  addLabel = "+ Add new...",
  onChange,
  onOptionPersisted,
}: DynamicOptionSelectProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newVal, setNewVal] = useState("");
  const [saving, setSaving] = useState(false);

  const commitNew = async () => {
    const trimmed = newVal.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    try {
      const saved = await addSizeFitOption(listType, trimmed);
      const canonical = saved?.value || trimmed;
      onOptionPersisted(listType, canonical, saved?.list);
      onChange(canonical);
      toast.success(`Added "${canonical}"`);
      setNewVal("");
      setIsAdding(false);
    } catch (err: any) {
      toast.error(err?.message || "Unable to save option");
    } finally {
      setSaving(false);
    }
  };

  if (isAdding) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={newVal}
          onChange={(e) => setNewVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              commitNew();
            } else if (e.key === "Escape") {
              e.preventDefault();
              setIsAdding(false);
              setNewVal("");
            }
          }}
          placeholder="Type new option..."
          autoFocus
          className="h-8 min-w-[120px] flex-1 rounded border border-[#C7A55C] bg-white px-2 text-xs text-stone-800 outline-none"
        />
        <button
          type="button"
          onClick={commitNew}
          disabled={!newVal.trim() || saving}
          className="h-8 rounded bg-[#A56728] px-2.5 text-[11px] font-semibold text-white hover:bg-[#8E561E] disabled:opacity-50 cursor-pointer"
        >
          {saving ? "..." : "Add"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAdding(false);
            setNewVal("");
          }}
          className="h-8 rounded border border-[#E2D9CB] bg-white px-2 text-[11px] text-stone-600 hover:bg-stone-50 cursor-pointer"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => {
        if (e.target.value === "__ADD_NEW__") {
          setIsAdding(true);
          return;
        }
        onChange(e.target.value);
      }}
      className={className}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
      <option value="__ADD_NEW__">{addLabel}</option>
    </select>
  );
}

export function SizeAndFitCard({
  formData,
  onFieldChange,
  onSaveSizeAndFit,
  designers = [],
  onDesignerCreated,
  isSaving = false,
  saveSuccess = false,
}: SizeAndFitCardProps) {
  const [expandedPieces, setExpandedPieces] = useState<Record<string, boolean>>(
    {},
  );
  const [dbOptions, setDbOptions] = useState<SizeFitMasterOptions>(
    DEFAULT_DYNAMIC_OPTIONS,
  );
  const [isLabelDropdownOpen, setIsLabelDropdownOpen] = useState(false);
  const [creatingLabel, setCreatingLabel] = useState(false);
  const [explicitNoLabel, setExplicitNoLabel] = useState(false);
  const [isAddingCustomPiece, setIsAddingCustomPiece] = useState(false);
  const [newPieceName, setNewPieceName] = useState("");
  const [savingCustomPiece, setSavingCustomPiece] = useState(false);
  const labelDropdownRef = useRef<HTMLDivElement>(null);

  const productDesigner = String(formData.designer || "").trim();

  useEffect(() => {
    setExplicitNoLabel(false);
  }, [productDesigner, formData.productId]);

  useEffect(() => {
    if (!productDesigner || explicitNoLabel) return;
    const currentLabel = String(formData.designerLabel || "").trim();
    if (currentLabel.toLowerCase() !== productDesigner.toLowerCase()) {
      onFieldChange("designerLabel", productDesigner as any);
    }
  }, [productDesigner, explicitNoLabel, formData.designerLabel]);

  useEffect(() => {
    let mounted = true;
    getSizeFitOptions().then((fetched) => {
      if (!mounted || !fetched) return;
      setDbOptions((prev) => ({
        ...prev,
        ...fetched,
        masterPieces:
          Array.isArray(fetched.masterPieces) && fetched.masterPieces.length > 0
            ? fetched.masterPieces
            : prev.masterPieces,
        categoryAddOptions:
          fetched.categoryAddOptions &&
          Object.keys(fetched.categoryAddOptions).length > 0
            ? fetched.categoryAddOptions
            : prev.categoryAddOptions,
        sizeGuides: fetched.sizeGuides || prev.sizeGuides,
        measuredByOptions:
          Array.isArray(fetched.measuredByOptions) &&
          fetched.measuredByOptions.length > 0
            ? fetched.measuredByOptions
            : prev.measuredByOptions,
        howItFitsOptions:
          Array.isArray(fetched.howItFitsOptions) &&
          fetched.howItFitsOptions.length > 0
            ? fetched.howItFitsOptions
            : prev.howItFitsOptions,
        closureOptions:
          Array.isArray(fetched.closureOptions) &&
          fetched.closureOptions.length > 0
            ? fetched.closureOptions
            : prev.closureOptions,
        paddedOptions:
          Array.isArray(fetched.paddedOptions) &&
          fetched.paddedOptions.length > 0
            ? fetched.paddedOptions
            : prev.paddedOptions,
        cancanOptions:
          Array.isArray(fetched.cancanOptions) &&
          fetched.cancanOptions.length > 0
            ? fetched.cancanOptions
            : prev.cancanOptions,
        heightOptions:
          Array.isArray(fetched.heightOptions) &&
          fetched.heightOptions.length > 0
            ? fetched.heightOptions
            : prev.heightOptions,
        designerLabels: Array.isArray(fetched.designerLabels)
          ? fetched.designerLabels
          : prev.designerLabels,
      }));
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        labelDropdownRef.current &&
        !labelDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLabelDropdownOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLabelDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const modes = Array.isArray(formData.listingModes)
    ? formData.listingModes.map((m) => String(m || "").toUpperCase().trim())
    : [];
  const isBuyNewOnly =
    modes.length > 0 &&
    modes.includes("BUY NEW") &&
    !modes.includes("RENTAL") &&
    !modes.includes("PRELOVED");

  const dynamicPieces =
    dbOptions.masterPieces && dbOptions.masterPieces.length > 0
      ? dbOptions.masterPieces
      : MASTER_GARMENT_PIECES;
  const dynamicGuides = dbOptions.sizeGuides || SIZE_GUIDES;

  const primaryCategory = String(formData.category || "")
    .split(",")[0]
    .trim();

  const categoryAddOptions = useMemo(
    () =>
      getAddOptionsForCategory(
        formData.category,
        (formData as any).gender,
        dynamicPieces,
        dbOptions.categoryAddOptions,
      ),
    [
      formData.category,
      (formData as any).gender,
      dynamicPieces,
      dbOptions.categoryAddOptions,
    ],
  );

  const handleOptionPersisted = (
    listType: DynamicListFieldType,
    canonical: string,
    updatedList?: string[],
  ) => {
    setDbOptions((prev) => ({
      ...prev,
      [listType]: withCurrentOption(
        updatedList && updatedList.length > 0 ? updatedList : prev[listType],
        canonical,
      ),
    }));
  };

  const effectiveGender = normalizeSizeFitGender(
    (formData as any).gender,
    formData.category,
  );
  const isMenswear = effectiveGender === "men";
  const isWomenswear = effectiveGender === "women";

  const activeSet = useMemo(
    () => hydrateSizeFitSetFromProduct(formData, dynamicPieces),
    [
      formData.set,
      formData.category,
      (formData as any).gender,
      formData.measurements,
      dynamicPieces,
    ],
  );

  const remainingAddableOptions = useMemo(() => {
    const existingIds = new Set(activeSet.map((p) => p.piece));
    return categoryAddOptions.filter((opt) => !existingIds.has(opt.piece));
  }, [activeSet, categoryAddOptions]);

  const legacyHeightBounds = useMemo(
    () => parseHeightBoundsFromLegacy(formData.bestSuitedForHeight),
    [formData.bestSuitedForHeight],
  );
  const heightFromValue =
    formData.heightFrom !== undefined
      ? formData.heightFrom
      : legacyHeightBounds.from;
  const heightToValue =
    formData.heightTo !== undefined
      ? formData.heightTo
      : legacyHeightBounds.to;

  const resolvedOwnerSize =
    formData.ownerSize !== undefined
      ? formData.ownerSize
      : Array.isArray(formData.sizes) && formData.sizes.length === 1
        ? String(formData.sizes[0] || "")
        : "";

  const effectiveFitDesc = adaptFitDescForGender(
    formData.fitDesc,
    (formData as any).gender,
    formData.category,
  );

  const summary = useMemo(
    () =>
      computeSizeFitSummary(activeSet, {
        category: formData.category,
        gender: (formData as any).gender,
        ownerSize: resolvedOwnerSize,
        designerLabel: formData.designerLabel,
        fitDesc: effectiveFitDesc,
        fitNote: formData.fitNote,
        measuredBy: formData.measuredBy,
        measuredOn: formData.measuredOn,
        heightFrom: heightFromValue,
        heightTo: heightToValue,
        bestSuitedForHeight: formData.bestSuitedForHeight,
        fitNotes: formData.fitNotes,
        masterPieces: dynamicPieces,
        sizeGuides: dynamicGuides,
      }),
    [
      activeSet,
      formData.category,
      (formData as any).gender,
      resolvedOwnerSize,
      formData.designerLabel,
      effectiveFitDesc,
      formData.fitNote,
      formData.measuredBy,
      formData.measuredOn,
      heightFromValue,
      heightToValue,
      formData.bestSuitedForHeight,
      formData.fitNotes,
      dynamicPieces,
      dynamicGuides,
    ],
  );

  const activeGuide = dynamicGuides[summary.guideId] || SIZE_GUIDES[summary.guideId];

  const allDesignerLabels = useMemo(() => {
    const names = [
      ...(designers || []).map((d) => d.name),
      ...(dbOptions.designers || []).map((d) => d.name),
      ...(dbOptions.designerLabels || []),
    ];
    return withCurrentOption(names);
  }, [designers, dbOptions.designers, dbOptions.designerLabels]);

  const designerRegistryLower = useMemo(
    () =>
      new Set(
        [
          ...(designers || []).map((d) => String(d.name || "").trim().toLowerCase()),
          ...(dbOptions.designers || []).map((d) =>
            String(d.name || "").trim().toLowerCase(),
          ),
        ].filter(Boolean),
      ),
    [designers, dbOptions.designers],
  );

  const labelQuery = String(formData.designerLabel || "").trim();
  const filteredDesignerLabels = useMemo(() => {
    const q = labelQuery.toLowerCase();
    if (!q) return allDesignerLabels;
    return allDesignerLabels.filter((lbl) => lbl.toLowerCase().includes(q));
  }, [allDesignerLabels, labelQuery]);

  const hasExactLabelMatch = useMemo(() => {
    if (!labelQuery) return true;
    return allDesignerLabels.some(
      (lbl) => lbl.toLowerCase() === labelQuery.toLowerCase(),
    );
  }, [allDesignerLabels, labelQuery]);

  const handleSelectDesignerLabel = (lbl: string) => {
    onFieldChange("designerLabel", lbl as any);
    if (!productDesigner && lbl.trim()) {
      onFieldChange("designer", lbl.trim() as any);
    }
    setIsLabelDropdownOpen(false);
  };

  const handleCreateDesignerLabel = async (rawLabel: string) => {
    const clean = rawLabel.trim();
    if (!clean || creatingLabel) return;
    setCreatingLabel(true);
    try {
      const saved = await addSizeFitOption("designerLabels", clean);
      const canonical = saved?.value || clean;
      onFieldChange("designerLabel", canonical as any);
      if (!productDesigner && canonical) {
        onFieldChange("designer", canonical as any);
      }

      setDbOptions((prev) => ({
        ...prev,
        designerLabels: withCurrentOption(
          saved?.list || prev.designerLabels,
          canonical,
        ),
        designers: saved?.createdDesigner
          ? [...(prev.designers || []), saved.createdDesigner]
          : prev.designers,
      }));

      if (saved?.createdDesigner) {
        onDesignerCreated?.(saved.createdDesigner);
      }

      toast.success(
        saved?.designerCreated
          ? `"${canonical}" added as Designer Label & registered in Designers!`
          : `"${canonical}" selected!`,
      );
      setIsLabelDropdownOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Unable to add new designer label");
    } finally {
      setCreatingLabel(false);
    }
  };

  const commitSetUpdate = (nextSet: GarmentSetPiece[]) => {
    onFieldChange("set", nextSet as any);
  };

  const handleRenamePiece = (index: number, nextName: string) => {
    const next = activeSet.map((p, i) =>
      i === index ? { ...p, name: nextName } : p,
    );
    commitSetUpdate(next);
  };

  const handleRemovePiece = (index: number) => {
    const next = activeSet.filter((_, i) => i !== index);
    commitSetUpdate(next);
  };

  const handleDetailChange = (
    index: number,
    key: GarmentDetailKey,
    val: string,
  ) => {
    const next = activeSet.map((p, i) =>
      i === index ? { ...p, d: { ...(p.d || {}), [key]: val } } : p,
    );
    commitSetUpdate(next);
  };

  const handleMeasureChange = (
    index: number,
    measureKey: string,
    subKey: keyof GarmentMeasurementValue,
    val: string,
  ) => {
    const next = activeSet.map((p, i) => {
      if (i !== index) return p;
      const prevMeasure = p.m?.[measureKey] || {};
      return {
        ...p,
        m: {
          ...(p.m || {}),
          [measureKey]: {
            ...prevMeasure,
            [subKey]: val,
          },
        },
      };
    });
    commitSetUpdate(next);
  };

  const handleAddPiece = (pieceId: string, customLabel?: string) => {
    if (!pieceId || activeSet.some((p) => p.piece === pieceId)) return;
    const def = getGenderAwarePieceDef(
      pieceId,
      (formData as any).gender,
      formData.category,
      dynamicPieces,
    );
    const catOption = categoryAddOptions.find((o) => o.piece === pieceId);
    const defaultLabel = customLabel || catOption?.name || def.name;
    commitSetUpdate([
      ...activeSet,
      createEmptySetPiece(pieceId, defaultLabel, dynamicPieces),
    ]);
  };

  const inferTemplatePieceId = (
    pieceName: string,
    category?: string,
    gender?: string,
  ): string => {
    const n = pieceName.toLowerCase();
    const catLower = String(category || "").toLowerCase();
    const isMenswearVal =
      normalizeSizeFitGender(gender, category) === "men" ||
      catLower.includes("sherwani") ||
      catLower.includes("bandhgala") ||
      catLower.includes("nehru");
    if (/stole|dupatta|shawl|veil|drape|odhani|scarf|muffler|chunri|patka/.test(n)) {
      return "dupatta";
    }
    if (/lehenga|skirt|ghagra/.test(n)) return "lehenga_skirt";
    if (/shirt/.test(n) && isMenswearVal) return "shirt_men";
    if (/(pant|trouser|chino|slack)/.test(n) && isMenswearVal) {
      return "pant_men";
    }
    if (
      /trouser|pant|pyjama|pajama|churidar|salwar|dhoti|breeches|jodhpuri|bottom|palazzo|sharara|gharara/.test(
        n,
      )
    ) {
      return "churidar";
    }
    if (/blouse|choli|corset|bralette|crop/.test(n)) return "blouse";
    if (/cape|belt|sash|kamarband|pocket/.test(n)) return "cape";
    if (/waistcoat|vest|jacket|coat|bandhgala|sherwani|nehru|achkan|bundi/.test(n)) {
      return "sherwani";
    }
    if (n.includes("kurta")) return isMenswearVal ? "kurta_men" : "kurta";
    return isMenswearVal ? "sherwani" : "kurta";
  };

  const openCustomPieceCreator = () => {
    setNewPieceName("");
    setIsAddingCustomPiece(true);
  };

  const handleCreateCustomPiece = async () => {
    const trimmed = newPieceName.trim();
    if (!trimmed || savingCustomPiece) return;
    setSavingCustomPiece(true);
    try {
      const inferredTemplate = inferTemplatePieceId(
        trimmed,
        formData.category,
        (formData as any).gender,
      );
      const saved = await addCategoryPieceOption(
        primaryCategory,
        trimmed,
        inferredTemplate,
        (formData as any).gender,
      );
      if (saved) {
        setDbOptions((prev) => ({
          ...prev,
          masterPieces:
            Array.isArray(saved.masterPieces) && saved.masterPieces.length > 0
              ? saved.masterPieces
              : prev.masterPieces,
          categoryAddOptions:
            saved.categoryAddOptions || prev.categoryAddOptions,
          categoryAllowedPieces:
            saved.categoryAllowedPieces || prev.categoryAllowedPieces,
        }));
        const nextPieces =
          Array.isArray(saved.masterPieces) && saved.masterPieces.length > 0
            ? saved.masterPieces
            : dynamicPieces;
        if (!activeSet.some((p) => p.piece === saved.pieceId)) {
          commitSetUpdate([
            ...activeSet,
            createEmptySetPiece(saved.pieceId, saved.name, nextPieces),
          ]);
        }
        toast.success(
          `Added "${saved.name}" for ${saved.categoryKey || primaryCategory || "this category"}!`,
        );
      }
      setIsAddingCustomPiece(false);
      setNewPieceName("");
    } catch (err: any) {
      toast.error(err?.message || "Unable to add piece to database");
    } finally {
      setSavingCustomPiece(false);
    }
  };

  const formatFitSentence = () => {
    const desc = String(effectiveFitDesc || "").trim();
    const note = String(formData.fitNote || "").trim();
    const hasCustomFit = desc && desc !== "Not said";
    const baseFit = hasCustomFit
      ? `${desc}${note ? `, ${note}` : ""}.`
      : note
        ? `${note}.`
        : "";
    const labelClean = String(formData.designerLabel || "").trim();
    if (labelClean) {
      return `${baseFit ? `${baseFit} ` : ""}It carries a ${labelClean} designer label. Labels vary from house to house, so we have matched its own measurements to our size chart.`;
    }
    return `${baseFit ? `${baseFit} ` : ""}Custom fitted for its first owner, so it carries no size label.`;
  };

  const measuredByList = withCurrentOption(
    dbOptions.measuredByOptions,
    formData.measuredBy,
  );
  const howItFitsList = getHowItFitsOptionsForGender(
    withCurrentOption(dbOptions.howItFitsOptions, effectiveFitDesc),
    (formData as any).gender,
    formData.category,
  );
  const heightList = withCurrentOption(dbOptions.heightOptions, heightFromValue);
  const heightToList = withCurrentOption(heightList, heightToValue);

  const labelClass =
    "block text-[10px] font-semibold text-stone-500 tracking-wider uppercase mb-1";
  const selectOrInputClass =
    "w-full h-9 px-2.5 rounded border border-[#E2D9CB] bg-white text-xs text-stone-800 focus:outline-none focus:border-[#C7A55C]";

  if (isBuyNewOnly) {
    return (
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-serif font-bold text-stone-900 text-sm">
            Size &amp; Fit · this piece
          </h3>
          <span className="rounded-full bg-[#EFE8DC] px-3 py-1 text-[11px] font-medium text-[#5F564A]">
            Buy New · Designer sizes
          </span>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          Buy New listings come in the sizes the designer supplies. Enter those
          available sizes in the Sizes field above (for example, XS, S, M, L or
          Free Size). Piece-by-piece garment measurements apply to Rental and
          Preloved listings.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-stone-100">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-serif font-bold text-stone-900 text-sm">
            Size &amp; Fit · this piece
          </h3>
          <span className="rounded-full border border-[#E2D9CB] bg-[#FAF6EE] px-2.5 py-0.5 text-[10px] font-semibold text-[#7D5B2B]">
            {isMenswear ? "Men" : isWomenswear ? "Women" : "Unisex"}
            {primaryCategory ? ` (from ${primaryCategory})` : ""} ·{" "}
            {summary.guideLabel}
          </span>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-medium ${
            summary.isMeasured
              ? "bg-[#EFE8DC] text-[#5F564A]"
              : "bg-[#F5E9D6] text-[#945B2A]"
          }`}
        >
          {summary.headerBadgeText}
        </span>
      </div>

      {/* Main 2-column body */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT: Garment pieces & metadata */}
        <div className="xl:col-span-8 space-y-4">
          {/* Metadata row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Designer Label — locked to the product's Designer when already set */}
            <div ref={labelDropdownRef} className="relative">
              <label className={labelClass}>
                Designer label, only if it carries one
              </label>

              {productDesigner ? (
                <>
                  <select
                    value={explicitNoLabel ? "" : productDesigner}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) {
                        setExplicitNoLabel(true);
                        onFieldChange("designerLabel", "" as any);
                      } else {
                        setExplicitNoLabel(false);
                        onFieldChange("designerLabel", productDesigner as any);
                      }
                    }}
                    className={selectOrInputClass}
                  >
                    <option value={productDesigner}>{productDesigner}</option>
                    <option value="">
                      No sewn-in label (Made to measure)
                    </option>
                  </select>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Linked to this product&apos;s Designer ({productDesigner}).
                    Other designers cannot be chosen here.
                  </p>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={formData.designerLabel || ""}
                      onFocus={() => setIsLabelDropdownOpen(true)}
                      onClick={() => setIsLabelDropdownOpen(true)}
                      onChange={(e) => {
                        onFieldChange("designerLabel", e.target.value as any);
                        setIsLabelDropdownOpen(true);
                      }}
                      placeholder="Type label or pick from Designers..."
                      className="w-full h-9 pl-8 pr-2.5 rounded border border-[#E2D9CB] bg-white text-xs text-stone-800 focus:outline-none focus:border-[#C7A55C]"
                    />
                  </div>

                  {isLabelDropdownOpen && (
                    <div className="absolute z-30 mt-1 w-full rounded-md border border-[#E2D9CB] bg-white shadow-lg max-h-56 overflow-y-auto">
                      {filteredDesignerLabels.map((lbl) => {
                        const inDesigners = designerRegistryLower.has(
                          lbl.toLowerCase(),
                        );
                        return (
                          <button
                            key={lbl}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelectDesignerLabel(lbl)}
                            className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-xs text-stone-800 hover:bg-[#FAF6EE] border-b border-stone-100 last:border-b-0 cursor-pointer"
                          >
                            <span className="truncate">{lbl}</span>
                            {inDesigners && (
                              <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700">
                                Designer
                              </span>
                            )}
                          </button>
                        );
                      })}

                      {labelQuery && !hasExactLabelMatch && (
                        <button
                          type="button"
                          disabled={creatingLabel}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleCreateDesignerLabel(labelQuery)}
                          className="w-full flex items-center gap-1.5 px-3 py-2 text-left text-xs font-semibold text-[#8F5E16] bg-[#FCF7ED] hover:bg-[#F6ECD9] border-t border-[#E6D4AE] cursor-pointer disabled:opacity-60"
                        >
                          <Plus className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {creatingLabel
                              ? "Adding..."
                              : `Add "${labelQuery}" (saves to Designers)`}
                          </span>
                        </button>
                      )}

                      {filteredDesignerLabels.length === 0 && !labelQuery && (
                        <p className="px-3 py-2 text-[11px] text-stone-400">
                          Type a designer label to search or create one.
                        </p>
                      )}
                    </div>
                  )}

                  <p className="text-[11px] text-stone-400 mt-1">
                    Pick an existing designer label or type a new one to add to
                    Designers.
                  </p>
                </>
              )}
            </div>

            <div>
              <label className={labelClass}>Measured by</label>
              <DynamicOptionSelect
                value={formData.measuredBy || measuredByList[0] || ""}
                options={measuredByList}
                listType="measuredByOptions"
                addLabel="+ Add new option..."
                onChange={(val) => onFieldChange("measuredBy", val as any)}
                onOptionPersisted={handleOptionPersisted}
                className={selectOrInputClass}
              />
              <p className="text-[11px] text-stone-400 mt-1">
                For the team only.
              </p>
            </div>

            <div>
              <label className={labelClass}>How it fits</label>
              <div className="space-y-2">
                <DynamicOptionSelect
                  value={effectiveFitDesc || howItFitsList[0] || ""}
                  options={howItFitsList}
                  listType="howItFitsOptions"
                  addLabel="+ Add new fit style..."
                  onChange={(val) => onFieldChange("fitDesc", val as any)}
                  onOptionPersisted={handleOptionPersisted}
                  className={selectOrInputClass}
                />
                <input
                  type="text"
                  value={formData.fitNote || ""}
                  onChange={(e) =>
                    onFieldChange("fitNote", e.target.value as any)
                  }
                  placeholder="Optional note"
                  className={selectOrInputClass}
                />
              </div>
            </div>
          </div>

          {/* Women / Unisex: Measurements pending callout | Men: Standard menswear size selector */}
          {!summary.isMeasured &&
            (isMenswear ? (
              <div className="rounded-md border border-[#E2D9CB] bg-[#FAF6EE] p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-stone-800">
                    Standard Menswear Size
                  </h4>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    Men&apos;s pieces (Shirt, Pant / Trousers, Sherwani, Kurta)
                    use standard sizing (S–3XL / 36–46). Pick the size below
                    and optionally add garment measurements for Pant, Shirt,
                    Sherwani, or Kurta in the cards below.
                  </p>
                </div>
                <div className="max-w-xs">
                  <label className={labelClass}>Menswear Size (Standard)</label>
                  <select
                    value={resolvedOwnerSize}
                    onChange={(e) =>
                      onFieldChange("ownerSize", e.target.value as any)
                    }
                    className={selectOrInputClass}
                  >
                    <option value="">Not given</option>
                    {activeGuide.rows.map((r) => (
                      <option key={r.size} value={r.size}>
                        {r.size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-[#D9A791] bg-[#FDF9F6] p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-[#9D4427]">
                    Measurements pending
                  </h4>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    The piece can still go live. Its page shows Measurements on
                    request with a WhatsApp button, and an alert is raised the
                    moment it is booked or sold, so the measurements reach{" "}
                    {isWomenswear ? "the bride" : "the buyer"} before it is
                    dispatched.
                  </p>
                </div>
                <div className="max-w-xs">
                  <label className={labelClass}>
                    Its size, in its owner&apos;s words
                  </label>
                  <select
                    value={resolvedOwnerSize}
                    onChange={(e) =>
                      onFieldChange("ownerSize", e.target.value as any)
                    }
                    className={selectOrInputClass}
                  >
                    <option value="">Not given</option>
                    {activeGuide.rows.map((r) => (
                      <option key={r.size} value={r.size}>
                        {r.size}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Until it is measured, the page shows Fits like this size as
                    its owner&apos;s word, and the size filter finds it there.
                  </p>
                </div>
              </div>
            ))}

          {/* One block per garment piece */}
          <div className="space-y-4">
            {activeSet.map((piece, pieceIdx) => {
              const def = getGenderAwarePieceDef(
                piece.piece,
                (formData as any).gender,
                formData.category,
                dynamicPieces,
              );
              const displayKind = getDisplayKindLabel(
                piece.piece,
                formData.category,
                (formData as any).gender,
                dynamicPieces,
              );
              const pieceKey = piece.uid || `${piece.piece}_${pieceIdx}`;
              const isExpanded = Boolean(expandedPieces[pieceKey]);

              const paddedList = withCurrentOption(
                dbOptions.paddedOptions,
                piece.d?.padded,
              );
              const cancanList = withCurrentOption(
                dbOptions.cancanOptions,
                piece.d?.cancan,
              );
              const adaptedClosure = adaptClosureForGender(
                piece.d?.closure,
                (formData as any).gender,
                formData.category,
              );
              const closureList = getClosureOptionsForGender(
                withCurrentOption(dbOptions.closureOptions, adaptedClosure),
                (formData as any).gender,
                formData.category,
              );

              const standardMeasures = def.measures.filter((m) => m.std);
              const extraMeasures = def.measures.filter((m) => !m.std);
              const filledExtraMeasures = extraMeasures.filter((m) => {
                const mv = piece.m?.[m.k];
                return (
                  parseNumericMeasure(mv?.v) !== null ||
                  parseNumericMeasure(mv?.open) !== null ||
                  parseNumericMeasure(mv?.take) !== null
                );
              });
              const hiddenExtraCount =
                extraMeasures.length - filledExtraMeasures.length;

              const visibleMeasures = isExpanded
                ? def.measures
                : [...standardMeasures, ...filledExtraMeasures];

              return (
                <div
                  key={pieceKey}
                  className="rounded-md border border-[#E5DDD0] bg-white overflow-hidden"
                >
                  {/* Piece Header */}
                  <div className="bg-[#F7F3EC] px-4 py-2.5 flex items-center justify-between gap-3 border-b border-[#EAE2D6]">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <input
                        type="text"
                        value={piece.name}
                        onChange={(e) =>
                          handleRenamePiece(pieceIdx, e.target.value)
                        }
                        aria-label={`Piece name for ${def.name}`}
                        className="text-xs font-semibold text-stone-900 bg-transparent border border-transparent hover:border-[#DED4C4] focus:border-[#C7A55C] focus:bg-white rounded px-1.5 py-0.5 outline-none min-w-[110px] max-w-[200px]"
                      />
                      {displayKind &&
                        displayKind.toLowerCase() !==
                          String(piece.name || "")
                            .trim()
                            .toLowerCase() && (
                          <span className="text-[11px] text-stone-400 truncate">
                            {displayKind}
                          </span>
                        )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePiece(pieceIdx)}
                      className="shrink-0 rounded border border-[#E2D9CB] bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600 hover:bg-stone-50 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Piece Details (Padded / Can-can / Closure) */}
                  {def.details.length > 0 && (
                    <div className="px-4 py-2.5 flex flex-wrap items-center gap-4 border-b border-[#EFE9E0] bg-white">
                      {def.details.includes("padded") && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                            Padded
                          </span>
                          <DynamicOptionSelect
                            value={piece.d?.padded || ""}
                            options={paddedList}
                            placeholder="Select"
                            listType="paddedOptions"
                            addLabel="+ Add new..."
                            onChange={(val) =>
                              handleDetailChange(pieceIdx, "padded", val)
                            }
                            onOptionPersisted={handleOptionPersisted}
                            className="h-7 rounded border border-[#E2D9CB] bg-white px-2 text-xs text-stone-800 outline-none focus:border-[#C7A55C]"
                          />
                        </div>
                      )}

                      {def.details.includes("cancan") && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                            Can-can
                          </span>
                          <DynamicOptionSelect
                            value={piece.d?.cancan || ""}
                            options={cancanList}
                            placeholder="Select"
                            listType="cancanOptions"
                            addLabel="+ Add new..."
                            onChange={(val) =>
                              handleDetailChange(pieceIdx, "cancan", val)
                            }
                            onOptionPersisted={handleOptionPersisted}
                            className="h-7 rounded border border-[#E2D9CB] bg-white px-2 text-xs text-stone-800 outline-none focus:border-[#C7A55C]"
                          />
                        </div>
                      )}

                      {def.details.includes("closure") && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                            Closure
                          </span>
                          <DynamicOptionSelect
                            value={adaptedClosure}
                            options={closureList}
                            placeholder="Select"
                            listType="closureOptions"
                            addLabel="+ Add new..."
                            onChange={(val) =>
                              handleDetailChange(pieceIdx, "closure", val)
                            }
                            onOptionPersisted={handleOptionPersisted}
                            className="h-7 rounded border border-[#E2D9CB] bg-white px-2 text-xs text-stone-800 outline-none focus:border-[#C7A55C]"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Measurement Table */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[460px]">
                      <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-semibold tracking-wider uppercase text-stone-500 border-b border-[#F2ECE3]">
                        <div className="col-span-4">Measurement</div>
                        <div className="col-span-2">Measured</div>
                        <div className="col-span-2">CM</div>
                        <div className="col-span-2">Opens to</div>
                        <div className="col-span-2">Takes in to</div>
                      </div>

                      {visibleMeasures.map((mDef, rIdx) => {
                        const mv = piece.m?.[mDef.k] || {};
                        const isMetres = mDef.unit === "m";
                        const cmText = !isMetres ? inchesToCmLabel(mv.v) : "";

                        return (
                          <div
                            key={mDef.k}
                            className={`grid grid-cols-12 items-center px-4 py-2 ${
                              rIdx !== 0 ? "border-t border-[#F4EFE7]" : ""
                            }`}
                          >
                            <div className="col-span-4 pr-2 text-xs text-stone-800 flex items-center gap-1.5">
                              <span>{mDef.lbl}</span>
                              {mDef.role && (
                                <span
                                  title="Used to compute Fits like"
                                  className="text-[#C78F3E] text-[10px] leading-none"
                                >
                                  •
                                </span>
                              )}
                            </div>

                            <div className="col-span-2 pr-2">
                              <input
                                type="text"
                                inputMode="decimal"
                                value={mv.v || ""}
                                onChange={(e) =>
                                  handleMeasureChange(
                                    pieceIdx,
                                    mDef.k,
                                    "v",
                                    e.target.value,
                                  )
                                }
                                placeholder={mDef.unit}
                                className="w-16 h-8 px-2 rounded border border-[#E2D9CB] bg-white text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#C7A55C]"
                              />
                            </div>

                            <div className="col-span-2 text-xs text-stone-400">
                              {isMetres ? "metres" : cmText || "—"}
                            </div>

                            <div className="col-span-2 pr-2">
                              {isMetres ? (
                                <span className="text-xs text-stone-300">—</span>
                              ) : (
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={mv.open || ""}
                                  onChange={(e) =>
                                    handleMeasureChange(
                                      pieceIdx,
                                      mDef.k,
                                      "open",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="in"
                                  className="w-16 h-8 px-2 rounded border border-[#E2D9CB] bg-white text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#C7A55C]"
                                />
                              )}
                            </div>

                            <div className="col-span-2">
                              {isMetres ? (
                                <span className="text-xs text-stone-300">—</span>
                              ) : (
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={mv.take || ""}
                                  onChange={(e) =>
                                    handleMeasureChange(
                                      pieceIdx,
                                      mDef.k,
                                      "take",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="in"
                                  className="w-16 h-8 px-2 rounded border border-[#E2D9CB] bg-white text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#C7A55C]"
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Show more / hide extra measurements */}
                  {extraMeasures.length > 0 &&
                    (hiddenExtraCount > 0 || isExpanded) && (
                      <div className="px-4 py-2 border-t border-[#F4EFE7]">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedPieces((prev) => ({
                              ...prev,
                              [pieceKey]: !isExpanded,
                            }))
                          }
                          className="text-[11px] font-medium text-[#A36A2E] hover:underline cursor-pointer"
                        >
                          {isExpanded
                            ? "Hide extra measurements"
                            : `Show ${hiddenExtraCount} more measurement${hiddenExtraCount > 1 ? "s" : ""}`}
                        </button>
                      </div>
                    )}
                </div>
              );
            })}
          </div>

          {/* Add to this set (category-specific DB-backed options + inline DB creator) */}
          <div className="pt-1 space-y-2">
            {isAddingCustomPiece ? (
              <div className="flex flex-wrap items-center gap-2 rounded-md border border-[#E2D9CB] bg-[#FAF6EE] p-2.5">
                <input
                  type="text"
                  value={newPieceName}
                  onChange={(e) => setNewPieceName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCreateCustomPiece();
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      setIsAddingCustomPiece(false);
                      setNewPieceName("");
                    }
                  }}
                  placeholder={
                    primaryCategory
                      ? isMenswear
                        ? `New piece name for ${primaryCategory} (e.g. Waistcoat, Stole, Pocket square)...`
                        : `New piece name for ${primaryCategory} (e.g. Cape, Belt, Trail)...`
                      : isMenswear
                        ? "New piece name (e.g. Waistcoat, Stole, Pocket square)..."
                        : "New piece name (e.g. Cape, Belt, Trail)..."
                  }
                  autoFocus
                  className="h-8 min-w-[190px] flex-1 rounded border border-[#C7A55C] bg-white px-2.5 text-xs text-stone-800 outline-none"
                />
                <button
                  type="button"
                  onClick={handleCreateCustomPiece}
                  disabled={!newPieceName.trim() || savingCustomPiece}
                  className="h-8 rounded bg-[#A56728] px-3 text-xs font-semibold text-white hover:bg-[#8E561E] disabled:opacity-50 cursor-pointer"
                >
                  {savingCustomPiece ? "Saving..." : "Add to DB"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCustomPiece(false);
                    setNewPieceName("");
                  }}
                  className="h-8 rounded border border-[#E2D9CB] bg-white px-2.5 text-xs text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "__ADD_NEW_PIECE__") {
                      openCustomPieceCreator();
                      return;
                    }
                    const chosen = remainingAddableOptions.find(
                      (o) => o.piece === val,
                    );
                    handleAddPiece(val, chosen?.name);
                  }}
                  className="h-9 rounded border border-dashed border-[#D3C4AE] bg-white px-3 text-xs font-medium text-stone-700 hover:border-[#B69B74] focus:outline-none focus:border-[#C7A55C] cursor-pointer"
                >
                  <option value="">+ Add to this set</option>
                  {remainingAddableOptions.map((opt) => (
                    <option key={opt.piece} value={opt.piece}>
                      {opt.name}
                    </option>
                  ))}
                  <option value="__ADD_NEW_PIECE__">
                    + Add new piece
                    {primaryCategory ? ` for ${primaryCategory}` : ""}...
                  </option>
                </select>
                <span className="text-[11px] text-stone-400">
                  {categoryAddOptions.length === 0
                    ? primaryCategory
                      ? `No preset pieces in DB for ${primaryCategory}. Use "+ Add new piece..." to save one.`
                      : 'Select a category or use "+ Add new piece..." to add one.'
                    : remainingAddableOptions.length === 0
                      ? `All preset pieces for ${primaryCategory || "this category"} are added. Use "+ Add new piece..." to save a new one.`
                      : `Showing remaining pieces for ${primaryCategory || "this category"}. Rename or add a new piece anytime.`}
                </span>
              </div>
            )}
          </div>

          {/* Legend */}
          <p className="text-[11px] text-stone-400 leading-relaxed">
            <span className="text-[#C78F3E] mr-1">•</span>
            {summary.decidingLegend}
          </p>

          {/* Best suited for height + Fit notes */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-stone-100">
            <div className="md:col-span-5">
              <label className={labelClass}>Best suited for height</label>
              <div className="flex items-center gap-2">
                <select
                  value={heightFromValue || ""}
                  onChange={(e) =>
                    onFieldChange("heightFrom", e.target.value as any)
                  }
                  className={selectOrInputClass}
                >
                  <option value="">From</option>
                  {heightList.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-stone-400 shrink-0">to</span>
                <select
                  value={heightToValue || ""}
                  onChange={(e) =>
                    onFieldChange("heightTo", e.target.value as any)
                  }
                  className={selectOrInputClass}
                >
                  <option value="">To</option>
                  {heightToList.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                {isMenswear
                  ? "With footwear (shoes / juttis)."
                  : isWomenswear
                    ? "In heels."
                    : "With footwear."}
              </p>
            </div>

            <div className="md:col-span-7">
              <label className={labelClass}>Fit notes</label>
              <textarea
                rows={2}
                value={formData.fitNotes || ""}
                onChange={(e) =>
                  onFieldChange("fitNotes", e.target.value as any)
                }
                placeholder={
                  isMenswear
                    ? 'e.g. Tailored for its first owner. The jacket/kurta carries a 2" inlay margin at the side seams.'
                    : 'e.g. Made to measure for its first owner. The blouse carries a 2.5" margin at the side seams.'
                }
                className="w-full p-2.5 rounded border border-[#E2D9CB] bg-white text-xs text-stone-800 focus:outline-none focus:border-[#C7A55C]"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Live Product Page Preview */}
        <div className="xl:col-span-4">
          <div className="sticky top-20 space-y-2.5">
            <span className={labelClass}>On its product page</span>

            {summary.isMeasured ? (
              <div className="rounded-md border border-[#E5DDD0] bg-[#FAF6EE] p-4 space-y-3">
                {/* Top box: Fits like + headline description */}
                <div className="flex items-start gap-3">
                  <div className="shrink-0 border border-stone-800 bg-white px-3 py-2 text-center min-w-[92px]">
                    <p className="text-[9px] font-semibold tracking-widest uppercase text-stone-500">
                      Fits like
                    </p>
                    <p className="font-serif text-base font-medium text-stone-900 leading-tight mt-0.5">
                      {summary.fitsLikeText || "—"}
                    </p>
                    {summary.blouseNumberText && (
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {summary.blouseNumberText}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {formData.designerLabel?.trim() && (
                      <span className="inline-block mb-1 rounded border border-[#E6D4AE] bg-[#FBF4E4] px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase text-[#8A5F1D]">
                        Designer label · {formData.designerLabel.trim()}
                      </span>
                    )}
                    <h4 className="font-serif text-base text-stone-900 leading-snug">
                      {formData.designerLabel?.trim()
                        ? "Sized by its measurements"
                        : "Made to measure"}
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed mt-1">
                      {formatFitSentence()}
                    </p>
                  </div>
                </div>

                {/* Headline measurements 2x2 grid */}
                {summary.headlines.length > 0 && (
                  <div className="grid grid-cols-2 border border-[#E5DDD0] bg-white divide-x divide-y divide-[#EFE9DE]">
                    {summary.headlines.map((cell) => (
                      <div key={cell.key} className="p-2.5">
                        <p className="text-[9px] font-semibold tracking-wider uppercase text-stone-400">
                          {cell.label}
                        </p>
                        <p className="font-serif text-base font-medium text-stone-900 leading-tight mt-0.5">
                          {cell.valueText}
                        </p>
                        <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                          {cell.subText}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {summary.setNamesLine && (
                  <p className="text-[11px] text-stone-500">
                    {summary.setNamesLine}
                  </p>
                )}

                {summary.piecePreviews.length > 0 && (
                  <div className="rounded border border-[#E5DDD0] bg-white divide-y divide-[#EFE9DE]">
                    {summary.piecePreviews.map((piecePrev, idx) => (
                      <div key={`${piecePrev.name}-${idx}`} className="p-2.5 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="text-[11px] font-semibold text-stone-800">
                            {piecePrev.name}
                          </span>
                          {piecePrev.kindName &&
                            piecePrev.kindName.toLowerCase() !==
                              piecePrev.name.toLowerCase() && (
                              <span className="text-[10px] text-stone-400">
                                {piecePrev.kindName}
                              </span>
                            )}
                        </div>
                        {piecePrev.detailsParts.length > 0 && (
                          <p className="text-[10px] font-medium text-[#7D5B2B] bg-[#FBF4E4] px-2 py-0.5 rounded inline-block">
                            {piecePrev.detailsParts.join(" · ")}
                          </p>
                        )}
                        {piecePrev.rows.length > 0 && (
                          <div className="divide-y divide-[#F5F0E6]">
                            {piecePrev.rows.map((r) => (
                              <div
                                key={r.label}
                                className="flex items-baseline justify-between gap-2 py-1 text-[11px]"
                              >
                                <span className="text-stone-500">{r.label}</span>
                                <span className="font-medium text-stone-800 text-right">
                                  {r.valueText}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {(summary.heightDisplayText || summary.fitNotesText) && (
                  <div className="rounded border border-[#E5DDD0] bg-white p-2.5 space-y-1 text-[11px]">
                    {summary.heightDisplayText && (
                      <p className="text-stone-700">
                        <span className="font-semibold text-stone-500 uppercase text-[9px] tracking-wider mr-1.5">
                          Best suited for height:
                        </span>
                        {summary.heightDisplayText}
                      </p>
                    )}
                    {summary.fitNotesText && (
                      <p className="text-stone-600 leading-relaxed">
                        <span className="font-semibold text-stone-500 uppercase text-[9px] tracking-wider mr-1.5">
                          Fit notes:
                        </span>
                        {summary.fitNotesText}
                      </p>
                    )}
                  </div>
                )}

                <p className="text-[10px] italic text-stone-400 leading-relaxed">
                  Measured by hand on the garment, all the way round. Allow up to
                  half an inch either way.
                </p>
              </div>
            ) : (
              <div className="rounded-md border border-[#E5DDD0] bg-[#FAF6EE] p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 border border-stone-800 bg-white px-3 py-2 text-center min-w-[84px]">
                    <p className="text-[9px] font-semibold tracking-widest uppercase text-stone-500">
                      {isMenswear
                        ? "Size"
                        : resolvedOwnerSize
                          ? "Fits like"
                          : "Size"}
                    </p>
                    <p className="font-serif text-base font-medium text-stone-900 leading-tight mt-0.5">
                      {resolvedOwnerSize ||
                        (isMenswear ? "Standard" : "On request")}
                    </p>
                    {resolvedOwnerSize && (
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {isMenswear ? "standard size" : "owner's word"}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif text-base text-stone-900 leading-snug">
                      {isMenswear
                        ? resolvedOwnerSize
                          ? `Standard Menswear Size · ${resolvedOwnerSize}`
                          : "Standard Menswear Size"
                        : "Measurements on request"}
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed mt-1">
                      {isMenswear
                        ? resolvedOwnerSize
                          ? `Sized to standard menswear size ${resolvedOwnerSize}. Ask us on WhatsApp if you need exact garment measurements for Pant, Shirt, Sherwani, or Kurta before booking.`
                          : "Men's pieces follow standard sizing (S–3XL / 36–46). Ask us on WhatsApp if you need exact garment measurements before booking."
                        : resolvedOwnerSize
                          ? `Its owner describes it as ${resolvedOwnerSize}. We are taking its exact measurements. Ask us and we will share them before you book.`
                          : "We are taking this piece's exact measurements. Ask us and we will share them before you book."}
                    </p>
                  </div>
                </div>

                {(summary.piecePreviews.length > 0 ||
                  summary.heightDisplayText ||
                  summary.fitNotesText) && (
                  <div className="rounded border border-[#E5DDD0] bg-white p-2.5 space-y-1.5 text-[11px]">
                    {summary.piecePreviews.map((piecePrev, idx) => (
                      <p key={`${piecePrev.name}-${idx}`} className="text-stone-700">
                        <span className="font-semibold">{piecePrev.name}:</span>{" "}
                        {piecePrev.detailsParts.join(" · ")}
                      </p>
                    ))}
                    {summary.heightDisplayText && (
                      <p className="text-stone-700">
                        <span className="font-semibold text-stone-500 uppercase text-[9px] tracking-wider mr-1.5">
                          Best suited for height:
                        </span>
                        {summary.heightDisplayText}
                      </p>
                    )}
                    {summary.fitNotesText && (
                      <p className="text-stone-600 leading-relaxed">
                        <span className="font-semibold text-stone-500 uppercase text-[9px] tracking-wider mr-1.5">
                          Fit notes:
                        </span>
                        {summary.fitNotesText}
                      </p>
                    )}
                  </div>
                )}

                <div className="border border-emerald-700/70 bg-white px-3 py-2 text-center text-[10px] font-semibold tracking-widest uppercase text-emerald-800">
                  Ask for its measurements on WhatsApp
                </div>
              </div>
            )}

            <p className="text-[11px] text-stone-400 leading-relaxed">
              {summary.filterNote}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-stone-400">
          The garment pieces, their measurements, the size guides and the fit
          allowance are kept in Master Data.
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isSaving) onSaveSizeAndFit();
          }}
          disabled={isSaving}
          className={`px-4 py-2 text-xs font-semibold rounded transition cursor-pointer ${
            isSaving
              ? "bg-gray-400 cursor-not-allowed opacity-70 text-white"
              : "bg-[#A56728] hover:bg-[#8E561E] text-white"
          }`}
        >
          {isSaving
            ? "Saving..."
            : saveSuccess
              ? "✅ Saved!"
              : "Save Size & Fit"}
        </button>
      </div>
    </div>
  );
}
