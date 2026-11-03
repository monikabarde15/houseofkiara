// src/services/contactApi.js

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5003/api"
    : "/api");

// In-memory cache to prevent redundant fetches
let cachedContact = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds

export const defaultContactConfig = {
  supportEmail: "hello@houseofkaira.com",
  phone: "+91 731 4005 220",
  whatsApp: "+91 98765 43210",
  daysOpen: "7 days a week",
  hours: "10 AM – 8 PM IST",
  replyWithinHrs: 2,
  returnsAddress: {
    addressedTo: "HOK Returns Desk",
    addressLine1: "14 Vijay Nagar",
    addressLine2: "Scheme 54",
    landmark: "",
    city: "Indore",
    state: "Madhya Pradesh",
    pinCode: "452010",
    contactNumber: "+91 731 4005 220",
  },
  whatsAppButton: {
    show: true,
    tooltip: "Chat with us",
    preFilledMessage: "Hi House of Kaira, I have a question about",
  },
  social: {
    instagram: "@house_of_kaira",
    followLabel: "Follow Us",
    facebook: "",
    pinterest: "",
    youTube: "",
    linkedIn: "",
  },
};

/**
 * Format phone string for tel: link (keeps + and digits).
 */
export function cleanPhoneForTel(phone) {
  if (!phone || typeof phone !== "string") return "";
  return phone.replace(/[^\d+]/g, "");
}

/**
 * Format phone string for WhatsApp wa.me link (digits only).
 */
export function cleanPhoneForWhatsApp(phone) {
  if (!phone || typeof phone !== "string") return "919876543210";
  const digits = phone.replace(/\D/g, "");
  return digits.length > 0 ? digits : "919876543210";
}

/**
 * Constructs a wa.me WhatsApp URL with encoded message.
 */
export function buildWhatsAppUrl(phone, message = "") {
  const rawNumber = cleanPhoneForWhatsApp(phone);
  const textParam = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${rawNumber}${textParam}`;
}

/**
 * Constructs a mailto: link with optional subject.
 */
export function buildMailtoUrl(email, subject = "") {
  const safeEmail = email || defaultContactConfig.supportEmail;
  const subjParam = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${safeEmail}${subjParam}`;
}

/**
 * Fetches the active contact configuration from the public API.
 */
export async function getContactSettings(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedContact && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedContact;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/site-settings/contact/public`);
    if (res.ok) {
      const json = await res.json();
      const rawData = (json && (json.data || json.contact)) || {};

      cachedContact = {
        supportEmail: rawData.supportEmail || defaultContactConfig.supportEmail,
        phone: rawData.phone || defaultContactConfig.phone,
        whatsApp: rawData.whatsApp || defaultContactConfig.whatsApp,
        daysOpen: rawData.daysOpen || defaultContactConfig.daysOpen,
        hours: rawData.hours || defaultContactConfig.hours,
        replyWithinHrs:
          typeof rawData.replyWithinHrs === "number"
            ? rawData.replyWithinHrs
            : defaultContactConfig.replyWithinHrs,
        returnsAddress: {
          addressedTo:
            rawData.returnsAddress?.addressedTo ||
            defaultContactConfig.returnsAddress.addressedTo,
          addressLine1:
            rawData.returnsAddress?.addressLine1 ||
            defaultContactConfig.returnsAddress.addressLine1,
          addressLine2:
            rawData.returnsAddress?.addressLine2 ||
            defaultContactConfig.returnsAddress.addressLine2,
          landmark:
            rawData.returnsAddress?.landmark ||
            defaultContactConfig.returnsAddress.landmark,
          city:
            rawData.returnsAddress?.city ||
            defaultContactConfig.returnsAddress.city,
          state:
            rawData.returnsAddress?.state ||
            defaultContactConfig.returnsAddress.state,
          pinCode:
            rawData.returnsAddress?.pinCode ||
            defaultContactConfig.returnsAddress.pinCode,
          contactNumber:
            rawData.returnsAddress?.contactNumber ||
            defaultContactConfig.returnsAddress.contactNumber,
        },
        whatsAppButton: {
          show:
            rawData.whatsAppButton?.show !== undefined
              ? !!rawData.whatsAppButton.show
              : defaultContactConfig.whatsAppButton.show,
          tooltip:
            rawData.whatsAppButton?.tooltip ||
            defaultContactConfig.whatsAppButton.tooltip,
          preFilledMessage:
            rawData.whatsAppButton?.preFilledMessage ||
            defaultContactConfig.whatsAppButton.preFilledMessage,
        },
        social: {
          instagram:
            rawData.social?.instagram || defaultContactConfig.social.instagram,
          followLabel:
            rawData.social?.followLabel ||
            defaultContactConfig.social.followLabel,
          facebook:
            rawData.social?.facebook || defaultContactConfig.social.facebook,
          pinterest:
            rawData.social?.pinterest || defaultContactConfig.social.pinterest,
          youTube:
            rawData.social?.youTube || defaultContactConfig.social.youTube,
          linkedIn:
            rawData.social?.linkedIn || defaultContactConfig.social.linkedIn,
        },
      };

      lastFetchTime = now;
      return cachedContact;
    }
  } catch (err) {
    console.warn("Could not fetch public contact settings, using fallback:", err);
  }

  return defaultContactConfig;
}
