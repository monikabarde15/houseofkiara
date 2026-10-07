/**
 * House of Kaira - Deposit Worked Example Component (D9)
 * Section 5 (D9), 6.4 & 7.5 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { calculateWorkedExamples } from '../../utils/deposit/depositCalculations.js';

const DepositWorkedExample = ({ activeTabId, onTabChange }) => {
  const exampleData = useMemo(() => calculateWorkedExamples(), []);
  const tabs = exampleData.tabs;

  const [selectedId, setSelectedId] = useState(activeTabId || tabs[0].id);
  const [minCardHeight, setMinCardHeight] = useState(null);

  const cardRef = useRef(null);
  const tabRefs = useRef([]);

  // Sync external active tab (e.g. from answer links like "See an example")
  useEffect(() => {
    if (activeTabId && tabs.some(t => t.id === activeTabId)) {
      setSelectedId(activeTabId);
    }
  }, [activeTabId, tabs]);

  const selectedTab = useMemo(() => {
    return tabs.find(t => t.id === selectedId) || tabs[0];
  }, [tabs, selectedId]);

  // Section 6.4: Measure tallest outcome to lock card height
  const updateCardHeightLock = useCallback(() => {
    if (!cardRef.current) return;
    const currentHeight = cardRef.current.offsetHeight;
    setMinCardHeight((prev) => Math.max(prev || 0, currentHeight));
  }, []);

  useEffect(() => {
    // Initial measurement after render
    updateCardHeightLock();

    // After web fonts load
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateCardHeightLock);
    }

    // 150ms debounce after resize
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setMinCardHeight(null); // Reset and re-measure
        setTimeout(updateCardHeightLock, 40);
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [updateCardHeightLock]);

  // Arrow key navigation between tabs (wrapping roving tabindex)
  const handleKeyDown = (e, index) => {
    let nextIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    }

    if (nextIndex !== null) {
      const nextTab = tabs[nextIndex];
      setSelectedId(nextTab.id);
      if (onTabChange) onTabChange(nextTab.id);
      if (tabRefs.current[nextIndex]) {
        tabRefs.current[nextIndex].focus();
      }
    }
  };

  const handleSelectTab = (tab, index) => {
    setSelectedId(tab.id);
    if (onTabChange) onTabChange(tab.id);
    if (tabRefs.current[index]) {
      tabRefs.current[index].focus();
    }
  };

  return (
    <section className="ex" id="examples" aria-labelledby="worked-example-title">
      {/* Title & Intro Line */}
      <div className="ex-hd">
        <h2 id="worked-example-title">
          Your deposit, in <em>practice</em>
        </h2>
        <p>{exampleData.intro}</p>
      </div>

      {/* 4 Tabs Row */}
      <div
        className="ex-tabs"
        role="tablist"
        aria-label="Example outcomes"
      >
        {tabs.map((tab, idx) => {
          const isSelected = tab.id === selectedId;
          return (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[idx] = el)}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              className="ex-tab"
              onClick={() => handleSelectTab(tab, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Statement Card */}
      <div
        ref={cardRef}
        className="ex-card"
        id={`tabpanel-${selectedTab.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${selectedTab.id}`}
        style={minCardHeight ? { minHeight: `${minCardHeight}px` } : undefined}
      >
        <div key={selectedTab.id} className="ex-content-swap">
          {/* Statement Header */}
          <div className="ex-meta">
            <b>Deposit statement</b>
            <span>Example</span>
          </div>

          {/* Statement Lines */}
          <div className="ex-rows">
            {selectedTab.lines.map((line) => (
              <div key={line.label} className="ex-row">
                <span>{line.label}</span>
                <b className={`${line.isNegative ? 'neg' : ''} ${line.isZero ? 'nil' : ''}`}>
                  {line.amount}
                </b>
              </div>
            ))}
          </div>

          {/* Total Row */}
          <div className={`ex-total ${selectedTab.isBalanceDue ? 'owe' : ''}`}>
            <span>{selectedTab.totalLabel}</span>
            <b>{selectedTab.totalAmount}</b>
          </div>

          {/* Notes */}
          <div className="ex-notes">
            {selectedTab.notes.map((note, nIdx) => (
              <p key={nIdx}>{note}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(DepositWorkedExample);
