// tabs/SettingsTab.tsx (FULL IMPLEMENTATION)
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FormField, Input, Textarea } from '../components/FormField';
import { Pill } from '../components/Pill';
import { DocumentViewer } from '../modals/DocumentViewer';
import './styles/SettingsTab.css';

// H1 - Who messages come from
const SenderCard: React.FC = () => {
  return (
    <Card header="Who messages come from">
      <div className="msg-settings-grid-2">
        <FormField label="From Name">
          <Input value="House of Kaira" />
        </FormField>
        <FormField label="From Address">
          <Input value="hello@houseofkaira.com" />
        </FormField>
      </div>
      <FormField label="Reply-To" hint="A real inbox, not no-reply. Replies will be rare next to WhatsApp, but the ones that come will matter.">
        <Input value="support@houseofkaira.com" />
      </FormField>
      <FormField label="Quiet Copy To">
        <Input value="operations@houseofkaira.com" />
      </FormField>
      <FormField label="Your Desk" hint="Where the messages addressed to you land. Comma separated.">
        <Input value="your@houseofkaira.com" />
      </FormField>
      <FormField label="WhatsApp Number" hint="Reads from Site Settings. This is the number quoted inside message wording as {{support_whatsapp}}.">
        <Input value="+91 98765 43210" />
      </FormField>
      <div className="msg-settings-footer">
        <Button variant="primary" size="small" saved>Save</Button>
      </div>
    </Card>
  );
};

// H2 - How they look
const AppearanceCard: React.FC = () => {
  return (
    <Card header="How they look">
      <FormField label="Logo">
        <div className="msg-settings-logo-hint">
          Reads the logo uploaded in <span className="msg-settings-link">Site Settings → Brand & Logo</span>. 
          One upload, two places, nothing to keep in sync by hand.
        </div>
      </FormField>
      <div className="msg-settings-grid-2">
        <FormField label="Header Background">
          <div className="msg-settings-color-wrapper">
            <input type="color" className="msg-settings-color-input" value="#1A1612" />
            <span className="msg-settings-color-hex">#1A1612</span>
          </div>
        </FormField>
        <FormField label="Logo Colour">
          <div className="msg-settings-color-wrapper">
            <input type="color" className="msg-settings-color-input" value="#C9A96E" />
            <span className="msg-settings-color-hex">#C9A96E</span>
          </div>
        </FormField>
      </div>
      <FormField label="Sign-off" hint="Added to the end of every message to a customer or lister. Change it here and all of them change. Do not retype it inside a message.">
        <Textarea value="With love,\nThe House of Kaira Team" minHeight={52} />
      </FormField>
      <FormField label="Footer" hint="Shown only on the optional messages. Never on a booking or a refund, where an unsubscribe link would be misleading.">
        <Textarea value="House of Kaira\n123 Luxury Lane, Mumbai\nGSTIN: 27AABCK1234D1Z5\nContact: +91 98765 43210" minHeight={62} />
      </FormField>
      <FormField label="Unsubscribe Line">
        <Input value="You are receiving this because you opted in. Unsubscribe here." />
      </FormField>
      <div className="msg-settings-footer">
        <Button variant="primary" size="small" saved>Save</Button>
      </div>
    </Card>
  );
};

// H3 - Type & Rendering
const TypeCard: React.FC = () => {
  return (
    <Card header="Type & Rendering">
      <div className="msg-settings-grid-3">
        <FormField label="Display Face">
          <Input value="Cormorant Garamond" readOnly />
        </FormField>
        <FormField label="Body Face">
          <Input value="DM Sans" readOnly />
        </FormField>
        <FormField label="Minimum Body Size">
          <Input value="16px" readOnly />
        </FormField>
      </div>
      <div className="msg-settings-type-hint">
        Display face: Cormorant Garamond, then Georgia, then serif. Body face: DM Sans, then Inter, then system UI.
        Minimum body size ensures readability on all devices.
      </div>
    </Card>
  );
};

