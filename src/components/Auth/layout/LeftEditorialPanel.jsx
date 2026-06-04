import React from "react";
import "../../../styles/Auth/layout/LeftEditorialPanel.css";

const LeftEditorialPanel = () => {
    return (
        <aside className="hok-auth-left-panel">
            <div className="hok-auth-left-pattern" />

            <div className="hok-auth-editorial-content">
                <div className="hok-auth-eyebrow-row">
                    <span className="hok-auth-decorative-line" />

                    <span className="hok-auth-eyebrow-text">
                        WELCOME TO HOUSE OF KAIRA
                    </span>
                </div>

                <h1 className="hok-auth-editorial-heading">
                    Dress for the occasion. <em>Own the moment.</em>
                </h1>

                <p className="hok-auth-editorial-sub-paragraph">
                    India's curated platform for luxury occasion wear — rent, discover
                    preloved, or give your pieces a second story.
                </p>

                <div className="hok-auth-feature-list">
                    <div className="hok-auth-feature-item">
                        <span className="hok-auth-bullet-dot" />
                        <span className="hok-auth-feature-text">
                            Access hundreds of curated designer pieces
                        </span>
                    </div>

                    <div className="hok-auth-feature-item">
                        <span className="hok-auth-bullet-dot" />
                        <span className="hok-auth-feature-text">
                            Rent for an occasion, return after
                        </span>
                    </div>

                    <div className="hok-auth-feature-item">
                        <span className="hok-auth-bullet-dot" />
                        <span className="hok-auth-feature-text">
                            Buy preloved and own beautifully
                        </span>
                    </div>

                    <div className="hok-auth-feature-item">
                        <span className="hok-auth-bullet-dot" />
                        <span className="hok-auth-feature-text">
                            List your own pieces and earn
                        </span>
                    </div>
                </div>

                <div className="hok-auth-trust-badge-row">
                    <span className="hok-auth-trust-badge">SECURE</span>

                    <span className="hok-auth-separator-dot" />

                    <span className="hok-auth-trust-badge">VERIFIED</span>

                    <span className="hok-auth-separator-dot" />

                    <span className="hok-auth-trust-badge">PAN-INDIA</span>
                </div>
            </div>
        </aside>
    );
};

export default LeftEditorialPanel;