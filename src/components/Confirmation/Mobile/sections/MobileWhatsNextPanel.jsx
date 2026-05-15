import { useState } from "react";
import { ChevronUp } from "lucide-react";
import "../../../../styles/confirmation/mobile/sections/mobile-whats-next-panel.css";

const MobileWhatsNextPanel = () => {
  const [isOpen, setIsOpen] = useState(true); // Open by default

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`mobile-whats-next-panel ${isOpen ? "open" : ""}`}>
      {/* Panel Header */}
      <div className="mobile-wn-header" onClick={togglePanel}>
        <div className="mobile-wn-header-text">
          <div className="mobile-wn-eyebrow">Next steps</div>
          <div className="mobile-wn-title">
            What happens <em>next</em>
          </div>
        </div>
        <div className="mobile-wn-toggle-icon">
          <ChevronUp size={10} strokeWidth={1.8} />
        </div>
      </div>

      {/* Panel Body */}
      <div className="mobile-wn-body">
        <div className="mobile-wn-body-inner">
          {/* STEP 1 */}
          <div className="mobile-wn-step">
            <div className="mobile-wn-step-left">
              <span className="mobile-wn-dot mobile-wn-dot-amber" />
              <span className="mobile-wn-line" />
            </div>
            <div className="mobile-wn-step-body">
              <div className="mobile-wn-step-title">
                <span>WhatsApp from us</span>
                <span className="mobile-wn-badge-soon">Within 24 hrs</span>
              </div>
              <p className="mobile-wn-step-text">
                Our ops team will arrange the{" "}
                <b>₹15,000 security deposit</b> for your rental and confirm
                dispatch timing.
              </p>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="mobile-wn-step">
            <div className="mobile-wn-step-left">
              <span className="mobile-wn-dot mobile-wn-dot-muted" />
              <span className="mobile-wn-line" />
            </div>
            <div className="mobile-wn-step-body">
              <div className="mobile-wn-step-title">
                Pieces dispatched separately
              </div>
              <p className="mobile-wn-step-text">
                Preloved saree within <b>2 days</b>. Sherwani within{" "}
                <b>3–5 days</b>. Lehenga after deposit, arriving <b>14 Nov</b>.
              </p>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="mobile-wn-step">
            <div className="mobile-wn-step-left">
              <span className="mobile-wn-dot mobile-wn-dot-muted" />
              <span className="mobile-wn-line" />
            </div>
            <div className="mobile-wn-step-body">
              <div className="mobile-wn-step-title">
                Tracking numbers shared
              </div>
              <p className="mobile-wn-step-text">
                WhatsApp + email for each piece the moment it dispatches.
              </p>
            </div>
          </div>

          {/* STEP 4 - Last step */}
          <div className="mobile-wn-step mobile-wn-step-last">
            <div className="mobile-wn-step-left">
              <span className="mobile-wn-dot mobile-wn-dot-muted" />
            </div>
            <div className="mobile-wn-step-body">
              <div className="mobile-wn-step-title">
                <span>Return rental by </span>
                <span className="mobile-wn-urgent">18 Nov</span>
              </div>
              <p className="mobile-wn-step-text">
                Prepaid Blue Dart label in packaging. Deposit refunded within
                3–5 days of return inspection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileWhatsNextPanel;