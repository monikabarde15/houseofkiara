import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Save,
  ExternalLink,
  Palette,
  Type,
  Eye,
  EyeOff,
  RotateCcw,
  Plus,
  ChevronDown,
  ChevronRight,
  Monitor,
  Tablet,
  Smartphone,
  ArrowUp,
  ArrowDown,
  Trash2,
  Maximize2,
  X,
  FileText,
  Table2,
  HelpCircle,
  Globe,
  CheckCircle2,
  AlertCircle,
  Download,
  Loader2,
  Layers,
} from 'lucide-react';
import {
  DEFAULT_PAGE_STYLE,
  FONT_OPTIONS_HEADING,
  FONT_OPTIONS_BODY,
  PageStyleConfig,
} from '../data/servicePagesSchema';
import { getEditorialTemplateForPage } from '../data/editorialPageTemplates';
import {
  getAllPages,
  getPageContent,
  savePageContent,
  savePage,
} from '../../../services/pageApi';
import { PageCardData } from '../types';
import { RichWordEditor } from './RichWordEditor';
import {
  sanitizeRichHtmlAdmin,
  importStructuredPageFromIframe,
} from '../utils/sanitizeRichHtml';

export type DynamicBlockType = 'rich' | 'table' | 'faq' | 'tabs';
export type DynamicTabStyle = 'pill' | 'letters' | 'underline';

export interface DynamicTableRow {
  id: string;
  label: string;
  col1Title: string;
  col1Note: string;
  col2Title?: string;
  col2Note?: string;
}

export interface DynamicFaqItem {
  id: string;
  question: string;
  badgeText?: string;
  badgeTone?: 'neutral' | 'good' | 'caution';
  answerHtml: string;
}

export interface DynamicTabItem {
  id: string;
  label: string;
  sublabel?: string;
  accentColor?: string;
  contentHtml: string;
}

export interface DynamicPageBlock {
  id: string;
  type: DynamicBlockType;
  cardLabel?: string;
  heading: string;
  subtitle?: string;
  hidden?: boolean;
  htmlContent?: string;
  columnsCount?: 2 | 3;
  col1Header?: string;
  col2Header?: string;
  rows?: DynamicTableRow[];
  items?: DynamicFaqItem[];
  tabStyle?: DynamicTabStyle;
  introHtml?: string;
  footerHtml?: string;
  tabs?: DynamicTabItem[];
}

export interface DynamicPagePayload {
  published: boolean;
  publishedAt?: string;
  fullBleed?: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  blocks: DynamicPageBlock[];
}

interface TargetServicePage {
  slug: string;
  title: string;
  liveUrl: string;
  label: string;
  isCustom?: boolean;
}

interface PagesEditorTabProps {
  pages?: PageCardData[];
  initialSlug?: string | null;
  onPageSaved?: (slug: string) => void;
  hideAddPage?: boolean;
}

const GOOGLE_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Lato:wght@300;400;700&display=swap';

const BUILTIN_SERVICE_PAGES: TargetServicePage[] = [
  { slug: 'pricing-fees', title: 'Pricing & Fees', liveUrl: '/pricing-fees', label: 'Pricing & Fees (/pricing-fees)' },
  { slug: 'about', title: 'About Us', liveUrl: '/about-us', label: 'About Us (/about-us)' },
  { slug: 'how-it-works', title: 'How It Works', liveUrl: '/how-it-works', label: 'How It Works (/how-it-works)' },
  { slug: 'faqs', title: 'FAQs', liveUrl: '/faqs', label: 'FAQs (/faqs)' },
  { slug: 'contact', title: 'Contact Us', liveUrl: '/contact-us', label: 'Contact Us (/contact-us)' },
  { slug: 'shipping-policy', title: 'Shipping & Delivery Policy', liveUrl: '/shipping-policy', label: 'Shipping Policy (/shipping-policy)' },
  { slug: 'refunds', title: 'Refunds & Cancellations', liveUrl: '/refunds', label: 'Refunds & Cancellations (/refunds)' },
  { slug: 'deposit-policy', title: 'Deposit Policy', liveUrl: '/deposit', label: 'Deposit Policy (/deposit)' },
  { slug: 'care-policy', title: 'Care, Cleaning & Damage Policy', liveUrl: '/care-policy', label: 'Care & Cleaning Policy (/care-policy)' },
  { slug: 'seller-guidelines', title: 'Seller Guidelines', liveUrl: '/seller-guidelines', label: 'Seller Guidelines (/seller-guidelines)' },
  { slug: 'terms', title: 'Terms & Conditions', liveUrl: '/terms', label: 'Terms & Conditions (/terms)' },
  { slug: 'privacy', title: 'Privacy Policy', liveUrl: '/privacy', label: 'Privacy Policy (/privacy)' },
  { slug: 'cookies', title: 'Cookie Policy', liveUrl: '/cookies', label: 'Cookie Policy (/cookies)' },
  { slug: 'designer-partners', title: 'Designer Partners', liveUrl: '/designer-partners', label: 'Designer Partners (/designer-partners)', isCustom: true },
  { slug: 'sustainability', title: 'Sustainability', liveUrl: '/sustainability', label: 'Sustainability (/sustainability)', isCustom: true },
  { slug: 'careers', title: 'Careers', liveUrl: '/careers', label: 'Careers (/careers)', isCustom: true },
  { slug: 'press', title: 'Press', liveUrl: '/press', label: 'Press (/press)', isCustom: true },
  { slug: 'blog', title: 'Journal / Blog', liveUrl: '/blog', label: 'Journal / Blog (/blog)', isCustom: true },
];

const SLUG_NORMALIZE_MAP: Record<string, string> = {
  'pricing-fees': 'pricing-fees',
  pricing: 'pricing-fees',
  'pricing-policy': 'pricing-fees',
  about: 'about',
  'about-us': 'about',
  'how-it-works': 'how-it-works',
  faqs: 'faqs',
  faq: 'faqs',
  contact: 'contact',
  'contact-us': 'contact',
  contactus: 'contact',
  'shipping-policy': 'shipping-policy',
  shipping: 'shipping-policy',
  'shipping-and-delivery': 'shipping-policy',
  refunds: 'refunds',
  refund: 'refunds',
  'refunds-cancellations': 'refunds',
  'deposit-policy': 'deposit-policy',
  deposit: 'deposit-policy',
  'care-policy': 'care-policy',
  care: 'care-policy',
  'care-cleaning-damage': 'care-policy',
  'seller-guidelines': 'seller-guidelines',
  seller: 'seller-guidelines',
  'seller-faq': 'seller-guidelines',
  terms: 'terms',
  'terms-and-conditions': 'terms',
  'terms-conditions': 'terms',
  privacy: 'privacy',
  'privacy-policy': 'privacy',
  cookies: 'cookies',
  cookie: 'cookies',
  'cookie-policy': 'cookies',
};

const normalizeSlug = (raw: string): string => {
  const clean = String(raw || '').trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  return SLUG_NORMALIZE_MAP[clean] || clean;
};

const EXCLUDED_EDITOR_SLUGS = new Set([
  'maintenance',
  'homepage',
  'list-your-piece',
]);

const EMPTY_DYNAMIC_PAGE: DynamicPagePayload = {
  published: false,
  fullBleed: false,
  eyebrow: '',
  title: '',
  subtitle: '',
  blocks: [],
};

