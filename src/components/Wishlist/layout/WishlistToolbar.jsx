import { useState } from "react";
import DesktopTabStrip from "../toolbar/DesktopTabStrip";
import DesktopSortShareRow from "../toolbar/DesktopSortShareRow";
import ShareWishlistModal from "../modal/ShareWishlistModal";
import "../../../styles/wishlist/layout/wishlist-toolbar.css";

const WishlistToolbar = ({
  activeTab,
  onTabChange,
  tabCounts,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showGeneralToastMessage,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  return (
    <>
      <div className="desk-wishlist-toolbar">
        {/* LEFT: Tabs */}
        <DesktopTabStrip
          activeTab={activeTab}
          onTabChange={onTabChange}
          tabCounts={tabCounts}
        />

        {/* RIGHT: Sort + Share + View Toggle */}
        <DesktopSortShareRow
          sortBy={sortBy}
          onSortChange={onSortChange}
          onShareClick={handleShareClick}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareWishlistModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onShowToast={showGeneralToastMessage}
        />
      )}
    </>
  );
};

export default WishlistToolbar;