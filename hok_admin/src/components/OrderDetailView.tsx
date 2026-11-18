import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  Clock,
  MapPin,
  Calendar,
  Printer,
  Send,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  User,
  Plus,
} from "lucide-react";
import { Order } from "../types";
import * as orderApi from "../services/orderApi";
import { uploadFile } from "../services/uploadApi";
import { sendMockMessage } from "../services/messageApi";
import toast from "react-hot-toast";

interface OrderDetailViewProps {
  orderId?: string;
  order?: Order;
  onBack: () => void;
  onUpdateOrder: (updatedOrder: Order) => void;
  onNavigateDispatch?: () => void;
}

const parseOrderAmount = (val: any) => {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
  return isNaN(num) ? 0 : num;
};

const resolveOrderAmount = (o: any) => {
  if (!o) return 0;
  return (
    parseOrderAmount(o.amount) ||
    parseOrderAmount(o.grandTotal) ||
    parseOrderAmount(o.orderValue) ||
    parseOrderAmount(o.totalAmount) ||
    (Array.isArray(o.items) && o.items.length > 0
      ? o.items.reduce((s: number, it: any) => s + parseOrderAmount(it?.amount), 0)
      : 0)
  );
};

export default function OrderDetailView({
  orderId,
  order: initialOrder,
  onBack,
  onUpdateOrder,
  onNavigateDispatch,
}: OrderDetailViewProps) {
  const [order, setOrder] = useState<Order | null>(initialOrder || null);
  const [loading, setLoading] = useState(!initialOrder && !!orderId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId && !initialOrder) {
      setLoading(true);
      orderApi
        .getOrder(orderId)
        .then((data) => {
          const firstIt: any = data.items?.[0] || {};
          setOrder(data);
          setStatus(data.status);
          setInternalNotes(data.internalNotes || "");
          setDispatchedBy(
            data.dispatchDetails?.dispatchedBy ||
              firstIt.dispatch?.dispatchedBy ||
              "",
          );
          setDispatchDate(
            data.dispatchDetails?.date ||
              firstIt.dispatch?.date ||
              (data as any).dispatchDate ||
              firstIt.dispatchDate ||
              "",
          );
          setTrackingNumber(
            data.dispatchDetails?.trackingNumber ||
              firstIt.dispatch?.trackingNumber ||
              "",
          );
          setCourierPartner(
            data.dispatchDetails?.courierPartner ||
              firstIt.dispatch?.courierPartner ||
              "",
          );
          setReturnDate(
            data.returnLogistics?.returnDate || firstIt.returnDueDate || "",
          );
          setReturnMethod(data.returnLogistics?.returnMethod || "");
          setReturnCourier(data.returnLogistics?.courierPartner || "");
          setReceivedBy(data.conditionAssessment?.receivedBy || "Soumya");
          setReceivedDate(data.conditionAssessment?.receivedDate || "");
          setConditionGrade(data.conditionAssessment?.grade || "A");
          setConditionNotes(data.conditionAssessment?.notes || "");
          const resolvedDecStatus =
            data.depositDecision?.status && data.depositDecision.status !== "Pending"
              ? data.depositDecision.status
              : data.status === "Processed" || data.status === "Complete"
                ? "Released"
                : "Pending";
          setDepositStatus(resolvedDecStatus);
          setReleasedAmount(
            data.depositDecision?.releasedAmount ||
              (resolvedDecStatus === "Released" ? Number(data.deposit || 0) : 0),
          );
          setDeductedAmount(data.depositDecision?.deductedAmount || 0);
          setDepositReason(data.depositDecision?.reason || "");
          setLogs(data.logs || []);
        })
        .catch((err) => setError(err.message || "Failed to fetch order"))
        .finally(() => setLoading(false));
    }
  }, [orderId, initialOrder]);
  const [activeTab, setActiveTab] = useState<
    "Summary" | "Items" | "Dispatch" | "Return" | "Deposit" | "Log"
  >("Summary");

  // local editable state
  const [status, setStatus] = useState(order?.status || "Confirmed");
  const [internalNotes, setInternalNotes] = useState(
    order?.internalNotes || "",
  );

  // Dispatch fields
  const [dispatchedBy, setDispatchedBy] = useState(
    order?.dispatchDetails?.dispatchedBy || "",
  );
  const [dispatchDate, setDispatchDate] = useState(
    order?.dispatchDetails?.date || "",
  );
  const [trackingNumber, setTrackingNumber] = useState(
    order?.dispatchDetails?.trackingNumber || "",
  );
  const [courierPartner, setCourierPartner] = useState(
    order?.dispatchDetails?.courierPartner || "",
  );

  // Return Logistics fields
  const [returnDate, setReturnDate] = useState(
    order?.returnLogistics?.returnDate || "",
  );
  const [returnMethod, setReturnMethod] = useState(
    order?.returnLogistics?.returnMethod || "",
  );
  const [returnCourier, setReturnCourier] = useState(
    order?.returnLogistics?.courierPartner || "",
  );

  // Return Assessment
  const [receivedBy, setReceivedBy] = useState(
    order?.conditionAssessment?.receivedBy || "Soumya",
  );
  const [receivedDate, setReceivedDate] = useState(
    order?.conditionAssessment?.receivedDate || "",
  );
  const [conditionGrade, setConditionGrade] = useState<"A" | "B" | "C" | "D">(
    order?.conditionAssessment?.grade || "A",
  );
  const [conditionNotes, setConditionNotes] = useState(
    order?.conditionAssessment?.notes || "",
  );

  // Deposit Decision
  const [depositStatus, setDepositStatus] = useState(
    order?.depositDecision?.status || "Pending",
  );
  const [releasedAmount, setReleasedAmount] = useState(
    order?.depositDecision?.releasedAmount || 0,
  );
  const [deductedAmount, setDeductedAmount] = useState(
    order?.depositDecision?.deductedAmount || 0,
  );
  const [depositReason, setDepositReason] = useState(
    order?.depositDecision?.reason || "",
  );

  // New logs list
  const [logs, setLogs] = useState(order?.logs || []);
  const [newLogText, setNewLogText] = useState("");
  const [dispatchEvidence, setDispatchEvidence] = useState<string[]>([]);
  const [returnEvidence, setReturnEvidence] = useState<string[]>([]);
  const [evidenceUploading, setEvidenceUploading] = useState(false);
  const [evidenceItemIndex, setEvidenceItemIndex] = useState(0);

  useEffect(() => {
    if (!order) return;
    const item = order.items?.[evidenceItemIndex] as any;
    setDispatchEvidence(item?.preDispatch?.photos || []);
    setReturnEvidence(item?.returnCondition?.photos || []);
  }, [order, evidenceItemIndex]);

  const uploadEvidence = async (
    files: FileList | null,
    stage: "dispatch" | "return",
  ) => {
    if (!files?.length || !order) return;
    setEvidenceUploading(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((file) => uploadFile(file, "orders")),
      );
      const urls = uploaded.map((file) => file.url);
      const current = stage === "dispatch" ? dispatchEvidence : returnEvidence;
      const next = [...current, ...urls];
      if (stage === "dispatch") setDispatchEvidence(next);
      else setReturnEvidence(next);
      await orderApi.saveEvidence(order.id, evidenceItemIndex, stage, next);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Evidence upload failed",
      );
    } finally {
      setEvidenceUploading(false);
    }
  };

  const handleSaveChanges = async (
    overrideStatus?: string,
    overrideDepositStatus?: "Pending" | "Released" | "Partial" | "Forfeited",
  ) => {
    if (!order) return;
    const effectiveDepStatus =
      overrideDepositStatus ||
      (overrideStatus === "Processed" || overrideStatus === "Complete" || status === "Processed" || status === "Complete"
        ? depositStatus === "Pending"
          ? "Released"
          : depositStatus
        : depositStatus);

    const finalStatus =
      overrideStatus ||
      (effectiveDepStatus !== "Pending" && status === "Returned"
        ? "Complete"
        : status);
    if (overrideStatus || finalStatus !== status) setStatus(finalStatus as any);
    if (effectiveDepStatus !== depositStatus) setDepositStatus(effectiveDepStatus);

    const effectiveReleasedAmt =
      effectiveDepStatus === "Released" && Number(releasedAmount) === 0 && Number(deductedAmount) === 0
        ? Number(order.deposit || 0)
        : Number(releasedAmount);
    if (effectiveReleasedAmt !== Number(releasedAmount)) {
      setReleasedAmount(effectiveReleasedAmt);
    }

    const rawCourier = courierPartner.trim() || (finalStatus === "Dispatched" || finalStatus === "Shipped" ? "Delhivery" : "");
    let cleanTrack = trackingNumber
      .trim()
      .toUpperCase()
      .replace(/[\s\-_]+/g, "");
    if (
      !cleanTrack &&
      (finalStatus === "Dispatched" || finalStatus === "Shipped")
    ) {
      cleanTrack = rawCourier.toLowerCase().includes("dhl")
        ? `DHL${Math.floor(10000 + Math.random() * 90000)}`
        : `DEL${Math.floor(10000000 + Math.random() * 90000000)}IN`;
      setTrackingNumber(cleanTrack);
    } else if (cleanTrack !== trackingNumber) {
      setTrackingNumber(cleanTrack);
    }
    if (rawCourier && rawCourier !== courierPartner) {
      setCourierPartner(rawCourier);
    }

    const nextDispatchDetails = {
      dispatchedBy: dispatchedBy.trim(),
      date: dispatchDate || ((finalStatus === "Dispatched" || finalStatus === "Shipped") ? new Date().toISOString().slice(0, 10) : ""),
      trackingNumber: cleanTrack,
      courierPartner: rawCourier,
    };
    const hasReturnLogistics = Boolean(
      returnDate || returnMethod.trim() || returnCourier.trim(),
    );
    const nextReturnLogistics = hasReturnLogistics
      ? {
          returnDate,
          returnMethod: returnMethod.trim(),
          courierPartner: returnCourier.trim(),
        }
      : undefined;

    const updatedItems = Array.isArray(order.items)
      ? order.items.map((it: any) => ({
          ...it,
          ...(dispatchDate ? { dispatchDate } : {}),
          dispatch: {
            ...(it.dispatch || {}),
            dispatchedBy: nextDispatchDetails.dispatchedBy,
            date: nextDispatchDetails.date || it.dispatch?.date || "",
            trackingNumber: nextDispatchDetails.trackingNumber,
            courierPartner: nextDispatchDetails.courierPartner,
            status:
              finalStatus === "Dispatched" || finalStatus === "Shipped"
                ? finalStatus
                : it.dispatch?.status || "Scheduled",
          },
          ...(returnDate ? { returnDueDate: returnDate } : {}),
        }))
      : order.items;

    const syncedTopDepositStatus =
      effectiveDepStatus === "Released"
        ? finalStatus === "Cancelled"
          ? "Refunded"
          : finalStatus === "Processed"
            ? "Refunded"
            : "Released"
        : effectiveDepStatus === "Partial"
          ? "Partially Released"
          : effectiveDepStatus === "Forfeited"
            ? "Forfeited"
            : order.depositStatus;

    const cleanOrder: any = { ...order };
    delete cleanOrder._data;

    const updatedOrder: Order = {
      ...cleanOrder,
      status: finalStatus as any,
      depositStatus: syncedTopDepositStatus as any,
      internalNotes,
      ...(dispatchDate ? { dispatchDate } : {}),
      dispatchDetails: nextDispatchDetails,
      returnLogistics: nextReturnLogistics,
      items: updatedItems,
      conditionAssessment: receivedDate
        ? {
            receivedDate,
            receivedBy,
            grade: conditionGrade,
            notes: conditionNotes,
          }
        : undefined,
      depositDecision: {
        status: (effectiveDepStatus === "Released" &&
        (finalStatus === "Cancelled" || finalStatus === "Processed")
          ? "Refunded"
          : effectiveDepStatus) as any,
        releasedAmount: effectiveReleasedAmt,
        deductedAmount: Number(deductedAmount),
        reason:
          depositReason ||
          (effectiveDepStatus === "Released" ? "Full deposit refund processed" : ""),
      },
      logs,
    };
    try {
      const saved = await orderApi.updateOrder(order.id, updatedOrder);
      setOrder(saved);
      onUpdateOrder({ ...(saved as any), __alreadySaved: true });
      toast.success(
        overrideStatus
          ? `Order advanced to ${overrideStatus}`
          : "Order & dispatch logistics saved!",
      );
    } catch (e) {
      toast.error("Failed to update order");
    }
  };

  const handleAddLog = async () => {
    if (!newLogText.trim() || !order) return;
    try {
      const res = await orderApi.addOrderLog(order.id, newLogText);
      setLogs(res.data?.logs || []);
      setNewLogText("");
      toast.success("Log added");
    } catch (e) {
      toast.error("Failed to add log");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-stone-500 font-sans">
        Fetching real-time order data...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center text-rose-500 font-sans">
        {error || "Order not found"}
      </div>
    );
  }

  const {
    customerName,
    customerPhone,
    customerEmail,
    mode,
    products,
    productName,
  } = order;

  const downloadInvoice = async () => {
    try {
      const invoice = await orderApi.getInvoice(order.id);
      const money = (value: number) =>
        `₹${Number(value || 0).toLocaleString("en-IN")}`;
      const rows = (invoice.items || [])
        .map(
          (item: any) =>
            `<tr><td>${item.productName}</td><td>${item.mode}</td><td>${money(item.amount)}</td><td>${money(item.gst)}</td><td>${money(item.deposit)}</td></tr>`,
        )
        .join("");
      const win = window.open("", "_blank", "width=900,height=700");
      if (!win) throw new Error("Please allow pop-ups to print the invoice");
      win.document.write(
        `<html><head><title>${invoice.invoiceNo}</title><style>body{font-family:Arial;color:#29231d;padding:40px}h1{color:#8b6b32}table{width:100%;border-collapse:collapse;margin-top:28px}th,td{border:1px solid #ddd;padding:10px;text-align:left}th{background:#f5f0e8}.totals{margin-left:auto;width:280px;margin-top:24px;line-height:1.8;text-align:right}@media print{button{display:none}}</style></head><body><h1>HOUSE OF KAIRA</h1><p>GST Invoice</p><p><b>Invoice No:</b> ${invoice.invoiceNo}<br><b>Date:</b> ${new Date(invoice.invoiceDate).toLocaleDateString("en-IN")}<br><b>Order:</b> ${invoice.orderId}</p><p><b>Customer:</b> ${invoice.customer?.name || ""}<br>${invoice.customer?.email || ""}<br>${invoice.customer?.phone || ""}<br>${invoice.customer?.address || ""}</p><table><thead><tr><th>Product</th><th>Mode</th><th>Amount</th><th>GST</th><th>Deposit</th></tr></thead><tbody>${rows}</tbody></table><div class="totals"><b>Order value: ${money(invoice.orderValue)}</b><br>GST: ${money(invoice.gst)}<br>Deposit: ${money(invoice.deposit)}<br><b>Grand total: ${money(invoice.grandTotal)}</b></div><button onclick="window.print()">Print / Save as PDF</button></body></html>`,
      );
      win.document.close();
      win.focus();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to generate invoice",
      );
    }
  };

  const printDispatchLabel = () => {
    const win = window.open("", "_blank", "width=600,height=500");
    if (!win)
      return toast.error("Please allow pop-ups to print the dispatch label");
    win.document.write(
      `<html><head><title>Dispatch Label ${order.id}</title><style>body{font-family:Arial;padding:28px;border:2px solid #222;margin:20px}h2{margin-top:0}.line{border-bottom:1px solid #aaa;padding:10px 0}</style></head><body><h2>HOUSE OF KAIRA — DISPATCH LABEL</h2><div class="line"><b>Order:</b> ${order.id}</div><div class="line"><b>Customer:</b> ${order.customerName}</div><div class="line"><b>Phone:</b> ${order.customerPhone || ""}</div><div class="line"><b>Address:</b> ${order.address || "—"}</div><div class="line"><b>Courier:</b> ${courierPartner || "—"} &nbsp; <b>Tracking:</b> ${trackingNumber || "—"}</div><div class="line"><b>Dispatch date:</b> ${dispatchDate || new Date().toISOString().slice(0, 10)}</div><button onclick="window.print()">Print Label</button></body></html>`,
    );
    win.document.close();
    win.focus();
  };

  const sendTrackingInfo = async () => {
    const tracking = trackingNumber.trim();
    if (!tracking)
      return toast.error(
        "Please save a tracking number before sending tracking information.",
      );
    const phone = (order.customerPhone || "").replace(/[^0-9]/g, "");
    if (!phone) return toast.error("Customer phone number is missing.");
    const message = `Hello ${order.customerName}, your House of Kaira order #${order.id} has been dispatched via ${courierPartner || "our courier partner"}. Tracking number: ${tracking}.`;
    await sendMockMessage({ channel: "whatsapp", to: phone, body: message });
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    const logMessage = `Tracking information shared with customer via WhatsApp: ${tracking}`;
    const log = {
      date: new Date().toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      message: logMessage,
      user: "Admin",
    };
    setLogs((current) => [log, ...current]);
    try {
      await orderApi.addOrderLog(
        order.id,
        logMessage,
        "Customer Communication",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Tracking message opened, but log could not be saved",
      );
    }
  };

  const steps = [
    "Confirmed",
    "Dispatched",
    "Shipped",
    "Delivered",
    "Return Sent",
    "Returned",
    "Complete",
    "Cancelled",
  ];
  const currentStepIndex = steps.indexOf(
    status === "Processed" ? "Complete" : status,
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1 text-stone-500 hover:text-stone-900 rounded cursor-pointer hover:bg-stone-100 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 text-xs font-sans text-stone-500">
            <span className="hover:underline cursor-pointer" onClick={onBack}>
              Orders
            </span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-stone-800">{order.id}</span>
          </div>
        </div>

        {/* Save actions */}
        <div className="flex items-center gap-2">
          {order.status === "Confirmed" && (
            <button
              onClick={() => handleSaveChanges("Dispatched")}
              className="px-4 py-2 bg-[#d2ae63] hover:bg-[#c49d4f] text-[#3d2d14] rounded text-xs font-semibold transition flex items-center gap-1 shadow-sm"
            >
              Mark Dispatched
            </button>
          )}
          {order.status === "Dispatched" && (
            <button
              onClick={() => handleSaveChanges("Shipped")}
              className="px-4 py-2 bg-[#d2ae63] hover:bg-[#c49d4f] text-[#3d2d14] rounded text-xs font-semibold transition flex items-center gap-1 shadow-sm"
            >
              Mark Shipped
            </button>
          )}
          {order.status === "Shipped" && (
            <button
              onClick={() => handleSaveChanges("Delivered")}
              className="px-4 py-2 bg-[#d2ae63] hover:bg-[#c49d4f] text-[#3d2d14] rounded text-xs font-semibold transition flex items-center gap-1 shadow-sm"
            >
              Mark Delivered
            </button>
          )}
          {order.status === "Delivered" && (
            <button
              onClick={() => handleSaveChanges("Return Sent")}
              className="px-4 py-2 bg-[#d2ae63] hover:bg-[#c49d4f] text-[#3d2d14] rounded text-xs font-semibold transition flex items-center gap-1 shadow-sm"
            >
              Mark Return Sent
            </button>
          )}
          {order.status === "Return Sent" && (
            <button
              onClick={() => handleSaveChanges("Returned")}
              className="px-4 py-2 bg-[#d2ae63] hover:bg-[#c49d4f] text-[#3d2d14] rounded text-xs font-semibold transition flex items-center gap-1 shadow-sm"
            >
              Log Received Return
            </button>
          )}

          <div className="h-6 w-px bg-stone-200 mx-2"></div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs font-semibold text-stone-800 focus:border-[#c5a880] outline-none"
          >
            {steps.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="Processed">Processed</option>
          </select>
          <button
            onClick={() => handleSaveChanges()}
            className="btn-save px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white text-xs font-semibold rounded cursor-pointer transition"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Title block */}
      <div className="flex justify-between items-end border-b border-stone-100 pb-5">
        <div>
          <h2 className="text-2xl font-serif text-stone-950 font-bold">
            {order.productName || "Rental Order Details"}
          </h2>
          <p className="text-xs text-stone-500 mt-1.5 font-sans">
            <span className="font-semibold text-stone-800">
              {order.customerName}
            </span>
            {order.customerEmail ? ` — ${order.customerEmail}` : ""} — ID:{" "}
            <span className="font-mono">{order.id}</span>
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="px-4 py-2 bg-stone-50 border border-stone-100 rounded">
            <span className="text-[9px] uppercase tracking-wider text-stone-400 font-sans font-bold">
              Value
            </span>
            <p className="text-sm font-serif font-bold text-stone-900 mt-0.5">
              ₹{resolveOrderAmount(order).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="px-4 py-2 bg-stone-50 border border-stone-100 rounded">
            <span className="text-[9px] uppercase tracking-wider text-stone-400 font-sans font-bold">
              Discount
            </span>
            <p className="text-sm font-serif font-bold text-stone-900 mt-0.5">
              ₹{Number(order.discount || 0).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="px-4 py-2 bg-stone-50 border border-stone-100 rounded">
            <span className="text-[9px] uppercase tracking-wider text-stone-400 font-sans font-bold">
              Deposit Held
            </span>
            <p className="text-sm font-serif font-bold text-amber-700 mt-0.5">
              ₹
              {Number(
                order.deposit || (order as any).securityDeposit || 0,
              ).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="px-4 py-2 bg-stone-50 border border-stone-100 rounded">
            <span className="text-[9px] uppercase tracking-wider text-stone-400 font-sans font-bold">
              Grand Total
            </span>
            <p className="text-sm font-serif font-bold text-stone-900 mt-0.5">
              ₹{Number(order.grandTotal || resolveOrderAmount(order)).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Timeline Tracker */}
      <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm overflow-x-auto pb-4">
        <div className="flex justify-between items-center relative min-w-[550px] lg:min-w-0 max-w-4xl mx-auto">
          {/* Progress bar line */}
          <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-stone-100 -z-0" />
          <div
            className="absolute left-0 top-3.5 h-0.5 bg-[#c5a880] transition-all duration-350"
            style={{
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            }}
          />

          {steps.map((stepName, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={stepName}
                className="flex flex-col items-center relative z-10 select-none"
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition ${
                    isCurrent
                      ? "bg-white border-[#c5a880] text-[#c5a880] font-bold shadow-sm"
                      : isCompleted
                        ? "bg-[#c5a880] border-[#c5a880] text-white"
                        : "bg-white border-stone-200 text-stone-300"
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-xs">{idx + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold mt-2 ${isCurrent ? "text-[#c5a880] font-bold" : isCompleted ? "text-stone-700" : "text-stone-400"}`}
                >
                  {stepName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-stone-200 gap-1 select-none overflow-x-auto whitespace-nowrap scrollbar-none pb-px">
        {(
          ["Summary", "Items", "Dispatch", "Return", "Deposit", "Log"] as const
        ).map((tab) => {
          const labels = {
            Summary: "Summary",
            Items: "Items & Pricing",
            Dispatch: "Dispatch",
            Return: "Return & Condition",
            Deposit: "Deposit Decision",
            Log: "Log & Notes",
          };
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                isActive
                  ? "border-[#c5a880] text-stone-900 font-bold"
                  : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-200"
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Tab Content + Actions Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tab content - Left Col 2 spans */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "Summary" && (
            <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm space-y-6 text-xs font-sans">
              {/* Customer contact card */}
              <div>
                <h4 className="font-serif font-bold text-[#1e1412] text-sm border-b border-stone-100 pb-2 tracking-wide">
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-stone-600">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-stone-400" />
                      <span>{order.customerName}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-stone-400" />
                      <a
                        href={`mailto:${order.customerEmail}`}
                        className="hover:underline"
                      >
                        {order.customerEmail}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-stone-400" />
                      <span>{order.customerPhone}</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-700">
                      Shipping / Delivery Address:
                    </p>
                    <p className="text-stone-500 mt-1 leading-relaxed">
                      {order.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking timelines */}
              {(() => {
                const firstIt: any = (order as any).items?.[0] || {};
                const rStart = order.rentalStartDate || firstIt.rentalStartDate || "";
                const rEnd = order.rentalEndDate || firstIt.rentalEndDate || "";
                const tsMatch = String(order.id || "").match(/HOK-ORD-(\d{13})/);
                const bookedRaw =
                  (order as any).orderDate ||
                  (order as any).createdAt ||
                  (order as any).invoiceDate ||
                  (tsMatch ? new Date(Number(tsMatch[1])).toISOString() : "");
                const fmtDate = (val: string) => {
                  if (!val) return "N/A";
                  const d = new Date(val);
                  if (isNaN(d.getTime())) return val;
                  return d.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                };
                const isRentalOrder =
                  order.mode === "Rental" || Boolean(rStart) || Boolean(rEnd);
                let nightsLabel = isRentalOrder ? "4 Nights" : firstIt.mode || order.mode || "Buy";
                if (rStart && rEnd) {
                  const s = new Date(rStart);
                  const e = new Date(rEnd);
                  if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
                    const diff = Math.max(
                      1,
                      Math.round((e.getTime() - s.getTime()) / 86400000),
                    );
                    nightsLabel = `${diff} Night${diff === 1 ? "" : "s"}`;
                  }
                }
                const savedDispDate =
                  order.dispatchDetails?.date ||
                  firstIt.dispatch?.date ||
                  (order as any).dispatchDate ||
                  firstIt.dispatchDate ||
                  dispatchDate ||
                  "";

                return (
                  <div>
                    <h4 className="font-serif font-bold text-[#1e1412] text-sm border-b border-stone-100 pb-2 tracking-wide">
                      Rental Timelines
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
                      <div className="p-3 bg-stone-50 rounded border border-stone-100">
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                          {isRentalOrder ? "Rental Start" : "Booking Date"}
                        </p>
                        <p className="text-xs font-semibold text-stone-800 mt-1 font-sans">
                          {isRentalOrder ? fmtDate(rStart) : fmtDate(bookedRaw)}
                        </p>
                      </div>
                      <div className="p-3 bg-stone-50 rounded border border-stone-100">
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                          {isRentalOrder ? "Return Date" : "Dispatch Date"}
                        </p>
                        <p className="text-xs font-semibold text-stone-800 mt-1 font-sans">
                          {isRentalOrder
                            ? fmtDate(rEnd)
                            : savedDispDate
                              ? fmtDate(savedDispDate)
                              : "N/A"}
                        </p>
                      </div>
                      <div className="p-3 bg-stone-50 rounded border border-stone-100">
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                          Duration
                        </p>
                        <p className="text-xs font-semibold text-stone-800 mt-1 font-sans">
                          {nightsLabel}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Internal Notes textarea */}
              <div className="space-y-2">
                <label className="font-semibold text-stone-700 block">
                  Internal Admin Notes
                </label>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="E.g. VIP client, requires extra fabric padding, calls requested before dispatch..."
                  rows={4}
                  className="w-full p-3 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880] transition leading-relaxed text-stone-700"
                />
              </div>
            </div>
          )}

          {activeTab === "Items" && (
            <div className="space-y-6">
              {/* Ordered Items List */}
              {(() => {
                const itemsList: any[] =
                  Array.isArray(order.items) && order.items.length > 0
                    ? order.items
                    : [
                        {
                          productId: (order as any).productId || "",
                          productName: order.product || "Ordered Piece",
                          designer: order.designer || "House of Kaira",
                          mode: order.mode || "Rental",
                          size: (order as any).size || "",
                          rentalStartDate: order.rentalStartDate || "",
                          rentalEndDate: order.rentalEndDate || "",
                          amount: resolveOrderAmount(order),
                          deposit: Number(order.deposit || 0),
                        },
                      ];

                return (
                  <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <h4 className="font-serif font-bold text-stone-900 text-sm">
                        Ordered Items ({itemsList.length})
                      </h4>
                      <span className="text-[11px] font-sans text-stone-400">
                        Order {order.id}
                      </span>
                    </div>

                    <div className="divide-y divide-stone-100">
                      {itemsList.map((it: any, idx: number) => {
                        const itemMode = it.mode || order.mode || "Rental";
                        const itemAmt = parseOrderAmount(it.amount ?? order.amount);
                        const itemDep = Number(it.deposit ?? order.deposit ?? 0);
                        const rStart = it.rentalStartDate || order.rentalStartDate || "";
                        const rEnd = it.rentalEndDate || order.rentalEndDate || "";
                        const imgSrc = it.image || it.productImage || it.thumbnail || "";

                        return (
                          <div
                            key={it.productId || `${it.productName}-${idx}`}
                            className="py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {imgSrc ? (
                                <img
                                  src={imgSrc}
                                  alt={it.productName || "Item"}
                                  className="h-12 w-10 rounded object-cover border border-stone-200 shrink-0"
                                />
                              ) : null}
                              <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-stone-900 text-xs">
                                    {it.productName || order.product || "Ordered Piece"}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fcf9f5] border border-[#e6d5bc] text-[#7a5a2b]">
                                    {itemMode}
                                  </span>
                                  {it.size ? (
                                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px] font-medium">
                                      Size: {it.size}
                                    </span>
                                  ) : null}
                                </div>
                                <p className="text-[11px] text-stone-500">
                                  {it.designer || order.designer || "House of Kaira"}
                                  {it.productId ? ` · ${it.productId}` : ""}
                                  {rStart && rEnd ? ` · ${rStart} → ${rEnd}` : ""}
                                </p>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0 text-right">
                              <span className="font-semibold text-stone-900 text-xs">
                                ₹{itemAmt.toLocaleString("en-IN")}
                              </span>
                              {itemDep > 0 ? (
                                <span className="text-[11px] text-stone-500">
                                  Deposit: ₹{itemDep.toLocaleString("en-IN")}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm space-y-6 text-xs">
                <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
                  Pricing & Invoice breakdown
                </h4>
              <div className="space-y-3 font-sans">
                <div className="flex justify-between py-1 border-b border-stone-50 text-stone-600">
                  <span>Rental fee / Retail price</span>
                  <span className="font-semibold">
                    ₹{resolveOrderAmount(order).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-50 text-stone-600">
                  <span>SGST / CGST Tax (Included)</span>
                  <span>
                    ₹
                    {Math.round(
                      resolveOrderAmount(order) * 0.12,
                    ).toLocaleString("en-IN")}{" "}
                    (12%)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-50 text-stone-600">
                  <span>Security Deposit held (Refundable)</span>
                  <span className="font-semibold">
                    ₹{Number(order.deposit || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-50 text-stone-600">
                  <span>Promo Discount</span>
                  <span className="text-rose-600 font-semibold">
                    - ₹{Number(order.discount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-stone-200 text-sm font-bold text-stone-900">
                  <span>Grand Total Paid</span>
                  <span>
                    ₹{Number(order.grandTotal || resolveOrderAmount(order)).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Invoice block */}
              <div className="p-4 bg-stone-50 border border-stone-100 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold text-stone-800">
                    Invoice No:{" "}
                    {order.invoiceNo ||
                      `HOK-INV-${order.id.replace(/\W/g, "")}`}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1 font-mono">
                    Invoice Date:{" "}
                    {order.invoiceDate ||
                      order.rentalStartDate ||
                      new Date().toISOString().slice(0, 10)}
                  </p>
                </div>
                <button
                  onClick={downloadInvoice}
                  className="px-3 py-1.5 bg-white border border-stone-200 hover:border-[#c5a880] text-stone-700 hover:bg-[#fcf9f5] rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>
            </div>
          )}

          {activeTab === "Dispatch" && (
            <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm space-y-6 text-xs font-sans">
              <h4 className="font-serif font-bold text-[#1e1412] text-sm border-b border-stone-100 pb-2">
                Dispatch & Shipping Logistics
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">
                    Dispatched By / Handled By
                  </label>
                  <input
                    type="text"
                    value={dispatchedBy}
                    onChange={(e) => setDispatchedBy(e.target.value)}
                    placeholder="E.g. DHL Express, BlueDart..."
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">
                    Dispatch Date
                  </label>
                  <input
                    type="date"
                    value={dispatchDate}
                    onChange={(e) => setDispatchDate(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="E.g. DHL12345, DEL98765, DEL55231987IN"
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    value={courierPartner}
                    onChange={(e) => setCourierPartner(e.target.value)}
                    placeholder="E.g. DHL Express, BlueDart..."
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
              </div>
              <div className="rounded border border-dashed border-[#c5a880] bg-[#fcf9f5] p-4">
                <label className="block text-xs font-semibold text-stone-600">
                  Pre-dispatch photos/video
                </label>
                {(order.items?.length || 0) > 1 && (
                  <select
                    value={evidenceItemIndex}
                    onChange={(e) =>
                      setEvidenceItemIndex(Number(e.target.value))
                    }
                    className="mt-2 w-full rounded border p-2 text-xs"
                  >
                    {order.items.map((item, index) => (
                      <option key={index} value={index}>
                        Product {index + 1}: {item.productName}
                      </option>
                    ))}
                  </select>
                )}
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  disabled={evidenceUploading}
                  onChange={(e) =>
                    uploadEvidence(e.currentTarget.files, "dispatch")
                  }
                  className="mt-2 text-xs"
                />
                {dispatchEvidence.length > 0 && (
                  <p className="mt-2 text-[10px] text-emerald-700">
                    {dispatchEvidence.length} evidence file(s) uploaded for
                    product {evidenceItemIndex + 1}
                  </p>
                )}
              </div>

              {/* Return Pickup schedule */}
              <div className="border-t border-stone-100 pt-5 space-y-4">
                <h5 className="font-bold text-stone-800 text-xs">
                  Return Pickup logistics
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-stone-500 font-medium">
                      Scheduled Return Pickup Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-500 font-medium">
                      Return Method
                    </label>
                    <input
                      type="text"
                      value={returnMethod}
                      onChange={(e) => setReturnMethod(e.target.value)}
                      placeholder="E.g. Courier Pickup, Dropoff..."
                      className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-500 font-medium">
                      Return Courier Partner
                    </label>
                    <input
                      type="text"
                      value={returnCourier}
                      onChange={(e) => setReturnCourier(e.target.value)}
                      placeholder="E.g. BlueDart, Courier..."
                      className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Return" && (
            <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm space-y-6 text-xs font-sans">
              <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
                Physical Return & Condition Assessment
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">
                    Inspection Conducted By
                  </label>
                  <input
                    type="text"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                    placeholder="E.g. Soumya..."
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">
                    Physical Receipt Date
                  </label>
                  <input
                    type="date"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                  />
                </div>
              </div>

              {/* Condition Grade */}
              <div className="space-y-3">
                <label className="text-stone-600 font-bold block">
                  Assessed Garment Condition Grade
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    {
                      grade: "A",
                      label: "Excellent",
                      desc: "Minimal wear, spotless, dry clean intact",
                    },
                    {
                      grade: "B",
                      label: "Good",
                      desc: "Slight wear, easily repairable lint/creases",
                    },
                    {
                      grade: "C",
                      label: "Damaged",
                      desc: "Minor tears or stains. Requires repair deduction",
                    },
                    {
                      grade: "D",
                      label: "Significant",
                      desc: "Severe fabric ruin, zardozi ripped. Complete loss",
                    },
                  ].map((g) => (
                    <button
                      key={g.grade}
                      type="button"
                      onClick={() => setConditionGrade(g.grade as any)}
                      className={`p-3 border rounded text-left transition cursor-pointer ${
                        conditionGrade === g.grade
                          ? "border-[#c5a880] bg-[#fcf9f5] shadow-sm"
                          : "border-stone-200 hover:border-stone-350 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-xs ${
                            conditionGrade === g.grade
                              ? "bg-[#c5a880] text-white"
                              : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {g.grade}
                        </span>
                        <span className="font-bold text-stone-800">
                          {g.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-1 leading-snug">
                        {g.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-500 font-medium">
                  Condition Assessment Notes
                </label>
                <textarea
                  value={conditionNotes}
                  onChange={(e) => setConditionNotes(e.target.value)}
                  placeholder="Describe stitching quality, hooks, stains, thread pulling etc..."
                  rows={3}
                  className="w-full p-2.5 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880] text-stone-700"
                />
              </div>
              <div className="rounded border border-dashed border-[#c5a880] bg-[#fcf9f5] p-4">
                <label className="block text-xs font-semibold text-stone-600">
                  Return condition photos/video
                </label>
                {(order.items?.length || 0) > 1 && (
                  <select
                    value={evidenceItemIndex}
                    onChange={(e) =>
                      setEvidenceItemIndex(Number(e.target.value))
                    }
                    className="mt-2 w-full rounded border p-2 text-xs"
                  >
                    {order.items.map((item, index) => (
                      <option key={index} value={index}>
                        Product {index + 1}: {item.productName}
                      </option>
                    ))}
                  </select>
                )}
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  disabled={evidenceUploading}
                  onChange={(e) =>
                    uploadEvidence(e.currentTarget.files, "return")
                  }
                  className="mt-2 text-xs"
                />
                {returnEvidence.length > 0 && (
                  <p className="mt-2 text-[10px] text-emerald-700">
                    {returnEvidence.length} evidence file(s) uploaded for
                    product {evidenceItemIndex + 1}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "Deposit" && (
            <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm space-y-6 text-xs font-sans">
              <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
                Deposit Decision & Settlement
              </h4>

              <div className="space-y-3">
                <label className="text-stone-600 font-bold block">
                  Deposit Settlement Option
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      status: "Released",
                      label: "Release in Full",
                      desc: "Refund full amount back to the client.",
                    },
                    {
                      status: "Partial",
                      label: "Partial Release",
                      desc: "Deduct custom fees for minor repair/dry-clean.",
                    },
                    {
                      status: "Forfeited",
                      label: "Forfeit Deposit",
                      desc: "Hold entire deposit due to significant damage.",
                    },
                  ].map((s) => (
                    <button
                      key={s.status}
                      type="button"
                      onClick={() => {
                        setDepositStatus(
                          s.status as
                            "Pending" | "Released" | "Partial" | "Forfeited",
                        );
                        if (s.status === "Released") {
                          setReleasedAmount(order.deposit);
                          setDeductedAmount(0);
                        } else if (s.status === "Forfeited") {
                          setReleasedAmount(0);
                          setDeductedAmount(order.deposit);
                        }
                      }}
                      className={`p-3 border rounded text-left transition cursor-pointer ${
                        depositStatus === s.status
                          ? "border-[#c5a880] bg-[#fcf9f5] shadow-sm"
                          : "border-stone-200 bg-white hover:border-stone-350"
                      }`}
                    >
                      <p className="font-bold text-stone-800">{s.label}</p>
                      <p className="text-[10px] text-stone-400 mt-1 leading-snug">
                        {s.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">
                    Refund/Released Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={releasedAmount}
                    onChange={(e) => setReleasedAmount(Number(e.target.value))}
                    max={order.deposit}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                    disabled={depositStatus === "Forfeited"}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-500 font-medium">
                    Deducted/Withheld Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={deductedAmount}
                    onChange={(e) => setDeductedAmount(Number(e.target.value))}
                    max={order.deposit}
                    className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                    disabled={depositStatus === "Released"}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-500 font-medium">
                  Decision Settlement Reason
                </label>
                <input
                  type="text"
                  value={depositReason}
                  onChange={(e) => setDepositReason(e.target.value)}
                  placeholder="Reason for withholding or releasing deposit..."
                  className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
                />
              </div>

              <div className="flex justify-end pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() =>
                    handleSaveChanges(
                      order.status === "Cancelled" ? "Cancelled" : "Complete",
                      depositStatus === "Pending" ? "Released" : (depositStatus as any),
                    )
                  }
                  className="px-4 py-2 bg-[#1e1412] hover:bg-[#2c1d1a] text-white text-xs font-semibold rounded cursor-pointer transition"
                >
                  Confirm &amp; Save Deposit Decision
                </button>
              </div>
            </div>
          )}

          {activeTab === "Log" && (
            <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-sm space-y-6 text-xs">
              <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
                Order Timeline & Logs
              </h4>

              {/* Add manual log */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLogText}
                  onChange={(e) => setNewLogText(e.target.value)}
                  placeholder="Log manual update, WhatsApp call, fit review details..."
                  className="flex-1 p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
                />
                <button
                  type="button"
                  onClick={handleAddLog}
                  className="px-4 py-2 bg-[#1e1412] text-white hover:bg-[#2c1d1a] rounded text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Log Event</span>
                </button>
              </div>

              {/* Log Timeline list */}
              <div className="relative border-l-2 border-stone-100 pl-4 space-y-4 font-sans ml-2">
                {logs.map((log, index) => (
                  <div key={index} className="relative">
                    {/* Circle marker */}
                    <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#c5a880] border-2 border-white ring-4 ring-[#fcf9f5]" />
                    <div className="space-y-1 bg-stone-50 p-2.5 rounded border border-stone-100/50">
                      <div className="flex justify-between text-[10px] text-stone-400">
                        <span>{log.date}</span>
                        <span className="font-semibold text-[#c5a880]">
                          By {log.user}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {log.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Actions - Right Col 1 span */}
        <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4 h-fit select-none">
          <h3 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-3 tracking-wide">
            Quick Client Actions
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => {
                const text = encodeURIComponent(
                  `Hello ${order.customerName},\nThis is Soumya from House of Kaira regarding order #${order.id}.`,
                );
                window.open(
                  `https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}?text=${text}`,
                  "_blank",
                );
              }}
              className="w-full p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-800 rounded font-semibold text-xs flex items-center justify-between transition cursor-pointer"
            >
              <span>WhatsApp Client</span>
              <Phone className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => {
                window.location.href = `mailto:${order.customerEmail}?subject=Your House of Kaira Order #${order.id}`;
              }}
              className="w-full p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-800 rounded font-semibold text-xs flex items-center justify-between transition cursor-pointer"
            >
              <span>Email Client</span>
              <Mail className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => {
                setActiveTab("Return");
              }}
              className="w-full p-2.5 bg-[#fcf9f5] hover:bg-[#f6eee2] border border-stone-100 text-stone-700 rounded font-semibold text-xs flex items-center justify-between transition cursor-pointer"
            >
              <span>Log Return & Assess Condition</span>
              <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
            </button>

            <button
              onClick={() => {
                setActiveTab("Deposit");
              }}
              className="w-full p-2.5 bg-[#fcf9f5] hover:bg-[#f6eee2] border border-stone-100 text-stone-700 rounded font-semibold text-xs flex items-center justify-between transition cursor-pointer"
            >
              <span>Manage Deposit Decision</span>
              <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
            </button>

            <button
              onClick={printDispatchLabel}
              className="w-full p-2.5 bg-[#fcf9f5] hover:bg-[#f6eee2] border border-stone-100 text-stone-700 rounded font-semibold text-xs flex items-center justify-between transition cursor-pointer"
            >
              <span>Print Dispatch Label</span>
              <Printer className="h-3.5 w-3.5 text-stone-400" />
            </button>

            <button
              onClick={sendTrackingInfo}
              className="w-full p-2.5 bg-[#fcf9f5] hover:bg-[#f6eee2] border border-stone-100 text-stone-700 rounded font-semibold text-xs flex items-center justify-between transition cursor-pointer"
            >
              <span>Send Tracking info to Customer</span>
              <Send className="h-3.5 w-3.5 text-stone-400" />
            </button>

            <button
              onClick={downloadInvoice}
              className="w-full p-2.5 bg-[#fcf9f5] hover:bg-[#f6eee2] border border-stone-100 text-stone-700 rounded font-semibold text-xs flex items-center justify-between transition cursor-pointer"
            >
              <span>Generate GST Invoice</span>
              <FileText className="h-3.5 w-3.5 text-stone-400" />
            </button>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-100 rounded-md flex gap-2 text-stone-600 text-[11px] leading-relaxed">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">
                Dry Cleaning Window
              </p>
              <p className="text-stone-500 mt-0.5">
                Allow 2-3 business days buffer for processing after garment
                receipt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
