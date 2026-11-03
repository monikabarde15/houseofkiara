/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Registry: Page Content Lookup (Spec §8.1 to §8.26, Pages 27-49)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { PageContentDefinition } from '../types/pageContent.types';
import { CANONICAL_PAGE_CONTENTS } from './canonicalPageContents';

export { CANONICAL_PAGE_CONTENTS } from './canonicalPageContents';

export const getPageContent = (slug: string): PageContentDefinition => {
  const cleanSlug = slug.replace(/^\//, '');
  if (CANONICAL_PAGE_CONTENTS[cleanSlug]) {
    return CANONICAL_PAGE_CONTENTS[cleanSlug];
  }
  if (CANONICAL_PAGE_CONTENTS[slug]) {
    return CANONICAL_PAGE_CONTENTS[slug];
  }

  // Fallback for aliases or generic canonical pages
  if ((cleanSlug === 'care-policy' || slug === '/care-policy') && CANONICAL_PAGE_CONTENTS['care-damage']) {
    return CANONICAL_PAGE_CONTENTS['care-damage'];
  }
  if ((cleanSlug === 'shipping-policy' || slug === '/shipping-policy') && CANONICAL_PAGE_CONTENTS['shipping-delivery']) {
    return CANONICAL_PAGE_CONTENTS['shipping-delivery'];
  }

  const formattedTitle = cleanSlug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    slug,
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'opening', label: 'Opening' },
      { id: 'sections', label: 'Sections' },
      { id: 'answers', label: 'Answers', count: 18 },
      { id: 'related', label: 'Related policies' }
    ],
    hero: {
      tagline: 'Official policy document',
      headingPrefix: `${formattedTitle} `,
      headingGoldItalic: 'terms',
      lead: `The canonical guidelines and operating terms governing ${formattedTitle.toLowerCase()} across House of Kaira.`,
      searchPlaceholder: `Search ${formattedTitle.toLowerCase()} questions`,
      popularQuestions: [
        `What are the key terms for ${formattedTitle.toLowerCase()}?`,
        'How do I reach the team regarding this policy?'
      ]
    },
    opening: {
      sideLabel: 'General commitments',
      text: 'House of Kaira maintains transparent, ethical and premium standards across every transaction. These rules protect clients and designers alike.',
      figures: [
        {
          key: 'free_delivery_min',
          label: 'Free delivery threshold',
          displayValue: '₹5,000',
          contextBefore: 'Standard site terms apply with free delivery above',
          contextAfter: 'across India.'
        }
      ]
    }
  };
};

export default getPageContent;
