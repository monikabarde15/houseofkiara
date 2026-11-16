import { AlertTriangle } from "lucide-react";
import { Payout } from "../../../services/payoutApi";
import { Order, Product } from "../../../types";

interface PayoutIntegrityBannerProps {
  payouts?: Payout[];
  orders?: Order[];
  products?: Product[];
  onQueuePayout?: (order: any) => void;
  onSelectOrder?: (orderId: string) => void;
  onSelectLister?: (listerIdOrName: string) => void;
}

const parseAmount = (val: any) => {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
  return isNaN(num) ? 0 : num;
};

export default function PayoutIntegrityBanner({
  payouts = [],
  orders = [],
  products = [],
  onQueuePayout,
  onSelectOrder,
  onSelectLister,
}: PayoutIntegrityBannerProps) {
  const existingOrderIds = new Set(
    payouts
      .map((p) => String(p.orderId || "").trim().toLowerCase())
      .filter(Boolean),
  );

  const missingPayouts = orders
    .filter((o: any) => {
      const ordId = String(o.orderId || o.id || o.orderNumber || "").trim();
      if (!ordId) return false;
      if (existingOrderIds.has(ordId.toLowerCase())) return false;
      const st = String(o.status || "").toLowerCase();
      return (
        st === "returned" ||
        st === "complete" ||
        st === "completed" ||
        st === "delivered" ||
        st === "processed"
      );
    })
    .map((o: any) => {
      const ordId = String(o.orderId || o.id || o.orderNumber || "");
      const firstItem = Array.isArray(o.items) && o.items.length > 0 ? o.items[0] : null;
      const prodId = firstItem?.productId || o.productId || "";
      const prodName = firstItem?.productName || o.productName || "Designer Piece";
      const matchedProduct = products.find(
        (p: any) =>
          (prodId && (p.productId === prodId || p.id === prodId || p._id === prodId)) ||
          (p.name && p.name.toLowerCase() === prodName.toLowerCase()),
      );
      const listerName =
        firstItem?.listerName ||
        o.listerName ||
        (matchedProduct as any)?.listerName ||
        "Lister";
      const listerId =
        firstItem?.listerId ||
        o.listerId ||
        (matchedProduct as any)?.listerId ||
        listerName;
      const rawAmt =
        parseAmount(o.amount) ||
        parseAmount(o.orderValue) ||
        parseAmount(o.grandTotal) ||
        parseAmount(firstItem?.amount);

      return {
        rawOrder: o,
        id: ordId,
        lister: listerName,
        listerId,
        product: prodName,
        productId: prodId || matchedProduct?.id || "PRD-101",
        customer: o.customerName || "Customer",
        amountNum: rawAmt,
        amount: `₹${rawAmt.toLocaleString("en-IN")}`,
        mode: firstItem?.mode || o.mode || "Rental",
      };
    });

  if (missingPayouts.length === 0) return null;

  const untrackedTotal = missingPayouts.reduce((s, m) => s + m.amountNum, 0);

  return (
    <section className="overflow-hidden rounded-xl border border-[#E7CBC0] bg-[#FCF0EE]">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]" />
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#92400E]">
            Payout Integrity — {missingPayouts.length} Completed{" "}
            {missingPayouts.length === 1 ? "Order" : "Orders"} with No Payout on
            Record (₹{untrackedTotal.toLocaleString("en-IN")} of Transaction
            Value Untracked)
          </h3>
        </div>

        {/* Order Rows */}
        <div className="mt-4 space-y-3">
          {missingPayouts.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <button
                  type="button"
                  onClick={() => onSelectOrder?.(order.id)}
                  className="font-medium text-[#B45309] hover:underline cursor-pointer"
                >
                  {order.id}
                </button>
                <button
                  type="button"
                  onClick={() => onSelectLister?.(order.listerId)}
                  className="font-semibold text-[#1E1412] hover:underline cursor-pointer"
                >
                  {order.lister}
                </button>
                <span className="text-[#1E1412]">{order.product}</span>
                <span className="text-stone-500">for {order.customer}</span>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <span className="text-sm font-semibold text-[#1E1412]">
                  {order.amount}
                </span>
                <button
                  type="button"
                  onClick={() => onQueuePayout?.(order)}
                  className="rounded-md border border-[#D4A574] bg-transparent px-3 py-1.5 text-xs font-medium text-[#92400E] transition hover:bg-[#FDF2F0] cursor-pointer"
                >
                  Queue payout
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
