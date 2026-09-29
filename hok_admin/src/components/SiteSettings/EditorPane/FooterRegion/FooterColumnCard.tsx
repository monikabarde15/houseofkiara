import React from 'react';
import './FooterRegion.css';
import { FooterLinkColumn } from '../../types/siteSettings.types';
import { QuietField } from '../../shared/QuietField/QuietField';
import { DeleteCross } from '../../shared/DeleteCross/DeleteCross';
import { AddControl } from '../../shared/AddControl/AddControl';

interface FooterColumnCardProps {
  column: FooterLinkColumn;
  onChange: (updated: FooterLinkColumn) => void;
}

export const FooterColumnCard: React.FC<FooterColumnCardProps> = ({ column, onChange }) => {
  const handleUpdateHeading = (val: string) => {
    onChange({ ...column, heading: val });
  };

  const handleUpdateLink = (
    index: number,
    field: 'label' | 'path',
    val: string
  ) => {
    const updatedLinks = [...column.links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: val };
    onChange({ ...column, links: updatedLinks });
  };

  const handleDeleteLink = (index: number) => {
    const updatedLinks = column.links.filter((_, i) => i !== index);
    onChange({ ...column, links: updatedLinks });
  };

  const handleAddLink = () => {
    const newLink = {
      id: `fl-${Date.now()}`,
      label: 'New Link',
      path: '/where-it-goes'
    };
    onChange({ ...column, links: [...column.links, newLink] });
  };

  return (
    <div className="hok-footer-col-card">
      <div className="hok-footer-col-header">
        <QuietField
          variant="heading"
          value={column.heading}
          placeholder="Column heading"
          onChange={(e) => handleUpdateHeading(e.target.value)}
        />
      </div>

      <div className="hok-footer-links-list">
        {column.links.map((link, idx) => (
          <div key={link.id} className="hok-footer-link-row hok-interactive-row">
            <div style={{ flex: 1.5, minWidth: 0 }}>
              <QuietField
                value={link.label}
                placeholder="Link label"
                onChange={(e) => handleUpdateLink(idx, 'label', e.target.value)}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <QuietField
                variant="secondary"
                value={link.path}
                placeholder="/path"
                onChange={(e) => handleUpdateLink(idx, 'path', e.target.value)}
              />
            </div>
            <DeleteCross
              onDelete={() => handleDeleteLink(idx)}
              hint="Remove this link from the footer"
            />
          </div>
        ))}
      </div>

      <AddControl label="+ Link" onClick={handleAddLink} />
    </div>
  );
};
