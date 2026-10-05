/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · VIEW EXPORT
   Spec v213
========================================================= */

import React from 'react';
import { Homepage } from './Homepage';

interface HomepageViewProps {
  homepage?: any;
  onUpdateHomepage?: (homepage: any) => void;
  onNavigateSiteSettings?: () => void;
  onNavigateToModule?: (mod: string) => void;
}

export const HomepageView: React.FC<HomepageViewProps> = (props) => {
  return <Homepage {...props} />;
};

export default HomepageView;