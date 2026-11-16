import { Payout } from "../../../services/payoutApi";
import { PayoutTab } from "../PayoutsView";

interface PayoutSummaryCardsProps {
  payouts?: Payout[];
  onSelectTab?: (tab: PayoutTab, statusFilter?: string) => void;
}

export default function PayoutSummaryCards({
  payouts = [],
  onSelectTab,
}: PayoutSummaryCardsProps) {
  const pendingPayouts = payouts.filter(
    (p) => p.status === "Pending" || p.status === "Pending Approval",
  );
  const pendingTotal = pendingPayouts.reduce(
    (sum, p) => sum + (Number(p.listerShare) || 0),
    0,
  );
  const pendingCount = pendingPayouts.length;

  const paidPayouts = payouts.filter((p) => p.status === "Paid");
  const paidTotal = paidPayouts.reduce(
    (sum, p) => sum + (Number(p.listerShare) || 0),
    0,
  );
  const hokCommissionTotal = paidPayouts.reduce(
    (sum, p) => sum + (Number(p.hokCommission) || 0),
    0,
  );

  const damageCompPending = payouts.filter(
    (p) =>
      (p.mode === "Damage Comp." || p.mode === "Damage Compensation") &&
      p.status !== "Paid",
  );
  const damageCompTotal = damageCompPending.reduce(
    (sum, p) => sum + (Number(p.listerShare) || 0),
    0,
  );

  const cards = [
    {
      title: "Pending Approval",
      value: `₹${pendingTotal.toLocaleString("en-IN")}`,
      subtitle: `${pendingCount} awaiting approval`,
      valueColor: "text-[#C46A3A]",
      onClick: () => onSelectTab?.("payment-queue"),
    },
    {
      title: "Paid (MTD)",
      value: `₹${paidTotal.toLocaleString("en-IN")}`,
      subtitle: "",
      valueColor: "text-[#5F7D54]",
      onClick: () => onSelectTab?.("all-payouts", "Paid"),
    },
    {
      title: "HOK Commission (MTD)",
      value: `₹${hokCommissionTotal.toLocaleString("en-IN")}`,
      subtitle: "",
      valueColor: "text-[#1F1B18]",
      onClick: () => onSelectTab?.("all-payouts", "Paid"),
    },
    {
      title: "Damage Compensation Due",
      value: `₹${damageCompTotal.toLocaleString("en-IN")}`,
      subtitle:
        damageCompPending.length > 0
          ? `${damageCompPending.length} ${damageCompPending.length === 1 ? "record" : "records"} — triggered by deposit deduction`
          : "",
      valueColor: "text-[#C9A45A]",
      onClick: () => onSelectTab?.("damage-compensation"),
    },
  ];

  return (
    <section className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <button
          key={card.title}
          type="button"
          onClick={card.onClick}
          className="
            h-[104px]
            rounded-[4px]
            border
            border-[#E7E0D8]
            bg-white
            px-5
            pt-4
            text-left
            cursor-pointer
            transition-colors
            hover:border-[#C39A38]
          "
        >
          <p
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-[#8F837A]
            "
          >
            {card.title}
          </p>

          <h3
            className={`mt-1 text-[22px] font-semibold leading-none ${card.valueColor}`}
          >
            {card.value}
          </h3>

          {card.subtitle && (
            <p
              className="
                mt-2
                text-[12px]
                leading-4
                text-[#8A8178]
              "
            >
              {card.subtitle}
            </p>
          )}
        </button>
      ))}
    </section>
  );
}
