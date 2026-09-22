const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres.qfwrxdgjywseodbtadnx:DpUpEOIutDJo6l41@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT _id, data FROM submissions WHERE subid='SUB-2026-006'");
  if (res.rows.length === 0) return console.log('Not found');
  
  const doc = res.rows[0];
  const data = doc.data;
  
  if (data.assessment) {
    const priceStd = parseFloat(String(data.askRent || 0).replace(/,/g, ''));
    const resalePrice = parseFloat(String(data.askSell || 0).replace(/,/g, ''));
    const retailPrice = parseFloat(String(data.originalPrice || 0).replace(/,/g, ''));
    
    data.assessment.priceStd = priceStd;
    data.assessment.priceExt = Math.round(priceStd * 1.5);
    data.assessment.perDay = Math.round(priceStd / 4);
    
    data.assessment.resalePrice = resalePrice;
    data.assessment.minOffer = Math.round(resalePrice * 0.8);
    
    data.assessment.retailPrice = retailPrice;
    data.assessment.deposit = Math.round(retailPrice * 0.2);
    
    await client.query("UPDATE submissions SET data = $1 WHERE _id = $2", [JSON.stringify(data), doc._id]);
    console.log('Updated SUB-2026-006 fully');
  }
}

run().catch(console.error).finally(() => client.end());
