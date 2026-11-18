import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Customer } from "../types";

interface CreateOrderModalProps {
  customers: Customer[];
  onClose: () => void;
  onCreated: (order: any) => void;
}

interface LineDraft {
  productKey: string;
  mode: "Rental" | "Preloved" | "Buy";
  size: string;
  startDate: string;
  endDate: string;
  amount: string;
}

const CHANNELS = ["WhatsApp", "Instagram", "Phone", "Walk-in", "Website", "Other"];
const MODES: Array<"Rental" | "Preloved" | "Buy"> = ["Rental", "Preloved", "Buy"];

const emptyLine = (): LineDraft => ({
  productKey: "",
  mode: "Rental",
  size: "",
  startDate: "",
  endDate: "",
  amount: "",
});

const inputCls =
  "w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs text-stone-700 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] outline-none";
const labelCls =
  "block text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-1";

export default function CreateOrderModal({
  customers,
  onClose,
  onCreated,
}: CreateOrderModalProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [channel, setChannel] = useState("WhatsApp");
  const [lines, setLines] = useState<LineDraft[]>([emptyLine()]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/products")
      .then((r) => r.json())
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];
        setProducts(list);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const findProd = (key: string) =>
    products.find((p) => String(p.productId || p._id || p.id) === key);

  const updateLine = (idx: number, patch: Partial<LineDraft>) => {
    setLines((prev) =>
      prev.map((ln, i) => (i === idx ? { ...ln, ...patch } : ln)),
    );
  };

  const addLine = () => setLines((prev) => [...prev, emptyLine()]);

  const removeLine = (idx: number) =>
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx)));

  // Autofill when an existing customer name is picked
  const onNameChange = (v: string) => {
    setCustomerName(v);
    const match = customers.find(
      (c) => (c.name || "").toLowerCase() === v.trim().toLowerCase(),
    );
    if (match) {
      if (
        match.email &&
        !match.email.includes("temp.com") &&
        !match.email.includes("hok.local")
      ) {
        setCustomerEmail(match.email);
      }
      if ((match as any).phone) setCustomerPhone((match as any).phone);
      if ((match as any).location) setCustomerCity((match as any).location);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return toast.error("Customer name is required");
    if (!customerPhone.trim() && !customerEmail.trim()) {
      return toast.error("Add a phone number or email");
    }

    const builtItems: any[] = [];
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];
      const prod = findProd(ln.productKey);
      if (!prod) {
        return toast.error(`Select a product for item #${i + 1}`);
      }
      if (ln.mode === "Rental") {
        if (!ln.startDate || !ln.endDate) {
          return toast.error(`Select rental start and end dates for item #${i + 1}`);
        }
        if (ln.endDate < ln.startDate) {
          return toast.error(`End date cannot be before start date for item #${i + 1}`);
        }
      }
      const item: any = {
        productId: prod.productId || prod._id || prod.id,
        productName: prod.name || prod.title,
        designer: prod.designer,
        mode: ln.mode,
        size: ln.size || undefined,
      };
      if (ln.mode === "Rental") {
        item.startDate = ln.startDate;
        item.endDate = ln.endDate;
        item.rentalStartDate = ln.startDate;
        item.rentalEndDate = ln.endDate;
      }
      if (ln.amount !== "") item.amount = Number(ln.amount);
      builtItems.push(item);
    }

    const orderMode =
      builtItems.length > 1
        ? "Multi-item"
        : builtItems[0]?.mode || "Rental";

    const auth = (() => {
      try {
        return JSON.parse(localStorage.getItem("hok_admin_user") || "{}");
      } catch {
        return {};
      }
    })();

    setSaving(true);
    const matched = customers.find(
      (c) => (c.name || "").toLowerCase() === customerName.trim().toLowerCase(),
    );
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(matched?.customerId ? { customerId: matched.customerId } : {}),
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          customerCity: customerCity.trim(),
          mode: orderMode,
          status: "Confirmed",
          source: channel,
          channel,
          notes,
          createdBy: auth?.name || "Admin",
          items: builtItems,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false) {
        toast.success("Order created");
        onCreated(json.data || json);
        onClose();
      } else {
        toast.error(json.message || "Could not create order");
      }
    } catch (err: any) {
      toast.error(err?.message || "Could not create order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={submit}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-stone-200"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <h3 className="font-serif text-lg text-stone-900">
              Create Order Manually
            </h3>
            <p className="text-[11px] text-stone-500">
              For WhatsApp, Instagram, phone and walk-in bookings. Add one or more pieces.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Customer block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelCls}>Customer name *</label>
              <input
                list="hok-order-customers"
                value={customerName}
                onChange={(e) => onNameChange(e.target.value)}
                className={inputCls}
                placeholder="Type to pick an existing customer or add a new one"
                autoComplete="off"
              />
              <datalist id="hok-order-customers">
                {customers.map((c) => (
                  <option key={c.customerId || c.id} value={c.name} />
                ))}
              </datalist>
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className={inputCls}
                autoComplete="off"
              />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className={inputCls}
                autoComplete="off"
              />
            </div>
            <div>
              <label className={labelCls}>City</label>
              <input
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                className={inputCls}
                autoComplete="off"
              />
            </div>
            <div>
              <label className={labelCls}>Booked via</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className={inputCls}
              >
                {CHANNELS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Items block */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-stone-600">
                Pieces ({lines.length})
              </span>
              <button
                type="button"
                onClick={addLine}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium border border-stone-200 rounded bg-[#fcf9f5] hover:bg-stone-100 text-stone-700 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add Another Piece
              </button>
            </div>

            {lines.map((ln, idx) => {
              const prod = findProd(ln.productKey);
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-md border border-stone-200 bg-stone-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Piece #{idx + 1}
                    </span>
                    {lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLine(idx)}
                        className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-3">
                      <label className={labelCls}>Product *</label>
                      <select
                        value={ln.productKey}
                        onChange={(e) =>
                          updateLine(idx, {
                            productKey: e.target.value,
                            size: "",
                          })
                        }
                        className={inputCls}
                      >
                        <option value="">Select a product</option>
                        {products.map((p) => (
                          <option
                            key={p.productId || p._id || p.id}
                            value={String(p.productId || p._id || p.id)}
                          >
                            {(p.name || p.title) +
                              (p.designer ? ` — ${p.designer}` : "") +
                              (p.sku ? ` (${p.sku})` : "")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Mode</label>
                      <select
                        value={ln.mode}
                        onChange={(e) =>
                          updateLine(idx, {
                            mode: e.target.value as LineDraft["mode"],
                          })
                        }
                        className={inputCls}
                      >
                        {MODES.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Size</label>
                      {Array.isArray(prod?.sizes) && prod.sizes.length > 0 ? (
                        <select
                          value={ln.size}
                          onChange={(e) =>
                            updateLine(idx, { size: e.target.value })
                          }
                          className={inputCls}
                        >
                          <option value="">Select size</option>
                          {prod.sizes.map((s: any) => {
                            const v =
                              typeof s === "object" ? s.size || s.label : s;
                            return <option key={v}>{v}</option>;
                          })}
                        </select>
                      ) : (
                        <input
                          value={ln.size}
                          onChange={(e) =>
                            updateLine(idx, { size: e.target.value })
                          }
                          className={inputCls}
                        />
                      )}
                    </div>

                    <div>
                      <label className={labelCls}>Amount (₹) — optional</label>
                      <input
                        type="number"
                        value={ln.amount}
                        onChange={(e) =>
                          updateLine(idx, { amount: e.target.value })
                        }
                        className={inputCls}
                        placeholder="Auto from product"
                      />
                    </div>

                    {ln.mode === "Rental" && (
                      <>
                        <div>
                          <label className={labelCls}>Rental start *</label>
                          <input
                            type="date"
                            value={ln.startDate}
                            onChange={(e) =>
                              updateLine(idx, { startDate: e.target.value })
                            }
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Rental end *</label>
                          <input
                            type="date"
                            value={ln.endDate}
                            min={ln.startDate || undefined}
                            onChange={(e) =>
                              updateLine(idx, { endDate: e.target.value })
                            }
                            className={inputCls}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-stone-100 bg-stone-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs border border-stone-200 rounded bg-white text-stone-600 cursor-pointer hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-xs rounded-md bg-[#C7A55C] hover:bg-[#B9974B] text-[#2A2118] font-semibold cursor-pointer transition disabled:opacity-60"
          >
            {saving ? "Creating…" : "Create Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
