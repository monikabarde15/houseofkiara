/**
 * House of Kaira: System Occasions Index Band (S7 / C9)
 * Strictly populated from live database products (/api/web-products/filters)
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/system/system-variables.css";
import "../../../styles/system/system-occasions.css";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII"];

export default function SystemOccasionsBand({
  eyebrow = "Another way in",
  title = "Or begin with the occasion",
}) {
  const [dynamicCells, setDynamicCells] = useState([]);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/web-products/filters")
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((filtersJson) => {
        if (!isMounted) return;

        const occasionEntries = [];
        const seen = new Set();

        const addOccasion = (name, count = 0) => {
          if (!name || Number(count) <= 0) return;
          const clean = String(name).trim();
          const key = clean.toLowerCase();
          if (!clean || seen.has(key)) return;
          seen.add(key);
          occasionEntries.push({
            id: key.replace(/[^a-z0-9]+/g, "-"),
            name: clean,
            count: Number(count) || 0,
            path: `/main-page?section=occasions&occasion=${encodeURIComponent(clean)}`,
          });
        };

        // Strictly live product occasions with count > 0 from database
        if (Array.isArray(filtersJson?.data?.occasion)) {
          const sortedOccs = [...filtersJson.data.occasion]
            .filter(([, count]) => Number(count) > 0)
            .sort((a, b) => (Number(b[1]) || 0) - (Number(a[1]) || 0));
          sortedOccs.forEach(([occName, count]) => {
            addOccasion(occName, count);
          });
        }

        const mapped = occasionEntries.slice(0, 7).map((item, idx) => ({
          id: item.id,
          roman: ROMAN_NUMERALS[idx] || String(idx + 1),
          name: item.name,
          path: item.path,
          action: "Explore",
          isAllDesigners: false,
        }));
        setDynamicCells(mapped);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const allDesignersCell = {
    id: "all-designers",
    roman: "A to Z",
    name: "All designers",
    path: "/main-page?section=designers",
    action: "Browse",
    isAllDesigners: true,
  };

  const cells = [...dynamicCells, allDesignersCell];

  return (
    <section className="sys-occasions-band" aria-labelledby="sys-occasions-title">
      <div className="sys-occasions-inner">
        {eyebrow && (
          <div className="sys-occasions-eyebrow" aria-hidden="true">
            <span className="sys-occasions-eyebrow-rule" />
            <span className="sys-occasions-eyebrow-text">{eyebrow}</span>
          </div>
        )}

        <h2 id="sys-occasions-title" className="sys-occasions-title">
          Or begin with the <em>occasion</em>
        </h2>

        <div className="sys-occasions-grid">
          {cells.map((cell) => (
            <Link
              key={cell.id}
              to={cell.path}
              className={`sys-occasion-cell ${cell.isAllDesigners ? "all-designers" : ""}`}
            >
              <div className="sys-occasion-num">{cell.roman}</div>
              <div className="sys-occasion-name">{cell.name}</div>
              <div className="sys-occasion-link">
                <span>{cell.action}</span>
                <span className="sys-occasion-arrow" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
