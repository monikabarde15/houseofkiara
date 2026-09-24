export const validateCustomerInput = (data, isUpdate = false) => {
  const errors = [];

  // For updates, if name or email are provided, basic sanity check
  if (data.name !== undefined && data.name !== null && typeof data.name === "string") {
    if (!data.name.trim() && isUpdate) {
      errors.push("Full name cannot be blank");
    }
  }

  if (data.email !== undefined && data.email !== null && typeof data.email === "string" && data.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.push("Invalid email address format");
    }
  }

  if (data.status && !["Active", "Suspended"].includes(data.status)) {
    errors.push("Status must be either 'Active' or 'Suspended'");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
