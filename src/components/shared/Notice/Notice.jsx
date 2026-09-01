// src/components/shared/Notice/Notice.jsx

import "../../../styles/shared/notice/notice.css";

const Notice = ({
  variant = "slate",
  title,
  children,
  className = "",
}) => {
  return (
    <div className={`hok-notice hok-notice--${variant} ${className}`}>
      <p className="hok-notice__text">

        {title && (
          <span className="hok-notice__title">
            {title}{" "}
          </span>
        )}

        <span className="hok-notice__body">
          {children}
        </span>

      </p>
    </div>
  );
};

export default Notice;