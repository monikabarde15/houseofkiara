import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:DpUpEOIutDJo6l41@db.qfwrxdgjywseodbtadnx.supabase.co:5432/postgres",
});

async function run() {
  // 1. Ensure Ananya Sharma exists in listers
  const checkAnanya = await pool.query(
    "SELECT * FROM listers WHERE lister_id = 'ananya-sharma' OR name ILIKE '%Ananya%'"
  );
  if (checkAnanya.rows.length === 0) {
    const ananyaData = {
      _id: "lister-ananya-sharma",
      listerId: "ananya-sharma",
      name: "Ananya Sharma",
      email: "ananya@gmail.com",
      phone: "+919876543210",
      status: "Verified",
      city: "Mumbai",
      initials: "AS",
      joined: "2026-09-15T00:00:00.000Z",
      createdAt: "2026-09-15T00:00:00.000Z",
      verified: true,
      address: {
        city: "Mumbai",
        state: "Maharashtra",
        pin: "400050",
        line1: "Bandra West, Mumbai",
      },
    };
    await pool.query(
      `INSERT INTO listers (_id, lister_id, name, email, phone, city, status, data, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [
        "lister-ananya-sharma",
        "ananya-sharma",
        "Ananya Sharma",
        "ananya@gmail.com",
        "+919876543210",
        "Mumbai",
        "Verified",
        JSON.stringify(ananyaData),
      ]
    );
    console.log("Inserted Ananya Sharma into listers table");
  }

  // 2. Lookup products by ID and name
  const prods = await pool.query(
    "SELECT _id, product_id, name, lister_id, (data->>'listerId') as dlister FROM products"
  );
  const prodToLister = {};
  prods.rows.forEach((p) => {
    const lister = p.lister_id || p.dlister;
    if (lister) {
      if (p._id) prodToLister[p._id] = lister;
      if (p.product_id) prodToLister[p.product_id] = lister;
      if (p.name) prodToLister[p.name.trim().toLowerCase()] = lister;
    }
  });

  // 3. Update orders with proper listerId
  const orders = await pool.query("SELECT _id, order_id, data FROM orders");
  for (const o of orders.rows) {
    const d = o.data || {};
    const items = d.items || [];
    let orderLister = d.listerId || "";

    const newItems = items.map((it) => {
      const pid = it.productId || it._id || it.id;
      const pName = (it.productName || "").trim().toLowerCase();
      const matchedLister = prodToLister[pid] || prodToLister[pName];
      if (matchedLister) {
        it.listerId = matchedLister;
        it.listerName =
          matchedLister === "simran-chouhan"
            ? "Simran Chouhan"
            : matchedLister === "ananya-sharma"
            ? "Ananya Sharma"
            : matchedLister;
        if (!orderLister) orderLister = it.listerId;
      }
      return it;
    });

    if (!orderLister && d.productName) {
      orderLister = prodToLister[d.productName.trim().toLowerCase()] || "";
    }

    d.items = newItems;
    d.listerId = orderLister;
    d.listerName =
      orderLister === "simran-chouhan"
        ? "Simran Chouhan"
        : orderLister === "ananya-sharma"
        ? "Ananya Sharma"
        : orderLister;

    await pool.query("UPDATE orders SET data = $1 WHERE _id = $2", [
      JSON.stringify(d),
      o._id,
    ]);
  }
  console.log("Updated orders with correct listerIds");

  // 4. Update payouts with correct lister_id and listerId in data
  const payouts = await pool.query("SELECT _id, data FROM payouts");
  for (const p of payouts.rows) {
    const d = p.data || {};
    const pid = d.productId;
    const pName = (d.productName || "").trim().toLowerCase();
    const matchedLister = prodToLister[pid] || prodToLister[pName];
    if (matchedLister) {
      const lName =
        matchedLister === "simran-chouhan"
          ? "Simran Chouhan"
          : matchedLister === "ananya-sharma"
          ? "Ananya Sharma"
          : matchedLister;
      d.listerId = matchedLister;
      d.listerName = lName;
      await pool.query(
        "UPDATE payouts SET lister_id = $1, data = $2 WHERE _id = $3",
        [matchedLister, JSON.stringify(d), p._id]
      );
    }
  }
  console.log("Updated payouts with correct lister_id matching products");

  pool.end();
}

run().catch((e) => {
  console.error("Migration error:", e);
  pool.end();
});
