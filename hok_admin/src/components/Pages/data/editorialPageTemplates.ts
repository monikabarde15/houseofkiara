import type { DynamicPageBlock } from '../components/PagesEditorTab';
import type { PageStyleConfig } from './servicePagesSchema';

export interface EditorialPageTemplate {
  eyebrow: string;
  title: string;
  subtitle: string;
  fullBleed?: boolean;
  style?: Partial<PageStyleConfig>;
  blocks: DynamicPageBlock[];
}

const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'DM Sans', 'Inter', sans-serif";

const escapeHtml = (str: string): string =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const darkBanner = (
  eyebrow: string,
  headline: string,
  lead: string,
  stats?: Array<{ value: string; label: string; note: string }>,
): string => {
  const statsHtml =
    stats && stats.length > 0
      ? `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 18px; margin-top: 26px; padding-top: 22px; border-top: 1px solid rgba(197, 168, 128, 0.25);">
          ${stats
            .map(
              (s) =>
                `<div style="text-align: center;">
                  <div style="font-family: ${SERIF}; font-size: 26px; font-weight: 500; color: #f5d77f; line-height: 1.15;">${s.value}</div>
                  <div style="font-family: ${SANS}; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #faf7f2; margin-top: 6px;">${s.label}</div>
                  <div style="font-family: ${SANS}; font-size: 12px; color: rgba(250, 247, 242, 0.68); margin-top: 4px; line-height: 1.5;">${s.note}</div>
                </div>`,
            )
            .join('')}
        </div>`
      : '';

  return `<div style="background-color: #1e1412; color: #faf7f2; border: 1px solid #3a2923; padding: 36px 32px; border-radius: 2px; box-shadow: 0 12px 30px rgba(26, 22, 18, 0.08);">
  <div style="font-family: ${SANS}; font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #c5a880; margin-bottom: 10px;">${eyebrow}</div>
  <h3 style="font-family: ${SERIF}; font-size: 30px; font-weight: 400; color: #faf7f2; line-height: 1.15; margin: 0 0 12px 0;">${headline}</h3>
  <p style="font-family: ${SANS}; font-size: 14.5px; font-weight: 300; color: rgba(250, 247, 242, 0.84); line-height: 1.75; margin: 0; max-width: 720px;">${lead}</p>
  ${statsHtml}
</div>`;
};

const romanCardsGrid = (
  cards: Array<{
    numeral: string;
    tag: string;
    title: string;
    body: string;
    footnote?: string;
    accentColor?: string;
  }>,
): string => `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
  ${cards
    .map((c) => {
      const accent = c.accentColor || '#c5a880';
      return `<div style="background-color: #fffefb; border: 1px solid #e8e0d4; border-top: 2px solid ${accent}; padding: 26px 24px; box-shadow: 0 8px 24px rgba(26, 22, 18, 0.04); display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <span style="font-family: ${SERIF}; font-size: 24px; font-style: italic; color: ${accent};">${c.numeral}</span>
          <span style="font-family: ${SANS}; font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #9c7c45;">${c.tag}</span>
        </div>
        <h3 style="font-family: ${SERIF}; font-size: 23px; font-weight: 400; color: #1e1412; line-height: 1.2; margin: 0 0 10px 0;">${c.title}</h3>
        <p style="font-family: ${SANS}; font-size: 13.5px; font-weight: 300; color: #4f463e; line-height: 1.7; margin: 0;">${c.body}</p>
      </div>
      ${
        c.footnote
          ? `<div style="margin-top: 18px; padding-top: 12px; border-top: 1px solid #f0eae0; font-family: ${SANS}; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #9c7c45;">${c.footnote}</div>`
          : ''
      }
    </div>`;
    })
    .join('')}
</div>`;

const stepGridFour = (
  steps: Array<{ number: string; title: string; body: string }>,
): string => `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px;">
  ${steps
    .map(
      (st) => `<div style="background-color: #fffefb; border: 1px solid #e8e0d4; padding: 22px 20px;">
      <div style="font-family: ${SANS}; font-size: 10.5px; font-weight: 700; letter-spacing: 0.2em; color: #9c7c45; margin-bottom: 8px;">STEP ${st.number}</div>
      <h4 style="font-family: ${SERIF}; font-size: 21px; font-weight: 500; color: #1e1412; line-height: 1.25; margin: 0 0 8px 0;">${st.title}</h4>
      <p style="font-family: ${SANS}; font-size: 13px; font-weight: 300; color: #4f463e; line-height: 1.65; margin: 0;">${st.body}</p>
    </div>`,
    )
    .join('')}
</div>`;

const closingCtaBand = (
  eyebrow: string,
  title: string,
  body: string,
  primaryLabel: string,
  primaryHref: string,
  secondaryLabel: string,
  secondaryHref: string,
): string => `<div style="background-color: #1e1412; color: #faf7f2; padding: 40px 28px; text-align: center; border: 1px solid #3a2923; box-shadow: 0 12px 30px rgba(26, 22, 18, 0.08);">
  <div style="font-family: ${SANS}; font-size: 10px; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: #c5a880; margin-bottom: 12px;">${eyebrow}</div>
  <h3 style="font-family: ${SERIF}; font-size: 32px; font-weight: 400; color: #faf7f2; line-height: 1.15; margin: 0 0 12px 0;">${title}</h3>
  <p style="font-family: ${SANS}; font-size: 14px; font-weight: 300; color: rgba(250, 247, 242, 0.78); line-height: 1.75; margin: 0 auto 24px auto; max-width: 560px;">${body}</p>
  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px;">
    <a href="${primaryHref}" style="display: inline-block; background-color: #c5a880; color: #1e1412; padding: 12px 24px; font-family: ${SANS}; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; text-decoration: none; border: 1px solid #c5a880;">${primaryLabel}</a>
    <a href="${secondaryHref}" style="display: inline-block; background-color: transparent; color: #faf7f2; padding: 12px 24px; font-family: ${SANS}; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; text-decoration: none; border: 1px solid rgba(197, 168, 128, 0.55);">${secondaryLabel}</a>
  </div>
</div>`;

const featuredEditorialCard = (
  eyebrow: string,
  title: string,
  meta: string,
  excerpt: string,
  ctaLabel: string,
  ctaHref: string,
): string => `<div style="background-color: #fffefb; border: 1px solid #e8e0d4; padding: 32px 30px; box-shadow: 0 12px 30px rgba(26, 22, 18, 0.04);">
  <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #f0eae0;">
    <span style="font-family: ${SANS}; font-size: 10px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #9c7c45;">${eyebrow}</span>
    <span style="font-family: ${SANS}; font-size: 11px; color: #7b6f63;">${meta}</span>
  </div>
  <h3 style="font-family: ${SERIF}; font-size: 32px; font-weight: 400; color: #1e1412; line-height: 1.15; margin: 0 0 14px 0;">${title}</h3>
  <p style="font-family: ${SANS}; font-size: 14.5px; font-weight: 300; color: #4f463e; line-height: 1.8; margin: 0 0 22px 0; max-width: 780px;">${excerpt}</p>
  <a href="${ctaHref}" style="display: inline-block; font-family: ${SANS}; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #1e1412; text-decoration: none; border-bottom: 1px solid #c5a880; padding-bottom: 4px;">${ctaLabel}</a>
</div>`;

