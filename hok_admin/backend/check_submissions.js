import { pool } from "./config/db.js";
async function run() {
  const res = await pool.query("SELECT * FROM submissions LIMIT 2");
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit(0);
}
run();
