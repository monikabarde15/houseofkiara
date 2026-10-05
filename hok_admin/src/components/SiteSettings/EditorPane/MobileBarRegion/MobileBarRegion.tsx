import React from 'react';
import './MobileBarRegion.css';
import { MobileBarSettings, MobileBarTabItem, NavItem, HealthIssue } from '../../types/siteSettings.types';
import { Card } from '../../shared/Card/Card';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { AddControl } from '../../shared/AddControl/AddControl';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { MobileTabRow } from './MobileTabRow';
import { DrawerItemRow } from './DrawerItemRow';

interface MobileBarRegionProps {
  settings: MobileBarSettings;
  headerNavItems: NavItem[];
  bagCartLabel: string;
  onChange: (updated: MobileBarSettings) => void;
  issues: HealthIssue[];
  onJumpToHeaderItem?: (navItemId: string) => void;
  onNavigateRegion?: (region: string) => void;
}

export const MobileBarRegion: React.FC<MobileBarRegionProps> = ({
  settings,
  headerNavItems,
  bagCartLabel,
  onChange,
  issues,
  onJumpToHeaderItem,
  onNavigateRegion
}) => {
  const handleUpdateTab = (index: number, updated: MobileBarTabItem) => {
    const updatedTabs = [...settings.tabs];
    updatedTabs[index] = updated;
    onChange({ ...settings, tabs: updatedTabs });
  };

  const handleDeleteTab = (index: number) => {
    const updatedTabs = settings.tabs.filter((_, i) => i !== index);
    onChange({ ...settings, tabs: updatedTabs });
  };

  const handleMoveTab = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= settings.tabs.length) return;
    const updatedTabs = [...settings.tabs];
    const [moved] = updatedTabs.splice(fromIdx, 1);
    updatedTabs.splice(toIdx, 0, moved);
    onChange({ ...settings, tabs: updatedTabs });
  };

  const handleAddTab = () => {
    const newTab: MobileBarTabItem = {
      id: `mtab-${Date.now()}`,
      label: 'New Tab',
      path: '/new-tab',
      shown: true
    };
    onChange({ ...settings, tabs: [...settings.tabs, newTab] });
  };

  const handleToggleDrawerVisibility = (navItemId: string, shown: boolean) => {
    const updatedVis = { ...settings.drawer.itemVisibility, [navItemId]: shown };
    onChange({
      ...settings,
      drawer: { ...settings.drawer, itemVisibility: updatedVis }
    });
  };

  const shownTabsCount = settings.tabs.filter((t) => t.shown).length;
  const totalTabsCount = settings.tabs.length;

  return (
    <div className="hok-mobile-bar-region">
      {/* 8.1 Heading Row */}
      <div className="hok-editor-heading-row">
        <h2 className="hok-editor-title">Mobile bar</h2>
        <span className="hok-editor-attribution">Soumya · 1 day ago</span>
      </div>
      <p className="hok-editor-description">
        The bottom bar on the app screens. The drawer is the header list filtered, not a second list to keep in step.
      </p>

      {/* 8.2 Issues for Mobile Bar */}
      {issues.map((issue) => (
        <IssueStrip
          key={issue.id}
          severity={issue.severity}
          message={issue.message}
          actionLabel={issue.actionLabel}
        />
      ))}

      {/* Card 1 — Bottom Bar */}
      <Card
        isFirst
        title="Bottom bar"
        subtitle={`${shownTabsCount} of ${totalTabsCount} tabs showing. The bag entry follows {{cart_label}} so it cannot drift from the desktop word.`}
        id="mobile-tabs"
      >
        <div className="hok-mobile-tabs-table">
          {settings.tabs.map((tab, idx) => (
            <MobileTabRow
              key={tab.id}
              tab={tab}
              index={idx}
              totalCount={settings.tabs.length}
              bagCartLabel={bagCartLabel}
              onChange={(updated) => handleUpdateTab(idx, updated)}
              onDelete={() => handleDeleteTab(idx)}
              onMoveUp={() => handleMoveTab(idx, idx - 1)}
              onMoveDown={() => handleMoveTab(idx, idx + 1)}
            />
          ))}
        </div>

        <AddControl label="+ Add tab" onClick={handleAddTab} />

        <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '8px' }}>
          Four or five tabs is the practical ceiling — past that the labels start to truncate on a narrow phone.
        </div>
      </Card>

      {/* Card 2 — Hamburger Drawer */}
      <Card
        title="Hamburger drawer"
        subtitle={`${headerNavItems.filter((i) => i.shown).length} of the header’s items appear here. Tapping one slides in a panel carrying the same columns the desktop menu uses — there is no second list.`}
        id="mobile-drawer-card"
      >
        {/* Search Field Toggle */}
        <div id="mobile-drawer-search">
          <PillToggle
            checked={settings.drawer.showSearchField}
            onChange={(checked) =>
              onChange({
                ...settings,
                drawer: { ...settings.drawer, showSearchField: checked }
              })
            }
            label="Show the search field at the top of the drawer"
          />
        </div>

        {/* Mode Shortcuts Toggle */}
        <div id="mobile-drawer-shortcuts">
          <PillToggle
            checked={settings.drawer.showModeShortcuts}
            onChange={(checked) =>
              onChange({
                ...settings,
                drawer: { ...settings.drawer, showModeShortcuts: checked }
              })
            }
            label="Show the mode shortcuts under it"
            hint="The Rent / Buy Preloved / Buy New row. These are the transaction modes, not nav items, so they are not part of the list below."
          />
        </div>

        <hr className="hok-drawer-divider" />

        {/* Drawer Items List */}
        <div className="hok-drawer-rows-list" id="mobile-drawer-items">
          {headerNavItems.map((item) => (
            <DrawerItemRow
              key={item.id}
              navItem={item}
              isShownOnMobile={settings.drawer.itemVisibility[item.id] !== false}
              onChangeMobileVisibility={(shown) =>
                handleToggleDrawerVisibility(item.id, shown)
              }
              onJumpToHeader={() => onJumpToHeaderItem && onJumpToHeaderItem(item.id)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};
