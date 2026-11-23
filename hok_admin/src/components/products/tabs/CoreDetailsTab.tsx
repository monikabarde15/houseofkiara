import React, { useState } from "react";
import { Plus, RefreshCw, X } from "lucide-react";
import { Product, Lister } from "../../types/product";
import toast from "react-hot-toast";
import { getDesigners, createDesigner } from "../../../services/designerApi";
import { createLister } from "../../../services/listerApi";
import { apiRequest } from "../../../services/apiClient";
import DynamicCategorySelect from "../../ui/DynamicCategorySelect";
import DynamicOccasionSelect from "../../ui/DynamicOccasionSelect";
import DynamicColorSelect from "../../ui/DynamicColorSelect";
import {
  FabricCareOption,
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
}: CoreDetailsTabProps) {
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

  const handleSaveMeasurements = async () => {
    const hasInches = Boolean(
      formData.measurements?.bust ||
        formData.measurements?.waist ||
        formData.measurements?.hips ||
        formData.measurements?.length,
    );
    const hasCm = Boolean(
      formData.measurementsCm?.bust ||
        formData.measurementsCm?.waist ||
        formData.measurementsCm?.hips ||
        formData.measurementsCm?.length,
    );
    if (!hasInches && !hasCm && !formData.bestSuitedForHeight) return;
    if (!productId) {
      toast.error("⚠️ Please save Core Details first!");
      return;
    }
    if (isSaving || localSaving || externalIsSaving) return;

    setIsSaving(true);
    setLocalSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const measurementsData = {
        measurements: formData.measurements || {},
        measurementsCm: data.measurementsCm || {},
        bestSuitedForHeight: formData.bestSuitedForHeight || "",
      };

      await apiRequest(`/products/${productId}/measurements`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(measurementsData),
      });
      setSaveSuccess(true);
      setLocalSaving(false);
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "An error occurred",
      );
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
            onChange={(e) =>
              onFieldChange("status", e.target.value as Product["status"])
            }
            className={`${inputClass} max-w-sm`}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
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
              onChange={(value) => onFieldChange("category", value)}
              onCategoryCreated={onCategoryCreated}
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
            <input
              type="text"
              value={formData.sizes?.join(", ") || ""}
              onChange={(e) =>
                onFieldChange(
                  "sizes",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
              className={inputClass}
            />
            <p className={helpClass}>
              Each piece is a specific physical garment — enter the one size it
              fits, not a range. General size guidance lives in Master Data.
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

      {/* ---------------- Size & Measurements Card ---------------- */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-serif font-bold text-stone-900 text-sm">
            Size &amp; Measurements — This Piece
          </h3>
          <span className="text-[11px] text-stone-400">
            Shown as "Size &amp; Fit" on the PDP
          </span>
        </div>

        <div className="border border-stone-200 rounded overflow-hidden">
          <div className="grid grid-cols-3 bg-stone-100 text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
            <div className="p-2 px-3">Measurement</div>
            <div className="p-2 px-3">Inches</div>
            <div className="p-2 px-3">Centimetres</div>
          </div>

          {[
            { key: "bust", label: "Bust (blouse)" },
            { key: "waist", label: "Waist (skirt)" },
            { key: "hips", label: "Hips (skirt fall)" },
            { key: "length", label: "Length (skirt)" },
          ].map((row, idx) => (
            <div
              key={row.key}
              className={`grid grid-cols-3 items-center ${idx !== 0 ? "border-t border-stone-100" : ""}`}
            >
              <div className="p-3 text-xs text-stone-700">{row.label}</div>
              <div className="p-2 px-3">
                <input
                  value={
                    formData.measurements?.[
                    row.key as keyof typeof formData.measurements
                    ] || ""
                  }
                  onChange={(e) =>
                    onFieldChange("measurements", {
                      ...formData.measurements,
                      [row.key]: e.target.value,
                    } as Product["measurements"])
                  }
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="p-2 px-3">
                <input
                  value={
                    formData.measurementsCm?.[
                    row.key as keyof typeof formData.measurementsCm
                    ] || ""
                  }
                  onChange={(e) =>
                    onFieldChange("measurementsCm", {
                      ...formData.measurementsCm,
                      [row.key]: e.target.value,
                    } as Product["measurementsCm"])
                  }
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>
            </div>
          ))}

          <div className="grid grid-cols-3 items-center border-t border-stone-100 bg-[#f4ece0]">
            <div className="p-3 text-xs font-semibold text-stone-800">
              Best suited for height
            </div>
            <div className="p-2 px-3 col-span-2">
              <input
                value={formData.bestSuitedForHeight || ""}
                onChange={(e) =>
                  onFieldChange("bestSuitedForHeight", e.target.value)
                }
                className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
              />
            </div>
          </div>
        </div>

        <p className={`${helpClass} mt-3`}>
          General size-to-measurement guidance is managed centrally in Master
          Data → Occasions &amp; Sizes → Sizes &amp; Fit Guide. These fields are
          this specific piece's actual measurements, since each listing is one
          physical garment.
        </p>

        <div className="flex justify-end pt-4 mt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isSaving && !localSaving && !externalIsSaving)
                handleSaveMeasurements();
            }}
            disabled={
              isSaving ||
              localSaving ||
              saveSuccess ||
              externalIsSaving ||
              (!formData.measurements?.bust &&
                !formData.measurements?.waist &&
                !formData.measurements?.hips &&
                !formData.measurements?.length &&
                !formData.measurementsCm?.bust &&
                !formData.measurementsCm?.waist &&
                !formData.measurementsCm?.hips &&
                !formData.measurementsCm?.length &&
                !formData.bestSuitedForHeight)
            }
            className={`px-4 py-2 text-xs font-semibold rounded transition ${isSaving ||
                localSaving ||
                saveSuccess ||
                externalIsSaving ||
                (!formData.measurements?.bust &&
                  !formData.measurements?.waist &&
                  !formData.measurements?.hips &&
                  !formData.measurements?.length &&
                  !formData.measurementsCm?.bust &&
                  !formData.measurementsCm?.waist &&
                  !formData.measurementsCm?.hips &&
                  !formData.measurementsCm?.length &&
                  !formData.bestSuitedForHeight)
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-amber-700 hover:bg-amber-800 text-white"
              }`}
          >
            {isSaving || localSaving
              ? "Saving..."
              : saveSuccess
                ? "✅ Saved!"
                : "Save Measurements"}
          </button>
        </div>
      </div>
    </div>
  );
}
