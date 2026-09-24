import { useState, useCallback, useEffect } from 'react';

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

let globalStack: JourneyStack = {
  states: [],
  currentIndex: -1,
};

const listeners = new Set<() => void>();

export const useJourneyStack = () => {
  const [stack, setLocalStack] = useState<JourneyStack>(globalStack);

  useEffect(() => {
    const listener = () => {
      setLocalStack({ ...globalStack });
    };
    listeners.add(listener);
    // Initialize local state with current global stack
    setLocalStack({ ...globalStack });
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setStack = useCallback((updater: (prev: JourneyStack) => JourneyStack) => {
    globalStack = updater(globalStack);
    listeners.forEach(l => l());
  }, []);

  const pushState = useCallback((state: JourneyState) => {
    console.log('[JourneyStack] pushState:', state);
    setStack(prev => {
      const newStates = prev.states.slice(0, prev.currentIndex + 1);
      newStates.push(state);
      const next = {
        states: newStates,
        currentIndex: newStates.length - 1,
      };
      console.log('[JourneyStack] next stack:', next);
      return next;
    });
  }, [setStack]);

  const goBack = useCallback(() => {
    console.log('[JourneyStack] goBack called, current index:', globalStack.currentIndex);
    setStack(prev => {
      if (prev.currentIndex <= 0) {
        console.log('[JourneyStack] goBack ignored: already at index 0');
        return prev;
      }
      const next = {
        ...prev,
        currentIndex: prev.currentIndex - 1,
      };
      console.log('[JourneyStack] goBack next stack:', next);
      return next;
    });
  }, [setStack]);

  const goForward = useCallback(() => {
    console.log('[JourneyStack] goForward called');
    setStack(prev => {
      if (prev.currentIndex >= prev.states.length - 1) return prev;
      const next = {
        ...prev,
        currentIndex: prev.currentIndex + 1,
      };
      return next;
    });
  }, [setStack]);

  const getCurrentState = useCallback(() => {
    if (stack.currentIndex < 0 || stack.currentIndex >= stack.states.length) {
      return null;
    }
    return stack.states[stack.currentIndex];
  }, [stack]);

  const getBackDestination = useCallback(() => {
    if (stack.currentIndex <= 0 || stack.currentIndex >= stack.states.length) {
      return 'Submissions';
    }
    const prevState = stack.states[stack.currentIndex - 1];
    if (prevState.type === 'section') {
      if (prevState.id === 'lyp') return 'Submissions';
      return prevState.id.charAt(0).toUpperCase() + prevState.id.slice(1);
    }
    return prevState.id;
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
  }, [setStack]);

  const saveScroll = useCallback((scroll: number) => {
    updateCurrentState({ scroll });
  }, [updateCurrentState]);

  const getSavedScroll = useCallback(() => {
    const current = getCurrentState();
    return current?.scroll || 0;
  }, [getCurrentState]);

  const clearStack = useCallback(() => {
    setStack(() => ({
      states: [],
      currentIndex: -1,
    }));
  }, [setStack]);

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
