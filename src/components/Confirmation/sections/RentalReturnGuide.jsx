import "../../../styles/confirmation/sections/rental-return-guide.css";

const steps = [
    {
        number: "1",
        title: "Inspect & fold",
        text: (
            <>
                Before packing, gently fold and wrap the lehenga
                in the tissue paper it arrived in. Check there are
                no personal items left in the garment.
            </>
        ),
    },
    {
        number: "2",
        title: "Use the HOK garment bag",
        text: (
            <>
                Place the wrapped garment back into the <b>HOK garment bag</b> it arrived in. Attach the prepaid
                return label to the outside of the bag.
                
            </>
        ),
    },
    {
        number: "3",
        title: "Drop off by 18 Nov",
        text: (
            <>
                Take the bag to the nearest
                <b> Blue Dart service centre</b>. You'll receive a
                pickup receipt — please keep this until your
                deposit is refunded.
            </>
        ),
    },
    {
        number: "4",
        title: "Deposit refunded in 3–5 days",
        text: (
            <>
                Once we receive and inspect the piece, your
                ₹15,000 deposit is refunded to the original
                payment method within <b>3–5 business days</b>.
                You'll receive a WhatsApp confirmation.
            </>
        ),
    },
];

export default function RentalReturnGuide() {
    return (
        <section className="confirmation-rental-guide">

            <p className="confirmation-rental-guide__eyebrow">
                HOW TO RETURN YOUR PIECE
            </p>

            <div className="confirmation-rental-guide__steps">

                {steps.map((step) => (
                    <div
                        key={step.number}
                        className="confirmation-rental-guide__step"
                    >

                        <div className="confirmation-rental-guide__circle">
                            {step.number}
                        </div>

                        <div className="confirmation-rental-guide__content">

                            <h4 className="confirmation-rental-guide__title">
                                {step.title}
                            </h4>

                            <p className="confirmation-rental-guide__text">
                                {step.text}
                            </p>

                        </div>

                    </div>
                ))}

            </div>

        </section>
    );
}