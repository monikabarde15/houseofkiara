/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · MASTER ORCHESTRATOR
   Spec v213
========================================================= */

import React, { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import './tokens.css';
import './HomepageLayout.css';
import { HomepageRegistry, BandId } from './types/homepage.types';
import { initialHomepageRegistry } from './data/seedHomepageRegistry';
import { HomepageToolbar } from './ControlStrip/HomepageToolbar';
import { HomepageSearchItem } from './ControlStrip/searchIndex';
import { detectHomepageDiffs } from './ControlStrip/diffDetector';
import { evaluateHomepageHealthChecks } from './Navigator/healthChecks';
import { HomepageNavigator } from './Navigator/HomepageNavigator';
import { HeroBand } from './Bands/HeroBand/HeroBand';
import { HowItWorksBand } from './Bands/HowItWorksBand/HowItWorksBand';
import { FeaturedPiecesBand } from './Bands/FeaturedPiecesBand/FeaturedPiecesBand';
import { ShopByCategoryBand } from './Bands/ShopByCategoryBand/ShopByCategoryBand';
import { ShopByOccasionBand } from './Bands/ShopByOccasionBand/ShopByOccasionBand';
import { OurCommitmentBand } from './Bands/OurCommitmentBand/OurCommitmentBand';
import { FeaturedDesignersBand } from './Bands/FeaturedDesignersBand/FeaturedDesignersBand';
import { TestimonialsBand } from './Bands/TestimonialsBand/TestimonialsBand';
import { InstagramBand } from './Bands/InstagramBand/InstagramBand';

interface HomepageProps {
  homepage?: any;
  onUpdateHomepage?: (homepage: any) => void;
  onNavigateSiteSettings?: () => void;
  onNavigateToModule?: (mod: string) => void;
}

export const Homepage: React.FC<HomepageProps> = ({
  homepage,
  onUpdateHomepage,
  onNavigateSiteSettings,
  onNavigateToModule
}) => {
  // Working Registry State
  const [registry, setRegistry] = useState<HomepageRegistry>(() => {
    return initialHomepageRegistry;
  });

  // Published Snapshot Baseline (Spec 14.2)
  const [baseline, setBaseline] = useState<HomepageRegistry>(() => {
    return JSON.parse(JSON.stringify(initialHomepageRegistry));
  });

  const [activeBand, setActiveBand] = useState<BandId>('hero');
  const [isNavigatorCollapsed, setIsNavigatorCollapsed] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'Desktop' | 'Mobile'>('Desktop');

  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Computed unsaved diffs (Spec 14.2)
  const unsavedChanges = detectHomepageDiffs(registry, baseline);

  // Computed health checks (Spec 10)
  const { issuesByBand, highestSeverityByBand } = evaluateHomepageHealthChecks(registry);

  // Scroll to top on band select (Spec 4.14.1)
  const handleSelectBand = useCallback((bandId: BandId) => {
    setActiveBand(bandId);
    if (editorContainerRef.current) {
      editorContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Search hit landing with 2.2s gold pulse (Spec 13)
  const handleSelectSearchResult = (item: HomepageSearchItem) => {
    setActiveBand(item.band);

    setTimeout(() => {
      const targetElem = document.getElementById(item.targetFieldId);
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetElem.classList.remove('hok-field-target-highlight');
        void targetElem.offsetWidth;
        targetElem.classList.add('hok-field-target-highlight');

        const focusable = targetElem.querySelector('input, select, textarea, button') as HTMLElement | null;
        if (focusable) {
          focusable.focus();
        }
      }
    }, 100);
  };

  // Publish action (Spec 14.2)
  const handlePublish = () => {
    setBaseline(JSON.parse(JSON.stringify(registry)));
    if (onUpdateHomepage) {
      onUpdateHomepage(registry);
    }
    toast.success('Homepage published to the live site');
  };

  // Discard action (Spec 14.2)
  const handleDiscard = () => {
    setRegistry(JSON.parse(JSON.stringify(baseline)));
    toast('Changes discarded');
  };

  return (
    <div className="hok-homepage-root hok-hp-page-wrapper">
      <div id="sec-homepage" className="hok-hp-container">
        {/* 2.2 Module Header */}
        <div className="hok-hp-module-header">
          <div className="hok-hp-header-eyebrow">SITE SETTINGS</div>
          <h1 className="hok-hp-header-title">Homepage</h1>
          <p className="hok-hp-header-sub">
            Everything between the header and the footer. Pick a band, change it, watch the preview. The bar, the menu and the footer are the chrome and live in Site Settings; anything another module owns is pointed at here, never retyped.
          </p>
        </div>

        {/* 5. Top Bar / Control Strip */}
        <HomepageToolbar
          onSelectSearchResult={handleSelectSearchResult}
          unsavedChanges={unsavedChanges}
          onPublish={handlePublish}
          onDiscard={handleDiscard}
        />

        {/* 2.1 Workspace Grid */}
        <div
          ref={editorContainerRef}
          className={`hok-hp-workspace-grid ${isNavigatorCollapsed ? 'is-collapsed' : ''}`}
        >
          {/* Left Column: Navigator / Spine */}
          <div className="hok-hp-navigator-col">
            <HomepageNavigator
              registry={registry}
              activeBand={activeBand}
              onSelectBand={handleSelectBand}
              onReorderBand={(from, to) => {
                const updatedBands = [...registry.bands];
                const [moved] = updatedBands.splice(from, 1);
                updatedBands.splice(to, 0, moved);
                setRegistry((prev) => ({ ...prev, bands: updatedBands }));
              }}
              highestSeverityByBand={highestSeverityByBand}
              isCollapsed={isNavigatorCollapsed}
              onToggleCollapse={() => setIsNavigatorCollapsed(!isNavigatorCollapsed)}
              deviceMode={deviceMode}
              onChangeDeviceMode={setDeviceMode}
              onNavigateToSiteSettings={() =>
                onNavigateSiteSettings ? onNavigateSiteSettings() : toast('Navigate to Site Settings')
              }
            />
          </div>

          {/* Center Column: Editor Pane */}
          <div className="hok-hp-editor-col">
            {activeBand === 'hero' && (
              <HeroBand
                settings={registry.hero}
                isShown={registry.vis.hero}
                onToggleShown={(shown) =>
                  setRegistry((prev) => ({ ...prev, vis: { ...prev.vis, hero: shown } }))
                }
                onChange={(updatedHero) =>
                  setRegistry((prev) => ({ ...prev, hero: updatedHero }))
                }
                issues={issuesByBand.hero}
                onNavigateToModule={(mod) => toast(`Navigating to ${mod}`)}
              />
            )}

            {activeBand === 'how' && (
              <HowItWorksBand
                settings={registry.how}
                isShown={registry.vis.how}
                onToggleShown={(shown) =>
                  setRegistry((prev) => ({ ...prev, vis: { ...prev.vis, how: shown } }))
                }
                onChange={(updatedHow) =>
                  setRegistry((prev) => ({ ...prev, how: updatedHow }))
                }
                issues={issuesByBand.how}
              />
            )}

            {activeBand === 'featured' && (
              <FeaturedPiecesBand
                settings={registry.featured}
                isShown={registry.vis.featured}
                onToggleShown={(shown) =>
                  setRegistry((prev) => ({ ...prev, vis: { ...prev.vis, featured: shown } }))
                }
                onChange={(updatedFeatured) =>
                  setRegistry((prev) => ({ ...prev, featured: updatedFeatured }))
                }
                issues={issuesByBand.featured}
                onNavigateToModule={(mod) =>
                  onNavigateToModule ? onNavigateToModule(mod) : toast(`Navigating to ${mod}`)
                }
              />
            )}

            {activeBand === 'category' && (
              <ShopByCategoryBand
                settings={registry.category}
                isShown={registry.vis.category}
                onToggleShown={(shown) =>
                  setRegistry((prev) => ({ ...prev, vis: { ...prev.vis, category: shown } }))
                }
                onChange={(updatedCategory) =>
                  setRegistry((prev) => ({ ...prev, category: updatedCategory }))
                }
                issues={issuesByBand.category}
                onNavigateToModule={(mod) =>
                  onNavigateToModule ? onNavigateToModule(mod) : toast(`Navigating to ${mod}`)
                }
              />
            )}

            {activeBand === 'occasions' && (
              <ShopByOccasionBand
                settings={registry.occasions}
                isShown={registry.vis.occasions}
                onToggleShown={(shown) =>
                  setRegistry((prev) => ({ ...prev, vis: { ...prev.vis, occasions: shown } }))
                }
                onChange={(updatedOccasions) =>
                  setRegistry((prev) => ({ ...prev, occasions: updatedOccasions }))
                }
                issues={issuesByBand.occasions}
                onNavigateToModule={(mod) =>
                  onNavigateToModule ? onNavigateToModule(mod) : toast(`Navigating to ${mod}`)
                }
              />
            )}

            {activeBand === 'commit' && (
              <OurCommitmentBand
                settings={registry.commit}
                isShown={registry.vis.commit}
                onToggleShown={(shown) =>
                  setRegistry((prev) => ({ ...prev, vis: { ...prev.vis, commit: shown } }))
                }
                onChange={(updatedCommit) =>
                  setRegistry((prev) => ({ ...prev, commit: updatedCommit }))
                }
                issues={issuesByBand.commit}
              />
            )}

            {activeBand === 'designers' && (
              <FeaturedDesignersBand
                settings={registry.designers}
                isShown={registry.vis.designers}
                onToggleShown={(shown) =>
                  setRegistry((prev) => ({ ...prev, vis: { ...prev.vis, designers: shown } }))
                }
                onChange={(updatedDesigners) =>
                  setRegistry((prev) => ({ ...prev, designers: updatedDesigners }))
                }
                issues={issuesByBand.designers}
                onNavigateToModule={(mod) =>
                  onNavigateToModule ? onNavigateToModule(mod) : toast(`Navigating to ${mod}`)
                }
              />
            )}

            {activeBand === 'testi' && (
              <TestimonialsBand
                settings={registry.testi}
                isShown={registry.vis.testi}
                onToggleShown={(shown) =>
                  setRegistry((prev) => ({ ...prev, vis: { ...prev.vis, testi: shown } }))
                }
                onChange={(updatedTesti) =>
                  setRegistry((prev) => ({ ...prev, testi: updatedTesti }))
                }
                issues={issuesByBand.testi}
                onNavigateToModule={(mod) =>
                  onNavigateToModule ? onNavigateToModule(mod) : toast(`Navigating to ${mod}`)
                }
              />
            )}

            {activeBand === 'insta' && (
              <InstagramBand
                settings={registry.insta}
                isShown={registry.vis.insta}
                onToggleShown={(shown) =>
                  setRegistry((prev) => ({ ...prev, vis: { ...prev.vis, insta: shown } }))
                }
                onChange={(updatedInsta) =>
                  setRegistry((prev) => ({ ...prev, insta: updatedInsta }))
                }
                issues={issuesByBand.insta}
                onNavigateSiteSettings={() =>
                  onNavigateSiteSettings ? onNavigateSiteSettings() : toast('Navigate to Site Settings')
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
