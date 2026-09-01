function ByListerTab() {
    const summaryCards = [
        {
            title: "TOTAL EARNED",
            value: "₹28,500",
        },
        {
            title: "PENDING",
            value: "₹3,900",
        },
        {
            title: "AVG PAYOUT %",
            value: "67.5%",
        },
        {
            title: "TRANSACTIONS",
            value: "2",
        },
        {
            title: "NEXT PAYOUT DUE",
            value: "28 Mar 2026",
        },
    ];

    return (
        <div className="space-y-5">

            {/* Select Lister */}

            <div className="max-w-sm">
                <label className="block mb-2 text-[11px] font-semibold tracking-[1.4px] uppercase text-[#8D8275]">
                    Select Lister
                </label>

                <select
                    defaultValue="Aishwarya Sharma"
                    className="
    w-full
    h-[42px]
    rounded-md
    border
    border-[#D8D1C8]
    bg-white
    px-4
    text-[14px]
    text-[#4A433D]
    focus:outline-none
    focus:ring-0
  "
                >
                    <option>Aishwarya Sharma</option>
                </select>
            </div>

            {/* Lister Header */}

            <div className="flex items-center gap-3">

                <h2
                    className="text-[30px]"
                    style={{
                        color: "#C49A53",
                        fontFamily: "Cormorant Garamond, serif",
                    }}
                >
                    Aishwarya Sharma
                </h2>

                <button className="h-8 w-8 rounded bg-[#22C55E] flex items-center justify-center text-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.43 0 .06 5.37.06 11.98c0 2.11.55 4.17 1.59 5.99L0 24l6.2-1.63a11.92 11.92 0 0 0 5.83 1.49h.01c6.61 0 11.98-5.37 11.98-11.98 0-3.2-1.25-6.2-3.5-8.4Zm-8.48 18.4a9.9 9.9 0 0 1-5.05-1.39l-.36-.22-3.68.97.98-3.59-.23-.37a9.93 9.93 0 1 1 8.34 4.6Zm5.45-7.43c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.69.15-.2.3-.79.98-.96 1.18-.18.2-.35.23-.65.08-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.69-1.66-.94-2.27-.25-.6-.5-.52-.69-.53h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.04-1.06 2.54s1.09 2.94 1.24 3.14c.15.2 2.14 3.27 5.18 4.58.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.79-.73 2.04-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
                    </svg>
                </button>

                <button
                    className="h-8 rounded border border-[#D8D1C8] bg-white px-4 text-[12px] font-medium text-[#4E4942]"
                >
                    Statement → WhatsApp
                </button>

            </div>

            {/* Summary Cards */}

            <div className="grid grid-cols-5 gap-4">

                {summaryCards.map((card) => (
                    <div
                        key={card.title}
                        className="rounded border border-[#E6DDD4] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                    >
                        <div className="mb-3 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#8D8275]">
                            {card.title}
                        </div>

                        <div
                            className={`${card.title === "PENDING"
                                    ? "text-[#C98A4B]"
                                    : card.title === "TOTAL EARNED"
                                        ? "text-[#6F6B63]"
                                        : "text-[#3F3A35]"
                                }`}
                            style={{
                                fontSize:
                                    card.title === "NEXT PAYOUT DUE" ? "20px" : "34px",
                                fontFamily: "Cormorant Garamond, serif",
                                lineHeight: 1,
                            }}
                        >
                            {card.value}
                        </div>
                    </div>
                ))}

            </div>

            {/* Transactions Table */}

            <div className="overflow-hidden rounded-md border border-[#E6DDD4] bg-white">

                <table className="w-full border-collapse">

                    <thead className="bg-[#FBF9F6]">

                        <tr className="border-b border-[#E6DDD4]">

                            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[1.4px] text-[#8D8275]">
                                TXN #
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[1.4px] text-[#8D8275]">
                                Order
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[1.4px] text-[#8D8275]">
                                Product
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[1.4px] text-[#8D8275]">
                                Type
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[1.4px] text-[#8D8275]">
                                Rental #
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[1.4px] text-[#8D8275]">
                                Transaction Value
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[1.4px] text-[#8D8275]">
                                Payout %
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[1.4px] text-[#8D8275]">
                                Payout Amount
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[1.4px] text-[#8D8275]">
                                Status
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[1.4px] text-[#8D8275]">
                                Date
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr className="border-b border-[#ECE6DF] hover:bg-[#FCFBF9]">

                            <td className="px-4 py-4 text-sm text-[#3E3935]">
                                1
                            </td>

                            <td className="px-4 py-4 text-sm font-medium text-[#C39A55]">
                                HOK-ORD-002
                            </td>

                            <td className="px-4 py-4 text-[15px] text-[#C39A55]">
                                Ivory Embroidered Sherwani
                            </td>

                            <td className="px-4 py-4">
                                <span className="rounded bg-[#F8E6D7] px-2 py-1 text-[11px] font-medium text-[#A66A36]">
                                    Preloved Sale
                                </span>
                            </td>

                            <td className="px-4 py-4 text-sm text-[#403A35]">
                                Sale
                            </td>

                            <td className="px-4 py-4 font-medium text-[#403A35]">
                                ₹38,000
                            </td>

                            <td className="px-4 py-4 font-medium text-[#403A35]">
                                75%
                            </td>

                            <td className="px-4 py-4 font-semibold text-[#6E9A60]">
                                ₹28,500
                            </td>

                            <td className="px-4 py-4">

                                <span className="rounded bg-[#E6F5E7] px-2 py-1 text-[11px] font-semibold text-[#5A8A4E]">
                                    Paid
                                </span>

                            </td>

                            <td className="px-4 py-4 text-sm text-[#403A35]">
                                21 Mar 2026
                            </td>

                        </tr>

                        <tr>

                            <td className="px-4 py-4 text-sm text-[#3E3935]">
                                2
                            </td>

                            <td className="px-4 py-4 text-sm font-medium text-[#C39A55]">
                                HOK-ORD-003
                            </td>

                            <td className="px-4 py-4 text-[15px] text-[#C39A55]">
                                Rose Georgette Anarkali
                            </td>

                            <td className="px-4 py-4">

                                <span className="rounded bg-[#DDF3EF] px-2 py-1 text-[11px] font-medium text-[#4D8D84]">
                                    Rental
                                </span>

                            </td>

                            <td className="px-4 py-4 text-sm text-[#403A35]">
                                Rental #1
                            </td>

                            <td className="px-4 py-4 font-medium text-[#403A35]">
                                ₹6,500
                            </td>

                            <td className="px-4 py-4 font-medium text-[#403A35]">
                                60%
                            </td>

                            <td className="px-4 py-4 font-semibold text-[#D06C4F]">
                                ₹3,900
                            </td>

                            <td className="px-4 py-4">

                                <span className="rounded bg-[#FFF4D9] px-2 py-1 text-[11px] font-semibold text-[#B1841F]">
                                    Pending Approval
                                </span>

                            </td>

                            <td className="px-4 py-4 text-sm text-[#403A35]">
                                —
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default ByListerTab;