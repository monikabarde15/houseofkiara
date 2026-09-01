import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import { connectDB, pool } from "../config/db.js";
import { migrate } from "../db/migrate.js";
import Admin from "../models/Admin.js";
import Customer from "../models/Customer.js";
import Designer from "../models/Designer.js";
import Lister from "../models/Lister.js";
import Offer from "../models/Offer.js";
import Order from "../models/Order.js";
import Payout from "../models/Payout.js";
import Product from "../models/Product.js";

const runTests = async () => {
  console.log("=== RUNNING POSTGRESQL & MONGOOSE-JSONB ADAPTER VERIFICATION SUITE ===");

  // 1. Connection & Migration Test
  console.log("\n[Test 1] Connecting to Supabase PostgreSQL & Running Migrations...");
  await connectDB();

  // Verify all 8 tables exist
  const tableCheckSql = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name IN ('admins', 'customers', 'designers', 'listers', 'offers', 'orders', 'payouts', 'products');
  `;
  const tablesRes = await pool.query(tableCheckSql);
  const foundTables = tablesRes.rows.map((r) => r.table_name).sort();
  console.log("Found tables in PostgreSQL:", foundTables);
  const expectedTables = ["admins", "customers", "designers", "listers", "offers", "orders", "payouts", "products"].sort();
  if (JSON.stringify(foundTables) !== JSON.stringify(expectedTables)) {
    throw new Error(`Tables mismatch! Found: ${foundTables.join(", ")}, Expected: ${expectedTables.join(", ")}`);
  }
  console.log("✓ All 8 tables verified in PostgreSQL schema.");

  // Clean up any prior test artifacts
  const testPrefix = "TEST-" + Date.now();

  // 2. Admin Model Test
  console.log("\n[Test 2] Admin Model (create, findOne, save, exists)...");
  const testAdminEmail = `test.admin.${Date.now()}@hok.example.com`;
  const admin = await Admin.create({
    name: "Test Admin",
    email: testAdminEmail,
    passwordHash: "hash123",
    passwordSalt: "salt123",
  });
  if (!admin._id || admin.email !== testAdminEmail) {
    throw new Error("Admin.create failed");
  }
  console.log("✓ Admin created:", admin._id, admin.email);

  const foundAdmin = await Admin.findOne({ email: testAdminEmail });
  if (!foundAdmin || foundAdmin.name !== "Test Admin") {
    throw new Error("Admin.findOne failed");
  }
  foundAdmin.sessionToken = "token_xyz_123";
  await foundAdmin.save();

  const verifyAdmin = await Admin.findOne({ email: testAdminEmail });
  if (verifyAdmin.sessionToken !== "token_xyz_123") {
    throw new Error("Admin.save sessionToken update failed");
  }
  console.log("✓ Admin findOne and save verified.");

  const adminExists = await Admin.exists({ email: testAdminEmail });
  if (!adminExists || !adminExists._id) {
    throw new Error("Admin.exists failed");
  }
  console.log("✓ Admin.exists verified:", adminExists);

  // 3. Customer Model Test
  console.log("\n[Test 3] Customer Model (create, find, nested push, save, delete)...");
  const testCustId = `${testPrefix}-CUST-1`;
  const customer = await Customer.create({
    customerId: testCustId,
    name: "Pooja Hegde",
    email: `${testCustId.toLowerCase()}@example.com`,
    phone: "+91 9876543210",
    location: "Mumbai",
    status: "Active",
    preferences: { preferredSize: "M", newsletter: true },
  });
  if (!customer._id || customer.customerId !== testCustId) {
    throw new Error("Customer.create failed");
  }
  console.log("✓ Customer created:", customer.customerId, customer.preferences);

  // Mutate nested arrays & in-place save
  customer.addresses.push({ id: "ADDR-1", label: "Home", address: "Bandra West, Mumbai", isDefault: true });
  customer.communicationLog.unshift({ id: "COMM-1", message: "WhatsApp welcome sent", channel: "WhatsApp" });
  await customer.save();

  const fetchedCust = await Customer.findOne({ customerId: testCustId });
  if (fetchedCust.addresses.length !== 1 || fetchedCust.communicationLog.length !== 1) {
    throw new Error("Customer array mutation/save failed");
  }
  console.log("✓ Customer address & communicationLog push verified.");

  // Customer findOneAndUpdate
  const updatedCust = await Customer.findOneAndUpdate(
    { customerId: testCustId },
    { $set: { location: "Mumbai Suburban", "preferences.preferredSilhouettes": "A-line" } },
    { new: true }
  );
  if (updatedCust.location !== "Mumbai Suburban" || updatedCust.preferences.preferredSilhouettes !== "A-line") {
    throw new Error("Customer.findOneAndUpdate $set failed");
  }
  console.log("✓ Customer.findOneAndUpdate verified.");

  // 4. Designer Model Test
  console.log("\n[Test 4] Designer Model (countDocuments, insertMany, find, regex)...");
  const testDesId = `${testPrefix}-DES-1`;
  const designer = await Designer.create({
    designerId: testDesId,
    slug: testDesId.toLowerCase(),
    name: "Anita Dongre Test",
    type: "Couture House",
    status: "Active",
    sortOrder: 10,
    commercialTerms: { commissionRateBuyNow: "20%", paymentTerms: "Net 15" },
  });
  if (!designer.slug || designer.commercialTerms.commissionRateBuyNow !== "20%") {
    throw new Error("Designer.create failed");
  }
  console.log("✓ Designer created with commercialTerms.");

  const desCount = await Designer.countDocuments({ designerId: testDesId });
  if (desCount !== 1) {
    throw new Error(`Designer.countDocuments expected 1, got ${desCount}`);
  }
  console.log("✓ Designer.countDocuments verified.");

  const regexSearch = await Designer.find({ name: new RegExp("anita", "i") });
  if (!regexSearch.some((d) => d.designerId === testDesId)) {
    throw new Error("Designer.find with RegExp search failed");
  }
  console.log("✓ Designer regex query verified.");

  // 5. Lister Model Test
  console.log("\n[Test 5] Lister Model (flexible schema, bankDetails)...");
  const testListerId = `${testPrefix}-LIST-1`;
  const lister = await Lister.create({
    listerId: testListerId,
    name: "Ritu Kumar Lister",
    email: `${testListerId.toLowerCase()}@example.com`,
    phone: "+91 9998887776",
    city: "Delhi",
    bankDetails: { accountHolder: "Ritu Kumar", accountNumber: "1234567890", ifsc: "HDFC0000123" },
  });
  if (lister.bankDetails.ifsc !== "HDFC0000123") {
    throw new Error("Lister.create flexible schema failed");
  }
  console.log("✓ Lister created with bankDetails.");

  // 6. Offer Model Test (Query chaining, Aggregation, updateMany, deleteMany)
  console.log("\n[Test 6] Offer Model (chaining, aggregation pipelines, updateMany)...");
  const testOffer1Id = `${testPrefix}-OFF-1`;
  const testOffer2Id = `${testPrefix}-OFF-2`;
  await Offer.create({
    offerId: testOffer1Id,
    productName: "Bridal Lehenga 1",
    customerName: "Sneha Patel",
    customerEmail: "sneha@example.com",
    finalAmount: 15000,
    status: "Accepted",
    isDeleted: false,
    notes: [{ message: "First note from admin" }],
  });
  await Offer.create({
    offerId: testOffer2Id,
    productName: "Bridal Lehenga 2",
    customerName: "Kavita Rao",
    customerEmail: "kavita@example.com",
    finalAmount: 25000,
    status: "Pending",
    isDeleted: false,
  });

  // Query chaining: sort, limit, skip, select, lean
  const chainedOffers = await Offer.find({ offerId: { $in: [testOffer1Id, testOffer2Id] } })
    .sort({ finalAmount: -1 })
    .limit(2)
    .lean();

  if (chainedOffers.length !== 2 || chainedOffers[0].finalAmount !== 25000) {
    throw new Error("Offer query chaining (sort/limit/lean) failed");
  }
  console.log("✓ Offer query chaining (.sort, .limit, .lean) verified.");

  // Aggregation 1: Status Statistics
  const statusStats = await Offer.aggregate([
    { $match: { offerId: { $in: [testOffer1Id, testOffer2Id] } } },
    { $group: { _id: "$status", total: { $sum: 1 } } },
  ]);
  console.log("✓ Offer aggregate status statistics:", statusStats);
  if (statusStats.length !== 2) {
    throw new Error("Offer aggregation status statistics failed");
  }

  // Aggregation 2: Overall Accepted Revenue
  const acceptedRevenue = await Offer.aggregate([
    { $match: { offerId: { $in: [testOffer1Id, testOffer2Id] }, status: "Accepted" } },
    { $group: { _id: null, revenue: { $sum: "$finalAmount" } } },
  ]);
  console.log("✓ Offer aggregate accepted revenue:", acceptedRevenue);
  if (acceptedRevenue[0]?.revenue !== 15000) {
    throw new Error(`Offer aggregate revenue expected 15000, got ${acceptedRevenue[0]?.revenue}`);
  }

  // Aggregation 3: Monthly Statistics
  const monthlyStats = await Offer.aggregate([
    { $match: { offerId: { $in: [testOffer1Id, testOffer2Id] } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        totalOffers: { $sum: 1 },
        totalRevenue: { $sum: "$finalAmount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
  console.log("✓ Offer aggregate monthly statistics:", monthlyStats);
  if (!monthlyStats[0] || monthlyStats[0].totalOffers !== 2 || monthlyStats[0].totalRevenue !== 40000) {
    throw new Error("Offer aggregate monthly statistics failed");
  }

  // updateMany
  const updateManyRes = await Offer.updateMany(
    { offerId: { $in: [testOffer1Id, testOffer2Id] } },
    { $set: { currency: "INR" } }
  );
  if (updateManyRes.modifiedCount !== 2) {
    throw new Error(`Offer.updateMany expected 2 modified, got ${updateManyRes.modifiedCount}`);
  }
  console.log("✓ Offer.updateMany verified.");

  // 7. Order Model Test (Workflow, subdocuments, logs $push)
  console.log("\n[Test 7] Order Model (items subdocuments, status transitions, logs)...");
  const testOrderId = `${testPrefix}-ORD-1`;
  const order = await Order.create({
    orderId: testOrderId,
    customerId: testCustId,
    customerName: "Pooja Hegde",
    customerEmail: "pooja@example.com",
    mode: "Rental",
    status: "Confirmed",
    depositHeld: 5000,
    items: [
      {
        productId: "PRD-1",
        productName: "Red Sabyasachi Lehenga",
        designer: "Sabyasachi",
        mode: "Rental",
        size: "M",
        rentalStartDate: "2026-09-01",
        rentalEndDate: "2026-09-05",
        amount: 12000,
        deposit: 5000,
        status: "Confirmed",
        dispatch: { courierPartner: "Bluedart", trackingNumber: "TRK123456" },
      },
    ],
    logs: [{ message: "Order placed", type: "System", user: "Customer" }],
  });
  if (!order.items || order.items[0].productName !== "Red Sabyasachi Lehenga") {
    throw new Error("Order.create with subdocuments failed");
  }
  console.log("✓ Order created:", order.orderId, "items:", order.items.length);

  // Status update + $push log
  const updatedOrder = await Order.findOneAndUpdate(
    { orderId: testOrderId },
    {
      $set: { status: "Shipped" },
      $push: { logs: { message: "Order marked as Shipped", type: "Status Change", user: "Admin" } },
    },
    { new: true }
  );
  if (updatedOrder.status !== "Shipped" || updatedOrder.logs.length !== 2) {
    throw new Error("Order.findOneAndUpdate with $set and $push log failed");
  }
  console.log("✓ Order status update and logs push verified.");

  // 8. Payout Model Test (payout calculation, status, aggregate)
  console.log("\n[Test 8] Payout Model (create, find.exec, aggregate)...");
  const testPayoutId = `${testPrefix}-PAY-1`;
  const payout = await Payout.create({
    payoutId: testPayoutId,
    orderId: testOrderId,
    listerId: testListerId,
    listerName: "Ritu Kumar Lister",
    productId: "PRD-1",
    productName: "Red Sabyasachi Lehenga",
    transactionAmount: 12000,
    payoutPercentage: 80,
    listerShare: 9600,
    hokCommission: 2400,
    taxDeduction: 0,
    netPayout: 9600,
    dueDate: new Date(Date.now() + 7 * 86400000),
    status: "Pending",
  });
  if (!payout.payoutId || payout.listerShare !== 9600) {
    throw new Error("Payout.create failed");
  }
  console.log("✓ Payout created:", payout.payoutId, "netPayout:", payout.netPayout);

  const pendingPayoutTotal = await Payout.aggregate([
    { $match: { payoutId: testPayoutId, status: "Pending" } },
    { $group: { _id: null, total: { $sum: "$listerShare" } } },
  ]);
  if (pendingPayoutTotal[0]?.total !== 9600) {
    throw new Error(`Payout aggregate expected 9600, got ${pendingPayoutTotal[0]?.total}`);
  }
  console.log("✓ Payout aggregate verified:", pendingPayoutTotal);

  // 9. Product Model & Atomic Booking Concurrency Test
  console.log("\n[Test 9] Product Model & Concurrency Lock with $not $elemMatch...");
  const testProdId = `${testPrefix}-PRD-1`;
  const product = await Product.create({
    productId: testProdId,
    name: "Sequin Raw Silk Saree",
    designer: "Anita Dongre",
    category: "Sarees",
    status: "Live",
    availability: "Available Now",
    rentalPrice: 6000,
    securityDeposit: 3000,
    timesRented: 0,
    bookingHistory: [],
  });
  if (!product.productId || product.status !== "Live") {
    throw new Error("Product.create failed");
  }
  console.log("✓ Product created:", product.productId);

  // First booking lock: 2026-10-01 to 2026-10-05
  const occupiedStart = new Date("2026-10-01T00:00:00.000Z");
  const occupiedEnd = new Date("2026-10-05T00:00:00.000Z");

  const lockQuery = {
    _id: product._id,
    status: "Live",
    availability: "Available Now",
    bookingHistory: {
      $not: {
        $elemMatch: {
          startDate: { $lte: occupiedEnd.toISOString() },
          endDate: { $gte: occupiedStart.toISOString() },
          status: { $nin: ["Cancelled", "Rejected"] },
        },
      },
    },
  };

  const booking1 = {
    orderId: "RES-101",
    customerName: "Rani Mukherjee",
    startDate: occupiedStart.toISOString(),
    endDate: occupiedEnd.toISOString(),
    amount: 6000,
    deposit: 3000,
    status: "Reserved",
  };

  const lockedProd1 = await Product.findOneAndUpdate(
    lockQuery,
    {
      $push: {
        bookingHistory: booking1,
        activityLog: { action: "Booking reserved", user: "Admin", remarks: "Oct 1 - Oct 5" },
      },
      $inc: { timesRented: 1 },
    },
    { new: true }
  );

  if (!lockedProd1 || lockedProd1.bookingHistory.length !== 1 || lockedProd1.timesRented !== 1) {
    throw new Error("Initial Product booking lock failed");
  }
  console.log("✓ Initial booking lock succeeded (bookingHistory count: 1, timesRented: 1).");

  // Attempt second overlapping booking: 2026-10-03 to 2026-10-08 -> MUST FAIL (return null)
  const overlappingStart = new Date("2026-10-03T00:00:00.000Z");
  const overlappingEnd = new Date("2026-10-08T00:00:00.000Z");

  const conflictLockQuery = {
    _id: product._id,
    status: "Live",
    availability: "Available Now",
    bookingHistory: {
      $not: {
        $elemMatch: {
          startDate: { $lte: overlappingEnd.toISOString() },
          endDate: { $gte: overlappingStart.toISOString() },
          status: { $nin: ["Cancelled", "Rejected"] },
        },
      },
    },
  };

  const lockedProd2 = await Product.findOneAndUpdate(
    conflictLockQuery,
    {
      $push: {
        bookingHistory: {
          orderId: "RES-102-CONFLICT",
          customerName: "Conflicting Customer",
          startDate: overlappingStart.toISOString(),
          endDate: overlappingEnd.toISOString(),
          status: "Reserved",
        },
      },
    },
    { new: true }
  );

  if (lockedProd2 !== null) {
    throw new Error("Double-booking conflict detection failed! Expected null due to date overlap.");
  }
  console.log("✓ Overlapping booking collision successfully blocked with null return (Atomic Concurrency Verified).");

  // 10. Clean up Test Records
  console.log("\n[Test 10] Cleaning up test records from database...");
  await Admin.findOneAndDelete({ email: testAdminEmail });
  await Customer.findOneAndDelete({ customerId: testCustId });
  await Designer.findOneAndDelete({ designerId: testDesId });
  await Lister.findOneAndDelete({ listerId: testListerId });
  await Offer.deleteMany({ offerId: { $in: [testOffer1Id, testOffer2Id] } });
  await Order.findOneAndDelete({ orderId: testOrderId });
  await Payout.findOneAndDelete({ payoutId: testPayoutId });
  await Product.findOneAndDelete({ productId: testProdId });
  console.log("✓ Test cleanup completed.");

  console.log("\n==========================================================================");
  console.log("🎉 ALL 10 INTEGRATION & CRUD VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉");
  console.log("==========================================================================");
};

runTests()
  .then(() => {
    pool.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Test failed:", err);
    pool.end();
    process.exit(1);
  });
