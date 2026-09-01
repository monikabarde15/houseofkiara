import { Designer } from '../components/Designers/types/designer.types';
import { apiRequest } from './apiClient';

export const getDesigners = async (filters?: { search?: string; status?: string; type?: string }) => {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.type) params.append('type', filters.type);
  
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  return (await apiRequest(`/designers${queryStr}`)).data as Designer[];
};

export const getDesignerById = async (id: string) => {
  return (await apiRequest(`/designers/${encodeURIComponent(id)}`)).data as Designer;
};

export const createDesigner = async (designer: Partial<Designer>) => {
  return (await apiRequest('/designers', {
    method: 'POST',
    body: JSON.stringify(designer)
  })).data as Designer;
};

export const updateDesigner = async (id: string, designer: Partial<Designer>) => {
  return (await apiRequest(`/designers/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(designer)
  })).data as Designer;
};

export const deleteDesigner = async (id: string) => {
  return apiRequest(`/designers/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
};
