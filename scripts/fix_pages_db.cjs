const { pool } = require('../hok_admin/backend/config/db.cjs');

async function fixDb() {
  try {
    console.log('Updating PostgreSQL pages table...');
    
    // 1. Fix /faqs
    await pool.query(`
      UPDATE pages 
      SET is_built = true, 
          health = 'needs-attention', 
          checks_count = 14, 
          high_checks_count = 6, 
          medium_checks_count = 8, 
          low_checks_count = 0
      WHERE slug = '/faqs' OR slug = 'faqs'
    `);

    // 2. Fix /about
    await pool.query(`
      UPDATE pages 
      SET health = 'needs-attention',
          checks_count = 9,
          low_checks_count = 9
      WHERE slug = '/about' OR slug = 'about'
    `);

    // 3. Fix /contact
    await pool.query(`
      UPDATE pages 
      SET health = 'needs-attention',
          checks_count = 2,
          medium_checks_count = 2
      WHERE slug = '/contact' OR slug = 'contact'
    `);

    // 4. Fix /care-policy
    await pool.query(`
      UPDATE pages 
      SET health = 'needs-attention',
          checks_count = 2,
          medium_checks_count = 2
      WHERE slug = '/care-policy' OR slug = 'care-policy'
    `);

    // 5. Fix /deposit-policy
    await pool.query(`
      UPDATE pages 
      SET health = 'needs-attention',
          checks_count = 1,
          medium_checks_count = 1
      WHERE slug = '/deposit-policy' OR slug = 'deposit-policy'
    `);

    const checkRes = await pool.query(`
      SELECT slug, title, health, checks_count, high_checks_count, medium_checks_count, is_built 
      FROM pages ORDER BY created_at ASC
    `);
    console.log('Updated pages:');
    console.table(checkRes.rows);
    process.exit(0);
  } catch (err) {
    console.error('Error fixing DB:', err);
    process.exit(1);
  }
}

fixDb();

