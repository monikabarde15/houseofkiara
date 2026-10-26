import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";
import Submission from "../models/Submission.js";
import Lister from "../models/Lister.js";
import Product from "../models/Product.js";
import Designer from "../models/Designer.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadBuffer = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    Readable.from(buffer).pipe(stream);
  });

// Helper to populate real Lister details from DB
const enrichSubmissionWithLister = async (subObj) => {
  if (!subObj) return subObj;
  let item = subObj.toObject ? subObj.toObject() : subObj;
  if (item._data) item = { ...item._data, ...item };
  if (item.data) item = { ...item.data, ...item };

  const keys = [item.lister_id, item.listerId, item.listerID].filter(
    (k) => k && k !== "LST-GENERAL",
  );
  const listerKey = keys[0] || item.lister_id || item.listerId || item.listerID;
  if (listerKey) {
    try {
      const listerObj = await Lister.findOne({
        $or: [{ _id: listerKey }, { listerId: listerKey }, { id: listerKey }],
      });
      if (listerObj) {
        const rawLister =
          listerObj._data ||
          (listerObj.toObject ? listerObj.toObject() : listerObj);
        item.listerName = item.listerName || rawLister.name;
        item.listerPhone = item.listerPhone || rawLister.phone || item.phone;
        item.listerEmail = item.listerEmail || rawLister.email || item.email;
        item.email = item.email || rawLister.email || "";
        item.phone = item.phone || rawLister.phone || "";
        if (!item.city || item.city === "—")
          item.city = rawLister.city || rawLister.pickup?.city || "";
      }
    } catch (e) {
      // ignore
    }
  }
  return item;
};

