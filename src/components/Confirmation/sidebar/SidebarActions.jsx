import {
  ChevronLeft,
  Clock4,
  Download,
} from "lucide-react";

import "../../../styles/confirmation/sidebar/sidebar-actions.css";

const SidebarActions = ({
  onOpenOrderStatus,
}) => {
  return (
    <div
      className="confirmation-sidebar-actions"
      data-rise="3"
    >

      {/* BUTTON 1 */}
      <button
        type="button"
        className="confirmation-sidebar-action-button confirmation-sidebar-action-button-primary"
        onClick={onOpenOrderStatus}
      >

        <Clock4
          size={11}
          strokeWidth={1.8}
        />

        <span>
          View order status
        </span>

      </button>

      {/* BUTTON 2 */}
      <button
        type="button"
        className="confirmation-sidebar-action-button confirmation-sidebar-action-button-secondary"
      >

        <Download
          size={11}
          strokeWidth={1.8}
        />

        <span>
          Download GST invoice
        </span>

      </button>

      {/* BUTTON 3 */}
      <a
        href="https://wa.me/HOK_NUMBER"
        target="_blank"
        rel="noreferrer"
        className="confirmation-sidebar-action-button confirmation-sidebar-action-button-whatsapp"
      >

        <span className="confirmation-sidebar-action-whatsapp-dot" />

        <span>
          Chat With us on WhatsApp
        </span>

      </a>

      {/* BUTTON 4 */}
      <a
        href="/"
        className="confirmation-sidebar-action-button confirmation-sidebar-action-button-secondary"
      >

        <ChevronLeft
          size={11}
          strokeWidth={1.8}
        />

        <span>
          Continue shopping
        </span>

      </a>

    </div>
  );
};

export default SidebarActions;