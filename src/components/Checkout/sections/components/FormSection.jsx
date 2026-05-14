// src\components\Checkout\sections\components\FormSection.jsx
import "../../../../styles/checkout/sections/components/form-section.css";

const FormSection = ({ children }) => {
  return (
    <div className="checkout-form-section">
      {children}
    </div>
  );
};

export default FormSection;