import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "../../styles/Header/announcement-bar.css";
import {
  getAnnouncementSettings,
  defaultAnnouncementConfig,
  isScopeMatch,
} from "../../services/announcementApi";

const AnnouncementBar = () => {
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
          className="announce-sep-slash"
          style={{ color: "rgba(201, 169, 110, 0.45)", margin: "0 14px", fontSize: "11px" }}
        >
          /
        </span>
      );
    }
    if (sepType === "Middle dot" || sepType === "Dash") {
      return (
        <span
          className="announce-sep-char"
          style={{ color: "rgba(201, 169, 110, 0.45)", margin: "0 14px", fontSize: "11px" }}
        >
          {sepType === "Dash" ? "—" : "·"}
        </span>
      );
    }
    // Default Dot
    return <span className="announce-sep" />;
  };

  return (
    <div
      className="announce-bar"
      style={{
        backgroundColor: config.backgroundColor || "#1a1612",
      }}
    >
      <div
        className="announce-track"
        style={{
          animation: isStatic ? "none" : undefined,
          animationDuration: `${config.loopTimeSeconds || 28}s`,
          animationPlayState: !config.pauseOnHover ? "running" : undefined,
        }}
      >
        {duplicatedItems.map((item, index) => {
          const isItalic = item.italicSerif || item.type === "italic";
          const textColor = isItalic
            ? config.italicLineColor || "#e8d5b0"
            : config.textColor || "rgba(212, 197, 176, 0.72)";

          const itemContent = item.link ? (
            item.link.startsWith("http") ? (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className={isItalic ? "announce-item italic" : "announce-item"}
                style={{ color: textColor, textDecoration: "none" }}
              >
                {item.text}
              </a>
            ) : (
              <Link
                to={item.link}
                className={isItalic ? "announce-item italic" : "announce-item"}
                style={{ color: textColor, textDecoration: "none" }}
              >
                {item.text}
              </Link>
            )
          ) : (
            <span
              className={isItalic ? "announce-item italic" : "announce-item"}
              style={{ color: textColor }}
            >
              {item.text}
            </span>
          );

          return (
            <div key={`${item.id || index}-${index}`} className="announce-content">
              {itemContent}
              {renderSeparator(config.separator)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnnouncementBar;
