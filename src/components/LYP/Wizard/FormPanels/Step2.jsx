import React, { useState } from "react";
import "../../../../styles/LYP/wizard/formPanels.css";
import ConditionCard from "./components/ConditionCard";
import OutcomeCard from "./components/OutcomeCard";
import { Sparkle, Diamond, Circle } from "lucide-react";

const Step2 = ({ onNext, onBack }) => {

    const validate = () => {
        const newErrors = {};

        const pieceType = document.getElementById("piece_type").value;
        const designer = document.getElementById("designer").value.trim();
        const price = document.getElementById("price").value;

        if (!pieceType) {
            newErrors.piece_type = "Please select piece type";
        }

        if (designer.length < 1) {
            newErrors.designer = "Please enter designer or brand";
        }

        if (!price || Number(price) <= 0) {
            newErrors.price = "Please enter a valid price";
        }

        if (!condition) {
            newErrors.condition = "Please select condition";
        }

        if (!outcome) {
            newErrors.outcome = "Please select your preferred outcome";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [condition, setCondition] = useState("");
    const [outcome, setOutcome] = useState("");
    const [errors, setErrors] = useState({});

    return (
        <div className="lyp-step">

            {/* HEADER */}
            <div className="lyp-step__header">
                <div className="lyp-step__eyebrow">STEP 2 OF 4</div>

                <h2 className="lyp-step__title">
                    About the piece
                </h2>

                <p className="lyp-step__subtitle">
                    Help us understand what you're listing so we can assess and price it correctly.
                </p>
            </div>

            {/* BASIC FORM */}
            <div className="lyp-form">

                {/* Row 1 */}
                <div className="lyp-form__row">
                    {/* Select your Piece */}
                    <div className="lyp-field lyp-field--select">
                        <div className="lyp-field lyp-field--select">
                            <label className="lyp-label">
                                PIECE TYPE <span>*</span>
                            </label>

                            <select
                                id="piece_type"
                                className="lyp-input"
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>Select piece type</option>

                                <optgroup label="Women’s">
                                    <option>Bridal Lehenga</option>
                                    <option>Reception / Party Lehenga</option>
                                    <option>Saree</option>
                                    <option>Sharara Set</option>
                                    <option>Anarkali</option>
                                    <option>Palazzo Set</option>
                                    <option>Kurta Set</option>
                                    <option>Blouse (standalone)</option>
                                    <option>Dupatta (standalone)</option>
                                </optgroup>

                                <optgroup label="Men’s">
                                    <option>Sherwani</option>
                                    <option>Bandhgala / Jodhpuri</option>
                                    <option>Kurta Pyjama</option>
                                    <option>Indo-Western Set</option>
                                </optgroup>

                                <optgroup label="Other">
                                    <option>Accessories</option>
                                    <option>Other</option>
                                </optgroup>

                            </select>
                            {errors.piece_type && (
                                <div className="lyp-error">{errors.piece_type}</div>
                            )}
                        </div>
                    </div>

                    {/* Deisgner Brand Selection */}
                    <div className="lyp-field">
                        <label className="lyp-label">DESIGNER / BRAND <span>*</span></label>
                        <input id="designer" className="lyp-input" />
                        {errors.designer && (
                            <div className="lyp-error">{errors.designer}</div>
                        )}
                    </div>
                </div>

                {/* Row 2 */}
                <div className="lyp-form__row">

                    {/* Color Selection */}
                    <div className="lyp-field">
                        <label className="lyp-label">COLOUR</label>
                        <input className="lyp-input" />
                    </div>

                    {/* SIZE */}
                    <div className="lyp-field lyp-field--select">
                        <label className="lyp-label">SIZE</label>

                        <select
                            id="size"
                            className="lyp-input"
                            defaultValue=""
                        >
                            <option value="" disabled>Select size</option>

                            <option>XS (UK 6)</option>
                            <option>S (UK 8)</option>
                            <option>M (UK 10)</option>
                            <option>L (UK 12)</option>
                            <option>XL (UK 14)</option>
                            <option>XXL (UK 16)</option>
                            <option>Free size / Adjustable</option>
                            <option>Custom</option>
                        </select>
                    </div>

                </div>

                {/* Row 3 */}
                <div className="lyp-form__row">

                    {/* Original Price Selection */}

                    <div className="lyp-field">
                        <label className="lyp-label">ORIGINAL PURCHASE PRICE (₹) *</label>
                        <input id="price" type="number" className="lyp-input" />
                        {errors.price && (
                            <div className="lyp-error">{errors.price}</div>
                        )}
                    </div>

                    {/* Year of Purchase Selection */}
                    <div className="lyp-field lyp-field--select">
                        <label className="lyp-label">YEAR OF PURCHASE</label>

                        <select
                            id="year_purchased"
                            className="lyp-input"
                            defaultValue=""
                        >
                            <option value="" disabled>Select year</option>

                            <option>2025</option>
                            <option>2024</option>
                            <option>2023</option>
                            <option>2022</option>
                            <option>2021</option>
                            <option>2020</option>
                            <option>2019</option>
                            <option>2018 or earlier</option>
                        </select>
                    </div>
                </div>

            </div>

            {/* CONDITION (placeholder) */}
            <div className="lyp-condition">

                <label className="lyp-label">
                    SELF-ASSESSED CONDITION <span>*</span>
                </label>

                    <ConditionCard
                        label="Pristine"
                        desc="Unworn or worn once for fittings only. All original tags / packaging intact."
                        color="var(--sage)"
                        selected={condition === "pristine"}
                        onClick={() => setCondition("pristine")}
                    />

                    <ConditionCard
                        label="Excellent"
                        desc="Worn once for an event. No visible flaws or alterations. Professionally cleaned."
                        color="var(--gold)"
                        selected={condition === "excellent"}
                        onClick={() => setCondition("excellent")}
                    />

                    <ConditionCard
                        label="Good"
                        desc="Worn 2–3 times. Minor wear visible. Any alterations or repairs noted below."
                        color="var(--terracotta)"
                        selected={condition === "good"}
                        onClick={() => setCondition("good")}
                    />

                {errors.condition && (
                    <div className="lyp-error">{errors.condition}</div>
                )}

            </div>

            {/* OUTCOME (placeholder) */}

            <div className="lyp-outcome-wrapper">

                <label className="lyp-label">
                    PREFERRED OUTCOME <span>*</span>
                </label>
                <div className="lyp-outcome">

                    <OutcomeCard
                        icon={<Sparkle />}
                        title="Rent It Out"
                        desc="Earn on every booking"
                        variant="dark"
                        selected={outcome === "rent"}
                        onClick={() => setOutcome("rent")}
                    />

                    <OutcomeCard
                        icon={<Diamond />}
                        title="Sell It"
                        desc="One-time payout"
                        variant="dark"
                        selected={outcome === "sell"}
                        onClick={() => setOutcome("sell")}
                    />

                    <OutcomeCard
                        icon={<Circle />}
                        title="Open to Both"
                        desc="Let's discuss what's best"
                        variant="sage"
                        selected={outcome === "both"}
                        onClick={() => setOutcome("both")}
                    />
                </div>

                {errors.outcome && (
                    <div className="lyp-error">{errors.outcome}</div>
                )}

            </div>

            {/* NOTES */}
            <div className="lyp-field lyp-field--full">
                <label className="lyp-label">ADDITIONAL NOTES</label>

                <textarea
                    id="notes"
                    className="lyp-input lyp-textarea"
                    rows={4}
                    placeholder="Add any details about wear, alterations, or measurements..."
                ></textarea>
            </div>

            {/* CTA BUTTOMS AND BACK */}
            <div className="lyp-step__cta">

                <button className="lyp-btn-back" onClick={onBack}>
                    <span className="lyp-btn-back-icon">‹</span>
                    BACK
                </button>

                <div className="lyp-step__progress">
                    Step 2 of 4
                </div>

                <button
                    className="lyp-btn-primary"
                    onClick={(e) => {
                        e.preventDefault();
                        if (validate()) {
                            onNext(); // move to step 3
                        }
                    }}
                >
                    CONTINUE TO PHOTOS
                    <span className="lyp-btn-arrow">›</span>
                </button>

            </div>

        </div>
    );
};

export default Step2;