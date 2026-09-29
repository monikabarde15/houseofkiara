import React from 'react';
import './HeaderRegion.css';
import { NavItem, MenuColumn } from '../../types/siteSettings.types';
import { Checkbox } from '../../shared/Checkbox/Checkbox';
import { ReorderArrows } from '../../shared/ReorderArrows/ReorderArrows';
import { QuietField } from '../../shared/QuietField/QuietField';
import { DeleteCross } from '../../shared/DeleteCross/DeleteCross';
import { AddControl } from '../../shared/AddControl/AddControl';
import { MenuColumnCard } from './MenuColumnCard';

interface NavItemRowProps {
  navItem: NavItem;
  index: number;
  totalCount: number;
  onChange: (updated: NavItem) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleExpand: () => void;
}

export const NavItemRow: React.FC<NavItemRowProps> = ({
  navItem,
  index,
  totalCount,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleExpand
}) => {
  const handleBuildMenu = () => {
    const defaultCol: MenuColumn = {
      id: `col-${Date.now()}`,
      heading: 'Shop by Category',
      links: [
        { id: `l-${Date.now()}`, label: 'Bridal Lehengas', path: `${navItem.link}/bridal` }
      ]
    };
    onChange({
      ...navItem,
      hasMenu: true,
      menuEnabled: true,
      menuColumns: [defaultCol],
      isExpanded: true
    });
  };

  const handleUpdateColumn = (colIdx: number, updatedCol: MenuColumn) => {
    const updatedCols = [...navItem.menuColumns];
    updatedCols[colIdx] = updatedCol;
    onChange({ ...navItem, menuColumns: updatedCols });
  };

  const handleDeleteColumn = (colIdx: number) => {
    const updatedCols = navItem.menuColumns.filter((_, i) => i !== colIdx);
    const hasAnyCols = updatedCols.length > 0;
    onChange({
      ...navItem,
      menuColumns: updatedCols,
      hasMenu: hasAnyCols,
      menuEnabled: hasAnyCols ? navItem.menuEnabled : false,
      isExpanded: hasAnyCols ? navItem.isExpanded : false
    });
  };

  const handleAddColumn = () => {
    const newCol: MenuColumn = {
      id: `col-${Date.now()}`,
      heading: 'New Column',
      links: [
        { id: `l-${Date.now()}`, label: 'Link text', path: `${navItem.link}/all` }
      ]
    };
    onChange({ ...navItem, menuColumns: [...navItem.menuColumns, newCol] });
  };

  // Compute total and shown links across columns
  let totalLinks = 0;
  let shownLinks = 0;
  navItem.menuColumns.forEach((col) => {
    col.links.forEach((l) => {
      totalLinks++;
      if (!l.hidden && !col.hidden) shownLinks++;
    });
  });

  const columnCount = navItem.menuColumns.length;
  const isMenuAllHidden = navItem.hasMenu && navItem.menuEnabled && shownLinks === 0;

  return (
    <div className="hok-nav-row-wrapper" id={`header-nav-item-${navItem.id}`}>
      {/* 10.2 Navigation Row */}
      <div className="hok-nav-row hok-interactive-row">
        {/* Shown Checkbox */}
        <div className="hok-nav-col-shown">
          <Checkbox
            checked={navItem.shown}
            onChange={(checked) => onChange({ ...navItem, shown: checked })}
            tickedHint="Showing in the header. Click to hide it from the storefront."
            untickedHint="Hidden from the storefront. Click to show it again."
          />
        </div>

        {/* Reorder Arrows */}
        <div className="hok-nav-col-order">
          <ReorderArrows
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            canMoveUp={index > 0}
            canMoveDown={index < totalCount - 1}
            upHint={`Move "${navItem.label}" one place left in the header`}
            downHint={`Move "${navItem.label}" one place right in the header`}
          />
        </div>

        {/* Label */}
        <div className="hok-nav-col-label">
          <QuietField
            value={navItem.label}
            placeholder="Label"
            onChange={(e) => onChange({ ...navItem, label: e.target.value })}
          />
        </div>

        {/* Link */}
        <div className="hok-nav-col-link">
          <QuietField
            variant="secondary"
            value={navItem.link}
            placeholder="/path"
            onChange={(e) => onChange({ ...navItem, link: e.target.value })}
          />
        </div>

        {/* Badge */}
        <div className="hok-nav-col-badge">
          <QuietField
            value={navItem.badge}
            placeholder="Badge"
            data-hint="A small pill beside the label, like the “New” on New Arrivals. Leave blank for none."
            onChange={(e) => onChange({ ...navItem, badge: e.target.value })}
          />
        </div>

        {/* Menu Toggle / Add Menu */}
        <div className="hok-nav-col-menu">
          {!navItem.hasMenu ? (
            <button
              type="button"
              className="hok-menu-dashed-plus"
              onClick={handleBuildMenu}
              data-hint={`Build a drop-down menu under "${navItem.label}"`}
            >
              +
            </button>
          ) : (
            <Checkbox
              checked={navItem.menuEnabled}
              onChange={(checked) => onChange({ ...navItem, menuEnabled: checked })}
              hint={`The menu drops down on hover. Click to switch it off — the columns stay, and clicking "${navItem.label}" will go straight to ${navItem.link} instead.`}
            />
          )}
        </div>

        {/* Style Dropdown */}
        <div className="hok-nav-col-style">
          <select
            className="hok-field-select"
            style={{ padding: '2px 4px', fontSize: '10.5px' }}
            value={navItem.style}
            data-hint="How the label is treated. Accent is gold, Highlight is green — Rent and List Your Piece use these today."
            onChange={(e) =>
              onChange({
                ...navItem,
                style: e.target.value as 'Plain' | 'Accent' | 'Highlight'
              })
            }
          >
            <option value="Plain">Plain</option>
            <option value="Accent">Accent</option>
            <option value="Highlight">Highlight</option>
          </select>
        </div>

        {/* Remove */}
        <div className="hok-nav-col-remove">
          <DeleteCross
            onDelete={onDelete}
            hint={`Remove "${navItem.label}" from the header entirely`}
          />
        </div>
      </div>

      {/* Row Summary Bar (Spec 10.2 Menu Column) */}
      <div className="hok-nav-summary-row">
        {!navItem.hasMenu ? (
          <>
            <span>Goes straight to {navItem.link}</span>
            <button
              type="button"
              className="hok-nav-summary-btn"
              onClick={handleBuildMenu}
            >
              build a menu
            </button>
          </>
        ) : isMenuAllHidden ? (
          <span className="hok-nav-summary-terra">
            in — menu is on, but every link in it is hidden — the chevron opens an empty panel
          </span>
        ) : !navItem.menuEnabled ? (
          <span>
            Menu off · {totalLinks} links kept · clicking goes straight to {navItem.link}
          </span>
        ) : (
          <button
            type="button"
            className="hok-nav-summary-btn"
            onClick={onToggleExpand}
            data-hint={`Open the columns that sit under "${navItem.label}"`}
          >
            {columnCount} {columnCount === 1 ? 'column' : 'columns'} · {shownLinks} of {totalLinks} links shown
            {navItem.isExpanded ? ' (collapse)' : ' (edit)'}
          </button>
        )}
      </div>

      {/* Expanded Menu Columns Editor */}
      {navItem.hasMenu && navItem.isExpanded && (
        <div className="hok-menu-expanded-body">
          {navItem.menuColumns.map((col, cIdx) => (
            <MenuColumnCard
              key={col.id}
              column={col}
              onChange={(updatedCol) => handleUpdateColumn(cIdx, updatedCol)}
              onDelete={() => handleDeleteColumn(cIdx)}
            />
          ))}

          <AddControl
            label="+ Add menu column"
            onClick={handleAddColumn}
          />
        </div>
      )}
    </div>
  );
};
