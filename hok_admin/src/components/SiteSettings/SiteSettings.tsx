import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import './tokens.css';
import './SiteSettingsLayout.css';
import { HoverHintProvider } from './shared/HoverHint/HoverHintContext';
import { ControlStrip } from './ControlStrip/ControlStrip';
import { SearchEntry } from './ControlStrip/searchIndex';
import { computeUnsavedChanges, ChangedAreaName } from './ControlStrip/diffDetector';
import { RegionRail } from './RegionRail/RegionRail';
import { evaluateHealthChecks } from './RegionRail/healthChecks';
import { AnnouncementRegion } from './EditorPane/AnnouncementRegion/AnnouncementRegion';
import { HeaderRegion } from './EditorPane/HeaderRegion/HeaderRegion';
import { FooterRegion } from './EditorPane/FooterRegion/FooterRegion';
import { MobileBarRegion } from './EditorPane/MobileBarRegion/MobileBarRegion';
import { BrandRegion } from './EditorPane/BrandRegion/BrandRegion';
import { ContactRegion } from './EditorPane/ContactRegion/ContactRegion';
import { GoogleRegion } from './EditorPane/GoogleRegion/GoogleRegion';
import { LegalRegion } from './EditorPane/LegalRegion/LegalRegion';
import { RegionalRegion } from './EditorPane/RegionalRegion/RegionalRegion';
import { MaintenanceRegion } from './EditorPane/MaintenanceRegion/MaintenanceRegion';
import { PreviewPane } from './PreviewPane/PreviewPane';
import { SiteSettingsRegistry, RegionId, UserRole } from './types/siteSettings.types';
import { initialSiteSettingsRegistry } from './data/seedRegistry';
import { useTeamPermissions } from '../TeamPermissions';

interface SiteSettingsProps {
  initialData?: any;
  siteSettings?: any;
  onUpdateSettings?: (data: any) => void;
  onSaveToServer?: (data: SiteSettingsRegistry) => Promise<void>;
  onBack?: () => void;
  onNavigateNotifications?: () => void;
  userRole?: UserRole;
}

