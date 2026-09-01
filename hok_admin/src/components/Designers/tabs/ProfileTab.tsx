import React, { useState } from 'react';
import './tabs.css';
import { Designer, DesignerType } from '../types/designer.types';

const DESIGNER_TYPES: DesignerType[] = [
  'Couture House',
  'Contemporary Label',
  'Heritage Weave',
  'Indie Designer',
];

interface OtherDesignerOption {
  id: string;
  name: string;
}

interface ProfileTabProps {
  designer: Designer;
  /** Designers this profile can be merged into (excludes itself). */
  otherDesigners: OtherDesignerOption[];
  /** Whether this profile currently has pieces mapped to it — gates Delete. */
  hasMappedPieces?: boolean;
  onSave?: (designer: Designer) => void;
  onChange?: (updated: Partial<Designer>) => void;
  onMerge?: (targetDesignerId: string) => void;
  onDelete?: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  designer,
  otherDesigners = [],
  hasMappedPieces = false,
  onSave,
  onChange,
  onMerge,
  onDelete,
}) => {
  const [name, setName] = useState(designer.name || '');
  const [slug, setSlug] = useState(designer.slug || '');
  const [type, setType] = useState<DesignerType>(designer.type || 'Couture House');
  const [joinedAt, setJoinedAt] = useState(designer.joinedAt || new Date().toISOString().split('T')[0]);
  const [isNewToHOK, setIsNewToHOK] = useState(designer.isNewToHOK ?? true);
  const [bio, setBio] = useState(designer.bio || '');
  const [isFeatured, setIsFeatured] = useState(designer.isFeatured ?? false);
  const [sortOrder, setSortOrder] = useState(designer.featuredOrder ?? 1);
  const [status, setStatus] = useState(designer.status || 'Active');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [mergeTargetId, setMergeTargetId] = useState('');

  const notifyChange = (fieldUpdates: Partial<Designer>) => {
    const updated = {
      name,
      slug,
      type,
      joinedAt,
      isNewToHOK,
      bio,
      isFeatured,
      featuredOrder: sortOrder,
      status,
      ...fieldUpdates
    };
    onChange?.(updated);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    const newSlug = !designer.id ? val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') : slug;
    if (!designer.id) setSlug(newSlug);
    notifyChange({ name: val, slug: newSlug });
  };

  const handleSave = () => {
    setSavedSuccess(true);
    onSave?.({
      ...designer,
      name,
      slug: slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      type,
      joinedAt,
      isNewToHOK,
      bio,
      isFeatured,
      featuredOrder: sortOrder,
      status,
    });
  };

  const handleMerge = () => {
    if (!mergeTargetId) return;
    onMerge?.(mergeTargetId);
  };

  return (
    <div>
      <div className="tab-card">
        <div className="tab-form-grid">
          {/* Row 1 */}
          <div className="form-field">
            <label className="form-label">DESIGNER / BRAND NAME</label>
            <input className="form-input" value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Roqa" />
            <p className="form-hint">The one field rendered everywhere — homepage grid, listing filters, PDPs, search.</p>
          </div>

          <div className="form-field">
            <label className="form-label">SLUG (STABLE IDENTIFIER)</label>
            <input className="form-input" value={slug} onChange={(e) => { setSlug(e.target.value); notifyChange({ slug: e.target.value }); }} placeholder="e.g. roqa" />
            <p className="form-hint">
              Lowercase and hyphens only. Used as this designer's key in filter URLs (/shop?designer=...) and
              reports. Changing it on a live profile records a redirect so shared links keep working. Recorded
              redirects: none
            </p>
          </div>

          {/* Row 2 */}
          <div className="form-field">
            <label className="form-label">DESIGNER TYPE (DRIVES NAV "DISCOVER BY TYPE")</label>
            <select className="form-select" value={type} onChange={(e) => { setType(e.target.value as DesignerType); notifyChange({ type: e.target.value as DesignerType }); }}>
              {DESIGNER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <p className="form-hint">Drives the nav's type pages. Also editable in bulk on the Designers page → Storefront Curation.</p>
          </div>

          <div className="form-field">
            <label className="form-label">JOINED HOK</label>
            <input
              type="date"
              className="form-input"
              value={joinedAt}
              onChange={(e) => { setJoinedAt(e.target.value); notifyChange({ joinedAt: e.target.value }); }}
            />
            <p className="form-hint">A join date within 90 days makes the rule <em>suggest</em> this profile for New to HOK — membership itself is curated.</p>
            <label className="toggle-row">
              <span className={`toggle ${isNewToHOK ? 'on' : ''}`} onClick={() => { setIsNewToHOK(!isNewToHOK); notifyChange({ isNewToHOK: !isNewToHOK }); }}>
                <span className="toggle-knob" />
              </span>
              <span className="toggle-label">Currently in "New to HOK"</span>
            </label>
            <p className="form-hint">Also managed in bulk on the Designers page → Storefront Curation (zone 03).</p>
          </div>

          {/* Row 3 — bio full width */}
          <div className="form-field form-field-full">
            <label className="form-label">SHORT BIO (ADMIN LISTS &amp; INTERNAL REFERENCE)</label>
            <input className="form-input" value={bio} onChange={(e) => { setBio(e.target.value); notifyChange({ bio: e.target.value }); }} />
            <p className="form-hint">Shown in the admin Designers list. The storefront doesn't render designer descriptions in Phase 1.</p>
          </div>

          {/* Row 4 */}
          <div className="form-field">
            <label className="form-label">FEATURED ON HOMEPAGE GRID</label>
            <label className="toggle-row">
              <span className={`toggle ${isFeatured ? 'on' : ''}`} onClick={() => { setIsFeatured(!isFeatured); notifyChange({ isFeatured: !isFeatured }); }}>
                <span className="toggle-knob" />
              </span>
              <span className="toggle-label">Show on homepage &amp; nav dropdown</span>
            </label>
            <p className="form-hint">
              Homepage grid and nav derive from this registry. Membership and order are managed together on the
              Designers page → Storefront Curation (Featured zone).
            </p>
          </div>

          <div className="form-field">
            <label className="form-label">SORT ORDER (HOMEPAGE, NAV DROPDOWN)</label>
            <input
              type="number"
              className="form-input"
              value={sortOrder}
              onChange={(e) => { setSortOrder(Number(e.target.value)); notifyChange({ featuredOrder: Number(e.target.value) }); }}
            />
            <p className="form-hint">Lower number = earlier position</p>
          </div>

          {/* Row 5 */}
          <div className="form-field">
            <label className="form-label">STATUS</label>
            <select className="form-select" value={status} onChange={(e) => { setStatus(e.target.value as Designer['status']); notifyChange({ status: e.target.value as Designer['status'] }); }}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <p className="form-hint">Promoted everywhere — nav dropdown, homepage grid (if featured), and open for new piece mappings.</p>
          </div>
        </div>

        <div className="tab-form-footer">
          <button className="btn btn-primary-small" onClick={handleSave}>Save Profile</button>
        </div>
      </div>

      {/* Lifecycle — Merge & Delete */}
      <div className="lifecycle-card">
        <div className="lifecycle-header">LIFECYCLE — MERGE &amp; DELETE</div>

        <div className="lifecycle-grid">
          <div className="form-field">
            <label className="form-label">MERGE INTO ANOTHER DESIGNER</label>
            <select
              className="form-select"
              value={mergeTargetId}
              onChange={(e) => setMergeTargetId(e.target.value)}
            >
              <option value="">Merge this profile into...</option>
              {otherDesigners.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <p className="form-hint">
              Remaps every piece to the target, records this identifier as a redirect on it, and removes this
              profile. For duplicates and mistaken promotes.
            </p>
            <button
              className="btn btn-outline-small lifecycle-merge-btn"
              onClick={handleMerge}
              disabled={!mergeTargetId}
            >
              Merge →
            </button>
          </div>

          <div className="form-field">
            <label className="form-label">DELETE THIS PROFILE</label>
            <button className="btn btn-danger-outline-small" onClick={onDelete}>
              Delete Profile
            </button>
            <p className="form-hint">Only allowed when zero pieces are mapped. Otherwise merge or remap first.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;