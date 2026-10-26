import Submission from './models/Submission.js';
import Lister from './models/Lister.js';

(async () => {
  try {
    const ananya = await Lister.findOne({ listerId: 'ananya-sharma' });
    const ananyaId = ananya ? ananya.listerId : 'ananya-sharma';

    const sampleSubmissions = [
      {
        subid: 'SUB-2026-842',
        listerId: ananyaId,
        piece: 'Royal Crimson Bridal Lehenga',
        designer: 'Seema Gujral',
        category: 'Bridal Lehenga',
        submitted: '14 Oct 2026',
        channel: 'Website',
        intent: 'Open to both',
        askRent: '₹50,000',
        askSell: '₹1,50,000',
        conditionClaim: 'Flawless condition, worn once for wedding reception',
        timesWorn: '1 time',
        yearOfPurchase: '2025',
        originalPrice: '₹3,20,000',
        colour: 'Red / Maroon',
        size: 'M',
        photos: 4,
        decision: { what: 'Approved', on: '2026-10-14', by: 'Soumya', reason: 'High demand designer piece' },
        assignedTo: 'Soumya'
      },
      {
        subid: 'SUB-2026-843',
        listerId: ananyaId,
        piece: 'Emerald Embroidered Anarkali',
        designer: 'Gaurav Gupta',
        category: 'Anarkali / Gown',
        submitted: '14 Oct 2026',
        channel: 'WhatsApp',
        intent: 'Rent it',
        askRent: '₹30,000',
        askSell: null,
        conditionClaim: 'Worn twice, dry cleaned and sealed',
        timesWorn: '2 times',
        yearOfPurchase: '2025',
        originalPrice: '₹1,80,000',
        colour: 'Pastel Mint / Sage',
        size: 'S',
        photos: 5,
        decision: { what: 'Approved', on: '2026-10-14', by: 'Soumya', reason: 'Ready for festive demand' },
        assignedTo: 'Soumya'
      },
      {
        subid: 'SUB-2026-844',
        listerId: ananyaId,
        piece: 'Midnight Wine Embellished Saree',
        designer: 'Seema Gujral',
        category: 'Saree',
        submitted: '14 Oct 2026',
        channel: 'Instagram',
        intent: 'Sell it',
        askRent: null,
        askSell: '₹45,000',
        conditionClaim: 'Pristine boutique condition with designer tags',
        timesWorn: 'Unworn',
        yearOfPurchase: '2026',
        originalPrice: '₹1,10,000',
        colour: 'Purple / Mauve',
        size: 'Custom / Free Size',
        photos: 3,
        decision: null,
        assignedTo: 'Soumya'
      },
      {
        subid: 'SUB-2026-845',
        listerId: ananyaId,
        piece: 'Black Contemporary Indo-Western Set',
        designer: 'Gaurav Gupta',
        category: 'Indo-Western',
        submitted: '14 Oct 2026',
        channel: 'In Person',
        intent: 'Open to both',
        askRent: '₹35,000',
        askSell: '₹95,000',
        conditionClaim: 'Verified in atelier by quality team',
        timesWorn: '1 time',
        yearOfPurchase: '2025',
        originalPrice: '₹2,10,000',
        colour: 'Black / Charcoal',
        size: 'M',
        photos: 6,
        decision: null,
        moreInfo: { requestedAt: '2026-10-14T08:00:00Z', note: 'Need close-up of collar embroidery' },
        assignedTo: 'Soumya'
      }
    ];

    const Product = (await import('./models/Product.js')).default;
    const allProducts = await Product.find({});

    for (const sub of sampleSubmissions) {
      const matched = allProducts.find(p => p.name && sub.piece && p.name.toLowerCase().includes(sub.piece.toLowerCase()));
      if (matched) {
        sub.sku = matched.productId || matched.id || matched.sku;
        if (matched.images && matched.images.length > 0) {
          sub.media = matched.images.slice(0, 5).map((url, idx) => ({
            name: idx === 0 ? 'Full view' : idx === 1 ? 'Detail / work' : idx === 2 ? 'Back view' : `Side angle ${idx}`,
            url,
            kind: 'image'
          }));
          sub.photos = sub.media.length;
        }
      }

      await Submission.findOneAndUpdate(
        { subid: sub.subid },
        sub,
        { upsert: true, new: true }
      );
      console.log('Seeded submission:', sub.subid, sub.channel, sub.piece, 'SKU:', sub.sku);
    }

    const total = await Submission.countDocuments();
    console.log('Total submissions seeded successfully:', total);
    process.exit(0);
  } catch (e) {
    console.error('Error seeding submissions:', e);
    process.exit(1);
  }
})();
