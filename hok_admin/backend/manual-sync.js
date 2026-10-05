import { connectDB } from "./config/db.js";

async function run() {
  await connectDB();
  const Product = (await import("./models/Product.js")).default;
  const product = await Product.findOne({ _id: "76ab786b25af1d9878e73302" }); // The Black Indo-Western set from screenshot URL

  if (product) {
    if (!product.blockedDates) product.blockedDates = [];

    // Let's manually block 24th to 27th for the demonstration
    product.blockedDates.push({
      from: new Date("2026-09-24"),
      to: new Date("2026-09-27"),
      reason: "Rented (Manual Sync)",
    });
    await product.save();
    console.log(
      "Successfully added manual blocked dates to Black Contemporary Indo-Western Set",
    );
  } else {
    console.log("Product not found");
  }
  process.exit(0);
}

run().catch(console.error);
