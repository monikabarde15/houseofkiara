// Style-preserving Rich HTML sanitizer + 1-click Live Page UI Importer for Admin Pages Editor.
// Preserves Web UI & MS Word layouts, CSS Grid, Flexbox, gradients, shadows, colors, fonts,
// borders, padding, converted <button> blocks, and static geometric SVGs while strictly blocking XSS.

const ALLOWED_TAGS = new Set([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'br',
  'hr',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'del',
  'sub',
  'sup',
  'ul',
  'ol',
  'li',
  'blockquote',
  'pre',
  'code',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'colgroup',
  'col',
  'a',
  'img',
  'figure',
  'figcaption',
  'span',
  'div',
  'section',
  'article',
  'header',
  'aside',
  'dl',
  'dt',
  'dd',
  'small',
  'mark',
  'time',
  'abbr',
  'cite',
  'address',
]);

const CONVERT_TO_DIV_TAGS = new Set(['main', 'nav', 'footer']);

const SVG_TAGS = new Set([
  'svg',
  'g',
  'path',
  'polyline',
  'polygon',
  'line',
  'circle',
  'rect',
  'ellipse',
  'text',
  'tspan',
]);

const SVG_ATTRS = new Set([
  'viewbox',
  'width',
  'height',
  'fill',
  'stroke',
  'stroke-width',
  'stroke-dasharray',
  'stroke-linecap',
  'stroke-linejoin',
  'text-anchor',
  'dominant-baseline',
  'opacity',
  'd',
  'points',
  'x',
  'y',
  'x1',
  'y1',
  'x2',
  'y2',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
]);

const VOID_TAGS = new Set(['br', 'hr', 'img', 'col']);
const STRIP_COMPLETELY = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'applet',
  'form',
  'input',
  'textarea',
  'select',
  'meta',
  'link',
  'base',
  'xml',
  'noscript',
  'foreignobject',
  'use',
]);

const SAFE_CSS_PROPS = new Set([
  'color',
  'background-color',
  'background',
  'background-image',
  'font',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'font-variant',
  'font-stretch',
  'text-decoration',
  'text-decoration-line',
  'text-decoration-color',
  'text-decoration-thickness',
  'text-underline-offset',
  'text-align',
  'text-transform',
  'letter-spacing',
  'word-spacing',
  'word-break',
  'overflow-wrap',
  'line-height',
  'vertical-align',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'border',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-style',
  'border-width',
  'border-collapse',
  'border-spacing',
  'border-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'outline',
  'outline-offset',
  'box-shadow',
  'text-shadow',
  'opacity',
  'width',
  'max-width',
  'min-width',
  'height',
  'min-height',
  'max-height',
  'aspect-ratio',
  'object-fit',
  'object-position',
  'text-indent',
  'white-space',
  'list-style',
  'list-style-type',
  'list-style-position',
  'display',
  'flex',
  'flex-direction',
  'flex-wrap',
  'flex-flow',
  'flex-grow',
  'flex-shrink',
  'flex-basis',
  'order',
  'grid-template-columns',
  'grid-template-rows',
  'grid-template-areas',
  'grid-auto-columns',
  'grid-auto-rows',
  'grid-auto-flow',
  'grid-column',
  'grid-row',
  'grid-area',
  'gap',
  'row-gap',
  'column-gap',
  'justify-content',
  'justify-items',
  'justify-self',
  'align-items',
  'align-content',
  'align-self',
  'place-items',
  'place-content',
  'box-sizing',
  'float',
  'clear',
  'overflow',
  'overflow-x',
  'overflow-y',
  'position',
]);

const SAFE_DISPLAY_VALUES = new Set([
  'block',
  'inline',
  'inline-block',
  'flex',
  'inline-flex',
  'grid',
  'inline-grid',
  'table',
  'table-row',
  'table-cell',
  'list-item',
  'contents',
]);

const FONT_SIZE_MAP: Record<string, string> = {
  '1': '10px',
  '2': '13px',
  '3': '16px',
  '4': '18px',
  '5': '24px',
  '6': '32px',
  '7': '48px',
};

