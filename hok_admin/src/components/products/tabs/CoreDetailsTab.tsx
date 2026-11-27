import React, { useState } from "react";
import { Plus, RefreshCw, X } from "lucide-react";
import { Product, Lister } from "../../types/product";
import toast from "react-hot-toast";
import { useTeamPermissions } from "../../TeamPermissions";
import { getDesigners, createDesigner } from "../../../services/designerApi";
import { createLister } from "../../../services/listerApi";
import { apiRequest } from "../../../services/apiClient";
import DynamicCategorySelect from "../../ui/DynamicCategorySelect";
import DynamicOccasionSelect from "../../ui/DynamicOccasionSelect";
import DynamicColorSelect from "../../ui/DynamicColorSelect";
import DynamicSizeSelect from "../../ui/DynamicSizeSelect";
import { SizeAndFitCard } from "./SizeAndFitCard";
import {
  adaptFitDescForGender,
  adaptSetForGender,
  computeSizeFitSummary,
  deriveLegacyMeasurementsFromSet,
  formatMeasuredDateToday,
  getDefaultSetForCategory,
  hasAnyMeasurementValue,
  hydrateSizeFitSetFromProduct,
  resolveSizeGuide,
} from "../utils/sizeFitEngine";
import {
  Category,
  FabricCareOption,
  getCategories,
  getFabricCareOptions,
  createFabricCareOption,
} from "../../../services/categoryApi";

interface Designer {
  id: string;
  name: string;
}

interface CoreDetailsTabProps {
  formData: Partial<Product>;
  onFieldChange: <K extends keyof Product>(field: K, value: Product[K]) => void;
  listers: Lister[];
  designers?: Designer[];
  onDesignerCreated?: (newDesigner: any) => void;
  onListerCreated?: (newLister: any) => void;
  onCategoryCreated?: (newCategory: any) => void;
  onSave: (data?: Product) => Promise<boolean> | boolean | void;
  onDiscard?: () => void;
  errors?: Record<string, string>;
  productId?: string;
  isSaving?: boolean;
  resetForm?: () => void;
  onAutoGenerateSku?: () => Promise<void> | void;
  generatingSku?: boolean;
  onSizeFitSaved?: (patch: Partial<Product>) => void;
}

const STATUS_OPTIONS = [
  "Draft",
  "Pending Review",
  "Live",
  "Paused",
  "Out of Stock",
  "Archived",
];

