// components/Table.tsx
import React from 'react';
import './styles/Table.css';

export interface Column {
  key: string;
  header: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface TableProps {
  columns: Column[];
  children: React.ReactNode;
  className?: string;
  emptyMessage?: string;
  isEmpty?: boolean;
}

export const Table: React.FC<TableProps> = ({
  columns,
  children,
  className = '',
  emptyMessage = 'No data to display.',
  isEmpty = false,
}) => {
  return (
    <div className="msg-table-wrapper">
      <table className={`msg-table ${className}`}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  width: col.width,
                  textAlign: col.align || 'left',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={columns.length} className="msg-table-empty-cell">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
};

interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  clickable?: boolean;
  className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  onClick,
  clickable = false,
  className = '',
}) => {
  return (
    <tr
      className={`${clickable ? 'msg-table-row-clickable' : ''} ${className}`}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
    >
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  primary?: boolean;
  secondary?: boolean;
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = '',
  colSpan,
  primary = false,
  secondary = false,
}) => {
  return (
    <td
      className={`
        ${primary ? 'msg-table-cell-primary' : ''}
        ${secondary ? 'msg-table-cell-secondary' : ''}
        ${className}
      `}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};