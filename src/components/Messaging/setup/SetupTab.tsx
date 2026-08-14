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
          <strong>Care Card</strong> has no file, so the messages that carry it would arrive with an empty paperclip
        </>
      ),
      buttonLabel: 'Upload it',
      onClick: () => console.log('Upload Care Card'),
    },
    {
      id: '2',
      message: (
        <>
          <strong>Rental Agreement</strong> is carried by <strong>Order Confirmation</strong> which cannot fill{' '}
          <strong>{'{{rental_end}}'}</strong>
        </>
      ),
      buttonLabel: 'Open the message',
      onClick: () => console.log('Open message'),
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