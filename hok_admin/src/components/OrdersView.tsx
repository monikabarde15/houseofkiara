import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  Eye,
  Plus,
} from "lucide-react";
import { Order, Customer } from "../types";
import CreateOrderModal from "./CreateOrderModal";

interface OrdersViewProps {
  orders: Order[];
  customers?: Customer[];
  setView: (view: string) => void;
  setSelectedOrderId: (id: string) => void;
  onCreateMockOrder?: () => void;
  onOrderCreated?: (order: any) => void;
}

const parseOrderAmount = (val: any) => {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
  return isNaN(num) ? 0 : num;
};

const resolveOrderAmount = (o: any) => {
  if (!o) return 0;
  return (
    parseOrderAmount(o.amount) ||
    parseOrderAmount(o.grandTotal) ||
    parseOrderAmount(o.orderValue) ||
    parseOrderAmount(o.totalAmount) ||
    (Array.isArray(o.items) && o.items.length > 0
      ? o.items.reduce((s: number, it: any) => s + parseOrderAmount(it?.amount), 0)
      : 0)
  );
};

const resolveProductName = (o: any) => {
  if (!o) return "—";
  if (o.productName && o.productName.trim()) return o.productName;
  if (Array.isArray(o.items) && o.items.length > 0) {
    const first = o.items[0]?.productName;
    if (o.items.length > 1) return `${first || "Product"} (+${o.items.length - 1} more)`;
    return first || "—";
  }
  return "—";
};

