import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Offer, OfferPiece, Product, Customer } from "../types";
import * as offerApi from "../services/offerApi";
import toast from "react-hot-toast";
import { useTeamPermissions } from "./TeamPermissions";

interface OffersViewProps {
  offers: Offer[];
  products: Product[];
  customers?: Customer[];
  listers: any[];
  currentAdminName?: string;
  loading?: boolean;
  onUpdateOffer: (id: string, updatedFields: Partial<Offer>) => void;
  onAddOffer: (offer: Offer) => void;
  onOfferRecordUpdated?: (offer: Offer) => void;
  onCustomerCreated?: (customer: Customer) => void;
  onSelectOrder?: (orderId: string) => void;
  onNavigateView?: (view: string) => void;
}

type MetricFilterKey =
  | "all"
  | "pending"
  | "accepted_mtd"
  | "with_offer"
  | "revenue_mtd";

const money = (value: number) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const tone: Record<Offer["status"], string> = {
  Pending: "pending",
  Accepted: "accepted",
  Declined: "declined",
  Countered: "countered",
  Expired: "expired",
  "On Hold": "hold",
  Enquiry: "enquiry",
};

const ALL_STATUSES: Offer["status"][] = [
  "Pending",
  "Countered",
  "Accepted",
  "Declined",
  "Expired",
  "On Hold",
  "Enquiry",
];

const PAGE_SIZE = 10;

const isSameMonthAsNow = (dateVal?: string) => {
  if (!dateVal) return true;
  const parsed = new Date(dateVal);
  if (Number.isNaN(parsed.getTime())) return true;
  const now = new Date();
  return (
    parsed.getFullYear() === now.getFullYear() &&
    parsed.getMonth() === now.getMonth()
  );
};

const openWhatsAppChat = (
  phone?: string,
  customerName?: string,
  productName?: string,
) => {
  const digits = String(phone || "").replace(/\D/g, "");
  const formatted =
    digits.length === 10
      ? `91${digits}`
      : digits.length > 10
        ? digits
        : "";
  const greeting = customerName
    ? `Hi ${customerName}, regarding your offer${productName ? ` on ${productName}` : ""} at House of Kaira:`
    : "Hi from House of Kaira:";
  const url = formatted
    ? `https://wa.me/${formatted}?text=${encodeURIComponent(greeting)}`
    : `https://wa.me/?text=${encodeURIComponent(greeting)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

const getProductThumb = (prod?: any): string => {
  if (!prod) return "";
  if (Array.isArray(prod.images) && prod.images.length > 0 && prod.images[0]) {
    return String(prod.images[0]);
  }
  if (typeof prod.image === "string" && prod.image.trim()) {
    return prod.image.trim();
  }
  return "";
};

const getProductPrice = (prod?: any): number => {
  if (!prod) return 0;
  return Number(
    prod.listingPrice ||
      prod.rentalPrice ||
      prod.originalRetailPrice ||
      prod.price ||
      0,
  );
};

function ProductThumbBox({
  src,
  alt,
  ivory,
  size = "table",
}: {
  src?: string;
  alt: string;
  ivory?: boolean;
  size?: "table" | "small";
}) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const dims =
    size === "small"
      ? "h-10 w-8 text-[13px]"
      : "h-[52px] w-[40px] text-[18px]";

  if (src && !imgFailed) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setImgFailed(true)}
        className={`${dims} shrink-0 rounded-[3px] border border-[#e3dbd0] bg-[#2d1e1b] object-cover shadow-2xs`}
      />
    );
  }

  return (
    <div
      className={`product-thumb ${ivory ? "ivory" : ""} ${
        size === "small" ? "!h-10 !w-8 !text-[14px]" : ""
      }`}
    >
      ♢
    </div>
  );
}

