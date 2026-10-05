import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import './HoverHint.css';

interface HintState {
  text: string;
  targetRect: DOMRect | null;
}

interface HoverHintContextType {
  showHint: (text: string, target: HTMLElement) => void;
  hideHint: () => void;
}

const HoverHintContext = createContext<HoverHintContextType>({
  showHint: () => {},
  hideHint: () => {}
});

export const useHoverHint = () => useContext(HoverHintContext);

export const HoverHintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hint, setHint] = useState<HintState | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number; isBelow: boolean }>({ x: 0, y: 0, isBelow: false });

  const hideHint = useCallback(() => {
    setHint(null);
  }, []);

  const showHint = useCallback((text: string, target: HTMLElement) => {
    if (!text) {
      setHint(null);
      return;
    }
    const rect = target.getBoundingClientRect();
    setHint({ text, targetRect: rect });
  }, []);

  // Update bubble coordinates according to Spec 8.7
  useEffect(() => {
    if (!hint || !hint.targetRect) return;

    const rect = hint.targetRect;
    const bubbleWidth = bubbleRef.current ? bubbleRef.current.offsetWidth : 120;
    const bubbleHeight = bubbleRef.current ? bubbleRef.current.offsetHeight : 30;

    let centerX = rect.left + rect.width / 2;
    // Horizontally clamped to stay at least 6px inside the viewport (Spec 8.7)
    const minX = bubbleWidth / 2 + 6;
    const maxX = window.innerWidth - bubbleWidth / 2 - 6;
    centerX = Math.max(minX, Math.min(centerX, maxX));

    // Centered above the control with a 7px gap. If not enough room above, flips below
    let top = rect.top - bubbleHeight - 7;
    let isBelow = false;

    if (top < 6) {
      top = rect.bottom + 7;
      isBelow = true;
    }

    setPos({ x: centerX, y: top, isBelow });
  }, [hint]);

  // Global listeners for data-hint attributes and click to close
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-hint]') as HTMLElement | null;
      if (target) {
        const text = target.getAttribute('data-hint');
        if (text) {
          showHint(text, target);
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-hint]') as HTMLElement | null;
      if (target) {
        hideHint();
      }
    };

    const handleClick = () => {
      hideHint();
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', hideHint, true);

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', hideHint, true);
    };
  }, [showHint, hideHint]);

  return (
    <HoverHintContext.Provider value={{ showHint, hideHint }}>
      {children}
      {hint && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div className="hok-hover-hint-portal" aria-hidden="true">
          <div
            ref={bubbleRef}
            className="hok-hover-hint-bubble"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`
            }}
          >
            <div className={`hok-hover-hint-arrow ${pos.isBelow ? 'arrow-top' : 'arrow-bottom'}`} />
            {hint.text}
          </div>
        </div>,
        document.body
      )}
    </HoverHintContext.Provider>
  );
};