export function getEditorialTemplateForPage(
  rawSlug: string,
  pageTitle: string,
): EditorialPageTemplate {
  const slug = String(rawSlug || '').trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  const stamp = Date.now();
  const baseStyle: Partial<PageStyleConfig> = {
    bgColor: '#faf7f2',
    textColor: '#1e1412',
    accentColor: '#c5a880',
    headingFont: SERIF,
    bodyFont: SANS,
  };

  if (slug === 'about' || slug === 'about-us') {
    return {
      eyebrow: '',
      title: '',
      subtitle: '',
      fullBleed: true,
      style: {
        bgColor: '#fffefb',
        textColor: '#1a1612',
        accentColor: '#c9a96e',
        headingFont: SERIF,
        bodyFont: SANS,
      },
      blocks: [
        {
          id: `tpl_about_blk_${stamp}_1`,
          type: 'rich',
          cardLabel: '01 · Hero — The House, in Motion',
          heading: '',
          subtitle: '',
          htmlContent: `<div style="background-color: #241d17; background-image: radial-gradient(circle at 50% 30%, rgba(201, 169, 110, 0.09) 0%, transparent 60%), linear-gradient(135deg, #211b15 0%, #342a21 48%, #241e18 100%); color: #fffffb; min-height: min(88vh, 800px); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 32px; text-align: center; border-bottom: 1px solid rgba(201, 169, 110, 0.35); box-sizing: border-box;">
  <div style="width: 100%; max-width: 720px; margin: 0 auto;">
    <div style="display: inline-block; font-family: ${SANS}; font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(201, 169, 110, 0.72); border: 1px solid rgba(201, 169, 110, 0.22); padding: 6px 16px; border-radius: 2px; margin-bottom: 24px;">Coming Soon</div>
    <h1 style="font-family: ${SERIF}; font-weight: 400; font-size: clamp(44px, 7.2vw, 84px); line-height: 1.05; letter-spacing: -0.01em; color: #fffffb; margin: 0 0 22px 0;">The House, <br /><em style="font-style: italic; color: #c9a96e;">in Motion</em></h1>
    <p style="font-family: ${SANS}; font-size: 16px; font-weight: 300; line-height: 1.85; color: rgba(255, 255, 255, 0.62); max-width: 520px; margin: 0 auto 24px auto;">Our brand film is currently in production.<br />A story of cherished beauty, renewed purpose,<br />and garments that deserve more than one life.</p>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 24px; width: 100%; max-width: 620px; margin: 16px auto 12px auto; padding-top: 22px; border-top: 1px solid rgba(201, 169, 110, 0.2); text-align: center;">
      <div>
        <div style="font-family: ${SERIF}; font-size: 17px; color: #f5d77f; font-weight: 600;">100% genuine</div>
        <div style="font-family: ${SANS}; font-size: 11.5px; color: rgba(255, 255, 255, 0.6); margin-top: 4px;">Authenticated before every wear</div>
      </div>
      <div>
        <div style="font-family: ${SERIF}; font-size: 17px; color: #f5d77f; font-weight: 600;">Complimentary care</div>
        <div style="font-family: ${SANS}; font-size: 11.5px; color: rgba(255, 255, 255, 0.6); margin-top: 4px;">Surgically cleaned, always</div>
      </div>
      <div>
        <div style="font-family: ${SERIF}; font-size: 17px; color: #f5d77f; font-weight: 600;">Door to door</div>
        <div style="font-family: ${SANS}; font-size: 11.5px; color: rgba(255, 255, 255, 0.6); margin-top: 4px;">Direct delivery across India</div>
      </div>
    </div>
    <div style="width: 60px; height: 1px; background-image: linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.55), transparent); margin: 22px auto 14px auto;"></div>
    <div style="font-family: ${SANS}; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255, 255, 255, 0.38);">Brand Film — Coming Soon</div>
    <div style="margin-top: 10px;"><a href="#about-the-name" style="font-family: ${SANS}; font-size: 11px; font-style: italic; color: rgba(255, 255, 255, 0.48); text-decoration: none;">Scroll to read the story ↓</a></div>
  </div>
</div>`,
        },
        {
          id: 'about-the-name',
          type: 'tabs',
          cardLabel: '02 · The Name — K A I R A (Interactive)',
          heading: '',
          subtitle: '',
          tabStyle: 'letters',
          introHtml: `<div style="text-align: center; max-width: 680px; margin: 0 auto;">
  <div style="display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 16px;">
    <span style="display: inline-block; width: 40px; height: 1px; background-color: #c9a96e;"></span>
    <span style="font-family: ${SANS}; font-size: 11px; letter-spacing: 0.34em; text-transform: uppercase; color: #c9a96e;">THE NAME</span>
    <span style="display: inline-block; width: 40px; height: 1px; background-color: #c9a96e;"></span>
  </div>
  <h2 style="font-family: ${SERIF}; font-size: clamp(34px, 4.4vw, 52px); font-weight: 400; line-height: 1.15; color: #1a1612; margin: 0 0 16px 0;">Where the story <em style="font-style: italic; color: #c9a96e;">begins</em></h2>
  <p style="font-family: ${SANS}; font-size: 15.5px; font-weight: 300; line-height: 1.8; color: #8a7e72; max-width: 620px; margin: 0 auto;">Every house carries the meaning of its name. Ours carries five letters — and every one of them means something to us. Tap each one.</p>
</div>`,
          tabs: [
            {
              id: `tpl_kaira_k_${stamp}`,
              label: 'K',
              sublabel: 'Keepsake',
              accentColor: '#c9a96e',
              contentHtml: `<div style="text-align: center; padding: 10px 16px;">
  <div style="font-family: ${SERIF}; font-style: italic; font-size: clamp(26px, 3.4vw, 38px); color: #b85c38; margin-bottom: 10px;">Keepsake</div>
  <p style="font-family: ${SANS}; font-size: 15.5px; font-weight: 300; line-height: 1.8; color: #6b5e50; max-width: 560px; margin: 0 auto;">Cherished beauty is worth keeping. We built a home for the pieces too precious to disappear into the back of a cupboard.</p>
</div>`,
            },
            {
              id: `tpl_kaira_a1_${stamp}`,
              label: 'A',
              sublabel: 'Authentic',
              accentColor: '#c9a96e',
              contentHtml: `<div style="text-align: center; padding: 10px 16px;">
  <div style="font-family: ${SERIF}; font-style: italic; font-size: clamp(26px, 3.4vw, 38px); color: #b85c38; margin-bottom: 10px;">Authentic</div>
  <p style="font-family: ${SANS}; font-size: 15.5px; font-weight: 300; line-height: 1.8; color: #6b5e50; max-width: 560px; margin: 0 auto;">Pristine condition guaranteed, verified by master artisans before every wear and documented in detail.</p>
</div>`,
            },
            {
              id: `tpl_kaira_i_${stamp}`,
              label: 'I',
              sublabel: 'Inherited',
              accentColor: '#c9a96e',
              contentHtml: `<div style="text-align: center; padding: 10px 16px;">
  <div style="font-family: ${SERIF}; font-style: italic; font-size: clamp(26px, 3.4vw, 38px); color: #b85c38; margin-bottom: 10px;">Inherited</div>
  <p style="font-family: ${SANS}; font-size: 15.5px; font-weight: 300; line-height: 1.8; color: #6b5e50; max-width: 560px; margin: 0 auto;">Honouring the craft and hand-loomed heritage passed down across celebrations and generations.</p>
</div>`,
            },
            {
              id: `tpl_kaira_r_${stamp}`,
              label: 'R',
              sublabel: 'Revolving',
              accentColor: '#c9a96e',
              contentHtml: `<div style="text-align: center; padding: 10px 16px;">
  <div style="font-family: ${SERIF}; font-style: italic; font-size: clamp(26px, 3.4vw, 38px); color: #b85c38; margin-bottom: 10px;">Revolving</div>
  <p style="font-family: ${SANS}; font-size: 15.5px; font-weight: 300; line-height: 1.8; color: #6b5e50; max-width: 560px; margin: 0 auto;">Giving storied garments a second life and a new audience, keeping exceptional design in continuous motion.</p>
</div>`,
            },
            {
              id: `tpl_kaira_a2_${stamp}`,
              label: 'A',
              sublabel: 'Affection',
              accentColor: '#c9a96e',
              contentHtml: `<div style="text-align: center; padding: 10px 16px;">
  <div style="font-family: ${SERIF}; font-style: italic; font-size: clamp(26px, 3.4vw, 38px); color: #b85c38; margin-bottom: 10px;">Affection</div>
  <p style="font-family: ${SANS}; font-size: 15.5px; font-weight: 300; line-height: 1.8; color: #6b5e50; max-width: 560px; margin: 0 auto;">Personal concierge care, bespoke fitting adjustments, and botanical restoration for every silhouette.</p>
</div>`,
            },
          ],
          footerHtml: `<div style="text-align: center;">
  <p style="font-family: ${SANS}; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #8a7e72; margin: 0 0 36px 0;">Keepsake · Adored · Inherited · Renewed · Always</p>
  <div style="max-width: 660px; margin: 0 auto; padding-top: 40px; border-top: 1px solid #f0eae0;">
    <p style="font-family: ${SERIF}; font-style: italic; font-size: clamp(22px, 2.6vw, 27px); line-height: 1.55; color: #1a1612; margin: 0 0 18px 0;">"To us, <em style="font-style: italic; color: #b85c38;">Kaira</em> means cherished beauty, renewed purpose, and garments that deserve more than one life."</p>
    <p style="font-family: ${SANS}; font-size: 15px; font-weight: 300; line-height: 1.9; color: #6b5e50; max-width: 580px; margin: 0 auto 26px auto;">Beloved. Meaningful. Quietly distinctive. House of Kaira was created as a home for beloved pieces — garments carrying memory, craft, and emotion, reimagined for a longer, more meaningful life.</p>
    <p style="font-family: ${SERIF}; font-style: italic; font-size: 13.5px; line-height: 1.85; color: #8a7e72; max-width: 560px; margin: 0 auto;"><em style="font-style: italic; color: #c9a96e;">The name itself travels widely</em> — Sanskrit for peaceful, unique, a ray of sunlight; Arabic for goodness and purity; <em style="font-style: italic; color: #c9a96e;">Latin carus</em> for beloved; <em style="font-style: italic; color: #c9a96e;">Greek kairos</em> for the right moment. Many languages, it turns out, were already circling the same feeling.</p>
  </div>
</div>`,
        },
        {
          id: `tpl_about_blk_${stamp}_3`,
          type: 'rich',
          cardLabel: '03 · Manifesto',
          heading: '',
          subtitle: '',
          htmlContent: `<div style="background-color: #faf7f2; color: #1a1612; padding: 112px 32px; text-align: center; box-sizing: border-box;">
  <div style="font-family: ${SERIF}; font-size: 84px; line-height: 1; color: #e8d5b0; margin-bottom: 4px;">"</div>
  <blockquote style="font-family: ${SERIF}; font-style: italic; font-weight: 400; font-size: clamp(28px, 3.8vw, 44px); line-height: 1.35; color: #1a1612; max-width: 880px; margin: 0 auto; padding: 0; border-left: none;">Every garment deserves a second standing ovation.</blockquote>
  <p style="font-family: ${SANS}; font-size: 16px; font-weight: 300; line-height: 1.9; color: #6b5e50; max-width: 660px; margin: 36px auto 0 auto;">We don't sell clothes — we give them somewhere to go next. A lehenga that watched one wedding doesn't retire after it. It waits, carefully kept, for its next entrance.</p>
</div>`,
        },
        {
          id: `tpl_about_blk_${stamp}_4`,
          type: 'rich',
          cardLabel: '04 · What We Believe — Philosophy',
          heading: '',
          subtitle: '',
          htmlContent: `<div style="background-color: #1a1612; color: #fffefb; padding: 112px 32px; box-sizing: border-box;">
  <div style="text-align: center; max-width: 640px; margin: 0 auto 64px auto;">
    <div style="display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 16px;">
      <span style="display: inline-block; width: 40px; height: 1px; background-color: #c9a96e;"></span>
      <span style="font-family: ${SANS}; font-size: 11px; letter-spacing: 0.34em; text-transform: uppercase; color: #e8d5b0;">What We Believe</span>
      <span style="display: inline-block; width: 40px; height: 1px; background-color: #c9a96e;"></span>
    </div>
    <h2 style="font-family: ${SERIF}; font-size: clamp(32px, 4vw, 48px); font-weight: 400; line-height: 1.15; color: #fffefb; margin: 0;">Four ideas we will <em style="font-style: italic; color: #e8d5b0;">never</em> compromise on</h2>
  </div>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1px; background-color: rgba(255, 255, 255, 0.08); max-width: 1180px; margin: 0 auto;">
    <div style="background-color: #1a1612; padding: 40px 28px;">
      <div style="margin-bottom: 24px;">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L14.4 9.2H22L16 13.6L18.3 20.7L12 16.3L5.7 20.7L8 13.6L2 9.2H9.6L12 2Z" /></svg>
      </div>
      <h3 style="font-family: ${SERIF}; font-size: 21px; font-weight: 400; line-height: 1.3; color: #fffefb; margin: 0 0 14px 0;">Celebration, <em style="font-style: italic; color: #e8d5b0;">not ownership</em></h3>
      <p style="font-family: ${SANS}; font-size: 13.5px; font-weight: 300; line-height: 1.8; color: #b8aa9a; margin: 0;">You don't need to own a moment to live it fully. Wear the showstopper for the night it was made for, then let it move on to someone else's celebration.</p>
    </div>
    <div style="background-color: #1a1612; padding: 40px 28px;">
      <div style="margin-bottom: 24px;">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V6A2 2 0 0 1 6 4H18A2 2 0 0 1 20 6V19.5" /><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20" /><path d="M9 7H15" /><path d="M9 11H15" /></svg>
      </div>
      <h3 style="font-family: ${SERIF}; font-size: 21px; font-weight: 400; line-height: 1.3; color: #fffefb; margin: 0 0 14px 0;">Curation, <em style="font-style: italic; color: #e8d5b0;">not catalogue</em></h3>
      <p style="font-family: ${SANS}; font-size: 13.5px; font-weight: 300; line-height: 1.8; color: #b8aa9a; margin: 0;">Every piece is chosen, not just accepted. If it doesn't meet our standard of craft and condition, it doesn't make it onto House of Kaira — no exceptions.</p>
    </div>
    <div style="background-color: #1a1612; padding: 40px 28px;">
      <div style="margin-bottom: 24px;">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12A9 9 0 1 0 5.6 5.7" /><path d="M3 4.5V9H7.5" /></svg>
      </div>
      <h3 style="font-family: ${SERIF}; font-size: 21px; font-weight: 400; line-height: 1.3; color: #fffefb; margin: 0 0 14px 0;">Turnaround, <em style="font-style: italic; color: #e8d5b0;">not warehouse</em></h3>
      <p style="font-family: ${SANS}; font-size: 13.5px; font-weight: 300; line-height: 1.8; color: #b8aa9a; margin: 0;">Pieces belong on women at celebrations, not resting in dark boxes. Fast dispatch, fast cleaning, and pieces back on the rack within 48 hours.</p>
    </div>
    <div style="background-color: #1a1612; padding: 40px 28px;">
      <div style="margin-bottom: 24px;">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19C3.5 16 6 13.8 9 13.8S14.5 16 14.5 19" /><circle cx="18" cy="9" r="2.4" /><path d="M15.8 13.6C18.1 16 17.9 17.8 20 18.2" /></svg>
      </div>
      <h3 style="font-family: ${SERIF}; font-size: 21px; font-weight: 400; line-height: 1.3; color: #fffefb; margin: 0 0 14px 0;">Care, <em style="font-style: italic; color: #e8d5b0;">first always</em></h3>
      <p style="font-family: ${SANS}; font-size: 13.5px; font-weight: 300; line-height: 1.8; color: #b8aa9a; margin: 0;">A lehenga returns from a wedding with memories, and sometimes turmeric. Our Indore atelier treats every fabric with museum grade attention before it departs again.</p>
    </div>
  </div>
</div>`,
        },
        {
          id: `tpl_about_blk_${stamp}_5`,
          type: 'tabs',
          cardLabel: '05 · Two Sides, One Wardrobe — Duality (Interactive)',
          heading: '',
          subtitle: '',
          tabStyle: 'pill',
          introHtml: `<div style="text-align: center; max-width: 640px; margin: 0 auto;">
  <div style="display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 16px;">
    <span style="display: inline-block; width: 40px; height: 1px; background-color: #c9a96e;"></span>
    <span style="font-family: ${SANS}; font-size: 11px; letter-spacing: 0.34em; text-transform: uppercase; color: #c9a96e;">Two Sides, One Wardrobe</span>
    <span style="display: inline-block; width: 40px; height: 1px; background-color: #c9a96e;"></span>
  </div>
  <h2 style="font-family: ${SERIF}; font-size: clamp(32px, 4vw, 48px); font-weight: 400; line-height: 1.15; color: #1a1612; margin: 0;">Whichever side of the <em style="font-style: italic; color: #c9a96e;">story</em> you're on</h2>
</div>`,
          tabs: [
            {
              id: `tpl_dual_renter_${stamp}`,
              label: "I'm celebrating",
              accentColor: '#1a1612',
              contentHtml: `<div style="max-width: 760px; margin: 0 auto; text-align: center; padding: 20px 16px 8px;">
  <p style="font-family: ${SERIF}; font-style: italic; font-size: 24px; color: #b85c38; margin: 0 0 18px 0;">For the bride, the groom, the guest of honour</p>
  <p style="font-family: ${SANS}; font-size: 16px; font-weight: 300; line-height: 1.9; color: #6b5e50; max-width: 640px; margin: 0 auto 28px auto;">Maybe it's your wedding. Maybe it's your best friend's. Whatever the occasion, you deserve a piece worthy of it — without it living in your cupboard for the other 364 days of the year. Rent it, buy it preloved, or buy it new: House of Kaira holds every option to the same standard, exceptional design, honestly presented, beautifully delivered.</p>
  <a href="/main-page" style="display: inline-block; background-color: #1a1612; color: #fffefb; padding: 14px 30px; font-family: ${SANS}; font-size: 11px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none; border-radius: 2px;">Start Browsing →</a>
</div>`,
            },
            {
              id: `tpl_dual_lister_${stamp}`,
              label: "I'm giving it new life",
              accentColor: '#6b7e5a',
              contentHtml: `<div style="max-width: 760px; margin: 0 auto; text-align: center; padding: 20px 16px 8px;">
  <p style="font-family: ${SERIF}; font-style: italic; font-size: 24px; color: #6b7e5a; margin: 0 0 18px 0;">For the keeper of something beautiful</p>
  <p style="font-family: ${SANS}; font-size: 16px; font-weight: 300; line-height: 1.9; color: #6b5e50; max-width: 640px; margin: 0 auto 28px auto;">Somewhere in your wardrobe is a lehenga that gave you the best night of your life, and has done nothing since. List it with House of Kaira and let it earn its place again, or sell it on, with full transparency, careful handling, and a payout you can trust. Your only job is to say yes. We handle the rest.</p>
  <a href="/list-your-piece" style="display: inline-block; background-color: #6b7e5a; color: #fffefb; padding: 14px 30px; font-family: ${SANS}; font-size: 11px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none; border-radius: 2px;">List Your Piece →</a>
</div>`,
            },
          ],
        },
        {
          id: `tpl_about_blk_${stamp}_6`,
          type: 'rich',
          cardLabel: '06 · From The Founder — Soumya',
          heading: '',
          subtitle: '',
          htmlContent: `<div style="background-color: #1a1612; color: #fffefb; padding: 112px 32px; box-sizing: border-box;">
  <div style="display: flex; flex-wrap: wrap; gap: 64px; max-width: 1100px; margin: 0 auto; align-items: flex-start;">
    <div style="width: 240px; margin: 0 auto; text-align: center; flex-shrink: 0;">
      <div style="width: 200px; height: 200px; margin: 0 auto 22px auto; border-radius: 50%; border: 1px solid rgba(201, 169, 110, 0.35); display: flex; align-items: center; justify-content: center;">
        <div style="width: 172px; height: 172px; border-radius: 50%; border: 1px solid rgba(201, 169, 110, 0.18); display: flex; align-items: center; justify-content: center;">
          <span style="font-family: ${SERIF}; font-size: 78px; font-style: italic; color: #e8d5b0; line-height: 1;">S</span>
        </div>
      </div>
      <div style="font-family: ${SERIF}; font-size: 19px; font-style: italic; color: #fffefb;">Soumya</div>
      <div style="font-family: ${SANS}; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #8a7a6a; margin-top: 6px;">Founder, House of Kaira</div>
    </div>
    <div style="flex: 1; min-width: 280px;">
      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
        <span style="display: inline-block; width: 40px; height: 1px; background-color: #e8d5b0;"></span>
        <span style="font-family: ${SANS}; font-size: 11px; letter-spacing: 0.34em; text-transform: uppercase; color: #e8d5b0;">From The Founder</span>
        <span style="display: inline-block; width: 40px; height: 1px; background-color: #e8d5b0;"></span>
      </div>
      <h2 style="font-family: ${SERIF}; font-size: clamp(28px, 3.4vw, 40px); font-weight: 400; line-height: 1.25; color: #fffefb; margin: 0 0 28px 0;">Why I started <em style="font-style: italic; color: #e8d5b0;">House of Kaira</em></h2>
      <p style="font-family: ${SANS}; font-size: 15.5px; font-weight: 300; line-height: 1.95; color: #c9bcac; margin: 0 0 20px 0;">Before I trained my eye on lehengas, I was trained to read a balance sheet.</p>
      <p style="font-family: ${SANS}; font-size: 15.5px; font-weight: 300; line-height: 1.95; color: #c9bcac; margin: 0 0 20px 0;">Three years as a chartered accountant teach you to ask one question about anything of value: is it being used? An asset sitting idle, however expensive, is a number nobody wants to explain. When I left finance for a fashion business degree at the London College of Fashion, that question simply followed me into a new industry.</p>
      <p style="font-family: ${SANS}; font-size: 15.5px; font-weight: 300; line-height: 1.95; color: #c9bcac; margin: 0 0 20px 0;">A bridal lehenga in India can cost as much as a small car, and is, more often than anyone likes to admit, worn exactly once. It doesn't stop being beautiful after the wedding. It just runs out of places to go.</p>
      <p style="font-family: ${SANS}; font-size: 15.5px; font-weight: 300; line-height: 1.95; color: #c9bcac; margin: 0;">House of Kaira is the place I built for that lehenga to go next — a home for cherished beauty and renewed purpose, exactly the way the name was meant to be read. Some things are simply too beautiful to only get to live once.</p>
      <div style="margin-top: 28px;">
        <p style="font-family: ${SERIF}; font-style: italic; font-size: 19px; color: #e8d5b0; margin: 0;">Soumya</p>
        <p style="font-family: ${SANS}; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #8a7a6a; margin: 6px 0 0 0;">Founder, House of Kaira</p>
      </div>
    </div>
  </div>
</div>`,
        },
        {
          id: `tpl_about_blk_${stamp}_7`,
          type: 'rich',
          cardLabel: '07 · Why We Built It — Circular Orbit',
          heading: '',
          subtitle: '',
          htmlContent: `<div style="background-color: #fffefb; color: #1a1612; padding: 112px 32px; box-sizing: border-box;">
  <div style="display: flex; flex-wrap: wrap; gap: 56px; align-items: center; max-width: 1200px; margin: 0 auto;">
    <div style="flex: 1; min-width: 280px; text-align: center;">
      <svg viewBox="0 0 400 400" width="400" height="400" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">
        <circle cx="200" cy="200" r="178" fill="none" stroke="#F0EAE0" stroke-width="1" />
        <circle cx="200" cy="200" r="148" fill="none" stroke="#EAE1D2" stroke-width="1" stroke-dasharray="2 7" />
        <circle cx="200" cy="200" r="92" fill="#FFFEFB" stroke="#C9A96E" stroke-width="1" />
        <circle cx="200" cy="200" r="80" fill="none" stroke="#E8D5B0" stroke-width="1" />
        <circle cx="200" cy="200" r="2.5" fill="#C9A96E" />
        <text x="200" y="194" text-anchor="middle" dominant-baseline="central" fill="#1A1612" style="font-family: ${SERIF}; font-size: 20px; font-style: italic;">House</text>
        <text x="200" y="214" text-anchor="middle" dominant-baseline="central" fill="#C9A96E" style="font-family: ${SERIF}; font-size: 20px; font-style: italic;">of Kaira</text>
        <circle cx="200" cy="52" r="44" fill="#FFFEFB" stroke="#B85C38" stroke-width="1.4" />
        <text x="200" y="54" text-anchor="middle" dominant-baseline="central" fill="#B85C38" style="font-family: ${SANS}; font-size: 10.5px; letter-spacing: 0.35em;">RENT</text>
        <circle cx="72" cy="274" r="44" fill="#FFFEFB" stroke="#C9A96E" stroke-width="1.4" />
        <text x="72" y="268" text-anchor="middle" dominant-baseline="central" fill="#A6843E" style="font-family: ${SANS}; font-size: 9.5px; letter-spacing: 0.25em;">PRE</text>
        <text x="72" y="284" text-anchor="middle" dominant-baseline="central" fill="#A6843E" style="font-family: ${SANS}; font-size: 9.5px; letter-spacing: 0.25em;">LOVED</text>
        <circle cx="328" cy="274" r="44" fill="#FFFEFB" stroke="#6B7E5A" stroke-width="1.4" />
        <text x="328" y="268" text-anchor="middle" dominant-baseline="central" fill="#6B7E5A" style="font-family: ${SANS}; font-size: 9.5px; letter-spacing: 0.25em;">LIST</text>
        <text x="328" y="284" text-anchor="middle" dominant-baseline="central" fill="#6B7E5A" style="font-family: ${SANS}; font-size: 9.5px; letter-spacing: 0.25em;">&amp; SELL</text>
      </svg>
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 18px;">
        <a href="/main-page?section=rent" style="display: inline-block; padding: 6px 14px; border: 1px solid #e8d5b0; border-radius: 20px; font-family: ${SANS}; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #b85c38; text-decoration: none;">Rent →</a>
        <a href="/main-page?section=preloved" style="display: inline-block; padding: 6px 14px; border: 1px solid #e8d5b0; border-radius: 20px; font-family: ${SANS}; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #9c7c45; text-decoration: none;">Preloved →</a>
        <a href="/list-your-piece" style="display: inline-block; padding: 6px 14px; border: 1px solid #e8d5b0; border-radius: 20px; font-family: ${SANS}; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #6b7e5a; text-decoration: none;">List &amp; Sell →</a>
      </div>
    </div>
    <div style="flex: 1; min-width: 280px;">
      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
        <span style="display: inline-block; width: 40px; height: 1px; background-color: #c9a96e;"></span>
        <span style="font-family: ${SANS}; font-size: 11px; letter-spacing: 0.34em; text-transform: uppercase; color: #c9a96e;">Why We Built It</span>
        <span style="display: inline-block; width: 40px; height: 1px; background-color: #c9a96e;"></span>
      </div>
      <h2 style="font-family: ${SERIF}; font-size: clamp(30px, 3.6vw, 46px); font-weight: 400; line-height: 1.22; color: #1a1612; margin: 0 0 26px 0;">Circularity is the mechanism. <br /><em style="font-style: italic; color: #6b7e5a;">Joy</em> is the point.</h2>
      <p style="font-family: ${SANS}; font-size: 15.5px; font-weight: 300; line-height: 1.9; color: #6b5e50; margin: 0 0 18px 0;">India's luxury occasion wear market is enormous, deeply emotional, and almost entirely linear. Garments are bought, worn once, and forgotten. Craftsmanship worth lakhs sits folded away in boxes that are never reopened.</p>
      <p style="font-family: ${SANS}; font-size: 15.5px; font-weight: 300; line-height: 1.9; color: #6b5e50; margin: 0 0 18px 0;">We didn't build House of Kaira to lecture anyone about sustainability. We built it because there is something genuinely joyful about slipping into a lehenga that has already danced through three weddings, and still carries the quiet energy of every room it has been in.</p>
      <p style="font-family: ${SANS}; font-size: 15.5px; font-weight: 300; line-height: 1.9; color: #6b5e50; margin: 0;">Circularity is just the mechanism here. Properly done, it isn't a compromise, it's the most respectful thing you can do for a garment made with that much care.</p>
    </div>
  </div>
</div>`,
        },
        {
          id: `tpl_about_blk_${stamp}_8`,
          type: 'rich',
          cardLabel: '08 · Three Ways to Belong',
          heading: '',
          subtitle: '',
          htmlContent: `<div style="background-color: #faf7f2; color: #1a1612; padding: 112px 32px; box-sizing: border-box;">
  <div style="text-align: center; max-width: 620px; margin: 0 auto 56px auto;">
    <div style="display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 16px;">
      <span style="display: inline-block; width: 40px; height: 1px; background-color: #c9a96e;"></span>
      <span style="font-family: ${SANS}; font-size: 11px; letter-spacing: 0.34em; text-transform: uppercase; color: #c9a96e;">How It Works</span>
      <span style="display: inline-block; width: 40px; height: 1px; background-color: #c9a96e;"></span>
    </div>
    <h2 style="font-family: ${SERIF}; font-size: clamp(32px, 4vw, 48px); font-weight: 400; line-height: 1.15; color: #1a1612; margin: 0 0 16px 0;">Three ways to belong to the story</h2>
    <p style="font-family: ${SANS}; font-size: 15.5px; font-weight: 300; line-height: 1.8; color: #8a7e72; max-width: 540px; margin: 0 auto;">Every door leads to the same standard: curated pieces, honest condition, and a process built to feel as good as the clothes look.</p>
  </div>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 28px; max-width: 1080px; margin: 0 auto;">
    <div style="background-color: #fffefb; border-top: 3px solid #b85c38; padding: 44px 32px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 26px;">
          <span style="font-family: ${SERIF}; font-style: italic; font-size: 20px; color: #c9a96e;">I</span>
          <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background-color: #b85c38; margin-top: 6px;"></span>
        </div>
        <h3 style="font-family: ${SERIF}; font-size: 23px; font-weight: 400; color: #1a1612; margin: 0 0 14px 0;">Rent</h3>
        <p style="font-family: ${SERIF}; font-style: italic; font-size: 18px; line-height: 1.45; color: #1a1612; margin: 0 0 16px 0;">For the night that deserves everything, and not a single thing more.</p>
        <p style="font-family: ${SANS}; font-size: 13px; font-weight: 300; line-height: 1.8; color: #8a7e72; margin: 0 0 24px 0;">Wear the showstopper. Send it back. No upkeep, no clutter, no compromise.</p>
      </div>
      <a href="/main-page?section=rent" style="font-family: ${SANS}; font-size: 10.5px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: #1a1612; text-decoration: none;">Explore Rentals →</a>
    </div>
    <div style="background-color: #fffefb; border-top: 3px solid #c9a96e; padding: 44px 32px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 26px;">
          <span style="font-family: ${SERIF}; font-style: italic; font-size: 20px; color: #c9a96e;">II</span>
          <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background-color: #c9a96e; margin-top: 6px;"></span>
        </div>
        <h3 style="font-family: ${SERIF}; font-size: 23px; font-weight: 400; color: #1a1612; margin: 0 0 14px 0;">Buy Preloved</h3>
        <p style="font-family: ${SERIF}; font-style: italic; font-size: 18px; line-height: 1.45; color: #1a1612; margin: 0 0 16px 0;">A piece doesn't lose its story when it changes hands. It gains yours.</p>
        <p style="font-family: ${SANS}; font-size: 13px; font-weight: 300; line-height: 1.8; color: #8a7e72; margin: 0 0 24px 0;">Inspected, disclosed honestly, and priced like the treasure it already is.</p>
      </div>
      <a href="/main-page?section=preloved" style="font-family: ${SANS}; font-size: 10.5px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: #1a1612; text-decoration: none;">Shop Preloved →</a>
    </div>
    <div style="background-color: #fffefb; border-top: 3px solid #6b7e5a; padding: 44px 32px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 26px;">
          <span style="font-family: ${SERIF}; font-style: italic; font-size: 20px; color: #c9a96e;">III</span>
          <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background-color: #6b7e5a; margin-top: 6px;"></span>
        </div>
        <h3 style="font-family: ${SERIF}; font-size: 23px; font-weight: 400; color: #1a1612; margin: 0 0 14px 0;">List Your Piece</h3>
        <p style="font-family: ${SERIF}; font-style: italic; font-size: 18px; line-height: 1.45; color: #1a1612; margin: 0 0 16px 0;">Your wardrobe's finest shouldn't spend its life in the dark.</p>
        <p style="font-family: ${SANS}; font-size: 13px; font-weight: 300; line-height: 1.8; color: #8a7e72; margin: 0 0 24px 0;">We take care of every detail — cleaning, insurance, delivery, and payments.</p>
      </div>
      <a href="/list-your-piece" style="font-family: ${SANS}; font-size: 10.5px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: #1a1612; text-decoration: none;">Become a Lister →</a>
    </div>
  </div>
  <p style="text-align: center; font-family: ${SERIF}; font-style: italic; font-size: 14px; color: #8a7e72; margin: 40px 0 0 0;">A fourth way, Buy New, joins the house soon.</p>
</div>`,
        },
        {
          id: `tpl_about_blk_${stamp}_9`,
          type: 'rich',
          cardLabel: '09 · Closing CTA',
          heading: '',
          subtitle: '',
          htmlContent: `<div style="background-color: #1a1612; background-image: radial-gradient(circle at 50% 0%, rgba(201, 169, 110, 0.14), transparent 60%); color: #fffefb; padding: 112px 32px; text-align: center; box-sizing: border-box;">
  <div style="max-width: 720px; margin: 0 auto;">
    <h2 style="font-family: ${SERIF}; font-size: clamp(34px, 5vw, 56px); font-weight: 400; line-height: 1.18; color: #fffefb; margin: 0 0 24px 0;">Your piece's <em style="font-style: italic; color: #e8d5b0;">next chapter</em> starts here.</h2>
    <p style="font-family: ${SANS}; font-size: 16px; font-weight: 300; line-height: 1.85; color: #b8aa9a; max-width: 520px; margin: 0 auto 44px auto;">Whether you're here to wear something unforgettable or to give something unforgettable a second life, there's a place for you at House of Kaira.</p>
    <div style="display: flex; flex-wrap: wrap; gap: 16px; justify-content: center;">
      <a href="/main-page" style="display: inline-block; background-color: #c9a96e; color: #1a1612; padding: 16px 34px; font-family: ${SANS}; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 500; text-decoration: none; border-radius: 2px; border: 1px solid #c9a96e;">Explore The Collection</a>
      <a href="/list-your-piece" style="display: inline-block; background-color: transparent; color: #fffefb; padding: 16px 34px; font-family: ${SANS}; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 500; text-decoration: none; border-radius: 2px; border: 1px solid rgba(255, 255, 255, 0.3);">List Your Piece</a>
    </div>
    <div style="margin-top: 48px; font-family: ${SANS}; font-size: 12.5px; color: #8a7a6a;">Follow our story at <a href="https://instagram.com/house_of_kaira" target="_blank" rel="noopener noreferrer" style="color: #e8d5b0; text-decoration: none; border-bottom: 1px solid rgba(232, 213, 176, 0.35);">@house_of_kaira</a></div>
  </div>
</div>`,
        },
      ],
    };
  }

  if (slug === 'press') {
    return {
      eyebrow: 'PRESS & MEDIA',
      title: 'In the press, and in conversation',
      subtitle:
        'Editorial coverage, brand backgrounders, founder notes and high-resolution press assets from our house in Indore.',
      style: baseStyle,
      blocks: [
        {
          id: `tpl_press_blk_${stamp}_1`,
          type: 'rich',
          cardLabel: '01 · Brand Fact Sheet',
          heading: 'About House of Kaira for editors & journalists',
          subtitle: 'Verified company context, editorial focus and archival standards at a glance.',
          htmlContent: darkBanner(
            'MEDIA BACKGROUNDER',
            'A curated home for heirloom Indian occasionwear — rented, rehomed and stewarded with care.',
            'Founded in Indore, House of Kaira authenticates, cleans, insures and circulates couture lehengas, sarees and sherwanis across India so treasured craft stays in motion rather than stored away.',
            [
              { value: '100%', label: 'Authenticated Pieces', note: 'Every garment inspected in-house before listing' },
              { value: 'Door-to-Door', label: 'Insured Logistics', note: 'Delivered pressed in signature garment boxes' },
              { value: '3 Doors', label: 'Rent · Preloved · List', note: 'Built for circularity without compromise' },
            ],
          ),
        },
        {
          id: `tpl_press_blk_${stamp}_2`,
          type: 'rich',
          cardLabel: '02 · Selected Coverage & Mentions',
          heading: 'Recent editorial features',
          subtitle: 'Selected stories and conversations on luxury circularity and celebratory dressing.',
          htmlContent: romanCardsGrid([
            {
              numeral: 'I',
              tag: 'Circular Couture',
              title: 'Why heirloom Indian wardrobes are entering circulation',
              body: 'How brides, families and collectors are balancing archival craftsmanship with thoughtful temporary access for wedding seasons.',
              footnote: 'Feature Profile · Autumn 2026',
              accentColor: '#9c7c45',
            },
            {
              numeral: 'II',
              tag: 'Atelier & Care',
              title: 'Inside House of Kaira’s white-glove garment stewardship',
              body: 'From museum-grade tissue wrapping to multi-point authentication and bespoke sizing checks between every celebration.',
              footnote: 'Craft Dispatch · Summer 2026',
              accentColor: '#c5a880',
            },
            {
              numeral: 'III',
              tag: 'Founder Conversation',
              title: 'Designing luxury trust outside metro flagships',
              body: 'A closer look at why our Indore atelier serves clients nationwide with transparent pricing, escrow payouts and insured transit.',
              footnote: 'Leadership Interview · Spring 2026',
              accentColor: '#6f7c68',
            },
          ]),
        },
        {
          id: `tpl_press_blk_${stamp}_3`,
          type: 'table',
          cardLabel: '03 · Press Kit & Media Contacts',
          heading: 'Press kit & desk directory',
          subtitle: 'Direct channels for interviews, editorial loans, photography requests and brand approvals.',
          columnsCount: 2,
          col1Header: 'Details & Turnaround',
          rows: [
            {
              id: `tpl_press_row_${stamp}_1`,
              label: 'Media & Interview Desk',
              col1Title: 'concierge@houseofkiara.com',
              col1Note: 'Use subject line "PRESS ENQUIRY" — typical editorial response within 24 hours.',
            },
            {
              id: `tpl_press_row_${stamp}_2`,
              label: 'Editorial Pulls & Shoot Loans',
              col1Title: '5 business days advance notice',
              col1Note: 'Insured dispatch from Indore for print, digital lookbooks and campaign styling.',
            },
            {
              id: `tpl_press_row_${stamp}_3`,
              label: 'Brand Assets & Imagery',
              col1Title: 'High-resolution logo suite & lookbook stills',
              col1Note: 'Supplied in print-ready TIFF/PNG formats with photographer credits upon request.',
            },
          ],
        },
        {
          id: `tpl_press_blk_${stamp}_4`,
          type: 'faq',
          cardLabel: '04 · Press FAQs',
          heading: 'Questions from journalists & stylists',
          subtitle: 'Quick answers before reaching out to our communications team.',
          items: [
            {
              id: `tpl_press_faq_${stamp}_1`,
              question: 'How do stylists request garments for editorial shoots?',
              badgeText: 'Shoot Loans',
              badgeTone: 'neutral',
              answerHtml:
                '<p>Write to our concierge team with your publication brief, shoot dates, moodboard and credit commitments. Once confirmed, pieces are dispatched in insured garment boxes.</p>',
            },
            {
              id: `tpl_press_faq_${stamp}_2`,
              question: 'Are founder or curator interviews available on deadline?',
              badgeText: 'Same Week',
              badgeTone: 'good',
              answerHtml:
                '<p>Yes. Share your deadline and topic focus and we will schedule a phone, video or written commentary turnaround accordingly.</p>',
            },
            {
              id: `tpl_press_faq_${stamp}_3`,
              question: 'Can media publish House of Kaira photography without prior clearance?',
              badgeText: 'Credit Required',
              badgeTone: 'caution',
              answerHtml:
                '<p>Editorial use is welcome alongside supplied credit captions. Commercial or syndicated reuse requires written approval from our press desk.</p>',
            },
          ],
        },
        {
          id: `tpl_press_blk_${stamp}_5`,
          type: 'rich',
          cardLabel: '05 · Media Enquiry CTA',
          heading: '',
          subtitle: '',
          htmlContent: closingCtaBand(
            'EDITORIAL DESK',
            'Working on a story or styling pull?',
            'Reach our team directly for verified figures, press imagery, founder commentary or garment loans.',
            'Contact Press Desk',
            '/contact-us',
            'Read Our Story',
            '/about-us',
          ),
        },
      ],
    };
  }

  if (slug === 'designer-partners') {
    return {
      eyebrow: 'DESIGNER & BOUTIQUE PARTNERSHIPS',
      title: 'A thoughtful second chapter for archive couture',
      subtitle:
        'We partner with designers, flagship ateliers and multi-brand boutiques to unlock revenue from sample archives and past-season couture while protecting brand equity.',
      style: baseStyle,
      blocks: [
        {
          id: `tpl_dp_blk_${stamp}_1`,
          type: 'rich',
          cardLabel: '01 · Partnership Philosophy',
          heading: 'Designed to protect the integrity of your label',
          subtitle: 'Every archive garment is curated, photographed and stewarded at flagship luxury standards.',
          htmlContent: romanCardsGrid([
            {
              numeral: 'I',
              tag: 'Brand Stewardship',
              title: 'Zero discounting dilution',
              body: 'Pieces sit inside an editorial environment built for provenance and craftsmanship — never clearance racks or flash markdown bins.',
              footnote: 'Atelier Pricing Respect',
              accentColor: '#9c7c45',
            },
            {
              numeral: 'II',
              tag: 'White-Glove Operations',
              title: 'Specialised care & restoration',
              body: 'Every rental return is inspected by hand, delicately refreshed using craft-safe methods and insured throughout transit.',
              footnote: 'Full Condition Ledger',
              accentColor: '#c5a880',
            },
            {
              numeral: 'III',
              tag: 'Transparent Revenue',
              title: 'Earn across rental or resale',
              body: 'Monetise runway samples, trunk-show pieces and quiet archive inventory with clear payout statements after every order.',
              footnote: 'Monthly Atelier Settlement',
              accentColor: '#6f7c68',
            },
          ]),
        },
        {
          id: `tpl_dp_blk_${stamp}_2`,
          type: 'table',
          cardLabel: '02 · Partnership Models',
          heading: 'Choose how your atelier collaborates',
          subtitle: 'Flexible structures tailored for sample archives, flagship boutiques and bridal couture houses.',
          columnsCount: 3,
          col1Header: 'Archive Consignment',
          col2Header: 'Curated Rental Capsule',
          rows: [
            {
              id: `tpl_dp_row_${stamp}_1`,
              label: 'Best Suited For',
              col1Title: 'Showroom samples & one-of-a-kind couture',
              col1Note: 'Ideal for past-season statement pieces ready for permanent rehoming.',
              col2Title: 'Seasonal edits & bridal occasionwear',
              col2Note: 'Keep ownership while earning recurring yield per celebration wear.',
            },
            {
              id: `tpl_dp_row_${stamp}_2`,
              label: 'Curation & Imaging',
              col1Title: 'Handled completely by House of Kaira',
              col1Note: 'Studio photography, measurement charting and label authentication included.',
              col2Title: 'Co-approved editorial presentation',
              col2Note: 'Designer credit and craft notes featured prominently on every product page.',
            },
            {
              id: `tpl_dp_row_${stamp}_3`,
              label: 'Insurance & Recall',
              col1Title: 'Insured vault custody until sold',
              col1Note: 'Recall unsold inventory anytime with advance notice.',
              col2Title: 'Comprehensive rental protection & recall option',
              col2Note: 'Pause dates or recall pieces whenever your house needs them.',
            },
          ],
        },
        {
          id: `tpl_dp_blk_${stamp}_3`,
          type: 'rich',
          cardLabel: '03 · Four-Step Onboarding',
          heading: 'How partnership onboarding works',
          subtitle: 'From initial lookbook review to live curation on the storefront.',
          htmlContent: stepGridFour([
            {
              number: '01',
              title: 'Share Your Edit',
              body: 'Send a line sheet, showroom shortlist or sample list with retail values and sizes.',
            },
            {
              number: '02',
              title: 'Select Partnership Mode',
              body: 'Decide between rental yield, preloved consignment or a blended archive capsule.',
            },
            {
              number: '03',
              title: 'Insured Intake & QA',
              body: 'Our team coordinates insured pickup, fabric inspection, steaming and measurement logs.',
            },
            {
              number: '04',
              title: 'Launch & Earn',
              body: 'Pieces go live with full designer attribution and transparent settlement reports.',
            },
          ]),
        },
        {
          id: `tpl_dp_blk_${stamp}_4`,
          type: 'faq',
          cardLabel: '04 · Partner FAQs',
          heading: 'Common questions from designer houses',
          subtitle: 'Operational clarity before committing archive inventory.',
          items: [
            {
              id: `tpl_dp_faq_${stamp}_1`,
              question: 'Does House of Kaira alter partnered couture permanently?',
              badgeText: 'Zero Permanent Cuts',
              badgeTone: 'good',
              answerHtml:
                '<p>No. Only temporary, reversible basting stitches are permitted when needed for fit, preserving original embroidery and seam allowances intact.</p>',
            },
            {
              id: `tpl_dp_faq_${stamp}_2`,
              question: 'How is accidental wear or stain damage handled on rental capsules?',
              badgeText: 'Protected',
              badgeTone: 'neutral',
              answerHtml:
                '<p>Every booking includes routine specialist cleaning, and our security deposit & repair framework covers unforeseen damage recovery without burdening the partner.</p>',
            },
            {
              id: `tpl_dp_faq_${stamp}_3`,
              question: 'Can a boutique recall a sample piece for a trunk show or VIP fitting?',
              badgeText: 'Flexible Recall',
              badgeTone: 'good',
              answerHtml:
                '<p>Yes. Partner ateliers can block calendar dates ahead of time or request recall outside confirmed customer bookings.</p>',
            },
          ],
        },
        {
          id: `tpl_dp_blk_${stamp}_5`,
          type: 'rich',
          cardLabel: '05 · Partner Enquiry CTA',
          heading: '',
          subtitle: '',
          htmlContent: closingCtaBand(
            'ATELIER PARTNERSHIPS',
            'Start a conversation with our curation desk',
            'Share a short note about your label or archive inventory and our partnerships lead will respond with bespoke terms.',
            'Submit Partner Enquiry',
            '/contact-us',
            'Review Seller Standards',
            '/seller-guidelines',
          ),
        },
      ],
    };
  }

  if (slug === 'sustainability') {
    return {
      eyebrow: 'CIRCULAR LUXURY',
      title: 'Made to be worn more than once',
      subtitle:
        'Indian craftsmanship takes hundreds of artisan hours. Keeping heirloom garments circulating across celebrations honours both the craft and the planet.',
      style: baseStyle,
      blocks: [
        {
          id: `tpl_sus_blk_${stamp}_1`,
          type: 'rich',
          cardLabel: '01 · Circular Manifesto',
          heading: 'Extending the working life of couture',
          subtitle: 'Every celebration wear reduces idle wardrobe waste while preserving hand embroidery value.',
          htmlContent: darkBanner(
            'HOUSE COMMITMENT',
            'When one lehenga celebrates ten weddings instead of one, artisanal craft thrives without overproduction.',
            'Luxury occasionwear is made from silks, organzas and handworked zardozi too precious to sit behind cedar doors after four hours of wear. Our stewardship loop extends each garment’s active chapters cleanly.',
            [
              { value: 'Multiple Lives', label: 'Shared Stewardship', note: 'One curated piece serves many celebrations' },
              { value: 'Eco-Safe Care', label: 'Specialist Cleaning', note: 'Spot-treated per fabric rather than harsh bulk washes' },
              { value: 'Reusable Boxes', label: 'Mindful Transit', note: 'Acid-free tissue & breathable cotton garment bags' },
            ],
          ),
        },
        {
          id: `tpl_sus_blk_${stamp}_2`,
          type: 'rich',
          cardLabel: '02 · Three Pillars of Circular Craft',
          heading: 'How we practice sustainability without compromise',
          subtitle: 'Practical standards across authentication, cleaning chemistry and reverse logistics.',
          htmlContent: romanCardsGrid([
            {
              numeral: 'I',
              tag: 'Garment Longevity',
              title: 'Artisanal repair before replacement',
              body: 'Loose sequins, delicate hooks and hems are mended by skilled karigars in our Indore studio so minor wear never retires a masterpiece early.',
              footnote: 'In-House Restoration',
              accentColor: '#9c7c45',
            },
            {
              numeral: 'II',
              tag: 'Mindful Chemistry',
              title: 'Fabric-specific botanical cleaning',
              body: 'We match cleaning protocols to silk weight, gota patti work and vegetable dyes — avoiding harsh solvents that weaken natural fibres.',
              footnote: 'Craft-Safe Stewardship',
              accentColor: '#6f7c68',
            },
            {
              numeral: 'III',
              tag: 'Circular Ownership',
              title: 'Seamless shift from rental to forever home',
              body: 'When pieces retire from active rotation, they transition transparently into our preloved edit for lifelong collectors.',
              footnote: 'Zero Deadstock Policy',
              accentColor: '#c5a880',
            },
          ]),
        },
        {
          id: `tpl_sus_blk_${stamp}_3`,
          type: 'table',
          cardLabel: '03 · Care & Packaging Standards',
          heading: 'Our packaging & cleaning standards ledger',
          subtitle: 'Every shipment follows consistent low-waste and fabric-safe handling checkpoints.',
          columnsCount: 2,
          col1Header: 'House Standard',
          rows: [
            {
              id: `tpl_sus_row_${stamp}_1`,
              label: 'Garment Bags & Tissue',
              col1Title: '100% breathable cotton bags & acid-free tissue',
              col1Note: 'Keeps zari tarnish-free and replaces single-use polythene covers.',
            },
            {
              id: `tpl_sus_row_${stamp}_2`,
              label: 'Outer Dispatch Boxes',
              col1Title: 'Rigid returnable presentation cartons',
              col1Note: 'Engineered to travel safely through multiple round-trip bookings before recycling.',
            },
            {
              id: `tpl_sus_row_${stamp}_3`,
              label: 'Water & Solvent Care',
              col1Title: 'Targeted steam & specialist dry processing',
              col1Note: 'Minimises unnecessary full-garment immersion between wears.',
            },
          ],
        },
        {
          id: `tpl_sus_blk_${stamp}_4`,
          type: 'faq',
          cardLabel: '04 · Sustainability FAQs',
          heading: 'Questions about our circular standards',
          subtitle: 'How rental, hygiene and sustainability work hand in hand.',
          items: [
            {
              id: `tpl_sus_faq_${stamp}_1`,
              question: 'Is every rented piece hygienically sanitised without damaging delicate zari?',
              badgeText: 'Atelier Cleaned',
              badgeTone: 'good',
              answerHtml:
                '<p>Yes. Each garment undergoes targeted stain inspection, odour-neutralising steam sanitisation and delicate dry cleaning tailored to its weave before sealing for the next booking.</p>',
            },
            {
              id: `tpl_sus_faq_${stamp}_2`,
              question: 'Do listers need to ship in special eco packaging?',
              badgeText: 'Provided Free',
              badgeTone: 'good',
              answerHtml:
                '<p>No. Once your submission is accepted, our logistics team handles reusable outer protection and in-house storage prep.</p>',
            },
            {
              id: `tpl_sus_faq_${stamp}_3`,
              question: 'What happens to a garment once it finishes its rental cycle?',
              badgeText: 'Rehomed',
              badgeTone: 'neutral',
              answerHtml:
                '<p>Depending on the lister’s preference, the piece is either returned to them freshly pressed or offered for permanent sale in our curated preloved collection.</p>',
            },
          ],
        },
        {
          id: `tpl_sus_blk_${stamp}_5`,
          type: 'rich',
          cardLabel: '05 · Explore the House CTA',
          heading: '',
          subtitle: '',
          htmlContent: closingCtaBand(
            'KEEP LUXURY IN MOTION',
            'Wear a story, or give yours a new chapter',
            'Explore curated rentals, shop authenticated preloved treasures or list the piece waiting in your wardrobe.',
            'Browse Collection',
            '/main-page?section=rent',
            'List Your Piece',
            '/list-your-piece',
          ),
        },
      ],
    };
  }

  if (slug === 'careers') {
    return {
      eyebrow: 'CAREERS AT HOUSE OF KAIRA',
      title: 'Build the future of Indian luxury circularity',
      subtitle:
        'We are a small, craft-obsessed team across curation, garment care, client styling and engineering — working from Indore with clients across India.',
      style: baseStyle,
      blocks: [
        {
          id: `tpl_car_blk_${stamp}_1`,
          type: 'rich',
          cardLabel: '01 · Life at the House',
          heading: 'High ownership, calm craft and genuine hospitality',
          subtitle: 'What we value across every role in our atelier and digital team.',
          htmlContent: `${darkBanner(
            'OUR CULTURE',
            'Respect for craft, clarity in words and meticulous care in every detail.',
            'At House of Kaira, software engineers sit close to garment curators, stylists and restoration specialists. Every team member shares one standard: never leave a bride, host or lister guessing.',
          )}<div style="height: 18px;"></div>${romanCardsGrid([
            {
              numeral: 'I',
              tag: 'Curation Eye',
              title: 'Obsess over provenance & detail',
              body: 'Whether inspecting handwork seams or polishing checkout flows, quiet craft defines how our house feels.',
              accentColor: '#9c7c45',
            },
            {
              numeral: 'II',
              tag: 'Client Trust',
              title: 'Plain honesty beats polish',
              body: 'We disclose garment condition openly, set realistic delivery promises and solve problems before anyone has to chase.',
              accentColor: '#c5a880',
            },
            {
              numeral: 'III',
              tag: 'Builder Ownership',
              title: 'Small team, real responsibility',
              body: 'No layers of approval — you see the direct impact of your work on real weddings, listers and pieces.',
              accentColor: '#6f7c68',
            },
          ])}`,
        },
        {
          id: `tpl_car_blk_${stamp}_2`,
          type: 'table',
          cardLabel: '02 · Open Roles',
          heading: 'Current openings across the house',
          subtitle: 'Update role titles, locations or status directly here whenever hiring opens or closes.',
          columnsCount: 3,
          col1Header: 'Location & Type',
          col2Header: 'What You Will Own',
          rows: [
            {
              id: `tpl_car_row_${stamp}_1`,
              label: 'Client Stylist & Occasion Concierge',
              col1Title: 'Indore Studio / Hybrid · Full-time',
              col1Note: 'Wedding season appointments & WhatsApp fittings',
              col2Title: 'Personalised garment recommendations & sizing guidance',
              col2Note: 'Deep familiarity with Indian designers & silhouettes preferred.',
            },
            {
              id: `tpl_car_row_${stamp}_2`,
              label: 'Authentication & Garment Care Lead',
              col1Title: 'Indore Atelier · Full-time',
              col1Note: 'On-site inspection & dispatch vault',
              col2Title: 'Intake verification, condition grading & restoration',
              col2Note: 'Prior couture tailoring or luxury QC background valued.',
            },
            {
              id: `tpl_car_row_${stamp}_3`,
              label: 'Operations & Logistics Coordinator',
              col1Title: 'Indore · Full-time',
              col1Note: 'Pan-India courier & return calendar',
              col2Title: 'Timely round-trip dispatches, insured tracking & turnarounds',
              col2Note: 'Strong spreadsheet/admin precision and calm problem solving.',
            },
          ],
        },
        {
          id: `tpl_car_blk_${stamp}_3`,
          type: 'faq',
          cardLabel: '03 · Hiring Process FAQs',
          heading: 'How hiring works at House of Kaira',
          subtitle: 'What to expect after sending us your note.',
          items: [
            {
              id: `tpl_car_faq_${stamp}_1`,
              question: 'Can I apply even if my role is not listed above?',
              badgeText: 'Open Applications',
              badgeTone: 'good',
              answerHtml:
                '<p>Yes. If you love Indian couture, operations, editorial photography or product engineering, send a concise note with examples of your past work.</p>',
            },
            {
              id: `tpl_car_faq_${stamp}_2`,
              question: 'How many interview rounds do you typically run?',
              badgeText: '2–3 Conversations',
              badgeTone: 'neutral',
              answerHtml:
                '<p>Usually an introductory conversation, one practical exercise relevant to the role and a final chat with our leadership team in Indore.</p>',
            },
            {
              id: `tpl_car_faq_${stamp}_3`,
              question: 'Do you offer styling or merchandising internships?',
              badgeText: 'Seasonal',
              badgeTone: 'neutral',
              answerHtml:
                '<p>Yes, especially ahead of autumn-winter bridal seasons. Mention your availability window in your message.</p>',
            },
          ],
        },
        {
          id: `tpl_car_blk_${stamp}_4`,
          type: 'rich',
          cardLabel: '04 · Open Application CTA',
          heading: '',
          subtitle: '',
          htmlContent: closingCtaBand(
            'JOIN OUR TEAM',
            'Think you belong at House of Kaira?',
            'Send your CV, portfolio or a short note introducing what you want to build with us.',
            'Apply via Contact Desk',
            '/contact-us',
            'Learn About the House',
            '/about-us',
          ),
        },
      ],
    };
  }

  if (slug === 'blog') {
    return {
      eyebrow: 'THE KAIRA JOURNAL',
      title: 'Notes on craft, occasionwear & dressing well',
      subtitle:
        'Essays, bridal wardrobe guides, fabric care handbooks and stories behind the designers and pieces inside House of Kaira.',
      style: baseStyle,
      blocks: [
        {
          id: `tpl_blog_blk_${stamp}_1`,
          type: 'rich',
          cardLabel: '01 · Featured Editorial Story',
          heading: 'Featured read from the house',
          subtitle: 'Our flagship guide for navigating wedding invitations with ease and intention.',
          htmlContent: featuredEditorialCard(
            'FEATURED ESSAY · WARDROBE ARCHITECTURE',
            'How to plan a five-function wedding wardrobe without buying five heavy lehengas',
            '6 min read · Styling & Occasionwear',
            'From daytime haldi florals to midnight sangeet silhouettes, discover how mixing one heirloom investment with curated rental statements lets every ceremony feel distinct — while keeping your wardrobe uncluttered long after the celebrations end.',
            'Explore Occasion Rentals',
            '/main-page?section=rent',
          ),
        },
        {
          id: `tpl_blog_blk_${stamp}_2`,
          type: 'rich',
          cardLabel: '02 · Latest Dispatches',
          heading: 'Recent notes from our curators',
          subtitle: 'Edit titles, summaries and reading times right below as new journal pieces go live.',
          htmlContent: romanCardsGrid([
            {
              numeral: 'I',
              tag: 'Fabric Handbook',
              title: 'How to store silk zardozi lehengas safely through humid monsoons',
              body: 'Why muslin bags breathe better than plastic sleeves, how often to refold creases and when to air embroidery away from direct sun.',
              footnote: 'Care & Preservation · 4 min read',
              accentColor: '#9c7c45',
            },
            {
              numeral: 'II',
              tag: 'Lister Stories',
              title: 'Giving a sangeet lehenga three more celebrations across India',
              body: 'What motivates brides to share treasured pieces with fellow families while turning quiet closet value into meaningful returns.',
              footnote: 'Community Note · 5 min read',
              accentColor: '#c5a880',
            },
            {
              numeral: 'III',
              tag: 'Measurement Guide',
              title: 'Reading garment fit notes when booking designer wear online',
              body: 'Understanding blouse margins, lehenga waist ease and temporary tacking before your piece leaves our Indore atelier.',
              footnote: 'Fit & Sizing · 3 min read',
              accentColor: '#6f7c68',
            },
          ]),
        },
        {
          id: `tpl_blog_blk_${stamp}_3`,
          type: 'table',
          cardLabel: '03 · Editorial Topics & Guides',
          heading: 'Explore the journal archive by theme',
          subtitle: 'Handy reference guides connected directly to shopping and garment care.',
          columnsCount: 2,
          col1Header: 'What You Will Find',
          rows: [
            {
              id: `tpl_blog_row_${stamp}_1`,
              label: 'Wedding Guest & Bridal Guides',
              col1Title: 'Seasonal dress codes, silhouette pairings & packing lists',
              col1Note: 'Curated roundups tailored for destination and palace weddings.',
            },
            {
              id: `tpl_blog_row_${stamp}_2`,
              label: 'Craft & Textile Spotlights',
              col1Title: 'Closer looks at Indian weaves, handwork & heritage designers',
              col1Note: 'Notes on zardozi, chikankari, bandhani, gota patti and silk provenance.',
            },
            {
              id: `tpl_blog_row_${stamp}_3`,
              label: 'Renting & Listing Playbooks',
              col1Title: 'Practical tips for smooth bookings, care & payouts',
              col1Note: 'Step-by-step checklists built with our concierge & quality teams.',
            },
          ],
        },
        {
          id: `tpl_blog_blk_${stamp}_4`,
          type: 'faq',
          cardLabel: '04 · Journal & Submissions FAQs',
          heading: 'About The Kaira Journal',
          subtitle: 'Questions from readers and contributing writers.',
          items: [
            {
              id: `tpl_blog_faq_${stamp}_1`,
              question: 'Can brides or designers share real wedding stories for The Journal?',
              badgeText: 'Submissions Welcome',
              badgeTone: 'good',
              answerHtml:
                '<p>Yes! If you wore or listed a House of Kaira piece at a celebration, write to our concierge team with photos and a brief story.</p>',
            },
            {
              id: `tpl_blog_faq_${stamp}_2`,
              question: 'Are featured pieces available to rent or buy directly?',
              badgeText: 'Shop the Story',
              badgeTone: 'neutral',
              answerHtml:
                '<p>Most silhouettes featured in our seasonal dispatches link straight to live rental or preloved availability, subject to your celebration dates.</p>',
            },
          ],
        },
        {
          id: `tpl_blog_blk_${stamp}_5`,
          type: 'rich',
          cardLabel: '05 · Pitch a Story CTA',
          heading: '',
          subtitle: '',
          htmlContent: closingCtaBand(
            'THE KAIRA JOURNAL',
            'Have a celebration story or craft essay in mind?',
            'Reach out to our editorial desk or explore new arrivals waiting for their next occasion.',
            'Contact Editorial Team',
            '/contact-us',
            'Explore New Arrivals',
            '/main-page?section=new',
          ),
        },
      ],
    };
  }

  const safeTitle = escapeHtml(String(pageTitle || 'Custom Page').trim());
  const cleanTitleRaw = String(pageTitle || 'Custom Page').trim();

  return {
    eyebrow: 'HOUSE OF KAIRA',
    title: cleanTitleRaw,
    subtitle: `Everything you need to know about ${cleanTitleRaw} — presented with clarity, craft and transparent standards from House of Kaira.`,
    style: baseStyle,
    blocks: [
      {
        id: `tpl_gen_blk_${stamp}_1`,
        type: 'rich',
        cardLabel: '01 · Overview & Highlights',
        heading: `Understanding ${cleanTitleRaw}`,
        subtitle: 'Edit any card, stat or headline directly inside this rich editor.',
        htmlContent: `${darkBanner(
          'HOUSE OVERVIEW',
          `${safeTitle}, explained simply from the start.`,
          `Use this opening band to introduce ${safeTitle} in plain language so every visitor immediately understands what it offers and how House of Kaira handles every detail.`,
          [
            { value: '100%', label: 'Authenticated', note: 'Verified quality before every dispatch' },
            { value: 'Insured', label: 'Door-to-Door', note: 'Tracked transit in signature garment boxes' },
            { value: 'Concierge', label: 'Dedicated Care', note: 'Support before, during and after every occasion' },
          ],
        )}<div style="height: 18px;"></div>${romanCardsGrid([
          {
            numeral: 'I',
            tag: 'Pillar One',
            title: 'Curated to luxury standards',
            body: 'Replace this text with the first key pillar, benefit or editorial highlight for this page.',
            accentColor: '#9c7c45',
          },
          {
            numeral: 'II',
            tag: 'Pillar Two',
            title: 'Clear terms, no surprises',
            body: 'Replace this text with the second highlight — pricing transparency, care or process details.',
            accentColor: '#c5a880',
          },
          {
            numeral: 'III',
            tag: 'Pillar Three',
            title: 'Backed by our Indore atelier',
            body: 'Replace this text with the third highlight — specialist support, turnaround time or guarantee.',
            accentColor: '#6f7c68',
          },
        ])}`,
      },
      {
        id: `tpl_gen_blk_${stamp}_2`,
        type: 'table',
        cardLabel: '02 · Key Details',
        heading: `${cleanTitleRaw} at a glance`,
        subtitle: 'Add, rename or remove rows as needed for your structured summary.',
        columnsCount: 2,
        col1Header: 'Details & Notes',
        rows: [
          {
            id: `tpl_gen_row_${stamp}_1`,
            label: 'Availability',
            col1Title: 'Available across India',
            col1Note: 'Customise this detail with timings, eligibility or service hours.',
          },
          {
            id: `tpl_gen_row_${stamp}_2`,
            label: 'Turnaround Time',
            col1Title: 'Handled promptly by our team',
            col1Note: 'Add expected response windows or preparation timelines here.',
          },
          {
            id: `tpl_gen_row_${stamp}_3`,
            label: 'Support Channel',
            col1Title: 'Concierge & Email Assistance',
            col1Note: 'Direct enquiries answered Monday to Saturday, 10 AM – 7 PM IST.',
          },
        ],
      },
      {
        id: `tpl_gen_blk_${stamp}_3`,
        type: 'faq',
        cardLabel: '03 · Frequently Asked Questions',
        heading: `Common questions about ${cleanTitleRaw}`,
        subtitle: 'Expandable answers visitors can click cleanly on desktop and mobile.',
        items: [
          {
            id: `tpl_gen_faq_${stamp}_1`,
            question: `How does ${cleanTitleRaw} work with House of Kaira?`,
            badgeText: 'Overview',
            badgeTone: 'neutral',
            answerHtml:
              '<p>Edit this answer with clear step-by-step details tailored to your visitors.</p>',
          },
          {
            id: `tpl_gen_faq_${stamp}_2`,
            question: 'Who can I contact for personalised help?',
            badgeText: 'Same Day Reply',
            badgeTone: 'good',
            answerHtml:
              '<p>Write to our concierge team via the Contact Us page or reach out directly on WhatsApp for tailored assistance.</p>',
          },
        ],
      },
      {
        id: `tpl_gen_blk_${stamp}_4`,
        type: 'rich',
        cardLabel: '04 · Closing CTA',
        heading: '',
        subtitle: '',
        htmlContent: closingCtaBand(
          'HOUSE OF KAIRA',
          'Questions or ready to explore?',
          'Connect with our concierge team or browse curated designer wear for your upcoming celebration.',
          'Contact Concierge',
          '/contact-us',
          'Browse Rentals',
          '/main-page?section=rent',
        ),
      },
    ],
  };
}
