import { pool } from '../hok_admin/backend/config/db.js';

async function checkPages() {
  try {
    const res = await pool.query('SELECT slug, title, health, checks_count, high_checks_count, medium_checks_count, is_built FROM pages');
    console.log('Total pages in DB:', res.rows.length);
    console.table(res.rows);
    process.exit(0);
  } catch (err) {
    console.error('DB Error:', err);
    process.exit(1);
  }
}

checkPages();

