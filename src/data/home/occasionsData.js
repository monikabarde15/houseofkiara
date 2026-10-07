// src/data/home/occasionsData.js
import grid1 from "../../assets/Hero-images/grid-1.jpg";
import grid2 from "../../assets/Hero-images/grid-2.jpg";
import grid3 from "../../assets/Hero-images/grid-3.jpg";
import grid4 from "../../assets/Hero-images/grid-4.jpg";
import grid11 from "../../assets/Hero-images/grid-11.jpg";
import grid12 from "../../assets/Hero-images/grid-12.jpg";

export const defaultOccasionsList = [
  {
    id: "wedding",
    name: "Wedding",
    slug: "Wedding",
    eyebrow: "Bridal & Groom",
    count: "3 live pieces",
    image: grid1,
  },
  {
    id: "sangeet",
    name: "Sangeet",
    slug: "Sangeet",
    eyebrow: "Dance & Glamour",
    count: "2 live pieces",
    image: grid2,
  },
  {
    id: "reception",
    name: "Reception",
    slug: "Reception",
    eyebrow: "Evening Elegance",
    count: "2 live pieces",
    image: grid3,
  },
  {
    id: "mehendi",
    name: "Mehendi",
    slug: "Mehendi",
    eyebrow: "Colourful Celebrations",
    count: "1 live piece",
    image: grid4,
  },
  {
    id: "cocktail",
    name: "Cocktail",
    slug: "Cocktail",
    eyebrow: "Modern Chic",
    count: "1 live piece",
    image: grid11,
  },
  {
    id: "engagement",
    name: "Engagement",
    slug: "Engagement",
    eyebrow: "The Ring Ceremony",
    count: "Available to book",
    image: grid12,
  },
];

const defaultOccasionsData = {
  eyebrow: "Dressed for the Day",
  title: "Shop by *Occasion*",
  viewAll: {
    lbl: "All Occasions →",
    url: "/main-page?section=occasions",
  },
  layout: "Even grid",
  ctaLbl: "Shop the Edit",
  showCount: true,
  items: defaultOccasionsList,
};

export default defaultOccasionsData;
