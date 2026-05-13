import "../../../styles/confirmation/sections/confirmation-next-steps-section.css";
import ConfirmationSectionHeader from "../layout/ConfirmationSectionHeader";

const ConfirmationNextStepsSection = () => {
    return (
        <section className="confirmation-next-steps-section">
            <ConfirmationSectionHeader
                number="04"
                title="What Happens"
                accent="Next"
            />

            <div className="confirmation-next-steps">
                <div className="confirmation-next-step">
                    <div className="confirmation-next-step-number">
                        1
                    </div>

                    <div className="confirmation-next-step-content">
                        <h3 className="confirmation-next-step-title">
                            WhatsApp from our <em>ops team</em>
                        </h3>

                        <p className="confirmation-next-step-text">
                            Within 24 hours, an HOK team member will message you on WhatsApp (
                            <b>+91 98765 43210</b>) to arrange the{" "}
                            <b>₹15,000 security deposit</b> for your rental and confirm
                            dispatch logistics. Please keep this number saved.
                        </p>
                    </div>
                </div>

                <div className="confirmation-next-step">
                    <div className="confirmation-next-step-number">
                        2
                    </div>

                    <div className="confirmation-next-step-content">
                        <h3 className="confirmation-next-step-title">
                            Confirmation <em>email</em>
                        </h3>

                        <p className="confirmation-next-step-text">
                            A detailed confirmation has been sent to{" "}
                            <b>priya@example.com</b> with your full order breakdown, GST
                            invoice, and per-piece dispatch timelines. Check your spam folder
                            if you don't see it within 10 minutes.
                        </p>
                    </div>
                </div>

                <div className="confirmation-next-step">
                    <div className="confirmation-next-step-number">
                        3
                    </div>

                    <div className="confirmation-next-step-content">
                        <h3 className="confirmation-next-step-title">
                            <em>Dispatch</em> notifications
                        </h3>

                        <p className="confirmation-next-step-text">
                            You'll receive a WhatsApp message and email for each piece when it
                            dispatches — with the carrier name, tracking number, and expected
                            delivery date. Each piece ships on its own timeline.
                        </p>
                    </div>
                </div>

                <div className="confirmation-next-step">
                    <div className="confirmation-next-step-number">
                        4
                    </div>

                    <div className="confirmation-next-step-content">
                        <h3 className="confirmation-next-step-title">
                            After your <em>event</em>
                        </h3>

                        <p className="confirmation-next-step-text">
                            Return the lehenga using the prepaid Blue Dart label in the
                            packaging by <b>18 November (Tuesday)</b>. Once inspected, your
                            security deposit is refunded within{" "}
                            <b>3–5 business days</b>. No calls, no forms — just drop it off.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConfirmationNextStepsSection;