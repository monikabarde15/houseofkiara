import mongoose from 'mongoose';
import('./backend/config/db.js').then(m => m.connectDB()).then(async () => {
  const Product = (await import('./backend/models/Product.js')).default;
  const Submission = (await import('./backend/models/Submission.js')).default;
  const products = await Product.find({ status: 'Draft' });
  for (let p of products) {
    if (!p.images || p.images.length === 0) {
      const sub = await Submission.findOne({ sku: p.sku });
      if (sub && sub.media && sub.media.length > 0) {
        p.images = sub.media.map(m => m.url).filter(Boolean);
        await p.save();
      }
    }
  }
  console.log('Updated draft product images');
  process.exit(0);
}).catch(console.error);
