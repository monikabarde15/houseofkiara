import { Product } from '../types';
import { apiRequest } from './apiClient';

export const getProducts = async () => (await apiRequest('/products')).data as Product[];

export const createProduct = async (product: Product) => (await apiRequest('/products', { method: 'POST', body: JSON.stringify(product) })).data as Product;

export const updateProduct = async (product: Product) => {
  const idToUse = product.productId || (product as any)._id || product.id;
  if (!idToUse) {
    throw new Error('Product ID is missing for update');
  }

  return (await apiRequest(`/products/${encodeURIComponent(idToUse)}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  })).data as Product;
};

export const deleteProduct = (id: string) => apiRequest(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' });

export const archiveProduct = (id: string) => apiRequest(`/products/${encodeURIComponent(id)}/archive`, { method: 'PATCH', body: JSON.stringify({ user: 'Admin' }) });

export const restoreProduct = (id: string) => apiRequest(`/products/${encodeURIComponent(id)}/restore`, { method: 'PATCH', body: JSON.stringify({ user: 'Admin' }) });

export const updateImages = (id: string, images: string[]) => apiRequest(`/products/${encodeURIComponent(id)}/images`, { method: 'PUT', body: JSON.stringify({ images, user: 'Admin' }) });

export const getProductById = async (id: string) => {
  return (await apiRequest(`/products/${encodeURIComponent(id)}`)).data as Product;
};