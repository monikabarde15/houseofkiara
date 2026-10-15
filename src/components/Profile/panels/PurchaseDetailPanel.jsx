import React from 'react';
import { X } from 'lucide-react';
import "../../../styles/Profile/panels/PurchaseDetailPanel.css";

const PurchaseDetailPanel = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  return (
    <div className={`profile-purch-dpane ${isOpen ? 'open' : ''}`}>
      <div className="profile-purch-dpn">
        <div className="profile-purch-dpn-title">{order.piece}</div>
        <button className="profile-purch-dpn-close" onClick={onClose}>
          Close
          <X size={13} strokeWidth={1.5} />
        </button>
      </div>

      <div className="profile-purch-dpb">
        <div className="profile-purch-dp-img-cell">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="4" y="4" width="28" height="28" stroke="currentColor" strokeWidth="1" opacity="0.18" />
          </svg>
        </div>

        <div className="profile-purch-dp-info">
          <div className="profile-purch-dp-badge-row">
            {/* Delivered Status Badge */}
            {order.status === 'Delivered' && (
              <div className="profile-purch-badge profile-purch-b-del">
                <span className="profile-purch-bdot"></span>
                Delivered
              </div>
            )}

            {/* Processing Status Badge */}
            {order.status === 'Processing' && (
              <div className="profile-purch-badge profile-purch-b-pro">
                <span className="profile-purch-bdot"></span>
                Processing
              </div>
            )}

            {/* Cancelled Status Badge */}
            {order.status === 'Cancelled' && (
              <div className="profile-purch-badge profile-purch-b-can">
                <span className="profile-purch-bdot"></span>
                Cancelled
              </div>
            )}
          </div>

          <div className="profile-purch-dp-name">{order.piece}</div>
          <div className="profile-purch-dp-des">{order.typeDetail}</div>

          {/* Delivered Status */}
          {order.status === 'Delivered' && (
            <>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Order ID</div>
                <div className="profile-purch-dp-rv">{order.id}</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Order Type</div>
                <div className="profile-purch-dp-rv">{order.type}</div>
              </div>
              {order.type === 'Preloved' && (
                <div className="profile-purch-dp-row">
                  <div className="profile-purch-dp-rl">Condition</div>
                  <div className="profile-purch-dp-rv">Excellent - worn once, no damage</div>
                </div>
              )}
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Size</div>
                <div className="profile-purch-dp-rv">M</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Amount Paid</div>
                <div className="profile-purch-dp-rv">₹{order.amount.toLocaleString()}</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Ordered On</div>
                <div className="profile-purch-dp-rv">3 Mar 2025</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Delivered On</div>
                <div className="profile-purch-dp-rv">3 Mar 2025</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Delivery Address</div>
                <div className="profile-purch-dp-rv">204, Suncity Towers, Vijay Nagar, Indore MP 452001</div>
              </div>

              <div className="profile-purch-dp-btns">
                <button className="profile-purch-btn-p">View Product Page</button>
                <button className="profile-purch-btn-s">Get Support</button>
              </div>
            </>
          )}

          {/* Processing Status */}
          {order.status === 'Processing' && (
            <>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Order ID</div>
                <div className="profile-purch-dp-rv">{order.id}</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Order Type</div>
                <div className="profile-purch-dp-rv">{order.type}</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Size</div>
                <div className="profile-purch-dp-rv">M</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Amount Paid</div>
                <div className="profile-purch-dp-rv">₹{order.amount.toLocaleString()}</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Ordered On</div>
                <div className="profile-purch-dp-rv">10 May 2025</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Status</div>
                <div className="profile-purch-dp-rv profile-purch-dp-rv-processing">Processing - not yet dispatched</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Expected Dispatch</div>
                <div className="profile-purch-dp-rv">Within 3-5 business days</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Delivery Address</div>
                <div className="profile-purch-dp-rv">204, Suncity Towers, Vijay Nagar, Indore MP 452001</div>
              </div>

              <div className="profile-purch-dp-note gold">
                <div className="profile-purch-dp-note-h">Tracking Note</div>
                <div className="profile-purch-dp-note-t">
                  Tracking information will be available once your order is dispatched. You will receive a WhatsApp notification with courier details.
                </div>
              </div>

              <div className="profile-purch-dp-btns">
                <button className="profile-purch-btn-s">WhatsApp for Updates</button>
              </div>
            </>
          )}

          {/* Cancelled Status */}
          {order.status === 'Cancelled' && (
            <>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Order ID</div>
                <div className="profile-purch-dp-rv">{order.id}</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Order Date</div>
                <div className="profile-purch-dp-rv">2 Nov 2024</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Order Value</div>
                <div className="profile-purch-dp-rv profile-purch-dp-rv-cancelled">₹{order.amount.toLocaleString()}</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Cancellation Date</div>
                <div className="profile-purch-dp-rv">5 Nov 2024</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Cancelled By</div>
                <div className="profile-purch-dp-rv">Customer</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Reason</div>
                <div className="profile-purch-dp-rv">Changed mind</div>
              </div>
              <div className="profile-purch-dp-row">
                <div className="profile-purch-dp-rl">Refund Status</div>
                <div className="profile-purch-dp-rv profile-purch-dp-rv-refunded">Full refund — processed 12 Nov 2024</div>
              </div>

              <div className="profile-purch-dp-note">
                <div className="profile-purch-dp-note-h">Cancellation Note</div>
                <div className="profile-purch-dp-note-t">
                  Full refund has been processed. Amount will reflect in your original payment method within 5-7 business days.
                </div>
              </div>

              <div className="profile-purch-dp-btns">
                <button className="profile-purch-btn-s">Shop Again</button>
                <button className="profile-purch-btn-s">Size Guidance</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetailPanel;