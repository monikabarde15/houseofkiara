import '../../../../styles/LYP/wizard/sidebar.css'
import React from "react";

const Timeline = ({ step, submitted }) => {

    const items = [
        {
            title: "Submission review",
            body: "We review within 48 hours and reach out on WhatsApp."
        },
        {
            title: "Terms confirmed",
            body: "Commission rate agreed before anything proceeds."
        },
        {
            title: "Pickup & photography",
            body: "We collect your piece and photograph it in-house."
        },
        {
            title: "Piece goes live",
            body: "We manage everything. You start earning."
        },
        {
            title: "Earn, rental by rental",
            body: "Payouts after each completed booking or sale."
        }
    ];

    const getState = (index) => {
        // Before submit → static preview
        if (!submitted) {
            return index === 0 ? "active" : "future";
        }

        // After submit → still static (as per spec intent)
        return index === 0 ? "active" : "future";
    };

    return (
        <div className="lyp-timeline">

            {/* Eyebrow */}
            <div className="lyp-sidebar-eyebrow">
                AFTER YOU SUBMIT
            </div>

            <div className="lyp-timeline-list">
                {items.map((item, index) => {
                    const state = getState(index);

                    return (
                        <div className="lyp-timeline-item" key={index}>

                            {/* LEFT (dot + line) */}
                            <div className="lyp-timeline-left">

                                <div className={`lyp-dot lyp-dot-${state}`}>
                                    {state === "done"
                                        ? "✓"
                                        : index === items.length - 1
                                            ? "✦"
                                            : index + 1}
                                </div>

                               
                            </div>

                            {/* RIGHT (content) */}
                            <div className="lyp-timeline-content">
                                <div className={`lyp-tl-title ${state}`}>
                                    {item.title}
                                </div>
                                <div className={`lyp-tl-body ${state}`}>
                                    {item.body}
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default Timeline;