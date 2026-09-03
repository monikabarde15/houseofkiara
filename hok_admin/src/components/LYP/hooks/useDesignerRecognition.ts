// src/components/LYP/hooks/useDesignerRecognition.ts

import { useState, useEffect, useCallback } from 'react';

interface DesignerProfile {
  id: string;
  name: string;
  risk: 'High' | 'Medium' | 'Low' | null;
  authenticationNotes: string | null;
}

export const useDesignerRecognition = (query: string) => {
  const [matches, setMatches] = useState<DesignerProfile[]>([]);
  const [isMapped, setIsMapped] = useState<boolean | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<DesignerProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const searchDesigners = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setMatches([]);
      return;
    }

    setLoading(true);
    try {
      // In production, this would call the API
      // For now, simulate with mock data
      const mockProfiles: DesignerProfile[] = [
        { id: '1', name: 'Sabyasachi', risk: 'Low', authenticationNotes: 'Verified designer' },
        { id: '2', name: 'Manish Malhotra', risk: 'High', authenticationNotes: 'High risk brand' },
        { id: '3', name: 'Tarun Tahiliani', risk: 'Medium', authenticationNotes: 'Medium risk' },
      ];

      const filtered = mockProfiles.filter(p => 
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setMatches(filtered);

      // Check exact match
      const exact = mockProfiles.find(p => 
        (p.name || '').toLowerCase() === searchQuery.toLowerCase().trim()
      );
      if (exact) {
        setIsMapped(true);
        setMatchedProfile(exact);
      } else {
        setIsMapped(false);
        setMatchedProfile(null);
      }
    } catch (error) {
      console.error('Failed to search designers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    searchDesigners(query);
  }, [query, searchDesigners]);

  const getRiskColor = useCallback((risk: 'High' | 'Medium' | 'Low' | null): string => {
    if (risk === 'High') return 'terra';
    if (risk === 'Medium') return '#6B5730';
    if (risk === 'Low') return 'sage';
    return 'muted';
  }, []);

  const getRiskLabel = useCallback((risk: 'High' | 'Medium' | 'Low' | null): string => {
    if (risk === 'High') return 'HIGH-RISK';
    if (risk === 'Medium') return 'MEDIUM-RISK';
    if (risk === 'Low') return 'LOW-RISK';
    return '';
  }, []);

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