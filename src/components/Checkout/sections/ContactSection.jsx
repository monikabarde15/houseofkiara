// src\components\Checkout\sections\ContactSection.jsx
import FormSection from "./components/FormSection";
import "../../../styles/checkout/sections/components/field.css";
import "../../../styles/checkout/sections/components/form-section.css";
import "../../../styles/checkout/sections/contact-section.css";
import Field from "./components/Field";
import { useState, useEffect } from "react";

const ContactSection = ({
  submitCount,
  setFieldErrors,
}) => {

  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    whatsapp: "+91 98765 43210",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    /* clear error live */
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateContactFields = () => {

    const nextErrors = {};

    /* first name */
    if (!formData.firstName.trim()) {
      nextErrors.firstName =
        "First name is required";
    }

    /* last name */
    if (!formData.lastName.trim()) {
      nextErrors.lastName =
        "Last name is required";
    }

    /* email */
    if (!formData.email.trim()) {

      nextErrors.email =
        "Email address is required";

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {

      nextErrors.email =
        "Please enter a valid email address";
    }

    /* whatsapp */
    const whatsappDigits =
      formData.whatsapp.replace(/\D/g, "");

    if (!whatsappDigits) {

      nextErrors.whatsapp =
        "WhatsApp number is required";

    } else if (whatsappDigits.length < 10) {

      nextErrors.whatsapp =
        "Please enter a valid WhatsApp number";

    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  useEffect(() => {

    const nextErrors = {};

    /* first name */
    if (!formData.firstName.trim()) {
      nextErrors[
        "First name (Contact & Account)"
      ] = true;
    }

    /* last name */
    if (!formData.lastName.trim()) {
      nextErrors[
        "Last name (Contact & Account)"
      ] = true;
    }

    /* email */
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      nextErrors[
        "Email address (Contact & Account)"
      ] = true;
    }

    /* whatsapp */
    const whatsappDigits =
      formData.whatsapp.replace(/\D/g, "");

    if (whatsappDigits.length < 10) {

      nextErrors[
        "WhatsApp number (Contact & Account)"
      ] = true;

    }

    setFieldErrors((prev) => {

      const updated = { ...prev };

      /* clear old section errors */
      Object.keys(updated).forEach((key) => {

        if (key.includes("Contact & Account")) {
          delete updated[key];
        }
      });

      return {
        ...updated,
        ...nextErrors,
      };
    });

    if (submitCount > 0) {
      validateContactFields();
    }

  }, [submitCount, formData]);
  return (
    <FormSection>

      <div className="contact-section">

        {/* HEADER */}
        <div className="checkout-section-header">
          <div className="checkout-section-number">01</div>

          <h2 className="checkout-section-title">
            Contact & <em>Account</em>
          </h2>
        </div>

        {/* ROW 1 — First + Last */}
        <div className="checkout-fg checkout-fg--c2">

          <Field
            label="FIRST NAME"
            required
            error={errors.firstName}
          >
            <input
              id="first-name"
              value={formData.firstName}
              onChange={(e) =>
                handleChange("firstName", e.target.value)
              }
            />
          </Field>

          <Field
            label="LAST NAME"
            required
            error={errors.lastName}
          >
            <input
              id="last-name"
              value={formData.lastName}
              onChange={(e) =>
                handleChange("lastName", e.target.value)
              }
            />
          </Field>

        </div>

        {/* ROW 2 — Email */}
        <div className="checkout-fg">

          <Field
            label="EMAIL ADDRESS"
            required
            error={errors.email}
            hint="Order confirmation and dispatch updates will be sent here."
          >
            <input
              id="email-address"
              type="email"
              value={formData.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
            />
          </Field>

        </div>

        {/* // ROW 3 — WhatsApp */}

        <div className="checkout-fg">

          <Field
            label="WHATSAPP NUMBER"
            required
            labelBadge="Required — rental coordination"
            error={errors.whatsapp}
            hint="Our ops team uses this number to coordinate rental dispatch, security deposit collection, and return logistics."
          >
            
            <input
              id="whatsapp-number"
              value={formData.whatsapp}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d+\s]/g, "");
                handleChange("whatsapp", value);
              }}
            />
          </Field>

        </div>

      </div>

    </FormSection>
  );
};

export default ContactSection;