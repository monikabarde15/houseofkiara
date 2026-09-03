import { SiteSettings } from '../types';
import { apiRequest } from './apiClient';

export const getSiteSettings = async (): Promise<SiteSettings> => {
  const res = await apiRequest('/site-settings');
  return res.data;
};

export const updateSiteSettings = async (settings: SiteSettings): Promise<SiteSettings> => {
  const res = await apiRequest('/site-settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  });
  return res.data;
};
