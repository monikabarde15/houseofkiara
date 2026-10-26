/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Wrapper mounting PagesModule
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { PagesModule } from './Pages';

interface PagesViewProps {
  onBackToDashboard?: () => void;
}

export default function PagesView({ onBackToDashboard }: PagesViewProps) {
  return <PagesModule onBackToDashboard={onBackToDashboard} />;
}
