// src/components/Header/mobile/MobileAnnouncementBar.jsx
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "../../../styles/Header/mobile/mobile-announcement-bar.css";
import {
  getAnnouncementSettings,
  defaultAnnouncementConfig,
  isScopeMatch,
} from "../../../services/announcementApi";

const MobileAnnouncementBar = () => {
  const location = useLocation();
  const [config, setConfig] = useState(defaultAnnouncementConfig);

  useEffect(() => {
    let isMounted = true;
    getAnnouncementSettings().then((data) => {
      if (isMounted && data) {
        setConfig(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!config.showAcrossSite) {
    return null;
  }

  // Filter messages based on active page route scope
  const activeMessages = (config.messages || []).filter((msg) =>
    isScopeMatch(msg.showsOn, location.pathname)
  );

  if (activeMessages.length === 0) {
    return null;
  }

  const isStatic = config.howItMoves === "Static row" || config.howItMoves === "Static line";
  const duplicatedItems = isStatic ? activeMessages : [...activeMessages, ...activeMessages];

  const renderSeparator = (sepType) => {
    if (sepType === "None") return null;
    if (sepType === "Slash") {
      return (
        <span
          className="mobile-announce-sep-text"
          style={{ color: "rgba(201, 169, 110, 0.45)", margin: "0 6px", fontSize: "10px" }}
        >
          /
        </span>
      );
    }
    if (sepType === "Middle dot" || sepType === "Dash") {
      return (
        <span
          className="mobile-announce-sep-text"
          style={{ color: "rgba(201, 169, 110, 0.45)", margin: "0 6px", fontSize: "10px" }}
        >
          {sepType === "Dash" ? "—" : "·"}
        </span>
      );
    }
    // Default Dot
    return <span className="mobile-announce-sep" />;
  };

  return (
    <div
      className="mobile-announce-bar"
      style={{
        backgroundColor: config.backgroundColor || "#1A1612",
      }}
    >
      <div
        className="mobile-announce-track"
        style={{
          animation: isStatic ? "none" : undefined,
          animationDuration: `${config.loopTimeSeconds || 28}s`,
          animationPlayState: !config.pauseOnHover ? "running" : undefined,
        }}
      >
        {duplicatedItems.map((item, index) => {
          const isItalic = item.italicSerif || item.type === "italic";
          const textColor = isItalic
            ? config.italicLineColor || "#E8D5B0"
            : config.textColor || "rgba(212, 197, 176, 0.72)";

          const itemContent = item.link ? (
            item.link.startsWith("http") ? (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className={isItalic ? "mobile-announce-item italic" : "mobile-announce-item"}
                style={{ color: textColor, textDecoration: "none" }}
              >
                {item.text}
              </a>
            ) : (
              <Link
                to={item.link}
                className={isItalic ? "mobile-announce-item italic" : "mobile-announce-item"}
                style={{ color: textColor, textDecoration: "none" }}
              >
                {item.text}
              </Link>
            )
          ) : (
            <span
              className={isItalic ? "mobile-announce-item italic" : "mobile-announce-item"}
              style={{ color: textColor }}
            >
              {item.text}
            </span>
          );

          return (
            <div key={`${item.id || index}-${index}`} className="mobile-announce-content">
              {itemContent}
              {renderSeparator(config.separator)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileAnnouncementBar;
