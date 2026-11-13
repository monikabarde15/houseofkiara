import React, { useState } from 'react';
import { X, Plus, ShieldCheck, FileText, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import { PageCardData } from '../types';

export interface AddPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePage: (pageData: Partial<PageCardData>, seedContent?: boolean) => Promise<void>;
  onSeedAll?: () => Promise<void>;
  initialGroup?: string;
}

export interface PolicyTemplate {
  slug: string;
  title: string;
  group: 'content-help' | 'policies' | 'system' | 'not-built';
  builtFrom: string;
  summary: string;
  version: string;
  health: 'healthy' | 'needs-attention' | 'critical';
  figuresCount: number;
  checksCount: number;
  answersCount: number;
}

export const ALL_POLICY_TEMPLATES: PolicyTemplate[] = [
  // 1. Content & Help
  {
    slug: '/faqs',
    title: 'Help & FAQs',
    group: 'content-help',
    builtFrom: 'hok_faq_v6',
    summary: 'One hundred and twenty answers, sorted by the moment a customer is in. The answers here are also the ones How It Works and List Your Piece show.',
    version: 'Version 6',
    health: 'needs-attention',
    figuresCount: 29,
    checksCount: 14,
    answersCount: 120
  },
  {
    slug: '/contact',
    title: 'Contact Us',
    group: 'content-help',
    builtFrom: 'hok_contact_v5',
    summary: 'Every way to reach us, up front: WhatsApp concierge, emergency damage line, styling consultations and studio appointments.',
    version: 'Version 5',
    health: 'healthy',
    figuresCount: 19,
    checksCount: 2,
    answersCount: 0
  },
  {
    slug: '/about',
    title: 'About HOK',
    group: 'content-help',
    builtFrom: 'hok_about_v3',
    summary: 'The house manifesto, our circular philosophy, authentication standards and the craft behind luxury piece care.',
    version: 'Version 3',
    health: 'healthy',
    figuresCount: 1,
    checksCount: 9,
    answersCount: 0
  },
  {
    slug: '/how-it-works',
    title: 'How It Works',
    group: 'content-help',
    builtFrom: 'hok_how_it_works_v4',
    summary: 'Rent & buy side by side: booking windows, delivery, fittings, return pickups, and acquiring preloved pieces.',
    version: 'Version 4',
    health: 'healthy',
    figuresCount: 8,
    checksCount: 0,
    answersCount: 0
  },
  {
    slug: '/list-your-piece',
    title: 'List Your Piece',
    group: 'content-help',
    builtFrom: 'hok_lyp_v2',
    summary: 'The acquisition and consignment page: how listers earn, insured transit, professional dry-cleaning and payout terms.',
    version: 'Version 2',
    health: 'healthy',
    figuresCount: 7,
    checksCount: 0,
    answersCount: 0
  },

  // 2. Policies
  {
    slug: '/care-policy',
    title: 'Care, Cleaning & Damage Policy',
    group: 'policies',
    builtFrom: 'hok_care_v1',
    summary: 'What happens if a piece is stained, torn or damaged during a booking. Dry-cleaning promises, minor wear courtesy, and repair protocols.',
    version: 'Version 1',
    health: 'healthy',
    figuresCount: 12,
    checksCount: 2,
    answersCount: 18
  },
  {
    slug: '/deposit-policy',
    title: 'Deposit Policy',
    group: 'policies',
    builtFrom: 'hok_deposit_v2',
    summary: 'Security deposits, return pickup timelines, and deduction rules for rentals and preloved acquisitions.',
    version: 'Version 2',
    health: 'healthy',
    figuresCount: 12,
    checksCount: 1,
    answersCount: 14
  },
  {
    slug: '/terms',
    title: 'Terms & Conditions',
    group: 'policies',
    builtFrom: 'hok_terms_v5',
    summary: 'Official operating rules, cancellation conditions, and legal rental obligations across all orders.',
    version: 'Version 5',
    health: 'healthy',
    figuresCount: 18,
    checksCount: 0,
    answersCount: 0
  },
  {
    slug: '/refunds',
    title: 'Refund & Cancellation Policy',
    group: 'policies',
    builtFrom: 'hok_refunds_v3',
    summary: 'Cancellation windows, date changes, fit guarantees, and payment refund processing timelines.',
    version: 'Version 3',
    health: 'healthy',
    figuresCount: 8,
    checksCount: 1,
    answersCount: 12
  },
  {
    slug: '/shipping-policy',
    title: 'Shipping & Delivery Policy',
    group: 'policies',
    builtFrom: 'hok_shipping_v4',
    summary: 'Doorstep deliveries, return pickup logistics, transit insurance, and packaging hygiene.',
    version: 'Version 4',
    health: 'healthy',
    figuresCount: 14,
    checksCount: 0,
    answersCount: 16
  },
  {
    slug: '/pricing',
    title: 'Pricing & Fees',
    group: 'policies',
    builtFrom: 'hok_pricing_v2',
    summary: 'Transparent fee structures, cleaning fees, GST rates, and dry-cleaning inclusions across all categories.',
    version: 'Version 2',
    health: 'healthy',
    figuresCount: 10,
    checksCount: 0,
    answersCount: 10
  },
  {
    slug: '/seller-guidelines',
    title: 'Seller Guidelines',
    group: 'policies',
    builtFrom: 'hok_seller_v3',
    summary: 'Lister expectations, piece condition grading, authentications, and consignment commission terms.',
    version: 'Version 3',
    health: 'healthy',
    figuresCount: 6,
    checksCount: 0,
    answersCount: 15
  },
  {
    slug: '/privacy',
    title: 'Privacy Policy',
    group: 'policies',
    builtFrom: 'hok_privacy_v1',
    summary: 'Customer data protection, KYC encryption, payment security standards, and privacy commitments.',
    version: 'Version 1',
    health: 'healthy',
    figuresCount: 3,
    checksCount: 0,
    answersCount: 0
  },
  {
    slug: '/cookies',
    title: 'Cookie Policy',
    group: 'policies',
    builtFrom: 'hok_cookies_v1',
    summary: 'Cookie preferences, consent storage, tracking policies, and analytics disclosure.',
    version: 'Version 1',
    health: 'healthy',
    figuresCount: 1,
    checksCount: 0,
    answersCount: 0
  },

  // 3. System Pages
  {
    slug: '/404',
    title: 'Page not found',
    group: 'system',
    builtFrom: 'hok_system_404',
    summary: 'Shown when an unknown address is entered. Searches similar pieces and offers WhatsApp concierge.',
    version: 'Version 1',
    health: 'healthy',
    figuresCount: 4,
    checksCount: 0,
    answersCount: 0
  },
  {
    slug: '/search',
    title: 'No search results',
    group: 'system',
    builtFrom: 'hok_system_search',
    summary: 'Shown when a search yields zero matches. Recommends closest categories and designers.',
    version: 'Version 1',
    health: 'healthy',
    figuresCount: 4,
    checksCount: 0,
    answersCount: 0
  },
  {
    slug: '/maintenance',
    title: 'Maintenance',
    group: 'system',
    builtFrom: 'hok_system_maint',
    summary: 'Shown when the storefront is temporarily under maintenance. Shows scheduled return time.',
    version: 'Version 1',
    health: 'healthy',
    figuresCount: 4,
    checksCount: 0,
    answersCount: 0
  },

  // 4. Not Built Yet
  {
    slug: '/blog',
    title: 'Blog',
    group: 'not-built',
    builtFrom: 'hok_blog_draft',
    summary: 'Editorial styling guides, bridal trends, and luxury fashion stories.',
    version: 'Draft',
    health: 'healthy',
    figuresCount: 2,
    checksCount: 0,
    answersCount: 0
  },
  {
    slug: '/careers',
    title: 'Careers',
    group: 'not-built',
    builtFrom: 'hok_careers_draft',
    summary: 'Opportunities to join the House of Kaira curation, operations and concierge team.',
    version: 'Draft',
    health: 'healthy',
    figuresCount: 3,
    checksCount: 0,
    answersCount: 0
  },
  {
    slug: '/press',
    title: 'Press',
    group: 'not-built',
    builtFrom: 'hok_press_draft',
    summary: 'Media coverage, press kits, brand announcements, and publications.',
    version: 'Draft',
    health: 'healthy',
    figuresCount: 2,
    checksCount: 0,
    answersCount: 0
  }
];

