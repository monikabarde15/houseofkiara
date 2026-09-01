/* ========================================
   Promotions Module - Scope Picker
   Product scope picker (categories, designers, specific pieces)
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5.7
   ======================================== */

import React, { useState, useCallback } from 'react';
import './styles/ScopePicker.css';
import { PromoCodeScope, PromoMode } from '../types/promotions.types';

interface ScopePickerProps {
  scope: PromoCodeScope;
  modes: PromoMode[];
  restricted: boolean;
  onScopeChange: (scope: PromoCodeScope) => void;
  onRestrictedChange: (restricted: boolean) => void;
  livePieces: number;
  disabled?: boolean;
}

// Mock data
const mockCategories = ['Bridal Lehenga', 'Saree', 'Anarkali', 'Sharara', 'Indo-Western'];
const mockDesigners = ['Sabyasachi', 'Manish Malhotra', 'Ritu Kumar', 'Tarun Tahiliani'];

export const ScopePicker: React.FC<ScopePickerProps> = ({
  scope,
  modes,
  restricted,
  onScopeChange,
  onRestrictedChange,
  livePieces,
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const toggleCategory = useCallback((category: string) => {
    const newCategories = scope.categories.includes(category)
      ? scope.categories.filter(c => c !== category)
      : [...scope.categories, category];
    onScopeChange({ ...scope, categories: newCategories });
  }, [scope, onScopeChange]);

  const toggleDesigner = useCallback((designer: string) => {
    const newDesigners = scope.designerIds.includes(designer)
      ? scope.designerIds.filter(d => d !== designer)
      : [...scope.designerIds, designer];
    onScopeChange({ ...scope, designerIds: newDesigners });
  }, [scope, onScopeChange]);

  const addPiece = useCallback((piece: string) => {
    if (!scope.skus.includes(piece)) {
      onScopeChange({ ...scope, skus: [...scope.skus, piece] });
    }
    setSearchTerm('');
    setShowSuggestions(false);
  }, [scope, onScopeChange]);

  const removePiece = useCallback((piece: string) => {
    onScopeChange({ ...scope, skus: scope.skus.filter(s => s !== piece) });
  }, [scope, onScopeChange]);

  // Mock suggestions based on search
  const suggestions = searchTerm.length > 0
    ? mockCategories.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase())).map(c => ({ name: c, sku: `SKU-${c.substring(0, 4).toUpperCase()}`, category: c, status: 'Live' }))
    : [];

  const hasScope = scope.categories.length > 0 || scope.designerIds.length > 0 || scope.skus.length > 0;
  const matchesLive = livePieces > 0;

  return (
    <div className="scope-picker">
      <div className="scope-picker__radios">
        <label className="scope-picker__radio">
          <input
            type="radio"
            checked={!restricted}
            onChange={() => onRestrictedChange(false)}
            disabled={disabled}
          />
          All products
        </label>
        <label className="scope-picker__radio">
          <input
            type="radio"
            checked={restricted}
            onChange={() => onRestrictedChange(true)}
            disabled={disabled}
          />
          Restrict to specific products
        </label>
      </div>

      {restricted && (
        <div className="scope-picker__panel">
          {/* Categories */}
          <div className="scope-picker__group">
            <div className="scope-picker__group-label">Categories</div>
            <div className="scope-picker__chips">
              {mockCategories.map(category => (
                <button
                  key={category}
                  className={`scope-picker__chip ${scope.categories.includes(category) ? 'selected' : ''}`}
                  onClick={() => toggleCategory(category)}
                  disabled={disabled}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Designers */}
          <div className="scope-picker__group">
            <div className="scope-picker__group-label">Designers</div>
            <div className="scope-picker__chips">
              {mockDesigners.map(designer => (
                <button
                  key={designer}
                  className={`scope-picker__chip ${scope.designerIds.includes(designer) ? 'selected' : ''}`}
                  onClick={() => toggleDesigner(designer)}
                  disabled={disabled}
                >
                  {designer}
                </button>
              ))}
            </div>
          </div>

          {/* Specific Pieces */}
          <div className="scope-picker__group">
            <div className="scope-picker__group-label">Specific Pieces</div>
            <div className="scope-picker__search-wrapper">
              <input
                type="text"
                className="scope-picker__search"
                placeholder="Search by piece name or SKU..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                disabled={disabled}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="scope-picker__suggestions">
                  {suggestions.map(suggestion => (
                    <div
                      key={suggestion.sku}
                      className="scope-picker__suggestion"
                      onClick={() => addPiece(suggestion.sku)}
                    >
                      <span className="scope-picker__suggestion-name">{suggestion.name}</span>
                      <span className="scope-picker__suggestion-sku">{suggestion.sku}</span>
                      <span className="scope-picker__suggestion-meta"> - {suggestion.category} - {suggestion.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="scope-picker__pieces">
              {scope.skus.length === 0 ? (
                <div className="scope-picker__empty">No specific pieces picked — search above to add.</div>
              ) : (
                scope.skus.map(sku => (
                  <span key={sku} className="scope-picker__piece-chip">
                    <span className="scope-picker__piece-name">{sku}</span>
                    <span className="scope-picker__piece-sku">{sku}</span>
                    <button
                      className="scope-picker__piece-remove"
                      onClick={() => removePiece(sku)}
                      disabled={disabled}
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Hint */}
          <div className="scope-picker__hint">
            Pick from more than one group and a piece must satisfy every group — e.g. Sabyasachi + Bridal Lehenga scopes the code to Sabyasachi bridal lehengas only. Within a group, any match qualifies.
          </div>

          {/* Live count */}
          <div className={`scope-picker__count ${matchesLive ? '' : 'zero'}`}>
            Matches {livePieces} live piece{livePieces !== 1 ? 's' : ''}
            {!matchesLive && ' — the code would reject every bag right now.'}
          </div>
        </div>
      )}
    </div>
  );
};