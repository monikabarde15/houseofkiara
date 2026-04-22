import { useEffect } from "react";
import logo from "../assets/logo/logo1.png";
import { Link } from "react-router-dom";

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
    {
      title: "Rent",
      link: "/rent",
      items: [
        { name: "Filter", link: "/rent/bridal-lehengas" },
        { name: "Products", link: "/products" },
        { name: "Gowns", link: "/rent/gowns" }
      ]
    },
    {
      title: "Shop Preloved",
      link: "/shop/preloved",
      active: true,
      items: [
        { name: "All Products", link: "/shop/preloved/all" },
        { name: "Trending", link: "/shop/preloved/trending" }
      ]
    },
    {
      title: "Shop New",
      link: "/shop/new",
      items: [
        { name: "New Arrivals", link: "/shop/new/arrivals" },
        { name: "Festive", link: "/shop/new/festive" }
      ]
    },
    {
      title: "Women",
      link: "/women",
      items: [
        { name: "Lehengas", link: "/women/lehengas" },
        { name: "Sarees", link: "/women/sarees" }
      ]
    },
    {
      title: "Men",
      link: "/men",
      items: [
        { name: "Sherwanis", link: "/men/sherwanis" },
        { name: "Kurtas", link: "/men/kurtas" }
      ]
    },
    {
      title: "Occasion",
      link: "/occasion",
      items: [
        { name: "Wedding", link: "/occasion/wedding" },
        { name: "Mehendi", link: "/occasion/mehendi" }
      ]
    },
    {
      title: "Designers",
      link: "/designers",
      items: [
        { name: "Sabyasachi", link: "/designers/sabyasachi" },
        { name: "Manish", link: "/designers/manish" }
      ]
    },
    {
      title: "Shop by Category",
      link: "/category",
      items: [
        { name: "Ethnic", link: "/category/ethnic" },
        { name: "Fusion", link: "/category/fusion" }
      ]
    },
    {
      title: "New Arrivals",
      link: "/new-arrivals",
      items: [
        { name: "Latest", link: "/new-arrivals/latest" },
        { name: "Trending", link: "/new-arrivals/trending" }
      ]
    }
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

                  {/* ✅ Parent Nav */}
                  <Link
                    to={m.link}
                    className={`nav-link ${m.active ? "active" : ""}`}
                    onClick={(e) => {
                      if (window.innerWidth < 1200) {
                        e.preventDefault(); // mobile pe dropdown open karega
                      }
                    }}
                  >
                    {m.title}
                    <i className="bi bi-chevron-down nav-arrow"></i>
                  </Link>

                  {/* ✅ Dropdown */}
                  <ul className="dropdown-menu">
                    {m.items.map((item, idx) => (
                      <li key={idx}>
                        <Link
                          to={item.link}
                          className="dropdown-item"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.name}
                        </Link>
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