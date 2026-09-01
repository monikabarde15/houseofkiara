import { Lister } from '../components/Listers/types/lister.types';
import { apiRequest } from './apiClient';

export const getListers = async (filters?: { search?: string; status?: string }) => {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.status) params.append('status', filters.status);

  const queryStr = params.toString() ? `?${params.toString()}` : '';
  return (await apiRequest(`/listers${queryStr}`)).data as Lister[];
};

export const getListerById = async (id: string) => {
  return (await apiRequest(`/listers/${encodeURIComponent(id)}`)).data as Lister;
};

export const createLister = async (data: Partial<Lister>) => {
  return (await apiRequest('/listers', {
    method: 'POST',
    body: JSON.stringify(data),
  })).data as Lister;
};

export const updateLister = async (id: string, data: Partial<Lister>) => {
  return (await apiRequest(`/listers/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })).data as Lister;
};

export const deleteLister = async (id: string) => {
  return apiRequest(`/listers/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
};

export const updateBankDetails = async (id: string, bankDetails: any) => {
  return (await apiRequest(`/listers/${encodeURIComponent(id)}/bank-details`, {
    method: 'PUT',
    body: JSON.stringify(bankDetails),
  })).data as Lister;
};

export const listerApi = {
  getListers,
  getListerById,
  createLister,
  updateLister,
  deleteLister,
  updateBankDetails,
};

export default listerApi;
