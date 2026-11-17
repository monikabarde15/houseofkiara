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
  Smartphone,
} from 'lucide-react';
import {
  SERVICE_PAGES_SCHEMA,
  DEFAULT_PAGE_STYLE,
  FONT_OPTIONS_HEADING,
  FONT_OPTIONS_BODY,
  PageStyleConfig,
  ServicePageSchema,
} from '../data/servicePagesSchema';
import { getPageContent, savePageContent, savePage } from '../../../services/pageApi';
import { PageCardData } from '../types';

interface PagesEditorTabProps {
  pages?: PageCardData[];
  initialSlug?: string | null;
  onPageSaved?: (slug: string) => void;
}

export const PagesEditorTab: React.FC<PagesEditorTabProps> = ({
  pages = [],
  initialSlug = null,
  onPageSaved,
}) => {
  const allPageOptions = useMemo<ServicePageSchema[]>(() => {
    const bySlug = new Map<string, ServicePageSchema>();
    SERVICE_PAGES_SCHEMA.forEach((s) => bySlug.set(s.slug.replace(/^\//, ''), s));
    pages.forEach((p) => {
      const clean = String(p.slug || '').replace(/^\//, '');
      if (!clean || bySlug.has(clean)) return;
      bySlug.set(clean, {
        slug: clean,
        label: `${p.title} (/${clean})`,
        liveUrl: `/${clean}`,
        description: p.summary || 'Custom service page',
        defaultStyle: { ...DEFAULT_PAGE_STYLE },
        sections: [
          {
            id: 'hero',
            title: '1. Hero & Header',
            fields: [
              { id: `${clean}_eyebrow`, label: 'Eyebrow', type: 'text', defaultValue: 'House of Kaira' },
              { id: `${clean}_heading`, label: 'Heading', type: 'text', defaultValue: p.title },
              { id: `${clean}_lead`, label: 'Lead Text', type: 'textarea', defaultValue: p.summary || '' },
            ],
          },
        ],
      });
    });
    return Array.from(bySlug.values());
  }, [pages]);

  const [selectedSlug, setSelectedSlug] = useState<string>(() => {
    if (initialSlug) {
      const clean = initialSlug.replace(/^\//, '').replace(/-us$/, '');
      if (SERVICE_PAGES_SCHEMA.some((s) => s.slug === clean)) return clean;
    }
    return 'about';
  });

  const activeSchema = useMemo(
    () => allPageOptions.find((p) => p.slug === selectedSlug) || allPageOptions[0],
    [allPageOptions, selectedSlug],
  );

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [hiddenParts, setHiddenParts] = useState<Record<string, boolean>>({});
  const [styleConfig, setStyleConfig] = useState<PageStyleConfig>({ ...DEFAULT_PAGE_STYLE });
  const [rawSettings, setRawSettings] = useState<Record<string, any>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ hero: true });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldVal, setNewFieldVal] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const dbData = await getPageContent(selectedSlug);
        if (!mounted) return;
        const defaults: Record<string, string> = {};
        activeSchema?.sections.forEach((sec) => {
          sec.fields.forEach((f) => {
            defaults[f.id] = f.defaultValue;
          });
        });

        const mergedFields = {
          ...defaults,
          ...(dbData?.fieldValues || {}),
        };
        setFieldValues(mergedFields);
        setHiddenParts(dbData?.hiddenParts || {});
        const savedSettings = dbData?.settings || {};
        setRawSettings(savedSettings);
        setStyleConfig({
          ...DEFAULT_PAGE_STYLE,
          ...(activeSchema?.defaultStyle || {}),
          ...(savedSettings?.style || {}),
        });
        if (activeSchema?.sections?.[0]) {
          setOpenSections({ [activeSchema.sections[0].id]: true });
        }
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
  }, [selectedSlug, activeSchema]);

  const handleFieldChange = (id: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleToggleSection = (secId: string) => {
    setHiddenParts((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePageContent(selectedSlug, {
        fieldValues,
        hiddenParts,
        settings: {
          ...rawSettings,
          style: styleConfig,
        },
      });
      toast.success(`${activeSchema.label} saved & published!`);
      onPageSaved?.(selectedSlug);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save page changes');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCustomField = () => {
    const cleanKey = newFieldKey.trim().replace(/\s+/g, '_');
    if (!cleanKey) {
      toast.error('Please enter a field key');
      return;
    }
    setFieldValues((prev) => ({ ...prev, [cleanKey]: newFieldVal }));
    setNewFieldKey('');
    setNewFieldVal('');
    toast.success(`Added field "${cleanKey}"`);
  };

  const handleCreateCustomPage = async () => {
    const title = newPageTitle.trim();
    const slug = (newPageSlug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^\/+|\/+$/g, '');
    if (!title || !slug) {
      toast.error('Title and slug are required');
      return;
    }
    try {
      await savePage({
        slug: `/${slug}`,
        title,
        groupId: 'content-help',
        summary: `${title} service page`,
        isBuilt: true,
        health: 'Healthy',
      });
      toast.success(`Page "${title}" created!`);
      setShowAddModal(false);
      setNewPageTitle('');
      setNewPageSlug('');
      setSelectedSlug(slug);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create page');
    }
  };

  const knownFieldIds = useMemo(() => {
    const set = new Set<string>();
    activeSchema?.sections.forEach((s) => s.fields.forEach((f) => set.add(f.id)));
    return set;
  }, [activeSchema]);

  const customFieldKeys = useMemo(
    () => Object.keys(fieldValues).filter((k) => !knownFieldIds.has(k)),
    [fieldValues, knownFieldIds],
  );

  return (
    <div className="space-y-5 font-sans">
      {/* Top Toolbar: Page Dropdown + Add Page + Live Link + Save */}
      <div className="bg-white border border-[#e6dccb] rounded-lg p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="min-w-[260px] flex-1 max-w-md">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6e6358] mb-1">
              Select Service Page to Edit
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
          <div className="pt-4 sm:pt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal((v) => !v)}
              className="px-3 py-2 rounded-md border border-[#d9cbb4] bg-white hover:bg-[#faf7f2] text-xs font-medium text-[#1a1612] flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Page
            </button>
            <a
              href={activeSchema?.liveUrl || `/${selectedSlug}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-md border border-[#d9cbb4] bg-white hover:bg-[#faf7f2] text-xs font-medium text-[#1a1612] flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Live
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="px-4 py-2 rounded-md bg-[#1e1412] hover:bg-[#2f201d] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save & Publish Page'}
          </button>
        </div>
      </div>

      {/* Add Custom Page Inline Drawer */}
      {showAddModal && (
        <div className="bg-[#fdfaf5] border border-[#d9cbb4] rounded-lg p-4 flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full">
            <label className="block text-[11px] font-semibold text-[#6e6358] mb-1">
              Page Title
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
              URL Slug
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
              Create
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

      {/* Style, Colors & Typography Controls */}
      <div className="bg-white border border-[#e6dccb] rounded-lg p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#f0e9dd] pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1a1612]">
            <Palette className="w-4 h-4 text-[#b8964e]" />
            <span>Page Style, Colors & Typography</span>
          </div>
          <button
            type="button"
            onClick={() => setStyleConfig({ ...DEFAULT_PAGE_STYLE })}
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
                onChange={(e) => setStyleConfig((p) => ({ ...p, bgColor: e.target.value }))}
                className="h-8 w-10 rounded border border-[#d9cbb4] cursor-pointer"
              />
              <input
                type="text"
                value={styleConfig.bgColor}
                onChange={(e) => setStyleConfig((p) => ({ ...p, bgColor: e.target.value }))}
                className="flex-1 px-2 py-1.5 border border-[#d9cbb4] rounded text-xs font-mono"
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
                onChange={(e) => setStyleConfig((p) => ({ ...p, textColor: e.target.value }))}
                className="h-8 w-10 rounded border border-[#d9cbb4] cursor-pointer"
              />
              <input
                type="text"
                value={styleConfig.textColor}
                onChange={(e) => setStyleConfig((p) => ({ ...p, textColor: e.target.value }))}
                className="flex-1 px-2 py-1.5 border border-[#d9cbb4] rounded text-xs font-mono"
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
                onChange={(e) => setStyleConfig((p) => ({ ...p, accentColor: e.target.value }))}
                className="h-8 w-10 rounded border border-[#d9cbb4] cursor-pointer"
              />
              <input
                type="text"
                value={styleConfig.accentColor}
                onChange={(e) => setStyleConfig((p) => ({ ...p, accentColor: e.target.value }))}
                className="flex-1 px-2 py-1.5 border border-[#d9cbb4] rounded text-xs font-mono"
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
              onChange={(e) => setStyleConfig((p) => ({ ...p, headingFont: e.target.value }))}
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
              onChange={(e) => setStyleConfig((p) => ({ ...p, bodyFont: e.target.value }))}
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

      {/* Main Split: Left = Section Structure Editor | Right = Live Structure Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left: Sections Editor */}
        <div className="xl:col-span-7 space-y-3">
          {loading ? (
            <div className="bg-white border border-[#e6dccb] rounded-lg p-8 text-center text-xs text-[#6e6358]">
              Loading page structure from database...
            </div>
          ) : (
            <>
              {activeSchema?.sections.map((section) => {
                const isOpen = !!openSections[section.id];
                const isHidden = !!hiddenParts[section.id];
                return (
                  <div
                    key={section.id}
                    className="bg-white border border-[#e6dccb] rounded-lg overflow-hidden shadow-sm"
                  >
                    <div
                      onClick={() =>
                        setOpenSections((prev) => ({
                          ...prev,
                          [section.id]: !prev[section.id],
                        }))
                      }
                      className="px-4 py-3 bg-[#faf7f2] border-b border-[#eee5d7] flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4 text-[#6e6358]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#6e6358]" />
                        )}
                        <div>
                          <div className="text-xs font-bold text-[#1a1612]">
                            {section.title}
                          </div>
                          {section.description && (
                            <div className="text-[11px] text-[#6e6358]">
                              {section.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSection(section.id);
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer ${
                          isHidden
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isHidden ? (
                          <>
                            <EyeOff className="w-3 h-3" /> Hidden
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" /> Visible
                          </>
                        )}
                      </button>
                    </div>

                    {isOpen && (
                      <div className="p-4 space-y-3">
                        {section.fields.map((field) => (
                          <div key={field.id}>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[11px] font-semibold text-[#1a1612]">
                                {field.label}
                              </label>
                              <span className="text-[10px] font-mono text-[#8a7d70]">
                                {field.id}
                              </span>
                            </div>
                            {field.type === 'textarea' ? (
                              <textarea
                                rows={3}
                                value={fieldValues[field.id] ?? field.defaultValue}
                                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                className="w-full px-3 py-2 bg-[#fcfaf7] border border-[#d9cbb4] rounded text-xs text-[#1a1612] outline-none focus:border-[#b8964e]"
                              />
                            ) : (
                              <input
                                type="text"
                                value={fieldValues[field.id] ?? field.defaultValue}
                                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                className="w-full px-3 py-1.5 bg-[#fcfaf7] border border-[#d9cbb4] rounded text-xs text-[#1a1612] outline-none focus:border-[#b8964e]"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Custom Fields */}
              <div className="bg-white border border-[#e6dccb] rounded-lg p-4 space-y-3 shadow-sm">
                <div className="text-xs font-bold text-[#1a1612]">
                  Custom Fields ({customFieldKeys.length})
                </div>
                {customFieldKeys.map((k) => (
                  <div key={k}>
                    <label className="block text-[11px] font-mono text-[#6e6358] mb-1">
                      {k}
                    </label>
                    <input
                      type="text"
                      value={fieldValues[k] || ''}
                      onChange={(e) => handleFieldChange(k, e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#fcfaf7] border border-[#d9cbb4] rounded text-xs"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-[#f0e9dd]">
                  <input
                    type="text"
                    value={newFieldKey}
                    onChange={(e) => setNewFieldKey(e.target.value)}
                    placeholder="Field key (e.g. custom_note)"
                    className="sm:col-span-2 px-2.5 py-1.5 border border-[#d9cbb4] rounded text-xs"
                  />
                  <input
                    type="text"
                    value={newFieldVal}
                    onChange={(e) => setNewFieldVal(e.target.value)}
                    placeholder="Value..."
                    className="sm:col-span-2 px-2.5 py-1.5 border border-[#d9cbb4] rounded text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomField}
                    className="px-3 py-1.5 bg-[#faf7f2] border border-[#d9cbb4] hover:bg-[#efe7db] rounded text-xs font-semibold cursor-pointer"
                  >
                    + Add Field
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Live Structure Preview */}
        <div className="xl:col-span-5 bg-white border border-[#e6dccb] rounded-lg overflow-hidden shadow-sm sticky top-4">
          <div className="px-4 py-2.5 bg-[#faf7f2] border-b border-[#e6dccb] flex items-center justify-between">
            <span className="text-xs font-bold text-[#1a1612]">
              Live Structure Preview — {activeSchema?.liveUrl}
            </span>
            <div className="flex items-center gap-1">
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
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-[#1e1412] text-white' : 'text-[#6e6358]'
                }`}
                title="Mobile Preview"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#f3ede3] flex justify-center">
            <div
              className={`rounded-md border border-[#d9cbb4] shadow-inner overflow-y-auto max-h-[680px] transition-all ${
                previewDevice === 'mobile' ? 'w-[340px]' : 'w-full'
              }`}
              style={{
                backgroundColor: styleConfig.bgColor,
                color: styleConfig.textColor,
                fontFamily: styleConfig.bodyFont,
              }}
            >
              {activeSchema?.sections.map((section) => {
                if (hiddenParts[section.id]) return null;
                const eyebrow = section.fields.find((f) => f.id.includes('eyebrow'));
                const heading = section.fields.find(
                  (f) => f.id.includes('heading') || f.id.includes('quote'),
                );
                const lead = section.fields.find(
                  (f) => f.id.includes('lead') || f.id.includes('body') || f.id.includes('p1'),
                );
                return (
                  <div
                    key={section.id}
                    className="p-5 border-b last:border-b-0"
                    style={{ borderColor: `${styleConfig.accentColor}40` }}
                  >
                    <div className="text-[9px] uppercase tracking-widest opacity-55 mb-1">
                      {section.title}
                    </div>
                    {eyebrow && (
                      <div
                        className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1"
                        style={{ color: styleConfig.accentColor }}
                      >
                        {fieldValues[eyebrow.id] ?? eyebrow.defaultValue}
                      </div>
                    )}
                    {heading && (
                      <h3
                        className="text-lg font-medium leading-snug mb-2"
                        style={{ fontFamily: styleConfig.headingFont }}
                      >
                        {fieldValues[heading.id] ?? heading.defaultValue}
                      </h3>
                    )}
                    {lead && (
                      <p className="text-xs opacity-85 leading-relaxed mb-2">
                        {fieldValues[lead.id] ?? lead.defaultValue}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {section.fields
                        .filter((f) => f !== eyebrow && f !== heading && f !== lead)
                        .slice(0, 6)
                        .map((f) => (
                          <div
                            key={f.id}
                            className="p-2 rounded border text-[11px]"
                            style={{ borderColor: `${styleConfig.accentColor}55` }}
                          >
                            <div
                              className="text-[9px] uppercase font-semibold opacity-70"
                              style={{ color: styleConfig.accentColor }}
                            >
                              {f.label}
                            </div>
                            <div className="truncate font-medium">
                              {fieldValues[f.id] ?? f.defaultValue}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
