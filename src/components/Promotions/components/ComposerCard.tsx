/* ========================================
   Promotions Module - Composer Card
   Create code form (field-heavy, consolidated)
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5.6
   ======================================== */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import './styles/ComposerCard.css';
import { Card, Button, Link, FormField, Switch } from './UI';
import { ScopePicker } from '../shared/ScopePicker';
import { StackingPicker } from '../shared/StackingPicker';
import { CustomerPicker } from '../shared/CustomerPicker';
import { PromoCode, PromoMode } from '../types/promotions.types';
import {
  DISCOUNT_TYPE_OPTIONS,
  MODE_OPTIONS,
  AUDIENCE_OPTIONS,
  VISIBILITY_LABELS,
  STACKING_LABELS,
  FIRST_ORDER_LABELS,
} from '../utils/constants';
import { formatMoney } from '../utils/formatter';
import { validatePromoCode } from '../utils/validators';

interface ComposerCardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Partial<PromoCode>) => Promise<PromoCode | null>;
  existingCodes: string[];
  loading: boolean;
}

const defaultScope = { categories: [], designerIds: [], skus: [] };

export const ComposerCard: React.FC<ComposerCardProps> = ({
  isOpen,
  onClose,
  onCreate,
  existingCodes,
  loading,
}) => {
  const [formData, setFormData] = useState({
    code: '',
    reason: '',
    publicDesc: '',
    notes: '',
    type: 'percent' as 'percent' | 'flat' | 'freedel',
    value: '',
    maxDiscount: '',
    minOrder: '',
    modes: ['Rental', 'Preloved'] as PromoMode[],
    scopeRestricted: false,
    scope: defaultScope,
    validFrom: '',
    validUntil: '',
    usesTotalCap: '',
    usesPerCustomer: '',
    firstOrderOnly: false,
    stacking: false,
    partners: [] as string[],
    visibility: 'share' as 'share' | 'drawer',
    audience: 'public' as 'public' | 'private',
    customerIds: [] as string[],
  });

  const [errors, setErrors] = useState<{ field: string; message: string }[]>([]);
  const [saved, setSaved] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && codeInputRef.current) {
      setTimeout(() => codeInputRef.current?.focus(), 100);
    }
    if (isOpen) {
      // Reset form when opening
      setFormData({
        code: '',
        reason: '',
        publicDesc: '',
        notes: '',
        type: 'percent',
        value: '',
        maxDiscount: '',
        minOrder: '',
        modes: ['Rental', 'Preloved'],
        scopeRestricted: false,
        scope: defaultScope,
        validFrom: '',
        validUntil: '',
        usesTotalCap: '',
        usesPerCustomer: '',
        firstOrderOnly: false,
        stacking: false,
        partners: [],
        visibility: 'share',
        audience: 'public',
        customerIds: [],
      });
      setErrors([]);
      setSaved(false);
    }
  }, [isOpen]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
    // Clear error for this field
    setErrors(prev => prev.filter(e => e.field !== field));
  };

  const handleSubmit = async () => {
    // Validate
    const validationErrors = validatePromoCode(
      formData.code,
      formData.reason,
      formData.type,
      formData.value ? Number(formData.value) : null,
      formData.maxDiscount ? Number(formData.maxDiscount) : null,
      formData.minOrder ? Number(formData.minOrder) : null,
      formData.modes,
      formData.scopeRestricted,
      formData.scope.categories,
      formData.scope.designerIds,
      formData.scope.skus,
      formData.validFrom || null,
      formData.validUntil || null,
      formData.usesTotalCap ? Number(formData.usesTotalCap) : null,
      formData.usesPerCustomer ? Number(formData.usesPerCustomer) : null,
      formData.audience,
      formData.customerIds,
      existingCodes,
    );

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare data
    const data: Partial<PromoCode> = {
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: Number(formData.value),
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      minOrder: formData.minOrder ? Number(formData.minOrder) : null,
      modes: formData.modes,
      scope: formData.scopeRestricted ? formData.scope : defaultScope,
      stacksWith: formData.partners,
      audience: formData.audience,
      customerIds: formData.customerIds,
      firstOrderOnly: formData.firstOrderOnly,
      usesTotalCap: formData.usesTotalCap ? Number(formData.usesTotalCap) : null,
      usesPerCustomer: formData.usesPerCustomer ? Number(formData.usesPerCustomer) : null,
      validFrom: formData.validFrom || null,
      validUntil: formData.validUntil || null,
      visibility: formData.audience === 'private' ? 'share' : formData.visibility,
      publicDesc: formData.publicDesc,
      reason: formData.reason,
      notes: formData.notes,
    };

    const result = await onCreate(data);
    if (result) {
      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleGenerateCode = () => {
    // Generate a random code like KAIRA-XXXX
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let generated = 'KAIRA-';
    for (let i = 0; i < 4; i++) {
      generated += chars[Math.floor(Math.random() * chars.length)];
    }
    // Check if already exists
    if (existingCodes.includes(generated)) {
      // Try again (in production, would retry)
    }
    handleFieldChange('code', generated);
  };

  const discountType = formData.type;
  const showValue = discountType !== 'freedel';
  const showCap = discountType === 'percent';
  const isPrivate = formData.audience === 'private';
  const visibilityForcedOff = isPrivate;

  if (!isOpen) return null;

  return (
    <Card
      className="composer-card"
      header={
        <>
          <span className="card__title">Create Promo Code</span>
          <Link onClick={onClose}>Close</Link>
        </>
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="primary" size="small" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Code'}
            {saved && <span className="button__saved"> ✓</span>}
          </Button>
        </div>
      }
    >
      {/* Row 1: Code (left) + Reason (right) */}
      <div className="composer-card__grid-2">
        <FormField label="PROMO CODE *">
          <div className="composer-card__code-row">
            <input
              ref={codeInputRef}
              type="text"
              className="form-field__input"
              value={formData.code}
              onChange={(e) => handleFieldChange('code', e.target.value.toUpperCase())}
              placeholder="e.g. SANGEET15"
              disabled={loading}
            />
            <Button variant="secondary" size="small" onClick={handleGenerateCode} type="button">
              Generate
            </Button>
          </div>
          <div className="form-field__hint">Letters, numbers and dashes. Locked once created — orders reference the code by name.</div>
          {errors.find(e => e.field === 'code') && (
            <div className="form-field__error">{errors.find(e => e.field === 'code')?.message}</div>
          )}
        </FormField>

        <FormField label="REASON / OCCASION · internal *">
          <input
            type="text"
            className="form-field__input"
            value={formData.reason}
            onChange={(e) => handleFieldChange('reason', e.target.value)}
            placeholder="Why this code exists — e.g. Instagram festive push, apology for late dispatch"
            disabled={loading}
          />
          <div className="form-field__hint">This is the audit answer to "why did we give money away?" — it shows on the code's ledger and is never seen by a shopper.</div>
          {errors.find(e => e.field === 'reason') && (
            <div className="form-field__error">{errors.find(e => e.field === 'reason')?.message}</div>
          )}
        </FormField>
      </div>

      {/* Row 2: Public Description (left) + Internal Notes (right) */}
      <div className="composer-card__grid-2">
        <FormField label="PUBLIC DESCRIPTION · the shopper reads this">
          <input
            type="text"
            className="form-field__input"
            value={formData.publicDesc}
            onChange={(e) => handleFieldChange('publicDesc', e.target.value)}
            placeholder="e.g. 10% off your order"
            maxLength={60}
            disabled={loading}
          />
          <div className="form-field__hint">The line shown beside the code in the cart's offers drawer. Leave it blank and the cart falls back to the plain offer ("10% off, up to ₹1,500") — correct, just less warm. Never write the internal reason here.</div>
        </FormField>

        <FormField label="INTERNAL NOTES">
          <textarea
            className="form-field__input form-field__input--textarea"
            value={formData.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            placeholder="Anything ops should know — where it was announced, who asked for it..."
            rows={3}
            disabled={loading}
          />
          <div className="form-field__hint">Recorded at birth, so the context isn't lost between creating the code and remembering why.</div>
        </FormField>
      </div>

      {/* Row 3: Discount Type, Value, Cap */}
      <div className="composer-card__grid-3">
        <FormField label="DISCOUNT TYPE">
          <select
            className="form-field__input"
            value={formData.type}
            onChange={(e) => handleFieldChange('type', e.target.value)}
            disabled={loading}
          >
            {DISCOUNT_TYPE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.find(e => e.field === 'type') && (
            <div className="form-field__error">{errors.find(e => e.field === 'type')?.message}</div>
          )}
        </FormField>

        {showValue && (
          <FormField label={`DISCOUNT VALUE (${formData.type === 'percent' ? '%' : '₹'})`}>
            <input
              type="number"
              className="form-field__input"
              value={formData.value}
              onChange={(e) => handleFieldChange('value', e.target.value)}
              placeholder={formData.type === 'percent' ? '10' : '500'}
              disabled={loading}
            />
            {errors.find(e => e.field === 'value') && (
              <div className="form-field__error">{errors.find(e => e.field === 'value')?.message}</div>
            )}
          </FormField>
        )}

        {showCap && (
          <FormField label="MAX DISCOUNT (₹) · optional cap">
            <input
              type="number"
              className="form-field__input"
              value={formData.maxDiscount}
              onChange={(e) => handleFieldChange('maxDiscount', e.target.value)}
              placeholder="e.g. 1500"
              disabled={loading}
            />
            {errors.find(e => e.field === 'maxDiscount') && (
              <div className="form-field__error">{errors.find(e => e.field === 'maxDiscount')?.message}</div>
            )}
          </FormField>
        )}
      </div>

      {/* Row 4: Min Order & Modes */}
      <div className="composer-card__grid-2">
        <FormField label="MIN ORDER VALUE (₹)">
          <input
            type="number"
            className="form-field__input"
            value={formData.minOrder}
            onChange={(e) => handleFieldChange('minOrder', e.target.value)}
            placeholder="0 = no minimum"
            disabled={loading}
          />
          <div className="form-field__hint">Measured on merchandise value before GST. The security deposit never counts toward it and is never discounted — it's refundable, not revenue.</div>
          {errors.find(e => e.field === 'minOrder') && (
            <div className="form-field__error">{errors.find(e => e.field === 'minOrder')?.message}</div>
          )}
        </FormField>

        <FormField label="APPLICABLE MODES">
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
                    handleFieldChange('modes', newModes);
                  }}
                  disabled={loading}
                />
                {mode.toUpperCase()}
              </label>
            ))}
          </div>
          <div className="form-field__hint">Free delivery note: orders of ₹2,999+ already ship free platform-wide, so that type mostly matters on small accessories.</div>
          {errors.find(e => e.field === 'modes') && (
            <div className="form-field__error">{errors.find(e => e.field === 'modes')?.message}</div>
          )}
        </FormField>
      </div>

      {/* Product Scope */}
      <ScopePicker
        scope={formData.scope}
        modes={formData.modes}
        restricted={formData.scopeRestricted}
        onScopeChange={(scope) => handleFieldChange('scope', scope)}
        onRestrictedChange={(restricted) => handleFieldChange('scopeRestricted', restricted)}
        livePieces={100}
        disabled={loading}
      />
      {errors.find(e => e.field === 'scope') && (
        <div className="form-field__error">{errors.find(e => e.field === 'scope')?.message}</div>
      )}

      {/* Notice Banner under Product Scope */}
      {formData.type === 'percent' && (
        <div className="composer-card__preloved-notice">
          A {formData.value || '10'}% discount consumes about {Math.round((Number(formData.value || 10) / 25) * 100)}% of HOK's 25% share on Preloved orders.
        </div>
      )}

      {/* Row 5: Valid From / Until */}
      <div className="composer-card__grid-2">
        <FormField label="VALID FROM">
          <input
            type="date"
            className="form-field__input"
            value={formData.validFrom}
            onChange={(e) => handleFieldChange('validFrom', e.target.value)}
            disabled={loading}
          />
          {errors.find(e => e.field === 'validFrom') && (
            <div className="form-field__error">{errors.find(e => e.field === 'validFrom')?.message}</div>
          )}
        </FormField>

        <FormField label="VALID UNTIL">
          <input
            type="date"
            className="form-field__input"
            value={formData.validUntil}
            onChange={(e) => handleFieldChange('validUntil', e.target.value)}
            disabled={loading}
          />
          <div className="form-field__hint">Leave empty for no expiry — the code runs until paused.</div>
          {errors.find(e => e.field === 'validUntil') && (
            <div className="form-field__error">{errors.find(e => e.field === 'validUntil')?.message}</div>
          )}
        </FormField>
      </div>

      {/* Row 6: Max Uses */}
      <div className="composer-card__grid-3">
        <FormField label="MAX USES (TOTAL)">
          <input
            type="number"
            className="form-field__input"
            value={formData.usesTotalCap}
            onChange={(e) => handleFieldChange('usesTotalCap', e.target.value)}
            placeholder="Empty = unlimited"
            disabled={loading}
          />
          {errors.find(e => e.field === 'usesTotalCap') && (
            <div className="form-field__error">{errors.find(e => e.field === 'usesTotalCap')?.message}</div>
          )}
        </FormField>

        <FormField label="MAX USES (PER CUSTOMER)">
          <input
            type="number"
            className="form-field__input"
            value={formData.usesPerCustomer}
            onChange={(e) => handleFieldChange('usesPerCustomer', e.target.value)}
            placeholder="1"
            disabled={loading}
          />
          {errors.find(e => e.field === 'usesPerCustomer') && (
            <div className="form-field__error">{errors.find(e => e.field === 'usesPerCustomer')?.message}</div>
          )}
        </FormField>

        <div className="composer-card__switch-group">
          <FormField label="FIRST ORDER ONLY">
            <Switch
              checked={formData.firstOrderOnly}
              onChange={(checked) => handleFieldChange('firstOrderOnly', checked)}
              disabled={loading}
              label={formData.firstOrderOnly ? FIRST_ORDER_LABELS.on : FIRST_ORDER_LABELS.off}
            />
            <div className="form-field__hint">On = the code only applies to a customer's very first order with House of Kaira.</div>
          </FormField>
        </div>
      </div>

      {/* Stacking */}
      <div className="composer-card__field-row">
        <FormField label="STACKING">
          <StackingPicker
            stacked={formData.stacking}
            partners={formData.partners}
            availableCodes={existingCodes.map(c => ({ code: c, offer: c }))}
            onStackingChange={(stacked) => handleFieldChange('stacking', stacked)}
            onPartnersChange={(partners) => handleFieldChange('partners', partners)}
            platformStacking="single"
            disabled={loading}
          />
        </FormField>
      </div>

      {/* Visibility */}
      <div className="composer-card__field-row">
        <FormField label="WHERE IT APPEARS">
          <Switch
            checked={formData.visibility === 'drawer' && !visibilityForcedOff}
            onChange={(checked) => {
              if (!visibilityForcedOff) {
                handleFieldChange('visibility', checked ? 'drawer' : 'share');
              }
            }}
            disabled={loading || visibilityForcedOff}
            label={visibilityForcedOff ? VISIBILITY_LABELS.private : (formData.visibility === 'drawer' ? VISIBILITY_LABELS.on : VISIBILITY_LABELS.off)}
          />
          <div className="form-field__hint">
            {visibilityForcedOff 
              ? 'Private codes are always share-only — listing one would show every shopper a door that opens for a few accounts.'
              : formData.visibility === 'drawer'
                ? 'Listed in the cart\'s offers drawer for shoppers whose bag actually qualifies — the only place on the site that can display a code today.'
                : 'The code exists but is never displayed — it travels by WhatsApp, Instagram and word of mouth. Nothing on the site gives it away.'
            }
          </div>
        </FormField>
      </div>

      {/* Audience */}
      <div className="composer-card__field-row">
        <FormField label="AUDIENCE">
          <div className="composer-card__audience-radios">
            {AUDIENCE_OPTIONS.map(opt => {
              const labelText = opt.label.toUpperCase();
              const [boldPart, ...rest] = labelText.split(' — ');
              return (
                <label key={opt.value} className="composer-card__audience-radio">
                  <input
                    type="radio"
                    name="audience"
                    value={opt.value}
                    checked={formData.audience === opt.value}
                    onChange={() => {
                      handleFieldChange('audience', opt.value);
                      if (opt.value === 'public') {
                        handleFieldChange('customerIds', []);
                      }
                    }}
                    disabled={loading}
                  />
                  <span>
                    <strong>{boldPart}</strong> — {rest.join(' — ')}
                  </span>
                </label>
              );
            })}
          </div>
          <div className="form-field__hint">The code is validated against the signed-in account at checkout — anyone else entering it sees "This code is linked to a different account."</div>
          {errors.find(e => e.field === 'customerIds') && (
            <div className="form-field__error">{errors.find(e => e.field === 'customerIds')?.message}</div>
          )}
        </FormField>
      </div>

      {/* Customer Picker (private only) */}
      {isPrivate && (
        <div className="composer-card__field-row composer-card__customer-picker">
          <CustomerPicker
            customers={formData.customerIds}
            onCustomersChange={(customers) => handleFieldChange('customerIds', customers)}
            disabled={loading}
          />
        </div>
      )}
    </Card>
  );
};