import { useState, useEffect } from "react";
import * as payoutApi from "../../services/payoutApi";
import { Toaster } from "react-hot-toast";

import PayoutHeader from "./components/PayoutHeader";
import PayoutSummaryCards from "./components/PayoutSummaryCards";
import PayoutIntegrityBanner from "./components/PayoutIntegrityBanner";
import PayoutTabs from "./components/PayoutTabs";
// import PayoutPageHeader from "./components/PayoutPageHeader";
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

export default function PayoutsView() {
  const [activeTab, setActiveTab] =
    useState<PayoutTab>("payment-queue");

  const [payoutsList, setPayoutsList] = useState<payoutApi.Payout[]>([]);
  const [pendingPayoutsTotal, setPendingPayoutsTotal] = useState(0);
  const [paidPayoutsTotal, setPaidPayoutsTotal] = useState(0);

  useEffect(() => {
    payoutApi.getPayouts()
      .then((result) => {
        setPayoutsList(result.data || []);
        setPendingPayoutsTotal(result.summary?.pending || 0);
        setPaidPayoutsTotal(result.summary?.paid || 0);
      })
      .catch((error) => console.error('Unable to load payouts:', error));
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "payment-queue":
        return <PaymentQueueTab payouts={payoutsList} setPayouts={setPayoutsList} setPending={setPendingPayoutsTotal} setPaid={setPaidPayoutsTotal} />;

      case "all-payouts":
        return <AllPayoutsTab payouts={payoutsList} />;

      case "by-lister":
        return <ByListerTab payouts={payoutsList} />;

      case "by-product":
        return <ByProductTab payouts={payoutsList} />;

      case "damage-compensation":
        return <DamageCompensationTab payouts={payoutsList} />;

      default:
        return <PaymentQueueTab payouts={payoutsList} setPayouts={setPayoutsList} setPending={setPendingPayoutsTotal} setPaid={setPaidPayoutsTotal} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1]">
    {/* <PayoutPageHeader /> */}

    <div className="mx-auto max-w-[1600px] px-0 py-0">

        {/* Header */}
        <div className="pt-0">
          <PayoutHeader />
        </div>

        {/* Summary Cards */}
        <div className="mt-7">
          <PayoutSummaryCards pendingTotal={pendingPayoutsTotal} paidTotal={paidPayoutsTotal} pendingCount={payoutsList.filter(p => p.status === 'Pending').length} />
        </div>

        {/* Integrity Banner */}
        <div className="mt-5">
          <PayoutIntegrityBanner payouts={payoutsList} />
        </div>

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
          {renderActiveTab()}
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}