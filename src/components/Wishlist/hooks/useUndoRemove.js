// src/components/Wishlist/hooks/useUndoRemove.js
// Section 9: Remove from Wishlist + Undo Toast

import { useState, useCallback, useRef } from "react";

const useUndoRemove = () => {
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const timerRef = useRef(null);

  // Section 9.1 & 9.2: Remove card with animation
  const removeCard = useCallback((productId, cardElement, onRemoveComplete, onShowToast) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Store pending removal
    setPendingRemoval({ id: productId });

    // Show toast immediately (Section 9.2 Step 7)
    if (onShowToast) onShowToast();

    // Section 9.2 Steps 1-4: Animation sequence
    // Step 1: Heart pop animation (triggered in component)
    
    // Step 2: After 150ms, fade out and scale
    setTimeout(() => {
      if (cardElement) {
        cardElement.style.transition = "opacity 0.28s ease, transform 0.28s ease";
        cardElement.style.opacity = "0";
        cardElement.style.transform = "scale(0.97)";
      }
      
      // Step 3: After 280ms, collapse height
      setTimeout(() => {
        if (cardElement) {
          const height = cardElement.offsetHeight;
          cardElement.style.maxHeight = `${height}px`;
          cardElement.offsetHeight;
          cardElement.style.transition = "max-height 0.35s ease";
          cardElement.style.maxHeight = "0";
          cardElement.style.paddingTop = "0";
          cardElement.style.paddingBottom = "0";
          cardElement.style.marginTop = "0";
          cardElement.style.marginBottom = "0";
          cardElement.style.overflow = "hidden";
        }
        
        // Step 4: After 350ms, remove from DOM
        setTimeout(() => {
          if (onRemoveComplete) onRemoveComplete();
        }, 350);
      }, 280);
    }, 150);

    // Set 5-second undo window
    timerRef.current = setTimeout(() => {
      setPendingRemoval(null);
      timerRef.current = null;
    }, 5000);
  }, []);

  // Section 9.4: Undo - cancel timer
  const cancelUndo = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPendingRemoval(null);
  }, []);

  const getPendingRemoval = useCallback(() => pendingRemoval, [pendingRemoval]);

  return { removeCard, cancelUndo, getPendingRemoval };
};

export default useUndoRemove;