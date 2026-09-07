import React, { useState } from "react";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import "./MobileBarTab.css";
interface MobileTab {
  id: string;
  label: string;
  link: string;
  enabled: boolean;
  isBag?: boolean;
}

export default function MobileBarTab() {
  const [tabs, setTabs] = useState<MobileTab[]>([
    {
      id: "home",
      label: "Home",
      link: "/",
      enabled: true,
    },
    {
      id: "browse",
      label: "Browse",
      link: "/rent",
      enabled: true,
    },
    {
      id: "wishlist",
      label: "Wishlist",
      link: "/wishlist",
      enabled: true,
    },
    {
      id: "bag",
      label: "Cart",
      link: "/cart",
      enabled: true,
      isBag: true,
    },
    {
      id: "account",
      label: "Account",
      link: "/account",
      enabled: true,
    },
  ]);

  const visibleCount = tabs.filter((tab) => tab.enabled).length;

  const toggleTab = (id: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === id
          ? { ...tab, enabled: !tab.enabled }
          : tab
      )
    );
  };

  const moveTab = (index: number, direction: "up" | "down") => {
    setTabs((prev) => {
      const newTabs = [...prev];

      const targetIndex =
        direction === "up" ? index - 1 : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= newTabs.length
      ) {
        return prev;
      }

      [newTabs[index], newTabs[targetIndex]] = [
        newTabs[targetIndex],
        newTabs[index],
      ];

      return newTabs;
    });
  };

  const deleteTab = (id: string) => {
    setTabs((prev) =>
      prev.filter((tab) => tab.id !== id)
    );
  };

  return (
    <div className="mobile-bar-tab">

      {/* BOTTOM BAR CARD */}
      <section className="mobile-bar-card">

        {/* Card Header */}
        <div className="mobile-bar-card-header">
          <div>
            <h2>Bottom bar</h2>

            <p>
              {visibleCount} of {tabs.length} tabs showing.
              The bag entry follows {"{{cart_label}}"} so it
              cannot drift from the desktop word.
            </p>
          </div>
        </div>

        {/* Column Headings */}
        <div className="mobile-bar-columns">
          <div className="mobile-bar-column-label">
            <span></span>
            <span>LABEL</span>
            <span>LINK</span>
            <span></span>
          </div>

          {/* Tab Rows */}
          <div className="mobile-tab-list">

            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className={`mobile-tab-row ${
                  !tab.enabled ? "mobile-tab-hidden" : ""
                }`}
              >

                {/* Checkbox */}
                <button
                  type="button"
                  className={`mobile-checkbox ${
                    tab.enabled ? "checked" : ""
                  }`}
                  onClick={() => toggleTab(tab.id)}
                  aria-label={`Toggle ${tab.label}`}
                >
                  {tab.enabled && "✓"}
                </button>

                {/* Reorder Buttons */}
                <div className="mobile-reorder-buttons">

                  <button
                    type="button"
                    onClick={() =>
                      moveTab(index, "up")
                    }
                    disabled={index === 0}
                    aria-label={`Move ${tab.label} up`}
                  >
                    <ArrowUp size={11} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      moveTab(index, "down")
                    }
                    disabled={index === tabs.length - 1}
                    aria-label={`Move ${tab.label} down`}
                  >
                    <ArrowDown size={11} />
                  </button>

                </div>

                {/* Label */}
                <input
                  type="text"
                  value={tab.label}
                  readOnly={tab.isBag}
                  onChange={(e) => {
                    const value = e.target.value;

                    setTabs((prev) =>
                      prev.map((item) =>
                        item.id === tab.id
                          ? {
                              ...item,
                              label: value,
                            }
                          : item
                      )
                    );
                  }}
                  className={`mobile-quiet-field ${
                    tab.isBag
                      ? "mobile-linked-field"
                      : ""
                  }`}
                />

                {/* Link */}
                <input
                  type="text"
                  value={tab.link}
                  onChange={(e) => {
                    const value = e.target.value;

                    setTabs((prev) =>
                      prev.map((item) =>
                        item.id === tab.id
                          ? {
                              ...item,
                              link: value,
                            }
                          : item
                      )
                    );
                  }}
                  className="mobile-quiet-field mobile-link-field"
                />

                {/* Bag Linked Marker */}
                {tab.isBag && (
                  <span className="mobile-linked-marker">
                    linked
                  </span>
                )}

                {/* Delete */}
                <button
                  type="button"
                  className={`mobile-delete-button ${
                    tab.isBag
                      ? "mobile-delete-disabled"
                      : ""
                  }`}
                  disabled={tab.isBag}
                  onClick={() => deleteTab(tab.id)}
                  aria-label={`Delete ${tab.label}`}
                  title={
                    tab.isBag
                      ? "The bag cannot be removed"
                      : `Delete ${tab.label}`
                  }
                >
                  <X size={12} />
                </button>

              </div>
            ))}

          </div>

          {/* Add Tab */}
          <button
            type="button"
            className="mobile-add-tab"
            onClick={() => {
              const newTab: MobileTab = {
                id: `tab-${Date.now()}`,
                label: "New tab",
                link: "/",
                enabled: true,
              };

              setTabs((prev) => [
                ...prev,
                newTab,
              ]);
            }}
          >
            + Add tab
          </button>

        </div>

      </section>


      {/* HAMBURGER DRAWER CARD */}
      <section className="mobile-bar-card hamburger-drawer-card">

        <div className="mobile-bar-card-header">
          <div>
            <h2>Hamburger drawer</h2>

            <p>
              10 of the header's items appear here.
              Tapping one slides in a panel carrying the
              same columns the desktop menu uses — there
              is no second list.
            </p>
          </div>
        </div>

        {/* Drawer Settings */}
        <div className="drawer-settings">

          {/* Search Toggle */}
          <label className="drawer-toggle-row">
            <input
              type="checkbox"
              defaultChecked
            />

            <span>
              Show the search field at the top of the drawer
            </span>
          </label>

          <p className="drawer-hint">
            Uses the same wording as the desktop search box:
            “Search lehengas, designers, occasions...”.
          </p>


          {/* Mode Shortcut Toggle */}
          <label className="drawer-toggle-row">
            <input
              type="checkbox"
              defaultChecked
            />

            <span>
              Show the mode shortcuts under it
            </span>
          </label>

          <p className="drawer-hint">
            The Rent / Buy Preloved / Buy New row.
            These are the transaction modes, not nav items,
            so they are not part of the list below.
          </p>

        </div>


        {/* Drawer Items */}
        <div className="drawer-items">

          {[
            ["Rent", "same 16 links as desktop"],
            ["Buy Preloved", "same 17 links as desktop"],
            ["Buy New", "same 13 links as desktop"],
            ["Women", "same 15 links as desktop"],
            ["Men", "same 12 links as desktop"],
            ["Occasions", "same 13 links as desktop"],
            ["Designers", "same 16 links as desktop"],
            ["Shop by Category", "goes straight to /categories"],
            ["How It Works", "off in the header, so not in the drawer"],
            ["About HOK", "off in the header, so not in the drawer"],
            ["New Arrivals", "goes straight to /new-arrivals"],
            ["List Your Piece", "goes straight to /list-your-piece"],
          ].map(([label, note], index) => {

            const isOff =
              note ===
              "off in the header, so not in the drawer";

            return (
              <div
                key={`${label}-${index}`}
                className={`drawer-item ${
                  isOff ? "drawer-item-off" : ""
                }`}
              >

                <button
                  type="button"
                  className={`drawer-checkbox ${
                    !isOff ? "checked" : ""
                  }`}
                >
                  {!isOff && "✓"}
                </button>

                <button
                  type="button"
                  className="drawer-item-label"
                >
                  {label}
                </button>

                <span className="drawer-item-note">
                  {note}
                </span>

              </div>
            );
          })}

        </div>

      </section>

    </div>
  );
}