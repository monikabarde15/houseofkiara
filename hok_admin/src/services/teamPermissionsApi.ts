import { apiRequest } from "./apiClient";
import {
  EligibleRecipient,
  HistoryEntryRecord,
  OpenWorkItem,
  RoleRecord,
  TeamMemberRecord,
} from "../components/TeamPermissions/types";

export interface TeamBootstrapPayload {
  roles: RoleRecord[];
  members: TeamMemberRecord[];
  history: HistoryEntryRecord[];
  currentPersonId: string | null;
}

export interface RosterPayload {
  roles: RoleRecord[];
  members: Array<{
    personId: string;
    fullName: string;
    shownOnRecordsAs: string;
    olderSpellings: string[];
    roleId: string;
    status: "Active" | "Invited" | "Paused" | "Left";
  }>;
  currentPersonId: string | null;
}

export const getTeamBootstrap = async (): Promise<TeamBootstrapPayload> => {
  const res = await apiRequest<TeamBootstrapPayload>(
    "/team-permissions/bootstrap",
  );
  return res.data;
};

export const getTeamRoster = async (): Promise<RosterPayload> => {
  const res = await apiRequest<RosterPayload>("/team-permissions/roster");
  return res.data;
};

export const getMemberOpenWork = async (
  personId: string,
): Promise<{
  personId: string;
  items: OpenWorkItem[];
  eligibleRecipients: EligibleRecipient[];
}> => {
  const res = await apiRequest(
    `/team-permissions/members/${encodeURIComponent(personId)}/open-work`,
  );
  return res.data;
};

export const inviteTeamMember = async (payload: {
  fullName: string;
  shownOnRecordsAs?: string;
  workEmail: string;
  roleId: string;
  whatsappNumber?: string;
  password?: string;
}): Promise<{
  message?: string;
  member: TeamMemberRecord;
  historyEntry: HistoryEntryRecord;
  inviteToken?: string;
  directLoginReady?: boolean;
}> => {
  const res = await apiRequest("/team-permissions/members/invite", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return { ...res.data, message: res.message };
};

export const setTeamMemberPassword = async (
  personId: string,
  password: string,
): Promise<{
  message?: string;
  member: TeamMemberRecord;
  historyEntry: HistoryEntryRecord;
}> => {
  const res = await apiRequest(
    `/team-permissions/members/${encodeURIComponent(personId)}/set-password`,
    {
      method: "POST",
      body: JSON.stringify({ password }),
    },
  );
  return { ...res.data, message: res.message };
};

export const resendTeamInvite = async (
  personId: string,
): Promise<{
  message?: string;
  member: TeamMemberRecord;
  historyEntry: HistoryEntryRecord;
  inviteToken?: string;
}> => {
  const res = await apiRequest(
    `/team-permissions/members/${encodeURIComponent(personId)}/resend-invite`,
    { method: "POST" },
  );
  return { ...res.data, message: res.message };
};

export const cancelTeamInvite = async (
  personId: string,
): Promise<{
  removed: boolean;
  personId?: string;
  member?: TeamMemberRecord;
  historyEntry: HistoryEntryRecord;
}> => {
  const res = await apiRequest(
    `/team-permissions/members/${encodeURIComponent(personId)}/cancel-invite`,
    { method: "POST" },
  );
  return res.data;
};

export const updateTeamMemberDetails = async (
  personId: string,
  payload: {
    fullName: string;
    shownOnRecordsAs: string;
    workEmail: string;
    whatsappNumber?: string;
  },
): Promise<{
  message?: string;
  member: TeamMemberRecord;
  historyEntries: HistoryEntryRecord[];
}> => {
  const res = await apiRequest(
    `/team-permissions/members/${encodeURIComponent(personId)}/details`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return { ...res.data, message: res.message };
};

export const changeTeamMemberRole = async (
  personId: string,
  roleId: string,
): Promise<{
  message?: string;
  member: TeamMemberRecord;
  historyEntry: HistoryEntryRecord | null;
}> => {
  const res = await apiRequest(
    `/team-permissions/members/${encodeURIComponent(personId)}/role`,
    {
      method: "PATCH",
      body: JSON.stringify({ roleId }),
    },
  );
  return { ...res.data, message: res.message };
};

export const handOverMemberWork = async (
  personId: string,
  toPersonId: string,
): Promise<{
  message?: string;
  movedCount: number;
  historyEntry: HistoryEntryRecord;
}> => {
  const res = await apiRequest(
    `/team-permissions/members/${encodeURIComponent(personId)}/hand-over`,
    {
      method: "POST",
      body: JSON.stringify({ toPersonId }),
    },
  );
  return { ...res.data, message: res.message };
};

export const pauseTeamMember = async (
  personId: string,
): Promise<{
  member: TeamMemberRecord;
  historyEntry: HistoryEntryRecord;
}> => {
  const res = await apiRequest(
    `/team-permissions/members/${encodeURIComponent(personId)}/pause`,
    { method: "POST" },
  );
  return res.data;
};

export const restoreTeamMember = async (
  personId: string,
): Promise<{
  message?: string;
  member: TeamMemberRecord;
  historyEntry: HistoryEntryRecord;
}> => {
  const res = await apiRequest(
    `/team-permissions/members/${encodeURIComponent(personId)}/restore`,
    { method: "POST" },
  );
  return { ...res.data, message: res.message };
};

export const removeTeamMember = async (
  personId: string,
  handOverToPersonId?: string,
): Promise<{
  message?: string;
  member: TeamMemberRecord;
  movedCount: number;
  historyEntry: HistoryEntryRecord;
}> => {
  const res = await apiRequest(
    `/team-permissions/members/${encodeURIComponent(personId)}/remove`,
    {
      method: "POST",
      body: JSON.stringify({ handOverToPersonId }),
    },
  );
  return { ...res.data, message: res.message };
};

export const reinviteTeamMember = async (
  personId: string,
): Promise<{
  message?: string;
  member: TeamMemberRecord;
  historyEntry: HistoryEntryRecord;
  inviteToken?: string;
}> => {
  const res = await apiRequest(
    `/team-permissions/members/${encodeURIComponent(personId)}/reinvite`,
    { method: "POST" },
  );
  return { ...res.data, message: res.message };
};

export const createTeamRole = async (payload: {
  name: string;
  description?: string;
  copyFromRoleId?: string | null;
  colour?: string;
}): Promise<{
  message?: string;
  role: RoleRecord;
  roles: RoleRecord[];
  historyEntry: HistoryEntryRecord;
}> => {
  const res = await apiRequest("/team-permissions/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return { ...res.data, message: res.message };
};

export const saveRolesBatch = async (
  roles: RoleRecord[],
): Promise<{
  message?: string;
  roles: RoleRecord[];
  historyEntries: HistoryEntryRecord[];
  changeCount: number;
}> => {
  const res = await apiRequest("/team-permissions/roles/save", {
    method: "PUT",
    body: JSON.stringify({ roles }),
  });
  return { ...res.data, message: res.message };
};
