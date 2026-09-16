const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.qfwrxdgjywseodbtadnx:DpUpEOIutDJo6l41@aws-0-ap-south-1.pooler.supabase.com:6543/postgres', ssl: { rejectUnauthorized: false } });

async function run() {
  await client.connect();
  const res = await client.query('SELECT _id, data FROM submissions');
  
  let count = 0;
  for (let row of res.rows) {
    const data = row.data;
    let modified = false;
    
    if (!data.yearOfPurchase) {
      data.yearOfPurchase = '2023';
      modified = true;
    }
    
    if (modified) {
      await client.query('UPDATE submissions SET data = $1 WHERE _id = $2', [JSON.stringify(data), row._id]);
      count++;
    }
  }
  
  console.log(`Updated ${count} submissions with missing yearOfPurchase.`);
}

run().catch(console.error).finally(() => client.end());
