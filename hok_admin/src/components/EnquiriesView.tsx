import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Clock,
  Link2,
  Pause,
  Search,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Customer, Order, Product } from "../types";
import {
  Enquiry,
  EnquiryInterest,
  EnquiryPiece,
  EnquiryStatus,
  convertEnquiry,
  createEnquiry,
  updateEnquiry,
} from "../services/enquiryApi";

interface EnquiriesViewProps {
  enquiries: Enquiry[];
  products: Product[];
  orders: Order[];
  customers: Customer[];
  currentAdminName?: string;
  loading?: boolean;
  onEnquiriesChange: React.Dispatch<React.SetStateAction<Enquiry[]>>;
  onCustomerCreated?: (customer: any) => void;
  onOrderCreated?: (order: any) => void;
  onOfferCreated?: (offer: any) => void;
  onNavigateView?: (view: string) => void;
}

const WhatsAppBadgeIcon = () => (
  <svg className="h-3.5 w-3.5 fill-current shrink-0" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
  </svg>
);

const SOURCES = [
  "WhatsApp",
  "Instagram DM",
  "Phone",
  "Email",
  "In-Person",
  "Website",
];

const INTERESTS: EnquiryInterest[] = [
  "Rent",
  "Buy preloved",
  "Buy new",
  "General",
];

const STATUSES: EnquiryStatus[] = [
  "New",
  "In Conversation",
  "On Hold",
  "Converted",
  "Closed",
];

const parseDay = (raw?: string | null): Date | null => {
  if (!raw) return null;
  const s = String(raw).trim();
  const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymd) return new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const toYMD = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const addDays = (d: Date, n: number): Date => {
  const c = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  c.setDate(c.getDate() + n);
  return c;
};

const fmtFullDate = (raw?: string | null): string => {
  const d = parseDay(raw);
  if (!d) return "";
  return `${d.getDate()} ${d.toLocaleString("en-GB", {
    month: "short",
  })} ${d.getFullYear()}`;
};

const fmtDateTime = (raw?: string | null): string => {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return fmtFullDate(raw);
  const datePart = `${d.getDate()} ${d.toLocaleString("en-GB", {
    month: "short",
  })} ${d.getFullYear()}`;
  const timePart = `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}`;
  return `${datePart}, ${timePart}`;
};

