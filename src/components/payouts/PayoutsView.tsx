import { useState } from "react";

import PayoutHeader from "./components/PayoutHeader";
import PayoutSummaryCards from "./components/PayoutSummaryCards";
import PayoutIntegrityBanner from "./components/PayoutIntegrityBanner";
import PayoutTabs from "./components/PayoutTabs";
import PayoutPageHeader from "./components/PayoutPageHeader";
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

    {/* Fixed to the viewport — flush against the top/edges of the screen
        no matter what padding or margin the surrounding page shell uses.
        This removes the dependency on finding/editing that parent file. */}
    <div className="fixed top-0 left-0 right-0 z-40">
      <PayoutPageHeader />
    </div>

    {/* Spacer matching PayoutPageHeader's h-[60px], so content below
        doesn't get hidden underneath the fixed bar. */}
    <div className="h-[60px]" />

    <div className="mx-auto max-w-[1600px] px-7 pb-6">

        {/* Header */}
        <div className="pt-6">
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