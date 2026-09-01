import { Parser } from "json2csv";
import Offer from "../models/Offer.js";
import { validateOffer } from "../validations/offerValidation.js";

// ===============================
// Create Offer
// POST /api/offers
// ===============================
export const createOffer = async (req, res) => {
  try {
    // Validate Request
    const { error } = validateOffer(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const {
      enquiryId,
      productId,
      productName,
      category,
      customerName,
      customerEmail,
      customerPhone,
      customerCity,
      customerState,
      quantity,
      originalAmount,
      offeredAmount,
      discount,
      currency,
      assignedTo,
      expiresAt,
      notes,
    } = req.body;

    // Generate Unique Offer ID
    const offerId = `OFF-${Date.now()}`;

    const offer = await Offer.create({
      offerId,
      enquiryId,
      productId,
      productName,
      category,
      customerName,
      customerEmail,
      customerPhone,
      customerCity,
      customerState,
      quantity,
      originalAmount,
      offeredAmount,
      finalAmount: offeredAmount,
      discount,
      currency,
      assignedTo,
      expiresAt,

      status: "Pending",
      negotiationStatus: "Not Started",

      notes: notes
        ? [
            {
              message: notes,
              createdBy: "Admin",
              createdAt: new Date(),
            },
          ]
        : [],

      timeline: [
        {
          action: "Offer Created",
          remarks: "Offer created successfully.",
          user: "Admin",
          createdAt: new Date(),
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Offer created successfully.",
      data: offer,
    });
  } catch (err) {
    console.error("Create Offer Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Get All Offers
// GET /api/offers
// =======================================

export const getOffers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      customer,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {};

    // Search
    if (search) {
      filter.$or = [
        { offerId: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
      ];
    }

    // Status Filter
    if (status) {
      filter.status = status;
    }

    // Customer Filter
    if (customer) {
      filter.customerName = {
        $regex: customer,
        $options: "i",
      };
    }

    const total = await Offer.countDocuments(filter);

    const offers = await Offer.find(filter)
      .sort({
        [sortBy]: order === "asc" ? 1 : -1,
      })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      message: "Offers fetched successfully.",

      pagination: {
        currentPage: Number(page),
        perPage: Number(limit),
        totalRecords: total,
        totalPages: Math.ceil(total / limit),
      },

      data: offers,
    });
  } catch (err) {
    console.error("Get Offers Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Get Single Offer
// GET /api/offers/:id
// =======================================

export const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer fetched successfully.",
      data: offer,
    });

  } catch (err) {

    console.error("Get Offer Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });

  }
};

// =======================================
// Update Offer
// PUT /api/offers/:id
// =======================================

export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    // Validate Request
    const { error } = validateOffer(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    // Update Fields
    offer.enquiryId = req.body.enquiryId ?? offer.enquiryId;
    offer.productId = req.body.productId ?? offer.productId;
    offer.productName = req.body.productName ?? offer.productName;
    offer.category = req.body.category ?? offer.category;

    offer.customerName = req.body.customerName ?? offer.customerName;
    offer.customerEmail = req.body.customerEmail ?? offer.customerEmail;
    offer.customerPhone = req.body.customerPhone ?? offer.customerPhone;
    offer.customerCity = req.body.customerCity ?? offer.customerCity;
    offer.customerState = req.body.customerState ?? offer.customerState;

    offer.quantity = req.body.quantity ?? offer.quantity;

    offer.originalAmount =
      req.body.originalAmount ?? offer.originalAmount;

    offer.offeredAmount =
      req.body.offeredAmount ?? offer.offeredAmount;

    offer.discount =
      req.body.discount ?? offer.discount;

    offer.finalAmount =
      req.body.finalAmount ?? offer.finalAmount;

    offer.currency =
      req.body.currency ?? offer.currency;

    offer.assignedTo =
      req.body.assignedTo ?? offer.assignedTo;

    offer.expiresAt =
      req.body.expiresAt ?? offer.expiresAt;

    offer.updatedAt = new Date();

    // Timeline
    offer.timeline.push({
      action: "Offer Updated",
      remarks: "Offer details updated successfully.",
      user: "Admin",
      createdAt: new Date(),
    });

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Offer updated successfully.",
      data: offer,
    });

  } catch (err) {

    console.error("Update Offer Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });

  }
};
// =======================================
// Delete Offer (Soft Delete)
// DELETE /api/offers/:id
// =======================================

export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    // Already Deleted
    if (offer.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Offer already deleted.",
      });
    }

    // Soft Delete
    offer.isDeleted = true;
    offer.updatedAt = new Date();

    // Timeline Entry
    offer.timeline.push({
      action: "Offer Deleted",
      remarks: "Offer deleted successfully.",
      user: "Admin",
      createdAt: new Date(),
    });

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Offer deleted successfully.",
    });

  } catch (err) {

    console.error("Delete Offer Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });

  }
};

