import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as authApi from "../../services/authApi";
import * as tpApi from "../../services/teamPermissionsApi";
import {
  DECISIONS,
  DECISION_BY_ID,
  FOUNDER_ROLE_ID,
  SECTIONS,
  SECTION_BY_ID,
  clampSectionLevel,
  computeEffectivePermissions,
  getFirstName,
  joinWithAnd,
  resolveViewPermissionSection,
} from "./constants";
import {
  EffectivePermissions,
  HistoryEntryRecord,
  PanelToastMessage,
  PreviewState,
  RoleRecord,
  SectionLevel,
  TeamMemberRecord,
  TeamPermissionsTab,
} from "./types";

interface TeamPermissionsContextValue {
  // Loaded state
  loading: boolean;
  bootstrappedFounder: boolean;
  roles: RoleRecord[];
  members: TeamMemberRecord[];
  history: HistoryEntryRecord[];
  currentPerson: TeamMemberRecord | null;
  currentRole: RoleRecord | null;
  actualPermissions: EffectivePermissions;
  effectivePermissions: EffectivePermissions;

  // Navigation & UI persistence (Spec 4.2, 4.6)
  activeTab: TeamPermissionsTab;
  setActiveTab: (tab: TeamPermissionsTab) => void;
  selectedPersonId: string | null;
  setSelectedPersonId: (id: string | null) => void;
  showPastMembers: boolean;
  setShowPastMembers: (show: boolean) => void;
  flashingPersonId: string | null;
  triggerRowFlash: (personId: string) => void;

  // Roles Draft State (Spec 6.5)
  draftRoles: RoleRecord[];
  hasUnsavedRoleChanges: boolean;
  changedCellKeys: Set<string>;
  changedRoleIds: Set<string>;
  changedRoleNames: string[];
  unsavedChangeCount: number;
  draftValidationError: string | null;
  setDraftRoleLevel: (
    roleId: string,
    sectionId: string,
    level: SectionLevel,
    alsoTickDecisionId?: string,
  ) => void;
  toggleDraftDecision: (roleId: string, decisionId: string) => void;
  renameOrDescribeDraftRole: (
    roleId: string,
    name: string,
    description: string,
  ) => void;
  addDraftRole: (name: string, copyFromRoleId: string | null) => RoleRecord;
  duplicateDraftRole: (sourceRoleId: string) => RoleRecord | null;
  archiveDraftRole: (roleId: string) => void;
  restoreArchivedDraftRole: (roleId: string) => void;
  discardRoleDraft: () => void;
  saveRoleDraft: () => Promise<boolean>;
  savingRoles: boolean;

  // People mutations (immediate effect)
  refreshBootstrap: () => Promise<void>;
  refreshRoster: () => Promise<void>;
  applyMemberUpdate: (
    member: TeamMemberRecord,
    historyEntry?: HistoryEntryRecord | HistoryEntryRecord[] | null,
  ) => void;
  applyInviteCancelled: (
    result: {
      removed: boolean;
      personId?: string;
      member?: TeamMemberRecord;
      historyEntry?: HistoryEntryRecord;
    },
  ) => void;

  // Preview Mode (Spec 8)
  preview: PreviewState;
  startPreviewRole: (
    roleId: string,
    options?: {
      personId?: string | null;
      personFirstName?: string | null;
      returnTab?: TeamPermissionsTab;
      returnPersonId?: string | null;
    },
  ) => void;
  switchPreviewRole: (roleId: string) => void;
  stopPreview: (overrideReturnTab?: TeamPermissionsTab) => void;

  // Enforcement Helpers (Spec 9)
  canOpenSection: (sectionId: string) => boolean;
  canEditSection: (sectionId: string) => boolean;
  getSectionLevel: (sectionId: string) => SectionLevel;
  hasDecision: (decisionId: string) => boolean;
  getFirstOpenSection: () => string;
  refuseDecision: (decisionId: string) => void;
  refuseDoor: (sectionId: string) => void;
  refuseViewOnlySave: (sectionId: string) => void;

  // Toast (Spec 4.3)
  toast: PanelToastMessage | null;
  showPanelToast: (payload: Omit<PanelToastMessage, "id">) => void;
  dismissPanelToast: () => void;

