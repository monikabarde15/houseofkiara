// src\components\Profile\right\RightColumn.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const RightColumn = ({ dashboard }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState('overview');
  const [openRentalDetailId, setOpenRentalDetailId] = useState(null);

  useEffect(() => {
    if (location.state?.tab) {
      const targetId = location.state.tab;
      setTimeout(() => {
        const section = document.getElementById(targetId);
        const rightCol = document.getElementById('profile-right-column');
        if (section && rightCol) {
          const offset = section.offsetTop - rightCol.offsetTop - 20;
          rightCol.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location.state]);

  const handleAlertBarClick = (id) => {
    setOpenRentalDetailId(id || dashboard?.activeRentalAlert?.id || null);
  };

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
    navigate('/wishlist');
  };

  // For listing another piece
  const handleListAnotherPiece = () => {
    navigate("/list-your-piece/");
  };

  const handleBackToOverview = () => {
    setActiveView('overview');
  };

  const rentalsCount = dashboard?.counts?.rentals ?? 0;
  const purchasesCount = dashboard?.counts?.purchases ?? 0;
  const savedPiecesCount = dashboard?.counts?.savedPieces ?? 0;
  const listedPiecesCount = dashboard?.counts?.listedPieces ?? 0;
  const addressesCount = dashboard?.counts?.addresses ?? 0;
  const submissionsCount = dashboard?.counts?.submissions ?? 0;

  return (
    <div className="profile-right-column" id="profile-right-column">

      {/* Width anchor - invisible div to prevent collapse when switching views */}
      <div className="profile-right-anchor"></div>
      
      {/* View switching container - Section 4.2 View Switching */}
      <div className="profile-right-views">

        {/* Overview view - active by default */}
        <div id="profile-rc-right-overview" className={`profile-right-view ${activeView === 'overview' ? 'profile-right-active' : ''}`}>

          {/* Active Rental Alert */}
          {dashboard?.activeRentalAlert && (
            <ActiveRentalAlert alert={dashboard.activeRentalAlert} onAlertClick={handleAlertBarClick} />
          )}

          {/* My Rentals Section */}
          <SectionLabel 
            title="MY RENTALS" 
            count={rentalsCount} 
            countLabel="BOOKINGS"
            linkText={rentalsCount > 3 ? "View all" : ""} 
            onLinkClick={handleViewAllRentals}
          />
          <MyRentalsSection rentals={dashboard?.rentals} openDetailId={openRentalDetailId} setOpenDetailId={setOpenRentalDetailId} onUpdate={dashboard?.refetch} />

          {/* My Purchases Section */}
          <SectionLabel 
            title="MY PURCHASES" 
            count={purchasesCount} 
            countLabel="ORDERS"
            linkText={purchasesCount > 3 ? "View all" : ""} 
            onLinkClick={handleViewAllPurchases}
          />
          <MyPurchasesSection purchases={dashboard?.purchases} />

          {/* WISHLIST SECTION */}
          <SectionLabel
            title="SAVED PIECES"
            count={savedPiecesCount}
            countLabel="SAVED"
            linkText={savedPiecesCount > 0 ? "View all" : ""}
            onLinkClick={handleViewAllWishlist}
          />
          <SavedPiecesSection savedPieces={dashboard?.savedPieces} onUpdate={dashboard?.refetch} />

          {/* Listed Piece Section */}
          <SectionLabel
            title="MY LISTED PIECES"
            count={listedPiecesCount}
            countLabel="ACTIVE LISTINGS"
            linkText="+ List another piece"
            onLinkClick={handleListAnotherPiece}
          />
          <MyListedPiecesSection listedPieces={dashboard?.listedPieces} />

          {/* Saved Addresses Section */}
          <SectionLabel
            title="SAVED ADDRESSES"
            count={addressesCount}
            countLabel=""
            linkText=""
          />
          <SavedAddressesSection onUpdate={dashboard?.refetch} />

          {/* My Submissions Section */}
          <SectionLabel
            title="MY SUBMISSIONS"
            count={submissionsCount}
            countLabel=""
            linkText=""
          />
          <MySubmissionsSection submissions={dashboard?.submissions} />

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
          <ViewRentals rentals={dashboard?.rentals} onBack={handleBackToOverview} onUpdate={dashboard?.refetch} />
        </div>
        
        {/* Full view purchases */}
        <div id="profile-fv-right-purchases" className={`profile-right-view ${activeView === 'purchases' ? 'profile-right-active' : ''}`}>
          <ViewPurchases purchases={dashboard?.purchases} onBack={handleBackToOverview} />
        </div>
        
        {/* Full view wishlist */}
        <div id="profile-fv-right-wishlist" className={`profile-right-view ${activeView === 'wishlist' ? 'profile-right-active' : ''}`}>
          <ViewWishlist savedPieces={dashboard?.savedPieces} onBack={handleBackToOverview} onUpdate={dashboard?.refetch} />
        </div>

      </div>
    </div>
  );
};

export default RightColumn;