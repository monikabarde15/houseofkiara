import { pool } from "../config/db.js";
import Designer from "../models/Designer.js";
import Product from "../models/Product.js";
import {
  DEFAULT_SIZE_FIT_OPTIONS,
  MASTER_SIZE_FIT_KEY,
} from "../config/sizeFitDefaults.js";

const ALLOWED_LIST_TYPES = new Set([
  "measuredByOptions",
  "howItFitsOptions",
  "closureOptions",
  "paddedOptions",
  "cancanOptions",
  "heightOptions",
  "designerLabels",
]);

const dedupeStrings = (arr = []) => {
  const seen = new Set();
  const out = [];
  for (const raw of arr) {
    const clean = String(raw || "").trim();
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
  }
  return out;
};

const mergeStringOptions = (savedList, defaultList = []) =>
  dedupeStrings([
    ...(Array.isArray(savedList) ? savedList : []),
    ...defaultList,
  ]);

const MENSWEAR_UPGRADE_CATEGORIES = new Set([
  "Bandhgala",
  "Sherwani",
  "Nehru Jacket",
  "Kurta Set (men)",
  "Indo-Western (men)",
  "Shirt",
  "Pant / Trousers",
]);

const mergeMasterPieces = (savedPieces) => {
  if (!Array.isArray(savedPieces) || savedPieces.length === 0) {
    return [...DEFAULT_SIZE_FIT_OPTIONS.masterPieces];
  }
  const defaultsById = new Map(
    DEFAULT_SIZE_FIT_OPTIONS.masterPieces.map((p) => [p.id, p]),
  );
  const next = savedPieces.map((p) => {
    if (!p?.id) return p;
    if (p.id === "sherwani" || p.id === "kurta_men") {
      const collarMeasure = Array.isArray(p.measures)
        ? p.measures.find((m) => m?.k === "collar")
        : null;
      if (!collarMeasure || collarMeasure.std !== true) {
        return defaultsById.get(p.id) || p;
      }
    }
    return p;
  });
  const seenIds = new Set(next.map((p) => p?.id).filter(Boolean));
  for (const defId of ["kurta_men", "shirt_men", "pant_men"]) {
    if (!seenIds.has(defId) && defaultsById.has(defId)) {
      next.push(defaultsById.get(defId));
    }
  }
  return next;
};

const mergeCategoryAllowedPieces = (savedMap = {}) => {
  const merged = {
    ...DEFAULT_SIZE_FIT_OPTIONS.categoryAllowedPieces,
    ...(savedMap && typeof savedMap === "object" ? savedMap : {}),
  };
  for (const catKey of MENSWEAR_UPGRADE_CATEGORIES) {
    const defList = DEFAULT_SIZE_FIT_OPTIONS.categoryAllowedPieces[catKey];
    if (Array.isArray(defList)) {
      const existing = Array.isArray(merged[catKey]) ? merged[catKey] : [];
      merged[catKey] = Array.from(new Set([...defList, ...existing]));
    }
  }
  return merged;
};

const mergeCategoryAddOptions = (savedMap = {}) => {
  const merged = {
    ...DEFAULT_SIZE_FIT_OPTIONS.categoryAddOptions,
    ...(savedMap && typeof savedMap === "object" ? savedMap : {}),
  };
  for (const catKey of MENSWEAR_UPGRADE_CATEGORIES) {
    if (Array.isArray(merged[catKey])) {
      merged[catKey] = merged[catKey].map((item) =>
        item?.piece === "kurta" ? { ...item, piece: "kurta_men" } : item,
      );
      const defList = DEFAULT_SIZE_FIT_OPTIONS.categoryAddOptions[catKey] || [];
      const seen = new Set(merged[catKey].map((i) => i?.piece));
      for (const defItem of defList) {
        if (defItem?.piece && !seen.has(defItem.piece)) {
          merged[catKey].push(defItem);
          seen.add(defItem.piece);
        }
      }
    }
  }
  return merged;
};

const mergeSizeGuides = (savedGuides) => {
  if (!savedGuides || typeof savedGuides !== "object" || Object.keys(savedGuides).length === 0) {
    return DEFAULT_SIZE_FIT_OPTIONS.sizeGuides;
  }
  const next = { ...DEFAULT_SIZE_FIT_OPTIONS.sizeGuides, ...savedGuides };
  const mensRows = next.menswear?.rows;
  if (
    !Array.isArray(mensRows) ||
    !mensRows.some((r) => String(r?.size || "") === "S (36)")
  ) {
    next.menswear = DEFAULT_SIZE_FIT_OPTIONS.sizeGuides.menswear;
  }
  return next;
};

