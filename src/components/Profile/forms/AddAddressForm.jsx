import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import "../../../styles/Profile/forms/AddAddressForm.css";

const AddAddressForm = ({ onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    label: initialData?.label || "Home",
    recipientName: initialData?.recipientName || "Priya Varma",
    line1: initialData?.line1 || "",
    line2: initialData?.line2 || "",
    city: initialData?.city || "Indore",
    state: initialData?.state || "Madhya Pradesh",
    pin: initialData?.pin || "",
    mobile: initialData?.mobile || "+91 98765 43210",
    setAsDefault: false
  });

  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const validateField = (name, value) => {
    switch (name) {
      case 'recipientName':
        return !value.trim() ? 'Recipient name is required' : '';
      case 'line1':
        return !value.trim() ? 'Address line 1 is required' : '';
      case 'city':
        return !value.trim() ? 'City is required' : '';
      case 'state':
        return !value.trim() ? 'State is required' : '';
      case 'pin':
        if (!value) return 'PIN code is required';
        if (!/^\d{6}$/.test(value)) return 'PIN code must be 6 digits';
        return '';
      case 'mobile':
        if (!value) return 'Mobile number is required';
        if (!/^[+\d][\d\s-]{7,}$/.test(value)) return 'Enter a valid mobile number';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ['recipientName', 'line1', 'city', 'state', 'pin', 'mobile'];
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    } else {
      // Scroll to first error
      const firstErrorField = document.querySelector('.profile-af-has-error');
      if (firstErrorField) {
        setTimeout(() => {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 40);
      }
    }
  };

  // Animation on mount
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  return (
    <div className="profile-addr-form" ref={formRef}>
      <div className="profile-af-title">New Address</div>
      
      <form onSubmit={handleSubmit}>
        {/* Row 1: Label + Recipient Name */}
        <div className="profile-af-row">
          <div className="profile-af-field">
            <label className="profile-af-label">Label</label>
            <select
              name="label"
              value={formData.label}
              onChange={handleChange}
              className="profile-af-select"
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Parents' Home">Parents' Home</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className={`profile-af-field ${errors.recipientName ? 'profile-af-has-error' : ''}`}>
            <label className="profile-af-label">
              Recipient Name <span className="profile-af-required">*</span>
            </label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              className="profile-af-input"
            />
            {errors.recipientName && <span className="profile-af-error">{errors.recipientName}</span>}
          </div>
        </div>

        {/* Row 2: Address Line 1 (full width) */}
        <div className={`profile-af-field-full ${errors.line1 ? 'profile-af-has-error' : ''}`}>
          <label className="profile-af-label">
            Address Line 1 <span className="profile-af-required">*</span>
          </label>
          <input
            type="text"
            name="line1"
            value={formData.line1}
            onChange={handleChange}
            placeholder="House / Flat / Building no."
            className="profile-af-input"
          />
          {errors.line1 && <span className="profile-af-error">{errors.line1}</span>}
        </div>

        {/* Row 3: Address Line 2 (full width) - optional */}
        <div className="profile-af-field-full">
          <label className="profile-af-label">Address Line 2</label>
          <input
            type="text"
            name="line2"
            value={formData.line2}
            onChange={handleChange}
            placeholder="Area, Locality, Street"
            className="profile-af-input"
          />
        </div>

        {/* Row 4: City + State */}
        <div className="profile-af-row">
          <div className={`profile-af-field ${errors.city ? 'profile-af-has-error' : ''}`}>
            <label className="profile-af-label">
              City <span className="profile-af-required">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="profile-af-input"
            />
            {errors.city && <span className="profile-af-error">{errors.city}</span>}
          </div>
          <div className={`profile-af-field ${errors.state ? 'profile-af-has-error' : ''}`}>
            <label className="profile-af-label">
              State <span className="profile-af-required">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="profile-af-input"
            />
            {errors.state && <span className="profile-af-error">{errors.state}</span>}
          </div>
        </div>

        {/* Row 5: PIN Code + Mobile */}
        <div className="profile-af-row">
          <div className={`profile-af-field ${errors.pin ? 'profile-af-has-error' : ''}`}>
            <label className="profile-af-label">
              PIN Code <span className="profile-af-required">*</span>
            </label>
            <input
              type="text"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              maxLength="6"
              className="profile-af-input"
            />
            {errors.pin && <span className="profile-af-error">{errors.pin}</span>}
          </div>
          <div className={`profile-af-field ${errors.mobile ? 'profile-af-has-error' : ''}`}>
            <label className="profile-af-label">
              Mobile <span className="profile-af-required">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="profile-af-input"
            />
            {errors.mobile && <span className="profile-af-error">{errors.mobile}</span>}
          </div>
        </div>

        {/* Set as Default Checkbox */}
        <div className="profile-af-checkbox-row">
          <input
            type="checkbox"
            id="new-setdefault"
            name="setAsDefault"
            checked={formData.setAsDefault}
            onChange={handleChange}
            className="profile-af-checkbox"
          />
          <label htmlFor="new-setdefault" className="profile-af-checkbox-label">
            Set as default address
          </label>
        </div>

        {/* Form Buttons */}
        <div className="profile-af-buttons">
          <button type="submit" className="profile-af-btn-save">
            <Check size={12} strokeWidth={2} />
            Save Address
          </button>
          <button type="button" className="profile-af-btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressForm;