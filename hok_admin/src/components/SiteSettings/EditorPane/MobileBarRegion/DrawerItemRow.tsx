import React from 'react';
import './MobileBarRegion.css';
import { NavItem } from '../../types/siteSettings.types';
import { Checkbox } from '../../shared/Checkbox/Checkbox';

interface DrawerItemRowProps {
  navItem: NavItem;
  isShownOnMobile: boolean;
  onChangeMobileVisibility: (shown: boolean) => void;
  onJumpToHeader: () => void;
}

export const DrawerItemRow: React.FC<DrawerItemRowProps> = ({
  navItem,
  isShownOnMobile,
  onChangeMobileVisibility,
  onJumpToHeader
}) => {
  const isOffInHeader = !navItem.shown;

  let totalLinks = 0;
  navItem.menuColumns.forEach((col) => {
    totalLinks += col.links.length;
  });

  const noteText = isOffInHeader
    ? 'off in the header, so not in the drawer'
    : navItem.hasMenu && navItem.menuEnabled
    ? `opens the same ${totalLinks} links as desktop`
    : `goes straight to ${navItem.link}`;

  return (
    <div className={`hok-drawer-row ${isOffInHeader ? 'is-dimmed' : ''}`}>
      <div className="hok-drawer-row-left">
        <Checkbox
          checked={isShownOnMobile && !isOffInHeader}
          disabled={isOffInHeader}
          onChange={onChangeMobileVisibility}
          hint={
            isOffInHeader
              ? 'Switched off in the header, so it cannot reach the drawer either.'
              : 'In the drawer. Click to leave it out on mobile.'
          }
        />

        <button
          type="button"
          className="hok-drawer-nav-jump-btn"
          onClick={onJumpToHeader}
          data-hint="Edit this item and its menu in Header — the same list feeds desktop and mobile"
        >
          {navItem.label}
        </button>
      </div>

      <span className="hok-drawer-row-note">{noteText}</span>
    </div>
  );
};
