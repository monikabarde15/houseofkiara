// import { cn } from "@/lib/utils";
import { PayoutTab } from "../PayoutsView";

interface PayoutTabsProps {
  activeTab: PayoutTab;
  onChange: (tab: PayoutTab) => void;
  payouts?: any[];
}

interface TabItem {
  label: string;
  value: PayoutTab;
  count?: number;
}

export default function PayoutTabs({
  activeTab,
  onChange,
  payouts = [],
}: PayoutTabsProps) {
  const pendingCount = payouts.filter((p) => p.status === "Pending" || p.status === "Pending Approval").length;
  const paidCount = payouts.filter((p) => p.status === "Paid").length;
  const failedCount = payouts.filter((p) => p.status === "Failed" || p.status === "Reversed").length;
  const damageCompCount = payouts.filter(
    (p) => (p.mode === "Damage Comp." || p.mode === "Damage Compensation")
  ).length;

  const tabs: TabItem[] = [
    {
      label: "Payment Queue",
      value: "payment-queue",
      count: pendingCount,
    },
    {
      label: `All Payouts`,
      value: "all-payouts",
      count: payouts.length,
    },
    {
      label: "By Lister",
      value: "by-lister",
    },
    {
      label: "By Product",
      value: "by-product",
    },
    {
      label: "Damage Compensation",
      value: "damage-compensation",
      count: damageCompCount,
    },
  ];

  return (
    <div className="border-b border-[#E7E0D6]">
      <nav className="flex items-center gap-8 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const active = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={`relative inline-flex items-center gap-2.5 whitespace-nowrap pb-3 pt-1 text-sm font-medium transition-colors ${
                active
                  ? "text-[#1E1412]"
                  : "text-[#78716C] hover:text-[#1E1412]"
              }`}
            >
              <span>{tab.label}</span>

              {tab.count !== undefined && tab.count > 0 && (
                <span className="inline-flex items-center justify-center rounded bg-[#F5EAD2] px-2 py-0.5 text-xs font-semibold text-[#8C6B20]">
                  {tab.count}
                </span>
              )}

              {active && (
                <span className="absolute inset-x-0 -bottom-px h-[2px] bg-[#C39A38]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}