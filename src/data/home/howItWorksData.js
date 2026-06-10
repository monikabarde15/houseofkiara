import {
  Search,
  MapPin,
  Truck,
  Heart,
  Camera,
  BadgeCheck,
  Wallet,
} from "lucide-react";

const howItWorksData = {
  eyebrow: "Simple by Design",

  title: "How House of Kaira works",

  tabs: {
    shop: "I Want To Shop",
    sell: "I Want To Sell",
  },

  shopSteps: [
    {
      number: "01",
      icon: Search,
      title: "Browse & Discover",
      description:
        "Explore curated designer collections available for rent, preloved purchase, or brand new ownership.",
    },
    {
      number: "02",
      icon: MapPin ,
      title: "Pick Your Path",
      description:
        "Choose whether you'd like to rent, buy preloved, or purchase new based on your occasion and style.",
    },
    {
      number: "03",
      icon: Truck,
      title: "Doorstep Delivery",
      description:
        "We carefully prepare and deliver your selected piece directly to your doorstep.",
    },
    {
      number: "04",
      icon: Heart,
      title: "Wear, Love, Repeat",
      description:
        "Enjoy your look and return rental pieces easily once your occasion is complete.",
    },
  ],

  sellSteps: [
    {
      number: "01",
      icon: Camera,
      title: "Photograph & List",
      description:
        "Share images and details of your designer piece through our simple listing process.",
    },
    {
      number: "02",
      icon: BadgeCheck,
      title: "We Review & Feature",
      description:
        "Our team verifies quality, authenticity, and presentation before publishing.",
    },
    {
      number: "03",
      icon: Wallet,
      title: "Ship & Get Paid",
      description:
        "Once approved and sold or rented, ship the item and receive your earnings.",
    },
  ],

  sellCta: {
    text: "The hours of craftsmanship on that piece deserve more than a dark wardrobe shelf.",
    highlightedWord: "craftsmanship",
    buttonText: "List Your Piece",
  },
};

export default howItWorksData;