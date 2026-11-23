import { pool } from "../config/db.js";
import crypto from "crypto";

/**
 * 1. GET /api/pages
 * Returns list of all pages from database
 */
export const getPages = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT _id as id, slug, title, group_id as "groupId", group_id as "group", built_from as "builtFrom",
              summary, health, version, last_published as "lastPublished", last_editor as "lastEditor",
              words_count as "wordsCount", figures_count as "figuresCount", checks_count as "checksCount",
              high_checks_count as "highChecksCount", medium_checks_count as "mediumChecksCount",
              low_checks_count as "lowChecksCount", is_built as "isBuilt", has_scheduled as "hasScheduled",
              data, updated_at as "updatedAt"
       FROM pages ORDER BY created_at ASC`
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("[pageController.getPages] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. GET /api/pages/content?slug=...
 * Returns dynamic content, fieldValues, answers, and settings for a specific page
 */
export const getPageContent = async (req, res) => {
  try {
    const rawSlug = String(req.query.slug || "faqs").trim();
    const cleanSlug = rawSlug.startsWith("/") ? rawSlug : `/${rawSlug}`;
    const altSlug = rawSlug.replace(/^\//, "");

    const variants = new Set([cleanSlug, altSlug]);
    if (altSlug.endsWith("-us")) {
      const base = altSlug.replace(/-us$/, "");
      variants.add(base);
      variants.add(`/${base}`);
    } else {
      variants.add(`${altSlug}-us`);
      variants.add(`/${altSlug}-us`);
    }
    if (altSlug.endsWith("-policy")) {
      const base = altSlug.replace(/-policy$/, "");
      variants.add(base);
      variants.add(`/${base}`);
    } else {
      variants.add(`${altSlug}-policy`);
      variants.add(`/${altSlug}-policy`);
    }
    if (altSlug === "faq" || altSlug === "faqs") {
      variants.add("faq");
      variants.add("/faq");
      variants.add("faqs");
      variants.add("/faqs");
    }
    if (altSlug === "pricing" || altSlug === "pricing-fees" || altSlug === "pricing-policy") {
      variants.add("pricing");
      variants.add("/pricing");
      variants.add("pricing-fees");
      variants.add("/pricing-fees");
      variants.add("pricing-policy");
      variants.add("/pricing-policy");
    }
    if (altSlug === "seller" || altSlug === "seller-guidelines" || altSlug === "seller-faq") {
      variants.add("seller");
      variants.add("/seller");
      variants.add("seller-guidelines");
      variants.add("/seller-guidelines");
      variants.add("seller-faq");
      variants.add("/seller-faq");
    }
    if (altSlug === "cookies" || altSlug === "cookie" || altSlug === "cookie-policy") {
      variants.add("cookies");
      variants.add("/cookies");
      variants.add("cookie");
      variants.add("/cookie");
      variants.add("cookie-policy");
      variants.add("/cookie-policy");
    }
    if (altSlug === "terms" || altSlug === "terms-and-conditions" || altSlug === "terms-conditions") {
      variants.add("terms");
      variants.add("/terms");
      variants.add("terms-and-conditions");
      variants.add("/terms-and-conditions");
      variants.add("terms-conditions");
      variants.add("/terms-conditions");
    }

    const variantList = Array.from(variants);
    const placeholders = variantList.map((_, i) => `$${i + 1}`).join(", ");
    console.log('[pageController.getPageContent] rawSlug:', rawSlug, 'variantList:', variantList);
    const result = await pool.query(
      `SELECT _id as id, slug, title, version, last_published as "lastPublished",
              last_editor as "lastEditor", data, updated_at as "updatedAt"
       FROM pages
       WHERE slug IN (${placeholders})
       ORDER BY CASE WHEN slug = '${cleanSlug.replace(/'/g, "''")}' THEN 0 ELSE 1 END
       LIMIT 1`,
      variantList
    );

    if (result.rows.length > 0) {
      const row = result.rows[0];
      const pageData = row.data || {};
      return res.json({
        success: true,
        data: {
          slug: row.slug,
          title: row.title,
          version: row.version,
          lastPublished: row.lastPublished,
          lastEditor: row.lastEditor,
          fieldValues: pageData.fieldValues || {},
          answers: pageData.answers || null,
          hiddenParts: pageData.hiddenParts || {},
          settings: pageData.settings || {},
          ...pageData,
        },
      });
    }

    // No auto-seed, return null so operator saves their own data
    return res.json({
      success: true,
      data: null,
    });
  } catch (error) {
    console.error("[pageController.getPageContent] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. POST /api/pages/content
 * Creates or updates page dynamic content (fieldValues, answers, hiddenParts, settings)
 */
export const savePageContent = async (req, res) => {
  try {
    const { slug, title, group, groupId, summary, fieldValues, answers, hiddenParts, settings, ...extra } = req.body;
    if (!slug) {
      return res.status(400).json({ success: false, message: "Page slug is required" });
    }

    const cleanSlug = slug.startsWith("/") ? slug : `/${slug}`;
    const altSlug = slug.replace(/^\//, "");

    const variants = new Set([cleanSlug, altSlug]);
    if (altSlug.endsWith("-us")) {
      const base = altSlug.replace(/-us$/, "");
      variants.add(base); variants.add(`/${base}`);
    } else {
      variants.add(`${altSlug}-us`); variants.add(`/${altSlug}-us`);
    }
    if (altSlug.endsWith("-policy")) {
      const base = altSlug.replace(/-policy$/, "");
      variants.add(base); variants.add(`/${base}`);
    } else {
      variants.add(`${altSlug}-policy`); variants.add(`/${altSlug}-policy`);
    }
    if (altSlug === "faq" || altSlug === "faqs") {
      variants.add("faq"); variants.add("/faq"); variants.add("faqs"); variants.add("/faqs");
    }
    if (altSlug === "pricing" || altSlug === "pricing-fees" || altSlug === "pricing-policy") {
      variants.add("pricing"); variants.add("/pricing"); variants.add("pricing-fees"); variants.add("/pricing-fees"); variants.add("pricing-policy"); variants.add("/pricing-policy");
    }
    if (altSlug === "seller" || altSlug === "seller-guidelines" || altSlug === "seller-faq") {
      variants.add("seller"); variants.add("/seller"); variants.add("seller-guidelines"); variants.add("/seller-guidelines"); variants.add("seller-faq"); variants.add("/seller-faq");
    }
    if (altSlug === "cookies" || altSlug === "cookie" || altSlug === "cookie-policy") {
      variants.add("cookies"); variants.add("/cookies"); variants.add("cookie"); variants.add("/cookie"); variants.add("cookie-policy"); variants.add("/cookie-policy");
    }
    if (altSlug === "terms" || altSlug === "terms-and-conditions" || altSlug === "terms-conditions") {
      variants.add("terms"); variants.add("/terms"); variants.add("terms-and-conditions"); variants.add("/terms-and-conditions"); variants.add("terms-conditions"); variants.add("/terms-conditions");
    }
    const variantList = Array.from(variants);
    const placeholders = variantList.map((_, i) => `$${i + 1}`).join(", ");
    const exactParamIdx = variantList.length + 1;
    const altParamIdx = variantList.length + 2;

    // 1. Fetch existing rows (prioritize exact slug match so canonical row is primary)
    const existing = await pool.query(
      `SELECT _id, slug, data, title, group_id, summary
       FROM pages
       WHERE slug IN (${placeholders})
       ORDER BY CASE WHEN slug = $${exactParamIdx} THEN 0 WHEN slug = $${altParamIdx} THEN 1 ELSE 2 END`,
      [...variantList, cleanSlug, altSlug]
    );

    let currentData = {};
    let pageTitle = title || cleanSlug.replace("/", "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    let pageGroup = group || groupId || "content-help";
    let pageSummary = summary || "";

    if (existing.rows.length > 0) {
      currentData = existing.rows[0].data || {};
      pageTitle = title || existing.rows[0].title || pageTitle;
      pageGroup = group || groupId || existing.rows[0].group_id || pageGroup;
      pageSummary = summary || existing.rows[0].summary || pageSummary;
    }

    // 2. Prepare merged data
    const mergedData = {
      ...currentData,
      ...extra,
      fieldValues: {
        ...(currentData.fieldValues || {}),
        ...(fieldValues || {}),
      },
      hiddenParts: hiddenParts !== undefined ? hiddenParts : currentData.hiddenParts || {},
      settings: settings !== undefined ? { ...(currentData.settings || {}), ...settings } : currentData.settings || {},
    };

    if (Array.isArray(answers)) {
      mergedData.answers = answers;
    }

    // 3. Upsert into database
    const pageId = existing.rows.length > 0 ? existing.rows[0]._id : `pg_${crypto.randomBytes(8).toString("hex")}`;
    const targetSlug = (existing.rows.length > 0 && existing.rows[0].slug) ? existing.rows[0].slug : cleanSlug;

    const query = `
      INSERT INTO pages (_id, slug, title, group_id, summary, data, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (slug) DO UPDATE
      SET title = COALESCE(EXCLUDED.title, pages.title),
          group_id = COALESCE(EXCLUDED.group_id, pages.group_id),
          summary = COALESCE(EXCLUDED.summary, pages.summary),
          data = $6,
          updated_at = NOW()
      RETURNING *;
    `;

    const serializedData = JSON.stringify(mergedData);
    const upsertRes = await pool.query(query, [
      pageId,
      targetSlug,
      pageTitle,
      pageGroup,
      pageSummary,
      serializedData,
    ]);
    const saved = upsertRes.rows[0];

    // Keep any pre-existing slug alias rows (e.g. /about and /about-us) synchronized
    if (existing.rows.length > 1) {
      const siblingSlugs = existing.rows
        .map((r) => r.slug)
        .filter((s) => s && s !== targetSlug);
      if (siblingSlugs.length > 0) {
        await pool.query(
          `UPDATE pages
           SET title = COALESCE($1, pages.title),
               data = $2,
               updated_at = NOW()
           WHERE slug = ANY($3::text[])`,
          [pageTitle, serializedData, siblingSlugs]
        );
      }
    }

    return res.json({
      success: true,
      message: "Page content saved successfully",
      data: {
        slug: saved.slug,
        title: saved.title,
        updatedAt: saved.updated_at,
        ...saved.data,
      },
    });
  } catch (error) {
    console.error("[pageController.savePageContent] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. POST /api/pages
 * Creates or updates page card record
 */
export const savePage = async (req, res) => {
  try {
    const { id, slug, title, group, groupId, builtFrom, summary, health, version, lastPublished, lastEditor, wordsCount, figuresCount, checksCount, highChecksCount, mediumChecksCount, lowChecksCount, isBuilt, hasScheduled, data } = req.body;
    if (!slug) {
      return res.status(400).json({ success: false, message: "Page slug is required" });
    }

    const cleanSlug = slug.startsWith("/") ? slug : `/${slug}`;
    const pageId = id || `pg_${crypto.randomBytes(8).toString("hex")}`;

    const result = await pool.query(
      `INSERT INTO pages (_id, slug, title, group_id, built_from, summary, health, version,
                          last_published, last_editor, words_count, figures_count, checks_count,
                          is_built, has_scheduled, data, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())
       ON CONFLICT (slug) DO UPDATE
       SET title = COALESCE($3, pages.title),
           group_id = COALESCE($4, pages.group_id),
           built_from = COALESCE($5, pages.built_from),
           summary = COALESCE($6, pages.summary),
           health = COALESCE($7, pages.health),
           version = COALESCE($8, pages.version),
           last_published = COALESCE($9, pages.last_published),
           last_editor = COALESCE($10, pages.last_editor),
           words_count = COALESCE($11, pages.words_count),
           figures_count = COALESCE($12, pages.figures_count),
           checks_count = COALESCE($13, pages.checks_count),
           is_built = COALESCE($14, pages.is_built),
           has_scheduled = COALESCE($15, pages.has_scheduled),
           data = COALESCE($16, pages.data),
           updated_at = NOW()
       RETURNING *`,
      [
        pageId,
        cleanSlug,
        title || cleanSlug,
        group || groupId || "content-help",
        builtFrom || null,
        summary || "",
        health || "healthy",
        version || "Version 1",
        lastPublished || "Just now",
        lastEditor || "Admin",
        wordsCount || 0,
        figuresCount || 0,
        checksCount || 0,
        isBuilt !== false,
        Boolean(hasScheduled),
        JSON.stringify(data || {}),
      ]
    );

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("[pageController.savePage] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. GET /api/pages/figures
 * Returns all register figures from database
 */
export const getFigures = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT _id as id, key, label, display_value as "displayValue", subject, owner,
              status, has_pending_change as "hasPendingChange", waiting_change as "waitingChange",
              data, updated_at as "updatedAt"
       FROM page_figures ORDER BY created_at ASC`
    );

    const formatted = result.rows.map((row) => {
      const extra = row.data && typeof row.data === "object" ? row.data : {};
      return {
        ...extra,
        id: row.id,
        key: row.key,
        label: row.label,
        displayValue: row.displayValue || extra.displayValue || "",
        subject: row.subject || extra.subject || "general",
        owner: row.owner || extra.owner || "Set here",
        status: row.status || extra.status || "live",
        hasPendingChange: Boolean(row.hasPendingChange),
        waitingChange: row.waitingChange || extra.waitingChange || null,
        updatedAt: row.updatedAt,
      };
    });

    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error("[pageController.getFigures] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 6. POST /api/pages/figures
 * Saves or updates a figure
 */
export const saveFigure = async (req, res) => {
  try {
    const { key, label, displayValue, subject, owner, status, hasPendingChange, waitingChange, data } = req.body;
    if (!key) {
      return res.status(400).json({ success: false, message: "Figure key is required" });
    }

    const id = `fig_${crypto.randomBytes(8).toString("hex")}`;
    const result = await pool.query(
      `INSERT INTO page_figures (_id, key, label, display_value, subject, owner, status, has_pending_change, waiting_change, data, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       ON CONFLICT (key) DO UPDATE
       SET label = COALESCE($3, page_figures.label),
           display_value = COALESCE($4, page_figures.display_value),
           status = COALESCE($7, page_figures.status),
           has_pending_change = COALESCE($8, page_figures.has_pending_change),
           waiting_change = COALESCE($9, page_figures.waiting_change),
           data = page_figures.data || $10,
           updated_at = NOW()
       RETURNING *`,
      [
        id,
        key,
        label || key,
        displayValue || "",
        subject || "general",
        owner || "Set here",
        status || "live",
        Boolean(hasPendingChange),
        waitingChange ? JSON.stringify(waitingChange) : null,
        JSON.stringify(data || {}),
      ]
    );

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("[pageController.saveFigure] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 7. POST /api/pages/publish
 * Confirms and publishes all pending page changes and increments versions
 */
export const publishChanges = async (req, res) => {
  try {
    const { userRole = "Super Admin" } = req.body;

    // Apply all waiting figures to live
    await pool.query(
      `UPDATE page_figures
       SET display_value = COALESCE(waiting_change->>'value', display_value),
           has_pending_change = FALSE,
           waiting_change = NULL,
           status = 'live',
           updated_at = NOW()
       WHERE has_pending_change = TRUE`
    );

    // Update pages last_published timestamp
    await pool.query(
      `UPDATE pages
       SET last_published = 'Just now',
           last_editor = $1 || ' (Published)',
           updated_at = NOW()`,
      [userRole]
    );

    return res.json({ success: true, message: "All changes published successfully" });
  } catch (error) {
    console.error("[pageController.publishChanges] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
