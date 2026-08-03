import React from "react";
import { ActivityEntry } from "../../types/lister.types";
import { formatLogTimestamp } from "../../utils/formatter";
import "./styles/ActivityCard.css";

interface ActivityCardProps {
    activities: ActivityEntry[];
    isCreateMode?: boolean;
}

const dotClass = {
    sage: "activity-dot-sage",
    gold: "activity-dot-gold",
    terra: "activity-dot-terra",
    muted: "activity-dot-muted",
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
    activities,
    isCreateMode = false,
}) => {

    const renderEmpty = () => (

        <div className="activity-empty">
            No account activity recorded yet.
        </div>

    );

    return (

        <div className="activity-card card">

            <div className="card-hd">

                <span className="card-title">
                    Account Activity
                </span>

            </div>

            <div className="card-bd">

                {isCreateMode || activities.length === 0 ? (

                    renderEmpty()

                ) : (

                    <div className="activity-list">

                        {activities.map((activity, index) => (

                            <div
                                key={index}
                                className="activity-item"
                            >

                                <div
                                    className={`activity-dot ${
                                        dotClass[
                                            activity.c as keyof typeof dotClass
                                        ]
                                    }`}
                                />

                                <div className="activity-content">

                                    <div className="activity-text">
                                        {activity.e}
                                    </div>

                                    <div className="activity-time">
                                        {formatLogTimestamp(
                                            activity.t
                                        )}
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );
};

export default ActivityCard;