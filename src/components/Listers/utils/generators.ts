// src/components/Listers/utils/generators.ts

import { getPhoneDigits } from './validators';

export const generateSlug = (name: string, existingSlugs: string[] = []): string => {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  if (!existingSlugs.includes(base)) {
    return base;
  }
  
  let counter = 2;
  while (existingSlugs.includes(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
};

export const generateSKU = (designer: string, existingSKUs: string[] = []): string => {
  const words = designer.trim().split(' ');
  let initials: string;
  
  if (words.length >= 2) {
    initials = words
      .filter(w => w.length > 0)
      .map(w => w[0].toUpperCase())
      .join('')
      .slice(0, 3);
  } else {
    initials = designer.slice(0, 3).toUpperCase();
  }
  
  const prefix = `HOK-${initials}-`;
  
  // Find highest suffix
  let maxSuffix = 0;
  const regex = new RegExp(`^${prefix}(\\d{3})$`);
  
  for (const sku of existingSKUs) {
    const match = sku.match(regex);
    if (match) {
      const suffix = parseInt(match[1], 10);
      if (suffix > maxSuffix) maxSuffix = suffix;
    }
  }
  
  const nextSuffix = maxSuffix + 1;
  const padded = String(nextSuffix).padStart(3, '0');
  
  return `${prefix}${padded}`;
};

export const generateSubId = (existingIds: string[] = [], year: number = new Date().getFullYear()): string => {
  const prefix = `SUB-${year}-`;
  let maxNum = 0;
  
  const regex = new RegExp(`^SUB-${year}-(\\d{3})$`);
  
  for (const id of existingIds) {
    const match = id.match(regex);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  
  const nextNum = maxNum + 1;
  const padded = String(nextNum).padStart(3, '0');
  
  return `${prefix}${padded}`;
};

export const generateWhatsAppLink = (phone: string, message?: string): string | null => {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  
  let url = `https://wa.me/${digits}`;
  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }
  return url;
};

export const generateWhatsAppMessage = (
  firstName: string,
  template: string,
  ...args: string[]
): string => {
  const message = template
    .replace(/\{First\}/g, firstName)
    .replace(/\{([^}]+)\}/g, (_, key) => {
      const index = parseInt(key, 10);
      return args[index] || '';
    });
  return message;
};

export const getDefaultWhatsAppMessage = (firstName: string): string => {
  return `Hi ${firstName}, House of Kaira here.`;
};