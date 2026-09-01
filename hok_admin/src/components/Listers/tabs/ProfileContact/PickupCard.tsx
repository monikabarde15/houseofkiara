import React, { useState } from "react";
import { Lister } from "../../types/lister.types";
import { validatePIN } from "../../utils/validators";
import "./styles/PickupCard.css";

interface PickupCardProps {
    lister: Lister | null;
    onUpdate: (updates: Partial<Lister>) => void;
    isCreateMode?: boolean;
}

const EMPTY_PICKUP = {
    line1: "",
    line2: "",
    city: "",
    state: "",
    pin: "",
};

export const PickupCard: React.FC<PickupCardProps> = ({
    lister,
    onUpdate,
    isCreateMode = false,
}) => {

    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!lister && !isCreateMode) {
        return null;
    }

    const pickup = lister?.pickup || EMPTY_PICKUP;

    const updatePickup = (field: string, value: string) => {

        const updated = {
            ...pickup,
            [field]: value,
        };

        if (field === "pin") {

            if (value && !validatePIN(value)) {

                setErrors((prev) => ({
                    ...prev,
                    pin: "PIN code must be 6 digits.",
                }));

            } else {

                setErrors((prev) => ({
                    ...prev,
                    pin: "",
                }));

            }
        }

        onUpdate({
            pickup: updated,
        });
    };

    const copyContactAddress = () => {

        if (!lister) return;

        const address = lister.address;

        onUpdate({
            pickup: {
                line1: address.line1,
                line2: address.line2,
                city: address.city,
                state: address.state,
                pin: address.pin,
            },
        });
    };

    return (

        <div className="pickup-card card">

            <div className="card-hd">

                <span className="card-title">
                    Pickup & Logistics
                </span>

            </div>

            <div className="card-bd">

                {/* Copy Link */}

                <div className="pickup-copy">

                    <button
                        type="button"
                        className="qlnk"
                        onClick={copyContactAddress}
                    >
                        Same as contact address →
                    </button>

                </div>

                {/* Address Line 1 */}

                <div className="fld">

                    <label className="fld-label">
                        Pickup Address Line 1
                    </label>

                    <input
                        type="text"
                        className="fld-input"
                        placeholder="House / flat, building, street"
                        value={pickup.line1 || ""}
                        onChange={(e) =>
                            updatePickup("line1", e.target.value)
                        }
                    />

                </div>

                {/* Address Line 2 */}

                <div className="fld">

                    <label className="fld-label">
                        Pickup Address Line 2{" "}
                        <span className="fld-label-optional">
                            — optional
                        </span>
                    </label>

                    <input
                        type="text"
                        className="fld-input"
                        placeholder="Area, locality, landmark"
                        value={pickup.line2 || ""}
                        onChange={(e) =>
                            updatePickup("line2", e.target.value)
                        }
                    />

                </div>

                {/* City + State */}

                <div className="fld g2">

                    <div className="fld-group">

                        <label className="fld-label">
                            Pickup City
                        </label>

                        <input
                            type="text"
                            className="fld-input"
                            placeholder="Enter city"
                            value={pickup.city || ""}
                            onChange={(e) =>
                                updatePickup(
                                    "city",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="fld-group">

                        <label className="fld-label">
                            Pickup State
                        </label>

                        <input
                            type="text"
                            className="fld-input"
                            placeholder="State"
                            value={pickup.state || ""}
                            onChange={(e) =>
                                updatePickup(
                                    "state",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

                {/* PIN + Preferences */}

                <div className="fld g2">

                    <div className="fld-group">

                        <label className="fld-label">
                            Pickup PIN Code
                        </label>

                        <input
                            type="text"
                            maxLength={6}
                            className={`fld-input fld-monospace ${
                                errors.pin
                                    ? "fld-error"
                                    : ""
                            }`}
                            placeholder="452001"
                            value={pickup.pin || ""}
                            onChange={(e) =>
                                updatePickup(
                                    "pin",
                                    e.target.value
                                )
                            }
                        />

                        {errors.pin && (
                            <div className="fld-error-text">
                                {errors.pin}
                            </div>
                        )}

                        <div className="fld-hint">
                            Drives serviceability and the
                            delivery charge at checkout.
                        </div>

                    </div>

                    <div className="fld-group">

                        <label className="fld-label">
                            Pickup Preferences
                        </label>

                        <input
                            type="text"
                            className="fld-input"
                            placeholder="e.g. Weekdays after 5pm"
                            value={lister?.pickupPrefs || ""}
                            onChange={(e) =>
                                onUpdate({
                                    pickupPrefs:
                                        e.target.value,
                                })
                            }
                        />

                        <div className="fld-hint">
                            Whatever they flagged on List
                            Your Piece lands here — honor
                            it when booking couriers.
                        </div>

                    </div>

                </div>

                                {/* End card body */}

            </div>

            {/* Footer */}

            <div className="card-ft">

                <button
                    type="button"
                    className="btn btn-gold btn-sm"
                    onClick={() => onUpdate({})}
                >
                    Save
                </button>

            </div>

        </div>

    );
};

export default PickupCard;