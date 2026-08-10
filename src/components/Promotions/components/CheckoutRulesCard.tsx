/* ========================================
   Promotions Module - Checkout Rules Card
   Platform rules: stacking, caps, free delivery threshold
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5.3
   ======================================== */

import React, { useState } from 'react';
import './styles/CheckoutRulesCard.css';
import { Card, StatusBadge, Button, Switch, FormField, Link } from './UI';
import { CheckoutRules } from '../types/promotions.types';
import { formatMoney } from '../utils/formatter';

interface CheckoutRulesCardProps {
  rules: CheckoutRules;
  linkedPairs: { codeA: string; codeB: string }[];
  onSave: (rules: Partial<CheckoutRules>) => void;
  loading: boolean;
}

export const CheckoutRulesCard: React.FC<CheckoutRulesCardProps> = ({
  rules,
  linkedPairs,
  onSave,
  loading,
}) => {
  const [editing, setEditing] = useState(false);
  const [localRules, setLocalRules] = useState(rules);

  const getStatusChip = () => {
    if (rules.stacking === 'single') return 'One code per order';
    let chip = 'Stacking on';
    if (rules.maxCombinedFlat && rules.maxCombinedPct) {
      chip += ` · cap ${formatMoney(rules.maxCombinedFlat)} / cap ${rules.maxCombinedPct}%`;
    } else if (rules.maxCombinedFlat) {
      chip += ` · cap ${formatMoney(rules.maxCombinedFlat)}`;
    } else if (rules.maxCombinedPct) {
      chip += ` · cap ${rules.maxCombinedPct}%`;
    } else {
      chip += ' · no cap';
    }
    return chip;
  };

  const handleSave = () => {
    onSave(localRules);
    setEditing(false);
  };

  const handleCancel = () => {
    setLocalRules(rules);
    setEditing(false);
  };

  return (
    <Card
      header={
        <>
          <span className="card__title">Checkout Rules</span>
          <div className="card__header-actions">
            <StatusBadge status={getStatusChip()} />
            {!editing && (
              <Link onClick={() => setEditing(true)}>Edit</Link>
            )}
          </div>
        </>
      }
      footer={
        editing ? (
          <>
            <Button variant="secondary" size="small" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="small" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Policy'}
            </Button>
          </>
        ) : null
      }
    >
      {editing && (
        <>
          {/* Cart Stacking */}
          <div className="checkout-rules__section">
            <div className="checkout-rules__section-label">Cart stacking</div>
            
            <label className="checkout-rules__radio">
              <input
                type="radio"
                name="stacking"
                value="single"
                checked={localRules.stacking === 'single'}
                onChange={() => setLocalRules({ ...localRules, stacking: 'single' })}
              />
              <span>
                <strong>One code per order</strong> — entering a second code asks the shopper to swap. The simplest rule, and the safest margin.
              </span>
            </label>

            <label className="checkout-rules__radio">
              <input
                type="radio"
                name="stacking"
                value="stackable"
                checked={localRules.stacking === 'stackable'}
                onChange={() => setLocalRules({ ...localRules, stacking: 'stackable' })}
              />
              <span>
                <strong>Allow stacking</strong> — codes that are linked to each other may apply together. A code with no links still rides alone.
              </span>
            </label>

            <div className="checkout-rules__grid">
              <FormField label="Max Combined Discount (₹)">
                <input
                  type="number"
                  className="form-field__input"
                  value={localRules.maxCombinedFlat || ''}
                  onChange={(e) => setLocalRules({
                    ...localRules,
                    maxCombinedFlat: e.target.value ? Number(e.target.value) : null,
                  })}
                  placeholder="No cap"
                />
              </FormField>
              <FormField label="Max Combined Discount (% of merchandise)">
                <input
                  type="number"
                  className="form-field__input"
                  value={localRules.maxCombinedPct || ''}
                  onChange={(e) => setLocalRules({
                    ...localRules,
                    maxCombinedPct: e.target.value ? Number(e.target.value) : null,
                  })}
                  placeholder="25%"
                />
                <div className="form-field__hint">Caps bite only when stacking is on; if both are set, the tighter one wins.</div>
              </FormField>
            </div>
          </div>

          {/* Divider */}
          <div className="checkout-rules__divider" />

          {/* Linked Pairs */}
          <div className="checkout-rules__section">
            <div className="checkout-rules__section-label">Linked Pairs</div>
            {linkedPairs.length === 0 ? (
              <div className="checkout-rules__empty">
                No codes are linked yet — every code currently rides alone. Link them from a code's Rules tab.
              </div>
            ) : (
              <div className="checkout-rules__pairs">
                {linkedPairs.map(pair => (
                  <span key={`${pair.codeA}-${pair.codeB}`} className="checkout-rules__pair">
                    <Link>{pair.codeA}</Link>
                    <span className="checkout-rules__pair-arrow">↔</span>
                    <Link>{pair.codeB}</Link>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="checkout-rules__divider" />

          {/* Free Delivery */}
          <div className="checkout-rules__section">
            <div className="checkout-rules__section-label">Free delivery</div>
            
            <div className="checkout-rules__grid">
              <FormField label="Free Delivery Above (₹)">
                <input
                  type="number"
                  className="form-field__input"
                  value={localRules.freeShipThreshold || ''}
                  onChange={(e) => setLocalRules({
                    ...localRules,
                    freeShipThreshold: e.target.value ? Number(e.target.value) : null,
                  })}
                  placeholder="2999"
                />
              </FormField>
              <div>
                <div className="checkout-rules__radio-group-label">Threshold Measured On</div>
                <label className="checkout-rules__radio checkout-rules__radio--inline">
                  <input
                    type="radio"
                    name="basis"
                    value="pre"
                    checked={localRules.freeShipBasis === 'pre'}
                    onChange={() => setLocalRules({ ...localRules, freeShipBasis: 'pre' })}
                  />
                  <span>Merchandise before discount</span>
                </label>
                <label className="checkout-rules__radio checkout-rules__radio--inline">
                  <input
                    type="radio"
                    name="basis"
                    value="post"
                    checked={localRules.freeShipBasis === 'post'}
                    onChange={() => setLocalRules({ ...localRules, freeShipBasis: 'post' })}
                  />
                  <span>Merchandise after discount</span>
                </label>
              </div>
            </div>
            <div className="form-field__hint">
              Measuring before the discount means a code never quietly costs the shopper their free delivery — the kinder default, and the one fewer support message. Deposits never count toward the threshold, and a free-delivery code makes delivery free whatever the basket totals.
            </div>
          </div>
        </>
      )}
    </Card>
      );
    };