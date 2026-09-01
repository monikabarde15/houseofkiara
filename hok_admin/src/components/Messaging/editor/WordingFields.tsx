// editor/WordingFields.tsx
import React from 'react';
import { FormField, Input, Textarea } from '../components/FormField';
import './styles/WordingFields.css';

interface WordingFieldsProps {
  subject: string;
  previewLine: string;
  email: string;
  whatsapp: string;
  onSubjectChange: (value: string) => void;
  onPreviewChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onWhatsappChange: (value: string) => void;
  onSubjectFocus?: () => void;
  onPreviewFocus?: () => void;
  onEmailFocus?: () => void;
  onWhatsappFocus?: () => void;
}

export const WordingFields: React.FC<WordingFieldsProps> = ({
  subject,
  previewLine,
  email,
  whatsapp,
  onSubjectChange,
  onPreviewChange,
  onEmailChange,
  onWhatsappChange,
  onSubjectFocus,
  onPreviewFocus,
  onEmailFocus,
  onWhatsappFocus,
}) => {
  return (
    <div className="msg-wording-fields">
      <FormField label="SUBJECT LINE">
        <Input 
          value={subject} 
          onChange={(e) => onSubjectChange(e.target.value)}
          onFocus={onSubjectFocus}
          placeholder="Enter subject line"
        />
      </FormField>

      <FormField 
        label="PREVIEW LINE"
        hint="The grey line the inbox shows beside the subject. Left empty, the inbox grabs the greeting instead."
      >
        <Input 
          value={previewLine} 
          onChange={(e) => onPreviewChange(e.target.value)}
          onFocus={onPreviewFocus}
          placeholder="Enter preview line"
        />
      </FormField>

      <FormField 
        label="EMAIL"
        hint="The sign-off and footer are added for you from Settings. Do not retype them here."
      >
        <Textarea 
          value={email} 
          onChange={(e) => onEmailChange(e.target.value)}
          onFocus={onEmailFocus}
          minHeight={200}
          placeholder="Write the email content here..."
        />
      </FormField>

      <FormField 
        label="WHATSAPP"
        hint="Same facts, fewer words. This is what keeps the two channels one message rather than two stories."
      >
        <Textarea 
          value={whatsapp} 
          onChange={(e) => onWhatsappChange(e.target.value)}
          onFocus={onWhatsappFocus}
          minHeight={88}
          placeholder="Write the WhatsApp content here..."
        />
      </FormField>
    </div>
  );
};