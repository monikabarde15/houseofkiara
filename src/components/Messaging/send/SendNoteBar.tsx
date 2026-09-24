// send/SendNoteBar.tsx
import React from 'react';
import { NoteBar } from '../components/NoteBar';
import './styles/SendNoteBar.css';

export const SendNoteBar: React.FC = () => {
  return (
    <NoteBar heading="Choose the message, choose the people, read it back, send">
      Each person gets their own version. Her name, her saved pieces, her occasion, the code you picked.
      You see the real thing for every single person before anything goes out, and anyone who has not agreed
      to hear from us is set aside rather than quietly dropped.
    </NoteBar>
  );
};