const UNSAFE_CSS_VALUE_RE =
  /url\s*\(|expression\s*\(|javascript\s*:|vbscript\s*:|behavior\s*:|@import|data\s*:|<|>/i;

const escapeText = (val: string): string =>
  String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeAttr = (val: string): string =>
  escapeText(val).replace(/"/g, '&quot;');

export const isSafeLinkHref = (raw: string | null): boolean => {
  const val = String(raw || '').trim();
  if (!val) return false;
  if (val.startsWith('/') || val.startsWith('#')) return true;
  return /^(https?:|mailto:|tel:)/i.test(val);
};

export const isSafeImageSrc = (raw: string | null): boolean => {
  const val = String(raw || '').trim();
  if (!val) return false;
  if (val.startsWith('/') && !val.startsWith('//')) return true;
  return /^https?:\/\//i.test(val);
};

const isSafeGradient = (val: string): boolean => {
  const v = String(val || '').trim();
  if (!v || UNSAFE_CSS_VALUE_RE.test(v)) return false;
  return /^(?:repeating-)?(?:linear|radial|conic)-gradient\(/i.test(v);
};

const extractSafeSolidColor = (rawVal: string): string => {
  const v = String(rawVal || '')
    .replace(/\bwindowtext\b/gi, '#1A1612')
    .replace(/!important/gi, '')
    .trim();
  if (!v || UNSAFE_CSS_VALUE_RE.test(v)) return '';
  const hexMatch = v.match(/#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})\b/i);
  if (hexMatch) return hexMatch[0];
  const fnMatch = v.match(/(?:rgba?|hsla?)\([^)]+\)/i);
  if (fnMatch) return fnMatch[0];
  const firstToken = v.split(/\s+/)[0]?.toLowerCase() || '';
  if (/^[a-z]{3,20}$/.test(firstToken) && firstToken !== 'none' && firstToken !== 'auto') {
    return firstToken;
  }
  return '';
};

const decodeStyleEntities = (s: string): string =>
  String(s || '')
    .replace(/&quot;/gi, "'")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&amp;/gi, '&');

const sanitizeStyleMap = (rawStyle: string): Map<string, string> => {
  const map = new Map<string, string>();
  const parts = decodeStyleEntities(rawStyle).split(';');

  for (const part of parts) {
    const colonIdx = part.indexOf(':');
    if (colonIdx <= 0) continue;
    const rawProp = part.slice(0, colonIdx).trim().toLowerCase();
    let rawVal = part.slice(colonIdx + 1).trim();
    if (!rawProp || !rawVal) continue;
    if (rawProp === 'mso-highlight') {
      const hi = extractSafeSolidColor(rawVal);
      if (hi && !map.has('background-color')) map.set('background-color', hi);
      continue;
    }
    if (rawProp.startsWith('mso-') || rawProp.startsWith('-webkit-') || rawProp.startsWith('-moz-')) {
      continue;
    }
    if (!SAFE_CSS_PROPS.has(rawProp)) continue;

    rawVal = rawVal.replace(/!important/gi, '').trim();
    if (!rawVal || UNSAFE_CSS_VALUE_RE.test(rawVal)) continue;

    rawVal = rawVal.replace(/\bwindowtext\b/gi, '#1A1612').replace(/"/g, "'");

    if (rawProp === 'background-image') {
      if (isSafeGradient(rawVal)) {
        map.set('background-image', rawVal);
      }
      continue;
    }

    if (rawProp === 'background') {
      if (isSafeGradient(rawVal)) {
        map.set('background', rawVal);
      } else {
        const solid = extractSafeSolidColor(rawVal);
        if (solid) {
          map.set('background-color', solid);
        }
      }
      continue;
    }

    if (rawProp === 'display') {
      const normDisp = rawVal.toLowerCase();
      if (SAFE_DISPLAY_VALUES.has(normDisp)) {
        map.set('display', normDisp);
      }
      continue;
    }

    if (rawProp === 'position') {
      const normPos = rawVal.toLowerCase();
      if (normPos === 'static' || normPos === 'relative') {
        map.set('position', normPos);
      }
      continue;
    }

    map.set(rawProp, rawVal);
  }

  return map;
};

const serializeStyleMap = (map: Map<string, string>): string => {
  const pairs: string[] = [];
  map.forEach((v, k) => {
    pairs.push(`${k}: ${v}`);
  });
  return pairs.join('; ');
};

const normalizeLegacyWidth = (rawWidth: string | null): string => {
  const w = String(rawWidth || '').trim();
  if (!w) return '';
  if (/^\d+(?:\.\d+)?%$/.test(w)) return w;
  if (/^\d+(?:\.\d+)?(?:px|pt|em|rem)$/i.test(w)) return w;
  if (/^\d+(?:\.\d+)?$/.test(w)) return `${w}px`;
  return '';
};

interface ParsedCssRule {
  selector: string;
  specificity: number;
  declarations: string;
}

const inlineStyleTagsIntoBody = (doc: Document) => {
  const styleEls = Array.from(doc.querySelectorAll('style'));
  if (styleEls.length === 0 || !doc.body) return;

  const rules: ParsedCssRule[] = [];
  for (const st of styleEls) {
    const cssText = String(st.textContent || '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/@[^{]+\{[^}]*\}/g, '');

    const blockRe = /([^{}]+)\{([^{}]+)\}/g;
    let m: RegExpExecArray | null;
    while ((m = blockRe.exec(cssText)) !== null) {
      const rawSelectors = m[1].split(',');
      const rawDecls = m[2].trim();
      if (!rawDecls) continue;
      const cleanedMap = sanitizeStyleMap(rawDecls);
      if (cleanedMap.size === 0) continue;
      const cleanDecls = serializeStyleMap(cleanedMap);

      for (const rawSel of rawSelectors) {
        const sel = rawSel.trim();
        if (!sel || !/^[a-z0-9_-]*(?:\.[a-z0-9_-]+)?$/i.test(sel)) continue;
        let specificity = 1;
        if (sel.startsWith('.')) specificity = 2;
        else if (sel.includes('.')) specificity = 3;
        rules.push({ selector: sel, specificity, declarations: cleanDecls });
      }
    }
  }

  rules.sort((a, b) => a.specificity - b.specificity);

  for (const rule of rules) {
    try {
      const matched = doc.body.querySelectorAll(rule.selector);
      matched.forEach((el) => {
        const existing = el.getAttribute('style') || '';
        el.setAttribute('style', existing ? `${rule.declarations}; ${existing}` : rule.declarations);
      });
    } catch {
      // Ignore invalid selector
    }
  }
};

const isSafeSvgAttrValue = (val: string): boolean => {
  const v = String(val || '').trim();
  if (!v) return false;
  return !/javascript:|vbscript:|expression\(|url\(|data:|<|>/i.test(v);
};

const serializeSvgNode = (el: HTMLElement, tag: string): string => {
  const childrenHtml = Array.from(el.childNodes || []).map(serializeSafeNode).join('');
  const attrs: string[] = [];

  Array.from(el.attributes || []).forEach((attr) => {
    const nameLower = String(attr.name || '').toLowerCase();
    if (!SVG_ATTRS.has(nameLower)) return;
    const val = String(attr.value || '').trim();
    if (!isSafeSvgAttrValue(val)) return;
    const emittedName = nameLower === 'viewbox' ? 'viewBox' : nameLower;
    attrs.push(`${emittedName}="${escapeAttr(val)}"`);
  });

  const inlineMap = sanitizeStyleMap(el.getAttribute('style') || '');
  const finalStyle = serializeStyleMap(inlineMap);
  if (finalStyle) attrs.push(`style="${escapeAttr(finalStyle)}"`);

  const attrStr = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
  return `<${tag}${attrStr}>${childrenHtml}</${tag}>`;
};

const serializeSafeNode = (node: Node): string => {
  if (!node) return '';
  if (node.nodeType === 3) {
    return escapeText(node.nodeValue || '');
  }
  if (node.nodeType !== 1) return '';

  const el = node as HTMLElement;
  let tag = String(el.tagName || '').toLowerCase();
  if (STRIP_COMPLETELY.has(tag)) return '';

  if (SVG_TAGS.has(tag)) {
    return serializeSvgNode(el, tag);
  }

  const childrenHtml = Array.from(el.childNodes || []).map(serializeSafeNode).join('');

  const extraLegacyStyles = new Map<string, string>();
  if (tag === 'font') {
    const face = el.getAttribute('face');
    const color = el.getAttribute('color');
    const size = el.getAttribute('size');
    if (face && !UNSAFE_CSS_VALUE_RE.test(face)) {
      extraLegacyStyles.set('font-family', face.replace(/"/g, "'"));
    }
    if (color) {
      const safeColor = extractSafeSolidColor(color);
      if (safeColor) extraLegacyStyles.set('color', safeColor);
    }
    if (size && FONT_SIZE_MAP[size.trim()]) {
      extraLegacyStyles.set('font-size', FONT_SIZE_MAP[size.trim()]);
    }
    tag = 'span';
  }

  if (CONVERT_TO_DIV_TAGS.has(tag)) {
    tag = 'div';
  }

  const bgcolor = el.getAttribute('bgcolor');
  if (bgcolor) {
    const safeBg = extractSafeSolidColor(bgcolor);
    if (safeBg) extraLegacyStyles.set('background-color', safeBg);
  }
  const align = String(el.getAttribute('align') || '').trim().toLowerCase();
  if (/^(left|center|right|justify)$/.test(align)) {
    extraLegacyStyles.set('text-align', align);
  }
  const valign = String(el.getAttribute('valign') || '').trim().toLowerCase();
  if (/^(top|middle|bottom|baseline)$/.test(valign)) {
    extraLegacyStyles.set('vertical-align', valign);
  }

  const inlineMap = sanitizeStyleMap(el.getAttribute('style') || '');
  const mergedStyleMap = new Map<string, string>([...extraLegacyStyles, ...inlineMap]);

  if (tag === 'button') {
    const disp = String(mergedStyleMap.get('display') || '').toLowerCase();
    tag = /^(block|flex|grid|table)$/.test(disp) ? 'div' : 'span';
  }

  if (!ALLOWED_TAGS.has(tag)) {
    return childrenHtml;
  }

  if (tag === 'td' || tag === 'th' || tag === 'col') {
    const legW = normalizeLegacyWidth(el.getAttribute('width'));
    if (legW && !mergedStyleMap.has('width')) {
      mergedStyleMap.set('width', legW);
    }
  }

  if (tag === 'table') {
    const existingW = String(mergedStyleMap.get('width') || '');
    if (!existingW || !existingW.endsWith('%')) {
      mergedStyleMap.set('width', '100%');
    }
    mergedStyleMap.set('max-width', '100%');
    mergedStyleMap.set('border-collapse', 'collapse');
  }

  const attrs: string[] = [];

  if (tag === 'a') {
    const href = el.getAttribute('href');
    if (isSafeLinkHref(href)) {
      attrs.push(`href="${escapeAttr(href!)}"`);
      if (/^https?:\/\//i.test(String(href))) {
        attrs.push('target="_blank"', 'rel="noopener noreferrer"');
      }
    }
  } else if (tag === 'img') {
    const src = el.getAttribute('src');
    if (!isSafeImageSrc(src)) return '';
    attrs.push(`src="${escapeAttr(src!)}"`);
    const alt = el.getAttribute('alt');
    if (alt !== null) attrs.push(`alt="${escapeAttr(alt)}"`);
    const title = el.getAttribute('title');
    if (title) attrs.push(`title="${escapeAttr(title)}"`);
    const w = el.getAttribute('width');
    const h = el.getAttribute('height');
    if (w && /^\d+$/.test(w)) attrs.push(`width="${w}"`);
    if (h && /^\d+$/.test(h)) attrs.push(`height="${h}"`);
    mergedStyleMap.set('max-width', '100%');
    if (!mergedStyleMap.has('height')) mergedStyleMap.set('height', 'auto');
  } else if (tag === 'td' || tag === 'th') {
    const colspan = el.getAttribute('colspan');
    const rowspan = el.getAttribute('rowspan');
    if (colspan && /^\d+$/.test(colspan)) attrs.push(`colspan="${colspan}"`);
    if (rowspan && /^\d+$/.test(rowspan)) attrs.push(`rowspan="${rowspan}"`);
  }

  const finalStyle = serializeStyleMap(mergedStyleMap);
  if (finalStyle) {
    attrs.push(`style="${escapeAttr(finalStyle)}"`);
  }

  const attrStr = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
  if (VOID_TAGS.has(tag)) {
    return `<${tag}${attrStr} />`;
  }
  return `<${tag}${attrStr}>${childrenHtml}</${tag}>`;
};

export function sanitizeRichHtmlAdmin(
  dirtyHtml: string,
  options?: { inlineStyleTags?: boolean },
): string {
  const input = String(dirtyHtml || '');
  if (!input.trim()) return '';

  const preCleaned = input
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\s*xml\b[^>]*>[\s\S]*?<\s*\/\s*xml\s*>/gi, '');

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(preCleaned, 'text/html');
    if (!doc?.body) return '';
    if (options?.inlineStyleTags) {
      inlineStyleTagsIntoBody(doc);
    }
    return Array.from(doc.body.childNodes).map(serializeSafeNode).join('');
  } catch {
    return '';
  }
}

// ---------- Computed Web Page Importer Helpers ----------

const rgbToHex = (raw: string): string => {
  const s = String(raw || '').trim();
  const m = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (!m) return s;
  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);
  const a = m[4] !== undefined ? Number(m[4]) : 1;
  if (a === 0) return 'transparent';
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  if (a < 1) return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})`;
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const compactFourSides = (t: string, r: string, b: string, l: string): string => {
  if (t === '0px' && r === '0px' && b === '0px' && l === '0px') return '';
  if (t === r && r === b && b === l) return t;
  if (t === b && r === l) return `${t} ${r}`;
  if (r === l) return `${t} ${r} ${b}`;
  return `${t} ${r} ${b} ${l}`;
};

const normalizeGridTracks = (tracksStr: string): string => {
  const raw = String(tracksStr || '').trim();
  if (!raw || raw === 'none') return '';
  const tokens = raw.split(/\s+/).filter(Boolean);
  if (tokens.length <= 1) return '';
  const pxNums = tokens.map((t) => (/^[\d.]+px$/i.test(t) ? parseFloat(t) : null));
  if (pxNums.every((n): n is number => n !== null)) {
    const minVal = Math.min(...pxNums);
    const maxVal = Math.max(...pxNums);
    if (maxVal - minVal <= 16) {
      const avg = pxNums.reduce((sum, n) => sum + n, 0) / pxNums.length;
      const minTrack = Math.min(Math.max(Math.round(avg), 160), 240);
      return `repeat(auto-fit, minmax(${minTrack}px, 1fr))`;
    }
  }
  const largeCols = pxNums.filter((n): n is number => n !== null && n > 220);
  if (largeCols.length === 0) return raw;
  const minLarge = Math.min(...largeCols);
  return tokens
    .map((t, i) => {
      const n = pxNums[i];
      if (n === null) return t;
      if (n <= 220) return `minmax(140px, ${Math.round(n)}px)`;
      const ratio = Number((n / minLarge).toFixed(2));
      return ratio === 1 ? 'minmax(0, 1fr)' : `minmax(0, ${ratio}fr)`;
    })
    .join(' ');
};

const SKIP_IMPORT_TAGS = new Set([
  'script',
  'style',
  'noscript',
  'link',
  'meta',
  'template',
  'iframe',
  'input',
  'textarea',
  'select',
  'form',
  'dialog',
]);

const shouldSkipImportEl = (el: Element, cs: CSSStyleDeclaration): boolean => {
  const tag = el.tagName.toLowerCase();
  if (SKIP_IMPORT_TAGS.has(tag)) return true;
  if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return true;
  if (cs.position === 'fixed') return true;
  const cls = typeof el.className === 'string' ? el.className : '';
  if (
    /\b(?:pf-print|dp-print|pf-toast|sh-toast|skip|wa-float|pf-wa|hok-print|crumbs|pf-search|dp-search|pf-pop|secbar|hok-dyn-empty)\b/i.test(cls) ||
    /print-doc|secbar|chapnav|search-box/i.test(cls)
  ) {
    return true;
  }
  if (/breadcrumb/i.test(el.getAttribute('aria-label') || '')) return true;
  if (el.getAttribute('role') === 'status') return true;
  if (/whatsapp/i.test(el.getAttribute('aria-label') || '') && tag === 'a' && cs.borderRadius === '50%') {
    return true;
  }
  return false;
};

interface ParentInheritable {
  color: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  lineHeight: string;
  letterSpacing: string;
  textAlign: string;
  textTransform: string;
}

const cloneComputedElement = (
  srcNode: Node,
  win: Window,
  parentInh: ParentInheritable | null,
  parentDisplay: string,
  originUrl: string,
): string => {
  if (srcNode.nodeType === 3) {
    return escapeText(srcNode.nodeValue || '');
  }
  if (srcNode.nodeType !== 1) return '';

  const el = srcNode as HTMLElement;
  let tag = el.tagName.toLowerCase();
  const cs = win.getComputedStyle(el);

  if (shouldSkipImportEl(el, cs)) return '';

  if (SVG_TAGS.has(tag)) {
    // Capture static SVG with computed fill/stroke/dimensions/typography inlined
    const svgClone = el.cloneNode(true) as HTMLElement;
    if (tag === 'svg') {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && !svgClone.getAttribute('width')) {
        svgClone.setAttribute('width', String(Math.round(rect.width)));
      }
      if (rect.height > 0 && !svgClone.getAttribute('height')) {
        svgClone.setAttribute('height', String(Math.round(rect.height)));
      }
      const rootSvgStyles: string[] = [];
      const existingSvgStyle = svgClone.getAttribute('style');
      if (existingSvgStyle) rootSvgStyles.push(existingSvgStyle);
      if (cs.color && !existingSvgStyle) {
        rootSvgStyles.push(`color: ${rgbToHex(cs.color)}`);
      }
      if (rect.width > 120) {
        rootSvgStyles.push('max-width: 100%', 'height: auto');
      }
      if (rootSvgStyles.length > 0) {
        svgClone.setAttribute('style', rootSvgStyles.join('; '));
      }
    }

    const origNodes = [el, ...Array.from(el.querySelectorAll('*'))] as HTMLElement[];
    const cloneNodes = [svgClone, ...Array.from(svgClone.querySelectorAll('*'))] as HTMLElement[];
    origNodes.forEach((origNode, idx) => {
      const cloneNode = cloneNodes[idx];
      if (!cloneNode) return;
      const nodeTag = String(origNode.tagName || '').toLowerCase();
      if (!SVG_TAGS.has(nodeTag)) return;

      const ncs = idx === 0 ? cs : win.getComputedStyle(origNode);
      if (ncs.fill && !/url\(/i.test(ncs.fill)) {
        const hexFill = rgbToHex(ncs.fill);
        cloneNode.setAttribute('fill', hexFill === 'transparent' ? 'none' : hexFill);
      }
      if (ncs.stroke && ncs.stroke !== 'none' && !/url\(/i.test(ncs.stroke)) {
        const hexStroke = rgbToHex(ncs.stroke);
        if (hexStroke && hexStroke !== 'transparent') {
          cloneNode.setAttribute('stroke', hexStroke);
        }
      }
      if (ncs.strokeWidth && ncs.strokeWidth !== '0px' && ncs.stroke !== 'none') {
        cloneNode.setAttribute('stroke-width', ncs.strokeWidth);
      }
      if (ncs.strokeDasharray && ncs.strokeDasharray !== 'none') {
        cloneNode.setAttribute('stroke-dasharray', ncs.strokeDasharray);
      }
      if (ncs.opacity && ncs.opacity !== '1') {
        cloneNode.setAttribute('opacity', ncs.opacity);
      }
      if (nodeTag === 'text' || nodeTag === 'tspan') {
        const textStyles: string[] = [];
        const existingTextStyle = cloneNode.getAttribute('style');
        if (existingTextStyle) textStyles.push(existingTextStyle);
        if (ncs.fontFamily) textStyles.push(`font-family: ${decodeStyleEntities(ncs.fontFamily)}`);
        if (ncs.fontSize) textStyles.push(`font-size: ${ncs.fontSize}`);
        if (ncs.fontWeight) textStyles.push(`font-weight: ${ncs.fontWeight}`);
        if (ncs.letterSpacing && ncs.letterSpacing !== 'normal') {
          textStyles.push(`letter-spacing: ${ncs.letterSpacing}`);
        }
        if (textStyles.length > 0) {
          cloneNode.setAttribute('style', textStyles.join('; '));
        }
      }
    });

    return serializeSvgNode(svgClone, tag);
  }

  const curColor = rgbToHex(cs.color);
  const curFontFamily = decodeStyleEntities(cs.fontFamily);
  const curFontSize = cs.fontSize;
  const curFontWeight = cs.fontWeight;
  const curFontStyle = cs.fontStyle;
  const curLineHeight = cs.lineHeight;
  const curLetterSpacing = cs.letterSpacing;
  const curTextAlign = cs.textAlign;
  const curTextTransform = cs.textTransform;

  const myInh: ParentInheritable = {
    color: curColor,
    fontFamily: curFontFamily,
    fontSize: curFontSize,
    fontWeight: curFontWeight,
    fontStyle: curFontStyle,
    lineHeight: curLineHeight,
    letterSpacing: curLetterSpacing,
    textAlign: curTextAlign,
    textTransform: curTextTransform,
  };

  const styles: string[] = [];

  if (!parentInh || curColor !== parentInh.color) styles.push(`color: ${curColor}`);
  if (!parentInh || curFontFamily !== parentInh.fontFamily) styles.push(`font-family: ${curFontFamily}`);
  if (!parentInh || curFontSize !== parentInh.fontSize) styles.push(`font-size: ${curFontSize}`);
  if (!parentInh || curFontWeight !== parentInh.fontWeight) styles.push(`font-weight: ${curFontWeight}`);
  if ((!parentInh && curFontStyle !== 'normal') || (parentInh && curFontStyle !== parentInh.fontStyle)) {
    styles.push(`font-style: ${curFontStyle}`);
  }
  if (!parentInh || curLineHeight !== parentInh.lineHeight) styles.push(`line-height: ${curLineHeight}`);
  if (
    (!parentInh && curLetterSpacing !== 'normal' && curLetterSpacing !== '0px') ||
    (parentInh && curLetterSpacing !== parentInh.letterSpacing)
  ) {
    styles.push(`letter-spacing: ${curLetterSpacing}`);
  }
  if (!parentInh || curTextAlign !== parentInh.textAlign) styles.push(`text-align: ${curTextAlign}`);
  if (
    (!parentInh && curTextTransform !== 'none') ||
    (parentInh && curTextTransform !== parentInh.textTransform)
  ) {
    styles.push(`text-transform: ${curTextTransform}`);
  }

  const bgHex = rgbToHex(cs.backgroundColor);
  if (bgHex && bgHex !== 'transparent') {
    styles.push(`background-color: ${bgHex}`);
  }
  if (cs.backgroundImage && cs.backgroundImage !== 'none' && isSafeGradient(cs.backgroundImage)) {
    styles.push(`background-image: ${cs.backgroundImage}`);
  }

  // Display & Flexbox / Grid Layout
  const disp = cs.display;
  const isFlex = disp === 'flex' || disp === 'inline-flex';
  const isGrid = disp === 'grid' || disp === 'inline-grid';
  const parentIsLayout =
    parentDisplay === 'flex' ||
    parentDisplay === 'inline-flex' ||
    parentDisplay === 'grid' ||
    parentDisplay === 'inline-grid';

  if (disp && (disp !== 'block' || parentIsLayout || tag === 'span' || tag === 'a' || tag === 'i')) {
    if (SAFE_DISPLAY_VALUES.has(disp)) styles.push(`display: ${disp}`);
  }

  if (isFlex) {
    if (cs.flexDirection && cs.flexDirection !== 'row') styles.push(`flex-direction: ${cs.flexDirection}`);
    if (cs.flexWrap && cs.flexWrap !== 'nowrap') styles.push(`flex-wrap: ${cs.flexWrap}`);
    if (cs.justifyContent && cs.justifyContent !== 'normal') styles.push(`justify-content: ${cs.justifyContent}`);
    if (cs.alignItems && cs.alignItems !== 'normal') styles.push(`align-items: ${cs.alignItems}`);
    if (cs.gap && cs.gap !== 'normal' && cs.gap !== '0px') styles.push(`gap: ${cs.gap}`);
  } else if (isGrid) {
    const normCols = normalizeGridTracks(cs.gridTemplateColumns);
    if (normCols) styles.push(`grid-template-columns: ${normCols}`);
    if (cs.alignItems && cs.alignItems !== 'normal') styles.push(`align-items: ${cs.alignItems}`);
    if (cs.gap && cs.gap !== 'normal' && cs.gap !== '0px') styles.push(`gap: ${cs.gap}`);
  }

  if (parentIsLayout) {
    if (cs.flexGrow && cs.flexGrow !== '0') styles.push(`flex-grow: ${cs.flexGrow}`);
    if (cs.gridColumn && cs.gridColumn !== 'auto') styles.push(`grid-column: ${cs.gridColumn}`);
    if (cs.gridRow && cs.gridRow !== 'auto') styles.push(`grid-row: ${cs.gridRow}`);
    if (cs.alignSelf && cs.alignSelf !== 'auto') styles.push(`align-self: ${cs.alignSelf}`);
  }

  // Spacing & Box styling
  const pad = compactFourSides(cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft);
  if (pad) styles.push(`padding: ${pad}`);

  if (tag !== 'tr' && tag !== 'td' && tag !== 'th') {
    const mt = !parentInh && cs.marginTop.startsWith('-') ? '0px' : cs.marginTop;
    const mar = compactFourSides(mt, cs.marginRight, cs.marginBottom, cs.marginLeft);
    if (mar) {
      // Replace huge centered pixel left/right margins with auto when block has max-width
      if (cs.maxWidth !== 'none' && mar.includes('px')) {
        styles.push(`margin: ${mt} auto ${cs.marginBottom}`);
      } else {
        styles.push(`margin: ${mar}`);
      }
    }
  }

  (['top', 'right', 'bottom', 'left'] as const).forEach((side) => {
    const bw = cs[`border${side[0].toUpperCase()}${side.slice(1)}Width` as keyof CSSStyleDeclaration] as string;
    const bs = cs[`border${side[0].toUpperCase()}${side.slice(1)}Style` as keyof CSSStyleDeclaration] as string;
    const bc = cs[`border${side[0].toUpperCase()}${side.slice(1)}Color` as keyof CSSStyleDeclaration] as string;
    if (bw && bw !== '0px' && bs && bs !== 'none') {
      styles.push(`border-${side}: ${bw} ${bs} ${rgbToHex(bc)}`);
    }
  });

  if (cs.borderRadius && cs.borderRadius !== '0px') {
    styles.push(`border-radius: ${cs.borderRadius}`);
  }
  if (cs.boxShadow && cs.boxShadow !== 'none') {
    styles.push(`box-shadow: ${cs.boxShadow}`);
  }
  if (cs.maxWidth && cs.maxWidth !== 'none') {
    styles.push(`max-width: ${cs.maxWidth}`);
  }

  // Keep dimensions on small decorative line/dot elements (e.g., eyebrow rule <i>)
  const rect = el.getBoundingClientRect();
  if (rect.width > 0 && rect.width <= 120 && rect.height > 0 && rect.height <= 40 && !el.textContent?.trim()) {
    styles.push(`width: ${Math.round(rect.width)}px`, `height: ${Math.round(rect.height)}px`);
  }

  if (tag === 'ul' || tag === 'ol') {
    styles.push(`list-style: ${cs.listStyleType || 'none'}`);
  }
  if (cs.position === 'relative') {
    styles.push('position: relative');
  }
  if (cs.boxSizing === 'border-box') {
    styles.push('box-sizing: border-box');
  }
  if (cs.textDecorationLine && cs.textDecorationLine !== 'none') {
    styles.push(`text-decoration: ${cs.textDecorationLine}`);
  }

  const childrenHtml = Array.from(el.childNodes)
    .map((child) => cloneComputedElement(child, win, myInh, disp, originUrl))
    .join('');

  if (CONVERT_TO_DIV_TAGS.has(tag)) tag = 'div';
  if (tag === 'button') {
    tag = /^(block|flex|grid|table)$/.test(disp) ? 'div' : 'span';
  }

  const attrs: string[] = [];
  if (tag === 'a') {
    const rawHref = el.getAttribute('href') || '';
    const normHref = rawHref.startsWith(originUrl) ? rawHref.slice(originUrl.length) || '/' : rawHref;
    if (isSafeLinkHref(normHref)) {
      attrs.push(`href="${escapeAttr(normHref)}"`);
    }
  } else if (tag === 'img') {
    const rawSrc = el.getAttribute('src') || '';
    const normSrc = rawSrc.startsWith(originUrl) ? rawSrc.slice(originUrl.length) || '/' : rawSrc;
    if (!isSafeImageSrc(normSrc)) return '';
    attrs.push(`src="${escapeAttr(normSrc)}"`);
    const alt = el.getAttribute('alt');
    if (alt !== null) attrs.push(`alt="${escapeAttr(alt)}"`);
  } else if (tag === 'td' || tag === 'th') {
    const csSpan = el.getAttribute('colspan');
    const rsSpan = el.getAttribute('rowspan');
    if (csSpan) attrs.push(`colspan="${escapeAttr(csSpan)}"`);
    if (rsSpan) attrs.push(`rowspan="${escapeAttr(rsSpan)}"`);
  }

  if (styles.length > 0) {
    attrs.push(`style="${escapeAttr(styles.join('; '))}"`);
  }

  if (!ALLOWED_TAGS.has(tag)) {
    return childrenHtml;
  }

  const attrStr = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
  if (VOID_TAGS.has(tag)) return `<${tag}${attrStr} />`;
  return `<${tag}${attrStr}>${childrenHtml}</${tag}>`;
};

export interface ImportedFaqItem {
  id: string;
  question: string;
  badgeText?: string;
  badgeTone?: 'neutral' | 'good' | 'caution';
  answerHtml: string;
}

export interface ImportedDynamicBlock {
  id: string;
  type: 'rich' | 'faq';
  cardLabel: string;
  heading: string;
  subtitle?: string;
  htmlContent?: string;
  items?: ImportedFaqItem[];
}

export interface ImportedPageResult {
  eyebrow: string;
  title: string;
  subtitle: string;
  bgColor?: string;
  textColor?: string;
  blocks: ImportedDynamicBlock[];
}

const isPlainSixHex = (val: string): boolean => /^#[0-9a-f]{6}$/i.test(String(val || '').trim());

const extractHeroText = (heroEl: Element | null, root: Element) => {
  if (!heroEl) {
    const fallbackH1 = root.querySelector('h1');
    return {
      eyebrow: '',
      title: fallbackH1?.textContent?.replace(/\s+/g, ' ').trim() || '',
      subtitle: '',
    };
  }

  const eyebrowEl = heroEl.querySelector(
    '.au-hero__coming-soon-tag, .fq-eyebrow span, .fq-eyebrow, [class*="eyebrow"], [class*="__eyebrow"]',
  );
  const h1El = heroEl.querySelector('h1') || root.querySelector('h1');
  const candidateSubs = Array.from(
    heroEl.querySelectorAll(
      '.au-hero__coming-soon-desc, .dp-sub, [class*="-sub"], [class*="__lead"], [class*="lead"], p',
    ),
  );
  const subEl = candidateSubs.find((p) => {
    if (!p.textContent?.trim()) return false;
    if (p.closest('.crumbs, [aria-label*="breadcrumb" i], .fq-eyebrow, .pf-pop')) return false;
    if (eyebrowEl && (p === eyebrowEl || eyebrowEl.contains(p))) return false;
    return true;
  });

  return {
    eyebrow: eyebrowEl?.textContent?.trim() || '',
    title: h1El?.textContent?.replace(/\s+/g, ' ').trim() || '',
    subtitle: subEl?.textContent?.replace(/\s+/g, ' ').trim() || '',
  };
};

const extractCleanFaqAnswerHtml = (ansEl: Element | null, originUrl: string): string => {
  if (!ansEl) return '';
  const clone = ansEl.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.cq-foot, script, style').forEach((n) => n.remove());
  // Convert .note callout divs to clean styled blockquotes
  clone.querySelectorAll('.note').forEach((noteEl) => {
    const bq = document.createElement('blockquote');
    bq.innerHTML = noteEl.innerHTML;
    noteEl.replaceWith(bq);
  });
  clone.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith(originUrl)) {
      a.setAttribute('href', href.slice(originUrl.length) || '/');
    }
  });
  return sanitizeRichHtmlAdmin(clone.innerHTML);
};

const isTransparentLayoutWrapper = (el: HTMLElement, cs: CSSStyleDeclaration): boolean => {
  const cls = typeof el.className === 'string' ? el.className : '';
  const id = String(el.id || '');
  if (
    /\b(?:sh-wrap|dp-body|dp-sections-list|terms-main-container|privacy-main-container|care-wrap|au-desktop|au-sections|hok-dyn-body)\b/i.test(
      cls,
    ) ||
    /^(?:pf-main|sh-main|cu-main|terms-content|privacy-content)$/i.test(id) ||
    el.tagName.toLowerCase() === 'main'
  ) {
    return true;
  }
  const directSections = Array.from(el.children).filter(
    (c) => c.tagName.toLowerCase() === 'section',
  ).length;
  if (directSections >= 2) {
    const bgHex = rgbToHex(cs.backgroundColor);
    const hasBorder =
      cs.borderTopWidth !== '0px' ||
      cs.borderBottomWidth !== '0px' ||
      cs.borderLeftWidth !== '0px' ||
      cs.borderRightWidth !== '0px';
    if ((!bgHex || bgHex === 'transparent') && !hasBorder && cs.boxShadow === 'none') {
      return true;
    }
  }
  return false;
};

export function importStructuredPageFromIframe(liveUrl: string): Promise<ImportedPageResult> {
  return new Promise((resolve, reject) => {
    const sep = liveUrl.includes('?') ? '&' : '?';
    const targetSrc = `${liveUrl}${sep}import_static=1`;
    const ROOT_SELECTOR =
      'main, .pf-page, .au-desktop, .hok-hiw-page, .hok-faq-page, .cu-page, .sh-page, .hok-refunds-page, .deposit-page, .care-page, .sg-page, .terms-page, .privacy-page, .cookie-page';

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = '1280px';
    iframe.style.height = '900px';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.setAttribute('aria-hidden', 'true');

    let settled = false;
    let pollTimer: number | null = null;
    let settleTimer: number | null = null;
    const cleanup = () => {
      if (pollTimer !== null) {
        window.clearTimeout(pollTimer);
        pollTimer = null;
      }
      if (settleTimer !== null) {
        window.clearTimeout(settleTimer);
        settleTimer = null;
      }
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    };

    const timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('Timed out while loading live page UI.'));
    }, 12000);

    const runExtraction = (win: Window, doc: Document) => {
      if (settled) return;
      try {
        if (doc.getElementById('page-not-found')) {
          throw new Error(
            `No live page UI exists yet at ${liveUrl}. Add sections below or paste content from Word/Web, then publish.`,
          );
        }

        // Force scroll-reveal sections visible inside the unscrolled hidden iframe
        if (doc.head) {
          const revealFixStyle = doc.createElement('style');
          revealFixStyle.textContent =
            '.reveal, .reveal-stagger, .reveal-stagger *, .hok-hiw-r, [class*="reveal"] { opacity: 1 !important; transform: none !important; transition: none !important; animation: none !important; visibility: visible !important; }';
          doc.head.appendChild(revealFixStyle);
          void doc.body?.offsetHeight;
        }

        const root = doc.querySelector(ROOT_SELECTOR) || doc.body;
        const originUrl = window.location.origin;
        const rootCs = win.getComputedStyle(root);
        const bodyCs = win.getComputedStyle(doc.body);
        const bgCand = rgbToHex(rootCs.backgroundColor);
        const bodyBgCand = rgbToHex(bodyCs.backgroundColor);
        const bgColor = isPlainSixHex(bgCand)
          ? bgCand
          : isPlainSixHex(bodyBgCand)
          ? bodyBgCand
          : undefined;
        const textCand = rgbToHex(rootCs.color);
        const textColor = isPlainSixHex(textCand) ? textCand : undefined;

        const heroEl = root.querySelector(
          '.dp-hero, .au-hero, .hok-hiw-hero, .fq-hero, .cu-hero, .sh-hero, .sg-hero, .terms-hero, .privacy-hero, .cookie-hero, .care-hero, [class*="-hero"], [class*="__hero"], header',
        );
        const heroText = extractHeroText(heroEl, root);

        const blocks: ImportedDynamicBlock[] = [];
        const baseStamp = Date.now();
        let seq = 0;

        // Preserve hero highlights strip when present (e.g. About Us facts bar inside dark hero)
        const factsEl = heroEl?.querySelector('.au-hero__facts-grid');
        if (factsEl) {
          const factsInner = cloneComputedElement(factsEl, win, null, 'block', originUrl);
          const factsClean = sanitizeRichHtmlAdmin(
            factsInner
              ? `<div style="background-color: #1A1612; color: #FAF7F2; padding: 28px 24px; border-radius: 2px;">${factsInner}</div>`
              : '',
          );
          if (factsClean.trim()) {
            blocks.push({
              id: `imp_blk_rich_${baseStamp}_${seq++}`,
              type: 'rich',
              cardLabel: 'House Highlights',
              heading: '',
              subtitle: '',
              htmlContent: factsClean,
            });
          }
        }

        const collectSections = (container: Element) => {
          Array.from(container.children).forEach((child) => {
            const childEl = child as HTMLElement;
            if (heroEl && (childEl === heroEl || heroEl.contains(childEl))) return;
            const cs = win.getComputedStyle(childEl);
            if (shouldSkipImportEl(childEl, cs)) return;
            if (!childEl.textContent?.trim() && !childEl.querySelector('img, svg')) return;

            // If wrapper itself contains hero alongside other content, descend
            if (heroEl && childEl.contains(heroEl)) {
              collectSections(childEl);
              return;
            }

            const cqEls = Array.from(childEl.querySelectorAll('.cq'));
            if (
              cqEls.length > 0 &&
              (childEl.classList.contains('sec') ||
                childEl.tagName.toLowerCase() === 'section')
            ) {
              const headingText =
                childEl.querySelector('.sec-hd h2, h2, h3')?.textContent?.trim() ||
                `FAQ Section ${seq + 1}`;
              const summaryText =
                childEl.querySelector('.sec-hd p')?.textContent?.trim() || '';
              const numText = childEl.querySelector('.sec-n')?.textContent?.trim() || '';
              const cardLabel = numText ? `${numText} · ${headingText}` : headingText;

              const items: ImportedFaqItem[] = cqEls.map((cq, qIdx) => {
                const qText = cq.querySelector('.cq-t')?.textContent?.trim() || `Question ${qIdx + 1}`;
                const vd = cq.querySelector('.vd');
                const badgeText = vd?.textContent?.trim() || '';
                const badgeTone: 'neutral' | 'good' | 'caution' = vd?.classList.contains('v-yes')
                  ? 'good'
                  : vd?.classList.contains('v-no')
                  ? 'caution'
                  : 'neutral';
                const answerHtml = extractCleanFaqAnswerHtml(cq.querySelector('.ans'), originUrl);
                return {
                  id: `imp_faq_${baseStamp}_${seq}_${qIdx}`,
                  question: qText,
                  badgeText,
                  badgeTone,
                  answerHtml,
                };
              });

              blocks.push({
                id: `imp_blk_faq_${baseStamp}_${seq++}`,
                type: 'faq',
                cardLabel,
                heading: headingText,
                subtitle: summaryText,
                items,
              });
              return;
            }

            if (isTransparentLayoutWrapper(childEl, cs)) {
              collectSections(childEl);
              return;
            }

            const rawHtml = cloneComputedElement(childEl, win, null, 'block', originUrl);
            const cleanHtml = sanitizeRichHtmlAdmin(rawHtml);
            if (!cleanHtml.trim()) return;

            const headingCand =
              childEl
                .querySelector('h2, h3, .lg-hd h2, .side-tab[aria-selected="true"] .st-t')
                ?.textContent?.replace(/\s+/g, ' ').trim() ||
              childEl.querySelector('blockquote')?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 60) ||
              childEl.getAttribute('aria-label')?.trim() ||
              `Section ${seq + 1}`;

            blocks.push({
              id: `imp_blk_rich_${baseStamp}_${seq++}`,
              type: 'rich',
              cardLabel: headingCand,
              heading: '',
              subtitle: '',
              htmlContent: cleanHtml,
            });
          });
        };

        collectSections(root);

        // Fallback to single block if root had custom structure
        if (blocks.length === 0) {
          const rawImported = cloneComputedElement(root, win, null, 'block', originUrl);
          const cleanHtml = sanitizeRichHtmlAdmin(rawImported);
          if (cleanHtml.trim()) {
            blocks.push({
              id: `imp_blk_rich_${baseStamp}_0`,
              type: 'rich',
              cardLabel: heroText.title || 'Imported Page Content',
              heading: '',
              subtitle: '',
              htmlContent: cleanHtml,
            });
          }
        }

        settled = true;
        window.clearTimeout(timeout);
        cleanup();

        if (!heroText.title && blocks.length === 0) {
          reject(new Error('Imported page returned empty content.'));
        } else {
          resolve({
            eyebrow: heroText.eyebrow,
            title: heroText.title,
            subtitle: heroText.subtitle,
            bgColor,
            textColor,
            blocks,
          });
        }
      } catch (err: any) {
        settled = true;
        window.clearTimeout(timeout);
        cleanup();
        reject(err);
      }
    };

    iframe.onload = () => {
      const pollStarted = Date.now();
      const pollReady = () => {
        if (settled) return;
        try {
          const win = iframe.contentWindow;
          const doc = iframe.contentDocument || win?.document;
          if (!win || !doc) {
            settled = true;
            window.clearTimeout(timeout);
            cleanup();
            reject(new Error('Could not access iframe document.'));
            return;
          }
          const notFound = doc.getElementById('page-not-found');
          const matchedRoot = doc.querySelector(ROOT_SELECTOR);
          const hasContent = Boolean(matchedRoot && (matchedRoot.textContent || '').trim().length > 20);
          if (notFound || hasContent || Date.now() - pollStarted >= 6000) {
            settleTimer = window.setTimeout(() => runExtraction(win, doc), 250);
            return;
          }
          pollTimer = window.setTimeout(pollReady, 150);
        } catch (err: any) {
          settled = true;
          window.clearTimeout(timeout);
          cleanup();
          reject(err);
        }
      };
      pollReady();
    };

    iframe.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      cleanup();
      reject(new Error('Failed to load page inside hidden importer frame.'));
    };

    document.body.appendChild(iframe);
    iframe.src = targetSrc;
  });
}

export async function importComputedHtmlFromIframe(liveUrl: string): Promise<string> {
  const res = await importStructuredPageFromIframe(liveUrl);
  return res.blocks.map((b) => b.htmlContent || '').filter(Boolean).join('\n');
}

export default sanitizeRichHtmlAdmin;