// =======================================
// Permanent Delete Offer
// DELETE /api/offers/:id/permanent
// =======================================

export const permanentDeleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    await Offer.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Offer permanently deleted successfully.",
    });

  } catch (err) {
    console.error("Permanent Delete Offer Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Update Offer Status
// PATCH /api/offers/:id/status
// =======================================

export const updateOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, updatedBy } = req.body;

    // Allowed Status
    const allowedStatus = [
      "Pending",
      "Accepted",
      "Rejected",
      "Counter Offered",
      "Expired",
      "Assigned",
      "Completed",
    ];

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Status.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    const oldStatus = offer.status;

    offer.status = status;
    offer.updatedAt = new Date();

    // Timeline Entry
    offer.timeline.push({
      action: "Status Updated",
      remarks:
        remarks ||
        `Offer status changed from ${oldStatus} to ${status}`,
      user: updatedBy || "Admin",
      createdAt: new Date(),
    });

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Offer status updated successfully.",
      data: offer,
    });
  } catch (err) {
    console.error("Update Status Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Send Counter Offer
// POST /api/offers/:id/counter-offer
// =======================================

export const sendCounterOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      amount,
      discount,
      remarks,
      expiryDate,
      sentBy,
    } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Counter offer amount is required.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    // Counter Offer Object
    const counterOffer = {
      amount,
      discount: discount || 0,
      message: remarks || "",
      sentBy: sentBy || "Admin",
      sentAt: new Date(),
      expiryDate: expiryDate || null,
    };

    // Save Counter Offer
    offer.counterOffers.push(counterOffer);

    // Update Offer Amount
    offer.offeredAmount = amount;
    offer.finalAmount = amount;
    offer.discount = discount || 0;

    // Update Status
    offer.status = "Counter Offered";

    // Timeline
    offer.timeline.push({
      action: "Counter Offer Sent",
      remarks:
        remarks ||
        `Counter Offer ₹${amount} has been sent.`,
      user: sentBy || "Admin",
      createdAt: new Date(),
    });

    offer.updatedAt = new Date();

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Counter offer sent successfully.",
      data: offer,
    });

  } catch (err) {

    console.error("Counter Offer Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });

  }
};

// =======================================
// Assign Offer
// POST /api/offers/:id/assign
// =======================================

export const assignOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      assignedTo,
      assignedBy,
      remarks,
    } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Assigned user is required.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    offer.assignedTo = assignedTo;
    offer.assignedBy = assignedBy || "Admin";
    offer.assignedAt = new Date();

    offer.status = "Assigned";

    // Assignment History
    if (!offer.assignmentHistory) {
      offer.assignmentHistory = [];
    }

    offer.assignmentHistory.push({
      assignedTo,
      assignedBy: assignedBy || "Admin",
      assignedAt: new Date(),
      remarks: remarks || "",
    });

    // Timeline
    offer.timeline.push({
      action: "Offer Assigned",
      remarks:
        remarks ||
        `Offer assigned to ${assignedTo}`,
      user: assignedBy || "Admin",
      createdAt: new Date(),
    });

    offer.updatedAt = new Date();

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Offer assigned successfully.",
      data: offer,
    });

  } catch (err) {

    console.error("Assign Offer Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });

  }
};