function SearchableOfferPieceSelect({
  products,
  value,
  onChange,
  placeholder = "Select a piece...",
  excludeKeys = [],
  allowClear = false,
}: {
  products: Product[];
  value: string;
  onChange: (productKey: string) => void;
  placeholder?: string;
  excludeKeys?: string[];
  allowClear?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const getKey = (p: any) => String(p.id || p.productId || p._id || p.name || "");

  const selectedProd = useMemo(
    () =>
      products.find(
        (p: any) =>
          getKey(p) === value ||
          String(p.name || "") === value ||
          String(p.productId || "") === value,
      ),
    [products, value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p: any) => {
      const k = getKey(p);
      if (!k || !p.name) return false;
      if (excludeKeys.includes(k) && k !== value) return false;
      if (!q) return true;
      return (
        String(p.name || "").toLowerCase().includes(q) ||
        String(p.designer || "").toLowerCase().includes(q) ||
        String(p.category || "").toLowerCase().includes(q)
      );
    });
  }, [products, query, excludeKeys, value]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[41px] w-full items-center justify-between gap-2 rounded-[5px] border border-[#dcd5ca] bg-white px-3 py-1.5 text-left text-[13.5px] text-[#403c38] outline-none hover:border-[#c5a65f] focus:border-[#c5a65f] cursor-pointer"
      >
        {selectedProd ? (
          <div className="flex min-w-0 items-center gap-2.5">
            <ProductThumbBox
              src={getProductThumb(selectedProd)}
              alt={selectedProd.name}
              size="small"
            />
            <div className="min-w-0 truncate">
              <span className="font-semibold text-[#2b2118]">
                {selectedProd.name}
              </span>
              <span className="ml-1.5 text-[12px] text-[#8a8073]">
                — {selectedProd.designer || "House of Kaira"} ·{" "}
                {money(getProductPrice(selectedProd))}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-[#9d9790]">{placeholder}</span>
        )}
        <div className="flex items-center gap-1 shrink-0">
          {allowClear && selectedProd && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="rounded p-0.5 text-[#968d80] hover:bg-[#f3efe8] hover:text-[#2b2118]"
              title="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-[#7c746b]" />
        </div>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 rounded-[5px] border border-[#d8cfc2] bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#eee7dc] px-3 py-2">
            <Search className="h-3.5 w-3.5 text-[#968d80]" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search piece or designer..."
              className="!h-7 w-full !border-0 !bg-transparent !p-0 text-[12.5px] text-[#2b2118] outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-[#968d80] hover:text-[#2b2118]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {allowClear && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="flex w-full items-center px-3 py-2 text-left text-[12.5px] text-[#8a8073] hover:bg-[#faf7f2] cursor-pointer"
              >
                None
              </button>
            )}
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-[12px] text-[#968d80]">
                No matching pieces found{query ? ` for "${query}"` : ""}.
              </div>
            ) : (
              filtered.map((prod: any) => {
                const k = getKey(prod);
                const active = k === value || prod.name === value;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      onChange(k);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors hover:bg-[#faf7f2] cursor-pointer ${
                      active ? "bg-[#f8f2e6]" : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <ProductThumbBox
                        src={getProductThumb(prod)}
                        alt={prod.name}
                        size="small"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-semibold text-[#2b2118]">
                          {prod.name}
                        </div>
                        <div className="truncate text-[11.5px] text-[#8a8073]">
                          {prod.designer || "House of Kaira"} ·{" "}
                          {money(getProductPrice(prod))}
                        </div>
                      </div>
                    </div>
                    {prod.status === "Sold" ? (
                      <span className="shrink-0 rounded bg-[#fbe9e5] px-2 py-0.5 text-[10px] font-bold uppercase text-[#b4442e]">
                        Sold Out
                      </span>
                    ) : (
                      <span className="shrink-0 rounded bg-[#e8f3ea] px-2 py-0.5 text-[10px] font-bold uppercase text-[#2f6f44]">
                        Listed
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

export default function OffersView({
  offers,
  products,
  customers = [],
  listers,
  currentAdminName = "Soumya",
  loading = false,
  onUpdateOffer,
  onAddOffer,
  onOfferRecordUpdated,
  onSelectOrder,
  onNavigateView,
}: OffersViewProps) {
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [activeMetricFilter, setActiveMetricFilter] =
    useState<MetricFilterKey>("all");
  const [page, setPage] = useState(1);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [showNewOffer, setShowNewOffer] = useState(false);
  const [counterOffer, setCounterOffer] = useState<Offer | null>(null);
  const [counterAmount, setCounterAmount] = useState("60000");
  const [confirmAction, setConfirmAction] = useState<{
    offer: Offer;
    status: Offer["status"];
  } | null>(null);
  const [acceptedNotice, setAcceptedNotice] = useState(false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [liveProducts, setLiveProducts] = useState<Product[]>(products);
  const tableCardRef = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (products && products.length > 0) {
      setLiveProducts(products);
    }
  }, [products]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((body) => {
        const list = Array.isArray(body)
          ? body
          : Array.isArray(body?.data)
            ? body.data
            : Array.isArray(body?.products)
              ? body.products
              : [];
        if (list.length > 0 && liveProducts.length === 0) {
          setLiveProducts(list);
        }
      })
      .catch(() => {});
  }, []);

  const catalogProducts = useMemo(() => {
    const merged = new Map<string, Product>();
    for (const p of [...products, ...liveProducts]) {
      const k = String(
        (p as any).id || p.productId || (p as any)._id || p.name || "",
      );
      if (k && p.name && !merged.has(k)) {
        merged.set(k, p);
      }
    }
    return Array.from(merged.values());
  }, [products, liveProducts]);

  const matchCatalogProduct = (ref: {
    productId?: string;
    productName?: string;
  }): Product | undefined => {
    const pid = String(ref.productId || "").trim().toLowerCase();
    const pname = String(ref.productName || "").trim().toLowerCase();
    return catalogProducts.find((p: any) => {
      const ids = [p.id, p.productId, p._id, p.sku]
        .filter(Boolean)
        .map((x) => String(x).trim().toLowerCase());
      if (pid && ids.includes(pid)) return true;
      if (pname && String(p.name || "").trim().toLowerCase() === pname) {
        return true;
      }
      return false;
    });
  };

  const resolveOfferPieces = (offer: Offer): OfferPiece[] => {
    const basePieces: OfferPiece[] =
      Array.isArray(offer.pieces) && offer.pieces.length > 0
        ? offer.pieces
        : offer.productName
          ? [
              {
                productId: offer.productId,
                productName: offer.productName,
                designer: offer.designer,
                image: offer.productImage,
                listingPrice: offer.marketPrice,
              },
            ]
          : [];

    return basePieces.map((piece) => {
      const matched = matchCatalogProduct(piece);
      return {
        productId:
          piece.productId ||
          matched?.id ||
          matched?.productId ||
          (matched as any)?._id ||
          "",
        productName: piece.productName || matched?.name || offer.productName,
        designer: piece.designer || matched?.designer || offer.designer || "",
        image:
          piece.image ||
          getProductThumb(matched) ||
          offer.productImage ||
          "",
        listingPrice: Number(
          piece.listingPrice || getProductPrice(matched) || offer.marketPrice || 0,
        ),
        rentalPrice: Number(piece.rentalPrice || matched?.rentalPrice || 0),
      };
    });
  };

  const navigateToProduct = (piece: {
    productId?: string;
    productName?: string;
  }) => {
    const matched = matchCatalogProduct(piece);
    const targetKey =
      matched?.id ||
      matched?.productId ||
      (matched as any)?._id ||
      piece.productId ||
      piece.productName ||
      "";
    if (!targetKey) return;
    onNavigateView?.(`product_detail:${encodeURIComponent(String(targetKey))}`);
  };

  const navigateToCustomer = (offer: Offer) => {
    const cleanEmail = String(offer.customerEmail || "").trim().toLowerCase();
    const cleanDigits = String(offer.phone || "").replace(/\D/g, "").slice(-10);
    const cleanName = String(offer.customerName || "").trim().toLowerCase();

    const matchedCustomer = customers.find((c) => {
      if (
        offer.customerId &&
        (c.customerId === offer.customerId ||
          c.id === offer.customerId ||
          (c as any)._id === offer.customerId)
      ) {
        return true;
      }
      if (cleanEmail && c.email?.trim().toLowerCase() === cleanEmail) {
        return true;
      }
      if (
        cleanDigits.length === 10 &&
        c.phone &&
        c.phone.replace(/\D/g, "").slice(-10) === cleanDigits
      ) {
        return true;
      }
      if (cleanName && c.name?.trim().toLowerCase() === cleanName) {
        return true;
      }
      return false;
    });

    const targetKey =
      matchedCustomer?.customerId ||
      matchedCustomer?.id ||
      (matchedCustomer as any)?._id ||
      offer.customerId ||
      offer.customerName;

    if (targetKey) {
      onNavigateView?.(
        `customer_detail:${encodeURIComponent(String(targetKey))}`,
      );
    } else {
      onNavigateView?.("customers");
    }
  };

  const [form, setForm] = useState({
    customerId: "",
    customerName: "",
    source: "Phone",
    email: "",
    phone: "",
    primaryPieceKey: "",
    extraPieceKeys: [] as string[],
    alsoPieceDraft: "",
    assignedTo: currentAdminName,
    offerAmount: "",
    note: "",
  });

  // KPI Metrics (100% consistent with card-click filtering)
  const pendingOffersList = useMemo(
    () => offers.filter((offer) => offer.status === "Pending"),
    [offers],
  );
  const acceptedMtdList = useMemo(
    () =>
      offers.filter(
        (offer) => offer.status === "Accepted" && isSameMonthAsNow(offer.date),
      ),
    [offers],
  );
  const offeredWithAmountList = useMemo(
    () =>
      offers.filter(
        (offer) => offer.offerPrice > 0 && offer.status !== "Enquiry",
      ),
    [offers],
  );
  const revenueMtdList = useMemo(
    () => acceptedMtdList.filter((offer) => offer.offerPrice > 0),
    [acceptedMtdList],
  );

  const averageOfferPercent = offeredWithAmountList.length
    ? Math.round(
        offeredWithAmountList.reduce(
          (total, offer) => total + offer.askPercentage,
          0,
        ) / offeredWithAmountList.length,
      )
    : 0;

  const acceptedRevenue = revenueMtdList.reduce(
    (total, offer) => total + offer.offerPrice,
    0,
  );

  const handleMetricCardClick = (metric: MetricFilterKey) => {
    if (activeMetricFilter === metric) {
      setActiveMetricFilter("all");
      setSelectedStatus("All Status");
      setPage(1);
      return;
    }
    setActiveMetricFilter(metric);
    if (metric === "pending") {
      setSelectedStatus("Pending");
    } else if (metric === "accepted_mtd" || metric === "revenue_mtd") {
      setSelectedStatus("Accepted");
    } else {
      setSelectedStatus("All Status");
    }
    setPage(1);
    setTimeout(() => {
      tableCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 40);
  };

  const visibleOffers = useMemo(() => {
    return offers.filter((offer) => {
      if (activeMetricFilter === "pending") {
        return offer.status === "Pending";
      }
      if (activeMetricFilter === "accepted_mtd") {
        return offer.status === "Accepted" && isSameMonthAsNow(offer.date);
      }
      if (activeMetricFilter === "with_offer") {
        return offer.offerPrice > 0 && offer.status !== "Enquiry";
      }
      if (activeMetricFilter === "revenue_mtd") {
        return (
          offer.status === "Accepted" &&
          isSameMonthAsNow(offer.date) &&
          offer.offerPrice > 0
        );
      }
      return selectedStatus === "All Status" || offer.status === selectedStatus;
    });
  }, [offers, selectedStatus, activeMetricFilter]);

  const totalPages = Math.max(1, Math.ceil(visibleOffers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedOffers = visibleOffers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const selectedOffer =
    offers.find((offer) => offer.id === selectedOfferId) ?? null;

  useEffect(() => {
    if (selectedOfferId) {
      const current = offers.find((item) => item.id === selectedOfferId);
      offerApi
        .getOfferNotes(selectedOfferId, current?.backendId)
        .then((items) => setNotes(items))
        .catch(console.error);
    }
  }, [selectedOfferId, offers]);

  const selectedFormPieces = useMemo(() => {
    const keys = [
      form.primaryPieceKey,
      ...form.extraPieceKeys,
      form.alsoPieceDraft,
    ].filter(Boolean);
    const uniqueKeys = Array.from(new Set(keys));
    return uniqueKeys
      .map((k) =>
        catalogProducts.find(
          (p: any) =>
            String(p.id || p.productId || p._id || p.name || "") === k ||
            p.name === k,
        ),
      )
      .filter(Boolean) as Product[];
  }, [
    form.primaryPieceKey,
    form.extraPieceKeys,
    form.alsoPieceDraft,
    catalogProducts,
  ]);

  const totalSelectedProductPrice = useMemo(
    () =>
      selectedFormPieces.reduce((sum, prod) => sum + getProductPrice(prod), 0),
    [selectedFormPieces],
  );

  const addOffer = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.customerName.trim() || selectedFormPieces.length === 0 || !form.phone.trim()) {
      toast.error("Please select customer name, phone, and at least one piece.");
      return;
    }
    const primary = selectedFormPieces[0];
    const offerPieces: OfferPiece[] = selectedFormPieces.map((prod: any) => ({
      productId: prod.id || prod.productId || prod._id || "",
      productName: prod.name,
      designer: prod.designer || "House of Kaira",
      image: getProductThumb(prod),
      listingPrice: getProductPrice(prod),
      rentalPrice: Number(prod.rentalPrice || 0),
    }));

    const offerPrice = Number(form.offerAmount) || 0;
    const marketPrice = totalSelectedProductPrice;

    onAddOffer({
      id: `OFR-${Date.now().toString().slice(-6)}`,
      productId: primary.id || primary.productId || (primary as any)._id,
      productName: primary.name,
      productImage: getProductThumb(primary),
      designer: primary.designer || "House of Kaira",
      pieces: offerPieces,
      customerId: form.customerId || undefined,
      customerName: form.customerName.trim(),
      customerEmail: form.email.trim(),
      phone: form.phone.trim(),
      marketPrice,
      offerPrice,
      askPercentage:
        offerPrice && marketPrice
          ? Math.round((offerPrice / marketPrice) * 100)
          : 0,
      date: new Date().toISOString().slice(0, 10),
      status: offerPrice ? "Pending" : "Enquiry",
      channel: form.source,
      note: form.note,
      assignedTo: form.assignedTo,
    });
    setShowNewOffer(false);
  };

  const handleUpdateOfferPieces = async (
    offer: Offer,
    nextPieces: OfferPiece[],
  ) => {
    if (nextPieces.length === 0) {
      toast.error("An offer must have at least one piece.");
      return;
    }
    const primary = nextPieces[0];
    const nextMarketPrice =
      nextPieces.reduce((sum, p) => sum + Number(p.listingPrice || 0), 0) ||
      offer.marketPrice;
    try {
      const updated = await offerApi.updateOffer(
        offer.id,
        {
          customerName: offer.customerName,
          customerEmail: offer.customerEmail,
          phone: offer.phone,
          productId: primary.productId,
          productName: primary.productName,
          productImage: primary.image,
          designer: primary.designer,
          pieces: nextPieces,
          marketPrice: nextMarketPrice,
          offerPrice: offer.offerPrice,
          assignedTo: offer.assignedTo,
          channel: offer.channel,
        },
        offer.backendId,
      );
      onOfferRecordUpdated?.(updated);
      toast.success("Offer pieces updated!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update offer pieces");
    }
  };

  const { hasDecision, refuseDecision } = useTeamPermissions();
  const canDecideOffer = hasDecision("accept_counter_decline_offer");
  const canDownloadLists = hasDecision("download_lists");

  const updateStatus = (offer: Offer, status: Offer["status"]) => {
    if (
      (status === "Accepted" || status === "Declined" || status === "Countered") &&
      !canDecideOffer
    ) {
      refuseDecision("accept_counter_decline_offer");
      return;
    }
    onUpdateOffer(offer.id, {
      status,
      ...(status === "Accepted" ? { createOrder: true } : {}),
    });
    setConfirmAction(null);
    if (status === "Accepted") setAcceptedNotice(true);
  };

  const handleDirectStatusSelect = (offer: Offer, nextStatus: Offer["status"]) => {
    if (nextStatus === offer.status) return;
    if (
      (nextStatus === "Accepted" || nextStatus === "Declined" || nextStatus === "Countered") &&
      !canDecideOffer
    ) {
      refuseDecision("accept_counter_decline_offer");
      return;
    }
    if (nextStatus === "Accepted" || nextStatus === "Declined") {
      setConfirmAction({ offer, status: nextStatus });
      return;
    }
    updateStatus(offer, nextStatus);
  };

  const addNote = async () => {
    if (note.trim() && selectedOffer) {
      try {
        await offerApi.addOfferNote(
          selectedOffer.id,
          note.trim(),
          selectedOffer.backendId,
        );
        setNotes((current) => [
          ...current,
          {
            message: note.trim(),
            createdBy: currentAdminName,
            createdAt: new Date().toISOString(),
          },
        ]);
        setNote("");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const exportOffers = () => {
    if (!canDownloadLists) {
      refuseDecision("download_lists");
      return;
    }
    const quote = (value: string | number) =>
      `"${String(value).replaceAll('"', '""')}"`;
    const rows = [
      [
        "Offer ID",
        "Products",
        "Listed Price",
        "Offered Price",
        "Percent of Listed",
        "Customer",
        "Email",
        "Phone",
        "Channel",
        "Status",
        "Date",
        "Note",
      ],
      ...visibleOffers.map((offer) => {
        const pcs = resolveOfferPieces(offer);
        return [
          offer.id,
          pcs.map((p) => p.productName).join(" + ") || offer.productName,
          offer.marketPrice,
          offer.offerPrice || "Enquiry only",
          offer.offerPrice ? `${offer.askPercentage}%` : "—",
          offer.customerName,
          offer.customerEmail,
          offer.phone || "",
          offer.channel || "",
          offer.status,
          offer.date,
          offer.note || "",
        ];
      }),
    ];
    const blob = new Blob(
      [`\ufeff${rows.map((row) => row.map(quote).join(",")).join("\n")}`],
      { type: "text/csv;charset=utf-8;" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `offers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const metricFilterLabel: Record<MetricFilterKey, string> = {
    all: "",
    pending: "Pending Offers",
    accepted_mtd: "Accepted (MTD)",
    with_offer: "Offers with Amount (% of Listed)",
    revenue_mtd: "Revenue from Offers (MTD)",
  };

  return (
    <section className="offers-page">
      <div className="offers-title">
        <span className="section-kicker">Operations</span>
        <h2>Offers</h2>
        <p>
          Every offer received with an amount on a preloved piece — website,
          phone, WhatsApp, DM, in person. Click any row for the full
          back-and-forth, who&apos;s handling it, and what&apos;s actually been
          said.
        </p>
      </div>

      <div className="offer-metrics">
        <Metric
          label="Pending offers"
          value={String(pendingOffersList.length)}
          accent="orange"
          active={activeMetricFilter === "pending"}
          subtitle="Click to view pending"
          onClick={() => handleMetricCardClick("pending")}
        />
        <Metric
          label="Accepted (MTD)"
          value={String(acceptedMtdList.length)}
          accent="green"
          active={activeMetricFilter === "accepted_mtd"}
          subtitle="Click to view accepted"
          onClick={() => handleMetricCardClick("accepted_mtd")}
        />
        <Metric
          label="Avg. offer %"
          value={`${averageOfferPercent}%`}
          active={activeMetricFilter === "with_offer"}
          subtitle={
            offeredWithAmountList.length
              ? `Across ${offeredWithAmountList.length} priced offer${offeredWithAmountList.length > 1 ? "s" : ""}`
              : "No priced offers yet"
          }
          onClick={() => handleMetricCardClick("with_offer")}
        />
        <Metric
          label="Revenue from offers (MTD)"
          value={money(acceptedRevenue)}
          active={activeMetricFilter === "revenue_mtd"}
          subtitle={
            revenueMtdList.length
              ? `From ${revenueMtdList.length} accepted offer${revenueMtdList.length > 1 ? "s" : ""}`
              : "Click to filter revenue"
          }
          onClick={() => handleMetricCardClick("revenue_mtd")}
        />
      </div>

      <div ref={tableCardRef} className="offer-table-card">
        <Toolbar
          status={selectedStatus}
          activeMetricLabel={
            activeMetricFilter !== "all"
              ? metricFilterLabel[activeMetricFilter]
              : ""
          }
          onClearMetric={() => {
            setActiveMetricFilter("all");
            setSelectedStatus("All Status");
            setPage(1);
          }}
          onStatus={(status) => {
            setSelectedStatus(status);
            setActiveMetricFilter(status === "Pending" ? "pending" : "all");
            setPage(1);
          }}
          onExport={exportOffers}
          onNew={() => {
            setForm({
              customerId: "",
              customerName: "",
              source: "Phone",
              email: "",
              phone: "",
              primaryPieceKey: "",
              extraPieceKeys: [],
              alsoPieceDraft: "",
              assignedTo: currentAdminName,
              offerAmount: "",
              note: "",
            });
            setShowNewOffer(true);
          }}
        />

        {showNewOffer && (
          <NewOfferForm
            form={form}
            setForm={setForm}
            selectedFormPieces={selectedFormPieces}
            totalSelectedProductPrice={totalSelectedProductPrice}
            products={catalogProducts}
            customers={customers}
            listers={listers}
            currentAdminName={currentAdminName}
            onSubmit={addOffer}
            onCancel={() => setShowNewOffer(false)}
          />
        )}

        <div className="offer-table-scroll">
          <table className="offer-table">
            <thead>
              <tr>
                <th>Offer</th>
                <th>Product</th>
                <th>Listed price</th>
                <th>Offered</th>
                <th>% of listed</th>
                <th>Customer</th>
                <th>Channel</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOffers.map((offer) => {
                const offerPieces = resolveOfferPieces(offer);
                const firstPiece = offerPieces[0] || {
                  productId: offer.productId,
                  productName: offer.productName,
                  designer: offer.designer,
                  image: offer.productImage,
                };
                const extraCount = Math.max(0, offerPieces.length - 1);
                const isSelectedRow = selectedOfferId === offer.id;

                return (
                  <tr
                    key={offer.id}
                    tabIndex={0}
                    className={isSelectedRow ? "bg-[#fcf9f2]" : ""}
                    onClick={() => {
                      setSelectedOfferId((curr) =>
                        curr === offer.id ? null : offer.id,
                      );
                      setTimeout(() => {
                        detailRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                        });
                      }, 50);
                    }}
                    onKeyDown={(event) =>
                      event.key === "Enter" &&
                      setSelectedOfferId((curr) =>
                        curr === offer.id ? null : offer.id,
                      )
                    }
                  >
                    <td className="offer-id">
                      <div>{offer.id}</div>
                      {offer.date && (
                        <div className="mt-0.5 text-[11px] font-normal text-[#968d80]">
                          {new Date(offer.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="product-cell">
                        <ProductThumbBox
                          src={firstPiece.image}
                          alt={firstPiece.productName}
                          ivory={firstPiece.productName.includes("Ivory")}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateToProduct(firstPiece);
                              }}
                              title={`Open ${firstPiece.productName} in Products`}
                              className="font-semibold text-[#2b2118] hover:text-[#b85a3a] hover:underline text-left cursor-pointer"
                            >
                              {firstPiece.productName}
                            </button>
                            {extraCount > 0 && (
                              <span
                                title={offerPieces
                                  .slice(1)
                                  .map((p) => p.productName)
                                  .join(", ")}
                                className="text-[11.5px] font-medium text-[#968d80]"
                              >
                                +{extraCount}
                              </span>
                            )}
                          </div>
                          {firstPiece.designer && (
                            <div className="text-[11px] text-[#968d80]">
                              {firstPiece.designer}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{money(offer.marketPrice)}</td>
                    <td
                      className={
                        offer.offerPrice ? "offered-price" : "enquiry-only"
                      }
                    >
                      {offer.offerPrice
                        ? money(offer.offerPrice)
                        : "Enquiry only"}
                    </td>
                    <td>{offer.offerPrice ? `${offer.askPercentage}%` : "—"}</td>
                    <td>
                      <div className="customer-cell">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToCustomer(offer);
                          }}
                          title={`Open ${offer.customerName} in Customers`}
                          className="font-semibold text-[#2b2118] hover:text-[#b85a3a] hover:underline text-left cursor-pointer"
                        >
                          {offer.customerName}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openWhatsAppChat(
                              offer.phone,
                              offer.customerName,
                              firstPiece.productName,
                            );
                          }}
                          title={
                            offer.phone
                              ? `WhatsApp ${offer.customerName} (${offer.phone})`
                              : `WhatsApp ${offer.customerName}`
                          }
                          className="inline-flex items-center justify-center rounded-full hover:scale-105 transition-transform cursor-pointer"
                        >
                          <MessageCircle aria-label="WhatsApp" />
                        </button>
                      </div>
                    </td>
                    <td>
                      <div>{offer.channel || ""}</div>
                      {offer.assignedTo && (
                        <div className="text-[11px] text-[#968d80]">
                          {offer.assignedTo}
                        </div>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusSelect
                          status={offer.status}
                          onChange={(next) =>
                            handleDirectStatusSelect(offer, next)
                          }
                        />
                        {offer.linkedOrderId && (
                          <button
                            type="button"
                            onClick={() => onSelectOrder?.(offer.linkedOrderId!)}
                            className="rounded-[3px] bg-[#e5f3e7] px-2 py-0.5 text-[10px] font-semibold text-[#2a6b3b] hover:underline cursor-pointer"
                          >
                            → {offer.linkedOrderId}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {loading && (
                <tr>
                  <td className="no-offers" colSpan={8}>
                    <span
                      className="offers-loading"
                      aria-label="Loading offers"
                    />{" "}
                    Loading offers…
                  </td>
                </tr>
              )}
              {!loading && !visibleOffers.length && (
                <tr>
                  <td className="no-offers" colSpan={8}>
                    No offers under this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {visibleOffers.length > PAGE_SIZE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={visibleOffers.length}
            onPageChange={setPage}
          />
        )}

        <p className="offer-table-help">
          Every status change and every round of negotiation is written to that
          offer&apos;s own log — click a row to see the full trail.
        </p>
      </div>

      {selectedOffer && (
        <div ref={detailRef}>
          <OfferDetail
            offer={selectedOffer}
            pieces={resolveOfferPieces(selectedOffer)}
            products={catalogProducts}
            notes={notes}
            note={note}
            setNote={setNote}
            addNote={addNote}
            close={() => setSelectedOfferId(null)}
            onNavigateProduct={navigateToProduct}
            onNavigateCustomer={() => navigateToCustomer(selectedOffer)}
            onOpenOrder={onSelectOrder}
            onUpdatePieces={(nextPieces) =>
              handleUpdateOfferPieces(selectedOffer, nextPieces)
            }
            onStatusChange={(next) =>
              handleDirectStatusSelect(selectedOffer, next)
            }
            onCounter={() => {
              setCounterOffer(selectedOffer);
              setCounterAmount(String(selectedOffer.offerPrice || 60000));
            }}
            onConfirm={(status) =>
              setConfirmAction({ offer: selectedOffer, status })
            }
          />
        </div>
      )}

      {counterOffer && (
        <CounterModal
          amount={counterAmount}
          setAmount={setCounterAmount}
          close={() => setCounterOffer(null)}
          submit={async () => {
            try {
              await offerApi.sendCounterOffer(
                counterOffer.id,
                Number(counterAmount),
                undefined,
                counterOffer.backendId,
              );
              onUpdateOffer(counterOffer.id, {
                status: "Countered",
                counterPrice: Number(counterAmount),
              });
              setCounterOffer(null);
            } catch (error) {
              console.error(error);
            }
          }}
        />
      )}

      {confirmAction && (
        <ConfirmModal
          action={confirmAction.status}
          offerPrice={confirmAction.offer.offerPrice}
          close={() => setConfirmAction(null)}
          confirm={() =>
            updateStatus(confirmAction.offer, confirmAction.status)
          }
        />
      )}

      {acceptedNotice && (
        <AcceptedNotice close={() => setAcceptedNotice(false)} />
      )}
    </section>
  );
}

function Toolbar({
  status,
  activeMetricLabel,
  onClearMetric,
  onStatus,
  onNew,
  onExport,
}: {
  status: string;
  activeMetricLabel?: string;
  onClearMetric?: () => void;
  onStatus: (value: string) => void;
  onNew: () => void;
  onExport: () => void;
}) {
  return (
    <div className="offer-table-toolbar">
      <div className="flex flex-wrap items-center gap-2.5">
        <h3>All Offers</h3>
        {activeMetricLabel && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dcc38b] bg-[#fbf5e6] px-2.5 py-0.5 text-[11px] font-semibold text-[#6e521e]">
            Filtered: {activeMetricLabel}
            <button
              type="button"
              onClick={onClearMetric}
              className="hover:text-[#2b2118] cursor-pointer"
              title="Reset filter"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
      </div>
      <div className="offer-actions">
        <label className="status-select">
          <select
            value={status}
            onChange={(event) => onStatus(event.target.value)}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Countered</option>
            <option>Accepted</option>
            <option>Declined</option>
            <option>Expired</option>
            <option>On Hold</option>
            <option>Enquiry</option>
          </select>
          <ChevronDown />
        </label>
        <button className="new-offer-button" onClick={onNew}>
          <Plus /> Log New Offer
        </button>
        <button className="export-button" onClick={onExport}>
          <Download /> Export
        </button>
      </div>
    </div>
  );
}

function StatusSelect({
  status,
  onChange,
}: {
  status: Offer["status"];
  onChange: (status: Offer["status"]) => void;
}) {
  return (
    <label className={`offer-status ${tone[status]} relative cursor-pointer`}>
      <select
        value={status}
        onChange={(e) => onChange(e.target.value as Offer["status"])}
        className="appearance-none bg-transparent pr-4 font-semibold outline-none cursor-pointer"
      >
        {ALL_STATUSES.map((st) => (
          <option key={st} value={st} className="bg-white text-[#2b2118]">
            {st === "Declined" ? "Rejected" : st}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-1.5" />
    </label>
  );
}

function Metric({
  label,
  value,
  accent,
  active = false,
  subtitle,
  onClick,
}: {
  label: string;
  value: string;
  accent?: string;
  active?: boolean;
  subtitle?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`offer-metric w-full text-left transition-all cursor-pointer hover:border-[#c7a35e] hover:shadow-md ${
        active
          ? "!border-[#c7a35e] !bg-[#fdf9ef] ring-2 ring-[#c7a35e]/40"
          : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p>{label}</p>
        {active && (
          <span className="rounded bg-[#c7a35e]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#7a5b21]">
            Active
          </span>
        )}
      </div>
      <strong className={accent || ""}>{value}</strong>
      {subtitle && (
        <span className="mt-1 block text-[11px] text-[#9b9288]">
          {subtitle}
        </span>
      )}
    </button>
  );
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, totalItems);
  return (
    <div className="offer-pagination">
      <span>
        Showing {start}–{end} of {totalItems} offers
      </span>
      <div>
        <button
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft />
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (item) => (
            <button
              key={item}
              className={item === currentPage ? "active" : ""}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}
        <button
          aria-label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="offline-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </div>
  );
}

function NewOfferForm({
  form,
  setForm,
  selectedFormPieces,
  totalSelectedProductPrice,
  products,
  customers,
  listers,
  currentAdminName,
  onSubmit,
  onCancel,
}: {
  form: {
    customerId: string;
    customerName: string;
    source: string;
    email: string;
    phone: string;
    primaryPieceKey: string;
    extraPieceKeys: string[];
    alsoPieceDraft: string;
    assignedTo: string;
    offerAmount: string;
    note: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      customerId: string;
      customerName: string;
      source: string;
      email: string;
      phone: string;
      primaryPieceKey: string;
      extraPieceKeys: string[];
      alsoPieceDraft: string;
      assignedTo: string;
      offerAmount: string;
      note: string;
    }>
  >;
  selectedFormPieces: Product[];
  totalSelectedProductPrice: number;
  products: Product[];
  customers: Customer[];
  listers: any[];
  currentAdminName: string;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
}) {
  const { getTeamNamesFor } = useTeamPermissions();
  const assignees = useMemo(() => {
    const opts = getTeamNamesFor(
      { kind: "section", sectionId: "offers" },
      form.assignedTo || undefined,
    );
    return opts.length > 0 ? opts : [{ value: "Soumya", label: "Soumya" }];
  }, [getTeamNamesFor, form.assignedTo]);

  const handleCustomerPick = (custId: string) => {
    if (!custId) {
      setForm((curr) => ({ ...curr, customerId: "" }));
      return;
    }
    const found = customers.find(
      (c) =>
        (c.customerId || c.id || (c as any)._id) === custId,
    );
    if (found) {
      setForm((curr) => ({
        ...curr,
        customerId: found.customerId || found.id,
        customerName: found.name || curr.customerName,
        email: found.email || curr.email,
        phone: found.phone || curr.phone,
      }));
    }
  };

  const extraProducts = useMemo(
    () =>
      form.extraPieceKeys
        .map((k) =>
          products.find(
            (p: any) =>
              String(p.id || p.productId || p._id || p.name || "") === k,
          ),
        )
        .filter(Boolean) as Product[],
    [form.extraPieceKeys, products],
  );

  return (
    <form className="offline-offer-form" onSubmit={onSubmit}>
      <div className="offline-form-heading">
        <h4>Log an Offer or Enquiry Received Offline</h4>
        <p>
          For anything that didn&apos;t come through the website — a phone call,
          WhatsApp, a DM, someone at a trunk show. It joins the same list below.
        </p>
      </div>
      <div className="offline-form-grid">
        <Field
          label="Customer on file"
          hint="Pick her if she already has an account, or leave as new customer."
        >
          <select
            value={form.customerId}
            onChange={(e) => handleCustomerPick(e.target.value)}
          >
            <option value="">Someone new, not on file yet</option>
            {customers.map((c) => {
              const cid = c.customerId || c.id || (c as any)._id;
              return (
                <option key={cid} value={cid}>
                  {c.name}
                  {c.phone ? ` · ${c.phone}` : ""}
                </option>
              );
            })}
          </select>
        </Field>
        <Field label="Source">
          <select
            value={form.source}
            onChange={(e) =>
              setForm((c) => ({ ...c, source: e.target.value }))
            }
          >
            <option>Phone</option>
            <option>WhatsApp</option>
            <option>Instagram DM</option>
            <option>In person</option>
            <option>Website</option>
          </select>
        </Field>
        <Field label="Customer name *">
          <input
            required
            value={form.customerName}
            onChange={(e) =>
              setForm((c) => ({ ...c, customerName: e.target.value }))
            }
            placeholder="e.g. Kavita Singh"
          />
        </Field>
        <Field label="Phone / WhatsApp *">
          <input
            required
            value={form.phone}
            onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))}
            placeholder="e.g. 9876543210"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
            placeholder="Optional"
          />
        </Field>
        <Field label="Assigned to">
          <select
            value={form.assignedTo}
            onChange={(e) =>
              setForm((c) => ({ ...c, assignedTo: e.target.value }))
            }
          >
            <option value="Unassigned">Unassigned</option>
            {assignees.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Product *">
          <SearchableOfferPieceSelect
            products={products}
            value={form.primaryPieceKey}
            excludeKeys={form.extraPieceKeys}
            placeholder="Select primary piece..."
            onChange={(key) =>
              setForm((c) => ({ ...c, primaryPieceKey: key }))
            }
          />
        </Field>
        <Field
          label="Also offered on (Optional — adds +1, +2...)"
          hint="Pick additional pieces if the customer made a combined/multi-piece offer."
        >
          <SearchableOfferPieceSelect
            products={products}
            value=""
            excludeKeys={[form.primaryPieceKey, ...form.extraPieceKeys].filter(
              Boolean,
            )}
            placeholder="Add another piece (optional)..."
            onChange={(key) => {
              if (!key) return;
              setForm((c) => ({
                ...c,
                extraPieceKeys: c.extraPieceKeys.includes(key)
                  ? c.extraPieceKeys
                  : [...c.extraPieceKeys, key],
              }));
            }}
          />
          {extraProducts.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {extraProducts.map((ep: any) => {
                const k = String(
                  ep.id || ep.productId || ep._id || ep.name || "",
                );
                return (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1.5 rounded border border-[#ded5c7] bg-white px-2.5 py-1 text-[12px] font-medium text-[#2b2118]"
                  >
                    {ep.name} ({money(getProductPrice(ep))})
                    <button
                      type="button"
                      onClick={() =>
                        setForm((c) => ({
                          ...c,
                          extraPieceKeys: c.extraPieceKeys.filter(
                            (item) => item !== k,
                          ),
                        }))
                      }
                      className="text-[#968d80] hover:text-[#b4442e] cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </Field>
        <Field
          label={`Listed / asking price (₹)${selectedFormPieces.length > 1 ? ` — ${selectedFormPieces.length} pieces combined` : ""}`}
          hint="Set on the product's Pricing & Tax tab — auto-summed across selected pieces."
        >
          <input
            readOnly
            value={
              selectedFormPieces.length > 0
                ? money(totalSelectedProductPrice)
                : ""
            }
            placeholder="Auto-fills once a piece is selected"
          />
        </Field>
        <Field label="Offer amount (₹) — leave blank if it's just an enquiry, no number offered yet">
          <input
            type="number"
            value={form.offerAmount}
            onChange={(e) =>
              setForm((c) => ({ ...c, offerAmount: e.target.value }))
            }
            placeholder="e.g. 29000"
          />
        </Field>
      </div>
      <Field label="Note">
        <textarea
          value={form.note}
          onChange={(e) => setForm((c) => ({ ...c, note: e.target.value }))}
          placeholder="e.g. Called asking about the piece, offered this amount if we can ship by Friday."
        />
      </Field>
      <div className="offline-form-actions">
        <button type="submit">Add to List</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function OfferDetail({
  offer,
  pieces,
  products,
  notes,
  note,
  setNote,
  addNote,
  close,
  onNavigateProduct,
  onNavigateCustomer,
  onOpenOrder,
  onUpdatePieces,
  onStatusChange,
  onCounter,
  onConfirm,
}: {
  offer: Offer;
  pieces: OfferPiece[];
  products: Product[];
  notes: any[];
  note: string;
  setNote: (value: string) => void;
  addNote: () => void;
  close: () => void;
  onNavigateProduct: (piece: {
    productId?: string;
    productName?: string;
  }) => void;
  onNavigateCustomer: () => void;
  onOpenOrder?: (orderId: string) => void;
  onUpdatePieces: (pieces: OfferPiece[]) => void;
  onStatusChange: (status: Offer["status"]) => void;
  onCounter: () => void;
  onConfirm: (status: Offer["status"]) => void;
}) {
  const [pieceToAddKey, setPieceToAddKey] = useState("");
  const primaryPiece = pieces[0] || {
    productId: offer.productId,
    productName: offer.productName,
    designer: offer.designer,
    image: offer.productImage,
    listingPrice: offer.marketPrice,
  };

  const handleAddPiece = () => {
    if (!pieceToAddKey) return;
    const found: any = products.find(
      (p: any) =>
        String(p.id || p.productId || p._id || p.name || "") === pieceToAddKey,
    );
    if (!found) return;
    const newPiece: OfferPiece = {
      productId: found.id || found.productId || found._id || "",
      productName: found.name,
      designer: found.designer || "House of Kaira",
      image: getProductThumb(found),
      listingPrice: getProductPrice(found),
      rentalPrice: Number(found.rentalPrice || 0),
    };
    onUpdatePieces([...pieces, newPiece]);
    setPieceToAddKey("");
  };

  return (
    <div className="offer-detail">
      <button className="detail-close" onClick={close} title="Hide panel">
        <X />
      </button>
      <div className="detail-head">
        <h3>
          {offer.id} — {primaryPiece.productName}
          {pieces.length > 1 && (
            <span className="ml-1.5 text-[13px] font-normal text-[#8f8679]">
              +{pieces.length - 1} more
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          <StatusSelect status={offer.status} onChange={onStatusChange} />
          {offer.linkedOrderId && (
            <button
              type="button"
              onClick={() => onOpenOrder?.(offer.linkedOrderId!)}
              className="rounded-[3px] bg-[#e5f3e7] px-2.5 py-1 text-[11px] font-semibold text-[#2a6b3b] hover:underline cursor-pointer"
            >
              → {offer.linkedOrderId}
            </button>
          )}
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-item">
          <span>{pieces.length > 1 ? `Products (${pieces.length})` : "Product"}</span>
          <strong className="featured">
            <button
              type="button"
              onClick={() => onNavigateProduct(primaryPiece)}
              title={`Open ${primaryPiece.productName} in Products`}
              className="text-left font-semibold text-[#bd6040] hover:underline cursor-pointer"
            >
              {primaryPiece.productName}
            </button>
            {pieces.length > 1 && (
              <span className="ml-1 text-[11.5px] font-normal text-[#8f8679]">
                +{pieces.length - 1}
              </span>
            )}
          </strong>
        </div>

        <div className="detail-item">
          <span>Customer</span>
          <strong>
            <button
              type="button"
              onClick={onNavigateCustomer}
              title={`Open ${offer.customerName} in Customers`}
              className="text-left font-semibold text-[#b85a3a] hover:underline cursor-pointer"
            >
              {offer.customerName}
            </button>
            <button
              type="button"
              onClick={() =>
                openWhatsAppChat(
                  offer.phone,
                  offer.customerName,
                  primaryPiece.productName,
                )
              }
              title={
                offer.phone
                  ? `WhatsApp ${offer.customerName} (${offer.phone})`
                  : `WhatsApp ${offer.customerName}`
              }
              className="inline-flex items-center justify-center rounded-full hover:scale-105 transition-transform cursor-pointer"
            >
              <MessageCircle />
            </button>
          </strong>
          {(offer.phone || offer.customerEmail) && (
            <div className="mt-0.5 text-[11.5px] text-[#8a8073]">
              {[offer.phone, offer.customerEmail].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>

        <div className="detail-item">
          <span>Submitted</span>
          <strong>
            {new Date(offer.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            {offer.channel ? ` via ${offer.channel}` : ""}
          </strong>
        </div>

        <div className="detail-item">
          <span>Listed price</span>
          <strong>{money(offer.marketPrice)}</strong>
        </div>

        <div className="detail-item">
          <span>Offered price</span>
          <strong>
            {offer.offerPrice
              ? `${money(offer.offerPrice)} (${offer.askPercentage}%)`
              : "Enquiry only"}
          </strong>
        </div>

        {offer.counterPrice ? (
          <div className="detail-item">
            <span>Counter-offer sent</span>
            <strong>{money(offer.counterPrice)}</strong>
          </div>
        ) : null}
      </div>

      {/* Pieces in This Offer (matching Enquiries 'Pieces Asked About' layout) */}
      <div className="mt-5 space-y-2.5">
        <h4 className="text-[12px] font-semibold text-[#403b36]">
          Pieces in Offer
        </h4>
        <div className="space-y-2">
          {pieces.map((piece, idx) => (
            <div
              key={`${piece.productId || piece.productName}-${idx}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[#e8e1d5] bg-[#fcfaf6] px-3.5 py-2.5"
            >
              <div className="flex items-center gap-3">
                <ProductThumbBox
                  src={piece.image}
                  alt={piece.productName}
                  size="small"
                />
                <div>
                  <button
                    type="button"
                    onClick={() => onNavigateProduct(piece)}
                    title={`Open ${piece.productName} in Products`}
                    className="block text-left text-[13px] font-semibold text-[#b85a3a] hover:underline cursor-pointer"
                  >
                    {piece.productName}
                  </button>
                  <div className="text-[11.5px] text-[#8a8073]">
                    {[
                      piece.designer || "House of Kaira",
                      piece.listingPrice ? `Listed ${money(piece.listingPrice)}` : "",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                </div>
              </div>
              {pieces.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    onUpdatePieces(pieces.filter((_, pIdx) => pIdx !== idx))
                  }
                  title="Remove piece from offer"
                  className="rounded border border-[#e2dad0] bg-white p-1 text-[#8f8679] hover:border-[#d89c8a] hover:text-[#b4442e] cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-0.5">
          <div className="min-w-0 flex-1">
            <SearchableOfferPieceSelect
              products={products}
              value={pieceToAddKey}
              excludeKeys={pieces
                .map((p) => String(p.productId || p.productName || ""))
                .filter(Boolean)}
              placeholder="Add another piece to this offer (+1)..."
              allowClear
              onChange={setPieceToAddKey}
            />
          </div>
          <button
            type="button"
            disabled={!pieceToAddKey}
            onClick={handleAddPiece}
            className="h-[41px] rounded-[4px] border border-[#ddd5cc] bg-white px-3.5 text-[12px] font-semibold text-[#3f3a35] hover:bg-[#faf7f2] disabled:opacity-40 cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>

      <div className="negotiation-log">
        <h4>Negotiation Log</h4>
        {notes.length === 0 && (
          <p className="text-stone-500 text-sm italic">No notes yet.</p>
        )}
        {notes.map((item, index) => (
          <React.Fragment key={index}>
            <Log
              text={item.message || item}
              by={item.createdBy || "Admin"}
              date={item.createdAt}
            />
          </React.Fragment>
        ))}
      </div>

      <div className="note-row">
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && addNote()}
          placeholder="Add a note to the negotiation log..."
        />
        <button onClick={addNote}>Add</button>
      </div>

      <div className="detail-actions">
        {offer.linkedOrderId ? (
          <button
            className="accept"
            onClick={() => onOpenOrder?.(offer.linkedOrderId!)}
          >
            <Check /> View Order ({offer.linkedOrderId})
          </button>
        ) : (
          <button className="accept" onClick={() => onConfirm("Accepted")}>
            <Check /> Accept &amp; Convert to Order
          </button>
        )}
        <button onClick={onCounter}>
          <RefreshCw /> Counter-Offer
        </button>
        <button onClick={() => onConfirm("On Hold")}>
          <span>Ⅱ</span> Put on Hold
        </button>
        <button className="danger" onClick={() => onConfirm("Declined")}>
          <X /> Reject
        </button>
        <button onClick={() => onConfirm("Expired")}>
          <Clock3 /> Mark Expired
        </button>
      </div>
    </div>
  );
}

function Log({ text, by, date }: { text: string; by: string; date?: string }) {
  return (
    <div className="log-line">
      <span className="log-dot" />
      <div>
        <small>
          {date
            ? new Date(date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
          · {by}
        </small>
        <p>{text}</p>
      </div>
    </div>
  );
}

function CounterModal({
  amount,
  setAmount,
  close,
  submit,
}: {
  amount: string;
  setAmount: (value: string) => void;
  close: () => void;
  submit: () => void;
}) {
  return (
    <Modal>
      <div className="modal-header">
        <h3>Send Counter-Offer</h3>
        <button onClick={close}>
          <X />
        </button>
      </div>
      <div className="counter-body">
        <label>
          Counter-offer amount
          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        <p>
          <MessageCircle /> A WhatsApp message pre-filled with this amount will
          be generated for you to send.
        </p>
      </div>
      <div className="modal-actions">
        <button onClick={close}>Cancel</button>
        <button className="dark" onClick={submit}>
          Send Counter-Offer
        </button>
      </div>
    </Modal>
  );
}

function ConfirmModal({
  action,
  offerPrice,
  close,
  confirm,
}: {
  action: Offer["status"];
  offerPrice: number;
  close: () => void;
  confirm: () => void;
}) {
  const name = action === "Declined" ? "Rejected" : action;
  const message =
    action === "Accepted"
      ? `Accept this offer of ${money(offerPrice)} and create a confirmed order?`
      : `Mark this offer as "${name}"?`;
  return (
    <Modal small>
      <div className="modal-header">
        <h3>Please Confirm</h3>
        <button onClick={close}>
          <X />
        </button>
      </div>
      <p className="confirm-copy">{message}</p>
      <div className="modal-actions">
        <button onClick={close}>Cancel</button>
        <button className="confirm" onClick={confirm}>
          Confirm
        </button>
      </div>
    </Modal>
  );
}

function AcceptedNotice({ close }: { close: () => void }) {
  return (
    <Modal small>
      <div className="accepted-notice">
        <p>
          Marked as Accepted. Remember to confirm with the customer yourself and
          help them complete checkout — this only updates the record here.
        </p>
        <button onClick={close}>OK</button>
      </div>
    </Modal>
  );
}

function Modal({
  children,
  small = false,
}: {
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <div className="modal-backdrop">
      <div className={`offer-modal ${small ? "small" : ""}`}>{children}</div>
    </div>
  );
}
