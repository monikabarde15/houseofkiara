import '../../../styles/LYP/promises.css';
import { DollarSign, Heart, Briefcase } from "lucide-react";

const promises = [
    {
        number: "01",
        icon: DollarSign,
        title: <>Your piece <em>earns</em> while you own it.</>,
        body: "Revenue share on every rental. Your lehenga doesn't have to sit in a box to remain yours. List it here and earn every time it goes to a new celebration - with full transparency and a reliable payout cycle."
    },
    {
        number: "02",
        icon: Heart,
        title: <>When you’re ready, we make it <em>seamless</em>.</>,
        body: "Fixed payout on resale - no haggling, no uncertainty. We offer pricing guidance based on category, condition and demand. Once your piece sells, your payout is guaranteed and processed promptly."
    },
    {
        number: "03",
        icon: Briefcase,
        title: <>You list it. We handle <em>everything else</em>.</>,
        body: "House of Kaira manages pickup, photography, listing, quality inspection, packaging, delivery, and returns. Your only job is to say yes. We do the rest - professionally, carefully, with the same standard we promise every renter."
    }
];

export default function LypPromises() {
    return (
        <section className="lyp-promises">

            {/* Eyebrow */}
            <div className="lyp-promises-eyebrow">
                THE THREE LISTER PROMISES
            </div>

            {/* Title */}
            <h2 className="lyp-promises-title">
                What House of Kaira <em>promises you</em>
            </h2>

            {/* Subtitle */}
            <p className="lyp-promises-sub">
                The lister is the commercial engine of House of Kaira. These are not marketing lines - they are
                operational commitments, built into every piece we onboard.
            </p>

            {/* Grid */}
            <div className="lyp-promises-grid">
                {promises.map((p, i) => {
                    const Icon = p.icon;

                    return (
                        <div className="lyp-promise-card" key={i}>

                            {/* Number */}
                            <div className="lyp-promise-number">
                                Promise {p.number}
                            </div>

                            {/* Icon */}
                            <div className="lyp-promise-icon">
                                <Icon  />
                            </div>

                            {/* Title */}
                            <div className="lyp-promise-title">
                                {p.title}
                            </div>

                            {/* Body */}
                            <div className="lyp-promise-body">
                                {p.body}
                            </div>

                        </div>
                    );
                })}
            </div>

        </section>
    );
}