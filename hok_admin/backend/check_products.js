import { pool } from "./config/db.js";
async function run() {
  const res = await pool.query("SELECT * FROM products WHERE data->>'lister_id' ILIKE '%rohit%' OR data->>'listerId' ILIKE '%rohit%'");
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit(0);
}
run();
