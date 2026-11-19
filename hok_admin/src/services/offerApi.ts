import { Offer } from "../types";

import { API_BASE_URL, getAuthToken } from "./apiClient";
const BASE = API_BASE_URL;
const request = async (path: string, options?: RequestInit) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options?.headers as Record<string, string>) || {}),
  };
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false)
    throw new Error(body.message || "Offer request failed");
  return body;
};
export const mapOffer = (item: any): Offer => {
  const rawOffered = Number(item.offeredAmount || 0);
  const isEnquiryOnly =
    item.status === "Enquiry" ||
    (rawOffered === 0 && !["Accepted", "Completed", "Counter Offered"].includes(item.status));
  const effectiveOfferPrice = isEnquiryOnly
    ? 0
    : Number(item.offeredAmount || item.finalAmount || 0);
  const marketPrice = Number(item.originalAmount || 0);

  return {
    id: item.offerId || item.id || item._id,
    backendId: item._id,
    productId: item.productId || "",
    productImage: item.productImage || item.pieces?.[0]?.image || "",
    designer: item.designer || item.pieces?.[0]?.designer || "",
    pieces: Array.isArray(item.pieces)
      ? item.pieces.map((p: any) => ({
          productId: p.productId || "",
          productName: p.productName || "",
          designer: p.designer || "",
          image: p.image || "",
          listingPrice: Number(p.listingPrice || 0),
          rentalPrice: Number(p.rentalPrice || 0),
        }))
      : [],
    customerId: item.customerId || "",
    customerName: item.customerName || "",
    customerEmail: item.customerEmail || "",
    phone: item.customerPhone || "",
    productName: item.productName || "",
    marketPrice,
    offerPrice: effectiveOfferPrice,
    askPercentage:
      effectiveOfferPrice > 0 && marketPrice > 0
        ? Math.round((effectiveOfferPrice / marketPrice) * 100)
        : 0,
    date: item.createdAt || new Date().toISOString(),
    status: isEnquiryOnly
      ? "Enquiry"
      : item.status === "Rejected"
        ? "Declined"
        : item.status === "Counter Offered"
          ? "Countered"
          : item.status === "Assigned"
            ? "On Hold"
            : item.status === "Completed"
              ? "Accepted"
              : item.status || "Pending",
    counterPrice: item.counterOffers?.at(-1)?.amount,
    channel: item.channel || "Website",
    note: item.notes?.at(-1)?.message,
    promoCode: item.promoCode || item.code || "",
    assignedTo: item.assignedTo || "",
    mode: item.mode || "Preloved",
    rentalStartDate: item.rentalStartDate || "",
    rentalEndDate: item.rentalEndDate || "",
    address: item.address || item.customerCity || "",
    customerCity: item.customerCity || "",
    linkedOrderId: item.linkedOrderId || "",
  };
};
export const getOffers = async () => {
  const body = await request("/offers?limit=1000");
  const items = Array.isArray(body.data)
    ? body.data
    : body.data?.offers || body.offers || [];
  return items.map(mapOffer);
};
const routeId = (id: string, backendId?: string) =>
  encodeURIComponent(backendId || id);
