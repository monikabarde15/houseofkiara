// src\styles\confirmation\sections\confirmation-dispatch-rows.css
import "../../../styles/confirmation/sections/confirmation-dispatch-rows.css";

export default function ConfirmationDispatchRow({ item }) {

    const formatDate = (date) => {
        if (!date) return "";

        const d = new Date(date);

        const day = d.getDate();

        const month = d.toLocaleString("en-IN", {
            month: "short",
        });

        const weekday = d.toLocaleString("en-IN", {
            weekday: "long",
        });

        return `${day} ${month} (${weekday})`;
    };

    const getRentalWindowDays = (booking) => {

        if (
            !booking?.deliveryDate ||
            !booking?.returnDate
        ) {
            return 5;
        }

        const start = new Date(
            booking.deliveryDate
        );

        const end = new Date(
            booking.returnDate
        );

        return (
            Math.round(
                (end - start) /
                (1000 * 60 * 60 * 24)
            ) + 1
        );
    };


    const booking = item.booking || {};

    const deliveryDate =
        formatDate(booking.deliveryDate);

    const eventDate =
        formatDate(booking.eventDate);

    const returnDate =
        formatDate(booking.returnDate);

    const rentalWindowDays =
        getRentalWindowDays(booking);

    const rows =
        item.type === "rental"
            ? [
                {
                    key: "Status",
                    value: (
                        <>
                            {" "}

                            <span className="confirmation-dispatch-highlight">
                                ● Confirmed
                            </span>

                            {" — pending security deposit before dispatch"}
                        </>
                    ),
                },

                {
                    key: "Security deposit",
                    value: (
                        <>
                            <b>
                                ₹{new Intl.NumberFormat("en-IN").format(
                                    item.product?.rent?.pricing?.securityDeposit || 15000
                                )}
                            </b>

                            {" — "}

                            <span className="confirmation-dispatch-deposit">
                                our ops team will contact you on WhatsApp within 24 hours
                            </span>
                        </>
                    ),
                },

                {
                    key: "Arrives by",
                    value:
                        `${deliveryDate} — 2 days before your event`,
                },

                {
                    key: "Your event",
                    value:
                        eventDate,
                },

                {
                    key: "Return by",
                    value: (
                        <>
                            <b>{returnDate}</b>

                            {" — "}

                            <span className="confirmation-dispatch-urgent">
                                prepaid label included in packaging
                            </span>
                        </>
                    ),
                },

                {
                    key: "Carrier",
                    value:
                        "Blue Dart · Tracking shared on WhatsApp & email before dispatch",
                },
            ]

            : item.type === "preloved"
                ? [
                    {
                        key: "Status",
                        value: (
                            <>
                                {" "}

                                <span className="confirmation-dispatch-highlight">
                                  ● Confirmed
                                </span>

                                {" — dispatching within 2 business days"}
                            </>
                        ),
                    },

                    {
                        key: "Est. delivery",
                        value:
                            "16–17 Oct — Blue Dart standard delivery",
                    },

                    {
                        key: "Carrier",
                        value:
                            "Blue Dart · Tracking details shared on email before dispatch",
                    },

                    {
                        key: "Returns",
                        value: (
                            <span className="confirmation-dispatch-urgent">
                                Final sale — this piece cannot be returned or exchanged
                            </span>
                        ),
                    },
                ]

                : [
                    {
                        key: "Status",
                        value: (
                            <>
                                {" "}

                                <span className="confirmation-dispatch-highlight">
                                    ● Confirmed
                                </span>

                                {" — order passed to Manyavar fulfilment"}
                            </>
                        ),
                    },

                    {
                        key: "Est. dispatch",
                        value:
                            "Within 3–5 business days from Manyavar's fulfilment centre",
                    },

                    {
                        key: "Carrier",
                        value:
                            "Blue Dart · Tracking number provided on dispatch email",
                    },

                    {
                        key: "Returns",
                        value:
                            "7-day return window from date of delivery · Contact us to initiate",
                    },
                ];

    return (
        <div className="confirmation-dispatch-rows">

            {rows.map((row) => (
                <div
                    key={row.key}
                    className="confirmation-dispatch-row"
                >

                    <div className="confirmation-dispatch-row-key">
                        {row.key}
                    </div>

                    <div
                        className={[
                            "confirmation-dispatch-row-value",

                            row.variant
                                ? `confirmation-dispatch-row-value-${row.variant}`
                                : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    >
                        {row.value}
                    </div>

                </div>
            ))}

        </div>
    );
}