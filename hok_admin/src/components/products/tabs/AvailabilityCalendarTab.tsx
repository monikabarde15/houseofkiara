// src/components/products/tabs/AvailabilityCalendarTab.tsx

import React, { useMemo, useState } from "react";
import { Product } from "../../../types";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import * as productSectionsApi from "../../../services/productSectionsApi";
import * as offerApi from "../../../services/offerApi";
import * as customerApi from "../../../services/customerApi";
import { promotionService } from "../../Promotions/services/promotionService";
import toast from "react-hot-toast";

interface AvailabilityCalendarTabProps {
  editingProduct: Product | null;
  onUpdateProduct: (product: Product) => void | Promise<void>;
  loading?: boolean;
  onOpenGlobalCalendar?: () => void;
  onViewOrder?: (orderId: string) => void;
  orders?: any[];
  offers?: any[];
  promoCodes?: any[];
  onAddOrder?: (newOrder: any) => void;
}

const REASON_OPTIONS = [
  {
    value: "external_instagram",
    label: "External booking (Instagram / WhatsApp)",
    isExternal: true,
  },
  { value: "maintenance", label: "Maintenance", isExternal: false },
  { value: "alterations", label: "Alterations", isExternal: false },
  {
    value: "cleaning",
    label: "Cleaning (beyond automatic buffer)",
    isExternal: false,
  },
  { value: "photoshoot", label: "Photoshoot", isExternal: false },
  { value: "other", label: "Other manual block", isExternal: false },
];

const CHANNEL_OPTIONS = [
  "Instagram",
  "WhatsApp",
  "Walk-in",
  "Phone",
  "Website",
];

const DEFAULT_PRE_BUFFER_DAYS = 2;
const DEFAULT_POST_BUFFER_DAYS = 3;

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function toISODate(d: Date) {
  if (!d || isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function addDays(d: Date, n: number) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}
function isSameDay(a: Date, b: Date) {
  return toISODate(a) === toISODate(b);
}

type DayType = "muted" | "available" | "buffer" | "rental" | "blocked";
interface DayInfo {
  date: Date;
  type: DayType;
  label?: string;
  isToday: boolean;
  isPast: boolean;
}

function parseToStartOfDay(d: Date | string | number | null | undefined): Date {
  if (!d) return new Date(NaN);
  if (typeof d === "string") {
    const match = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return new Date(
        parseInt(match[1], 10),
        parseInt(match[2], 10) - 1,
        parseInt(match[3], 10),
      );
    }
  }
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return new Date(NaN);
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
}

