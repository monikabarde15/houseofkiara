// src\data\home\categoriesData.js
import cate1 from "../../assets/Shop-by-category/cate1.jpg";
import cate2 from "../../assets/Shop-by-category/cate2.jpg";
import cate3 from "../../assets/Shop-by-category/cate3.jpg";
import cate4 from "../../assets/Shop-by-category/cate4.jpg";
import cate5 from "../../assets/Shop-by-category/cate5.jpg";

const categoriesData = {
  eyebrow: "Curated for Every Occasion",

  title: "Shop by Category",

  rowOne: [
    {
      id: 1,
      name: "Bridal Lehengas",
      cta: "Shop Now",
      variant: "bridal",

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

      mobile: {
        eyebrow: "Modern fusion",
        pieces: "290 pieces",
        image: cate5,
      },
    },
  ],
};

export default categoriesData;

