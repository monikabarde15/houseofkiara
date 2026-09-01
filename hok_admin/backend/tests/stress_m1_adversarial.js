import { pool } from "../config/db.js";

const inspectTables = async () => {
  const client = await pool.connect();
  try {
    const tableRes = await client.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position;
    `);
    console.log("Current schema columns in PostgreSQL:");
    const grouped = {};
    for (const row of tableRes.rows) {
      if (!grouped[row.table_name]) grouped[row.table_name] = [];
      grouped[row.table_name].push(`${row.column_name} (${row.data_type})`);
    }
    console.log(JSON.stringify(grouped, null, 2));
  } finally {
    client.release();
    await pool.end();
  }
};

inspectTables();
