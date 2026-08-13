// components/Toolbar.tsx
import React from 'react';
import './styles/Toolbar.css';

interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ children, className = '' }) => {
  return <div className={`msg-toolbar ${className}`}>{children}</div>;
};

interface SearchFieldProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`msg-search ${className}`}>
      <svg className="msg-search-icon" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="4.5" cy="4.5" r="3.5" />
        <line x1="7.5" y1="7.5" x2="10" y2="10" />
      </svg>
      <input
        type="text"
        className="msg-search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

interface FilterSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <select
      className={`msg-filter-select ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};