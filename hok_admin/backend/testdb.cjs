const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres.qfwrxdgjywseodbtadnx:DpUpEOIutDJo6l41@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});
client.connect()
  .then(() => client.query("UPDATE submissions SET data = jsonb_set(data, '{yearOfPurchase}', '\"2023\"', true) WHERE subid='SUB-2026-006'"))
  .then(res => console.log('Updated successfully', res.rowCount))
  .catch(e => console.error(e))
  .finally(() => client.end());