export const SiteSettings: React.FC<SiteSettingsProps> = ({
  initialData,
  siteSettings,
  onUpdateSettings,
  onSaveToServer,
  onBack,
  onNavigateNotifications,
  userRole = 'SUPER_ADMIN'
}) => {
  // Registry state
  const [registry, setRegistry] = useState<SiteSettingsRegistry>(() => {
    return initialSiteSettingsRegistry;
  });

  // Baseline comparison copy for unsaved diffs (Spec 6.2 & 6.3)
  const [baseline, setBaseline] = useState<SiteSettingsRegistry>(() => {
    return JSON.parse(JSON.stringify(initialSiteSettingsRegistry));
  });

  const [activeRegion, setActiveRegion] = useState<RegionId>('announcement');
  const [isPreviewHidden, setIsPreviewHidden] = useState(false);
  const [activePage, setActivePage] = useState<string>('All pages');
  const [previewMode, setPreviewMode] = useState<'Desktop' | 'Mobile'>('Desktop');

  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Hydrate from live backend API on mount
  useEffect(() => {
    let isMounted = true;
    import('../../services/siteSettingsApi')
      .then((api) => api.getSiteSettings())
      .then((data) => {
        if (!isMounted || !data) return;
        setRegistry((prev) => {
          const nextState: SiteSettingsRegistry = {
            ...prev,
            ...(data.registry || {}),
            announcement: data.announcement
              ? { ...prev.announcement, ...data.announcement }
              : prev.announcement,
            header: data.header
              ? { ...prev.header, ...data.header }
              : prev.header,
            footer: data.footer
              ? { ...prev.footer, ...data.footer }
              : prev.footer,
            mobile: data.mobile
              ? { ...prev.mobile, ...data.mobile }
              : prev.mobile,
            brand: data.brand
              ? { ...prev.brand, ...data.brand }
              : prev.brand,
            contact: data.contact
              ? { ...prev.contact, ...data.contact }
              : prev.contact,
            google: data.google
              ? { ...prev.google, ...data.google }
              : prev.google,
            legal: data.legal
              ? { ...prev.legal, ...data.legal }
              : prev.legal,
            regional: data.regional
              ? { ...prev.regional, ...data.regional }
              : prev.regional,
            maintenance: data.maintenance
              ? { ...prev.maintenance, ...data.maintenance }
              : prev.maintenance,
          };
          setBaseline(JSON.parse(JSON.stringify(nextState)));
          return nextState;
        });
      })
      .catch((err) => {
        console.warn('Could not load site settings from API:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Computed unsaved changes
  const unsavedChanges: ChangedAreaName[] = computeUnsavedChanges(registry, baseline);

  // Computed health checks
  const { issuesByRegion, highestSeverityByRegion } = evaluateHealthChecks(registry);

  // Scroll editor to top on region change (Spec 4.3)
  const handleSelectRegion = useCallback((regionId: RegionId) => {
    setActiveRegion(regionId);
    if (editorContainerRef.current) {
      editorContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Search landing action (Spec 6.1)
  const handleSelectSearchResult = (item: SearchEntry) => {
    setActiveRegion(item.regionId);

    setTimeout(() => {
      const targetElem = document.getElementById(item.targetFieldId);
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetElem.classList.remove('hok-field-target-highlight');
        // Force reflow
        void targetElem.offsetWidth;
        targetElem.classList.add('hok-field-target-highlight');

        const focusable = targetElem.querySelector('input, select, textarea, button') as HTMLElement | null;
        if (focusable) {
          focusable.focus();
        }
      }
    }, 100);
  };

  const {
    canEditSection,
    hasDecision,
    refuseDecision,
    refuseViewOnlySave,
    effectivePermissions,
  } = useTeamPermissions();
  const canEditSettings = canEditSection('settings');
  const canPublishWebsite = hasDecision('publish_to_website');
  const canChangeSiteWide = hasDecision('change_site_wide_settings');
  const isSiteWideRegion = ['brand', 'contact', 'google', 'legal', 'regional', 'maintenance'].includes(activeRegion);
  const regionReadOnly = !canEditSettings || (isSiteWideRegion && !canChangeSiteWide);

  // Publish action (Spec 6.3 + RBAC 9.4 & 9.10)
  const handlePublish = async () => {
    if (!canEditSettings) {
      refuseViewOnlySave('settings');
      return;
    }
    if (!canPublishWebsite) {
      refuseDecision('publish_to_website');
      return;
    }
    if (isSiteWideRegion && !canChangeSiteWide) {
      refuseDecision('change_site_wide_settings');
      return;
    }
    try {
      const api = await import('../../services/siteSettingsApi');
      await api.updateSiteSettings(registry);
      if (onSaveToServer) {
        await onSaveToServer(registry);
      }
      if (onUpdateSettings) {
        onUpdateSettings(registry);
      }
      setBaseline(JSON.parse(JSON.stringify(registry)));
      toast.success('Published to the live site');
    } catch (err: any) {
      console.error('Error publishing site settings:', err);
      toast.error(err?.message || 'Failed to save');
    }
  };

  // Discard action (Spec 6.3)
  const handleDiscard = () => {
    setRegistry(JSON.parse(JSON.stringify(baseline)));
    toast('Changes discarded');
  };

  return (
    <HoverHintProvider>
      <div className="hok-site-settings-view-wrapper">
        {/* Top Header Bar matching admin views */}
        <header className="hok-top-header">
          <div className="hok-top-header-left">
            <button
              type="button"
              className="hok-top-back-btn"
              onClick={onBack || (() => { window.history.back(); })}
            >
              <span className="hok-top-back-chevron">‹</span>
              <span>Back to Homepage</span>
            </button>
            <span className="hok-top-page-title">Site Settings</span>
          </div>

          <div className="hok-top-header-right">
            <button
              type="button"
              className="hok-top-btn"
              onClick={() => window.open('/', '_blank')}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>View Live Site</span>
            </button>

            <button
              type="button"
              className="hok-top-btn hok-top-notifications-btn"
              onClick={onNavigateNotifications || (() => toast('Notifications'))}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span>Notifications</span>
              <span className="hok-top-notif-badge">12</span>
            </button>

            <button
              type="button"
              className="hok-top-save-btn"
              onClick={handlePublish}
            >
              Save Changes
            </button>
          </div>
        </header>

        <div className="hok-site-settings hok-site-settings-root">
          {/* 4.1 Vertical Order: 1. Section Heading Block */}
          <div className="hok-section-heading-block">
            <div className="hok-section-eyebrow">SITE SETTINGS</div>
            <h1 className="hok-section-title">Site Settings</h1>
            <p className="hok-section-description">
              The chrome every page carries. Pick a region, change it, watch the preview. Any figure another module owns is pointed at here, never retyped.
            </p>
          </div>

          {/* 4.1 Vertical Order: 2. Control Strip */}
          <ControlStrip
            onSelectSearchResult={handleSelectSearchResult}
            unsavedChanges={unsavedChanges}
            onPublish={handlePublish}
            onDiscard={handleDiscard}
            currentRegion={activeRegion}
          />

        {/* 4.1 Vertical Order: 3. Three-Column Working Area */}
        <div
          ref={editorContainerRef}
          className={`hok-three-column-grid ${isPreviewHidden ? 'is-preview-hidden' : ''}`}
        >
          {/* Column 1: Region Rail (150px fixed, sticky) */}
          <div className="hok-region-rail-col" id="hok-region-rail">
            <RegionRail
              activeRegion={activeRegion}
              onSelectRegion={handleSelectRegion}
              issuesByRegion={issuesByRegion}
              highestSeverityByRegion={highestSeverityByRegion}
            />
          </div>

          {/* Column 2: Editor Pane (Remaining space minmax(0, 1fr), scrolls) */}
          <div
            className="hok-editor-col"
            id="hok-editor-pane"
            data-tp-view-only={regionReadOnly ? 'true' : undefined}
            onClickCapture={(e) => {
              if (!regionReadOnly) return;
              const target = e.target as HTMLElement | null;
              if (target?.closest('button, input, select, textarea')) {
                e.preventDefault();
                e.stopPropagation();
                if (!canEditSettings) refuseViewOnlySave('settings');
                else refuseDecision('change_site_wide_settings');
              }
            }}
          >
            {regionReadOnly && (
              <div className="tp-view-only-banner mb-4">
                <span>
                  {!canEditSettings
                    ? `View only. Your role (${effectivePermissions.roleName}) can view Site Settings but not change it.`
                    : `Read-only group. Your role (${effectivePermissions.roleName}) does not hold “Change site-wide settings”.`}
                </span>
              </div>
            )}
            {activeRegion === 'announcement' && (
              <AnnouncementRegion
                settings={registry.announcement}
                onChange={(updatedAnn) =>
                  setRegistry((prev) => ({ ...prev, announcement: updatedAnn }))
                }
                issues={issuesByRegion.announcement}
                onNavigateModule={(mod) => toast(`Navigating to ${mod}`)}
              />
            )}
            {activeRegion === 'header' && (
              <HeaderRegion
                settings={registry.header}
                onChange={(updatedHdr) =>
                  setRegistry((prev) => ({ ...prev, header: updatedHdr }))
                }
                issues={issuesByRegion.header}
                onNavigateModule={(mod) => toast(`Navigating to ${mod}`)}
              />
            )}
            {activeRegion === 'footer' && (
              <FooterRegion
                settings={registry.footer}
                onChange={(updatedFtr) =>
                  setRegistry((prev) => ({ ...prev, footer: updatedFtr }))
                }
                issues={issuesByRegion.footer}
                onNavigateModule={(mod) => toast(`Navigating to ${mod}`)}
              />
            )}
            {activeRegion === 'mobile' && (
              <MobileBarRegion
                settings={registry.mobile}
                headerNavItems={registry.header.navItems}
                bagCartLabel={registry.header.bagCartLabel}
                onChange={(updatedMob) =>
                  setRegistry((prev) => ({ ...prev, mobile: updatedMob }))
                }
                issues={issuesByRegion.mobile}
                onJumpToHeaderItem={(navItemId) => {
                  const updatedNav = registry.header.navItems.map((item) => ({
                    ...item,
                    isExpanded: item.id === navItemId
                  }));
                  setRegistry((prev) => ({
                    ...prev,
                    header: { ...prev.header, navItems: updatedNav }
                  }));
                  setActiveRegion('header');
                }}
              />
            )}
            {activeRegion === 'brand' && (
              <BrandRegion
                settings={registry.brand}
                onChange={(updatedBrand) =>
                  setRegistry((prev) => ({ ...prev, brand: updatedBrand }))
                }
                issues={issuesByRegion.brand}
              />
            )}
            {activeRegion === 'contact' && (
              <ContactRegion
                settings={registry.contact}
                onChange={(updatedContact) =>
                  setRegistry((prev) => ({ ...prev, contact: updatedContact }))
                }
                issues={issuesByRegion.contact}
              />
            )}
            {activeRegion === 'google' && (
              <GoogleRegion
                settings={registry.google}
                linkPreviewSlot={registry.brand.assets.linkPreviewImage}
                onChange={(updatedGoogle) =>
                  setRegistry((prev) => ({ ...prev, google: updatedGoogle }))
                }
                issues={issuesByRegion.google}
                onNavigateToBrand={() => setActiveRegion('brand')}
                onNavigateToLegal={() => setActiveRegion('legal')}
              />
            )}
            {activeRegion === 'legal' && (
              <LegalRegion
                settings={registry.legal}
                googleAnalyticsCode={registry.google?.tracking?.googleAnalytics}
                metaPixelCode={registry.google?.tracking?.metaPixel}
                onChange={(updatedLegal) =>
                  setRegistry((prev) => ({ ...prev, legal: updatedLegal }))
                }
                issues={issuesByRegion.legal}
                onNavigateToGoogle={() => setActiveRegion('google')}
                onNavigateToDPDPTrail={() => toast('DPDP audit trail log viewer opened')}
              />
            )}
            {activeRegion === 'regional' && (
              <RegionalRegion
                settings={registry.regional}
                onChange={(updatedReg) =>
                  setRegistry((prev) => ({ ...prev, regional: updatedReg }))
                }
                issues={issuesByRegion.regional}
                onNavigateToMasterData={() => toast('Master data opened')}
              />
            )}
            {activeRegion === 'maintenance' && (
              <MaintenanceRegion
                settings={registry.maintenance}
                onChange={(updatedMaint) =>
                  setRegistry((prev) => ({ ...prev, maintenance: updatedMaint }))
                }
                issues={issuesByRegion.maintenance}
              />
            )}
          </div>

          {/* Column 3: Preview Pane (296px fixed, sticky) */}
          {!isPreviewHidden ? (
            <div className="hok-preview-col" id="hok-preview-pane">
              <PreviewPane
                registry={registry}
                activeRegion={activeRegion}
                previewMode={previewMode}
                onChangePreviewMode={setPreviewMode}
                activePage={activePage}
                onChangeActivePage={setActivePage}
                onHidePreview={() => setIsPreviewHidden(true)}
              />
            </div>
          ) : (
            <button
              type="button"
              className="hok-show-preview-floating-btn"
              onClick={() => setIsPreviewHidden(false)}
              title="Show preview pane"
            >
              👁 Show preview
            </button>
          )}
        </div>
      </div>
    </div>
  </HoverHintProvider>
);
};

export default SiteSettings;
