import React from "react";
import { Search, Heart, ShoppingBag, User } from "lucide-react";

export default function Header() {
  return (
    <>
      <div className="announcement">
        A New Standard of Luxury – Curated, Circulated, Conscious.
      </div>

      <header className="header">

        <div className="header-left">
          <div className="search">
            <Search size={14} />
            <input placeholder="Search designers, styles, or occasions…" />
          </div>
        </div>

        <div className="header-center">
          <div className="logo">
            HK
            <span>House of Kaira</span>
          </div>
        </div>

        <div className="header-right">

          <div className="icon">
            <Heart size={18} />
          </div>

          <div className="icon cart">
            <ShoppingBag size={18} />
            <span className="dot"></span>
          </div>

          <div className="icon">
            <User size={18} />
          </div>

        </div>

      </header>

      <nav className="nav">
        <a className="active rent">Rent</a>
        <a>Shop Preloved</a>
        <a>Shop New</a>
        <a>Women</a>
        <a>Men</a>
        <a>Occasion</a>
        <a>Designers</a>
        <a>Shop by Category</a>
        <a>New Arrivals</a>
      </nav>
    </>
  );
}