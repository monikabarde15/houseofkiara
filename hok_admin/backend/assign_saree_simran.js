import pg from "pg";

const pool = new pg.Pool({
  connectionString:
    "postgresql://postgres:DpUpEOIutDJo6l41@db.qfwrxdgjywseodbtadnx.supabase.co:5432/postgres",
});

async function run() {
  // 1. Update Midnight Wine Embellished Saree product lister to simran-chouhan
  const pRes = await pool.query(
    "SELECT _id, data FROM products WHERE _id = 'df86751013559376b1749da4'"
  );
  if (pRes.rows.length > 0) {
    const d = pRes.rows[0].data || {};
    d.listerId = "simran-chouhan";
    d.listerName = "Simran Chouhan";
    await pool.query(
      "UPDATE products SET lister_id = 'simran-chouhan', data = $1 WHERE _id = 'df86751013559376b1749da4'",
      [JSON.stringify(d)]
    );
    console.log("Updated Midnight Wine Saree lister to Simran Chouhan");
  }

  // 2. Update order HOK-ORD-1792836078130 to simran-chouhan
  const oRes = await pool.query(
    "SELECT _id, data FROM orders WHERE order_id = 'HOK-ORD-1792836078130'"
  );
  if (oRes.rows.length > 0) {
    const d = oRes.rows[0].data || {};
    d.listerId = "simran-chouhan";
    d.listerName = "Simran Chouhan";
    if (Array.isArray(d.items)) {
      d.items = d.items.map((it) => ({
        ...it,
        listerId: "simran-chouhan",
        listerName: "Simran Chouhan",
      }));
    }
    await pool.query(
      "UPDATE orders SET data = $1 WHERE order_id = 'HOK-ORD-1792836078130'",
      [JSON.stringify(d)]
    );
    console.log("Updated Order HOK-ORD-1792836078130 lister to Simran Chouhan");
  }

  // 3. Update payout for HOK-ORD-1792836078130 to simran-chouhan
  const payRes = await pool.query(
    "SELECT _id, data FROM payouts WHERE order_id = 'HOK-ORD-1792836078130'"
  );
  if (payRes.rows.length > 0) {
    const d = payRes.rows[0].data || {};
    d.listerId = "simran-chouhan";
    d.listerName = "Simran Chouhan";
    await pool.query(
      "UPDATE payouts SET lister_id = 'simran-chouhan', data = $1 WHERE order_id = 'HOK-ORD-1792836078130'",
      [JSON.stringify(d)]
    );
    console.log("Updated Payout for HOK-ORD-1792836078130 to Simran Chouhan");
  }

  pool.end();
}

run().catch((e) => {
  console.error("Error:", e);
  pool.end();
});
