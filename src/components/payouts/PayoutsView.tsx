import { useState } from "react";

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

  const renderActiveTab = () => {
    switch (activeTab) {
      case "payment-queue":
        return <PaymentQueueTab />;

      case "all-payouts":
        return <AllPayoutsTab />;

      case "by-lister":
        return <ByListerTab />;

      case "by-product":
        return <ByProductTab />;

      case "damage-compensation":
        return <DamageCompensationTab />;

      default:
        return <PaymentQueueTab />;
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
          <PayoutSummaryCards />
        </div>

        {/* Integrity Banner */}
        <div className="mt-5">
          <PayoutIntegrityBanner />
        </div>

        {/* Tabs */}
        <div className="mt-7">
          <PayoutTabs
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Active Tab */}
        <div className="mt-6">
          {renderActiveTab()}
        </div>

      </div>

    </div>
  );
}