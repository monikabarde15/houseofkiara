/* ========================================
   Promotions Module - Discount Rules Card
   All discount fields (with frozen terms handling)
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.8
   ======================================== */

import React, { useState } from 'react';
import './styles/DiscountRulesCard.css';
import { Card, Button, Link, FormField, Switch } from '../../components/UI';
import { ScopePicker } from '../../shared/ScopePicker';
import { StackingPicker } from '../../shared/StackingPicker';
import { PromoCode } from '../../types/promotions.types';
import { formatMoney } from '../../utils/formatter';
import { DISCOUNT_TYPE_OPTIONS, MODE_OPTIONS } from '../../utils/constants';

interface DiscountRulesCardProps {
  code: PromoCode;
  onSave: (data: Partial<PromoCode>) => void;
  onCopy: (data: Partial<PromoCode>) => void;
  redemptions: number;
}

export const DiscountRulesCard: React.FC<DiscountRulesCardProps> = ({
  code,
  onSave,
  onCopy,
  redemptions,
}) => {
  const [formData, setFormData] = useState(code);

  const isFrozen = redemptions > 0;
  const canEdit = !isFrozen;

  const handleSave = () => {
    onSave(formData);
  };

  const handleCopy = () => {
    const changes: Partial<PromoCode> = {};
    if (formData.type !== code.type) changes.type = formData.type;
    if (formData.value !== code.value) changes.value = formData.value;
    if (formData.maxDiscount !== code.maxDiscount) changes.maxDiscount = formData.maxDiscount;
    if (formData.minOrder !== code.minOrder) changes.minOrder = formData.minOrder;
    if (formData.modes.join(',') !== code.modes.join(',')) changes.modes = formData.modes;
    if (JSON.stringify(formData.scope) !== JSON.stringify(code.scope)) changes.scope = formData.scope;
    if (formData.audience !== code.audience) changes.audience = formData.audience;
    if (formData.customerIds.join(',') !== code.customerIds.join(',')) changes.customerIds = formData.customerIds;
    if (formData.firstOrderOnly !== code.firstOrderOnly) changes.firstOrderOnly = formData.firstOrderOnly;
    
    onCopy(changes);
  };

  return (
    <Card
      header={<span className="card__title">Discount Rules</span>}
      footer={
        isFrozen ? (
          <Button variant="primary" size="small" onClick={handleCopy}>
            Create Copy
          </Button>
        ) : (
          <Button variant="primary" size="small" onClick={handleSave}>
            Save
          </Button>
        )
      }
    >
      {isFrozen && (
        <div className="discount-rules__notice">
          <strong>Terms are frozen.</strong> {redemptions} orders carry this code, so the discount type, value, cap, minimum, modes, scope and audience can no longer be rewritten — those orders would stop being explainable. Change one and House of Kaira will offer to copy the code instead. Dates, usage caps, visibility, stacking and the wording stay editable.
        </div>
      )}

      {code.supersededBy && (
        <div className="discount-rules__notice discount-rules__notice--gold">
          Superseded by <Link>{code.supersededBy}</Link>. Retire this one from the Lifecycle card so the two don't compete for the same bag.
        </div>
      )}

      {code.supersedes && (
        <div className="discount-rules__notice discount-rules__notice--neutral">
          This code replaces <Link>{code.supersedes}</Link>, whose terms were frozen by its redemptions.
        </div>
      )}

      <>
          <FormField label="CODE">
            <input
              type="text"
              className="form-field__input"
              value={formData.code}
              disabled
              style={{ fontFamily: 'var(--promo-mono)', color: 'var(--promo-muted)', background: 'var(--promo-canvas)' }}
            />
            <div className="form-field__hint">
              Orders reference the code by name, so it can't be renamed. Retire it and create a new one instead.
            </div>
          </FormField>

          <div className="composer-card__grid-2">
            {/* Discount Type */}
            <FormField label="Discount Type">
              <select
                className="form-field__input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                disabled={!canEdit}
              >
                {DISCOUNT_TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormField>

            {/* Value */}
            <FormField label={`Discount Value (${formData.type === 'percent' ? '%' : '₹'})`}>
              <input
                type="number"
                className="form-field__input"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                disabled={!canEdit}
              />
            </FormField>
          </div>

          {/* Max Discount */}
          {formData.type === 'percent' && (
            <FormField label="Max Discount (₹) · optional cap">
              <input
                type="number"
                className="form-field__input"
                value={formData.maxDiscount || ''}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? Number(e.target.value) : null })}
                disabled={!canEdit}
                placeholder="No cap"
              />
            </FormField>
          )}

          {/* Min Order */}
          <FormField label="Min Order Value (₹)">
            <input
              type="number"
              className="form-field__input"
              value={formData.minOrder || ''}
              onChange={(e) => setFormData({ ...formData, minOrder: e.target.value ? Number(e.target.value) : null })}
              disabled={!canEdit}
              placeholder="No minimum"
            />
            <div className="form-field__hint">
              Merchandise value before GST — the deposit never counts and is never discounted.
            </div>
          </FormField>

          {/* Modes */}
          <FormField label="Applicable Modes">
            <div className="composer-card__modes">
              {MODE_OPTIONS.map(mode => (
                <label key={mode} className="composer-card__mode" style={{ textTransform: 'uppercase', fontWeight: 600, color: 'var(--promo-muted)' }}>
                  <input
                    type="checkbox"
                    checked={formData.modes.includes(mode)}
                    onChange={(e) => {
                      const newModes = e.target.checked
                        ? [...formData.modes, mode]
                        : formData.modes.filter(m => m !== mode);
                      setFormData({ ...formData, modes: newModes });
                    }}
                    disabled={!canEdit}
                  />
                  {mode.toUpperCase()}
                </label>
              ))}
            </div>
            <div className="form-field__hint">
              HOK's share funds the discount: 60% on Rental, 25% on Preloved. Buy New margin depends on the piece's buying terms — check before pointing a deep code at it.
            </div>
          </FormField>

          {/* Scope */}
          <ScopePicker
            scope={formData.scope}
            modes={formData.modes}
            restricted={formData.scope.categories.length > 0 || formData.scope.designerIds.length > 0 || formData.scope.skus.length > 0}
            onScopeChange={(scope) => setFormData({ ...formData, scope })}
            onRestrictedChange={(restricted) => {
              if (!restricted) {
                setFormData({ ...formData, scope: { categories: [], designerIds: [], skus: [] } });
              }
            }}
            livePieces={100}
            disabled={!canEdit}
          />

          {/* Dates */}
          <div className="composer-card__grid-2">
            <FormField label="Valid From">
              <input
                type="date"
                className="form-field__input"
                value={formData.validFrom || ''}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value || null })}
              />
              <div className="form-field__hint">Empty = no expiry — runs until paused.</div>
            </FormField>
            <FormField label="Valid Until">
              <input
                type="date"
                className="form-field__input"
                value={formData.validUntil || ''}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value || null })}
              />
            </FormField>
          </div>

          {/* Usage Caps */}
          <div className="composer-card__grid-3">
            <FormField label="Max Uses (total)">
              <input
                type="number"
                className="form-field__input"
                value={formData.usesTotalCap || ''}
                onChange={(e) => setFormData({ ...formData, usesTotalCap: e.target.value ? Number(e.target.value) : null })}
                placeholder="No limit"
              />
            </FormField>
            <FormField label="Max Uses (per customer)">
              <input
                type="number"
                className="form-field__input"
                value={formData.usesPerCustomer || ''}
                onChange={(e) => setFormData({ ...formData, usesPerCustomer: e.target.value ? Number(e.target.value) : null })}
                placeholder="No limit"
              />
            </FormField>
            <div className="composer-card__switch-group">
              <FormField label="First Order Only">
                <Switch
                  checked={formData.firstOrderOnly}
                  onChange={(checked) => setFormData({ ...formData, firstOrderOnly: checked })}
                  label={formData.firstOrderOnly ? 'First order only' : 'Any order'}
                />
              </FormField>
            </div>
          </div>

          {/* Stacking */}
          <FormField label="Stacking">
            <StackingPicker
              stacked={formData.stacksWith.length > 0}
              partners={formData.stacksWith}
              availableCodes={[]}
              onStackingChange={(stacked) => {
                if (!stacked) {
                  setFormData({ ...formData, stacksWith: [] });
                }
              }}
              onPartnersChange={(partners) => setFormData({ ...formData, stacksWith: partners })}
              platformStacking="single"
            />
          </FormField>

          {/* Visibility */}
          <FormField label="Where It Appears">
            <Switch
              checked={formData.visibility === 'drawer' && formData.audience === 'public'}
              onChange={(checked) => {
                if (formData.audience === 'public') {
                  setFormData({ ...formData, visibility: checked ? 'drawer' : 'share' });
                }
              }}
              disabled={formData.audience === 'private'}
              label={formData.audience === 'private' 
                ? 'Private codes are always share-only' 
                : formData.visibility === 'drawer' ? 'Listed in the cart drawer' : 'Share only'
              }
            />
          </FormField>
        </>
    </Card>
  );
};