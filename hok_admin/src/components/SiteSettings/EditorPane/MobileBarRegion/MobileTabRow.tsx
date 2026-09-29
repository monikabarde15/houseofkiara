import React from 'react';
import './MobileBarRegion.css';
import { MobileBarTabItem } from '../../types/siteSettings.types';
import { Checkbox } from '../../shared/Checkbox/Checkbox';
import { ReorderArrows } from '../../shared/ReorderArrows/ReorderArrows';
import { QuietField } from '../../shared/QuietField/QuietField';
import { DeleteCross } from '../../shared/DeleteCross/DeleteCross';

interface MobileTabRowProps {
  tab: MobileBarTabItem;
  index: number;
  totalCount: number;
  bagCartLabel: string;
  onChange: (updated: MobileBarTabItem) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const MobileTabRow: React.FC<MobileTabRowProps> = ({
  tab,
  index,
  totalCount,
  bagCartLabel,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  const isBagTab = tab.isBagTab;
  const displayLabel = isBagTab ? bagCartLabel : tab.label;

  return (
    <div className="hok-mobile-tab-row hok-interactive-row">
      {/* Shown Checkbox */}
      <div className="hok-mobile-tab-col-shown">
        <Checkbox
          checked={tab.shown}
          onChange={(checked) => onChange({ ...tab, shown: checked })}
          tickedHint="Showing on the bottom bar. Click to take it off."
          untickedHint="Hidden from the storefront. Click to show it again."
        />
      </div>

      {/* Reorder Arrows */}
      <div className="hok-mobile-tab-col-order">
        <ReorderArrows
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          canMoveUp={index > 0}
          canMoveDown={index < totalCount - 1}
          upHint="Move this tab one place left"
          downHint="Move this tab one place right"
        />
      </div>

      {/* Label */}
      <div className="hok-mobile-tab-col-label">
        {isBagTab ? (
          <>
            <div className="hok-read-only-field">{displayLabel}</div>
            <span className="hok-linked-marker" data-hint="Owned by the Header region">
              linked
            </span>
          </>
        ) : (
          <QuietField
            value={tab.label}
            placeholder="Tab label"
            onChange={(e) => onChange({ ...tab, label: e.target.value })}
          />
        )}
      </div>

      {/* Path */}
      <div className="hok-mobile-tab-col-path">
        <QuietField
          variant="secondary"
          value={tab.path}
          placeholder="/path"
          onChange={(e) => onChange({ ...tab, path: e.target.value })}
        />
      </div>

      {/* Delete Control */}
      <div className="hok-mobile-tab-col-remove">
        {isBagTab ? (
          <button
            type="button"
            className="hok-delete-cross hok-inert-delete"
            data-hint="The bag cannot be removed — shoppers need a way back to it"
            onClick={(e) => e.stopPropagation()}
            aria-label="Cannot remove bag tab"
          >
            ×
          </button>
        ) : (
          <DeleteCross
            onDelete={onDelete}
            hint="Remove this tab from the bottom bar"
          />
        )}
      </div>
    </div>
  );
};
