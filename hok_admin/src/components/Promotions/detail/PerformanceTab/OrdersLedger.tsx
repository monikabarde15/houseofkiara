/* ========================================
   Promotions Module - Orders Ledger
   Orders that used this code
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.6
   ======================================== */

import React from 'react';
import './styles/OrdersLedger.css';
import { Card, Link } from '../../components/UI';
import { PromoCode } from '../../types/promotions.types';
import { formatDate, formatMoney } from '../../utils/formatter';

interface Order {
  id: string;
  customer: string;
  mode: string;
  placed: string;
  base: number;
  discount: number;
  customerPaid: number;
  status: string;
}

interface OrdersLedgerProps {
  orders: Order[];
  code: PromoCode;
}

export const OrdersLedger: React.FC<OrdersLedgerProps> = ({ orders, code }) => {
  const hasOrders = orders.length > 0;

  return (
    <Card
      header={
        <>
          <span className="card__title">Orders That Used This Code</span>
          <span className="status-badge neutral">{hasOrders ? `${orders.length} orders` : '0 orders'}</span>
        </>
      }
    >
      <table className="orders-ledger__table">
        <thead>
          <tr>
            <th className="orders-ledger__th">Order</th>
            <th className="orders-ledger__th">Customer</th>
            <th className="orders-ledger__th">Mode</th>
            <th className="orders-ledger__th">Placed</th>
            <th className="orders-ledger__th">Base</th>
            <th className="orders-ledger__th">Discount</th>
            <th className="orders-ledger__th">Customer Paid</th>
            <th className="orders-ledger__th">Status</th>
          </tr>
        </thead>
        <tbody>
          {!hasOrders ? (
            <tr>
              <td colSpan={8} className="orders-ledger__empty-cell">
                No orders yet — the moment an order carries this code, it appears here.
              </td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order.id}>
                <td className="orders-ledger__td">
                  <Link>{order.id}</Link>
                </td>
                <td className="orders-ledger__td">
                  <Link>{order.customer}</Link>
                </td>
                <td className="orders-ledger__td">{order.mode}</td>
                <td className="orders-ledger__td">{formatDate(order.placed)}</td>
                <td className="orders-ledger__td">{formatMoney(order.base)}</td>
                <td className="orders-ledger__td discount">-{formatMoney(order.discount)}</td>
                <td className="orders-ledger__td">{formatMoney(order.customerPaid)}</td>
                <td className="orders-ledger__td">
                  <span className="status-badge neutral">{order.status}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="orders-ledger__footer">
        Customer Paid = discounted base + GST, excluding the security deposit. The order book is the redemption ledger — nothing here is stored separately, so this table and the orders module can never disagree.
      </div>
    </Card>
  );
};