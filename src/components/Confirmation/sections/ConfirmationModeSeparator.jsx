// src\components\Confirmation\sections\ConfirmationModeSeparator.jsx
import "../../../styles/confirmation/sections/confirmation-mode-separator.css";

const ConfirmationModeSeparator = ({
  type,
  label,
}) => {
  return (
    <div className="confirmation-mode-separator">

      <span
        className={`
          confirmation-mode-separator-dot
          confirmation-mode-separator-dot-${type}
        `}
      />

      <span className="confirmation-mode-separator-label">
        {label}
      </span>

    </div>
  );
};

export default ConfirmationModeSeparator;