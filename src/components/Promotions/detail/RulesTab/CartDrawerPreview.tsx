/* ========================================
   Promotions Module - Cart Drawer Preview
   Offer drawer preview
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.14
   ======================================== */

import React from 'react';
import './styles/CartDrawerPreview.css';
import { Card } from '../../components/UI';
import { OfferDrawerRow } from '../../shared/OfferDrawerRow';
import { PromoCode, TestBagItem, ShopperArchetype } from '../../types/promotions.types';
import { formatMoney } from '../../utils/formatter';

interface CartDrawerPreviewProps {
  code: PromoCode;
  items: TestBagItem[];
  archetype: ShopperArchetype;
  onArchetypeChange: (archetype: ShopperArchetype) => void;
}

// Mock drawer offers
const mockOffers = [
  { code: 'KAIRA10', desc: '10% off your rental - up to ₹1,500', discount: 1500, isCurrent: true, isNearMiss: false },
  { code: 'FIRST25', desc: '25% off your first order', discount: 1000, isCurrent: false, isNearMiss: false },
  { code: 'FREESHIP', desc: 'Free delivery on rentals', discount: 299, isCurrent: false, isNearMiss: false },
  { code: 'BRIDAL500', desc: '₹500 off bridal wear', discount: 500, isCurrent: false, isNearMiss: true, gap: 'Add ₹7,000 more in qualifying pieces' },
];

export const CartDrawerPreview: React.FC<CartDrawerPreviewProps> = ({
  code,
  items,
  archetype,
  onArchetypeChange,
}) => {
  const hasItems = items.length > 0;
  const shopperLabel = archetype === 'first-time' ? 'first-time shopper' : 
                       archetype === 'returning' ? 'returning shopper' : 
                       'shopper who already used it';

  return (
    <Card
      header={
        <>
          <span className="card__title">Cart Offers Drawer</span>
          <div className="drawer-preview__header-right">
            <span>Shopper</span>
            <select value={archetype} onChange={(e) => onArchetypeChange(e.target.value as ShopperArchetype)}>
              <option value="first-time">First-time</option>
              <option value="returning">Returning</option>
              <option value="already-used">Already used it</option>
            </select>
          </div>
        </>
      }
    >
      {!hasItems ? (
        <div className="drawer-preview__empty">
          Build a bag in <strong>Try It Against a Bag</strong> above and the drawer this shopper would see renders here — every listed code that works on it, not just this one.
        </div>
      ) : (
        <>
          {mockOffers.map(offer => (
            <OfferDrawerRow
              key={offer.code}
              code={offer.code}
              publicDesc={offer.desc}
              discount={offer.discount}
              isCurrent={offer.isCurrent}
              isNearMiss={offer.isNearMiss}
              gapMessage={offer.gap}
            />
          ))}

          <div className="drawer-preview__caption">
            Ordered by actual discount on this bag — best first. Greyed rows are minimum-order near-misses. Shown for a {shopperLabel}.
          </div>
        </>
      )}

      <div className="drawer-preview__rules">
        <div className="drawer-preview__rules-header">
          HOW THE DRAWER DECIDES
        </div>
        <div className="drawer-preview__rule">
          <strong>Only listed codes, and only when they work.</strong> A code appears when its Where It Appears switch is on <em>and</em> it passes every check against this shopper’s bag — silently, before anything renders. We never show a code and then refuse it.
        </div>
        <div className="drawer-preview__rule">
          <strong>Private codes are never listed,</strong> whatever the switch says. Listing one would show every shopper a door that opens for a few accounts. The same holds for a first-order code shown to a returning customer: it simply isn't in their drawer.
        </div>
        <div className="drawer-preview__rule">
          <strong>Best first.</strong> Codes are ordered by the actual rupee discount on that bag, largest first — not by percentage, and not by when they were created. A shopper who scrolls should never find a better code below a worse one.
        </div>
        <div className="drawer-preview__rule">
          <strong>Stacking-aware.</strong> Once a code is applied, every other listed code is marked either combinable with it or not, so the choice stays visible instead of failing at the moment of entry.
        </div>
        <div className="drawer-preview__rule">
          <strong>Near-misses: minimum only.</strong> A code the bag doesn’t qualify for is hidden — with one exception. When the only thing missing is the minimum order, it shows greyed with the gap named: "Add ₹500 more in qualifying pieces." That is the one gap a shopper can close on purpose. Scope, mode and first-order misses stay silent, because naming them just advertises what they cannot have.
        </div>
        <div className="drawer-preview__rule">
          <strong>Free-delivery codes.</strong> They show “Free delivery” rather than a rupee figure, and rank below the rupee discounts — the cart has no delivery fee at cart stage yet, so there is no honest amount to rank them by. Once a fee exists they rank by it like any other discount.
        </div>
        <div className="drawer-preview__rule">
          <strong>Front-end dependency.</strong> The cart today carries its own hardcoded list of codes, which has already drifted from this registry. The drawer requires the cart to read these codes instead — that is the prerequisite, and it is the reason two codes in the cart file don't exist here and four codes here don't exist there.
        </div>
      </div>
    </Card>
  );
};