import React, { useMemo, useState } from 'react';
import '../css/Designers.css';
import { unmappedLabels, ateliersRail, ateliersRailSuggestion } from '../data/mockDesigners';
import { Designer, DesignerType } from '../types/designer.types';

const TYPE_COLUMNS: DesignerType[] = [
  'Couture House',
  'Contemporary Label',
  'Heritage Weave',
  'Indie Designer',
];

interface DesignersProps {
  designers: Designer[];
  onEditDesigner: (id: string) => void;
  onAddDesigner: () => void;
}

const Designers: React.FC<DesignersProps> = ({ designers: designerList, onEditDesigner, onAddDesigner }) => {
  const [search, setSearch] = useState('');

  const featured = useMemo(
    () =>
      designerList
        .filter((d) => d.isFeatured)
        .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0)),
    [designerList]
  );

  const byType = useMemo(() => {
    const grouped: Record<DesignerType, Designer[]> = {
      'Couture House': [],
      'Contemporary Label': [],
      'Heritage Weave': [],
      'Indie Designer': [],
    };
    designerList.forEach((d) => {
      if (grouped[d.type]) grouped[d.type].push(d);
    });
    return grouped;
  }, [designerList]);

  const unclassified = useMemo(
    () => designerList.filter((d) => !TYPE_COLUMNS.includes(d.type)),
    [designerList]
  );

  const newToHOK = useMemo(() => designerList.filter((d) => d.isNewToHOK), [designerList]);

  const filteredTable = useMemo(() => {
    if (!search.trim()) return designerList;
    const q = search.toLowerCase();
    return designerList.filter((d) => d.name.toLowerCase().includes(q));
  }, [designerList, search]);

  const formatJoined = (iso: string) => iso;

  return (
    <div className="designers-page">
      {/* Page header */}
      {/* <div className="designers-header">
        <h1 className="designers-title">Designers</h1>
        <div className="designers-header-actions">
          <button className="btn btn-outline">
            <span className="btn-icon">⤴</span> View Live Site
          </button>
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div> */}

      <div className="designers-eyebrow">CATALOGUE</div>
      <h2 className="designers-heading">Designers</h2>
      <p className="designers-description">
        Master profiles for every designer on the platform. Nav and homepage derive from this registry
        (featured Active profiles, in sort order); listing filter facets derive from live inventory. All counts
        compute live from the catalogue. Click any row to open the full profile editor.
      </p>

      {/* Unmapped designer labels */}
      {unmappedLabels.length > 0 && (
        <div className="warning-card">
          <div className="warning-card-header">
            <span className="warning-icon">⚠</span>
            <span className="warning-title">UNMAPPED DESIGNER LABELS</span>
          </div>
          <p className="warning-description">
            These labels exist on catalogue pieces but have no designer profile — so they get no filter facet of
            their own, no unified reporting, and fall into "Other Designers" on the storefront. Promote a label to
            create its profile and link every piece carrying it.
          </p>
          {unmappedLabels.map((label) => (
            <div className="unmapped-label-row" key={label.id}>
              <div className="unmapped-label-info">
                <div className="unmapped-label-name">{label.name}</div>
                <div className="unmapped-label-code">{label.code}</div>
              </div>
              <div className="unmapped-label-right">
                <span className="unmapped-piece-count">{label.pieceCount} piece</span>
                <button className="btn btn-gold-outline">Promote to Profile</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Storefront curation section */}
      <div className="curation-section-header">
        <span className="curation-section-title">
          STOREFRONT CURATION — WHAT THE NAV &amp; HOMEPAGE RENDER, MANAGED HERE
        </span>
        <span className="curation-section-note">Every change below writes to the registry and updates all derived surfaces instantly</span>
      </div>

      {/* 01 Featured */}
      <div className="curation-block">
        <div className="curation-block-header">
          <span className="curation-block-title"><span className="curation-block-num">01</span> FEATURED — HOMEPAGE GRID &amp; NAV COLUMN</span>
          <span className="curation-block-note">Drag ⠿ to reorder (arrows work too) · Order here = homepage &amp; nav order</span>
        </div>
        <div className="featured-list">
          {featured.map((d) => (
            <div className="featured-row" key={d.id}>
              <span className="drag-handle">⠿</span>
              <span className="featured-badge">#{d.featuredOrder}</span>
              <span className="featured-name">{d.name}</span>
              <span className="live-pill">{d.livePieces} live</span>
              <span className="row-actions">
                <button className="icon-btn" aria-label="move up">↑</button>
                <button className="icon-btn" aria-label="move down">↓</button>
                <button className="icon-btn" aria-label="remove">×</button>
              </span>
            </div>
          ))}
          <button className="add-link">+ Feature a designer</button>
        </div>
      </div>

      {/* 02 Discover by type */}
      <div className="curation-block">
        <div className="curation-block-header">
          <span className="curation-block-title">
            <span className="curation-block-num">02</span> DISCOVER BY TYPE — COUTURE HOUSES · CONTEMPORARY LABELS · HERITAGE WEAVES · INDIE DESIGNERS
          </span>
          <span className="curation-block-note">Drag between columns · ⇄ to pick · + Add per column — nav &amp; type pages update instantly</span>
        </div>
        <div className="type-columns">
          {TYPE_COLUMNS.map((type) => (
            <div className="type-column" key={type}>
              <div className="type-column-header">
                <span>{type === 'Couture House' ? 'Couture Houses' : type === 'Contemporary Label' ? 'Contemporary Labels' : type === 'Heritage Weave' ? 'Heritage Weaves' : 'Indie Designers'}</span>
                <span className="type-column-count">{byType[type].length} live</span>
              </div>
              <div className="type-column-body">
                {byType[type].length === 0 && (
                  <div className="type-column-empty">drop a designer here</div>
                )}
                {byType[type].map((d) => (
                  <div className="type-row" key={d.id}>
                    <span className="drag-handle">⠿</span>
                    <span className="type-row-name">{d.name}</span>
                    <span className="row-actions">
                      <button className="icon-btn" aria-label="move to another column">⇄</button>
                      <button className="icon-btn" aria-label="remove">×</button>
                    </span>
                  </div>
                ))}
                <button className="add-link">+ Add designer</button>
              </div>
            </div>
          ))}
        </div>

        <div className="unclassified-box">
          <div className="unclassified-header">
            <span>Unclassified</span>
            <span className="unclassified-note">hidden from type pages</span>
          </div>
          <div className="unclassified-body">
            {unclassified.length === 0 ? (
              <div className="type-column-empty">none</div>
            ) : (
              unclassified.map((d) => <div key={d.id} className="type-row-name">{d.name}</div>)
            )}
            <button className="add-link">+ Add designer</button>
          </div>
        </div>
      </div>

      {/* 03 New to HOK */}
      <div className="curation-block">
        <div className="curation-block-header">
          <span className="curation-block-title"><span className="curation-block-num">03</span> NEW TO HOK</span>
          <span className="curation-block-note">Curated by you — the 90-day rule only suggests</span>
        </div>
        <div className="new-to-hok-list">
          {newToHOK.map((d) => (
            <div className="new-row" key={d.id}>
              <span className="new-badge">NEW</span>
              <span className="new-name">{d.name}</span>
              <span className="new-joined">joined {formatJoined(d.joinedAt)}</span>
              <button className="icon-btn" aria-label="remove">×</button>
            </div>
          ))}
          <button className="add-link">+ Add any designer</button>
        </div>
        <div className="suggested-box">
          <div className="suggested-title">SUGGESTED BY RULE — JOINED WITHIN 90 DAYS, NOT YET LISTED</div>
          <div className="suggested-empty">No new suggestions — every recent joiner is already listed.</div>
        </div>
      </div>

      {/* 04 Ateliers rail */}
      <div className="curation-block">
        <div className="curation-block-header">
          <span className="curation-block-title"><span className="curation-block-num">04</span> FROM THE ATELIERS RAIL — DROPDOWN SHOWCASE</span>
          <span className="curation-block-note">Curated by you, max four — the rule only suggests</span>
        </div>
        <div className="ateliers-list">
          {ateliersRail.map((p) => (
            <div className="atelier-row" key={p.id}>
              <span className="drag-handle">⠿</span>
              <span className="featured-badge">#{p.order}</span>
              <span className="atelier-piece-name">{p.pieceName}</span>
              <span className="atelier-designer-name">{p.designerName}</span>
              <span className="row-actions">
                <button className="icon-btn" aria-label="move up">↑</button>
                <button className="icon-btn" aria-label="move down">↓</button>
                <button className="icon-btn" aria-label="remove">×</button>
              </span>
            </div>
          ))}
          <button className="add-link">+ Pin any live piece</button>
        </div>
        <div className="suggested-box">
          <div className="suggested-title">SUGGESTED BY RULE — NEWEST LIVE MAPPED PIECES, ONE PER DESIGNER</div>
          <button className="suggested-pill">
            + {ateliersRailSuggestion.pieceName} <span className="suggested-pill-designer">{ateliersRailSuggestion.designerName}</span>
          </button>
        </div>
        <p className="ateliers-footnote">
          Pinned pieces auto-hide from the storefront if they go off-live or their designer is deactivated — they
          stay pinned here until you remove them.
        </p>
      </div>

      {/* 05 Rule derived */}
      <div className="curation-block">
        <div className="curation-block-header">
          <span className="curation-block-title"><span className="curation-block-num">05</span> RULE-DERIVED — NOTHING TO CURATE</span>
          <span className="curation-block-note">These compute from the catalogue; there is no list to manage</span>
        </div>
        <div className="rule-derived-grid">
          <div className="rule-derived-box">
            <div className="rule-derived-title">A–Z INDEX</div>
            <div className="rule-derived-text">{designerList.filter((d) => d.status === 'Active').length} Active profiles — alphabetical, grouped by type</div>
          </div>
          <div className="rule-derived-box">
            <div className="rule-derived-title">LISTING FILTER FACETS</div>
            <div className="rule-derived-text">
              Derive from live inventory — any label on a live piece is filterable; unmapped labels pool under
              "Other Designers"
            </div>
          </div>
        </div>
      </div>

      {/* Search + table */}
      <div className="designers-table-toolbar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search designers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={onAddDesigner}>+ Add Designer</button>
      </div>

      <div className="designers-table">
        <div className="designers-table-head">
          <span className="col-designer">DESIGNER</span>
          <span className="col-type">TYPE</span>
          <span className="col-slug">SLUG</span>
          <span className="col-pieces">PIECES (LIVE / TOTAL)</span>
          <span className="col-featured">FEATURED</span>
          <span className="col-status">STATUS</span>
          <span className="col-edit" />
        </div>
        {filteredTable.map((d) => (
          <div className="designers-table-row" key={d.id}>
            <div className="col-designer">
              <div className="row-designer-name">{d.name}</div>
              <div className="row-designer-bio">{d.bio}</div>
            </div>
            <div className="col-type">{d.type}</div>
            <div className="col-slug"><code>{d.slug}</code></div>
            <div className="col-pieces">
              {d.livePieces === 0 && d.totalPieces === 0 ? '0 — no pieces yet' : `${d.livePieces} / ${d.totalPieces}`}
            </div>
            <div className="col-featured">
              {d.isFeatured ? (
                <span className="pill pill-green">Yes · #{d.featuredOrder}</span>
              ) : (
                <span className="pill pill-grey">No</span>
              )}
            </div>
            <div className="col-status">
              <span className="pill pill-green">{d.status}</span>
            </div>
            <div className="col-edit">
              <button className="btn btn-outline-small" onClick={() => onEditDesigner(d.id)}>Edit →</button>
            </div>
          </div>
        ))}
        <div className="designers-table-footer">{designerList.length} designers</div>
      </div>
    </div>
  );
};

export default Designers;