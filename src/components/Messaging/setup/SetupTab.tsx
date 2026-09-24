// setup/SetupTab.tsx
import React, { useState } from 'react';
import { NoteBar } from '../components/NoteBar';
import { SetupTodoBar } from './SetupTodoBar';
import { SetupDocumentsDrawer } from './SetupDocumentsDrawer';
import { SetupSenderDrawer } from './SetupSenderDrawer';
import { SetupAppearanceDrawer } from './SetupAppearanceDrawer';
import { SetupWordsDrawer } from './SetupWordsDrawer';
import './styles/SetupTab.css';

export const SetupTab: React.FC = () => {
  const [todoItems] = useState([
  {
    id: '1',
    message: (
      <>
        <strong>Care card, rental</strong> has no file, so the messages that carry it would arrive with an empty paperclip
      </>
    ),
    buttonLabel: 'Upload it',
    onClick: () => console.log('Upload Care card, rental'),
  },
  {
    id: '2',
    message: (
      <>
        <strong>Care card, preloved</strong> has no file, so the messages that carry it would arrive with an empty paperclip
      </>
    ),
    buttonLabel: 'Upload it',
    onClick: () => console.log('Upload Care card, preloved'),
  },
]);

  return (
    <div className="msg-setup-tab">
      <NoteBar heading="The things that are true for every message">
        Anything that needs doing is at the top. Everything else is a closed drawer, so open the one you came for.
      </NoteBar>

      <SetupTodoBar items={todoItems} />

      <SetupDocumentsDrawer />
      <SetupSenderDrawer />
      <SetupAppearanceDrawer />
      <SetupWordsDrawer />
    </div>
  );
};