const mergeWithDefaults = (saved = {}) => ({
  masterPieces: mergeMasterPieces(saved.masterPieces),
  categoryPieces:
    saved.categoryPieces &&
    typeof saved.categoryPieces === "object" &&
    Object.keys(saved.categoryPieces).length > 0
      ? {
          ...DEFAULT_SIZE_FIT_OPTIONS.categoryPieces,
          ...saved.categoryPieces,
        }
      : DEFAULT_SIZE_FIT_OPTIONS.categoryPieces,
  categoryAllowedPieces: mergeCategoryAllowedPieces(saved.categoryAllowedPieces),
  categoryAddOptions: mergeCategoryAddOptions(saved.categoryAddOptions),
  sizeGuides: mergeSizeGuides(saved.sizeGuides),
  measuredByOptions:
    Array.isArray(saved.measuredByOptions) && saved.measuredByOptions.length > 0
      ? dedupeStrings(saved.measuredByOptions)
      : [...DEFAULT_SIZE_FIT_OPTIONS.measuredByOptions],
  howItFitsOptions:
    Array.isArray(saved.howItFitsOptions) && saved.howItFitsOptions.length > 0
      ? mergeStringOptions(
          saved.howItFitsOptions,
          DEFAULT_SIZE_FIT_OPTIONS.howItFitsOptions,
        )
      : [...DEFAULT_SIZE_FIT_OPTIONS.howItFitsOptions],
  closureOptions:
    Array.isArray(saved.closureOptions) && saved.closureOptions.length > 0
      ? mergeStringOptions(
          saved.closureOptions,
          DEFAULT_SIZE_FIT_OPTIONS.closureOptions,
        )
      : [...DEFAULT_SIZE_FIT_OPTIONS.closureOptions],
  paddedOptions:
    Array.isArray(saved.paddedOptions) && saved.paddedOptions.length > 0
      ? dedupeStrings(saved.paddedOptions)
      : [...DEFAULT_SIZE_FIT_OPTIONS.paddedOptions],
  cancanOptions:
    Array.isArray(saved.cancanOptions) && saved.cancanOptions.length > 0
      ? dedupeStrings(saved.cancanOptions)
      : [...DEFAULT_SIZE_FIT_OPTIONS.cancanOptions],
  heightOptions:
    Array.isArray(saved.heightOptions) && saved.heightOptions.length > 0
      ? dedupeStrings(saved.heightOptions)
      : [...DEFAULT_SIZE_FIT_OPTIONS.heightOptions],
  designerLabels: Array.isArray(saved.designerLabels)
    ? dedupeStrings(saved.designerLabels)
    : [],
});

const persistMasterSizeFit = async (config) => {
  await pool.query(
    `INSERT INTO site_settings (key, data, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (key)
     DO UPDATE SET data = $2, updated_at = NOW()`,
    [MASTER_SIZE_FIT_KEY, JSON.stringify(config)],
  );
};

export const loadOrSeedSizeFitOptions = async () => {
  const res = await pool.query(
    `SELECT data FROM site_settings WHERE key = $1 LIMIT 1`,
    [MASTER_SIZE_FIT_KEY],
  );

  let raw = {};
  const hasRow = Boolean(res?.rows?.length);
  if (hasRow) {
    raw =
      typeof res.rows[0].data === "string"
        ? JSON.parse(res.rows[0].data)
        : res.rows[0].data || {};
  }

  const merged = mergeWithDefaults(raw);
  const needsWrite =
    !hasRow ||
    !Array.isArray(raw.masterPieces) ||
    raw.masterPieces.length === 0 ||
    !raw.masterPieces.some((p) => p?.id === "kurta_men") ||
    !raw.masterPieces.some((p) => p?.id === "shirt_men") ||
    !raw.masterPieces.some((p) => p?.id === "pant_men") ||
    !raw.categoryAllowedPieces ||
    !raw.categoryAddOptions ||
    !raw.categoryAddOptions["Indo-Western (men)"] ||
    !raw.categoryAddOptions["Shirt"] ||
    !raw.categoryAddOptions["Pant / Trousers"] ||
    !Array.isArray(raw.howItFitsOptions) ||
    !raw.howItFitsOptions.includes("Fitted at chest and waist") ||
    !Array.isArray(raw.closureOptions) ||
    raw.closureOptions.length === 0 ||
    !raw.closureOptions.includes("Concealed placket") ||
    !raw.sizeGuides ||
    !Array.isArray(raw.sizeGuides?.menswear?.rows) ||
    !raw.sizeGuides.menswear.rows.some((r) => String(r?.size || "") === "S (36)");

  if (needsWrite) {
    await persistMasterSizeFit(merged);
  }

  return merged;
};

/**
 * Ensures a designer label/name exists in the Designers table so it also appears
 * in the Designers directory and Product Designer selector without duplicates.
 */
export const ensureDesignerEntry = async (labelName) => {
  const trimmed = String(labelName || "").trim();
  if (!trimmed) return null;

  const allDesigners = await Designer.find({}).catch(() => []);
  const existing = (allDesigners || []).find(
    (d) =>
      String(d?.name || "")
        .trim()
        .toLowerCase() === trimmed.toLowerCase(),
  );
  if (existing) {
    const obj =
      typeof existing.toObject === "function" ? existing.toObject() : existing;
    return {
      created: false,
      designer: {
        ...obj,
        id: obj.designerId || obj._id?.toString(),
      },
    };
  }

  const baseSlug =
    trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `designer-${Date.now()}`;

  const usedSlugs = new Set(
    (allDesigners || [])
      .map((d) => String(d?.slug || "").trim().toLowerCase())
      .filter(Boolean),
  );
  let slug = baseSlug;
  let suffix = 2;
  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const designerId = `DES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const doc = await Designer.create({
    designerId,
    name: trimmed,
    slug,
    type: "Indie Designer",
    status: "Active",
    joinedAt: new Date().toISOString().split("T")[0],
  });

  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    created: true,
    designer: {
      ...obj,
      id: obj.designerId || obj._id?.toString(),
    },
  };
};

// GET /api/categories/size-fit-options
export const getSizeFitOptions = async (req, res) => {
  try {
    const [config, designers, allProducts] = await Promise.all([
      loadOrSeedSizeFitOptions(),
      Designer.find({ status: { $nin: ["Suspended", "Inactive"] } }).catch(
        () => [],
      ),
      Product.find({}).catch(() => []),
    ]);

    const formattedDesigners = (designers || [])
      .map((d) => {
        const obj = typeof d.toObject === "function" ? d.toObject() : d;
        return {
          ...obj,
          id: obj.designerId || obj._id?.toString(),
          name: String(obj.name || "").trim(),
        };
      })
      .filter((d) => d.name && d.name !== "undefined")
      .sort((a, b) => a.name.localeCompare(b.name));

    const designerNames = formattedDesigners.map((d) => d.name);
    const productLabels = (allProducts || [])
      .map((p) => String(p?.designerLabel || "").trim())
      .filter(Boolean);

    const mergedLabels = dedupeStrings([
      ...designerNames,
      ...(config.designerLabels || []),
      ...productLabels,
    ]);

    return res.json({
      success: true,
      data: {
        ...config,
        designerLabels: mergedLabels,
        designers: formattedDesigners,
      },
    });
  } catch (err) {
    console.error("Error in getSizeFitOptions:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/categories/size-fit-options { listType, value }
export const addSizeFitOption = async (req, res) => {
  try {
    const listType = String(req.body?.listType || "").trim();

    if (listType === "categoryPiece") {
      const name = String(req.body?.name || req.body?.value || "").trim();
      const rawCategory = String(req.body?.category || "").trim();
      const rawGender = String(req.body?.gender || "").trim().toLowerCase();
      const templatePieceId = String(
        req.body?.templatePieceId || "cape",
      ).trim();

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Piece name is required",
        });
      }

      const config = await loadOrSeedSizeFitOptions();
      const masterPieces = Array.isArray(config.masterPieces)
        ? [...config.masterPieces]
        : [...DEFAULT_SIZE_FIT_OPTIONS.masterPieces];

      const existingPiece = masterPieces.find(
        (p) =>
          String(p?.name || "")
            .trim()
            .toLowerCase() === name.toLowerCase(),
      );

      let pieceId = existingPiece?.id || "";
      if (!pieceId) {
        const template =
          masterPieces.find((p) => p.id === templatePieceId) ||
          masterPieces.find((p) => p.id === "cape") ||
          masterPieces[0];
        const baseSlug =
          name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/(^_|_$)/g, "") || "piece";
        const usedIds = new Set(masterPieces.map((p) => p.id));
        let candidateId = `custom_${baseSlug}`;
        let idx = 2;
        while (usedIds.has(candidateId)) {
          candidateId = `custom_${baseSlug}_${idx}`;
          idx += 1;
        }
        pieceId = candidateId;
        masterPieces.push({
          id: pieceId,
          name,
          details: Array.isArray(template?.details) ? [...template.details] : [],
          measures: Array.isArray(template?.measures)
            ? template.measures.map((m) => ({ ...m }))
            : [],
        });
      }

      const primaryCat = rawCategory
        ? rawCategory.split(",")[0].trim()
        : "";
      const categoryAddOptions = { ...(config.categoryAddOptions || {}) };
      const categoryAllowedPieces = { ...(config.categoryAllowedPieces || {}) };

      let targetKey = "General";
      if (primaryCat) {
        const catLower = primaryCat.toLowerCase();
        const isMen = ["men", "man", "male"].includes(rawGender);
        const isWomen = ["women", "woman", "female"].includes(rawGender);
        let preferredKey = "";
        if (catLower.includes("kurta")) {
          preferredKey = isMen ? "Kurta Set (men)" : "Kurta Set (women)";
        } else if (catLower.includes("indo")) {
          preferredKey = isMen
            ? "Indo-Western (men)"
            : isWomen
              ? "Indo-Western (women)"
              : "Indo-Western";
        }
        if (preferredKey) {
          targetKey = preferredKey;
        } else {
          const matchedKey = Object.keys(categoryAddOptions).find(
            (k) => k.toLowerCase() === catLower,
          );
          targetKey = matchedKey || primaryCat;
        }
      }

      const existingAddList = Array.isArray(categoryAddOptions[targetKey])
        ? [...categoryAddOptions[targetKey]]
        : [];
      const alreadyInAddList = existingAddList.some(
        (item) =>
          item?.piece === pieceId ||
          String(item?.name || "")
            .trim()
            .toLowerCase() === name.toLowerCase(),
      );
      if (!alreadyInAddList) {
        existingAddList.push({ piece: pieceId, name });
      }
      categoryAddOptions[targetKey] = existingAddList;

      const existingAllowedIds = Array.isArray(categoryAllowedPieces[targetKey])
        ? [...categoryAllowedPieces[targetKey]]
        : [];
      if (!existingAllowedIds.includes(pieceId)) {
        existingAllowedIds.push(pieceId);
      }
      categoryAllowedPieces[targetKey] = existingAllowedIds;

      const updatedConfig = {
        ...config,
        masterPieces,
        categoryAddOptions,
        categoryAllowedPieces,
      };
      await persistMasterSizeFit(updatedConfig);

      return res.status(201).json({
        success: true,
        data: {
          pieceId,
          name,
          categoryKey: targetKey,
          masterPieces: updatedConfig.masterPieces,
          categoryAddOptions: updatedConfig.categoryAddOptions,
          categoryAllowedPieces: updatedConfig.categoryAllowedPieces,
        },
      });
    }

    const value = String(req.body?.value || "").trim();

    if (!ALLOWED_LIST_TYPES.has(listType)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported Size & Fit option listType",
      });
    }
    if (!value) {
      return res.status(400).json({
        success: false,
        message: "Option value is required",
      });
    }

    const config = await loadOrSeedSizeFitOptions();
    const currentList = Array.isArray(config[listType]) ? config[listType] : [];
    const existingValue = currentList.find(
      (item) => String(item || "").trim().toLowerCase() === value.toLowerCase(),
    );
    const canonicalValue = existingValue ? String(existingValue).trim() : value;

    if (!existingValue) {
      config[listType] = dedupeStrings([...currentList, canonicalValue]);
      await persistMasterSizeFit(config);
    }

    let designerResult = null;
    if (listType === "designerLabels") {
      designerResult = await ensureDesignerEntry(canonicalValue);
    }

    return res.status(201).json({
      success: true,
      data: {
        listType,
        value: canonicalValue,
        list: config[listType],
        createdDesigner: designerResult?.designer || null,
        designerCreated: Boolean(designerResult?.created),
      },
    });
  } catch (err) {
    console.error("Error in addSizeFitOption:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/categories/size-fit-options
export const updateSizeFitOptions = async (req, res) => {
  try {
    const existing = await loadOrSeedSizeFitOptions();
    const merged = mergeWithDefaults({ ...existing, ...(req.body || {}) });
    await persistMasterSizeFit(merged);
    return res.json({ success: true, data: merged });
  } catch (err) {
    console.error("Error in updateSizeFitOptions:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
