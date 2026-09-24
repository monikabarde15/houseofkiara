export type DesignerType =
  | 'Couture House'
  | 'Contemporary Label'
  | 'Heritage Weave'
  | 'Indie Designer';

export type DesignerStatus = 'Active' | 'Inactive';

export interface Designer {
  id: string;
  name: string;
  bio: string;
  slug: string;
  type: DesignerType;
  joinedAt: string;          // ISO date, e.g. "2025-01-09"
  isNewToHOK: boolean;
  isFeatured: boolean;
  featuredOrder: number | null;
  livePieces: number;
  totalPieces: number;
  status: DesignerStatus;
  commercialTerms?: any;
  counterfeitRiskTier?: any;
  authenticationChecklist?: any;
  websiteUrl?: any;
  instagramHandle?: any;
}

export interface UnmappedLabel {
  id: string;
  name: string;
  code: string;              // e.g. "HOK-RK-001"
  pieceCount: number;
}

export interface AtelierPiece {
  id: string;
  order: number;
  pieceName: string;
  designerName: string;
  isSuggested?: boolean;
}

export interface SuggestedNewToHOK {
  id: string;
  name: string;
}