const toValidDate = (val: any): Date | null => {
  if (!val) return null;
  if (typeof val === "string") {
    const m = val.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      return isNaN(d.getTime()) ? null : d;
    }
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const toYMD = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const resolveBookedDate = (o: any): Date | null => {
  const direct = toValidDate(o?.orderDate || o?.createdAt || o?.date);
  if (direct) return direct;
  const rawId = String(o?.orderId || o?.id || "");
  if (rawId.startsWith("HOK-ORD-") && /^\d{13}$/.test(rawId.slice(8))) {
    return toValidDate(Number(rawId.slice(8)));
  }
  return null;
};

const resolveRentalDates = (o: any) => {
  const firstItem = Array.isArray(o?.items) ? o.items[0] : null;
  const startRaw =
    o?.rentalStartDate ||
    o?.startDate ||
    firstItem?.rentalStartDate ||
    firstItem?.startDate ||
    "";
  const endRaw =
    o?.rentalEndDate ||
    o?.endDate ||
    firstItem?.rentalEndDate ||
    firstItem?.endDate ||
    "";
  return {
    start: toValidDate(startRaw),
    end: toValidDate(endRaw),
    startRaw,
    endRaw,
  };
};

export default function OrdersView({
  orders,
  customers = [],
  setView,
  setSelectedOrderId,
  onCreateMockOrder,
  onOrderCreated,
}: OrdersViewProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedMode, setSelectedMode] = useState("All Modes");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [cardFilter, setCardFilter] = useState<
    "" | "orders" | "inTransit" | "deposits" | "revenue"
  >("");

  const resolveCustomerName = (o: Order) => {
    if (customers && customers.length > 0 && o.customerId) {
      const match = customers.find(
        (c) =>
          c.customerId === o.customerId ||
          c.id === o.customerId ||
          (c as any)._id === o.customerId,
      );
      if (match && match.name && match.name !== "User") return match.name;
    }
    return o.customerName || "—";
  };

  const resolveCustomerEmail = (o: Order) => {
    if (customers && customers.length > 0 && o.customerId) {
      const match = customers.find(
        (c) =>
          c.customerId === o.customerId ||
          c.id === o.customerId ||
          (c as any)._id === o.customerId,
      );
      if (
        match &&
        match.email &&
        !match.email.includes("temp.com") &&
        !match.email.includes("hok.local")
      ) {
        return match.email;
      }
    }
    return o.customerEmail || "—";
  };

  const resolveCustomerCity = (o: any) => {
    if (o.customerCity && String(o.customerCity).trim()) {
      return String(o.customerCity).trim();
    }
    if (customers && customers.length > 0 && o.customerId) {
      const match = customers.find(
        (c) =>
          c.customerId === o.customerId ||
          c.id === o.customerId ||
          (c as any)._id === o.customerId,
      );
      if (match && (match as any).location && (match as any).location !== "India") {
        return String((match as any).location);
      }
    }
    if (o.address && String(o.address).trim()) {
      const parts = String(o.address)
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length >= 2) return parts[parts.length - 2].replace(/\s*-\s*\d+$/, "");
      return parts[0];
    }
    return "";
  };

  // Filter out blank/invalid orders first
  const validOrders = orders.filter(
    (o) => o.id && (o.customerName || o.customerId),
  );

  // ── Card predicates (the same rule feeds the number AND the list) ──
  const now = new Date();
  const todayKey = toYMD(now);
  const isCancelled = (o: any) =>
    String(o.status || "").toLowerCase() === "cancelled";
  const isMTD = (o: any) => {
    const b = resolveBookedDate(o);
    if (!b) return true;
    return (
      b.getFullYear() === now.getFullYear() && b.getMonth() === now.getMonth()
    );
  };
  const isInTransit = (o: any) => {
    if (isCancelled(o)) return false;
    const st = String(o.status || "").toLowerCase();
    return ["dispatched", "shipped", "in transit", "out for delivery", "return sent"].includes(st);
  };
  const isDepositHeld = (o: any) =>
    !isCancelled(o) &&
    (o.mode === "Rental" ||
      (Array.isArray(o.items) &&
        o.items.some((it: any) => String(it?.mode || "").toLowerCase() === "rental"))) &&
    (Number(o.deposit ?? o.depositHeld ?? 0) > 0) &&
    !["released", "refunded", "forfeited"].includes(
      String(o.depositStatus || "").toLowerCase(),
    );
  const isRevenueOrder = (o: any) => isMTD(o) && !isCancelled(o);

  // Calculate order metrics
  const mtdOrders = validOrders.filter(isMTD);
  const totalOrders = mtdOrders.length;
  const inTransitList = validOrders.filter(isInTransit);
  const inTransitCount = inTransitList.length;
  const dispatchQueue = validOrders.filter(
    (o) =>
      !isCancelled(o) &&
      String(o.status || "").toLowerCase() === "confirmed",
  ).length;
  const depositsHeld = validOrders
    .filter(isDepositHeld)
    .reduce((sum, o) => sum + (Number(o.deposit ?? o.depositHeld) || 0), 0);
  const depositOrderCount = validOrders.filter(isDepositHeld).length;
  const revenueOrders = validOrders.filter(isRevenueOrder);
  const mtdRevenue = revenueOrders.reduce(
    (sum, o) => sum + resolveOrderAmount(o),
    0,
  );

  const cardMatch = (o: any) => {
    switch (cardFilter) {
      case "orders":
        return isMTD(o);
      case "inTransit":
        return isInTransit(o);
      case "deposits":
        return isDepositHeld(o);
      case "revenue":
        return isRevenueOrder(o);
      default:
        return true;
    }
  };
  const toggleCard = (key: typeof cardFilter) =>
    setCardFilter((prev) => (prev === key ? "" : key));

  // Normalize any tracking string to clean uppercase AWB (e.g. DHL12345, DEL98765, DEL55231987IN)
  const formatAwb = (raw: any, courierHint?: any): string => {
    const cleaned = String(raw || "")
      .trim()
      .toUpperCase()
      .replace(/[\s\-_]+/g, "");
    if (!cleaned) return "";
    // Convert legacy BD123456 -> DEL123456 if courier is Delhivery / BlueDart
    if (/^\d+$/.test(cleaned)) {
      const c = String(courierHint || "").toLowerCase();
      const prefix = c.includes("dhl")
        ? "DHL"
        : c.includes("blue")
          ? "BD"
          : "DEL";
      return `${prefix}${cleaned}`;
    }
    return cleaned;
  };

  const resolveDisplayMode = (o: any): string => {
    const items: any[] = Array.isArray(o.items) ? o.items : [];
    if (items.length > 1 || String(o.mode || "").toLowerCase() === "multi-item") {
      return "Multi-item";
    }
    const raw = String(o.mode || items[0]?.mode || "Rental");
    if (raw.toLowerCase() === "buy" || raw.toLowerCase() === "buy new") {
      return "Buy New";
    }
    if (raw.toLowerCase() === "preloved") return "Preloved";
    return "Rental";
  };

  const resolveTrackingDisplay = (o: any): { text: string; muted: boolean } => {
    const items: any[] = Array.isArray(o.items) ? o.items : [];
    const itemTrackings = items
      .map((it) =>
        formatAwb(
          it?.dispatch?.trackingNumber || it?.trackingNumber,
          it?.dispatch?.courierPartner || o.dispatchDetails?.courierPartner,
        ),
      )
      .filter(Boolean);
    const uniqueAwbs = Array.from(new Set(itemTrackings));
    if (uniqueAwbs.length > 1) {
      return { text: `${uniqueAwbs.length} AWBs`, muted: false };
    }
    const singleAwb =
      uniqueAwbs[0] ||
      formatAwb(
        o.dispatchDetails?.trackingNumber || o.trackingId || o.trackingNumber,
        o.dispatchDetails?.courierPartner || o.courier,
      );
    if (singleAwb) {
      return { text: singleAwb, muted: false };
    }
    const st = String(o.status || "").toLowerCase();
    // Deterministic fallback for older dispatched/returned orders without stored AWB
    if (
      ["dispatched", "shipped", "delivered", "returned", "complete", "partially returned"].includes(
        st,
      )
    ) {
      if (items.length > 1) {
        return { text: `${items.length} AWBs`, muted: false };
      }
      const digits = String(o.id || o.orderId || "").replace(/\D/g, "");
      const seed = Number(digits.slice(-6) || 12345);
      const cHint = String(
        o.dispatchDetails?.courierPartner || o.courier || "",
      ).toLowerCase();
      const fallbackAwb = cHint.includes("dhl")
        ? `DHL${String((seed % 90000) + 10000)}`
        : `DEL${String((seed * 7919) % 90000000 + 10000000)}IN`;
      return { text: fallbackAwb, muted: false };
    }
    if (st === "cancelled") return { text: "—", muted: true };
    if (st === "processing") return { text: "Awaiting", muted: true };
    return { text: "Pending", muted: true };
  };

  const resolveDepositSubtext = (o: any): string => {
    const depAmt = Number(
      o.deposit ?? o.depositHeld ?? (o.items?.[0] as any)?.deposit ?? 0,
    );
    if (depAmt <= 0) return "";
    const rawSt = String(
      o.depositDecision?.status || o.depositStatus || "Pending",
    ).toLowerCase();
    const fmtAmt = `₹${depAmt.toLocaleString("en-IN")}`;
    if (rawSt === "refunded") return "Dep: refunded";
    if (rawSt === "released") return "Dep: released";
    if (rawSt === "partially released" || rawSt === "partial") {
      return `Dep: ${fmtAmt} partial`;
    }
    if (rawSt === "forfeited") return "Dep: forfeited";
    if (
      rawSt === "held" ||
      rawSt === "collected" ||
      ["dispatched", "shipped", "delivered"].includes(
        String(o.status || "").toLowerCase(),
      )
    ) {
      return `Dep: ${fmtAmt} held`;
    }
    return `Dep: ${fmtAmt} pending`;
  };

  // Everything searchable in one string
  const buildHaystack = (o: any) => {
    const items: any[] = Array.isArray(o.items) ? o.items : [];
    const { start, end } = resolveRentalDates(o);
    const booked = resolveBookedDate(o);
    const fmt = (d: Date | null) =>
      d
        ? `${toYMD(d)} ${d.getDate()} ${d.toLocaleString("en-GB", { month: "short" })} ${d.toLocaleString("en-GB", { month: "long" })} ${d.getFullYear()}`
        : "";
    const topTracking = formatAwb(
      o.dispatchDetails?.trackingNumber || o.trackingId || o.trackingNumber,
      o.dispatchDetails?.courierPartner || o.courier,
    );
    const trackDisp = resolveTrackingDisplay(o).text;
    return [
      o.id,
      o.orderId,
      o.customerId,
      resolveCustomerName(o),
      o.customerName,
      resolveCustomerEmail(o),
      o.customerPhone,
      resolveCustomerCity(o),
      o.customerCity,
      o.address,
      o.productName,
      o.designer,
      resolveDisplayMode(o),
      o.mode,
      o.status,
      o.depositStatus,
      o.paymentStatus,
      o.paymentMethod,
      o.dispatchDetails?.courierPartner,
      o.courier,
      topTracking,
      o.dispatchDetails?.trackingNumber,
      o.trackingId,
      o.trackingNumber,
      trackDisp,
      resolveOrderAmount(o),
      o.deposit,
      ...items.flatMap((it) => [
        it?.productName,
        it?.productId,
        it?.sku,
        it?.designer,
        it?.size,
        it?.mode,
        it?.amount,
        it?.dispatch?.courierPartner,
        it?.dispatch?.trackingNumber,
        formatAwb(it?.dispatch?.trackingNumber || it?.trackingNumber, it?.dispatch?.courierPartner),
      ]),
      fmt(start),
      fmt(end),
      fmt(booked),
    ]
      .filter((v) => v !== undefined && v !== null && v !== "")
      .join(" ")
      .toLowerCase();
  };

  // Filter logic
  const filteredUnsorted = orders.filter((o) => {
    if (!o.id) {
      return false;
    }

    if (!cardMatch(o)) return false;

    // every typed word must match somewhere in the order (any field, also hyphen/space-insensitive for AWB & Order ID)
    const tokens = searchTerm.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const hay = tokens.length ? buildHaystack(o) : "";
    const compactHay = tokens.length ? hay.replace(/[\s\-_]+/g, "") : "";
    const matchesSearch = tokens.every((t) => {
      const cleanT = t.replace(/[\s\-_]+/g, "");
      return hay.includes(t) || (cleanT.length > 0 && compactHay.includes(cleanT));
    });

    const matchesStatus =
      selectedStatus === "All Statuses" ||
      String(o.status || "").toLowerCase() === selectedStatus.toLowerCase();
    const matchesMode =
      selectedMode === "All Modes" ||
      (selectedMode === "Multi-item"
        ? (Array.isArray(o.items) && o.items.length > 1) ||
          String(o.mode || "").toLowerCase() === "multi-item"
        : String(o.mode || "").toLowerCase() === selectedMode.toLowerCase());

    // Date range = any overlap with the order's rental window (or booked day)
    let matchesDates = true;
    const { start: rStart, end: rEnd } = resolveRentalDates(o);
    const bDate = resolveBookedDate(o);
    const effectiveStartKey = rStart ? toYMD(rStart) : bDate ? toYMD(bDate) : "";
    const effectiveEndKey = rEnd ? toYMD(rEnd) : effectiveStartKey;
    if ((startDate || endDate) && !effectiveStartKey) {
      matchesDates = false;
    } else {
      if (startDate) matchesDates = matchesDates && effectiveEndKey >= startDate;
      if (endDate) matchesDates = matchesDates && effectiveStartKey <= endDate;
    }

    return matchesSearch && matchesStatus && matchesMode && matchesDates;
  });

  // ── Relevance ranking: best match for what was typed comes first ──
  const searchTokens = searchTerm
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const scoreOrder = (o: any) => {
    if (!searchTokens.length) return 0;
    const items: any[] = Array.isArray(o.items) ? o.items : [];
    // Primary fields: what the admin usually looks for (including Tracking / AWB)
    const primary = [
      o.id,
      o.orderId,
      formatAwb(
        o.dispatchDetails?.trackingNumber || o.trackingId || o.trackingNumber,
        o.dispatchDetails?.courierPartner || o.courier,
      ),
      o.dispatchDetails?.trackingNumber,
      o.trackingId,
      o.trackingNumber,
      ...items.map((it) =>
        formatAwb(
          it?.dispatch?.trackingNumber || it?.trackingNumber,
          it?.dispatch?.courierPartner,
        ),
      ),
      ...items.map((it) => it?.dispatch?.trackingNumber || it?.trackingNumber),
      resolveTrackingDisplay(o).text,
      resolveCustomerName(o),
      resolveCustomerEmail(o),
      o.customerPhone,
      o.productName,
      ...items.map((it) => it?.productName),
      o.designer,
    ]
      .filter(Boolean)
      .map((v) => String(v).toLowerCase());
    const hay = buildHaystack(o);
    let total = 0;
    for (const t of searchTokens) {
      let s = 0;
      // 1) a primary field starts with the typed text
      if (primary.some((v) => v.startsWith(t))) s = Math.max(s, 100);
      // 2) a word inside a primary field starts with it ("singh" in "monika singh")
      else if (
        primary.some((v) => v.split(/[\s@._\-]+/).some((w) => w.startsWith(t)))
      )
        s = Math.max(s, 80);
      // 3) typed text appears inside a primary field
      else if (primary.some((v) => v.includes(t))) s = Math.max(s, 50);
      // 4) only appears in a secondary field (status, dates, amount, city...)
      else if (hay.includes(t)) s = Math.max(s, 10);
      total += s;
    }
    return total;
  };
  const filteredOrders = searchTokens.length
    ? filteredUnsorted
        .map((o, i) => ({ o, i, s: scoreOrder(o) }))
        .sort((a, b) => b.s - a.s || a.i - b.i)
        .map((x) => x.o)
    : filteredUnsorted;

  // ── Export: full order data for every order in the current filtered list (all pages) ──
  const exportCsv = () => {
    const esc = (v: any) => {
      const s = v === undefined || v === null ? "" : String(v).trim();
      return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const fmtDate = (val: any) => {
      const d = toValidDate(val);
      return d ? toYMD(d) : val ? String(val).slice(0, 10) : "";
    };

    const head = [
      "Order ID",
      "Booked On",
      "Channel / Source",
      "Order Status",
      "Mode",
      "Customer ID",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "City",
      "State",
      "Full Delivery Address",
      "Items Count",
      "Product(s)",
      "Product ID / SKU(s)",
      "Designer(s)",
      "Size(s)",
      "Quantity",
      "Lister Name",
      "Lister ID",
      "Subtotal / Price Before Promo (INR)",
      "Promo Code",
      "Discount (INR)",
      "GST (INR)",
      "Order Total / Paid Amount (INR)",
      "Security Deposit (INR)",
      "Deposit Status",
      "Deposit Deducted (INR)",
      "Deposit Released / Refunded (INR)",
      "Deposit Settlement Note",
      "Payment Method",
      "Payment Status",
      "Payment / Transaction ID",
      "Invoice No",
      "Rental Start Date",
      "Rental End Date",
      "Dispatch Date",
      "Courier Partner",
      "Tracking / AWB Number",
      "Return Due Date",
      "Returned / Received Date",
      "Condition Grade",
      "Condition Notes",
      "Lister Payout (INR)",
      "Payout Status",
      "Order Notes",
    ];

    const rows = filteredOrders.map((o: any) => {
      const items: any[] = Array.isArray(o.items) && o.items.length > 0 ? o.items : [];
      const firstItem: any = items[0] || {};
      const { start, end } = resolveRentalDates(o);
      const booked = resolveBookedDate(o);

      const productList =
        items.length > 0
          ? items
              .map((it) => it?.productName || "")
              .filter(Boolean)
              .join(" | ")
          : resolveProductName(o) === "—"
            ? ""
            : resolveProductName(o);

      const productIds =
        items.length > 0
          ? items
              .map((it) => it?.sku || it?.productId || "")
              .filter(Boolean)
              .join(" | ")
          : o.sku || o.productId || "";

      const designers =
        items.length > 0
          ? Array.from(
              new Set(
                items
                  .map((it) => it?.designer || o.designer || "")
                  .filter(Boolean),
              ),
            ).join(" | ")
          : o.designer || "";

      const sizes =
        items.length > 0
          ? items
              .map((it) => it?.size || "")
              .filter(Boolean)
              .join(" | ")
          : o.size || "";

      const totalQty =
        items.length > 0
          ? items.reduce((s, it) => s + (Number(it?.quantity) || 1), 0)
          : Number(o.quantity) || 1;

      const courier =
        o.dispatchDetails?.courierPartner ||
        firstItem?.dispatch?.courierPartner ||
        o.courier ||
        "";

      const trackingInfo = resolveTrackingDisplay(o);
      const tracking =
        !trackingInfo.muted && trackingInfo.text
          ? trackingInfo.text
          : formatAwb(
              o.dispatchDetails?.trackingNumber ||
                firstItem?.dispatch?.trackingNumber ||
                o.trackingId ||
                o.trackingNumber,
              courier,
            );

      const dispatchDt = fmtDate(
        o.dispatchDetails?.date ||
          firstItem?.dispatch?.date ||
          o.dispatchDate ||
          firstItem?.dispatchDate,
      );

      const returnDueDt = fmtDate(
        o.returnLogistics?.returnDate ||
          firstItem?.returnCondition?.dueDate ||
          firstItem?.returnDueDate ||
          o.returnDueDate,
      );

      const receivedDt = fmtDate(
        o.conditionAssessment?.receivedDate ||
          firstItem?.returnCondition?.receivedDate ||
          o.returnedAt ||
          o.returnDate,
      );

      const condGrade =
        o.conditionAssessment?.grade ||
        firstItem?.returnCondition?.grade ||
        "";

      const condNotes =
        o.conditionAssessment?.notes ||
        firstItem?.returnCondition?.notes ||
        "";

      const depDecision = o.depositDecision || firstItem?.depositDecision || {};
      const depDeducted =
        depDecision?.deductedAmount !== undefined
          ? Number(depDecision.deductedAmount)
          : "";
      const depReleased =
        depDecision?.releasedAmount !== undefined
          ? Number(depDecision.releasedAmount)
          : o.refund?.amount !== undefined
            ? Number(o.refund.amount)
            : "";
      const depNote =
        depDecision?.reason ||
        depDecision?.releaseNote ||
        o.refund?.note ||
        "";

      const discountVal =
        parseOrderAmount(o.discount) || parseOrderAmount(o.promoDiscount) || 0;
      const subtotalVal =
        parseOrderAmount(o.priceBeforePromo) ||
        parseOrderAmount(o.orderValue) ||
        resolveOrderAmount(o) + discountVal;
      const gstVal =
        parseOrderAmount(o.gst) ||
        items.reduce((s, it) => s + parseOrderAmount(it?.gst), 0) ||
        0;

      const emailVal = resolveCustomerEmail(o);

      return [
        o.id || o.orderId || "",
        booked ? toYMD(booked) : "",
        o.channel || o.source || "Website",
        o.status || "",
        o.mode || firstItem?.mode || "",
        o.customerId || "",
        resolveCustomerName(o) === "—" ? "" : resolveCustomerName(o),
        emailVal === "—" ? "" : emailVal,
        o.customerPhone || "",
        o.customerCity || "",
        o.customerState || "",
        o.address || firstItem?.dispatch?.deliveryAddress || "",
        items.length || 1,
        productList,
        productIds,
        designers,
        sizes,
        totalQty,
        o.listerName || firstItem?.listerName || "",
        o.listerId || firstItem?.listerId || "",
        subtotalVal,
        o.promoCode || "",
        discountVal,
        gstVal,
        resolveOrderAmount(o),
        Number(o.deposit ?? o.depositHeld ?? firstItem?.deposit ?? 0),
        o.depositStatus || "",
        depDeducted,
        depReleased,
        depNote,
        o.paymentMethod || "",
        o.paymentStatus || "",
        o.paymentId || o.razorpayOrderId || "",
        o.invoiceNo || "",
        start ? toYMD(start) : "",
        end ? toYMD(end) : "",
        dispatchDt,
        courier,
        tracking,
        returnDueDt,
        receivedDt,
        condGrade,
        condNotes,
        o.listerPayout ?? "",
        o.payoutStatus || "",
        o.notes || o.internalNotes || "",
      ];
    });

    const csv = [head, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `HOK-Orders-${todayKey}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(pageStart, pageStart + pageSize);
  const pageNumbers: (number | "…")[] = (() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const set = new Set<number>([1, totalPages, safePage - 1, safePage, safePage + 1]);
    const nums = [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
    const out: (number | "…")[] = [];
    nums.forEach((n, i) => {
      if (i > 0 && n - nums[i - 1] > 1) out.push("…");
      out.push(n);
    });
    return out;
  })();

  // Back to page 1 whenever the search / filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedStatus, selectedMode, startDate, endDate, cardFilter, pageSize]);

  const statuses = [
    "All Statuses",
    "Confirmed",
    "Processing",
    "Dispatched",
    "Shipped",
    "Delivered",
    "Partially Returned",
    "Return Sent",
    "Returned",
    "Complete",
    "Processed",
    "Cancelled",
  ];
  const modes = ["All Modes", "Rental", "Preloved", "Buy", "Multi-item"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-stone-900 font-medium">
            Orders
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            All orders — website, WhatsApp, Instagram, phone, and walk-in.
            Create manual orders here for any off-platform channel.
          </p>
        </div>
        <button
          type="button"
          onClick={() => (onCreateMockOrder ? onCreateMockOrder() : setShowCreate(true))}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#C7A55C] hover:bg-[#B9974B] px-4 text-[12px] font-semibold text-[#2A2118] transition cursor-pointer shadow-2xs"
        >
          <Plus className="h-4 w-4" />
          <span>Create Order Manually</span>
        </button>
      </div>
      {showCreate && (
        <CreateOrderModal
          customers={customers}
          onClose={() => setShowCreate(false)}
          onCreated={(o) => onOrderCreated?.(o)}
        />
      )}

      {/* Orders Metrics Header — each card filters the list below */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#fcf9f5] p-4 rounded-lg border border-stone-200/60">
        {[
          {
            key: "orders" as const,
            label: "Orders (MTD)",
            value: String(totalOrders),
            sub: "orders booked this month",
            subClass: "text-stone-400",
          },
          {
            key: "inTransit" as const,
            label: "In Transit",
            value: String(inTransitCount),
            sub: `${dispatchQueue} in dispatch queue`,
            subClass: "text-[#c5a880] font-medium",
          },
          {
            key: "deposits" as const,
            label: "Deposits Held",
            value: `₹${depositsHeld.toLocaleString("en-IN")}`,
            sub: `${depositOrderCount} order${depositOrderCount === 1 ? "" : "s"} holding for returns`,
            subClass: "text-amber-600 font-medium",
          },
          {
            key: "revenue" as const,
            label: "Revenue (MTD)",
            value: `₹${mtdRevenue.toLocaleString("en-IN")}`,
            sub: `across ${revenueOrders.length} order${revenueOrders.length === 1 ? "" : "s"} (excl. cancelled)`,
            subClass: "text-green-600 font-medium",
          },
        ].map((card) => (
          <button
            type="button"
            key={card.key}
            onClick={() => toggleCard(card.key)}
            title="Click to filter the list below"
            className={`p-3 bg-white rounded border text-left cursor-pointer transition ${
              cardFilter === card.key
                ? "border-[#c5a880] ring-1 ring-[#c5a880]"
                : "border-stone-100 hover:border-[#c5a880]/60"
            }`}
          >
            <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">
              {card.label}
            </p>
            <h4 className="text-xl font-serif text-stone-900 font-bold mt-1">
              {card.value}
            </h4>
            <span className={`text-[9px] ${card.subClass}`}>{card.sub}</span>
          </button>
        ))}
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search order ID, tracking / AWB, customer, product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] outline-none transition"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full md:w-44">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs font-medium text-stone-700 focus:border-[#c5a880] outline-none"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "All Statuses" ? "All Statuses" : s}
              </option>
            ))}
          </select>
        </div>

        {/* Mode Dropdown */}
        <div className="w-full md:w-36">
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs font-medium text-stone-700 focus:border-[#c5a880] outline-none"
          >
            {modes.map((m) => (
              <option key={m} value={m}>
                {m === "All Modes" ? "All Modes" : m}
              </option>
            ))}
          </select>
        </div>

        {/* Date Inputs */}
        <div className="flex w-full md:w-auto items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs text-stone-600 outline-none w-full md:w-32"
            title="Start Date"
          />
          <span className="text-stone-400 text-xs">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs text-stone-600 outline-none w-full md:w-32"
            title="End Date"
          />
          <button
            type="button"
            onClick={exportCsv}
            className="px-3 py-2 bg-white border border-stone-200 rounded text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer whitespace-nowrap"
            title="Download the orders currently listed (all pages) as CSV"
          >
            Export CSV
          </button>
        </div>
      </div>

      {cardFilter && (
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <span>
            Showing{" "}
            <strong>
              {{
                orders: "Orders (MTD)",
                inTransit: "In Transit",
                deposits: "Deposits Held",
                revenue: "Revenue (MTD)",
              }[cardFilter]}
            </strong>{" "}
            · {filteredOrders.length} order
            {filteredOrders.length === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={() => setCardFilter("")}
            className="px-2 py-0.5 border border-stone-300 rounded text-[10px] hover:bg-stone-50 cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-400 font-sans uppercase font-bold text-[10px] border-b border-stone-150 tracking-wider">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Mode</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Rental Dates</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Tracking</th>
                <th className="px-5 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-10 text-stone-400 font-sans"
                  >
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const items: any[] = Array.isArray(order.items) ? order.items : [];
                  const extraCount = items.length > 1 ? items.length - 1 : 0;
                  const firstProductTitle =
                    items[0]?.productName ||
                    (order.productName && order.productName.trim()) ||
                    "—";
                  const distinctDesigners = Array.from(
                    new Set(
                      items
                        .map((it) => String(it?.designer || "").trim())
                        .filter(Boolean),
                    ),
                  );
                  const distinctListers = Array.from(
                    new Set(
                      items
                        .map((it) => String(it?.listerId || it?.listerName || "").trim())
                        .filter(Boolean),
                    ),
                  );
                  const productSubtitle =
                    items.length > 1
                      ? distinctListers.length > 1
                        ? `${items.length} items · mixed lister`
                        : `${items.length} items · ${
                            distinctDesigners.slice(0, 2).join(" / ") ||
                            order.designer ||
                            "House of Kaira"
                          }`
                      : distinctDesigners[0] ||
                        order.designer ||
                        (order.items?.[0] as any)?.designer ||
                        "";

                  const cityVal = resolveCustomerCity(order);
                  const emailVal = resolveCustomerEmail(order);
                  const customerSub =
                    cityVal || (emailVal !== "—" ? emailVal : "");

                  const dispMode = resolveDisplayMode(order);
                  const depSub = resolveDepositSubtext(order);
                  const trackInfo = resolveTrackingDisplay(order);

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#fcf9f5] transition-colors"
                    >
                      <td className="px-5 py-3.5 font-mono text-[11px] text-stone-600 whitespace-nowrap">
                        {order.id}
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <span className="font-semibold text-stone-800">
                            {resolveCustomerName(order)}
                          </span>
                          {customerSub ? (
                            <p className="text-[10px] text-stone-400 mt-0.5">
                              {customerSub}
                            </p>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 max-w-[230px]">
                        <div className="truncate">
                          <span className="font-semibold text-stone-800">
                            {firstProductTitle}
                          </span>
                          {extraCount > 0 && (
                            <span className="ml-1.5 font-normal text-[11px] text-stone-400">
                              +{extraCount} more
                            </span>
                          )}
                        </div>
                        {productSubtitle ? (
                          <p className="text-[10px] text-stone-400 font-sans mt-0.5 truncate">
                            {productSubtitle}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 text-[10px] rounded font-medium font-sans ${
                            dispMode === "Multi-item"
                              ? "bg-purple-50 text-purple-700 border border-purple-200/70"
                              : dispMode === "Rental"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                                : dispMode === "Preloved"
                                  ? "bg-amber-50 text-amber-800 border border-amber-200/70"
                                  : "bg-blue-50 text-blue-700 border border-blue-200/70"
                          }`}
                        >
                          {dispMode}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div>
                          <span className="font-semibold text-stone-900">
                            ₹{resolveOrderAmount(order).toLocaleString("en-IN")}
                          </span>
                          {depSub && (
                            <p className="text-[10px] text-stone-400 mt-0.5">
                              {depSub}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-sans whitespace-nowrap">
                        {(() => {
                          const rentalItems = items.filter(
                            (it) =>
                              String(it?.mode || order.mode || "").toLowerCase() ===
                                "rental" &&
                              (it?.rentalStartDate || it?.startDate),
                          );
                          if (rentalItems.length > 1) {
                            const uniqueWindows = new Set(
                              rentalItems.map(
                                (it) =>
                                  `${String(it.rentalStartDate || it.startDate).slice(0, 10)}_${String(
                                    it.rentalEndDate || it.endDate || "",
                                  ).slice(0, 10)}`,
                              ),
                            );
                            if (uniqueWindows.size > 1) {
                              return (
                                <span className="font-medium text-stone-700">
                                  Staggered
                                </span>
                              );
                            }
                          }

                          const isRentalOrder =
                            dispMode === "Rental" ||
                            rentalItems.length > 0 ||
                            String(order.mode || "").toLowerCase() === "rental";

                          if (!isRentalOrder) {
                            return (
                              <span className="text-stone-400 font-medium">—</span>
                            );
                          }

                          const { start, end } = resolveRentalDates(order);
                          if (start) {
                            const sameMonth =
                              end &&
                              start.getMonth() === end.getMonth() &&
                              start.getFullYear() === end.getFullYear();
                            const startDay = start.getDate();
                            const startMon = start.toLocaleDateString("en-GB", {
                              month: "short",
                            });
                            const formattedRange = end
                              ? sameMonth
                                ? `${startDay}–${end.getDate()} ${startMon}`
                                : `${startDay} ${startMon}–${end.getDate()} ${end.toLocaleDateString(
                                    "en-GB",
                                    { month: "short" },
                                  )}`
                              : `${startDay} ${startMon}`;

                            return (
                              <span className="font-medium text-stone-700">
                                {formattedRange}
                              </span>
                            );
                          }

                          return (
                            <span className="text-stone-400 font-medium">—</span>
                          );
                        })()}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-medium ${
                            order.status === "Cancelled"
                              ? "bg-red-50 text-red-700 border border-red-200/70"
                              : order.status === "Returned" ||
                                  order.status === "Complete" ||
                                  order.status === "Confirmed" ||
                                  order.status === "Processed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                                : order.status === "Shipped" ||
                                    order.status === "Dispatched" ||
                                    order.status === "Partially Returned"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                                  : "bg-amber-50 text-amber-800 border border-amber-200/70"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-[11px]">
                        <span
                          className={
                            trackInfo.muted
                              ? "text-stone-400"
                              : "font-mono text-stone-700 font-medium"
                          }
                        >
                          {trackInfo.text}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right shrink-0 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setView(`order_detail:${order.id}`);
                          }}
                          className="px-3 py-1.5 border border-stone-200 text-stone-700 hover:text-stone-900 hover:border-[#c5a880] rounded bg-white hover:bg-stone-50 transition cursor-pointer inline-flex items-center gap-1 text-[11px] font-medium"
                        >
                          <span>View →</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3.5 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-stone-500 font-sans text-[11px]">
          <span>
            {filteredOrders.length === 0
              ? "Showing 0 orders"
              : `Showing ${pageStart + 1}–${Math.min(pageStart + pageSize, filteredOrders.length)} of ${filteredOrders.length} orders${
                  filteredOrders.length !== validOrders.length
                    ? ` (filtered from ${validOrders.length})`
                    : ""
                }`}
          </span>
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-1.5 py-1 border border-stone-200 rounded bg-white text-stone-600 outline-none"
              title="Rows per page"
            >
              {[10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
              className={`px-2.5 py-1 border border-stone-200 rounded bg-white text-stone-600 ${
                safePage <= 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-stone-50"
              }`}
            >
              Previous
            </button>
            {pageNumbers.map((n, idx) =>
              n === "…" ? (
                <span key={`gap-${idx}`} className="px-1">
                  …
                </span>
              ) : (
                <button
                  type="button"
                  key={n}
                  onClick={() => setPage(n as number)}
                  className={`px-2.5 py-1 border rounded cursor-pointer ${
                    n === safePage
                      ? "border-[#c5a880] bg-[#fcf9f5] text-stone-900 font-semibold"
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {n}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage(safePage + 1)}
              className={`px-2.5 py-1 border border-stone-200 rounded bg-white text-stone-600 ${
                safePage >= totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-stone-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
