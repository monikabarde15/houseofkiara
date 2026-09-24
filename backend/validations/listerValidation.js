// backend/validations/listerValidation.js

export const validateListerInput = (data, isUpdate = false) => {
  const errors = [];

  // Name validation
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
      errors.push("Name is required to create the lister.");
    }
  }

  // Phone validation
  if (!isUpdate || data.phone !== undefined) {
    if (!data.phone || typeof data.phone !== "string" || !data.phone.trim()) {
      errors.push("Phone is required — WhatsApp is how we reach listers.");
    } else {
      const digits = data.phone.replace(/\D/g, "");
      if (digits.length < 10) {
        errors.push("Phone number must contain at least 10 digits.");
      }
    }
  }

  // Email validation (optional, but if provided must be valid)
  if (data.email && typeof data.email === "string" && data.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.push("Invalid email address format.");
    }
  }

  // Contact Address PIN validation (6 digits)
  const contactPin = data.address?.pin || data.pin;
  if (contactPin && typeof contactPin === "string" && contactPin.trim().length > 0) {
    if (!/^\d{6}$/.test(contactPin.trim())) {
      errors.push("PIN code must be 6 digits.");
    }
  }

  // Pickup Address PIN validation (6 digits)
  const pickupPin = data.pickup?.pin;
  if (pickupPin && typeof pickupPin === "string" && pickupPin.trim().length > 0) {
    if (!/^\d{6}$/.test(pickupPin.trim())) {
      errors.push("Pickup PIN code must be 6 digits.");
    }
  }

  // Status validation
  const validStatuses = ["Verified", "Pending Review", "Paused", "Suspended", "Rejected", "Exited"];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
