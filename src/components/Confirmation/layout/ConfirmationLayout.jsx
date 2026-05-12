// src\components\Confirmation\layout\ConfirmationLayout.jsx

import { useLocation } from "react-router-dom";
import { calculateTotals } from "../../../utils/cart/calculateTotals";

import "../../../styles/confirmation/layout/confirmation-layout.css";

import ProgressStrip from "./ProgressStrip";
import ConfirmationHero from "../hero/ConfirmationHero";
import ConfirmationBodyLayout from "./ConfirmationBodyLayout";


import {
  ConfirmationSection,
  ConfirmationSectionHeader,
  ConfirmationModeSeparator,
  ConfirmationPieceCard,
} from "../../Confirmation";
import ConfirmationTimeline from "../sections/ConfirmationTimeline";

const ConfirmationLayout = () => {

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


  return (
    <div className="confirmation-layout">

      <ProgressStrip />

      <ConfirmationHero />

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

                    {group.items.map((item, itemIndex) => (
                      <ConfirmationPieceCard
                        key={item.id}
                        item={item}
                        isLast={
                          itemIndex === group.items.length - 1
                        }
                      />
                    ))}

                    {/* RENTAL DATE TIMELINE */}
                    {group.type === "rental" &&
                      group.items.length > 0 && (
                        <ConfirmationTimeline
                          item={group.items[0]}
                        />
                      )}

                    

                  </ConfirmationSection>
                )
              )}
            </>
          }
          rightContent={
            <div />
          }
        />
      </div>

    </div>
  );
};

export default ConfirmationLayout;