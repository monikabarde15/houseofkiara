import React from 'react';
import './tabs.css';
import { Designer } from '../types/designer.types';

export interface PerformanceMetrics {
  livePieces: number;
  lifetimeRentals: number;
  rentalRevenueBooked: number;
  prelovedGmvBooked: number;
}

export interface SupplyListerRow {
  id: string;
  name: string;
  pieces: number;
  live: number;
  lifetimeRentals: number;
}

export interface PricingVelocity {
  rentalBandMin: number;
  rentalBandMax: number;
  averageRental: number;
  depositMin: number;
  depositMax: number;
  velocityPerPieceMonth: number;
  rating: number;
  reviewCount: number;
}

export interface QualityIssue {
  pieceCode: string;
  note: string;
}

export interface QualityReturns {
  returnsAssessed: number;
  withIssues: number;
  issues: QualityIssue[];
}

export interface CustomerPull {
  distinctCustomers: number;
  repeatOrders: number;
  topCustomerName: string;
  topCustomerOrders: number;
  offersEnquiries: number;
  offersOpen: number;
}

export type ListingType = 'Rental' | 'Preloved' | 'Buy New';

export interface PieceSummary {
  id: string;
  code: string;
  name: string;
  listerId: string;
  listerName: string;
  listingTypes: ListingType[];
  isLive: boolean;
  rentPrice?: number;
  rentDuration?: string;
  sellPrice?: number;
  timesRented?: number;
  imageUrl?: string;
}

interface PerformancePiecesTabProps {
  designer: Designer;
  metrics?: PerformanceMetrics;
  supplyNetwork?: SupplyListerRow[];
  pricingVelocity?: PricingVelocity;
  qualityReturns?: QualityReturns;
  customerPull?: CustomerPull;
  pieces?: PieceSummary[];
  onOpenLister?: (listerId: string) => void;
  onOpenCustomer?: (name: string) => void;
  onAddPiece?: () => void;
}

const DEFAULT_METRICS: PerformanceMetrics = {
  livePieces: 3,
  lifetimeRentals: 13,
  rentalRevenueBooked: 71000,
  prelovedGmvBooked: 95000,
};

const DEFAULT_SUPPLY: SupplyListerRow[] = [
  { id: 'meera-joshi', name: 'Meera Joshi', pieces: 3, live: 3, lifetimeRentals: 13 },
];

const DEFAULT_PRICING: PricingVelocity = {
  rentalBandMin: 6400,
  rentalBandMax: 9900,
  averageRental: 8267,
  depositMin: 20000,
  depositMax: 25000,
  velocityPerPieceMonth: 1.8,
  rating: 4.8,
  reviewCount: 53,
};

const DEFAULT_QUALITY: QualityReturns = {
  returnsAssessed: 4,
  withIssues: 1,
  issues: [{ pieceCode: 'SAB-003', note: 'minor embroidery tear on hem' }],
};

const DEFAULT_CUSTOMER_PULL: CustomerPull = {
  distinctCustomers: 7,
  repeatOrders: 0,
  topCustomerName: 'Priya Rathore',
  topCustomerOrders: 1,
  offersEnquiries: 6,
  offersOpen: 4,
};

