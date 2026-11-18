// Order ID format (frozen with the client):
//   HOK-<TYPE>-<YY>-<NNNN>
//   TYPE: REN = rental booking, PRL = preloved purchase, NEW = buy-new order
//   YY  : 2-digit year, NNNN: 4-digit running number (per type + year)
//   e.g. HOK-REN-26-0001, HOK-PRL-26-0031, HOK-NEW-26-0008
import Order from "../models/Order.js";

export const ORDER_ID_REGEX = /^HOK-(REN|PRL|NEW)-\d{2}-\d{4}$/;

// Accepts a mode string ("Rental") or an array of items / modes.
export const orderTypeCode = (modeOrItems) => {
  const list = Array.isArray(modeOrItems) ? modeOrItems : [modeOrItems];
  const modes = list.map((x) =>
    String(
      x && typeof x === "object" ? x.mode || x.type || "" : x || "",
    ).toLowerCase(),
  );
  if (modes.some((m) => m === "rental" || m === "rent")) return "REN";
  if (modes.some((m) => m === "preloved" || m === "resell" || m === "re-sell"))
    return "PRL";
  return "NEW";
};

export const yearCode = (date = new Date()) =>
  date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }).slice(2, 4);

// Remembers what was handed out in this process so two quick requests
// never receive the same number before their order is saved.
const issued = new Map();

export const nextOrderId = async (modeOrItems, date = new Date()) => {
  const prefix = `HOK-${orderTypeCode(modeOrItems)}-${yearCode(date)}-`;
  let max = issued.get(prefix) || 0;
  try {
    const rows = await Order.find({});
    (Array.isArray(rows) ? rows : []).forEach((o) => {
      const id = String(o.orderId || "");
      if (ORDER_ID_REGEX.test(id) && id.startsWith(prefix)) {
        const n = parseInt(id.slice(prefix.length), 10);
        if (!Number.isNaN(n) && n > max) max = n;
      }
    });
  } catch (e) {
    console.warn("nextOrderId lookup failed:", e.message);
  }
  const next = max + 1;
  issued.set(prefix, next);
  return `${prefix}${String(next).padStart(4, "0")}`;
};
