/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureWhereReadBlock (Spec §5.2, Screens 04 & 10)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { FigureItem } from '../types';

interface FigureWhereReadBlockProps {
  figure: FigureItem;
  pendingNewValue?: string | null;
  onNavigateToPage?: (slug: string) => void;
}

export const FigureWhereReadBlock: React.FC<FigureWhereReadBlockProps> = ({
  figure,
  pendingNewValue,
  onNavigateToPage
}) => {
  // Default open state for first two groups (Spec §5.2)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    '0': true,
    '1': true
  });

  const toggleGroup = (indexKey: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [indexKey]: !prev[indexKey]
    }));
  };

  const pages = figure.reachPages || figure.usedOnSlugs || [];
  const reach = figure.reachCount || 0;

  // Build page groups
  const pageGroups = pages.map((slug, idx) => {
    const pageTitle = slug
      .replace('/', '')
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'Policy';

    return {
      slug,
      title: pageTitle,
      count: idx === 0 ? Math.ceil(reach * 0.4) || 2 : Math.max(1, Math.floor(reach / pages.length)),
      sentences: [
        {
          tag: 'Opening',
          text: `Every House of Kaira piece is prepared by hand before it travels: pressed, wrapped in tissue, placed in its garment bag and boxed with care. Standard delivery is free on every order of ${figure.displayValue} or more, including a rental's journey back to us.`
        },
        {
          tag: 'Answers · Delivery terms · Tag',
          text: `Free from ${figure.displayValue}`
        }
      ]
    };
  });

  return (
    <div className="border-t border-[#f0ebe3] pt-4 space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h3 className="text-[13.5px] font-semibold text-[#1a1612]">
          Where customers read it
        </h3>
        <span className="text-[12px] text-[#73675a]">
          {reach > 0
            ? `${reach} places on ${pages.length} pages and the announcement bar`
            : 'No page prints it'}
        </span>
      </div>

      {pendingNewValue && (
        <p className="text-[11.5px] text-[#73675a]">
          Every sentence below, before and after the change.
        </p>
      )}

      {reach === 0 ? (
        <p className="text-[12px] text-[#8a7f73] italic py-2">
          No page prints it. Add it to a sentence with Add a figure, in the bar above the words.
        </p>
      ) : (
        <div className="space-y-2">
          {pageGroups.map((group, idx) => {
            const isOpen = !!openGroups[String(idx)];
            return (
              <div
                key={group.slug}
                className="border border-[#ebe5dc] rounded-[6px] overflow-hidden bg-white"
              >
                {/* Group Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(String(idx))}
                  className="w-full px-3 py-2 bg-[#fdfaf5] flex items-center justify-between text-left cursor-pointer hover:bg-[#fbf7ee] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8a7f73]">
                      {isOpen ? '∨' : '>'}
                    </span>
                    <span className="text-[12.5px] font-medium text-[#1a1612]">
                      {group.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8a7f73]">
                    {group.count}
                  </span>
                </button>

                {/* Sentences List */}
                {isOpen && (
                  <div className="p-3 space-y-3 divide-y divide-[#f0ebe3] text-[12px]">
                    {group.sentences.map((s, sIdx) => (
                      <div
                        key={sIdx}
                        onClick={() => onNavigateToPage && onNavigateToPage(group.slug)}
                        className="pt-2 first:pt-0 cursor-pointer hover:bg-[#faf7f2] -mx-2 px-2 rounded transition-colors"
                      >
                        <div className="text-[11px] text-[#8a7f73] mb-1">
                          {s.tag}
                        </div>

                        {pendingNewValue ? (
                          <div className="space-y-1.5 leading-relaxed text-[#4a4238]">
                            <div>
                              <span className="text-[#8a7f73] font-medium mr-1.5">Now</span>
                              <span>
                                {s.text.split(figure.displayValue)[0]}
                                <span className="bg-[#faeae6] text-[#b85c38] line-through px-1 py-0.5 rounded font-medium">
                                  {figure.displayValue}
                                </span>
                                {s.text.split(figure.displayValue)[1]}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#40562e] font-medium mr-1.5">After</span>
                              <span>
                                {s.text.split(figure.displayValue)[0]}
                                <span className="bg-[#eaf4e6] text-[#40562e] font-medium px-1 py-0.5 rounded">
                                  {pendingNewValue}
                                </span>
                                {s.text.split(figure.displayValue)[1]}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="leading-relaxed text-[#4a4238]">
                            {s.text.split(figure.displayValue)[0]}
                            <span className="bg-[#f5e6b3] text-[#1a1612] px-1 py-0.5 rounded font-medium">
                              {figure.displayValue}
                            </span>
                            {s.text.split(figure.displayValue)[1]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FigureWhereReadBlock;
