import { pool } from './config/db.js';

async function fix() {
  try {
    const { rows } = await pool.query('SELECT _id, customer_id FROM customers ORDER BY created_at ASC');
    let nextId = 1;
    for (const row of rows) {
      const newId = `CUST-${String(nextId++).padStart(5, '0')}`;
      await pool.query('UPDATE customers SET customer_id = $1 WHERE _id = $2', [newId, row._id]);
      console.log(`Updated ${row.customer_id} to ${newId}`);
    }
    console.log('Done!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

fix();