export const createOffer = async (offer: Partial<Offer>) => {
  const res = await request("/offers", {
    method: "POST",
    body: JSON.stringify({
      productId: offer.productId,
      productName: offer.productName,
      productImage: offer.productImage,
      designer: offer.designer,
      pieces: offer.pieces,
      customerId: offer.customerId,
      customerName: offer.customerName,
      customerEmail: offer.customerEmail,
      customerPhone: offer.phone,
      customerCity: offer.customerCity || offer.address,
      address: offer.address,
      mode: offer.mode,
      rentalStartDate: offer.rentalStartDate,
      rentalEndDate: offer.rentalEndDate,
      createOrder: Boolean(offer.createOrder),
      originalAmount: offer.marketPrice,
      offeredAmount: offer.offerPrice,
      promoCode: offer.promoCode,
      notes: offer.note,
      assignedTo: offer.assignedTo,
      channel: offer.channel,
    }),
  });
  const mapped = mapOffer(res.data);
  return {
    ...mapped,
    newCustomer: res.customer,
    createdOrder: res.order || null,
  };
};
export const updateOfferStatus = async (
  id: string,
  status: Offer["status"],
  backendId?: string,
  extra?: {
    mode?: "Rental" | "Preloved" | "Buy";
    rentalStartDate?: string;
    rentalEndDate?: string;
    address?: string;
    amount?: number;
    createOrder?: boolean;
  },
) => {
  const res = await request(`/offers/${routeId(id, backendId)}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status:
        status === "Declined"
          ? "Rejected"
          : status === "Countered"
            ? "Counter Offered"
            : status === "On Hold"
              ? "Assigned"
              : status,
      ...(extra || {}),
    }),
  });
  return {
    ...mapOffer(res.data),
    createdOrder: res.order || null,
  };
};
export const updateOffer = async (
  id: string,
  fields: Partial<Offer>,
  backendId?: string,
) =>
  mapOffer(
    (
      await request(`/offers/${routeId(id, backendId)}`, {
        method: "PUT",
        body: JSON.stringify({
          customerName: fields.customerName,
          customerEmail: fields.customerEmail,
          customerPhone: fields.phone,
          productId: fields.productId,
          productName: fields.productName,
          productImage: fields.productImage,
          designer: fields.designer,
          pieces: fields.pieces,
          originalAmount: fields.marketPrice,
          offeredAmount: fields.offerPrice,
          assignedTo: fields.assignedTo,
          channel: fields.channel,
        }),
      })
    ).data,
  );
export const deleteOffer = (id: string, backendId?: string) =>
  request(`/offers/${routeId(id, backendId)}`, { method: "DELETE" });
export const permanentDeleteOffer = (id: string) =>
  request(`/offers/${encodeURIComponent(id)}/permanent`, { method: "DELETE" });
export const restoreOffer = (id: string) =>
  request(`/offers/${encodeURIComponent(id)}/restore`, { method: "PATCH" });
export const duplicateOffer = async (id: string) =>
  mapOffer(
    (
      await request(`/offers/${encodeURIComponent(id)}/duplicate`, {
        method: "POST",
      })
    ).data,
  );
export const sendCounterOffer = (
  id: string,
  amount: number,
  message?: string,
  backendId?: string,
) =>
  request(`/offers/${routeId(id, backendId)}/counter-offer`, {
    method: "POST",
    body: JSON.stringify({ amount, remarks: message, sentBy: "Admin" }),
  });
export const addOfferNote = (id: string, message: string, backendId?: string) =>
  request(`/offers/${routeId(id, backendId)}/notes`, {
    method: "POST",
    body: JSON.stringify({ message, createdBy: "Admin" }),
  });
export const getOfferNotes = async (id: string, backendId?: string) =>
  (await request(`/offers/${routeId(id, backendId)}/notes`)).data || [];
export const getOfferTimeline = async (id: string) =>
  (await request(`/offers/${encodeURIComponent(id)}/timeline`)).data || [];
export const assignOffer = (id: string, assignedTo: string, remarks?: string) =>
  request(`/offers/${encodeURIComponent(id)}/assign`, {
    method: "POST",
    body: JSON.stringify({ assignedTo, assignedBy: "Admin", remarks }),
  });
export const getAssignmentHistory = (id: string) =>
  request(`/offers/${encodeURIComponent(id)}/assignment-history`);
export const getCounterOfferHistory = (id: string) =>
  request(`/offers/${encodeURIComponent(id)}/counter-offers`);
export const getDashboard = () => request("/offers/dashboard");
export const getRecentOffers = () => request("/offers/recent");
export const getStatistics = () => request("/offers/statistics");
export const bulkDeleteOffers = (offerIds: string[]) =>
  request("/offers/bulk-delete", {
    method: "DELETE",
    body: JSON.stringify({ offerIds, deletedBy: "Admin" }),
  });
export const bulkRestoreOffers = (offerIds: string[]) =>
  request("/offers/bulk-restore", {
    method: "PATCH",
    body: JSON.stringify({ offerIds, restoredBy: "Admin" }),
  });
export const bulkPermanentDeleteOffers = (offerIds: string[]) =>
  request("/offers/bulk-permanent-delete", {
    method: "DELETE",
    body: JSON.stringify({ offerIds }),
  });
export const exportOffersUrl = `${API_BASE_URL}/offers/export/csv`;
