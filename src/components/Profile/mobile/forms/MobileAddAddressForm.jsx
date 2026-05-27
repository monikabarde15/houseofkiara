import { useEffect, useRef, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

import "../../../../styles/Profile/mobile/forms/MobileAddAddressForm.css";

const LABEL_OPTIONS = [
  "Home",
  "Office",
  "Parents' Home",
  "Other"
];

const INITIAL_FORM = {
  label: "Home",
  recipientName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pin: "",
  mobile: "",
  setAsDefault: false
};

const MobileAddAddressForm = ({
  isOpen,
  onClose,
  onSave,
  onTriggerClick  // ← Add this prop
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    setFormData(INITIAL_FORM);
    setErrors({});

    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    });
  }, [isOpen]);

  const validateField = (name, value) => {
    switch (name) {
      case "recipientName":
        return !value.trim() ? "Recipient name is required" : "";
      case "line1":
        return !value.trim() ? "Address line 1 is required" : "";
      case "city":
        return !value.trim() ? "City is required" : "";
      case "state":
        return !value.trim() ? "State is required" : "";
      case "pin":
        if (!value) return "PIN code is required";
        if (!/^\d{6}$/.test(value)) return "PIN code must be 6 digits";
        return "";
      case "mobile":
        if (!value) return "Mobile number is required";
        if (!/^[+\d][\d\s-]{7,}$/.test(value)) return "Enter a valid mobile number";
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    ["recipientName", "line1", "city", "state", "pin", "mobile"].forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      requestAnimationFrame(() => {
        const firstError = document.querySelector(".profile-mobile-addaddr-fi.has-error");
        firstError?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      return;
    }
    onSave(formData);
    setFormData(INITIAL_FORM);
    setErrors({});
    onClose();
  };

  return (
    <div className="profile-mobile-addaddr-form">
      {/* Trigger Button - ALWAYS visible */}
      <button
        type="button"
        className="profile-mobile-addaddr-trigger"
        onClick={onTriggerClick}
      >
        <div className="profile-mobile-addaddr-icon">
          <Plus size={12} strokeWidth={1.8} />
        </div>
        <div className="profile-mobile-addaddr-copy">
          <div className="profile-mobile-addaddr-trigger-title">
            Add New Address
          </div>
          <div className="profile-mobile-addaddr-trigger-subtitle">
            Home, office, or any delivery location
          </div>
        </div>
      </button>

      {/* Inline Form - ONLY visible when isOpen is true */}
      {isOpen && (
        <form className="profile-mobile-addaddr-body" onSubmit={handleSubmit} ref={formRef}>
          <div className="profile-mobile-addaddr-heading">New Address</div>

          {/* Label + Recipient */}
          <div className="profile-mobile-addaddr-row">
            <div className="profile-mobile-addaddr-fi">
              <label className="profile-mobile-addaddr-label">Label</label>
              <div className="profile-mobile-addaddr-select-wrap">
                <select
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  className="profile-mobile-addaddr-select"
                >
                  {LABEL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown size={10} className="profile-mobile-addaddr-chevron" />
              </div>
            </div>

            <div className={`profile-mobile-addaddr-fi ${errors.recipientName ? "has-error" : ""}`}>
              <label className="profile-mobile-addaddr-label">
                Recipient Name <span className="profile-mobile-addaddr-required">*</span>
              </label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="Full name"
                className="profile-mobile-addaddr-input"
              />
              {errors.recipientName && (
                <div className="profile-mobile-addaddr-error">{errors.recipientName}</div>
              )}
            </div>
          </div>

          {/* Address Line 1 */}
          <div className={`profile-mobile-addaddr-fi ${errors.line1 ? "has-error" : ""}`}>
            <label className="profile-mobile-addaddr-label">
              Address Line 1 <span className="profile-mobile-addaddr-required">*</span>
            </label>
            <input
              type="text"
              name="line1"
              value={formData.line1}
              onChange={handleChange}
              placeholder="House / Flat / Building no."
              className="profile-mobile-addaddr-input"
            />
            {errors.line1 && <div className="profile-mobile-addaddr-error">{errors.line1}</div>}
          </div>

          {/* Address Line 2 */}
          <div className="profile-mobile-addaddr-fi">
            <label className="profile-mobile-addaddr-label">Address Line 2</label>
            <input
              type="text"
              name="line2"
              value={formData.line2}
              onChange={handleChange}
              placeholder="Area, Locality, Street"
              className="profile-mobile-addaddr-input"
            />
          </div>

          {/* City + State */}
          <div className="profile-mobile-addaddr-row">
            <div className={`profile-mobile-addaddr-fi ${errors.city ? "has-error" : ""}`}>
              <label className="profile-mobile-addaddr-label">
                City <span className="profile-mobile-addaddr-required">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="profile-mobile-addaddr-input"
              />
              {errors.city && <div className="profile-mobile-addaddr-error">{errors.city}</div>}
            </div>
            <div className={`profile-mobile-addaddr-fi ${errors.state ? "has-error" : ""}`}>
              <label className="profile-mobile-addaddr-label">
                State <span className="profile-mobile-addaddr-required">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="profile-mobile-addaddr-input"
              />
              {errors.state && <div className="profile-mobile-addaddr-error">{errors.state}</div>}
            </div>
          </div>

          {/* PIN + Mobile */}
          <div className="profile-mobile-addaddr-row">
            <div className={`profile-mobile-addaddr-fi ${errors.pin ? "has-error" : ""}`}>
              <label className="profile-mobile-addaddr-label">
                PIN Code <span className="profile-mobile-addaddr-required">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                placeholder="6-digit PIN"
                className="profile-mobile-addaddr-input"
              />
              {errors.pin && <div className="profile-mobile-addaddr-error">{errors.pin}</div>}
            </div>
            <div className={`profile-mobile-addaddr-fi ${errors.mobile ? "has-error" : ""}`}>
              <label className="profile-mobile-addaddr-label">
                Mobile <span className="profile-mobile-addaddr-required">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="profile-mobile-addaddr-input"
              />
              {errors.mobile && <div className="profile-mobile-addaddr-error">{errors.mobile}</div>}
            </div>
          </div>

          {/* Checkbox */}
          <div className="profile-mobile-addaddr-checkbox">
            <input
              type="checkbox"
              id="mobile-default-address"
              name="setAsDefault"
              checked={formData.setAsDefault}
              onChange={handleChange}
              className="profile-mobile-addaddr-checkbox-input"
            />
            <label
              htmlFor="mobile-default-address"
              className="profile-mobile-addaddr-checkbox-label"
            >
              Set as default address
            </label>
          </div>

          {/* Buttons */}
          <div className="profile-mobile-addaddr-buttons">
            <button type="submit" className="profile-mobile-addaddr-btn-save">
              <span>✓</span>
              Save Address
            </button>
            <button type="button" className="profile-mobile-addaddr-btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MobileAddAddressForm;