// Get submissions (with full search, status, intent, channel filters)
export const getSubmissions = async (req, res) => {
  try {
    const { listerId, search, status, intent, channel, view, dateFrom, dateTo } =
      req.query || {};

    const rawSubmissions = await Submission.find({});
    let submissions = await Promise.all(
      rawSubmissions.map(enrichSubmissionWithLister),
    );

    // Sort by createdAt / submittedAt descending
    submissions.sort((a, b) => {
      const tA = new Date(a.submittedAt || a.createdAt || a.submitted || 0).getTime();
      const tB = new Date(b.submittedAt || b.createdAt || b.submitted || 0).getTime();
      return tB - tA;
    });

    if (listerId) {
      const decoded = decodeURIComponent(listerId).toLowerCase().trim();
      submissions = submissions.filter((s) => {
        const sListerId = String(s.listerId || s.listerID || s.lister_id || "").toLowerCase();
        const sListerName = String(s.listerName || "").toLowerCase();
        return sListerId === decoded || sListerName === decoded;
      });
    }

    if (status && status !== "All Statuses" && status !== "All") {
      submissions = submissions.filter((s) => {
        const decWhat = s.decision?.what;
        if (status === "Approved") return decWhat === "Approved";
        if (status === "Rejected") return decWhat === "Rejected";
        if (status === "Withdrawn") return decWhat === "Withdrawn";
        if (status === "Expired") return decWhat === "Expired";
        if (status === "Awaiting Reply") return !!s.moreInfo;
        if (status === "New") return !s.decision && !s.moreInfo && !s.replyAt;
        if (status === "In Review")
          return !s.decision && (!!s.replyAt || (!s.moreInfo && !s.decision));
        return s.status === status || decWhat === status;
      });
    }

    if (view) {
      if (view === "review") {
        submissions = submissions.filter((s) => !s.decision && !s.moreInfo);
      } else if (view === "reply") {
        submissions = submissions.filter((s) => !!s.moreInfo);
      } else if (view === "apprmonth") {
        submissions = submissions.filter((s) => s.decision?.what === "Approved");
      }
    }

    if (intent && intent !== "All Intent" && intent !== "All") {
      const normIntent = intent.toLowerCase();
      submissions = submissions.filter((s) =>
        String(s.intent || "").toLowerCase().includes(normIntent),
      );
    }

    if (channel && channel !== "All Channels" && channel !== "All") {
      const normChannel = channel.toLowerCase();
      submissions = submissions.filter((s) =>
        String(s.channel || "").toLowerCase().includes(normChannel),
      );
    }

    if (search && search.trim()) {
      const sTerm = search.trim().toLowerCase();
      submissions = submissions.filter((s) => {
        return (
          String(s.subid || "").toLowerCase().includes(sTerm) ||
          String(s.piece || "").toLowerCase().includes(sTerm) ||
          String(s.listerName || "").toLowerCase().includes(sTerm) ||
          String(s.designer || "").toLowerCase().includes(sTerm) ||
          String(s.channel || "").toLowerCase().includes(sTerm) ||
          String(s.category || "").toLowerCase().includes(sTerm) ||
          String(s.phone || "").toLowerCase().includes(sTerm) ||
          String(s.listerPhone || "").toLowerCase().includes(sTerm) ||
          String(s.email || "").toLowerCase().includes(sTerm)
        );
      });
    }

    res.json({ data: submissions, total: submissions.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single submission by subid or _id
export const getSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const rawSubmission = await Submission.findOne({
      $or: [{ subid: id }, { _id: id }],
    });
    if (!rawSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    const submission = await enrichSubmissionWithLister(rawSubmission);
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logListerActivity = async (listerId, color, text) => {
  if (!listerId) return;
  try {
    const lister = await Lister.findOne({
      $or: [{ listerId: listerId }, { _id: listerId }],
    });
    if (lister) {
      const entry = { c: color, e: text, t: new Date().toISOString() };
      lister.activities = [entry, ...(lister.activities || [])];
      await lister.save();
    }
  } catch (err) {
    console.error("Failed to log lister activity:", err);
  }
};

// Create a new submission
export const createSubmission = async (req, res) => {
  try {
    const submissionData = req.body;

    // Map frontend wizard fields to backend schema
    if (submissionData.year_purchased && !submissionData.yearOfPurchase) {
      submissionData.yearOfPurchase = submissionData.year_purchased;
    }
    if (submissionData.full_name && !submissionData.listerName) {
      submissionData.listerName = submissionData.full_name;
    }
    if (submissionData.mobile && !submissionData.phone) {
      submissionData.phone = submissionData.mobile;
      submissionData.listerPhone = submissionData.mobile;
    }
    if (submissionData.email && !submissionData.listerEmail) {
      submissionData.listerEmail = submissionData.email;
    }
    submissionData.customerId =
      req.user?.customerId || req.body.customerId || submissionData.customerId || null;
    submissionData.customer_id =
      req.user?._id || req.body.customer_id || submissionData.customer_id || null;

    if (submissionData.piece_name && !submissionData.piece) {
      submissionData.piece = submissionData.piece_name;
    }
    if (submissionData.original_price && !submissionData.originalPrice) {
      submissionData.originalPrice = submissionData.original_price;
    }
    if (submissionData.condition && !submissionData.selfGrade) {
      submissionData.selfGrade = submissionData.condition;
    }
    if (submissionData.condition && !submissionData.conditionClaim) {
      submissionData.conditionClaim =
        submissionData.condition === "pristine"
          ? "Pristine - Unworn or worn once for fittings only"
          : submissionData.condition === "excellent"
            ? "Excellent - Worn once for an event, no visible flaws"
            : submissionData.condition === "good"
              ? "Good - Worn 2–3 times, minor wear"
              : submissionData.condition;
    }
    if (submissionData.times_worn && !submissionData.timesWorn) {
      submissionData.timesWorn = submissionData.times_worn;
    }
    if (submissionData.colour_family && !submissionData.colour) {
      submissionData.colour = submissionData.colour_family;
    }
    if (submissionData.color && !submissionData.colour) {
      submissionData.colour = submissionData.color;
    }
    if (submissionData.piece_type && !submissionData.category) {
      submissionData.category = submissionData.piece_type;
    }
    if (submissionData.outcome && !submissionData.intent) {
      submissionData.intent =
        submissionData.outcome === "rent"
          ? "Rent it"
          : submissionData.outcome === "sell"
            ? "Sell it"
            : "Open to both";
    }

    if (!submissionData.piece) {
      submissionData.piece = submissionData.designer
        ? `${submissionData.designer} ${submissionData.category || "Piece"}`
        : (submissionData.category || "Designer Piece");
    }

    if (!submissionData.category) {
      submissionData.category = "Bridal Lehenga";
    }

    if (!submissionData.designer) {
      submissionData.designer = "Designer Atelier";
    }

    if (!submissionData.subid) {
      submissionData.subid = `SUB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    }

    // Process uploaded photos locally immediately (< 20ms) for ultra-fast API response
    let media = [];
    const filesToUploadToCloudinary = [];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const rootUploadsDir = path.resolve(__dirname, "../../../public/uploads");
      if (!fs.existsSync(rootUploadsDir)) {
        fs.mkdirSync(rootUploadsDir, { recursive: true });
      }

      for (let idx = 0; idx < req.files.length; idx++) {
        const file = req.files[idx];
        const ext = path.extname(file.originalname || "") || ".jpg";
        const filename = `sub_${Date.now()}_${idx}${ext}`;
        const localPath = path.join(rootUploadsDir, filename);

        try {
          await fs.promises.writeFile(localPath, file.buffer);
          const localUrl = `/uploads/${filename}`;
          const photoObj = {
            name: file.originalname || `Photo ${idx + 1}`,
            url: localUrl,
            kind: "image",
          };
          media.push(photoObj);

          if (
            process.env.CLOUD_NAME &&
            process.env.CLOUD_API_KEY &&
            process.env.CLOUD_API_SECRET
          ) {
            filesToUploadToCloudinary.push({
              buffer: file.buffer,
              idx,
              name: photoObj.name,
              localUrl,
            });
          }
        } catch (fErr) {
          console.error("Error saving local file for submission:", fErr);
        }
      }
    }

    if (media.length > 0) {
      submissionData.media = media;
      submissionData.photos = media.length;
    } else if (!submissionData.photos) {
      submissionData.photos = 0;
    }

    // Expectations
    const origNum =
      parseFloat(String(submissionData.originalPrice || "").replace(/[^0-9.-]+/g, "")) || 0;
    if (
      !submissionData.askRent &&
      (submissionData.intent === "Rent it" || submissionData.intent === "Open to both")
    ) {
      submissionData.askRent = `₹${Math.round(origNum * 0.2).toLocaleString("en-IN")}`;
    }
    if (
      !submissionData.askSell &&
      (submissionData.intent === "Sell it" || submissionData.intent === "Open to both")
    ) {
      submissionData.askSell = `₹${Math.round(origNum * 0.6).toLocaleString("en-IN")}`;
    }
    submissionData.expectation = {
      rent: submissionData.askRent || null,
      sell: submissionData.askSell || null,
    };

    if (!submissionData.channel) {
      submissionData.channel = "Website";
    }
    if (!submissionData.submitted) {
      submissionData.submitted = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    if (!submissionData.submittedAt) {
      submissionData.submittedAt = new Date().toISOString();
    }
    if (!submissionData.status) {
      submissionData.status = "Pending";
    }
    if (!submissionData.assignedTo) {
      submissionData.assignedTo = "Soumya";
    }
    submissionData.terms = {
      version: "LST-2026-01",
      acceptedAt: new Date().toISOString(),
      ownership: true,
    };

    // Lister matching & auto-creation
    let listerObj = null;
    const allListers = await Lister.find({});
    const incomingListerId =
      submissionData.listerId || submissionData.listerID || submissionData.lister_id;
    if (incomingListerId && incomingListerId !== "LST-GENERAL") {
      listerObj = allListers.find(
        (l) =>
          l.listerId === incomingListerId ||
          l._id?.toString() === incomingListerId ||
          l.id === incomingListerId,
      );
    }

    if (
      !listerObj &&
      (submissionData.phone || submissionData.email || submissionData.listerName)
    ) {
      const normPhone = (submissionData.phone || "").replace(/[^0-9]/g, "");
      const normEmail = (submissionData.email || "").toLowerCase().trim();
      const normName = (submissionData.listerName || "").toLowerCase().trim();

      listerObj = allListers.find((l) => {
        const lPhone = (l.phone || "").replace(/[^0-9]/g, "");
        const lEmail = (l.email || "").toLowerCase().trim();
        const lName = (l.name || "").toLowerCase().trim();
        return (
          (normPhone &&
            lPhone &&
            (lPhone.endsWith(normPhone) || normPhone.endsWith(lPhone))) ||
          (normEmail && lEmail && lEmail === normEmail) ||
          (normName && lName && lName === normName)
        );
      });
    }

    if (!listerObj && (submissionData.listerName || submissionData.full_name)) {
      const name = submissionData.listerName || submissionData.full_name;
      const baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const newListerId = baseSlug || `lister-${Date.now()}`;
      try {
        listerObj = await Lister.create({
          listerId: newListerId,
          name: name,
          email: submissionData.email || null,
          phone: submissionData.phone || null,
          city: submissionData.city || "",
          source: "Website (List Your Piece)",
          joined: new Date().toISOString(),
          status: "Verified",
          verified: true,
        });
      } catch (e) {
        console.error("Error creating lister for submission:", e);
      }
    }

    const finalListerId =
      listerObj ? listerObj.listerId : incomingListerId || "ananya-sharma";
    submissionData.listerId = finalListerId;
    submissionData.listerID = finalListerId;
    submissionData.lister_id = finalListerId;
    if (listerObj) {
      submissionData.listerName = listerObj.name;
      submissionData.listerPhone = listerObj.phone || submissionData.phone;
      submissionData.listerEmail = listerObj.email || submissionData.email;
      if (!submissionData.city) submissionData.city = listerObj.city;
    }

    // Auto-create product draft if not existing
    if (submissionData.piece && submissionData.designer) {
      try {
        const allProducts = await Product.find({});
        const existingProduct = allProducts.find((p) => {
          const pName = (p.name || p.data?.name || p.data?.title || "").toLowerCase();
          const pDes = (p.designer || p.data?.designer || "").toLowerCase();
          return (
            pName === submissionData.piece.toLowerCase() &&
            pDes === submissionData.designer.toLowerCase()
          );
        });

        let productId = existingProduct
          ? existingProduct.sku || existingProduct.id || existingProduct.productId
          : null;

        if (!existingProduct) {
          const draftSku = `HOK-PRD-${Date.now()}`;
          const newProduct = {
            productId: draftSku,
            sku: draftSku,
            status: "Draft",
            listerId: finalListerId,
            name: submissionData.piece,
            designer: submissionData.designer,
            category: submissionData.category,
            color: submissionData.colour,
            sizes: submissionData.size ? [submissionData.size] : [],
            originalRetailPrice: origNum || undefined,
            rentalPrice:
              parseFloat(submissionData.askRent?.replace(/[^0-9.-]+/g, "")) ||
              undefined,
            listingPrice:
              parseFloat(submissionData.askSell?.replace(/[^0-9.-]+/g, "")) ||
              undefined,
            condition: submissionData.conditionClaim,
            images: (submissionData.media || []).map((m) => m.url).filter(Boolean),
            data: {
              name: submissionData.piece,
              designer: submissionData.designer,
            },
          };
          await Product.create(newProduct);
          productId = draftSku;
        }

        submissionData.sku = productId;
      } catch (err) {
        console.error("Error auto-creating product:", err);
      }
    }

    // Auto-create Designer if it doesn't exist
    if (submissionData.designer) {
      try {
        const designerSlug = submissionData.designer
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-");
        const existingDesigners = await Designer.find({});
        const existing = existingDesigners.find(
          (d) =>
            (d.name &&
              d.name.toLowerCase() === submissionData.designer.toLowerCase()) ||
            (d.slug && d.slug === designerSlug) ||
            (d.designerId &&
              d.designerId.toLowerCase() ===
                submissionData.designer.toLowerCase()),
        );

        if (!existing) {
          await Designer.create({
            designerId: `DES-${Date.now()}`,
            name: submissionData.designer,
            slug: designerSlug,
            type: "Indie Designer",
            status: "Active",
            joinedAt: new Date().toISOString().split("T")[0],
            isNewToHOK: true,
            isFeatured: false,
            livePieces: 0,
            totalPieces: 1,
          });
        } else {
          existing.totalPieces = (existing.totalPieces || 0) + 1;
          await existing.save();
        }
      } catch (err) {
        console.error("Error auto-creating designer:", err);
      }
    }

    const submission = new Submission(submissionData);
    const saved = await submission.save();

    await logListerActivity(
      saved.listerId,
      "blue",
      `Submitted a new piece: "${saved.piece}"`,
    );

    // Non-blocking background upload to Cloudinary if configured
    if (filesToUploadToCloudinary.length > 0) {
      (async () => {
        try {
          const cloudMedia = [];
          for (const item of filesToUploadToCloudinary) {
            try {
              const uploadResult = await uploadBuffer(item.buffer, {
                folder: "submissions/image",
                resource_type: "image",
                use_filename: true,
                unique_filename: true,
                overwrite: false,
              });
              cloudMedia.push({
                name: item.name,
                url: uploadResult.secure_url || uploadResult.url,
                kind: "image",
              });
            } catch (uErr) {
              console.error("Cloudinary background upload error:", uErr?.message);
              cloudMedia.push({
                name: item.name,
                url: item.localUrl,
                kind: "image",
              });
            }
          }
          if (cloudMedia.length > 0) {
            await Submission.updateOne(
              { _id: saved._id },
              { $set: { media: cloudMedia } },
            );
            console.log(`Cloudinary background upload complete for submission ${saved.subid}`);
          }
        } catch (bgErr) {
          console.error("Background Cloudinary process failed:", bgErr?.message);
        }
      })();
    }

    const enriched = await enrichSubmissionWithLister(saved);
    return res.status(201).json({
      success: true,
      message: "Piece save ho gaya hai, submit ho gaya!",
      ...enriched,
    });
  } catch (err) {
    console.error("Error in createSubmission:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update submission
export const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    const updated = await Submission.findOneAndUpdate(
      { $or: [{ subid: id }, { _id: id }] },
      updateData,
      { new: true },
    );
    if (!updated)
      return res.status(404).json({ message: "Submission not found" });

    await logListerActivity(
      updated.listerId,
      "muted",
      `Updated submission details for "${updated.piece}"`,
    );

    const enriched = await enrichSubmissionWithLister(updated);
    res.json(enriched);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Actions (approve, reject, withdraw, requestMoreInfo)
export const updateSubmissionDecision = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision } = req.body;
    const updated = await Submission.findOneAndUpdate(
      { $or: [{ subid: id }, { _id: id }] },
      { $set: { decision: decision, moreInfo: null } },
      { new: true },
    );
    if (!updated)
      return res.status(404).json({ message: "Submission not found" });

    let color = "muted";
    if (decision === "Approved") color = "green";
    if (decision === "Rejected") color = "red";
    if (decision === "Withdrawn") color = "orange";
    await logListerActivity(
      updated.listerId,
      color,
      `Submission decision set to "${decision}" for "${updated.piece}"`,
    );

    const enriched = await enrichSubmissionWithLister(updated);
    res.json(enriched);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const requestMoreInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { infoRequired, deadline, requestedBy, comment } = req.body;
    const sub = await Submission.findOne({ $or: [{ subid: id }, { _id: id }] });
    if (!sub) return res.status(404).json({ message: "Submission not found" });
    const infoPayload = {
      requestedAt: new Date().toISOString(),
      requestedBy: requestedBy || "System",
      infoRequired,
      deadline,
      comment,
    };
    sub.moreInfo = infoPayload;
    sub.status = "Action Required";
    await sub.save();

    await logListerActivity(
      sub.listerId,
      "orange",
      `Requested more info on submission "${sub.piece}": ${infoRequired}`,
    );

    res.json({
      data: await enrichSubmissionWithLister(sub),
      message: "More info requested successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAssignees = async (req, res) => {
  try {
    const assignees = await Submission.distinct("assignedTo");
    const validAssignees = assignees.filter(
      (a) => a != null && a.trim() !== "" && a !== "Unassigned",
    );

    // Add default LYP assignees if they aren't already in the DB
    if (!validAssignees.includes("Soumya")) validAssignees.push("Soumya");
    if (!validAssignees.includes("Operations Team"))
      validAssignees.push("Operations Team");

    res.json({ data: validAssignees });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
