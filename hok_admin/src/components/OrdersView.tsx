import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  Eye,
  Plus,
} from "lucide-react";
import { Order, Customer } from "../types";

interface OrdersViewProps {
  orders: Order[];
  customers?: Customer[];
  setView: (view: string) => void;
  setSelectedOrderId: (id: string) => void;
  onCreateMockOrder?: () => void;
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

const resolveProductName = (o: any) => {
  if (!o) return "—";
  if (o.productName && o.productName.trim()) return o.productName;
  if (Array.isArray(o.items) && o.items.length > 0) {
    const first = o.items[0]?.productName;
    if (o.items.length > 1) return `${first || "Product"} (+${o.items.length - 1} more)`;
    return first || "—";
  }
  return "—";
};

export default function OrdersView({
  orders,
  customers = [],
  setView,
  setSelectedOrderId,
  onCreateMockOrder,
}: OrdersViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedMode, setSelectedMode] = useState("All Modes");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const resolveCustomerName = (o: Order) => {
    if (customers && customers.length > 0 && o.customerId) {
      const match = customers.find(
        (c) =>
          c.customerId === o.customerId ||
          c.id === o.customerId ||
          (c as any)._id === o.customerId,
      );
      if (match && match.name && match.name !== "User") return match.name;
    }
    return o.customerName || "—";
  };

  const resolveCustomerEmail = (o: Order) => {
    if (customers && customers.length > 0 && o.customerId) {
      const match = customers.find(
        (c) =>
          c.customerId === o.customerId ||
          c.id === o.customerId ||
          (c as any)._id === o.customerId,
      );
      if (
        match &&
        match.email &&
        !match.email.includes("temp.com") &&
        !match.email.includes("hok.local")
      ) {
        return match.email;
      }
    }
    return o.customerEmail || "—";
  };

  // Filter out blank/invalid orders first
  const validOrders = orders.filter(
    (o) => o.id && (o.customerName || o.customerId),
  );

  // Calculate order metrics
  const totalOrders = validOrders.length;
  const rentalsToday =
    validOrders.filter((o) => o.mode === "Rental" && o.status === "Shipped")
      .length || 0;
  const depositsHeld = validOrders
    .filter(
      (o) =>
        o.mode === "Rental" &&
        (o.status === "Confirmed" ||
          o.status === "Dispatched" ||
          o.status === "Shipped" ||
          o.status === "Delivered"),
    )
    .reduce((sum, o) => sum + (Number(o.deposit) || 0), 0);
  const mtdRevenue = validOrders.reduce(
    (sum, o) => sum + resolveOrderAmount(o),
    0,
  );

  // Filter logic
  const filteredOrders = orders.filter((o) => {
    if (!o.id) {
      return false;
    }

    const cName = resolveCustomerName(o).toLowerCase();
    const cEmail = resolveCustomerEmail(o).toLowerCase();
    const sTerm = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !sTerm ||
      (o.id || "").toLowerCase().includes(sTerm) ||
      (o.customerId || "").toLowerCase().includes(sTerm) ||
      (o.customerName || "").toLowerCase().includes(sTerm) ||
      cName.includes(sTerm) ||
      cEmail.includes(sTerm) ||
      (o.customerPhone || "").toLowerCase().includes(sTerm) ||
      (o.productName || "").toLowerCase().includes(sTerm);

    const matchesStatus =
      selectedStatus === "All Statuses" || o.status === selectedStatus;
    const matchesMode = selectedMode === "All Modes" || o.mode === selectedMode;

    let matchesDates = true;
    if (startDate && o.rentalStartDate) {
      matchesDates = matchesDates && o.rentalStartDate >= startDate;
    }
    if (endDate && o.rentalEndDate) {
      matchesDates = matchesDates && o.rentalEndDate <= endDate;
    }

    return matchesSearch && matchesStatus && matchesMode && matchesDates;
  });

