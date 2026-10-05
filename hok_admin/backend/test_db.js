import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL_POOLER || process.env.DATABASE_URL || 'postgresql://postgres.qfwrxdgjywseodbtadnx:DpUpEOIutDJo6l41@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const res = await pool.query("SELECT data FROM customers WHERE data->>'email' = 'user1789977072607@temp.com'");
    let wishlist = res.rows[0]?.data?.wishlist || [];
    const customerId = res.rows[0]?.data?.customerId;
    console.log('Original Wishlist array:', wishlist);
    
    // Emerald ID is likely one of them, Black is the other.
    // Let's get both products
    const pRes = await pool.query("SELECT data FROM products WHERE data->>'_id' = ANY($1) OR data->>'productId' = ANY($1)", [wishlist]);
    const blackProduct = pRes.rows.find(r => r.data.name === 'Black Contemporary Indo-Western Set');
    
    if (blackProduct) {
       const idToRemove = blackProduct.data._id;
       wishlist = wishlist.filter(id => id !== idToRemove && id !== blackProduct.data.productId && id !== blackProduct.data.id);
       console.log('New Wishlist array:', wishlist);
       
       const customerData = res.rows[0].data;
       customerData.wishlist = wishlist;
       customerData.wishlistCount = wishlist.length;
       
       await pool.query("UPDATE customers SET data = $1 WHERE data->>'email' = 'user1789977072607@temp.com'", [customerData]);
       console.log('Updated customer database successfully');
    }

  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

main();