export function CoreDetailsTab({
  formData,
  onFieldChange,
  listers,
  designers = [],
  onDesignerCreated,
  onListerCreated,
  onCategoryCreated,
  onSave,
  onDiscard,
  errors = {},
  productId,
  isSaving: externalIsSaving = false,
  onAutoGenerateSku,
  generatingSku = false,
  onSizeFitSaved,
}: CoreDetailsTabProps) {
  const { hasDecision, refuseDecision, canEditSection, refuseDoor } =
    useTeamPermissions();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [localSaving, setLocalSaving] = useState(false);
  const [fetchedDesigners, setFetchedDesigners] = useState<Designer[]>([]);
  const [localListers, setLocalListers] = useState<Lister[]>([]);

  // Inline Quick-Create Designer state
  const [showNewDesignerBox, setShowNewDesignerBox] = useState(false);
  const [newDesignerName, setNewDesignerName] = useState("");
  const [newDesignerType, setNewDesignerType] = useState<
    "Indie Designer" | "Couture House" | "Contemporary Label" | "Heritage Weave"
  >("Indie Designer");
  const [creatingDesigner, setCreatingDesigner] = useState(false);

  // Inline Quick-Create Lister state
  const [showNewListerBox, setShowNewListerBox] = useState(false);
  const [newListerName, setNewListerName] = useState("");
  const [newListerPhone, setNewListerPhone] = useState("");
  const [newListerCity, setNewListerCity] = useState("");
  const [creatingLister, setCreatingLister] = useState(false);

  // Fabric Care (DB-backed via /api/categories/fabric-care)
  const [fabricCareOptions, setFabricCareOptions] = useState<
    FabricCareOption[]
  >([]);
  const [loadingFabricCare, setLoadingFabricCare] = useState(false);
  const [showNewFabricCareBox, setShowNewFabricCareBox] = useState(false);
  const [newFabricCareLabel, setNewFabricCareLabel] = useState("");
  const [newFabricCareNotes, setNewFabricCareNotes] = useState("");
  const [creatingFabricCare, setCreatingFabricCare] = useState(false);

  // Categories (for automatically deriving Gender / Main Category from Category)
  const [dbCategories, setDbCategories] = useState<Category[]>([]);

  React.useEffect(() => {
    const fetchCategoryMetadata = async () => {
      try {
        const cats = await getCategories();
        if (Array.isArray(cats)) setDbCategories(cats);
      } catch (e) {
        console.warn("Failed to fetch category metadata:", e);
      }
    };
    fetchCategoryMetadata();
  }, []);

  const resolveCategoryMainGender = React.useCallback(
    (categoryStr?: string): string => {
      const tokens = String(categoryStr || "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      if (tokens.length === 0) return "";

      const resolved: string[] = [];
      for (const tok of tokens) {
        const matched = dbCategories.find((c) => {
          const cn = String(c?.name || "").trim().toLowerCase();
          return cn === tok || cn.replace(/s$/, "") === tok.replace(/s$/, "");
        });
        if (matched?.mainCategory) {
          resolved.push(matched.mainCategory);
          continue;
        }
        if (
          tok.includes("sherwani") ||
          tok.includes("bandhgala") ||
          tok.includes("nehru") ||
          tok.includes("achkan") ||
          tok.includes("jodhpuri") ||
          tok.includes("waistcoat") ||
          tok.includes("bundi") ||
          /\b(shirt|shirts|pant|pants|trouser|trousers|blazer|suit|suits|men|mens)\b/.test(
            tok,
          )
        ) {
          resolved.push("Men");
        } else if (
          tok.includes("lehenga") ||
          tok.includes("saree") ||
          tok.includes("sari") ||
          tok.includes("anarkali") ||
          tok.includes("gown") ||
          tok.includes("sharara") ||
          tok.includes("gharara")
        ) {
          resolved.push("Women");
        } else if (
          tok.includes("kurta") ||
          tok.includes("indo-western") ||
          tok.includes("indo western")
        ) {
          resolved.push("Unisex");
        }
      }

      if (resolved.length === 0) return "";
      const hasWomen = resolved.some((g) => g.toLowerCase() === "women");
      const hasMen = resolved.some((g) => g.toLowerCase() === "men");
      if (hasWomen && hasMen) return "Unisex";
      if (hasMen) return "Men";
      if (hasWomen) return "Women";
      return resolved[0];
    },
    [dbCategories],
  );

  // Always keep product gender automatically synced from its connected Category Main Category
  React.useEffect(() => {
    const catGender = resolveCategoryMainGender(formData.category);
    if (
      catGender &&
      String(formData.gender || "").trim().toLowerCase() !==
        catGender.toLowerCase()
    ) {
      onFieldChange("gender", catGender);
    }
  }, [formData.gender, formData.category, resolveCategoryMainGender]);

  React.useEffect(() => {
    const fetchDesignersFromApi = async () => {
      try {
        const data = await getDesigners();
        const valid = (Array.isArray(data) ? data : [])
          .filter(
            (d: any) =>
              d &&
              d.name &&
              String(d.name).trim() !== "" &&
              d.name !== "undefined" &&
              d.status !== "Suspended" &&
              d.status !== "Inactive",
          )
          .map((d: any) => ({
            id: String(d.id || d.designerId || d._id || d.name),
            name: String(d.name).trim(),
          }));
        const seen = new Set<string>();
        const deduped = valid.filter((d) => {
          const k = d.name.toLowerCase();
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
        setFetchedDesigners(deduped);
      } catch (e) {
        console.warn("Failed to fetch designers in CoreDetailsTab:", e);
      }
    };
    const fetchFabricCareFromApi = async () => {
      setLoadingFabricCare(true);
      try {
        const items = await getFabricCareOptions();
        if (Array.isArray(items)) {
          setFabricCareOptions(items);
        }
      } catch (e) {
        console.warn("Failed to fetch fabric care options:", e);
      } finally {
        setLoadingFabricCare(false);
      }
    };
    fetchDesignersFromApi();
    fetchFabricCareFromApi();
  }, []);

  const activeDesigners = React.useMemo(() => {
    const raw = [...designers, ...fetchedDesigners];
    const seen = new Set<string>();
    return raw.filter((d: any) => {
      if (!d || !d.name || !String(d.name).trim() || d.name === "undefined") {
        return false;
      }
      if (d.status === "Suspended" || d.status === "Inactive") return false;
      const k = String(d.name).trim().toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [designers, fetchedDesigners]);

  const activeListers = React.useMemo(() => {
    const merged = [...listers, ...localListers];
    const seen = new Set<string>();
    return merged.filter((l: any) => {
      const uid = String(l?.listerId || l?._id || l?.id || "").trim();
      const nm = String(l?.name || "").trim();
      if (!uid || !nm) return false;
      const key = uid.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [listers, localListers]);

  const matchedListerValue = React.useMemo(() => {
    const raw = String(formData.listerId || "").trim();
    if (!raw) return "";
    const lower = raw.toLowerCase();
    const found = activeListers.find((l: any) => {
      const uid = String(l.listerId || l._id || l.id || "").trim();
      return (
        uid === raw ||
        uid.toLowerCase() === lower ||
        String(l._id || "").toLowerCase() === lower ||
        String(l.id || "").toLowerCase() === lower ||
        String(l.name || "").trim().toLowerCase() === lower ||
        String(l.name || "")
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") === lower
      );
    });
    return found ? String(found.listerId || found._id || found.id || "") : "";
  }, [formData.listerId, activeListers]);

  const handleQuickCreateDesigner = async (overrideName?: string) => {
    if (!canEditSection("designers")) {
      refuseDoor("designers");
      return;
    }
    const trimmed = String(overrideName ?? newDesignerName).trim();
    if (!trimmed) {
      toast.error("Please enter a designer name.");
      return;
    }
    const existing = activeDesigners.find(
      (d) => d.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) {
      onFieldChange("designer", existing.name);
      setShowNewDesignerBox(false);
      setNewDesignerName("");
      toast.success(`Selected existing designer "${existing.name}"`);
      return;
    }

    setCreatingDesigner(true);
    try {
      const created: any = await createDesigner({
        name: trimmed,
        type: newDesignerType,
        status: "Active",
      } as any);
      const createdEntry = {
        id: String(created?.id || created?.designerId || created?._id || trimmed),
        name: String(created?.name || trimmed).trim(),
      };
      setFetchedDesigners((prev) => [createdEntry, ...prev]);
      onDesignerCreated?.(created || createdEntry);
      onFieldChange("designer", createdEntry.name);
      setNewDesignerName("");
      setShowNewDesignerBox(false);
      toast.success(
        `Designer "${createdEntry.name}" created & selected! You can edit full details anytime in Designers.`,
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to create designer");
    } finally {
      setCreatingDesigner(false);
    }
  };

  const handleQuickCreateLister = async () => {
    if (!canEditSection("listers")) {
      refuseDoor("listers");
      return;
    }
    const trimmedName = newListerName.trim();
    const trimmedPhone = newListerPhone.trim();
    const trimmedCity = newListerCity.trim();

    if (!trimmedName) {
      toast.error("Please enter the lister's name.");
      return;
    }
    if (trimmedPhone && trimmedPhone.replace(/\D/g, "").length < 10) {
      toast.error("Phone number must have at least 10 digits (or leave blank to add later).");
      return;
    }

    const existing = activeListers.find(
      (l) => String(l.name || "").trim().toLowerCase() === trimmedName.toLowerCase(),
    );
    if (existing) {
      const uid = String(existing.listerId || existing._id || existing.id || "");
      onFieldChange("listerId", uid);
      setShowNewListerBox(false);
      setNewListerName("");
      setNewListerPhone("");
      setNewListerCity("");
      toast.success(`Selected existing lister "${existing.name}"`);
      return;
    }

    setCreatingLister(true);
    try {
      let created: any;
      try {
        created = await createLister({
          name: trimmedName,
          ...(trimmedPhone ? { phone: trimmedPhone } : {}),
          ...(trimmedCity ? { city: trimmedCity } : {}),
          status: "Verified",
        } as any);
      } catch (firstErr: any) {
        if (
          !trimmedPhone &&
          String(firstErr?.message || "")
            .toLowerCase()
            .includes("phone")
        ) {
          created = await createLister({
            name: trimmedName,
            phone: "0000000000",
            ...(trimmedCity ? { city: trimmedCity } : {}),
            status: "Verified",
          } as any);
        } else {
          throw firstErr;
        }
      }
      const newUid = String(
        created?.listerId || created?.id || created?._id || trimmedName,
      );
      const listerObj: Lister = {
        ...created,
        id: created?.id || newUid,
        listerId: newUid,
        name: created?.name || trimmedName,
      };
      setLocalListers((prev) => [listerObj, ...prev]);
      onListerCreated?.(listerObj);
      onFieldChange("listerId", newUid);
      setNewListerName("");
      setNewListerPhone("");
      setNewListerCity("");
      setShowNewListerBox(false);
      toast.success(
        `Lister "${listerObj.name}" created & selected! You can update full details anytime in Listers.`,
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to create lister");
    } finally {
      setCreatingLister(false);
    }
  };

  const matchedRegisteredDesigner = React.useMemo(() => {
    const cur = String(formData.designer || "").trim().toLowerCase();
    if (!cur) return "";
    const match = activeDesigners.find(
      (d) => String(d.name).trim().toLowerCase() === cur,
    );
    return match ? match.name : "";
  }, [formData.designer, activeDesigners]);

  const data = formData as Record<string, any>;

  const selectedCareOptionId = React.useMemo(() => {
    const explicit = String(formData.careByFabric || "")
      .trim()
      .toLowerCase();
    if (explicit) {
      const matchByField = fabricCareOptions.find(
        (o) =>
          o.id.toLowerCase() === explicit || o.label.toLowerCase() === explicit,
      );
      if (matchByField) return matchByField.id;
    }

    if (Array.isArray(formData.care) && formData.care.length > 0) {
      const normalizedCare = formData.care
        .map((line) => String(line || "").trim())
        .filter(Boolean);
      if (normalizedCare.length > 0) {
        const matchByInstructions = fabricCareOptions.find(
          (o) =>
            o.instructions.length === normalizedCare.length &&
            o.instructions.every((line, idx) => line === normalizedCare[idx]),
        );
        return matchByInstructions ? matchByInstructions.id : "__CUSTOM_CARE__";
      }
    }
    return "";
  }, [formData.careByFabric, formData.care, fabricCareOptions]);

  const handleCareByFabricChange = (value: string) => {
    if (value === "__CREATE_NEW_FABRIC_CARE__") {
      setShowNewFabricCareBox(true);
      return;
    }
    if (!value) {
      onFieldChange("careByFabric", "" as any);
      onFieldChange("care", [] as any);
      return;
    }
    if (value === "__CUSTOM_CARE__") {
      return;
    }
    const chosen = fabricCareOptions.find(
      (o) => o.id.toLowerCase() === value.toLowerCase(),
    );
    if (chosen) {
      onFieldChange("careByFabric", chosen.id as any);
      onFieldChange("care", [...(chosen.instructions || [])] as any);
    }
  };

  const handleQuickCreateFabricCare = async () => {
    const label = newFabricCareLabel.trim();
    if (!label) {
      toast.error("Please enter a fabric care title.");
      return;
    }
    const existing = fabricCareOptions.find(
      (o) => o.label.toLowerCase() === label.toLowerCase(),
    );
    if (existing) {
      onFieldChange("careByFabric", existing.id as any);
      onFieldChange("care", [...(existing.instructions || [])] as any);
      setShowNewFabricCareBox(false);
      setNewFabricCareLabel("");
      setNewFabricCareNotes("");
      toast.success(`Selected existing "${existing.label}"`);
      return;
    }

    const instructions = newFabricCareNotes
      .split(/\r?\n|;/)
      .map((s) => s.trim())
      .filter(Boolean);

    setCreatingFabricCare(true);
    try {
      const created = await createFabricCareOption({ label, instructions });
      setFabricCareOptions((prev) =>
        [...prev.filter((p) => p.id !== created.id), created].sort((a, b) =>
          a.label.localeCompare(b.label),
        ),
      );
      onFieldChange("careByFabric", created.id as any);
      onFieldChange("care", [...(created.instructions || [])] as any);
      setNewFabricCareLabel("");
      setNewFabricCareNotes("");
      setShowNewFabricCareBox(false);
      toast.success(`"${created.label}" added to Fabric Care database!`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save fabric care");
    } finally {
      setCreatingFabricCare(false);
    }
  };

  const labelClass =
    "text-[11px] font-semibold text-stone-500 tracking-wide uppercase";
  const baseInputClass =
    "w-full p-2 rounded text-xs mt-1 focus:outline-none focus:ring-1 border";
  const inputClass = `${baseInputClass} bg-[#fcf9f5] border-stone-200 focus:ring-stone-400`;
  const getInputClass = (field: string, extra = "") =>
    `${baseInputClass} ${
      errors[field]
        ? "bg-red-50/40 border-red-400 focus:ring-red-300"
        : "bg-[#fcf9f5] border-stone-200 focus:ring-stone-400"
    } ${extra}`.trim();
  const renderError = (field: string) =>
    errors[field] ? (
      <p className="text-[11px] text-red-600 mt-1">{errors[field]}</p>
    ) : null;
  const helpClass = "text-[11px] text-stone-400 mt-1";

  const handleSaveCoreDetails = async () => {
    if (isSaving || localSaving || externalIsSaving) return;

    setIsSaving(true);
    setLocalSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const saved = await Promise.resolve(onSave());
      setLocalSaving(false);
      setIsSaving(false);
      if (saved === true) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "An error occurred while saving",
      );
      setLocalSaving(false);
      setIsSaving(false);
    }
  };

  const handleSaveSizeAndFit = async () => {
    if (isSaving || localSaving || externalIsSaving) return;

    const currentSet = hydrateSizeFitSetFromProduct(formData);
    const derived = deriveLegacyMeasurementsFromSet(
      currentSet,
      formData.heightFrom,
      formData.heightTo,
      (formData as any).gender,
      formData.category,
    );
    const resolvedOwner =
      formData.ownerSize !== undefined
        ? formData.ownerSize
        : Array.isArray(formData.sizes) && formData.sizes.length === 1
          ? String(formData.sizes[0] || "")
          : "";
    const resolvedFitDesc = adaptFitDescForGender(
      formData.fitDesc,
      (formData as any).gender,
      formData.category,
    );
    const fitSummary = computeSizeFitSummary(currentSet, {
      category: formData.category,
      gender: (formData as any).gender,
      ownerSize: resolvedOwner,
      designerLabel: formData.designerLabel,
      fitDesc: resolvedFitDesc,
      fitNote: formData.fitNote,
      measuredBy: formData.measuredBy,
      measuredOn: formData.measuredOn,
    });
    const nextMeasuredOn = fitSummary.isMeasured
      ? formData.measuredOn || formatMeasuredDateToday()
      : "";
    const modes = Array.isArray(formData.listingModes)
      ? formData.listingModes.map((m) => String(m || "").toUpperCase().trim())
      : [];
    const hasBuyNew = modes.includes("BUY NEW");
    const syncedSizes =
      !hasBuyNew && fitSummary.isMeasured && fitSummary.filterSizes.length > 0
        ? fitSummary.filterSizes
        : Array.isArray(formData.sizes) && formData.sizes.length > 0
          ? formData.sizes
          : fitSummary.filterSizes;

    const sizeFitPatch: Partial<Product> = {
      set: currentSet,
      measurements: derived.measurements,
      measurementsCm: derived.measurementsCm,
      bestSuitedForHeight:
        derived.bestSuitedForHeight || formData.bestSuitedForHeight || "",
      sizes: syncedSizes,
      fitDesc: resolvedFitDesc || "Not said",
      fitNote: formData.fitNote || "",
      fitNotes: formData.fitNotes || "",
      measuredBy: formData.measuredBy || "The HOK team",
      measuredOn: nextMeasuredOn,
      designerLabel: formData.designerLabel || "",
      ownerSize: resolvedOwner,
      heightFrom: formData.heightFrom || "",
      heightTo: formData.heightTo || "",
    };

    onFieldChange("set", sizeFitPatch.set as any);
    onFieldChange("measurements", sizeFitPatch.measurements as any);
    onFieldChange("measurementsCm", sizeFitPatch.measurementsCm as any);
    onFieldChange("bestSuitedForHeight", sizeFitPatch.bestSuitedForHeight as any);
    onFieldChange("sizes", sizeFitPatch.sizes as any);
    onFieldChange("measuredOn", sizeFitPatch.measuredOn as any);

    if (!productId) {
      await handleSaveCoreDetails();
      return;
    }

    setIsSaving(true);
    setLocalSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await apiRequest(
        `/products/${encodeURIComponent(productId)}/measurements`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sizeFitPatch),
        },
      );
      const persistedPatch = {
        ...sizeFitPatch,
        ...(response?.data && typeof response.data === "object"
          ? response.data
          : {}),
      };
      if (response?.data?.createdDesigner) {
        const createdDes = response.data.createdDesigner;
        setFetchedDesigners((prev) => {
          const exists = prev.some(
            (d) =>
              d.name.toLowerCase() ===
              String(createdDes.name || "").trim().toLowerCase(),
          );
          return exists
            ? prev
            : [
                {
                  id: String(
                    createdDes.designerId || createdDes.id || createdDes._id,
                  ),
                  name: String(createdDes.name).trim(),
                },
                ...prev,
              ];
        });
        onDesignerCreated?.(createdDes);
      }
      onSizeFitSaved?.(persistedPatch);
      toast.success("Size & Fit saved successfully!");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to save Size & Fit";
      setSaveError(msg);
      toast.error(msg);
    } finally {
      setLocalSaving(false);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <strong>Error:</strong> {saveError}
          <button
            onClick={() => setSaveError(null)}
            className="float-right text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          ✅ Product saved successfully!
          <button
            onClick={() => setSaveSuccess(false)}
            className="float-right text-green-500 hover:text-green-700"
          >
            ×
          </button>
        </div>
      )}

      {/* ---------------- Status & Publishing Workflow ---------------- */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-serif font-bold text-stone-900 text-sm">
            Status &amp; Publishing Workflow
          </h3>
          <span className="text-[10px] font-semibold tracking-wide text-stone-400 uppercase">
            Ops Prepares · Super Admin Publishes
          </span>
        </div>

        <div className="border-t border-stone-100 pt-4">
          {!productId && (
            <div className="flex items-start gap-3 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 mb-4">
              <span className="shrink-0 px-2 py-0.5 text-[11px] font-semibold text-stone-500 bg-white border border-stone-300 rounded">
                New
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                Not yet created. Fill in details, pricing and photos — the piece
                is saved as a{" "}
                <strong className="font-semibold text-stone-800">Draft</strong>{" "}
                when you click{" "}
                <strong className="font-semibold text-stone-800">
                  Create Product
                </strong>
                , and enters the review workflow from there.
              </p>
            </div>
          )}
          <p className="text-xs text-stone-500 mb-4">
            Draft → Pending Review → Live · Paused, Out of Stock and Archived
            are side states
          </p>
          <label className={labelClass}>
            Set Status Directly (Super Admin Override)
          </label>
          <select
            value={formData.status || "Draft"}
            onChange={(e) => {
              const next = e.target.value as Product["status"];
              if (
                next === "Live" &&
                formData.status !== "Live" &&
                !hasDecision("put_piece_live")
              ) {
                refuseDecision("put_piece_live");
                return;
              }
              onFieldChange("status", next);
            }}
            className={`${inputClass} max-w-sm`}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status === "Live" && !hasDecision("put_piece_live")
                  ? "Live (locked)"
                  : status}
              </option>
            ))}
          </select>
          <p className={helpClass}>
            Prefer the workflow buttons — the override path is still logged to
            Activity.
          </p>
        </div>
      </div>

      {/* ---------------- Core Details Card ---------------- */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-5">
        {/* Product Title / Designer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => onFieldChange("name", e.target.value)}
              placeholder="Enter product title..."
              className={getInputClass("name")}
            />
            {renderError("name")}
          </div>
          <div>
            <label className={labelClass}>
              Designer <span className="text-red-500">*</span>
            </label>
            <select
              value={matchedRegisteredDesigner}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "__CREATE_NEW_DESIGNER__") {
                  setShowNewDesignerBox(true);
                  return;
                }
                onFieldChange("designer", val);
              }}
              className={getInputClass("designer")}
            >
              <option value="">Select designer...</option>
              {activeDesigners.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
              <option value="__CREATE_NEW_DESIGNER__">
                + Create new designer...
              </option>
            </select>

            {formData.designer &&
              !matchedRegisteredDesigner &&
              activeDesigners.length > 0 && (
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 rounded border border-amber-200 bg-amber-50/70 px-2.5 py-1.5 text-[11px] text-amber-800">
                  <span>
                    &ldquo;{formData.designer}&rdquo; is not in Designers yet.
                  </span>
                  <button
                    type="button"
                    disabled={creatingDesigner}
                    onClick={() =>
                      handleQuickCreateDesigner(String(formData.designer || ""))
                    }
                    className="font-semibold text-[#8F5E16] underline hover:text-[#5E3C0B] cursor-pointer"
                  >
                    + Add &ldquo;{formData.designer}&rdquo; to Designers
                  </button>
                </div>
              )}

            {showNewDesignerBox && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  value={newDesignerName}
                  onChange={(e) => setNewDesignerName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleQuickCreateDesigner();
                    }
                    if (e.key === "Escape") {
                      setShowNewDesignerBox(false);
                    }
                  }}
                  placeholder="Enter new designer name..."
                  className="flex-1 rounded border border-[#D8CFC2] bg-white px-2.5 py-1.5 text-xs text-stone-800 outline-none focus:border-[#C7A55C]"
                />
                <button
                  type="button"
                  disabled={creatingDesigner}
                  onClick={() => handleQuickCreateDesigner()}
                  className="rounded bg-[#C7A55C] hover:bg-[#B8954B] px-3 py-1.5 text-xs font-semibold text-[#2A2118] disabled:opacity-60 cursor-pointer shrink-0"
                >
                  {creatingDesigner ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewDesignerBox(false)}
                  className="rounded border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 cursor-pointer shrink-0"
                >
                  Cancel
                </button>
              </div>
            )}

            <p className={helpClass}>
              One registry, one spelling — mapping here is what powers the
              designer page, filter facet and reports for this piece.
            </p>
            {renderError("designer")}
          </div>
        </div>

        {/* Lister — Supply Owner */}
        <div>
          <label className={labelClass}>Lister — Supply Owner</label>
          <select
            value={matchedListerValue}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "__CREATE_NEW_LISTER__") {
                setShowNewListerBox(true);
                return;
              }
              onFieldChange("listerId", val);
            }}
            className={inputClass}
          >
            <option value="">Select a lister (or leave empty for HOK stock)</option>
            {activeListers.map((lister) => {
              const uniqueId =
                lister.listerId || lister._id || lister.id || "";
              return (
                <option key={uniqueId} value={uniqueId}>
                  {lister.name} ({uniqueId})
                </option>
              );
            })}
            <option value="__CREATE_NEW_LISTER__">
              + Create new lister...
            </option>
          </select>

          {showNewListerBox && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                autoFocus
                value={newListerName}
                onChange={(e) => setNewListerName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleQuickCreateLister();
                  }
                  if (e.key === "Escape") {
                    setShowNewListerBox(false);
                  }
                }}
                placeholder="Enter new lister name..."
                className="flex-1 rounded border border-[#D8CFC2] bg-white px-2.5 py-1.5 text-xs text-stone-800 outline-none focus:border-[#C7A55C]"
              />
              <button
                type="button"
                disabled={creatingLister}
                onClick={handleQuickCreateLister}
                className="rounded bg-[#C7A55C] hover:bg-[#B8954B] px-3 py-1.5 text-xs font-semibold text-[#2A2118] disabled:opacity-60 cursor-pointer shrink-0"
              >
                {creatingLister ? "Adding..." : "Add"}
              </button>
              <button
                type="button"
                onClick={() => setShowNewListerBox(false)}
                className="rounded border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 cursor-pointer shrink-0"
              >
                Cancel
              </button>
            </div>
          )}

          <p className={helpClass}>
            Who owns this piece — powers the lister profile grid, payout
            attribution and supply reports. Leave on HOK stock for
            designer-partner pieces.
          </p>
        </div>

        {/* Subtitle */}
        <div>
          <label className={labelClass}>Subtitle (Listing Card)</label>
          <input
            type="text"
            value={formData.subtitle || ""}
            onChange={(e) => onFieldChange("subtitle", e.target.value)}
            placeholder="Silk organza · Deep crimson"
            className={inputClass}
          />
        </div>

        {/* Full Description */}
        <div>
          <label className={labelClass}>
            Full Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => onFieldChange("description", e.target.value)}
            rows={4}
            placeholder="Describe the garment, fit, styling notes, and fabric details..."
            className={getInputClass("description")}
          />
          {renderError("description")}
        </div>

        {/* Rating / Review Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Rating (out of 5)</label>
            <input
              type="number"
              value={formData.rating || ""}
              onChange={(e) =>
                onFieldChange("rating", parseFloat(e.target.value) || 0)
              }
              className={inputClass}
              min="0"
              max="5"
              step="0.1"
            />
          </div>
          <div>
            <label className={labelClass}>Review Count</label>
            <input
              type="number"
              value={formData.reviewCount || ""}
              onChange={(e) =>
                onFieldChange("reviewCount", parseInt(e.target.value) || 0)
              }
              className={inputClass}
              min="0"
            />
          </div>
          <p className={`${helpClass} md:col-span-2 -mt-3`}>
            Shown as stars beside the title on the PDP
          </p>
        </div>

        {/* Category / Occasion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <DynamicCategorySelect
              value={formData.category || ""}
              onChange={(value) => {
                onFieldChange("category", value);
                const catMainGender = resolveCategoryMainGender(value);
                const nextGender =
                  catMainGender || String(formData.gender || "").trim();
                if (catMainGender) {
                  onFieldChange("gender", catMainGender);
                }
                const hasLegacy = Boolean(
                  formData.measurements?.bust ||
                    formData.measurements?.waist ||
                    formData.measurements?.hips ||
                    formData.measurements?.length,
                );
                const hasMeasures =
                  hasAnyMeasurementValue(formData.set) || hasLegacy;
                onFieldChange(
                  "set",
                  (hasMeasures
                    ? adaptSetForGender(
                        hydrateSizeFitSetFromProduct(formData),
                        nextGender,
                        value,
                      )
                    : getDefaultSetForCategory(value, nextGender)) as any,
                );
                const nextFitDesc = adaptFitDescForGender(
                  formData.fitDesc,
                  nextGender,
                  value,
                );
                if (formData.fitDesc && nextFitDesc !== formData.fitDesc) {
                  onFieldChange("fitDesc", nextFitDesc as any);
                }
                if (formData.ownerSize) {
                  const nextGuide = resolveSizeGuide(value, nextGender);
                  const validSizes = new Set(
                    nextGuide.rows.map((r) => r.size.toLowerCase()),
                  );
                  if (!validSizes.has(String(formData.ownerSize).toLowerCase())) {
                    onFieldChange("ownerSize", "" as any);
                  }
                }
              }}
              onCategoryCreated={(newCat) => {
                if (newCat?.name) {
                  setDbCategories((prev) => [...prev, newCat]);
                }
                onCategoryCreated?.(newCat);
              }}
              className="mt-1"
            />
          </div>
          <div>
            <label className={labelClass}>Occasion(s)</label>
            <DynamicOccasionSelect
              value={formData.occasion || ""}
              onChange={(value) => onFieldChange("occasion", value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="border-t border-stone-100" />

        {/* Fabric/Material & Colour, as described */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fabric / Material</label>
            <input
              type="text"
              value={formData.material || ""}
              onChange={(e) => onFieldChange("material", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Colour, as described</label>
            <input
              type="text"
              value={formData.color || ""}
              onChange={(e) => onFieldChange("color", e.target.value)}
              placeholder="e.g. Deep crimson, Ivory with antique gold"
              className={inputClass}
            />
          </div>
        </div>

        {/* Colour Family & Care by Fabric */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Colour Family</label>
            <DynamicColorSelect
              colorText={
                !Array.isArray(formData.colors) || formData.colors.length === 0
                  ? formData.colorFamily || ""
                  : ""
              }
              colors={formData.colors || []}
              placeholder="Pick colour family / shades..."
              onChange={(list) => {
                onFieldChange("colors", list as any);
                const uniqueFamilies = Array.from(
                  new Set(
                    list
                      .map((c) => String(c.family || c.name || "").trim())
                      .filter(Boolean),
                  ),
                );
                onFieldChange("colorFamily", uniqueFamilies.join(", ") as any);
              }}
              className="mt-1"
            />
            <p className={helpClass}>
              From Master Data, Colours. The storefront colour filter finds the
              piece by it.
            </p>
          </div>
          <div>
            <label className={labelClass}>Care by Fabric</label>
            <select
              value={selectedCareOptionId}
              onChange={(e) => handleCareByFabricChange(e.target.value)}
              className={inputClass}
            >
              <option value="">
                {loadingFabricCare
                  ? "Loading care options..."
                  : "No care instructions"}
              </option>
              {selectedCareOptionId === "__CUSTOM_CARE__" && (
                <option value="__CUSTOM_CARE__">
                  Custom care instructions (saved)
                </option>
              )}
              {fabricCareOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
              <option value="__CREATE_NEW_FABRIC_CARE__">
                + Add new fabric care...
              </option>
            </select>
            {showNewFabricCareBox && (
              <div className="mt-2 space-y-2 rounded border border-[#D8CFC2] bg-[#FAF7F2] p-2.5">
                <input
                  type="text"
                  autoFocus
                  value={newFabricCareLabel}
                  onChange={(e) => setNewFabricCareLabel(e.target.value)}
                  placeholder="Fabric care title (e.g. Organza & Handloom Silk)"
                  className="w-full rounded border border-[#D8CFC2] bg-white px-2.5 py-1.5 text-xs text-stone-800 outline-none focus:border-[#C7A55C]"
                />
                <textarea
                  rows={2}
                  value={newFabricCareNotes}
                  onChange={(e) => setNewFabricCareNotes(e.target.value)}
                  placeholder="Care instructions (one per line or separated by ;)..."
                  className="w-full rounded border border-[#D8CFC2] bg-white px-2.5 py-1.5 text-xs text-stone-800 outline-none focus:border-[#C7A55C]"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewFabricCareBox(false)}
                    className="rounded border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-600 hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={creatingFabricCare}
                    onClick={handleQuickCreateFabricCare}
                    className="rounded bg-[#C7A55C] hover:bg-[#B8954B] px-3 py-1 text-xs font-semibold text-[#2A2118] disabled:opacity-60 cursor-pointer"
                  >
                    {creatingFabricCare ? "Saving..." : "Add to DB"}
                  </button>
                </div>
              </div>
            )}
            <p className={helpClass}>
              From Master Data, Fabric care. Prints the Care Instructions on its
              product page.
            </p>
          </div>
        </div>

        {/* Craft / Technique */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Craft</label>
            <input
              type="text"
              value={formData.craft || ""}
              onChange={(e) => onFieldChange("craft", e.target.value)}
              placeholder="e.g. Chikankari, Bandhani, Zardozi"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Technique</label>
            <input
              type="text"
              value={formData.technique || ""}
              onChange={(e) => onFieldChange("technique", e.target.value)}
              placeholder="How the craft was executed"
              className={inputClass}
            />
          </div>
        </div>

        {/* Embroidery Details / Thread Yarn Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Embroidery Details</label>
            <input
              type="text"
              value={formData.embellishments || ""}
              onChange={(e) => onFieldChange("embellishments", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Thread / Yarn Detail</label>
            <input
              type="text"
              value={formData.threadYarnDetail || ""}
              onChange={(e) =>
                onFieldChange("threadYarnDetail", e.target.value)
              }
              placeholder="Optional — thread or yarn used"
              className={inputClass}
            />
          </div>
        </div>

        {/* Set Includes / Origin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Set Includes</label>
            <input
              type="text"
              value={formData.setIncludes || ""}
              onChange={(e) => onFieldChange("setIncludes", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Origin</label>
            <input
              type="text"
              value={formData.origin || ""}
              onChange={(e) => onFieldChange("origin", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Size / Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Size —{" "}
              <span className="text-orange-700">
                one per listing, consignment model
              </span>
            </label>
            <DynamicSizeSelect
              value={Array.isArray(formData.sizes) ? formData.sizes : []}
              onChange={(nextSizes) => onFieldChange("sizes", nextSizes)}
              placeholder="Select size(s)..."
              className="mt-1"
            />
            <p className={helpClass}>
              Each piece is a specific physical garment — select or add/remove
              sizes from the list. General size guidance lives in Master Data.
            </p>
          </div>
          <div>
            <label className={labelClass}>Weight (grams)</label>
            <input
              type="text"
              value={formData.weight || ""}
              onChange={(e) => onFieldChange("weight", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Delivery Timing */}
        <div>
          <label className={labelClass}>Delivery Timing</label>
          <input
            type="text"
            value={formData.deliveryTiming || ""}
            onChange={(e) => onFieldChange("deliveryTiming", e.target.value)}
            className={inputClass}
          />
          <p className={helpClass}>
            Default comes from Master Data → Shipping Defaults; override here
            only if this piece ships differently.
          </p>
        </div>

        <div className="border-t border-stone-100" />

        {/* Listing Mode(s) */}
        <div>
          <label className={labelClass}>
            Listing Mode(s) <span className="text-red-500">*</span>
          </label>
          <div
            className={`flex flex-wrap items-center gap-6 mt-2 rounded p-2.5 border ${
              errors.listingModes
                ? "border-red-400 bg-red-50/40"
                : "border-transparent"
            }`}
          >
            {(["RENTAL", "PRELOVED", "BUY NEW"] as const).map((mode) => {
              const modes = Array.isArray(formData.listingModes)
                ? formData.listingModes
                : [];
              const checked = modes.includes(mode);
              return (
                <label
                  key={mode}
                  className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...modes, mode]
                        : modes.filter((m) => m !== mode);
                      onFieldChange("listingModes", next);
                    }}
                    className="h-4 w-4 accent-blue-600"
                  />
                  {mode}
                </label>
              );
            })}
          </div>
          <p className={helpClass}>
            Pricing &amp; Tax validation adjusts automatically based on the
            Listing Mode(s) checked here.
          </p>
          {renderError("listingModes")}
        </div>

        {/* Condition Grade */}
        <div>
          <label className={labelClass}>Condition Grade</label>
          <select
            value={formData.condition || ""}
            onChange={(e) => onFieldChange("condition", e.target.value)}
            className={inputClass}
          >
            <option value="">Select condition</option>
            <option value="Pristine">Pristine</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
          <p className={helpClass}>
            Fair routes to rental-only — resale is disabled at this grade.
          </p>
        </div>

        {/* Honest Disclosure */}
        <div>
          <label className={labelClass}>
            Honest Disclosure —{" "}
            <span className="text-orange-700">
              Required for Preloved, gates publication
            </span>
          </label>
          <textarea
            value={formData.honestDisclosure || ""}
            onChange={(e) => onFieldChange("honestDisclosure", e.target.value)}
            rows={3}
            placeholder="Describe any visible wear, repairs, alterations, or imperfections honestly. Buyers rely on candour."
            className={inputClass}
          />
        </div>

        {/* Story */}
        <div>
          <label className={labelClass}>
            The Story of this Piece —{" "}
            <span className="text-stone-400 normal-case font-normal">
              shown as its own section on the PDP
            </span>
          </label>
          <textarea
            value={formData.story || ""}
            onChange={(e) => onFieldChange("story", e.target.value)}
            rows={3}
            placeholder="Where and when was it worn? What makes the craftsmanship special? Add a styling note if relevant."
            className={inputClass}
          />
        </div>

        {/* Times Rented / SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Times Rented (Display Counter)</label>
            <input
              type="number"
              value={formData.timesRented || ""}
              onChange={(e) =>
                onFieldChange("timesRented", parseInt(e.target.value) || 0)
              }
              className={inputClass}
              min="0"
            />
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <label className={labelClass}>SKU</label>
              <span className="inline-flex items-center rounded bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                Auto-generated · Unique
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                readOnly
                value={formData.sku || ""}
                placeholder="Generating unique SKU..."
                className={`flex-1 min-w-0 p-2 rounded text-xs focus:outline-none focus:ring-1 border font-mono cursor-not-allowed ${
                  errors.sku
                    ? "bg-red-50/40 border-red-400 focus:ring-red-300 text-red-800"
                    : "bg-stone-100/80 border-stone-200 text-stone-700 focus:ring-stone-300"
                }`}
              />
              <button
                type="button"
                disabled={
                  generatingSku || isSaving || localSaving || externalIsSaving
                }
                onClick={() => onAutoGenerateSku?.()}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-[11px] font-semibold text-amber-900 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${generatingSku ? "animate-spin" : ""}`}
                />
                {generatingSku ? "Generating..." : "Auto-generate"}
              </button>
            </div>
            {renderError("sku")}
            <p className={helpClass}>
              Auto-incremented and guaranteed unique for every piece. Click
              Auto-generate to assign the next SKU.
            </p>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className={labelClass}>Tags</label>
          <input
            value={formData.tags?.join(", ") || ""}
            onChange={(e) =>
              onFieldChange(
                "tags",
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              )
            }
            placeholder="Featured, Rare Find, New Arrival..."
            className={inputClass}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => onDiscard?.()}
            className="px-4 py-2 text-xs font-semibold rounded border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isSaving && !localSaving && !externalIsSaving)
                handleSaveCoreDetails();
            }}
            disabled={
              isSaving || localSaving || saveSuccess || externalIsSaving
            }
            className={`px-4 py-2 text-xs font-semibold rounded transition ${isSaving || localSaving || saveSuccess || externalIsSaving
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-amber-700 hover:bg-amber-800 text-white"
              }`}
          >
            {isSaving || localSaving
              ? "Saving..."
              : saveSuccess
                ? "✅ Saved!"
                : "Save Core Details"}
          </button>
        </div>
      </div>

      {/* ---------------- Size & Fit · This Piece Card ---------------- */}
      <SizeAndFitCard
        formData={formData}
        onFieldChange={onFieldChange}
        onSaveSizeAndFit={handleSaveSizeAndFit}
        designers={activeDesigners}
        onDesignerCreated={(createdDes) => {
          if (!createdDes?.name) return;
          setFetchedDesigners((prev) => {
            const exists = prev.some(
              (d) =>
                d.name.toLowerCase() ===
                String(createdDes.name || "").trim().toLowerCase(),
            );
            return exists
              ? prev
              : [
                  {
                    id: String(
                      createdDes.designerId || createdDes.id || createdDes._id,
                    ),
                    name: String(createdDes.name).trim(),
                  },
                  ...prev,
                ];
          });
          onDesignerCreated?.(createdDes);
        }}
        isSaving={isSaving || localSaving || externalIsSaving}
        saveSuccess={saveSuccess}
      />
    </div>
  );
}
