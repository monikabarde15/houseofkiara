// src/components/LYP/services/exportService.ts

import { Submission } from '../types/submission.types';
import { formatDate, formatMeasurements } from '../utils/formatter';
import toast from 'react-hot-toast';

export const exportService = {
  exportSubmissionsCSV: (submissions: Submission[]): void => {
    if (submissions.length === 0) {
      toast.success('No submissions to export');
      return;
    }

    const headers = [
      'SUB ID',
      'Submitted',
      'Lister',
      'Phone',
      'Email',
      'City',
      'Piece',
      'Designer',
      'Category',
      'Colour',
      'Size',
      'Measurements',
      'Times Worn',
      'Year of Purchase',
      'Intent',
      'Channel',
      'Status',
      'Self Grade',
      'Our Grade',
      'Expectation Rent',
      'Expectation Sell',
      'Original Price',
      'Price Verified Via',
      'SKU',
      'Decision On',
      'Decision By',
      'Reason',
    ];

    const rows = submissions.map(s => {
      const status = s.decision ? s.decision.what : 
                     s.moreInfo ? 'Awaiting Reply' :
                     s.replyAt ? 'In Review' : 'New';
      
      const measurements = s.measurements ? formatMeasurements(s.measurements) : '';
      
      return [
        s.subid,
        s.submittedAt,
        s.listerID,
        '', // Phone - would need lister data
        '', // Email - would need lister data
        s.city || '',
        s.piece,
        s.designer || '',
        s.category || '',
        s.colour || '',
        s.size || '',
        measurements,
        s.timesWorn || '',
        s.yearOfPurchase || '',
        s.intent || '',
        s.channel || '',
        status,
        s.selfGrade || '',
        s.assessment?.grade || '',
        s.expectation?.rent || '',
        s.expectation?.sell || '',
        s.originalPrice || '',
        s.assessment?.retailVerifiedVia || '',
        s.assessment?.sku || '',
        s.decision?.on ? formatDate(s.decision.on) : '',
        s.decision?.by || '',
        s.decision?.reason || s.decision?.reasonCode || '',
      ];
    });

    // Escape and quote all cells
    const escapeCell = (cell: string) => {
      if (typeof cell !== 'string') cell = String(cell);
      if (cell.includes('"')) cell = cell.replace(/"/g, '""');
      return `"${cell}"`;
    };

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCell).join(','))
    ].join('\n');

    // Add BOM for UTF-8
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'hok_submissions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};