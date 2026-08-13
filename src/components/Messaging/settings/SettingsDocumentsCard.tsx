// settings/SettingsDocumentsCard.tsx
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FormField, Input } from '../components/FormField';
import { Pill } from '../components/Pill';
import './styles/SettingsDocumentsCard.css';

interface Document {
  id: string;
  name: string;
  kind: string;
  description: string;
  source: string;
  required: boolean;
  travelsWith: string[];
}

export const SettingsDocumentsCard: React.FC = () => {
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'GST Invoice',
      kind: 'Invoice',
      description: 'Tax invoice for rental of occasion wear',
      source: 'Orders → Rental',
      required: true,
      travelsWith: ['Welcome Email → always', 'Order Confirmation → always'],
    },
    {
      id: '2',
      name: 'Rental Agreement',
      kind: 'Agreement',
      description: 'Terms and conditions of rental',
      source: 'Orders → Rental',
      required: false,
      travelsWith: ['Order Confirmation → always'],
    },
    {
      id: '3',
      name: 'Care Card',
      kind: 'Logistics',
      description: 'Care instructions for the piece',
      source: 'Products → Care',
      required: false,
      travelsWith: ['Order Confirmation → always'],
    },
  ]);

  return (
    <Card
      header="Documents we issue"
      headerSubtitle="The master. A document exists here first, then a rule decides which message carries it."
    >
      <div className="msg-settings-table-wrapper">
        <table className="msg-table">
          <thead>
            <tr>
              <th style={{ width: '140px' }}>DOCUMENT</th>
              <th style={{ width: '190px' }}>WHAT IT IS</th>
              <th style={{ width: '200px' }}>WHERE ITS FIGURES COME FROM</th>
              <th>TRAVELS WITH</th>
              <th style={{ width: '80px' }}></th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <div className="msg-settings-doc-name">{doc.name}</div>
                  {doc.required && (
                    <Pill status="terracotta" className="msg-settings-required-pill">
                      Required
                    </Pill>
                  )}
                  <div className="msg-settings-doc-kind">{doc.kind}</div>
                </td>
                <td className="msg-settings-doc-desc">{doc.description}</td>
                <td className="msg-settings-doc-source">{doc.source}</td>
                <td>
                  {doc.travelsWith.length > 0 ? (
                    doc.travelsWith.map((t, i) => (
                      <div key={i} className="msg-settings-doc-travels">
                        <span className="msg-settings-link">{t.split('→')[0].trim()}</span>
                        <span className="msg-settings-travels-condition">
                          → {t.split('→')[1]?.trim() || 'always'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="msg-settings-nothing">nothing yet</span>
                  )}
                </td>
                <td>
                  <Button variant="secondary" size="small">Preview</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="msg-settings-add-doc">
        <div className="msg-settings-grid-3">
          <FormField label="New document">
            <Input placeholder="What it is called" />
          </FormField>
          <FormField label="Kind">
            <select className="msg-select">
              <option>Insert</option>
              <option>Statement</option>
              <option>Agreement</option>
              <option>Logistics</option>
              <option>Evidence</option>
              <option>Commercial</option>
            </select>
          </FormField>
          <FormField label="Where its figures come from">
            <Input placeholder="Which section of the panel" />
          </FormField>
        </div>
        <div className="msg-settings-add-doc-actions">
          <Button variant="secondary" size="small">Add to the master</Button>
          <div className="msg-settings-add-doc-hint">
            Tax documents cannot be added here. Their rate and code come from Platform & Legal and are decided by law, not by us.
          </div>
        </div>
      </div>
    </Card>
  );
};