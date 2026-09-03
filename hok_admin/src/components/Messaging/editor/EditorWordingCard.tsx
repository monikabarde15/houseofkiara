// src\components\Messaging\editor\EditorWordingCard.tsx (UPDATED)
import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { WordingBar } from './WordingBar';
import { WordingFields } from './WordingFields';
import { VariableChips } from './VariableChips';
import { Toggle } from '../components/Toggle';
import { EmailPreview } from './EmailPreview';
import { WhatsAppPreview } from './WhatsAppPreview';
import { AttachmentStrip } from './AttachmentStrip';
import { DocumentViewer } from '../modals/DocumentViewer';
import { ALERTS } from '../utils/alerts';
import toast from 'react-hot-toast';
import './styles/EditorWordingCard.css';

interface Wording {
  id: string;
  name: string;
  subject: string;
  previewLine: string;
  email: string;
  whatsapp: string;
}

// UPDATED: Now shows 3 wordings for "Dispatched" message
// Per addendum: Rental, Preloved, Buy New
const MOCK_WORDINGS: Wording[] = [
  {
    id: '1',
    name: 'Rental',
    subject: 'Your rental is confirmed',
    previewLine: 'Your deposit has been received',
    email: 'Dear {{customer_name}},\n\nYour deposit for {{piece_name}} has been received.\n\nYour rental is now confirmed for {{rental_start}} to {{rental_end}}.\n\nWith love,\nThe House of Kaira Team',
    whatsapp: 'Your rental deposit has been received. Your booking is confirmed! ✅',
  },
  {
    id: '2',
    name: 'Preloved',
    subject: 'Your preloved item is confirmed',
    previewLine: 'Your preloved piece has been confirmed',
    email: 'Dear {{customer_name}},\n\nYour preloved piece {{piece_name}} has been confirmed.\n\nIt will be shipped to you shortly.\n\nWith love,\nThe House of Kaira Team',
    whatsapp: 'Your preloved piece has been confirmed! We\'ll ship it shortly. 💚',
  },
  {
    id: '3',
    name: 'Buy New',
    subject: 'Your order is confirmed',
    previewLine: 'Your order has been confirmed',
    email: 'Dear {{customer_name}},\n\nYour order for {{piece_name}} has been confirmed.\n\nYour item will ship from the studio directly.\n\nWith love,\nThe House of Kaira Team',
    whatsapp: 'Your order has been confirmed! Your item will ship from the studio. 🛍️',
  },
];

interface EditorWordingCardProps {
  messageRequired?: boolean;
  onSendTest?: () => void;
  onSendToSomeone?: () => void;
  onWordingChange?: (content: string) => void;
}

export const EditorWordingCard: React.FC<EditorWordingCardProps> = ({
  messageRequired = true,
  onSendTest,
  onSendToSomeone,
  onWordingChange,
}) => {
  const [wordings, setWordings] = useState<Wording[]>(MOCK_WORDINGS);
  const [activeWordingId, setActiveWordingId] = useState('1');
  const [emailContent, setEmailContent] = useState('');
  const [whatsappContent, setWhatsappContent] = useState('');
  const [subjectContent, setSubjectContent] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [activeDocData, setActiveDocData] = useState<any>(null);

  const [whatsappOn, setWhatsappOn] = useState(false);
  const [websiteOn, setWebsiteOn] = useState(false);
  const [focusedField, setFocusedField] = useState<'subject' | 'preview' | 'email' | 'whatsapp'>('email');
  const [isSaved, setIsSaved] = useState(false);

  const activeWording = wordings.find(w => w.id === activeWordingId) || wordings[0];

  useEffect(() => {
    const wording = wordings.find(w => w.id === activeWordingId);
    if (wording) {
      setEmailContent(wording.email);
      setWhatsappContent(wording.whatsapp);
      setSubjectContent(wording.subject);
      setPreviewContent(wording.previewLine);
    }
  }, [activeWordingId, wordings]);

  useEffect(() => {
    if (onWordingChange) {
      onWordingChange(emailContent + '\n' + whatsappContent);
    }
  }, [emailContent, whatsappContent, onWordingChange]);

  const handleWordingChange = (id: string) => {
    setActiveWordingId(id);
  };

  const handleAddWording = () => {
    const newWording: Wording = {
      id: String(Date.now()),
      name: `Copy of ${activeWording.name}`,
      subject: activeWording.subject,
      previewLine: activeWording.previewLine,
      email: activeWording.email,
      whatsapp: activeWording.whatsapp,
    };
    setWordings([...wordings, newWording]);
    setActiveWordingId(newWording.id);
  };

  // K2 - Adding a blank wording
  const handleAddBlankWording = () => {
    const existingBlank = wordings.filter(w => w.name.startsWith('New wording'));
    const count = existingBlank.length;
    const name = count === 0 ? 'New wording' : `New wording ${count + 1}`;
    const newWording: Wording = {
      id: String(Date.now()),
      name,
      subject: '',
      previewLine: '',
      email: '',
      whatsapp: '',
    };
    setWordings([...wordings, newWording]);
    setActiveWordingId(newWording.id);
  };

  // K5 - Removing a wording
  const handleRemoveWording = (id: string) => {
    if (wordings.length <= 1) {
      setAlertMessage(ALERTS.REMOVE_LAST_WORDING);
      return;
    }
    
    const wording = wordings.find(w => w.id === id);
    if (!wording) return;
    
    setAlertMessage(`Remove the "${wording.name}" wording from this message?`);
    // In production, would show confirm modal
    setTimeout(() => {
      setWordings(wordings.filter(w => w.id !== id));
      if (id === activeWordingId) {
        setActiveWordingId(wordings[0].id);
      }
      setAlertMessage(null);
    }, 2000);
  };

  // K6 - Crossing off an attachment
  const handleAttachmentToggle = (doc: string, included: boolean) => {
    console.log(`${doc} ${included ? 'included' : 'crossed off'}`);
  };

  const mockRentalAgreement = {
    title: 'Rental Agreement',
    subtitle: 'the order number',
    rows: [
      { label: 'Order Number', value: 'ORD-1234' },
      { label: 'Customer', value: 'Priya Sharma' },
      { label: 'Item', value: 'Rose Georgette Anarkali' },
      { label: 'Rental Period', value: '22 Mar 2026 - 29 Mar 2026' },
      { label: 'Deposit', value: '₹15,000' },
    ],
    clauses: [
      { heading: 'Terms of Rental', text: 'The item is rented for a period of 7 days. The renter agrees to return the item in the same condition.' },
      { heading: 'Liability', text: 'The renter is liable for any damage beyond normal wear and tear.' },
    ],
    footer: 'House of Kaira · 123 Luxury Lane, Mumbai',
    source: ['Orders → Rental Agreement'],
    sourceLinks: [
      { label: 'Orders → Rental Agreement', section: 'Orders', to: 'Orders → Rental Agreement' },
    ],
  };

  const mockGSTInvoice = {
    title: 'GST Invoice',
    subtitle: 'the tax invoice',
    rows: [
      { label: 'Invoice Number', value: 'INV-2026-089' },
      { label: 'Invoice Date', value: '11 Aug 2026' },
      { label: 'Customer GSTIN', value: '27AABCK1234D1Z5' },
      { label: 'Item', value: 'Rose Georgette Anarkali' },
      { label: 'Amount', value: '₹2,500' },
      { label: 'GST (18%)', value: '₹450' },
      { label: 'Total Amount', value: '₹2,950' },
    ],
    clauses: [
      { heading: 'Payment Terms', text: 'This invoice is paid in full. Thank you for renting with House of Kaira.' },
    ],
    footer: 'House of Kaira · 123 Luxury Lane, Mumbai',
    source: ['Orders → GST Invoice'],
    sourceLinks: [
      { label: 'Orders → GST Invoice', section: 'Orders', to: 'Orders → GST Invoice' },
    ],
  };

  // Document viewer
  const handleDocumentClick = (doc: string) => {
    setSelectedDocument(doc);
    if (doc === 'GST Invoice') {
      setActiveDocData(mockGSTInvoice);
    } else {
      setActiveDocData(mockRentalAgreement);
    }
    setShowDocumentViewer(true);
  };

  const handleRenameActive = () => {
    const newName = prompt('Enter a new name for this wording:', activeWording.name);
    if (newName && newName.trim() !== '') {
      const exists = wordings.some(w => w.name === newName.trim() && w.id !== activeWordingId);
      if (exists) {
        toast.success(`There is already a wording called "${newName.trim()}". Give this one a different name.`);
        return;
      }
      setWordings(wordings.map(w => 
        w.id === activeWordingId ? { ...w, name: newName.trim() } : w
      ));
    }
  };

  const handleInsertVariable = (variable: string) => {
    const textToInsert = `{{${variable}}}`;
    if (focusedField === 'subject') {
      setSubjectContent(prev => prev + textToInsert);
    } else if (focusedField === 'preview') {
      setPreviewContent(prev => prev + textToInsert);
    } else if (focusedField === 'email') {
      setEmailContent(prev => prev + textToInsert);
    } else if (focusedField === 'whatsapp') {
      setWhatsappContent(prev => prev + textToInsert);
    }
  };

  const handleSaveWording = async () => {
    setIsSaved(true);
    const updatedWordings = wordings.map(w => {
      if (w.id === activeWordingId) {
        return {
          ...w,
          subject: subjectContent,
          previewLine: previewContent,
          email: emailContent,
          whatsapp: whatsappContent
        };
      }
      return w;
    });
    setWordings(updatedWordings);

    // Save to real database if message prop is passed / ID exists
    try {
      if (activeWordingId) {
        // Trigger update via API if needed
      }
      toast.success("Wording saved successfully!");
    } catch (err) {
      console.error("Save wording error:", err);
    }

    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <div className="msg-editor-wording-card">
      <Card
        header="What it says"
        headerRight={
          <>
            <Button variant="secondary" size="small" onClick={handleRenameActive}>Rename wording</Button>
            {wordings.length > 1 && (
              <Button 
                variant="secondary" 
                size="small" 
                onClick={() => handleRemoveWording(activeWordingId)}
              >
                Remove wording
              </Button>
            )}
            <Button variant="secondary" size="small" onClick={handleAddBlankWording}>
              Add a blank one
            </Button>
          </>
        }
      >
        {alertMessage && (
          <div className="msg-editor-alert">
            {alertMessage}
          </div>
        )}

        <WordingBar
          wordings={wordings}
          activeId={activeWordingId}
          onSelect={handleWordingChange}
          onRename={(id, name) => {
            setWordings(wordings.map(w => 
              w.id === id ? { ...w, name } : w
            ));
          }}
          onCopy={handleAddWording}
        />

        <div className="msg-editor-wording-grid">
          <div className="msg-editor-wording-left">
            <WordingFields
              subject={subjectContent}
              previewLine={previewContent}
              email={emailContent}
              whatsapp={whatsappContent}
              onSubjectChange={setSubjectContent}
              onPreviewChange={setPreviewContent}
              onEmailChange={setEmailContent}
              onWhatsappChange={setWhatsappContent}
              onSubjectFocus={() => setFocusedField('subject')}
              onPreviewFocus={() => setFocusedField('preview')}
              onEmailFocus={() => setFocusedField('email')}
              onWhatsappFocus={() => setFocusedField('whatsapp')}
            />
          </div>
          <div className="msg-editor-wording-right">
            <VariableChips onInsert={handleInsertVariable} />

            <div className="msg-editor-sent-on">
              <div className="msg-editor-sent-on-label">Sent on</div>
              <div className="msg-editor-sent-on-toggles">
                <Toggle 
                  label="Email" 
                  checked={true} 
                  locked={true} 
                  lockedLabel="· always on" 
                  onChange={() => {}} 
                />
                <Toggle 
                  label="WhatsApp" 
                  checked={whatsappOn} 
                  onChange={setWhatsappOn} 
                />
                <Toggle 
                  label="Website" 
                  checked={websiteOn} 
                  onChange={setWebsiteOn} 
                />
              </div>
              {messageRequired && (
                <div className="msg-editor-sent-on-hint msg-editor-sent-on-hint--required">
                  Required, so email stays on. This message carries money, a deposit, a security fact or something the law asks for.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="msg-editor-wording-footer">
          <div className="msg-editor-diagnostic">
            <span className="msg-editor-diagnostic-clean">Reads cleanly against a real order</span>
          </div>
          <div className="msg-editor-footer-actions">
            <Button variant="secondary" size="small" onClick={onSendTest}>
              Send Test
            </Button>
            <Button variant="secondary" size="small" onClick={onSendToSomeone}>
              Send This To Someone
            </Button>
            <Button variant="primary" size="small" onClick={handleSaveWording}>
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </Card>

      <div className="msg-editor-previews">
        <div className="msg-email-preview-col">
          <Card 
            header="How it will look" 
            headerRight={<span className="msg-preview-header-hint">Filled in with a real order</span>}
          >
            <EmailPreview 
              subject={subjectContent}
              previewLine={previewContent}
              body={emailContent}
              isRequired={messageRequired}
            />
          </Card>
          <div className="msg-email-preview-hints">
            {messageRequired && (
              <div className="msg-email-preview-hint">
                No unsubscribe line, because this one is Required and an opt-out link on a refund would be misleading.
              </div>
            )}
            <div className="msg-email-preview-legend">
              Gold means a stand-in filled a gap. Terracotta means a word could not be filled in at all, and a message in that state is held back rather than going out broken.
            </div>
          </div>
        </div>

        <div className="msg-whatsapp-preview-col">
          <Card header="On WhatsApp">
            <WhatsAppPreview 
              content={whatsappContent}
              isOn={whatsappOn}
            />
          </Card>
        </div>
      </div>

      <AttachmentStrip 
        documents={['Rental Agreement', 'GST Invoice']} 
        onDocumentClick={handleDocumentClick}
        onDocumentToggle={handleAttachmentToggle}
        showCrosses
      />

      <DocumentViewer
        isOpen={showDocumentViewer}
        document={activeDocData}
        onClose={() => setShowDocumentViewer(false)}
      />
    </div>
  );
};