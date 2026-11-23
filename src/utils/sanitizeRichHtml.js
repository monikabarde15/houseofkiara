// Safe style-preserving rich HTML sanitizer for Admin Pages Editor (Web page copy-paste, MS Word, tables, layouts, images)

const ALLOWED_TAGS = new Set([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "br",
  "hr",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "del",
  "sub",
  "sup",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "colgroup",
  "col",
  "a",
  "img",
  "figure",
  "figcaption",
  "span",
  "div",
  "section",
  "article",
  "header",
  "aside",
  "dl",
  "dt",
  "dd",
  "small",
  "mark",
  "time",
  "abbr",
  "cite",
  "address",
]);

const CONVERT_TO_DIV_TAGS = new Set(["main", "nav", "footer"]);

const SVG_TAGS = new Set([
  "svg",
  "g",
  "path",
  "polyline",
  "polygon",
  "line",
  "circle",
  "rect",
  "ellipse",
  "text",
  "tspan",
]);

const SVG_ATTRS = new Set([
  "viewbox",
  "width",
  "height",
  "fill",
  "stroke",
  "stroke-width",
  "stroke-dasharray",
  "stroke-linecap",
  "stroke-linejoin",
  "text-anchor",
  "dominant-baseline",
  "opacity",
  "d",
  "points",
  "x",
  "y",
  "x1",
  "y1",
  "x2",
  "y2",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
]);

const VOID_TAGS = new Set(["br", "hr", "img", "col"]);
const STRIP_COMPLETELY = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "applet",
  "form",
  "input",
  "textarea",
  "select",
  "meta",
  "link",
  "base",
  "xml",
  "noscript",
  "foreignobject",
  "use",
]);

const SAFE_CSS_PROPS = new Set([
  "color",
  "background-color",
  "background",
  "background-image",
  "font",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "font-variant",
  "font-stretch",
  "text-decoration",
  "text-decoration-line",
  "text-decoration-color",
  "text-decoration-thickness",
  "text-underline-offset",
  "text-align",
  "text-transform",
  "letter-spacing",
  "word-spacing",
  "word-break",
  "overflow-wrap",
  "line-height",
  "vertical-align",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "border",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left",
  "border-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "border-style",
  "border-width",
  "border-collapse",
  "border-spacing",
  "border-radius",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "outline",
  "outline-offset",
  "box-shadow",
  "text-shadow",
  "opacity",
  "width",
  "max-width",
  "min-width",
  "height",
  "min-height",
  "max-height",
  "aspect-ratio",
  "object-fit",
  "object-position",
  "text-indent",
  "white-space",
  "list-style",
  "list-style-type",
  "list-style-position",
  "display",
  "flex",
  "flex-direction",
  "flex-wrap",
  "flex-flow",
  "flex-grow",
  "flex-shrink",
  "flex-basis",
  "order",
  "grid-template-columns",
  "grid-template-rows",
  "grid-template-areas",
  "grid-auto-columns",
  "grid-auto-rows",
  "grid-auto-flow",
  "grid-column",
  "grid-row",
  "grid-area",
  "gap",
  "row-gap",
  "column-gap",
  "justify-content",
  "justify-items",
  "justify-self",
  "align-items",
  "align-content",
  "align-self",
  "place-items",
  "place-content",
  "box-sizing",
  "float",
  "clear",
  "overflow",
  "overflow-x",
  "overflow-y",
  "position",
]);

const SAFE_DISPLAY_VALUES = new Set([
  "block",
  "inline",
  "inline-block",
  "flex",
  "inline-flex",
  "grid",
  "inline-grid",
  "table",
  "table-row",
  "table-cell",
  "list-item",
  "contents",
]);

const FONT_SIZE_MAP = {
  1: "10px",
  2: "13px",
  3: "16px",
  4: "18px",
  5: "24px",
  6: "32px",
  7: "48px",
};

