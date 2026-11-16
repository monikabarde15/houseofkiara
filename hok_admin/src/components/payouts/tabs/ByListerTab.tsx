import React, { useState, useMemo } from "react";
import { Payout } from "../../../services/payoutApi";

interface ByListerTabProps {
  payouts?: Payout[];
  listers?: any[];
  onSelectOrder?: (orderId: string) => void;
  onSelectLister?: (listerId: string) => void;
}

const formatDateShort = (raw?: string) => {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ByListerTab({
  payouts = [],
  listers: listerRecords = [],
  onSelectOrder,
  onSelectLister,
}: ByListerTabProps) {
  const listerNames = useMemo(() => {
    const names = new Set<string>();
    payouts.forEach((p) => {
      if (p.listerName) names.add(p.listerName);
    });
    listerRecords.forEach((l: any) => {
      if (l?.name) names.add(l.name);
    });
    return Array.from(names).sort();
  }, [payouts, listerRecords]);

  const [selectedLister, setSelectedLister] = useState(
    listerNames[0] || "Select Lister",
  );

  React.useEffect(() => {
    if (
      (selectedLister === "Select Lister" ||
        !listerNames.includes(selectedLister)) &&
      listerNames.length > 0
    ) {
      setSelectedLister(listerNames[0]);
    }
  }, [listerNames, selectedLister]);

  const listerPayouts = useMemo(
    () =>
      payouts.filter(
        (p) =>
          p.listerName === selectedLister ||
          (p.listerName &&
            selectedLister &&
            p.listerName.toLowerCase() === selectedLister.toLowerCase()),
      ),
    [payouts, selectedLister],
  );

  const paidPayouts = listerPayouts.filter((p) => p.status === "Paid");
  const pendingPayouts = listerPayouts.filter(
    (p) => p.status === "Pending" || p.status === "Pending Approval",
  );

  const totalEarned = paidPayouts.reduce(
    (sum, p) => sum + (Number(p.listerShare) || 0),
    0,
  );
  const totalPending = pendingPayouts.reduce(
    (sum, p) => sum + (Number(p.listerShare) || 0),
    0,
  );
  const avgPayoutPct =
    listerPayouts.length > 0
      ? (listerPayouts.reduce(
          (sum, p) =>
            sum +
            (Number(p.listerShare) || 0) /
              (Number(p.transactionAmount) ||
                (Number(p.listerShare) || 0) + (Number(p.hokCommission) || 0) ||
                1),
          0,
        ) /
          listerPayouts.length) *
        100
      : 0;

  const nextDueDate =
    pendingPayouts.length > 0
      ? formatDateShort(
          new Date(
            Math.min(
              ...pendingPayouts.map((p) => new Date(p.dueDate).getTime()),
            ),
          ).toISOString(),
        )
      : "—";

  const summaryCards = [
    {
      title: "TOTAL EARNED",
      value: `₹${totalEarned.toLocaleString("en-IN")}`,
    },
    {
      title: "PENDING",
      value: `₹${totalPending.toLocaleString("en-IN")}`,
    },
    {
      title: "AVG PAYOUT %",
      value: `${avgPayoutPct.toFixed(1)}%`,
    },
    {
      title: "TRANSACTIONS",
      value: listerPayouts.length.toString(),
    },
    {
      title: "NEXT PAYOUT DUE",
      value: nextDueDate,
    },
  ];

  // Rental # lookup per product
  const rentalNumberMap = useMemo(() => {
    const map: Record<string, string> = {};
    const byProd: Record<string, Payout[]> = {};
    payouts.forEach((p) => {
      const m = String(p.mode || "").toLowerCase();
      if (m.includes("damage")) {
        map[p.id] = "Comp.";
        return;
      }
      if (m.includes("preloved") || m.includes("buy") || m.includes("sale")) {
        map[p.id] = "Sale";
        return;
      }
      const key = (p.productName || p.productId || "piece").toLowerCase();
      if (!byProd[key]) byProd[key] = [];
      byProd[key].push(p);
    });
    Object.values(byProd).forEach((arr) => {
      arr
        .slice()
        .sort(
          (a, b) =>
            new Date(a.dueDate || a.createdAt || 0).getTime() -
            new Date(b.dueDate || b.createdAt || 0).getTime(),
        )
        .forEach((p, idx) => {
          map[p.id] = `Rental #${idx + 1}`;
        });
    });
    return map;
  }, [payouts]);

  const matchedListerObj = listerRecords.find(
    (l: any) =>
      l?.name &&
      selectedLister &&
      l.name.toLowerCase() === selectedLister.toLowerCase(),
  );

  const openWhatsApp = (withStatement = false) => {
    const digits = String(
      matchedListerObj?.phone || matchedListerObj?.whatsapp || "",
    ).replace(/\D/g, "");
    const cleanPhone =
      digits.length === 10 ? `91${digits}` : digits.length > 10 ? digits : "";
    const body = withStatement
      ? `Hi ${selectedLister}, here is your House of Kaira payout statement:\n• Total Earned: ₹${totalEarned.toLocaleString("en-IN")}\n• Pending Approval: ₹${totalPending.toLocaleString("en-IN")}\n• Transactions: ${listerPayouts.length}\n• Next Payout Due: ${nextDueDate}`
      : `Hi ${selectedLister}, writing from House of Kaira regarding your payouts.`;
    const msg = encodeURIComponent(body);
    window.open(
      cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${msg}`
        : `https://wa.me/?text=${msg}`,
      "_blank",
    );
  };

  return (
    <div className="space-y-5">
      {/* Select Lister */}
      <div className="max-w-sm">
        <label className="block mb-2 text-[11px] font-semibold tracking-[1.4px] uppercase text-[#8D8275]">
          Select Lister
        </label>

        <select
          value={selectedLister}
          onChange={(e) => setSelectedLister(e.target.value)}
          className="w-full h-[42px] rounded-md border border-[#D8D1C8] bg-white px-4 text-[14px] text-[#4A433D] focus:outline-none focus:ring-0"
        >
          {listerNames.map((lister) => (
            <option key={lister} value={lister}>
              {lister}
            </option>
          ))}
          {listerNames.length === 0 && <option>No Listers Available</option>}
        </select>
      </div>

      {/* Lister Header */}
      <div className="flex items-center gap-3">
        <h2
          onClick={() =>
            onSelectLister?.(
              matchedListerObj?.listerId ||
                matchedListerObj?.id ||
                listerPayouts[0]?.listerId ||
                selectedLister,
            )
          }
          className="text-[30px] cursor-pointer hover:underline"
          style={{
            color: "#C49A53",
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          {selectedLister}
        </h2>

        <button
          type="button"
          onClick={() => openWhatsApp(false)}
          className="h-8 w-8 rounded bg-[#22C55E] flex items-center justify-center text-white cursor-pointer hover:opacity-90"
        >
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
          type="button"
          onClick={() => openWhatsApp(true)}
          className="h-8 rounded border border-[#D8D1C8] bg-white px-4 text-[12px] font-medium text-[#4E4942] hover:bg-stone-50 cursor-pointer"
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
              className={`${
                card.title === "PENDING"
                  ? "text-[#C98A4B]"
                  : card.title === "TOTAL EARNED"
                    ? "text-[#6F6B63]"
                    : "text-[#3F3A35]"
              }`}
              style={{
                fontSize: card.title === "NEXT PAYOUT DUE" ? "20px" : "34px",
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
            {listerPayouts.map((row, idx) => {
              const modeLower = String(row.mode || "").toLowerCase();
              const isPreloved =
                modeLower.includes("preloved") ||
                modeLower.includes("buy") ||
                modeLower.includes("sale");
              const isDamage = modeLower.includes("damage");
              const txVal =
                Number(row.transactionAmount) ||
                (Number(row.listerShare) || 0) + (Number(row.hokCommission) || 0);
              const pctNum =
                row.payoutPercentage ||
                (txVal > 0
                  ? Math.round(((Number(row.listerShare) || 0) / txVal) * 100)
                  : 0);
              const isPaid = row.status === "Paid";

              return (
                <tr
                  key={row.id}
                  className="border-b border-[#ECE6DF] hover:bg-[#FCFBF9] last:border-b-0"
                >
                  <td className="px-4 py-4 text-sm text-[#3E3935]">
                    {idx + 1}
                  </td>

                  <td className="px-4 py-4 text-sm font-medium text-[#C39A55]">
                    <button
                      type="button"
                      onClick={() => onSelectOrder?.(row.orderId)}
                      className="hover:underline cursor-pointer"
                    >
                      {row.orderId}
                    </button>
                  </td>

                  <td className="px-4 py-4 text-[15px] text-[#C39A55]">
                    {row.productName}
                  </td>

                  <td className="px-4 py-4">
                    {isPreloved ? (
                      <span className="rounded bg-[#F8E6D7] px-2 py-1 text-[11px] font-medium text-[#A66A36]">
                        Preloved Sale
                      </span>
                    ) : isDamage ? (
                      <span className="rounded bg-[#EDE9FE] px-2 py-1 text-[11px] font-medium text-[#5B21B6]">
                        Damage Comp.
                      </span>
                    ) : (
                      <span className="rounded bg-[#DDF3EF] px-2 py-1 text-[11px] font-medium text-[#4D8D84]">
                        Rental
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#403A35]">
                    {rentalNumberMap[row.id] || "Rental #1"}
                  </td>

                  <td className="px-4 py-4 font-medium text-[#403A35]">
                    ₹{txVal.toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 py-4 font-medium text-[#403A35]">
                    {pctNum}%
                  </td>

                  <td
                    className={`px-4 py-4 font-semibold ${isPaid ? "text-[#6E9A60]" : "text-[#D06C4F]"}`}
                  >
                    ₹{(Number(row.listerShare) || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 py-4">
                    {isPaid ? (
                      <span className="rounded bg-[#E6F5E7] px-2 py-1 text-[11px] font-semibold text-[#5A8A4E]">
                        Paid
                      </span>
                    ) : (
                      <span className="rounded bg-[#FFF4D9] px-2 py-1 text-[11px] font-semibold text-[#B1841F]">
                        Pending Approval
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#403A35]">
                    {isPaid ? formatDateShort(row.paidAt || row.dueDate) : "—"}
                  </td>
                </tr>
              );
            })}

            {listerPayouts.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-5 py-6 text-center text-sm text-stone-500"
                >
                  No payouts found for this lister.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
