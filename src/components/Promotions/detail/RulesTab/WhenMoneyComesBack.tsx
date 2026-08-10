/* ========================================
   Promotions Module - When Money Comes Back
   Refund rules (4 paragraphs)
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.16
   ======================================== */

import React from 'react';
import './styles/WhenMoneyComesBack.css';
import { Card } from '../../components/UI';

export const WhenMoneyComesBack: React.FC = () => {
  return (
    <Card header={<span className="card__title">When Money Comes Back</span>}>
      <div className="when-money__paragraph">
        <strong>ORDER CANCELLED.</strong> The discount is void and the redemption is released — it stops counting against both the total cap and the customer's own cap, so the code is whole again. The order stays in history marked Cancelled; the ledger on the Performance tab shows it separately and excludes it from every total.
      </div>

      <div className="when-money__paragraph">
        <strong>PART OF THE ORDER RETURNED OR REFUNDED.</strong> The discount recomputes on the qualifying lines the shopper keeps — they keep the <em>same rate</em>, <em>not</em> the same rupees. A 10% code on a ₹10,000 bag gives ₹1,000; return half and the discount settles at ₹500, so the refund is ₹4,500 rather than ₹5,000. The GST credit note computes on the discounted value of the returned lines at that line's own rate. The redemption is <em>not</em> released — the code did its job and brought the order in.
      </div>

      <div className="when-money__paragraph">
        <strong>RENTAL EXTENSIONS AND LATE FEES.</strong> A code applies to the original booking only. Extension charges and late fees are billed at full price — they are a service rendered after the offer was made, not part of the offer.
      </div>

      <div className="when-money__paragraph">
        <strong>DEPOSITS.</strong> Never discounted, never counted toward a minimum or a delivery threshold, and refunded on their own track through the deposit ledger — a promo never touches them.
      </div>
    </Card>
  );
};