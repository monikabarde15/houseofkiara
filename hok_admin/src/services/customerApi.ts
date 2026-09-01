import { Customer } from '../types';
import { apiRequest } from './apiClient';

export const getCustomers = async (filters?: { search?: string; status?: string; source?: string }) => {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.source) params.append('source', filters.source);
  
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  return (await apiRequest(`/customers${queryStr}`)).data as Customer[];
};

export const getCustomerById = async (id: string) => {
  return (await apiRequest(`/customers/${encodeURIComponent(id)}`)).data as Customer;
};

export const createCustomer = async (customer: Partial<Customer>) => {
  return (await apiRequest('/customers', {
    method: 'POST',
    body: JSON.stringify(customer)
  })).data as Customer;
};

export const updateCustomer = async (customer: Partial<Customer> & { id?: string; customerId?: string }) => {
  const idToUse = customer.id || customer.customerId || (customer as any)._id;
  if (!idToUse) {
    throw new Error('Customer ID is missing for update');
  }

  return (await apiRequest(`/customers/${encodeURIComponent(idToUse)}`, {
    method: 'PUT',
    body: JSON.stringify(customer)
  })).data as Customer;
};

export const deleteCustomer = async (id: string) => {
  return apiRequest(`/customers/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
};

export const addCustomerAddress = async (id: string, addressData: { label: string; address: string; isDefault?: boolean }) => {
  return (await apiRequest(`/customers/${encodeURIComponent(id)}/addresses`, {
    method: 'POST',
    body: JSON.stringify(addressData)
  })).data as Customer;
};

export const addCustomerOccasion = async (id: string, occasionData: { occasion: string; date?: string }) => {
  return (await apiRequest(`/customers/${encodeURIComponent(id)}/occasions`, {
    method: 'POST',
    body: JSON.stringify(occasionData)
  })).data as Customer;
};

export const addCustomerCommLog = async (id: string, logData: { message: string; channel?: string }) => {
  return (await apiRequest(`/customers/${encodeURIComponent(id)}/communication-log`, {
    method: 'POST',
    body: JSON.stringify(logData)
  })).data as Customer;
};