export const PagesEditorTab: React.FC<PagesEditorTabProps> = ({
  pages = [],
  initialSlug = null,
  onPageSaved,
  hideAddPage = false,
}) => {
  const [dbPages, setDbPages] = useState<any[]>([]);
  const [customCreatedPages, setCustomCreatedPages] = useState<TargetServicePage[]>([]);

  useEffect(() => {
    let mounted = true;
    getAllPages()
      .then((list) => {
        if (mounted && Array.isArray(list)) setDbPages(list);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Load Google Fonts in Admin so live inline preview renders exact selected typography
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!document.getElementById('hok-admin-preview-google-fonts')) {
      const link = document.createElement('link');
      link.id = 'hok-admin-preview-google-fonts';
      link.rel = 'stylesheet';
      link.href = GOOGLE_FONTS_HREF;
      document.head.appendChild(link);
    }
  }, []);

  const allPageOptions = useMemo<TargetServicePage[]>(() => {
    const bySlug = new Map<string, TargetServicePage>();
    BUILTIN_SERVICE_PAGES.forEach((p) => bySlug.set(p.slug, p));

    [...pages, ...dbPages].forEach((p) => {
      const norm = normalizeSlug(String(p?.slug || ''));
      if (!norm || EXCLUDED_EDITOR_SLUGS.has(norm) || bySlug.has(norm)) return;
      const title = String(p?.title || norm).trim();
      bySlug.set(norm, {
        slug: norm,
        title,
        liveUrl: `/${norm}`,
        label: `${title} (/${norm})`,
        isCustom: true,
      });
    });

    customCreatedPages.forEach((cp) => {
      if (!EXCLUDED_EDITOR_SLUGS.has(cp.slug) && !bySlug.has(cp.slug)) bySlug.set(cp.slug, cp);
    });

    return Array.from(bySlug.values());
  }, [pages, dbPages, customCreatedPages]);

  const [selectedSlug, setSelectedSlug] = useState<string>(() => {
    if (initialSlug) {
      const norm = normalizeSlug(initialSlug);
      if (norm && !EXCLUDED_EDITOR_SLUGS.has(norm)) return norm;
    }
    return 'pricing-fees';
  });

  const activeTarget = useMemo(
    () =>
      allPageOptions.find((p) => p.slug === selectedSlug) ||
      BUILTIN_SERVICE_PAGES[0],
    [allPageOptions, selectedSlug],
  );

  const [dynamicPage, setDynamicPage] = useState<DynamicPagePayload>({ ...EMPTY_DYNAMIC_PAGE });
  const [styleConfig, setStyleConfig] = useState<PageStyleConfig>({ ...DEFAULT_PAGE_STYLE });
  const [rawSettings, setRawSettings] = useState<Record<string, any>>({});
  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>({});
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({});
  const [previewOpenFaqIds, setPreviewOpenFaqIds] = useState<Record<string, boolean>>({});
  const [activeEditorTabByBlock, setActiveEditorTabByBlock] = useState<Record<string, string>>({});
  const [previewActiveTabByBlock, setPreviewActiveTabByBlock] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [fullScreenPreview, setFullScreenPreview] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  // Load selected page content (ZERO static defaults pre-filled)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const dbData = await getPageContent(selectedSlug);
        if (!mounted) return;
        const savedSettings = dbData?.settings || {};
        setRawSettings(savedSettings);
        setStyleConfig({
          ...DEFAULT_PAGE_STYLE,
          ...(savedSettings?.style || {}),
        });
        const savedDyn = savedSettings?.dynamicPage;
        if (savedDyn && typeof savedDyn === 'object') {
          const blocks: DynamicPageBlock[] = Array.isArray(savedDyn.blocks) ? savedDyn.blocks : [];
          setDynamicPage({
            published: Boolean(savedDyn.published),
            publishedAt: savedDyn.publishedAt,
            fullBleed: Boolean(savedDyn.fullBleed),
            eyebrow: String(savedDyn.eyebrow || ''),
            title: String(savedDyn.title || ''),
            subtitle: String(savedDyn.subtitle || ''),
            blocks,
          });
          setOpenBlocks(blocks[0]?.id ? { [blocks[0].id]: true } : {});
        } else {
          setDynamicPage({ ...EMPTY_DYNAMIC_PAGE });
          setOpenBlocks({});
        }
        setOpenFaqIds({});
        setPreviewOpenFaqIds({});
        setActiveEditorTabByBlock({});
        setPreviewActiveTabByBlock({});
        setIsDirty(false);
      } catch (err) {
        console.warn('[PagesEditorTab] load error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [selectedSlug]);

  const updateDyn = (patch: Partial<DynamicPagePayload>) => {
    setIsDirty(true);
    setDynamicPage((prev) => ({ ...prev, ...patch }));
  };

  const updateStyle = (patch: Partial<PageStyleConfig>) => {
    setIsDirty(true);
    setStyleConfig((prev) => ({ ...prev, ...patch }));
  };

  const addBlock = (type: DynamicBlockType) => {
    const id = `blk_${type}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    let newBlock: DynamicPageBlock;
    if (type === 'rich') {
      newBlock = {
        id,
        type: 'rich',
        heading: '',
        subtitle: '',
        htmlContent: '',
      };
    } else if (type === 'table') {
      newBlock = {
        id,
        type: 'table',
        heading: '',
        subtitle: '',
        columnsCount: 3,
        col1Header: 'Renting',
        col2Header: 'Buying Preloved',
        rows: [
          {
            id: `row_${Date.now()}`,
            label: '',
            col1Title: '',
            col1Note: '',
            col2Title: '',
            col2Note: '',
          },
        ],
      };
    } else if (type === 'tabs') {
      const t1 = `tab_${Date.now()}_1`;
      const t2 = `tab_${Date.now()}_2`;
      newBlock = {
        id,
        type: 'tabs',
        heading: '',
        subtitle: '',
        tabStyle: 'pill',
        introHtml: '',
        footerHtml: '',
        tabs: [
          {
            id: t1,
            label: 'Tab 1',
            sublabel: '',
            accentColor: '#1a1612',
            contentHtml: '<p>Add rich content for the first tab here...</p>',
          },
          {
            id: t2,
            label: 'Tab 2',
            sublabel: '',
            accentColor: '#6b7e5a',
            contentHtml: '<p>Add rich content for the second tab here...</p>',
          },
        ],
      };
      setActiveEditorTabByBlock((prev) => ({ ...prev, [id]: t1 }));
      setPreviewActiveTabByBlock((prev) => ({ ...prev, [id]: t1 }));
    } else {
      const firstQId = `faq_${Date.now()}`;
      newBlock = {
        id,
        type: 'faq',
        heading: '',
        subtitle: '',
        items: [
          {
            id: firstQId,
            question: '',
            badgeText: '',
            badgeTone: 'neutral',
            answerHtml: '',
          },
        ],
      };
      setOpenFaqIds((prev) => ({ ...prev, [firstQId]: true }));
    }

    setIsDirty(true);
    setDynamicPage((prev) => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
    setOpenBlocks((prev) => ({ ...prev, [id]: true }));
  };

  const updateBlock = (blockId: string, patch: Partial<DynamicPageBlock>) => {
    setIsDirty(true);
    setDynamicPage((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)),
    }));
  };

  const moveBlock = (blockId: string, dir: -1 | 1) => {
    setIsDirty(true);
    setDynamicPage((prev) => {
      const idx = prev.blocks.findIndex((b) => b.id === blockId);
      const targetIdx = idx + dir;
      if (idx < 0 || targetIdx < 0 || targetIdx >= prev.blocks.length) return prev;
      const next = [...prev.blocks];
      const [item] = next.splice(idx, 1);
      next.splice(targetIdx, 0, item);
      return { ...prev, blocks: next };
    });
  };

  const deleteBlock = (blockId: string) => {
    setIsDirty(true);
    setDynamicPage((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== blockId),
    }));
  };

  const addTableRow = (blockId: string) => {
    const newRow: DynamicTableRow = {
      id: `row_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      label: '',
      col1Title: '',
      col1Note: '',
      col2Title: '',
      col2Note: '',
    };
    setIsDirty(true);
    setDynamicPage((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === blockId ? { ...b, rows: [...(b.rows || []), newRow] } : b,
      ),
    }));
  };

  const updateTableRow = (blockId: string, rowId: string, patch: Partial<DynamicTableRow>) => {
    setIsDirty(true);
    setDynamicPage((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === blockId
          ? {
              ...b,
              rows: (b.rows || []).map((r) => (r.id === rowId ? { ...r, ...patch } : r)),
            }
          : b,
      ),
    }));
  };

  const deleteTableRow = (blockId: string, rowId: string) => {
    setIsDirty(true);
    setDynamicPage((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === blockId
          ? { ...b, rows: (b.rows || []).filter((r) => r.id !== rowId) }
          : b,
      ),
    }));
  };

  const addFaqItem = (blockId: string) => {
    const qId = `faq_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    const newItem: DynamicFaqItem = {
      id: qId,
      question: '',
      badgeText: '',
      badgeTone: 'neutral',
      answerHtml: '',
    };
    setIsDirty(true);
    setDynamicPage((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === blockId ? { ...b, items: [...(b.items || []), newItem] } : b,
      ),
    }));
    setOpenFaqIds((prev) => ({ ...prev, [qId]: true }));
  };

  const updateFaqItem = (blockId: string, qId: string, patch: Partial<DynamicFaqItem>) => {
    setIsDirty(true);
    setDynamicPage((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === blockId
          ? {
              ...b,
              items: (b.items || []).map((q) => (q.id === qId ? { ...q, ...patch } : q)),
            }
          : b,
      ),
    }));
  };

  const deleteFaqItem = (blockId: string, qId: string) => {
    setIsDirty(true);
    setDynamicPage((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === blockId
          ? { ...b, items: (b.items || []).filter((q) => q.id !== qId) }
          : b,
      ),
    }));
  };

  const addTabItem = (blockId: string) => {
    const tId = `tab_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    const newTab: DynamicTabItem = {
      id: tId,
      label: 'New Tab',
      sublabel: '',
      accentColor: '#1a1612',
      contentHtml: '<p>Add content for this tab...</p>',
    };
    setIsDirty(true);
    setDynamicPage((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === blockId ? { ...b, tabs: [...(b.tabs || []), newTab] } : b,
      ),
    }));
    setActiveEditorTabByBlock((prev) => ({ ...prev, [blockId]: tId }));
    setPreviewActiveTabByBlock((prev) => ({ ...prev, [blockId]: tId }));
  };

  const updateTabItem = (blockId: string, tabId: string, patch: Partial<DynamicTabItem>) => {
    setIsDirty(true);
    setDynamicPage((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === blockId
          ? {
              ...b,
              tabs: (b.tabs || []).map((t) => (t.id === tabId ? { ...t, ...patch } : t)),
            }
          : b,
      ),
    }));
  };

  const deleteTabItem = (blockId: string, tabId: string) => {
    setIsDirty(true);
    setDynamicPage((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === blockId
          ? { ...b, tabs: (b.tabs || []).filter((t) => t.id !== tabId) }
          : b,
      ),
    }));
  };

  const persistDynamicState = async (publishState: boolean, toastMsg: string) => {
    if (
      publishState &&
      !String(dynamicPage.title || '').trim() &&
      dynamicPage.blocks.length === 0
    ) {
      toast.error('Please add at least a Page Heading or one section before publishing.');
      return;
    }

    setSaving(true);
    try {
      const nextPayload: DynamicPagePayload = {
        ...dynamicPage,
        published: publishState,
        publishedAt: publishState ? new Date().toISOString() : dynamicPage.publishedAt,
      };
      const nextSettings = {
        ...rawSettings,
        style: styleConfig,
        dynamicPage: nextPayload,
      };
      await savePageContent(selectedSlug, {
        title: dynamicPage.title.trim() || activeTarget.title,
        settings: nextSettings,
      });
      setRawSettings(nextSettings);
      setDynamicPage(nextPayload);
      setIsDirty(false);
      toast.success(toastMsg);
      onPageSaved?.(selectedSlug);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save page changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCustomPage = async () => {
    const title = newPageTitle.trim();
    const slug = normalizeSlug(
      newPageSlug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    );
    if (!title || !slug) {
      toast.error('Page title and URL slug are both required.');
      return;
    }
    if (EXCLUDED_EDITOR_SLUGS.has(slug)) {
      toast.error(`"/${slug}" is a built-in interactive page and cannot be edited here.`);
      return;
    }
    try {
      await savePage({
        slug: `/${slug}`,
        title,
        groupId: 'content-help',
        summary: `${title} custom dynamic page`,
        isBuilt: true,
        health: 'Healthy',
      });
      const created: TargetServicePage = {
        slug,
        title,
        liveUrl: `/${slug}`,
        label: `${title} (/${slug})`,
        isCustom: true,
      };
      setCustomCreatedPages((prev) => [...prev, created]);
      setShowAddModal(false);
      setNewPageTitle('');
      setNewPageSlug('');
      setSelectedSlug(slug);
      toast.success(`"${title}" page created! Add sections and click Publish when ready.`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create page');
    }
  };

  const handleImportLivePageUI = async () => {
    if (importing) return;
    if (
      (dynamicPage.blocks.length > 0 || dynamicPage.title.trim()) &&
      !window.confirm('Replace current editor header and sections with the imported live page UI?')
    ) {
      return;
    }

    setImporting(true);
    try {
      if (activeTarget.isCustom || activeTarget.slug === 'about') {
        const tpl = getEditorialTemplateForPage(activeTarget.slug, activeTarget.title);
        const nextStyle: PageStyleConfig = {
          ...DEFAULT_PAGE_STYLE,
          ...(tpl.style || {}),
        };
        const nextDynamicPage: DynamicPagePayload = {
          ...dynamicPage,
          fullBleed: Boolean(tpl.fullBleed),
          eyebrow: tpl.eyebrow,
          title: tpl.title,
          subtitle: tpl.subtitle,
          blocks: tpl.blocks,
        };
        const nextSettings = {
          ...rawSettings,
          style: nextStyle,
          dynamicPage: nextDynamicPage,
        };

        setDynamicPage(nextDynamicPage);
        setStyleConfig(nextStyle);
        setOpenBlocks(tpl.blocks[0]?.id ? { [tpl.blocks[0].id]: true } : {});
        setOpenFaqIds({});
        setPreviewOpenFaqIds({});
        setActiveEditorTabByBlock({});
        setPreviewActiveTabByBlock({});

        try {
          await savePageContent(selectedSlug, {
            title: nextDynamicPage.title.trim() || activeTarget.title,
            settings: nextSettings,
          });
          setRawSettings(nextSettings);
          setIsDirty(false);
          onPageSaved?.(selectedSlug);
          toast.success(
            `Imported & saved "${activeTarget.title}" UI with colors & fonts (${tpl.blocks.length} sections)${
              nextDynamicPage.published ? ' — live site updated!' : ' — click Publish when ready to go live.'
            }`,
          );
        } catch (saveErr: any) {
          setIsDirty(true);
          toast.error(
            saveErr?.message ||
              'Imported UI into editor, but failed to auto-save to database. Click Save Draft.',
          );
        }
        return;
      }

      const imported = await importStructuredPageFromIframe(activeTarget.liveUrl);
      const nextBlocks: DynamicPageBlock[] = imported.blocks.map((b) => ({
        id: b.id,
        type: b.type,
        cardLabel: b.cardLabel,
        heading: b.heading,
        subtitle: b.subtitle,
        htmlContent: b.htmlContent,
        items: b.items,
      }));

      const nextStyle: PageStyleConfig = {
        ...styleConfig,
        ...(imported.bgColor ? { bgColor: imported.bgColor } : {}),
        ...(imported.textColor ? { textColor: imported.textColor } : {}),
      };
      const nextDynamicPage: DynamicPagePayload = {
        ...dynamicPage,
        eyebrow: imported.eyebrow,
        title: imported.title || dynamicPage.title,
        subtitle: imported.subtitle,
        blocks: nextBlocks,
      };
      const nextSettings = {
        ...rawSettings,
        style: nextStyle,
        dynamicPage: nextDynamicPage,
      };

      setDynamicPage(nextDynamicPage);
      setStyleConfig(nextStyle);
      setOpenBlocks(nextBlocks[0]?.id ? { [nextBlocks[0].id]: true } : {});
      setOpenFaqIds({});
      setPreviewOpenFaqIds({});
      setActiveEditorTabByBlock({});
      setPreviewActiveTabByBlock({});

      try {
        await savePageContent(selectedSlug, {
          title: nextDynamicPage.title.trim() || activeTarget.title,
          settings: nextSettings,
        });
        setRawSettings(nextSettings);
        setIsDirty(false);
        onPageSaved?.(selectedSlug);
        toast.success(
          `Imported & saved ${nextBlocks.length} editable sections from ${activeTarget.liveUrl} with colors & fonts${
            nextDynamicPage.published ? ' — live site updated!' : '!'
          }`,
        );
      } catch (saveErr: any) {
        setIsDirty(true);
        toast.error(
          saveErr?.message ||
            'Imported UI into editor, but failed to auto-save to database. Click Save Draft.',
        );
      }
    } catch (err: any) {
      toast.error(err?.message || 'Could not import live page UI');
    } finally {
      setImporting(false);
    }
  };

  const visibleBlocks = useMemo(
    () => dynamicPage.blocks.filter((b) => !b.hidden),
    [dynamicPage.blocks],
  );
  const hasPreviewHero = Boolean(
    dynamicPage.eyebrow.trim() || dynamicPage.title.trim() || dynamicPage.subtitle.trim(),
  );
  const hasAnyPreviewContent = hasPreviewHero || visibleBlocks.length > 0;

  const renderInlinePreviewContent = (deviceMode: 'desktop' | 'tablet' | 'mobile') => {
    const isMobileMode = deviceMode === 'mobile';
    const isTabletMode = deviceMode === 'tablet';
    const isFullBleed =
      Boolean(dynamicPage.fullBleed) ||
      (!hasPreviewHero && activeTarget.slug === 'about' && visibleBlocks.length > 0);

    return (
    <div
      style={{
        backgroundColor: styleConfig.bgColor,
        color: styleConfig.textColor,
        fontFamily: styleConfig.bodyFont,
        minHeight: '100%',
      }}
      className={`hok-preview-canvas is-${deviceMode}${isFullBleed ? ' is-full-bleed' : ''} transition-colors`}
    >
      {/* Breadcrumb Preview */}
      {!isFullBleed && (
        <div
          style={{
            padding: isMobileMode ? '14px 16px 0' : '18px 28px 0',
            fontSize: '11px',
            opacity: 0.7,
          }}
        >
          Home / {dynamicPage.title.trim() || activeTarget.title}
        </div>
      )}

      {!hasAnyPreviewContent ? (
        <div className="px-6 py-20 text-center space-y-2">
          <div
            style={{ fontFamily: styleConfig.headingFont, color: styleConfig.textColor }}
            className="text-2xl font-normal"
          >
            Empty Dynamic Canvas — {activeTarget.title}
          </div>
          <p className="text-xs opacity-70 max-w-md mx-auto leading-relaxed">
            Add a heading, Word text/images, a comparison table, or an FAQ section on the left.
            You will see a real-time preview right here, and once you click <strong>Publish</strong>,
            it will go live on <code>{activeTarget.liveUrl}</code>.
          </p>
        </div>
      ) : (
        <div
          style={{
            padding: isFullBleed
              ? '0'
              : isMobileMode
              ? '22px 16px 40px'
              : '32px 28px 52px',
          }}
        >
          {/* Hero Preview */}
          {hasPreviewHero && (
            <div
              className="text-center max-w-2xl mx-auto pb-8"
              style={isFullBleed ? { padding: isMobileMode ? '28px 16px' : '44px 28px 32px' } : undefined}
            >
              {dynamicPage.eyebrow.trim() && (
                <div
                  className="inline-flex items-center gap-2.5 text-[10px] uppercase tracking-[0.22em] font-semibold mb-3"
                  style={{ color: styleConfig.accentColor }}
                >
                  <span
                    className="inline-block w-5 h-px"
                    style={{ backgroundColor: styleConfig.accentColor }}
                  />
                  {dynamicPage.eyebrow}
                  <span
                    className="inline-block w-5 h-px"
                    style={{ backgroundColor: styleConfig.accentColor }}
                  />
                </div>
              )}
              {dynamicPage.title.trim() && (
                <h1
                  style={{
                    fontFamily: styleConfig.headingFont,
                    color: styleConfig.textColor,
                    fontSize: isMobileMode ? '32px' : '42px',
                    lineHeight: 1.1,
                    fontWeight: 400,
                    margin: 0,
                  }}
                >
                  {dynamicPage.title}
                </h1>
              )}
              {dynamicPage.subtitle.trim() && (
                <p className="mt-3 text-sm opacity-80 leading-relaxed font-light">
                  {dynamicPage.subtitle}
                </p>
              )}
            </div>
          )}

          {/* Dynamic Blocks Preview */}
          <div className={isFullBleed ? 'w-full' : 'space-y-8 max-w-4xl mx-auto'}>
            {visibleBlocks.map((block, bIdx) => (
              <div
                key={block.id}
                className={isFullBleed ? '' : !hasPreviewHero && bIdx === 0 ? '' : 'pt-7'}
                style={
                  isFullBleed || (!hasPreviewHero && bIdx === 0)
                    ? undefined
                    : { borderTop: '1px solid rgba(140, 125, 108, 0.28)' }
                }
              >
                {(block.heading.trim() || block.subtitle?.trim()) && (
                  <div
                    className="mb-4"
                    style={
                      isFullBleed
                        ? {
                            maxWidth: '1040px',
                            margin: '0 auto 16px',
                            padding: isMobileMode ? '28px 16px 0' : '40px 28px 0',
                          }
                        : undefined
                    }
                  >
                    {block.heading.trim() && (
                      <h2
                        style={{
                          fontFamily: styleConfig.headingFont,
                          color: styleConfig.textColor,
                          fontSize: isMobileMode ? '24px' : '28px',
                          fontWeight: 400,
                          lineHeight: 1.18,
                          margin: 0,
                        }}
                      >
                        {block.heading}
                      </h2>
                    )}
                    {block.subtitle?.trim() && (
                      <p className="mt-1.5 text-xs opacity-70 font-light">
                        {block.subtitle}
                      </p>
                    )}
                  </div>
                )}

                {block.type === 'rich' && (
                  <div
                    className={`hok-preview-rich text-sm font-light leading-relaxed [&_ul:not([style])]:list-disc [&_ul:not([style])]:pl-5 [&_ol:not([style])]:list-decimal [&_ol:not([style])]:pl-5 [&_blockquote:not([style])]:border-l-2 [&_blockquote:not([style])]:pl-3.5 [&_blockquote:not([style])]:italic [&_table]:max-w-full [&_table]:border-collapse [&_img]:max-w-full [&_img]:h-auto [&_a:not([style])]:underline ${
                      isFullBleed ? 'overflow-x-clip' : 'overflow-x-auto'
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeRichHtmlAdmin(block.htmlContent || ''),
                    }}
                  />
                )}

                {block.type === 'table' && (
                  <div
                    className="bg-[#fffefb] border border-[#e6dccb] rounded-sm shadow-2xs overflow-hidden text-[#1e1412]"
                    style={
                      isFullBleed
                        ? { maxWidth: '1040px', margin: isMobileMode ? '20px 16px' : '28px auto' }
                        : undefined
                    }
                  >
                    {(block.col1Header || (block.columnsCount !== 2 && block.col2Header)) && (
                      <div
                        className="border-b border-[#1e1412] bg-[#faf7f2] text-[10px] uppercase tracking-[0.18em] font-semibold px-3 py-2.5 grid gap-3"
                        style={{
                          gridTemplateColumns:
                            isMobileMode
                              ? '1fr'
                              : isTabletMode
                              ? block.columnsCount === 2
                                ? '160px 1fr'
                                : '150px 1fr 1fr'
                              : block.columnsCount === 2
                              ? '180px 1fr'
                              : '160px 1fr 1fr',
                          color: styleConfig.accentColor,
                        }}
                      >
                        <div className={isMobileMode ? 'hidden' : ''} />
                        <div>{block.col1Header || ''}</div>
                        {block.columnsCount !== 2 && <div>{block.col2Header || ''}</div>}
                      </div>
                    )}
                    {(block.rows || []).map((row) => (
                      <div
                        key={row.id}
                        className="border-t border-[#f0e9dd] first:border-t-0 grid gap-2 px-3 py-3"
                        style={{
                          gridTemplateColumns:
                            isMobileMode
                              ? '1fr'
                              : isTabletMode
                              ? block.columnsCount === 2
                                ? '160px 1fr'
                                : '150px 1fr 1fr'
                              : block.columnsCount === 2
                              ? '180px 1fr'
                              : '160px 1fr 1fr',
                        }}
                      >
                        <div
                          style={{ fontFamily: styleConfig.headingFont }}
                          className="text-base font-normal"
                        >
                          {row.label || '—'}
                        </div>
                        <div className={!isMobileMode ? 'border-l border-[#f0e9dd] pl-3' : ''}>
                          <div className="text-xs font-semibold">{row.col1Title || '—'}</div>
                          {row.col1Note && (
                            <div className="text-[11px] opacity-70 mt-0.5">{row.col1Note}</div>
                          )}
                        </div>
                        {block.columnsCount !== 2 && (
                          <div className={!isMobileMode ? 'border-l border-[#f0e9dd] pl-3' : ''}>
                            <div className="text-xs font-semibold">{row.col2Title || '—'}</div>
                            {row.col2Note && (
                              <div className="text-[11px] opacity-70 mt-0.5">{row.col2Note}</div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {block.type === 'faq' && (
                  <div
                    className="border-t border-[#1e1412]/70"
                    style={
                      isFullBleed
                        ? { maxWidth: '1040px', margin: isMobileMode ? '20px 16px' : '28px auto' }
                        : undefined
                    }
                  >
                    {(block.items || []).map((item) => {
                      const isOpen = !!previewOpenFaqIds[item.id];
                      const badgeColor =
                        item.badgeTone === 'good'
                          ? '#5C724A'
                          : item.badgeTone === 'caution'
                          ? '#B85C38'
                          : styleConfig.accentColor;
                      return (
                        <div
                          key={item.id}
                          className="border-b border-[#e6dccb]"
                          style={
                            isOpen
                              ? {
                                  backgroundColor: 'rgba(255,254,251,0.85)',
                                  borderLeft: `2px solid ${styleConfig.accentColor}`,
                                }
                              : undefined
                          }
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewOpenFaqIds((p) => ({ ...p, [item.id]: !p[item.id] }))
                            }
                            className="w-full text-left px-3 py-3 flex items-center justify-between gap-2 cursor-pointer"
                          >
                            <span
                              style={{ fontFamily: styleConfig.headingFont }}
                              className="text-base font-normal"
                            >
                              {item.question || 'Untitled question'}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              {item.badgeText && (
                                <span
                                  style={{ color: badgeColor }}
                                  className="text-[9px] uppercase tracking-[0.14em] font-semibold"
                                >
                                  ● {item.badgeText}
                                </span>
                              )}
                              <ChevronRight
                                className={`w-3.5 h-3.5 transition-transform ${
                                  isOpen ? 'rotate-90' : ''
                                }`}
                              />
                            </div>
                          </button>
                          {isOpen && (
                            <div
                              className="px-3 pb-3 text-xs leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_table]:w-full [&_table]:border-collapse"
                              dangerouslySetInnerHTML={{
                                __html: sanitizeRichHtmlAdmin(item.answerHtml || ''),
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {block.type === 'tabs' &&
                  (() => {
                    const tabs = Array.isArray(block.tabs) ? block.tabs : [];
                    const activeTab =
                      tabs.find((t) => t.id === previewActiveTabByBlock[block.id]) || tabs[0];
                    const tabStyle = block.tabStyle || 'pill';
                    const introSafe = block.introHtml
                      ? sanitizeRichHtmlAdmin(block.introHtml)
                      : '';
                    const contentSafe = activeTab?.contentHtml
                      ? sanitizeRichHtmlAdmin(activeTab.contentHtml)
                      : '';
                    const footerSafe = block.footerHtml
                      ? sanitizeRichHtmlAdmin(block.footerHtml)
                      : '';

                    return (
                      <div
                        className="space-y-5"
                        style={
                          isFullBleed
                            ? {
                                backgroundColor: '#fffefb',
                                padding: isMobileMode
                                  ? '48px 18px'
                                  : isTabletMode
                                  ? '72px 28px'
                                  : '96px 32px',
                              }
                            : undefined
                        }
                      >
                        {introSafe && (
                          <div
                            className="hok-preview-rich text-sm font-light leading-relaxed overflow-x-clip [&_img]:max-w-full [&_img]:h-auto"
                            dangerouslySetInnerHTML={{ __html: introSafe }}
                          />
                        )}

                        {tabs.length > 0 && (
                          <div
                            role="tablist"
                            className={
                              tabStyle === 'pill'
                                ? 'max-w-[480px] w-full mx-auto bg-[#FAF7F2] border border-[#e6dccb] rounded-full p-1 flex flex-wrap gap-1 justify-center'
                                : tabStyle === 'letters'
                                ? 'flex flex-wrap justify-center items-center gap-6 py-2'
                                : 'flex flex-wrap justify-center items-center gap-5 border-b border-[#e6dccb]'
                            }
                          >
                            {tabs.map((tab, tIdx) => {
                              const isActiveTab = activeTab?.id === tab.id;
                              const activeColor =
                                tab.accentColor ||
                                (tabStyle === 'letters' ? '#c9a96e' : '#1a1612');

                              if (tabStyle === 'letters') {
                                return (
                                  <button
                                    key={tab.id || `ptab-${tIdx}`}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActiveTab}
                                    onClick={() =>
                                      setPreviewActiveTabByBlock((p) => ({
                                        ...p,
                                        [block.id]: tab.id,
                                      }))
                                    }
                                    onMouseEnter={() =>
                                      setPreviewActiveTabByBlock((p) => ({
                                        ...p,
                                        [block.id]: tab.id,
                                      }))
                                    }
                                    style={{
                                      color: isActiveTab ? '#1a1612' : '#e8e0d4',
                                      borderBottom: isActiveTab
                                        ? `2px solid ${activeColor}`
                                        : '2px solid transparent',
                                    }}
                                    className="px-2 pb-3 pt-1 cursor-pointer flex flex-col items-center transition-colors"
                                  >
                                    <span
                                      style={{
                                        fontFamily: styleConfig.headingFont,
                                        fontSize: isMobileMode ? '44px' : '64px',
                                        lineHeight: 1,
                                      }}
                                    >
                                      {tab.label || `T${tIdx + 1}`}
                                    </span>
                                  </button>
                                );
                              }

                              if (tabStyle === 'underline') {
                                return (
                                  <button
                                    key={tab.id || `ptab-${tIdx}`}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActiveTab}
                                    onClick={() =>
                                      setPreviewActiveTabByBlock((p) => ({
                                        ...p,
                                        [block.id]: tab.id,
                                      }))
                                    }
                                    style={{
                                      color: isActiveTab ? '#1a1612' : '#8a7e72',
                                      borderBottom: isActiveTab
                                        ? `2px solid ${activeColor}`
                                        : '2px solid transparent',
                                    }}
                                    className="px-2 pb-2.5 pt-1 text-xs font-medium cursor-pointer transition-colors"
                                  >
                                    {tab.label || `Tab ${tIdx + 1}`}
                                  </button>
                                );
                              }

                              return (
                                <button
                                  key={tab.id || `ptab-${tIdx}`}
                                  type="button"
                                  role="tab"
                                  aria-selected={isActiveTab}
                                  onClick={() =>
                                    setPreviewActiveTabByBlock((p) => ({
                                      ...p,
                                      [block.id]: tab.id,
                                    }))
                                  }
                                  style={
                                    isActiveTab
                                      ? {
                                          backgroundColor: activeColor,
                                          color: '#fffefb',
                                        }
                                      : { color: '#8a7e72' }
                                  }
                                  className="flex-1 min-w-[120px] py-2.5 px-4 rounded-full text-xs font-medium tracking-wide cursor-pointer transition-all"
                                >
                                  {tab.label || `Tab ${tIdx + 1}`}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {activeTab && contentSafe && (
                          <div
                            role="tabpanel"
                            className="hok-preview-rich text-sm font-light leading-relaxed overflow-x-clip [&_img]:max-w-full [&_img]:h-auto"
                            dangerouslySetInnerHTML={{ __html: contentSafe }}
                          />
                        )}

                        {footerSafe && (
                          <div
                            className="hok-preview-rich text-sm font-light leading-relaxed overflow-x-clip [&_img]:max-w-full [&_img]:h-auto"
                            dangerouslySetInnerHTML={{ __html: footerSafe }}
                          />
                        )}
                      </div>
                    );
                  })()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    );
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Top Toolbar: Choose Target Service Page + Live Link Status + Draft / Publish */}
      <div className="bg-white border border-[#e6dccb] rounded-lg p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 flex-1">
          <div className="min-w-[260px] flex-1 max-w-md">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6e6358] mb-1">
              Target Service Page
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full px-3 py-2 bg-[#faf7f2] border border-[#d9cbb4] rounded-md text-xs font-semibold text-[#1a1612] outline-none focus:border-[#b8964e]"
            >
              {allPageOptions.map((opt) => (
                <option key={opt.slug} value={opt.slug}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!hideAddPage && (
              <button
                type="button"
                onClick={() => setShowAddModal((v) => !v)}
                className="px-3 py-2 rounded-md border border-[#d9cbb4] bg-white hover:bg-[#faf7f2] text-xs font-medium text-[#1a1612] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                New Page
              </button>
            )}
            <a
              href={activeTarget.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-md border border-[#d9cbb4] bg-white hover:bg-[#faf7f2] text-xs font-medium text-[#1a1612] flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Live ({activeTarget.liveUrl})
            </a>
            <button
              type="button"
              onClick={handleImportLivePageUI}
              disabled={importing || loading}
              className="px-3 py-2 rounded-md border border-[#C7A55C] bg-[#fdfaf5] hover:bg-[#f7efe0] text-xs font-semibold text-[#8F5E16] flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {importing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              {importing ? 'Importing UI...' : 'Import Current Page UI'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {dynamicPage.published ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Live on {activeTarget.liveUrl}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              <AlertCircle className="w-3.5 h-3.5" />
              Draft — Preview Only
            </span>
          )}

          {isDirty && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8F5E16] bg-[#f5efe4] border border-[#e3d2b0] px-2.5 py-1 rounded-full">
              Unsaved edits
            </span>
          )}

          {dynamicPage.published && (
            <button
              type="button"
              disabled={saving || loading}
              onClick={() =>
                persistDynamicState(
                  false,
                  activeTarget.isCustom
                    ? `${activeTarget.title} unpublished (saved as draft).`
                    : `${activeTarget.title} restored to default design (saved as draft).`,
                )
              }
              className="px-3 py-2 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium cursor-pointer disabled:opacity-60"
            >
              {activeTarget.isCustom ? 'Unpublish' : 'Unpublish (Restore Default)'}
            </button>
          )}

          <button
            type="button"
            disabled={saving || loading}
            onClick={() =>
              persistDynamicState(
                false,
                `Saved draft for ${activeTarget.title} (preview updated, live website untouched).`,
              )
            }
            className="px-3.5 py-2 rounded-md border border-[#d9cbb4] bg-white hover:bg-[#faf7f2] text-[#1a1612] text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>

          <button
            type="button"
            disabled={saving || loading}
            onClick={() =>
              persistDynamicState(
                true,
                `Published! Your dynamic page is now live on ${activeTarget.liveUrl}.`,
              )
            }
            className="px-4 py-2 rounded-md bg-[#C7A55C] hover:bg-[#b59247] text-[#2A2118] text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5" />
            {saving ? 'Publishing...' : `Publish to ${activeTarget.title}`}
          </button>
        </div>
      </div>

      {/* Add New Custom Page Drawer */}
      {showAddModal && (
        <div className="bg-[#fdfaf5] border border-[#d9cbb4] rounded-lg p-4 flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full">
            <label className="block text-[11px] font-semibold text-[#6e6358] mb-1">
              New Page Title
            </label>
            <input
              type="text"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              placeholder="e.g. Bridal Concierge"
              className="w-full px-3 py-1.5 bg-white border border-[#d9cbb4] rounded text-xs"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-[11px] font-semibold text-[#6e6358] mb-1">
              URL Slug (Live URL: /slug)
            </label>
            <input
              type="text"
              value={newPageSlug}
              onChange={(e) => setNewPageSlug(e.target.value)}
              placeholder="e.g. bridal-concierge"
              className="w-full px-3 py-1.5 bg-white border border-[#d9cbb4] rounded text-xs"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreateCustomPage}
              className="px-3.5 py-1.5 bg-[#1e1412] text-white rounded text-xs font-semibold cursor-pointer"
            >
              Create Page
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 bg-white border border-[#d9cbb4] rounded text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Colors & Fonts Bar */}
      <div className="bg-white border border-[#e6dccb] rounded-lg p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#f0e9dd] pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1a1612]">
            <Palette className="w-4 h-4 text-[#b8964e]" />
            <span>Colors &amp; Typography</span>
            <span className="font-normal text-[11px] text-[#8a7e72]">
              — applies instantly in preview and on the live page once published
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsDirty(true);
              setStyleConfig({ ...DEFAULT_PAGE_STYLE });
            }}
            className="text-[11px] text-[#6e6358] hover:text-[#1a1612] flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Style
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6e6358] mb-1">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={styleConfig.bgColor}
                onChange={(e) => updateStyle({ bgColor: e.target.value })}
                className="h-8 w-10 rounded border border-[#d9cbb4] cursor-pointer"
              />
              <input
                type="text"
                value={styleConfig.bgColor}
                onChange={(e) => updateStyle({ bgColor: e.target.value })}
                className="flex-1 min-w-0 px-2 py-1.5 border border-[#d9cbb4] rounded text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6e6358] mb-1">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={styleConfig.textColor}
                onChange={(e) => updateStyle({ textColor: e.target.value })}
                className="h-8 w-10 rounded border border-[#d9cbb4] cursor-pointer"
              />
              <input
                type="text"
                value={styleConfig.textColor}
                onChange={(e) => updateStyle({ textColor: e.target.value })}
                className="flex-1 min-w-0 px-2 py-1.5 border border-[#d9cbb4] rounded text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6e6358] mb-1">
              Accent / Gold Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={styleConfig.accentColor}
                onChange={(e) => updateStyle({ accentColor: e.target.value })}
                className="h-8 w-10 rounded border border-[#d9cbb4] cursor-pointer"
              />
              <input
                type="text"
                value={styleConfig.accentColor}
                onChange={(e) => updateStyle({ accentColor: e.target.value })}
                className="flex-1 min-w-0 px-2 py-1.5 border border-[#d9cbb4] rounded text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6e6358] mb-1">
              <Type className="w-3 h-3 inline mr-1" />
              Heading Font
            </label>
            <select
              value={styleConfig.headingFont}
              onChange={(e) => updateStyle({ headingFont: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-[#faf7f2] border border-[#d9cbb4] rounded text-xs"
            >
              {FONT_OPTIONS_HEADING.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6e6358] mb-1">
              <Type className="w-3 h-3 inline mr-1" />
              Body Font
            </label>
            <select
              value={styleConfig.bodyFont}
              onChange={(e) => updateStyle({ bodyFont: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-[#faf7f2] border border-[#d9cbb4] rounded text-xs"
            >
              {FONT_OPTIONS_BODY.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Split: Left = 100% Dynamic Builder | Right = Instant Inline Preview Before Publish */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left: Dynamic Builder */}
        <div className="xl:col-span-6 space-y-3">
          {loading ? (
            <div className="bg-white border border-[#e6dccb] rounded-lg p-8 text-center text-xs text-[#6e6358]">
              Loading page...
            </div>
          ) : (
            <>
              {/* 1. Hero / Page Header Card */}
              <div className="bg-white border border-[#e6dccb] rounded-lg p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#f0e9dd] pb-2">
                  <span className="text-xs font-bold text-[#1a1612]">
                    Page Header (Title &amp; Intro)
                  </span>
                  <span className="text-[10px] text-[#8a7e72]">
                    Target: {activeTarget.liveUrl}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1a1612] mb-1">
                      Eyebrow / Tagline (Optional)
                    </label>
                    <input
                      type="text"
                      value={dynamicPage.eyebrow}
                      onChange={(e) => updateDyn({ eyebrow: e.target.value })}
                      placeholder="e.g. CLEAR FROM THE START"
                      className="w-full px-3 py-1.5 bg-[#fcfaf7] border border-[#d9cbb4] rounded text-xs outline-none focus:border-[#b8964e]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1a1612] mb-1">
                      Main Page Heading
                    </label>
                    <input
                      type="text"
                      value={dynamicPage.title}
                      onChange={(e) => updateDyn({ title: e.target.value })}
                      placeholder={`e.g. ${activeTarget.title}`}
                      className="w-full px-3 py-1.5 bg-[#fcfaf7] border border-[#d9cbb4] rounded text-xs outline-none focus:border-[#b8964e]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a1612] mb-1">
                    Short Subtitle / Intro (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={dynamicPage.subtitle}
                    onChange={(e) => updateDyn({ subtitle: e.target.value })}
                    placeholder="Short intro paragraph below the page heading..."
                    className="w-full px-3 py-1.5 bg-[#fcfaf7] border border-[#d9cbb4] rounded text-xs outline-none focus:border-[#b8964e]"
                  />
                </div>
                <div className="pt-1">
                  <label className="inline-flex items-center gap-2 text-[11px] font-medium text-[#4f463e] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(dynamicPage.fullBleed)}
                      onChange={(e) => updateDyn({ fullBleed: e.target.checked })}
                      className="rounded border-[#d9cbb4] accent-[#b8964e] cursor-pointer"
                    />
                    <span>Full-Width Editorial Layout (Edge-to-Edge, Hide Breadcrumb)</span>
                  </label>
                </div>
              </div>

              {/* 2. Dynamic Added Blocks List */}
              {dynamicPage.blocks.length === 0 ? (
                <div className="bg-[#fdfaf5] border border-dashed border-[#d9cbb4] rounded-lg p-6 text-center space-y-2.5">
                  <div className="text-xs font-semibold text-[#1a1612]">
                    No sections added yet
                  </div>
                  <p className="text-[11px] text-[#6e6358]">
                    Use the buttons below to add a Word / Image Section, Pricing Table, or FAQ Accordion — or import the existing page design directly to customize it.
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleImportLivePageUI}
                      disabled={importing || loading}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-[#C7A55C] bg-white hover:bg-[#f7efe0] text-xs font-semibold text-[#8F5E16] cursor-pointer disabled:opacity-60 shadow-2xs"
                    >
                      {importing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      {importing ? 'Importing Current Page UI...' : 'Import Current Page UI'}
                    </button>
                  </div>
                </div>
              ) : (
                dynamicPage.blocks.map((block, bIdx) => {
                  const isOpen = !!openBlocks[block.id];
                  const typeLabel =
                    block.type === 'rich'
                      ? 'Rich Content'
                      : block.type === 'table'
                      ? 'Table'
                      : block.type === 'tabs'
                      ? 'Interactive Tabs'
                      : 'FAQ Accordion';

                  return (
                    <div
                      key={block.id}
                      className="bg-white border border-[#e6dccb] rounded-lg overflow-hidden shadow-sm"
                    >
                      <div
                        onClick={() =>
                          setOpenBlocks((p) => ({ ...p, [block.id]: !p[block.id] }))
                        }
                        className="px-3.5 py-2.5 bg-[#faf7f2] border-b border-[#eee5d7] flex items-center justify-between gap-2 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isOpen ? (
                            <ChevronDown className="w-4 h-4 text-[#6e6358] shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-[#6e6358] shrink-0" />
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f0e5d1] text-[#8F5E16] shrink-0">
                            {typeLabel}
                          </span>
                          <span className="text-xs font-semibold text-[#1a1612] truncate">
                            {block.heading.trim() || block.cardLabel?.trim() || `Section ${bIdx + 1}`}
                          </span>
                        </div>

                        <div
                          className="flex items-center gap-1 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            disabled={bIdx === 0}
                            onClick={() => moveBlock(block.id, -1)}
                            className="p-1 rounded text-[#6e6358] hover:text-[#1a1612] disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={bIdx === dynamicPage.blocks.length - 1}
                            onClick={() => moveBlock(block.id, 1)}
                            className="p-1 rounded text-[#6e6358] hover:text-[#1a1612] disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateBlock(block.id, { hidden: !block.hidden })}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 cursor-pointer ${
                              block.hidden
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {block.hidden ? (
                              <>
                                <EyeOff className="w-3 h-3" /> Hidden
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" /> Visible
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBlock(block.id)}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete Section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#1a1612] mb-1">
                                Section Heading (Optional)
                              </label>
                              <input
                                type="text"
                                value={block.heading}
                                onChange={(e) =>
                                  updateBlock(block.id, { heading: e.target.value })
                                }
                                placeholder="e.g. Rental Deposit & Cleaning"
                                className="w-full px-3 py-1.5 bg-[#fcfaf7] border border-[#d9cbb4] rounded text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#1a1612] mb-1">
                                Subtitle / Note (Optional)
                              </label>
                              <input
                                type="text"
                                value={block.subtitle || ''}
                                onChange={(e) =>
                                  updateBlock(block.id, { subtitle: e.target.value })
                                }
                                placeholder="Short note below heading..."
                                className="w-full px-3 py-1.5 bg-[#fcfaf7] border border-[#d9cbb4] rounded text-xs"
                              />
                            </div>
                          </div>

                          {/* Rich Word Paste Block */}
                          {block.type === 'rich' && (
                            <RichWordEditor
                              key={block.id}
                              value={block.htmlContent || ''}
                              onChange={(html) =>
                                updateBlock(block.id, { htmlContent: html })
                              }
                            />
                          )}

                          {/* Dynamic Table Block */}
                          {block.type === 'table' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-[#faf7f2] border border-[#eee5d7] rounded p-3">
                                <div>
                                  <label className="block text-[10px] font-bold uppercase text-[#6e6358] mb-1">
                                    Table Layout
                                  </label>
                                  <select
                                    value={block.columnsCount === 2 ? '2' : '3'}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        columnsCount: e.target.value === '2' ? 2 : 3,
                                      })
                                    }
                                    className="w-full px-2.5 py-1.5 bg-white border border-[#d9cbb4] rounded text-xs"
                                  >
                                    <option value="3">3 Columns (Label + 2 Columns)</option>
                                    <option value="2">2 Columns (Label + 1 Column)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold uppercase text-[#6e6358] mb-1">
                                    Column 1 Header
                                  </label>
                                  <input
                                    type="text"
                                    value={block.col1Header || ''}
                                    onChange={(e) =>
                                      updateBlock(block.id, { col1Header: e.target.value })
                                    }
                                    placeholder="e.g. Renting"
                                    className="w-full px-2.5 py-1.5 bg-white border border-[#d9cbb4] rounded text-xs"
                                  />
                                </div>
                                {block.columnsCount !== 2 && (
                                  <div>
                                    <label className="block text-[10px] font-bold uppercase text-[#6e6358] mb-1">
                                      Column 2 Header
                                    </label>
                                    <input
                                      type="text"
                                      value={block.col2Header || ''}
                                      onChange={(e) =>
                                        updateBlock(block.id, { col2Header: e.target.value })
                                      }
                                      placeholder="e.g. Buying Preloved"
                                      className="w-full px-2.5 py-1.5 bg-white border border-[#d9cbb4] rounded text-xs"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                {(block.rows || []).map((row, rIdx) => (
                                  <div
                                    key={row.id}
                                    className="border border-[#e6dccb] rounded p-3 bg-[#fcfaf7] space-y-2"
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <input
                                        type="text"
                                        value={row.label}
                                        onChange={(e) =>
                                          updateTableRow(block.id, row.id, {
                                            label: e.target.value,
                                          })
                                        }
                                        placeholder={`Row ${rIdx + 1} Label (e.g. Delivery in India)`}
                                        className="flex-1 px-2.5 py-1.5 bg-white border border-[#d9cbb4] rounded text-xs font-semibold"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => deleteTableRow(block.id, row.id)}
                                        className="p-1.5 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
                                        title="Delete Row"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    <div
                                      className={`grid gap-2 ${
                                        block.columnsCount === 2 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
                                      }`}
                                    >
                                      <div className="space-y-1.5">
                                        <input
                                          type="text"
                                          value={row.col1Title}
                                          onChange={(e) =>
                                            updateTableRow(block.id, row.id, {
                                              col1Title: e.target.value,
                                            })
                                          }
                                          placeholder={`${block.col1Header || 'Col 1'} — Headline`}
                                          className="w-full px-2.5 py-1 bg-white border border-[#d9cbb4] rounded text-xs"
                                        />
                                        <input
                                          type="text"
                                          value={row.col1Note}
                                          onChange={(e) =>
                                            updateTableRow(block.id, row.id, {
                                              col1Note: e.target.value,
                                            })
                                          }
                                          placeholder={`${block.col1Header || 'Col 1'} — Small Note`}
                                          className="w-full px-2.5 py-1 bg-white border border-[#d9cbb4] rounded text-xs"
                                        />
                                      </div>

                                      {block.columnsCount !== 2 && (
                                        <div className="space-y-1.5">
                                          <input
                                            type="text"
                                            value={row.col2Title || ''}
                                            onChange={(e) =>
                                              updateTableRow(block.id, row.id, {
                                                col2Title: e.target.value,
                                              })
                                            }
                                            placeholder={`${block.col2Header || 'Col 2'} — Headline`}
                                            className="w-full px-2.5 py-1 bg-white border border-[#d9cbb4] rounded text-xs"
                                          />
                                          <input
                                            type="text"
                                            value={row.col2Note || ''}
                                            onChange={(e) =>
                                              updateTableRow(block.id, row.id, {
                                                col2Note: e.target.value,
                                              })
                                            }
                                            placeholder={`${block.col2Header || 'Col 2'} — Small Note`}
                                            className="w-full px-2.5 py-1 bg-white border border-[#d9cbb4] rounded text-xs"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => addTableRow(block.id)}
                                className="w-full py-2 rounded border border-dashed border-[#c9b48d] bg-[#fdfaf5] hover:bg-[#f7efe0] text-xs font-semibold text-[#8F5E16] flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add Row
                              </button>
                            </div>
                          )}

                          {/* Dynamic FAQ Block */}
                          {block.type === 'faq' && (
                            <div className="space-y-2.5">
                              {(block.items || []).map((item, qIdx) => {
                                const isQOpen = !!openFaqIds[item.id];
                                return (
                                  <div
                                    key={item.id}
                                    className="border border-[#e6dccb] rounded-md overflow-hidden"
                                  >
                                    <div
                                      onClick={() =>
                                        setOpenFaqIds((p) => ({
                                          ...p,
                                          [item.id]: !p[item.id],
                                        }))
                                      }
                                      className="px-3 py-2 bg-[#fcfaf7] flex items-center justify-between gap-2 cursor-pointer"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        {isQOpen ? (
                                          <ChevronDown className="w-3.5 h-3.5 text-[#6e6358] shrink-0" />
                                        ) : (
                                          <ChevronRight className="w-3.5 h-3.5 text-[#6e6358] shrink-0" />
                                        )}
                                        <span className="text-xs font-medium text-[#1a1612] truncate">
                                          {item.question.trim() || `Question ${qIdx + 1}`}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteFaqItem(block.id, item.id);
                                        }}
                                        className="p-1 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
                                        title="Delete Question"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {isQOpen && (
                                      <div className="p-3 space-y-2.5 bg-white border-t border-[#f0e9dd]">
                                        <div>
                                          <label className="block text-[11px] font-semibold text-[#1a1612] mb-1">
                                            Question
                                          </label>
                                          <input
                                            type="text"
                                            value={item.question}
                                            onChange={(e) =>
                                              updateFaqItem(block.id, item.id, {
                                                question: e.target.value,
                                              })
                                            }
                                            placeholder="Enter question..."
                                            className="w-full px-2.5 py-1.5 bg-[#fcfaf7] border border-[#d9cbb4] rounded text-xs"
                                          />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <label className="block text-[11px] font-semibold text-[#1a1612] mb-1">
                                              Highlight Badge (Optional)
                                            </label>
                                            <input
                                              type="text"
                                              value={item.badgeText || ''}
                                              onChange={(e) =>
                                                updateFaqItem(block.id, item.id, {
                                                  badgeText: e.target.value,
                                                })
                                              }
                                              placeholder="e.g. Always included"
                                              className="w-full px-2.5 py-1.5 bg-[#fcfaf7] border border-[#d9cbb4] rounded text-xs"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-[11px] font-semibold text-[#1a1612] mb-1">
                                              Badge Color
                                            </label>
                                            <select
                                              value={item.badgeTone || 'neutral'}
                                              onChange={(e) =>
                                                updateFaqItem(block.id, item.id, {
                                                  badgeTone: e.target.value as any,
                                                })
                                              }
                                              className="w-full px-2.5 py-1.5 bg-[#fcfaf7] border border-[#d9cbb4] rounded text-xs"
                                            >
                                              <option value="neutral">Gold / Neutral</option>
                                              <option value="good">Green / Positive</option>
                                              <option value="caution">Terracotta / Caution</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-[11px] font-semibold text-[#1a1612] mb-1">
                                            Answer (Word paste / rich text / images)
                                          </label>
                                          <RichWordEditor
                                            key={item.id}
                                            minHeight={130}
                                            value={item.answerHtml}
                                            onChange={(html) =>
                                              updateFaqItem(block.id, item.id, {
                                                answerHtml: html,
                                              })
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}

                              <button
                                type="button"
                                onClick={() => addFaqItem(block.id)}
                                className="w-full py-2 rounded border border-dashed border-[#c9b48d] bg-[#fdfaf5] hover:bg-[#f7efe0] text-xs font-semibold text-[#8F5E16] flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add Question
                              </button>
                            </div>
                          )}

                          {/* Interactive Tabs Block */}
                          {block.type === 'tabs' &&
                            (() => {
                              const tabs = Array.isArray(block.tabs) ? block.tabs : [];
                              const activeEditTab =
                                tabs.find((t) => t.id === activeEditorTabByBlock[block.id]) ||
                                tabs[0];
                              const tabStyle = block.tabStyle || 'pill';
                              const hasIntro = Boolean(block.introHtml && block.introHtml.trim());
                              const hasFooter = Boolean(block.footerHtml && block.footerHtml.trim());

                              return (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#fcfaf7] border border-[#eee5d7] rounded p-2.5">
                                    <div>
                                      <label className="block text-[10px] font-bold uppercase text-[#6e6358] mb-1">
                                        Tab Display Style
                                      </label>
                                      <select
                                        value={tabStyle}
                                        onChange={(e) =>
                                          updateBlock(block.id, {
                                            tabStyle: e.target.value as DynamicTabStyle,
                                          })
                                        }
                                        className="w-full px-2.5 py-1.5 bg-white border border-[#d9cbb4] rounded text-xs"
                                      >
                                        <option value="pill">Pill Toggle (Two Sides Style)</option>
                                        <option value="letters">Large Letters (K · A · I · R · A)</option>
                                        <option value="underline">Editorial Underline Tabs</option>
                                      </select>
                                    </div>
                                    <div className="flex flex-wrap items-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateBlock(block.id, {
                                            introHtml: hasIntro ? '' : '<p>Section headline &amp; intro...</p>',
                                          })
                                        }
                                        className="px-2.5 py-1.5 rounded border border-[#d9cbb4] bg-white hover:bg-[#faf7f2] text-[11px] font-medium text-[#1a1612] cursor-pointer"
                                      >
                                        {hasIntro ? 'Remove Top Intro' : '+ Add Top Header / Intro'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateBlock(block.id, {
                                            footerHtml: hasFooter ? '' : '<p>Footnote or closing quote...</p>',
                                          })
                                        }
                                        className="px-2.5 py-1.5 rounded border border-[#d9cbb4] bg-white hover:bg-[#faf7f2] text-[11px] font-medium text-[#1a1612] cursor-pointer"
                                      >
                                        {hasFooter ? 'Remove Bottom Footer' : '+ Add Bottom Footnote'}
                                      </button>
                                    </div>
                                  </div>

                                  {hasIntro && (
                                    <div className="space-y-1">
                                      <label className="block text-[11px] font-semibold text-[#1a1612]">
                                        Top Header / Intro (Shown above tabs)
                                      </label>
                                      <RichWordEditor
                                        key={`${block.id}_intro`}
                                        minHeight={110}
                                        value={block.introHtml || ''}
                                        onChange={(html) =>
                                          updateBlock(block.id, { introHtml: html })
                                        }
                                      />
                                    </div>
                                  )}

                                  {/* Tab Selector Strip */}
                                  <div className="space-y-2 border border-[#e6dccb] rounded-md p-3 bg-[#fcfaf7]">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e6358]">
                                        Select a Tab to Edit ({tabs.length})
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => addTabItem(block.id)}
                                        className="px-2.5 py-1 rounded border border-dashed border-[#c9b48d] bg-white hover:bg-[#f7efe0] text-[11px] font-semibold text-[#8F5E16] flex items-center gap-1 cursor-pointer"
                                      >
                                        <Plus className="w-3 h-3" />
                                        Add Tab
                                      </button>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                      {tabs.map((tab, tIdx) => {
                                        const isSelected = activeEditTab?.id === tab.id;
                                        return (
                                          <button
                                            key={tab.id || `etab-${tIdx}`}
                                            type="button"
                                            onClick={() => {
                                              setActiveEditorTabByBlock((p) => ({
                                                ...p,
                                                [block.id]: tab.id,
                                              }));
                                              setPreviewActiveTabByBlock((p) => ({
                                                ...p,
                                                [block.id]: tab.id,
                                              }));
                                            }}
                                            className={`px-3 py-1.5 rounded-md text-xs font-semibold border cursor-pointer transition-colors ${
                                              isSelected
                                                ? 'bg-[#1e1412] text-white border-[#1e1412]'
                                                : 'bg-white text-[#1a1612] border-[#d9cbb4] hover:bg-[#f5efe4]'
                                            }`}
                                          >
                                            {tab.label.trim() || `Tab ${tIdx + 1}`}
                                            {tab.sublabel ? ` (${tab.sublabel})` : ''}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {activeEditTab && (
                                      <div className="pt-2 border-t border-[#e6dccb] space-y-2.5">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                                          <div>
                                            <label className="block text-[11px] font-semibold text-[#1a1612] mb-1">
                                              Tab Label
                                            </label>
                                            <input
                                              type="text"
                                              value={activeEditTab.label}
                                              onChange={(e) =>
                                                updateTabItem(block.id, activeEditTab.id, {
                                                  label: e.target.value,
                                                })
                                              }
                                              placeholder="e.g. K or I'm celebrating"
                                              className="w-full px-2.5 py-1.5 bg-white border border-[#d9cbb4] rounded text-xs"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-[11px] font-semibold text-[#1a1612] mb-1">
                                              Sublabel (Optional)
                                            </label>
                                            <input
                                              type="text"
                                              value={activeEditTab.sublabel || ''}
                                              onChange={(e) =>
                                                updateTabItem(block.id, activeEditTab.id, {
                                                  sublabel: e.target.value,
                                                })
                                              }
                                              placeholder="e.g. Keepsake"
                                              className="w-full px-2.5 py-1.5 bg-white border border-[#d9cbb4] rounded text-xs"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-[11px] font-semibold text-[#1a1612] mb-1">
                                              Active Tab Color
                                            </label>
                                            <div className="flex items-center gap-1.5">
                                              <input
                                                type="color"
                                                value={
                                                  /^#[0-9a-f]{6}$/i.test(
                                                    activeEditTab.accentColor || '',
                                                  )
                                                    ? activeEditTab.accentColor
                                                    : '#1a1612'
                                                }
                                                onChange={(e) =>
                                                  updateTabItem(block.id, activeEditTab.id, {
                                                    accentColor: e.target.value,
                                                  })
                                                }
                                                className="h-8 w-9 rounded border border-[#d9cbb4] cursor-pointer bg-white"
                                              />
                                              <input
                                                type="text"
                                                value={activeEditTab.accentColor || '#1a1612'}
                                                onChange={(e) =>
                                                  updateTabItem(block.id, activeEditTab.id, {
                                                    accentColor: e.target.value,
                                                  })
                                                }
                                                className="flex-1 min-w-0 px-2 py-1.5 bg-white border border-[#d9cbb4] rounded text-xs font-mono"
                                              />
                                              {tabs.length > 1 && (
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    deleteTabItem(block.id, activeEditTab.id)
                                                  }
                                                  className="p-1.5 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
                                                  title="Delete Tab"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-semibold text-[#1a1612] mb-1">
                                            Tab Panel Content (Rich text, links &amp; colors)
                                          </label>
                                          <RichWordEditor
                                            key={`${block.id}_${activeEditTab.id}_content`}
                                            minHeight={150}
                                            value={activeEditTab.contentHtml}
                                            onChange={(html) =>
                                              updateTabItem(block.id, activeEditTab.id, {
                                                contentHtml: html,
                                              })
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {hasFooter && (
                                    <div className="space-y-1">
                                      <label className="block text-[11px] font-semibold text-[#1a1612]">
                                        Bottom Content / Footnote (Shown below tabs)
                                      </label>
                                      <RichWordEditor
                                        key={`${block.id}_footer`}
                                        minHeight={110}
                                        value={block.footerHtml || ''}
                                        onChange={(html) =>
                                          updateBlock(block.id, { footerHtml: html })
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* 3. Add More Block Buttons */}
              <div className="bg-white border border-[#e6dccb] rounded-lg p-3 shadow-sm space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6e6358]">
                  Add Dynamic Block
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => addBlock('rich')}
                    className="py-2.5 px-3 rounded-md border border-dashed border-[#c9b48d] bg-[#fdfaf5] hover:bg-[#f7efe0] text-xs font-semibold text-[#8F5E16] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    + Word / Image Section
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock('table')}
                    className="py-2.5 px-3 rounded-md border border-dashed border-[#c9b48d] bg-[#fdfaf5] hover:bg-[#f7efe0] text-xs font-semibold text-[#8F5E16] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Table2 className="w-3.5 h-3.5" />
                    + Pricing / Info Table
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock('faq')}
                    className="py-2.5 px-3 rounded-md border border-dashed border-[#c9b48d] bg-[#fdfaf5] hover:bg-[#f7efe0] text-xs font-semibold text-[#8F5E16] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    + FAQ Accordion
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock('tabs')}
                    className="py-2.5 px-3 rounded-md border border-dashed border-[#c9b48d] bg-[#fdfaf5] hover:bg-[#f7efe0] text-xs font-semibold text-[#8F5E16] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    + Interactive Tabs
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Instant Inline Preview BEFORE Publishing */}
        <div className="xl:col-span-6 bg-white border border-[#e6dccb] rounded-lg overflow-hidden shadow-sm xl:sticky xl:top-4">
          <div className="px-4 py-2.5 bg-[#faf7f2] border-b border-[#e6dccb] flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#1a1612] truncate">
                Instant Preview — {activeTarget.liveUrl}
              </div>
              <div className="text-[10px] text-[#6e6358]">
                {dynamicPage.published
                  ? `Live on ${activeTarget.liveUrl}`
                  : 'Preview only — click "Publish" to make this live'}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-[#1e1412] text-white' : 'text-[#6e6358]'
                }`}
                title="Desktop Preview"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded cursor-pointer ${
                  previewDevice === 'tablet' ? 'bg-[#1e1412] text-white' : 'text-[#6e6358]'
                }`}
                title="Tablet Preview (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-[#1e1412] text-white' : 'text-[#6e6358]'
                }`}
                title="Mobile Preview (390px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFullScreenPreview(true)}
                className="p-1.5 rounded text-[#6e6358] hover:text-[#1a1612] hover:bg-white cursor-pointer"
                title="Full Screen Preview"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div
            className="bg-[#f3ede3] overflow-y-auto flex justify-center"
            style={{ height: '680px' }}
          >
            <div
              className={
                previewDevice === 'mobile'
                  ? 'w-[390px] max-w-full my-3 rounded-xl overflow-hidden border border-[#d9cbb4] shadow-md min-h-[640px]'
                  : previewDevice === 'tablet'
                  ? 'w-[768px] max-w-full my-3 rounded-lg overflow-hidden border border-[#d9cbb4] shadow-md min-h-[640px]'
                  : 'w-full min-h-full'
              }
            >
              {renderInlinePreviewContent(previewDevice)}
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {fullScreenPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl h-[90vh] rounded-lg overflow-hidden flex flex-col border border-[#d9cbb4] shadow-2xl">
            <div className="px-5 py-3 bg-[#faf7f2] border-b border-[#e6dccb] flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-[#1a1612]">
                  Full Page Preview — {activeTarget.title} ({activeTarget.liveUrl})
                </div>
                <div className="text-[11px] text-[#6e6358]">
                  {dynamicPage.published
                    ? 'Currently Live'
                    : 'Draft Preview — once published, this design and content will appear live on the website'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-md border border-[#d9cbb4] bg-white p-0.5 mr-1">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded cursor-pointer ${
                      previewDevice === 'desktop' ? 'bg-[#1e1412] text-white' : 'text-[#6e6358]'
                    }`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-1.5 rounded cursor-pointer ${
                      previewDevice === 'tablet' ? 'bg-[#1e1412] text-white' : 'text-[#6e6358]'
                    }`}
                    title="Tablet Preview (768px)"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded cursor-pointer ${
                      previewDevice === 'mobile' ? 'bg-[#1e1412] text-white' : 'text-[#6e6358]'
                    }`}
                    title="Mobile Preview (390px)"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    persistDynamicState(
                      true,
                      `Published! Your dynamic page is now live on ${activeTarget.liveUrl}.`,
                    )
                  }
                  className="px-4 py-1.5 rounded-md bg-[#C7A55C] hover:bg-[#b59247] text-[#2A2118] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Publish to {activeTarget.title}
                </button>
                <button
                  type="button"
                  onClick={() => setFullScreenPreview(false)}
                  className="p-1.5 rounded-md border border-[#d9cbb4] bg-white hover:bg-[#faf7f2] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-[#f3ede3] flex justify-center">
              <div
                className={
                  previewDevice === 'mobile'
                    ? 'w-[390px] max-w-full my-4 rounded-xl overflow-hidden border border-[#d9cbb4] shadow-lg min-h-full'
                    : previewDevice === 'tablet'
                    ? 'w-[768px] max-w-full my-4 rounded-lg overflow-hidden border border-[#d9cbb4] shadow-lg min-h-full'
                    : 'w-full min-h-full'
                }
              >
                {renderInlinePreviewContent(previewDevice)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
