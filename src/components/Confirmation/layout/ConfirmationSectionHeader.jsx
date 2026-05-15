// src\components\Confirmation\layout\ConfirmationSectionHeader.jsx
import "../../../styles/confirmation/layout/confirmation-section-header.css";

const ConfirmationSectionHeader = ({
    number,
    title,
    accent,
    suffix,
    status,
    tag,
}) => {
    return (
        <div className="confirmation-section-header">

            <div className="confirmation-section-header-number">
                {number}
            </div>

            <h2 className="confirmation-section-header-title">
                {title}

                {accent && (
                    <>
                        {" "}
                        <em>{accent}</em>
                    </>
                )}

                {suffix && (
                    <>
                        {" "}
                        {suffix}
                    </>
                )}
            </h2>

            {status && (
                <div
                    className={`
            confirmation-section-tag
            confirmation-section-tag-${tag}
          `}
                >
                    {status}
                </div>
            )}

        </div>
    );
};

export default ConfirmationSectionHeader;