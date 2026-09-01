// src\components\Confirmation\sections\ConfirmationSection.jsx
import "../../../styles/confirmation/sections/confirmation-section.css";

const ConfirmationSection = ({
  children,
  isLast = false,
}) => {
  return (
    <section
      className={`
        confirmation-section
        ${isLast ? "confirmation-section-last" : ""}
      `}
    >
      {children}
    </section>
  );
};

export default ConfirmationSection;