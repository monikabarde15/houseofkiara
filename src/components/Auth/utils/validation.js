export const validateEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return Boolean(email && emailRegex.test(email.trim()));
};

export const validateMobileFormat = (mobile) => {
  const digits = String(mobile || '').replace(/\D/g, '');
  const normalized = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : (digits.length === 11 && digits.startsWith('0') ? digits.slice(1) : digits);
  return /^[6-9]\d{9}$/.test(normalized);
};

export const validatePasswordFormat = (password) => {
  return Boolean(password && password.length >= 8);
};
