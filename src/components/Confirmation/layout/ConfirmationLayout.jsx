// src\components\Confirmation\layout\ConfirmationLayout.jsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { calculateTotals } from "../../../utils/cart/calculateTotals";

import "../../../styles/confirmation/layout/confirmation-layout.css";

import ProgressStrip from "./ProgressStrip";
import ConfirmationHero from "../hero/ConfirmationHero";
import ConfirmationBodyLayout from "./ConfirmationBodyLayout";

import OrderStatusModal from "../modal/OrderStatusModal";


import {
  ConfirmationSection,
  ConfirmationSectionHeader,
  ConfirmationModeSeparator,
  ConfirmationPieceCard,
} from "../../Confirmation";
import ConfirmationTimeline from "../sections/ConfirmationTimeline";
import Notice from "../../shared/Notice/Notice";
import RentalReturnGuide from "../sections/RentalReturnGuide";
import ConfirmationNextStepsSection from "../sections/ConfirmationNextStepsSection";
import ConfirmationPaymentConfirmed from "../sidebar/ConfirmationPaymentConfirmed";
import ConfirmationWhatsNextTimeline from "../sidebar/ConfirmationWhatsNextTimeline";
import DepositCallout from "../sidebar/DepositCallout";
import ReturnReminder from "../sidebar/ReturnReminder";
import SidebarActions from "../sidebar/SidebarActions";
import ConfirmationTrustList from "../sidebar/ConfirmationTrustList";
import DiscoveryStrip from "../discovery/DiscoveryStrip";
import ConfirmationPolicyStrip from "../policy/ConfirmationPolicyStrip";