// H4 - Documents we issue
const DocumentsCard: React.FC = () => {
  const [documents] = useState([
    { id: '1', name: 'GST Invoice', kind: 'Invoice', description: 'Tax invoice for rental of occasion wear', source: 'Orders → Rental', required: true, travelsWith: ['Welcome Email → always', 'Order Confirmation → always'] },
    { id: '2', name: 'Rental Agreement', kind: 'Agreement', description: 'Terms and conditions of rental', source: 'Orders → Rental', required: false, travelsWith: ['Order Confirmation → always'] },
    { id: '3', name: 'Care Card', kind: 'Logistics', description: 'Care instructions for the piece', source: 'Products → Care', required: false, travelsWith: ['Order Confirmation → always'] },
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
                  {doc.required && <Pill status="terracotta" className="msg-settings-required-pill">Required</Pill>}
                  <div className="msg-settings-doc-kind">{doc.kind}</div>
                </td>
                <td className="msg-settings-doc-desc">{doc.description}</td>
                <td className="msg-settings-doc-source">{doc.source}</td>
                <td>
                  {doc.travelsWith.length > 0 ? (
                    doc.travelsWith.map((t, i) => (
                      <div key={i} className="msg-settings-doc-travels">
                        <span className="msg-settings-link">{t.split('→')[0].trim()}</span>
                        <span className="msg-settings-travels-condition"> → {t.split('→')[1]?.trim() || 'always'}</span>
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

// H5 - What travels with what
const RulesCard: React.FC = () => {
  const [rules] = useState([
    { id: '1', message: 'Welcome Email', audience: 'Customer', document: 'GST Invoice', required: true, condition: 'always' },
    { id: '2', message: 'Order Confirmation', audience: 'Customer', document: 'Rental Agreement', required: false, condition: 'rental' },
    { id: '3', message: 'Order Confirmation', audience: 'Customer', document: 'Care Card', required: false, condition: 'always' },
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
                    {rule.required && <Pill status="terracotta" className="msg-settings-required-pill">Required</Pill>}
                  </div>
                </td>
                <td>
                  <select className="msg-settings-condition-select" value={rule.condition}>
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

// H6 - Words you can drop into a message
const WordsCard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [words] = useState([
    { id: '1', group: 'customer', word: 'customer_name', description: 'Full name of the customer', standIn: 'Customer', needed: true },
    { id: '2', group: 'customer', word: 'customer_email', description: 'Email address of the customer', standIn: 'customer@email.com', needed: false },
    { id: '3', group: 'order', word: 'order_id', description: 'Unique order identifier', standIn: 'ORD-1234', needed: true },
    { id: '4', group: 'item', word: 'item_name', description: 'Name of the piece', standIn: 'Rose Georgette Anarkali', needed: true },
    { id: '5', group: 'rental', word: 'rental_start', description: 'Start date of rental', standIn: '22 Mar 2026', needed: false },
    { id: '6', group: 'rental', word: 'rental_end', description: 'End date of rental', standIn: '29 Mar 2026', needed: false },
  ]);

  const groups = [...new Set(words.map(w => w.group))];

  return (
    <Card 
      header="Words you can drop into a message" 
      headerSubtitle="Read-only, like Master Data. One vocabulary everywhere."
    >
      <div className="msg-settings-words-toolbar">
        <div className="msg-settings-words-search">
          <input
            type="text"
            className="msg-settings-words-search-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="msg-settings-words-count">{words.length} of {words.length}</span>
      </div>

      <div className="msg-settings-table-wrapper">
        <table className="msg-table">
          <thead>
            <tr>
              <th>GROUP</th>
              <th>WORD</th>
              <th>FILLS IN WITH</th>
              <th>IF IT IS MISSING</th>
              <th>NEEDED?</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, groupIndex) => (
              <React.Fragment key={group}>
                {groupIndex > 0 && <tr className="msg-settings-word-group-spacer" />}
                <tr className="msg-settings-word-group">
                  <td colSpan={5} className="msg-settings-word-group-label">{group}</td>
                </tr>
                {words.filter(w => w.group === group).map((word) => (
                  <tr key={word.id} className="msg-settings-word-row">
                    <td className="msg-settings-word-group-name">{word.group}</td>
                    <td>
                      <span className="msg-settings-word-variable">{"{{" + word.word + "}}"}</span>
                    </td>
                    <td>{word.description}</td>
                    <td>{word.standIn || 'nothing at all'}</td>
                    <td>
                      <Pill status={word.needed ? 'terracotta' : 'grey'}>
                        {word.needed ? 'Needed' : 'Optional'}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="msg-settings-words-footer">
        <span className="msg-settings-words-footer-hint">
          If something marked Needed comes up empty, the message is held back and lands on your desk rather than going out half-written.
        </span>
      </div>
    </Card>
  );
};

// Main Settings Tab
export const SettingsTab: React.FC = () => {
  return (
    <div className="msg-settings-tab">
      <div className="msg-settings-grid">
        <SenderCard />
        <AppearanceCard />
      </div>
      <TypeCard />
      <DocumentsCard />
      <RulesCard />
      <WordsCard />
    </div>
  );
};