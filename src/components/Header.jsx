import { useEffect } from "react";
import logo from "../assets/logo/logo1.png";

export default function Header() {

  useEffect(() => {
    const items = document.querySelectorAll(".nav-item");

    const handleClick = function (e) {
  if (window.innerWidth < 1200) {

    // ❌ agar dropdown item click hai to skip karo
    if (e.target.closest(".dropdown-menu")) return;

    e.stopPropagation();
    this.classList.toggle("open");
  }
};

    items.forEach(item => item.addEventListener("click", handleClick));

    return () => {
      items.forEach(item => item.removeEventListener("click", handleClick));
    };
  }, []);

  const menu = [
    { title: "Rent",link: "/rent/bridal-lehengas", items: ["Lehengas", "Sarees", "Gowns"] },
    { title: "Shop Preloved",link: "/rent/bridal-lehengas", active: true, items: ["All Products", "Trending"] },
    { title: "Shop New",link: "/rent/bridal-lehengas", items: ["New Arrivals", "Festive"] },
    { title: "Women",link: "/rent/bridal-lehengas", items: ["Lehengas", "Sarees"] },
    { title: "Men",link: "/rent/bridal-lehengas", items: ["Sherwanis", "Kurtas"] },
    { title: "Occasion",link: "/rent/bridal-lehengas", items: ["Wedding", "Mehendi"] },
    { title: "Designers",link: "/rent/bridal-lehengas", items: ["Sabyasachi", "Manish"] },
    { title: "Shop by Category",link: "/rent/bridal-lehengas", items: ["Ethnic", "Fusion"] },
    { title: "New Arrivals",link: "/rent/bridal-lehengas", items: ["Latest", "Trending"] },
  ];

  return (
    <header>

      {/* TOP BAR */}
      <div className="top-bar">
        A New Standard of Luxury - Curated, Circulated, Conscious.
      </div>

      {/* HEADER (DESKTOP ONLY) */}
      <div className="header d-none d-xl-block">
        <div className="header-row">

          <div className="header-left">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input className="form-control search-input" placeholder="Search designers..." />
            </div>
          </div>

          <div className="header-center">
            <img src={logo} alt="logo" className="main-logo" />
          </div>

          <div className="header-right">
            <i className="bi bi-heart icon-btn"></i>
            <i className="bi bi-bag icon-btn"></i>
            <i className="bi bi-person icon-btn"></i>
          </div>

        </div>
      </div>

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-xl navbar-custom">
        <div className="navbar-container">

          {/* MOBILE */}
          <button className="navbar-toggler border-0" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
            <i className="bi bi-list"></i>
          </button>

          <div className="mobile-logo d-xl-none">
            <img src={logo} alt="logo" />
          </div>

          {/* NAV */}
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav">

              {menu.map((m, i) => (
                <li className="nav-item dropdown" key={i}>
                  <a href="#" onClick={(e)=>e.preventDefault()}
                     className={`nav-link ${m.active ? "" : ""}`}>
                    {m.title}
                    <i className="bi bi-chevron-down nav-arrow"></i>
                  </a>

                  <ul className="dropdown-menu">
                    {m.items.map((item, idx) => (
                      <li key={idx}>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.stopPropagation();   // ✅ IMPORTANT
                            console.log(item);     // ya navigation logic
                          }}
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}

            </ul>
          </div>

        </div>
      </nav>

    </header>
  );
}