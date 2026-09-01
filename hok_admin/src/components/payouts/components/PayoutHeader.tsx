export default function PayoutHeader() {
  return (
    <header className="mb-8">
      {/* Section Label */}
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C3A16B]">
        OPERATIONS
      </p>

      {/* Title */}
      <h1
        className="
          font-serif
          text-[22px]
          font-normal
          leading-none
          tracking-[-0.01em]
          text-[#34251E]
        "
      >
        Payouts to Listers
      </h1>

      {/* Description */}
      <p
        className="
          mt-2
          max-w-[760px]
          text-[13px]
          leading-[1.55]
          text-[#756A63]
        "
      >
        T+3 payout cycle. Every payout percentage is individually confirmed
        before processing — click a lister name <br/> to view their full profile, or
        click an order ID to view the order.
      </p>
    </header>
  );
}