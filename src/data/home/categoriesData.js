// src/data/home/categoriesData.js

import cate1 from "../../assets/Shop-by-category/cate1.jpg";
import cate2 from "../../assets/Shop-by-category/cate2.jpg";
import cate3 from "../../assets/Shop-by-category/cate3.jpg";
import cate4 from "../../assets/Shop-by-category/cate4.jpg";
import cate5 from "../../assets/Shop-by-category/cate5.jpg";

// Desktop images
import sbc1 from "../../assets/sbc-desktop/sbc-1.jpg";
import sbc2 from "../../assets/sbc-desktop/sbc-2.jpg";
import sbc3 from "../../assets/sbc-desktop/sbc-3.jpg";
import sbc4 from "../../assets/sbc-desktop/sbc-4.jpg";
import sbc5 from "../../assets/sbc-desktop/sbc-5.jpg";

const categoriesData = {
  eyebrow: "Curated for Every Occasion",
  title: "Shop by Category",

  // Desktop view - each category with its desktop image
  rowOne: [
    {
      id: 1,
      name: "Bridal Lehengas",
      cta: "Shop Now",
      variant: "bridal",
      desktopImage: sbc1, // Admin can change this path
      mobile: {
        eyebrow: "Curated for every occasion",
        pieces: "480 pieces",
        image: cate1,
      },
    },
    {
      id: 2,
      name: "Sherwanis",
      cta: "Shop Now",
      variant: "sherwanis",
      desktopImage: sbc2,
      mobile: {
        eyebrow: "For the groom",
        pieces: "210 pieces",
        image: cate2,
      },
    },
  ],

  rowTwo: [
    {
      id: 3,
      name: "Sarees",
      cta: "Shop Now",
      variant: "sarees",
      desktopImage: sbc3,
      mobile: {
        eyebrow: "Timeless drapes",
        pieces: "640 pieces",
        image: cate3,
      },
    },
    {
      id: 4,
      name: "Anarkalis",
      cta: "Shop Now",
      variant: "anarkalis",
      desktopImage: sbc4,
      mobile: {
        eyebrow: "Ethereal silhouettes",
        pieces: "380 pieces",
        image: cate4,
      },
    },
    {
      id: 5,
      name: "Indo-Western",
      cta: "Shop Now",
      variant: "indo-western",
      desktopImage: sbc5,
      mobile: {
        eyebrow: "Modern fusion",
        pieces: "290 pieces",
        image: cate5,
      },
    },
  ],
};

export default categoriesData;