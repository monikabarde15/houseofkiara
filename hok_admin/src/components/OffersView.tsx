import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Download, MessageCircle, Plus, RefreshCw, X } from 'lucide-react';
import { Offer } from '../types';
import * as offerApi from '../services/offerApi';

interface OffersViewProps {
  offers: Offer[];
  loading?: boolean;
  onUpdateOffer: (id: string, updatedFields: Partial<Offer>) => void;
  onAddOffer: (offer: Offer) => void;
}

const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;
const products = [
  { name: 'Gulabi Silk Bridal Lehenga', price: 110000 },
  { name: 'Ivory Embroidered Sherwani', price: 38000 },
  { name: 'Crimson Zardozi Bridal Lehenga', price: 185000 },
];
const tone: Record<Offer['status'], string> = {
  Pending: 'pending', Accepted: 'accepted', Declined: 'declined', Countered: 'countered',
  Expired: 'expired', 'On Hold': 'hold', Enquiry: 'enquiry',
};
const PAGE_SIZE = 10;

export default function OffersView({ offers, loading = false, onUpdateOffer, onAddOffer }: OffersViewProps) {
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [page, setPage] = useState(1);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [showNewOffer, setShowNewOffer] = useState(false);
  const [counterOffer, setCounterOffer] = useState<Offer | null>(null);
  const [counterAmount, setCounterAmount] = useState('60000');
  const [confirmAction, setConfirmAction] = useState<{ offer: Offer; status: Offer['status'] } | null>(null);
  const [acceptedNotice, setAcceptedNotice] = useState(false);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [form, setForm] = useState({ customerName: '', source: 'Phone', email: '', phone: '', productName: '', assignedTo: 'Soumya', offerAmount: '', note: '' });

  const visibleOffers = useMemo(() => offers.filter((offer) => selectedStatus === 'All Status' || offer.status === selectedStatus), [offers, selectedStatus]);
  const totalPages = Math.max(1, Math.ceil(visibleOffers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedOffers = visibleOffers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pendingOffers = offers.filter((offer) => offer.status === 'Pending').length;
  const acceptedOffers = offers.filter((offer) => offer.status === 'Accepted');
  const offeredAmounts = offers.filter((offer) => offer.offerPrice > 0);
  const averageOfferPercent = offeredAmounts.length ? Math.round(offeredAmounts.reduce((total, offer) => total + offer.askPercentage, 0) / offeredAmounts.length) : 0;
  const acceptedRevenue = acceptedOffers.reduce((total, offer) => total + offer.offerPrice, 0);
  const selectedOffer = offers.find((offer) => offer.id === selectedOfferId) ?? null;
  useEffect(() => { if (selectedOfferId) { const current = offers.find((item) => item.id === selectedOfferId); offerApi.getOfferNotes(selectedOfferId, current?.backendId).then((items) => setNotes(items.map((item: any) => item.message || item))).catch(console.error); } }, [selectedOfferId, offers]);
  const selectedProduct = products.find((product) => product.name === form.productName);
  const updateForm = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const addOffer = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.customerName || !form.productName || !form.phone) return;
    const offerPrice = Number(form.offerAmount) || 0;
    const marketPrice = selectedProduct?.price || 0;
    onAddOffer({ id: `OFR-${208 + offers.length}`, customerName: form.customerName, customerEmail: form.email, phone: form.phone, productName: form.productName, marketPrice, offerPrice, askPercentage: offerPrice ? Math.round((offerPrice / marketPrice) * 100) : 0, date: new Date().toISOString().slice(0, 10), status: offerPrice ? 'Pending' : 'Enquiry', channel: form.source, note: form.note });
    setShowNewOffer(false);
  };
  const updateStatus = (offer: Offer, status: Offer['status']) => { onUpdateOffer(offer.id, { status }); setConfirmAction(null); if (status === 'Accepted') setAcceptedNotice(true); };
  const addNote = async () => { if (note.trim() && selectedOffer) { try { await offerApi.addOfferNote(selectedOffer.id, note.trim(), selectedOffer.backendId); setNotes((current) => [...current, note.trim()]); setNote(''); } catch (error) { console.error(error); } } };
  const exportOffers = () => {
    const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = [
      ['Offer ID', 'Product', 'Listed Price', 'Offered Price', 'Percent of Listed', 'Customer', 'Email', 'Phone', 'Channel', 'Status', 'Date', 'Note'],
      ...visibleOffers.map((offer) => [offer.id, offer.productName, offer.marketPrice, offer.offerPrice || 'Enquiry only', offer.offerPrice ? `${offer.askPercentage}%` : '—', offer.customerName, offer.customerEmail, offer.phone || '', offer.channel || 'Website', offer.status, offer.date, offer.note || '']),
    ];
    const blob = new Blob([`\ufeff${rows.map((row) => row.map(quote).join(',')).join('\n')}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = offerApi.exportOffersUrl;
    link.download = `offers-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return <section className="offers-page">
    <div className="offers-title"><span className="section-kicker">Operations</span><h2>Offers &amp; Enquiries</h2><p>Every offer or enquiry received, however it arrived — website, phone, WhatsApp, DM, in person. Click any row for the full back-and-forth, who's handling it, and what's actually been said.</p></div>
    <div className="offer-metrics"><Metric label="Pending offers" value={String(pendingOffers)} accent="orange" /><Metric label="Accepted (MTD)" value={String(acceptedOffers.length)} accent="green" /><Metric label="Avg. offer %" value={`${averageOfferPercent}%`} /><Metric label="Revenue from offers (MTD)" value={money(acceptedRevenue)} /></div>

    <div className="offer-table-card">
      <Toolbar status={selectedStatus} onStatus={(status) => { setSelectedStatus(status); setPage(1); }} onExport={exportOffers} onNew={() => { setForm({ customerName: '', source: 'Phone', email: '', phone: '', productName: '', assignedTo: 'Soumya', offerAmount: '', note: '' }); setShowNewOffer(true); }} />
      {showNewOffer && <NewOfferForm form={form} selectedProduct={selectedProduct} updateForm={updateForm} onSubmit={addOffer} onCancel={() => setShowNewOffer(false)} />}
      <div className="offer-table-scroll"><table className="offer-table"><thead><tr><th>Offer</th><th>Product</th><th>Listed price</th><th>Offered</th><th>% of listed</th><th>Customer</th><th>Channel</th><th>Status</th></tr></thead><tbody>
        {paginatedOffers.map((offer) => <tr key={offer.id} tabIndex={0} onClick={() => setSelectedOfferId(offer.id)} onKeyDown={(event) => event.key === 'Enter' && setSelectedOfferId(offer.id)}><td className="offer-id">{offer.id}</td><td><div className="product-cell"><div className={`product-thumb ${offer.productName.includes('Ivory') ? 'ivory' : ''}`}>♢</div><strong>{offer.productName}</strong></div></td><td>{money(offer.marketPrice)}</td><td className={offer.offerPrice ? 'offered-price' : 'enquiry-only'}>{offer.offerPrice ? money(offer.offerPrice) : 'Enquiry only'}</td><td>{offer.offerPrice ? `${offer.askPercentage}%` : '—'}</td><td><div className="customer-cell"><strong>{offer.customerName}</strong><MessageCircle aria-label="WhatsApp" /></div></td><td>{offer.channel || 'Website'}</td><td><Status status={offer.status} /></td></tr>)}
        {loading && <tr><td className="no-offers" colSpan={8}><span className="offers-loading" aria-label="Loading offers" /> Loading offers…</td></tr>}
        {!loading && !visibleOffers.length && <tr><td className="no-offers" colSpan={8}>No offers under this status.</td></tr>}
      </tbody></table></div>
      {visibleOffers.length > PAGE_SIZE && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={visibleOffers.length} onPageChange={setPage} />}
      <p className="offer-table-help">Every status change and every round of negotiation is written to that offer's own log — click a row to see the full trail.</p>
    </div>

    {selectedOffer && <OfferDetail offer={selectedOffer} notes={notes} note={note} setNote={setNote} addNote={addNote} close={() => setSelectedOfferId(null)} onCounter={() => { setCounterOffer(selectedOffer); setCounterAmount(String(selectedOffer.offerPrice || 60000)); }} onConfirm={(status) => setConfirmAction({ offer: selectedOffer, status })} />}
    {counterOffer && <CounterModal amount={counterAmount} setAmount={setCounterAmount} close={() => setCounterOffer(null)} submit={async () => { try { await offerApi.sendCounterOffer(counterOffer.id, Number(counterAmount), undefined, counterOffer.backendId); onUpdateOffer(counterOffer.id, { status: 'Countered', counterPrice: Number(counterAmount) }); setCounterOffer(null); } catch (error) { console.error(error); } }} />}
    {confirmAction && <ConfirmModal action={confirmAction.status} offerPrice={confirmAction.offer.offerPrice} close={() => setConfirmAction(null)} confirm={() => updateStatus(confirmAction.offer, confirmAction.status)} />}
    {acceptedNotice && <AcceptedNotice close={() => setAcceptedNotice(false)} />}
  </section>;
}

function Toolbar({ status, onStatus, onNew, onExport }: { status: string; onStatus: (value: string) => void; onNew: () => void; onExport: () => void }) { return <div className="offer-table-toolbar"><h3>All Offers &amp; Enquiries</h3><div className="offer-actions"><label className="status-select"><select value={status} onChange={(event) => onStatus(event.target.value)}><option>All Status</option><option>Pending</option><option>Countered</option><option>Accepted</option><option>Declined</option><option>Expired</option><option>On Hold</option><option>Enquiry</option></select><ChevronDown /></label><button className="new-offer-button" onClick={onNew}><Plus /> Log New Offer</button><button className="export-button" onClick={onExport}><Download /> Export</button></div></div>; }
function Status({ status }: { status: Offer['status'] }) { return <span className={`offer-status ${tone[status]}`}>{status === 'Declined' ? 'Rejected' : status}<ChevronDown /></span>; }
function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) { return <div className="offer-metric"><p>{label}</p><strong className={accent || ''}>{value}</strong></div>; }
function Pagination({ currentPage, totalPages, totalItems, onPageChange }: { currentPage: number; totalPages: number; totalItems: number; onPageChange: (page: number) => void }) { const start = (currentPage - 1) * PAGE_SIZE + 1; const end = Math.min(currentPage * PAGE_SIZE, totalItems); return <div className="offer-pagination"><span>Showing {start}–{end} of {totalItems} offers</span><div><button aria-label="Previous page" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}><ChevronLeft /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => <button key={item} className={item === currentPage ? 'active' : ''} onClick={() => onPageChange(item)}>{item}</button>)}<button aria-label="Next page" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}><ChevronRight /></button></div></div>; }
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) { return <label className="offline-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>; }

function NewOfferForm({ form, selectedProduct, updateForm, onSubmit, onCancel }: { form: { customerName: string; source: string; email: string; phone: string; productName: string; assignedTo: string; offerAmount: string; note: string }; selectedProduct?: { name: string; price: number }; updateForm: (key: keyof { customerName: string; source: string; email: string; phone: string; productName: string; assignedTo: string; offerAmount: string; note: string }, value: string) => void; onSubmit: (event: React.FormEvent) => void; onCancel: () => void }) { return <form className="offline-offer-form" onSubmit={onSubmit}><div className="offline-form-heading"><h4>Log an Offer or Enquiry Received Offline</h4><p>For anything that didn't come through the website — a phone call, WhatsApp, a DM, someone at a trunk show. It joins the same list below.</p></div><div className="offline-form-grid"><Field label="Customer name"><input required value={form.customerName} onChange={(e) => updateForm('customerName', e.target.value)} placeholder="e.g. Kavita Singh" /></Field><Field label="Source"><select value={form.source} onChange={(e) => updateForm('source', e.target.value)}><option>Phone</option><option>WhatsApp</option><option>Instagram DM</option><option>In person</option></select></Field><Field label="Email"><input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="Optional" /></Field><Field label="Phone"><input required value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="Optional" /></Field><Field label="Product"><select required value={form.productName} onChange={(e) => updateForm('productName', e.target.value)}><option value="">Select a piece...</option>{products.map((product) => <option key={product.name}>{product.name}</option>)}</select></Field><Field label="Assigned to"><select value={form.assignedTo} onChange={(e) => updateForm('assignedTo', e.target.value)}><option>Soumya</option><option>Team</option></select></Field><Field label="Listed / asking price (₹)" hint="Set on the product's Pricing & Tax tab — change it there, not here."><input readOnly value={selectedProduct ? money(selectedProduct.price) : ''} placeholder="Auto-fills once a piece is selected" /></Field><Field label="Offer amount (₹) — leave blank if it's just an enquiry, no number offered yet"><input type="number" value={form.offerAmount} onChange={(e) => updateForm('offerAmount', e.target.value)} placeholder="e.g. 29000" /></Field></div><Field label="Note"><textarea value={form.note} onChange={(e) => updateForm('note', e.target.value)} placeholder="e.g. Called asking about the piece, offered this amount if we can ship by Friday." /></Field><div className="offline-form-actions"><button type="submit">Add to List</button><button type="button" onClick={onCancel}>Cancel</button></div></form>; }

function OfferDetail({ offer, notes, note, setNote, addNote, close, onCounter, onConfirm }: { offer: Offer; notes: string[]; note: string; setNote: (value: string) => void; addNote: () => void; close: () => void; onCounter: () => void; onConfirm: (status: Offer['status']) => void }) { return <div className="offer-detail"><button className="detail-close" onClick={close}><X /></button><div className="detail-head"><h3>{offer.id} — {offer.productName}</h3><Status status={offer.status} /></div><div className="detail-grid"><DetailItem label="Product" value={offer.productName} featured /><DetailItem label="Customer" value={offer.customerName} whatsapp /><DetailItem label="Submitted" value={`${new Date(offer.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} via ${offer.channel || 'Website'}`} /><DetailItem label="Listed price" value={money(offer.marketPrice)} /><DetailItem label="Offered price" value={`${money(offer.offerPrice)} (${offer.askPercentage}%)`} /></div><div className="negotiation-log"><h4>Negotiation Log</h4><Log text={`Enquiry received on ${offer.channel || 'website'} this morning, logged for review.`} by="Ops — Riya" /><Log text={offer.status === 'Accepted' ? 'Accepted — converted to order ORD-1017.' : `Offer currently marked as ${offer.status}.`} by="Soumya" />{notes.map((item, index) => <React.Fragment key={index}><Log text={item} by="Soumya" /></React.Fragment>)}</div><div className="note-row"><input value={note} onChange={(event) => setNote(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addNote()} placeholder="Add a note to the negotiation log..." /><button onClick={addNote}>Add</button></div><div className="detail-actions"><button className="accept" onClick={() => onConfirm('Accepted')}><Check /> Accept &amp; Convert to Order</button><button onClick={onCounter}><RefreshCw /> Counter-Offer</button><button onClick={() => onConfirm('On Hold')}><span>Ⅱ</span> Put on Hold</button><button className="danger" onClick={() => onConfirm('Declined')}><X /> Reject</button><button onClick={() => onConfirm('Expired')}><Clock3 /> Mark Expired</button></div></div>; }
function DetailItem({ label, value, featured, whatsapp }: { label: string; value: string; featured?: boolean; whatsapp?: boolean }) { return <div className="detail-item"><span>{label}</span><strong className={featured ? 'featured' : ''}>{value}{whatsapp && <MessageCircle />}</strong></div>; }
function Log({ text, by }: { text: string; by: string }) { return <div className="log-line"><span className="log-dot" /><div><small>08 Jul 2026 · {by}</small><p>{text}</p></div></div>; }
function CounterModal({ amount, setAmount, close, submit }: { amount: string; setAmount: (value: string) => void; close: () => void; submit: () => void }) { return <Modal><div className="modal-header"><h3>Send Counter-Offer</h3><button onClick={close}><X /></button></div><div className="counter-body"><label>Counter-offer amount<input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} /></label><p><MessageCircle /> A WhatsApp message pre-filled with this amount will be generated for you to send.</p></div><div className="modal-actions"><button onClick={close}>Cancel</button><button className="dark" onClick={submit}>Send Counter-Offer</button></div></Modal>; }
function ConfirmModal({ action, offerPrice, close, confirm }: { action: Offer['status']; offerPrice: number; close: () => void; confirm: () => void }) { const name = action === 'Declined' ? 'Rejected' : action; const message = action === 'Accepted' ? `Accept this offer of ${money(offerPrice)} and create a confirmed order?` : `Mark this offer as "${name}"?`; return <Modal small><div className="modal-header"><h3>Please Confirm</h3><button onClick={close}><X /></button></div><p className="confirm-copy">{message}</p><div className="modal-actions"><button onClick={close}>Cancel</button><button className="confirm" onClick={confirm}>Confirm</button></div></Modal>; }
function AcceptedNotice({ close }: { close: () => void }) { return <Modal small><div className="accepted-notice"><p>Marked as Accepted. Remember to confirm with the customer yourself and help them complete checkout — this only updates the record here.</p><button onClick={close}>OK</button></div></Modal>; }
function Modal({ children, small = false }: { children: React.ReactNode; small?: boolean }) { return <div className="modal-backdrop"><div className={`offer-modal ${small ? 'small' : ''}`}>{children}</div></div>; }
