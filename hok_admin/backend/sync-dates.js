import { connectDB } from "./config/db.js";

async function run() {
  await connectDB();
  const Order = (await import("./models/Order.js")).default;
  const Product = (await import("./models/Product.js")).default;

  const orders = await Order.find({ "items.mode": { $regex: /rental/i } });
  let updated = 0;
  for (const order of orders) {
    for (const item of order.items) {
      if (
        item.mode &&
        item.mode.toLowerCase() === "rental" &&
        item.rentalStartDate &&
        item.rentalEndDate
      ) {
        const product = await Product.findOne({
          $or: [{ productId: item.productId }, { _id: item.productId }],
        });
        if (product) {
          const exists = (product.blockedDates || []).some(
            (b) =>
              new Date(b.from).getTime() ===
                new Date(item.rentalStartDate).getTime() &&
              new Date(b.to).getTime() ===
                new Date(item.rentalEndDate).getTime(),
          );
          if (!exists) {
            if (!product.blockedDates) product.blockedDates = [];
            product.blockedDates.push({
              from: new Date(item.rentalStartDate),
              to: new Date(item.rentalEndDate),
              reason: "Rented (Order " + order.orderId + ")",
            });
            await product.save();
            updated++;
          }
        }
      }
    }
  }
  console.log("Fixed " + updated + " products blocked dates");
  process.exit(0);
}

run().catch(console.error);
