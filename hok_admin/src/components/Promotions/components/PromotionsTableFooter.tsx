/* ========================================
   Promotions Module - Table Footer
   Footer with count & show all
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5.9
   ======================================== */

import React from 'react';
import './styles/PromotionsTableFooter.css';

interface PromotionsTableFooterProps {
  count: number;
  filterText?: string;
}

export const PromotionsTableFooter: React.FC<PromotionsTableFooterProps> = ({
  count,
  filterText = '',
}) => {
  const text = count === 1 ? 'code' : 'codes';
  return (
    <div className="table-footer">
      <span className="table-footer__count">
        {count} {text}{filterText}
      </span>
    </div>
  );
};