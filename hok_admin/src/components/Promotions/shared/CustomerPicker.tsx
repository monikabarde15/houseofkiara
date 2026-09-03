/* ========================================
   Promotions Module - Customer Picker
   Customer search + assigned chips
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5.8
   ======================================== */

import React, { useState, useCallback } from 'react';
import './styles/CustomerPicker.css';

interface CustomerPickerProps {
  customers: string[];
  onCustomersChange: (customers: string[]) => void;
  disabled?: boolean;
}

// Mock customer data
const mockCustomers = [
  { id: 'cust_001', name: 'Priya Sharma', email: 'priya@example.com' },
  { id: 'cust_002', name: 'Amit Patel', email: 'amit@example.com' },
  { id: 'cust_003', name: 'Neha Singh', email: 'neha@example.com' },
  { id: 'cust_004', name: 'Rahul Verma', email: 'rahul@example.com' },
];

export const CustomerPicker: React.FC<CustomerPickerProps> = ({
  customers,
  onCustomersChange,
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addCustomer = useCallback((customerId: string) => {
    if (!customers.includes(customerId)) {
      onCustomersChange([...customers, customerId]);
    }
    setSearchTerm('');
    setShowSuggestions(false);
  }, [customers, onCustomersChange]);

  const removeCustomer = useCallback((customerId: string) => {
    onCustomersChange(customers.filter(id => id !== customerId));
  }, [customers, onCustomersChange]);

  const suggestions = searchTerm.length > 0
    ? mockCustomers.filter(c =>
        (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockCustomers;

  const assignedCustomers = mockCustomers.filter(c => customers.includes(c.id));

  return (
    <div className="customer-picker">
      <div className="customer-picker__search-wrapper">
        <input
          type="text"
          className="customer-picker__search"
          placeholder="Search for a customer by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          disabled={disabled}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="customer-picker__suggestions">
            {suggestions.map(customer => {
              const isAssigned = customers.includes(customer.id);
              return (
                <div
                  key={customer.id}
                  className={`customer-picker__suggestion ${isAssigned ? 'assigned' : ''}`}
                  onClick={() => !isAssigned && addCustomer(customer.id)}
                >
                  <span className="customer-picker__suggestion-name">{customer.name}</span>
                  <span className="customer-picker__suggestion-email">{customer.email}</span>
                  {isAssigned && <span className="customer-picker__suggestion-badge">Assigned</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {assignedCustomers.length > 0 && (
        <div className="customer-picker__chips">
          {assignedCustomers.map(customer => (
            <span key={customer.id} className="customer-picker__chip">
              <span className="customer-picker__chip-name">{customer.name}</span>
              <span className="customer-picker__chip-email">{customer.email}</span>
              <button
                className="customer-picker__chip-remove"
                onClick={() => removeCustomer(customer.id)}
                disabled={disabled}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {customers.length === 0 && (
        <div className="customer-picker__empty">No customers assigned yet — search above to add.</div>
      )}

      <div className="customer-picker__hint">
        Private codes are validated against the signed-in account at checkout — anyone else entering the code sees "This code is linked to a different account." Assignments save immediately.
      </div>
    </div>
  );
};