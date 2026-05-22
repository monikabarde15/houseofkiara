// src\components\Profile\right\RightColumn.jsx
import React from 'react';
import { useState } from 'react';
import "../../../styles/Profile/right/RightColumn.css";
import ActiveRentalAlert from '../sections/ActiveRentalAlert';
import SectionLabel from '../ui/SectionLabel';

import MyRentalsSection from '../sections/MyRentalsSection';
import MyPurchasesSection from '../sections/MyPurchasesSection';

import ViewRentals from './ViewRentals';
import ViewPurchases from './ViewPurchases';

const RightColumn = () => {
  const [activeView, setActiveView] = useState('overview');

  const handleViewAllRentals = () => {
    setActiveView('rentals');
  };

  const handleViewAllPurchases = () => {
    setActiveView('purchases');
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
        <div id="profile-fv-right-wishlist" className="profile-right-view">
          {/* All saved pieces with hover CTAs */}
        </div>

      </div>
    </div>
  );
};

export default RightColumn;