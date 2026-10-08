import { apiRequest } from "./apiClient";
import {
  HomepageRegistry,
  HeroSettings,
  HowItWorksSettings,
  FeaturedPiecesSettings,
  CategorySettings,
  OccasionsSettings,
  CommitmentSettings,
  DesignersSettings,
  TestimonialsSettings,
  InstagramSettings,
} from "../components/Homepage/types/homepage.types";

export interface HomepageApiResponse {
  hero: HeroSettings;
  hiw?: HowItWorksSettings;
  featured?: FeaturedPiecesSettings;
  category?: CategorySettings;
  occasions?: OccasionsSettings;
  commit?: CommitmentSettings;
  designers?: DesignersSettings;
  testi?: TestimonialsSettings;
  insta?: InstagramSettings;
  vis: {
    hero: boolean;
    hiw?: boolean;
    featured?: boolean;
    category?: boolean;
    occasions?: boolean;
    commit?: boolean;
    designers?: boolean;
    testi?: boolean;
    insta?: boolean;
    [key: string]: boolean;
  };
  heroOrder?: number;
  hiwOrder?: number;
  featuredOrder?: number;
  categoryOrder?: number;
  occasionsOrder?: number;
  commitOrder?: number;
  designersOrder?: number;
  testiOrder?: number;
  instaOrder?: number;
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

export const getCommitmentSection = async () => {
  const res = await apiRequest("/homepage/commitment");
  return res.data;
};

export const updateCommitmentSection = async (
  commit: Partial<CommitmentSettings>,
  isVisible?: boolean,
  order?: number
) => {
  const res = await apiRequest("/homepage/commitment", {
    method: "PUT",
    body: JSON.stringify({ commit, isVisible, order }),
  });
  return res.data;
};

export const getDesignersSection = async () => {
  const res = await apiRequest("/homepage/designers");
  return res.data;
};

export const updateDesignersSection = async (
  designers: Partial<DesignersSettings>,
  isVisible?: boolean,
  order?: number
) => {
  const res = await apiRequest("/homepage/designers", {
    method: "PUT",
    body: JSON.stringify({ designers, isVisible, order }),
  });
  return res.data;
};

export const getTestimonialsSection = async () => {
  const res = await apiRequest("/homepage/testimonials");
  return res.data;
};

export const updateTestimonialsSection = async (
  testi: Partial<TestimonialsSettings>,
  isVisible?: boolean,
  order?: number
) => {
  const res = await apiRequest("/homepage/testimonials", {
    method: "PUT",
    body: JSON.stringify({ testi, isVisible, order }),
  });
  return res.data;
};

export const getInstagramSection = async () => {
  const res = await apiRequest("/homepage/instagram");
  return res.data;
};

export const updateInstagramSection = async (
  insta: Partial<InstagramSettings>,
  isVisible?: boolean,
  order?: number
) => {
  const res = await apiRequest("/homepage/instagram", {
    method: "PUT",
    body: JSON.stringify({ insta, isVisible, order }),
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
