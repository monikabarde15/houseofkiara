import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { CONTACT_CONTENT } from "../../data/contact/contactContent";
import { CONTACT_TOKENS } from "../../data/contact/contactSettings";

const CheckMarkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export default function ContactWriteForm() {
  const {
    fields,
    privacyNotice,
    privacyPath,
    buttonLabel,
    buttonSending,
    checkLine,
    failMessage,
    thankYou
  } = CONTACT_CONTENT.write;

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    orderRef: "",
    message: "",
    company: "" // Honeypot spam protection (Section 7.7)
  });

  const [errors, setErrors] = useState({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const topicSelectRef = useRef(null);
  const messageTextareaRef = useRef(null);
  const sentHeadingRef = useRef(null);

  const validateField = (field, currentValues = values) => {
    const val = currentValues[field] ? currentValues[field].trim() : "";

    switch (field) {
      case "name":
        if (!val) return fields.name.emptyMessage;
        return "";

      case "email":
        if (!val) return fields.email.emptyMessage;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
          return fields.email.badMessage;
        }
        return "";

      case "phone":
        if (!val) return "";
        {
          const digits = val.replace(/[\s\(\)\.\+\-]/g, "");
          if (!/^\d{7,15}$/.test(digits)) {
            return fields.phone.badMessage;
          }
        }
        return "";

      case "topic":
        if (!currentValues.topic) return fields.topic.emptyMessage;
        return "";

      case "message":
        if (!val) return fields.message.emptyMessage;
        if (val.length < 10) return fields.message.shortMessage;
        return "";

      default:
        return "";
    }
  };

  const validateAll = (currentValues = values) => {
    const errs = {};
    const nameErr = validateField("name", currentValues);
    if (nameErr) errs.name = nameErr;

    const emailErr = validateField("email", currentValues);
    if (emailErr) errs.email = emailErr;

    const phoneErr = validateField("phone", currentValues);
    if (phoneErr) errs.phone = phoneErr;

    const topicErr = validateField("topic", currentValues);
    if (topicErr) errs.topic = topicErr;

    const msgErr = validateField("message", currentValues);
    if (msgErr) errs.message = msgErr;

    return errs;
  };

  const handleChange = (field) => (e) => {
    const nextVal = e.target.value;
    const nextValues = { ...values, [field]: nextVal };
    setValues(nextValues);

    if (hasAttemptedSubmit) {
      const err = validateField(field, nextValues);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) {
          next[field] = err;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };

  const handleBlur = (field) => () => {
    if (field === "email" || field === "phone") {
      if (values[field] && values[field].trim()) {
        const err = validateField(field, values);
        if (err) {
          setErrors((prev) => ({ ...prev, [field]: err }));
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    setSendFailed(false);

    const validationErrors = validateAll(values);
    setErrors(validationErrors);

    const errorKeys = Object.keys(validationErrors);
    if (errorKeys.length > 0) {
      const first = errorKeys[0];
      if (first === "name" && nameInputRef.current) nameInputRef.current.focus();
      else if (first === "email" && emailInputRef.current) emailInputRef.current.focus();
      else if (first === "phone" && phoneInputRef.current) phoneInputRef.current.focus();
      else if (first === "topic" && topicSelectRef.current) topicSelectRef.current.focus();
      else if (first === "message" && messageTextareaRef.current) messageTextareaRef.current.focus();
      return;
    }

    // Honeypot spam test (Section 7.7)
    if (values.company) {
      setIsSent(true);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => {
        if (sentHeadingRef.current) {
          sentHeadingRef.current.focus();
        }
      }, 50);
    }, 800);
  };

  const handleReset = () => {
    setValues({
      name: "",
      email: "",
      phone: "",
      topic: "",
      orderRef: "",
      message: "",
      company: ""
    });
    setErrors({});
    setHasAttemptedSubmit(false);
    setIsSent(false);
    setSendFailed(false);
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 50);
  };

  const firstName = values.name.trim().split(/\s+/)[0] || "there";
  const whatsappUrl = `https://wa.me/${CONTACT_TOKENS.support_whatsapp_raw}?text=${encodeURIComponent(
    "Hello House of Kaira, "
  )}`;

  return (
    <div
      className={`paper ${isSent ? "sent" : ""}`}
      data-form={isSent ? "sent" : "idle"}
    >
      {isSent ? (
        // Sent state (Section 7.6 & D16)
        <div
          className="form-done"
          tabIndex={-1}
          ref={sentHeadingRef}
          aria-live="polite"
        >
          <div className="done-mark" aria-hidden="true">
            <CheckMarkIcon />
          </div>

          <h3>Thank you, {firstName}.</h3>

          <p>
            Your note is with our team. We’ll reply to{" "}
            <strong>{values.email}</strong> within {CONTACT_TOKENS.email_sla}.
          </p>

          <p className="done-sooner">
            Need us sooner?{" "}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tl"
            >
              Message us on WhatsApp.
            </a>
          </p>

          <button
            type="button"
            className="btn btn-line"
            onClick={handleReset}
          >
            {thankYou.buttonLabel}
          </button>
        </div>
      ) : (
        // Form state
        <form onSubmit={handleSubmit} noValidate aria-label="Write us a note">
          {/* Honeypot field (Section 7.7) */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="cu-company">Company</label>
            <input
              type="text"
              id="cu-company"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={values.company}
              onChange={handleChange("company")}
            />
          </div>

          <div className="field-grid">
            {/* Field 1: Your name */}
            <div className={`field ${errors.name ? "invalid" : ""}`}>
              <label className="field-label" htmlFor="cu-name">
                {fields.name.label}
                <span className="req" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                id="cu-name"
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={handleChange("name")}
                aria-required="true"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "cu-name-err" : undefined}
              />
              {errors.name && (
                <div className="field-err" id="cu-name-err" role="alert">
                  {errors.name}
                </div>
              )}
            </div>

            {/* Field 2: Email */}
            <div className={`field ${errors.email ? "invalid" : ""}`}>
              <label className="field-label" htmlFor="cu-email">
                {fields.email.label}
                <span className="req" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                ref={emailInputRef}
                type="email"
                id="cu-email"
                name="email"
                autoComplete="email"
                spellCheck="false"
                value={values.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                aria-required="true"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "cu-email-err" : undefined}
              />
              {errors.email && (
                <div className="field-err" id="cu-email-err" role="alert">
                  {errors.email}
                </div>
              )}
            </div>

            {/* Field 3: WhatsApp number */}
            <div className={`field ${errors.phone ? "invalid" : ""}`}>
              <label className="field-label" htmlFor="cu-wa">
                {fields.phone.label}
                <span className="opt">{fields.phone.tag}</span>
              </label>
              <input
                ref={phoneInputRef}
                type="tel"
                id="cu-wa"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                value={values.phone}
                onChange={handleChange("phone")}
                onBlur={handleBlur("phone")}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={
                  errors.phone ? "cu-wa-err" : "cu-wa-hint"
                }
              />
              <div className="field-hint" id="cu-wa-hint">
                {fields.phone.hint}
              </div>
              {errors.phone && (
                <div className="field-err" id="cu-wa-err" role="alert">
                  {errors.phone}
                </div>
              )}
            </div>

            {/* Field 4: What is it about? */}
            <div className={`field ${errors.topic ? "invalid" : ""}`}>
              <label className="field-label" htmlFor="cu-about">
                {fields.topic.label}
                <span className="req" aria-hidden="true">
                  *
                </span>
              </label>
              <select
                ref={topicSelectRef}
                id="cu-about"
                name="topic"
                value={values.topic}
                onChange={handleChange("topic")}
                className={!values.topic ? "empty" : ""}
                aria-required="true"
                aria-invalid={Boolean(errors.topic)}
                aria-describedby={errors.topic ? "cu-about-err" : undefined}
              >
                <option value="">{fields.topic.firstOption}</option>
                {fields.topic.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.topic && (
                <div className="field-err" id="cu-about-err" role="alert">
                  {errors.topic}
                </div>
              )}
            </div>

            {/* Field 5: Order number or piece */}
            <div className="field full">
              <label className="field-label" htmlFor="cu-order">
                {fields.orderRef.label}
                <span className="opt">{fields.orderRef.tag}</span>
              </label>
              <input
                type="text"
                id="cu-order"
                name="orderRef"
                value={values.orderRef}
                onChange={handleChange("orderRef")}
                aria-describedby="cu-order-hint"
              />
              <div className="field-hint" id="cu-order-hint">
                Your order number is on your confirmation, and in{" "}
                <Link to={fields.orderRef.accountPath} className="tl">
                  My Account
                </Link>
                .
              </div>
            </div>

            {/* Field 6: Your message */}
            <div className={`field full ${errors.message ? "invalid" : ""}`}>
              <label className="field-label" htmlFor="cu-message">
                {fields.message.label}
                <span className="req" aria-hidden="true">
                  *
                </span>
              </label>
              <textarea
                ref={messageTextareaRef}
                id="cu-message"
                name="message"
                maxLength={2000}
                value={values.message}
                onChange={handleChange("message")}
                aria-required="true"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? "cu-msg-err" : "cu-msg-hint"
                }
              />
              <div className="field-hint" id="cu-msg-hint">
                This note takes words only, so please send photographs on{" "}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tl"
                >
                  WhatsApp
                </a>{" "}
                or by{" "}
                <a
                  href={`mailto:${CONTACT_TOKENS.support_email}`}
                  className="tl"
                >
                  email
                </a>
                .
              </div>
              {errors.message && (
                <div className="field-err" id="cu-msg-err" role="alert">
                  {errors.message}
                </div>
              )}
            </div>
          </div>

          {/* Privacy notice (Section 7.5 & Appendix A) */}
          <div className="form-notice">
            We use these details only to reply to you, as our{" "}
            <Link to={privacyPath} className="tl">
              Privacy Policy
            </Link>{" "}
            explains.
          </div>

          {/* Send failed notice (Section 7.5 & Appendix A) */}
          <div
            className={`form-fail ${sendFailed ? "show" : ""}`}
            role="alert"
          >
            {failMessage}
          </div>

          {/* Button row with validation notice (Appendix A) */}
          <div className="form-foot">
            <button
              type="submit"
              className="btn btn-dark"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spin" aria-hidden="true" />
                  <span>{buttonSending}</span>
                </>
              ) : (
                <span>{buttonLabel}</span>
              )}
            </button>

            {hasAttemptedSubmit && Object.keys(errors).length > 0 && (
              <span className="form-check show" role="alert">
                {checkLine}
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
