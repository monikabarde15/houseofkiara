// Merges Admin overrides (fieldValues + answers + extraQaSections) onto static PRICING_SECTIONS

function stripHtmlToText(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function parseAnswerTextToContent(answerText, originalContent) {
  const raw = String(answerText ?? "").trim();
  if (!raw) return Array.isArray(originalContent) ? originalContent : [];
  const blocks = [];
  const chunks = raw.split(/\n\s*\n/);
  for (const chunk of chunks) {
    const lines = chunk
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) continue;
    if (lines.every((l) => l.startsWith("- ") || l.startsWith("• "))) {
      blocks.push({
        type: "list",
        items: lines.map((l) => l.replace(/^[-•]\s+/, "")),
      });
    } else {
      blocks.push({
        type: "paragraph",
        text: lines.join(" "),
      });
    }
  }
  return blocks;
}

function mapCustomQuestionItem(item, sideFallback, sectionIdFallback) {
  const htmlStr = typeof item.answerHtml === "string" ? item.answerHtml.trim() : "";
  const plainFromHtml = htmlStr ? stripHtmlToText(htmlStr) : "";
  const answerStr = String(item.answerText || plainFromHtml || "").trim();
  const searchable = `${item.question || ""} ${answerStr}`.toLowerCase();
  return {
    id: item.id,
    side: item.side || sideFallback,
    sectionId: item.sectionId || sectionIdFallback,
    question: item.question || "Untitled question",
    tag: item.tagText
      ? { text: item.tagText, tone: item.tagTone || "neutral" }
      : null,
    summary: answerStr.split(/\n/)[0] || item.question || "",
    answerHtml: htmlStr || undefined,
    content: parseAnswerTextToContent(answerStr, []),
    keywords: searchable.split(/[^a-z0-9]+/).filter(Boolean),
  };
}

export function buildDynamicPricingSections(
  baseSections,
  fieldValues = {},
  answers = null,
  extraQaSections = []
) {
  const answerList = Array.isArray(answers) ? answers : [];
  const byId = new Map();
  const bySectionAdded = new Map();

  answerList.forEach((item) => {
    if (!item || !item.id) return;
    byId.set(item.id, item);
  });

  const existingIds = new Set();
  (baseSections || []).forEach((sec) => {
    (sec.questions || []).forEach((q) => existingIds.add(q.id));
  });

  answerList.forEach((item) => {
    if (!item || !item.id || existingIds.has(item.id)) return;
    const secId = item.sectionId || "s-renting";
    if (!bySectionAdded.has(secId)) bySectionAdded.set(secId, []);
    bySectionAdded.get(secId).push(item);
  });

  const mergedBase = (baseSections || []).map((sec) => {
    const customTitle = fieldValues?.[`pricing_sec_${sec.id}_title`];
    const customSummary = fieldValues?.[`pricing_sec_${sec.id}_summary`];

    const updatedQuestions = [];
    (sec.questions || []).forEach((q) => {
      const ov = byId.get(q.id);
      if (ov?.hidden === true) return;
      if (!ov) {
        updatedQuestions.push(q);
        return;
      }
      const nextQuestion =
        ov.question !== undefined && ov.question !== "" ? ov.question : q.question;
      const nextTagText =
        ov.tagText !== undefined
          ? ov.tagText
          : typeof q.tag === "object" && q.tag
          ? q.tag.text
          : q.tag || "";
      const nextTagTone =
        ov.tagTone ||
        (typeof q.tag === "object" && q.tag ? q.tag.tone : q.tagTone) ||
        "neutral";

      const ovHtml = typeof ov.answerHtml === "string" ? ov.answerHtml.trim() : "";
      const plainFromHtml = ovHtml ? stripHtmlToText(ovHtml) : "";
      const plainAnswer =
        ov.answerText !== undefined && String(ov.answerText).trim()
          ? String(ov.answerText)
          : plainFromHtml;

      const nextContent = plainAnswer
        ? parseAnswerTextToContent(plainAnswer, q.content)
        : q.content;
      const firstLine = plainAnswer
        ? String(plainAnswer).split(/\n/)[0].trim()
        : q.summary;

      const baseKeywords = Array.isArray(q.keywords) ? q.keywords : [];
      const dynamicKeywords = `${nextQuestion} ${plainAnswer}`
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean);

      updatedQuestions.push({
        ...q,
        question: nextQuestion,
        tag: nextTagText
          ? {
              ...(typeof q.tag === "object" && q.tag ? q.tag : {}),
              text: nextTagText,
              tone: nextTagTone,
            }
          : null,
        summary: firstLine || q.summary,
        answerHtml: ovHtml || undefined,
        content: nextContent,
        keywords: Array.from(new Set([...baseKeywords, ...dynamicKeywords])),
      });
    });

    const added = bySectionAdded.get(sec.id) || [];
    added.forEach((item) => {
      if (item.hidden === true) return;
      updatedQuestions.push(mapCustomQuestionItem(item, sec.side, sec.id));
    });

    return {
      ...sec,
      title: customTitle && String(customTitle).trim() ? customTitle : sec.title,
      summary: customSummary && String(customSummary).trim() ? customSummary : sec.summary,
      questions: updatedQuestions,
    };
  });

  // Append custom Q&A categories added from Admin
  const customSectionsList = Array.isArray(extraQaSections) ? extraQaSections : [];
  const payCount = mergedBase.filter((s) => s.side === "pay").length;
  const earnCount = mergedBase.filter((s) => s.side === "earn").length;
  let extraPayIdx = 0;
  let extraEarnIdx = 0;

  const builtCustom = customSectionsList
    .filter((sec) => sec && sec.id && !sec.hidden)
    .map((sec) => {
      const side = sec.side === "earn" ? "earn" : "pay";
      const nextIdx =
        side === "pay"
          ? payCount + ++extraPayIdx
          : earnCount + ++extraEarnIdx;
      const fallbackNum = String(nextIdx).padStart(2, "0");
      const customTitle = fieldValues?.[`pricing_sec_${sec.id}_title`];
      const customSummary = fieldValues?.[`pricing_sec_${sec.id}_summary`];

      const qs = (bySectionAdded.get(sec.id) || [])
        .filter((item) => item.hidden !== true)
        .map((item) => mapCustomQuestionItem(item, side, sec.id));

      return {
        id: sec.id,
        side,
        number: sec.number || fallbackNum,
        title:
          (customTitle && String(customTitle).trim()) ||
          sec.title ||
          "Additional Questions",
        summary:
          (customSummary && String(customSummary).trim()) ||
          sec.summary ||
          "",
        questions: qs,
      };
    });

  return [...mergedBase, ...builtCustom];
}
