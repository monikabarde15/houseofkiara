import "../../../styles/LYP/howItWorks.css"


const steps = [
    {
        numeral: "i.",
        title: "Submit",
        body: "Fill the form above with a few photos and details. Takes less than five minutes. Receive an instant confirmation on email and WhatsApp."
    },
    {
        numeral: "ii.",
        title: "Review",
        body: "Our curation team reviews your piece and reaches out on WhatsApp within 48 hours with pricing guidance and next steps."
    },
    {
        numeral: "iii.",
        title: "Pickup & Shoot",
        body: "We arrange doorstep pickup and take professional photographs at our studio. You approve every image before we go live."
    },
    {
        numeral: "iv.",
        title: "Go Live",
        body: "Your piece is listed on the platform with a link sent directly to your inbox. Share it, or just watch it find its next moment."
    },
    {
        numeral: "v.",
        title: "Earn",
        body: "Payouts processed within 3 working days of each booking or sale. Full clarity on every transaction, always."
    }
];


export default function LypHowItWorks() {

    const scrollToWizard = () => {
        const el = document.getElementById("progWrap");
        if (!el) return;

        const y = el.getBoundingClientRect().top + window.scrollY - 100;

        window.scrollTo({
            top: y,
            behavior: "smooth",
        });
    };
    return (
        <section className="lyp-how">

            {/* Eyebrow */}
            <div className="lyp-how-eyebrow">
                HOW IT WORKS
            </div>

            {/* TITLE */}
            <div className="lyp-how-title">
                From your wardrobe to <em> part of someone else's story</em>
            </div>
            {/* Subtitle */}
            <div className="lyp-how-sub">
                Five simple steps. No technical knowledge required. Most listers finish the process in under five minutes — and never touch the platform again until their first payout lands.
            </div>

            {/* Steps */}
            <div className="lyp-how-grid">
                {steps.map((s, i) => (
                    <div className="lyp-how-step" key={i}>

                        <div className="lyp-how-num">{s.numeral}</div>
                        <div className="lyp-how-dash" />

                        <div className="lyp-how-step-title">
                            {s.title}
                        </div>

                        <div className="lyp-how-step-body">
                            {s.body}
                        </div>

                    </div>
                ))}
            </div>
            {/* CTA */}
            <div className="lyp-how-cta">
                <button
                    className="lyp-how-primary-btn"
                    onClick={() => {
                        document
                            .getElementById("progWrap")
                            ?.scrollIntoView({ behavior: "smooth" });
                    }}
                >
                    › START LISTING — IT TAKES 5 MINUTES
                </button>
            </div>
        </section>
    )
}
