// src/components/Listers/tabs/SubmittedPieces/SubmissionForm.tsx

import React, { useState } from 'react';
import { Channel, Intent, Media } from '../../types/lister.types';
import { MediaPicker } from './MediaPicker';
import { CHANNELS, INTENTS, CONDITION_GRADES } from '../../utils/constants';
import { useSubmissions } from '../../hooks/useSubmissions';
import { getProducts } from '../../../../services/productApi';
import { uploadFile } from '../../../../services/uploadApi';
import { Product } from '../../../../types';
import './styles/SubmissionForm.css';

interface SubmissionFormProps {
  listerId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'Bridal Lehenga', 'Lehenga', 'Saree', 'Anarkali', 'Sherwani',
  'Gown', 'Sharara', 'Suit', 'Dupatta', 'Co-ord Set',
];

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  listerId,
  onSuccess,
  onCancel,
}) => {
  const { createSubmission, loading } = useSubmissions(listerId);
  
  const [formData, setFormData] = useState({
    piece: '',
    designer: '',
    category: '',
    intent: 'Rent + Sell' as Intent,
    askRent: '',
    askSell: '',
    colour: '',
    size: '',
    timesWorn: '',
    originalPrice: '',
    conditionClaim: '',
    initialGrade: 'Pristine' as string,
    channel: 'WhatsApp' as Channel,
    notes: '',
    media: [] as Media[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [designers, setDesigners] = useState<string[]>([]);
  const [productNames, setProductNames] = useState<string[]>([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const uniqueDesigners = Array.from(new Set(data.map(p => p.designer || p.data?.designer).filter(Boolean)));
        setDesigners(uniqueDesigners as string[]);
        const uniqueNames = Array.from(new Set(data.map(p => p.name || p.data?.name || p.title || p.data?.title).filter(Boolean)));
        setProductNames(uniqueNames as string[]);
      } catch (e) {
        console.error("Failed to fetch products for autocomplete", e);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleMediaChange = (media: Media[]) => {
    setFormData(prev => ({ ...prev, media }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.piece.trim()) newErrors.piece = 'Piece name is required.';
    if (!formData.designer.trim()) newErrors.designer = 'Designer label is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [uploadingMedia, setUploadingMedia] = useState(false);

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setUploadingMedia(true);
      
      // Upload any new media files to Cloudinary
      const processedMedia = await Promise.all(
        formData.media.map(async (m) => {
          if ((m as any).file) {
            const uploaded = await uploadFile((m as any).file, 'submissions');
            return {
              name: m.name,
              url: uploaded.url,
              kind: m.kind
            };
          }
          return { name: m.name, url: m.url, kind: m.kind }; // ensure we strip the File object
        })
      );

      const finalData = {
        ...formData,
        media: processedMedia
      };

      await createSubmission(finalData);
      window.dispatchEvent(new Event('refreshProducts'));
      onSuccess();
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to create submission' });
    } finally {
      setUploadingMedia(false);
    }
  };

  return (
    <div className="submission-form">

      {/* Row 1: Piece Name + Designer Label */}
      <div className="sf-row sf-g2">
        <div className="fld">
          <label className="fld-label">Piece Name *</label>
          <input
            type="text"
            list="pieces-list"
            className={`fld-input ${errors.piece ? 'fld-error' : ''}`}
            value={formData.piece}
            onChange={(e) => handleChange('piece', e.target.value)}
            placeholder="e.g. Emerald Silk Anarkali"
          />
          {errors.piece && <div className="fld-error-text">{errors.piece}</div>}
        </div>
        <div className="fld">
          <label className="fld-label">Designer Label *</label>
          <input
            type="text"
            list="designers-list"
            className={`fld-input ${errors.designer ? 'fld-error' : ''}`}
            value={formData.designer}
            onChange={(e) => handleChange('designer', e.target.value)}
            placeholder="e.g. Sabyasachi, bespoke"
          />
          {errors.designer && <div className="fld-error-text">{errors.designer}</div>}
          <div className="fld-hint">Drives the SKU and auto-maps to the registry on approval; unknown labels land in Unmapped Labels.</div>
        </div>
      </div>

      {/* Row 2: Category + Intent */}
      <div className="sf-row sf-g2">
        <div className="fld">
          <label className="fld-label">Category</label>
          <select className="fld-input" value={formData.category} onChange={(e) => handleChange('category', e.target.value)}>
            <option value="">Select category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="fld">
          <label className="fld-label">Intent</label>
          <select className="fld-input" value={formData.intent} onChange={(e) => handleChange('intent', e.target.value)}>
            {INTENTS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      {/* Row 3: Ask Rent + Ask Outright */}
      <div className="sf-row sf-g2">
        <div className="fld">
          <label className="fld-label">Ask — Rent</label>
          <input
            type="text"
            className="fld-input"
            value={formData.askRent}
            onChange={(e) => handleChange('askRent', e.target.value)}
            placeholder="e.g. ₹3,500 / 4 days"
          />
        </div>
        <div className="fld">
          <label className="fld-label">Ask — Outright</label>
          <input
            type="text"
            className="fld-input"
            value={formData.askSell}
            onChange={(e) => handleChange('askSell', e.target.value)}
            placeholder="e.g. ₹28,000"
          />
        </div>
      </div>

      {/* Row 4: Colour + Size */}
      <div className="sf-row sf-g2">
        <div className="fld">
          <label className="fld-label">Colour</label>
          <input
            type="text"
            className="fld-input"
            value={formData.colour}
            onChange={(e) => handleChange('colour', e.target.value)}
            placeholder=""
          />
        </div>
        <div className="fld">
          <label className="fld-label">Size</label>
          <input
            type="text"
            className="fld-input"
            value={formData.size}
            onChange={(e) => handleChange('size', e.target.value)}
            placeholder="e.g. M / Free Size"
          />
        </div>
      </div>

      {/* Row 5: Times Worn + Original Purchase Price */}
      <div className="sf-row sf-g2">
        <div className="fld">
          <label className="fld-label">Times Worn</label>
          <input
            type="text"
            className="fld-input"
            value={formData.timesWorn}
            onChange={(e) => handleChange('timesWorn', e.target.value)}
            placeholder="e.g. 2"
          />
        </div>
        <div className="fld">
          <label className="fld-label">Original Purchase Price</label>
          <input
            type="text"
            className="fld-input"
            value={formData.originalPrice}
            onChange={(e) => handleChange('originalPrice', e.target.value)}
            placeholder="e.g. ₹42,000"
          />
        </div>
      </div>

      {/* Row 6: Condition — full width */}
      <div className="sf-row">
        <div className="fld">
          <label className="fld-label">Condition — In the Lister's Words</label>
          <textarea
            className="fld-input"
            value={formData.conditionClaim}
            onChange={(e) => handleChange('conditionClaim', e.target.value)}
            placeholder="e.g. worn once at a cousin's sangeet, dry-cleaned and stored in muslin since"
            rows={3}
          />
        </div>
      </div>

      {/* Row 7: Media — Photos & In-Store Video */}
      <div className="sf-row">
        <div className="fld">
          <label className="fld-label">Media — Photos &amp; In-Store Video</label>
          <MediaPicker media={formData.media} onChange={handleMediaChange} />
        </div>
      </div>

      {/* Row 8: Initial Grade + Channel */}
      <div className="sf-row sf-g2">
        <div className="fld">
          <label className="fld-label">Initial Grade — Our First Read</label>
          <select className="fld-input" value={formData.initialGrade} onChange={(e) => handleChange('initialGrade', e.target.value)}>
            {CONDITION_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <div className="fld-hint">Fair stays rental-only. The final grade is set at authentication.</div>
        </div>
        <div className="fld">
          <label className="fld-label">Channel</label>
          <select className="fld-input" value={formData.channel} onChange={(e) => handleChange('channel', e.target.value)}>
            {CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Row 9: Notes / Flags — full width */}
      <div className="sf-row">
        <div className="fld">
          <label className="fld-label">Notes / Flags</label>
          <input
            type="text"
            className="fld-input"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="anything they flagged — stains, alterations, pickup constraints"
          />
        </div>
      </div>

      {errors.submit && (
        <div className="sf-error">{errors.submit}</div>
      )}

      {/* Actions */}
      <datalist id="pieces-list">
        {productNames.map(p => <option key={p} value={p} />)}
      </datalist>
      <datalist id="designers-list">
        {designers.map(d => <option key={d} value={d} />)}
      </datalist>

      <div className="sf-actions">
        <button className="btn btn-gold btn-sm" onClick={handleSubmit} disabled={loading || uploadingMedia}>
          {loading || uploadingMedia ? 'Saving...' : 'Save to Approvals Queue'}
        </button>
        <button className="btn btn-sec btn-sm" onClick={onCancel} disabled={loading || uploadingMedia}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SubmissionForm;