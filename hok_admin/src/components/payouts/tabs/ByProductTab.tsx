import React, { useMemo, useState } from "react";
import { Payout } from "../../../services/payoutApi";
import { Product } from "../../../types";

interface ByProductTabProps {
  payouts?: Payout[];
  products?: Product[];
  onSelectOrder?: (orderId: string) => void;
  onSelectLister?: (listerId: string) => void;
}

const statusBadgeClasses: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  "Pending Approval": "bg-[#fff3d6] text-[#8a6a2c]",
  Pending: "bg-[#fff3d6] text-[#8a6a2c]",
  Failed: "bg-red-100 text-red-700",
  Reversed: "bg-gray-100 text-gray-700",
};

const formatDateShort = (raw?: string) => {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ByProductTab({
  payouts = [],
  products = [],
  onSelectOrder,
  onSelectLister,
}: ByProductTabProps) {
  const rentalPayouts = useMemo(
    () =>
      payouts.filter((p) => {
        if (!p.productName) return false;
        const m = String(p.mode || "").toLowerCase();
        return !m.includes("damage");
      }),
    [payouts],
  );

  const PRODUCT_NAMES = useMemo(() => {
    const names = new Set<string>();
    rentalPayouts.forEach((t) => {
      if (t.productName) names.add(t.productName);
    });
    products.forEach((p) => {
      if (p?.name) names.add(p.name);
    });
    return Array.from(names).sort();
  }, [rentalPayouts, products]);

  const [selectedProduct, setSelectedProduct] = useState<string>(
    PRODUCT_NAMES[0] ?? "",
  );

  React.useEffect(() => {
    if (
      (!selectedProduct || !PRODUCT_NAMES.includes(selectedProduct)) &&
      PRODUCT_NAMES.length > 0
    ) {
      setSelectedProduct(PRODUCT_NAMES[0]);
    }
  }, [PRODUCT_NAMES, selectedProduct]);

  const productTransactions = useMemo(
    () =>
      rentalPayouts
        .filter((t) => t.productName === selectedProduct)
        .slice()
        .sort(
          (a, b) =>
            new Date(a.dueDate || a.createdAt || 0).getTime() -
            new Date(b.dueDate || b.createdAt || 0).getTime(),
        ),
    [selectedProduct, rentalPayouts],
  );

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Product selector */}
      <div className="space-y-1 max-w-md">
        <label className="uppercase text-[11px] tracking-wider font-bold text-stone-400">
          Select Rental Product
        </label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm bg-white focus:outline-none focus:border-[#c5a880]"
        >
          {PRODUCT_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          {PRODUCT_NAMES.length === 0 && <option>No Products Available</option>}
        </select>
      </div>

      {/* Rental history table for the selected product */}
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200">
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Lister</th>
                <th className="px-4 py-3">Transaction Value</th>
                <th className="px-4 py-3">Payout %</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600 font-sans">
              {productTransactions.map((t, idx) => {
                const modeLower = String(t.mode || "").toLowerCase();
                const isPreloved =
                  modeLower.includes("preloved") ||
                  modeLower.includes("buy") ||
                  modeLower.includes("sale");
                const txLabel = isPreloved
                  ? "Preloved Sale"
                  : `Rental #${idx + 1}`;
                const txVal =
                  Number(t.transactionAmount) ||
                  (Number(t.listerShare) || 0) + (Number(t.hokCommission) || 0);
                const pctNum =
                  t.payoutPercentage ||
                  (txVal > 0
                    ? Math.round(((Number(t.listerShare) || 0) / txVal) * 100)
                    : 0);
                const displayStatus =
                  t.status === "Pending" ? "Pending Approval" : t.status;
                const dateLabel =
                  t.status === "Paid"
                    ? formatDateShort(t.paidAt || t.dueDate)
                    : null;

                return (
                  <tr
                    key={t.id}
                    className={`hover:bg-[#fcf9f5] transition-colors ${idx % 2 === 1 ? "bg-stone-50/40" : ""}`}
                  >
                    <td className="px-4 py-3 font-semibold text-stone-900">
                      {txLabel}
                    </td>

                    <td className="px-4 py-3">{dateLabel ?? "—"}</td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onSelectOrder?.(t.orderId)}
                        className="text-[#8a6a2c] font-mono text-[10px] hover:underline cursor-pointer"
                      >
                        {t.orderId}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectLister?.(t.listerId || t.listerName)
                        }
                        className="text-[#8a6a2c] font-medium hover:underline cursor-pointer"
                      >
                        {t.listerName}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      ₹{txVal.toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-3 font-semibold text-stone-900">
                      {pctNum}%
                    </td>

                    <td className="px-4 py-3 font-medium">
                      ₹{(Number(t.listerShare) || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-medium ${statusBadgeClasses[displayStatus] || statusBadgeClasses["Pending Approval"]}`}
                      >
                        {displayStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {productTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-stone-400"
                  >
                    No rental history for this product yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