const UNSAFE_CSS_VALUE_RE =
  /url\s*\(|expression\s*\(|javascript\s*:|vbscript\s*:|behavior\s*:|@import|data\s*:|<|>/i;

const isSafeHref = (raw) => {
  const val = String(raw || "").trim();
  if (!val) return false;
  if (val.startsWith("/") || val.startsWith("#")) return true;
  return /^(https?:|mailto:|tel:)/i.test(val);
};

const isSafeImgSrc = (raw) => {
  const val = String(raw || "").trim();
  if (!val) return false;
  if (val.startsWith("/") && !val.startsWith("//")) return true;
  return /^https?:\/\//i.test(val);
};

const isSafeGradient = (val) => {
  const v = String(val || "").trim();
  if (!v || UNSAFE_CSS_VALUE_RE.test(v)) return false;
  return /^(?:repeating-)?(?:linear|radial|conic)-gradient\(/i.test(v);
};

const isSafeSvgAttrValue = (val) => {
  const v = String(val || "").trim();
  if (!v) return false;
  return !/javascript:|vbscript:|expression\(|url\(|data:|<|>/i.test(v);
};

const escapeText = (val) =>
  String(val || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeAttr = (val) =>
  escapeText(val).replace(/"/g, "&quot;");

const extractSafeSolidColor = (rawVal) => {
  const v = String(rawVal || "")
    .replace(/\bwindowtext\b/gi, "#1A1612")
    .replace(/!important/gi, "")
    .trim();
  if (!v || UNSAFE_CSS_VALUE_RE.test(v)) return "";
  const hexMatch = v.match(/#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})\b/i);
  if (hexMatch) return hexMatch[0];
  const fnMatch = v.match(/(?:rgba?|hsla?)\([^)]+\)/i);
  if (fnMatch) return fnMatch[0];
  const firstToken = (v.split(/\s+/)[0] || "").toLowerCase();
  if (/^[a-z]{3,20}$/.test(firstToken) && firstToken !== "none" && firstToken !== "auto") {
    return firstToken;
  }
  return "";
};

const decodeStyleEntities = (s) =>
  String(s || "")
    .replace(/&quot;/gi, "'")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&amp;/gi, "&");

const sanitizeStyleMap = (rawStyle) => {
  const map = new Map();
  const parts = decodeStyleEntities(rawStyle).split(";");

  for (const part of parts) {
    const colonIdx = part.indexOf(":");
    if (colonIdx <= 0) continue;
    const rawProp = part.slice(0, colonIdx).trim().toLowerCase();
    let rawVal = part.slice(colonIdx + 1).trim();
    if (!rawProp || !rawVal) continue;
    if (rawProp === "mso-highlight") {
      const hi = extractSafeSolidColor(rawVal);
      if (hi && !map.has("background-color")) map.set("background-color", hi);
      continue;
    }
    if (
      rawProp.startsWith("mso-") ||
      rawProp.startsWith("-webkit-") ||
      rawProp.startsWith("-moz-")
    ) {
      continue;
    }
    if (!SAFE_CSS_PROPS.has(rawProp)) continue;

    rawVal = rawVal.replace(/!important/gi, "").trim();
    if (!rawVal || UNSAFE_CSS_VALUE_RE.test(rawVal)) continue;

    rawVal = rawVal.replace(/\bwindowtext\b/gi, "#1A1612").replace(/"/g, "'");

    if (rawProp === "background-image") {
      if (isSafeGradient(rawVal)) {
        map.set("background-image", rawVal);
      }
      continue;
    }

    if (rawProp === "background") {
      if (isSafeGradient(rawVal)) {
        map.set("background", rawVal);
      } else {
        const solid = extractSafeSolidColor(rawVal);
        if (solid) {
          map.set("background-color", solid);
        }
      }
      continue;
    }

    if (rawProp === "display") {
      const normDisp = rawVal.toLowerCase();
      if (SAFE_DISPLAY_VALUES.has(normDisp)) {
        map.set("display", normDisp);
      }
      continue;
    }

    if (rawProp === "position") {
      const normPos = rawVal.toLowerCase();
      if (normPos === "static" || normPos === "relative") {
        map.set("position", normPos);
      }
      continue;
    }

    map.set(rawProp, rawVal);
  }

  return map;
};

const serializeStyleMap = (map) => {
  const pairs = [];
  map.forEach((v, k) => {
    pairs.push(`${k}: ${v}`);
  });
  return pairs.join("; ");
};

const normalizeLegacyWidth = (rawWidth) => {
  const w = String(rawWidth || "").trim();
  if (!w) return "";
  if (/^\d+(?:\.\d+)?%$/.test(w)) return w;
  if (/^\d+(?:\.\d+)?(?:px|pt|em|rem)$/i.test(w)) return w;
  if (/^\d+(?:\.\d+)?$/.test(w)) return `${w}px`;
  return "";
};

const serializeSvgNode = (node, tag) => {
  const childrenHtml = Array.from(node.childNodes || []).map(serializeSafeNode).join("");
  const attrs = [];

  Array.from(node.attributes || []).forEach((attr) => {
    const nameLower = String(attr.name || "").toLowerCase();
    if (!SVG_ATTRS.has(nameLower)) return;
    const val = String(attr.value || "").trim();
    if (!isSafeSvgAttrValue(val)) return;
    const emittedName = nameLower === "viewbox" ? "viewBox" : nameLower;
    attrs.push(`${emittedName}="${escapeAttr(val)}"`);
  });

  const inlineMap = sanitizeStyleMap(node.getAttribute("style") || "");
  const finalStyle = serializeStyleMap(inlineMap);
  if (finalStyle) attrs.push(`style="${escapeAttr(finalStyle)}"`);

  const attrStr = attrs.length > 0 ? ` ${attrs.join(" ")}` : "";
  return `<${tag}${attrStr}>${childrenHtml}</${tag}>`;
};

const serializeSafeNode = (node) => {
  if (!node) return "";
  if (node.nodeType === 3) {
    return escapeText(node.nodeValue || "");
  }
  if (node.nodeType !== 1) return "";

  let tag = String(node.tagName || "").toLowerCase();
  if (STRIP_COMPLETELY.has(tag)) return "";

  if (SVG_TAGS.has(tag)) {
    return serializeSvgNode(node, tag);
  }

  const childrenHtml = Array.from(node.childNodes || []).map(serializeSafeNode).join("");

  const extraLegacyStyles = new Map();
  if (tag === "font") {
    const face = node.getAttribute("face");
    const color = node.getAttribute("color");
    const size = node.getAttribute("size");
    if (face && !UNSAFE_CSS_VALUE_RE.test(face)) {
      extraLegacyStyles.set("font-family", face.replace(/"/g, "'"));
    }
    if (color) {
      const safeColor = extractSafeSolidColor(color);
      if (safeColor) extraLegacyStyles.set("color", safeColor);
    }
    if (size && FONT_SIZE_MAP[size.trim()]) {
      extraLegacyStyles.set("font-size", FONT_SIZE_MAP[size.trim()]);
    }
    tag = "span";
  }

  if (CONVERT_TO_DIV_TAGS.has(tag)) {
    tag = "div";
  }

  const bgcolor = node.getAttribute("bgcolor");
  if (bgcolor) {
    const safeBg = extractSafeSolidColor(bgcolor);
    if (safeBg) extraLegacyStyles.set("background-color", safeBg);
  }
  const align = String(node.getAttribute("align") || "").trim().toLowerCase();
  if (/^(left|center|right|justify)$/.test(align)) {
    extraLegacyStyles.set("text-align", align);
  }
  const valign = String(node.getAttribute("valign") || "").trim().toLowerCase();
  if (/^(top|middle|bottom|baseline)$/.test(valign)) {
    extraLegacyStyles.set("vertical-align", valign);
  }

  const inlineMap = sanitizeStyleMap(node.getAttribute("style") || "");
  const mergedStyleMap = new Map([...extraLegacyStyles, ...inlineMap]);

  if (tag === "button") {
    const disp = String(mergedStyleMap.get("display") || "").toLowerCase();
    tag = /^(block|flex|grid|table)$/.test(disp) ? "div" : "span";
  }

  if (!ALLOWED_TAGS.has(tag)) {
    return childrenHtml;
  }

  if (tag === "td" || tag === "th" || tag === "col") {
    const legW = normalizeLegacyWidth(node.getAttribute("width"));
    if (legW && !mergedStyleMap.has("width")) {
      mergedStyleMap.set("width", legW);
    }
  }

  if (tag === "table") {
    const existingW = String(mergedStyleMap.get("width") || "");
    if (!existingW || !existingW.endsWith("%")) {
      mergedStyleMap.set("width", "100%");
    }
    mergedStyleMap.set("max-width", "100%");
    mergedStyleMap.set("border-collapse", "collapse");
  }

  const attrs = [];

  if (tag === "a") {
    const href = node.getAttribute("href");
    if (isSafeHref(href)) {
      attrs.push(`href="${escapeAttr(href)}"`);
      const target = node.getAttribute("target");
      if (target === "_blank") {
        attrs.push('target="_blank"');
        attrs.push('rel="noopener noreferrer"');
      }
    }
  } else if (tag === "img") {
    const src = node.getAttribute("src");
    if (!isSafeImgSrc(src)) return "";
    attrs.push(`src="${escapeAttr(src)}"`);
    const alt = node.getAttribute("alt");
    if (alt !== null) attrs.push(`alt="${escapeAttr(alt)}"`);
    const title = node.getAttribute("title");
    if (title) attrs.push(`title="${escapeAttr(title)}"`);
    const w = node.getAttribute("width");
    const h = node.getAttribute("height");
    if (w && /^\d+$/.test(w)) attrs.push(`width="${w}"`);
    if (h && /^\d+$/.test(h)) attrs.push(`height="${h}"`);
    mergedStyleMap.set("max-width", "100%");
    if (!mergedStyleMap.has("height")) mergedStyleMap.set("height", "auto");
  } else if (tag === "td" || tag === "th") {
    const colspan = node.getAttribute("colspan");
    const rowspan = node.getAttribute("rowspan");
    if (colspan && /^\d+$/.test(colspan)) attrs.push(`colspan="${colspan}"`);
    if (rowspan && /^\d+$/.test(rowspan)) attrs.push(`rowspan="${rowspan}"`);
  }

  const finalStyle = serializeStyleMap(mergedStyleMap);
  if (finalStyle) {
    attrs.push(`style="${escapeAttr(finalStyle)}"`);
  }

  const attrStr = attrs.length > 0 ? ` ${attrs.join(" ")}` : "";
  if (VOID_TAGS.has(tag)) {
    return `<${tag}${attrStr} />`;
  }
  return `<${tag}${attrStr}>${childrenHtml}</${tag}>`;
};

const regexFallbackSanitize = (dirtyHtml) => {
  let out = String(dirtyHtml || "");
  out = out.replace(/<!--[\s\S]*?-->/g, "");
  // Track button conversions so closing tags match their converted open tag
  const buttonCloseStack = [];

  out = out.replace(
    /<\s*(script|style|iframe|object|embed|applet|form|foreignobject|use|xml|noscript)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
    ""
  );
  out = out.replace(
    /<\s*(script|style|iframe|object|embed|applet|form|foreignobject|use|meta|link|base|xml)\b[^>]*\/?>/gi,
    ""
  );
  out = out.replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  out = out.replace(/\s+(href|src)\s*=\s*(['"])\s*(?:javascript:|vbscript:|data:|file:)[\s\S]*?\2/gi, "");
  out = out.replace(/\s+(href|src)\s*=\s*(?:javascript:|vbscript:|data:|file:)[^\s>]*/gi, "");

  out = out.replace(/<\/?([a-z0-9:_-]+)(\s+[^>]*)?>/gi, (match, rawTag, rawAttrs = "") => {
    const origTag = String(rawTag || "").toLowerCase();
    let tag = origTag;
    const isClosing = match.startsWith("</");

    if (tag === "font") {
      if (isClosing) return "</span>";
      tag = "span";
    } else if (CONVERT_TO_DIV_TAGS.has(tag)) {
      if (isClosing) return "</div>";
      tag = "div";
    } else if (tag === "button") {
      if (isClosing) {
        const mapped = buttonCloseStack.pop() || "span";
        return `</${mapped}>`;
      }
    }

    if (SVG_TAGS.has(tag)) {
      if (isClosing) return `</${tag}>`;
      const svgKept = [];
      const attrRe = /\b([a-z0-9:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
      let am;
      while ((am = attrRe.exec(rawAttrs)) !== null) {
        const aName = am[1].toLowerCase();
        const aVal = am[2] ?? am[3] ?? "";
        if (aName === "style") {
          const sm = serializeStyleMap(sanitizeStyleMap(aVal));
          if (sm) svgKept.push(`style="${escapeAttr(sm)}"`);
          continue;
        }
        if (!SVG_ATTRS.has(aName) || !isSafeSvgAttrValue(aVal)) continue;
        svgKept.push(`${aName === "viewbox" ? "viewBox" : aName}="${escapeAttr(aVal)}"`);
      }
      const isSelfClose = /\/\s*>$/.test(match);
      const aStr = svgKept.length > 0 ? ` ${svgKept.join(" ")}` : "";
      return isSelfClose ? `<${tag}${aStr} />` : `<${tag}${aStr}>`;
    }

    if (tag !== "button" && !ALLOWED_TAGS.has(tag)) return "";
    if (isClosing) return `</${tag}>`;

    const extraLegacy = new Map();
    if (origTag === "font") {
      const faceM = rawAttrs.match(/\bface\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      const colorM = rawAttrs.match(/\bcolor\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      const sizeM = rawAttrs.match(/\bsize\s*=\s*(?:"([^"]*)"|'([^']*)'|(\d+))/i);
      const faceVal = faceM ? faceM[1] ?? faceM[2] : "";
      const colorVal = colorM ? colorM[1] ?? colorM[2] : "";
      const sizeVal = sizeM ? sizeM[1] ?? sizeM[2] ?? sizeM[3] : "";
      if (faceVal && !UNSAFE_CSS_VALUE_RE.test(faceVal)) {
        extraLegacy.set("font-family", faceVal.replace(/"/g, "'"));
      }
      if (colorVal) {
        const sc = extractSafeSolidColor(colorVal);
        if (sc) extraLegacy.set("color", sc);
      }
      if (sizeVal && FONT_SIZE_MAP[sizeVal.trim()]) {
        extraLegacy.set("font-size", FONT_SIZE_MAP[sizeVal.trim()]);
      }
    }

    const bgM = rawAttrs.match(/\bbgcolor\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    if (bgM) {
      const sc = extractSafeSolidColor(bgM[1] ?? bgM[2]);
      if (sc) extraLegacy.set("background-color", sc);
    }
    const alignM = rawAttrs.match(/\balign\s*=\s*(?:"([^"]*)"|'([^']*)'|([a-z]+))/i);
    if (alignM) {
      const al = String(alignM[1] ?? alignM[2] ?? alignM[3] ?? "").trim().toLowerCase();
      if (/^(left|center|right|justify)$/.test(al)) extraLegacy.set("text-align", al);
    }
    const valignM = rawAttrs.match(/\bvalign\s*=\s*(?:"([^"]*)"|'([^']*)'|([a-z]+))/i);
    if (valignM) {
      const va = String(valignM[1] ?? valignM[2] ?? valignM[3] ?? "").trim().toLowerCase();
      if (/^(top|middle|bottom|baseline)$/.test(va)) extraLegacy.set("vertical-align", va);
    }

    const styleMatch = rawAttrs.match(/\bstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    const inlineMap = sanitizeStyleMap(styleMatch ? styleMatch[1] ?? styleMatch[2] : "");
    const mergedMap = new Map([...extraLegacy, ...inlineMap]);

    if (tag === "button") {
      const disp = String(mergedMap.get("display") || "").toLowerCase();
      tag = /^(block|flex|grid|table)$/.test(disp) ? "div" : "span";
      buttonCloseStack.push(tag);
    }

    if (tag === "td" || tag === "th" || tag === "col") {
      const widthM = rawAttrs.match(/\bwidth\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const legW = widthM ? normalizeLegacyWidth(widthM[1] ?? widthM[2] ?? widthM[3]) : "";
      if (legW && !mergedMap.has("width")) {
        mergedMap.set("width", legW);
      }
    }

    if (tag === "table") {
      const existingW = String(mergedMap.get("width") || "");
      if (!existingW || !existingW.endsWith("%")) {
        mergedMap.set("width", "100%");
      }
      mergedMap.set("max-width", "100%");
      mergedMap.set("border-collapse", "collapse");
    }

    const kept = [];
    if (tag === "a") {
      const hrefMatch = rawAttrs.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      const hrefVal = hrefMatch ? hrefMatch[1] ?? hrefMatch[2] : "";
      if (isSafeHref(hrefVal)) kept.push(`href="${escapeAttr(hrefVal)}"`);
    } else if (tag === "img") {
      const srcMatch = rawAttrs.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      const srcVal = srcMatch ? srcMatch[1] ?? srcMatch[2] : "";
      if (!isSafeImgSrc(srcVal)) return "";
      kept.push(`src="${escapeAttr(srcVal)}"`);
      const altMatch = rawAttrs.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      if (altMatch) kept.push(`alt="${escapeAttr(altMatch[1] ?? altMatch[2])}"`);
      mergedMap.set("max-width", "100%");
      if (!mergedMap.has("height")) mergedMap.set("height", "auto");
    } else if (tag === "td" || tag === "th") {
      const colMatch = rawAttrs.match(/\bcolspan\s*=\s*['"]?(\d+)['"]?/i);
      const rowMatch = rawAttrs.match(/\browspan\s*=\s*['"]?(\d+)['"]?/i);
      if (colMatch) kept.push(`colspan="${colMatch[1]}"`);
      if (rowMatch) kept.push(`rowspan="${rowMatch[1]}"`);
    }

    const finalStyle = serializeStyleMap(mergedMap);
    if (finalStyle) kept.push(`style="${escapeAttr(finalStyle)}"`);

    const attrStr = kept.length > 0 ? ` ${kept.join(" ")}` : "";
    return VOID_TAGS.has(tag) ? `<${tag}${attrStr} />` : `<${tag}${attrStr}>`;
  });
  return out;
};

export function sanitizeRichHtml(dirtyHtml) {
  const input = String(dirtyHtml || "");
  if (!input.trim()) return "";

  const preCleaned = input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\s*xml\b[^>]*>[\s\S]*?<\s*\/\s*xml\s*>/gi, "");

  if (typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(preCleaned, "text/html");
      if (doc && doc.body) {
        return Array.from(doc.body.childNodes).map(serializeSafeNode).join("");
      }
    } catch {
      // Fallback below
    }
  }

  return regexFallbackSanitize(preCleaned);
}

export default sanitizeRichHtml;
