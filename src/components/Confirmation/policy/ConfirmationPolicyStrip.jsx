import "../../../styles/confirmation/policy/confirmation-policy-strip.css";

/* =========================================================
   POLICY DATA
========================================================= */

const confirmationPolicies = [

    {
        number: "01",
        heading: "Rental Returns",
        body:
            "Return your piece by the agreed date using our prepaid return label. A one-day cleaning buffer is built in. Late returns attract ₹1,700 per additional day.",
    },

    {
        number: "02",
        heading: "Damage & Deposit",
        body:
            "Security deposits are refunded within 3–5 business days of return inspection. Normal wear is accepted without charge. Significant damage may result in partial or full withholding.",
    },

    {
        number: "03",
        heading: "Questions?",
        body:
            "Our team is reachable on WhatsApp seven days a week. We respond to all messages within 2 hours during business hours (10 AM – 8 PM IST).",
    },

];

/* =========================================================
   COMPONENT
========================================================= */

const ConfirmationPolicyStrip = () => {

    return (

        <section
            className="hok-confirmation-policy-strip"
            data-rise="6"
        >

            <div className="hok-confirmation-policy-grid">

                {confirmationPolicies.map((policy) => (

                    <article
                        key={policy.number}
                        className="hok-confirmation-policy-item"
                    >

                        {/* =========================================================
                            POLICY NUMBER
                        ========================================================= */}

                        <div className="hok-confirmation-policy-number">
                            {policy.number}
                        </div>

                        {/* =========================================================
                            POLICY HEADING
                        ========================================================= */}

                        <h3 className="hok-confirmation-policy-heading">
                            {policy.heading}
                        </h3>

                        {/* =========================================================
                            POLICY BODY
                        ========================================================= */}

                        <p className="hok-confirmation-policy-body">
                            {policy.body}
                        </p>

                    </article>

                ))}

            </div>

        </section>

    );

};

export default ConfirmationPolicyStrip;