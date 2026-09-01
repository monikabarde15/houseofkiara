/* ========================================
   Promotions Module - Promotions Detail View
   Code detail page with tabs
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6
   ======================================== */

import React, { useState, useEffect } from 'react';
import './PromotionsDetailView.css';
import './styles/variables.css';
import { DetailHeader } from './detail/DetailHeader';
import { AttentionStrip } from './detail/AttentionStrip';
import { Tabs } from './detail/Tabs';
import { RedemptionEconomics } from './detail/PerformanceTab/RedemptionEconomics';
import { RefusedAttempts } from './detail/PerformanceTab/RefusedAttempts';
import { OrdersLedger } from './detail/PerformanceTab/OrdersLedger';
import { DiscountRulesCard } from './detail/RulesTab/DiscountRulesCard';
import { AudienceCard } from './detail/RulesTab/AudienceCard';
import { CheckoutValidationCard } from './detail/RulesTab/CheckoutValidationCard';
import { ReasonNotesCard } from './detail/RulesTab/ReasonNotesCard';
import { RepromoteCard } from './detail/RulesTab/RepromoteCard';
import { LifecycleCard } from './detail/RulesTab/LifecycleCard';
import { TryItAgainstBag } from './detail/RulesTab/TryItAgainstBag';
import { CartDrawerPreview } from './detail/RulesTab/CartDrawerPreview';
import { ChangeHistory } from './detail/RulesTab/ChangeHistory';
import { WhenMoneyComesBack } from './detail/RulesTab/WhenMoneyComesBack';
import { usePromotionDetail } from './hooks/usePromotionDetail';
import { usePromotionActions } from './hooks/usePromotionActions';
import { useTestBag } from './hooks/useTestBag';
import { useRefusedAttempts } from './hooks/useRefusedAttempts';
import { AttentionFlag, getAttentionFlags, getVisibleFlags, getSnoozedFlagsCount } from './utils/derived';

interface PromotionsDetailViewProps {
  codeId?: string;
  onBack?: () => void;
}

export const PromotionsDetailView: React.FC<PromotionsDetailViewProps> = ({
  codeId: propCodeId,
  onBack,
}) => {
  const codeId = propCodeId || '';
  const [activeTab, setActiveTab] = useState<'performance' | 'rules'>('performance');
  
  const { code, loading, error, derivedState, redemptions, refresh } = usePromotionDetail(codeId);
  const { pauseCode, resumeCode, deleteCode, copyCode, updateCode } = usePromotionActions();
  const { getAttemptsForCode } = useRefusedAttempts();
  const { items, archetype, result, addItem, removeItem, clearBag, setArchetype, evaluate } = useTestBag();

  const [flags, setFlags] = useState<AttentionFlag[]>([]);
  const [snoozedFlags, setSnoozedFlags] = useState<string[]>([]);

  useEffect(() => {
    if (code) {
      const allFlags = getAttentionFlags(code, redemptions, 100, code.createdOn);
      const visible = getVisibleFlags(allFlags, code);
      setFlags(visible);
      setSnoozedFlags(allFlags.filter(f => 
        code.attnSnooze?.[f.key] && new Date(code.attnSnooze[f.key]) > new Date()
      ).map(f => f.key));
    }
  }, [code, redemptions]);

  const handleBack = () => {
    if (onBack) onBack();
  };

  const handlePause = async () => {
    if (code) {
      const result = await pauseCode(code.code);
      if (result) refresh();
    }
  };

  const handleResume = async () => {
    if (code) {
      const result = await resumeCode(code.code);
      if (result) refresh();
    }
  };

  const handleDelete = async () => {
    if (code && window.confirm(`Delete ${code.code}?\n\nNo order has ever used it, so nothing else references it. This cannot be undone.`)) {
      const result = await deleteCode(code.code);
      if (result) handleBack();
    }
  };

  const handleCopy = async (changes: any) => {
    if (code) {
      const result = await copyCode(code.code, changes);
      if (result) {
        handleBack();
      }
    }
  };

  const handleSnooze = (flagKey: string) => {
    // In production: update code with snooze
    console.log('Snoozed:', flagKey);
  };

  const handleRestoreSnoozed = () => {
    // In production: clear all snoozes
    console.log('Restored all snoozed');
  };

  if (loading) {
    return (
      <div className="promotions-detail-view">
        <div className="promotions-detail-view__loading">Loading code...</div>
      </div>
    );
  }

  if (error || !code) {
    return (
      <div className="promotions-detail-view">
        <div className="promotions-detail-view__error">
          {error || 'Code not found'}
          <button onClick={handleBack} className="promotions-detail-view__back-btn">
            ← Back to Promotions
          </button>
        </div>
      </div>
    );
  }

  const refusedAttempts = getAttemptsForCode(code.code);

  return (
    <div className="promotions-detail-view">
      <DetailHeader
        code={code}
        derivedState={derivedState!}
        redemptions={redemptions}
        onBack={handleBack}
        onPause={handlePause}
        onResume={handleResume}
        onShare={() => console.log('Share on WhatsApp')}
        onCopy={() => console.log('Copy code')}
      />

      <AttentionStrip
        flags={flags}
        snoozedCount={snoozedFlags.length}
        onSnooze={handleSnooze}
        onRestore={handleRestoreSnoozed}
      />

      <Tabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'performance' ? (
        <>
          <RedemptionEconomics
            code={code}
            redemptions={redemptions}
            orderValue={redemptions * 5000} // Mock
            discountFunded={redemptions * 500} // Mock
            discountRate={10}
            firstOrders={Math.floor(redemptions * 0.4)}
            qualifyingLivePieces={3} // Since BRIDAL500 has 3 in design and the rest is mock
            cameBackCount={Math.floor(redemptions * 0.1)}
          />

          <RefusedAttempts
            attempts={refusedAttempts}
            code={code}
            redemptions={redemptions}
          />

          <OrdersLedger
            orders={[]} // Mock
            code={code}
          />
        </>
      ) : (
        <>
          <div className="promotions-detail-view__rules-grid">
            <div className="promotions-detail-view__rules-left">
              <DiscountRulesCard
                code={code}
                onSave={(data) => {
                  updateCode(code.code, data);
                }}
                onCopy={(data) => handleCopy(data)}
                redemptions={redemptions}
              />
            </div>
            <div className="promotions-detail-view__rules-right">
              <AudienceCard
                code={code}
                onSave={(data) => updateCode(code.code, data)}
              />
              <CheckoutValidationCard code={code} />
            </div>
          </div>

          <ReasonNotesCard
            code={code}
            onSave={(data) => updateCode(code.code, data)}
          />

          <div className="promotions-detail-view__rules-grid">
            <RepromoteCard code={code} />
            <LifecycleCard
              code={code}
              onPause={handlePause}
              onResume={handleResume}
              onDelete={handleDelete}
              redemptions={redemptions}
            />
          </div>

          <TryItAgainstBag
            code={code}
            items={items}
            archetype={archetype}
            result={result}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onClearBag={clearBag}
            onArchetypeChange={setArchetype}
            onEvaluate={() => evaluate(code)}
          />

          <CartDrawerPreview
            code={code}
            items={items}
            archetype={archetype}
            onArchetypeChange={setArchetype}
          />

          <div className="promotions-detail-view__rules-grid">
            <ChangeHistory history={code.history} />
            <WhenMoneyComesBack />
          </div>
        </>
      )}
    </div>
  );
};