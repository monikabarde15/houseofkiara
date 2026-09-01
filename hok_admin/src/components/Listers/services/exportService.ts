// src/components/Listers/services/exportService.ts

import { PayoutTransaction } from '../types/lister.types';
import { formatDate } from '../utils/formatter';

export const exportService = {
  exportPayoutCSV: (payouts: PayoutTransaction[], listerName: string): void => {
    const headers = [
      'Order ID',
      'Product SKU',
      'Product Name',
      'Type',
      'Transaction Value',
      'Payout %',
      'Payout Amount',
      'TDS Deducted',
      'Net Paid',
      'HOK Commission',
      'Status',
      'Date',
      'Due Date',
      'Reference/UTR',
      'Damage Comp Included',
    ];

    const rows = payouts.map(tx => [
      tx.orderId,
      tx.sku,
      '', // Product name - would need to fetch from product service
      tx.type,
      tx.tv.toString(),
      tx.isDamage ? `${tx.stdPct || 0}%+${tx.compPct || 0}% comp` : `${tx.pct}%`,
      tx.amount.toString(),
      '', // TDS Deducted - calculated based on PAN status
      '', // Net Paid
      tx.commission.toString(),
      tx.status,
      formatDate(tx.date),
      formatDate(tx.dueDate),
      tx.ref || '',
      tx.isDamage ? 'Yes' : 'No',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const filename = `HOK_Payouts_${listerName.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};