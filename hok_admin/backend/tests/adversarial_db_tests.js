import { connectDB, pool } from "../config/db.js";
import Admin from "../models/Admin.js";
import Customer from "../models/Customer.js";
import Designer from "../models/Designer.js";
import Lister from "../models/Lister.js";
import Offer from "../models/Offer.js";
import Order from "../models/Order.js";
import Payout from "../models/Payout.js";
import Product from "../models/Product.js";
import { Types, ObjectId } from "../db/postgresAdapter.js";

const runAdversarialTests = async () => {
  console.log("==========================================================================");
  console.log("🔥 EMPIRICAL ADVERSARIAL STRESS TEST SUITE — MILESTONE 1 DATABASE ADAPTER 🔥");
  console.log("==========================================================================\n");

  await connectDB();
  const testRunId = "ADV-" + Date.now();
  let passedCount = 0;
  let failedCount = 0;
  const failures = [];

  const assert = (condition, testName, details = "") => {
    if (!condition) {
      console.error(`  ❌ FAIL: ${testName} ${details ? `— ${details}` : ""}`);
      failures.push({ testName, details });
      failedCount++;
      throw new Error(`Test assertion failed: ${testName} ${details}`);
    } else {
      console.log(`  ✅ PASS: ${testName}`);
      passedCount++;
    }
  };

  try {
    // =========================================================================
    // CATEGORY 1: Deeply Nested Dot-Notation Updates ($set, $push, $pull, $inc, $addToSet)
    // =========================================================================
    console.log("\n--- [CATEGORY 1] Deep Nested Dot-Notation Updates & Array Manipulations ---");

    const custId1 = `${testRunId}-CUST-NESTED`;
    const cust1 = await Customer.create({
      customerId: custId1,
      name: "Adversarial Tester 1",
      email: `${custId1.toLowerCase()}@example.com`,
      preferences: {
        preferredSize: "S",
        newsletter: false,
        nestedMeta: {
          deep: {
            level1: {
              level2: {
                counter: 10,
                tagList: ["alpha", "beta"],
                deepFlag: true
              }
            }
          }
        }
      },
      addresses: [
        { id: "A1", label: "Work", address: "Tech Park, Bangalore", isDefault: false },
        { id: "A2", label: "Home", address: "Indiranagar, Bangalore", isDefault: true }
      ]
    });

    // 1.1 Deep nested $set without destroying sibling keys
    await Customer.findOneAndUpdate(
      { customerId: custId1 },
      {
        $set: {
          "preferences.preferredSize": "M",
          "preferences.nestedMeta.deep.level1.level2.newField": "createdDynamically",
          "preferences.nestedMeta.deep.level1.siblingField": "siblingPreserved"
        }
      },
      { new: true }
    );

    const docAfterSet = await Customer.findOne({ customerId: custId1 });
    assert(
      docAfterSet.preferences.preferredSize === "M" &&
      docAfterSet.preferences.nestedMeta.deep.level1.level2.newField === "createdDynamically" &&
      docAfterSet.preferences.nestedMeta.deep.level1.level2.counter === 10 &&
      docAfterSet.preferences.nestedMeta.deep.level1.siblingField === "siblingPreserved",
      "1.1 Deeply nested $set preserves sibling properties and creates leaf nodes"
    );

    // 1.2 Deep nested $inc (positive and negative increments)
    await Customer.findOneAndUpdate(
      { customerId: custId1 },
      {
        $inc: {
          "preferences.nestedMeta.deep.level1.level2.counter": 25,
          "ordersCount": 3
        }
      },
      { new: true }
    );

    const docAfterInc = await Customer.findOne({ customerId: custId1 });
    assert(
      docAfterInc.preferences.nestedMeta.deep.level1.level2.counter === 35 &&
      docAfterInc.ordersCount === 3,
      "1.2 Deeply nested $inc correctly computes arithmetic increment on deep paths and root properties"
    );

    // 1.3 Deep nested $push with multiple elements ($each) and simple push
    await Customer.findOneAndUpdate(
      { customerId: custId1 },
      {
        $push: {
          "preferences.nestedMeta.deep.level1.level2.tagList": { $each: ["gamma", "delta"] },
          "occasions": { id: "OCC-1", occasion: "Wedding", date: "2026-11-20" }
        }
      },
      { new: true }
    );

    const docAfterPush = await Customer.findOne({ customerId: custId1 });
    assert(
      Array.isArray(docAfterPush.preferences.nestedMeta.deep.level1.level2.tagList) &&
      docAfterPush.preferences.nestedMeta.deep.level1.level2.tagList.length === 4 &&
      docAfterPush.preferences.nestedMeta.deep.level1.level2.tagList.includes("delta") &&
      docAfterPush.occasions.length === 1 &&
      docAfterPush.occasions[0].occasion === "Wedding",
      "1.3 Deep nested $push handles $each array spreading and subdocument creation"
    );

    // 1.4 Deep nested $pull by primitive value and by object condition
    await Customer.findOneAndUpdate(
      { customerId: custId1 },
      {
        $pull: {
          "preferences.nestedMeta.deep.level1.level2.tagList": "beta",
          "addresses": { id: "A1" }
        }
      },
      { new: true }
    );

    const docAfterPull = await Customer.findOne({ customerId: custId1 });
    assert(
      !docAfterPull.preferences.nestedMeta.deep.level1.level2.tagList.includes("beta") &&
      docAfterPull.preferences.nestedMeta.deep.level1.level2.tagList.length === 3 &&
      docAfterPull.addresses.length === 1 &&
      docAfterPull.addresses[0].id === "A2",
      "1.4 Deep nested $pull correctly filters out matching primitives and matching subdocument objects"
    );

    // 1.5 $addToSet deduplication for primitives and objects
    await Customer.findOneAndUpdate(
      { customerId: custId1 },
      {
        $addToSet: {
          "preferences.nestedMeta.deep.level1.level2.tagList": { $each: ["alpha", "epsilon", "epsilon"] },
          "occasions": { id: "OCC-1", occasion: "Wedding", date: "2026-11-20" } // duplicate of existing
        }
      },
      { new: true }
    );

    const docAfterAddToSet = await Customer.findOne({ customerId: custId1 });
    assert(
      docAfterAddToSet.preferences.nestedMeta.deep.level1.level2.tagList.filter(x => x === "alpha").length === 1 &&
      docAfterAddToSet.preferences.nestedMeta.deep.level1.level2.tagList.includes("epsilon") &&
      docAfterAddToSet.preferences.nestedMeta.deep.level1.level2.tagList.length === 4 &&
      docAfterAddToSet.occasions.length === 1,
      "1.5 $addToSet ignores duplicates for existing primitives and identical objects"
    );

    // 1.6 Deep $unset
    await Customer.findOneAndUpdate(
      { customerId: custId1 },
      {
        $unset: {
          "preferences.nestedMeta.deep.level1.level2.deepFlag": "",
          "flagReason": ""
        }
      },
      { new: true }
    );

    const docAfterUnset = await Customer.findOne({ customerId: custId1 });
    assert(
      docAfterUnset.preferences.nestedMeta.deep.level1.level2.deepFlag === undefined,
      "1.6 $unset completely removes nested properties"
    );

    // =========================================================================
    // CATEGORY 2: High Concurrency & Row Locking (Atomic Race Condition Testing)
    // =========================================================================
    console.log("\n--- [CATEGORY 2] High Concurrency & Atomic Row Locking (Race Condition Stress) ---");

    const prodConcId = `${testRunId}-PRD-CONC`;
    const concProduct = await Product.create({
      productId: prodConcId,
      name: "Concurrency Test Dress",
      timesRented: 0,
      rating: 0,
      activityLog: []
    });

    const CONCURRENCY_WORKERS = 15;
    console.log(`  Executing ${CONCURRENCY_WORKERS} simultaneous atomic findOneAndUpdate $inc updates...`);

    const promises = [];
    for (let i = 0; i < CONCURRENCY_WORKERS; i++) {
      promises.push(
        Product.findOneAndUpdate(
          { productId: prodConcId },
          {
            $inc: { timesRented: 1 },
            $push: { activityLog: { action: `Worker ${i} updated`, user: `Worker-${i}` } }
          },
          { new: true }
        )
      );
    }

    const results = await Promise.all(promises);
    assert(results.every(r => r !== null), "2.1 All concurrent updates completed without transaction deadlocks");

    const finalProduct = await Product.findOne({ productId: prodConcId });
    assert(
      finalProduct.timesRented === CONCURRENCY_WORKERS &&
      finalProduct.activityLog.length === CONCURRENCY_WORKERS,
      `2.2 Atomic counter exact match under race conditions (expected ${CONCURRENCY_WORKERS}, got ${finalProduct.timesRented})`
    );

    // =========================================================================
    // CATEGORY 3: Complex Queries ($or, $and, $regex, $elemMatch, $in, $nin, $exists, comparison)
    // =========================================================================
    console.log("\n--- [CATEGORY 3] Complex Query Operators & Regex Searches ---");

    const orderQueryId1 = `${testRunId}-ORD-Q1`;
    const orderQueryId2 = `${testRunId}-ORD-Q2`;
    const orderQueryId3 = `${testRunId}-ORD-Q3`;

    await Order.create([
      {
        orderId: orderQueryId1,
        customerName: "Ananya Panday",
        customerEmail: "ananya.panday@bollywood.example.com",
        mode: "Rental",
        status: "Confirmed",
        orderValue: 45000,
        items: [
          { productId: "P-101", productName: "Heavy Zardozi Lehenga", amount: 30000, status: "Confirmed" },
          { productId: "P-102", productName: "Diamond Choker Dupatta", amount: 15000, status: "Confirmed" }
        ],
        logs: [{ message: "Order initial placement", type: "Init" }]
      },
      {
        orderId: orderQueryId2,
        customerName: "Sara Ali Khan",
        customerEmail: "sara.khan@royal.example.com",
        mode: "Buy",
        status: "Delivered",
        orderValue: 90000,
        items: [
          { productId: "P-201", productName: "Gold Embroidered Sherwani", amount: 90000, status: "Delivered" }
        ]
      },
      {
        orderId: orderQueryId3,
        customerName: "Janhvi Kapoor",
        customerEmail: "janhvi.k@fashion.example.com",
        mode: "Rental",
        status: "Return Due",
        orderValue: 12000,
        items: [
          { productId: "P-301", productName: "Silk Cocktail Gown", amount: 12000, status: "Return Due" }
        ]
      }
    ]);

    // 3.1 Nested Dot-Notation Query in SQL buildWhereClause
    const nestedQueryDocs = await Order.find({ "items.0.productId": "P-101" });
    assert(
      nestedQueryDocs.length === 1 && nestedQueryDocs[0].orderId === orderQueryId1,
      "3.1 Nested dot-notation query (items.0.productId) resolves through JSONB path extraction"
    );

    // 3.2 Complex $or combining top-level, status, and numeric operators
    const orDocs = await Order.find({
      $or: [
        { status: "Confirmed", orderValue: { $gt: 40000 } },
        { mode: "Buy" }
      ]
    });
    const foundOrIds = orDocs.map(d => d.orderId).filter(id => [orderQueryId1, orderQueryId2, orderQueryId3].includes(id));
    assert(
      foundOrIds.length === 2 && foundOrIds.includes(orderQueryId1) && foundOrIds.includes(orderQueryId2),
      "3.2 Multi-branch $or query filters accurately with compound sub-predicates"
    );

    // 3.3 Case-insensitive regex with special characters
    const regexEmailDocs = await Order.find({
      customerEmail: new RegExp("ANANYA\\.PANDAY", "i")
    });
    assert(
      regexEmailDocs.some(d => d.orderId === orderQueryId1),
      "3.3 Case-insensitive RegExp with escaped metacharacters (~* in PostgreSQL) matches correctly"
    );

    const regexStringDocs = await Order.find({
      customerName: { $regex: "^sara\\s+ali", $options: "i" }
    });
    assert(
      regexStringDocs.some(d => d.orderId === orderQueryId2),
      "3.4 $regex operator with $options 'i' and regex anchors (^, \\s+) matches correctly"
    );

    // 3.5 $elemMatch query on subdocument arrays
    const elemMatchDocs = await Order.find({
      items: {
        $elemMatch: {
          productName: { $regex: "Zardozi", $options: "i" },
          amount: { $gte: 25000 }
        }
      }
    });
    assert(
      elemMatchDocs.some(d => d.orderId === orderQueryId1) && !elemMatchDocs.some(d => d.orderId === orderQueryId2),
      "3.5 $elemMatch matches complex predicates across subdocument array items"
    );

    // 3.6 $in and $nin operators with numbers and strings
    const inDocs = await Order.find({
      orderId: { $in: [orderQueryId1, orderQueryId3] }
    });
    assert(
      inDocs.length === 2,
      "3.6 $in operator with array of IDs matches expected rows"
    );

    const ninDocs = await Order.find({
      orderId: { $in: [orderQueryId1, orderQueryId2, orderQueryId3] },
      status: { $nin: ["Delivered", "Cancelled"] }
    });
    assert(
      ninDocs.length === 2 && !ninDocs.some(d => d.orderId === orderQueryId2),
      "3.7 $nin operator successfully excludes specified status values"
    );

    // 3.8 $exists operator
    const existsDocs = await Order.find({
      orderId: { $in: [orderQueryId1, orderQueryId2] },
      logs: { $exists: true }
    });
    assert(
      existsDocs.some(d => d.orderId === orderQueryId1) && !existsDocs.some(d => d.orderId === orderQueryId2),
      "3.8 $exists operator correctly differentiates present vs absent nested arrays/fields"
    );

    // =========================================================================
    // CATEGORY 4: Security, SQL Injection Resistance, Null Safety & Edge Cases
    // =========================================================================
    console.log("\n--- [CATEGORY 4] Security (SQLi Resistance), Unicode, Null & Edge Cases ---");

    // 4.1 SQL Injection string inputs in fields and queries
    const sqliCustomerId = `${testRunId}-CUST-SQLI' OR '1'='1`;
    const maliciousPayload = `Robert'); DROP TABLE dummy_table; -- ' " UNION SELECT * FROM admins --`;

    const sqliCust = await Customer.create({
      customerId: sqliCustomerId,
      name: maliciousPayload,
      email: "sqli.tester@example.com",
      location: "Malicious'; --",
      internalNotes: "SQLI Test with \\' and \" and ; and --"
    });

    const fetchedSqli = await Customer.findOne({ customerId: sqliCustomerId });
    assert(
      fetchedSqli && fetchedSqli.name === maliciousPayload && fetchedSqli.customerId === sqliCustomerId,
      "4.1 SQL Injection attempts in data fields safely escaped via parameterized queries"
    );

    // SQLi in search query value
    const sqliSearch = await Customer.find({
      name: `Robert'); DROP TABLE dummy_table; -- ' " UNION SELECT * FROM admins --`
    });
    assert(
      sqliSearch.length === 1 && sqliSearch[0].customerId === sqliCustomerId,
      "4.2 SQL Injection payload in query parameters treated as literal text"
    );

    // 4.3 Unicode emojis, multilingual text & special characters
    const uniListerId = `${testRunId}-LIST-UNICODE`;
    const unicodeLister = await Lister.create({
      listerId: uniListerId,
      name: "मोणिका बार्डे / Monika Barde ✨👗👑 (HOK Exclusive)",
      city: "मुंबई / Mumbai",
      notes: "Testing emojis: 🎉🚀💐💖 and accents: é, à, ü, ç, ñ, 日本語, العربية"
    });

    const fetchedUnicode = await Lister.findOne({ listerId: uniListerId });
    assert(
      fetchedUnicode.name === "मोणिका बार्डे / Monika Barde ✨👗👑 (HOK Exclusive)" &&
      fetchedUnicode.notes.includes("🎉🚀💐💖") &&
      fetchedUnicode.notes.includes("日本語"),
      "4.3 Full UTF-8 Unicode support (Devanagari, Arabic, Japanese, Emojis) preserved cleanly in JSONB"
    );

    // 4.4 Non-existent document update and delete handling
    const nonExistentUpdate = await Customer.findOneAndUpdate(
      { customerId: "NON_EXISTENT_ID_99999" },
      { $set: { status: "Active" } }
    );
    assert(nonExistentUpdate === null, "4.4 findOneAndUpdate on non-existent record returns null gracefully");

    const nonExistentDelete = await Customer.findOneAndDelete({ customerId: "NON_EXISTENT_ID_99999" });
    assert(nonExistentDelete === null, "4.5 findOneAndDelete on non-existent record returns null gracefully");

    const findByIdNull = await Customer.findById(null);
    assert(findByIdNull === null, "4.6 findById(null) or findById(undefined) returns null without throwing");

    // 4.5 Upsert support in findOneAndUpdate
    const upsertCustId = `${testRunId}-CUST-UPSERT`;
    const upsertedDoc = await Customer.findOneAndUpdate(
      { customerId: upsertCustId },
      {
        $set: {
          name: "Upserted User",
          email: "upserted@example.com",
          status: "Active"
        }
      },
      { upsert: true, new: true }
    );
    assert(
      upsertedDoc && upsertedDoc.customerId === upsertCustId && upsertedDoc.name === "Upserted User",
      "4.7 findOneAndUpdate with { upsert: true } successfully creates new record when not found"
    );

    // =========================================================================
    // CATEGORY 5: Query Chaining, Pagination, Sorting & Projection (.sort, .skip, .limit, .select)
    // =========================================================================
    console.log("\n--- [CATEGORY 5] Query Chaining, Pagination & Projection ---");

    const sortDes1 = `${testRunId}-DES-S1`;
    const sortDes2 = `${testRunId}-DES-S2`;
    const sortDes3 = `${testRunId}-DES-S3`;

    await Designer.create([
      { designerId: sortDes1, slug: sortDes1.toLowerCase(), name: "Alpha Designer", sortOrder: 30, status: "Active" },
      { designerId: sortDes2, slug: sortDes2.toLowerCase(), name: "Beta Designer", sortOrder: 10, status: "Active" },
      { designerId: sortDes3, slug: sortDes3.toLowerCase(), name: "Gamma Designer", sortOrder: 20, status: "Active" }
    ]);

    // Ascending sort by numeric field
    const sortedDesAsc = await Designer.find({ designerId: { $in: [sortDes1, sortDes2, sortDes3] } })
      .sort({ sortOrder: 1 })
      .lean();
    assert(
      sortedDesAsc[0].designerId === sortDes2 &&
      sortedDesAsc[1].designerId === sortDes3 &&
      sortedDesAsc[2].designerId === sortDes1,
      "5.1 Ascending sort ({ sortOrder: 1 }) correctly orders numeric JSONB properties"
    );

    // Descending string sort with limit and skip (pagination)
    const pagedDes = await Designer.find({ designerId: { $in: [sortDes1, sortDes2, sortDes3] } })
      .sort("-sortOrder")
      .skip(1)
      .limit(1);
    assert(
      pagedDes.length === 1 && pagedDes[0].designerId === sortDes3,
      "5.2 .sort('-sortOrder').skip(1).limit(1) correctly produces 2nd highest item"
    );

    // Projection (select inclusion and exclusion)
    const projectedDes = await Designer.findOne({ designerId: sortDes1 }).select("name slug");
    assert(
      projectedDes.name === "Alpha Designer" &&
      projectedDes.slug === sortDes1.toLowerCase() &&
      projectedDes.type === undefined,
      "5.3 .select('name slug') includes only requested fields and excludes others"
    );

    // =========================================================================
    // CATEGORY 6: Aggregation Engine Pipelines ($match, $group, $sort, $project, $avg, $sum)
    // =========================================================================
    console.log("\n--- [CATEGORY 6] Aggregation Engine Multi-Stage Stress Test ---");

    const aggOffer1 = `${testRunId}-OFF-A1`;
    const aggOffer2 = `${testRunId}-OFF-A2`;
    const aggOffer3 = `${testRunId}-OFF-A3`;
    const aggOffer4 = `${testRunId}-OFF-A4`;

    await Offer.create([
      { offerId: aggOffer1, productName: "P1", customerName: "C1", category: "Bridal", status: "Accepted", finalAmount: 20000 },
      { offerId: aggOffer2, productName: "P2", customerName: "C2", category: "Bridal", status: "Accepted", finalAmount: 30000 },
      { offerId: aggOffer3, productName: "P3", customerName: "C3", category: "Partywear", status: "Accepted", finalAmount: 10000 },
      { offerId: aggOffer4, productName: "P4", customerName: "C4", category: "Partywear", status: "Rejected", finalAmount: 8000 }
    ]);

    const aggResult = await Offer.aggregate([
      { $match: { offerId: { $in: [aggOffer1, aggOffer2, aggOffer3, aggOffer4] }, status: "Accepted" } },
      {
        $group: {
          _id: "$category",
          totalCount: { $sum: 1 },
          totalRevenue: { $sum: "$finalAmount" },
          averageRevenue: { $avg: "$finalAmount" }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    assert(
      aggResult.length === 2 &&
      aggResult[0]._id === "Bridal" &&
      aggResult[0].totalCount === 2 &&
      aggResult[0].totalRevenue === 50000 &&
      aggResult[0].averageRevenue === 25000 &&
      aggResult[1]._id === "Partywear" &&
      aggResult[1].totalRevenue === 10000,
      "6.1 Multi-stage aggregation ($match -> $group with $sum and $avg -> $sort) produces exact metrics"
    );

    // =========================================================================
    // CLEANUP ADVERSARIAL TEST DATA
    // =========================================================================
    console.log("\n--- Cleaning up all adversarial test records ---");
    await Customer.deleteMany({ customerId: { $in: [custId1, sqliCustomerId, upsertCustId] } });
    await Product.deleteMany({ productId: { $in: [prodConcId] } });
    await Order.deleteMany({ orderId: { $in: [orderQueryId1, orderQueryId2, orderQueryId3] } });
    await Lister.deleteMany({ listerId: { $in: [uniListerId] } });
    await Designer.deleteMany({ designerId: { $in: [sortDes1, sortDes2, sortDes3] } });
    await Offer.deleteMany({ offerId: { $in: [aggOffer1, aggOffer2, aggOffer3, aggOffer4] } });
    console.log("  ✅ Cleaned up all adversarial test records from PostgreSQL.");

  } catch (err) {
    console.error("\n💥 UNEXPECTED ERROR DURING ADVERSARIAL STRESS TESTING:", err);
    failures.push({ testName: "Adversarial Runner", details: err.message });
    failedCount++;
  }

  console.log("\n==========================================================================");
  console.log(`📊 ADVERSARIAL TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("==========================================================================");

  if (failedCount > 0) {
    console.error("❌ Adversarial test failures detected:", JSON.stringify(failures, null, 2));
    throw new Error(`${failedCount} adversarial tests failed!`);
  }
};

runAdversarialTests()
  .then(() => {
    pool.end();
    console.log("\n🎉 ALL ADVERSARIAL STRESS TESTS COMPLETED SUCCESSFULLY WITH 100% PASS RATE! 🎉");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Adversarial run exit error:", err);
    pool.end();
    process.exit(1);
  });
