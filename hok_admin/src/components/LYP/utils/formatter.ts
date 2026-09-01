// src/components/LYP/utils/formatter.ts

export const inr = (amount: number): string => {
  if (amount === 0) return '₹0';
  if (!amount) return '₹0';
  
  const num = Math.round(amount);
  const parts = num.toString().split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  
  return `₹${formatted}`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${hours}:${minutes}`;
};

export const formatTime = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const formatISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatHours = (hours: number): string => {
  if (hours < 1) return '<1h';
  return `${Math.round(hours)}h`;
};

export const formatDays = (days: number): string => {
  if (days < 1) return '<1d';
  return `${Math.round(days)}d`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const pluralize = (count: number, singular: string, plural?: string): string => {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural || singular + 's'}`;
};

export const getFirstName = (fullName: string): string => {
  if (!fullName) return 'there';
  return fullName.trim().split(' ')[0];
};

export const getInitials = (name: string): string => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const formatMeasurements = (measurements: any): string => {
  if (!measurements) return '';
  const keys = ['bust', 'waist', 'hips', 'shoulder', 'length', 'sleeve'];
  const parts: string[] = [];
  for (const key of keys) {
    if (measurements[key]) {
      parts.push(`${key.charAt(0).toUpperCase()} ${measurements[key]}"`);
    }
  }
  return parts.join(' · ');
};