  const statuses = [
    "All Statuses",
    "Confirmed",
    "Dispatched",
    "Shipped",
    "Delivered",
    "Return Sent",
    "Returned",
    "Complete",
    "Processed",
    "Cancelled",
  ];
  const modes = ["All Modes", "Rental", "Preloved", "Buy"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-stone-900 font-medium">
            Orders
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Accept online and walking bookings. Manual orders can be created for
            any client.
          </p>
        </div>
        {onCreateMockOrder && (
          <button
            onClick={onCreateMockOrder}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1e1412] text-white hover:bg-[#2e1f1c] text-xs font-semibold rounded cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Order</span>
          </button>
        )}
      </div>

      {/* Orders Metrics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#fcf9f5] p-4 rounded-lg border border-stone-200/60">
        <div className="p-3 bg-white rounded border border-stone-100">
          <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">
            Orders (MTD)
          </p>
          <h4 className="text-xl font-serif text-stone-900 font-bold mt-1">
            {totalOrders}
          </h4>
          <span className="text-[9px] text-stone-400">+2 from last month</span>
        </div>
        <div className="p-3 bg-white rounded border border-stone-100">
          <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">
            Rentals Today
          </p>
          <h4 className="text-xl font-serif text-stone-900 font-bold mt-1">
            {rentalsToday}
          </h4>
          <span className="text-[9px] text-[#c5a880] font-medium">
            1 in dispatch queue
          </span>
        </div>
        <div className="p-3 bg-white rounded border border-stone-100">
          <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">
            Deposits Held
          </p>
          <h4 className="text-xl font-serif text-stone-900 font-bold mt-1">
            ₹{depositsHeld.toLocaleString("en-IN")}
          </h4>
          <span className="text-[9px] text-amber-600 font-medium">
            Holding for returns
          </span>
        </div>
        <div className="p-3 bg-white rounded border border-stone-100">
          <p className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-widest">
            Revenue (MTD)
          </p>
          <h4 className="text-xl font-serif text-stone-900 font-bold mt-1">
            ₹{mtdRevenue.toLocaleString("en-IN")}
          </h4>
          <span className="text-[9px] text-green-600 font-medium">
            +24% vs target
          </span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search order ID, customer, product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] outline-none transition"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full md:w-44">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs font-medium text-stone-700 focus:border-[#c5a880] outline-none"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "All Statuses" ? "All Statuses" : s}
              </option>
            ))}
          </select>
        </div>

        {/* Mode Dropdown */}
        <div className="w-full md:w-36">
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="w-full p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs font-medium text-stone-700 focus:border-[#c5a880] outline-none"
          >
            {modes.map((m) => (
              <option key={m} value={m}>
                {m === "All Modes" ? "All Modes" : m}
              </option>
            ))}
          </select>
        </div>

        {/* Date Inputs */}
        <div className="flex w-full md:w-auto items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs text-stone-600 outline-none w-full md:w-32"
            title="Start Date"
          />
          <span className="text-stone-400 text-xs">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs text-stone-600 outline-none w-full md:w-32"
            title="End Date"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-400 font-sans uppercase font-bold text-[10px] border-b border-stone-150 tracking-wider">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Mode</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Rental Dates</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-10 text-stone-400 font-sans"
                  >
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#fcf9f5] transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono text-stone-400">
                      {order.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="font-semibold text-stone-800">
                          {resolveCustomerName(order)}
                        </span>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {resolveCustomerEmail(order)}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 max-w-[150px] truncate">
                      <span className="font-semibold text-stone-800">
                        {resolveProductName(order)}
                      </span>
                      {order.designer || (order.items?.[0] as any)?.designer ? (
                        <p className="text-[10px] text-[#c5a880] font-sans mt-0.5">
                          {order.designer || (order.items?.[0] as any)?.designer}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 text-[9px] rounded-full uppercase tracking-wider font-semibold font-sans ${
                          order.mode === "Rental"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : order.mode === "Preloved"
                              ? "bg-purple-50 text-purple-700 border border-purple-100"
                              : "bg-teal-50 text-teal-700 border border-teal-100"
                        }`}
                      >
                        {order.mode || (order.items?.[0] as any)?.mode || "Rental"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="font-semibold text-stone-900">
                          ₹{resolveOrderAmount(order).toLocaleString("en-IN")}
                        </span>
                        {(order.deposit || 0) > 0 && (
                          <p className="text-[9px] text-stone-400 mt-0.5">
                            + ₹
                            {Number(order.deposit || 0).toLocaleString("en-IN")}{" "}
                            Dep.
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-sans">
                      {order.rentalStartDate || (order as any).startDate ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-stone-700">
                            {new Date(
                              order.rentalStartDate ||
                                (order as any).startDate ||
                                "2026-09-10",
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}{" "}
                            -{" "}
                            {new Date(
                              order.rentalEndDate ||
                                (order as any).endDate ||
                                "2026-09-14",
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          <span className="text-[9px] text-stone-400 mt-0.5">
                            4 nights
                          </span>
                        </div>
                      ) : (
                        <span className="text-stone-400 font-medium">
                          10 Sept - 14 Sept
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                          order.status === "Cancelled"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : order.status === "Returned" ||
                                order.status === "Complete" ||
                                order.status === "Processed"
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : order.status === "Shipped" ||
                                  order.status === "Dispatched"
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right shrink-0">
                      <button
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setView(`order_detail:${order.id}`);
                        }}
                        className="px-2.5 py-1.5 border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-[#c5a880] rounded hover:bg-stone-50 transition cursor-pointer inline-flex items-center gap-1 text-[11px] font-medium"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3.5 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-stone-500 font-sans text-[11px]">
          <span>
            Showing {filteredOrders.length} of {validOrders.length} orders
          </span>
          <div className="flex gap-2">
            <button className="px-2.5 py-1 border border-stone-200 rounded bg-white text-stone-600 cursor-not-allowed">
              Previous
            </button>
            <button className="px-2.5 py-1 border border-stone-200 rounded bg-white text-stone-600 cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
