// src/components/LYP/utils/validators.ts

export const validatePhone = (phone: string): boolean => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

export const validateEmail = (email: string): boolean => {
  if (!email) return true; // Email is optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePIN = (pin: string): boolean => {
  if (!pin) return false;
  return /^[0-9]{6}$/.test(pin);
};

export const validatePAN = (pan: string): boolean => {
  if (!pan) return true; // PAN is optional
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
};

export const validateGSTIN = (gstin: string): boolean => {
  if (!gstin) return true; // GSTIN is optional
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin.toUpperCase());
};

export const normalizePhone = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

export const getPhoneDigits = (phone: string): string => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-10);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};