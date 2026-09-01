import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import "../../../styles/Profile/modals/EditProfileModal.css";

const EditProfileModal = ({ isOpen, onClose, onSave, userData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    city: ""
  });
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  useEffect(() => {
    if (userData && isOpen) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        mobile: userData.mobile || "",
        city: userData.city || ""
      });
      setErrors({});
    }
  }, [userData, isOpen]);

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return !value.trim() ? 'First name is required' : '';
      case 'lastName':
        return !value.trim() ? 'Last name is required' : '';
      case 'mobile':
        if (!value.trim()) return 'Mobile number is required';
        if (!/^[+\d][\d\s-]{7,}$/.test(value)) return 'Enter a valid mobile number';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ['firstName', 'lastName', 'mobile'];
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
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    } else {
      // Scroll to first error after 40ms
      const firstErrorField = document.querySelector('.profile-edit-has-error');
      if (firstErrorField) {
        setTimeout(() => {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 40);
      }
    }
  };

  const handleCancel = () => {
    clearAllErrors();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="profile-edit-mbk" onClick={handleCancel}></div>
      <div className="profile-edit-modal" ref={formRef}>
        <div className="profile-edit-mhdr">
          <div className="profile-edit-mtit">Edit Profile</div>
          <button className="profile-edit-mcls" onClick={handleCancel}>
            <X size={14} strokeWidth={2} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="profile-edit-mbdy">
            {/* Row 1: First Name + Last Name */}
            <div className="profile-edit-row">
              <div className={`profile-edit-field ${errors.firstName ? 'profile-edit-has-error' : ''}`}>
                <label className="profile-edit-label">
                  First Name <span className="profile-edit-required">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="profile-edit-input"
                />
                {errors.firstName && <span className="profile-edit-error">{errors.firstName}</span>}
              </div>
              <div className={`profile-edit-field ${errors.lastName ? 'profile-edit-has-error' : ''}`}>
                <label className="profile-edit-label">
                  Last Name <span className="profile-edit-required">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="profile-edit-input"
                />
                {errors.lastName && <span className="profile-edit-error">{errors.lastName}</span>}
              </div>
            </div>

            {/* Row 2: Email (full width - optional) */}
            <div className="profile-edit-field-full">
              <label className="profile-edit-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="profile-edit-input"
              />
            </div>

            {/* Row 3: Mobile (full width - required) */}
            <div className={`profile-edit-field-full ${errors.mobile ? 'profile-edit-has-error' : ''}`}>
              <label className="profile-edit-label">
                Mobile Number <span className="profile-edit-required">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="profile-edit-input"
              />
              {errors.mobile && <span className="profile-edit-error">{errors.mobile}</span>}
            </div>

            {/* Row 4: City (full width - optional) */}
            <div className="profile-edit-field-full">
              <label className="profile-edit-label">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="profile-edit-input"
              />
            </div>
          </div>
          <div className="profile-edit-mftr">
            <button type="button" className="profile-edit-btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="profile-edit-btn-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfileModal;