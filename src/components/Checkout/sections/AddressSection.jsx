// src\components\Checkout\sections\AddressSection.jsx
import FormSection from "./components/FormSection";
import "../../../styles/checkout/sections/components/field.css";
import "../../../styles/checkout/sections/address-section.css";
import Field from "./components/Field";
import { useState, useEffect } from "react";

// All Indian States and Union Territories
const INDIAN_STATES_AND_UTS = [

  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",

];

export default function DeliveryAddress({
  submitCount,
  setFieldErrors,
}) {
  const [sameBilling, setSameBilling] = useState(true);
  const [gstEnabled, setGstEnabled] = useState(false);

  const [formData, setFormData] = useState({
    address1: "",
    city: "",
    state: "Madhya Pradesh",
    pin: "",
  });

  const [errors, setErrors] = useState({});

  // CHANGE HANDLER
  const handleChange = (field, value) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    /* live clear */
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // VALIDATION FUNCTION

  const validateAddressFields = () => {

    const nextErrors = {};

    /* address */
    if (!formData.address1.trim()) {
      nextErrors.address1 =
        "Address line 1 is required";
    }

    /* city */
    if (!formData.city.trim()) {
      nextErrors.city =
        "City is required";
    }

    /* state */
    if (!formData.state.trim()) {
      nextErrors.state =
        "Please select a state";
    }

    /* pin */
    if (!formData.pin.trim()) {

      nextErrors.pin =
        "PIN code is required";

    } else if (!/^\d{6}$/.test(formData.pin)) {

      nextErrors.pin =
        "PIN code must be 6 digits";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  useEffect(() => {

    const nextErrors = {};

    if (!formData.address1.trim()) {
      nextErrors[
        "Address line 1 (Delivery Address)"
      ] = true;
    }

    if (!formData.city.trim()) {
      nextErrors[
        "City (Delivery Address)"
      ] = true;
    }

    if (!formData.pin.trim() ||
      !/^\d{6}$/.test(formData.pin)
    ) {
      nextErrors[
        "PIN code (Delivery Address)"
      ] = true;
    }

    setFieldErrors((prev) => {

      const updated = { ...prev };

      /* clear old section errors */
      Object.keys(updated).forEach((key) => {

        if (key.includes("Delivery Address")) {
          delete updated[key];
        }
      });

      return {
        ...updated,
        ...nextErrors,
      };
    });

    if (submitCount > 0) {
      validateAddressFields();
    }

  }, [submitCount, formData]);


  return (
    <FormSection>
      <div className="address-section">

        {/* HEADER */}
        <div className="checkout-section-header">
          <div className="checkout-section-number">02</div>
          <h2 className="checkout-section-title">
            Delivery <em>Address</em>
          </h2>
        </div>

        {/* ADDRESS LINE 1 */}
        <div className="checkout-fg">

          <Field
            label="ADDRESS LINE 1"
            required
            error={errors.address1}
          >
            <input
              id="address-line-1"
              placeholder="Flat / house number, building name"
              value={formData.address1}
              onChange={(e) =>
                handleChange("address1", e.target.value)
              }
            />
          </Field>

        </div>

        {/* ADDRESS LINE 2 */}
        <div className="checkout-fg">
          <div className="checkout-field">
            <label>
              ADDRESS LINE 2
              <span className="checkout-label-optional">(Optional)</span>
            </label>
            <input placeholder="Street, locality, area" />
          </div>
        </div>

        {/* CITY + STATE + PIN */}
        <div className="checkout-fg checkout-fg--c3">

          <Field
            label="CITY"
            required
            error={errors.city}
          >
            <input
              id="city"
              placeholder="City"
              value={formData.city}
              onChange={(e) =>
                handleChange("city", e.target.value)
              }
            />
          </Field>



          <Field
            label="STATE"
            required
            error={errors.state}
          >
            <select
              id="state"
              value={formData.state}
              onChange={(e) =>
                handleChange("state", e.target.value)
              }

            >
              <option value="">Select state</option>
              {INDIAN_STATES_AND_UTS.map((state) => (

                <option
                  key={state}
                  value={state}
                >
                  {state}
                </option>

              ))}
            </select>
          </Field>



          <Field
            label="PIN CODE"
            required
            error={errors.pin}
          >
            <input
              id="pin-code"
              inputMode="numeric"
              autoComplete="postal-code"
              pattern="[0-9]*"
              maxLength={6}
              value={formData.pin}
              onChange={(e) => {

                /*
                  allow digits only
                */
                const numeric =
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                handleChange(
                  "pin",
                  numeric
                );

              }}
            />
          </Field>

        </div>

        {/* DELIVERY INSTRUCTIONS */}
        <div className="checkout-fg">
          <div className="checkout-field">
            <label>
              DELIVERY INSTRUCTIONS
              <span className="checkout-label-optional">(Optional)</span>
            </label>
            <textarea placeholder="Eg. Leave with Security, Call before delivery.." />
          </div>
        </div>

        {/* BILLING TOGGLE */}
        <div className="checkout-toggle-block">

          <label className="checkout-checkbox">
            <input
              type="checkbox"
              checked={sameBilling}
              onChange={() => setSameBilling(!sameBilling)}
            />
            <span className="checkout-checkbox-box"></span>
            <span>Billing address is the same as delivery address</span>
          </label>

          {/* Billing PANEL */}
          <div className={`checkout-panel ${!sameBilling ? "open" : ""}`}>

            {/* Address line 1 */}
            <div className="checkout-fg">
              <div className="checkout-field">
                <input placeholder="Address line 1" />
              </div>
            </div>

            {/* City + State + PIN */}
            <div className="checkout-fg checkout-fg--c3">

              <div className="checkout-field">
                <input placeholder="City" />
              </div>

              <div className="checkout-field">
                <select defaultValue="Madhya Pradesh">
                  {INDIAN_STATES_AND_UTS.map((state) => (

                    <option
                      key={state}
                      value={state}
                    >
                      {state}
                    </option>

                  ))}
                </select>
              </div>

              <div className="checkout-field">
                <input maxLength={6} />
              </div>

            </div>

          </div>

        </div>

        {/* GST TOGGLE */}
        <div className="checkout-toggle-block">

          <label className="checkout-checkbox">
            <input
              type="checkbox"
              checked={gstEnabled}
              onChange={() => setGstEnabled(!gstEnabled)}
            />
            <span className="checkout-checkbox-box"></span>

            <span>
              I need a GST invoice
              <span className="checkout-label-optional">
                (for business purchases)
              </span>
            </span>
          </label>

          {/* GST SECTION */}
          <div className={`checkout-panel gst ${gstEnabled ? "open" : ""}`}>

            <div className="checkout-fg checkout-fg--c2">

              <div className="checkout-field">
                <input placeholder="Business / Company Name" />
              </div>

              <div className="checkout-field">
                <input placeholder="22AAAAA0000A1Z5" maxLength={15} />
                <div className="checkout-fhint">
                  15-character GST Identification Number
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </FormSection>
  );
}