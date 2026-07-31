import { Customer } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const request = async (path: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    throw new Error(body.message || 'Customer API request failed');
  }
  return body;
};

export const getCustomers = async (filters?: { search?: string; status?: string; source?: string }) => {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.source) params.append('source', filters.source);
  
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  return (await request(`/customers${queryStr}`)).data as Customer[];
};

export const getCustomerById = async (id: string) => {
  return (await request(`/customers/${encodeURIComponent(id)}`)).data as Customer;
};

export const createCustomer = async (customer: Partial<Customer>) => {
  return (await request('/customers', {
    method: 'POST',
    body: JSON.stringify(customer)
  })).data as Customer;
};

export const updateCustomer = async (customer: Partial<Customer> & { id: string }) => {
  const idToUse = customer.id || (customer as any).customerId || (customer as any)._id;
  if (!idToUse) {
    throw new Error('Customer ID is missing for update');
  }

  return (await request(`/customers/${encodeURIComponent(idToUse)}`, {
    method: 'PUT',
    body: JSON.stringify(customer)
  })).data as Customer;
};

export const deleteCustomer = async (id: string) => {
  return request(`/customers/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
};

export const addCustomerAddress = async (id: string, addressData: { label: string; address: string; isDefault?: boolean }) => {
  return (await request(`/customers/${encodeURIComponent(id)}/addresses`, {
    method: 'POST',
    body: JSON.stringify(addressData)
  })).data as Customer;
};

export const addCustomerOccasion = async (id: string, occasionData: { occasion: string; date?: string }) => {
  return (await request(`/customers/${encodeURIComponent(id)}/occasions`, {
    method: 'POST',
    body: JSON.stringify(occasionData)
  })).data as Customer;
};

export const addCustomerCommLog = async (id: string, logData: { message: string; channel?: string }) => {
  return (await request(`/customers/${encodeURIComponent(id)}/communication-log`, {
    method: 'POST',
    body: JSON.stringify(logData)
  })).data as Customer;
};
