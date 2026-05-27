import {
  CircleHelp,
  MessageCircle,
  Mail,
  Hexagon
} from "lucide-react";

import MobileSectionLabel from "../ui/MobileSectionLabel";

import "../../../../styles/Profile/mobile/sections/MobileHelpSupportSection.css";

const SUPPORT_ITEMS = [
  {
    id: "faq",
    label: "Help & FAQ",
    subText:
      "Rentals, returns, payments",
    icon: CircleHelp,
    iconColor: "#6B7E5A"
  },
  {
    id: "chat",
    label: "Chat with Us",
    subText:
      "WhatsApp — quick replies",
    icon: MessageCircle,
    iconColor: "#A8844A"
  },
  {
    id: "email",
    label: "Email Support",
    subText:
      "hello@houseofkaira.com",
    icon: Mail,
    iconColor: "#B85C38"
  },
  {
    id: "size-guide",
    label: "Size Guide",
    subText:
      "Measurements & fit",
    icon: Hexagon,
    iconColor: "#2A4466"
  }
];

const POLICY_LINKS = [
  "Terms & Conditions",
  "Privacy Policy",
  "Refund Policy",
  "Damage Policy",
  "Cookie Policy"
];

const MobileHelpSupportSection =
  () => {
    const handleSupportClick =
      (id) => {
        console.log(
          "Support click:",
          id
        );
      };

    const handlePolicyClick =
      (policy) => {
        console.log(
          "Policy click:",
          policy
        );
      };

    return (
      <section className="profile-mobile-help-section">
        {/* =====================================
            Section Label
           ===================================== */}

        <MobileSectionLabel title="HELP & SUPPORT" />

        {/* =====================================
            Support Grid
           ===================================== */}

        <div className="profile-mobile-help-grid">
          {SUPPORT_ITEMS.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  className="profile-mobile-help-cell"
                  onClick={() =>
                    handleSupportClick(
                      item.id
                    )
                  }
                >
                  {/* Icon */}

                  <div className="profile-mobile-help-icon">
                    <Icon
                      size={15}
                      strokeWidth={1.5}
                      style={{
                        stroke:
                          item.iconColor
                      }}
                    />
                  </div>

                  {/* Content */}

                  <div className="profile-mobile-help-label">
                    {item.label}
                  </div>

                  <div className="profile-mobile-help-sub">
                    {item.subText}
                  </div>
                </button>
              );
            }
          )}
        </div>

        {/* =====================================
            Legal & Policies
           ===================================== */}

        <div className="profile-mobile-legal-block">
          <div className="profile-mobile-legal-label">
            Legal & Policies
          </div>

          <div className="profile-mobile-legal-links">
            {POLICY_LINKS.map(
              (policy) => (
                <button
                  key={policy}
                  type="button"
                  className="profile-mobile-policy-pill"
                  onClick={() =>
                    handlePolicyClick(
                      policy
                    )
                  }
                >
                  {policy}
                </button>
              )
            )}
          </div>
        </div>
      </section>
    );
  };

export default MobileHelpSupportSection;