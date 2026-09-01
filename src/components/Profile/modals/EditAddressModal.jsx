import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import "../../../styles/Profile/modals/EditAddressModal.css";

const EditAddressModal = ({ isOpen, onClose, onSave, address }) => {
  const [formData, setFormData] = useState({
    label: "",
    recipientName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pin: "",
    mobile: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (address && isOpen) {
      setFormData({
        label: address.label || "Home",
        recipientName: address.recipientName || "",
        line1: address.line1 || "",
        line2: address.line2 || "",
        city: address.city || "",
        state: address.state || "",
        pin: address.pin || "",
        mobile: address.mobile || ""
      });
      setErrors({});
    }
  }, [address, isOpen]);

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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    } else {
      const firstErrorField = document.querySelector('.profile-editaddr-has-error');
      if (firstErrorField) {
        setTimeout(() => {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 40);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="profile-editaddr-mbk" onClick={onClose}></div>
      <div className="profile-editaddr-modal">
        <div className="profile-editaddr-header">
          <div className="profile-editaddr-title">Edit Address — {address?.label}</div>
          <button className="profile-editaddr-close" onClick={onClose}>
            <X size={14} strokeWidth={2} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="profile-editaddr-body">
            {/* Row 1: Label + Recipient Name */}
            <div className="profile-editaddr-row">
              <div className="profile-editaddr-field">
                <label className="profile-editaddr-label">Label</label>
                <select name="label" value={formData.label} onChange={handleChange} className="profile-editaddr-select">
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Parents' Home">Parents' Home</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className={`profile-editaddr-field ${errors.recipientName ? 'profile-editaddr-has-error' : ''}`}>
                <label className="profile-editaddr-label">Recipient Name <span className="profile-editaddr-required">*</span></label>
                <input type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} className="profile-editaddr-input" />
                {errors.recipientName && <span className="profile-editaddr-error">{errors.recipientName}</span>}
              </div>
            </div>

            {/* Address Line 1 */}
            <div className={`profile-editaddr-field-full ${errors.line1 ? 'profile-editaddr-has-error' : ''}`}>
              <label className="profile-editaddr-label">Address Line 1 <span className="profile-editaddr-required">*</span></label>
              <input type="text" name="line1" value={formData.line1} onChange={handleChange} placeholder="House / Flat / Building no." className="profile-editaddr-input" />
              {errors.line1 && <span className="profile-editaddr-error">{errors.line1}</span>}
            </div>

            {/* Address Line 2 */}
            <div className="profile-editaddr-field-full">
              <label className="profile-editaddr-label">Address Line 2</label>
              <input type="text" name="line2" value={formData.line2} onChange={handleChange} placeholder="Area, Locality, Street" className="profile-editaddr-input" />
            </div>

            {/* City + State */}
            <div className="profile-editaddr-row">
              <div className={`profile-editaddr-field ${errors.city ? 'profile-editaddr-has-error' : ''}`}>
                <label className="profile-editaddr-label">City <span className="profile-editaddr-required">*</span></label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="profile-editaddr-input" />
                {errors.city && <span className="profile-editaddr-error">{errors.city}</span>}
              </div>
              <div className={`profile-editaddr-field ${errors.state ? 'profile-editaddr-has-error' : ''}`}>
                <label className="profile-editaddr-label">State <span className="profile-editaddr-required">*</span></label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="profile-editaddr-input" />
                {errors.state && <span className="profile-editaddr-error">{errors.state}</span>}
              </div>
            </div>

            {/* PIN + Mobile */}
            <div className="profile-editaddr-row">
              <div className={`profile-editaddr-field ${errors.pin ? 'profile-editaddr-has-error' : ''}`}>
                <label className="profile-editaddr-label">PIN Code <span className="profile-editaddr-required">*</span></label>
                <input type="text" name="pin" value={formData.pin} onChange={handleChange} maxLength="6" className="profile-editaddr-input" />
                {errors.pin && <span className="profile-editaddr-error">{errors.pin}</span>}
              </div>
              <div className={`profile-editaddr-field ${errors.mobile ? 'profile-editaddr-has-error' : ''}`}>
                <label className="profile-editaddr-label">Mobile <span className="profile-editaddr-required">*</span></label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="profile-editaddr-input" />
                {errors.mobile && <span className="profile-editaddr-error">{errors.mobile}</span>}
              </div>
            </div>
          </div>
          <div className="profile-editaddr-footer">
            <button type="button" className="profile-editaddr-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="profile-editaddr-btn-save">
              <Check size={12} strokeWidth={2} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditAddressModal;