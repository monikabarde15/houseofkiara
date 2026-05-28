import React, { useState } from 'react';
import MobileTabStrip from '../mobile/common/MobileTabStrip';
import MobileNavDrawer from '../mobile/common/MobileNavDrawer';
import MobileHeroCard from '../mobile/hero/MobileHeroCard';
import MobileActiveRentalAlert from '../mobile/alerts/MobileActiveRentalAlert';
import MobileRentalsSection from '../mobile/sections/MobileRentalsSection';
import MobilePurchasesSection from '../mobile/sections/MobilePurchasesSection';
import MobileSavedPiecesSection from '../mobile/sections/MobileSavedPiecesSection';
import MobileListedPiecesSection from '../mobile/sections/MobileListedPiecesSection';
import MobileRentalsFullView from '../mobile/fullviews/MobileRentalsFullView';
import MobilePurchasesFullView from '../mobile/fullviews/MobilePurchasesFullView';
import MobileSavedPiecesFullView from '../mobile/fullviews/MobileSavedPiecesFullView';
import MobileAddressesSection from '../mobile/sections/MobileAddressesSection';

import "../../../styles/Profile/layout/MobileProfileLayout.css";
import MobileSubmissionsSection from '../mobile/sections/MobileSubmissionsSection';
import MobileAccountSettingsSection from '../mobile/sections/MobileAccountSettingsSection';
import MobileHelpSupportSection from '../mobile/sections/MobileHelpSupportSection';

const MobileProfileLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('rentals');
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'rentals', 'purchases', 'wishlist'

  const handleTabClick = (tabId) => {
    if (activeView !== 'overview') {
      setActiveView('overview');
    }
    setActiveTab(tabId);
    const section = document.getElementById(tabId);
    if (section) {
      const headerOffset = 98;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleViewAllRentals = () => {
    setActiveView('rentals');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleViewAllPurchases = () => {
    setActiveView('purchases');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleViewAllWishlist = () => {
    setActiveView('wishlist');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToOverview = () => {
    setActiveView('overview');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleAlertPress = () => {
    console.log("Open rental detail sheet");
  };

  // Full Views
  if (activeView === 'rentals') {
    return (
      <>
        <MobileNavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        <MobileRentalsFullView onBack={handleBackToOverview} />
      </>
    );
  }

  if (activeView === 'purchases') {
    return (
      <>
        <MobileNavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        <MobilePurchasesFullView onBack={handleBackToOverview} />
      </>
    );
  }

  if (activeView === 'wishlist') {
    return (
      <>
        <MobileNavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        <MobileSavedPiecesFullView onBack={handleBackToOverview} />
      </>
    );
  }

  return (
    <>
      <MobileTabStrip 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onTabClick={handleTabClick}
        isFullViewOpen={activeView !== 'overview'}
      />
      <MobileNavDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      <main className="profile-mobile-main">
        <MobileHeroCard />
        <MobileActiveRentalAlert onPress={handleAlertPress} />
        
        <div id="rentals" className="profile-mobile-section">
          <MobileRentalsSection onViewAll={handleViewAllRentals} />
        </div>
        
        <div id="purchases" className="profile-mobile-section">
          <MobilePurchasesSection onViewAll={handleViewAllPurchases} />
        </div>
        
        <div id="wishlist" className="profile-mobile-section">
          <MobileSavedPiecesSection onViewAll={handleViewAllWishlist} />
        </div>
        
        <div id="listed" className="profile-mobile-section">
          <MobileListedPiecesSection />
        </div>

        <div id="addresses" className="profile-mobile-section">
          <MobileAddressesSection />
        </div>

        <div id="submissions" className="profile-mobile-section">
          <MobileSubmissionsSection />
        </div>

        <div id="settings" className="profile-mobile-section">
          <MobileAccountSettingsSection/>
        </div>

        <div id="support" className="profile-mobile-section">
          <MobileHelpSupportSection/>
        </div>
      </main>
    </>
  );
};

export default MobileProfileLayout;