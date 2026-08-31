// src/components/Notifications/hooks/useNarrowing.ts
import { useCallback, useMemo, useState } from 'react';
import { BandKey, NarrowingState } from '../types/notification.types';

/**
 * §28 — narrowing to a band and/or a person. This is purely a client-side
 * view state: it HIDES, never subtracts (§28.2), is never sent to the
 * server, and does not survive a reload (§28.9) — it's cleared by a fresh
 * start from the sidebar, but carried across a Back-trail return.
 */
export function useNarrowing() {
  const [narrowing, setNarrowing] = useState<NarrowingState>({ band: null, person: null });

  // §28.1 — clicking the same band figure/header again shows everything.
  const toggleBand = useCallback((band: BandKey) => {
    setNarrowing((prev) => ({
      ...prev,
      band: prev.band === band ? null : band,
    }));
  }, []);

  // §28.1 — a person chip narrows to what they're carrying; clicking again clears it.
  const togglePerson = useCallback((person: string) => {
    setNarrowing((prev) => ({
      ...prev,
      person: prev.person === person ? null : person,
    }));
  }, []);

  // §28.1 — the total figure always clears, never sets, a narrowing.
  const clearAll = useCallback(() => {
    setNarrowing({ band: null, person: null });
  }, []);

  const isNarrowed = useMemo(
    () => narrowing.band !== null || narrowing.person !== null,
    [narrowing]
  );

  return { narrowing, toggleBand, togglePerson, clearAll, isNarrowed };
}