  // Team lists elsewhere in panel (Spec 9.9)
  getTeamNamesFor: (
    requirement:
      | { kind: "section"; sectionId: string }
      | { kind: "decision"; decisionId: string },
    existingValue?: string | null,
  ) => Array<{ value: string; label: string; isHistorical?: boolean }>;
  getSignedByLabel: () => string;
}

const TeamPermissionsContext =
  createContext<TeamPermissionsContextValue | null>(null);

const DEFAULT_FOUNDER_PERMISSIONS: EffectivePermissions =
  computeEffectivePermissions({
    roleId: FOUNDER_ROLE_ID,
    name: "Founder",
    isFixed: true,
  });

export const TeamPermissionsProvider: React.FC<{
  adminSession: authApi.AdminSession | null;
  currentView: string;
  onNavigateView: (view: string) => void;
  onSessionRefresh?: (updatedAdmin: any) => void;
  children: React.ReactNode;
}> = ({
  adminSession,
  currentView,
  onNavigateView,
  onSessionRefresh,
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [bootstrappedFounder, setBootstrappedFounder] = useState(false);
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [members, setMembers] = useState<TeamMemberRecord[]>([]);
  const [history, setHistory] = useState<HistoryEntryRecord[]>([]);
  const [currentPersonId, setCurrentPersonId] = useState<string | null>(
    adminSession?.admin?.personId || null,
  );

  // Remember last used tab (Spec 4.2)
  const [activeTab, setActiveTabState] = useState<TeamPermissionsTab>("team");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [showPastMembers, setShowPastMembers] = useState(false);
  const [flashingPersonId, setFlashingPersonId] = useState<string | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  // Draft state for Roles tab
  const [draftRolesState, setDraftRolesState] = useState<RoleRecord[] | null>(
    null,
  );
  const [savingRoles, setSavingRoles] = useState(false);

  // Preview state
  const [preview, setPreview] = useState<PreviewState>({
    active: false,
    roleId: "",
    personId: null,
    personFirstName: null,
    returnTab: "roles",
    returnPersonId: null,
  });

  // Panel Toast (Spec 4.3)
  const [toast, setToast] = useState<PanelToastMessage | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const dismissPanelToast = useCallback(() => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
  }, []);

  const showPanelToast = useCallback(
    (payload: Omit<PanelToastMessage, "id">) => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      const next: PanelToastMessage = { ...payload, id: Date.now() };
      setToast(next);
      toastTimerRef.current = window.setTimeout(() => {
        setToast(null);
        toastTimerRef.current = null;
      }, 7000);
    },
    [],
  );

  const triggerRowFlash = useCallback((personId: string) => {
    if (flashTimerRef.current) {
      window.clearTimeout(flashTimerRef.current);
    }
    setFlashingPersonId(personId);
    flashTimerRef.current = window.setTimeout(() => {
      setFlashingPersonId(null);
      flashTimerRef.current = null;
    }, 1800);
  }, []);

  const refreshBootstrap = useCallback(async () => {
    if (!adminSession?.token) return;
    try {
      const data = await tpApi.getTeamBootstrap();
      setRoles(data.roles || []);
      setMembers(data.members || []);
      setHistory(data.history || []);
      if (data.currentPersonId) setCurrentPersonId(data.currentPersonId);
      setBootstrappedFounder(true);
    } catch {
      // Non-founders will receive 403 on bootstrap; fall back to roster
    }
  }, [adminSession?.token]);

  const refreshRoster = useCallback(async () => {
    if (!adminSession?.token) return;
    try {
      const data = await tpApi.getTeamRoster();
      setRoles(data.roles || []);
      setMembers(
        (data.members || []).map((m) => ({
          ...m,
          workEmail: "",
          whatsappNumber: "",
        })),
      );
      if (data.currentPersonId) setCurrentPersonId(data.currentPersonId);
    } catch {
      // ignore
    }
  }, [adminSession?.token]);

  // Initial load on sign in
  useEffect(() => {
    let mounted = true;
    if (!adminSession?.token) {
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const me = await authApi.getMe().catch(() => null);
        if (!mounted) return;
        const isFounder =
          me?.admin?.isFounder ?? adminSession?.admin?.isFounder ?? true;
        if (me?.admin && onSessionRefresh) {
          onSessionRefresh(me.admin);
        }
        if (me?.person?.personId) {
          setCurrentPersonId(me.person.personId);
        }
        if (isFounder) {
          await refreshBootstrap();
        } else {
          await refreshRoster();
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [adminSession?.token]);

  // Spec 4.6: Leaving Team & Permissions closes the person panel
  useEffect(() => {
    if (currentView !== "roles_permissions") {
      setSelectedPersonId(null);
    }
  }, [currentView]);

  const setActiveTab = useCallback((tab: TeamPermissionsTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const currentPerson = useMemo(() => {
    if (currentPersonId) {
      const found = members.find((m) => m.personId === currentPersonId);
      if (found) return found;
    }
    const emailLower = String(adminSession?.admin?.email || "").toLowerCase();
    return (
      members.find(
        (m) => String(m.workEmail || "").toLowerCase() === emailLower,
      ) || null
    );
  }, [members, currentPersonId, adminSession?.admin?.email]);

  const currentRole = useMemo(() => {
    const rid =
      currentPerson?.roleId ||
      adminSession?.admin?.roleId ||
      FOUNDER_ROLE_ID;
    return roles.find((r) => r.roleId === rid) || null;
  }, [roles, currentPerson, adminSession?.admin?.roleId]);

  const actualPermissions = useMemo<EffectivePermissions>(() => {
    if (currentRole) {
      return computeEffectivePermissions(currentRole);
    }
    if (adminSession?.admin?.permissions) {
      return adminSession.admin.permissions;
    }
    return DEFAULT_FOUNDER_PERMISSIONS;
  }, [currentRole, adminSession?.admin?.permissions]);

  const effectivePermissions = useMemo<EffectivePermissions>(() => {
    if (preview.active && actualPermissions.isFounder) {
      const targetRole = roles.find(
        (r) => r.roleId === preview.roleId && !r.archived,
      );
      if (targetRole) {
        return computeEffectivePermissions(targetRole);
      }
    }
    return actualPermissions;
  }, [preview, actualPermissions, roles]);

  // --- Draft Roles logic (Spec 6.5) ---
  const draftRoles = useMemo(
    () => draftRolesState ?? roles,
    [draftRolesState, roles],
  );

  const updateDraft = useCallback(
    (updater: (prev: RoleRecord[]) => RoleRecord[]) => {
      setDraftRolesState((prev) => {
        const base =
          prev ??
          roles.map((r) => ({
            ...r,
            levels: { ...r.levels },
            rawLevels: { ...r.rawLevels },
            decisions: [...r.decisions],
            rawDecisions: [...r.rawDecisions],
          }));
        return updater(base);
      });
    },
    [roles],
  );

  const {
    hasUnsavedRoleChanges,
    changedCellKeys,
    changedRoleIds,
    changedRoleNames,
    unsavedChangeCount,
    draftValidationError,
  } = useMemo(() => {
    if (!draftRolesState) {
      return {
        hasUnsavedRoleChanges: false,
        changedCellKeys: new Set<string>(),
        changedRoleIds: new Set<string>(),
        changedRoleNames: [] as string[],
        unsavedChangeCount: 0,
        draftValidationError: null as string | null,
      };
    }

    const savedById = new Map(roles.map((r) => [r.roleId, r]));
    const cellKeys = new Set<string>();
    const roleIds = new Set<string>();
    const roleNames: string[] = [];
    let count = 0;

    for (const dr of draftRolesState) {
      if (dr.isFixed || dr.roleId === FOUNDER_ROLE_ID) continue;
      const saved = savedById.get(dr.roleId);
      let roleTouched = false;

      if (!saved) {
        if (!dr.archived) {
          roleTouched = true;
          count += 1;
        }
      } else {
        if (Boolean(dr.archived) !== Boolean(saved.archived)) {
          roleTouched = true;
          count += 1;
        }
        if (String(dr.name || "").trim() !== String(saved.name || "").trim()) {
          roleTouched = true;
          count += 1;
        }
        if (
          String(dr.description || "").trim() !==
          String(saved.description || "").trim()
        ) {
          roleTouched = true;
          count += 1;
        }
        for (const sec of SECTIONS) {
          if (!sec.inRolesTable) continue;
          const prevLvl = saved.levels[sec.id] || "Hidden";
          const nextLvl = dr.levels[sec.id] || "Hidden";
          if (prevLvl !== nextLvl) {
            cellKeys.add(`${dr.roleId}:sec:${sec.id}`);
            roleTouched = true;
            count += 1;
          }
        }
        const prevDecs = new Set(saved.decisions || []);
        const nextDecs = new Set(dr.decisions || []);
        for (const dec of DECISIONS) {
          if (prevDecs.has(dec.id) !== nextDecs.has(dec.id)) {
            cellKeys.add(`${dr.roleId}:dec:${dec.id}`);
            roleTouched = true;
            count += 1;
          }
        }
      }

      if (roleTouched) {
        roleIds.add(dr.roleId);
        roleNames.push(String(dr.name || "").trim() || "Untitled role");
      }
    }

    // Validate active roles in draft (Spec 6.5)
    let validationErr: string | null = null;
    const activeNames = new Set<string>();
    for (const dr of draftRolesState) {
      if (dr.archived) continue;
      const nm = String(dr.name || "").trim();
      if (!nm) {
        validationErr = "A role needs a name.";
        break;
      }
      const lower = nm.toLowerCase();
      if (activeNames.has(lower)) {
        validationErr = `Two roles are called “${nm}”.`;
        break;
      }
      activeNames.add(lower);
    }

    return {
      hasUnsavedRoleChanges: count > 0,
      changedCellKeys: cellKeys,
      changedRoleIds: roleIds,
      changedRoleNames: roleNames,
      unsavedChangeCount: count,
      draftValidationError: validationErr,
    };
  }, [draftRolesState, roles]);

  const setDraftRoleLevel = useCallback(
    (
      roleId: string,
      sectionId: string,
      level: SectionLevel,
      alsoTickDecisionId?: string,
    ) => {
      updateDraft((prev) =>
        prev.map((r) => {
          if (r.roleId !== roleId || r.isFixed) return r;
          const clamped = clampSectionLevel(sectionId, level);
          const nextRawLevels = { ...r.rawLevels, [sectionId]: clamped };
          let nextRawDecisions = [...r.rawDecisions];
          if (alsoTickDecisionId && clamped === "Edit") {
            if (!nextRawDecisions.includes(alsoTickDecisionId)) {
              nextRawDecisions.push(alsoTickDecisionId);
            }
          }
          // Spec 6.3: dropping below Edit clears decisions that no longer have a section to stand on
          nextRawDecisions = DECISIONS.filter((dec) => {
            if (!nextRawDecisions.includes(dec.id)) return false;
            if (!dec.needsEditOn || dec.needsEditOn.length === 0) return true;
            return dec.needsEditOn.some((sId) => nextRawLevels[sId] === "Edit");
          }).map((d) => d.id);

          const eff = computeEffectivePermissions({
            ...r,
            rawLevels: nextRawLevels,
            rawDecisions: nextRawDecisions,
          });
          return {
            ...r,
            rawLevels: nextRawLevels,
            levels: eff.levels,
            rawDecisions: nextRawDecisions,
            decisions: eff.decisions,
            openSectionsCount: eff.openSectionsCount,
          };
        }),
      );
    },
    [updateDraft],
  );

  const toggleDraftDecision = useCallback(
    (roleId: string, decisionId: string) => {
      updateDraft((prev) =>
        prev.map((r) => {
          if (r.roleId !== roleId || r.isFixed) return r;
          const exists = r.rawDecisions.includes(decisionId);
          const nextRawDecisions = exists
            ? r.rawDecisions.filter((d) => d !== decisionId)
            : [...r.rawDecisions, decisionId];
          const eff = computeEffectivePermissions({
            ...r,
            rawDecisions: nextRawDecisions,
          });
          return {
            ...r,
            rawDecisions: nextRawDecisions,
            decisions: eff.decisions,
          };
        }),
      );
    },
    [updateDraft],
  );

  const renameOrDescribeDraftRole = useCallback(
    (roleId: string, name: string, description: string) => {
      updateDraft((prev) =>
        prev.map((r) =>
          r.roleId === roleId && !r.isFixed
            ? { ...r, name: name.trim(), description: description.trim() }
            : r,
        ),
      );
    },
    [updateDraft],
  );

  const addDraftRole = useCallback(
    (name: string, copyFromRoleId: string | null): RoleRecord => {
      const cleanName = name.trim();
      const source = copyFromRoleId
        ? draftRoles.find((r) => r.roleId === copyFromRoleId)
        : null;

      const rawLevels: Record<string, SectionLevel> = {};
      for (const sec of SECTIONS) {
        if (!sec.inRolesTable) continue;
        rawLevels[sec.id] = source
          ? source.levels[sec.id] || "Hidden"
          : "Hidden";
      }
      const rawDecisions = source ? [...source.decisions] : [];
      const draftId = `draft_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const eff = computeEffectivePermissions({
        roleId: draftId,
        name: cleanName,
        rawLevels,
        rawDecisions,
      });

      const newRole: RoleRecord = {
        roleId: draftId,
        name: cleanName,
        description: source?.description || "",
        colour: source?.colour || "#8A7E72",
        isFixed: false,
        archived: false,
        sortOrder: draftRoles.length,
        levels: eff.levels,
        rawLevels,
        decisions: eff.decisions,
        rawDecisions,
        openSectionsCount: eff.openSectionsCount,
      };

      updateDraft((prev) => [...prev, newRole]);
      return newRole;
    },
    [draftRoles, updateDraft],
  );

  const duplicateDraftRole = useCallback(
    (sourceRoleId: string): RoleRecord | null => {
      const source = draftRoles.find((r) => r.roleId === sourceRoleId);
      if (!source || source.isFixed) return null;
      const existingLower = new Set(
        draftRoles
          .filter((r) => !r.archived)
          .map((r) => r.name.trim().toLowerCase()),
      );
      let candidate = `Copy of ${source.name}`;
      let idx = 2;
      while (existingLower.has(candidate.toLowerCase())) {
        candidate = `Copy of ${source.name} (${idx})`;
        idx += 1;
      }
      return addDraftRole(candidate, source.roleId);
    },
    [draftRoles, addDraftRole],
  );

  const archiveDraftRole = useCallback(
    (roleId: string) => {
      updateDraft((prev) =>
        prev.flatMap((r) => {
          if (r.roleId !== roleId || r.isFixed) return [r];
          // Spec 6.8: A new role that was never saved is simply dropped
          const existsInSaved = roles.some((sr) => sr.roleId === roleId);
          if (!existsInSaved) return [];
          return [{ ...r, archived: true }];
        }),
      );
    },
    [roles, updateDraft],
  );

  const restoreArchivedDraftRole = useCallback(
    (roleId: string) => {
      updateDraft((prev) =>
        prev.map((r) => (r.roleId === roleId ? { ...r, archived: false } : r)),
      );
    },
    [updateDraft],
  );

  const discardRoleDraft = useCallback(() => {
    setDraftRolesState(null);
  }, []);

  const saveRoleDraft = useCallback(async (): Promise<boolean> => {
    if (!draftRolesState || savingRoles) return false;
    if (draftValidationError) {
      showPanelToast({
        boldPrefix: draftValidationError,
        message: "",
      });
      return false;
    }
    setSavingRoles(true);
    try {
      const res = await tpApi.saveRolesBatch(draftRolesState);
      setRoles(res.roles);
      if (Array.isArray(res.historyEntries) && res.historyEntries.length > 0) {
        setHistory((prev) => [...res.historyEntries, ...prev]);
      }
      setDraftRolesState(null);
      const n = res.changeCount;
      showPanelToast({
        boldPrefix: "Saved.",
        message: `${n} ${n === 1 ? "change" : "changes"} now in force for everyone who holds the role. Each is in History.`,
      });
      return true;
    } catch (err: any) {
      showPanelToast({
        boldPrefix: "Could not save.",
        message: err?.message || "Please check your role changes.",
      });
      return false;
    } finally {
      setSavingRoles(false);
    }
  }, [draftRolesState, savingRoles, draftValidationError, showPanelToast]);

  // --- People immediate updates ---
  const applyMemberUpdate = useCallback(
    (
      member: TeamMemberRecord,
      historyEntry?: HistoryEntryRecord | HistoryEntryRecord[] | null,
    ) => {
      setMembers((prev) => {
        const exists = prev.some((m) => m.personId === member.personId);
        return exists
          ? prev.map((m) => (m.personId === member.personId ? member : m))
          : [...prev, member];
      });
      if (historyEntry) {
        const entries = Array.isArray(historyEntry)
          ? historyEntry
          : [historyEntry];
        if (entries.length > 0) {
          setHistory((prev) => [...entries, ...prev]);
        }
      }
    },
    [],
  );

  const applyInviteCancelled = useCallback(
    (result: {
      removed: boolean;
      personId?: string;
      member?: TeamMemberRecord;
      historyEntry?: HistoryEntryRecord;
    }) => {
      if (result.removed && result.personId) {
        setMembers((prev) =>
          prev.filter((m) => m.personId !== result.personId),
        );
      } else if (result.member) {
        setMembers((prev) =>
          prev.map((m) =>
            m.personId === result.member!.personId ? result.member! : m,
          ),
        );
      }
      if (result.historyEntry) {
        setHistory((prev) => [result.historyEntry!, ...prev]);
      }
    },
    [],
  );

  // --- Section & Decision Enforcement Helpers ---
  const getSectionLevel = useCallback(
    (sectionId: string): SectionLevel => {
      const govId = resolveViewPermissionSection(sectionId);
      if (effectivePermissions.isFounder) {
        return SECTION_BY_ID[govId]?.maxLevel || "Edit";
      }
      if (govId === "roles_permissions") return "Hidden";
      return effectivePermissions.levels[govId] || "Hidden";
    },
    [effectivePermissions],
  );

  const canOpenSection = useCallback(
    (sectionId: string) => getSectionLevel(sectionId) !== "Hidden",
    [getSectionLevel],
  );

  const canEditSection = useCallback(
    (sectionId: string) => getSectionLevel(sectionId) === "Edit",
    [getSectionLevel],
  );

  const hasDecision = useCallback(
    (decisionId: string) =>
      effectivePermissions.isFounder ||
      effectivePermissions.decisions.includes(decisionId),
    [effectivePermissions],
  );

  const getFirstOpenSectionForPerms = useCallback(
    (perms: EffectivePermissions): string => {
      if (perms.isFounder) return "dashboard";
      for (const sec of SECTIONS) {
        if (sec.founderOnly) continue;
        if ((perms.levels[sec.id] || "Hidden") !== "Hidden") {
          return sec.id;
        }
      }
      return "dashboard";
    },
    [],
  );

  const getFirstOpenSection = useCallback(
    () => getFirstOpenSectionForPerms(effectivePermissions),
    [effectivePermissions, getFirstOpenSectionForPerms],
  );

  // --- Preview Mode (Spec 8) ---
  const stopPreview = useCallback(
    (overrideReturnTab?: TeamPermissionsTab) => {
      const targetTab = overrideReturnTab || preview.returnTab || "roles";
      const targetPerson = overrideReturnTab ? null : preview.returnPersonId;
      setPreview({
        active: false,
        roleId: "",
        personId: null,
        personFirstName: null,
        returnTab: "roles",
        returnPersonId: null,
      });
      setActiveTabState(targetTab);
      setSelectedPersonId(targetPerson);
      onNavigateView("roles_permissions");
    },
    [preview.returnTab, preview.returnPersonId, onNavigateView],
  );

  const startPreviewRole = useCallback(
    (
      roleId: string,
      options?: {
        personId?: string | null;
        personFirstName?: string | null;
        returnTab?: TeamPermissionsTab;
        returnPersonId?: string | null;
      },
    ) => {
      if (!actualPermissions.isFounder) return;
      if (hasUnsavedRoleChanges) {
        showPanelToast({
          boldPrefix: "Save or discard your changes first,",
          message: "so the preview shows what is really in force.",
        });
        return;
      }
      const targetRole = roles.find(
        (r) => r.roleId === roleId && !r.archived && !r.isFixed,
      );
      if (!targetRole) return;
      const targetPerms = computeEffectivePermissions(targetRole);
      const firstOpen = getFirstOpenSectionForPerms(targetPerms);

      setPreview({
        active: true,
        roleId: targetRole.roleId,
        personId: options?.personId || null,
        personFirstName: options?.personFirstName || null,
        returnTab: options?.returnTab || (options?.personId ? "team" : "roles"),
        returnPersonId: options?.returnPersonId || null,
      });
      onNavigateView(firstOpen);
    },
    [
      actualPermissions.isFounder,
      hasUnsavedRoleChanges,
      roles,
      showPanelToast,
      getFirstOpenSectionForPerms,
      onNavigateView,
    ],
  );

  const switchPreviewRole = useCallback(
    (nextRoleId: string) => {
      if (!preview.active) return;
      const targetRole = roles.find(
        (r) => r.roleId === nextRoleId && !r.archived && !r.isFixed,
      );
      if (!targetRole) return;
      const targetPerms = computeEffectivePermissions(targetRole);
      const personStillHoldsRole = preview.personId
        ? members.some(
            (m) => m.personId === preview.personId && m.roleId === nextRoleId,
          )
        : false;

      setPreview((prev) => ({
        ...prev,
        roleId: nextRoleId,
        personId: personStillHoldsRole ? prev.personId : null,
        personFirstName: personStillHoldsRole ? prev.personFirstName : null,
      }));

      const govCurrent = resolveViewPermissionSection(currentView);
      if ((targetPerms.levels[govCurrent] || "Hidden") === "Hidden") {
        onNavigateView(getFirstOpenSectionForPerms(targetPerms));
      }
    },
    [
      preview.active,
      preview.personId,
      roles,
      members,
      currentView,
      onNavigateView,
      getFirstOpenSectionForPerms,
    ],
  );

  // --- Refusal Toasts (Spec 9.5) ---
  const refuseDecision = useCallback(
    (decisionId: string) => {
      const dec = DECISION_BY_ID[decisionId];
      if (!dec) return;
      const roleName = effectivePermissions.roleName || "this role";
      if (preview.active) {
        showPanelToast({
          boldPrefix: dec.label,
          message: `is not one of the decisions this role (${roleName}) holds. ${dec.askLine}`,
          actionLabel: `Stop the preview and change what ${roleName} can decide`,
          onAction: () => {
            dismissPanelToast();
            stopPreview("roles");
          },
        });
      } else {
        showPanelToast({
          boldPrefix: dec.label,
          message: `is not one of the decisions your role (${roleName}) holds. ${dec.askLine} A Founder can change this in Team & Permissions.`,
        });
      }
    },
    [effectivePermissions.roleName, preview.active, showPanelToast, dismissPanelToast, stopPreview],
  );

  const refuseDoor = useCallback(
    (sectionId: string) => {
      const sec = SECTION_BY_ID[sectionId];
      const secLabel = sec?.label || sectionId;
      const roleName = effectivePermissions.roleName || "this role";
      const currentLvl = getSectionLevel(sectionId);
      const pronoun = preview.active ? "This role" : "Your role";
      const detail =
        currentLvl === "View"
          ? `${pronoun} (${roleName}) can view ${secLabel} but not change it.`
          : `${pronoun} (${roleName}) does not include ${secLabel}.`;

      if (preview.active) {
        showPanelToast({
          boldPrefix: `This needs Edit on ${secLabel}.`,
          message: detail,
          actionLabel: `Stop the preview and change what ${roleName} can open`,
          onAction: () => {
            dismissPanelToast();
            stopPreview("roles");
          },
        });
      } else {
        showPanelToast({
          boldPrefix: `This needs Edit on ${secLabel}.`,
          message: `${detail} A Founder can change this in Team & Permissions.`,
        });
      }
    },
    [effectivePermissions.roleName, getSectionLevel, preview.active, showPanelToast, dismissPanelToast, stopPreview],
  );

  const refuseViewOnlySave = useCallback(
    (sectionId: string) => {
      const secLabel = SECTION_BY_ID[sectionId]?.label || sectionId;
      const roleName = effectivePermissions.roleName || "this role";
      showPanelToast({
        boldPrefix: "View only.",
        message: `Your role (${roleName}) can view ${secLabel} but not change it.`,
      });
    },
    [effectivePermissions.roleName, showPanelToast],
  );

  // --- Team lists elsewhere in the panel (Spec 9.9) ---
  const getTeamNamesFor = useCallback(
    (
      requirement:
        | { kind: "section"; sectionId: string }
        | { kind: "decision"; decisionId: string },
      existingValue?: string | null,
    ) => {
      const roleMap = new Map(
        roles.map((r) => [r.roleId, computeEffectivePermissions(r)]),
      );

      const matchesReq = (m: TeamMemberRecord) => {
        if (m.status !== "Active") return false;
        const perms = roleMap.get(m.roleId);
        if (!perms) return false;
        if (requirement.kind === "section") {
          return perms.levels[requirement.sectionId] === "Edit";
        }
        return (
          perms.isFounder || perms.decisions.includes(requirement.decisionId)
        );
      };

      const eligible = members.filter(matchesReq);
      // Signed-in person first if in list, Founders last, otherwise alphabetical
      const signedInId = currentPerson?.personId;
      eligible.sort((a, b) => {
        const aSelf = a.personId === signedInId ? 0 : 1;
        const bSelf = b.personId === signedInId ? 0 : 1;
        if (aSelf !== bSelf) return aSelf - bSelf;
        const aFnd = a.roleId === FOUNDER_ROLE_ID ? 1 : 0;
        const bFnd = b.roleId === FOUNDER_ROLE_ID ? 1 : 0;
        if (aFnd !== bFnd) return aFnd - bFnd;
        return a.shownOnRecordsAs.localeCompare(b.shownOnRecordsAs);
      });

      const list: Array<{
        value: string;
        label: string;
        isHistorical?: boolean;
      }> = eligible.map((m) => ({
        value: m.shownOnRecordsAs,
        label: m.shownOnRecordsAs,
      }));

      // Preserve existing historical name on an old record (Spec 9.9)
      const trimmedExisting = String(existingValue || "").trim();
      if (
        trimmedExisting &&
        trimmedExisting !== "Unassigned" &&
        !list.some(
          (it) => it.value.toLowerCase() === trimmedExisting.toLowerCase(),
        )
      ) {
        const matchedMember = members.find((m) => {
          const aliases = [
            m.shownOnRecordsAs,
            ...(m.olderSpellings || []),
          ].map((s) => String(s || "").trim().toLowerCase());
          return aliases.includes(trimmedExisting.toLowerCase());
        });

        let suffix = " (cannot do this now)";
        if (matchedMember) {
          if (matchedMember.status === "Left") suffix = " (left the team)";
          else if (matchedMember.status === "Paused")
            suffix = " (access paused)";
        }
        list.push({
          value: trimmedExisting,
          label: `${trimmedExisting}${suffix}`,
          isHistorical: true,
        });
      }

      return list;
    },
    [roles, members, currentPerson?.personId],
  );

  // Spec 9.9: "{name} ({role})", e.g. "Soumya (Founder)"
  const getSignedByLabel = useCallback(() => {
    const name =
      currentPerson?.shownOnRecordsAs ||
      getFirstName(currentPerson?.fullName || adminSession?.admin?.name || "Soumya") ||
      "Soumya";
    const roleName = actualPermissions.roleName || "Founder";
    return `${name} (${roleName})`;
  }, [
    currentPerson?.shownOnRecordsAs,
    currentPerson?.fullName,
    adminSession?.admin?.name,
    actualPermissions.roleName,
  ]);

  const value: TeamPermissionsContextValue = {
    loading,
    bootstrappedFounder,
    roles,
    members,
    history,
    currentPerson,
    currentRole,
    actualPermissions,
    effectivePermissions,
    activeTab,
    setActiveTab,
    selectedPersonId,
    setSelectedPersonId,
    showPastMembers,
    setShowPastMembers,
    flashingPersonId,
    triggerRowFlash,
    draftRoles,
    hasUnsavedRoleChanges,
    changedCellKeys,
    changedRoleIds,
    changedRoleNames,
    unsavedChangeCount,
    draftValidationError,
    setDraftRoleLevel,
    toggleDraftDecision,
    renameOrDescribeDraftRole,
    addDraftRole,
    duplicateDraftRole,
    archiveDraftRole,
    restoreArchivedDraftRole,
    discardRoleDraft,
    saveRoleDraft,
    savingRoles,
    refreshBootstrap,
    refreshRoster,
    applyMemberUpdate,
    applyInviteCancelled,
    preview,
    startPreviewRole,
    switchPreviewRole,
    stopPreview,
    canOpenSection,
    canEditSection,
    getSectionLevel,
    hasDecision,
    getFirstOpenSection,
    refuseDecision,
    refuseDoor,
    refuseViewOnlySave,
    toast,
    showPanelToast,
    dismissPanelToast,
    getTeamNamesFor,
    getSignedByLabel,
  };

  return (
    <TeamPermissionsContext.Provider value={value}>
      {children}
    </TeamPermissionsContext.Provider>
  );
};

export function useTeamPermissions() {
  const ctx = useContext(TeamPermissionsContext);
  if (!ctx) {
    throw new Error(
      "useTeamPermissions must be used inside TeamPermissionsProvider",
    );
  }
  return ctx;
}

export { joinWithAnd, getFirstName };
