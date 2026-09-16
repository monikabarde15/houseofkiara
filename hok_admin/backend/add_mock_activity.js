import { pool } from "./config/db.js";
async function run() {
  try {
    const res = await pool.query("SELECT _id, data FROM listers WHERE data->>'listerId' ILIKE '%rohit%' OR data->>'lister_id' ILIKE '%rohit%'");
    if (res.rows.length === 0) {
      console.log("No lister found");
      return process.exit(1);
    }
    
    let lister = res.rows[0];
    let data = lister.data;
    
    // Add mock activity
    if (!data.activities) data.activities = [];
    data.activities.push({
      date: new Date().toISOString(),
      action: "System Update",
      detail: "Account verified by admin",
      by: "Admin"
    });
    
    await pool.query("UPDATE listers SET data = $1 WHERE _id = $2", [data, lister._id]);
    console.log("Activity added successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