const ConfirmationLayout = () => {
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);
  const location = useLocation();

  const confirmationData =
    location.state ||
    JSON.parse(
      localStorage.getItem("confirmationData")
    ) ||
    JSON.parse(
      localStorage.getItem("checkoutData")
    ) ||
    {};

  const confirmationItems =
    confirmationData.items || [];

  const activePromo =
    confirmationData.activePromo || null;

  const deliveryType =
    confirmationData.deliveryType || "standard";

  const totals = calculateTotals(
    confirmationItems,
    activePromo,
    deliveryType
  );


  const confirmationGroups = [
    {
      type: "rental",
      title: "Rental Booking",
      items: confirmationItems.filter(
        item => item.type === "rental"
      ),
      status: "Dispatching soon",
      tag: "soon",
    },

    {
      type: "preloved",
      title: "Preloved Purchase",
      items: confirmationItems.filter(
        item => item.type === "preloved"
      ),
      status: "Dispatching within 2 days",
      tag: "soon",
    },

    {
      type: "new",
      title: "New Purchase",
      items: confirmationItems.filter(
        item => item.type === "new"
      ),
      status:
        deliveryType === "express"
          ? "Ships in 1–2 days"
          : "Ships in 3–5 days",
      tag: "new",
    },
  ].filter(group => group.items.length > 0);


  // RENTAL WINDOW CALCULATOR
  const getRentalWindowLabel = (item) => {

    const start = new Date(
      item.booking?.deliveryDate
    );

    const end = new Date(
      item.booking?.returnDate
    );

    const windowDays =
      Math.round(
        (end - start) /
        (1000 * 60 * 60 * 24)
      ) + 1;

    return `${windowDays}-Day Window`;
  };

  const hasRentalItems =
    confirmationItems.some(
        item => item.type === "rental"
    );


  return (
    <div className="confirmation-layout">

      <ProgressStrip />

      <ConfirmationHero
        onOpenOrderStatus={() =>
          setIsOrderStatusOpen(true)
        }
      />

      <div className="confirmation-layout-container">
        <ConfirmationBodyLayout
          leftContent={
            <>
              {confirmationGroups.map(
                (group, index) => (
                  <ConfirmationSection
                    key={group.type}
                    isLast={
                      index ===
                      confirmationGroups.length - 1
                    }
                  >

                    {/* CONFIRMATION TITLE HEADER */}
                    <ConfirmationSectionHeader
                      number={`0${index + 1}`}
                      title={
                        group.type === "rental"
                          ? "Rental"
                          : group.type === "preloved"
                            ? "Preloved"
                            : "Buy"
                      }
                      accent={
                        group.type === "new"
                          ? "New"
                          : "Piece"
                      }
                      suffix={
                        group.type === "new"
                          ? "Piece"
                          : ""
                      }
                      status={group.status}
                      tag={group.tag}
                    />

                    {/* MODE SEPERATOR */}
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

                    {/* Confirmation Piece Card */}
                    <div className="confirmation-piece-group">
                      {group.items.map((item, itemIndex) => (
                        <ConfirmationPieceCard
                          key={item.id}
                          item={item}
                          isLast={
                            itemIndex === group.items.length - 1
                          }
                        />
                      ))}

                    </div>
                    {/* PRELOVED notice */}
                    {group.type === "preloved" && (
                      <Notice variant="rose">

                        <b>
                          Final sale reminder:
                        </b>{" "}
                        The Ivory Tissue Organza Saree is a
                        preloved item sold on a non-returnable
                        basis. You accepted this condition at
                        checkout. If you have any concerns
                        about the piece on arrival, please
                        contact us on WhatsApp within 24 hours
                        of delivery and we will do our best to
                        assist.

                      </Notice>
                    )}

                    {/* NEW notice */}
                    {group.type === "new" && (
                      <Notice variant="navy">
                        <b>
                          Brand dispatch note:
                        </b>{" "}
                        This piece ships directly from
                        Manyavar's fulfilment centre. If you
                        have any size concerns, please contact
                        us before the item dispatches. Once
                        dispatched, returns follow the standard
                        7-day policy — contact HOK on WhatsApp
                        to initiate.
                      </Notice>
                    )}

                    {/* RENTAL DATE TIMELINE */}
                    {/* RENTAL DATE TIMELINE */}
                    {group.type === "rental" &&
                      group.items.length > 0 && (
                        <>
                          <ConfirmationTimeline
                            item={group.items[0]}
                          />

                          <Notice variant="amber">

                            <b>
                              Security deposit — not yet due.
                            </b>{" "}
                            Our team will reach out on WhatsApp
                            within 24 hours of this confirmation
                            to arrange the ₹15,000 deposit via
                            UPI or bank transfer. Your item will
                            not be dispatched until the deposit
                            is received. The deposit is fully
                            refundable within 3–5 business days
                            of a clean return inspection.
                          </Notice>

                          <Notice variant="slate">
                            <b>
                              Return instructions:
                            </b>{" "}
                            A prepaid Blue Dart return label is
                            included in the packaging. Please
                            drop off the garment at any Blue
                            Dart service centre by 18 November
                            (Tuesday). Late returns attract
                            ₹1,700 per additional day. The
                            garment must be returned in the
                            same condition it was received —
                            we inspect every piece within
                            24 hours of receiving it.

                          </Notice>

                          <RentalReturnGuide />
                        </>
                      )}
                    
                  </ConfirmationSection>
                )
              )}

              <ConfirmationNextStepsSection />

            </>

          }

          // RIGHT SECTION
          rightContent={
            <>
              <ConfirmationPaymentConfirmed
                amount={`₹${totals.grandTotal.toLocaleString("en-IN")}`}
                paymentMethod="Razorpay"
                paymentDate="14 Oct 2024"
              />

              <ConfirmationWhatsNextTimeline/>

              <DepositCallout/>

              <ReturnReminder/>

              <SidebarActions
                onOpenOrderStatus={() =>
                  setIsOrderStatusOpen(true)
                }
              />

              <ConfirmationTrustList/>

              
            </>
            
          }
          
        />
        <OrderStatusModal
          isOpen={isOrderStatusOpen}
          onCloseOrderStatus={() =>
            setIsOrderStatusOpen(false)
          }
        />
      <DiscoveryStrip/>

        {
          hasRentalItems && (
            <ConfirmationPolicyStrip />
          )
        }
      </div>


    </div>
  );
};

export default ConfirmationLayout;