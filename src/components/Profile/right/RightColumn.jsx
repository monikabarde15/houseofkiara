// src\components\Profile\right\RightColumn.jsx
import React from 'react';
import { useState } from 'react';
import "../../../styles/Profile/right/RightColumn.css";
import ActiveRentalAlert from '../sections/ActiveRentalAlert';
import SectionLabel from '../ui/SectionLabel';

import MyRentalsSection from '../sections/MyRentalsSection';
import MyPurchasesSection from '../sections/MyPurchasesSection';
import SavedPiecesSection from '../sections/SavedPiecesSection';

import ViewRentals from './ViewRentals';
import ViewPurchases from './ViewPurchases';
import ViewWishlist from './ViewWishlist';
import MyListedPiecesSection from '../sections/MyListedPiecesSection';
import SavedAddressesSection from '../sections/SavedAddressesSection';
import MySubmissionsSection from '../sections/MySubmissionsSection';
import EarnPromptBanner from '../sections/EarnPromptBanner';
import AccountSettingsSection from '../sections/AccountSettingsSection';
import HelpSupportSection from '../sections/HelpSupportSection';

const RightColumn = () => {
  const [activeView, setActiveView] = useState('overview');

  // For viewing all the rental items
  const handleViewAllRentals = () => {
    setActiveView('rentals');
  };

  // For viewing all the Purchases items
  const handleViewAllPurchases = () => {
    setActiveView('purchases');
  };

  // For viewing all the Wishlist items
  const handleViewAllWishlist = () => {
    setActiveView('wishlist');
  };

  // For listing another piece
  const handleListAnotherPiece = () => {
    console.log("Redirecting to List Your Piece form...");
  };

  const handleBackToOverview = () => {
    setActiveView('overview');
  };

  return (
    <div className="profile-right-column" id="profile-right-column">

      {/* Width anchor - invisible div to prevent collapse when switching views */}
      <div className="profile-right-anchor"></div>
      
      {/* View switching container - Section 4.2 View Switching */}
      <div className="profile-right-views">

        {/* Overview view - active by default */}
        <div id="profile-rc-right-overview" className={`profile-right-view ${activeView === 'overview' ? 'profile-right-active' : ''}`}>

          {/* Active Rental Alert */}
          <ActiveRentalAlert />

          {/* My Rentals Section */}
          <SectionLabel 
            title="MY RENTALS" 
            count={5} 
            countLabel="BOOKINGS"
            linkText="View all" 
            onLinkClick={handleViewAllRentals}
          />
          <MyRentalsSection />

          {/* My Purchases Section */}
          <SectionLabel 
            title="MY PURCHASES" 
            count={4} 
            countLabel="ORDERS"
            linkText="View all" 
            onLinkClick={handleViewAllPurchases}
          />
          <MyPurchasesSection />

          {/* WISHLIST SECTION */}
          <SectionLabel
            title="SAVED PIECES"
            count={7}
            countLabel="SAVED"
            linkText="View all"
            onLinkClick={handleViewAllWishlist}
          />
          <SavedPiecesSection />

          {/* Listed Piece Section */}
          <SectionLabel
            title="MY LISTED PIECES"
            count={3}
            countLabel="ACTIVE LISTINGS"
            linkText="+ List another piece"
            onLinkClick={handleListAnotherPiece}
          />
          <MyListedPiecesSection />


          {/* Saved Addresses Section */}
          <SectionLabel
            title="SAVED ADDRESSES"
            count={2}
            countLabel=""
            linkText=""
          />
          <SavedAddressesSection />

          {/* My Submissions Section */}
          <SectionLabel
            title="MY SUBMISSIONS"
            count={null}
            countLabel=""
            linkText=""
          />
          <MySubmissionsSection />

          {/* Earn Prompt Banner */}
          <EarnPromptBanner />

          {/* Account Settings Section */}
          <SectionLabel
            title="ACCOUNT SETTINGS"
            count={null}
            countLabel=""
            linkText=""
          />
          <AccountSettingsSection />

          {/* Help & Support Section */}
          <SectionLabel
            title="HELP & SUPPORT"
            count={null}
            countLabel=""
            linkText=""
          />
          <HelpSupportSection />

          {/*Other sections will go here */}
        </div>
        
        {/* Full view rentals */}
        <div id="profile-fv-right-rentals" className={`profile-right-view ${activeView === 'rentals' ? 'profile-right-active' : ''}`}>
          {/* All rental bookings with detail panels */}
          <ViewRentals onBack={handleBackToOverview} />
        </div>
        
        {/* Full view purchases */}
        <div id="profile-fv-right-purchases" className={`profile-right-view ${activeView === 'purchases' ? 'profile-right-active' : ''}`}>
          <ViewPurchases onBack={handleBackToOverview} />
        </div>
        
        {/* Full view wishlist */}
        <div id="profile-fv-right-wishlist" className={`profile-right-view ${activeView === 'wishlist' ? 'profile-right-active' : ''}`}>
          <ViewWishlist onBack={handleBackToOverview} />
        </div>

      </div>
    </div>
  );
};

export default RightColumn;