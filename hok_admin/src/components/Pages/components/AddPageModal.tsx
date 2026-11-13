import React, { useState } from 'react';
import { X, Plus, BookOpen } from 'lucide-react';
import { PageCardData } from '../types';

export interface AddPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePage: (pageData: Partial<PageCardData>) => Promise<void>;
}

const PRESET_PAGES = [
  { slug: '/faqs', title: 'Help & FAQs', group: 'content-help', summary: 'One hundred and twenty answers, sorted by the moment a customer is in.' },
  { slug: '/contact', title: 'Contact Us', group: 'content-help', summary: 'Every way to reach us, up front: WhatsApp concierge, emergency damage line, styling consultations.' },
  { slug: '/about', title: 'About HOK', group: 'content-help', summary: 'The house manifesto, circular philosophy, authentication standards and luxury care.' },
  { slug: '/how-it-works', title: 'How It Works', group: 'content-help', summary: 'Rent & buy side by side: booking windows, delivery, fittings, return pickups.' },
  { slug: '/list-your-piece', title: 'List Your Piece', group: 'content-help', summary: 'The acquisition and consignment page: how listers earn, insured transit, and payout terms.' },
  { slug: '/care-policy', title: 'Care, Cleaning & Damage Policy', group: 'policies', summary: 'What happens if a piece is stained, torn or damaged during a booking.' },
  { slug: '/terms', title: 'Terms & Conditions', group: 'policies', summary: 'Operating rules, cancellation conditions, and legal rental obligations.' },
  { slug: '/privacy', title: 'Privacy Policy', group: 'policies', summary: 'Data protection, customer security standards, and privacy commitments.' },
  { slug: '/deposit-policy', title: 'Deposit Policy', group: 'policies', summary: 'Security deposits, return pickup timelines, and deduction rules.' },
  { slug: '/refunds', title: 'Refund & Cancellation Policy', group: 'policies', summary: 'Cancellation windows, date changes, and refund timelines.' },
  { slug: '/shipping-policy', title: 'Shipping & Delivery Policy', group: 'policies', summary: 'Doorstep deliveries, return logistics, and transit timelines.' },
  { slug: '/pricing', title: 'Pricing & Fees', group: 'policies', summary: 'Transparent fee structures, cleaning fees, and dry-cleaning inclusions.' },
  { slug: '/seller-guidelines', title: 'Seller Guidelines', group: 'policies', summary: 'Lister expectations, piece condition grading, and consignment rules.' },
  { slug: '/cookies', title: 'Cookie Policy', group: 'policies', summary: 'Cookie preferences, consent storage, and analytics tracking.' },
  { slug: '/404', title: 'Page not found', group: 'system', summary: 'Shown when an unknown address is entered.' },
  { slug: '/search', title: 'No search results', group: 'system', summary: 'Shown when a search yields zero matches.' },
  { slug: '/maintenance', title: 'Maintenance', group: 'system', summary: 'Shown when the storefront is temporarily under maintenance.' },
  { slug: '/blog', title: 'Blog', group: 'not-built', summary: 'Editorial styling guides and luxury fashion features.' },
  { slug: '/careers', title: 'Careers', group: 'not-built', summary: 'Opportunities to join the House of Kaira team.' },
  { slug: '/press', title: 'Press', group: 'not-built', summary: 'Media coverage, press kits, and brand announcements.' },
];

