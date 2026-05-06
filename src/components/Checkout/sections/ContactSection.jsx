import FormSection from "./components/FormSection";
import "../../../styles/checkout/sections/components/field.css";
import "../../../styles/checkout/sections/components/form-section.css";
import "../../../styles/checkout/sections/contact-section.css";

const ContactSection = () => {
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

        <div className="checkout-field">
          <label>
            FIRST NAME <span className="req">*</span>
          </label>
          <input defaultValue="John" />
        </div>

        <div className="checkout-field">
          <label>
            LAST NAME <span className="req">*</span>
          </label>
          <input defaultValue="Doe" />
        </div>

      </div>

      {/* ROW 2 — Email */}
      <div className="checkout-fg">

        <div className="checkout-field">
          <label>
            EMAIL ADDRESS <span className="req">*</span>
          </label>
          <input defaultValue="johndoe@example.com" />

          <div className="checkout-fhint">
            Order confirmation and dispatch updates will be sent here.
          </div>
        </div>

      </div>

      {/* ROW 3 — WhatsApp */}
      <div className="checkout-fg">

        <div className="checkout-field">
          <label>
            WHATSAPP NUMBER <span className="req">*</span>{" "}
            <span className="checkout-label-inline-error">
              Required — rental coordination
            </span>
          </label>

          <input defaultValue="+91 98765 43210" />

          <div className="checkout-fhint">
            Our ops team uses this number to coordinate rental dispatch, security deposit collection, and return logistics.
          </div>
        </div>

      </div>

      </div>

    </FormSection>
  );
};

export default ContactSection;