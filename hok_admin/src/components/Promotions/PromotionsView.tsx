/* ========================================
   Promotions Module - Promotions View
   Main list page
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5
   ======================================== */

import React, { useState, useCallback, useEffect } from 'react';
import './PromotionsView.css';
import './styles/variables.css';
import { PromotionsHeader } from './components/PromotionsHeader';
import { SnapshotCards } from './components/SnapshotCards';
import { CheckoutRulesCard } from './components/CheckoutRulesCard';
import { ShopperMessagesCard } from './components/ShopperMessagesCard';
import { UnknownCodesCard } from './components/UnknownCodesCard';
import { ComposerCard } from './components/ComposerCard';
import { PromotionsTable } from './components/PromotionsTable';
import { PromotionsDetailView } from './PromotionsDetailView';
import { usePromotions } from './hooks/usePromotions';
import { useCheckoutRules } from './hooks/useCheckoutRules';
import { useShopperMessages } from './hooks/useShopperMessages';
import { useRefusedAttempts } from './hooks/useRefusedAttempts';
import { usePromotionActions } from './hooks/usePromotionActions';

interface PromotionsViewProps {
  orders?: any[];
  onEditingChange?: (isEditing: boolean) => void;
}

export const PromotionsView: React.FC<PromotionsViewProps> = ({ orders = [], onEditingChange }) => {
  const [selectedCodeId, setSelectedCodeId] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [activeSnapshot, setActiveSnapshot] = useState<string | null>(null);

  useEffect(() => {
    if (onEditingChange) {
      onEditingChange(Boolean(selectedCodeId));
    }
  }, [selectedCodeId, onEditingChange]);

  const { codes, loading, getRedemptions, getDerivedState, promotionOrders, setFilter, setSort, refresh } = usePromotions();
  const { rules, updateRules } = useCheckoutRules();
  const { messages, updateMessages, resetMessage, getCustomizedCount } = useShopperMessages();
  const { getUnknownCodes } = useRefusedAttempts();
  const { createCode } = usePromotionActions();

  // Compute stats for snapshot cards
  const liveCodes = codes.filter(c => getDerivedState(c) === 'Active').length;
  
  let dynamicRedemptions = 0;
  let dynamicOrderValue = 0;
  let dynamicDiscountFunded = 0;

  const liveOrderData = promotionOrders.length > 0 ? promotionOrders : orders;
  codes.forEach(c => {
    const promoCode = String(c.code || c.id || '').trim().toUpperCase();
    const matchingOrders = liveOrderData.filter((o: any) => String(o.promoCode || '').trim().toUpperCase() === promoCode);
    dynamicRedemptions += matchingOrders.length;
    matchingOrders.forEach((o: any) => {
      dynamicOrderValue += Math.max(0, Number(o.priceBeforePromo ?? o.orderValue ?? o.amount ?? o.price ?? 0));
      dynamicDiscountFunded += Math.max(0, Number(o.promoDiscount ?? o.discount ?? 0));
    });
  });

  const totalRedemptions = dynamicRedemptions;
  const totalOrderValue = dynamicOrderValue;
  const totalDiscountFunded = dynamicDiscountFunded;

  const handleSnapshotClick = (filter: string | null) => {
    setActiveSnapshot(filter);
    setFilter({ snapshot: filter as any });
  };

  const handleRowClick = (codeId: string) => {
    setSelectedCodeId(codeId);
  };

  const handleDigestClick = () => {
    // Compose WhatsApp digest
    console.log('Digest on WhatsApp');
  };

  const handleCreateClick = () => {
    setComposerOpen(!composerOpen);
  };

  const handleCreateCode = async (data: any) => {
    const result = await createCode(data);
    if (result) {
      refresh();
    }
    return result;
  };

  const unknownCodes = getUnknownCodes();

  if (selectedCodeId) {
    return (
      <PromotionsDetailView
        codeId={selectedCodeId}
        onBack={() => setSelectedCodeId(null)}
      />
    );
  }

  return (
    <div className="promotions-view">
      <PromotionsHeader
        onDigestClick={handleDigestClick}
        onCreateClick={handleCreateClick}
        composerOpen={composerOpen}
      />

      <SnapshotCards
        liveCodes={liveCodes}
        redemptions={totalRedemptions}
        orderValue={totalOrderValue}
        discountFunded={totalDiscountFunded}
        activeFilter={activeSnapshot}
        onFilterClick={handleSnapshotClick}
      />

      <ComposerCard
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        onCreate={handleCreateCode}
        existingCodes={codes.map(c => c.code)}
        loading={false}
      />

      <CheckoutRulesCard
        rules={rules}
        linkedPairs={[]}
        onSave={updateRules}
        loading={false}
      />

      <ShopperMessagesCard
        messages={messages}
        onSave={updateMessages}
        onReset={resetMessage}
        getCustomizedCount={getCustomizedCount}
        loading={false}
      />

      <UnknownCodesCard codes={unknownCodes} />

      <PromotionsTable
        codes={codes}
        loading={loading}
        getRedemptions={getRedemptions}
        getDerivedState={getDerivedState}
        onRowClick={handleRowClick}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onExport={() => console.log('Export CSV')}
        snapshotFilter={activeSnapshot}
        onSnapshotClear={() => handleSnapshotClick(null)}
      />
    </div>
  );
};
