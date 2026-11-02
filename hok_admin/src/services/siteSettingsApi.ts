import { SiteSettings } from "../types";
import {
  SiteSettingsRegistry,
  AnnouncementSettings,
  HeaderSettings,
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

