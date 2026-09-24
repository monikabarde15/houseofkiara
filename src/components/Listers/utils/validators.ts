// src/components/Listers/utils/validators.ts

export const validatePIN = (pin: string): boolean => {
  return /^[0-9]{6}$/.test(pin);
};

export const validatePhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePAN = (pan: string): boolean => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
};

export const validateGSTIN = (gstin: string): boolean => {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin.toUpperCase());
};

export const normalizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const getPhoneDigits = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-10);
};