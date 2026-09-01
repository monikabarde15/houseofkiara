// types/messaging.types.ts

export type MessageStatus = 'Live' | 'Paused' | 'Not written' | 'Delivered' | 'Bounced';
export type Audience = 'Customer' | 'Lister' | 'Designer' | 'You';
export type MessageClass = 'Required' | 'Optional' | 'Marketing';
export type Channel = 'email' | 'whatsapp' | 'website';
export type PillStatus = 'green' | 'amber' | 'grey' | 'blue' | 'terracotta';

export interface Message {
  id: string;
  name: string;
  wordingCount: number;
  isYours: boolean;
  trigger: string;
  subject: string;
  audience: Audience;
  class: MessageClass;
  channels: Channel[];
  status: MessageStatus;
  lastEdited: string;
  editor: string;
  sentCount?: number;
}

export interface Wording {
  id: string;
  name: string;
  subject: string;
  previewLine: string;
  email: string;
  whatsapp: string;
}

export interface SendLog {
  id: string;
  when: string;
  message: string;
  wording: string;
  who: string;
  contact: string;
  channel: string;
  outcome: 'Delivered' | 'Opened' | 'Bounced' | 'Held' | 'Not sent';
  about: string;
  sentBy: string;
}

export interface Document {
  id: string;
  name: string;
  kind: string;
  description: string;
  source: string;
  required: boolean;
  travelsWith: Array<{ message: string; condition: string }>;
}

export interface Variable {
  id: string;
  group: string;
  word: string;
  description: string;
  standIn: string;
  needed: boolean;
}

export interface StatTile {
  label: string;
  number: string | number;
  numberColor: 'charcoal' | 'sage' | 'gold';
  caption: string;
  onClick?: () => void;
}

export interface Tab {
  id: string;
  label: string;
}