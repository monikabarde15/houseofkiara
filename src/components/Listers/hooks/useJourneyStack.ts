// src/components/Listers/hooks/useJourneyStack.ts

import { useState, useCallback } from 'react';

interface JourneyState {
  type: 'section' | 'detail';
  id: string;
  tab?: string;
  scroll?: number;
}

interface JourneyStack {
  states: JourneyState[];
  currentIndex: number;
}

export const useJourneyStack = () => {
  const [stack, setStack] = useState<JourneyStack>({
    states: [],
    currentIndex: -1,
  });

  const pushState = useCallback((state: JourneyState) => {
    setStack(prev => {
      // Remove any forward states if we're not at the end
      const newStates = prev.states.slice(0, prev.currentIndex + 1);
      newStates.push(state);
      return {
        states: newStates,
        currentIndex: newStates.length - 1,
      };
    });
  }, []);

  const goBack = useCallback(() => {
    setStack(prev => {
      if (prev.currentIndex <= 0) return prev;
      return {
        ...prev,
        currentIndex: prev.currentIndex - 1,
      };
    });
  }, []);

  const goForward = useCallback(() => {
    setStack(prev => {
      if (prev.currentIndex >= prev.states.length - 1) return prev;
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
      };
    });
  }, []);

  const getCurrentState = useCallback(() => {
    if (stack.currentIndex < 0 || stack.currentIndex >= stack.states.length) {
      return null;
    }
    return stack.states[stack.currentIndex];
  }, [stack]);

  const getBackDestination = useCallback(() => {
    if (stack.currentIndex <= 0 || stack.currentIndex >= stack.states.length) {
      return '';
    }
    const prevState = stack.states[stack.currentIndex - 1];
    if (prevState.type === 'section') {
      // Capitalize section name
      return prevState.id.charAt(0).toUpperCase() + prevState.id.slice(1);
    }
    return prevState.id; // For details, use the entity name
  }, [stack]);

  const canGoBack = stack.currentIndex > 0;
  const canGoForward = stack.currentIndex < stack.states.length - 1;

  const updateCurrentState = useCallback((updates: Partial<JourneyState>) => {
    setStack(prev => {
      if (prev.currentIndex < 0 || prev.currentIndex >= prev.states.length) {
        return prev;
      }
      const newStates = [...prev.states];
      newStates[prev.currentIndex] = {
        ...newStates[prev.currentIndex],
        ...updates,
      };
      return {
        ...prev,
        states: newStates,
      };
    });
  }, []);

  const saveScroll = useCallback((scroll: number) => {
    updateCurrentState({ scroll });
  }, [updateCurrentState]);

  const getSavedScroll = useCallback(() => {
    const current = getCurrentState();
    return current?.scroll || 0;
  }, [getCurrentState]);

  const clearStack = useCallback(() => {
    setStack({
      states: [],
      currentIndex: -1,
    });
  }, []);

  return {
    pushState,
    goBack,
    goForward,
    getCurrentState,
    getBackDestination,
    updateCurrentState,
    saveScroll,
    getSavedScroll,
    clearStack,
    canGoBack,
    canGoForward,
    currentState: getCurrentState(),
  };
};

export default useJourneyStack;