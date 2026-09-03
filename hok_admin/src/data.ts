import { Customer, Product, Order, Offer, Designer, Lister, ListerSubmission, PromoCode, EmailTemplate, SiteSettings, HomepageEditor } from './types';

export const initialCustomers: Customer[] = [];
export const initialProducts: Product[] = [];
export const initialOrders: Order[] = [];
export const initialOffers: Offer[] = [];
export const initialDesigners: Designer[] = [];
export const initialListers: Lister[] = [];
export const initialListerSubmissions: ListerSubmission[] = [];
export const initialPromoCodes: PromoCode[] = [];

export const initialEmailTemplates: EmailTemplate[] = [];

export const initialSiteSettings: SiteSettings = {
  siteName: "House of Kaira",
  tagline: "Wear it. Return it. Love it again.",
  supportEmail: "hello@houseofkaira.com",
  whatsappNumber: "+91 91670 71234",
  instagramHandle: "@house_of_kaira",
  logoUrl: "",
  announcementBar: {
    text: "Elegance on demand. Book your wedding party wardrobes 3 months in advance.",
    enabled: false,
    backgroundColor: "#1e1412",
    textColor: "#fcf9f5"
  }
};

export const initialHomepage: HomepageEditor = {
  hero: {
    heading: "Dress for every celebration. Return when it's over.",
    subheading: "Curated luxury Indian occasion wear — to rent, buy preloved, or list your own.",
    primaryCtaLabel: "Explore the Edit",
    primaryCtaUrl: "/explore",
    secondaryCtaLabel: "List Your Piece",
    secondaryCtaUrl: "/list-your-piece"
  },
  testimonials: []
};
