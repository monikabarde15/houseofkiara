import React from 'react';
import './RegionRail.css';
import { RegionId, HealthIssue, HealthSeverity } from '../types/siteSettings.types';
import { RegionIcon } from '../shared/icons/SiteSettingsIcons';

interface RegionItemDef {
  id: RegionId;
  label: string;
}

interface RegionRailProps {
  activeRegion: RegionId;
  onSelectRegion: (region: RegionId) => void;
  issuesByRegion: Record<RegionId, HealthIssue[]>;
  highestSeverityByRegion: Record<RegionId, HealthSeverity>;
}

const ON_THE_PAGE_GROUP: RegionItemDef[] = [
  { id: 'announcement', label: 'Announcement' },
  { id: 'header', label: 'Header' },
  { id: 'footer', label: 'Footer' },
  { id: 'mobile', label: 'Mobile bar' }
];

const BEHIND_THE_PAGE_GROUP: RegionItemDef[] = [
  { id: 'brand', label: 'Brand' },
  { id: 'contact', label: 'Contact' },
  { id: 'google', label: 'Google' },
  { id: 'legal', label: 'Legal' },
  { id: 'regional', label: 'Regional' }
];

const SITE_STATUS_GROUP: RegionItemDef[] = [
  { id: 'maintenance', label: 'Maintenance' }
];

export const RegionRail: React.FC<RegionRailProps> = ({
  activeRegion,
  onSelectRegion,
  issuesByRegion,
  highestSeverityByRegion
}) => {
  const renderRegionRow = (item: RegionItemDef) => {
    const isSelected = activeRegion === item.id;
    const issues = issuesByRegion[item.id] || [];
    const severity = highestSeverityByRegion[item.id];
    const issueCount = issues.length;

    const hintText =
      issueCount > 0
        ? `${issueCount} ${issueCount === 1 ? 'thing' : 'things'} to look at in ${item.label}`
        : undefined;

    const dotClass =
      severity === 'Warning'
        ? 'dot-warning'
        : severity === 'Soon'
        ? 'dot-soon'
        : severity === 'Information'
        ? 'dot-information'
        : '';

    return (
      <button
        key={item.id}
        type="button"
        className={`hok-rail-row ${isSelected ? 'is-selected' : ''}`}
        onClick={() => onSelectRegion(item.id)}
        data-hint={hintText}
      >
        <RegionIcon region={item.id} />
        <span className="hok-rail-label">{item.label}</span>
        {severity !== 'None' && <div className={`hok-rail-dot ${dotClass}`} />}
      </button>
    );
  };

  return (
    <nav className="hok-region-rail" aria-label="Site settings regions">
      {/* 7.1 Group 1: ON THE PAGE */}
      <div className="hok-rail-group">
        <div className="hok-rail-group-heading">ON THE PAGE</div>
        {ON_THE_PAGE_GROUP.map(renderRegionRow)}
      </div>

      {/* 7.1 Group 2: BEHIND THE PAGE */}
      <div className="hok-rail-group">
        <div className="hok-rail-group-heading">BEHIND THE PAGE</div>
        {BEHIND_THE_PAGE_GROUP.map(renderRegionRow)}
      </div>

      {/* 7.1 Group 3: SITE STATUS */}
      <div className="hok-rail-group is-site-status">
        <div className="hok-rail-group-heading">SITE STATUS</div>
        {SITE_STATUS_GROUP.map(renderRegionRow)}
      </div>
    </nav>
  );
};
