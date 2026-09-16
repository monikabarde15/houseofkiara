import mongoose from 'mongoose';
mongoose.connect('mongodb://127.0.0.1:27017/hok_admin_db').then(async () => {
  const db = mongoose.connection.db;
  const products = await db.collection('products').find({ $or: [{ listerId: /rohit/i }, { listerName: /rohit/i }] }).toArray();
  const payouts = await db.collection('payouts').find({ $or: [{ listerId: /rohit/i }, { listerName: /rohit/i }] }).toArray();
  const orders = await db.collection('orders').find({ $or: [{ listerId: /rohit/i }, { listerName: /rohit/i }] }).toArray();
  const listers = await db.collection('listers').find({ $or: [{ listerId: /rohit/i }, { name: /rohit/i }] }).toArray();
  console.log('Listers:', JSON.stringify(listers.map(l => ({ _id: l._id, name: l.name, listerId: l.listerId })), null, 2));
  console.log('Products:', JSON.stringify(products.map(p => ({ _id: p._id, name: p.name, listerId: p.listerId, listerName: p.listerName })), null, 2));
  console.log('Payouts:', JSON.stringify(payouts.map(p => ({ _id: p._id, payoutId: p.payoutId, listerId: p.listerId, listerName: p.listerName })), null, 2));
  console.log('Orders:', JSON.stringify(orders.map(o => ({ _id: o._id, orderId: o.orderId, listerId: o.listerId, listerName: o.listerName })), null, 2));
  process.exit(0);
});