export const AddPolicyModal: React.FC<AddPolicyModalProps> = ({
  isOpen,
  onClose,
  onSavePage,
  onSeedAll,
  initialGroup
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string>('/faqs');
  const [title, setTitle] = useState<string>('Help & FAQs');
  const [slug, setSlug] = useState<string>('/faqs');
  const [group, setGroup] = useState<'content-help' | 'policies' | 'system' | 'not-built'>('content-help');
  const [builtFrom, setBuiltFrom] = useState<string>('hok_faq_v6');
  const [version, setVersion] = useState<string>('Version 6');
  const [summary, setSummary] = useState<string>(
    'One hundred and twenty answers, sorted by the moment a customer is in. The answers here are also the ones How It Works and List Your Piece show.'
  );
  const [health, setHealth] = useState<'healthy' | 'needs-attention' | 'critical'>('needs-attention');
  const [figuresCount, setFiguresCount] = useState<number>(29);
  const [checksCount, setChecksCount] = useState<number>(14);
  const [answersCount, setAnswersCount] = useState<number>(120);
  const [includeBaselineContent, setIncludeBaselineContent] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSeedingAll, setIsSeedingAll] = useState<boolean>(false);

  React.useEffect(() => {
    if (isOpen && initialGroup) {
      if (['content-help', 'policies', 'system', 'not-built'].includes(initialGroup)) {
        setGroup(initialGroup as any);
        const match = ALL_POLICY_TEMPLATES.find(t => t.group === initialGroup);
        if (match) {
          handleSelectTemplate(match.slug);
        }
      }
    }
  }, [isOpen, initialGroup]);

  if (!isOpen) return null;

  const handleSelectTemplate = (selected: string) => {
    setSelectedSlug(selected);
    const template = ALL_POLICY_TEMPLATES.find(t => t.slug === selected);
    if (template) {
      setTitle(template.title);
      setSlug(template.slug);
      setGroup(template.group);
      setBuiltFrom(template.builtFrom);
      setVersion(template.version);
      setSummary(template.summary);
      setHealth(template.health);
      setFiguresCount(template.figuresCount);
      setChecksCount(template.checksCount);
      setAnswersCount(template.answersCount);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !title) return;

    try {
      setIsSubmitting(true);
      await onSavePage(
        {
          slug: slug.startsWith('/') ? slug : `/${slug}`,
          title,
          group,
          builtFrom,
          version,
          summary,
          health,
          figuresCount: Number(figuresCount) || 0,
          checksCount: Number(checksCount) || 0,
          wordsCount: group === 'content-help' ? 12000 : 4500,
          lastPublished: '17 Sep 2026',
          lastEditor: 'Priya R.',
          isBuilt: group !== 'not-built',
          hasScheduled: false
        },
        includeBaselineContent
      );
      onClose();
    } catch (err) {
      console.error('Failed to save policy:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeedAllClick = async () => {
    if (!onSeedAll) return;
    try {
      setIsSeedingAll(true);
      await onSeedAll();
      onClose();
    } catch (err) {
      console.error('Failed to populate all policies:', err);
    } finally {
      setIsSeedingAll(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#fffefb] border border-[#e6dccb] rounded-[10px] w-full max-w-[620px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e6dccb] bg-[#faf7f2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[#c7a55c]/15 text-[#8a6a36] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-[18px] text-[#1a1612] leading-tight">
                Add Policy or Page to Database
              </h3>
              <p className="text-[11px] text-[#73675a]">
                Choose a standard policy template or enter custom details. It will save directly to PostgreSQL.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8a7f72] hover:text-[#1a1612] p-1.5 rounded hover:bg-[#ede5d8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Action: Seed All Standard Policies Button */}
        {onSeedAll && (
          <div className="px-6 py-3 bg-[#f7f2ea] border-b border-[#e6dccb] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#5c5248]">
              <Sparkles className="w-3.5 h-3.5 text-[#b89047]" />
              <span>Want all 20+ standard site policies & pages at once?</span>
            </div>
            <button
              type="button"
              disabled={isSeedingAll}
              onClick={handleSeedAllClick}
              className="px-3 py-1 rounded-[5px] bg-[#1a1612] text-[#f7f2ea] text-[11px] font-medium hover:bg-[#8a6a36] transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Layers className="w-3 h-3" />
              <span>{isSeedingAll ? 'Adding All...' : 'Populate All Standard Pages'}</span>
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-[#1a1612]">
          {/* Policy Preset Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-[#8a7f72] uppercase tracking-wider mb-1.5">
              1. Choose Policy Template to Add
            </label>
            <select
              value={selectedSlug}
              onChange={e => handleSelectTemplate(e.target.value)}
              className="w-full p-2.5 bg-[#fdfbf7] border border-[#d9ccb6] rounded-[6px] text-xs font-medium focus:ring-1 focus:ring-[#bda67b] outline-none"
            >
              <optgroup label="Content & Help">
                {ALL_POLICY_TEMPLATES.filter(p => p.group === 'content-help').map(p => (
                  <option key={p.slug} value={p.slug}>
                    {p.title} ({p.slug}) · {p.version}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Policies & Legal">
                {ALL_POLICY_TEMPLATES.filter(p => p.group === 'policies').map(p => (
                  <option key={p.slug} value={p.slug}>
                    {p.title} ({p.slug}) · {p.version}
                  </option>
                ))}
              </optgroup>
              <optgroup label="System Pages">
                {ALL_POLICY_TEMPLATES.filter(p => p.group === 'system').map(p => (
                  <option key={p.slug} value={p.slug}>
                    {p.title} ({p.slug})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Marketing / Not Built Yet">
                {ALL_POLICY_TEMPLATES.filter(p => p.group === 'not-built').map(p => (
                  <option key={p.slug} value={p.slug}>
                    {p.title} ({p.slug})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8a7f72] uppercase tracking-wider mb-1">
                Policy Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
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
                value={slug}
                onChange={e => setSlug(e.target.value)}
                required
                className="w-full p-2 bg-[#fdfbf7] border border-[#d9ccb6] rounded-[6px] text-xs font-mono focus:ring-1 focus:ring-[#bda67b] outline-none"
              />
            </div>
          </div>

          {/* Group & Version & Health */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8a7f72] uppercase tracking-wider mb-1">
                Group Section
              </label>
              <select
                value={group}
                onChange={e => setGroup(e.target.value as any)}
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
                Version Stamp
              </label>
              <input
                type="text"
                value={version}
                onChange={e => setVersion(e.target.value)}
                className="w-full p-2 bg-[#fdfbf7] border border-[#d9ccb6] rounded-[6px] text-xs focus:ring-1 focus:ring-[#bda67b] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8a7f72] uppercase tracking-wider mb-1">
                Status / Health
              </label>
              <select
                value={health}
                onChange={e => setHealth(e.target.value as any)}
                className="w-full p-2 bg-[#fdfbf7] border border-[#d9ccb6] rounded-[6px] text-xs focus:ring-1 focus:ring-[#bda67b] outline-none"
              >
                <option value="healthy">Live / Healthy</option>
                <option value="needs-attention">Needs attention</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Summary / Descriptive note */}
          <div>
            <label className="block text-[11px] font-semibold text-[#8a7f72] uppercase tracking-wider mb-1">
              Summary Description (shown on card)
            </label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={2}
              className="w-full p-2 bg-[#fdfbf7] border border-[#d9ccb6] rounded-[6px] text-xs focus:ring-1 focus:ring-[#bda67b] outline-none"
            />
          </div>

          {/* Counts & Built From */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8a7f72] uppercase tracking-wider mb-1">
                Built From
              </label>
              <input
                type="text"
                value={builtFrom}
                onChange={e => setBuiltFrom(e.target.value)}
                className="w-full p-2 bg-[#fdfbf7] border border-[#d9ccb6] rounded-[6px] text-xs font-mono text-[#5c5248]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a7f72] uppercase tracking-wider mb-1">
                Figures Printed
              </label>
              <input
                type="number"
                value={figuresCount}
                onChange={e => setFiguresCount(Number(e.target.value))}
                className="w-full p-2 bg-[#fdfbf7] border border-[#d9ccb6] rounded-[6px] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8a7f72] uppercase tracking-wider mb-1">
                Answers Count
              </label>
              <input
                type="number"
                value={answersCount}
                onChange={e => setAnswersCount(Number(e.target.value))}
                className="w-full p-2 bg-[#fdfbf7] border border-[#d9ccb6] rounded-[6px] text-xs"
              />
            </div>
          </div>

          {/* Baseline Content Checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeBaselineContent}
                onChange={e => setIncludeBaselineContent(e.target.checked)}
                className="rounded border-[#d9ccb6] text-[#b89047] focus:ring-[#b89047]"
              />
              <span className="text-[12px] text-[#5c5248]">
                Initialize standard content, sections & questions for this policy in database
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#e6dccb]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[6px] border border-[#d9ccb6] bg-white text-xs font-medium text-[#5c5248] hover:bg-[#faf7f2] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-[6px] bg-[#b89047] hover:bg-[#a67e37] text-white text-xs font-semibold transition cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving to Database...' : 'Save Policy to Database'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPolicyModal;

