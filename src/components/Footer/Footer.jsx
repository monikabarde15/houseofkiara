import "./../../styles/Footer/footer.css";
import DesktopFooter from "./DesktopFooter/DesktopFooter";
import MobileFooter from "./MobileFooter/MobileFooter";

const Footer = () => {
  return (
    <>
      <div className="footer-desktop-wrapper">
        <DesktopFooter />
      </div>

      <div className="footer-mobile-wrapper">
        <MobileFooter />
      </div>
    </>
  );
};

export default Footer;