import { useState, useEffect } from "react";
import * as payoutApi from "../../services/payoutApi";
import toast from "react-hot-toast";
import { Order, Product } from "../../types";

import PayoutHeader from "./components/PayoutHeader";
import PayoutSummaryCards from "./components/PayoutSummaryCards";
import PayoutIntegrityBanner from "./components/PayoutIntegrityBanner";
import PayoutTabs from "./components/PayoutTabs";
import PaymentQueueTab from "./tabs/PaymentQueueTab";
import AllPayoutsTab from "./tabs/AllPayoutsTab";
import ByListerTab from "./tabs/ByListerTab";
import ByProductTab from "./tabs/ByProductTab";
import DamageCompensationTab from "./tabs/DamageCompensationTab";

export type PayoutTab =
  | "payment-queue"
  | "all-payouts"
  | "by-lister"
  | "by-product"
  | "damage-compensation";

interface PayoutsViewProps {
  orders?: Order[];
  products?: Product[];
  listers?: any[];
  onSelectOrder?: (orderId: string) => void;
  onSelectLister?: (listerId: string) => void;
}

export default function PayoutsView({
  orders = [],
  products = [],
  listers = [],
  onSelectOrder,
  onSelectLister,
}: PayoutsViewProps) {
  const [activeTab, setActiveTab] = useState<PayoutTab>("payment-queue");
  const [allPayoutsStatusFilter, setAllPayoutsStatusFilter] = useState<string>("All");

  const [payoutsList, setPayoutsList] = useState<payoutApi.Payout[]>([]);
  const [payoutsLoading, setPayoutsLoading] = useState(true);
  const [, setPendingPayoutsTotal] = useState(0);
  const [, setPaidPayoutsTotal] = useState(0);

  const loadPayouts = () => {
    setPayoutsLoading(true);
    payoutApi
      .getPayouts()
      .then((result) => {
        const list = result.data || [];
        setPayoutsList(list);
        setPendingPayoutsTotal(
          result.summary?.pending ??
            list
              .filter((p) => p.status === "Pending" || p.status === "Pending Approval")
              .reduce((s, p) => s + (Number(p.listerShare) || 0), 0),
        );
        setPaidPayoutsTotal(
          result.summary?.paid ??
            list
              .filter((p) => p.status === "Paid")
              .reduce((s, p) => s + (Number(p.listerShare) || 0), 0),
        );
      })
      .catch((error) => console.error("Unable to load payouts:", error))
      .finally(() => setPayoutsLoading(false));
  };

  useEffect(() => {
    loadPayouts();
  }, []);

  const handleQueueMissingPayout = async (missingOrder: any) => {
    try {
      const txVal = Number(missingOrder.amountNum || 0);
      const pct = 60;
      const listerShare = Math.round(txVal * (pct / 100));
      const hokComm = Math.max(0, txVal - listerShare);
      const created = await payoutApi.createPayout({
        orderId: missingOrder.id,
        productId: missingOrder.productId || "PRD-101",
        productName: missingOrder.product,
        listerId: missingOrder.listerId || "simran-chouhan",
        listerName: missingOrder.lister || "Simran Chouhan",
        mode: missingOrder.mode || "Rental",
        transactionAmount: txVal,
        payoutPercentage: pct,
        listerShare,
        hokCommission: hokComm,
        netPayout: listerShare,
        dueDate: new Date().toISOString().slice(0, 10),
        status: "Pending",
      });
      setPayoutsList((prev) => [created, ...prev]);
      setPendingPayoutsTotal((v) => v + (Number(created.listerShare) || 0));
      setActiveTab("payment-queue");
      toast.success(`Queued payout for ${missingOrder.id}`);
    } catch (err) {
      loadPayouts();
      toast.success("Synced payouts from completed orders");
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "payment-queue":
        return (
          <PaymentQueueTab
            payouts={payoutsList}
            orders={orders}
            products={products}
            listers={listers}
            setPayouts={setPayoutsList}
            setPending={setPendingPayoutsTotal}
            setPaid={setPaidPayoutsTotal}
            onSelectOrder={onSelectOrder}
            onSelectLister={onSelectLister}
          />
        );

      case "all-payouts":
        return (
          <AllPayoutsTab
            payouts={payoutsList}
            listers={listers}
            initialStatusFilter={allPayoutsStatusFilter}
            onSelectOrder={onSelectOrder}
            onSelectLister={onSelectLister}
          />
        );

      case "by-lister":
        return (
          <ByListerTab
            payouts={payoutsList}
            listers={listers}
            onSelectOrder={onSelectOrder}
            onSelectLister={onSelectLister}
          />
        );

      case "by-product":
        return (
          <ByProductTab
            payouts={payoutsList}
            products={products}
            onSelectOrder={onSelectOrder}
            onSelectLister={onSelectLister}
          />
        );

      case "damage-compensation":
        return (
          <DamageCompensationTab
            payouts={payoutsList}
            orders={orders}
            listers={listers}
            setPayouts={setPayoutsList}
            setPending={setPendingPayoutsTotal}
            setPaid={setPaidPayoutsTotal}
            onSelectOrder={onSelectOrder}
            onSelectLister={onSelectLister}
          />
        );

      default:
        return (
          <PaymentQueueTab
            payouts={payoutsList}
            orders={orders}
            products={products}
            listers={listers}
            setPayouts={setPayoutsList}
            setPending={setPendingPayoutsTotal}
            setPaid={setPaidPayoutsTotal}
            onSelectOrder={onSelectOrder}
            onSelectLister={onSelectLister}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1]">
      <div className="mx-auto max-w-[1600px] px-0 py-0">
        {/* Header */}
        <div className="pt-0">
          <PayoutHeader />
        </div>

        {/* Summary Cards */}
        <div className="mt-7">
          <PayoutSummaryCards
            payouts={payoutsList}
            onSelectTab={(tab, statusFilter) => {
              if (tab === "all-payouts") {
                setAllPayoutsStatusFilter(statusFilter || "All");
              }
              setActiveTab(tab);
            }}
          />
        </div>

        {/* Integrity Banner */}
        {!payoutsLoading && (
          <div className="mt-5">
            <PayoutIntegrityBanner
              payouts={payoutsList}
              orders={orders}
              products={products}
              onQueuePayout={handleQueueMissingPayout}
              onSelectOrder={onSelectOrder}
              onSelectLister={onSelectLister}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="mt-7">
          <PayoutTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            payouts={payoutsList}
          />
        </div>

        {/* Active Tab */}
        <div className="mt-6">
          {payoutsLoading ? (
            <div className="rounded-md border border-[#E7E0D6] bg-white p-8 text-center text-sm text-[#78716C] shadow-sm">
              Loading payouts...
            </div>
          ) : (
            renderActiveTab()
          )}
        </div>
      </div>
    </div>
  );
}
