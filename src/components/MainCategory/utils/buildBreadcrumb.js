export const buildBreadcrumb = ({
  section,
  category,
  designer,
  occasion,
}) => {

  const breadcrumb = {
    parent: "Rent",
    current: "All Rental Pieces",
  };

  // RENT

  if (section === "rent") {

    breadcrumb.parent = "Rent";

    if (designer) {
      breadcrumb.current = designer;
    } else if (category) {
      breadcrumb.current = category;
    } else {
      breadcrumb.current = "All Rental Pieces";
    }
  }

  // PRELOVED

  else if (section === "preloved") {

    breadcrumb.parent = "Buy Preloved";

    if (designer) {
      breadcrumb.current = designer;
    } else if (category) {
      breadcrumb.current = category;
    } else {
      breadcrumb.current = "All Preloved Pieces";
    }
  }

  // BUY NEW

  else if (section === "new") {

    breadcrumb.parent = "Buy New";

    if (designer) {
      breadcrumb.current = designer;
    } else if (category) {
      breadcrumb.current = category;
    } else {
      breadcrumb.current = "New Arrivals";
    }
  }

  // WOMEN

  else if (section === "women") {

    breadcrumb.parent = "Women";

    if (occasion) {
      breadcrumb.current = occasion;
    } else if (category) {
      breadcrumb.current = category;
    } else {
      breadcrumb.current = "Women's Edit";
    }
  }

  // MEN

  else if (section === "men") {

    breadcrumb.parent = "Men";

    if (occasion) {
      breadcrumb.current = occasion;
    } else if (category) {
      breadcrumb.current = category;
    } else {
      breadcrumb.current = "Men's Edit";
    }
  }

  // OCCASIONS

  else if (section === "occasions") {

    breadcrumb.parent = "Occasions";

    if (occasion) {
      breadcrumb.current = occasion;
    } else {
      breadcrumb.current = "Occasions Edit";
    }
  }

  // DESIGNERS

  else if (section === "designers") {

    breadcrumb.parent = "Designers";

    if (designer) {
      breadcrumb.current = designer;
    } else {
      breadcrumb.current = "The Designers";
    }
  }

  return breadcrumb;
};