import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  Table,
  Link2,
  ImagePlus,
  RemoveFormatting,
  Loader2,
} from 'lucide-react';
import { uploadFile } from '../../../services/uploadApi';
import {
  sanitizeRichHtmlAdmin,
  isSafeLinkHref,
  isSafeImageSrc,
} from '../utils/sanitizeRichHtml';

interface RichWordEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const escapeHtml = (text: string): string =>
  String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeAttr = (text: string): string =>
  escapeHtml(text).replace(/"/g, '&quot;');

export const plainTextToSimpleHtml = (text: string): string => {
  const raw = String(text || '').trim();
  if (!raw) return '';
  const chunks = raw.split(/\n\s*\n/);
  const parts: string[] = [];
  for (const chunk of chunks) {
    const lines = chunk
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) continue;
    if (lines.every((l) => l.startsWith('- ') || l.startsWith('• '))) {
      const items = lines
        .map((l) => `<li>${escapeHtml(l.replace(/^[-•]\s+/, ''))}</li>`)
        .join('');
      parts.push(`<ul>${items}</ul>`);
    } else {
      parts.push(`<p>${escapeHtml(lines.join(' '))}</p>`);
    }
  }
  return parts.join('');
};

export const htmlToPlainText = (html: string): string => {
  return String(html || '')
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(p|h[1-6]|li|tr|blockquote|div)\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const dataUrlToFile = (dataUrl: string, idx: number): File | null => {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/);
  if (!match) return null;
  const mime = match[1];
  const b64 = match[2].replace(/\s+/g, '');
  try {
    const binStr = window.atob(b64);
    const bytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      bytes[i] = binStr.charCodeAt(i);
    }
    const ext = mime.split('/')[1]?.split('+')[0] || 'png';
    return new File([bytes], `pasted_word_img_${Date.now()}_${idx}.${ext}`, {
      type: mime,
    });
  } catch {
    return null;
  }
};

const TEXT_COLOR_SWATCHES = [
  '#1e1412',
  '#4f463e',
  '#6b5e50',
  '#b8aa9a',
  '#fffefb',
  '#ffffff',
  '#c9a96e',
  '#e8d5b0',
  '#9c7c45',
  '#b85c38',
  '#6b7e5a',
  '#b91c1c',
];

const BG_COLOR_SWATCHES = [
  'transparent',
  '#fffefb',
  '#faf7f2',
  '#f5efe4',
  '#1a1612',
  '#2a2118',
  '#e8d5b0',
  '#fef3c7',
  '#ecfdf5',
  '#fff1f2',
  '#eff6ff',
  '#ffffff',
];

const toHexForPicker = (val: string, fallback: string): string =>
  /^#[0-9a-f]{6}$/i.test(String(val || '').trim()) ? val.trim() : fallback;