const fmtHoldRange = (sRaw?: string, eRaw?: string): string => {
  const s = parseDay(sRaw);
  const e = parseDay(eRaw);
  if (!s && !e) return "";
  if (s && !e) return fmtFullDate(sRaw);
  if (!s && e) return fmtFullDate(eRaw);
  if (!s || !e) return "";
  const sameMonth =
    s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${s.getDate()} to ${e.getDate()} ${e.toLocaleString("en-GB", {
      month: "short",
    })} ${e.getFullYear()}`;
  }
  return `${s.getDate()} ${s.toLocaleString("en-GB", {
    month: "short",
  })} to ${e.getDate()} ${e.toLocaleString("en-GB", {
    month: "short",
  })} ${e.getFullYear()}`;
};

const statusPillStyle = (st: EnquiryStatus) => {
  switch (st) {
    case "New":
      return "bg-[#faf1de] text-[#946418] border-[#ecd8af]";
    case "In Conversation":
      return "bg-[#e8eefb] text-[#335498] border-[#cddaf4]";
    case "On Hold":
      return "bg-[#f2efe9] text-[#6d655a] border-[#e2dcd1]";
    case "Converted":
      return "bg-[#e3f3e6] text-[#286839] border-[#c5e5cb]";
    case "Closed":
      return "bg-[#fae8e5] text-[#a94432] border-[#f0cbc4]";
    default:
      return "bg-[#f2efe9] text-[#6d655a] border-[#e2dcd1]";
  }
};

type AvailTone = "green" | "red" | "amber" | "muted";

const availBadgeClass = (tone: AvailTone): string => {
  switch (tone) {
    case "green":
      return "bg-[#e5f3e7] text-[#266537]";
    case "amber":
      return "bg-[#fdf1dc] text-[#946114]";
    case "muted":
      return "bg-[#f2efe9] text-[#7a7165]";
    case "red":
    default:
      return "bg-[#fbe9e5] text-[#b4442e]";
  }
};

interface PieceOptionItem {
  id: string;
  name: string;
  designer: string;
  sku?: string;
  image?: string;
  priceText: string;
  avail?: { label: string; tone: AvailTone } | null;
}

function SearchablePiecePicker({
  value,
  onChange,
  options,
  emptyLabel,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  options: PieceOptionItem[];
  emptyLabel: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => searchInputRef.current?.focus(), 20);
    }
  }, [open]);

  const selected = useMemo(
    () => options.find((o) => o.id === value) || null,
    [options, value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) =>
      `${o.name} ${o.designer} ${o.sku || ""} ${o.priceText} ${o.avail?.label || ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [options, query]);

  return (
    <div ref={wrapRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-[4px] border border-[#ded6c8] bg-white px-3 py-2 text-left text-[12.5px] text-[#2b2118] outline-none hover:border-[#c8beae] focus:border-[#c08829] cursor-pointer"
      >
        {selected ? (
          <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              {selected.image ? (
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="h-6 w-5 rounded-[2px] object-cover border border-[#e5ddd0] shrink-0 bg-[#2d1e1b]"
                />
              ) : (
                <span className="inline-flex h-6 w-5 items-center justify-center rounded-[2px] bg-[#2d1e1b] text-[10px] text-[#c7a35e] shrink-0">
                  ♢
                </span>
              )}
              <span className="truncate font-medium text-[#2b2118]">
                {selected.name}
                {selected.designer && (
                  <span className="font-normal text-[#8a8073]">
                    {" "}
                    — {selected.designer}
                  </span>
                )}
                {selected.priceText && (
                  <span className="font-normal text-[#6f665a]">
                    {" "}
                    · {selected.priceText}
                  </span>
                )}
              </span>
            </div>
            {selected.avail && (
              <span
                className={`shrink-0 rounded-[3px] px-1.5 py-0.5 text-[9.5px] font-bold uppercase ${availBadgeClass(
                  selected.avail.tone,
                )}`}
              >
                {selected.avail.label}
              </span>
            )}
          </div>
        ) : (
          <span className="truncate text-[#6d655a]">
            {placeholder || emptyLabel}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#8f8679] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-[5px] border border-[#dad1c2] bg-white shadow-[0_8px_24px_rgba(43,33,24,0.12)]">
          {/* Search Input inside Dropdown */}
          <div className="border-b border-[#efe9df] bg-[#fcfaf6] p-2">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[#968d80]" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search piece name, designer or SKU..."
                className="w-full rounded-[4px] border border-[#ded6c8] bg-white py-1.5 pl-8 pr-7 text-[12px] text-[#2b2118] outline-none focus:border-[#c08829]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 text-[#968d80] hover:text-[#2b2118] cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-[#f5f0e7]">
            {/* Clear / None option */}
            {!query.trim() && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-[12px] hover:bg-[#faf6ee] cursor-pointer ${
                  !value ? "bg-[#faf5ea] font-semibold text-[#2b2118]" : "text-[#7d756b]"
                }`}
              >
                <span>{emptyLabel}</span>
              </button>
            )}

            {filtered.length === 0 ? (
              <div className="px-3 py-5 text-center text-[12px] text-[#968d80]">
                No matching pieces found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              filtered.map((opt) => {
                const isPicked = opt.id === value;
                const isBlocked =
                  opt.avail?.tone === "red" || opt.avail?.tone === "amber";
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => {
                      if (isBlocked && !isPicked) {
                        toast.error(
                          `${opt.name} — ${opt.avail?.label}. Please pick an available piece or change the dates.`,
                        );
                        return;
                      }
                      onChange(opt.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer ${
                      isPicked
                        ? "bg-[#faf5ea]"
                        : isBlocked
                          ? "bg-[#fdf9f7] opacity-70"
                          : "hover:bg-[#fcfaf6]"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      {opt.image ? (
                        <img
                          src={opt.image}
                          alt={opt.name}
                          className="h-9 w-7 rounded-[3px] object-cover border border-[#e5ddd0] shrink-0 bg-[#2d1e1b]"
                        />
                      ) : (
                        <div className="h-9 w-7 rounded-[3px] bg-[#2d1e1b] text-[#c7a35e] flex items-center justify-center text-[11px] shrink-0">
                          ♢
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="truncate text-[12.5px] font-semibold text-[#2b2118]">
                          {opt.name}
                        </div>
                        <div className="truncate text-[11px] text-[#8a8073]">
                          {[opt.designer, opt.priceText]
                            .filter(Boolean)
                            .join(" · ")}
                        </div>
                      </div>
                    </div>

                    {opt.avail && (
                      <span
                        className={`shrink-0 rounded-[3px] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide ${availBadgeClass(
                          opt.avail.tone,
                        )}`}
                      >
                        {opt.avail.label}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EnquiriesView({
  enquiries,
  products,
  orders,
  customers,
  currentAdminName = "Soumya",
  loading = false,
  onEnquiriesChange,
  onCustomerCreated,
  onOrderCreated,
  onOfferCreated,
  onNavigateView,
}: EnquiriesViewProps) {
  const [interestFilter, setInterestFilter] = useState<string>("All Interests");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [showLogForm, setShowLogForm] = useState<boolean>(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(
    null,
  );
  const [savingForm, setSavingForm] = useState<boolean>(false);
  const [converting, setConverting] = useState<boolean>(false);

  // Detail card interactive states
  const [pieceToAdd, setPieceToAdd] = useState<string>("");
  const [noteText, setNoteText] = useState<string>("");
  const [editingDates, setEditingDates] = useState<boolean>(false);
  const [editEventDate, setEditEventDate] = useState<string>("");
  const [editHoldStart, setEditHoldStart] = useState<string>("");
  const [editHoldEnd, setEditHoldEnd] = useState<string>("");
  const [showLinkOrderModal, setShowLinkOrderModal] = useState<boolean>(false);
  const [orderToLink, setOrderToLink] = useState<string>("");
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>("");
  const [showFollowUpModal, setShowFollowUpModal] = useState<boolean>(false);
  const [nextFollowUpDate, setNextFollowUpDate] = useState<string>("");
  const [showConvertOfferModal, setShowConvertOfferModal] =
    useState<boolean>(false);
  const [convertOfferAmount, setConvertOfferAmount] = useState<string>("");

  const detailCardRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);

  // Log New Enquiry Form state
  const [formCustomerId, setFormCustomerId] = useState<string>("");
  const [formSource, setFormSource] = useState<string>("WhatsApp");
  const [formName, setFormName] = useState<string>("");
  const [formPhone, setFormPhone] = useState<string>("");
  const [formEmail, setFormEmail] = useState<string>("");
  const [formCity, setFormCity] = useState<string>("");
  const [formInterest, setFormInterest] = useState<EnquiryInterest>("Rent");
  const [formAssigned, setFormAssigned] = useState<string>(currentAdminName);
  const [formPieceId, setFormPieceId] = useState<string>("");
  const [formAlsoPieceId, setFormAlsoPieceId] = useState<string>("");
  const [formEventDate, setFormEventDate] = useState<string>("");
  const [formHoldStart, setFormHoldStart] = useState<string>("");
  const [formHoldEnd, setFormHoldEnd] = useState<string>("");
  const [formFollowUp, setFormFollowUp] = useState<string>("");
  const [formAsked, setFormAsked] = useState<string>("");

  // ── Direct Live Database Sync (Products, Customers, Orders, Admins) ──
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCustomers, setDbCustomers] = useState<any[]>([]);
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbAdmins, setDbAdmins] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    const syncDropdownData = () => {
      fetch("/api/products")
        .then((r) => r.json())
        .then((res) => {
          if (!active) return;
          const list = Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res?.products)
                ? res.products
                : [];
          if (list.length > 0 || products.length === 0) setDbProducts(list);
        })
        .catch(() => {});

      fetch("/api/customers")
        .then((r) => r.json())
        .then((res) => {
          if (!active) return;
          const list = Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
              ? res.data
              : [];
          if (list.length > 0 || customers.length === 0) setDbCustomers(list);
        })
        .catch(() => {});

      fetch("/api/orders")
        .then((r) => r.json())
        .then((res) => {
          if (!active) return;
          const list = Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
              ? res.data
              : [];
          if (list.length > 0 || orders.length === 0) setDbOrders(list);
        })
        .catch(() => {});

      fetch("/api/auth/admins")
        .then((r) => r.json())
        .then((res) => {
          if (!active) return;
          const list = Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res)
              ? res
              : [];
          setDbAdmins(list);
        })
        .catch(() => {});
    };

    syncDropdownData();
    return () => {
      active = false;
    };
  }, [showLogForm, formCustomerId, products.length, customers.length, orders.length]);

  const liveOrders = useMemo(
    () => (dbOrders.length > 0 ? dbOrders : orders),
    [dbOrders, orders],
  );

  // Listed DB products + any piece referenced in active Orders (so a customer's ordered piece is always selectable)
  const listedProducts = useMemo(() => {
    const source = dbProducts.length > 0 ? dbProducts : products;
    const base = (source || []).filter((p: any) => {
      const st = String(p?.status || "").toLowerCase();
      return st !== "deleted";
    });

    const merged = [...base];
    for (const ord of liveOrders as any[]) {
      const st = String(ord?.status || "").toLowerCase();
      if (st === "cancelled" || st === "rejected") continue;
      const items =
        Array.isArray(ord?.items) && ord.items.length > 0 ? ord.items : [ord];
      for (const it of items) {
        const pid = String(it?.productId || ord?.productId || "").trim();
        const pName = String(it?.productName || ord?.productName || "").trim();
        if (!pName) continue;
        const alreadyExists = merged.some(
          (p: any) =>
            (pid &&
              (String(p.productId) === pid ||
                String(p._id) === pid ||
                String(p.id) === pid)) ||
            String(p.name || p.title || "")
              .trim()
              .toLowerCase() === pName.toLowerCase(),
        );
        if (!alreadyExists) {
          const isRent =
            String(it?.mode || ord?.mode || "Rental")
              .toLowerCase()
              .includes("rent");
          const amt = Number(it?.amount || ord?.amount || ord?.grandTotal || 0);
          const img = it?.image || ord?.image || "";
          merged.push({
            id: pid || pName,
            productId: pid || pName,
            name: pName,
            designer: it?.designer || ord?.designer || "",
            images: img ? [img] : [],
            image: img,
            rentalPrice: isRent ? amt : 0,
            listingPrice: !isRent ? amt : 0,
            securityDeposit: Number(it?.deposit || ord?.deposit || 0),
            listingModes: [isRent ? "RENTAL" : String(it?.mode || ord?.mode || "BUY").toUpperCase()],
            status: "Live",
          });
        }
      }
    }

    return merged;
  }, [dbProducts, products, liveOrders]);

  // Keep all listed catalogue products searchable; sort mode-matching pieces first so nothing is ever hidden
  const formListedProducts = useMemo(() => {
    if (formInterest === "General") return listedProducts;
    const isMatch = (p: any): boolean => {
      const modes: string[] = Array.isArray(p.listingModes)
        ? p.listingModes.map((m: any) => String(m).toUpperCase())
        : [];
      if (modes.length === 0) return true;
      if (formInterest === "Rent") {
        return modes.includes("RENTAL") || modes.includes("RENT");
      }
      if (formInterest === "Buy preloved") {
        return modes.includes("PRELOVED") || modes.includes("RE-SELL");
      }
      if (formInterest === "Buy new") {
        return modes.includes("BUY NEW") || modes.includes("BUY");
      }
      return true;
    };
    const primary = listedProducts.filter(isMatch);
    const others = listedProducts.filter((p: any) => !isMatch(p));
    return [...primary, ...others];
  }, [listedProducts, formInterest]);

  const liveCustomers = useMemo(
    () => (dbCustomers.length > 0 ? dbCustomers : customers),
    [dbCustomers, customers],
  );

  const teamMembers = useMemo(() => {
    const base = new Set<string>();
    dbAdmins.forEach((a: any) => {
      if (a?.name) base.add(String(a.name));
    });
    if (currentAdminName) base.add(currentAdminName);
    enquiries.forEach((e) => {
      if (e.assignedTo) base.add(e.assignedTo);
    });
    if (base.size === 0) base.add("Soumya");
    return Array.from(base);
  }, [dbAdmins, currentAdminName, enquiries]);

  const toPieceOptionItem = (
    p: any,
    interest: EnquiryInterest,
    enqCtx: Enquiry,
  ): PieceOptionItem => {
    const pid = String(p.productId || p._id || p.id);
    const title = p.name || p.title || "Untitled Piece";
    const rentAmt = Number(p.rentalPrice || p.perDayRate || 0);
    const saleAmt = Number(p.listingPrice || p.price || 0);
    let priceText = "";
    if (interest === "Rent" && rentAmt > 0) {
      priceText = `₹${rentAmt.toLocaleString("en-IN")}`;
    } else if (
      (interest === "Buy preloved" || interest === "Buy new") &&
      saleAmt > 0
    ) {
      priceText = `₹${saleAmt.toLocaleString("en-IN")}`;
    } else if (rentAmt > 0) {
      priceText = `Rent ₹${rentAmt.toLocaleString("en-IN")}`;
    } else if (saleAmt > 0) {
      priceText = `₹${saleAmt.toLocaleString("en-IN")}`;
    }
    const img =
      (Array.isArray(p.images) && p.images[0]) ||
      (typeof p.image === "string" ? p.image : "") ||
      "";
    const avail = evaluatePieceAvailability(
      { productId: pid, productName: title },
      enqCtx,
      true,
    );
    return {
      id: pid,
      name: title,
      designer: p.designer || "",
      sku: p.sku || p.productId || "",
      image: img,
      priceText,
      avail,
    };
  };

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const todayStr = useMemo(() => toYMD(today), [today]);

  const fmtShortDay = (d: Date): string =>
    `${d.getDate()} ${d.toLocaleString("en-GB", { month: "short" })}`;

  const fmtShortRange = (s: Date, e: Date): string => {
    if (s.getTime() === e.getTime()) return fmtShortDay(s);
    if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
      return `${s.getDate()}–${e.getDate()} ${e.toLocaleString("en-GB", {
        month: "short",
      })}`;
    }
    return `${fmtShortDay(s)} – ${fmtShortDay(e)}`;
  };

  const isPlaceholderCustomerEmail = (raw?: string): boolean => {
    const e = String(raw || "").trim().toLowerCase();
    return (
      !e ||
      e.includes("@houseofkaira.com") ||
      e.includes("@hok.local") ||
      e.includes("@temp.com")
    );
  };

  // Strict customer ownership rule: an order can only be linked to an enquiry of the SAME customer
  const doesOrderBelongToEnquiryCustomer = (ord: any, enq: Enquiry): boolean => {
    if (!ord || !enq) return false;
    const st = String(ord.status || "").toLowerCase();
    if (st === "cancelled" || st === "rejected") return false;

    const enqCid = String(enq.customerId || "").trim();
    const ordCid = String(ord.customerId || "").trim();
    if (enqCid && ordCid && enqCid === ordCid) {
      return true;
    }

    const enqEmail = isPlaceholderCustomerEmail(enq.customerEmail)
      ? ""
      : String(enq.customerEmail || "").trim().toLowerCase();
    const ordEmail = isPlaceholderCustomerEmail(ord.customerEmail)
      ? ""
      : String(ord.customerEmail || "").trim().toLowerCase();
    if (enqEmail && ordEmail && enqEmail === ordEmail) {
      return true;
    }

    const enqPhone = String(enq.customerPhone || "")
      .replace(/\D/g, "")
      .slice(-10);
    const ordPhone = String(ord.customerPhone || "")
      .replace(/\D/g, "")
      .slice(-10);
    if (enqPhone.length >= 10 && ordPhone.length >= 10 && enqPhone === ordPhone) {
      return true;
    }

    const hasConflict =
      (enqCid && ordCid && enqCid !== ordCid) ||
      (enqEmail && ordEmail && enqEmail !== ordEmail) ||
      (enqPhone.length >= 10 && ordPhone.length >= 10 && enqPhone !== ordPhone);
    if (!hasConflict && !enqEmail && enqPhone.length < 10) {
      const enqName = String(enq.customerName || "").trim().toLowerCase();
      const ordName = String(ord.customerName || "").trim().toLowerCase();
      if (enqName && ordName && enqName === ordName) {
        return true;
      }
    }

    return false;
  };

  const isPieceInOrder = (
    piece: EnquiryPiece | undefined,
    ord: any,
  ): boolean => {
    if (!piece || !ord) return false;
    const items = Array.isArray(ord.items) && ord.items.length > 0 ? ord.items : [ord];
    return items.some(
      (it: any) =>
        (piece.productId &&
          it.productId &&
          String(it.productId) === String(piece.productId)) ||
        (piece.productName &&
          String(it.productName || ord.productName || "") ===
            String(piece.productName)),
    );
  };

  // Live availability check from orders + products calendar
  const evaluatePieceAvailability = (
    piece: EnquiryPiece | undefined,
    enq: Enquiry,
    forPicker = false,
  ): {
    label: string;
    tone: AvailTone;
  } | null => {
    if (!piece) return null;

    if (enq.linkedOrderId && !forPicker) {
      const linkedOrd = liveOrders.find(
        (o: any) =>
          String(o.id || o.orderId) === String(enq.linkedOrderId),
      );
      if (!linkedOrd || isPieceInOrder(piece, linkedOrd)) {
        return {
          label: "Booked by This Customer",
          tone: "green",
        };
      }
    }

    const prod = listedProducts.find(
      (p: any) =>
        (piece.productId &&
          (String(p.id) === String(piece.productId) ||
            String(p.productId) === String(piece.productId) ||
            String(p._id) === String(piece.productId))) ||
        String(p.name || p.title) === String(piece.productName),
    ) as any;

    const prodStatus = String(prod?.status || "").toLowerCase();
    const prodAvail = String(prod?.availability || "").toLowerCase();

    if (
      enq.interestedIn === "Buy preloved" ||
      enq.interestedIn === "Buy new"
    ) {
      // Only single-piece Preloved items become Sold Out once purchased in a Preloved order
      if (enq.interestedIn === "Buy preloved") {
        const isPrelovedMode = (rawMode: any, oid?: any) => {
          const m = String(rawMode || "").trim().toLowerCase();
          if (
            m === "preloved" ||
            m === "re-sell" ||
            m === "resell" ||
            m === "buy preloved"
          ) {
            return true;
          }
          if (!m && String(oid || "").toUpperCase().startsWith("HOK-PRL-")) {
            return true;
          }
          return false;
        };

        const soldOrder = liveOrders.find((o: any) => {
          const st = String(o.status || "").toLowerCase();
          if (st === "cancelled" || st === "rejected") return false;
          if (doesOrderBelongToEnquiryCustomer(o, enq)) return false;
          const oid = o.orderId || o.id;
          const items = Array.isArray(o.items) ? o.items : [];
          if (items.length > 0) {
            return items.some((it: any) => {
              if (!isPrelovedMode(it.mode || o.mode, oid)) return false;
              const matchId =
                piece.productId &&
                it.productId &&
                String(it.productId) === String(piece.productId);
              const matchName =
                piece.productName &&
                it.productName &&
                String(it.productName) === String(piece.productName);
              return Boolean(matchId || matchName);
            });
          }
          if (!isPrelovedMode(o.mode, oid)) return false;
          const matchId =
            piece.productId &&
            o.productId &&
            String(o.productId) === String(piece.productId);
          const matchName =
            piece.productName &&
            o.productName &&
            String(o.productName) === String(piece.productName);
          return Boolean(matchId || matchName);
        });

        if (soldOrder) {
          return { label: "Sold Out", tone: "red" };
        }
        const ownPrelovedOrder = liveOrders.find((o: any) => {
          const st = String(o.status || "").toLowerCase();
          if (st === "cancelled" || st === "rejected") return false;
          if (!doesOrderBelongToEnquiryCustomer(o, enq)) return false;
          return isPieceInOrder(piece, o);
        });
        if (ownPrelovedOrder) {
          return { label: "Booked by This Customer", tone: "green" };
        }
        if (prodStatus === "sold") {
          return { label: "Sold Out", tone: "red" };
        }
      }

      if (prodStatus === "out of stock" || prodAvail === "out of stock") {
        return { label: "Out of Stock", tone: "red" };
      }
      return { label: "In Stock · Available", tone: "green" };
    }

    if (enq.interestedIn === "General") {
      if (!forPicker) return null;
      if (prodStatus === "out of stock" || prodAvail === "out of stock") {
        return { label: "Out of Stock", tone: "red" };
      }
      return { label: "Available", tone: "green" };
    }

    const hStart = parseDay(enq.holdStartDate || enq.eventDate);
    const hEnd = parseDay(
      enq.holdEndDate || enq.holdStartDate || enq.eventDate,
    );
    if (!hStart || !hEnd) {
      // Even before dates are entered, if THIS customer already has a rental order on this piece, show it!
      if (forPicker) {
        const custOwnOrd = liveOrders.find(
          (o: any) =>
            doesOrderBelongToEnquiryCustomer(o, enq) && isPieceInOrder(piece, o),
        );
        if (custOwnOrd) {
          return { label: "Booked by This Customer", tone: "green" };
        }
        return { label: "Select Date to Check", tone: "muted" };
      }
      return null;
    }

    // Check active rental orders on this piece
    const cleanBuf = Number(prod?.postRentalBufferDays ?? 3);
    for (const o of liveOrders as any[]) {
      const st = String(o.status || "").toLowerCase();
      if (st === "cancelled" || st === "rejected") continue;
      const items = Array.isArray(o.items) && o.items.length ? o.items : [o];
      for (const it of items) {
        const samePiece =
          (piece.productId &&
            it.productId &&
            String(it.productId) === String(piece.productId)) ||
          (piece.productName &&
            String(it.productName || o.productName) ===
              String(piece.productName));
        if (!samePiece) continue;
        const rStart = parseDay(it.rentalStartDate || o.rentalStartDate);
        const rEnd = parseDay(it.rentalEndDate || o.rentalEndDate);
        if (!rStart || !rEnd) continue;

        // Direct rental overlap
        if (hStart <= rEnd && hEnd >= rStart) {
          if (doesOrderBelongToEnquiryCustomer(o, enq)) {
            return { label: "Booked by This Customer", tone: "green" };
          }
          return {
            label: `Already Booked (${fmtShortRange(rStart, rEnd)})`,
            tone: "red",
          };
        }

        // Post-return cleaning buffer overlap
        const cleanEnd = addDays(rEnd, cleanBuf);
        if (hStart > rEnd && hStart <= cleanEnd) {
          if (!doesOrderBelongToEnquiryCustomer(o, enq)) {
            const freeFrom = addDays(cleanEnd, 1);
            return {
              label: `In Dry Cleaning (Free ${fmtShortDay(freeFrom)})`,
              tone: "amber",
            };
          }
        }
      }
    }

    // Check active On-Hold enquiries from other customers on overlapping dates
    for (const other of enquiries) {
      if (other.status !== "On Hold") continue;
      if (enq.id !== "draft" && other.id === enq.id) continue;
      const sameCust =
        enq.customerName &&
        other.customerName &&
        String(other.customerName).trim().toLowerCase() ===
          String(enq.customerName).trim().toLowerCase();
      if (sameCust) continue;

      const oStart = parseDay(other.holdStartDate || other.eventDate);
      const oEnd = parseDay(
        other.holdEndDate || other.holdStartDate || other.eventDate,
      );
      if (!oStart || !oEnd) continue;

      const hasPiece = other.pieces.some(
        (op) =>
          (piece.productId &&
            op.productId &&
            String(op.productId) === String(piece.productId)) ||
          (piece.productName &&
            op.productName &&
            String(op.productName) === String(piece.productName)),
      );
      if (hasPiece && hStart <= oEnd && hEnd >= oStart) {
        return {
          label: `On Hold (${fmtShortRange(oStart, oEnd)})`,
          tone: "amber",
        };
      }
    }

    return { label: "Available on Dates", tone: "green" };
  };

  const isEnquiryConverted = (enq: Enquiry): boolean =>
    Boolean(
      enq.status === "Converted" || enq.linkedOrderId || enq.linkedOfferId,
    );

  // Reply SLA badge for New enquiries (24h window)
  const getReplyDueLabel = (enq: Enquiry): { text: string; urgent: boolean } | null => {
    if (isEnquiryConverted(enq) || enq.status !== "New") return null;
    const created = new Date(enq.createdAt).getTime();
    if (isNaN(created)) return { text: "REPLY IN 24H", urgent: false };
    const deadline = created + 24 * 3600 * 1000;
    const hoursLeft = Math.ceil((deadline - Date.now()) / 3600000);
    if (hoursLeft <= 0) {
      return { text: "REPLY DUE NOW", urgent: true };
    }
    return { text: `REPLY IN ${hoursLeft}H`, urgent: false };
  };

  const isFollowUpDue = (enq: Enquiry): boolean => {
    if (!enq.followUpDate) return false;
    if (enq.status === "Closed" || isEnquiryConverted(enq)) return false;
    const d = parseDay(enq.followUpDate);
    if (!d) return false;
    return toYMD(d) <= todayStr;
  };

  // Metrics & Action Strip computation
  const stats = useMemo(() => {
    const openList = enquiries.filter(
      (e) =>
        !isEnquiryConverted(e) &&
        ["New", "In Conversation", "On Hold"].includes(e.status),
    );
    const awaitingFirstReply = enquiries.filter(
      (e) => !isEnquiryConverted(e) && e.status === "New",
    );
    const followUpsDue = enquiries.filter((e) => isFollowUpDue(e));
    const waitingOnHer = enquiries.filter(
      (e) =>
        !isEnquiryConverted(e) &&
        ["In Conversation", "On Hold"].includes(e.status),
    );
    const converted = enquiries.filter((e) => isEnquiryConverted(e));
    const decided = enquiries.filter(
      (e) => isEnquiryConverted(e) || e.status === "Closed",
    );
    const conversionRate =
      decided.length > 0
        ? Math.round((converted.length / decided.length) * 100)
        : 0;

    const totalThings =
      awaitingFirstReply.length + followUpsDue.length + waitingOnHer.length;

    return {
      openCount: openList.length,
      awaitingCount: awaitingFirstReply.length,
      followUpsDueCount: followUpsDue.length,
      waitingOnHerCount: waitingOnHer.length,
      convertedCount: converted.length,
      decidedCount: decided.length,
      conversionRate,
      totalThings,
    };
  }, [enquiries, todayStr]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const convertedFlag = isEnquiryConverted(e);
      const effectiveStatus = convertedFlag ? "Converted" : e.status;
      const matchInterest =
        interestFilter === "All Interests" ||
        e.interestedIn.toLowerCase() === interestFilter.toLowerCase();
      const matchStatus =
        statusFilter === "All Status"
          ? true
          : statusFilter === "Open"
            ? !convertedFlag &&
              ["New", "In Conversation", "On Hold"].includes(e.status)
            : statusFilter === "Follow-up Due"
              ? isFollowUpDue(e)
              : statusFilter === "Converted"
                ? convertedFlag
                : effectiveStatus.toLowerCase() === statusFilter.toLowerCase();
      return matchInterest && matchStatus;
    });
  }, [enquiries, interestFilter, statusFilter, todayStr]);

  const toggleCardStatusFilter = (targetFilter: string) => {
    setStatusFilter((curr) => (curr === targetFilter ? "All Status" : targetFilter));
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 40);
  };

  const selectedEnquiry = useMemo(
    () => enquiries.find((e) => e.id === selectedEnquiryId) || null,
    [enquiries, selectedEnquiryId],
  );

  const openWhatsApp = (phoneRaw?: string, name?: string) => {
    const digits = String(phoneRaw || "").replace(/\D/g, "");
    if (!digits) {
      toast.error(`No phone number logged for ${name || "this customer"}`);
      return;
    }
    const clean = digits.length === 10 ? `91${digits}` : digits;
    window.open(`https://wa.me/${clean}`, "_blank", "noopener,noreferrer");
  };

  // Autofill dates when Event Date changes in Log form
  const handleEventDateChange = (val: string) => {
    setFormEventDate(val);
    const ev = parseDay(val);
    if (ev && formInterest === "Rent") {
      setFormHoldStart(toYMD(addDays(ev, -1)));
      setFormHoldEnd(toYMD(addDays(ev, 1)));
    }
  };

  const handleCustomerOnFileChange = (cid: string) => {
    setFormCustomerId(cid);
    if (!cid) {
      return;
    }
    const cust = liveCustomers.find(
      (c) => String(c.customerId || c.id || (c as any)._id) === cid,
    );
    if (cust) {
      setFormName(cust.name || "");
      setFormPhone((cust as any).phone || "");
      if (
        cust.email &&
        !cust.email.includes("hok.local") &&
        !cust.email.includes("temp.com")
      ) {
        setFormEmail(cust.email);
      }
      if ((cust as any).location && (cust as any).location !== "India") {
        setFormCity((cust as any).location);
      }
    }
  };

  const resetLogForm = () => {
    setFormCustomerId("");
    setFormSource("WhatsApp");
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormCity("");
    setFormInterest("Rent");
    setFormAssigned(currentAdminName);
    setFormPieceId("");
    setFormAlsoPieceId("");
    setFormEventDate("");
    setFormHoldStart("");
    setFormHoldEnd("");
    setFormFollowUp("");
    setFormAsked("");
  };

  // Live conflict check for the Log New Enquiry form
  const formConflictMessage = useMemo(() => {
    if (
      formInterest === "Rent" &&
      formHoldStart &&
      formHoldEnd &&
      formHoldEnd < formHoldStart
    ) {
      return "Hold end date cannot be earlier than hold start date.";
    }

    const draftCtx: Enquiry = {
      id: "draft",
      enquiryId: "draft",
      customerId: formCustomerId || "",
      customerName: formName.trim(),
      customerEmail: formEmail.trim(),
      customerPhone: formPhone.trim(),
      channel: formSource,
      interestedIn: formInterest,
      assignedTo: formAssigned,
      pieces: [],
      eventDate: formEventDate,
      holdStartDate: formInterest === "Rent" ? formHoldStart : "",
      holdEndDate: formInterest === "Rent" ? formHoldEnd : "",
      status: "New",
      createdAt: new Date().toISOString(),
      conversationLog: [],
    };

    const checkId = (pid: string): string | null => {
      if (!pid) return null;
      const prod = listedProducts.find(
        (p: any) => String(p.productId || p._id || p.id) === String(pid),
      ) as any;
      const pTitle = prod?.name || prod?.title || "Selected piece";
      const av = evaluatePieceAvailability(
        { productId: pid, productName: pTitle },
        draftCtx,
        true,
      );
      if (av && (av.tone === "red" || av.tone === "amber")) {
        return `${pTitle} — ${av.label}. Please change the dates or pick an available piece.`;
      }
      return null;
    };

    return checkId(formPieceId) || checkId(formAlsoPieceId) || null;
  }, [
    formInterest,
    formHoldStart,
    formHoldEnd,
    formEventDate,
    formPieceId,
    formAlsoPieceId,
    formCustomerId,
    formName,
    formEmail,
    formPhone,
    formSource,
    formAssigned,
    listedProducts,
    orders,
    enquiries,
  ]);

  const handleSubmitNewEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Customer name is required");
      return;
    }
    if (formConflictMessage) {
      toast.error(formConflictMessage);
      return;
    }
    setSavingForm(true);
    try {
      const res = await createEnquiry({
        customerId: formCustomerId || undefined,
        isOnFile: Boolean(formCustomerId),
        customerName: formName.trim(),
        customerPhone: formPhone.trim(),
        customerEmail: formEmail.trim(),
        customerCity: formCity.trim(),
        channel: formSource,
        interestedIn: formInterest,
        assignedTo: formAssigned,
        pieceId: formPieceId || undefined,
        alsoPieceId: formAlsoPieceId || undefined,
        eventDate: formEventDate || "",
        holdStartDate: formInterest === "Rent" ? formHoldStart : "",
        holdEndDate: formInterest === "Rent" ? formHoldEnd : "",
        followUpDate: formFollowUp || "",
        whatSheAsked: formAsked.trim(),
      });
      const created = res.enquiry;
      onEnquiriesChange((prev) => [created, ...prev]);

      if (res.customer) {
        onCustomerCreated?.(res.customer);
        setDbCustomers((prev) => {
          const cid = res.customer.customerId || res.customer.id;
          const exists = prev.some(
            (c: any) => (c.customerId || c.id) === cid,
          );
          return exists ? prev : [res.customer, ...prev];
        });
      }

      resetLogForm();
      setShowLogForm(false);
      setSelectedEnquiryId(created.id);

      if (res.isNewCustomer && res.customer?.name) {
        toast.success(
          `Logged ${created.enquiryId} & added ${res.customer.name} to Customers`,
        );
      } else {
        toast.success(`Logged ${created.enquiryId}`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Could not log enquiry");
    } finally {
      setSavingForm(false);
    }
  };

  const [savingFollowUp, setSavingFollowUp] = useState<boolean>(false);

  const applyEnquiryPatch = async (
    enq: Enquiry,
    patch: Record<string, any>,
    successMsg?: string,
  ) => {
    try {
      const updated = await updateEnquiry(enq.enquiryId, {
        ...patch,
        author: currentAdminName,
      });
      onEnquiriesChange((prev) =>
        prev.map((item) => (item.id === enq.id ? updated : item)),
      );
      if (successMsg) toast.success(successMsg);
      return updated;
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
      return null;
    }
  };

  const handleSaveFollowUp = async (enq: Enquiry, dateVal: string) => {
    const trimmed = String(dateVal || "").trim();
    setSavingFollowUp(true);
    try {
      const updated = await applyEnquiryPatch(
        enq,
        {
          followUpDate: trimmed,
          note: trimmed
            ? `Follow-up scheduled for ${fmtFullDate(trimmed)}.`
            : "Follow-up cleared.",
        },
        trimmed
          ? `Follow-up set for ${fmtFullDate(trimmed)}`
          : "Follow-up cleared",
      );
      if (updated) {
        setNextFollowUpDate(trimmed);
        setShowFollowUpModal(false);
      }
      return updated;
    } finally {
      setSavingFollowUp(false);
    }
  };

  const handleCloseDetailPanel = () => {
    setSelectedEnquiryId(null);
    setEditingDates(false);
    setShowLinkOrderModal(false);
    setShowFollowUpModal(false);
    setShowConvertOfferModal(false);
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const handleSelectRow = (enq: Enquiry) => {
    if (selectedEnquiryId === enq.id) {
      setSelectedEnquiryId(null);
      return;
    }
    setSelectedEnquiryId(enq.id);
    setEditingDates(false);
    setEditEventDate(enq.eventDate || "");
    setEditHoldStart(enq.holdStartDate || "");
    setEditHoldEnd(enq.holdEndDate || "");
    setShowLinkOrderModal(false);
    setShowFollowUpModal(false);
    setShowConvertOfferModal(false);
    setOrderSearchQuery("");
    setTimeout(() => {
      detailCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 60);
  };

  const handleConvert = async (
    enq: Enquiry,
    target: "order" | "offer",
    customOfferedAmount?: number,
  ) => {
    if (target === "order" && enq.linkedOrderId) {
      toast(`Opening booking ${enq.linkedOrderId}`);
      onNavigateView?.(`order_detail:${enq.linkedOrderId}`);
      return;
    }
    if (target === "offer" && enq.linkedOfferId) {
      toast(`Opening Offer ${enq.linkedOfferId}`);
      onNavigateView?.("offers");
      return;
    }

    if (!enq.pieces || enq.pieces.length === 0) {
      toast.error(
        "Please add at least one piece in 'Pieces Asked About' before converting.",
      );
      return;
    }

    if (
      target === "order" &&
      enq.interestedIn === "Rent" &&
      !enq.holdStartDate &&
      !enq.eventDate
    ) {
      setEditEventDate("");
      setEditHoldStart("");
      setEditHoldEnd("");
      setEditingDates(true);
      toast.error(
        "Please set Event Date or Dates to Hold first, then click Convert to Booking.",
      );
      return;
    }

    setConverting(true);
    try {
      const res = await convertEnquiry(enq.enquiryId, {
        target,
        author: currentAdminName,
        ...(customOfferedAmount !== undefined && customOfferedAmount > 0
          ? { offeredAmount: customOfferedAmount }
          : {}),
      });
      onEnquiriesChange((prev) =>
        prev.map((item) => (item.id === enq.id ? res.enquiry : item)),
      );
      if (res.customer) {
        onCustomerCreated?.(res.customer);
        setDbCustomers((prev) => {
          const cid = res.customer.customerId || res.customer.id;
          const exists = prev.some(
            (c: any) => (c.customerId || c.id) === cid,
          );
          return exists ? prev : [res.customer, ...prev];
        });
      }
      if (res.order) {
        onOrderCreated?.(res.order);
        fetch("/api/products")
          .then((r) => r.json())
          .then((pr) => {
            const list = Array.isArray(pr)
              ? pr
              : Array.isArray(pr?.data)
                ? pr.data
                : [];
            if (list.length > 0) setDbProducts(list);
          })
          .catch(() => {});
        const oid = res.order.orderId || res.order.id;
        toast.success(
          enq.interestedIn === "Rent"
            ? `Booking ${oid} created & synced to Calendar!`
            : `Order ${oid} created!`,
        );
      } else if (res.offer) {
        onOfferCreated?.(res.offer);
        setShowConvertOfferModal(false);
        toast.success(`Offer ${res.offer.offerId} created in Offers!`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Could not convert enquiry");
    } finally {
      setConverting(false);
    }
  };

  const exportCsv = () => {
    const esc = (v: any) => {
      const s = v === undefined || v === null ? "" : String(v);
      return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const head = [
      "Enquiry ID",
      "Received On",
      "Customer",
      "On File",
      "Phone",
      "Email",
      "City",
      "Channel",
      "Assigned To",
      "Interested In",
      "Pieces Asked About",
      "Event Date",
      "Hold Start",
      "Hold End",
      "Follow-up Date",
      "Status",
      "Linked Order",
      "What She Asked",
    ];
    const rows = filteredEnquiries.map((e) => [
      e.enquiryId,
      fmtFullDate(e.createdAt),
      e.customerName,
      e.isOnFile ? "Yes" : "No",
      e.customerPhone || "",
      e.customerEmail || "",
      e.customerCity || "",
      e.channel,
      e.assignedTo,
      e.interestedIn,
      e.pieces.map((p) => p.productName).join(" | "),
      e.eventDate || "",
      e.holdStartDate || "",
      e.holdEndDate || "",
      e.followUpDate || "",
      e.status,
      e.linkedOrderId || "",
      e.whatSheAsked || "",
    ]);
    const csv = [head, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries-${todayStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resolveProductMetaLine = (p: EnquiryPiece): string => {
    const prod = listedProducts.find(
      (x: any) =>
        String(x.id) === String(p.productId) ||
        String(x.productId) === String(p.productId) ||
        String(x._id) === String(p.productId) ||
        String(x.name) === String(p.productName),
    ) as any;
    const designer = prod?.designer || p.designer || "";
    const rent = Number(prod?.rentalPrice || p.rentalPrice || 0);
    const dep = Number(prod?.securityDeposit || p.securityDeposit || 0);
    const minDays = Number(prod?.minimumDurationDays || 3);
    const listPrice = Number(prod?.listingPrice || p.listingPrice || 0);
    if (rent > 0) {
      return `${designer ? `${designer} · ` : ""}Rental · ₹${rent.toLocaleString("en-IN")} for ${minDays} days${
        dep > 0 ? ` · deposit ₹${dep.toLocaleString("en-IN")}` : ""
      }`;
    }
    if (listPrice > 0) {
      return `${designer ? `${designer} · ` : ""}₹${listPrice.toLocaleString("en-IN")}`;
    }
    return designer;
  };

  const labelCls =
    "block text-[10px] font-bold uppercase tracking-[0.08em] text-[#8f8679] mb-1.5";
  const inputCls =
    "w-full rounded-[4px] border border-[#ded6c8] bg-white px-3 py-2 text-[12.5px] text-[#2b2118] outline-none focus:border-[#c08829]";

  return (
    <div className="min-h-full bg-[#f8f6f2] text-[#2b2118] font-sans space-y-5">
      {/* Section Header */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#c08829]">
          OPERATIONS
        </div>
        <h1
          className="text-[26px] font-medium text-[#2b2118] mt-0.5"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Enquiries
        </h1>
        <p className="mt-1.5 max-w-[780px] text-[13px] leading-[1.55] text-[#7d756b]">
          Every question a customer asks us that has no number on it yet: about
          a piece, her dates, the fit, or what to wear. The team logs each one
          from WhatsApp, Instagram, a call or a visit. What she saves on the
          website shows on her Wishlist, and an offer with an amount goes to{" "}
          <button
            type="button"
            onClick={() => onNavigateView?.("offers")}
            className="text-[#b57a24] underline underline-offset-2 hover:text-[#8f5e16] cursor-pointer"
          >
            Offers
          </button>
          . Click any row for the conversation, her dates and what is free.
        </p>
      </div>

      {/* Action Strip ("X THINGS HERE") */}
      {stats.totalThings > 0 && (
        <div className="flex flex-wrap items-center gap-2.5 rounded-[6px] border border-[#ecd0c6] bg-[#fdf3ef] px-4 py-2.5 text-[12px]">
          <strong className="uppercase tracking-wider text-[#b44b32] text-[11px] font-bold mr-1">
            {stats.totalThings} THINGS HERE
          </strong>
          {stats.awaitingCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("New");
                tableRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded border border-[#e5d9cf] bg-white px-2.5 py-1 text-[11.5px] font-medium text-[#3b332b] hover:bg-[#faf7f2] cursor-pointer"
            >
              <strong>{stats.awaitingCount}</strong> new enquiries waiting on a
              first reply →
            </button>
          )}
          {stats.followUpsDueCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("Follow-up Due");
                tableRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded border border-[#e5d9cf] bg-white px-2.5 py-1 text-[11.5px] font-medium text-[#3b332b] hover:bg-[#faf7f2] cursor-pointer"
            >
              <strong>{stats.followUpsDueCount}</strong> enquiries with a
              follow-up due →
            </button>
          )}
          {stats.waitingOnHerCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("In Conversation");
                tableRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded border border-[#e5d9cf] bg-white px-2.5 py-1 text-[11.5px] font-medium text-[#3b332b] hover:bg-[#faf7f2] cursor-pointer"
            >
              <strong>{stats.waitingOnHerCount}</strong> enquiries waiting on
              her →
            </button>
          )}
        </div>
      )}

      {/* 4 Gold-Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <button
          type="button"
          onClick={() => toggleCardStatusFilter("Open")}
          className={`text-left rounded-[4px] border border-t-2 border-t-[#c7a35e] px-5 py-3.5 shadow-[0_1px_2px_rgba(43,33,24,0.04)] hover:border-[#c7a35e] transition cursor-pointer ${
            statusFilter === "Open"
              ? "border-[#c7a35e] bg-[#fdf9ef] ring-2 ring-[#c7a35e]/40"
              : "border-[#e8e1d5] bg-white"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#8f8679]">
              OPEN ENQUIRIES
            </div>
            {statusFilter === "Open" && (
              <span className="rounded bg-[#c7a35e]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#7a5b21]">
                Active
              </span>
            )}
          </div>
          <div
            className="mt-1.5 text-[22px] text-[#c79a4b]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {stats.openCount}
          </div>
          <div className="mt-1 text-[11.5px] text-[#968d80]">
            New, in conversation or on hold
          </div>
        </button>

        <button
          type="button"
          onClick={() => toggleCardStatusFilter("New")}
          className={`text-left rounded-[4px] border border-t-2 border-t-[#c7a35e] px-5 py-3.5 shadow-[0_1px_2px_rgba(43,33,24,0.04)] hover:border-[#c7a35e] transition cursor-pointer ${
            statusFilter === "New"
              ? "border-[#c7a35e] bg-[#fdf9ef] ring-2 ring-[#c7a35e]/40"
              : "border-[#e8e1d5] bg-white"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#8f8679]">
              AWAITING FIRST REPLY
            </div>
            {statusFilter === "New" && (
              <span className="rounded bg-[#c7a35e]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#7a5b21]">
                Active
              </span>
            )}
          </div>
          <div
            className={`mt-1.5 text-[22px] ${
              stats.awaitingCount > 0 ? "text-[#b84c33]" : "text-[#2b2118]"
            }`}
            style={{ fontFamily: "Georgia, serif" }}
          >
            {stats.awaitingCount}
          </div>
          <div className="mt-1 text-[11.5px] text-[#968d80]">
            First reply within 24 hours
          </div>
        </button>

        <button
          type="button"
          onClick={() => toggleCardStatusFilter("Follow-up Due")}
          className={`text-left rounded-[4px] border border-t-2 border-t-[#c7a35e] px-5 py-3.5 shadow-[0_1px_2px_rgba(43,33,24,0.04)] hover:border-[#c7a35e] transition cursor-pointer ${
            statusFilter === "Follow-up Due"
              ? "border-[#c7a35e] bg-[#fdf9ef] ring-2 ring-[#c7a35e]/40"
              : "border-[#e8e1d5] bg-white"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#8f8679]">
              FOLLOW-UPS DUE
            </div>
            {statusFilter === "Follow-up Due" && (
              <span className="rounded bg-[#c7a35e]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#7a5b21]">
                Active
              </span>
            )}
          </div>
          <div
            className={`mt-1.5 text-[22px] ${
              stats.followUpsDueCount > 0 ? "text-[#c08829]" : "text-[#2b2118]"
            }`}
            style={{ fontFamily: "Georgia, serif" }}
          >
            {stats.followUpsDueCount}
          </div>
          <div className="mt-1 text-[11.5px] text-[#968d80]">
            Due today or earlier
          </div>
        </button>

        <button
          type="button"
          onClick={() => toggleCardStatusFilter("Converted")}
          className={`text-left rounded-[4px] border border-t-2 border-t-[#c7a35e] px-5 py-3.5 shadow-[0_1px_2px_rgba(43,33,24,0.04)] hover:border-[#c7a35e] transition cursor-pointer ${
            statusFilter === "Converted"
              ? "border-[#c7a35e] bg-[#fdf9ef] ring-2 ring-[#c7a35e]/40"
              : "border-[#e8e1d5] bg-white"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#8f8679]">
              CONVERSION RATE
            </div>
            {statusFilter === "Converted" && (
              <span className="rounded bg-[#c7a35e]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#7a5b21]">
                Active
              </span>
            )}
          </div>
          <div
            className="mt-1.5 text-[22px] text-[#3a7c4c]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {stats.conversionRate}%
          </div>
          <div className="mt-1 text-[11.5px] text-[#968d80]">
            {stats.convertedCount} converted of {stats.decidedCount} decided
          </div>
        </button>
      </div>

      {/* Main Card: Toolbar + Inline Log Form + All Enquiries Table */}
      <div
        ref={tableRef}
        className="rounded-[6px] border border-[#e8e1d5] bg-white shadow-[0_1px_2px_rgba(43,33,24,0.03)] overflow-hidden"
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee7dc] px-5 py-3.5">
          <h3 className="text-[14px] font-semibold text-[#2b2118]">
            All Enquiries
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="rounded-[4px] border border-[#ded6c8] bg-white px-3 py-1.5 text-[12px] font-medium text-[#3b332b] outline-none focus:border-[#c08829]"
            >
              <option value="All Interests">All Interests</option>
              {INTERESTS.map((it) => (
                <option key={it} value={it}>
                  {it}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-[4px] border border-[#ded6c8] bg-white px-3 py-1.5 text-[12px] font-medium text-[#3b332b] outline-none focus:border-[#c08829]"
            >
              <option value="All Status">All Status</option>
              <option value="Open">Open (New / In Conversation / Hold)</option>
              <option value="Follow-up Due">Follow-up Due</option>
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowLogForm((v) => !v)}
              className="inline-flex items-center gap-1 rounded-[4px] bg-[#C7A55C] hover:bg-[#B9974B] px-3.5 py-1.5 text-[12px] font-semibold text-[#2A2118] transition cursor-pointer"
            >
              <span>+ Log New Enquiry</span>
            </button>

            <button
              type="button"
              onClick={exportCsv}
              className="rounded-[4px] border border-[#ded6c8] bg-white hover:bg-[#faf7f2] px-3 py-1.5 text-[12px] font-medium text-[#3b332b] cursor-pointer"
            >
              Export
            </button>
          </div>
        </div>

        {/* Inline Log an Enquiry Form (exact match to Screenshot 1) */}
        {showLogForm && (
          <form
            onSubmit={handleSubmitNewEnquiry}
            className="border-b border-[#e8e1d5] bg-[#faf7f1] px-6 py-5 space-y-4"
          >
            <div>
              <h4 className="text-[14px] font-semibold text-[#2b2118]">
                Log an Enquiry
              </h4>
              <p className="text-[11.5px] text-[#8a8073] mt-0.5">
                For a question that reached us on WhatsApp, Instagram, a call,
                an email or a visit. If she has already named an amount for a
                preloved piece, log it in Offers instead.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
              {/* Row 1: Customer on file + Source */}
              <div>
                <label className={labelCls}>CUSTOMER ON FILE</label>
                <select
                  value={formCustomerId}
                  onChange={(e) => handleCustomerOnFileChange(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Someone new, not on file yet</option>
                  {liveCustomers.map((c) => {
                    const cid = String(c.customerId || c.id || (c as any)._id);
                    return (
                      <option key={cid} value={cid}>
                        {c.name}
                        {(c as any).phone ? ` · ${(c as any).phone}` : ""}
                      </option>
                    );
                  })}
                </select>
                <p className="mt-1 text-[11px] text-[#968d80]">
                  Pick her if she has an account, so this shows on her profile.
                  Leave it for someone new.
                </p>
                {(() => {
                  if (!formCustomerId && !formPhone.trim() && !formEmail.trim()) {
                    return null;
                  }
                  const draftCustCtx: Enquiry = {
                    id: "draft",
                    enquiryId: "draft",
                    customerId: formCustomerId || "",
                    customerName: formName.trim(),
                    customerEmail: formEmail.trim(),
                    customerPhone: formPhone.trim(),
                    channel: formSource,
                    interestedIn: formInterest,
                    assignedTo: formAssigned,
                    pieces: [],
                    status: "New",
                    createdAt: new Date().toISOString(),
                    conversationLog: [],
                  };
                  const custWebOrders = liveOrders.filter((o: any) =>
                    doesOrderBelongToEnquiryCustomer(o, draftCustCtx),
                  );
                  if (custWebOrders.length === 0) return null;
                  return (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10.5px] font-semibold text-[#2a6b3b]">
                        Orders by {formName || "this customer"}:
                      </span>
                      {custWebOrders.slice(0, 3).map((ord: any) => {
                        const oid = ord.id || ord.orderId;
                        const it0 =
                          (Array.isArray(ord.items) && ord.items[0]) || ord;
                        const pTitle = it0.productName || ord.productName || "Piece";
                        return (
                          <button
                            key={oid}
                            type="button"
                            onClick={() => {
                              const matchedProd = listedProducts.find(
                                (lp: any) =>
                                  (it0.productId &&
                                    (String(lp.productId) ===
                                      String(it0.productId) ||
                                      String(lp._id) ===
                                        String(it0.productId) ||
                                      String(lp.id) ===
                                        String(it0.productId))) ||
                                  String(lp.name || lp.title || "")
                                    .trim()
                                    .toLowerCase() ===
                                    String(pTitle).trim().toLowerCase(),
                              ) as any;
                              const resolvedPid = matchedProd
                                ? String(
                                    matchedProd.productId ||
                                      matchedProd._id ||
                                      matchedProd.id,
                                  )
                                : String(it0.productId || pTitle);
                              setFormPieceId(resolvedPid);

                              const om = String(
                                it0.mode || ord.mode || "",
                              ).toLowerCase();
                              if (om === "preloved") {
                                setFormInterest("Buy preloved");
                                setFormEventDate("");
                                setFormHoldStart("");
                                setFormHoldEnd("");
                              } else if (om === "buy" || om === "buy new") {
                                setFormInterest("Buy new");
                                setFormEventDate("");
                                setFormHoldStart("");
                                setFormHoldEnd("");
                              } else {
                                setFormInterest("Rent");
                                const rs = String(
                                  it0.rentalStartDate || ord.rentalStartDate || "",
                                ).slice(0, 10);
                                const re = String(
                                  it0.rentalEndDate || ord.rentalEndDate || "",
                                ).slice(0, 10);
                                if (rs) {
                                  setFormEventDate(rs);
                                  setFormHoldStart(rs);
                                }
                                if (re) {
                                  setFormHoldEnd(re);
                                }
                              }
                              toast.success(
                                `Selected ${pTitle} (${oid})`,
                              );
                            }}
                            className="rounded-[3px] border border-[#c5e5cb] bg-[#e5f3e7] hover:bg-[#d7ecd9] px-2 py-0.5 text-[10.5px] font-medium text-[#266537] cursor-pointer"
                          >
                            {oid} · {pTitle}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className={labelCls}>SOURCE</label>
                <select
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value)}
                  className={inputCls}
                >
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 2: Customer Name + Phone/WhatsApp */}
              <div>
                <label className={labelCls}>CUSTOMER NAME *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Simran Kaur"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>PHONE / WHATSAPP</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="Optional"
                  className={inputCls}
                />
              </div>

              {/* Row 3: Email + City */}
              <div>
                <label className={labelCls}>EMAIL</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Optional"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>CITY</label>
                <input
                  type="text"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  placeholder="Optional"
                  className={inputCls}
                />
              </div>

              {/* Row 4: Interested In + Assigned To */}
              <div>
                <label className={labelCls}>INTERESTED IN</label>
                <select
                  value={formInterest}
                  onChange={(e) =>
                    setFormInterest(e.target.value as EnquiryInterest)
                  }
                  className={inputCls}
                >
                  {INTERESTS.map((it) => (
                    <option key={it} value={it}>
                      {it}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-[#968d80]">
                  {formInterest === "Rent"
                    ? "She wants to rent. Dates to hold show which pieces are free."
                    : formInterest === "Buy preloved"
                      ? "She wants to buy preloved. Convert to Order or Convert to Offer once decided."
                      : formInterest === "General"
                        ? "General styling or outfit advice — pieces can be added as you suggest them."
                        : "She wants to buy a fresh piece."}
                </p>
              </div>

              <div>
                <label className={labelCls}>ASSIGNED TO</label>
                <select
                  value={formAssigned}
                  onChange={(e) => setFormAssigned(e.target.value)}
                  className={inputCls}
                >
                  {teamMembers.map((tm) => (
                    <option key={tm} value={tm}>
                      {tm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 5: Searchable Piece She Asked About + Also Asked About */}
              <div>
                <label className={labelCls}>PIECE SHE ASKED ABOUT</label>
                <SearchablePiecePicker
                  value={formPieceId}
                  onChange={(val) => {
                    setFormPieceId(val);
                    if (val && val === formAlsoPieceId) {
                      setFormAlsoPieceId("");
                    }
                    if (val) {
                      const picked = listedProducts.find(
                        (lp: any) =>
                          String(lp.productId || lp._id || lp.id) ===
                          String(val),
                      ) as any;
                      const modes: string[] = Array.isArray(picked?.listingModes)
                        ? picked.listingModes.map((m: any) =>
                            String(m).toUpperCase(),
                          )
                        : [];
                      if (modes.length > 0 && formInterest !== "General") {
                        const hasRent =
                          modes.includes("RENTAL") || modes.includes("RENT");
                        const hasPreloved =
                          modes.includes("PRELOVED") ||
                          modes.includes("RE-SELL");
                        const hasBuy =
                          modes.includes("BUY NEW") || modes.includes("BUY");
                        if (formInterest === "Rent" && !hasRent) {
                          if (hasPreloved) setFormInterest("Buy preloved");
                          else if (hasBuy) setFormInterest("Buy new");
                        }
                      }
                    }
                  }}
                  emptyLabel="Pick the piece, or leave for none yet"
                  options={formListedProducts.map((p: any) =>
                    toPieceOptionItem(p, formInterest, {
                      id: "draft",
                      enquiryId: "draft",
                      customerId: formCustomerId || "",
                      customerName: formName,
                      customerEmail: formEmail,
                      customerPhone: formPhone,
                      channel: formSource,
                      interestedIn: formInterest,
                      assignedTo: formAssigned,
                      pieces: [],
                      eventDate: formEventDate,
                      holdStartDate: formHoldStart,
                      holdEndDate: formHoldEnd,
                      status: "New",
                      createdAt: new Date().toISOString(),
                      conversationLog: [],
                    }),
                  )}
                />
              </div>

              <div>
                <label className={labelCls}>
                  ALSO ASKED ABOUT{" "}
                  <span className="font-normal text-[#a59c8f]">(OPTIONAL)</span>
                </label>
                <SearchablePiecePicker
                  value={formAlsoPieceId}
                  onChange={(val) => setFormAlsoPieceId(val)}
                  emptyLabel="None"
                  options={formListedProducts
                    .filter(
                      (p: any) =>
                        String(p.productId || p._id || p.id) !== formPieceId,
                    )
                    .map((p: any) =>
                      toPieceOptionItem(p, formInterest, {
                        id: "draft",
                        enquiryId: "draft",
                        customerId: formCustomerId || "",
                        customerName: formName,
                        customerEmail: formEmail,
                        customerPhone: formPhone,
                        channel: formSource,
                        interestedIn: formInterest,
                        assignedTo: formAssigned,
                        pieces: [],
                        eventDate: formEventDate,
                        holdStartDate: formHoldStart,
                        holdEndDate: formHoldEnd,
                        status: "New",
                        createdAt: new Date().toISOString(),
                        conversationLog: [],
                      }),
                    )}
                />
              </div>

              {/* Row 6: Event Date + Dates to Hold */}
              <div>
                <label className={labelCls}>
                  EVENT DATE{" "}
                  <span className="font-normal text-[#a59c8f]">(OPTIONAL)</span>
                </label>
                <input
                  type="date"
                  value={formEventDate}
                  onChange={(e) => handleEventDateChange(e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>DATES TO HOLD</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={formHoldStart}
                    onChange={(e) => setFormHoldStart(e.target.value)}
                    disabled={formInterest !== "Rent"}
                    className={`${inputCls} disabled:bg-[#f2efe9] disabled:text-[#9c9386]`}
                  />
                  <span className="text-[12px] text-[#8f8679]">to</span>
                  <input
                    type="date"
                    value={formHoldEnd}
                    min={formHoldStart || undefined}
                    onChange={(e) => setFormHoldEnd(e.target.value)}
                    disabled={formInterest !== "Rent"}
                    className={`${inputCls} disabled:bg-[#f2efe9] disabled:text-[#9c9386]`}
                  />
                </div>
                <p className="mt-1 text-[11px] text-[#968d80]">
                  Filled from the event date: the day before, the day itself and
                  the Return Date after. Change them if she needs longer.
                </p>
              </div>

              {/* Row 7: Follow up on */}
              <div>
                <label className={labelCls}>
                  FOLLOW UP ON{" "}
                  <span className="font-normal text-[#a59c8f]">(OPTIONAL)</span>
                </label>
                <input
                  type="date"
                  value={formFollowUp}
                  onChange={(e) => setFormFollowUp(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            {/* What she asked */}
            <div>
              <label className={labelCls}>WHAT SHE ASKED</label>
              <textarea
                rows={2}
                value={formAsked}
                onChange={(e) => setFormAsked(e.target.value)}
                placeholder="e.g. Wants it for her sister's sangeet and asked whether the blouse can be let out."
                className={inputCls}
              />
            </div>

            {formConflictMessage && (
              <div className="rounded-[4px] border border-[#edd0c9] bg-[#fdf3ef] px-3.5 py-2.5 text-[12px] font-medium text-[#a94432]">
                {formConflictMessage}
              </div>
            )}

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="submit"
                disabled={savingForm || Boolean(formConflictMessage)}
                className="rounded-[4px] bg-[#C7A55C] hover:bg-[#B9974B] px-4 py-2 text-[12px] font-semibold text-[#2A2118] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingForm ? "Adding…" : "Add to List"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetLogForm();
                  setShowLogForm(false);
                }}
                className="rounded-[4px] border border-[#ded6c8] bg-white hover:bg-[#f5f1e8] px-4 py-2 text-[12px] font-medium text-[#3b332b] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12.5px]">
            <thead>
              <tr className="border-b border-[#eee7dc] bg-[#fcfaf6] text-[10px] font-bold uppercase tracking-[0.08em] text-[#968d80]">
                <th className="px-4 py-3">ENQUIRY</th>
                <th className="px-4 py-3">PIECE</th>
                <th className="px-4 py-3">INTERESTED IN</th>
                <th className="px-4 py-3">DATES</th>
                <th className="px-4 py-3">CUSTOMER</th>
                <th className="px-4 py-3">CHANNEL</th>
                <th className="px-4 py-3">FOLLOW-UP</th>
                <th className="px-4 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eae0]">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-[#968d80]"
                  >
                    Loading enquiries…
                  </td>
                </tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-[#968d80]"
                  >
                    No enquiries logged yet. Click{" "}
                    <strong>+ Log New Enquiry</strong> to record one.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => {
                  const firstPiece = enq.pieces[0];
                  const avail = evaluatePieceAvailability(firstPiece, enq);
                  const replySla = getReplyDueLabel(enq);
                  const followDue = isFollowUpDue(enq);
                  const isSelected = selectedEnquiryId === enq.id;
                  const holdStr = fmtHoldRange(
                    enq.holdStartDate,
                    enq.holdEndDate,
                  );

                  return (
                    <tr
                      key={enq.id}
                      onClick={() => handleSelectRow(enq)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-[#faf5ea]" : "hover:bg-[#fcfaf6]"
                      }`}
                    >
                      {/* ENQUIRY */}
                      <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                        <div className="font-semibold text-[#2b2118]">
                          {enq.enquiryId}
                        </div>
                        <div className="text-[11px] text-[#968d80] mt-0.5">
                          {fmtFullDate(enq.createdAt)}
                        </div>
                      </td>

                      {/* PIECE */}
                      <td className="px-4 py-3.5 align-middle">
                        {firstPiece ? (
                          (() => {
                            const liveProd = listedProducts.find(
                              (lp: any) =>
                                String(lp.id) === String(firstPiece.productId) ||
                                String(lp.productId) === String(firstPiece.productId) ||
                                String(lp._id) === String(firstPiece.productId) ||
                                String(lp.name) === String(firstPiece.productName),
                            ) as any;
                            const thumbUrl =
                              firstPiece.image ||
                              (Array.isArray(liveProd?.images) && liveProd.images[0]) ||
                              (typeof liveProd?.image === "string" ? liveProd.image : "");
                            const dispDesigner =
                              firstPiece.designer || liveProd?.designer || "";
                            return (
                              <div className="flex items-center gap-3">
                                {thumbUrl ? (
                                  <img
                                    src={thumbUrl}
                                    alt={firstPiece.productName}
                                    className="h-10 w-8 rounded-[3px] object-cover border border-[#e5ddd0] shrink-0 bg-[#2d1e1b]"
                                  />
                                ) : (
                                  <div className="h-10 w-8 rounded-[3px] bg-[#2d1e1b] text-[#c7a35e] flex items-center justify-center text-[12px] shrink-0">
                                    ♢
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="font-semibold text-[#2b2118] leading-snug max-w-[190px]">
                                    {firstPiece.productName}
                                    {enq.pieces.length > 1 && (
                                      <span className="ml-1 font-normal text-[11px] text-[#968d80]">
                                        +{enq.pieces.length - 1}
                                      </span>
                                    )}
                                  </div>
                                  {dispDesigner && (
                                    <div className="text-[11px] text-[#968d80]">
                                      {dispDesigner}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-8 rounded-[3px] bg-[#f3efe8] border border-[#e6dfd3] shrink-0" />
                            <div>
                              <div className="text-[#8f8679] font-medium">
                                No piece yet
                              </div>
                              <div className="text-[11px] text-[#a59c8f]">
                                Asking what to wear
                              </div>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* INTERESTED IN */}
                      <td className="px-4 py-3.5 align-middle whitespace-nowrap text-[#2b2118]">
                        {enq.interestedIn}
                      </td>

                      {/* DATES + LIVE CALENDAR AVAILABILITY */}
                      <td className="px-4 py-3.5 align-middle">
                        <div>
                          {enq.interestedIn === "Buy preloved" ||
                          enq.interestedIn === "Buy new" ? (
                            <div className="text-[#8f8679]">Not needed</div>
                          ) : holdStr ? (
                            <div className="text-[#2b2118]">{holdStr}</div>
                          ) : enq.eventDate ? (
                            <div className="text-[#2b2118]">
                              Event {fmtFullDate(enq.eventDate)}
                            </div>
                          ) : (
                            <div className="text-[#968d80]">No dates yet</div>
                          )}

                          {avail && (
                            <span
                              className={`mt-1 inline-block rounded-[3px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${availBadgeClass(
                                avail.tone,
                              )}`}
                            >
                              {avail.label}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* CUSTOMER */}
                      <td className="px-4 py-3.5 align-middle">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-semibold text-[#2b2118] leading-tight">
                              {enq.customerName}
                            </div>
                            {!enq.isOnFile && !enq.customerId && (
                              <div className="text-[10.5px] text-[#968d80] mt-0.5">
                                Not on file yet
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              openWhatsApp(enq.customerPhone, enq.customerName);
                            }}
                            title="Open WhatsApp"
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#25d366] text-white hover:bg-[#1fb858] shrink-0 cursor-pointer"
                          >
                            <WhatsAppBadgeIcon />
                          </button>
                        </div>
                      </td>

                      {/* CHANNEL */}
                      <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                        <div className="text-[#2b2118]">{enq.channel}</div>
                        <div className="text-[11px] text-[#968d80]">
                          {enq.assignedTo}
                        </div>
                      </td>

                      {/* FOLLOW-UP */}
                      <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                        {enq.followUpDate ? (
                          <div>
                            <div className="text-[#2b2118] font-medium">
                              {fmtFullDate(enq.followUpDate)}
                            </div>
                            {followDue && (
                              <span className="mt-0.5 inline-block rounded-[3px] bg-[#fbe9e5] px-1.5 py-0.5 text-[9.5px] font-bold uppercase text-[#b4442e]">
                                DUE
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#968d80]">None set</span>
                        )}
                      </td>

                      {/* STATUS */}
                      <td
                        className="px-4 py-3.5 align-middle whitespace-nowrap"
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        <div className="flex flex-wrap items-center gap-1.5">
                          <select
                            value={
                              isEnquiryConverted(enq) ? "Converted" : enq.status
                            }
                            onChange={(ev) =>
                              applyEnquiryPatch(enq, {
                                status: ev.target.value,
                              })
                            }
                            className={`rounded-[4px] border px-2 py-0.5 text-[11px] font-semibold outline-none cursor-pointer ${statusPillStyle(
                              isEnquiryConverted(enq) ? "Converted" : enq.status,
                            )}`}
                          >
                            {STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>

                          {replySla && (
                            <span
                              className={`rounded-[3px] px-1.5 py-0.5 text-[9.5px] font-bold uppercase ${
                                replySla.urgent
                                  ? "bg-[#fbe9e5] text-[#b4442e]"
                                  : "bg-[#faf1de] text-[#9a6819]"
                              }`}
                            >
                              {replySla.text}
                            </span>
                          )}

                          {enq.linkedOrderId && (
                            <button
                              type="button"
                              onClick={() =>
                                onNavigateView?.(
                                  `order_detail:${enq.linkedOrderId}`,
                                )
                              }
                              className="block rounded-[3px] bg-[#e5f3e7] px-2 py-0.5 text-[10px] font-semibold text-[#2a6b3b] hover:underline cursor-pointer"
                            >
                              → {enq.linkedOrderId}
                            </button>
                          )}

                          {enq.linkedOfferId && !enq.linkedOrderId && (
                            <button
                              type="button"
                              onClick={() => onNavigateView?.("offers")}
                              className="block rounded-[3px] bg-[#e8eefb] px-2 py-0.5 text-[10px] font-semibold text-[#335498] hover:underline cursor-pointer"
                            >
                              → {enq.linkedOfferId}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#eee7dc] bg-[#fcfaf6] px-5 py-3 text-[11.5px] text-[#968d80]">
          Every reply, status change and note is written to that enquiry&apos;s
          own log. Whether a piece is free is read live from the calendar each
          time, never typed in.
        </div>
      </div>

      {/* Selected Enquiry Detail Panel (exact match to Screenshots 2, 5, 6) */}
      {selectedEnquiry && (
        <div
          ref={detailCardRef}
          className="rounded-[6px] border border-[#e8e1d5] bg-white p-6 shadow-[0_1px_3px_rgba(43,33,24,0.05)] space-y-5"
        >
          {/* Top Title Row */}
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#f0eae0] pb-4">
            <h2 className="text-[16px] font-semibold text-[#2b2118]">
              {selectedEnquiry.enquiryId} ·{" "}
              {selectedEnquiry.pieces[0]?.productName ||
                (selectedEnquiry.interestedIn === "General"
                  ? "What to wear"
                  : "Enquiry")}
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={
                  isEnquiryConverted(selectedEnquiry)
                    ? "Converted"
                    : selectedEnquiry.status
                }
                onChange={(e) =>
                  applyEnquiryPatch(selectedEnquiry, { status: e.target.value })
                }
                className={`rounded-[4px] border px-2.5 py-1 text-[11.5px] font-semibold outline-none cursor-pointer ${statusPillStyle(
                  isEnquiryConverted(selectedEnquiry)
                    ? "Converted"
                    : selectedEnquiry.status,
                )}`}
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              {(() => {
                const sla = getReplyDueLabel(selectedEnquiry);
                if (!sla) return null;
                return (
                  <span
                    className={`rounded-[3px] px-2 py-1 text-[10px] font-bold uppercase ${
                      sla.urgent
                        ? "bg-[#fbe9e5] text-[#b4442e]"
                        : "bg-[#faf1de] text-[#9a6819]"
                    }`}
                  >
                    {sla.text}
                  </span>
                );
              })()}

              {selectedEnquiry.linkedOrderId && (
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      onNavigateView?.(
                        `order_detail:${selectedEnquiry.linkedOrderId}`,
                      )
                    }
                    className="rounded-[4px] border border-[#c5e5cb] bg-[#e5f3e7] px-2.5 py-1 text-[11px] font-semibold text-[#2a6b3b] hover:underline cursor-pointer"
                  >
                    → {selectedEnquiry.linkedOrderId}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      applyEnquiryPatch(
                        selectedEnquiry,
                        { linkedOrderId: "" },
                        "Order unlinked",
                      )
                    }
                    title="Unlink this order"
                    className="rounded-[4px] border border-[#edd0c9] bg-white hover:bg-[#fdf3ef] px-2 py-1 text-[10.5px] font-medium text-[#b44b32] cursor-pointer"
                  >
                    Unlink
                  </button>
                </div>
              )}

              {selectedEnquiry.linkedOfferId &&
                !selectedEnquiry.linkedOrderId && (
                  <button
                    type="button"
                    onClick={() => onNavigateView?.("offers")}
                    className="rounded-[4px] border border-[#cddaf4] bg-[#e8eefb] px-2.5 py-1 text-[11px] font-semibold text-[#335498] hover:underline cursor-pointer"
                  >
                    → {selectedEnquiry.linkedOfferId}
                  </button>
                )}

              <button
                type="button"
                onClick={handleCloseDetailPanel}
                title="Hide enquiry details"
                className="inline-flex items-center gap-1 rounded-[4px] border border-[#ded6c8] bg-white hover:bg-[#faf7f2] px-2.5 py-1 text-[11.5px] font-medium text-[#6d655a] hover:text-[#2b2118] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Hide</span>
              </button>
            </div>
          </div>

          {/* 6-Field Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-[12.5px]">
            {/* CUSTOMER */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#968d80]">
                CUSTOMER
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onNavigateView?.(
                      `customer_detail:${encodeURIComponent(
                        selectedEnquiry.customerId ||
                          selectedEnquiry.customerEmail ||
                          selectedEnquiry.customerName,
                      )}`,
                    )
                  }
                  title="Open Customer Profile"
                  className="font-semibold text-[#b85a3a] hover:underline cursor-pointer text-left"
                >
                  {selectedEnquiry.customerName}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openWhatsApp(
                      selectedEnquiry.customerPhone,
                      selectedEnquiry.customerName,
                    )
                  }
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#25d366] text-white cursor-pointer"
                >
                  <WhatsAppBadgeIcon />
                </button>
              </div>
              <div className="mt-0.5 text-[11.5px] text-[#8a8073]">
                {[
                  selectedEnquiry.customerPhone,
                  selectedEnquiry.customerEmail,
                  selectedEnquiry.customerCity,
                ]
                  .filter(Boolean)
                  .join(" · ") || "No contact details added yet"}
              </div>
            </div>

            {/* RECEIVED */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#968d80]">
                RECEIVED
              </div>
              <div className="mt-1 font-medium text-[#2b2118]">
                {fmtDateTime(selectedEnquiry.createdAt)} via{" "}
                {selectedEnquiry.channel}
              </div>
            </div>

            {/* ASSIGNED TO */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#968d80]">
                ASSIGNED TO
              </div>
              <select
                value={selectedEnquiry.assignedTo}
                onChange={(e) =>
                  applyEnquiryPatch(
                    selectedEnquiry,
                    { assignedTo: e.target.value },
                    `Assigned to ${e.target.value}`,
                  )
                }
                className="mt-1 rounded-[4px] border border-[#ded6c8] bg-white px-2.5 py-1.5 text-[12px] text-[#2b2118] outline-none focus:border-[#c08829]"
              >
                {teamMembers.map((tm) => (
                  <option key={tm} value={tm}>
                    {tm}
                  </option>
                ))}
              </select>
            </div>

            {/* INTERESTED IN */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#968d80]">
                INTERESTED IN
              </div>
              <select
                value={selectedEnquiry.interestedIn}
                onChange={(e) =>
                  applyEnquiryPatch(selectedEnquiry, {
                    interestedIn: e.target.value,
                  })
                }
                className="mt-1 rounded-[4px] border border-[#ded6c8] bg-white px-2.5 py-1.5 text-[12px] text-[#2b2118] outline-none focus:border-[#c08829]"
              >
                {INTERESTS.map((it) => (
                  <option key={it} value={it}>
                    {it}
                  </option>
                ))}
              </select>
            </div>

            {/* EVENT & DATES TO HOLD */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#968d80]">
                {selectedEnquiry.interestedIn === "Rent"
                  ? "EVENT & DATES TO HOLD"
                  : "EVENT DATE"}
              </div>
              {!editingDates ? (
                <div className="mt-1 space-y-0.5">
                  {selectedEnquiry.eventDate ? (
                    <div className="font-medium text-[#2b2118]">
                      Event {fmtFullDate(selectedEnquiry.eventDate)}
                    </div>
                  ) : (
                    <div className="text-[#968d80]">No event date set</div>
                  )}
                  {selectedEnquiry.interestedIn === "Rent" &&
                    (selectedEnquiry.holdStartDate ||
                      selectedEnquiry.holdEndDate) && (
                      <div className="text-[#2b2118]">
                        Hold{" "}
                        {fmtHoldRange(
                          selectedEnquiry.holdStartDate,
                          selectedEnquiry.holdEndDate,
                        )}
                      </div>
                    )}
                  <button
                    type="button"
                    onClick={() => {
                      setEditEventDate(selectedEnquiry.eventDate || "");
                      setEditHoldStart(selectedEnquiry.holdStartDate || "");
                      setEditHoldEnd(selectedEnquiry.holdEndDate || "");
                      setEditingDates(true);
                    }}
                    className="text-[11.5px] text-[#c08829] underline underline-offset-2 hover:text-[#96681c] cursor-pointer"
                  >
                    Change dates
                  </button>
                </div>
              ) : (
                <div className="mt-1.5 space-y-2 rounded border border-[#e5ddd0] bg-[#faf7f1] p-2.5">
                  <div>
                    <label className="block text-[10px] uppercase text-[#8f8679]">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={editEventDate}
                      onChange={(e) => {
                        const v = e.target.value;
                        setEditEventDate(v);
                        const ev = parseDay(v);
                        if (ev && selectedEnquiry.interestedIn === "Rent") {
                          setEditHoldStart(toYMD(addDays(ev, -1)));
                          setEditHoldEnd(toYMD(addDays(ev, 1)));
                        }
                      }}
                      className="mt-0.5 w-full rounded border border-[#ded6c8] bg-white px-2 py-1 text-[11.5px]"
                    />
                  </div>
                  {selectedEnquiry.interestedIn === "Rent" && (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="date"
                        value={editHoldStart}
                        onChange={(e) => setEditHoldStart(e.target.value)}
                        className="w-full rounded border border-[#ded6c8] bg-white px-2 py-1 text-[11.5px]"
                      />
                      <span className="text-[11px] text-[#8f8679]">to</span>
                      <input
                        type="date"
                        value={editHoldEnd}
                        onChange={(e) => setEditHoldEnd(e.target.value)}
                        className="w-full rounded border border-[#ded6c8] bg-white px-2 py-1 text-[11.5px]"
                      />
                    </div>
                  )}
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={async () => {
                        await applyEnquiryPatch(
                          selectedEnquiry,
                          {
                            eventDate: editEventDate,
                            holdStartDate: editHoldStart,
                            holdEndDate: editHoldEnd,
                          },
                          "Dates updated",
                        );
                        setEditingDates(false);
                      }}
                      className="rounded bg-[#C7A55C] px-2.5 py-1 text-[11px] font-semibold text-[#2A2118] cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingDates(false)}
                      className="rounded border border-[#ded6c8] bg-white px-2.5 py-1 text-[11px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* FOLLOW-UP */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#968d80]">
                FOLLOW-UP
              </div>
              <div className="mt-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  {selectedEnquiry.followUpDate ? (
                    <>
                      <span className="font-medium text-[#2b2118]">
                        {fmtFullDate(selectedEnquiry.followUpDate)}
                      </span>
                      {isFollowUpDue(selectedEnquiry) && (
                        <span className="rounded-[3px] bg-[#fbe9e5] px-1.5 py-0.5 text-[9.5px] font-bold uppercase text-[#b4442e]">
                          DUE
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-[#968d80]">None set</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNextFollowUpDate(
                      selectedEnquiry.followUpDate || todayStr,
                    );
                    setShowConvertOfferModal(false);
                    setShowLinkOrderModal(false);
                    setShowFollowUpModal(true);
                  }}
                  className="text-[11.5px] text-[#c08829] underline underline-offset-2 hover:text-[#96681c] cursor-pointer"
                >
                  {selectedEnquiry.followUpDate
                    ? "Change follow-up"
                    : "Set follow-up"}
                </button>
              </div>
            </div>
          </div>

          {/* Pieces Asked About */}
          <div className="space-y-2.5 pt-1">
            <h4 className="text-[12.5px] font-semibold text-[#2b2118]">
              Pieces Asked About
            </h4>

            {selectedEnquiry.pieces.length === 0 ? (
              <div className="rounded-[4px] border border-dashed border-[#ded6c8] bg-[#fcfaf6] px-4 py-3 text-[12px] text-[#8f8679]">
                No piece yet. She asked what to wear, so add the pieces you
                suggest as the conversation goes.
              </div>
            ) : (
              <div className="space-y-2">
                {selectedEnquiry.pieces.map((p, idx) => {
                  const pAvail = evaluatePieceAvailability(p, selectedEnquiry);
                  const liveProd = listedProducts.find(
                    (lp: any) =>
                      String(lp.id) === String(p.productId) ||
                      String(lp.productId) === String(p.productId) ||
                      String(lp._id) === String(p.productId) ||
                      String(lp.name) === String(p.productName),
                  ) as any;
                  const pThumb =
                    p.image ||
                    (Array.isArray(liveProd?.images) && liveProd.images[0]) ||
                    (typeof liveProd?.image === "string" ? liveProd.image : "");
                  return (
                    <div
                      key={`${p.productId || p.productName}-${idx}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[#e8e1d5] bg-[#fcfaf6] px-3.5 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        {pThumb ? (
                          <img
                            src={pThumb}
                            alt={p.productName}
                            className="h-11 w-9 rounded-[3px] object-cover border border-[#e5ddd0] bg-[#2d1e1b]"
                          />
                        ) : (
                          <div className="h-11 w-9 rounded-[3px] bg-[#2d1e1b] text-[#c7a35e] flex items-center justify-center text-[13px]">
                            ♢
                          </div>
                        )}
                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              onNavigateView?.(
                                `product_detail:${encodeURIComponent(
                                  liveProd?.id ||
                                    liveProd?.productId ||
                                    p.productId ||
                                    p.productName,
                                )}`,
                              )
                            }
                            title="Open Product Page"
                            className="text-[13px] font-semibold text-[#b85a3a] hover:underline cursor-pointer text-left block"
                          >
                            {p.productName}
                          </button>
                          <div className="text-[11.5px] text-[#8a8073]">
                            {resolveProductMetaLine(p)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {pAvail && (
                          <span
                            className={`rounded-[3px] px-2 py-0.5 text-[10px] font-bold uppercase ${availBadgeClass(
                              pAvail.tone,
                            )}`}
                          >
                            {pAvail.label}
                          </span>
                        )}
                        {(() => {
                          if (!selectedEnquiry.linkedOrderId) return null;
                          const linkedOrd = orders.find(
                            (o: any) =>
                              String(o.id || o.orderId) ===
                              String(selectedEnquiry.linkedOrderId),
                          );
                          if (linkedOrd && !isPieceInOrder(p, linkedOrd)) {
                            return null;
                          }
                          return (
                            <button
                              type="button"
                              onClick={() =>
                                onNavigateView?.(
                                  `order_detail:${selectedEnquiry.linkedOrderId}`,
                                )
                              }
                              className="rounded-[3px] border border-[#c5e5cb] bg-[#e5f3e7] px-2 py-0.5 text-[10px] font-semibold text-[#2a6b3b] cursor-pointer"
                            >
                              → {selectedEnquiry.linkedOrderId}
                            </button>
                          );
                        })()}
                        <button
                          type="button"
                          onClick={() =>
                            applyEnquiryPatch(
                              selectedEnquiry,
                              {
                                removePieceKey: p.productId || p.productName,
                              },
                              "Piece removed",
                            )
                          }
                          title="Remove piece"
                          className="rounded border border-[#e2dad0] bg-white p-1 text-[#8f8679] hover:text-[#2b2118] cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Piece Selector (Searchable) */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SearchablePiecePicker
                  value={pieceToAdd}
                  onChange={(val) => setPieceToAdd(val)}
                  emptyLabel={
                    selectedEnquiry.interestedIn === "Rent"
                      ? "Add a piece she asked about or you suggested (free or booked on her dates shown)..."
                      : "Add a piece she asked about or you suggested..."
                  }
                  options={listedProducts
                    .filter(
                      (prod: any) =>
                        !selectedEnquiry.pieces.some(
                          (sp) =>
                            String(sp.productId) ===
                              String(prod.productId || prod._id || prod.id) ||
                            String(sp.productName) ===
                              String(prod.name || prod.title),
                        ),
                    )
                    .map((prod: any) =>
                      toPieceOptionItem(
                        prod,
                        selectedEnquiry.interestedIn,
                        selectedEnquiry,
                      ),
                    )}
                />
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (!pieceToAdd) return;
                  await applyEnquiryPatch(
                    selectedEnquiry,
                    { addPieceId: pieceToAdd },
                    "Piece added",
                  );
                  setPieceToAdd("");
                }}
                className="rounded-[4px] border border-[#ded6c8] bg-white hover:bg-[#faf7f2] px-4 py-2 text-[12px] font-medium text-[#2b2118] cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Conversation Log */}
          <div className="space-y-3 pt-1">
            <h4 className="text-[12.5px] font-semibold text-[#2b2118]">
              Conversation Log
            </h4>

            {selectedEnquiry.conversationLog.length === 0 ? (
              <p className="text-[12px] text-[#968d80]">
                No notes logged yet. Add the first note below.
              </p>
            ) : (
              <div className="relative border-l-2 border-[#e8dfd1] ml-2 pl-4 space-y-3.5">
                {selectedEnquiry.conversationLog.map((entry, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#c7a35e] ring-2 ring-white" />
                    <div className="text-[11px] text-[#968d80]">
                      {fmtFullDate(entry.createdAt)} · {entry.author}
                    </div>
                    <div className="mt-0.5 text-[12.5px] text-[#2b2118]">
                      {entry.message}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && noteText.trim()) {
                    e.preventDefault();
                    applyEnquiryPatch(
                      selectedEnquiry,
                      { note: noteText.trim() },
                      "Note added",
                    ).then(() => setNoteText(""));
                  }
                }}
                placeholder="Add a note to the conversation log..."
                className="flex-1 rounded-[4px] border border-[#ded6c8] bg-[#f7f4ee] px-3 py-2 text-[12.5px] text-[#2b2118] outline-none focus:border-[#c08829] focus:bg-white"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!noteText.trim()) return;
                  await applyEnquiryPatch(
                    selectedEnquiry,
                    { note: noteText.trim() },
                    "Note added",
                  );
                  setNoteText("");
                }}
                className="rounded-[4px] border border-[#ded6c8] bg-white hover:bg-[#faf7f2] px-4 py-2 text-[12px] font-medium text-[#2b2118] cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Inline Modals for Convert to Offer / Link Order / Set Follow-up */}
          {showConvertOfferModal && (
            <div className="flex flex-wrap items-center gap-2 rounded-[4px] border border-[#e5ddd0] bg-[#faf7f1] p-3">
              <span className="text-[12px] font-medium text-[#5c5347]">
                Customer&apos;s Offer Amount (₹):
              </span>
              <input
                type="number"
                min={1}
                value={convertOfferAmount}
                onChange={(e) => setConvertOfferAmount(e.target.value)}
                placeholder="e.g. 18000"
                className="w-40 rounded border border-[#ded6c8] bg-white px-2.5 py-1.5 text-[12px] text-[#2b2118] outline-none focus:border-[#c08829]"
              />
              <button
                type="button"
                disabled={converting}
                onClick={() =>
                  handleConvert(
                    selectedEnquiry,
                    "offer",
                    Number(convertOfferAmount) || undefined,
                  )
                }
                className="rounded bg-[#C7A55C] px-3 py-1.5 text-[12px] font-semibold text-[#2A2118] hover:bg-[#b89448] disabled:opacity-60 cursor-pointer"
              >
                {converting ? "Creating..." : "Create Offer"}
              </button>
              <button
                type="button"
                onClick={() => setShowConvertOfferModal(false)}
                className="rounded border border-[#ded6c8] bg-white px-3 py-1.5 text-[12px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {showLinkOrderModal &&
            (() => {
              const customerOrders = liveOrders.filter((o: any) =>
                doesOrderBelongToEnquiryCustomer(o, selectedEnquiry),
              );
              const q = orderSearchQuery.trim().toLowerCase();
              const visibleCustomerOrders = customerOrders.filter((o: any) =>
                !q
                  ? true
                  : `${o.id} ${o.productName} ${o.mode || ""}`
                      .toLowerCase()
                      .includes(q),
              );

              return (
                <div className="space-y-2.5 rounded-[4px] border border-[#e5ddd0] bg-[#faf7f1] p-3.5">
                  {customerOrders.length === 0 ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[12px] text-[#5c5347]">
                        <div className="font-semibold text-[#2b2118]">
                          No website orders found for{" "}
                          {selectedEnquiry.customerName}.
                        </div>
                        <div className="mt-0.5 text-[11.5px] text-[#8a8073]">
                          Only orders placed by {selectedEnquiry.customerName}{" "}
                          (matching Customer ID, phone or email) can be linked
                          here — another customer&apos;s order cannot be linked.
                          {selectedEnquiry.interestedIn !== "General" &&
                            " Use Convert to Booking / Order to create a new order for her."}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedEnquiry.linkedOrderId && (
                          <button
                            type="button"
                            onClick={async () => {
                              await applyEnquiryPatch(
                                selectedEnquiry,
                                { linkedOrderId: "" },
                                "Order unlinked",
                              );
                              setShowLinkOrderModal(false);
                            }}
                            className="rounded border border-[#edd0c9] bg-white hover:bg-[#fdf3ef] px-3 py-1.5 text-[12px] font-medium text-[#b44b32] cursor-pointer"
                          >
                            Unlink {selectedEnquiry.linkedOrderId}
                          </button>
                        )}
                        {selectedEnquiry.interestedIn !== "General" &&
                          !selectedEnquiry.linkedOrderId && (
                            <button
                              type="button"
                              disabled={converting}
                              onClick={() => {
                                setShowLinkOrderModal(false);
                                handleConvert(selectedEnquiry, "order");
                              }}
                              className="rounded bg-[#1c1917] hover:bg-[#2e2925] px-3 py-1.5 text-[12px] font-semibold text-white cursor-pointer"
                            >
                              {selectedEnquiry.interestedIn === "Rent"
                                ? "Convert to Booking"
                                : "Convert to Order"}
                            </button>
                          )}
                        <button
                          type="button"
                          onClick={() => setShowLinkOrderModal(false)}
                          className="rounded border border-[#ded6c8] bg-white px-3 py-1.5 text-[12px] cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-[11.5px] text-[#7d756b]">
                        Showing orders placed by{" "}
                        <strong className="text-[#2b2118]">
                          {selectedEnquiry.customerName}
                        </strong>{" "}
                        only ({customerOrders.length} found):
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {customerOrders.length > 3 && (
                          <input
                            type="text"
                            value={orderSearchQuery}
                            onChange={(e) =>
                              setOrderSearchQuery(e.target.value)
                            }
                            placeholder="Filter her orders by ID or piece..."
                            className="w-56 rounded border border-[#ded6c8] bg-white px-2.5 py-1.5 text-[12px] outline-none focus:border-[#c08829]"
                          />
                        )}
                        <select
                          value={orderToLink}
                          onChange={(e) => setOrderToLink(e.target.value)}
                          className="flex-1 min-w-[240px] rounded border border-[#ded6c8] bg-white px-3 py-1.5 text-[12px]"
                        >
                          <option value="">
                            Select {selectedEnquiry.customerName}&apos;s order
                            to link…
                          </option>
                          {visibleCustomerOrders.map((o: any) => (
                            <option key={o.id} value={o.id}>
                              {o.id} · {o.productName} · ₹
                              {Number(
                                o.grandTotal || o.amount || 0,
                              ).toLocaleString("en-IN")}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!orderToLink) {
                              toast.error("Please select an order first");
                              return;
                            }
                            await applyEnquiryPatch(
                              selectedEnquiry,
                              { linkedOrderId: orderToLink },
                              `Linked to ${orderToLink}`,
                            );
                            setShowLinkOrderModal(false);
                            setOrderToLink("");
                          }}
                          className="rounded bg-[#1f1915] px-3 py-1.5 text-[12px] font-semibold text-white cursor-pointer"
                        >
                          Link Order
                        </button>
                        {selectedEnquiry.linkedOrderId && (
                          <button
                            type="button"
                            onClick={async () => {
                              await applyEnquiryPatch(
                                selectedEnquiry,
                                { linkedOrderId: "" },
                                "Order unlinked",
                              );
                              setShowLinkOrderModal(false);
                              setOrderToLink("");
                            }}
                            className="rounded border border-[#edd0c9] bg-white hover:bg-[#fdf3ef] px-3 py-1.5 text-[12px] font-medium text-[#b44b32] cursor-pointer"
                          >
                            Unlink
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowLinkOrderModal(false)}
                          className="rounded border border-[#ded6c8] bg-white px-3 py-1.5 text-[12px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

          {showFollowUpModal && (
            <div className="flex flex-wrap items-center gap-2 rounded-[4px] border border-[#e5ddd0] bg-[#faf7f1] p-3">
              <span className="text-[12px] text-[#5c5347]">Follow up on:</span>
              <input
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="rounded border border-[#ded6c8] bg-white px-2.5 py-1 text-[12px]"
              />
              <button
                type="button"
                disabled={savingFollowUp}
                onClick={() => handleSaveFollowUp(selectedEnquiry, todayStr)}
                className="rounded border border-[#ded6c8] bg-white hover:bg-[#faf7f2] px-2.5 py-1 text-[11px] font-medium text-[#5c5347] cursor-pointer disabled:opacity-50"
              >
                Today
              </button>
              <button
                type="button"
                disabled={savingFollowUp}
                onClick={() =>
                  handleSaveFollowUp(
                    selectedEnquiry,
                    toYMD(addDays(today, 1)),
                  )
                }
                className="rounded border border-[#ded6c8] bg-white hover:bg-[#faf7f2] px-2.5 py-1 text-[11px] font-medium text-[#5c5347] cursor-pointer disabled:opacity-50"
              >
                Tomorrow
              </button>
              <button
                type="button"
                disabled={savingFollowUp}
                onClick={() =>
                  handleSaveFollowUp(
                    selectedEnquiry,
                    toYMD(addDays(today, 3)),
                  )
                }
                className="rounded border border-[#ded6c8] bg-white hover:bg-[#faf7f2] px-2.5 py-1 text-[11px] font-medium text-[#5c5347] cursor-pointer disabled:opacity-50"
              >
                +3 Days
              </button>
              <button
                type="button"
                disabled={savingFollowUp}
                onClick={() =>
                  handleSaveFollowUp(
                    selectedEnquiry,
                    toYMD(addDays(today, 7)),
                  )
                }
                className="rounded border border-[#ded6c8] bg-white hover:bg-[#faf7f2] px-2.5 py-1 text-[11px] font-medium text-[#5c5347] cursor-pointer disabled:opacity-50"
              >
                +1 Week
              </button>
              <button
                type="button"
                disabled={savingFollowUp}
                onClick={async () => {
                  if (!nextFollowUpDate) {
                    toast.error("Please select a follow-up date first");
                    return;
                  }
                  await handleSaveFollowUp(selectedEnquiry, nextFollowUpDate);
                }}
                className="rounded bg-[#C7A55C] hover:bg-[#b89448] px-3 py-1.5 text-[12px] font-semibold text-[#2A2118] cursor-pointer disabled:opacity-60"
              >
                {savingFollowUp ? "Saving…" : "Save Follow-up"}
              </button>
              {selectedEnquiry.followUpDate && (
                <button
                  type="button"
                  disabled={savingFollowUp}
                  onClick={() => handleSaveFollowUp(selectedEnquiry, "")}
                  className="rounded border border-[#edd0c9] bg-white hover:bg-[#fdf3ef] px-2.5 py-1.5 text-[11.5px] text-[#b44b32] cursor-pointer disabled:opacity-50"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowFollowUpModal(false)}
                className="rounded border border-[#ded6c8] bg-white px-3 py-1.5 text-[12px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Action Bar (exact match to Screenshots 2, 5, 6) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {selectedEnquiry.interestedIn === "Rent" && (
                <button
                  type="button"
                  disabled={converting}
                  onClick={() => handleConvert(selectedEnquiry, "order")}
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#1c1917] hover:bg-[#2e2925] disabled:opacity-60 px-4 py-2 text-[12px] font-semibold text-white cursor-pointer"
                >
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>
                    {converting
                      ? "Creating Booking..."
                      : selectedEnquiry.linkedOrderId
                        ? `View Booking (${selectedEnquiry.linkedOrderId})`
                        : "Convert to Booking"}
                  </span>
                </button>
              )}

              {selectedEnquiry.interestedIn === "Buy preloved" && (
                <>
                  <button
                    type="button"
                    disabled={converting}
                    onClick={() => handleConvert(selectedEnquiry, "order")}
                    className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#1c1917] hover:bg-[#2e2925] disabled:opacity-60 px-4 py-2 text-[12px] font-semibold text-white cursor-pointer"
                  >
                    <span>
                      {converting
                        ? "Creating Order..."
                        : selectedEnquiry.linkedOrderId
                          ? `View Order (${selectedEnquiry.linkedOrderId})`
                          : "Convert to Order"}
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={converting}
                    onClick={() => {
                      if (selectedEnquiry.linkedOfferId) {
                        onNavigateView?.("offers");
                        return;
                      }
                      const p0 = selectedEnquiry.pieces[0];
                      const prod0 = listedProducts.find(
                        (lp: any) =>
                          String(lp.productId || lp._id || lp.id) ===
                            String(p0?.productId || "") ||
                          String(lp.name || lp.title) ===
                            String(p0?.productName || ""),
                      ) as any;
                      const defAmt = Number(
                        prod0?.listingPrice ||
                          prod0?.price ||
                          p0?.listingPrice ||
                          0,
                      );
                      setConvertOfferAmount(defAmt > 0 ? String(defAmt) : "");
                      setShowLinkOrderModal(false);
                      setShowFollowUpModal(false);
                      setShowConvertOfferModal((v) => !v);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#ded6c8] bg-white hover:bg-[#faf7f2] px-3.5 py-2 text-[12px] font-medium text-[#2b2118] cursor-pointer"
                  >
                    <span>
                      {selectedEnquiry.linkedOfferId
                        ? `View Offer (${selectedEnquiry.linkedOfferId})`
                        : "Convert to Offer"}
                    </span>
                  </button>
                </>
              )}

              {selectedEnquiry.interestedIn === "Buy new" && (
                <button
                  type="button"
                  disabled={converting}
                  onClick={() => handleConvert(selectedEnquiry, "order")}
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#1c1917] hover:bg-[#2e2925] disabled:opacity-60 px-4 py-2 text-[12px] font-semibold text-white cursor-pointer"
                >
                  <span>
                    {converting
                      ? "Creating Order..."
                      : selectedEnquiry.linkedOrderId
                        ? `View Order (${selectedEnquiry.linkedOrderId})`
                        : "Convert to Order"}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setOrderToLink(selectedEnquiry.linkedOrderId || "");
                  setShowConvertOfferModal(false);
                  setShowFollowUpModal(false);
                  setShowLinkOrderModal((v) => !v);
                }}
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#ded6c8] bg-white hover:bg-[#faf7f2] px-3.5 py-2 text-[12px] font-medium text-[#2b2118] cursor-pointer"
              >
                <Link2 className="h-3.5 w-3.5 text-[#7d756b]" />
                <span>Link an Order</span>
              </button>

              <button
                type="button"
                disabled={savingFollowUp}
                onClick={async () => {
                  if (showFollowUpModal) {
                    if (
                      nextFollowUpDate &&
                      nextFollowUpDate !== (selectedEnquiry.followUpDate || "")
                    ) {
                      await handleSaveFollowUp(
                        selectedEnquiry,
                        nextFollowUpDate,
                      );
                      return;
                    }
                    setShowFollowUpModal(false);
                    return;
                  }
                  setNextFollowUpDate(
                    selectedEnquiry.followUpDate || toYMD(addDays(today, 1)),
                  );
                  setShowConvertOfferModal(false);
                  setShowLinkOrderModal(false);
                  setShowFollowUpModal(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#ded6c8] bg-white hover:bg-[#faf7f2] px-3.5 py-2 text-[12px] font-medium text-[#2b2118] cursor-pointer disabled:opacity-50"
              >
                <Clock className="h-3.5 w-3.5 text-[#7d756b]" />
                <span>
                  {selectedEnquiry.followUpDate
                    ? `Follow-up: ${fmtFullDate(selectedEnquiry.followUpDate)}`
                    : "Set Follow-up"}
                </span>
              </button>

              {!isEnquiryConverted(selectedEnquiry) && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      applyEnquiryPatch(
                        selectedEnquiry,
                        {
                          status:
                            selectedEnquiry.status === "On Hold"
                              ? "In Conversation"
                              : "On Hold",
                        },
                        selectedEnquiry.status === "On Hold"
                          ? "Enquiry resumed"
                          : "Placed on hold",
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#ded6c8] bg-white hover:bg-[#faf7f2] px-3.5 py-2 text-[12px] font-medium text-[#2b2118] cursor-pointer"
                  >
                    <Pause className="h-3.5 w-3.5 text-[#7d756b]" />
                    <span>
                      {selectedEnquiry.status === "On Hold"
                        ? "Resume Enquiry"
                        : "Put on Hold"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      applyEnquiryPatch(
                        selectedEnquiry,
                        {
                          status:
                            selectedEnquiry.status === "Closed"
                              ? "In Conversation"
                              : "Closed",
                        },
                        selectedEnquiry.status === "Closed"
                          ? "Enquiry reopened"
                          : "Enquiry closed",
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#edd0c9] bg-white hover:bg-[#fdf3ef] px-3.5 py-2 text-[12px] font-medium text-[#b44b32] cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>
                      {selectedEnquiry.status === "Closed"
                        ? "Reopen Enquiry"
                        : "Close Enquiry"}
                    </span>
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleCloseDetailPanel}
              className="inline-flex items-center gap-1 rounded-[4px] border border-[#ded6c8] bg-[#faf7f2] hover:bg-[#f0ebe2] px-3 py-2 text-[12px] font-medium text-[#6d655a] hover:text-[#2b2118] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Hide Panel</span>
            </button>
          </div>

          <p className="text-[11px] text-[#968d80]">
            {selectedEnquiry.interestedIn === "General"
              ? "To convert it, set what she wants under Interested In: Rent shows Convert to Booking, Buy preloved shows Convert to Order and Convert to Offer. If she booked or bought on the website herself, use Link an Order."
              : "If she booked or bought on the website herself, use Link an Order so it counts as converted."}
          </p>
        </div>
      )}
    </div>
  );
}
