import { AlertTriangle } from "lucide-react";
import { Payout } from "../../../services/payoutApi";

interface PayoutIntegrityBannerProps {
  payouts?: Payout[];
}

export default function PayoutIntegrityBanner({ payouts = [] }: PayoutIntegrityBannerProps) {
  // TODO: We need to cross-reference with live Orders to find missing payouts.
  // For now, since we don't have static data and we don't want to show dummy data,
  // we return null. Once the missing payouts API is ready, we can render them here.
  const missingPayouts: any[] = []; 
  
  if (missingPayouts.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-[#E7CBC0] bg-[#FCF0EE]">
      <div className="p-5">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]" />
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#92400E]">
            Payout Integrity — {missingPayouts.length} Completed Orders with No Payout on Record
          </h3>
        </div>

        <div className="mt-4 space-y-3">
          {missingPayouts.map((order) => (
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