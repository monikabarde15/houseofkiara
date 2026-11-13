import { SiteSettings } from "../types";
import {
  SiteSettingsRegistry,
  AnnouncementSettings,
  HeaderSettings,
  FooterSettings,
  MobileBarSettings,
  BrandSettings,
  ContactSettings,
  GoogleSettings,
  LegalSettings,
  RegionalSettings,
  SiteStatusSettings,
} from "../components/SiteSettings/types/siteSettings.types";
import { apiRequest } from "./apiClient";

export const getSiteSettings = async (): Promise<any> => {
  const res = await apiRequest("/site-settings");
  return res.data;
};

export const updateSiteSettings = async (
  settings: Partial<SiteSettingsRegistry> | SiteSettings | any,
): Promise<any> => {
  const res = await apiRequest("/site-settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
  return res.data;
};

export const getAnnouncementSettings = async (): Promise<AnnouncementSettings> => {
  const res = await apiRequest("/site-settings/announcement");
  return res.data;
};

export const updateAnnouncementSettings = async (
  announcement: Partial<AnnouncementSettings>,
): Promise<AnnouncementSettings> => {
  const res = await apiRequest("/site-settings/announcement", {
    method: "PUT",
    body: JSON.stringify({ announcement }),
  });
  return res.data;
};

export const getHeaderSettings = async (): Promise<HeaderSettings> => {
  const res = await apiRequest("/site-settings/header");
  return res.data;
};

export const updateHeaderSettings = async (
  header: Partial<HeaderSettings>,
): Promise<HeaderSettings> => {
  const res = await apiRequest("/site-settings/header", {
    method: "PUT",
    body: JSON.stringify({ header }),
  });
  return res.data;
};

export const getFooterSettings = async (): Promise<FooterSettings> => {
  const res = await apiRequest("/site-settings/footer");
  return res.data;
};

export const updateFooterSettings = async (
  footer: Partial<FooterSettings>,
): Promise<FooterSettings> => {
  const res = await apiRequest("/site-settings/footer", {
    method: "PUT",
    body: JSON.stringify({ footer }),
  });
  return res.data;
};

export const getMobileSettings = async (): Promise<MobileBarSettings> => {
  const res = await apiRequest("/site-settings/mobile");
  return res.data;
};

export const updateMobileSettings = async (
  mobile: Partial<MobileBarSettings>,
): Promise<MobileBarSettings> => {
  const res = await apiRequest("/site-settings/mobile", {
    method: "PUT",
    body: JSON.stringify({ mobile }),
  });
  return res.data;
};

export const getBrandSettings = async (): Promise<BrandSettings> => {
  const res = await apiRequest("/site-settings/brand");
  return res.data;
};

export const updateBrandSettings = async (
  brand: Partial<BrandSettings>,
): Promise<BrandSettings> => {
  const res = await apiRequest("/site-settings/brand", {
    method: "PUT",
    body: JSON.stringify({ brand }),
  });
  return res.data;
};

export const getContactSettings = async (): Promise<ContactSettings> => {
  const res = await apiRequest("/site-settings/contact");
  return res.data;
};

export const updateContactSettings = async (
  contact: Partial<ContactSettings>,
): Promise<ContactSettings> => {
  const res = await apiRequest("/site-settings/contact", {
    method: "PUT",
    body: JSON.stringify({ contact }),
  });
  return res.data;
};

export const getGoogleSettings = async (): Promise<GoogleSettings> => {
  const res = await apiRequest("/site-settings/google");
  return res.data;
};

export const updateGoogleSettings = async (
  google: Partial<GoogleSettings>,
): Promise<GoogleSettings> => {
  const res = await apiRequest("/site-settings/google", {
    method: "PUT",
    body: JSON.stringify({ google }),
  });
  return res.data;
};

export const getLegalSettings = async (): Promise<LegalSettings> => {
  const res = await apiRequest("/site-settings/legal");
  return res.data;
};

export const updateLegalSettings = async (
  legal: Partial<LegalSettings>,
): Promise<LegalSettings> => {
  const res = await apiRequest("/site-settings/legal", {
    method: "PUT",
    body: JSON.stringify({ legal }),
  });
  return res.data;
};

export const getRegionalSettings = async (): Promise<RegionalSettings> => {
  const res = await apiRequest("/site-settings/regional");
  return res.data;
};

export const updateRegionalSettings = async (
  regional: Partial<RegionalSettings>,
): Promise<RegionalSettings> => {
  const res = await apiRequest("/site-settings/regional", {
    method: "PUT",
    body: JSON.stringify({ regional }),
  });
  return res.data;
};

export const getMaintenanceSettings = async (): Promise<SiteStatusSettings> => {
  const res = await apiRequest("/site-settings/maintenance");
  return res.data;
};

export const updateMaintenanceSettings = async (
  maintenance: Partial<SiteStatusSettings>,
): Promise<SiteStatusSettings> => {
  const res = await apiRequest("/site-settings/maintenance", {
    method: "PUT",
    body: JSON.stringify(maintenance),
  });
  return res.data;
};

