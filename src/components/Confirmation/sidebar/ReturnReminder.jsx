import "../../../styles/confirmation/sidebar/return-reminder.css";
import {Info,} from "lucide-react";

const ReturnReminder = () => {
  return (
    <div
      className="confirmation-return-reminder"
      data-rise="3"
    >

      <div className="confirmation-return-reminder-icon">
        <Info
          size={13}
          strokeWidth={1.5}
        />
      </div>

      <div className="confirmation-return-reminder-content">

        <div className="confirmation-return-reminder-title">
          Return deadline: 18 Nov (Tuesday)
        </div>

        <p className="confirmation-return-reminder-text">
          Prepaid Blue Dart label in packaging.
          Deposit refunded within 3–5 days of
          inspection.
        </p>

      </div>

    </div>
  );
};

export default ReturnReminder;