import React from 'react';
import './MaintenanceMock.css';
import { SiteStatusSettings } from '../types/siteSettings.types';

interface MaintenanceMockProps {
  settings: SiteStatusSettings;
  brandName?: string;
}

export const MaintenanceMock: React.FC<MaintenanceMockProps> = ({
  settings,
  brandName = 'HOUSE OF KIARA'
}) => {
  const isMaintenanceOn = settings?.maintenance?.enabled;

  return (
    <div className="hok-maint-mock-container">
      <div className="hok-maint-brand-badge">{brandName}</div>
      {isMaintenanceOn ? (
        <>
          <h2 className="hok-maint-headline">
            {settings?.maintenance?.heading || 'Store Temporarily Offline'}
          </h2>
          <p className="hok-maint-body">
            {settings?.maintenance?.body || 'We are performing scheduled updates.'}
          </p>
        </>
      ) : (
        <>
          <h2 className="hok-maint-headline">
            {settings?.notFoundPage?.heading || '404 — Page Not Found'}
          </h2>
          <p className="hok-maint-body">
            {settings?.notFoundPage?.body || 'The page you requested could not be found.'}
          </p>
          <button type="button" className="hok-maint-return-btn">
            Return to Home
          </button>
        </>
      )}
    </div>
  );
};
