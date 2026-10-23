/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Wrapper mounting PagesModule
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { PagesModule } from './Pages';

export default function PagesView({ onBackToDashboard }: { onBackToDashboard?: () => void }) {
  return <PagesModule onBackToDashboard={onBackToDashboard} />;
}
