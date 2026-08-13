// settings/SettingsRulesCard.tsx
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { Pill } from '../components/Pill';
import './styles/SettingsRulesCard.css';

interface Rule {
  id: string;
  message: string;
  audience: string;
  document: string;
  required: boolean;
  condition: string;
}

export const SettingsRulesCard: React.FC = () => {
  const [rules] = useState<Rule[]>([
    {
      id: '1',
      message: 'Welcome Email',
      audience: 'Customer',
      document: 'GST Invoice',
      required: true,
      condition: 'always',
    },
    {
      id: '2',
      message: 'Order Confirmation',
      audience: 'Customer',
      document: 'Rental Agreement',
      required: false,
      condition: 'rental',
    },
    {
      id: '3',
      message: 'Order Confirmation',
      audience: 'Customer',
      document: 'Care Card',
      required: false,
      condition: 'always',
    },
  ]);

  const CONDITIONS = ['always', 'rental', 'preloved', 'buynew', 'demandsPayment', 'invokesAgreement'];
  const CONDITION_LABELS: Record<string, string> = {
    'always': 'Always',
    'rental': 'Rentals only',
    'preloved': 'Preloved orders only',
    'buynew': 'Buy New orders only',
    'demandsPayment': 'When the wording names a figure to pay',
    'invokesAgreement': 'When the wording leans on the agreement',
  };

  return (
    <Card
      header="What travels with what"
      headerSubtitle="One row per rule. This is the control: the engine reads this table, so a change here changes every send."
    >
      <div className="msg-settings-table-wrapper">
        <table className="msg-table">
          <thead>
            <tr>
              <th style={{ width: '230px' }}>MESSAGE</th>
              <th style={{ width: '200px' }}>CARRIES</th>
              <th style={{ width: '250px' }}>WHEN</th>
              <th style={{ width: '90px' }}></th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td>
                  <div className="msg-settings-link">{rule.message}</div>
                  <div className="msg-settings-rule-audience">{rule.audience}</div>
                </td>
                <td>
                  <div className="msg-settings-rule-doc">
                    {rule.document}
                    {rule.required && (
                      <Pill status="terracotta" className="msg-settings-required-pill">
                        Required
                      </Pill>
                    )}
                  </div>
                </td>
                <td>
                  <select
                    className="msg-settings-condition-select"
                    value={rule.condition}
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>{CONDITION_LABELS[c]}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <Button variant="secondary" size="small">Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="msg-settings-add-rule">
        <div className="msg-settings-grid-3">
          <FormField label="Message">
            <select className="msg-select">
              <option>Welcome Email</option>
              <option>Order Confirmation</option>
              <option>Return Initiated</option>
            </select>
          </FormField>
          <FormField label="Carries">
            <select className="msg-select">
              <option>GST Invoice</option>
              <option>Rental Agreement</option>
              <option>Care Card</option>
            </select>
          </FormField>
          <FormField label="When">
            <select className="msg-select">
              <option value="always">Always</option>
              <option value="rental">Rentals only</option>
              <option value="preloved">Preloved orders only</option>
              <option value="buynew">Buy New orders only</option>
              <option value="demandsPayment">When the wording names a figure to pay</option>
              <option value="invokesAgreement">When the wording leans on the agreement</option>
            </select>
          </FormField>
        </div>
        <div className="msg-settings-add-rule-actions">
          <Button variant="primary" size="small">Add rule</Button>
          <div className="msg-settings-add-rule-hint">
            A rule that sends a tax document cannot be removed. Everything else can be, and can also be crossed off message by message in the editor, or on one send from the Send tab.
          </div>
        </div>
      </div>
    </Card>
  );
};