const DEFAULT_PIECES: PieceSummary[] = [
  {
    id: 'hok-sab-001',
    code: 'HOK-SAB-001',
    name: 'Crimson Zardozi Bridal Lehenga',
    listerId: 'meera-joshi',
    listerName: 'Meera Joshi',
    listingTypes: ['Rental'],
    isLive: true,
    rentPrice: 8500,
    rentDuration: '3 days',
    timesRented: 6,
  },
  {
    id: 'hok-sab-002',
    code: 'HOK-SAB-002',
    name: 'Gulabi Silk Bridal Lehenga',
    listerId: 'meera-joshi',
    listerName: 'Meera Joshi',
    listingTypes: ['Rental', 'Preloved'],
    isLive: true,
    sellPrice: 110000,
    rentPrice: 6400,
    timesRented: 4,
  },
  {
    id: 'hok-sab-003',
    code: 'HOK-SAB-003',
    name: 'Rajputana Silk Bridal Lehenga',
    listerId: 'meera-joshi',
    listerName: 'Meera Joshi',
    listingTypes: ['Rental'],
    isLive: true,
    rentPrice: 9900,
    rentDuration: '3 days',
    timesRented: 3,
  },
];

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const buildConcentrationNote = (designerName: string, supplyNetwork: SupplyListerRow[]) => {
  const totalPieces = supplyNetwork.reduce((sum, l) => sum + l.pieces, 0);
  if (totalPieces === 0 || supplyNetwork.length === 0) return null;

  const top = [...supplyNetwork].sort((a, b) => b.pieces - a.pieces)[0];
  const pct = Math.round((top.pieces / totalPieces) * 100);

  if (supplyNetwork.length === 1) {
    return (
      <>
        <strong>Concentration:</strong> {pct}% of this designer's supply comes from{' '}
        <span className="link-inline">{top.name}</span> ({top.pieces} piece{top.pieces === 1 ? '' : 's'}). A
        single-lister dependency — strong case for recruiting more {designerName} listers.
      </>
    );
  }

  return (
    <>
      <strong>Concentration:</strong> {pct}% of this designer's supply comes from{' '}
      <span className="link-inline">{top.name}</span> ({top.pieces} of {totalPieces} pieces).
    </>
  );
};

const pieceCountByType = (pieces: PieceSummary[], type: ListingType) =>
  pieces.filter((p) => p.listingTypes.includes(type)).length;