export const RichWordEditor: React.FC<RichWordEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write or paste Word document / Google Docs text and images directly here...',
  minHeight = 200,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastHtmlRef = useRef<string | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [uploading, setUploading] = useState(false);
  const [textColor, setTextColor] = useState('#1e1412');
  const [bgColor, setBgColor] = useState('#faf7f2');
  const [openColorMenu, setOpenColorMenu] = useState<'text' | 'bg' | null>(null);

  useEffect(() => {
    if (!openColorMenu) return;
    const handleOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setOpenColorMenu(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [openColorMenu]);

  // Cursor-safe sync: populate on initial mount AND when external value changes outside editor typing
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const normalizedIncoming = value || '';
    if (lastHtmlRef.current === null || normalizedIncoming !== lastHtmlRef.current) {
      el.innerHTML = normalizedIncoming;
      lastHtmlRef.current = normalizedIncoming;
    }
  }, [value]);

  const emitChange = () => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    lastHtmlRef.current = html;
    onChange(html);
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    const el = editorRef.current;
    if (sel && sel.rangeCount > 0 && el && el.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (sel && savedRangeRef.current && el.contains(savedRangeRef.current.startContainer)) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const findClosestEditableBlock = (node: Node | null): HTMLElement | null => {
    const root = editorRef.current;
    if (!root || !node) return null;
    let curr: Node | null = node.nodeType === 1 ? node : node.parentNode;
    let leafDiv: HTMLElement | null = null;
    while (curr && curr !== root) {
      if (curr.nodeType === 1) {
        const el = curr as HTMLElement;
        const tag = el.tagName.toLowerCase();
        if (/^(p|h[1-6]|li|blockquote|td|th)$/.test(tag)) {
          return el;
        }
        if (
          tag === 'div' &&
          !leafDiv &&
          !el.querySelector('p, h1, h2, h3, h4, h5, h6, div, section, table')
        ) {
          leafDiv = el;
        }
      }
      curr = curr.parentNode;
    }
    return leafDiv;
  };

  const insertHtmlAtSelection = (html: string) => {
    const el = editorRef.current;
    if (!el || !html) return;
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && el.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const frag = range.createContextualFragment(html);
      const lastInserted = frag.lastChild;
      range.insertNode(frag);
      if (lastInserted) {
        const nextRange = document.createRange();
        nextRange.setStartAfter(lastInserted);
        nextRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(nextRange);
      }
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
    emitChange();
  };

  const execCmd = (command: string, commandVal?: string) => {
    restoreSelection();
    try {
      document.execCommand(command, false, commandVal);
    } catch {
      // Ignore unsupported browser command
    }
    emitChange();
  };

  const setOrRemoveColor = (targetEl: HTMLElement, color: string) => {
    if (!color) {
      targetEl.style.removeProperty('color');
    } else {
      targetEl.style.color = color;
    }
  };

  const applyTextColor = (color: string, closeMenu = true) => {
    restoreSelection();
    const sel = window.getSelection();
    const el = editorRef.current;
    const hasRange = Boolean(
      sel && sel.rangeCount > 0 && !sel.isCollapsed && el && el.contains(sel.anchorNode),
    );

    if (hasRange && sel) {
      const selectedText = sel.toString().trim();
      const block = findClosestEditableBlock(sel.anchorNode);
      try {
        document.execCommand('styleWithCSS', false, 'true');
        document.execCommand('foreColor', false, color || 'inherit');
      } catch {
        // Ignore unsupported browser command
      }
      if (block && selectedText && selectedText === (block.textContent || '').trim()) {
        setOrRemoveColor(block, color);
      }
    } else {
      const targetNode = sel?.anchorNode || savedRangeRef.current?.startContainer || null;
      const block = findClosestEditableBlock(targetNode);
      if (block) {
        setOrRemoveColor(block, color);
        block.querySelectorAll('span, font').forEach((child) => {
          setOrRemoveColor(child as HTMLElement, color);
        });
        const anchorEl =
          targetNode?.nodeType === 1
            ? (targetNode as HTMLElement)
            : targetNode?.parentElement || null;
        const closestEm = anchorEl?.closest('em') as HTMLElement | null;
        if (closestEm && block.contains(closestEm) && closestEm.style.color) {
          setOrRemoveColor(closestEm, color);
        }
      } else if (color) {
        try {
          document.execCommand('styleWithCSS', false, 'true');
          document.execCommand('foreColor', false, color);
        } catch {
          // Ignore unsupported browser command
        }
      }
    }

    setTextColor(color || '#1e1412');
    if (closeMenu) setOpenColorMenu(null);
    emitChange();
  };

  const applyColorToAllParagraphs = (color: string) => {
    const el = editorRef.current;
    if (!el) return;
    const paragraphs = el.querySelectorAll('p');
    if (paragraphs.length > 0) {
      paragraphs.forEach((p) => {
        const pEl = p as HTMLElement;
        setOrRemoveColor(pEl, color);
        pEl.querySelectorAll('span, font').forEach((child) => {
          setOrRemoveColor(child as HTMLElement, color);
        });
      });
    }
    setTextColor(color || '#1e1412');
    setOpenColorMenu(null);
    emitChange();
  };

  const applyBgColor = (color: string, closeMenu = true) => {
    restoreSelection();
    const sel = window.getSelection();
    const el = editorRef.current;
    const hasRange = Boolean(
      sel && sel.rangeCount > 0 && !sel.isCollapsed && el && el.contains(sel.anchorNode),
    );

    if (hasRange) {
      try {
        document.execCommand('styleWithCSS', false, 'true');
        document.execCommand(
          'hiliteColor',
          false,
          color === 'transparent' ? 'transparent' : color,
        );
      } catch {
        // Ignore unsupported browser command
      }
    } else {
      const targetNode = sel?.anchorNode || savedRangeRef.current?.startContainer || null;
      const block = findClosestEditableBlock(targetNode);
      if (block) {
        if (color === 'transparent' || !color) {
          block.style.removeProperty('background-color');
        } else {
          block.style.backgroundColor = color;
        }
      } else {
        try {
          document.execCommand('styleWithCSS', false, 'true');
          document.execCommand(
            'hiliteColor',
            false,
            color === 'transparent' ? 'transparent' : color,
          );
        } catch {
          // Ignore unsupported browser command
        }
      }
    }

    setBgColor(color || 'transparent');
    if (closeMenu) setOpenColorMenu(null);
    emitChange();
  };

  const handleInsertLink = () => {
    saveSelection();
    const rawUrl = window.prompt('Enter URL (https://... or /page-slug):', 'https://');
    if (!rawUrl) return;
    const trimmed = rawUrl.trim();
    if (!isSafeLinkHref(trimmed)) {
      toast.error('Invalid URL. Use https://, http://, mailto:, tel:, or /path');
      return;
    }
    restoreSelection();
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      execCmd('createLink', trimmed);
    } else {
      insertHtmlAtSelection(
        `<a href="${escapeAttr(trimmed)}" target="_blank" rel="noopener noreferrer">${escapeHtml(trimmed)}</a> `,
      );
    }
  };

  const handleInsertTable = () => {
    saveSelection();
    insertHtmlAtSelection(
      `<table style="width: 100%; border-collapse: collapse; margin: 12px 0;"><thead><tr><th style="border: 1px solid #e6dccb; background-color: #faf7f2; padding: 8px 10px; text-align: left;">Column 1</th><th style="border: 1px solid #e6dccb; background-color: #faf7f2; padding: 8px 10px; text-align: left;">Column 2</th></tr></thead><tbody><tr><td style="border: 1px solid #e6dccb; padding: 8px 10px;">Detail 1</td><td style="border: 1px solid #e6dccb; padding: 8px 10px;">Detail 2</td></tr><tr><td style="border: 1px solid #e6dccb; padding: 8px 10px;">Detail 3</td><td style="border: 1px solid #e6dccb; padding: 8px 10px;">Detail 4</td></tr></tbody></table><p><br /></p>`,
    );
  };

  const uploadAndInsertImages = async (files: File[]) => {
    const imgFiles = files.filter((f) => f && f.type.startsWith('image/'));
    if (imgFiles.length === 0) return;

    setUploading(true);
    try {
      const snippets: string[] = [];
      for (const file of imgFiles) {
        const res = await uploadFile(file, 'pages');
        if (res?.url) {
          snippets.push(
            `<figure><img src="${escapeAttr(res.url)}" alt="${escapeAttr(
              file.name.replace(/\.[^.]+$/, ''),
            )}" /></figure><p><br /></p>`,
          );
        }
      }
      if (snippets.length > 0) {
        insertHtmlAtSelection(snippets.join(''));
        toast.success(
          snippets.length === 1
            ? 'Image uploaded & inserted'
            : `${snippets.length} images uploaded & inserted`,
        );
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = '';
    if (files.length > 0) {
      await uploadAndInsertImages(files);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    const files = Array.from(e.dataTransfer?.files || []).filter((f) =>
      f.type.startsWith('image/'),
    );
    if (files.length === 0) return;
    e.preventDefault();
    saveSelection();
    await uploadAndInsertImages(files);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const cd = e.clipboardData;
    if (!cd) return;

    const rawImages: File[] = [];
    const seenKeys = new Set<string>();
    const pushFile = (f: File | null) => {
      if (!f || !f.type.startsWith('image/')) return;
      const key = `${f.name}:${f.size}:${f.type}`;
      if (seenKeys.has(key)) return;
      seenKeys.add(key);
      rawImages.push(f);
    };

    if (cd.files) {
      Array.from(cd.files).forEach((f) => pushFile(f));
    }
    if (cd.items) {
      Array.from(cd.items).forEach((item) => {
        if (item.kind === 'file') pushFile(item.getAsFile());
      });
    }

    const rawHtml = cd.getData('text/html');

    // Case 1: Pure image paste (screenshot, copied photo, or image copied right-click)
    if (!rawHtml && rawImages.length > 0) {
      e.preventDefault();
      saveSelection();
      await uploadAndInsertImages(rawImages);
      return;
    }

    // Case 2: Rich HTML paste (Microsoft Word, Google Docs, webpage)
    if (rawHtml) {
      e.preventDefault();
      saveSelection();

      const preCleaned = rawHtml
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<\s*xml\b[^>]*>[\s\S]*?<\s*\/\s*xml\s*>/gi, '');

      const parser = new DOMParser();
      const doc = parser.parseFromString(preCleaned, 'text/html');
      const body = doc.body;
      const imgs = Array.from(body.querySelectorAll('img'));

      let blockedFileImages = 0;
      let rawImgCursor = 0;
      const needsUpload = imgs.some((img) => {
        const src = String(img.getAttribute('src') || '').trim();
        return (
          src.startsWith('data:image/') ||
          src.startsWith('blob:') ||
          /^file:/i.test(src)
        );
      });

      if (needsUpload) setUploading(true);
      try {
        for (let i = 0; i < imgs.length; i++) {
          const img = imgs[i];
          const src = String(img.getAttribute('src') || '').trim();
          if (!src) {
            img.remove();
            continue;
          }

          if (src.startsWith('data:image/')) {
            const file = dataUrlToFile(src, i);
            if (file) {
              try {
                const uploaded = await uploadFile(file, 'pages');
                if (uploaded?.url) {
                  img.setAttribute('src', uploaded.url);
                } else {
                  img.remove();
                }
              } catch {
                img.remove();
              }
            } else {
              img.remove();
            }
          } else if (src.startsWith('blob:')) {
            try {
              const resp = await fetch(src);
              const blob = await resp.blob();
              const ext = blob.type.split('/')[1] || 'png';
              const file = new File([blob], `pasted_blob_${Date.now()}_${i}.${ext}`, {
                type: blob.type || 'image/png',
              });
              const uploaded = await uploadFile(file, 'pages');
              if (uploaded?.url) {
                img.setAttribute('src', uploaded.url);
              } else {
                img.remove();
              }
            } catch {
              img.remove();
            }
          } else if (/^file:/i.test(src)) {
            if (rawImgCursor < rawImages.length) {
              try {
                const uploaded = await uploadFile(rawImages[rawImgCursor++], 'pages');
                if (uploaded?.url) {
                  img.setAttribute('src', uploaded.url);
                } else {
                  img.remove();
                }
              } catch {
                img.remove();
              }
            } else {
              img.remove();
              blockedFileImages++;
            }
          } else if (!isSafeImageSrc(src)) {
            img.remove();
          }
        }

        const sanitized = sanitizeRichHtmlAdmin(doc.documentElement.innerHTML, {
          inlineStyleTags: true,
        });
        insertHtmlAtSelection(sanitized);

        if (blockedFileImages > 0) {
          toast(
            'Word desktop local file:// image paths are blocked by browser security. Copy/paste that image individually (Ctrl+V) or click "Add Image" above.',
            { duration: 5000 },
          );
        }
      } finally {
        if (needsUpload) setUploading(false);
      }
      return;
    }

    // Case 3: Plain text paste -> let browser handle cleanly and emit onChange right after
    window.setTimeout(emitChange, 0);
  };

  const btnCls =
    'p-1.5 rounded text-[#5a4e43] hover:text-[#1e1412] hover:bg-[#efe6d6] cursor-pointer transition-colors flex items-center justify-center text-[11px] font-semibold';

  return (
    <div className="border border-[#d9cbb4] rounded-md overflow-visible bg-[#fcfaf7] focus-within:border-[#b8964e]">
      {/* Formatting Toolbar */}
      <div
        ref={toolbarRef}
        className="px-2 py-1.5 bg-[#f7f1e7] border-b border-[#e6dccb] flex flex-wrap items-center gap-0.5 rounded-t-md relative"
      >
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('formatBlock', 'P')}
          className={btnCls}
          title="Normal Paragraph"
        >
          P
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('formatBlock', 'H2')}
          className={btnCls}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('formatBlock', 'H3')}
          className={btnCls}
          title="Heading 3"
        >
          H3
        </button>

        <span className="h-4 w-px bg-[#dfd3be] mx-1" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('bold')}
          className={btnCls}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('italic')}
          className={btnCls}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('underline')}
          className={btnCls}
          title="Underline"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>

        {/* Text / Paragraph Color Picker */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() =>
              setOpenColorMenu((prev) => (prev === 'text' ? null : 'text'))
            }
            className={`${btnCls} flex-col gap-0.5 px-2 py-1 ${
              openColorMenu === 'text' ? 'bg-[#efe6d6] text-[#1e1412]' : ''
            }`}
            title="Text / Paragraph Color"
          >
            <span className="leading-none font-bold text-[12px]">A</span>
            <span
              className="w-3.5 h-1 rounded-xs border border-black/15"
              style={{ backgroundColor: textColor }}
            />
          </button>

          {openColorMenu === 'text' && (
            <div className="absolute left-0 top-full mt-1.5 z-30 w-56 rounded-md border border-[#d9cbb4] bg-white p-2.5 shadow-lg space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e6358]">
                  Text / Paragraph Color
                </span>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextColor('')}
                  className="text-[10px] font-medium text-[#8F5E16] hover:underline cursor-pointer"
                >
                  Reset
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {TEXT_COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyTextColor(swatch)}
                    className={`w-6 h-6 rounded border cursor-pointer transition-transform hover:scale-110 ${
                      textColor.toLowerCase() === swatch.toLowerCase()
                        ? 'border-[#1e1412] ring-1 ring-[#b8964e]'
                        : 'border-[#d9cbb4]'
                    }`}
                    style={{ backgroundColor: swatch }}
                    title={swatch}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[#f0e9dd]">
                <label className="text-[10px] text-[#6e6358] font-medium">
                  Custom Color
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#6e6358]">
                    {textColor}
                  </span>
                  <input
                    type="color"
                    value={toHexForPicker(textColor, '#1e1412')}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      saveSelection();
                    }}
                    onChange={(e) => applyTextColor(e.target.value, false)}
                    className="w-7 h-6 p-0 border border-[#d9cbb4] rounded cursor-pointer bg-white"
                  />
                </div>
              </div>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyColorToAllParagraphs(textColor)}
                className="w-full py-1.5 px-2 rounded border border-[#e3d2b0] bg-[#faf7f2] hover:bg-[#f2e9d8] text-[10.5px] font-semibold text-[#8F5E16] cursor-pointer transition-colors"
              >
                Apply to all paragraphs in section
              </button>
            </div>
          )}
        </div>

        {/* Paragraph / Text Background Color Picker */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() =>
              setOpenColorMenu((prev) => (prev === 'bg' ? null : 'bg'))
            }
            className={`${btnCls} flex-col gap-0.5 px-1.5 py-1 ${
              openColorMenu === 'bg' ? 'bg-[#efe6d6] text-[#1e1412]' : ''
            }`}
            title="Paragraph / Text Background Color"
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span
              className="w-3.5 h-1 rounded-xs border border-black/15"
              style={{
                backgroundColor:
                  bgColor === 'transparent' ? '#ffffff' : bgColor,
              }}
            />
          </button>

          {openColorMenu === 'bg' && (
            <div className="absolute left-0 top-full mt-1.5 z-30 w-56 rounded-md border border-[#d9cbb4] bg-white p-2.5 shadow-lg space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e6358]">
                  Highlight / Background
                </span>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyBgColor('transparent')}
                  className="text-[10px] font-medium text-[#8F5E16] hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {BG_COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyBgColor(swatch)}
                    className={`w-6 h-6 rounded border cursor-pointer transition-transform hover:scale-110 flex items-center justify-center text-[9px] font-bold ${
                      bgColor.toLowerCase() === swatch.toLowerCase()
                        ? 'border-[#1e1412] ring-1 ring-[#b8964e]'
                        : 'border-[#d9cbb4]'
                    }`}
                    style={{
                      backgroundColor:
                        swatch === 'transparent' ? '#ffffff' : swatch,
                    }}
                    title={swatch === 'transparent' ? 'None / Clear' : swatch}
                  >
                    {swatch === 'transparent' ? '✕' : ''}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[#f0e9dd]">
                <label className="text-[10px] text-[#6e6358] font-medium">
                  Custom Fill
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#6e6358]">
                    {bgColor}
                  </span>
                  <input
                    type="color"
                    value={toHexForPicker(bgColor, '#faf7f2')}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      saveSelection();
                    }}
                    onChange={(e) => applyBgColor(e.target.value, false)}
                    className="w-7 h-6 p-0 border border-[#d9cbb4] rounded cursor-pointer bg-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <span className="h-4 w-px bg-[#dfd3be] mx-1" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('insertUnorderedList')}
          className={btnCls}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('insertOrderedList')}
          className={btnCls}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('formatBlock', 'BLOCKQUOTE')}
          className={btnCls}
          title="Quote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <span className="h-4 w-px bg-[#dfd3be] mx-1" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('justifyLeft')}
          className={btnCls}
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('justifyCenter')}
          className={btnCls}
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>

        <span className="h-4 w-px bg-[#dfd3be] mx-1" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleInsertTable}
          className={btnCls}
          title="Insert Table"
        >
          <Table className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleInsertLink}
          className={btnCls}
          title="Insert Link"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            saveSelection();
          }}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-2 py-1 rounded bg-[#1e1412] hover:bg-[#342522] text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer disabled:opacity-60 ml-0.5"
          title="Upload & Insert Image"
        >
          {uploading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <ImagePlus className="w-3 h-3" />
          )}
          <span>Add Image</span>
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('removeFormat')}
          className={`${btnCls} ml-auto`}
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Helper tip & uploading indicator */}
      <div className="px-3 py-1 bg-[#fdfaf5] border-b border-[#f0e9dd] flex items-center justify-between text-[10px] text-[#7a6e62]">
        <span>
          Tip: Copy-paste directly from any website, MS Word, or Google Docs (CSS, fonts &amp; layout preserved); you can also paste or drag-and-drop images.
        </span>
        {uploading && (
          <span className="text-[#9C7C45] font-semibold flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" /> Uploading image...
          </span>
        )}
      </div>

      {/* ContentEditable Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emitChange}
        onBlur={() => {
          saveSelection();
          emitChange();
        }}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ minHeight: `${minHeight}px` }}
        className="w-full p-3 text-xs text-[#1a1612] leading-relaxed outline-none bg-white rounded-b-md overflow-y-auto overflow-x-auto max-h-[520px] [&_ul:not([style])]:list-disc [&_ul:not([style])]:pl-5 [&_ol:not([style])]:list-decimal [&_ol:not([style])]:pl-5 [&_blockquote:not([style])]:border-l-2 [&_blockquote:not([style])]:border-[#C7A55C] [&_blockquote:not([style])]:pl-3 [&_blockquote:not([style])]:italic [&_table]:max-w-full [&_table]:border-collapse [&_img]:max-w-full [&_img]:h-auto [&_a]:underline empty:before:content-[attr(data-placeholder)] empty:before:text-[#a19588]"
      />
    </div>
  );
};
