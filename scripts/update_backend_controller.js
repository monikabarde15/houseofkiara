import fs from 'fs';

const pcPath = 'D:/houseofkaira/hok_admin/backend/controllers/pageController.js';
let content = fs.readFileSync(pcPath, 'utf8');

const oldDestruct = `const { id, slug, title, group, groupId, builtFrom, summary, health, version, lastPublished, lastEditor, wordsCount, figuresCount, checksCount, isBuilt, hasScheduled, data } = req.body;`;
const newDestruct = `const { id, slug, title, group, groupId, builtFrom, summary, health, version, lastPublished, lastEditor, wordsCount, figuresCount, checksCount, highChecksCount, mediumChecksCount, lowChecksCount, isBuilt, hasScheduled, data } = req.body;`;

content = content.replace(oldDestruct, newDestruct);

const oldInsert = `      INSERT INTO pages (_id, slug, title, group_id, built_from, summary, health, version,
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
       RETURNING *`;

const newInsert = `      INSERT INTO pages (_id, slug, title, group_id, built_from, summary, health, version,
                          last_published, last_editor, words_count, figures_count, checks_count,
                          high_checks_count, medium_checks_count, low_checks_count,
                          is_built, has_scheduled, data, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW())
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
           high_checks_count = COALESCE($14, pages.high_checks_count),
           medium_checks_count = COALESCE($15, pages.medium_checks_count),
           low_checks_count = COALESCE($16, pages.low_checks_count),
           is_built = COALESCE($17, pages.is_built),
           has_scheduled = COALESCE($18, pages.has_scheduled),
           data = COALESCE($19, pages.data),
           updated_at = NOW()
       RETURNING *`;

content = content.replace(oldInsert, newInsert);

const oldParams = `        checksCount || 0,
        isBuilt !== false,
        Boolean(hasScheduled),
        JSON.stringify(data || {}),`;

const newParams = `        checksCount || 0,
        highChecksCount !== undefined ? highChecksCount : (checksCount || 0),
        mediumChecksCount !== undefined ? mediumChecksCount : 0,
        lowChecksCount !== undefined ? lowChecksCount : 0,
        isBuilt !== false,
        Boolean(hasScheduled),
        JSON.stringify(data || {}),`;

content = content.replace(oldParams, newParams);

fs.writeFileSync(pcPath, content, 'utf8');
console.log('Updated backend pageController.js');

