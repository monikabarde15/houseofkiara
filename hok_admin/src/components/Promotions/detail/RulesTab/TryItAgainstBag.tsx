/* ========================================
   Promotions Module - Try It Against Bag
   Sample bag rehearsal with readout
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.13
   ======================================== */

import React from 'react';
import './styles/TryItAgainstBag.css';
import { Card, Button } from '../../components/UI';
import { PromoCode, TestBagItem, ShopperArchetype, TestBagResult } from '../../types/promotions.types';
import { formatMoney } from '../../utils/formatter';

interface TryItAgainstBagProps {
  code: PromoCode;
  items: TestBagItem[];
  archetype: ShopperArchetype;
  result: TestBagResult | null;
  onAddItem: (item: TestBagItem) => void;
  onRemoveItem: (index: number) => void;
  onClearBag: () => void;
  onArchetypeChange: (type: ShopperArchetype) => void;
  onEvaluate: () => void;
}

// Mock available pieces
const mockPieces = [
  { id: '1', productId: '1', name: 'Champagne Tissue Sharara', sku: 'SKU-001', mode: 'Rental' as const, price: 5500, isAcceptedOffer: false },
  { id: '2', productId: '2', name: 'Sabyasachi Bridal Lehenga', sku: 'SKU-002', mode: 'Rental' as const, price: 17500, isAcceptedOffer: false },
  { id: '3', productId: '3', name: 'Manish Malhotra Saree', sku: 'SKU-003', mode: 'Preloved' as const, price: 8500, isAcceptedOffer: false },
  { id: '4', productId: '4', name: 'Anarkali Suit', sku: 'SKU-004', mode: 'Preloved' as const, price: 3200, isAcceptedOffer: true },
];

export const TryItAgainstBag: React.FC<TryItAgainstBagProps> = ({
  code,
  items,
  archetype,
  result,
  onAddItem,
  onRemoveItem,
  onClearBag,
  onArchetypeChange,
  onEvaluate,
}) => {
  const handleAddPiece = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const piece = mockPieces.find(p => p.id === e.target.value);
    if (piece) {
      onAddItem(piece);
      e.target.value = '';
    }
  };

  const totalMerchandise = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <Card
      header={
        <>
          <span className="card__title">Try It Against a Bag</span>
          <span className="try-bag__header-right">Nothing here is saved — it is a rehearsal</span>
        </>
      }
    >
      <div className="try-bag__intro">
        Build a sample bag from live pieces and watch the twelve checks run. This is the fastest way to catch a scope or minimum mistake before a shopper does.
      </div>

      <div className="try-bag__add">
        <select className="try-bag__select" onChange={handleAddPiece} value="">
          <option value="">Add a live piece to the bag...</option>
          {mockPieces.map(piece => (
            <option key={piece.id} value={piece.id}>
              {piece.name} ({piece.sku}) — {formatMoney(piece.price)} — {piece.mode}
            </option>
          ))}
        </select>
        <Button variant="secondary" size="small" onClick={onClearBag}>
          Clear
        </Button>
      </div>

      <div className="try-bag__chips">
        {items.map((item, index) => (
          <span key={index} className="try-bag__chip">
            {item.name} ({formatMoney(item.price)})
            <button
              className="try-bag__chip-remove"
              onClick={() => onRemoveItem(index)}
            >
              ×
            </button>
          </span>
        ))}
        {items.length === 0 && (
          <span style={{ fontSize: '11px', color: 'var(--promo-muted)' }}>No pieces added yet</span>
        )}
      </div>

      {items.length > 0 && (
        <>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--promo-muted)' }}>Shopper:</span>
            <select
              style={{ padding: '3px 6px', fontSize: '11px', border: '1px solid var(--promo-ib)', borderRadius: 'var(--promo-radius)' }}
              value={archetype}
              onChange={(e) => onArchetypeChange(e.target.value as ShopperArchetype)}
            >
              <option value="first-time">First-time</option>
              <option value="returning">Returning</option>
              <option value="already-used">Already used it</option>
            </select>
            <Button variant="primary" size="small" onClick={onEvaluate}>
              Run Checks
            </Button>
          </div>

          {result && (
            <div className="try-bag__readout">
              <div className={`try-bag__verdict ${result.qualifies ? 'pass' : 'refused'}`}>
                <div className={`try-bag__verdict-label ${result.qualifies ? 'pass' : 'refused'}`}>
                  {result.qualifies ? 'All twelve checks pass' : `Refused at check ${result.refusedCheck}`}
                </div>
                {result.sentence && (
                  <div className="try-bag__verdict-sentence">“{result.sentence}”</div>
                )}
                {result.qualifies && (
                  <div className="try-bag__verdict-summary">
                    Code qualifies — {formatMoney(result.discount)} discount applied
                  </div>
                )}
              </div>

              {result.qualifyingLines.map((line, index) => (
                <div key={index} className={`try-bag__line ${line.qualifies ? 'qualifies' : 'outside'}`}>
                  <span>{line.name}</span>
                  <span>
                    {line.qualifies ? 'qualifies' : 'outside this code'} · {formatMoney(line.share)}
                  </span>
                </div>
              ))}

              <div className="try-bag__total">
                <span>Merchandise</span>
                <span>{formatMoney(totalMerchandise)}</span>
              </div>
              <div className="try-bag__total">
                <span>Discount</span>
                <span style={{ color: 'var(--promo-terra)' }}>-{formatMoney(result.discount)}</span>
              </div>
              <div className="try-bag__total">
                <span>GST</span>
                <span>{formatMoney(result.gst)}</span>
              </div>
              <div className="try-bag__total">
                <span>Delivery</span>
                <span style={{ color: result.deliveryFree ? 'var(--promo-sage)' : 'var(--promo-terra)' }}>
                  {result.deliveryFree ? 'Free — threshold ₹2,999 measured on pre-discount merchandise' : 'Charged'}
                </span>
              </div>
              <div className="try-bag__total" style={{ borderTopWidth: '2px', fontWeight: '700' }}>
                <span>Order total</span>
                <span>{formatMoney(result.orderTotal)}</span>
              </div>
            </div>
          )}
        </>
      )}

      {items.length === 0 && (
        <div className="try-bag__empty">
          Empty bag — add a piece above.
        </div>
      )}
    </Card>
  );
};