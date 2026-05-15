// src\components\Confirmation\sidebar\SidebarActions.jsx
import { useState, useEffect } from "react";

import {
  ChevronLeft,
  Clock4,
  Download,
} from "lucide-react";

import "../../../styles/confirmation/sidebar/sidebar-actions.css";

const SidebarActions = ({
  onOpenOrderStatus,
}) => {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 430px)");
    setIsMobile(mediaQuery.matches);
    
    const handleChange = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div
      className="confirmation-sidebar-actions"
      data-rise={isMobile ? "5" : "3"}
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