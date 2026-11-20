// src/components/LYP/hooks/useDesignerRecognition.ts

import { useState, useEffect, useCallback } from "react";
import { getDesigners } from "../../../services/designerApi";

interface DesignerProfile {
  id: string;
  name: string;
  risk: "High" | "Medium" | "Low" | null;
  authenticationNotes: string | null;
}

export const useDesignerRecognition = (query: string) => {
  const [dbDesigners, setDbDesigners] = useState<DesignerProfile[]>([]);
  const [matches, setMatches] = useState<DesignerProfile[]>([]);
  const [isMapped, setIsMapped] = useState<boolean | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<DesignerProfile | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    getDesigners()
      .then((list) => {
        if (!active || !Array.isArray(list)) return;
        const mapped: DesignerProfile[] = list
          .filter(
            (d: any) =>
              d &&
              d.name &&
              String(d.name).trim() !== "" &&
              d.status !== "Suspended" &&
              d.status !== "Inactive",
          )
          .map((d: any) => ({
            id: String(d.id || d.designerId || d._id || d.name),
            name: String(d.name).trim(),
            risk: (d.counterfeitRiskTier || d.riskTier || "Low") as
              | "High"
              | "Medium"
              | "Low",
            authenticationNotes:
              d.authenticationChecklist || d.checklist || null,
          }));
        setDbDesigners(mapped);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const searchDesigners = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery || searchQuery.trim().length < 1) {
        setMatches([]);
        setIsMapped(null);
        setMatchedProfile(null);
        return;
      }

      setLoading(true);
      try {
        const lower = searchQuery.toLowerCase().trim();
        const filtered = dbDesigners.filter((p) =>
          (p.name || "").toLowerCase().includes(lower),
        );
        setMatches(filtered);

        const exact = dbDesigners.find(
          (p) => (p.name || "").toLowerCase() === lower,
        );
        if (exact) {
          setIsMapped(true);
          setMatchedProfile(exact);
        } else {
          setIsMapped(false);
          setMatchedProfile(null);
        }
      } catch (error) {
        console.error("Failed to search designers:", error);
      } finally {
        setLoading(false);
      }
    },
    [dbDesigners],
  );

  useEffect(() => {
    searchDesigners(query);
  }, [query, searchDesigners]);

  const getRiskColor = useCallback(
    (risk: "High" | "Medium" | "Low" | null): string => {
      if (risk === "High") return "terra";
      if (risk === "Medium") return "#6B5730";
      if (risk === "Low") return "sage";
      return "muted";
    },
    [],
  );

  const getRiskLabel = useCallback(
    (risk: "High" | "Medium" | "Low" | null): string => {
      if (risk === "High") return "HIGH-RISK";
      if (risk === "Medium") return "MEDIUM-RISK";
      if (risk === "Low") return "LOW-RISK";
      return "";
    },
    [],
  );

  return {
    matches,
    isMapped,
    matchedProfile,
    loading,
    searchDesigners,
    getRiskColor,
    getRiskLabel,
  };
};
