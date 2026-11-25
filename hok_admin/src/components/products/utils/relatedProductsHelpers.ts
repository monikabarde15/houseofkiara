import { Product } from "../../types/product";

/**
 * Returns true strictly when a product has Live status.
 */
export const isLiveProductStatus = (status?: string): boolean =>
  String(status || "").trim().toLowerCase() === "live";

/**
 * Resolves the canonical identifier used to persist product references.
 */
export const getCanonicalProductId = (
  product?: Partial<Product> | null,
): string =>
  String(
    product?.productId || product?.id || (product as any)?._id || "",
  ).trim();

/**
 * Collects all possible ID aliases (productId, id, _id) for matching.
 */
export const collectProductIds = (
  product?: Partial<Product> | null,
): string[] => {
  if (!product) return [];
  const rawIds = [product.productId, product.id, (product as any)._id];
  const unique = new Set<string>();
  for (const raw of rawIds) {
    const clean = String(raw || "").trim();
    if (clean) unique.add(clean);
  }
  return Array.from(unique);
};

/**
 * Checks whether any of a product's IDs belongs to the provided ID set.
 */
export const matchesAnyProductId = (
  product: Partial<Product>,
  idSet: Set<string>,
): boolean => collectProductIds(product).some((id) => idSet.has(id));

/**
 * Filters selectable Live products for the Admin Related Products dropdown.
 * Empty search query returns all eligible Live products (excluding self & already selected).
 */
export const filterSelectableLiveProducts = (
  allProducts: Product[],
  excludedCurrentIds: string[],
  selectedRelatedIds: string[],
  query: string,
): Product[] => {
  const currentIdSet = new Set(
    excludedCurrentIds.map((id) => String(id || "").trim()).filter(Boolean),
  );
  const selectedIdSet = new Set(
    selectedRelatedIds.map((id) => String(id || "").trim()).filter(Boolean),
  );
  const q = String(query || "").trim().toLowerCase();

  return (allProducts || []).filter((product) => {
    if (!isLiveProductStatus(product?.status)) return false;
    if (matchesAnyProductId(product, currentIdSet)) return false;
    if (matchesAnyProductId(product, selectedIdSet)) return false;

    if (!q) return true;

    return (
      String(product.name || "").toLowerCase().includes(q) ||
      String(product.designer || "").toLowerCase().includes(q) ||
      String(product.sku || "").toLowerCase().includes(q) ||
      String(product.productId || "").toLowerCase().includes(q)
    );
  });
};

/**
 * Resolves persisted related product IDs to Live products in order, deduplicated.
 */
export const resolveLiveRelatedProducts = (
  allProducts: Product[],
  excludedCurrentIds: string[],
  relatedIds: string[],
): Product[] => {
  const currentIdSet = new Set(
    excludedCurrentIds.map((id) => String(id || "").trim()).filter(Boolean),
  );
  const seenCanonicalIds = new Set<string>();
  const resolved: Product[] = [];

  for (const rawId of relatedIds || []) {
    const targetId = String(rawId || "").trim();
    if (!targetId || currentIdSet.has(targetId)) continue;

    const match = (allProducts || []).find((product) => {
      if (!isLiveProductStatus(product?.status)) return false;
      if (matchesAnyProductId(product, currentIdSet)) return false;
      return collectProductIds(product).includes(targetId);
    });
    if (!match) continue;

    const canonicalId = getCanonicalProductId(match);
    if (!canonicalId || seenCanonicalIds.has(canonicalId)) continue;
    seenCanonicalIds.add(canonicalId);
    resolved.push(match);
  }

  return resolved;
};
