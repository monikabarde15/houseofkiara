// services/exportService.ts

export interface ExportColumn {
  key: string;
  header: string;
}

export const exportService = {
  // Export data to CSV
  exportToCSV: <T extends Record<string, any>>(
    data: T[],
    columns: ExportColumn[],
    filename: string = 'export.csv'
  ): void => {
    if (data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Build CSV header
    const header = columns.map(col => col.header).join(',');
    
    // Build CSV rows
    const rows = data.map(item => {
      return columns.map(col => {
        const value = item[col.key];
        // Handle values with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',');
    });

    const csv = [header, ...rows].join('\n');
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Export messages
  exportMessages: (messages: any[]) => {
    const columns: ExportColumn[] = [
      { key: 'name', header: 'Message Name' },
      { key: 'audience', header: 'Goes To' },
      { key: 'class', header: 'Type' },
      { key: 'status', header: 'Status' },
      { key: 'trigger', header: 'Trigger' },
      { key: 'lastEdited', header: 'Last Edited' },
      { key: 'editor', header: 'Editor' },
    ];
    exportService.exportToCSV(messages, columns, 'messages_export.csv');
  },

  // Export send log
  exportSendLog: (logs: any[]) => {
    const columns: ExportColumn[] = [
      { key: 'when', header: 'Date/Time' },
      { key: 'message', header: 'Message' },
      { key: 'who', header: 'Recipient' },
      { key: 'contact', header: 'Contact' },
      { key: 'channel', header: 'Channel' },
      { key: 'outcome', header: 'Outcome' },
      { key: 'about', header: 'About' },
      { key: 'sentBy', header: 'Sent By' },
    ];
    exportService.exportToCSV(logs, columns, 'send_log_export.csv');
  },
};