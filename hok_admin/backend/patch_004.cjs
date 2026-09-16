const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.qfwrxdgjywseodbtadnx:DpUpEOIutDJo6l41@aws-0-ap-south-1.pooler.supabase.com:6543/postgres', ssl: { rejectUnauthorized: false } });
async function run() {
  await client.connect();
  const res = await client.query("SELECT _id, data FROM submissions WHERE subid='SUB-2026-004'");
  if (res.rows.length === 0) return;
  const doc = res.rows[0];
  const data = doc.data;
  data.yearOfPurchase = '2023';
  await client.query("UPDATE submissions SET data = $1 WHERE _id = $2", [JSON.stringify(data), doc._id]);
  console.log('Updated SUB-2026-004 manually!');
}
run().catch(console.error).finally(() => client.end());
