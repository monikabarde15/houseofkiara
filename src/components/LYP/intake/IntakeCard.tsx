// src/components/LYP/intake/IntakeCard.tsx

import React, { useState } from 'react';
import { ListerPicker } from './ListerPicker';
import { NewListerBlock } from './NewListerBlock';
import { PieceFields } from './PieceFields';
import { IntakeMedia } from './IntakeMedia';
import { IntakeTapeBlock } from './IntakeTapeBlock';
import { Channel, Intent, Media, Measurements } from '../types/submission.types';
import { useIntake } from '../hooks/useIntake';
import './styles/IntakeCard.css';

interface IntakeCardProps {
  listerId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const IntakeCard: React.FC<IntakeCardProps> = ({
  listerId,
  onSuccess,
  onCancel,
}) => {
  const [selectedLister, setSelectedLister] = useState<string | null>(listerId || null);
  const [showNewLister, setShowNewLister] = useState(false);
  const [channel, setChannel] = useState<Channel>('WhatsApp');
  const [piece, setPiece] = useState('');
  const [category, setCategory] = useState('');
  const [designer, setDesigner] = useState('');
  const [colour, setColour] = useState('');
  const [size, setSize] = useState('');
  const [timesWorn, setTimesWorn] = useState('');
  const [yearOfPurchase, setYearOfPurchase] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [intent, setIntent] = useState<Intent>('Open to both');
  const [expectationRent, setExpectationRent] = useState('');
  const [expectationSell, setExpectationSell] = useState('');
  const [selfGrade, setSelfGrade] = useState('');
  const [conditionClaim, setConditionClaim] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [measurements, setMeasurements] = useState<Measurements | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createSubmission } = useIntake();

  const isCustomSize = size === 'Custom / Free Size';

  const handleListerSelect = (listerId: string) => {
    setSelectedLister(listerId);
    setShowNewLister(false);
  };

  const handleNewLister = () => {
    setShowNewLister(true);
    setSelectedLister(null);
  };

  const handleNewListerSuccess = (listerId: string) => {
    setSelectedLister(listerId);
    setShowNewLister(false);
  };

  const handleMediaChange = (newMedia: Media[]) => {
    setMedia(newMedia);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedLister && !showNewLister) {
      newErrors.lister = 'Pick the lister first — or create them with New lister.';
    }

    if (!piece.trim()) {
      newErrors.piece = 'The piece needs a name — that\'s the least a record can carry.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await createSubmission({
        listerId: selectedLister!,
        channel,
        piece,
        category,
        designer,
        colour,
        size,
        measurements: isCustomSize ? measurements : null,
        timesWorn,
        yearOfPurchase,
        originalPrice,
        intent,
        expectation: { rent: expectationRent || null, sell: expectationSell || null },
        selfGrade,
        conditionClaim,
        notes: specialNotes,
        media,
      });
      onSuccess();
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to create submission' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="intake-card card">
      <div className="card-hd">
        <div>
          <span className="card-title">Record a submission — WhatsApp / Instagram / In Person</span>
          <div className="card-sub">Website form entries land here automatically</div>
        </div>
        <span className="intake-close" onClick={onCancel}>×</span>
      </div>

      <div className="card-bd">
        <ListerPicker 
          onSelect={handleListerSelect}
          onNewLister={handleNewLister}
          selectedId={selectedLister}
          error={errors.lister}
        />

        {showNewLister && (
          <NewListerBlock 
            onSuccess={handleNewListerSuccess}
            onCancel={() => setShowNewLister(false)}
          />
        )}

        <PieceFields 
          channel={channel}
          onChannelChange={setChannel}
          piece={piece}
          onPieceChange={setPiece}
          category={category}
          onCategoryChange={setCategory}
          designer={designer}
          onDesignerChange={setDesigner}
          colour={colour}
          onColourChange={setColour}
          size={size}
          onSizeChange={setSize}
          timesWorn={timesWorn}
          onTimesWornChange={setTimesWorn}
          yearOfPurchase={yearOfPurchase}
          onYearOfPurchaseChange={setYearOfPurchase}
          originalPrice={originalPrice}
          onOriginalPriceChange={setOriginalPrice}
          intent={intent}
          onIntentChange={setIntent}
          expectationRent={expectationRent}
          onExpectationRentChange={setExpectationRent}
          expectationSell={expectationSell}
          onExpectationSellChange={setExpectationSell}
          selfGrade={selfGrade}
          onSelfGradeChange={setSelfGrade}
          conditionClaim={conditionClaim}
          onConditionClaimChange={setConditionClaim}
          specialNotes={specialNotes}
          onSpecialNotesChange={setSpecialNotes}
          errors={errors}
        />

        {isCustomSize && (
          <IntakeTapeBlock 
            measurements={measurements}
            onChange={setMeasurements}
          />
        )}

        <IntakeMedia 
          media={media}
          onChange={handleMediaChange}
        />

        {errors.submit && (
          <div className="intake-error">{errors.submit}</div>
        )}

        <div className="intake-actions">
          <button 
            className="btn btn-gold btn-sm" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save to the queue'}
          </button>
          <span className="intake-helper">Lands as New — the 48-hour clock starts at the recorded time.</span>
        </div>
      </div>
    </div>
  );
};