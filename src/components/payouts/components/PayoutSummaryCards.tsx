const cards = [
  {
    title: "Pending Approval",
    value: "₹84,500",
    subtitle: "4 awaiting approval",
    valueColor: "text-[#C46A3A]",
  },
  {
    title: "Paid (MTD)",
    value: "₹28,500",
    subtitle: "",
    valueColor: "text-[#5F7D54]",
  },
  {
    title: "HOK Commission (MTD)",
    value: "₹9,500",
    subtitle: "",
    valueColor: "text-[#1F1B18]",
  },
  {
    title: "Damage Compensation Due",
    value: "₹9,000",
    subtitle: "1 record — triggered by deposit deduction",
    valueColor: "text-[#C9A45A]",
  },
];

export default function PayoutSummaryCards() {
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