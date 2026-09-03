import { Payout } from "../../../services/payoutApi";

interface PayoutSummaryCardsProps {
  pendingTotal: number;
  paidTotal: number;
  pendingCount: number;
  payouts?: Payout[];
}

export default function PayoutSummaryCards({ pendingTotal, paidTotal, pendingCount, payouts = [] }: PayoutSummaryCardsProps) {
  const hokCommissionTotal = payouts.reduce((sum, p) => sum + (p.status === 'Paid' ? (p.hokCommission || 0) : 0), 0);
  const damageCompTotal = payouts.reduce((sum, p) => sum + (p.mode === 'Damage Comp.' && p.status === 'Pending' ? p.listerShare : 0), 0);

  const cards = [
    {
      title: "Pending Approval",
      value: `₹${pendingTotal.toLocaleString('en-IN')}`,
      subtitle: `${pendingCount} awaiting approval`,
      valueColor: "text-[#C46A3A]",
    },
    {
      title: "Paid (MTD)",
      value: `₹${paidTotal.toLocaleString('en-IN')}`,
      subtitle: "",
      valueColor: "text-[#5F7D54]",
    },
    {
      title: "HOK Commission (MTD)",
      value: `₹${hokCommissionTotal.toLocaleString('en-IN')}`,
      subtitle: "",
      valueColor: "text-[#1F1B18]",
    },
    {
      title: "Damage Compensation Due",
      value: `₹${damageCompTotal.toLocaleString('en-IN')}`,
      subtitle: damageCompTotal > 0 ? "Triggered by deposit deduction" : "",
      valueColor: "text-[#C9A45A]",
    },
  ];

  return (
    <section className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="
            h-[104px]
            rounded-[4px]
            border
            border-[#E7E0D8]
            bg-white
            px-5
            pt-4
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
        </div>
      ))}
    </section>
  );
}