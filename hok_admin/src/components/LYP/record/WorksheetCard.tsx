// src/components/LYP/record/WorksheetCard.tsx

import React, { useState } from "react";
import {
  Submission,
  Assessment,
  Mode,
  Grade,
  Size,
} from "../types/submission.types";
import { WorksheetGrid } from "./WorksheetGrid";
import { TapeBlock } from "./TapeBlock";
import { StorefrontPreview } from "./StorefrontPreview";
import { inr } from "../utils/formatter";
import { GRADES, MODES } from "../utils/constants";
import { submissionService } from "../services/submissionService";
import toast from "react-hot-toast";
import "./styles/WorksheetCard.css";

interface WorksheetCardProps {
  submission: Submission;
  onUpdate: () => void;
}

export const WorksheetCard: React.FC<WorksheetCardProps> = ({
  submission,
  onUpdate,
}) => {
  const getDefaultAssessment = (): Assessment => {
    const existing = submission.assessment;

    const parseCurrency = (val: any): number => {
      if (!val) return 0;
      if (typeof val === "number") return val;
      const clean = String(val).replace(/[^0-9.]/g, "");
      const parsed = parseFloat(clean);
      return isNaN(parsed) ? 0 : parsed;
    };

    const askRent = parseCurrency(
      (submission as any).askRent || submission.expectation?.rent,
    );
    const askSell = parseCurrency(
      (submission as any).askSell || submission.expectation?.sell,
    );
    const originalPrice = parseCurrency(submission.originalPrice);

    const retailPrice =
      existing && existing.retailPrice > 0
        ? existing.retailPrice
        : originalPrice || 110000;
    const resalePrice =
      existing && existing.resalePrice > 0
        ? existing.resalePrice
        : askSell > 0
          ? askSell
          : Math.round(retailPrice * 0.45);

    const defaultRent =
      Math.round((retailPrice * 0.11) / 500) * 500 ||
      (resalePrice ? Math.round((resalePrice * 0.25) / 500) * 500 : 12000);
    const priceStd =
      existing && existing.priceStd > 0
        ? existing.priceStd
        : askRent > 0
          ? askRent
          : defaultRent;

    const designerStr = submission.designer || "SG";
    const initials =
      designerStr
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .substring(0, 3)
        .toUpperCase() || "HOK";
    const defaultSku =
      existing?.sku ||
      submission.sku ||
      (submission as any)?.productId ||
      `HOK-${initials}-001`;

    const subMode: Mode =
      submission.intent === "Sell it"
        ? "Preloved"
        : submission.intent === "Rent it"
          ? "Rental"
          : "Rental/Preloved";

    return {
      sku: defaultSku,
      name: existing?.name || submission.piece || "",
      mode: existing?.mode || subMode,
      grade: existing?.grade || "Pristine",
      sizeLabel:
        existing?.sizeLabel ||
        (submission.size as Size) ||
        "Custom / Free Size",
      measurements: existing?.measurements || null,
      priceStd,
      priceExt:
        existing && existing.priceExt > 0
          ? existing.priceExt
          : Math.round(priceStd * 1.5),
      perDay:
        existing && existing.perDay > 0
          ? existing.perDay
          : Math.round(priceStd / 4),
      minDays: existing?.minDays || 4,
      deposit:
        existing && existing.deposit > 0
          ? existing.deposit
          : Math.round(retailPrice * 0.2 || priceStd * 1.5),
      resalePrice,
      minOffer:
        existing && existing.minOffer > 0
          ? existing.minOffer
          : Math.round(resalePrice * 0.8),
      retailPrice,
      retailVerifiedVia: existing?.retailVerifiedVia || "Retail listing",
      payoutPctRental: existing?.payoutPctRental || 40,
      payoutPctResale: existing?.payoutPctResale || 75,
    };
  };

  const [assessment, setAssessment] = useState<Assessment>(
    getDefaultAssessment(),
  );

  const handleAssessmentChange = async (updates: Partial<Assessment>) => {
    const updated = { ...assessment, ...updates };
    setAssessment(updated);
    try {
      await submissionService.updateSubmission(submission.subid, {
        assessment: updated,
      });
      onUpdate();
    } catch (err: any) {
      toast.error("Failed to update assessment pricing");
    }
  };

  const isCustomSize = assessment.sizeLabel === "Custom / Free Size";
  const mode = assessment.mode;
  const grade = assessment.grade;
  const isFair = grade === "Fair";

  // Calculate meaning lines
  const hasRental = mode === "Rental" || mode === "Rental/Preloved";
  const hasPreloved = mode === "Preloved" || mode === "Rental/Preloved";
  const hasRentalPrice = assessment.priceStd > 0 || assessment.priceExt > 0;
  const hasPrelovedPrice = assessment.resalePrice > 0;

  return (
    <div className="worksheet-card card">
      <div className="worksheet-header">
        <span className="worksheet-title">Assessment & Pricing Worksheet</span>
        <span className="worksheet-note">
          Approving turns exactly this into the Draft product
        </span>
      </div>

      <div className="card-bd">
        <WorksheetGrid
          assessment={assessment}
          submission={submission}
          onChange={handleAssessmentChange}
        />

        {/* Tape Block - hidden until Custom size */}
        {isCustomSize && (
          <TapeBlock
            measurements={assessment.measurements}
            onChange={(measurements) =>
              handleAssessmentChange({ measurements })
            }
          />
        )}

        {/* Storefront Preview */}
        {isCustomSize && (
          <StorefrontPreview
            measurements={assessment.measurements}
            sizeLabel={assessment.sizeLabel}
          />
        )}

        {/* Meaning Line */}
        <div className="worksheet-meaning">
          {hasRental && (
            <div className="meaning-line">
              {hasRentalPrice ? (
                <>
                  Per standard rental: lister earns{" "}
                  <strong>
                    {inr(
                      assessment.priceStd * (assessment.payoutPctRental / 100),
                    )}
                  </strong>{" "}
                  · HOK <strong>{inr(assessment.priceStd * (60 / 100))}</strong>{" "}
                  · customer pays <strong>{inr(assessment.priceStd)}</strong> +
                  18% GST · deposit <strong>{inr(assessment.deposit)}</strong>{" "}
                  on WhatsApp/UPI
                </>
              ) : (
                <span className="meaning-line-empty">
                  No rental pricing yet — you can still approve; the Draft holds
                  publish until pricing is done.
                </span>
              )}
            </div>
          )}

          {hasPreloved && (
            <div className="meaning-line">
              {hasPrelovedPrice ? (
                <>
                  On the preloved sale: lister earns{" "}
                  <strong>
                    {inr(
                      assessment.resalePrice *
                        (assessment.payoutPctResale / 100),
                    )}
                  </strong>{" "}
                  · HOK{" "}
                  <strong>{inr(assessment.resalePrice * (25 / 100))}</strong> ·
                  customer pays <strong>{inr(assessment.resalePrice)}</strong> +
                  5% GST
                  {assessment.minOffer > 0 &&
                    ` · offers floor ${inr(assessment.minOffer)}`}
                </>
              ) : (
                <span className="meaning-line-empty">
                  No preloved price yet — set it before publish.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
