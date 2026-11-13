import { useState, useEffect } from "react";
import Toast from "../AboutUs/shared/Toast";
import "./../../styles/Footer/footer.css";
import DesktopFooter from "./DesktopFooter/DesktopFooter";
import MobileFooter from "./MobileFooter/MobileFooter";
import { getFooterSettings } from "../../services/footerApi";
import { getBrandSettings, defaultBrandConfig } from "../../services/brandApi";
import { getContactSettings, defaultContactConfig } from "../../services/contactApi";

const Footer = () => {
  const [footerSettings, setFooterSettings] = useState(null);
  const [brandSettings, setBrandSettings] = useState(defaultBrandConfig);
  const [contactSettings, setContactSettings] = useState(defaultContactConfig);

  useEffect(() => {
    let isMounted = true;
    getFooterSettings().then((settings) => {
      if (isMounted && settings) {
        setFooterSettings(settings);
      }
    });
    getBrandSettings().then((brand) => {
      if (isMounted && brand) {
        setBrandSettings(brand);
      }
    });
    getContactSettings().then((contact) => {
      if (isMounted && contact) {
        setContactSettings(contact);
      }
    });

    const handleFooterUpdate = () => {
      getFooterSettings(true).then((settings) => {
        if (isMounted && settings) {
          setFooterSettings(settings);
        }
      });
    };
    const handleBrandUpdate = () => {
      getBrandSettings(true).then((brand) => {
        if (isMounted && brand) {
          setBrandSettings(brand);
        }
      });
    };
    const handleContactUpdate = () => {
      getContactSettings(true).then((contact) => {
        if (isMounted && contact) {
          setContactSettings(contact);
        }
      });
    };

    window.addEventListener("hok_footer_updated", handleFooterUpdate);
    window.addEventListener("hok_brand_updated", handleBrandUpdate);
    window.addEventListener("hok_contact_updated", handleContactUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("hok_footer_updated", handleFooterUpdate);
      window.removeEventListener("hok_brand_updated", handleBrandUpdate);
      window.removeEventListener("hok_contact_updated", handleContactUpdate);
    };
  }, []);

  return (
    <>
      <div className="footer-desktop-wrapper">
        <DesktopFooter
          footerSettings={footerSettings}
          brandSettings={brandSettings}
          contactSettings={contactSettings}
        />
      </div>

      <div className="footer-mobile-wrapper">
        <MobileFooter
          footerSettings={footerSettings}
          brandSettings={brandSettings}
          contactSettings={contactSettings}
        />
      </div>

      <Toast />
    </>
  );
};

export default Footer;
