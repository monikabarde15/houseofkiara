// src/components/Listers/hooks/usePayouts.ts

import { useState, useCallback } from 'react';
import { PayoutTransaction, ListerLedger } from '../types/lister.types';
import { listerService } from '../services/listerService';
import { calculateLedger } from '../utils/derived';
import { inr, formatDate } from '../utils/formatter';
import { generateWhatsAppLink } from '../utils/generators';

export const usePayouts = (listerId: string, lister?: any) => {
  const [payouts, setPayouts] = useState<PayoutTransaction[]>([]);
  const [ledger, setLedger] = useState<ListerLedger>({
    paid: 0,
    pending: 0,
    sales: 0,
    rentals: 0,
    tv: 0,
    paidCount: 0,
    avgPct: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayouts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listerService.getPayouts(listerId);
      setPayouts(data);
      setLedger(calculateLedger(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payouts');
    } finally {
      setLoading(false);
    }
  }, [listerId]);

  const generateStatement = useCallback((listerName: string, phone: string) => {
    const paid = ledger.paid;
    const pending = ledger.pending;
    const paidCount = ledger.paidCount;
    const paidTransactions = payouts.filter(p => p.status === 'Paid').slice(0, 3);
    const pendingTransactions = payouts.filter(p => 
      p.status === 'Pending Approval' || p.status === 'Approved' || p.status === 'On Hold'
    );

    let message = `House of Kaira - payout statement for ${listerName}\n\n`;
    message += `Paid till date: ${inr(paid)} across ${paidCount} transaction${paidCount !== 1 ? 's' : ''}\n`;
    
    paidTransactions.forEach(tx => {
      const date = formatDate(tx.date);
      const isDamage = tx.isDamage ? ' (incl. damage compensation)' : '';
      message += `${date} ${inr(tx.amount)} ${tx.pct}% ${tx.orderId} ref ${tx.ref || '—'}${isDamage}\n`;
    });

    message += `\nUpcoming: ${pendingTransactions.length} payout${pendingTransactions.length !== 1 ? 's' : ''}\n`;
    pendingTransactions.forEach(tx => {
      message += `${inr(tx.amount)} ${tx.orderId} due ${formatDate(tx.dueDate)} `;
      message += tx.status === 'On Hold' ? 'on hold' : 'approved - payment in process';
      message += '\n';
    });

    // TDS section
    if (lister.pan && lister.panVerified) {
      message += '\nTDS u/s 194-O @1% applies on gross value; the exact deduction shows on each payout advice. PAN on file';
    } else {
      message += '\nReminder: please share your PAN - without it, payouts attract 5% TDS u/s 206AA.';
    }

    message += '\n\nQuestions? Just reply here.\n- Team HOK';

    return message;
  }, [payouts, ledger, lister]);

  const sendStatementWhatsApp = useCallback(async (listerName: string, phone: string) => {
    const message = generateStatement(listerName, phone);
    const link = generateWhatsAppLink(phone, message);
    
    if (!link) {
      throw new Error('No WhatsApp number on file for this contact yet.');
    }

    // Log the statement sent
    await listerService.logCommunication(listerId, 'WhatsApp', 
      `Payout statement sent - ${ledger.paidCount} paid - ${payouts.filter(p => p.status !== 'Paid').length} upcoming`
    );

    // Open WhatsApp
    window.open(link, '_blank');
    
    return true;
  }, [listerId, payouts, ledger]);

  const exportCSV = useCallback((listerName: string) => {
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
      tx.isDamage ? `${tx.stdPct}%+${tx.compPct}% comp` : `${tx.pct}%`,
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
  }, [payouts]);

  return {
    payouts,
    ledger,
    loading,
    error,
    fetchPayouts,
    generateStatement,
    sendStatementWhatsApp,
    exportCSV,
  };
};

export default usePayouts;