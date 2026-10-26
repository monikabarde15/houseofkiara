import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Download,
  MessageCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Tag,
  UserCheck,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Offer, Product, Customer } from "../types";
import * as offerApi from "../services/offerApi";

interface OffersViewProps {
  offers: Offer[];
  products: Product[];
  customers?: Customer[];
  listers: any[];
  currentAdminName?: string;
  loading?: boolean;
  onUpdateOffer: (id: string, updatedFields: Partial<Offer>) => void;
  onAddOffer: (offer: Offer) => void;
  onCustomerCreated?: (customer: Customer) => void;
}

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const tone: Record<Offer["status"], string> = {
  Pending: "pending",
  Accepted: "accepted",
  Declined: "declined",
  Countered: "countered",
  Expired: "expired",
  "On Hold": "hold",
  Enquiry: "enquiry",
};
const PAGE_SIZE = 10;

export default function OffersView({
  offers,
  products,
  customers = [],
  listers,
  currentAdminName = "Soumya",
  loading = false,
  onUpdateOffer,
  onAddOffer,
  onCustomerCreated,
}: OffersViewProps) {
  const [selectedStatus, setSelectedStatus] = useState("All Status");
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
  const [notes, setNotes] = useState<string[]>([]);
  const [form, setForm] = useState({
    customerId: "",
    customerName: "",
    source: "Phone",
    email: "",
    phone: "",
    productName: "",
    assignedTo: currentAdminName,
    offerAmount: "",
    promoCode: "",
    note: "",
  });

  const visibleOffers = useMemo(
    () =>
      offers.filter(
        (offer) =>
          selectedStatus === "All Status" || offer.status === selectedStatus,
      ),
    [offers, selectedStatus],
  );
  const totalPages = Math.max(1, Math.ceil(visibleOffers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedOffers = visibleOffers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const pendingOffers = offers.filter(
    (offer) => offer.status === "Pending",
  ).length;
  const acceptedOffers = offers.filter((offer) => offer.status === "Accepted");
  const offeredAmounts = offers.filter((offer) => offer.offerPrice > 0);
  const averageOfferPercent = offeredAmounts.length
    ? Math.round(
        offeredAmounts.reduce(
          (total, offer) => total + offer.askPercentage,
          0,
        ) / offeredAmounts.length,
      )
    : 0;
  const acceptedRevenue = acceptedOffers.reduce(
    (total, offer) => total + offer.offerPrice,
    0,
  );
  const selectedOffer =
    offers.find((offer) => offer.id === selectedOfferId) ?? null;
  useEffect(() => {
    if (selectedOfferId) {
      const current = offers.find((item) => item.id === selectedOfferId);
      offerApi
        .getOfferNotes(selectedOfferId, current?.backendId)
        .then((items) =>
          setNotes(items.map((item: any) => item.message || item)),
        )
        .catch(console.error);
    }
  }, [selectedOfferId, offers]);
  const selectedProduct = products.find(
    (product) => product.name === form.productName,
  );
  const selectedProductPrice = selectedProduct
    ? selectedProduct.listingPrice ||
      selectedProduct.rentalPrice ||
      selectedProduct.originalRetailPrice ||
      0
    : 0;
  const updateForm = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const addOffer = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.customerName || !form.productName || !form.phone) return;
    const offerPrice = Number(form.offerAmount) || 0;
    const marketPrice = selectedProductPrice;
    const discount =
      marketPrice > offerPrice && offerPrice > 0
        ? marketPrice - offerPrice
        : 0;

    let promoCode = form.promoCode ? form.promoCode.trim().toUpperCase() : "";
    if (!promoCode && discount > 0) {
      const cleanName = (form.customerName || "OFFER")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 5)
        .toUpperCase();
      promoCode = `OFFER-${cleanName}-${Math.floor(100 + Math.random() * 900)}`;
    }

    onAddOffer({
      id: `OFR-${Date.now().toString().slice(-6)}`,
      customerId: form.customerId || undefined,
      customerName: form.customerName,
      customerEmail: form.email,
      phone: form.phone,
      productId: selectedProduct?.id || selectedProduct?.productId,
      productName: form.productName,
      marketPrice,
      offerPrice,
      askPercentage: offerPrice
        ? Math.round((offerPrice / marketPrice) * 100)
        : 0,
      date: new Date().toISOString().slice(0, 10),
      status: offerPrice ? "Pending" : "Enquiry",
      channel: form.source,
      note: form.note,
      assignedTo: form.assignedTo,
      promoCode: promoCode || undefined,
    });
    setShowNewOffer(false);
  };
  const updateStatus = (offer: Offer, status: Offer["status"]) => {
    onUpdateOffer(offer.id, { status });
    setConfirmAction(null);
    if (status === "Accepted") setAcceptedNotice(true);
  };
  const addNote = async () => {
    if (note.trim() && selectedOffer) {
      try {
        await offerApi.addOfferNote(
          selectedOffer.id,
          note.trim(),
          selectedOffer.backendId,
        );
        setNotes((current) => [...current, note.trim()]);
        setNote("");
      } catch (error) {
        console.error(error);
      }
    }
  };
  const exportOffers = () => {
    const quote = (value: string | number) =>
      `"${String(value).replaceAll('"', '""')}"`;
    const rows = [
      [
        "Offer ID",
        "Product",
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
      ...visibleOffers.map((offer) => [
        offer.id,
        offer.productName,
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
      ]),
    ];
    const blob = new Blob(
      [`\ufeff${rows.map((row) => row.map(quote).join(",")).join("\n")}`],
      { type: "text/csv;charset=utf-8;" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = offerApi.exportOffersUrl;
    link.download = `offers-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="offers-page">
      <div className="offers-title">
        <span className="section-kicker">Operations</span>
        <h2>Offers &amp; Enquiries</h2>
        <p>
          Every offer or enquiry received, however it arrived — website, phone,
          WhatsApp, DM, in person. Click any row for the full back-and-forth,
          who's handling it, and what's actually been said.
        </p>
      </div>
      <div className="offer-metrics">
        <Metric
          label="Pending offers"
          value={String(pendingOffers)}
          accent="orange"
        />
        <Metric
          label="Accepted (MTD)"
          value={String(acceptedOffers.length)}
          accent="green"
        />
        <Metric label="Avg. offer %" value={`${averageOfferPercent}%`} />
        <Metric
          label="Revenue from offers (MTD)"
          value={money(acceptedRevenue)}
        />
      </div>

      <div className="offer-table-card">
        <Toolbar
          status={selectedStatus}
          onStatus={(status) => {
            setSelectedStatus(status);
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
              productName: "",
              assignedTo: currentAdminName,
              offerAmount: "",
              promoCode: "",
              note: "",
            });
            setShowNewOffer(true);
          }}
        />
        {showNewOffer && (
          <NewOfferForm
            form={form}
            selectedProduct={selectedProduct}
            selectedProductPrice={selectedProductPrice}
            products={products}
            customers={customers}
            listers={listers}
            currentAdminName={currentAdminName}
            updateForm={updateForm}
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
              {paginatedOffers.map((offer) => (
                <tr
                  key={offer.id}
                  tabIndex={0}
                  onClick={() => setSelectedOfferId(offer.id)}
                  onKeyDown={(event) =>
                    event.key === "Enter" && setSelectedOfferId(offer.id)
                  }
                >
                  <td className="offer-id">{offer.id}</td>
                  <td>
                    <div className="product-cell">
                      <div
                        className={`product-thumb ${offer.productName.includes("Ivory") ? "ivory" : ""}`}
                      >
                        ♢
                      </div>
                      <strong>{offer.productName}</strong>
                    </div>
                  </td>
                  <td>{money(offer.marketPrice)}</td>
                  <td
                    className={
                      offer.offerPrice ? "offered-price" : "enquiry-only"
                    }
                  >
                    <div>
                      {offer.offerPrice
                        ? money(offer.offerPrice)
                        : "Enquiry only"}
                    </div>
                    {offer.promoCode && (
                      <button
                        type="button"
                        className="mt-1 inline-flex items-center gap-1 rounded bg-[#f5eddf] px-1.5 py-0.5 text-[10px] font-bold text-[#7a591e] border border-[#e4d4ba] hover:bg-[#ede0ca] transition-colors"
                        title="Click to copy promo code"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(offer.promoCode!);
                          toast.success(`Promo code copied: ${offer.promoCode}`);
                        }}
                      >
                        <Tag className="h-2.5 w-2.5 text-[#9a752e]" />
                        <span>{offer.promoCode}</span>
                        <Copy className="h-2.5 w-2.5 opacity-60" />
                      </button>
                    )}
                  </td>
                  <td>{offer.offerPrice ? `${offer.askPercentage}%` : "—"}</td>
                  <td>
                    <div className="customer-cell">
                      <div>
                        <strong>{offer.customerName}</strong>
                        {offer.customerId && (
                          <span className="block text-[10px] text-stone-500 font-mono font-medium">
                            {offer.customerId}
                          </span>
                        )}
                      </div>
                      <MessageCircle aria-label="WhatsApp" />
                    </div>
                  </td>
                  <td>{offer.channel || ""}</td>
                  <td>
                    <Status status={offer.status} />
                  </td>
                </tr>
              ))}
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
                    No offers under this status.
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
          offer's own log — click a row to see the full trail.
        </p>
      </div>

      {selectedOffer && (
        <OfferDetail
          offer={selectedOffer}
          notes={notes}
          note={note}
          setNote={setNote}
          addNote={addNote}
          close={() => setSelectedOfferId(null)}
          onCounter={() => {
            setCounterOffer(selectedOffer);
            setCounterAmount(String(selectedOffer.offerPrice || 60000));
          }}
          onConfirm={(status) =>
            setConfirmAction({ offer: selectedOffer, status })
          }
        />
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
  onStatus,
  onNew,
  onExport,
}: {
  status: string;
  onStatus: (value: string) => void;
  onNew: () => void;
  onExport: () => void;
}) {
  return (
    <div className="offer-table-toolbar">
      <h3>All Offers &amp; Enquiries</h3>
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
function Status({ status }: { status: Offer["status"] }) {
  return (
    <span className={`offer-status ${tone[status]}`}>
      {status === "Declined" ? "Rejected" : status}
      <ChevronDown />
    </span>
  );
}
function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="offer-metric">
      <p>{label}</p>
      <strong className={accent || ""}>{value}</strong>
    </div>
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
    <label className="offline-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function NewOfferForm({
  form,
  selectedProduct,
  selectedProductPrice,
  products,
  customers = [],
  listers,
  currentAdminName,
  updateForm,
  onSubmit,
  onCancel,
}: {
  form: {
    customerId?: string;
    customerName: string;
    source: string;
    email: string;
    phone: string;
    productName: string;
    assignedTo: string;
    offerAmount: string;
    promoCode?: string;
    note: string;
  };
  selectedProduct?: Product;
  selectedProductPrice: number;
  products: Product[];
  customers?: Customer[];
  listers: any[];
  currentAdminName: string;
  updateForm: (key: string, value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(() => {
    if (form.customerId && customers) {
      return (
        customers.find(
          (c) => c.customerId === form.customerId || c.id === form.customerId,
        ) || null
      );
    }
    return null;
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const query = (form.customerName || "").trim().toLowerCase();
  const suggestions = useMemo(() => {
    if (!query || query.length < 1 || !customers || customers.length === 0)
      return [];
    return customers
      .filter((c) => {
        const name = (c.name || "").toLowerCase();
        const email = (c.email || "").toLowerCase();
        const phone = c.phone || "";
        const cid = (c.customerId || c.id || "").toLowerCase();
        return (
          name.includes(query) ||
          email.includes(query) ||
          phone.includes(query) ||
          cid.includes(query)
        );
      })
      .slice(0, 6);
  }, [query, customers]);

  const handleSelectCustomer = (cust: Customer) => {
    updateForm("customerName", cust.name);
    updateForm("email", cust.email || "");
    updateForm("phone", cust.phone || "");
    updateForm("customerId", cust.customerId || cust.id || "");
    setSelectedCustomer(cust);
    setShowSuggestions(false);
  };

  const offerAmt = Number(form.offerAmount) || 0;
  const discountAmt =
    selectedProductPrice > offerAmt && offerAmt > 0
      ? selectedProductPrice - offerAmt
      : 0;

  return (
    <form className="offline-offer-form" onSubmit={onSubmit}>
      <div className="offline-form-heading">
        <h4>Log an Offer or Enquiry Received Offline</h4>
        <p>
          For anything that didn't come through the website — a phone call,
          WhatsApp, a DM, someone at a trunk show. It joins the same list below.
        </p>
      </div>
      <div className="offline-form-grid">
        <div className="offline-field relative" ref={dropdownRef}>
          <span>Customer name</span>
          <input
            required
            autoComplete="off"
            value={form.customerName}
            onChange={(e) => {
              updateForm("customerName", e.target.value);
              if (selectedCustomer && selectedCustomer.name !== e.target.value) {
                setSelectedCustomer(null);
                updateForm("customerId", "");
              }
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Type name (e.g. Kavita Singh)"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-[#c8aa68] bg-white shadow-xl">
              <div className="p-2 text-[10px] font-bold uppercase tracking-wider text-[#918980] bg-[#faf8f5] border-b border-[#eee8df]">
                Registered Website Customers ({suggestions.length})
              </div>
              {suggestions.map((c) => (
                <div
                  key={c.id || c.customerId || c.email}
                  className="cursor-pointer border-b border-stone-100 p-2.5 transition-colors hover:bg-[#f6f2e9]"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectCustomer(c);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-[13px] text-[#312e2a] font-semibold">
                      {c.name}
                    </strong>
                    <span className="rounded bg-[#e8deca] px-1.5 py-0.5 text-[10px] font-bold text-[#624e24]">
                      {c.customerId || c.id || "Customer"}
                    </span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 text-[11px] text-[#78716c]">
                    {c.email && <span>✉️ {c.email}</span>}
                    {c.phone && <span>📞 {c.phone}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {selectedCustomer ? (
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                Registered Customer linked: <strong>{selectedCustomer.name}</strong> (
                {selectedCustomer.customerId || selectedCustomer.id})
              </span>
            </div>
          ) : form.customerName.trim().length > 1 ? (
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#8c7438] bg-[#fbf8f0] px-2.5 py-1 rounded border border-[#eedeb5]">
              <Sparkles className="h-3.5 w-3.5 text-[#b99855]" />
              <span>
                New customer will be automatically registered in customer records.
              </span>
            </div>
          ) : null}
        </div>
        <Field label="Source">
          <select
            value={form.source}
            onChange={(e) => updateForm("source", e.target.value)}
          >
            <option>Phone</option>
            <option>WhatsApp</option>
            <option>Instagram DM</option>
            <option>In person</option>
          </select>
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateForm("email", e.target.value)}
            placeholder="Auto-fills from customer or enter email"
          />
        </Field>
        <Field label="Phone">
          <input
            required
            value={form.phone}
            onChange={(e) => updateForm("phone", e.target.value)}
            placeholder="Auto-fills from customer or enter phone"
          />
        </Field>
        <Field label="Product">
          <select
            required
            value={form.productName}
            onChange={(e) => updateForm("productName", e.target.value)}
          >
            <option value="">Select a piece...</option>
            {products.map((product) => (
              <option key={product.id || product.productId || product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Assigned to">
          <select
            value={form.assignedTo}
            onChange={(e) => updateForm("assignedTo", e.target.value)}
          >
            <option value="Unassigned">Unassigned</option>
            {listers.map((lister) => (
              <option key={lister.id || lister.name} value={lister.name}>
                {lister.name}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Listed / asking price (₹)"
          hint="Set on the product's Pricing & Tax tab — change it there, not here."
        >
          <input
            readOnly
            value={selectedProduct ? money(selectedProductPrice) : ""}
            placeholder="Auto-fills once a piece is selected"
          />
        </Field>
        <Field label="Offer amount (₹) — leave blank if enquiry only">
          <input
            type="number"
            value={form.offerAmount}
            onChange={(e) => updateForm("offerAmount", e.target.value)}
            placeholder="e.g. 29000"
          />
        </Field>
      </div>

      {discountAmt > 0 && (
        <div className="mt-3 p-3.5 rounded-lg border border-[#d9c491] bg-gradient-to-r from-[#fcf9f2] to-[#f4eedf]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#a37f34]" />
              <strong className="text-[13px] font-bold text-[#3d321d]">
                Web Discount &amp; Promo Code Generated
              </strong>
            </div>
            <span className="text-[12px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Save ₹{discountAmt.toLocaleString("en-IN")} ({Math.round((discountAmt / selectedProductPrice) * 100)}% OFF)
            </span>
          </div>
          <p className="mt-1 text-[12px] text-[#6d6457]">
            An active promo code will be created so this customer can purchase <strong>{form.productName}</strong> at the offered price of <strong>{money(offerAmt)}</strong> on the website.
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#8a7657] uppercase tracking-wider">
              Promo Code:
            </span>
            <input
              type="text"
              className="max-w-[240px] font-mono font-bold tracking-wider text-[13px] text-[#342407] uppercase bg-white border border-[#c8aa68] rounded px-2.5 py-1"
              value={form.promoCode || ""}
              onChange={(e) =>
                updateForm("promoCode", e.target.value.toUpperCase())
              }
              placeholder={`e.g. OFFER-${(form.customerName || "USER").replace(/[^a-zA-Z0-9]/g, "").slice(0, 5).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`}
            />
            <small className="text-[11px] text-[#8a7657]">
              (Auto-generated if left blank)
            </small>
          </div>
        </div>
      )}

      <Field label="Note">
        <textarea
          value={form.note}
          onChange={(e) => updateForm("note", e.target.value)}
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
  notes,
  note,
  setNote,
  addNote,
  close,
  onCounter,
  onConfirm,
}: {
  offer: Offer;
  notes: any[];
  note: string;
  setNote: (value: string) => void;
  addNote: () => void;
  close: () => void;
  onCounter: () => void;
  onConfirm: (status: Offer["status"]) => void;
}) {
  return (
    <div className="offer-detail">
      <button className="detail-close" onClick={close}>
        <X />
      </button>
      <div className="detail-head">
        <h3>
          {offer.id} — {offer.productName}
        </h3>
        <Status status={offer.status} />
      </div>
      <div className="detail-grid">
        <DetailItem label="Product" value={offer.productName} featured />
        <DetailItem label="Customer" value={offer.customerName} whatsapp />
        <DetailItem
          label="Submitted"
          value={`${new Date(offer.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}${offer.channel ? ` via ${offer.channel}` : ""}`}
        />
        <DetailItem label="Listed price" value={money(offer.marketPrice)} />
        <DetailItem
          label="Offered price"
          value={`${money(offer.offerPrice)} (${offer.askPercentage}%)`}
        />
      </div>

      {offer.promoCode && (
        <div className="my-4 rounded-lg border border-[#d8be82] bg-gradient-to-r from-[#fbf8f0] to-[#f5edd9] p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#9c772e]" />
              <span className="text-[12px] font-bold text-[#3a2f1a] uppercase tracking-wider">
                Website Promo Code
              </span>
              <code className="rounded bg-white px-2.5 py-0.5 font-mono text-[13px] font-bold text-[#8a6823] border border-[#d8c397]">
                {offer.promoCode}
              </code>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 rounded bg-[#c5a65f] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-[#b5954a] transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(offer.promoCode!);
                toast.success(`Promo code copied: ${offer.promoCode}`);
              }}
            >
              <Copy className="h-3 w-3" /> Copy Code
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-[#71644f]">
            Share this promo code with the customer. When they enter it at website checkout, they will receive a flat discount of{" "}
            <strong>
              ₹
              {(offer.marketPrice > offer.offerPrice
                ? offer.marketPrice - offer.offerPrice
                : 0
              ).toLocaleString("en-IN")}
            </strong>{" "}
            to match the agreed price of {money(offer.offerPrice)}.
          </p>
        </div>
      )}
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
        <button className="accept" onClick={() => onConfirm("Accepted")}>
          <Check /> Accept &amp; Convert to Order
        </button>
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
function DetailItem({
  label,
  value,
  featured,
  whatsapp,
}: {
  label: string;
  value: string;
  featured?: boolean;
  whatsapp?: boolean;
}) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong className={featured ? "featured" : ""}>
        {value}
        {whatsapp && <MessageCircle />}
      </strong>
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
