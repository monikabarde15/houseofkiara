import logo from "../assets/logo/logo.png";

export default function Header() {
  return (
    <header>

      {/* TOP BAR */}

      <div className="top-bar">
        A New Standard of Luxury – Curated, Circulated, Conscious.
      </div>


      {/* HEADER MIDDLE */}

      <div className="container header-middle py-3">

        <div className="row align-items-center gx-0 header-row">

          {/* SEARCH */}

          <div className="col-lg-4 col-6 header-left">

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


          {/* LOGO + TEXT */}

          <div className="col-lg-4 text-center d-none d-lg-block header-center">

            <img
              src={logo}
              alt="House of Kaira"
              className="main-logo"
            />

            <div className="logo-subtext">
              HOUSE OF KAIRA
            </div>

          </div>


          {/* ICONS */}

          <div className="col-lg-4 col-6 header-right">

            <i className="bi bi-heart icon-btn"></i>

            <i className="bi bi-bag icon-btn"></i>

            <i className="bi bi-person icon-btn"></i>

          </div>

        </div>

      </div>


      {/* NAVBAR */}

      <nav className="navbar navbar-expand-xl navbar-custom">

        <div className="container">

          {/* MOBILE TOGGLE */}

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
          >

            <span className="navbar-toggler-icon"></span>

          </button>


          {/* MOBILE LOGO */}

          <div className="mobile-logo-wrap d-xl-none text-center">

            <img
              src={logo}
              alt="logo"
              className="mobile-logo"
            />

            <div className="logo-subtext">
              HOUSE OF KAIRA
            </div>

          </div>


          <div
            className="collapse navbar-collapse justify-content-center"
            id="mainNavbar"
          >

            <ul className="navbar-nav text-uppercase">

              <li className="nav-item dropdown">

                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  Rent
                </a>

                <ul className="dropdown-menu">
                  <li><a className="dropdown-item">Lehenga</a></li>
                  <li><a className="dropdown-item">Saree</a></li>
                </ul>

              </li>
              <li className="nav-item">
                <a className="nav-link" href="/products">Shop Preloved</a>
              </li>

              <li className="nav-item">
                <a className="nav-link active-new">Shop New</a>
              </li>


              <li className="nav-item">
                <a className="nav-link">Women</a>
              </li>


              <li className="nav-item">
                <a className="nav-link">Men</a>
              </li>


              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  Occasion
                </a>
              </li>


              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  Designers
                </a>
              </li>


              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  Shop by Category
                </a>
              </li>


              <li className="nav-item">
                <a className="nav-link">New Arrivals</a>
              </li>

            </ul>

          </div>

        </div>

      </nav>

    </header>
  );
}