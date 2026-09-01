import { useState } from "react";
import { useLocation } from "react-router-dom";
import { calculateTotals } from "../../../../utils/cart/calculateTotals";

import ProgressStrip from "../../layout/ProgressStrip";
import MobileConfirmationHero from "../hero/MobileConfirmationHero";
import ConfirmationPaymentConfirmed from "../../sidebar/ConfirmationPaymentConfirmed";
import MobileWhatsNextPanel from "../sections/MobileWhatsNextPanel";
import DepositCallout from "../../sidebar/DepositCallout";
import ReturnReminder from "../../sidebar/ReturnReminder";

// Section components
import ConfirmationSection from "../../sections/ConfirmationSection";
import ConfirmationSectionHeader from "../../layout/ConfirmationSectionHeader";
import ConfirmationModeSeparator from "../../sections/ConfirmationModeSeparator";
import ConfirmationPieceCard from "../../sections/ConfirmationPieceCard";
import ConfirmationTimeline from "../../sections/ConfirmationTimeline";
import Notice from "../../../shared/Notice/Notice";
import RentalReturnGuide from "../../sections/RentalReturnGuide";

import ConfirmationNextStepsSection from "../../sections/ConfirmationNextStepsSection";
import SidebarActions from "../../sidebar/SidebarActions";
import ConfirmationTrustList from "../../sidebar/ConfirmationTrustList";
import MobileOrderStatusModal from "../modal/MobileOrderStatusModal";


import "../../../../styles/confirmation/mobile/layout/mobile-confirmation-layout.css";
import DiscoveryStrip from "../../discovery/DiscoveryStrip";
import ConfirmationPolicyStrip from "../../policy/ConfirmationPolicyStrip";


const MobileConfirmationLayout = () => {
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);
  const location = useLocation();

  const confirmationData =
    location.state ||
    JSON.parse(localStorage.getItem("confirmationData")) ||
    JSON.parse(localStorage.getItem("checkoutData")) ||
    {};

  const confirmationItems = confirmationData.items || [];
  const activePromo = confirmationData.activePromo || null;
  const deliveryType = confirmationData.deliveryType || "standard";

  const totals = calculateTotals(confirmationItems, activePromo, deliveryType);

  const confirmationGroups = [
    {
      type: "rental",
      title: "Rental Booking",
      items: confirmationItems.filter(item => item.type === "rental"),
      status: "Dispatching soon",
      tag: "soon",
    },
    {
      type: "preloved",
      title: "Preloved Purchase",
      items: confirmationItems.filter(item => item.type === "preloved"),
      status: "Dispatching within 2 days",
      tag: "soon",
    },
    {
      type: "new",
      title: "New Purchase",
      items: confirmationItems.filter(item => item.type === "new"),
      status: deliveryType === "express" ? "Ships in 1–2 days" : "Ships in 3–5 days",
      tag: "new",
    },
  ].filter(group => group.items.length > 0);

  const getRentalWindowLabel = (item) => {
    const start = new Date(item.booking?.deliveryDate);
    const end = new Date(item.booking?.returnDate);
    const windowDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return `${windowDays}-Day Window`;
  };

  const hasRentalItems =
    confirmationItems.some(
        item => item.type === "rental"
    );

  return (
    <div className="mobile-confirmation-layout" id="mobile-confirmation-page">
      {/* Progress Strip - Uses existing component */}
      <ProgressStrip />

      {/* Mobile Hero - New Component */}
      <MobileConfirmationHero
        onOpenOrderStatus={() => setIsOrderStatusOpen(true)}
        orderReference={confirmationData.orderReference || "HOK-2024-04891"}
        orderDate={confirmationData.orderDate || "14 Oct 2024, 3:42 PM"}
        customerName={confirmationData.customerName || "Priya Sharma"}
        customerEmail={confirmationData.customerEmail || "priya@example.com"}
      />

      {/* Paid Confirmation Strip - existing component */}
      <ConfirmationPaymentConfirmed
        amount={`₹${totals.grandTotal.toLocaleString("en-IN")}`}
        paymentMethod="Razorpay"
        paymentDate={confirmationData.orderDate || "14 Oct 2024"}
      />

      {/* Mobile Whats's Next Panel - New Component */}
      <MobileWhatsNextPanel />

      {/* Deposit Callout - Existing Component */}
      <DepositCallout />

      {/* Return Reminder - Existing Component */}
      <ReturnReminder />

      {/* Sections 01-03: Rental, Preloved, New */}
      {confirmationGroups.map((group, index) => (
        <ConfirmationSection key={group.type} isLast={index === confirmationGroups.length - 1}>
          <ConfirmationSectionHeader
            number={`0${index + 1}`}
            title={
              group.type === "rental"
                ? "Rental"
                : group.type === "preloved"
                ? "Preloved"
                : "Buy"
            }
            accent={group.type === "new" ? "New" : "Piece"}
            suffix={group.type === "new" ? "Piece" : ""}
            status={group.status}
            tag={group.tag}
          />

          <ConfirmationModeSeparator
            type={group.type}
            label={
              group.type === "rental"
                ? `Rental Booking · ${getRentalWindowLabel(group.items[0])}`
                : group.type === "preloved"
                ? "Preloved · Buy to Own · Final Sale"
                : "Buy New · Brand Fulfilment"
            }
          />

          <div className="confirmation-piece-group">
            {group.items.map((item, itemIndex) => (
              <ConfirmationPieceCard
                key={item.id}
                item={item}
                isLast={itemIndex === group.items.length - 1}
              />
            ))}
          </div>

          {/* Preloved Notice */}
          {group.type === "preloved" && (
            <Notice variant="rose">
              <b>Final sale reminder:</b> The Ivory Tissue Organza Saree is a
              preloved item sold on a non-returnable basis. You accepted this condition at
              checkout. If you have any concerns about the piece on arrival, please
              contact us on WhatsApp within 24 hours of delivery and we will do our best to
              assist.
            </Notice>
          )}

          {/* New Notice */}
          {group.type === "new" && (
            <Notice variant="navy">
              <b>Brand dispatch note:</b> This piece ships directly from
              Manyavar's fulfilment centre. If you have any size concerns, please contact
              us before the item dispatches. Once dispatched, returns follow the standard
              7-day policy — contact HOK on WhatsApp to initiate.
            </Notice>
          )}

          {/* Rental Timeline and Notices */}
          {group.type === "rental" && group.items.length > 0 && (
            <>
              <ConfirmationTimeline item={group.items[0]} />
              
              <Notice variant="amber">
                <b>Security deposit — not yet due.</b> Our team will reach out on WhatsApp
                within 24 hours of this confirmation to arrange the ₹15,000 deposit via
                UPI or bank transfer. Your item will not be dispatched until the deposit
                is received. The deposit is fully refundable within 3–5 business days
                of a clean return inspection.
              </Notice>

              <Notice variant="slate">
                <b>Return instructions:</b> A prepaid Blue Dart return label is included
                in the packaging. Please drop off the garment at any Blue Dart service
                centre by 18 November (Tuesday). Late returns attract ₹1,700 per
                additional day. The garment must be returned in the same condition it
                was received — we inspect every piece within 24 hours of receiving it.
              </Notice>
              
              {/* Rental Return Guide - Existing Component  */}
              <RentalReturnGuide />
            </>
          )}
        </ConfirmationSection>
      ))}

       {/*  What Happens Next - Existing Component  */}
      <ConfirmationNextStepsSection />

      {/* SideBar Actions - Existing Component  */}
      <SidebarActions onOpenOrderStatus={() => setIsOrderStatusOpen(true)} />

      {/* Confirmation Trust List - Existing Component  */}
      <ConfirmationTrustList />

      
      {/* Confirmation Trust List - Existing Component (used Detial row & Status Pipeline old one)  */}

      <MobileOrderStatusModal
        isOpen={isOrderStatusOpen}
        onCloseOrderStatus={() => setIsOrderStatusOpen(false)}
        orderReference={confirmationData.orderReference || "HOK-2024-04891"}
        orderDate={confirmationData.orderDate || "14 Oct 2024, 3:42 PM"}
      />

      {/* Mobile Discovery Strip - used old component */}
      <DiscoveryStrip/>

      {/* Mobile Policy Strip - used old component */}
      {hasRentalItems && <ConfirmationPolicyStrip />}

    </div>
  );
};

export default MobileConfirmationLayout;