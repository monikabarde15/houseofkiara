// src/components/Notifications/components/Pill.tsx
import React from 'react';
import './styles/Pill.css';

export type BandTone = 'hot' | 'warm' | 'them' | 'know';

interface CountPillProps {
  kind: 'count';
  /** band tone, or 'ok' for a clear-row zero (§9.3), or 'dim' for the blocked em dash (§9.5) */
  tone: BandTone | 'ok' | 'dim';
  children: React.ReactNode;
}

interface TagPillProps {
  kind: 'tag';
  /** 'new' (§8.7 new tag) or 'picked' (§8.7 picked-up tag) */
  variant: 'new' | 'picked';
  children: React.ReactNode;
}

interface BadgePillProps {
  kind: 'badge';
  /** the sidebar count badge (§1.3) or the top-bar bell badge (§1.4) */
  children: React.ReactNode;
  hidden?: boolean;
}

interface LabelPillProps {
  kind: 'label';
  /** "worked in {place}" or "not counted" (§8.4) */
  children: React.ReactNode;
}

interface StripPillProps {
  kind: 'strip';
  tone: BandTone;
  clickable?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

type PillProps = CountPillProps | TagPillProps | BadgePillProps | LabelPillProps | StripPillProps;

/**
 * The shared small-pill shape used across the whole module. Deliberately one
 * component with a discriminated `kind` rather than five separate ones,
 * since every variant below is "a small rounded label with a band colour" —
 * §2.3's six hard-coded state colours are the only literals any of them use.
 */
export function Pill(props: PillProps) {
  switch (props.kind) {
    case 'count':
      return <span className={`ntf-n ntf-n--${props.tone}`}>{props.children}</span>;

    case 'tag':
      return (
        <span className={props.variant === 'new' ? 'ntf-newtag' : 'ntf-pickedtag'}>
          {props.children}
        </span>
      );

    case 'badge':
      return (
        <span className="ntf-badge" style={props.hidden ? { display: 'none' } : undefined}>
          {props.children}
        </span>
      );

    case 'label':
      return <span className="ntf-el">{props.children}</span>;

    case 'strip': {
      if (props.clickable) {
        return (
          <button
            type="button"
            className={`ntf-strip-pill ntf-strip-pill--${props.tone} go`}
            onClick={props.onClick}
          >
            {props.children}
          </button>
        );
      }
      return <span className={`ntf-strip-pill ntf-strip-pill--${props.tone}`}>{props.children}</span>;
    }
  }
}