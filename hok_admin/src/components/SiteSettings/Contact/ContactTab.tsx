import React, { useState } from "react";
import "./ContactTab.css";

interface ContactForm {
  supportEmail: string;
  phone: string;
  whatsapp: string;
  daysOpen: string;
  hours: string;
  replyWithin: string;

  addressedTo: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pinCode: string;
  contactNumber: string;

  whatsappEnabled: boolean;
  whatsappTooltip: string;
  whatsappMessage: string;

  instagram: string;
  followLabel: string;
  facebook: string;
  pinterest: string;
  youtube: string;
  linkedin: string;
}

const initialForm: ContactForm = {
  supportEmail: "hello@houseofkaira.com",
  phone: "+91 731 4005 220",
  whatsapp: "+91 98765 43210",
  daysOpen: "7 days a week",
  hours: "10 AM – 8 PM IST",
  replyWithin: "2",

  addressedTo: "HOK Returns Desk",
  addressLine1: "14 Vijay Nagar",
  addressLine2: "Scheme 54",
  landmark: "",
  city: "Indore",
  state: "Madhya Pradesh",
  pinCode: "452010",
  contactNumber: "+91 731 4005 220",

  whatsappEnabled: true,
  whatsappTooltip: "Chat with us",
  whatsappMessage: "Hi House of Kaira, I have a question about",

  instagram: "@house_of_kaira",
  followLabel: "Follow Us",
  facebook: "",
  pinterest: "",
  youtube: "",
  linkedin: "",
};

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar Islands",
  "Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export default function ContactTab() {
  const [form, setForm] = useState<ContactForm>(initialForm);

  const updateField = <K extends keyof ContactForm>(
    field: K,
    value: ContactForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const printedAddress = [
    form.addressedTo,
    form.addressLine1,
    form.addressLine2,
    form.landmark,
    form.city,
    form.state && form.pinCode
      ? `${form.state} ${form.pinCode}`
      : form.state || form.pinCode,
  ]
    .filter(Boolean)
    .join(", ");

  const missingParts: string[] = [];

  if (!form.addressedTo) missingParts.push("addressed to");
  if (!form.addressLine1) missingParts.push("address line 1");
  if (!form.city) missingParts.push("city");
  if (!form.state) missingParts.push("state");
  if (!form.pinCode) missingParts.push("PIN code");
  if (!form.contactNumber) missingParts.push("contact number");

  return (
    <div className="contact-tab">
      {/* REGION HEADER */}
      <div className="contact-region-header">
        <div>
          <div className="contact-title-row">
            <h2>Contact &amp; social</h2>
            <span className="contact-meta">
              Priya (Ops) · 2 days ago
            </span>
          </div>

          <p>
            What the site promises about reaching you. These print inside
            order confirmations, so a change here changes a promise.
          </p>
        </div>
      </div>

      {/* REACHING US */}
      <section className="contact-card">
        <div className="contact-card-header">
          <h3>Reaching us</h3>

          <p>
            These print inside order confirmations through{" "}
            <span className="pointer-chip">
              {"{{support_hours}}"}
            </span>{" "}
            and{" "}
            <span className="pointer-chip">
              {"{{support_whatsapp}}"}
            </span>
            .
          </p>
        </div>

        <div className="contact-card-body">
          <div className="contact-grid contact-grid-three">
            <ContactField
              label="SUPPORT EMAIL"
              value={form.supportEmail}
              onChange={(value) =>
                updateField("supportEmail", value)
              }
            />

            <ContactField
              label="PHONE"
              value={form.phone}
              onChange={(value) => updateField("phone", value)}
            />

            <ContactField
              label="WHATSAPP"
              value={form.whatsapp}
              onChange={(value) =>
                updateField("whatsapp", value)
              }
            />
          </div>

          <div className="contact-grid contact-grid-three contact-second-row">
            <ContactField
              label="DAYS OPEN"
              value={form.daysOpen}
              onChange={(value) =>
                updateField("daysOpen", value)
              }
            />

            <ContactField
              label="HOURS"
              value={form.hours}
              onChange={(value) => updateField("hours", value)}
            />

            <ContactField
              label="REPLY WITHIN (HRS)"
              value={form.replyWithin}
              onChange={(value) =>
                updateField("replyWithin", value)
              }
            />
          </div>
        </div>
      </section>

      {/* RETURNS ADDRESS */}
      <section className="contact-card">
        <div className="contact-card-header">
          <h3>Returns address</h3>

          <p>
            Where a customer sends a piece back, and where the courier
            collects from. Distinct from the registered address on Legal,
            which is for invoices.
          </p>
        </div>

        <div className="contact-card-body">
          <div className="contact-field-full">
            <ContactField
              label="ADDRESSED TO"
              value={form.addressedTo}
              onChange={(value) =>
                updateField("addressedTo", value)
              }
            />

            <span className="contact-hint">
              Who the courier hands it to. Not a person's name — a desk, so it
              survives someone leaving.
            </span>
          </div>

          <div className="contact-field-full">
            <ContactField
              label="ADDRESS LINE 1"
              value={form.addressLine1}
              onChange={(value) =>
                updateField("addressLine1", value)
              }
            />
          </div>

          <div className="contact-field-full">
            <ContactField
              label="ADDRESS LINE 2"
              value={form.addressLine2}
              onChange={(value) =>
                updateField("addressLine2", value)
              }
            />

            <span className="contact-hint">
              Building, floor or unit. Leave blank if there is nothing to add.
            </span>
          </div>

          <div className="contact-field-full">
            <ContactField
              label="LANDMARK"
              value={form.landmark}
              onChange={(value) =>
                updateField("landmark", value)
              }
            />

            <span className="contact-hint">
              Optional, but Indian couriers use it more than the address itself.
            </span>
          </div>

          <div className="contact-grid contact-grid-two">
            <div>
              <ContactField
                label="CITY"
                value={form.city}
                onChange={(value) =>
                  updateField("city", value)
                }
              />
            </div>

            <div>
              <label className="contact-label">STATE</label>

              <select
                className="contact-input"
                value={form.state}
                onChange={(e) =>
                  updateField("state", e.target.value)
                }
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="contact-grid contact-grid-two">
            <div>
              <ContactField
                label="PIN CODE"
                value={form.pinCode}
                onChange={(value) =>
                  updateField(
                    "pinCode",
                    value.replace(/\D/g, "").slice(0, 6)
                  )
                }
              />

              <span className="contact-hint">
                Six digits.
              </span>
            </div>

            <div>
              <ContactField
                label="CONTACT NUMBER"
                value={form.contactNumber}
                onChange={(value) =>
                  updateField("contactNumber", value)
                }
              />

              <span className="contact-hint">
                Couriers will not accept a pickup without one.
              </span>
            </div>
          </div>

          <div className="address-print-preview">
            <div className="address-print-label">
              HOW IT PRINTS ON A LABEL
            </div>

            {printedAddress ? (
              <div className="address-print-value">
                {printedAddress}
              </div>
            ) : (
              <div className="address-print-empty">
                nothing to print yet
              </div>
            )}

            {missingParts.length > 0 && (
              <div className="address-missing">
                Missing {missingParts.join(", ")}.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WHATSAPP */}
      <section className="contact-card">
        <div className="contact-card-header">
          <h3>WhatsApp button</h3>
        </div>

        <div className="contact-card-body">
          <label className="contact-toggle-row">
            <button
              type="button"
              className={`contact-toggle ${
                form.whatsappEnabled ? "on" : ""
              }`}
              onClick={() =>
                updateField(
                  "whatsappEnabled",
                  !form.whatsappEnabled
                )
              }
              aria-pressed={form.whatsappEnabled}
            >
              <span />
            </button>

            <span>Show the floating button</span>
          </label>

          <div className="contact-grid contact-grid-two whatsapp-fields">
            <ContactField
              label="TOOLTIP"
              value={form.whatsappTooltip}
              onChange={(value) =>
                updateField("whatsappTooltip", value)
              }
            />

            <ContactField
              label="PRE-FILLED MESSAGE"
              value={form.whatsappMessage}
              onChange={(value) =>
                updateField("whatsappMessage", value)
              }
            />
          </div>
        </div>
      </section>

      {/* SOCIAL */}
      <section className="contact-card">
        <div className="contact-card-header">
          <h3>Social</h3>

          <p>
            Blank channels are hidden rather than linked to an empty profile.
          </p>
        </div>

        <div className="contact-card-body">
          <div className="contact-grid contact-grid-two">
            <div>
              <ContactField
                label="INSTAGRAM"
                value={form.instagram}
                onChange={(value) =>
                  updateField("instagram", value)
                }
              />

              <span className="contact-hint">
                The homepage prototype shows @houseofkaira; the live handle
                is @house_of_kaira.
              </span>
            </div>

            <ContactField
              label="FOLLOW LABEL"
              value={form.followLabel}
              onChange={(value) =>
                updateField("followLabel", value)
              }
            />
          </div>

          <div className="contact-grid contact-grid-two">
            <ContactField
              label="FACEBOOK"
              value={form.facebook}
              onChange={(value) =>
                updateField("facebook", value)
              }
            />

            <ContactField
              label="PINTEREST"
              value={form.pinterest}
              onChange={(value) =>
                updateField("pinterest", value)
              }
            />
          </div>

          <div className="contact-grid contact-grid-two">
            <ContactField
              label="YOUTUBE"
              value={form.youtube}
              onChange={(value) =>
                updateField("youtube", value)
              }
            />

            <ContactField
              label="LINKEDIN"
              value={form.linkedin}
              onChange={(value) =>
                updateField("linkedin", value)
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}

interface ContactFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ContactField({
  label,
  value,
  onChange,
}: ContactFieldProps) {
  return (
    <div className="contact-field">
      <label className="contact-label">{label}</label>

      <input
        className="contact-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}