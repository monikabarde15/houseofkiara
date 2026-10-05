// src/components/Notifications/bands/NotifBandList.tsx
import React from "react";
import { AlertDef, BandKey, NarrowingState } from "../types/notification.types";
import { NotifBand } from "./NotifBand";

const BAND_ORDER: BandKey[] = ["today", "waiting", "them", "know", "blocked"];

interface NotifBandListProps {
  alertsByBand: Record<BandKey, AlertDef[]>;
  openRowKeys: Set<string>;
  onToggleRow: (alertKey: string) => void;
  narrowing: NarrowingState;
  onSelectBand: (band: BandKey) => void;
  currentUser: string;
  team: string[];
  onAssign: (recordId: string, to: string | null) => void;
  onPutDown: (alertKey: string) => void;
  canEdit: boolean;
}

/**
 * Blocks 4–8 (§3.2 / §7.1) — the five bands, always in this fixed order.
 * "Cannot be seen yet" renders only when it holds something (§7.1); on the
 * shipped build that's always empty, so this list naturally omits it without
 * any special-casing here — NotifBand just gets an empty alerts array.
 */
export function NotifBandList({
  alertsByBand,
  openRowKeys,
  onToggleRow,
  narrowing,
  onSelectBand,
  currentUser,
  team,
  onAssign,
  onPutDown,
  canEdit,
}: NotifBandListProps) {
  return (
    <>
      {BAND_ORDER.map((bandKey) => {
        const alerts = alertsByBand[bandKey] ?? [];
        if (bandKey === "blocked" && alerts.length === 0) return null; // §7.1

        return (
          <NotifBand
            key={bandKey}
            bandKey={bandKey}
            alerts={alerts}
            openRowKeys={openRowKeys}
            onToggleRow={onToggleRow}
            narrowing={narrowing}
            isNarrowedAway={
              narrowing.band !== null && narrowing.band !== bandKey
            }
            onSelectBand={() => onSelectBand(bandKey)}
            currentUser={currentUser}
            team={team}
            onAssign={onAssign}
            onPutDown={onPutDown}
            canEdit={canEdit}
          />
        );
      })}
    </>
  );
}
