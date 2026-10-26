import PromoCode from './models/PromoCode.js';
import Order from './models/Order.js';

(async () => {
  try {
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const samplePromos = [
      {
        code: 'KAIRA10',
        type: 'percent',
        value: 10,
        maxDiscount: 5000,
        minOrder: null,
        reason: 'Welcome 10% discount on first designer rental',
        publicDesc: 'Get 10% off on designer pieces',
        status: 'Active',
        visibility: 'drawer',
        audience: 'public',
        createdBy: 'Admin',
        createdOn: today,
        history: [{ e: 'Code created', t: `${today} - Admin` }]
      },
      {
        code: 'KAIRA500',
        type: 'flat',
        value: 500,
        maxDiscount: 500,
        minOrder: null,
        reason: 'Flat ₹500 off on festive collection',
        publicDesc: 'Flat ₹500 discount at checkout',
        status: 'Active',
        visibility: 'share',
        audience: 'public',
        createdBy: 'Admin',
        createdOn: today,
        history: [{ e: 'Code created', t: `${today} - Admin` }]
      },
      {
        code: 'FESTIVE20',
        type: 'percent',
        value: 20,
        maxDiscount: 10000,
        minOrder: 50000,
        reason: 'Diwali & Wedding Season special 20% privilege offer',
        publicDesc: '20% off for wedding season bookings',
        status: 'Active',
        visibility: 'drawer',
        audience: 'public',
        createdBy: 'Soumya',
        createdOn: today,
        history: [{ e: 'Code created', t: `${today} - Soumya` }]
      }
    ];

    for (const p of samplePromos) {
      await PromoCode.findOneAndUpdate(
        { code: p.code },
        p,
        { upsert: true, new: true }
      );
      console.log('Seeded promo code:', p.code);
    }

    console.log('Promotions seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding promotions:', err);
    process.exit(1);
  }
})();
