import { apiRequest } from "./apiClient";

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const res = await apiRequest('/categories');
  return res.data || [];
};

export const createCategory = async (name: string): Promise<Category> => {
  const res = await apiRequest('/categories', { method: 'POST', body: JSON.stringify({ name }) });
  return res.data;
};

export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
  const res = await apiRequest(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  return res.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiRequest(`/categories/${id}`, { method: 'DELETE' });
};
