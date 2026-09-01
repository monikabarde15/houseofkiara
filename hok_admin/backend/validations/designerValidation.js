export const validateDesignerInput = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
      errors.push("Designer name is required");
    }
  }

  if (data.status && !["Active", "Inactive", "Suspended"].includes(data.status)) {
    errors.push("Status must be Active, Inactive, or Suspended");
  }

  if (data.type && !["Couture House", "Contemporary Label", "Heritage Weave", "Indie Designer", "Unclassified"].includes(data.type)) {
    errors.push("Invalid designer type");
  }

  if (data.counterfeitRiskTier && !["Low", "Medium", "High"].includes(data.counterfeitRiskTier)) {
    errors.push("Counterfeit risk tier must be Low, Medium, or High");
  }

  if (data.contactEmail && typeof data.contactEmail === "string" && data.contactEmail.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactEmail.trim())) {
      errors.push("Invalid contact email format");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
