import { AlertTriangle } from "lucide-react";

export default function PayoutIntegrityBanner() {
  const orders = [
    {
      id: "HOK-ORD-008",
      lister: "Meera Joshi",
      product: "Rajputana Silk Bridal Lehenga",
      customer: "Radhika Mehta",
      amount: "₹16,500",
    },
    {
      id: "HOK-ORD-017",
      lister: "Aishwarya Sharma",
      product: "Charcoal Silk Bandhgala",
      customer: "Kabir Malhotra",
      amount: "₹32,000",
    },
    {
      id: "HOK-ORD-015",
      lister: "Meera Joshi",
      product: "Rajputana Silk Bridal Lehenga",
      customer: "Tara Bhatt",
      amount: "₹8,500",
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-[#E7CBC0] bg-[#FCF0EE]">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]" />
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#92400E]">
            Payout Integrity — 3 Completed Orders with No Payout on Record (₹57,000 of Transaction Value Untracked)
          </h3>
        </div>

        {/* Order Rows */}
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className="font-medium text-[#B45309]">{order.id}</span>
                <span className="font-semibold text-[#1E1412]">{order.lister}</span>
                <span className="text-[#1E1412]">{order.product}</span>
                <span className="text-stone-500">for {order.customer}</span>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <span className="text-sm font-semibold text-[#1E1412]">
                  {order.amount}
                </span>
                <button className="rounded-md border border-[#D4A574] bg-transparent px-3 py-1.5 text-xs font-medium text-[#92400E] transition hover:bg-[#FDF2F0]">
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