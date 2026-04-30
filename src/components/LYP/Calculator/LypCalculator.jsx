import '../../../styles/LYP/calculator.css'
import { useState } from "react";
import { CircleAlert } from 'lucide-react';
import { CiCircleAlert } from 'react-icons/ci';

export default function EarningsCalculator() {
    const [price, setPrice] = useState(125000);
    const [mode, setMode] = useState("rent");


    //----------For Slider-------------------
    const min = 25000;
    const max = 500000;

    const percent = ((price - min) / (max - min)) * 100;

    // ---------------- LOGIC ----------------

    const rentalRate = Math.round(price * 0.23 / 1000) * 1000;
    const perRental = Math.round(rentalRate * 0.45);
    const annual = perRental * 6;

    const resalePrice = Math.round(price * 0.5 / 1000) * 1000;
    const payout = Math.round(resalePrice * 0.65);

    return (
        <section className="lyp-calc">

            <div className="lyp-calc-grid">

                {/* LEFT */}
                <div className="lyp-calc-left">
                    <div className="lyp-calc-eyebrow">INDICATIVE EARNINGS</div>

                    <h2 className="lyp-calc-title">
                        What could <em>your piece</em> earn?
                    </h2>

                    <p className="lyp-calc-sub">
                        A quick preview based on your piece’s original retail value and whether you choose rental, resale, or both.
                    </p>

                    <p className="lyp-calc-note">
                        <CircleAlert />
                        Illustrative only. Your final commission — 45–55% for rental, 65–85% for resale — depends on category and
                        condition. Nothing locked in until you confirm.
                    </p>
                </div>

                {/* RIGHT */}
                <div className="lyp-calc-card">

                    {/* Price */}
                    <div className="lyp-calc-row">
                        <span className="lyp-calc-row-left">PIECE ORIGINAL VALUE</span>
                        <span className="lyp-calc-row-right">₹{price.toLocaleString()}</span>
                    </div>

                    <input
                        type="range"
                        min="25000"
                        max="500000"
                        step="5000"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        style={{
                            background: `linear-gradient(to right, var(--sage) 0%, var(--sage) ${percent}%, #d6ded0 ${percent}%, #d6ded0 100%)`
                        }}
                    />

                    <div className="lyp-calc-path-label">YOUR PATH</div>

                    {/* Mode */}
                    <div className="lyp-calc-mode">
                        <button
                            className={mode === "rent" ? "active" : ""}
                            onClick={() => setMode("rent")}
                        >
                            RENT IT
                        </button>

                        <button
                            className={mode === "sell" ? "active" : ""}
                            onClick={() => setMode("sell")}
                        >
                            SELL IT
                        </button>
                    </div>

                    {/* Results */}
                    <div className="lyp-calc-results">

                        {mode === "rent" ? (
                            <>
                                <div className="box">
                                    <div className="label">PER RENTAL</div>
                                    <div className="value">₹{perRental.toLocaleString()}</div>
                                    <div className="sub">Your earning (45%) of ₹{rentalRate.toLocaleString()} </div>
                                </div>

                                <div className="box highlight">
                                    <div className="label">ANNUAL POTENTIAL</div>
                                    <div className="value">₹{annual.toLocaleString()}</div>
                                    <div className="sub">At 6 bookings / year</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="box">
                                    <div className="label">RESALE PRICE</div>
                                    <div className="value">₹{resalePrice.toLocaleString()}</div>
                                    <div className="sub">Estimated Listing Price</div>
                                </div>

                                <div className="box highlight">
                                    <div className="label">YOUR PAYOUT</div>
                                    <div className="value">₹{payout.toLocaleString()}</div>
                                    <div className="sub">65% Lister Share</div>
                                </div>
                            </>
                        )}

                    </div>

                </div>

            </div>
        </section>
    );
}