export function AvailabilityCalendarTab({
  editingProduct,
  onUpdateProduct,
  loading = false,
  onOpenGlobalCalendar,
  onViewOrder,
  orders = [],
  offers = [],
  promoCodes = [],
  onAddOrder,
}: AvailabilityCalendarTabProps) {
  const [localProduct, setLocalProduct] = useState<Product>(editingProduct!);

  React.useEffect(() => {
    if (editingProduct) {
      setLocalProduct(editingProduct);
    }
  }, [editingProduct]);

  const activeProduct = localProduct || editingProduct;
  const today = useMemo(() => parseToStartOfDay(new Date()), []);

  const initialAnchor = useMemo(() => {
    const firstBooking = activeProduct?.bookingHistory?.[0] as any;
    if (firstBooking?.startDate) {
      const d = parseToStartOfDay(firstBooking.startDate);
      if (!isNaN(d.getTime())) return d;
    }
    return today;
  }, [activeProduct, today]);

  // State for BIG Calendar (Left Side)
  const [viewMonth, setViewMonth] = useState(initialAnchor.getMonth());
  const [viewYear, setViewYear] = useState(initialAnchor.getFullYear());

  // State for SMALL Calendar (Right Side)
  const [smallViewMonth, setSmallViewMonth] = useState(today.getMonth());
  const [smallViewYear, setSmallViewYear] = useState(today.getFullYear());

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [blockFrom, setBlockFrom] = useState("");
  const [blockTo, setBlockTo] = useState("");
  const [reason, setReason] = useState(REASON_OPTIONS[0].value);
  const [customerName, setCustomerName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [city, setCity] = useState("");
  const [channel, setChannel] = useState(CHANNEL_OPTIONS[0]);
  const [listerSplit, setListerSplit] = useState<number>(45);
  const [splitNote, setSplitNote] = useState("");
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [isEditingOffer, setIsEditingOffer] = useState(false);
  const [editOfferData, setEditOfferData] = useState({
    customerName: "",
    phone: "",
    customerEmail: "",
    offerPrice: 0,
  });
  const [selectedPromoCode, setSelectedPromoCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [databaseOffers, setDatabaseOffers] = useState<any[] | null>(null);
  const [databasePromoCodes, setDatabasePromoCodes] = useState<any[] | null>(
    null,
  );
  // Kept only for the disabled legacy selector markup; customer lookup is
  // performed by the booking API from name/phone.
  const [existingCustomers, setExistingCustomers] = useState<any[]>([]);
  const [matchedCustomer, setMatchedCustomer] = useState<any | null>(null);
  const customerList: any[] = existingCustomers;
  const selectedCustomerId = matchedCustomer?.customerId || "";
  const customerMode = matchedCustomer ? "existing" : "new";
  const setSelectedCustomerId = (id: string) => {
    const found = existingCustomers.find((c: any) => c.customerId === id || c._id === id);
    if (found) {
      setMatchedCustomer(found);
      setCustomerName(found.name || "");
      if (found.phone) setWhatsappNumber(found.phone);
      if (found.location || found.city) setCity(found.location || found.city);
    }
  };

  const handleCustomerNameChange = (val: string) => {
    setCustomerName(val);
    const trimmed = val.trim().toLowerCase();
    if (!trimmed) {
      setMatchedCustomer(null);
      return;
    }
    const match = existingCustomers.find(
      (c: any) =>
        (c.name && c.name.toLowerCase().trim() === trimmed) ||
        (c.email && c.email.toLowerCase().trim() === trimmed) ||
        (c.phone && c.phone.replace(/\D/g, "") === trimmed.replace(/\D/g, "")),
    );
    if (match) {
      setMatchedCustomer(match);
      if (match.phone) setWhatsappNumber(match.phone);
      if (match.location || match.city) setCity(match.location || match.city);
    } else {
      setMatchedCustomer(null);
    }
  };
  const setCustomerMode = () => {};

  const [calendarApiData, setCalendarApiData] = useState<any | null>(null);

  // Reload calendar bookings, offers, promos & customers from PostgreSQL whenever a product calendar opens.
  React.useEffect(() => {
    if (!editingProduct) return;
    const targetId =
      editingProduct.productId ||
      (editingProduct as any)._id ||
      editingProduct.id;

    if (targetId) {
      productSectionsApi
        .getCalendar(targetId)
        .then((cal: any) => {
          setCalendarApiData(cal || null);
          const bookings: any[] = cal?.bookingHistory || cal?.orderHistory || [];
          if (bookings.length > 0 && !(editingProduct.bookingHistory || []).length) {
            const firstWithDate = bookings.find(
              (b: any) => b.startDate || b.rentalStartDate || b.orderDate,
            );
            const anchor = parseToStartOfDay(
              firstWithDate?.startDate ||
                firstWithDate?.rentalStartDate ||
                firstWithDate?.orderDate,
            );
            if (!isNaN(anchor.getTime())) {
              setViewMonth(anchor.getMonth());
              setViewYear(anchor.getFullYear());
            }
          }
        })
        .catch(() => setCalendarApiData(null));
    }

    offerApi
      .getOffers()
      .then(setDatabaseOffers)
      .catch(() => setDatabaseOffers(null));
    promotionService
      .getPromoCodes()
      .then(setDatabasePromoCodes)
      .catch(() => setDatabasePromoCodes(null));
    customerApi
      .getCustomers()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : res?.data || [];
        setExistingCustomers(list);
      })
      .catch(() => setExistingCustomers([]));
  }, [editingProduct?.productId, (editingProduct as any)?._id, editingProduct?.id]);

  if (!activeProduct) {
    return (
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm">
        <p className="text-stone-400 text-center py-8">No product selected</p>
      </div>
    );
  }

  const rawPre = Number((activeProduct as any).preRentalBufferDays);
  const rawPost = Number((activeProduct as any).postRentalBufferDays);
  const preBufferDays =
    !isNaN(rawPre) && rawPre >= 0 && rawPre <= 14
      ? rawPre
      : DEFAULT_PRE_BUFFER_DAYS;
  const postBufferDays =
    !isNaN(rawPost) && rawPost >= 0 && rawPost <= 14
      ? rawPost
      : DEFAULT_POST_BUFFER_DAYS;

  const blockedDates = useMemo(() => {
    const base = Array.isArray(activeProduct.blockedDates)
      ? activeProduct.blockedDates
      : [];
    const fromApi = Array.isArray(calendarApiData?.blockedDates)
      ? calendarApiData.blockedDates
      : [];
    const seen = new Set<string>();
    const out: any[] = [];
    [...base, ...fromApi].forEach((b: any) => {
      if (!b?.from || !b?.to) return;
      const key = `${b.from}|${b.to}|${b.reason || ""}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(b);
      }
    });
    return out;
  }, [activeProduct.blockedDates, calendarApiData]);

  const combinedProductBookings = useMemo(() => {
    const pidCandidates = new Set(
      [
        activeProduct.productId,
        (activeProduct as any)._id,
        activeProduct.id,
      ]
        .filter(Boolean)
        .map((x) => String(x)),
    );
    const pNameLower = String(activeProduct.name || "")
      .trim()
      .toLowerCase();

    const extractBookedYMD = (obj: any): string => {
      const raw =
        obj?.orderDate || obj?.createdAt || obj?.invoiceDate || obj?.date || "";
      if (raw) {
        const d = parseToStartOfDay(raw);
        if (!isNaN(d.getTime())) return toISODate(d);
      }
      const oid = String(obj?.orderId || obj?.id || obj?.orderNumber || "");
      const m = oid.match(/HOK-ORD-(\d{13})/);
      if (m) {
        const d = parseToStartOfDay(new Date(Number(m[1])));
        if (!isNaN(d.getTime())) return toISODate(d);
      }
      return "";
    };

    const mergedMap = new Map<string, any>();
    const upsertEntry = (rawEntry: any) => {
      if (!rawEntry) return;
      const oid = String(
        rawEntry.orderId ||
          rawEntry.id ||
          rawEntry.orderNumber ||
          `${rawEntry.customerName || "guest"}-${rawEntry.startDate || rawEntry.rentalStartDate || ""}`,
      );
      const prev = mergedMap.get(oid) || {};
      mergedMap.set(oid, { ...prev, ...rawEntry, orderId: oid });
    };

    // 1. Product static/saved history
    ((activeProduct as any).orderHistory || []).forEach(upsertEntry);
    (activeProduct.bookingHistory || []).forEach(upsertEntry);

    // 2. Live Calendar API history
    (calendarApiData?.orderHistory || []).forEach(upsertEntry);
    (calendarApiData?.bookingHistory || []).forEach(upsertEntry);

    // 3. Live global `orders` prop matching this product
    (orders || []).forEach((o: any) => {
      const itemsList: any[] = Array.isArray(o.items) ? o.items : [];
      const matchedItem = itemsList.find(
        (it: any) =>
          (it?.productId && pidCandidates.has(String(it.productId))) ||
          (pNameLower &&
            it?.productName &&
            String(it.productName).trim().toLowerCase() === pNameLower),
      );
      const rootMatches =
        (o.productId && pidCandidates.has(String(o.productId))) ||
        (pNameLower &&
          o.productName &&
          String(o.productName).trim().toLowerCase() === pNameLower);

      if (!matchedItem && !rootMatches) return;

      const it = matchedItem || itemsList[0] || {};
      const oid = String(o.orderId || o.id || o.orderNumber || o._id || "");
      const rStart = o.rentalStartDate || it.rentalStartDate || "";
      const rEnd = o.rentalEndDate || it.rentalEndDate || "";
      const bookedYMD = extractBookedYMD(o);
      const resolvedMode = it.mode || o.mode || (rStart ? "Rental" : "Buy");

      upsertEntry({
        orderId: oid,
        customerName: o.customerName || "Customer",
        whatsappNumber: o.customerPhone || "",
        mode: resolvedMode,
        rentalStartDate: rStart,
        rentalEndDate: rEnd,
        orderDate: bookedYMD || o.orderDate || o.createdAt || "",
        startDate: rStart || bookedYMD,
        endDate: rEnd || rStart || bookedYMD,
        status: o.status || "Confirmed",
        depositStatus: o.depositStatus || "",
        amount: Number(
          o.grandTotal ?? o.amount ?? o.totalAmount ?? it.amount ?? 0,
        ),
        dispatchDate:
          o.dispatchDetails?.date ||
          it.dispatch?.date ||
          o.dispatchDate ||
          it.dispatchDate ||
          "",
      });
    });

    // Normalize every entry so both Rental and Buy/Preloved orders have valid startDate/endDate
    return Array.from(mergedMap.values()).map((entry: any) => {
      const rStart = entry.rentalStartDate || "";
      const rEnd = entry.rentalEndDate || "";
      const bookedYMD = extractBookedYMD(entry);
      const modeStr = String(entry.mode || (rStart ? "Rental" : "Rental"));
      const isRental =
        modeStr.toLowerCase() === "rental" &&
        Boolean(rStart || entry.startDate);
      const finalStart =
        (isRental ? rStart || entry.startDate : entry.startDate || bookedYMD) ||
        bookedYMD;
      const finalEnd =
        (isRental
          ? rEnd || entry.endDate || finalStart
          : entry.endDate || finalStart) || finalStart;

      return {
        ...entry,
        mode: modeStr,
        isRental,
        orderBookedYMD: bookedYMD,
        startDate: finalStart,
        endDate: finalEnd,
      };
    });
  }, [activeProduct, calendarApiData, orders]);

  const bookingHistory = combinedProductBookings;

  const activeBookings = useMemo(() => {
    return combinedProductBookings
      .filter(
        (h) =>
          h.startDate &&
          h.endDate &&
          String(h.status || "").toLowerCase() !== "cancelled",
      )
      .map((h) => ({
        ...h,
        start: parseToStartOfDay(h.startDate),
        end: parseToStartOfDay(h.endDate),
      }))
      .filter((h) => !isNaN(h.start.getTime()) && !isNaN(h.end.getTime()));
  }, [combinedProductBookings]);

  // All context values are derived from booking rows returned by the calendar
  // API.  No split, count, or date on this card is a display-only constant.
  const splitBookings = activeBookings
    .filter((booking: any) =>
      Number.isFinite(Number(booking.listerSplitPercent)),
    )
    .sort(
      (a: any, b: any) =>
        new Date(b.startDate || b.date).getTime() -
        new Date(a.startDate || a.date).getTime(),
    );
  const lastSplitBooking = splitBookings[0];
  const averageSplit = splitBookings.length
    ? Math.round(
        splitBookings.reduce(
          (total: number, booking: any) =>
            total + Number(booking.listerSplitPercent),
          0,
        ) / splitBookings.length,
      )
    : 0;
  const defaultSplit = Math.max(
    0,
    Number((activeProduct as any).payoutPercentage || 45),
  );
  const rentalCount = activeBookings.length;
  const productCondition = String(
    (activeProduct as any).condition || "Not recorded",
  );

  const reasonMeta = REASON_OPTIONS.find((r) => r.value === reason)!;
  const isExternalBooking = reasonMeta.isExternal;

  // Offers are optional at booking time. List all usable database offers but
  // restrict them to the current product (or legacy records without any product link).
  const applicableOffers = useMemo(() => {
    const sourceOffers = databaseOffers ?? offers;
    const currentId =
      activeProduct.productId || (activeProduct as any)._id || activeProduct.id;
    const currentCust = (customerName || "").trim().toLowerCase();

    return sourceOffers.filter((offer: any) => {
      const isPendingOrAccepted =
        offer.status === "Pending" || offer.status === "Accepted";
      if (!isPendingOrAccepted) return false;

      const hasNoProductLink = !offer.productId && !offer.productName;
      const matchesId =
        offer.productId && String(offer.productId) === String(currentId);
      const matchesName =
        offer.productName && offer.productName === activeProduct.name;

      if (!matchesId && !matchesName && !hasNoProductLink) return false;

      // Restrict offer to the specific customer it was created for
      if (offer.customerName) {
        const oCust = offer.customerName.trim().toLowerCase();
        if (currentCust) {
          if (!currentCust.includes(oCust) && !oCust.includes(currentCust)) return false;
        }
      }
      return true;
    });
  }, [databaseOffers, offers, activeProduct, customerName]);

  const activePromoCodes = useMemo(() => {
    const sourcePromoCodes = databasePromoCodes ?? promoCodes;
    const currentCust = (customerName || "").trim().toUpperCase();
    const currentCustId = matchedCustomer?.customerId;

    return sourcePromoCodes.filter((promo: any) => {
      if (String(promo.status || "").toLowerCase() !== "active") return false;

      // Private promo: restrict to assigned customerIds
      if (promo.audience === "private" && Array.isArray(promo.customerIds) && promo.customerIds.length > 0) {
        if (!currentCustId && !currentCust) return false;
        const matches = promo.customerIds.some(
          (cid: string) =>
            (currentCustId && cid === currentCustId) ||
            (currentCust && cid.toUpperCase().trim() === currentCust),
        );
        if (!matches) return false;
      }

      // Customer-specific code naming convention (e.g. OFFER-MEETU-778)
      const codeUpper = String(promo.code || "").toUpperCase();
      for (const cust of existingCustomers) {
        const cName = String(cust.name || "").trim().toUpperCase();
        if (cName && cName.length >= 3 && codeUpper.includes(cName)) {
          if (!currentCust || !currentCust.includes(cName)) return false;
        }
      }
      return true;
    });
  }, [databasePromoCodes, promoCodes, customerName, matchedCustomer, existingCustomers]);

  const bookingSummary = useMemo(() => {
    const basePrice = Number(
      activeProduct.rentalPrice || (activeProduct as any).listingPrice || 0,
    );
    const offer = applicableOffers.find(
      (item: any) => item.id === selectedOfferId,
    );
    const beforePromo =
      offer?.offerPrice && Number(offer.offerPrice) > 0
        ? Number(offer.offerPrice)
        : basePrice;
    const promo = activePromoCodes.find(
      (item: any) =>
        (item.id || item.code) === selectedPromoCode ||
        item.code === selectedPromoCode,
    );
    let discount = 0;
    const type = String(promo?.type || "").toLowerCase();
    if (promo && (type === "percent" || type === "percentage"))
      discount = (beforePromo * Number(promo.value || 0)) / 100;
    if (promo && (type === "flat" || type === "fixed"))
      discount = Number(promo.value || 0);
    if (promo?.maxDiscount != null)
      discount = Math.min(discount, Number(promo.maxDiscount));
    discount = Math.max(0, Math.min(Math.round(discount), beforePromo));
    const deposit = Number(activeProduct.securityDeposit || 0);
    return {
      beforePromo,
      discount,
      rental: Math.max(0, beforePromo - discount),
      deposit,
      total: Math.max(0, beforePromo - discount) + deposit,
    };
  }, [
    activeProduct,
    applicableOffers,
    activePromoCodes,
    selectedOfferId,
    selectedPromoCode,
  ]);

  // --- Helper to generate days for ANY month ---
  const generateDaysForMonth = (year: number, month: number) => {
    const firstOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = firstOfMonth.getDay();

    const days: DayInfo[] = [];
    for (let i = 0; i < startOffset; i++) {
      days.push({
        date: new Date(NaN),
        type: "muted",
        isToday: false,
        isPast: false,
      });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStart = parseToStartOfDay(date);
      let type: DayType = "available";
      let label: string | undefined;
      const isPast = dateStart < today;

      const manualBlock = blockedDates.find((b) => {
        const from = parseToStartOfDay(b.from);
        const to = parseToStartOfDay(b.to);
        return dateStart >= from && dateStart <= to;
      });
      const rental = activeBookings.find(
        (b) => dateStart >= b.start && dateStart <= b.end,
      );
      const inBuffer = activeBookings.some((b) => {
        if (b.isRental === false || String(b.mode || "Rental").toLowerCase() !== "rental") {
          return false;
        }
        const preStart = addDays(b.start, -preBufferDays);
        const preEnd = addDays(b.start, -1);
        const postStart = addDays(b.end, 1);
        const postEnd = addDays(b.end, postBufferDays);
        return (
          (dateStart >= preStart && dateStart <= preEnd) ||
          (dateStart >= postStart && dateStart <= postEnd)
        );
      });

      if (rental) {
        type = "rental";
        label = initialsFromName(rental.customerName || "");
      } else if (manualBlock) {
        type = "blocked";
      } else if (inBuffer) {
        type = "buffer";
      } else {
        type = "available";
      }

      days.push({ date, type, label, isToday: isSameDay(date, today), isPast });
    }
    return {
      days,
      monthLabel: firstOfMonth.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      }),
    };
  };

  // Generate data for both calendars
  const bigCalendar = generateDaysForMonth(viewYear, viewMonth);
  const smallCalendar = generateDaysForMonth(smallViewYear, smallViewMonth);

  // --- Change Month Handlers ---
  const changeMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  };
  const changeSmallMonth = (delta: number) => {
    let m = smallViewMonth + delta;
    let y = smallViewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    if (m > 11) {
      m = 0;
      y += 1;
    }
    setSmallViewMonth(m);
    setSmallViewYear(y);
  };

  const dayCellClasses = (type: DayType, isSmall: boolean = false) => {
    const baseSize = isSmall ? "h-7 text-[9px]" : "h-10 text-[12px]";
    switch (type) {
      case "available":
        return `bg-emerald-100/70 text-emerald-900 hover:bg-emerald-200/70 border border-transparent hover:border-emerald-300 ${baseSize}`;
      case "rental":
        return `bg-[#a8492f] text-white font-semibold border border-[#a8492f] ${baseSize}`;
      case "buffer":
        return `text-amber-800 border border-stone-200 ${baseSize}`;
      case "blocked":
        return `text-stone-600 border border-stone-200 ${baseSize}`;
      default:
        return `bg-stone-50 text-stone-300 border border-stone-100 ${baseSize}`;
    }
  };

  const dayCellStyle = (type: DayType): React.CSSProperties => {
    if (type === "buffer")
      return {
        backgroundImage:
          "repeating-linear-gradient(45deg, #fde9c8, #fde9c8 4px, #fbd9a0 4px, #fbd9a0 8px)",
      };
    if (type === "blocked")
      return {
        backgroundImage:
          "repeating-linear-gradient(45deg, #e7e5e4, #e7e5e4 4px, #d6d3d1 4px, #d6d3d1 8px)",
      };
    return {};
  };

  // --- Overlap Validation ---
  const checkOverlapError = (
    fromDateStr: string,
    toDateStr: string,
  ): string | null => {
    const start = parseToStartOfDay(fromDateStr);
    const end = parseToStartOfDay(toDateStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime()))
      return "Please select valid From and To dates.";
    if (end < start) return "To date cannot be earlier than From date.";

    for (const b of activeBookings) {
      const bStart = parseToStartOfDay(b.startDate || b.start);
      const bEnd = parseToStartOfDay(b.endDate || b.end);
      const isRent =
        b.isRental !== false &&
        String(b.mode || "Rental").toLowerCase() === "rental";
      const bPostEnd = isRent ? addDays(bEnd, postBufferDays) : bEnd;

      if (start <= bPostEnd && end >= bStart) {
        return `Selected dates overlap with booking for ${b.customerName || "customer"} (${b.orderId || "existing order"})${isRent ? " or its cleaning buffer" : ""}. Only available dates can be booked.`;
      }
    }

    for (const b of blockedDates) {
      const bStart = parseToStartOfDay(b.from);
      const bEnd = parseToStartOfDay(b.to);
      if (start <= bEnd && end >= bStart) {
        return `Selected dates overlap with blocked range (${b.reason || "Blocked"}). Only available dates can be booked.`;
      }
    }

    return null;
  };

  // --- Actions ---
  const resetForm = () => {
    setBlockFrom("");
    setBlockTo("");
    setCustomerName("");
    setWhatsappNumber("");
    setCity("");
    setChannel(CHANNEL_OPTIONS[0]);
    setListerSplit(45);
    setSplitNote("");
    setSelectedOfferId("");
    setSelectedPromoCode("");
  };

  const handleBlockManualDates = async () => {
    if (!blockFrom || !blockTo) {
      toast.error("Please choose a from and to date.");
      return;
    }
    const overlapErr = checkOverlapError(blockFrom, blockTo);
    if (overlapErr) {
      toast.error(overlapErr);
      return;
    }

    setSubmitting(true);
    try {
      const targetId =
        activeProduct.productId ||
        (activeProduct as any)._id ||
        activeProduct.id;
      const res = await productSectionsApi.addBlockedDate(targetId, {
        from: blockFrom,
        to: blockTo,
        reason: reasonMeta.label,
      });
      const updatedBlockedDates = [
        ...blockedDates,
        res || { from: blockFrom, to: blockTo, reason: reasonMeta.label },
      ];

      const updatedProd = {
        ...activeProduct,
        blockedDates: updatedBlockedDates,
      };

      setLocalProduct(updatedProd);
      onUpdateProduct(updatedProd);
      resetForm();
      toast.success("Dates blocked successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to block these dates",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateOffer = async () => {
    if (!selectedOfferId) return;
    try {
      const originalOffer =
        databaseOffers?.find((o) => o.id === selectedOfferId) ||
        offers.find((o) => o.id === selectedOfferId);
      const updatedOffer = await offerApi.updateOffer(
        selectedOfferId,
        {
          ...editOfferData,
          productName: originalOffer?.productName || activeProduct.name,
          marketPrice: originalOffer?.marketPrice || activeProduct.rentalPrice,
        },
        originalOffer?.backendId,
      );
      setDatabaseOffers((prev) =>
        prev
          ? prev.map((o) =>
              o.id === selectedOfferId
                ? {
                    ...o,
                    ...editOfferData,
                    offerPrice: editOfferData.offerPrice,
                  }
                : o,
            )
          : null,
      );
      setCustomerName(editOfferData.customerName);
      setWhatsappNumber(editOfferData.phone);
      setIsEditingOffer(false);
      toast.success("Offer updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update offer");
    }
  };

  const handleCreateExternalOrder = async () => {
    if (!blockFrom || !blockTo || !customerName || !whatsappNumber) {
      toast.error(
        "From date, to date, customer name and WhatsApp number are required.",
      );
      return;
    }

    // Customer validation for selected Offer
    if (selectedOfferId) {
      const offer = (databaseOffers ?? offers ?? []).find(
        (o: any) => o.id === selectedOfferId || o.offerId === selectedOfferId,
      );
      if (offer && offer.customerName) {
        const oName = offer.customerName.trim().toLowerCase();
        const cName = customerName.trim().toLowerCase();
        if (oName && cName && !cName.includes(oName) && !oName.includes(cName)) {
          toast.error(
            `Offer "${offer.id || offer.offerId}" is only valid for ${offer.customerName}. It cannot be applied to ${customerName}.`,
          );
          return;
        }
      }
    }

    // Customer validation for selected Promo Code
    if (selectedPromoCode) {
      const promo = (databasePromoCodes ?? promoCodes ?? []).find(
        (p: any) => p.id === selectedPromoCode || p.code === selectedPromoCode,
      );
      if (promo) {
        const pCodeUpper = String(promo.code || "").toUpperCase();
        const cNameUpper = customerName.trim().toUpperCase();
        for (const cust of existingCustomers) {
          const custNameUpper = String(cust.name || "").trim().toUpperCase();
          if (custNameUpper && custNameUpper.length >= 3 && pCodeUpper.includes(custNameUpper)) {
            if (!cNameUpper.includes(custNameUpper)) {
              toast.error(`Promo code "${promo.code}" is valid only for ${cust.name}.`);
              return;
            }
          }
        }
      }
    }
    const overlapErr = checkOverlapError(blockFrom, blockTo);
    if (overlapErr) {
      toast.error(overlapErr);
      return;
    }
    setSubmitting(true);
    try {
      let finalAmount = Number(activeProduct.rentalPrice || 8500);
      let appliedOffer = null;
      let appliedPromo = null;

      if (selectedOfferId) {
        appliedOffer = offers.find((o) => o.id === selectedOfferId);
        if (appliedOffer && appliedOffer.offerPrice) {
          finalAmount = appliedOffer.offerPrice;
        }
      }
      if (selectedPromoCode) {
        appliedPromo = activePromoCodes.find(
          (p) => p.id === selectedPromoCode || p.code === selectedPromoCode,
        );
        if (appliedPromo) {
          if (appliedPromo.type === "fixed") {
            finalAmount = Math.max(0, finalAmount - appliedPromo.value);
          } else if (appliedPromo.type === "percentage") {
            finalAmount = Math.max(
              0,
              finalAmount - finalAmount * (appliedPromo.value / 100),
            );
          }
        }
      }

      const targetId =
        activeProduct.productId ||
        (activeProduct as any)._id ||
        activeProduct.id;
      const res = await productSectionsApi.addExternalBooking(targetId, {
        customerId: matchedCustomer?.customerId || undefined,
        customerName: matchedCustomer?.name || customerName,
        customerEmail: matchedCustomer?.email || undefined,
        startDate: blockFrom,
        endDate: blockTo,
        amount: finalAmount,
        whatsappNumber,
        city,
        channel,
        listerSplitPercent: listerSplit,
        splitNote,
        offerId: selectedOfferId || undefined,
        promoCode: selectedPromoCode || undefined,
      } as any);

      const resData = res?.data || res;
      const finalOrderId =
        resData.orderId || resData.bookingEntry?.orderId || resData.order?.id;
      const updatedBookingHistory = resData.bookingHistory || [
        ...(activeProduct.bookingHistory || []),
        { ...(resData.bookingEntry || resData), orderId: finalOrderId },
      ];
      const updatedBlockedDates =
        resData.blockedDates || activeProduct.blockedDates || [];
      const updatedExternalBookings = resData.externalBookings || [
        ...(activeProduct.externalBookings || []),
        { ...(resData.bookingEntry || resData), orderId: finalOrderId },
      ];
      const updatedActivityLog =
        resData.activityLog || activeProduct.activityLog || [];

      const updatedProd = {
        ...activeProduct,
        blockedDates: updatedBlockedDates,
        bookingHistory: updatedBookingHistory,
        externalBookings: updatedExternalBookings,
        activityLog: updatedActivityLog,
        timesRented:
          resData.timesRented || (activeProduct.timesRented || 0) + 1,
      };

      if (resData.order && onAddOrder) {
        onAddOrder(resData.order);
      }

      // Instant Local State update (No page refresh needed!)
      setLocalProduct(updatedProd);
      onUpdateProduct(updatedProd);

      resetForm();
      const finalCustName = resData.customer?.name || customerName;
      const finalCustId =
        resData.customer?.customerId || resData.customer?.id || "Created";
      const finalOrderCnt = resData.customer?.ordersCount ?? 1;
      toast.success(
        `Reservation saved & order created! Order: ${finalOrderId} · Customer: ${finalCustName} (${finalCustId}) · Total Orders: ${finalOrderCnt}`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to reserve these dates",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --- Render ---
  return (
    <div className="space-y-6">
      {/* Auto-block logic banner */}
      <div className="rounded-md border border-amber-200/70 bg-amber-50/60 p-3 flex gap-2">
        <span className="text-amber-500 text-sm leading-none">&#9432;</span>
        <p className="text-xs text-stone-600 leading-relaxed">
          <span className="font-semibold text-stone-800">
            Auto-block logic:
          </span>{" "}
          blocked {preBufferDays} days before dispatch and {postBufferDays} days
          after return.
        </p>
      </div>

      {/* Grid divides screen into Big Left (2/3) & Right Details (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT SIDE: Main Calendar ================= */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-sm">
                {editingProduct.name}
              </h3>
              <p className="text-xs text-stone-400">
                {editingProduct.designer} &middot; {(editingProduct as any).sku}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenGlobalCalendar}
              className="whitespace-nowrap rounded border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
            >
              Global Calendar &rarr;
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => changeMonth(-1)}
              className="w-7 h-7 flex items-center justify-center rounded border border-stone-200 text-stone-500 hover:bg-stone-50 transition"
            >
              &larr;
            </button>
            <p className="font-serif font-bold text-stone-800 text-sm">
              {bigCalendar.monthLabel}
            </p>
            <button
              onClick={() => changeMonth(1)}
              className="w-7 h-7 flex items-center justify-center rounded border border-stone-200 text-stone-500 hover:bg-stone-50 transition"
            >
              &rarr;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center max-w-[500px] mx-auto">
            {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
              <div
                key={d}
                className="text-[10px] font-semibold text-stone-400 pb-1"
              >
                {d}
              </div>
            ))}
            {bigCalendar.days.map((day, idx) => (
              <button
                key={idx}
                disabled={isNaN(day.date.getTime())}
                onClick={() => {
                  setSelectedDate(day.date);
                  if (day.isPast) {
                    toast("Past dates cannot be booked.", { icon: "ℹ️" });
                    return;
                  }
                  if (day.type === "rental") {
                    toast.error("This date is already booked!");
                  } else if (day.type === "buffer") {
                    toast.error(
                      "This date is in cleaning buffer - not available!",
                    );
                  } else if (day.type === "blocked") {
                    toast.error("This date is manually blocked!");
                  }
                }}
                className={`relative flex items-center justify-center w-full rounded transition-all ${isNaN(day.date.getTime()) ? "invisible" : "cursor-pointer hover:scale-105 shadow-sm"} ${dayCellClasses(day.type)} ${day.isToday ? "ring-2 ring-stone-800 ring-offset-1" : ""} ${day.isPast ? "opacity-40" : ""}`}
                style={dayCellStyle(day.type)}
              >
                {!isNaN(day.date.getTime()) && (
                  <>
                    <span>{day.date.getDate()}</span>
                    {day.label && (
                      <span className="absolute -top-1 -right-1 bg-white rounded-full px-1 text-[8px] font-bold text-stone-700 border border-stone-200">
                        {day.label}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ================= RIGHT SIDE: Right Panel ================= */}
        <div className="flex flex-col gap-4">
          {/* 1. Availability (Small Calendar) */}
          <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-serif font-bold text-stone-800 text-xs">
                Availability
              </h4>
              <div className="flex gap-1">
                <button
                  onClick={() => changeSmallMonth(-1)}
                  className="p-0.5 rounded hover:bg-stone-100 border border-transparent hover:border-stone-200"
                >
                  <ChevronLeft className="w-3 h-3 text-stone-500" />
                </button>
                <button
                  onClick={() => changeSmallMonth(1)}
                  className="p-0.5 rounded hover:bg-stone-100 border border-transparent hover:border-stone-200"
                >
                  <ChevronRight className="w-3 h-3 text-stone-500" />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-stone-400 -mt-1">
              {smallCalendar.monthLabel}
            </p>

            {/* Small Grid */}
            <div className="grid grid-cols-7 gap-1 text-center mt-2">
              {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
                <div
                  key={d}
                  className="text-[8px] font-semibold text-stone-400 pb-0.5"
                >
                  {d}
                </div>
              ))}
              {smallCalendar.days.map((day, idx) => (
                <button
                  key={idx}
                  disabled={isNaN(day.date.getTime())}
                  onClick={() => {
                    setSelectedDate(day.date);
                    setViewMonth(day.date.getMonth());
                    setViewYear(day.date.getFullYear());
                    if (day.isPast) {
                      toast("Past dates cannot be booked.", { icon: "ℹ️" });
                      return;
                    }
                    if (day.type === "rental") {
                      toast.error("This date is already booked!");
                    } else if (day.type === "buffer") {
                      toast.error(
                        "This date is in cleaning buffer - not available!",
                      );
                    } else if (day.type === "blocked") {
                      toast.error("This date is manually blocked!");
                    }
                  }}
                  className={`relative flex items-center justify-center rounded transition-all ${isNaN(day.date.getTime()) ? "invisible" : "cursor-pointer hover:opacity-80"} ${dayCellClasses(day.type, true)} ${day.isToday ? "ring-1 ring-stone-800 ring-offset-1" : ""} ${day.isPast ? "opacity-40" : ""}`}
                  style={dayCellStyle(day.type)}
                >
                  {!isNaN(day.date.getTime()) && (
                    <span>{day.date.getDate()}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Selected Date Details */}
          <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm flex-grow">
            {selectedDate && !isNaN(selectedDate.getTime()) ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-700 border-b border-stone-100 pb-1 mb-1">
                  {selectedDate.toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                {(() => {
                  const info = bigCalendar.days.find(
                    (d) =>
                      !isNaN(d.date.getTime()) &&
                      isSameDay(d.date, selectedDate),
                  );
                  if (!info) return null;
                  if (info.type === "rental") {
                    const booking = activeBookings.find(
                      (b) => selectedDate >= b.start && selectedDate <= b.end,
                    );
                    const rawOrderId = String(booking?.orderId || "-");
                    const displayOrderId = rawOrderId.startsWith("HOK-")
                      ? rawOrderId
                      : rawOrderId.startsWith("EXT-")
                        ? rawOrderId
                        : rawOrderId !== "-"
                          ? `HOK-ORD-${String(rawOrderId).padStart(3, "0")}`
                          : "-";
                    const modeLabel = booking?.mode || "Rental";
                    const isRent =
                      String(modeLabel).toLowerCase() === "rental" &&
                      booking?.isRental !== false;

                    return (
                      <div className="text-[11px] text-stone-600 space-y-1">
                        <p>
                          <span className="font-semibold text-stone-800">
                            Renter:
                          </span>{" "}
                          {booking?.customerName}
                        </p>
                        <p>
                          <span className="font-semibold text-stone-800">
                            Order:
                          </span>{" "}
                          {displayOrderId}
                        </p>
                      </div>
                    );
                  }
                  if (info.type === "buffer")
                    return (
                      <p className="text-[11px] text-amber-700">
                        ⏳ Buffer &mdash; Not bookable.
                      </p>
                    );
                  if (info.type === "blocked")
                    return (
                      <p className="text-[11px] text-stone-500">
                        🔒 Manually blocked.
                      </p>
                    );
                  return (
                    <p className="text-[11px] text-emerald-700">
                      ✅ Available for rental.
                    </p>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-stone-400 py-4">
                <CalendarDays className="w-5 h-5 text-stone-300 mb-1" />
                <p className="text-[11px]">Select a date</p>
              </div>
            )}
          </div>

          {/* 3. Quick Actions */}
          <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm space-y-2">
            <h4 className="font-serif font-bold text-stone-800 text-xs mb-2">
              Quick Actions
            </h4>
            <button
              onClick={() =>
                window.open(`/product/${editingProduct.urlSlug}`, "_blank")
              }
              className="flex items-center gap-2 w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded text-[11px] font-medium text-stone-700 hover:bg-stone-100 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Live Site
            </button>
            <button
              onClick={onOpenGlobalCalendar}
              className="flex items-center gap-2 w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded text-[11px] font-medium text-stone-700 hover:bg-stone-100 transition"
            >
              <CalendarDays className="w-3.5 h-3.5" /> Global Calendar
            </button>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM: Block Forms & External Bookings ================= */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-stone-900 text-sm">
          Block Dates &amp; External Bookings
        </h3>
        <p className="text-xs text-stone-500">
          Block dates for external bookings (Instagram, in-person enquiries),
          maintenance, alterations, or cleaning beyond the automatic buffer.
          Blocks apply to the calendar above immediately.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">
              From Date
            </label>
            <input
              type="date"
              value={blockFrom}
              onChange={(e) => setBlockFrom(e.target.value)}
              className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">
              To Date
            </label>
            <input
              type="date"
              value={blockTo}
              onChange={(e) => setBlockTo(e.target.value)}
              className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">
            Reason
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
          >
            {REASON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {isExternalBooking && (
          <div className="space-y-3 pt-2">
            <div className="rounded-md border border-amber-200/70 bg-amber-50/60 p-3">
              <p className="text-xs text-stone-600 font-medium">
                An external booking is a real reservation &mdash; HOK reserves
                these dates by creating an order, so deposit, GST, lister payout
                and dispatch are all tracked. There is no date-block without an
                order on this path.
              </p>
            </div>

            {false && customerMode === "existing" && (
              <div className="space-y-2 bg-stone-50/80 p-3 rounded-md border border-stone-200/80">
                <label className="text-stone-600 font-semibold text-[11px] flex items-center justify-between">
                  <span>Select Registered Customer *</span>
                  <span className="text-[10px] text-stone-400 font-normal">
                    Auto-links order & increases customer order count
                  </span>
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => {
                    const cId = e.target.value;
                    setSelectedCustomerId(cId);
                    const found = customerList.find(
                      (c) => (c.customerId || c.id) === cId,
                    );
                    if (found) {
                      setCustomerName(found.name || "");
                      setWhatsappNumber(found.phone || "");
                      setCity(found.location || found.address || "");
                    }
                  }}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded text-xs font-medium focus:ring-1 focus:ring-stone-700"
                >
                  <option value="">
                    -- Choose Existing Customer ({customerList.length}{" "}
                    registered) --
                  </option>
                  {customerList.map((c: any) => (
                    <option
                      key={c.customerId || c.id}
                      value={c.customerId || c.id}
                    >
                      {c.customerId || c.id} - {c.name}{" "}
                      {c.phone ? `(${c.phone})` : ""} - {c.ordersCount || 0}{" "}
                      order(s) - ₹{(c.totalSpent || 0).toLocaleString("en-IN")}{" "}
                      spent
                    </option>
                  ))}
                </select>

                {selectedCustomerId &&
                  (() => {
                    const activeCust = customerList.find(
                      (c) => (c.customerId || c.id) === selectedCustomerId,
                    );
                    if (!activeCust) return null;
                    return (
                      <div className="bg-emerald-50/90 border border-emerald-200 rounded p-2.5 text-xs text-emerald-900 flex items-center justify-between">
                        <div>
                          <span className="font-bold">{activeCust.name}</span>{" "}
                          <span className="font-mono text-[11px] text-emerald-700 font-semibold">
                            ({activeCust.customerId || activeCust.id})
                          </span>
                          <span className="text-emerald-700 block text-[11px] mt-0.5">
                            📱 {activeCust.phone || "No phone"} · 📍{" "}
                            {activeCust.location || "India"} · 📦{" "}
                            {activeCust.ordersCount || 0} order(s) currently ·
                            💰 ₹
                            {(activeCust.totalSpent || 0).toLocaleString(
                              "en-IN",
                            )}{" "}
                            total spent
                          </span>
                        </div>
                        <span className="bg-emerald-200/90 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                          Customer Linked
                        </span>
                      </div>
                    );
                  })()}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">
                  Customer Name *
                </label>
                <input
                  type="text"
                  list="registered-customers-list"
                  placeholder="As shared on chat (type name to auto-fill)"
                  value={customerName}
                  onChange={(e) => handleCustomerNameChange(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                />
                <datalist id="registered-customers-list">
                  {existingCustomers.map((c: any) => (
                    <option key={c.customerId || c._id} value={c.name}>
                      {c.phone ? `${c.phone} • ` : ""}{c.email || c.customerId}
                    </option>
                  ))}
                </datalist>
                {matchedCustomer && (
                  <p className="text-[11px] text-emerald-700 font-medium bg-emerald-50 border border-emerald-200/60 rounded px-2 py-0.5 mt-1">
                    ✓ Auto-filled: {matchedCustomer.name} ({matchedCustomer.email}) • Ph: {matchedCustomer.phone}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">
                  WhatsApp Number *
                </label>
                <input
                  type="text"
                  placeholder="+91 ..."
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">
                  City
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">
                  Channel
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                >
                  {CHANNEL_OPTIONS.map((ch) => (
                    <option key={ch} value={ch}>
                      {ch}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Smart detection: if user types a number matching existing customer */}
            {false &&
              !selectedCustomerId &&
              whatsappNumber.replace(/\D/g, "").length >= 6 &&
              (() => {
                const cleanIn = whatsappNumber.replace(/\D/g, "");
                const detected = customerList.find((c) => {
                  const cP = (c.phone || "").replace(/\D/g, "");
                  return (
                    cP &&
                    (cP === cleanIn ||
                      cP.endsWith(cleanIn) ||
                      cleanIn.endsWith(cP))
                  );
                });
                if (!detected) return null;
                return (
                  <div className="bg-amber-50 border border-amber-200 rounded p-2.5 text-xs text-amber-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold">
                        Existing customer found:
                      </span>{" "}
                      {detected.name} ({detected.customerId || detected.id})
                      <span className="block text-[11px] text-amber-700">
                        Has {detected.ordersCount || 0} order(s) · ₹
                        {(detected.totalSpent || 0).toLocaleString("en-IN")}{" "}
                        spent
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCustomerId(
                          detected.customerId || detected.id,
                        );
                        setCustomerName(detected.name || "");
                        setWhatsappNumber(detected.phone || "");
                        setCity(detected.location || detected.address || "");
                        setCustomerMode("existing");
                      }}
                      className="bg-amber-700 hover:bg-amber-800 text-white font-semibold text-[11px] px-2.5 py-1 rounded cursor-pointer"
                    >
                      Link This Customer →
                    </button>
                  </div>
                );
              })()}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide flex justify-between">
                  <span>Apply Offer</span>
                  {selectedOfferId && (
                    <button
                      type="button"
                      onClick={() => {
                        const offer = applicableOffers.find(
                          (item: any) => item.id === selectedOfferId,
                        );
                        if (offer) {
                          setEditOfferData({
                            customerName: offer.customerName || "",
                            phone: offer.phone || "",
                            customerEmail: offer.customerEmail || "",
                            offerPrice: offer.offerPrice || 0,
                          });
                          setIsEditingOffer(!isEditingOffer);
                        }
                      }}
                      className="text-[#8c3523] hover:underline cursor-pointer"
                    >
                      {isEditingOffer ? "Cancel Edit" : "Edit Selected Offer"}
                    </button>
                  )}
                </label>
                <select
                  value={selectedOfferId}
                  onChange={(e) => {
                    const offerId = e.target.value;
                    setSelectedOfferId(offerId);
                    setIsEditingOffer(false);
                    const offer = applicableOffers.find(
                      (item: any) => item.id === offerId,
                    );
                    if (offer) {
                      setCustomerName(offer.customerName || "");
                      setWhatsappNumber(offer.phone || "");
                      setSelectedCustomerId("");
                      setCustomerMode("new");
                    }
                  }}
                  className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                >
                  <option value="">No Offer</option>
                  {applicableOffers.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} - {o.customerName} (₹{o.offerPrice})
                    </option>
                  ))}
                </select>

                {isEditingOffer && selectedOfferId && (
                  <div className="p-3 mt-2 border border-[#8c3523]/30 bg-orange-50/50 rounded-md space-y-2 relative z-10">
                    <p className="text-[10px] uppercase font-bold text-[#8c3523]">
                      Edit Offer Details
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={editOfferData.customerName}
                        onChange={(e) =>
                          setEditOfferData({
                            ...editOfferData,
                            customerName: e.target.value,
                          })
                        }
                        className="w-full p-1.5 bg-white border border-stone-200 rounded text-[11px]"
                      />
                      <input
                        type="text"
                        placeholder="Phone"
                        value={editOfferData.phone}
                        onChange={(e) =>
                          setEditOfferData({
                            ...editOfferData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full p-1.5 bg-white border border-stone-200 rounded text-[11px]"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={editOfferData.customerEmail}
                        onChange={(e) =>
                          setEditOfferData({
                            ...editOfferData,
                            customerEmail: e.target.value,
                          })
                        }
                        className="w-full p-1.5 bg-white border border-stone-200 rounded text-[11px]"
                      />
                      <input
                        type="number"
                        placeholder="Offer Price (₹)"
                        value={editOfferData.offerPrice || ""}
                        onChange={(e) =>
                          setEditOfferData({
                            ...editOfferData,
                            offerPrice: Number(e.target.value),
                          })
                        }
                        className="w-full p-1.5 bg-white border border-stone-200 rounded text-[11px]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleUpdateOffer}
                      className="w-full bg-[#8c3523] text-white py-1.5 rounded text-[11px] font-bold hover:bg-[#722a1b]"
                    >
                      Save & Update Offer
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">
                  Apply Promo Code
                </label>
                <select
                  value={selectedPromoCode}
                  onChange={(e) => setSelectedPromoCode(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                >
                  <option value="">No Promo Code</option>
                  {activePromoCodes.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.code} (
                      {p.type === "fixed" ? `₹${p.value}` : `${p.value}%`})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(selectedOfferId || selectedPromoCode) && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 rounded-md border border-stone-200 bg-stone-50 p-3 text-xs">
                <div>
                  <span className="block text-[10px] uppercase text-stone-400">
                    Base / offer
                  </span>
                  <b>₹{bookingSummary.beforePromo.toLocaleString("en-IN")}</b>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-stone-400">
                    Promo discount
                  </span>
                  <b className="text-rose-600">
                    ₹{bookingSummary.discount.toLocaleString("en-IN")}
                  </b>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-stone-400">
                    Rental payable
                  </span>
                  <b>₹{bookingSummary.rental.toLocaleString("en-IN")}</b>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-stone-400">
                    Refundable deposit
                  </span>
                  <b>₹{bookingSummary.deposit.toLocaleString("en-IN")}</b>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-stone-400">
                    Total to collect
                  </span>
                  <b className="text-emerald-700">
                    ₹{bookingSummary.total.toLocaleString("en-IN")}
                  </b>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">
                  Lister Split % (This Transaction)
                </label>
                <input
                  type="number"
                  value={listerSplit}
                  onChange={(e) => setListerSplit(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-500 font-medium text-[10px] uppercase tracking-wide">
                  Why This % (Internal)
                </label>
                <input
                  type="text"
                  placeholder="e.g. couture demand - 8th rental, fair condition"
                  value={splitNote}
                  onChange={(e) => setSplitNote(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded text-xs"
                />
              </div>
            </div>

            <div className="rounded-md border border-stone-200 bg-stone-50 p-3 space-y-1">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">
                Decision Context
              </p>
              <p className="text-xs text-stone-700">
                Last split{" "}
                {lastSplitBooking
                  ? `${Math.max(0, Number(lastSplitBooking.listerSplitPercent))}%`
                  : "0%"}
                {lastSplitBooking
                  ? ` (Rental #${rentalCount} · ${new Date(lastSplitBooking.startDate || lastSplitBooking.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })})`
                  : ""}{" "}
                &middot; piece avg {averageSplit}% &middot; default{" "}
                {defaultSplit}% &middot; condition {productCondition} &middot;
                rented {rentalCount}&times;
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1 pt-2">
          <button
            type="button"
            onClick={
              isExternalBooking
                ? handleCreateExternalOrder
                : handleBlockManualDates
            }
            disabled={submitting}
            className="w-fit rounded-md bg-[#8c3523] hover:bg-[#722a1b] text-white text-xs font-bold px-4 py-2.5 transition disabled:opacity-50"
          >
            {isExternalBooking
              ? submitting
                ? "Reserving..."
                : "Reserve Dates & Create Order \u2192"
              : "Block These Dates"}
          </button>
          <p className="text-[10px] text-stone-400 font-medium">
            No manual blocks on this piece &mdash; only automatic buffers apply.
          </p>
        </div>
      </div>

      {/* ================= ORDER HISTORY FOR THIS PIECE ================= */}
      <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-sm">
              Order History for This Piece
            </h3>
            <p className="text-xs text-stone-500">
              Tracked orders, rental periods, revenue, deposit status, and order
              management.
            </p>
          </div>
        </div>

        {(() => {
          const displayList = [...combinedProductBookings].sort((a: any, b: any) => {
            const da = parseToStartOfDay(
              a.orderDate || a.startDate || a.rentalStartDate,
            ).getTime();
            const db = parseToStartOfDay(
              b.orderDate || b.startDate || b.rentalStartDate,
            ).getTime();
            return (isNaN(db) ? 0 : db) - (isNaN(da) ? 0 : da);
          });

          if (displayList.length === 0) {
            return (
              <p className="text-stone-400 text-xs py-4 text-center">
                No orders recorded for this piece yet.
              </p>
            );
          }

          const fmtPieceDate = (val: any) => {
            if (!val) return "";
            const d = parseToStartOfDay(val);
            if (isNaN(d.getTime())) return String(val);
            return d.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
          };

          return (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700 border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-[10px] uppercase tracking-wider font-semibold text-stone-400 bg-stone-50/50">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Dates</th>
                    <th className="py-2.5 px-3">Revenue</th>
                    <th className="py-2.5 px-3">Deposit</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {displayList.map((item: any, idx: number) => {
                    const displayOrderId =
                      item.orderId || item.id || item.orderNumber || "-";

                    const masterOrder =
                      (orders || []).find(
                        (o: any) =>
                          o.id === displayOrderId ||
                          o.orderNumber === displayOrderId ||
                          o.orderId === displayOrderId,
                      ) || item;

                    const firstIt = masterOrder.items?.[0] || {};
                    const customerNameVal =
                      masterOrder.customerName ||
                      item.customerName ||
                      "Customer";
                    const modeVal =
                      firstIt.mode ||
                      masterOrder.mode ||
                      item.mode ||
                      "Rental";
                    const rStart =
                      masterOrder.rentalStartDate ||
                      firstIt.rentalStartDate ||
                      item.rentalStartDate ||
                      (String(modeVal).toLowerCase() === "rental"
                        ? item.startDate
                        : "");
                    const rEnd =
                      masterOrder.rentalEndDate ||
                      firstIt.rentalEndDate ||
                      item.rentalEndDate ||
                      (String(modeVal).toLowerCase() === "rental"
                        ? item.endDate
                        : "");
                    const bookedDateVal =
                      item.orderBookedYMD ||
                      masterOrder.orderDate ||
                      masterOrder.createdAt ||
                      item.orderDate ||
                      item.startDate ||
                      "";
                    const isRentalRow =
                      String(modeVal).toLowerCase() === "rental" &&
                      Boolean(rStart);
                    const datesLabel = isRentalRow
                      ? `${fmtPieceDate(rStart)} — ${fmtPieceDate(rEnd || rStart)}`
                      : bookedDateVal
                        ? `Booked: ${fmtPieceDate(bookedDateVal)} (${modeVal})`
                        : modeVal;

                    const amountVal = Number(
                      masterOrder.grandTotal ||
                        masterOrder.amount ||
                        masterOrder.totalAmount ||
                        item.amount ||
                        (isRentalRow
                          ? editingProduct?.rentalPrice
                          : (editingProduct as any)?.listingPrice) ||
                        0,
                    );
                    const revenueFmt = `₹${amountVal.toLocaleString("en-IN")}`;
                    const status =
                      masterOrder.status || item.status || "Confirmed";
                    const deposit = !isRentalRow
                      ? "N/A"
                      : masterOrder.depositStatus ||
                        item.depositStatus ||
                        (status === "Returned"
                          ? "Released"
                          : status === "Partially Returned"
                            ? "Held"
                            : "Pending");

                    return (
                      <tr key={idx} className="hover:bg-stone-50/80 transition">
                        <td className="py-3 px-3">
                          <span className="font-semibold text-stone-900 block">
                            {displayOrderId}
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium block truncate max-w-[140px]">
                            {masterOrder.productName ||
                              firstIt.productName ||
                              editingProduct?.name}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-stone-800">
                          {customerNameVal}
                        </td>
                        <td className="py-3 px-3 text-stone-600">
                          {datesLabel}
                        </td>
                        <td className="py-3 px-3 font-semibold text-stone-900">
                          {revenueFmt}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded ${
                              deposit === "Released"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : deposit === "Held"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            {deposit}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2.5 py-1 text-[10px] font-semibold rounded-full uppercase ${
                              status === "Shipped" || status === "Dispatched"
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : status === "Delivered" ||
                                    status === "Returned" ||
                                    status === "Processed" ||
                                    status === "Complete"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : status === "Cancelled"
                                    ? "bg-rose-50 text-rose-700 border border-rose-100"
                                    : "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onViewOrder?.(displayOrderId)}
                            className="text-stone-700 hover:text-amber-800 font-semibold text-xs transition cursor-pointer"
                          >
                            View &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
