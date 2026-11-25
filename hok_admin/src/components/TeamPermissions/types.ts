export type SectionLevel = "Edit" | "View" | "Hidden";

export type MemberStatus = "Active" | "Invited" | "Paused" | "Left";

export type HistoryKind = "people" | "roles";

export type TeamPermissionsTab = "team" | "roles" | "history";

export interface SectionDefinition {
  id: string;
  label: string;
  group: string;
  levels: SectionLevel[];
  maxLevel: SectionLevel;
  followsRole?: boolean;
  founderOnly?: boolean;
  inRolesTable: boolean;
  description: string;
}

export interface DecisionDefinition {
  id: string;
  label: string;
  tableSectionId: string | null;
  needsEditOn: string[];
  description: string;
  askLine: string;
}

export interface RoleRecord {
  roleId: string;
  name: string;
  description: string;
  colour: string;
  isFixed: boolean;
  archived: boolean;
  sortOrder: number;
  levels: Record<string, SectionLevel>;
  rawLevels: Record<string, SectionLevel>;
  decisions: string[];
  rawDecisions: string[];
  openSectionsCount?: number;
}

export interface TeamMemberRecord {
  personId: string;
  adminId?: string | null;
  fullName: string;
  shownOnRecordsAs: string;
  olderSpellings: string[];
  roleId: string;
  status: MemberStatus;
  workEmail: string;
  whatsappNumber: string;
  addedAt?: string | null;
  addedBy?: string | null;
  invitedAt?: string | null;
  inviteExpiresAt?: string | null;
  joinedAt?: string | null;
  lastActiveAt?: string | null;
  pausedSince?: string | null;
  leftOn?: string | null;
  hasSignedInOnce?: boolean;
}

export interface HistoryEntryRecord {
  entryId: string;
  kind: HistoryKind;
  who: string;
  target?: string;
  message: string;
  occurredAt: string;
}

export interface OpenWorkItem {
  kind: "Enquiry" | "Offer" | "Alert";
  sectionId: "enquiries" | "offers" | "notifications";
  id: string;
  customerName?: string;
  pickedUpAt?: string;
  label: string;
}

export interface EligibleRecipient {
  personId: string;
  fullName: string;
  shownOnRecordsAs: string;
  roleId: string;
  roleName: string;
}

export interface EffectivePermissions {
  roleId: string;
  roleName: string;
  isFounder: boolean;
  levels: Record<string, SectionLevel>;
  decisions: string[];
  openSectionsCount: number;
}

export interface PanelToastMessage {
  id: number;
  boldPrefix?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface PreviewState {
  active: boolean;
  roleId: string;
  personId: string | null;
  personFirstName: string | null;
  returnTab: TeamPermissionsTab;
  returnPersonId: string | null;
}
