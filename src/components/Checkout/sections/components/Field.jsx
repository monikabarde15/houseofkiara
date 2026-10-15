// src\components\Checkout\sections\components\Field.jsx
import "../../../../styles/checkout/sections/components/field.css";

const Field = ({
  label,
  required = false,
  optional = false,
  hint,
  labelBadge = null,
  error,
  children,
  className = "",
}) => {

  return (
    <div
      className={`
        checkout-field
        ${error ? "has-error" : ""}
        ${className}
      `}
    >

      {/* LABEL */}
      <label className="checkout-field-label">

        {label}

        {required && (
          <span
            className="req"
            aria-hidden="true"
          >
            *
          </span>
        )}

        {optional && (
          <span className="checkout-field-optional">
            (Optional)
          </span>
        )}

        {labelBadge && (
          <span className="checkout-field-label-badge">{labelBadge}</span>
        )}

      </label>

      {/* CONTROL */}
      {children}

      {/* HINT */}
      {hint && !error && (
        <div className="checkout-fhint">
          {hint}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="checkout-ferror">
          {error}
        </div>
      )}

    </div>
  );
};

export default Field;