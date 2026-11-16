/* ========================================
   Promotions Module - Customer Picker
   Customer search + assigned chips
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5.8
   ======================================== */

import React, { useState, useCallback, useEffect } from "react";
import "./styles/CustomerPicker.css";

interface CustomerPickerProps {
  customers: string[];
  onCustomersChange: (customers: string[]) => void;
  disabled?: boolean;
}

interface RegisteredCustomer {
  id: string;
  name: string;
  email: string;
}

export const CustomerPicker: React.FC<CustomerPickerProps> = ({
  customers,
  onCustomersChange,
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [registeredCustomers, setRegisteredCustomers] = useState<
    RegisteredCustomer[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch("/api/customers")
      .then((res) => res.json())
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];
        const normalized: RegisteredCustomer[] = list
          .map((c: any) => ({
            id: String(c.customerId || c.id || c._id || ""),
            name: String(c.name || c.fullName || c.email || "Customer"),
            email: String(c.email || "").trim(),
          }))
          .filter((c: RegisteredCustomer) => Boolean(c.email || c.id));
        setRegisteredCustomers(normalized);
      })
      .catch(() => {
        if (active) setRegisteredCustomers([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const getCustomerKey = (c: RegisteredCustomer) =>
    (c.email || c.id).toLowerCase().trim();

  const isCustomerAssigned = useCallback(
    (c: RegisteredCustomer) => {
      const emailLower = c.email.toLowerCase().trim();
      const idLower = c.id.toLowerCase().trim();
      return customers.some((assigned) => {
        const a = String(assigned).toLowerCase().trim();
        return (emailLower && a === emailLower) || (idLower && a === idLower);
      });
    },
    [customers],
  );

  const addCustomer = useCallback(
    (customer: RegisteredCustomer) => {
      const key = getCustomerKey(customer);
      if (!isCustomerAssigned(customer)) {
        onCustomersChange([...customers, key]);
      }
      setSearchTerm("");
      setShowSuggestions(false);
    },
    [customers, isCustomerAssigned, onCustomersChange],
  );

  const removeCustomer = useCallback(
    (valueToRemove: string) => {
      const target = valueToRemove.toLowerCase().trim();
      onCustomersChange(
        customers.filter((val) => String(val).toLowerCase().trim() !== target),
      );
    },
    [customers, onCustomersChange],
  );

  const suggestions =
    searchTerm.trim().length > 0
      ? registeredCustomers.filter(
          (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase().trim()),
        )
      : registeredCustomers;

  const assignedCustomers = customers.map((val) => {
    const v = String(val).toLowerCase().trim();
    const matched = registeredCustomers.find(
      (c) =>
        c.email.toLowerCase().trim() === v || c.id.toLowerCase().trim() === v,
    );
    return (
      matched || {
        id: val,
        name: val,
        email: val.includes("@") ? val : "",
      }
    );
  });

  return (
    <div className="customer-picker">
      <div className="customer-picker__search-wrapper">
        <input
          type="text"
          autoComplete="off"
          className="customer-picker__search"
          placeholder={
            loading
              ? "Loading registered customers..."
              : "Search for a customer by name or email..."
          }
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
            {suggestions.map((customer) => {
              const isAssigned = isCustomerAssigned(customer);
              return (
                <div
                  key={customer.id || customer.email}
                  className={`customer-picker__suggestion ${isAssigned ? "assigned" : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (!isAssigned) addCustomer(customer);
                  }}
                >
                  <span className="customer-picker__suggestion-name">
                    {customer.name}
                  </span>
                  <span className="customer-picker__suggestion-email">
                    {customer.email}
                  </span>
                  {isAssigned && (
                    <span className="customer-picker__suggestion-badge">
                      Assigned
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {showSuggestions && !loading && suggestions.length === 0 && (
          <div className="customer-picker__suggestions">
            <div className="customer-picker__suggestion">
              <span className="customer-picker__suggestion-email">
                No registered customers found.
              </span>
            </div>
          </div>
        )}
      </div>

      {assignedCustomers.length > 0 && (
        <div className="customer-picker__chips">
          {assignedCustomers.map((customer) => {
            const chipKey = getCustomerKey(customer);
            return (
              <span key={chipKey} className="customer-picker__chip">
                <span className="customer-picker__chip-name">
                  {customer.name}
                </span>
                {customer.email && customer.email !== customer.name && (
                  <span className="customer-picker__chip-email">
                    {customer.email}
                  </span>
                )}
                <button
                  type="button"
                  className="customer-picker__chip-remove"
                  onClick={() => removeCustomer(chipKey)}
                  disabled={disabled}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {customers.length === 0 && (
        <div className="customer-picker__empty">
          No customers assigned yet — search above to add.
        </div>
      )}

      <div className="customer-picker__hint">
        Private codes are validated against the signed-in account at checkout —
        anyone else entering the code sees "This code is linked to a different
        account." Assignments save immediately.
      </div>
    </div>
  );
};
