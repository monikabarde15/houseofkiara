import { pool } from "./config/db.js";
async function run() {
  const res = await pool.query("SELECT * FROM listers WHERE data->>'listerId' ILIKE '%rohit%' OR data->>'lister_id' ILIKE '%rohit%'");
  console.log(JSON.stringify(res.rows[0]?.data?.activities || res.rows[0]?.data?._data?.activities || [], null, 2));
  process.exit(0);
}
run();
