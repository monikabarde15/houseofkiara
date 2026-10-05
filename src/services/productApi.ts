import { Product } from "../types";

const API_BASE_URL = "http://localhost:5000/api";

const request = async (path: string, options?: RequestInit) => {
  const r = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });
  const b = await r.json().catch(() => ({}));
  if (!r.ok || b.success === false)
    throw new Error(b.message || "Product request failed");
  return b;
};

export const getProducts = async () =>
  (await request("/products")).data as Product[];

export const createProduct = async (product: Product) =>
  (
    await request("/products", {
      method: "POST",
      body: JSON.stringify(product),
    })
  ).data as Product;

// ✅ FIXED: Sirf EK baar export kiya gaya hai
export const updateProduct = async (product: Product) => {
  // ✅ FIX: productId ya _id use karo, 'id' nahi
  const idToUse = product.productId || product._id || product.id;

  if (!idToUse) {
    throw new Error("Product ID is missing for update");
  }

  return (
    await request(`/products/${encodeURIComponent(idToUse)}`, {
      method: "PUT",
      body: JSON.stringify(product),
    })
  ).data as Product;
};

export const deleteProduct = (id: string) =>
  request(`/products/${encodeURIComponent(id)}`, { method: "DELETE" });

export const archiveProduct = (id: string) =>
  request(`/products/${encodeURIComponent(id)}/archive`, {
    method: "PATCH",
    body: JSON.stringify({ user: "Admin" }),
  });

export const restoreProduct = (id: string) =>
  request(`/products/${encodeURIComponent(id)}/restore`, {
    method: "PATCH",
    body: JSON.stringify({ user: "Admin" }),
  });

export const updateImages = (id: string, images: string[]) =>
  request(`/products/${encodeURIComponent(id)}/images`, {
    method: "PUT",
    body: JSON.stringify({ images, user: "Admin" }),
  });

// ✅ FIXED: Sirf EK baar export kiya gaya hai
export const getProductById = async (id: string) => {
  const response = await fetch(
    `${API_BASE_URL}/products/${encodeURIComponent(id)}`,
  );
  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch product");
  }

  return json.data;
};
