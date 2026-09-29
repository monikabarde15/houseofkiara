import React from 'react';
import './HeaderRegion.css';
import { MenuColumn, MenuItemLink } from '../../types/siteSettings.types';
import { Checkbox } from '../../shared/Checkbox/Checkbox';
import { QuietField } from '../../shared/QuietField/QuietField';
import { DeleteCross } from '../../shared/DeleteCross/DeleteCross';
import { AddControl } from '../../shared/AddControl/AddControl';

interface MenuColumnCardProps {
  column: MenuColumn;
  onChange: (updated: MenuColumn) => void;
  onDelete: () => void;
}

export const MenuColumnCard: React.FC<MenuColumnCardProps> = ({
  column,
  onChange,
  onDelete
}) => {
  const isColShown = !column.hidden;

  const handleToggleAll = (showAll: boolean) => {
    const updatedLinks = column.links.map((l) => ({ ...l, hidden: !showAll }));
    onChange({ ...column, links: updatedLinks });
  };

  const handleUpdateLink = (linkIndex: number, updated: MenuItemLink) => {
    const updatedLinks = [...column.links];
    updatedLinks[linkIndex] = updated;
    onChange({ ...column, links: updatedLinks });
  };

  const handleDeleteLink = (linkIndex: number) => {
    const updatedLinks = column.links.filter((_, i) => i !== linkIndex);
    onChange({ ...column, links: updatedLinks });
  };

  const handleAddLink = () => {
    const newLink: MenuItemLink = {
      id: `l-${Date.now()}`,
      label: 'New Link',
      path: '/where-it-goes'
    };
    onChange({ ...column, links: [...column.links, newLink] });
  };

  const visibleCount = column.links.filter((l) => !l.hidden).length;
  const totalCount = column.links.length;

  return (
    <div className="hok-menu-col-card">
      {/* Heading Row (Spec 10.2) */}
      <div className="hok-menu-col-header-row hok-interactive-row">
        <Checkbox
          checked={isColShown}
          onChange={(checked) => onChange({ ...column, hidden: !checked })}
          hint="Showing. Click to hide this whole column from the menu."
        />

        <QuietField
          variant="heading"
          value={column.heading}
          placeholder="Column heading — e.g. Shop by Category"
          onChange={(e) => onChange({ ...column, heading: e.target.value })}
        />

        <span className="hok-menu-col-count">
          {visibleCount} of {totalCount}
        </span>

        <div className="hok-menu-col-actions">
          <button
            type="button"
            className="hok-btn-text-action"
            onClick={() => handleToggleAll(true)}
            data-hint="Show every link in this column"
          >
            All
          </button>
          <button
            type="button"
            className="hok-btn-text-action"
            onClick={() => handleToggleAll(false)}
            data-hint="Hide every link in this column — useful when a whole category is out of stock"
          >
            None
          </button>
          <DeleteCross
            onDelete={onDelete}
            hint="Delete this column and its links"
          />
        </div>
      </div>

      {/* Link Rows */}
      <div className="hok-menu-links-list">
        {column.links.map((link, idx) => {
          const isLinkShown = !link.hidden;
          return (
            <div key={link.id} className="hok-menu-link-row hok-interactive-row">
              <Checkbox
                checked={isLinkShown}
                onChange={(checked) => handleUpdateLink(idx, { ...link, hidden: !checked })}
                tickedHint="Shoppers can see this. Click to take it out of the menu."
                untickedHint="Hidden from the storefront. Click to show it again."
              />

              <div style={{ flex: 1.5, minWidth: 0 }}>
                <QuietField
                  value={link.label}
                  placeholder="Link text"
                  isMuted={!isLinkShown}
                  onChange={(e) => handleUpdateLink(idx, { ...link, label: e.target.value })}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <QuietField
                  variant="secondary"
                  value={link.path}
                  placeholder="/where-it-goes"
                  isMuted={!isLinkShown}
                  onChange={(e) => handleUpdateLink(idx, { ...link, path: e.target.value })}
                />
              </div>

              {/* 46px reserved slot for sits last marker (Spec 10.2) */}
              <div className="hok-menu-link-slot">
                {link.position === 'last' && (
                  <span
                    className="hok-sits-last-chip"
                    data-hint="Sits at the foot of the column, under a divider"
                  >
                    sits last
                  </span>
                )}
              </div>

              <DeleteCross
                onDelete={() => handleDeleteLink(idx)}
                hint="Delete this link"
              />
            </div>
          );
        })}
      </div>

      <AddControl
        label="+ Link"
        onClick={handleAddLink}
      />
    </div>
  );
};
