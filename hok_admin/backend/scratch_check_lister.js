import Lister from './models/Lister.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Payout from './models/Payout.js';
import Submission from './models/Submission.js';

(async () => {
  const ananya = await Lister.findOne({ $or: [{ name: /Ananya/i }, { listerId: /ananya/i }] });
  console.log('--- ANANYA SHARMA RECORD ---');
  console.log(ananya ? { id: ananya.id, _id: ananya._id, listerId: ananya.listerId, name: ananya.name, phone: ananya.phone, email: ananya.email } : 'Not found');

  const ananyaId = ananya ? ananya.listerId : 'ananya-sharma';
  const prods = await Product.find({ $or: [{ listerId: ananyaId }, { listerName: /Ananya/i }] });
  console.log('--- PRODUCTS WITH ANANYA LISTER ---', prods.length);
  prods.forEach(p => console.log('Product:', p.id || p.productId, p.name, p.designer, p.listerId));

  const allProds = await Product.find({});
  console.log('--- ALL PRODUCTS SAMPLE (all 14) ---');
  allProds.forEach(p => console.log('Prod:', p.id || p.productId, p.name, 'listerId:', p.listerId, 'listerName:', p.listerName));

  const payouts = await Payout.find({});
  console.log('--- ALL PAYOUTS IN DB ---', payouts.length);
  payouts.forEach(p => console.log('Payout:', p.payoutId, 'orderId:', p.orderId, 'listerId:', p.listerId, 'listerName:', p.listerName, 'amount:', p.transactionAmount, 'listerShare:', p.listerShare, 'status:', p.status));

  const orders = await Order.find({});
  console.log('--- ALL ORDERS IN DB ---', orders.length);
  orders.forEach(o => console.log('Order:', o.orderId, o.customerName, o.mode, o.amount, 'listerId:', o.listerId, 'listerName:', o.listerName));

  const subs = await Submission.find({});
  console.log('--- ALL SUBMISSIONS IN DB ---', subs.length);
  subs.forEach(s => console.log('Sub:', s.subid, s.piece, s.designer, s.listerId, s.channel));

  process.exit(0);
})();
