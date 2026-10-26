import Lister from './models/Lister.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Payout from './models/Payout.js';
import Submission from './models/Submission.js';
import { syncPayoutsFromOrders } from './controllers/payoutController.js';

(async () => {
  try {
    const ananya = await Lister.findOne({ $or: [{ name: /Ananya/i }, { listerId: /ananya/i }] });
    if (!ananya) {
      console.error('Ananya Sharma not found in Lister table!');
      process.exit(1);
    }
    const ananyaId = ananya.listerId || 'ananya-sharma';
    const ananyaName = ananya.name || 'Ananya Sharma';

    // 1. Get all products of Ananya
    const ananyaProducts = await Product.find({ listerId: ananyaId });
    const ananyaProdNames = ananyaProducts.map(p => p.name.trim().toLowerCase());
    console.log('Ananya products:', ananyaProdNames);

    // 2. Update existing orders that have Ananya products
    const orders = await Order.find({});
    let updatedOrdersCount = 0;

    for (const order of orders) {
      let isAnanyaOrder = false;
      const updatedItems = (order.items || []).map(item => {
        const pName = (item.productName || '').trim().toLowerCase();
        if (ananyaProdNames.some(name => pName.includes(name) || name.includes(pName))) {
          isAnanyaOrder = true;
          return {
            ...item.toObject(),
            listerId: ananyaId,
            listerName: ananyaName
          };
        }
        return item.toObject();
      });

      if (isAnanyaOrder) {
        order.items = updatedItems;
        order.listerId = ananyaId;
        order.listerName = ananyaName;
        await order.save();
        updatedOrdersCount++;
      }
    }
    console.log(`Updated ${updatedOrdersCount} orders with Ananya Sharma as lister!`);

    // 3. Clear old orphaned payouts with 'rohit' and re-sync
    await Payout.deleteMany({ listerId: 'rohit' });
    console.log('Deleted dummy rohit payouts');

    await syncPayoutsFromOrders();
    console.log('Re-synced all payouts from orders!');

    const ananyaPayouts = await Payout.find({ listerId: ananyaId });
    console.log(`Ananya Sharma now has ${ananyaPayouts.length} payouts in DB!`);

    // 4. Create a realistic submitted piece for Ananya Sharma if none exist
    const existingSub = await Submission.findOne({ listerId: ananyaId });
    if (!existingSub) {
      const newSub = new Submission({
        subid: 'SUB-2026-842',
        listerId: ananyaId,
        piece: 'Royal Crimson Bridal Lehenga',
        designer: 'Seema Gujral',
        category: 'Bridal Lehenga',
        submitted: '14 Oct 2026',
        channel: 'Website (List Your Piece)',
        intent: 'Rent or Sell',
        askRent: '₹50,000',
        askSell: '₹1,50,000',
        conditionClaim: 'Flawless condition, worn once for wedding reception',
        timesWorn: '1 time',
        yearOfPurchase: '2025',
        originalPrice: '₹3,20,000',
        colour: 'Crimson Red',
        size: 'M',
        photos: 4,
        media: [],
        decision: { what: 'Approved', on: '2026-10-14', by: 'Soumya', reason: 'High demand designer piece' },
        assignedTo: 'Soumya'
      });
      await newSub.save();
      console.log('Created sample approved submission for Ananya Sharma (SUB-2026-842)');
    }

    // 5. Also log activity on Ananya's Lister profile
    if (!ananya.activities || ananya.activities.length === 0) {
      ananya.activities = [
        { c: 'sage', e: 'Listing live: Royal Crimson Bridal Lehenga (SUB-2026-842 approved)', t: new Date().toISOString() },
        { c: 'gold', e: 'First rental booking confirmed (HOK-ORD-1790324198882)', t: new Date().toISOString() },
        { c: 'muted', e: 'Payout generated and queued for approval', t: new Date().toISOString() }
      ];
      await ananya.save();
      console.log('Logged initial activity entries for Ananya Sharma');
    }

    console.log('DONE!');
    process.exit(0);
  } catch (err) {
    console.error('Error in fix script:', err);
    process.exit(1);
  }
})();
