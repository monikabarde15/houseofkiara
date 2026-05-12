
import { Check } from "lucide-react";
import "../../../styles/confirmation/layout/progress-strip.css";

const ProgressStrip = () => {
  return (
    <div className="confirmation-progress-strip">
      <div className="confirmation-progress-strip-inner">
        <a
          href="/cart"
          className="confirmation-progress-step confirmation-progress-step-done"
        >
          <span className="confirmation-progress-circle confirmation-progress-circle-done">
            <Check size={8} strokeWidth={2.4} />
          </span>

          <span className="confirmation-progress-label">
            Cart
          </span>
        </a>

        <span className="confirmation-progress-separator" />

        <a
          href="/checkout"
          className="confirmation-progress-step confirmation-progress-step-done"
        >
          <span className="confirmation-progress-circle confirmation-progress-circle-done">
            <Check size={8} strokeWidth={2.4} />
          </span>

          <span className="confirmation-progress-label">
            Checkout
          </span>
        </a>

        <span className="confirmation-progress-separator" />

        <div className="confirmation-progress-step confirmation-progress-step-active">
          <span className="confirmation-progress-circle confirmation-progress-circle-active">
            3
          </span>

          <span className="confirmation-progress-label">
            Confirmation
          </span>
        </div>
      </div>
    </div>
  );
};


export default ProgressStrip;