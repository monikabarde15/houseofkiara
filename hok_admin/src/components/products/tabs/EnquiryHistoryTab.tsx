import React, { useEffect, useMemo, useState } from "react";
import { Product } from "../../types/product";
import * as enquiryApi from "../../../services/enquiryApi";
import type { Enquiry } from "../../../services/enquiryApi";

interface EnquiryHistoryTabProps {
  product?: Product | null;
  enquiries?: Enquiry[];
  orders?: any[];
  isAdding?: boolean;
  onLogEnquiryForPiece?: (product: Product) => void;
  onOpenEnquiry?: (enquiryId: string) => void;
}

const parseYMD = (val?: string): Date | null => {
  if (!val) return null;
  const m = String(val)
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const addDays = (d: Date, days: number): Date => {
  const c = new Date(d);
  c.setDate(c.getDate() + days);
  return c;
};

const fmtDate = (val?: string): string => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const fmtDateRange = (start?: string, end?: string, eventDate?: string): string => {
  const s = parseYMD(start);
  const e = parseYMD(end);
  if (s && e) {
    const sameMonth =
      s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
    const sameYear = s.getFullYear() === e.getFullYear();
    if (s.getTime() === e.getTime()) {
      return s.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    if (sameMonth) {
      return `${s.getDate()} to ${e.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;
    }
    if (sameYear) {
      return `${s.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })} to ${e.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;
    }
    return `${fmtDate(start)} to ${fmtDate(end)}`;
  }
  if (s) return fmtDate(start);
  if (eventDate) return `Event ${fmtDate(eventDate)}`;
  return "No dates yet";
};

const statusBadgeStyle = (status: string): string => {
  switch (status) {
    case "Converted":
      return "bg-[#E6F4EA] text-[#2E7D47] border-[#C9E7D1]";
    case "In Conversation":
      return "bg-[#EAF0FB] text-[#35599B] border-[#D0DDF5]";
    case "New":
      return "bg-[#FBF3DF] text-[#9A6B16] border-[#EFE0B9]";
    case "On Hold":
      return "bg-[#F3EFE8] text-[#6E655B] border-[#E2DAD0]";
    case "Closed":
      return "bg-[#FBEAE5] text-[#B44A32] border-[#F0CFC6]";
    default:
      return "bg-[#F3EFE8] text-[#6E655B] border-[#E2DAD0]";
  }
};

export function EnquiryHistoryTab({
  product,
  enquiries = [],
  orders = [],
  isAdding = false,
  onLogEnquiryForPiece,
  onOpenEnquiry,
}: EnquiryHistoryTabProps) {
  const [freshEnquiries, setFreshEnquiries] = useState<Enquiry[]>(enquiries);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (enquiries && enquiries.length > 0) {
      setFreshEnquiries(enquiries);
    }
  }, [enquiries]);

  useEffect(() => {
    if (isAdding) return;
    let active = true;
    setLoading(freshEnquiries.length === 0);
    enquiryApi
      .getEnquiries()
      .then((list) => {
        if (active && Array.isArray(list)) {
          setFreshEnquiries(list);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [product?.productId, product?.id, (product as any)?._id, isAdding]);

  const productEnquiries = useMemo(() => {
    if (!product || isAdding) return [];
    const prodIds = [
      product.productId,
      product.id,
      (product as any)._id,
      product.sku,
    ]
      .filter(Boolean)
      .map((x) => String(x).trim().toLowerCase());
    const prodName = String(product.name || "").trim().toLowerCase();

    return freshEnquiries.filter((enq) => {
      if (!Array.isArray(enq.pieces) || enq.pieces.length === 0) return false;
      return enq.pieces.some((piece) => {
        const pid = String(piece.productId || "").trim().toLowerCase();
        const pname = String(piece.productName || "").trim().toLowerCase();
        if (pid && prodIds.includes(pid)) return true;
        if (prodName && pname && pname === prodName) return true;
        return false;
      });
    });
  }, [freshEnquiries, product, isAdding]);

  const evaluateDatesBadge = (enq: Enquiry): {
    label: string;
    cls: string;
  } | null => {
    if (!product) return null;
    const isConverted = Boolean(
      enq.status === "Converted" || enq.linkedOrderId || enq.linkedOfferId,
    );

    if (enq.linkedOrderId) {
      return {
        label: `BOOKED BY HER · ${enq.linkedOrderId}`,
        cls: "bg-[#E6F4EA] text-[#2E7D47]",
      };
    }

    if (
      enq.interestedIn === "Buy preloved" ||
      enq.interestedIn === "Buy new"
    ) {
      if (String(product.status || "").toLowerCase() === "sold") {
        return {
          label: "SOLD OUT",
          cls: "bg-[#FBEAE5] text-[#B44A32]",
        };
      }
      return {
        label: isConverted ? "CONVERTED" : "IN STOCK · AVAILABLE",
        cls: "bg-[#E6F4EA] text-[#2E7D47]",
      };
    }

    const hStart = parseYMD(enq.holdStartDate || enq.eventDate);
    const hEnd = parseYMD(
      enq.holdEndDate || enq.holdStartDate || enq.eventDate,
    );
    if (!hStart || !hEnd) return null;

    const cleanBuf = Math.max(0, Number(product.cleaningBufferDays ?? 3));
    const prodIds = [
      product.productId,
      product.id,
      (product as any)._id,
      product.sku,
    ]
      .filter(Boolean)
      .map((x) => String(x).trim().toLowerCase());
    const prodName = String(product.name || "").trim().toLowerCase();

    for (const o of orders || []) {
      const st = String(o?.status || "").toLowerCase();
      if (st === "cancelled" || st === "rejected") continue;
      const items = Array.isArray(o?.items) && o.items.length > 0 ? o.items : [o];
      for (const it of items) {
        const itId = String(it?.productId || o?.productId || "")
          .trim()
          .toLowerCase();
        const itName = String(it?.productName || o?.productName || "")
          .trim()
          .toLowerCase();
        const sameProd =
          (itId && prodIds.includes(itId)) ||
          (prodName && itName && itName === prodName);
        if (!sameProd) continue;

        const rStart = parseYMD(it?.rentalStartDate || o?.rentalStartDate);
        const rEnd = parseYMD(it?.rentalEndDate || o?.rentalEndDate);
        if (!rStart || !rEnd) continue;

        const sameCust =
          (enq.customerId &&
            o?.customerId &&
            String(enq.customerId) === String(o.customerId)) ||
          (enq.customerPhone &&
            o?.customerPhone &&
            String(enq.customerPhone).replace(/\D/g, "").slice(-10) ===
              String(o.customerPhone).replace(/\D/g, "").slice(-10)) ||
          (enq.customerName &&
            o?.customerName &&
            String(enq.customerName).trim().toLowerCase() ===
              String(o.customerName).trim().toLowerCase());

        if (hStart <= rEnd && hEnd >= rStart) {
          const ordCode = o?.id || o?.orderId || "";
          if (sameCust) {
            return {
              label: ordCode
                ? `BOOKED BY HER · ${ordCode}`
                : "BOOKED BY THIS CUSTOMER",
              cls: "bg-[#E6F4EA] text-[#2E7D47]",
            };
          }
          return {
            label: "ALREADY BOOKED",
            cls: "bg-[#FBEAE5] text-[#B44A32]",
          };
        }

        const cleanEnd = addDays(rEnd, cleanBuf);
        if (!sameCust && hStart > rEnd && hStart <= cleanEnd) {
          const freeFrom = addDays(cleanEnd, 1);
          return {
            label: `IN DRY CLEANING (FREE ${freeFrom.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            }).toUpperCase()})`,
            cls: "bg-[#FBF3DF] text-[#9A6B16]",
          };
        }
      }
    }

    return {
      label: "FREE ON HER DATES",
      cls: "bg-[#E6F4EA] text-[#2E7D47]",
    };
  };

  if (isAdding) {
    return (
      <div className="rounded-lg border border-[#E8E0D6] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#EFE8DE] px-5 py-3.5">
          <h3 className="text-[14px] font-semibold text-[#2B2118]">
            Enquiry History
          </h3>
        </div>
        <div className="px-5 py-10 text-center text-[12.5px] text-[#8F8679]">
          Save this piece first to log or view customer enquiries about it.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#E8E0D6] bg-white shadow-sm overflow-hidden font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFE8DE] px-5 py-3.5">
        <h3 className="text-[14px] font-semibold text-[#2B2118]">
          Enquiry History
        </h3>
        {product && (
          <button
            type="button"
            onClick={() => onLogEnquiryForPiece?.(product)}
            className="inline-flex items-center gap-1 rounded-[4px] border border-[#DED6C8] bg-white hover:bg-[#FAF7F2] px-3 py-1.5 text-[11.5px] font-medium text-[#2B2118] transition cursor-pointer shadow-2xs"
          >
            + Log an Enquiry About This Piece
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#FAF8F4] border-b border-[#ECE5DA] text-[10px] font-bold uppercase tracking-[0.08em] text-[#968D80]">
              <th className="px-4 py-2.5">Date</th>
              <th className="px-4 py-2.5">Enquiry</th>
              <th className="px-4 py-2.5">Customer</th>
              <th className="px-4 py-2.5">Interested In</th>
              <th className="px-4 py-2.5">Dates</th>
              <th className="px-4 py-2.5">Channel</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Last Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1ECE3] text-[#2B2118]">
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-[12px] text-[#8F8679]"
                >
                  Loading enquiry history...
                </td>
              </tr>
            ) : productEnquiries.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-[12.5px] text-[#8F8679]"
                >
                  No enquiries logged for{" "}
                  <strong className="font-semibold text-[#2B2118]">
                    {product?.name || "this piece"}
                  </strong>{" "}
                  yet. Click{" "}
                  <button
                    type="button"
                    onClick={() => product && onLogEnquiryForPiece?.(product)}
                    className="font-semibold text-[#B57A24] underline underline-offset-2 hover:text-[#8F5E16] cursor-pointer"
                  >
                    + Log an Enquiry About This Piece
                  </button>{" "}
                  to record one.
                </td>
              </tr>
            ) : (
              productEnquiries.map((enq) => {
                const effectiveStatus =
                  enq.status === "Converted" ||
                  enq.linkedOrderId ||
                  enq.linkedOfferId
                    ? "Converted"
                    : enq.status;
                const datesBadge = evaluateDatesBadge(enq);
                const lastLog =
                  Array.isArray(enq.conversationLog) &&
                  enq.conversationLog.length > 0
                    ? enq.conversationLog[enq.conversationLog.length - 1]
                        ?.message
                    : "";
                const lastNote = lastLog || enq.whatSheAsked || "—";

                return (
                  <tr
                    key={enq.id}
                    onClick={() => onOpenEnquiry?.(enq.enquiryId || enq.id)}
                    title={`Open ${enq.enquiryId} in Enquiries`}
                    className="hover:bg-[#FCF9F4] transition-colors cursor-pointer align-top"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap text-[#5C5347]">
                      {fmtDate(enq.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-[#2B2118]">
                      {enq.enquiryId}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#B8893A]">
                      {enq.customerName}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-[#2B2118]">
                      {enq.interestedIn}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="whitespace-nowrap text-[#2B2118]">
                        {enq.interestedIn === "Buy preloved" ||
                        enq.interestedIn === "Buy new"
                          ? "Not needed"
                          : fmtDateRange(
                              enq.holdStartDate,
                              enq.holdEndDate,
                              enq.eventDate,
                            )}
                      </div>
                      {datesBadge && (
                        <span
                          className={`mt-1 inline-block rounded-[3px] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide ${datesBadge.cls}`}
                        >
                          {datesBadge.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-[#2B2118]">
                      {enq.channel}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-[4px] border px-2 py-0.5 text-[11px] font-semibold ${statusBadgeStyle(
                          effectiveStatus,
                        )}`}
                      >
                        {effectiveStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 max-w-[260px] text-[11.5px] leading-[1.45] text-[#6D655A]">
                      {lastNote}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-[#F0EAE0] bg-[#FCFAF6] px-5 py-2.5 text-right text-[11px] text-[#968D80]">
        Questions about this piece, logged by the team in Enquiries. Click a row
        to open it.
      </div>
    </div>
  );
}
