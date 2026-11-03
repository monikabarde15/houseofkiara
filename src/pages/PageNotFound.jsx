/**
 * House of Kaira: Page Not Found (404)
 * Section 5 & Appendix A, B of System Pages Specification v1.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InvitationFrame from "../components/system/shared/InvitationFrame";
import SystemHeroHeader from "../components/system/shared/SystemHeroHeader";
import SystemSearchField from "../components/system/shared/SystemSearchField";
import SystemPiecesBand from "../components/system/shared/SystemPiecesBand";
import SystemConciergeBand from "../components/system/shared/SystemConciergeBand";
import {
  SystemDarkButton,
  SystemOutlineButton,
  SystemQueryLink,
  SystemQuietLinksRow
} from "../components/system/shared/SystemButtons";
import {
  analyze404Url,
  select404PiecesBand
} from "../utils/system/urlParser404";
import { formatProductDetail, parsePrice } from "../utils/productNavigation";
import "../styles/system/system-variables.css";
import "../styles/system/system-hero.css";

export default function PageNotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasInternalReferrer, setHasInternalReferrer] = useState(false);
  const [livePieces, setLivePieces] = useState([]);

  // Check if visitor arrived from another page on this site
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isInternal =
        document.referrer &&
        document.referrer.includes(window.location.host) &&
        window.history.length > 1;
      setHasInternalReferrer(Boolean(isInternal));
    }
  }, []);

  // 1. Analyze URL to determine if it is a sold piece, gone piece, or general 404
  const analysis = useMemo(() => {
    return analyze404Url(location.pathname);
  }, [location.pathname]);

  // 2. Select 4 pieces for S5 pieces band (static fallback)
  const piecesBandData = useMemo(() => {
    return select404PiecesBand(analysis);
  }, [analysis]);

  // 3. Fetch real live products from API for the bottom pieces band
  useEffect(() => {
    let isMounted = true;
    const fetchLiveProducts = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
        const res = await fetch(`${backendUrl}/api/web-products`);
        if (!res.ok) return;
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        if (list.length === 0 || !isMounted) return;

        let candidates = list;
        const words = (analysis?.extractedWords || []).map((w) => String(w).toLowerCase());
        if (words.length > 0) {
          const matched = list.filter((p) => {
            const str = `${p.name || ""} ${p.designer || ""} ${p.category || ""}`.toLowerCase();
            return words.some((w) => str.includes(w));
          });
          if (matched.length >= 2) {
            candidates = matched;
          }
        }

        const formatted = candidates.slice(0, 4).map((p) => {
          const raw = formatProductDetail(p);
          const isPrelovedOnly = raw.preloved && !raw.rent;
          const priceNum = parsePrice(
            isPrelovedOnly
              ? raw.buyPrice || raw.listingPrice || raw.price
              : raw.rentPrice || raw.rentalPrice || raw.price
          );

          const firstImg =
            Array.isArray(raw.images) && raw.images.length > 0
              ? raw.images[0]
              : Array.isArray(raw.image) && raw.image.length > 0
              ? raw.image[0]
              : raw.image;

          return {
            id: raw.id || raw._id,
            name: raw.name || raw.title || "Designer Piece",
            designer: raw.designer || "House of Kaira",
            image: firstImg,
            mode: isPrelovedOnly ? "preloved" : "rent",
            price: `₹${(priceNum || 0).toLocaleString("en-IN")}`,
            window: isPrelovedOnly ? "" : "for 3 days",
            rawProduct: raw,
          };
        });

        if (isMounted && formatted.length > 0) {
          setLivePieces(formatted);
        }
      } catch (err) {
        console.warn("Could not load real products for 404 pieces band:", err);
      }
    };

    fetchLiveProducts();
    return () => {
      isMounted = false;
    };
  }, [analysis]);

  // Page title & noindex meta tag (Section 5.2)
  useEffect(() => {
    document.title = "Page not found · House of Kaira";

    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = "noindex";

    return () => {
      if (robotsMeta) {
        robotsMeta.content = "index, follow";
      }
    };
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Determine copy based on wording variant (Section 5.4)
  const isPiece = analysis.type === "piece" && analysis.piece;
  const isSold = isPiece && analysis.wording === "sold";
  const isGone = isPiece && analysis.wording === "gone";

  let eyebrow = "Page not found";
  let heading = "This page has moved on";
  let sub =
    "The link may be old or mistyped, or the piece it led to may have already found its next home. Let us help you find your way.";
  let conciergeTitle = "Looking for something in particular?";
  let conciergeLine =
    "Tell us what you had in mind and our team will look for it, or the closest thing to it. The link you followed is already in the message, so there is nothing to copy.";

  const fullLink = typeof window !== "undefined" ? window.location.href : location.pathname;
  let whatsAppMessage = `Hello House of Kaira, this link did not open for me: ${fullLink}. Could you help me find what I was looking for?`;

  if (isSold) {
    eyebrow = "No longer available";
    heading = "This piece has found its next home";
    sub = `The ${analysis.piece.name} by ${analysis.piece.designer} now belongs to someone who will treasure it. Here are pieces in the same spirit, or our team can look for one like it for you.`;
    conciergeTitle = "Looking for a piece like it?";
    conciergeLine =
      "Tell us what you loved about it and our team will look for something like it. The piece is already named in the message, so there is nothing to copy.";
    whatsAppMessage = `Hello House of Kaira, I was looking at the ${analysis.piece.name} by ${analysis.piece.designer} (${analysis.piece.houseNumber}), which is no longer available. Could you help me find something like it?`;
  } else if (isGone) {
    eyebrow = "No longer available";
    heading = "This piece has moved on";
    sub = `The ${analysis.piece.name} by ${analysis.piece.designer} is no longer with the house. Here are pieces in the same spirit, or our team can look for one like it for you.`;
    conciergeTitle = "Looking for a piece like it?";
    conciergeLine =
      "Tell us what you loved about it and our team will look for something like it. The piece is already named in the message, so there is nothing to copy.";
    whatsAppMessage = `Hello House of Kaira, I was looking at the ${analysis.piece.name} by ${analysis.piece.designer} (${analysis.piece.houseNumber}), which is no longer available. Could you help me find something like it?`;
  }

  // Quiet links list (Section 5.7)
  const quietLinks = [
    { label: "Home", to: "/" },
    { label: "Designers, A to Z", to: "/main-page?section=designers" },
    { label: "Help & FAQs", to: "/faqs" },
    { label: "Contact Us", to: "/contact-us" }
  ];

  return (
    <main className="sys-page" id="page-not-found">
      {/* S1 Hero Band */}
      <section className="sys-hero-band">
        <InvitationFrame>
          <SystemHeroHeader
            eyebrow={eyebrow}
            heading={heading}
            sub={sub}
          />

          {/* C3 Search Field */}
          <SystemSearchField
            onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
          />

          {/* "Or search for" Query Link (Section 5.5) */}
          {analysis.suggestQuery && (
            <div className="sys-query-link-row">
              <span>Or search for </span>
              <SystemQueryLink
                query={analysis.suggestQuery}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/search?q=${encodeURIComponent(analysis.suggestQuery)}`);
                }}
              />
            </div>
          )}

          {/* Two Hero Buttons (Section 5.7) */}
          <div className="sys-button-pair">
            <SystemDarkButton to="/main-page?section=rent">
              Browse rentals
            </SystemDarkButton>
            <SystemOutlineButton to="/main-page?section=preloved">
              Shop preloved
            </SystemOutlineButton>
          </div>

          {/* Quiet Links Row (Section 5.7) */}
          <SystemQuietLinksRow
            showBack={hasInternalReferrer}
            links={quietLinks}
          />
        </InvitationFrame>
      </section>

      {/* S5 Pieces Band (Section 5.6 - Real Live API Products with Static Fallback) */}
      {(livePieces.length >= 2 || piecesBandData) && (
        <SystemPiecesBand
          eyebrow={piecesBandData?.eyebrow || "Just arrived"}
          title={piecesBandData?.title || "New to the house"}
          link={piecesBandData?.link || { label: "All new arrivals", href: "/main-page?section=new" }}
          pieces={livePieces.length >= 2 ? livePieces : (piecesBandData?.pieces || [])}
        />
      )}

      {/* S6 Concierge Band (Section 5.8) */}
      <SystemConciergeBand
        eyebrow="Our team, on WhatsApp"
        title={conciergeTitle}
        line={conciergeLine}
        buttonLabel="Message us on WhatsApp"
        whatsAppMessage={whatsAppMessage}
      />
    </main>
  );
}
