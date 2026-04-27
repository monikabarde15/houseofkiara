import React, { useState } from "react";
import "../../../../styles/LYP/wizard/formPanels.css";
import { Send,Check  } from 'lucide-react';

const Step4 = ({ formData, photos, onBack , setStep,setSubmitted}) => {
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState("");


    // Submit and Validation
    const handleSubmit = async () => {
        if (!agreed) {
            setError("Please agree to the terms to submit");
            return;
        }

        setError("");

        try {
            const formDataToSend = new FormData();

            // append fields
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value || "");
            });

            // append photos
            photos.forEach((file) => {
                formDataToSend.append("photos[]", file.file);
            });

            // API call 
            await fetch("/api/lister-submissions", {
                method: "POST",
                body: formDataToSend
            });

            setSubmitted(true);
            // window.scrollTo({ top: 0, behavior: "smooth" });

        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="lyp-step">

            {/* HEADER */}
            <div className="lyp-step__header">
                <div className="lyp-step__eyebrow">STEP 4 OF 4</div>

                <h2 className="lyp-step__title">
                    Review & submit
                </h2>

                <p className="lyp-step__subtitle">
                    Everything look right? Tap Edit next to any section to go back and change something.
                </p>
            </div>

            {/* ===== REVIEW SECTIONS ===== */}

            <div className="lyp-review-section">

                {/* YOUR DETAILS */}
                <div className="lyp-review-block">

                    <div className="lyp-review-header">
                        <div className="lyp-review-title">YOUR DETAILS</div>
                        <button className = "lyp-edit-btn" onClick={() => onBack(1)}>EDIT</button>
                    </div>

                    <div className="lyp-review-row">
                        <span>Name</span>
                        <span>{formData?.full_name || "-"}</span>
                    </div>

                    <div className="lyp-review-row">
                        <span>City</span>
                        <span>{formData?.city || "-"}</span>
                    </div>

                    <div className="lyp-review-row">
                        <span>Email</span>
                        <span>{formData?.email || "-"}</span>
                    </div>

                    <div className="lyp-review-row">
                        <span>WhatsApp</span>
                        <span>{formData?.mobile || "-"}</span>
                    </div>

                </div>

                {/* PIECE DETAILS */}
                <div className="lyp-review-block">

                    <div className="lyp-review-header">
                    <div className="lyp-review-title">PIECE DETAILS</div>
                    <button className = "lyp-edit-btn" onClick={() => onBack(2)}>EDIT</button>
                    </div>
                    <div className="lyp-review-row">
                        <span>Type</span>
                        <span>{formData?.piece_type || "-"}</span>
                    </div>

                    <div className="lyp-review-row">
                        <span>Designer / Brand</span>
                        <span>{formData?.designer || "-"}</span>
                    </div>

                    <div className="lyp-review-row">
                        <span>Colour</span>
                        <span>{formData?.color || "-"}</span>
                    </div>

                    <div className="lyp-review-row">
                        <span>Size</span>
                        <span>{formData?.size || "-"}</span>
                    </div>

                    <div className="lyp-review-row">
                        <span> Original Price</span>
                        <span>₹ {formData?.original_price || "-"}</span>
                    </div>

                    <div className="lyp-review-row">
                        <span> Condition</span>
                        <span>
                            {formData?.condition
                                ? formData.condition.charAt(0).toUpperCase() + formData.condition.slice(1)
                                : "-"}
                        </span>
                    </div>

                    <div className="lyp-review-row">
                        <span> Outcome</span>
                        <span>
                            {formData?.outcome === "rent"
                                ? "Rent It Out"
                                : formData?.outcome === "sell"
                                    ? "Sell It"
                                    : formData?.outcome === "both"
                                        ? "Open to Both"
                                        : "-"}
                        </span>
                    </div>

                </div>

                

                {/* PHOTOS */}
                <div className="lyp-review-block">

                    <div className="lyp-review-header">
                        <div className="lyp-review-title">PHOTOS</div>
                        <button className="lyp-edit-btn" onClick={() => onBack(3)}>EDIT</button>
                    </div>

                    <div className="lyp-review-row">
                        <span>Photos</span>
                        <span>{photos.length} uploaded</span>
                    </div>

                    <div className="lyp-review-photos-grid">
                        {photos.slice(0, 5).map((photo, i) => (
                            <div key={i} className="lyp-review-photo">
                                <img src={photo.preview} alt="" />
                            </div>
                        ))}
                    </div>

                </div>

            </div>

            {/* ===== BEFORE SUBMIT ===== */}

            <div className="lyp-before-submit">

                <div className="lyp-before-title">
                    BEFORE YOU SUBMIT
                </div>

                <div className="lyp-before-item">✓ We review within 48 hours</div>
                <div className="lyp-before-item">✓ Pickup & photography handled by us</div>
                <div className="lyp-before-item">✓ Payout after successful rental/sale</div>

            </div>

            {/* ===== CHECKBOX ===== */}

            <div
                className="lyp-checkbox-row"
                onClick={() => {
                    const newValue = !agreed;
                    setAgreed(newValue);

                    // 🔥 clear error when user fixes it
                    if (newValue && error) {
                        setError("");
                    }
                }}
            >

                {/* Checkbox */}
                <div
                    className={`lyp-checkbox ${agreed ? "checked" : ""}`}
                >
                    {/* {agreed && "✓"} */}
                    {agreed && <Check size={12} />}
                </div>

                {/* Label */}
                <div className="lyp-checkbox-label">

                    I confirm I own or have the right to list this piece, and agree to House of Kaira's{" "}

                    <span
                        className="lyp-link"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Lister T&Cs
                    </span>,{" "}

                    <span
                        className="lyp-link"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Commission Policy
                    </span>,{" "}

                    and{" "}

                    <span
                        className="lyp-link"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Damage & Care Policy
                    </span>.

                </div>

            </div>

            {error && (
                <div className="lyp-error-text">
                    {error}
                </div>
            )}

            {/* ===== CTA ===== */}

            <div className="lyp-step__cta">

                

                <button className="lyp-btn-back" onClick={() => onBack(3)}>
                    <span className="lyp-btn-back-icon">‹</span>
                    BACK
                </button>

                <div className="lyp-step__progress">
                    Step 4 of 4
                </div>

                <button
                    className="lyp-btn-primary lyp-btn-submit"
                    onClick={handleSubmit}
                >
                    <Send size={16} className="lyp-btn-icon" />
                    <span>SUBMIT MY PIECE</span>
                </button>

            </div>

        </div>
    );
};

export default Step4;