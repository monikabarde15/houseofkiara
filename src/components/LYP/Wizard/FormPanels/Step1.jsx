import React from "react";
import { useState } from "react";
import "../../../../styles/LYP/wizard/formPanels.css";

const Step1 = ({ onNext, formData, setFormData }) => {

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (formData.full_name.trim().length < 2) {
            newErrors.full_name = "Please enter your full name";
        }

        if (!formData.city) {
            newErrors.city = "Please select your city";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!/^[0-9]{10}$/.test(formData.mobile)) {
            newErrors.mobile = "Please enter a valid 10-digit number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    return (
        <div className="lyp-step">

            {/* HEADER */}
            <div className="lyp-step__header">
                <div className="lyp-step__eyebrow">STEP 1 OF 4</div>

                <h2 className="lyp-step__title">
                    Tell us about yourself
                </h2>

                <p className="lyp-step__subtitle">
                    We'll use this to confirm your submission and coordinate pickup. Takes about 60 seconds.
                </p>
            </div>

            {/* FORM */}
            <div className="lyp-form">

                {/* ROW 1 */}
                <div className="lyp-form__row">

                    <div className="lyp-field">
                        <label className="lyp-label">
                            FULL NAME <span>*</span>
                        </label>
                        <input
                            id="full_name"
                            type="text"
                            value={formData.full_name}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    full_name: e.target.value
                                }))
                            }
                            placeholder="As on your bank account"
                            className="lyp-input"
                        />
                        {errors.full_name && (
                            <div className="lyp-error">{errors.full_name}</div>
                        )}
                    </div>


                    <div className="lyp-field lyp-field--select">
                        <label className="lyp-label">
                            CITY <span>*</span>
                        </label>
                        <select
                            id="city"
                            value={formData.city}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    city: e.target.value
                                }))
                            }
                            className="lyp-input"
                        >
                            <option value="" disabled>Select your city</option>

                            <option>Indore</option>
                            <option>Mumbai</option>
                            <option>Delhi / NCR</option>
                            <option>Bengaluru</option>
                            <option>Hyderabad</option>
                            <option>Chennai</option>
                            <option>Pune</option>
                            <option>Ahmedabad</option>
                            <option>Jaipur</option>
                            <option>Kolkata</option>
                            <option>Surat</option>
                            <option>Other</option>
                        </select>
                        {errors.city && (
                            <div className="lyp-error">{errors.city}</div>
                        )}
                    </div>
                </div>

                {/* ROW 2 */}
                <div className="lyp-form__row">

                    <div className="lyp-field">
                        <label className="lyp-label">
                            EMAIL ADDRESS <span>*</span>
                        </label>
                        <input 
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    email: e.target.value
                                }))
                            }
                            className="lyp-input"
                            placeholder="your@email.com"
                        />

                        <div className="lyp-hint">
                            Submission confirmation will be sent here
                        </div>
                        {errors.email && (
                            <div className="lyp-error">{errors.email}</div>
                        )}
                    </div>


                        {/* PHONE */}
                    <div className="lyp-field">
                        <label className="lyp-label">
                            WHATSAPP NUMBER <span>*</span>
                        </label>

                        <div className="lyp-phone">
                            <div className="lyp-phone__prefix">IN +91</div>
                            <input
                                id="mobile"
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        mobile: e.target.value
                                    }))
                                }
                                placeholder="98765 43210"
                                className="lyp-input"
                            />
                        </div>

                        <div className="lyp-hint">
                            We'll coordinate pickup over WhatsApp
                        </div>
                        {errors.mobile && (
                            <div className="lyp-error">{errors.mobile}</div>
                        )}
                    </div>
                </div>

                {/* ROW 3 */}
                <div className="lyp-field lyp-field--select lyp-field--full">
                    <label className="lyp-label">
                        YOU ARE LISTING AS
                    </label>
                    <select
                        id="lister_type"
                        value={formData.lister_type || ""}
                        onChange={(e) =>
                            setFormData(prev => ({
                                ...prev,
                                lister_type: e.target.value
                            }))
                        }
                        className="lyp-input"
                    >
                        <option disabled >Select one</option>

                        <option>Individual</option>
                        <option>Boutique / brand</option>
                        <option>Received as a gift</option>
                    </select>
                </div>

            </div>

            {/* CTA */}
            <div className="lyp-step__cta">

                <div className="lyp-step__progress">
                    Step 1 of 4
                </div>

                <button className="lyp-btn-primary"
                    onClick={(e) => {
                        e.preventDefault();
                        if (validate()) {
                            onNext(); // Move to step 2
                        }
                    }}>
                    CONTINUE TO PIECE DETAILS
                    <span className="lyp-btn-arrow">›</span>
                </button>

            </div>

        </div>
    );
};

export default Step1;