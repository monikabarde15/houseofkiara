import fs from 'fs';

const questions = JSON.parse(fs.readFileSync('scratch/care_questions_parsed.json', 'utf-8'));

// 1. Generate careAnswers.ts
let answersCode = `/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Registry: Care Policy Answers (Spec § 8.14, 57 items)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { AnswerItem, AnswerParagraph, StatusTagTone } from '../types/answers.types';

const TONE_MAP: Record<string, StatusTagTone> = {
  sage: 'good-news',
  ochre: 'worth-knowing',
  rust: 'not-possible'
};

export const CARE_ANSWERS: AnswerItem[] = [
`;

questions.forEach((q, idx) => {
  const paragraphs = q.answer.split('\n\n').map((pText, pIdx) => {
    const isSharedPara = q.sharedWithDeposit && pIdx === 0;
    const isBullet = pText.trim().startsWith('•') || pText.trim().startsWith('-');
    const cleanText = pText.replace(/^[•\-]\s*/, '').trim();
    
    let pObj = {
      id: `${q.id}_p_${pIdx}`,
      kind: isBullet ? 'bullet' : 'paragraph',
      text: cleanText
    };

    if (isSharedPara) {
      return `      {
        id: '${q.id}_p_${pIdx}',
        kind: 'paragraph',
        text: ${JSON.stringify(cleanText)},
        sharedFrom: {
          pageName: 'Deposit Policy',
          questionTitle: ${JSON.stringify(q.title)}
        }
      }`;
    }

    return `      {
        id: '${q.id}_p_${pIdx}',
        kind: '${isBullet ? 'bullet' : 'paragraph'}',
        text: ${JSON.stringify(cleanText)}
      }`;
  });

  const tagCode = q.tag ? `{ label: ${JSON.stringify(q.tag.label)}, tone: TONE_MAP['${q.tag.type}'] || 'good-news' }` : 'undefined';

  answersCode += `  {
    id: '${q.id}',
    question: ${JSON.stringify(q.title)},
    section: ${JSON.stringify(q.sectionName)},
    side: 'rentals',
    statusTag: ${tagCode},
    paragraphs: [
${paragraphs.join(',\n')}
    ],
    searchWords: ${JSON.stringify(q.searchWords || '')},
    linkName: '${q.id}',
    isShared: ${q.sharedWithDeposit ? 'true' : 'false'},
    appearsIn: ['Care, Cleaning & Damage Policy', ${JSON.stringify(q.sectionName)}],
    orderIndex: ${idx + 1}
  },\n`;
});

answersCode += `];

export default CARE_ANSWERS;
`;

fs.writeFileSync('hok_admin/src/components/Pages/data/careAnswers.ts', answersCode, 'utf-8');
console.log('Created hok_admin/src/components/Pages/data/careAnswers.ts');