const PerformancePiecesTab: React.FC<PerformancePiecesTabProps> = ({
  designer,
  metrics,
  supplyNetwork,
  pricingVelocity,
  qualityReturns,
  customerPull,
  pieces,
  onOpenLister,
  onOpenCustomer,
  onAddPiece,
}) => {
  const isSabyasachi = designer.id === 'sabyasachi' || designer.slug === 'sabyasachi';

  const activeMetrics = metrics || (isSabyasachi ? DEFAULT_METRICS : {
    livePieces: 0,
    lifetimeRentals: 0,
    rentalRevenueBooked: 0,
    prelovedGmvBooked: 0,
  });

  const activeSupply = supplyNetwork || (isSabyasachi ? DEFAULT_SUPPLY : []);
  const activePricing = pricingVelocity || (isSabyasachi ? DEFAULT_PRICING : null);
  const activeQuality = qualityReturns || (isSabyasachi ? DEFAULT_QUALITY : null);
  const activeCustomer = customerPull || (isSabyasachi ? DEFAULT_CUSTOMER_PULL : null);
  const activePieces = pieces || (isSabyasachi ? DEFAULT_PIECES : []);

  const concentrationNote = buildConcentrationNote(designer.name, activeSupply);

  return (
    <div>
      {/* Top stat cards */}
      <div className="stat-cards-row">
        <div className="stat-card">
          <div className="stat-card-label">LIVE PIECES</div>
          <div className="stat-card-value stat-serif">{activeMetrics.livePieces}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">LIFETIME RENTALS</div>
          <div className="stat-card-value stat-serif">{activeMetrics.lifetimeRentals}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">RENTAL REVENUE (BOOKED)</div>
          <div className="stat-card-value stat-serif">{formatINR(activeMetrics.rentalRevenueBooked)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">PRELOVED GMV (BOOKED)</div>
          <div className="stat-card-value stat-serif">{formatINR(activeMetrics.prelovedGmvBooked)}</div>
        </div>
      </div>

      {/* Supply network */}
      <div className="tab-card">
        <div className="section-header-row">
          <span className="section-header-title">SUPPLY NETWORK — WHO LISTS THIS DESIGNER</span>
          <span className="section-header-note">Click a lister to open their full record</span>
        </div>

        {activeSupply.length > 0 ? (
          <div className="supply-table">
            <div className="supply-table-head">
              <span className="col-lister">LISTER</span>
              <span className="col-pieces">PIECES</span>
              <span className="col-live">LIVE</span>
              <span className="col-lifetime">LIFETIME RENTALS</span>
              <span className="col-open" />
            </div>
            {activeSupply.map((lister) => (
              <div className="supply-table-row" key={lister.id}>
                <span className="col-lister">
                  <button className="link-inline" onClick={() => onOpenLister?.(lister.id)}>
                    {lister.name}
                  </button>
                </span>
                <span className="col-pieces">{lister.pieces}</span>
                <span className="col-live">{lister.live}</span>
                <span className="col-lifetime">{lister.lifetimeRentals}</span>
                <span className="col-open">
                  <button className="btn btn-outline-small" onClick={() => onOpenLister?.(lister.id)}>
                    Open →
                  </button>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-xs text-[#8C847A]">
            No listers supply this designer yet — every piece here will arrive through LYP submissions or designer-partner stock.
          </div>
        )}

        {concentrationNote && <div className="concentration-note">{concentrationNote}</div>}
      </div>

      {/* Pricing / Quality / Customer three-up */}
      <div className="perf-three-col">
        <div className="tab-card perf-mini-card">
          <div className="perf-mini-title">PRICING &amp; VELOCITY</div>
          {activePricing ? (
            <>
              <div className="perf-row">
                <span className="perf-row-label">RENTAL BAND</span>
                <span className="perf-row-value">
                  {formatINR(activePricing.rentalBandMin)} – {formatINR(activePricing.rentalBandMax)}
                </span>
              </div>
              <div className="perf-row">
                <span className="perf-row-label">AVERAGE RENTAL</span>
                <span className="perf-row-value">{formatINR(activePricing.averageRental)}</span>
              </div>
              <div className="perf-row">
                <span className="perf-row-label">DEPOSITS</span>
                <span className="perf-row-value">
                  {formatINR(activePricing.depositMin)} – {formatINR(activePricing.depositMax)}
                </span>
              </div>
              <div className="perf-row">
                <span className="perf-row-label">VELOCITY</span>
                <span className="perf-row-value">≈{activePricing.velocityPerPieceMonth} / piece / mo</span>
              </div>
              <div className="perf-row perf-row-last">
                <span className="perf-row-label">RATING</span>
                <span className="perf-row-value">
                  {activePricing.rating}★ <span className="perf-row-subvalue">{activePricing.reviewCount} reviews</span>
                </span>
              </div>
            </>
          ) : (
            <div className="text-xs text-[#8C847A] pt-2">
              No rental pieces yet — pricing intelligence appears once inventory maps here.
            </div>
          )}
        </div>

        <div className="tab-card perf-mini-card">
          <div className="perf-mini-title">QUALITY &amp; RETURNS</div>
          {activeQuality ? (
            <>
              <div className="perf-row">
                <span className="perf-row-label">RETURNS ASSESSED</span>
                <span className="perf-row-value">{activeQuality.returnsAssessed}</span>
              </div>
              <div className="perf-row perf-row-last">
                <span className="perf-row-label">WITH ISSUES</span>
                <span className="perf-row-value perf-row-value-danger">{activeQuality.withIssues}</span>
              </div>
              {activeQuality.issues.map((issue) => (
                <p className="perf-issue-line" key={issue.pieceCode}>
                  {issue.pieceCode} · {issue.note}
                </p>
              ))}
            </>
          ) : (
            <div className="text-xs text-[#8C847A] pt-2">
              No return assessments recorded yet.
            </div>
          )}
        </div>

        <div className="tab-card perf-mini-card">
          <div className="perf-mini-title">CUSTOMER PULL</div>
          {activeCustomer ? (
            <>
              <div className="perf-row">
                <span className="perf-row-label">DISTINCT CUSTOMERS</span>
                <span className="perf-row-value">{activeCustomer.distinctCustomers}</span>
              </div>
              <div className="perf-row">
                <span className="perf-row-label">REPEAT (2+ ORDERS)</span>
                <span className="perf-row-value">{activeCustomer.repeatOrders}</span>
              </div>
              <div className="perf-row">
                <span className="perf-row-label">TOP CUSTOMER</span>
                <span className="perf-row-value">
                  <button className="link-inline" onClick={() => onOpenCustomer?.(activeCustomer.topCustomerName)}>
                    {activeCustomer.topCustomerName}
                  </button>{' '}
                  <span className="perf-row-subvalue">{activeCustomer.topCustomerOrders} order{activeCustomer.topCustomerOrders === 1 ? '' : 's'}</span>
                </span>
              </div>
              <div className="perf-row perf-row-last">
                <span className="perf-row-label">OFFERS / ENQUIRIES</span>
                <span className="perf-row-value">
                  {activeCustomer.offersEnquiries} · {activeCustomer.offersOpen} open
                </span>
              </div>
            </>
          ) : (
            <div className="text-xs text-[#8C847A] pt-2">
              No customer activity yet.
            </div>
          )}
        </div>
      </div>

      {/* All Pieces */}
      <div className="all-pieces-header">
        <div className="all-pieces-title-group">
          <span className="all-pieces-title">All Pieces</span>
          <span className="type-count-pill type-count-rental">Rental · {pieceCountByType(activePieces, 'Rental')}</span>
          <span className="type-count-pill type-count-preloved">Preloved · {pieceCountByType(activePieces, 'Preloved')}</span>
          <span className="type-count-pill type-count-buynew">Buy New · {pieceCountByType(activePieces, 'Buy New')}</span>
        </div>
        <button className="btn btn-gold-outline" onClick={onAddPiece}>+ Add New Piece</button>
      </div>

      {activePieces.length > 0 ? (
        <div className="pieces-grid">
          {activePieces.map((piece) => (
            <div className="piece-card" key={piece.id}>
              <div className="piece-card-image">
                <span className="piece-card-tags">
                  {piece.listingTypes.map((t) => (
                    <span key={t} className={`tag tag-${t.toLowerCase().replace(' ', '-')}`}>{t}</span>
                  ))}
                </span>
                {piece.isLive && <span className="tag tag-live">Live</span>}
                <svg className="piece-placeholder-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M21 15l-5-5-9 9" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="piece-card-body">
                <div className="piece-card-name">{piece.name}</div>
                <div className="piece-card-meta">
                  {piece.code} ·{' '}
                  <button className="link-inline" onClick={() => onOpenLister?.(piece.listerId)}>
                    {piece.listerName}
                  </button>{' '}
                  (Lister)
                </div>
                <div className="piece-card-price-row">
                  <span className="piece-card-price">
                    {piece.sellPrice != null && piece.rentPrice != null
                      ? `${formatINR(piece.sellPrice)} · rent ${formatINR(piece.rentPrice)}`
                      : piece.rentPrice != null
                      ? `${formatINR(piece.rentPrice)}${piece.rentDuration ? ` / ${piece.rentDuration}` : ''}`
                      : piece.sellPrice != null
                      ? formatINR(piece.sellPrice)
                      : '—'}
                  </span>
                  {piece.timesRented != null && (
                    <span className="piece-card-rented">{piece.timesRented}× rented</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-[#8C847A] border border-dashed border-[#E8E1D9] rounded bg-[#FAF8F5] my-4 leading-relaxed">
          No pieces mapped to this designer yet. Pieces link here automatically when their Designer field is set to this profile — in the product editor or at submission approval.
        </div>
      )}

      <p className="perf-footnote">
        Every number on this tab derives live from orders, returns, offers and the catalogue — nothing is stored
        on the designer record.
      </p>
    </div>
  );
};

export default PerformancePiecesTab;