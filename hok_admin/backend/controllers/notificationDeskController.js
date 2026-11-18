import Notification from "../models/Notification.js";
import Order from "../models/Order.js";
import Offer from "../models/Offer.js";
import Submission from "../models/Submission.js";
import Payout from "../models/Payout.js";
import Product from "../models/Product.js";
import Admin from "../models/Admin.js";
import Message from "../models/Message.js";

const DESK_STATE_ID = "DESK_STATE";
const PUT_DOWN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function toYmd(val) {
  if (!val) return "";
  const s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function diffDays(ymdA, ymdB) {
  if (!ymdA || !ymdB) return 0;
  const a = new Date(`${ymdA}T00:00:00Z`).getTime();
  const b = new Date(`${ymdB}T00:00:00Z`).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((b - a) / 86400000);
}

async function getDeskStateDoc() {
  let doc = await Notification.findOne({ notificationId: DESK_STATE_ID }).catch(
    () => null,
  );
  if (!doc) {
    return {
      notificationId: DESK_STATE_ID,
      assigned: {},
      putDown: {},
      seen: { list: [], at: null },
    };
  }
  return doc;
}

async function saveDeskState(patch) {
  const existing = await getDeskStateDoc();
  const next = {
    notificationId: DESK_STATE_ID,
    type: "system",
    title: "Notifications Desk State",
    message: "Persisted desk assignment, put-down, and seen state",
    assigned: patch.assigned !== undefined ? patch.assigned : existing.assigned || {},
    putDown: patch.putDown !== undefined ? patch.putDown : existing.putDown || {},
    seen: patch.seen !== undefined ? patch.seen : existing.seen || { list: [], at: null },
  };
  await Notification.findOneAndUpdate(
    { notificationId: DESK_STATE_ID },
    { $set: next },
    { upsert: true, new: true },
  );
  return next;
}

function prunePutDown(putDownMap) {
  const now = Date.now();
  const cleaned = {};
  if (!putDownMap || typeof putDownMap !== "object") return cleaned;
  for (const [k, until] of Object.entries(putDownMap)) {
    const ts = new Date(until).getTime();
    if (!Number.isNaN(ts) && ts > now) {
      cleaned[k] = until;
    }
  }
  return cleaned;
}

export const getDeskNotifications = async (req, res) => {
  try {
    const [
      orders,
      offers,
      submissions,
      payouts,
      products,
      admins,
      messages,
      stateDoc,
    ] = await Promise.all([
      Order.find({}).catch(() => []),
      Offer.find({}).catch(() => []),
      Submission.find({}).catch(() => []),
      Payout.find({}).catch(() => []),
      Product.find({}).catch(() => []),
      Admin.find({}).catch(() => []),
      Message.find({}).catch(() => []),
      getDeskStateDoc(),
    ]);

    const todayYmd = toYmd(new Date().toISOString());
    const teamList = (Array.isArray(admins) ? admins : [])
      .map((a) => a.name || a.username || a.email)
      .filter(Boolean);
    const team = teamList.length > 0 ? Array.from(new Set(teamList)) : ["Soumya"];
    const currentUser = (req.user && req.user.name) || team[0] || "Soumya";

    const returnsOverdueRecords = [];
    const returnsDueTodayRecords = [];
    const piecesToSendOutRecords = [];
    const depositsToCollectRecords = [];
    const depositsPastT3Records = [];

    let clearedReturns = 0;
    let clearedDeposits = 0;

    (Array.isArray(orders) ? orders : []).forEach((o) => {
      const orderId = String(o.orderId || o.id || o._id || "");
      if (!orderId) return;
      const status = String(o.status || "").toLowerCase();
      const depStatus = String(o.depositStatus || "").toLowerCase();
      const mode = String(o.mode || "Rental").toLowerCase();
      const customer = o.customerName || "Customer";
      const item0 = Array.isArray(o.items) && o.items[0] ? o.items[0] : {};
      const productName = o.productName || item0.productName || "Piece";
      const depositAmt = Number(
        o.depositHeld ?? o.securityDeposit ?? item0.deposit ?? 0,
      );
      const startYmd = toYmd(o.rentalStartDate || item0.rentalStartDate);
      const endYmd = toYmd(o.rentalEndDate || item0.rentalEndDate);
      const returnedYmd = toYmd(o.returnedAt || o.returnDate);

      if (status === "completed" || status === "returned") clearedReturns += 1;
      if (depStatus === "refunded" || depStatus === "released") clearedDeposits += 1;

      if (status === "cancelled") return;

      const isReturnedOrDone =
        status === "returned" ||
        status === "completed" ||
        status === "refunded";
      const isDispatched =
        status === "dispatched" ||
        status === "active" ||
        status === "delivered" ||
        status === "rented" ||
        status === "out for delivery";

      if (mode === "rental" && endYmd && !isReturnedOrDone && isDispatched) {
        const overdueDays = diffDays(endYmd, todayYmd);
        if (overdueDays > 0) {
          returnsOverdueRecords.push({
            id: orderId,
            label: `${productName} — ${customer}`,
            sub: `${orderId} · Due back ${endYmd} (${overdueDays}d overdue)`,
            money: depositAmt > 0 ? depositAmt : null,
            target: { page: "orders", orderId, tab: "return" },
          });
        } else if (overdueDays === 0) {
          returnsDueTodayRecords.push({
            id: orderId,
            label: `${productName} — ${customer}`,
            sub: `${orderId} · Due back today (${endYmd})`,
            money: depositAmt > 0 ? depositAmt : null,
            target: { page: "orders", orderId, tab: "return" },
          });
        }
      }

      if (
        (status === "confirmed" ||
          status === "pending" ||
          status === "ready to ship" ||
          status === "pending dispatch") &&
        startYmd
      ) {
        const daysUntilStart = diffDays(todayYmd, startYmd);
        if (daysUntilStart <= 2) {
          piecesToSendOutRecords.push({
            id: orderId,
            label: `${productName} — ${customer}`,
            sub:
              daysUntilStart < 0
                ? `${orderId} · Rental started ${startYmd} (dispatch overdue)`
                : daysUntilStart === 0
                  ? `${orderId} · Rental starts today (${startYmd})`
                  : `${orderId} · Rental starts ${startYmd} (in ${daysUntilStart}d)`,
            money: Number(o.amount || 0) || null,
            target: { page: "orders", orderId, tab: "overview" },
          });
        }
      }

      if (
        mode === "rental" &&
        depositAmt > 0 &&
        (depStatus === "pending" || depStatus === "unpaid" || depStatus === "due" || !depStatus)
      ) {
        depositsToCollectRecords.push({
          id: orderId,
          label: `${customer} — ${productName}`,
          sub: `${orderId} · Security deposit ₹${depositAmt.toLocaleString("en-IN")} pending`,
          money: depositAmt,
          target: { page: "orders", orderId, tab: "deposit" },
        });
      }

      if (
        status === "returned" &&
        depositAmt > 0 &&
        depStatus !== "refunded" &&
        depStatus !== "released" &&
        depStatus !== "settled"
      ) {
        const refYmd = returnedYmd || endYmd;
        const daysSinceReturn = refYmd ? diffDays(refYmd, todayYmd) : 0;
        if (daysSinceReturn >= 3) {
          depositsPastT3Records.push({
            id: orderId,
            label: `${customer} — ${productName}`,
            sub: `${orderId} · Returned ${refYmd} (${daysSinceReturn}d ago, T+3 passed)`,
            money: depositAmt,
            target: { page: "orders", orderId, tab: "deposit" },
          });
        }
      }
    });

    const offersWaitingRecords = [];
    let clearedOffers = 0;
    (Array.isArray(offers) ? offers : []).forEach((of) => {
      const id = String(of.offerId || of.id || of._id || "");
      if (!id) return;
      const st = String(of.status || "Pending").toLowerCase();
      if (st === "accepted" || st === "rejected" || st === "converted" || st === "closed") {
        clearedOffers += 1;
        return;
      }
      offersWaitingRecords.push({
        id,
        label: `${of.productName || "Offer"} — ${of.customerName || "Customer"}`,
        sub: `${id} · Offered ₹${Number(of.offeredPrice || of.amount || 0).toLocaleString("en-IN")}`,
        money: Number(of.offeredPrice || of.amount || 0) || null,
        target: { page: "offers", id },
      });
    });

    const submissionsWaitingRecords = [];
    const listerInfoRecords = [];
    let clearedSubmissions = 0;
    (Array.isArray(submissions) ? submissions : []).forEach((sub) => {
      const id = String(sub.submissionId || sub.id || sub._id || "");
      if (!id) return;
      const st = String(sub.status || "Pending").toLowerCase();
      const label = `${sub.productName || sub.title || "Submission"} — ${sub.listerName || sub.ownerName || "Lister"}`;
      if (st === "info requested" || st === "needs info" || st === "changes requested") {
        listerInfoRecords.push({
          id,
          label,
          sub: `${id} · Waiting on lister response`,
          target: { page: "submissions", id },
        });
      } else if (st === "pending" || st === "new" || st === "under review" || st === "submitted") {
        submissionsWaitingRecords.push({
          id,
          label,
          sub: `${id} · Awaiting admin review`,
          target: { page: "submissions", id },
        });
      } else {
        clearedSubmissions += 1;
      }
    });

    const payoutsWaitingRecords = [];
    let clearedPayouts = 0;
    (Array.isArray(payouts) ? payouts : []).forEach((p) => {
      const id = String(p.payoutId || p.id || p._id || "");
      if (!id) return;
      const st = String(p.status || "Pending").toLowerCase();
      if (st === "paid" || st === "settled" || st === "cancelled") {
        if (st === "paid" || st === "settled") clearedPayouts += 1;
        return;
      }
      const amt = Number(p.payoutAmount || p.netPayout || p.amount || 0);
      payoutsWaitingRecords.push({
        id,
        label: `${p.listerName || "Lister"} — ${p.productName || p.orderId || id}`,
        sub: `${id} · ₹${amt.toLocaleString("en-IN")} awaiting payout`,
        money: amt || null,
        target: { page: "payouts", id },
      });
    });

    const unlinkedPieceRecords = [];
    (Array.isArray(products) ? products : []).forEach((prod) => {
      const id = String(prod.productId || prod.id || prod._id || "");
      if (!id) return;
      const st = String(prod.status || "").toLowerCase();
      if (st === "archived" || st === "deleted" || st === "draft") return;
      const hasLister = Boolean(
        prod.listerId ||
          prod.lister_id ||
          prod.listerID ||
          prod.listerName ||
          prod.ownerName ||
          prod.ownerId ||
          prod.listerEmail ||
          prod.listerPhone ||
          prod.lister ||
          prod.owner ||
          prod.submissionId,
      );
      if (!hasLister) {
        unlinkedPieceRecords.push({
          id,
          label: prod.name || id,
          sub: `${id} · No lister linked`,
          target: { page: "products", id },
        });
      }
    });

    // Booking clashes: same piece, next booking starts before the previous
    // one has been returned + 3 days cleaning. Overdue pieces extend to today.
    const bookingClashRecords = [];
    const CLEAN_DAYS = 3;
    const ymdPlus = (ymd, n) => {
      const d = new Date(`${ymd}T00:00:00Z`);
      d.setUTCDate(d.getUTCDate() + n);
      return d.toISOString().slice(0, 10);
    };
    const rentalList = (Array.isArray(orders) ? orders : [])
      .map((o) => {
        const st = String(o.status || "").toLowerCase();
        const it = Array.isArray(o.items) && o.items[0] ? o.items[0] : {};
        const mode = String(it.mode || o.mode || "Rental").toLowerCase();
        const start = toYmd(o.rentalStartDate || it.rentalStartDate);
        const end = toYmd(o.rentalEndDate || it.rentalEndDate);
        const out = ["dispatched", "active", "delivered", "rented", "out for delivery"].includes(st);
        return {
          id: String(o.orderId || o.id || o._id || ""),
          st,
          mode,
          start,
          end,
          out,
          pid: String(it.productId || o.productId || it.productName || o.productName || ""),
          name: o.productName || it.productName || "Piece",
          customer: o.customerName || "Customer",
        };
      })
      .filter(
        (r) =>
          r.id &&
          r.mode === "rental" &&
          r.start &&
          r.end &&
          !["cancelled", "returned", "completed", "refunded"].includes(r.st),
      );
    rentalList.forEach((a) => {
      const effEnd = a.out && a.end < todayYmd ? todayYmd : a.end;
      const clearDate = ymdPlus(effEnd, CLEAN_DAYS);
      rentalList.forEach((b) => {
        if (a.id === b.id || a.pid !== b.pid || !a.pid) return;
        if (b.start <= a.start || b.out) return;
        if (b.start < clearDate) {
          bookingClashRecords.push({
            id: b.id,
            label: `${b.id} · ${b.customer}`,
            sub: `${b.name} · starts ${b.start}, but ${a.id} (${a.customer}) ${a.out && a.end < todayYmd ? "is overdue and still out" : `returns ${a.end}`} and clears cleaning only on ${clearDate}`,
            target: { page: "orders", orderId: b.id, tab: "overview" },
          });
        }
      });
    });

    const alerts = [
      {
        key: "bookingClashes",
        band: "today",
        surface: "desk",
        title: "One piece booked twice too close together",
        what: "A booking starts before the piece ahead of it has cleared return and cleaning. One of the two has to move, and the sooner the better.",
        elsewhere: null,
        act: "Open the rental calendar",
        actTarget: { page: "calendar" },
        blocked: false,
        notCounted: false,
        canPutDown: false,
        records: bookingClashRecords,
      },
      {
        key: "returnsOverdue",
        band: "today",
        surface: "desk",
        title: "Returns overdue",
        what: "Rental return date has passed and piece is not yet logged back in.",
        elsewhere: "Returns & Deposits",
        act: "Open Return",
        actTarget: { page: "returns" },
        blocked: false,
        notCounted: false,
        canPutDown: false,
        records: returnsOverdueRecords,
      },
      {
        key: "returnsDueToday",
        band: "today",
        surface: "desk",
        title: "Returns due back today",
        what: "Pieces scheduled to return to the studio today.",
        elsewhere: "Returns & Deposits",
        act: "Open Returns",
        actTarget: { page: "returns" },
        blocked: false,
        notCounted: false,
        canPutDown: false,
        records: returnsDueTodayRecords,
      },
      {
        key: "piecesToSendOut",
        band: "today",
        surface: "desk",
        title: "Pieces to send out",
        what: "Confirmed rentals starting within 2 days that still need dispatch.",
        elsewhere: "Dispatch Schedule",
        act: "Open Dispatch",
        actTarget: { page: "dispatch" },
        blocked: false,
        notCounted: false,
        canPutDown: false,
        records: piecesToSendOutRecords,
      },
      {
        key: "depositsToCollect",
        band: "today",
        surface: "desk",
        title: "Security deposits to collect",
        what: "Active rental orders where security deposit is still marked pending.",
        elsewhere: "Returns & Deposits",
        act: "Collect Deposit",
        actTarget: { page: "returns" },
        blocked: false,
        notCounted: false,
        canPutDown: false,
        records: depositsToCollectRecords,
      },
      {
        key: "depositsPastT3",
        band: "today",
        surface: "desk",
        title: "Deposits past T+3 release",
        what: "Returned pieces whose security deposit is still held past the 3-day SLA.",
        elsewhere: "Returns & Deposits",
        act: "Release Deposit",
        actTarget: { page: "returns" },
        blocked: false,
        notCounted: false,
        canPutDown: false,
        records: depositsPastT3Records,
      },
      {
        key: "offersWaiting",
        band: "waiting",
        surface: "desk",
        title: "Offers waiting on response",
        what: "Customer offers and price enquiries awaiting studio decision.",
        elsewhere: "Offers & Enquiries",
        act: "Review Offer",
        actTarget: { page: "offers" },
        blocked: false,
        notCounted: false,
        canPutDown: true,
        records: offersWaitingRecords,
      },
      {
        key: "submissionsWaiting",
        band: "waiting",
        surface: "desk",
        title: "LYP submissions to review",
        what: "New lister garment submissions waiting for approval.",
        elsewhere: "LYP Submissions",
        act: "Review Submission",
        actTarget: { page: "submissions" },
        blocked: false,
        notCounted: false,
        canPutDown: true,
        records: submissionsWaitingRecords,
      },
      {
        key: "payoutsWaiting",
        band: "waiting",
        surface: "desk",
        title: "Lister payouts awaiting approval",
        what: "Queued payouts waiting to be approved and settled.",
        elsewhere: "Payouts to Listers",
        act: "Open Payouts",
        actTarget: { page: "payouts" },
        blocked: false,
        notCounted: false,
        canPutDown: true,
        records: payoutsWaitingRecords,
      },
      {
        key: "listerInfoRequested",
        band: "them",
        surface: "desk",
        title: "Waiting on lister info",
        what: "Submissions where the studio requested additional details from the lister.",
        elsewhere: "LYP Submissions",
        act: "View Submission",
        actTarget: { page: "submissions" },
        blocked: false,
        notCounted: false,
        canPutDown: true,
        records: listerInfoRecords,
      },
      {
        key: "unlinkedPieces",
        band: "know",
        surface: "desk",
        title: "Catalogue pieces without a lister",
        what: "Products missing a linked lister profile for payout attribution.",
        elsewhere: "Products",
        act: "Open Products",
        actTarget: { page: "products" },
        blocked: false,
        notCounted: false,
        canPutDown: true,
        records: unlinkedPieceRecords,
      },
    ];

    const clearedByKey = {
      returnsOverdue: clearedReturns,
      returnsDueToday: clearedReturns,
      depositsPastT3: clearedDeposits,
      offersWaiting: clearedOffers,
      submissionsWaiting: clearedSubmissions,
      payoutsWaiting: clearedPayouts,
    };

    const history = alerts
      .map((a) => {
        const stillOpen = a.records.length;
        const cleared = clearedByKey[a.key] || 0;
        const opened = stillOpen + cleared;
        return {
          key: a.key,
          alert: a.title,
          opened,
          cleared,
          stillOpen,
          average: cleared > 0 ? "same day" : "—",
        };
      })
      .filter((h) => h.opened > 0 || h.stillOpen > 0);

    const deskMessages = (Array.isArray(messages) ? messages : [])
      .filter(
        (m) =>
          String(m.audience || "").toLowerCase() === "you" ||
          m.isYours === true,
      )
      .map((m) => ({
        id: String(m.messageId || m.id || m._id || ""),
        name: m.name || "Desk Message",
        firesOn: m.trigger || "Triggered by desk event",
        channels: Array.isArray(m.channels) && m.channels.length > 0
          ? m.channels
              .map((c) => {
                const low = String(c).toLowerCase();
                if (low === "whatsapp") return "WhatsApp";
                if (low === "in-panel" || low === "in panel") return "In panel";
                return low.charAt(0).toUpperCase() + low.slice(1);
              })
              .join(" · ")
          : "In panel",
        joinedTo: m.trigger || null,
      }));

    return res.json({
      computedAt: new Date().toISOString(),
      team,
      currentUser,
      slas: { submissionHours: 24, offerHours: 24, cleaningBufferDays: 2 },
      alerts,
      putDown: prunePutDown(stateDoc.putDown),
      seen: stateDoc.seen || { list: [], at: null },
      assigned: stateDoc.assigned || {},
      history,
      deskMessages,
    });
  } catch (err) {
    console.error("getDeskNotifications error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const assignRecord = async (req, res) => {
  try {
    const { recordId, to } = req.body || {};
    if (!recordId) {
      return res.status(400).json({ message: "recordId is required" });
    }
    const existing = await getDeskStateDoc();
    const assigned = { ...(existing.assigned || {}) };
    if (!to) {
      delete assigned[recordId];
    } else {
      assigned[recordId] = {
        by: to,
        at: new Date().toISOString(),
      };
    }
    const saved = await saveDeskState({ assigned });
    return res.json({ ok: true, assigned: saved.assigned });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const putDownAlert = async (req, res) => {
  try {
    const { key } = req.body || {};
    if (!key) {
      return res.status(400).json({ message: "key is required" });
    }
    const existing = await getDeskStateDoc();
    const putDown = prunePutDown(existing.putDown);
    putDown[key] = new Date(Date.now() + PUT_DOWN_TTL_MS).toISOString();
    const saved = await saveDeskState({ putDown });
    return res.json({ ok: true, putDown: saved.putDown });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const pickUpAlert = async (req, res) => {
  try {
    const { key } = req.body || {};
    if (!key) {
      return res.status(400).json({ message: "key is required" });
    }
    const existing = await getDeskStateDoc();
    const putDown = prunePutDown(existing.putDown);
    delete putDown[key];
    const saved = await saveDeskState({ putDown });
    return res.json({ ok: true, putDown: saved.putDown });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const markSeenRecords = async (req, res) => {
  try {
    const { recordIds } = req.body || {};
    const incoming = Array.isArray(recordIds) ? recordIds.map(String) : [];
    const existing = await getDeskStateDoc();
    const prevList = Array.isArray(existing.seen?.list) ? existing.seen.list : [];
    const merged = Array.from(new Set([...prevList, ...incoming]));
    const seen = {
      list: merged,
      at: new Date().toISOString(),
    };
    const saved = await saveDeskState({ seen });
    return res.json({ ok: true, seen: saved.seen });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
