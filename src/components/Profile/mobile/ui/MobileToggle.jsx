import "../../../../styles/Profile/mobile/ui/MobileToggle.css";

const MobileToggle = ({
  isOn,
  onToggle
}) => {
  return (
    <button
      type="button"
      className={`profile-mobile-tog ${
        isOn ? "on" : "off"
      }`}
      onClick={() =>
        onToggle?.(!isOn)
      }
    />
  );
};

export default MobileToggle;