import { API_BASE_URL, getAuthToken } from "./apiClient";

export interface EnquiryPiece {
  productId: string;
  productName: string;
  designer?: string;
  image?: string;
  rentalPrice?: number;
  perDayRate?: number;
  securityDeposit?: number;
  listingPrice?: number;
}

export interface EnquiryLogEntry {
  message: string;
  author: string;
  createdAt: string;
}

export type EnquiryInterest = "Rent" | "Buy preloved" | "Buy new" | "General";
export type EnquiryStatus =
  | "New"
  | "In Conversation"
  | "On Hold"
  | "Converted"
  | "Closed";

export interface Enquiry {
  id: string;
  enquiryId: string;
  backendId?: string;
  customerId?: string;
  isOnFile?: boolean;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerCity?: string;
  channel: string;
  interestedIn: EnquiryInterest;
  assignedTo: string;
  pieces: EnquiryPiece[];
  eventDate?: string;
  holdStartDate?: string;
  holdEndDate?: string;
  followUpDate?: string;
  whatSheAsked?: string;
  status: EnquiryStatus;
  linkedOrderId?: string;
  linkedOfferId?: string;
  firstReplyAt?: string;
  createdAt: string;
  conversationLog: EnquiryLogEntry[];
}

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
  if (!response.ok || body.success === false) {
    throw new Error(body.message || "Enquiry request failed");
  }
  return body;
};

export const mapEnquiry = (item: any): Enquiry => ({
  id: item.enquiryId || item.id || item._id,
  enquiryId: item.enquiryId || item.id || item._id,
  backendId: item._id,
  customerId: item.customerId || "",
  isOnFile: Boolean(item.isOnFile || item.customerId),
  customerName: item.customerName || "",
  customerEmail: item.customerEmail || "",
  customerPhone: item.customerPhone || "",
  customerCity: item.customerCity || "",
  channel: item.channel || "WhatsApp",
  interestedIn: (item.interestedIn as EnquiryInterest) || "Rent",
  assignedTo: item.assignedTo || "Soumya",
  pieces: Array.isArray(item.pieces) ? item.pieces : [],
  eventDate: item.eventDate || "",
  holdStartDate: item.holdStartDate || "",
  holdEndDate: item.holdEndDate || "",
  followUpDate: item.followUpDate || "",
  whatSheAsked: item.whatSheAsked || "",
  status: (item.status as EnquiryStatus) || "New",
  linkedOrderId: item.linkedOrderId || "",
  linkedOfferId: item.linkedOfferId || "",
  firstReplyAt: item.firstReplyAt || "",
  createdAt: item.createdAt || new Date().toISOString(),
  conversationLog: Array.isArray(item.conversationLog)
    ? item.conversationLog
    : [],
});

export const getEnquiries = async (): Promise<Enquiry[]> => {
  const body = await request("/enquiries");
  const list = Array.isArray(body.data) ? body.data : [];
  return list.map(mapEnquiry);
};

export const createEnquiry = async (
  payload: Record<string, any>,
): Promise<{
  enquiry: Enquiry;
  customer?: any;
  isNewCustomer?: boolean;
}> => {
  const body = await request("/enquiries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return {
    enquiry: mapEnquiry(body.data),
    customer: body.customer,
    isNewCustomer: Boolean(body.isNewCustomer),
  };
};

export const updateEnquiry = async (
  id: string,
  payload: Record<string, any>,
): Promise<Enquiry> => {
  const body = await request(`/enquiries/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return mapEnquiry(body.data);
};

export const convertEnquiry = async (
  id: string,
  payload: Record<string, any>,
): Promise<{
  enquiry: Enquiry;
  order?: any;
  offer?: any;
  customer?: any;
  alreadyConverted?: boolean;
}> => {
  const body = await request(`/enquiries/${encodeURIComponent(id)}/convert`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return {
    enquiry: mapEnquiry(body.data),
    order: body.order,
    offer: body.offer,
    customer: body.customer,
    alreadyConverted: Boolean(body.alreadyConverted),
  };
};
