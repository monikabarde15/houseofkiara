import { useEffect, useState } from "react";

import { X, ChevronDown } from "lucide-react";

import "../../../../styles/Profile/mobile/modals/MobileEditAddressModal.css";

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
  mobile: ""
};

const MobileEditAddressModal = ({
  isOpen,
  onClose,
  onSave,
  address
}) => {
  /* =========================================
     Form State
     ========================================= */

  const [formData, setFormData] =
    useState(INITIAL_FORM);

  const [errors, setErrors] =
    useState({});

  /* =========================================
     Populate Existing Address
     ========================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData({
      label:
        address?.label || "Home",

      recipientName:
        address?.recipientName || "",

      line1:
        address?.line1 || "",

      line2:
        address?.line2 || "",

      city:
        address?.city || "",

      state:
        address?.state || "",

      pin:
        address?.pin || "",

      mobile:
        address?.mobile || ""
    });

    setErrors({});
  }, [isOpen, address]);

  /* =========================================
     Lock Body Scroll
     ========================================= */

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow =
        "";

      return;
    }

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [isOpen]);

  /* =========================================
     Validation
     ========================================= */

  const validateField = (
    name,
    value
  ) => {
    switch (name) {
      case "recipientName":
        return !value.trim()
          ? "Recipient name is required"
          : "";

      case "line1":
        return !value.trim()
          ? "Address line 1 is required"
          : "";

      case "city":
        return !value.trim()
          ? "City is required"
          : "";

      case "state":
        return !value.trim()
          ? "State is required"
          : "";

      case "pin":
        if (!value) {
          return "PIN code is required";
        }

        if (!/^\d{6}$/.test(value)) {
          return "PIN code must be 6 digits";
        }

        return "";

      case "mobile":
        if (!value) {
          return "Mobile number is required";
        }

        if (
          !/^[+\d][\d\s-]{7,}$/.test(
            value
          )
        ) {
          return "Enter a valid mobile number";
        }

        return "";

      default:
        return "";
    }
  };

  /* =========================================
     Validate Entire Form
     ========================================= */

  const validateForm = () => {
    const newErrors = {};

    [
      "recipientName",
      "line1",
      "city",
      "state",
      "pin",
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

  /* =========================================
     Handle Change
     ========================================= */

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

  /* =========================================
     Submit
     ========================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid =
      validateForm();

    if (!isValid) {
      requestAnimationFrame(() => {
        const firstError =
          document.querySelector(
            ".profile-mobile-editaddr-field.has-error"
          );

        if (firstError) {
          firstError.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });
        }
      });

      return;
    }

    onSave(formData);

    onClose();
  };

  /* =========================================
     Guard
     ========================================= */

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* =====================================
          Backdrop
         ===================================== */}

      <div
        className="profile-mobile-editaddr-backdrop"
        onClick={onClose}
      />

      {/* =====================================
          Modal
         ===================================== */}

      <div className="profile-mobile-editaddr-modal">
        {/* =================================
            Header
           ================================= */}

        <div className="profile-mobile-editaddr-header">
          <div className="profile-mobile-editaddr-title">
            Edit Address —{" "}
            {address?.label ||
              "Home"}
          </div>

          <button
            type="button"
            className="profile-mobile-editaddr-close"
            onClick={onClose}
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
          className="profile-mobile-editaddr-form"
          onSubmit={handleSubmit}
        >
          {/* =============================
              Label + Recipient
             ============================= */}

          <div className="profile-mobile-editaddr-row">
            {/* Label */}

            <div className="profile-mobile-editaddr-field">
              <label className="profile-mobile-editaddr-label">
                Label
              </label>

              <div className="profile-mobile-editaddr-select-wrap">
                <select
                  name="label"
                  value={
                    formData.label
                  }
                  onChange={
                    handleChange
                  }
                  className="profile-mobile-editaddr-select"
                >
                  {LABEL_OPTIONS.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={10}
                  className="profile-mobile-editaddr-chevron"
                />
              </div>
            </div>

            {/* Recipient */}

            <div
              className={`profile-mobile-editaddr-field ${
                errors.recipientName
                  ? "has-error"
                  : ""
              }`}
            >
              <label className="profile-mobile-editaddr-label">
                Recipient Name
                <span className="profile-mobile-editaddr-required">
                  *
                </span>
              </label>

              <input
                type="text"
                name="recipientName"
                value={
                  formData.recipientName
                }
                onChange={
                  handleChange
                }
                className="profile-mobile-editaddr-input"
              />

              {errors.recipientName && (
                <div className="profile-mobile-editaddr-error">
                  {
                    errors.recipientName
                  }
                </div>
              )}
            </div>
          </div>

          {/* =============================
              Address Line 1
             ============================= */}

          <div
            className={`profile-mobile-editaddr-field ${
              errors.line1
                ? "has-error"
                : ""
            }`}
          >
            <label className="profile-mobile-editaddr-label">
              Address Line 1
              <span className="profile-mobile-editaddr-required">
                *
              </span>
            </label>

            <input
              type="text"
              name="line1"
              value={
                formData.line1
              }
              onChange={
                handleChange
              }
              placeholder="House / Flat / Building no."
              className="profile-mobile-editaddr-input"
            />

            {errors.line1 && (
              <div className="profile-mobile-editaddr-error">
                {errors.line1}
              </div>
            )}
          </div>

          {/* =============================
              Address Line 2
             ============================= */}

          <div className="profile-mobile-editaddr-field">
            <label className="profile-mobile-editaddr-label">
              Address Line 2
            </label>

            <input
              type="text"
              name="line2"
              value={
                formData.line2
              }
              onChange={
                handleChange
              }
              placeholder="Area, Locality, Street"
              className="profile-mobile-editaddr-input"
            />
          </div>

          {/* =============================
              City + State
             ============================= */}

          <div className="profile-mobile-editaddr-row">
            <div
              className={`profile-mobile-editaddr-field ${
                errors.city
                  ? "has-error"
                  : ""
              }`}
            >
              <label className="profile-mobile-editaddr-label">
                City
                <span className="profile-mobile-editaddr-required">
                  *
                </span>
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
                className="profile-mobile-editaddr-input"
              />

              {errors.city && (
                <div className="profile-mobile-editaddr-error">
                  {errors.city}
                </div>
              )}
            </div>

            <div
              className={`profile-mobile-editaddr-field ${
                errors.state
                  ? "has-error"
                  : ""
              }`}
            >
              <label className="profile-mobile-editaddr-label">
                State
                <span className="profile-mobile-editaddr-required">
                  *
                </span>
              </label>

              <input
                type="text"
                name="state"
                value={
                  formData.state
                }
                onChange={
                  handleChange
                }
                className="profile-mobile-editaddr-input"
              />

              {errors.state && (
                <div className="profile-mobile-editaddr-error">
                  {errors.state}
                </div>
              )}
            </div>
          </div>

          {/* =============================
              PIN + Mobile
             ============================= */}

          <div className="profile-mobile-editaddr-row">
            <div
              className={`profile-mobile-editaddr-field ${
                errors.pin
                  ? "has-error"
                  : ""
              }`}
            >
              <label className="profile-mobile-editaddr-label">
                PIN Code
                <span className="profile-mobile-editaddr-required">
                  *
                </span>
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                name="pin"
                value={
                  formData.pin
                }
                onChange={
                  handleChange
                }
                className="profile-mobile-editaddr-input"
              />

              {errors.pin && (
                <div className="profile-mobile-editaddr-error">
                  {errors.pin}
                </div>
              )}
            </div>

            <div
              className={`profile-mobile-editaddr-field ${
                errors.mobile
                  ? "has-error"
                  : ""
              }`}
            >
              <label className="profile-mobile-editaddr-label">
                Mobile
                <span className="profile-mobile-editaddr-required">
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
                className="profile-mobile-editaddr-input"
              />

              {errors.mobile && (
                <div className="profile-mobile-editaddr-error">
                  {
                    errors.mobile
                  }
                </div>
              )}
            </div>
          </div>

          {/* =============================
              Actions
             ============================= */}

          <div className="profile-mobile-editaddr-actions">
            <button
              type="submit"
              className="profile-mobile-editaddr-btn-save"
            >
              <span className="profile-mobile-editaddr-check">
                ✓
              </span>

              Save Changes
            </button>

            <button
              type="button"
              className="profile-mobile-editaddr-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default MobileEditAddressModal;