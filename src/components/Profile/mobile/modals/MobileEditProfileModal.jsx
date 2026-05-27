import { useEffect, useState } from "react";
import { X } from "lucide-react";

import "../../../../styles/Profile/mobile/modals/MobileEditProfileModal.css";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  city: ""
};

const MobileEditProfileModal = ({
  isOpen,
  onClose,
  onSave,
  profileData
}) => {
  const [formData, setFormData] =
    useState(INITIAL_FORM);

  const [errors, setErrors] =
    useState({});

  /* ============================================
     Populate Existing Data
     ============================================ */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData({
      firstName:
        profileData?.firstName || "",

      lastName:
        profileData?.lastName || "",

      email:
        profileData?.email || "",

      mobile:
        profileData?.mobile || "",

      city:
        profileData?.city || ""
    });

    setErrors({});

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [isOpen, profileData]);

  /* ============================================
     Validation
     ============================================ */

  const validateField = (
    name,
    value
  ) => {
    switch (name) {
      case "firstName":
        return !value.trim()
          ? "Please enter a first name"
          : "";

      case "lastName":
        return !value.trim()
          ? "Please enter a last name"
          : "";

      case "mobile":
        if (!value.trim()) {
          return "Please enter a valid mobile number";
        }

        if (
          !/^[+\d][\d\s-]{7,}$/.test(
            value
          )
        ) {
          return "Please enter a valid mobile number";
        }

        return "";

      default:
        return "";
    }
  };

  /* ============================================
     Validate Entire Form
     ============================================ */

  const validateForm = () => {
    const newErrors = {};

    [
      "firstName",
      "lastName",
      "mobile"
    ].forEach((field) => {
      const error = validateField(
        field,
        formData[field]
      );

      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length ===
      0
    );
  };

  /* ============================================
     Handle Change
     ============================================ */

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  /* ============================================
     Submit
     ============================================ */

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid =
      validateForm();

    if (!isValid) {
      requestAnimationFrame(() => {
        const firstError =
          document.querySelector(
            ".profile-mobile-mfi.has-error"
          );

        firstError?.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      });

      return;
    }

    onSave?.(formData);

    onClose();
  };

  /* ============================================
     Cancel
     ============================================ */

  const handleCancel = () => {
    setErrors({});

    onClose();
  };

  /* ============================================
     Guard
     ============================================ */

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* =====================================
          Backdrop
         ===================================== */}

      <div
        className="profile-mobile-editprof-backdrop"
        onClick={handleCancel}
      />

      {/* =====================================
          Bottom Sheet
         ===================================== */}

      <div className="profile-mobile-editprof-modal">
        {/* =================================
            Header
           ================================= */}

        <div className="profile-mobile-editprof-header">
          <div className="profile-mobile-editprof-title">
            Edit Profile
          </div>

          <button
            type="button"
            className="profile-mobile-editprof-close"
            onClick={handleCancel}
            aria-label="Close modal"
          >
            <X
              size={14}
              strokeWidth={1.7}
            />
          </button>
        </div>

        {/* =================================
            Form
           ================================= */}

        <form
          className="profile-mobile-editprof-form"
          onSubmit={handleSubmit}
        >
          {/* First + Last Name */}

          <div className="profile-mobile-editprof-grid">
            {/* First Name */}

            <div
              className={`profile-mobile-mfi ${
                errors.firstName
                  ? "has-error"
                  : ""
              }`}
            >
              <label className="profile-mobile-mfi-label">
                First Name
                <span className="profile-mobile-mfi-required">
                  *
                </span>
              </label>

              <input
                type="text"
                name="firstName"
                value={
                  formData.firstName
                }
                onChange={
                  handleChange
                }
                className="profile-mobile-mfi-input"
              />

              {errors.firstName && (
                <div className="profile-mobile-mfi-err">
                  {
                    errors.firstName
                  }
                </div>
              )}
            </div>

            {/* Last Name */}

            <div
              className={`profile-mobile-mfi ${
                errors.lastName
                  ? "has-error"
                  : ""
              }`}
            >
              <label className="profile-mobile-mfi-label">
                Last Name
                <span className="profile-mobile-mfi-required">
                  *
                </span>
              </label>

              <input
                type="text"
                name="lastName"
                value={
                  formData.lastName
                }
                onChange={
                  handleChange
                }
                className="profile-mobile-mfi-input"
              />

              {errors.lastName && (
                <div className="profile-mobile-mfi-err">
                  {
                    errors.lastName
                  }
                </div>
              )}
            </div>
          </div>

          {/* Email */}

          <div className="profile-mobile-mfi">
            <label className="profile-mobile-mfi-label">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              className="profile-mobile-mfi-input"
            />
          </div>

          {/* Mobile */}

          <div
            className={`profile-mobile-mfi ${
              errors.mobile
                ? "has-error"
                : ""
            }`}
          >
            <label className="profile-mobile-mfi-label">
              Mobile Number
              <span className="profile-mobile-mfi-required">
                *
              </span>
            </label>

            <input
              type="tel"
              name="mobile"
              value={
                formData.mobile
              }
              onChange={
                handleChange
              }
              className="profile-mobile-mfi-input"
            />

            {errors.mobile && (
              <div className="profile-mobile-mfi-err">
                {errors.mobile}
              </div>
            )}
          </div>

          {/* City */}

          <div className="profile-mobile-mfi">
            <label className="profile-mobile-mfi-label">
              City
            </label>

            <input
              type="text"
              name="city"
              value={
                formData.city
              }
              onChange={
                handleChange
              }
              className="profile-mobile-mfi-input"
            />
          </div>

          {/* =================================
              Footer Buttons
             ================================= */}

          <div className="profile-mobile-editprof-footer">
            <button
              type="submit"
              className="profile-mobile-sbtn-p"
            >
              Save Changes
            </button>

            <button
              type="button"
              className="profile-mobile-sbtn-s"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default MobileEditProfileModal;