// =======================================
// Add Offer Note
// POST /api/offers/:id/notes
// =======================================

export const addOfferNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, createdBy } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Note message is required.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    const note = {
      message,
      createdBy: createdBy || "Admin",
      createdAt: new Date(),
    };

    offer.notes.push(note);

    offer.timeline.push({
      action: "Note Added",
      remarks: message,
      user: createdBy || "Admin",
      createdAt: new Date(),
    });

    offer.updatedAt = new Date();

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Note added successfully.",
      data: note,
    });

  } catch (err) {

    console.error("Add Note Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });

  }
};

// =======================================
// Get Offer Notes
// GET /api/offers/:id/notes
// =======================================

export const getOfferNotes = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id).select(
      "offerId customerName notes"
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer notes fetched successfully.",
      totalNotes: offer.notes.length,
      data: offer.notes.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    });

  } catch (err) {

    console.error("Get Offer Notes Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });

  }
};
// =======================================
// Get Offer Timeline
// GET /api/offers/:id/timeline
// =======================================

export const getOfferTimeline = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id).select(
      "offerId customerName timeline"
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    const timeline = offer.timeline.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.status(200).json({
      success: true,
      message: "Offer timeline fetched successfully.",
      totalActivities: timeline.length,
      data: timeline,
    });

  } catch (err) {

    console.error("Get Timeline Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });

  }
};
// =======================================
// Get Assignment History
// GET /api/offers/:id/assignment-history
// =======================================

export const getAssignmentHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id).select(
      "offerId customerName assignmentHistory"
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    const history = offer.assignmentHistory.sort(
      (a, b) => new Date(b.assignedAt) - new Date(a.assignedAt)
    );

    return res.status(200).json({
      success: true,
      message: "Assignment history fetched successfully.",
      totalAssignments: history.length,
      data: history,
    });

  } catch (err) {

    console.error("Assignment History Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });

  }
};
// =======================================
// Get Counter Offer History
// GET /api/offers/:id/counter-offers
// =======================================

export const getCounterOfferHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id).select(
      "offerId customerName productName counterOffers"
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    const history = [...offer.counterOffers].sort(
      (a, b) => new Date(b.sentAt) - new Date(a.sentAt)
    );

    return res.status(200).json({
      success: true,
      message: "Counter offer history fetched successfully.",
      totalCounterOffers: history.length,
      data: history,
    });

  } catch (err) {

    console.error("Counter Offer History Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });

  }
};
// =======================================
// Restore Offer
// PATCH /api/offers/:id/restore
// =======================================

export const restoreOffer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    if (!offer.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Offer is already active.",
      });
    }

    offer.isDeleted = false;
    offer.deletedAt = null;
    offer.deletedBy = null;
    offer.updatedAt = new Date();

    offer.timeline.push({
      action: "Offer Restored",
      remarks: "Offer restored successfully.",
      user: "Admin",
      createdAt: new Date(),
    });

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Offer restored successfully.",
      data: offer,
    });

  } catch (err) {

    console.error("Restore Offer Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });

  }
};
// =======================================
// Get Deleted Offers (Trash)
// GET /api/offers/trash
// =======================================

export const getDeletedOffers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "deletedAt",
      order = "desc",
    } = req.query;

    const filter = {
      isDeleted: true,
    };

    // Search
    if (search) {
      filter.$or = [
        {
          offerId: {
            $regex: search,
            $options: "i",
          },
        },
        {
          customerName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          customerEmail: {
            $regex: search,
            $options: "i",
          },
        },
        {
          customerPhone: {
            $regex: search,
            $options: "i",
          },
        },
        {
          productName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await Offer.countDocuments(filter);

    const offers = await Offer.find(filter)
      .sort({
        [sortBy]: order === "asc" ? 1 : -1,
      })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      message: "Deleted offers fetched successfully.",

      pagination: {
        currentPage: Number(page),
        perPage: Number(limit),
        totalRecords: total,
        totalPages: Math.ceil(total / limit),
      },

      data: offers,
    });

  } catch (err) {

    console.error("Trash API Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });

  }
};
// =======================================
// Bulk Delete Offers
// DELETE /api/offers/bulk-delete
// =======================================

export const bulkDeleteOffers = async (req, res) => {
  try {
    const { offerIds, deletedBy } = req.body;

    if (!offerIds || !Array.isArray(offerIds)) {
      return res.status(400).json({
        success: false,
        message: "offerIds array is required.",
      });
    }

    if (offerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one offer.",
      });
    }

    const result = await Offer.updateMany(
      {
        _id: { $in: offerIds },
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          deletedBy: deletedBy || "Admin",
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    // Add Timeline Entry
    const offers = await Offer.find({
      _id: { $in: offerIds },
    });

    for (const offer of offers) {
      offer.timeline.push({
        action: "Bulk Deleted",
        remarks: "Offer deleted using bulk action.",
        user: deletedBy || "Admin",
        createdAt: new Date(),
      });

      await offer.save();
    }

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} offers deleted successfully.`,
      modifiedCount: result.modifiedCount,
    });

  } catch (err) {

    console.error("Bulk Delete Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });

  }
};
// =======================================
// Dashboard Summary
// GET /api/offers/dashboard
// =======================================

export const getOfferDashboard = async (req, res) => {
  try {

    const [
      totalOffers,
      pendingOffers,
      acceptedOffers,
      rejectedOffers,
      counterOffers,
      assignedOffers,
      completedOffers,
      expiredOffers,
      deletedOffers,
      activeOffers
    ] = await Promise.all([

      Offer.countDocuments({
        isDeleted: false
      }),

      Offer.countDocuments({
        status: "Pending",
        isDeleted: false
      }),

      Offer.countDocuments({
        status: "Accepted",
        isDeleted: false
      }),

      Offer.countDocuments({
        status: "Rejected",
        isDeleted: false
      }),

      Offer.countDocuments({
        status: "Counter Offered",
        isDeleted: false
      }),

      Offer.countDocuments({
        status: "Assigned",
        isDeleted: false
      }),

      Offer.countDocuments({
        status: "Completed",
        isDeleted: false
      }),

      Offer.countDocuments({
        status: "Expired",
        isDeleted: false
      }),

      Offer.countDocuments({
        isDeleted: true
      }),

      Offer.countDocuments({
        isActive: true,
        isDeleted: false
      })

    ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully.",

      data: {

        totalOffers,

        activeOffers,

        pendingOffers,

        acceptedOffers,

        rejectedOffers,

        counterOffers,

        assignedOffers,

        completedOffers,

        expiredOffers,

        deletedOffers

      }

    });

  } catch (err) {

    console.error("Dashboard Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });

  }
};
// =======================================
// Get Recent Offers
// GET /api/offers/recent
// =======================================

export const getRecentOffers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const offers = await Offer.find({
      isDeleted: false,
    })
      .select(
        "offerId customerName customerEmail customerPhone productName offeredAmount status assignedTo createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      message: "Recent offers fetched successfully.",
      total: offers.length,
      data: offers,
    });

  } catch (err) {

    console.error("Recent Offers Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });

  }
};
// =======================================
// Offer Statistics
// GET /api/offers/statistics
// =======================================

export const getOfferStatistics = async (req, res) => {
  try {

    // Monthly Statistics
    const monthlyStatistics = await Offer.aggregate([
      {
        $match: {
          isDeleted: false
        }
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt"
            },
            month: {
              $month: "$createdAt"
            }
          },

          totalOffers: {
            $sum: 1
          },

          totalRevenue: {
            $sum: "$finalAmount"
          }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // Status Statistics
    const statusStatistics = await Offer.aggregate([
      {
        $match: {
          isDeleted: false
        }
      },
      {
        $group: {
          _id: "$status",
          total: {
            $sum: 1
          }
        }
      }
    ]);

    // Overall Revenue
    const revenue = await Offer.aggregate([
      {
        $match: {
          isDeleted: false,
          status: "Accepted"
        }
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$finalAmount"
          }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      message: "Offer statistics fetched successfully.",

      data: {
        monthlyStatistics,
        statusStatistics,
        totalRevenue: revenue.length
          ? revenue[0].revenue
          : 0
      }

    });

  } catch (err) {

    console.error("Statistics Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });

  }
};
// =======================================
// Duplicate Offer
// POST /api/offers/:id/duplicate
// =======================================

export const duplicateOffer = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID."
      });
    }

    const existingOffer = await Offer.findById(id);

    if (!existingOffer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found."
      });
    }

    const newOffer = existingOffer.toObject();

    delete newOffer._id;

    newOffer.offerId = `OFF-${Date.now()}`;

    newOffer.status = "Pending";

    newOffer.negotiationStatus = "Not Started";

    newOffer.counterOffers = [];

    newOffer.notes = [];

    newOffer.assignmentHistory = [];

    newOffer.timeline = [
      {
        action: "Offer Duplicated",
        remarks: `Copied from ${existingOffer.offerId}`,
        user: "Admin",
        createdAt: new Date()
      }
    ];

    newOffer.createdAt = new Date();

    newOffer.updatedAt = new Date();

    newOffer.isDeleted = false;

    newOffer.deletedAt = null;

    newOffer.deletedBy = null;

    const duplicatedOffer = await Offer.create(newOffer);

    return res.status(201).json({
      success: true,
      message: "Offer duplicated successfully.",
      data: duplicatedOffer
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });

  }
};
// =======================================
// Bulk Restore Offers
// PATCH /api/offers/bulk-restore
// =======================================

export const bulkRestoreOffers = async (req, res) => {
  try {
    const { offerIds, restoredBy } = req.body;

    if (!offerIds || !Array.isArray(offerIds)) {
      return res.status(400).json({
        success: false,
        message: "offerIds array is required."
      });
    }

    if (offerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one offer."
      });
    }

    const result = await Offer.updateMany(
      {
        _id: { $in: offerIds },
        isDeleted: true
      },
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
          updatedAt: new Date()
        }
      }
    );

    const offers = await Offer.find({
      _id: { $in: offerIds }
    });

    for (const offer of offers) {

      offer.timeline.push({
        action: "Bulk Restore",
        remarks: "Offer restored using bulk action.",
        user: restoredBy || "Admin",
        createdAt: new Date()
      });

      await offer.save();
    }

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} offers restored successfully.`,
      modifiedCount: result.modifiedCount
    });

  } catch (err) {

    console.error("Bulk Restore Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });

  }
};
// =======================================
// Bulk Permanent Delete Offers
// DELETE /api/offers/bulk-permanent-delete
// =======================================

export const bulkPermanentDeleteOffers = async (req, res) => {
  try {

    const { offerIds } = req.body;

    if (!offerIds || !Array.isArray(offerIds)) {
      return res.status(400).json({
        success: false,
        message: "offerIds array is required."
      });
    }

    if (offerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one offer."
      });
    }

    const result = await Offer.deleteMany({
      _id: {
        $in: offerIds
      }
    });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} offers permanently deleted.`,
      deletedCount: result.deletedCount
    });

  } catch (err) {

    console.error("Bulk Permanent Delete Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });

  }
};

// =======================================
// Export CSV
// GET /api/offers/export/csv
// =======================================

export const exportOffersCSV = async (req, res) => {
  try {

    const offers = await Offer.find({
      isDeleted: false
    }).lean();

    if (!offers.length) {
      return res.status(404).json({
        success: false,
        message: "No offers found."
      });
    }

    const fields = [
      "offerId",
      "customerName",
      "customerEmail",
      "customerPhone",
      "productName",
      "category",
      "originalAmount",
      "offeredAmount",
      "finalAmount",
      "discount",
      "status",
      "assignedTo",
      "createdAt"
    ];

    const parser = new Parser({ fields });

    const csv = parser.parse(offers);

    res.header("Content-Type", "text/csv");

    res.attachment("offers.csv");

    return res.send(csv);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }
};