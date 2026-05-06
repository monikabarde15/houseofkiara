// PageTitle.jsx
// PageTitle.jsx

import "../../../styles/checkout/layout/page-title.css";

const PageTitle = () => {
  return (
    <div className="page-title">

      {/* LEFT: H1 */}
      <h1 className="page-title__heading">
        Secure <em>Checkout</em>
      </h1>

      {/* RIGHT NOTE */}
      <div className="page-title__note">
        3 pieces · ₹46,730 due today ·{" "}
        <span className="page-title__note-sub">
          incl. free standard delivery
        </span>
      </div>

    </div>
  );
};

export default PageTitle;