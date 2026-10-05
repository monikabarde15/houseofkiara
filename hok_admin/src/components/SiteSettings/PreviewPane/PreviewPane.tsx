import React from 'react';
import './PreviewPane.css';
import { SiteSettingsRegistry, RegionId } from '../types/siteSettings.types';
import { PreviewToolbar } from './PreviewToolbar';
import { DesktopMock } from './DesktopMock';
import { MobileMock } from './MobileMock';
import { GoogleSERPMock } from './GoogleSERPMock';
import { MaintenanceMock } from './MaintenanceMock';

interface PreviewPaneProps {
  registry: SiteSettingsRegistry;
  activeRegion: RegionId;
  previewMode: 'Desktop' | 'Mobile';
  onChangePreviewMode: (mode: 'Desktop' | 'Mobile') => void;
  activePage: string;
  onChangeActivePage: (page: string) => void;
  onHidePreview: () => void;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  registry,
  activeRegion,
  previewMode,
  onChangePreviewMode,
  activePage,
  onChangeActivePage,
  onHidePreview
}) => {
  return (
    <div className="hok-preview-pane">
      {/* 9.1 Toolbar */}
      <PreviewToolbar
        mode={previewMode}
        onChangeMode={onChangePreviewMode}
        activePage={activePage}
        onChangePage={onChangeActivePage}
        onHidePreview={onHidePreview}
      />

      {/* 9.2 Content View */}
      <div className="hok-preview-pane-content">
        {/* Context-aware previews */}
        {activeRegion === 'google' ? (
          <GoogleSERPMock google={registry.google} brand={registry.brand} />
        ) : activeRegion === 'maintenance' && registry.maintenance.maintenance.enabled ? (
          <MaintenanceMock
            settings={registry.maintenance}
            brandName={registry.brand.storeName}
          />
        ) : previewMode === 'Mobile' ? (
          <MobileMock
            registry={registry}
            activeRegion={activeRegion}
            activePage={activePage}
          />
        ) : (
          <DesktopMock
            registry={registry}
            activeRegion={activeRegion}
            activePage={activePage}
          />
        )}
      </div>
    </div>
  );
};
