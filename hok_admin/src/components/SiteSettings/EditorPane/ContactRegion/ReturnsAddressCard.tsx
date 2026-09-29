import React from 'react';
import './ContactRegion.css';
import { ReturnsAddress } from '../../types/siteSettings.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';

interface ReturnsAddressCardProps {
  address: ReturnsAddress;
  onChange: (updated: ReturnsAddress) => void;
}

export const INDIAN_STATES_UT = [
  'Select a state',
  'Andaman & Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export const ReturnsAddressCard: React.FC<ReturnsAddressCardProps> = ({ address, onChange }) => {
  const handleChange = (field: keyof ReturnsAddress, val: string) => {
    onChange({ ...address, [field]: val });
  };

  // Assembled Line logic (Spec 10.6 & 21)
  const buildAssembledAddress = () => {
    const parts: string[] = [];
    if (address.addressedTo.trim()) parts.push(address.addressedTo.trim());
    if (address.addressLine1.trim()) parts.push(address.addressLine1.trim());
    if (address.addressLine2.trim()) parts.push(address.addressLine2.trim());
    if (address.landmark.trim()) parts.push(address.landmark.trim());
    if (address.city.trim()) parts.push(address.city.trim());

    // State and PIN joined by a space (Spec 10.6)
    const statePin = [address.state !== 'Select a state' ? address.state : '', address.pinCode.trim()]
      .filter(Boolean)
      .join(' ');
    if (statePin) parts.push(statePin);

    if (address.contactNumber.trim()) parts.push(address.contactNumber.trim());

    return parts.join(', ');
  };

  // Missing parts check (Spec 10.6 & 21)
  const missingParts: string[] = [];
  if (!address.addressedTo.trim()) missingParts.push('a recipient');
  if (!address.addressLine1.trim()) missingParts.push('address line 1');
  if (!address.city.trim()) missingParts.push('a city');
  if (!address.state.trim() || address.state === 'Select a state') missingParts.push('a state');
  if (!address.pinCode.trim()) missingParts.push('a PIN code');
  if (!address.contactNumber.trim()) missingParts.push('a contact number');

  const isPinInvalid = address.pinCode.trim().length > 0 && address.pinCode.trim().length !== 6;

  const assembledString = buildAssembledAddress();

  return (
    <Card
      title="Returns address"
      subtitle="Where a customer sends a piece back, and where the courier collects from. Distinct from the registered address on Legal, which is for invoices."
      id="contact-returns-address"
    >
      {/* Addressed To */}
      <Field
        label="Addressed to"
        hints="Who the courier hands it to. Not a person’s name — a desk, so it survives someone leaving."
      >
        <input
          type="text"
          className="hok-field-input"
          value={address.addressedTo}
          onChange={(e) => handleChange('addressedTo', e.target.value)}
        />
      </Field>

      {/* Address Line 1 */}
      <Field label="Address line 1">
        <input
          type="text"
          className="hok-field-input"
          value={address.addressLine1}
          onChange={(e) => handleChange('addressLine1', e.target.value)}
        />
      </Field>

      {/* Address Line 2 */}
      <Field
        label="Address line 2"
        hints="Building, floor or unit. Leave blank if there is nothing to add."
      >
        <input
          type="text"
          className="hok-field-input"
          value={address.addressLine2}
          onChange={(e) => handleChange('addressLine2', e.target.value)}
        />
      </Field>

      {/* Landmark */}
      <Field
        label="Landmark"
        hints="Optional, but Indian couriers use it more than the address itself."
      >
        <input
          type="text"
          className="hok-field-input"
          value={address.landmark}
          onChange={(e) => handleChange('landmark', e.target.value)}
        />
      </Field>

      {/* City & State (Two-column) */}
      <div className="hok-two-column-group">
        <Field label="City">
          <input
            type="text"
            className="hok-field-input"
            value={address.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />
        </Field>

        <Field
          label="State"
          hints="Chosen, never typed — it also determines place of supply for GST."
        >
          <select
            className="hok-field-select"
            value={address.state}
            onChange={(e) => handleChange('state', e.target.value)}
          >
            {INDIAN_STATES_UT.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* PIN Code & Contact Number (Two-column) */}
      <div className="hok-two-column-group">
        <div id="contact-returns-pin">
          <Field
            label="PIN code"
            hints={['Maximum 6 characters.', 'Six digits.']}
            warningHint={isPinInvalid ? 'The returns PIN code is not six digits.' : undefined}
          >
            <input
              type="text"
              maxLength={6}
              className="hok-field-input"
              value={address.pinCode}
              onChange={(e) =>
                handleChange('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))
              }
            />
          </Field>
        </div>

        <Field
          label="Contact number"
          hints="Couriers will not accept a pickup without one."
        >
          <input
            type="text"
            className="hok-field-input"
            value={address.contactNumber}
            onChange={(e) => handleChange('contactNumber', e.target.value)}
          />
        </Field>
      </div>

      {/* Assembled Line Block (Spec 10.6) */}
      <div className="hok-assembled-address-box">
        <div className="hok-assembled-heading">How it prints on a label</div>
        <div className={`hok-assembled-line ${!assembledString ? 'is-empty' : ''}`}>
          {assembledString || 'nothing to print yet'}
        </div>
        {missingParts.length > 0 && (
          <div className="hok-assembled-warning">
            The returns address is missing {missingParts.join(', ')}. Couriers reject a pickup without a complete address.
          </div>
        )}
      </div>
    </Card>
  );
};
