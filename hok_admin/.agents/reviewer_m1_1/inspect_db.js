import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:Rrkf4swYDLiBAhgX@db.rnvmjpxhlowhguihesja.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

async function check() {
  try {
    const res = await pool.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position;
    `);
    console.log("Current columns in public schema:");
    const tableMap = {};
    for (const row of res.rows) {
      if (!tableMap[row.table_name]) tableMap[row.table_name] = [];
      tableMap[row.table_name].push(`${row.column_name} (${row.data_type})`);
    }
    console.log(JSON.stringify(tableMap, null, 2));
  } catch (e) {
    console.error("Error inspecting database:", e);
  } finally {
    await pool.end();
  }
}

check();
