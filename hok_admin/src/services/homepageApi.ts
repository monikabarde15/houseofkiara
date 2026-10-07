import { apiRequest } from "./apiClient";
import {
  HomepageRegistry,
  HeroSettings,
  HowItWorksSettings,
  FeaturedPiecesSettings,
  CategorySettings,
  OccasionsSettings,
} from "../components/Homepage/types/homepage.types";

export interface HomepageApiResponse {
  hero: HeroSettings;
  hiw?: HowItWorksSettings;
  featured?: FeaturedPiecesSettings;
  category?: CategorySettings;
  occasions?: OccasionsSettings;
  vis: {
    hero: boolean;
    hiw?: boolean;
    featured?: boolean;
    category?: boolean;
    occasions?: boolean;
    [key: string]: boolean;
  };
  heroOrder?: number;
  hiwOrder?: number;
  featuredOrder?: number;
  categoryOrder?: number;
  occasionsOrder?: number;
}

export const getHomepageData = async (): Promise<HomepageApiResponse> => {
  const res = await apiRequest("/homepage");
  return res.data;
};

export const getHeroSection = async () => {
  const res = await apiRequest("/homepage/hero");
  return res.data;
};

export const updateHeroSection = async (
  hero: Partial<HeroSettings>,
  isVisible?: boolean,
  order?: number
) => {
  const res = await apiRequest("/homepage/hero", {
    method: "PUT",
    body: JSON.stringify({ hero, isVisible, order }),
  });
  return res.data;
};

export const getHiwSection = async () => {
  const res = await apiRequest("/homepage/how-it-works");
  return res.data;
};

export const updateHiwSection = async (
  hiw: Partial<HowItWorksSettings>,
  isVisible?: boolean,
  order?: number
) => {
  const res = await apiRequest("/homepage/how-it-works", {
    method: "PUT",
    body: JSON.stringify({ hiw, isVisible, order }),
  });
  return res.data;
};

export const getFeaturedSection = async () => {
  const res = await apiRequest("/homepage/featured-pieces");
  return res.data;
};

export const updateFeaturedSection = async (
  featured: Partial<FeaturedPiecesSettings>,
  isVisible?: boolean,
  order?: number
) => {
  const res = await apiRequest("/homepage/featured-pieces", {
    method: "PUT",
    body: JSON.stringify({ featured, isVisible, order }),
  });
  return res.data;
};

export const getCategorySection = async () => {
  const res = await apiRequest("/homepage/category");
  return res.data;
};

export const updateCategorySection = async (
  category: Partial<CategorySettings>,
  isVisible?: boolean,
  order?: number
) => {
  const res = await apiRequest("/homepage/category", {
    method: "PUT",
    body: JSON.stringify({ category, isVisible, order }),
  });
  return res.data;
};

export const getOccasionsSection = async () => {
  const res = await apiRequest("/homepage/occasions");
  return res.data;
};

export const updateOccasionsSection = async (
  occasions: Partial<OccasionsSettings>,
  isVisible?: boolean,
  order?: number
) => {
  const res = await apiRequest("/homepage/occasions", {
    method: "PUT",
    body: JSON.stringify({ occasions, isVisible, order }),
  });
  return res.data;
};

export const publishHomepage = async (registry: HomepageRegistry) => {
  const res = await apiRequest("/homepage", {
    method: "PUT",
    body: JSON.stringify(registry),
  });
  return res.data;
};
