// src\components\Confirmation\sidebar\ConfirmationWhatsNextTimeline.jsx
import "../../../styles/confirmation/sidebar/confirmation-whats-next-timeline.css";

const ConfirmationWhatsNextTimeline = () => {
  return (
    <div
      className="confirmation-whats-next-timeline"
      data-rise="2"
    >

      <div className="confirmation-whats-next-eyebrow">
        What happens next
      </div>

      {/* STEP 1 */}
      <div className="confirmation-whats-next-step">

        <div className="confirmation-whats-next-step-left">

          <span className="confirmation-whats-next-dot confirmation-whats-next-dot-amber" />

          <span className="confirmation-whats-next-line" />

        </div>

        <div className="confirmation-whats-next-step-body">

          <div className="confirmation-whats-next-step-title">

            <span>
              WhatsApp from us
            </span>

            <span className="confirmation-whats-next-badge confirmation-whats-next-badge-soon">
              Within 24 hrs
            </span>

          </div>

          <p className="confirmation-whats-next-step-text">
            Our ops team will message you to arrange
            the <b>₹15,000 security deposit</b> for
            your rental and confirm dispatch timing.
          </p>

        </div>

      </div>

      {/* STEP 2 */}
      <div className="confirmation-whats-next-step">

        <div className="confirmation-whats-next-step-left">

          <span className="confirmation-whats-next-dot confirmation-whats-next-dot-muted" />

          <span className="confirmation-whats-next-line" />

        </div>

        <div className="confirmation-whats-next-step-body">

          <div className="confirmation-whats-next-step-title">
            Pieces dispatched separately
          </div>

          <p className="confirmation-whats-next-step-text">
            Preloved saree ships within <b>2 days</b>.
            Sherwani within <b>3–5 days</b>.
            Lehenga dispatches after deposit is
            received, arriving <b>14 Nov</b>.
          </p>

        </div>

      </div>

      {/* STEP 3 */}
      <div className="confirmation-whats-next-step">

        <div className="confirmation-whats-next-step-left">

          <span className="confirmation-whats-next-dot confirmation-whats-next-dot-muted" />

          <span className="confirmation-whats-next-line" />

        </div>

        <div className="confirmation-whats-next-step-body">

          <div className="confirmation-whats-next-step-title">
            Tracking numbers shared
          </div>

          <p className="confirmation-whats-next-step-text">
            You'll receive a tracking number on
            WhatsApp and email for each piece the
            moment it dispatches.
          </p>

        </div>

      </div>

      {/* STEP 4 */}
      <div className="confirmation-whats-next-step confirmation-whats-next-step-last">

        <div className="confirmation-whats-next-step-left">

          <span className="confirmation-whats-next-dot confirmation-whats-next-dot-muted" />

        </div>

        <div className="confirmation-whats-next-step-body">

          <div className="confirmation-whats-next-step-title">

            <span>
              Return your rental by
            </span>

            <span className="confirmation-whats-next-urgent">
              18 Nov
            </span>

          </div>

          <p className="confirmation-whats-next-step-text">
            Prepaid return label in the packaging.
            Deposit refunded within 3–5 business
            days of return inspection.
          </p>

        </div>

      </div>

    </div>
  );
};

export default ConfirmationWhatsNextTimeline;