export const AddPageModal: React.FC<AddPageModalProps> = ({ isOpen, onClose, onSavePage }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('/faqs');
  const [customTitle, setCustomTitle] = useState<string>('Help & FAQs');
  const [customSlug, setCustomSlug] = useState<string>('/faqs');
  const [customGroup, setCustomGroup] = useState<string>('content-help');
  const [customSummary, setCustomSummary] = useState<string>('One hundred and twenty answers, sorted by the moment a customer is in.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePresetChange = (slug: string) => {
    setSelectedPreset(slug);
    const found = PRESET_PAGES.find(p => p.slug === slug);
    if (found) {
      setCustomTitle(found.title);
      setCustomSlug(found.slug);
      setCustomGroup(found.group);
      setCustomSummary(found.summary);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSlug || !customTitle) return;
    try {
      setIsSubmitting(true);
      await onSavePage({
        slug: customSlug.startsWith('/') ? customSlug : `/${customSlug}`,
        title: customTitle,
        group: customGroup,
        summary: customSummary,
        version: 'Version 1',
        health: 'healthy',
        isBuilt: customGroup !== 'not-built'
      });
      onClose();
    } catch (err) {
      console.error('Failed to create page:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-[#fffefb] border border-[#e6dccb] rounded-[10px] w-full max-w-[540px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e6dccb] bg-[#faf7f2]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#8a6a36]" />
            <h3 className="font-serif text-lg text-[#1a1612]">Add Page to Database</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8a7f72] hover:text-[#1a1612] p-1 rounded hover:bg-[#ede5d8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-[#1a1612]">
          <div>
            <label className="block text-[11px] font-semibold text-[#8a7f72] uppercase tracking-wider mb-1">
              Select Preset or Custom
            </label>
            <select
              value={selectedPreset}
              onChange={e => handlePresetChange(e.target.value)}
              className="w-full p-2 bg-[#fdfbf7] border border-[#d9ccb6] rounded-[6px] text-xs focus:ring-1 focus:ring-[#bda67b] outline-none"
            >
              <optgroup label="Content & Help">
                {PRESET_PAGES.filter(p => p.group === 'content-help').map(p => (
                  <option key={p.slug} value={p.slug}>{p.title} ({p.slug})</option>
                ))}
              </optgroup>
              <optgroup label="Policies">
                {PRESET_PAGES.filter(p => p.group === 'policies').map(p => (
                  <option key={p.slug} value={p.slug}>{p.title} ({p.slug})</option>
                ))}
              </optgroup>
              <optgroup label="System Pages">
                {PRESET_PAGES.filter(p => p.group === 'system').map(p => (
                  <option key={p.slug} value={p.slug}>{p.title} ({p.slug})</option>
                ))}
              </optgroup>
              <optgroup label="Not Built Yet">
                {PRESET_PAGES.filter(p => p.group === 'not-built').map(p => (
                  <option key={p.slug} value={p.slug}>{p.title} ({p.slug})</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8a7f72] uppercase tracking-wider mb-1">
                Page Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                required
                className="w-full p-2 bg-[#fdfbf7] border border-[#d9ccb6] rounded-[6px] text-xs focus:ring-1 focus:ring-[#bda67b] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8a7f72] uppercase tracking-wider mb-1">
                Route Slug
              </label>
              <input
                type="text"
                value={customSlug}
                onChange={e => setCustomSlug(e.target.value)}
                required
                className="w-full p-2 bg-[#fdfbf7] border border-[#d9ccb6] rounded-[6px] text-xs focus:ring-1 focus:ring-[#bda67b] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8a7f72] uppercase tracking-wider mb-1">
              Group Section
            </label>
            <select
              value={customGroup}
              onChange={e => setCustomGroup(e.target.value)}
              className="w-full p-2 bg-[#fdfbf7] border border-[#d9ccb6] rounded-[6px] text-xs focus:ring-1 focus:ring-[#bda67b] outline-none"
            >
              <option value="content-help">Content & help</option>
              <option value="policies">Policies</option>
              <option value="system">System pages</option>
              <option value="not-built">Not built yet</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8a7f72] uppercase tracking-wider mb-1">
              Summary Description
            </label>
            <textarea
              value={customSummary}
              onChange={e => setCustomSummary(e.target.value)}
              rows={2}
              className="w-full p-2 bg-[#fdfbf7] border border-[#d9ccb6] rounded-[6px] text-xs focus:ring-1 focus:ring-[#bda67b] outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e6dccb]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-[6px] border border-[#d9ccb6] bg-white text-xs font-medium text-[#5c5248] hover:bg-[#faf7f2] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-[6px] bg-[#c7a55c] hover:bg-[#b9974b] text-[#2a2118] text-xs font-semibold transition cursor-pointer shadow-2xs disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : 'Save Page to Database'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPageModal;

