import logo from "../assets/logo/logo1.png";

export default function Header() {
  return (
    <header>

      {/* TOP BAR */}
      <div className="top-bar">
        A New Standard of Luxury - Curated, Circulated, Conscious.
      </div>


      {/* MAIN HEADER */}
      <div className="header ">
        <div className="container  header-middle d-none d-xl-block">
          <div className="row align-items-center gx-0 header-row">

            {/* SEARCH */}
            <div className="col-lg-4 header-left">
              <div className="input-group">
                <span className="input-group-text search-icon">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search designers, styles, or occasions..."
                />
              </div>
            </div>

            {/* LOGO */}
            <div className="col-lg-4 text-center header-center">
              <img src={logo} alt="House of Kaira" className="main-logo" />
              {/* <div className="logo-subtext">HOUSE OF KAIRA</div> */}
            </div>

            {/* ICONS */}
            <div className="col-lg-4 header-right">
              <i className="bi bi-heart icon-btn"></i>
              <i className="bi bi-bag icon-btn"></i>
              <i className="bi bi-person icon-btn"></i>
            </div>

          </div>
        </div>
      </div>


      {/* NAVBAR */}
     <nav className="navbar navbar-expand-xl navbar-custom">
  <div className="navbar-container d-flex align-items-center justify-content-between">

    {/* MOBILE TOGGLE */}
    <button
      className="navbar-toggler border-0"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#mainNavbar"
    >
      <i className="bi bi-list" style={{ fontSize: "24px" }}></i>
    </button>

    {/* MOBILE LOGO */}
    <div className="mobile-logo-wrap d-xl-none text-center">
      <img src={logo} alt="logo" className="mobile-logo" />
    </div>

    {/* MOBILE ICONS */}
    <div className="mobile-icons d-xl-none">
      <i className="bi bi-heart icon-btn"></i>
      <i className="bi bi-bag icon-btn"></i>
    </div>

    {/* NAV MENU */}
    <div className="collapse navbar-collapse justify-content-center" id="mainNavbar">
      <ul className="navbar-nav text-uppercase">

        {/* RENT */}
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
            Rent <span className="nav-arrow"><i className="bi bi-chevron-down nav-arrow-icon"></i></span>
          </a>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item">Lehenga</a></li>
            <li><a className="dropdown-item">Saree</a></li>
          </ul>
        </li>

        <li className="nav-item">
          <a className="nav-link nav-cu active-new" href="/products">Shop Preloved</a>
        </li>

        <li className="nav-item">
          <a className="nav-link nav-cu ">Shop New</a>
        </li>

        <li className="nav-item">
          <a className="nav-link nav-cu">Women</a>
        </li>

        <li className="nav-item">
          <a className="nav-link nav-cu">Men</a>
        </li>

        {/* OCCASION */}
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
            Occasion <span className="nav-arrow"><i className="bi bi-chevron-down nav-arrow-icon"></i></span>
          </a>
        </li>

        {/* DESIGNERS */}
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
            Designers <span className="nav-arrow"><i className="bi bi-chevron-down nav-arrow-icon"></i></span>
          </a>
        </li>

        {/* CATEGORY */}
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
            Shop by Category <span className="nav-arrow"><i className="bi bi-chevron-down nav-arrow-icon"></i></span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link nav-cu">
            New Arrivals <span className="new-badge">New</span>
          </a>
        </li>

      </ul>
    </div>

  </div>
</nav>
    </header>
  );
}