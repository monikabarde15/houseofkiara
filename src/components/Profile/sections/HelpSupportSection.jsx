import React from 'react';
import { HelpCircle, MessageCircle, Mail } from 'lucide-react';
import SupportCard from '../cards/SupportCard';
import "../../../styles/Profile/sections/HelpSupportSection.css";

const HelpSupportSection = () => {
  const supportCards = [
    {
      id: "faq",
      title: "Help & FAQ",
      subtitle: "Answers about renting, returns, payments, and deposits.",
      iconType: "sage",
      icon: <HelpCircle size={14} strokeWidth={1.5} />,
      onClick: () => console.log("Opening FAQ page...")
    },
    {
      id: "chat",
      title: "Chat with Us",
      subtitle: "WhatsApp support — our team usually replies within a few hours.",
      iconType: "gold",
      icon: <MessageCircle size={14} strokeWidth={1.5} />,
      onClick: () => console.log("Opening WhatsApp...")
    },
    {
      id: "email",
      title: "Email Support",
      subtitle: "hello@houseofkaira.com — we respond within 24 hours.",
      iconType: "terracotta",
      icon: <Mail size={14} strokeWidth={1.5} />,
      onClick: () => console.log("Email client opened — hello@houseofkaira.com")
    }
  ];

  const legalLinks = [
    { id: "terms", label: "Terms & Conditions" },
    { id: "privacy", label: "Privacy Policy" },
    { id: "refund", label: "Refund Policy" },
    { id: "damage", label: "Damage Policy" },
    { id: "cookie", label: "Cookie Policy" }
  ];

  const handleLegalClick = (link) => {
    console.log(`Opening ${link.label}...`);
  };

  const handleCardClick = (card) => {
    card.onClick();
  };

  return (
    <div className="profile-help-section" id="support">
      {/* Support Grid */}
      <div className="profile-support-grid">
        {supportCards.map((card) => (
          <SupportCard
            key={card.id}
            card={card}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {/* Legal Block */}
      <div className="profile-legal-block">
        <div className="profile-legal-h">Legal & Policies</div>
        <div className="profile-legal-links">
          {legalLinks.map((link) => (
            <button
              key={link.id}
              className="profile-bl"
              onClick={() => handleLegalClick(link)}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpSupportSection;