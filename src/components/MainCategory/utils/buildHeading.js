// src\components\MainCategory\utils\buildHeading.js

export const buildHeading = ({
  section,
  category,
  designer,
  occasion,
}) => {

  // RENT

  if (section === "rent") {

    if (designer) {
      return {
        title: designer,
        highlight: "— Rent",
      };
    }

    if (category) {
      return {
        title: "Rent",
        highlight: category,
      };
    }

    return {
      title: "Rent",
      highlight: "The Edit",
    };
  }

  // PRELOVED

  if (section === "preloved") {

    if (designer) {
      return {
        title: designer,
        highlight: "— Preloved",
      };
    }

    if (category) {
      return {
        title: "Preloved",
        highlight: category,
      };
    }

    return {
      title: "Buy Preloved",
      highlight: "The Edit",
    };
  }

  // BUY NEW

  if (section === "new") {

    if (designer) {
      return {
        title: designer,
        highlight: "— New",
      };
    }

    if (category) {
      return {
        title: "New",
        highlight: category,
      };
    }

    return {
      title: "Buy New",
      highlight: "The Edit",
    };
  }

  // WOMEN

  if (section === "women") {

    if (occasion) {
      return {
        title: occasion,
        highlight: "Edit",
      };
    }

    if (category) {
      return {
        title: "Women's",
        highlight: category,
      };
    }

    return {
      title: "Women's",
      highlight: "Edit",
    };
  }

  // MEN

  if (section === "men") {

    if (occasion) {
      return {
        title: occasion,
        highlight: "Edit",
      };
    }

    if (category) {
      return {
        title: "Men's",
        highlight: category,
      };
    }

    return {
      title: "Men's",
      highlight: "Edit",
    };
  }

  // OCCASIONS

  if (section === "occasions") {

    if (occasion) {
      return {
        title: occasion,
        highlight: "Edit",
      };
    }

    return {
      title: "Occasions",
      highlight: "Edit",
    };
  }

  // DESIGNERS

  if (section === "designers") {

    if (designer) {
      return {
        title: "",
        highlight: designer,
      };
    }

    return {
      title: "The",
      highlight: "Designers",
    };
  }

  return {
    title: "Bridal",
    highlight: "Lehengas",
  };
};