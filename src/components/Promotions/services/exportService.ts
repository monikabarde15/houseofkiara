// Export Service
/* ========================================
   Promotions Module - Export Service
   CSV export for promo codes
   Based on HOK_Promotions_Logic_Spec_v150.pdf Section 23.1
   ======================================== */

import { PromoCode } from '../types/promotions.types';
import { formatMoney, formatDate, formatValuePhrase } from '../utils/formatter';

export const exportService = {
  exportToCSV(codes: PromoCode[]): string {
    const headers = [
      'Code',
      'Type',
      'Value',
      'Max Discount',
      'Min Order',
      'Modes',
      'Scope',
      'Audience',
      'Customers',
      'First Order Only',
      'Total Cap',
      'Per Customer Cap',
      'Valid From',
      'Valid Until',
      'Status',
      'Visibility',
      'Public Description',
      'Reason',
      'Created By',
      'Created On',
    ];

    const rows = codes.map(code => [
      code.code,
      code.type,
      code.value,
      code.maxDiscount ? formatMoney(code.maxDiscount) : '',
      code.minOrder ? formatMoney(code.minOrder) : '',
      code.modes.join('; '),
      formatScopeForExport(code),
      code.audience,
      code.customerIds.join('; '),
      code.firstOrderOnly ? 'Yes' : 'No',
      code.usesTotalCap || '',
      code.usesPerCustomer || '',
      code.validFrom ? formatDate(code.validFrom) : '',
      code.validUntil ? formatDate(code.validUntil) : '',
      code.status,
      code.visibility,
      code.publicDesc,
      code.reason,
      code.createdBy,
      code.createdOn,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  },

  downloadCSV(codes: PromoCode[], filename: string = 'promo-codes.csv'): void {
    const csv = this.exportToCSV(codes);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  },
};

function formatScopeForExport(code: PromoCode): string {
  const parts: string[] = [];
  if (code.scope.categories.length > 0) {
    parts.push(`Categories: ${code.scope.categories.join('; ')}`);
  }
  if (code.scope.designerIds.length > 0) {
    parts.push(`Designers: ${code.scope.designerIds.join('; ')}`);
  }
  if (code.scope.skus.length > 0) {
    parts.push(`SKUs: ${code.scope.skus.join('; ')}`);
  }
  return parts.join(' | ') || 'All products';
}