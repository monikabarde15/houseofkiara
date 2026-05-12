import "../../../styles/confirmation/layout/confirmation-body-layout.css";

const ConfirmationBodyLayout = ({
  leftContent,
  rightContent,
}) => {
  return (
    <div className="confirmation-body-layout">

      <div className="confirmation-body-layout-left">
        {leftContent}
      </div>

      <aside className="confirmation-body-layout-right">
        {rightContent}
        Right content
      </aside>

    </div>
  );
};

export default ConfirmationBodyLayout;