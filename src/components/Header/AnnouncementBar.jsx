import "../../styles/Header/announcement-bar.css";
import { announcementItems } from "../../data/announcementData";

const AnnouncementBar = () => {
  const duplicatedItems = [...announcementItems, ...announcementItems];

  return (
    <div className="announce-bar">
      <div className="announce-track">
        {duplicatedItems.map((item, index) => (
          <div key={index} className="announce-content">
            <span
              className={
                item.type === "italic"
                  ? "announce-item italic"
                  : "announce-item"
              }
            >
              {item.text}
            </span>

            <span className="announce-sep" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;