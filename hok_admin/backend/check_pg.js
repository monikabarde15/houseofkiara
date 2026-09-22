import { pool } from "./config/db.js";

async function run() {
  try {
    const listers = await pool.query("SELECT _id, data->>'listerId' as lister_id, data->>'name' as name FROM listers WHERE data->>'name' ILIKE '%rohit%' OR data->>'listerId' ILIKE '%rohit%'");
    console.log("Listers:", listers.rows);

    const products = await pool.query("SELECT _id, data->>'listerId' as lister_id, data->>'name' as name FROM products WHERE data->>'listerId' ILIKE '%rohit%' OR data->>'listerName' ILIKE '%rohit%'");
    console.log("Products:", products.rows);

    const payouts = await pool.query("SELECT _id, data->>'payoutId' as payout_id, data->>'listerId' as lister_id, data->>'listerName' as lister_name, data->>'transactionAmount' as tv, data->>'listerShare' as share FROM payouts WHERE data->>'listerId' ILIKE '%rohit%' OR data->>'listerName' ILIKE '%rohit%'");
    console.log("Payouts:", payouts.rows);
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
