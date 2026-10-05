// src/components/Notifications/components/Chip.tsx
import React from "react";
import "./styles/Chip.css";

interface PersonChipProps {
  kind: "person";
  label: string;
  count: number;
  /** true when this person is carrying at least one item (§6.4 green fill) */
  carrying: boolean;
  /** true when this is the "nobody yet" chip (§6.4) */
  isNobody?: boolean;
  /** true when this chip is the active narrowing selection (§28.5) */
  selected?: boolean;
  onClick: () => void;
}

interface DashboardChipProps {
  kind: "dashboard";
  count: number;
  /** alert title, already forced to lower case (§13.2) */
  label: string;
  onClick: () => void;
}

type ChipProps = PersonChipProps | DashboardChipProps;

/**
 * Shared clickable chip shape. Person chips (§6.4, §28.5) and the Dashboard
 * strip's alert chips (§13.2) look different (invert-on-hover vs.
 * ring-on-select) but are the same interaction: a small pill that narrows
 * or navigates on click.
 */
export function Chip(props: ChipProps) {
  if (props.kind === "person") {
    const classes = [
      "ntf-who",
      props.isNobody ? "ntf-who--none" : props.carrying ? "ntf-who--on" : "",
      props.selected ? "ntf-who--sel" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        type="button"
        className={classes}
        onClick={props.onClick}
        title={
          props.isNobody
            ? "Show only what nobody has picked up"
            : `Show only what ${props.label} is carrying`
        }
      >
        {props.label} <b>{props.count}</b>
      </button>
    );
  }

  // dashboard chip
  return (
    <button type="button" className="ntf-chip" onClick={props.onClick}>
      <b>{props.count}</b> {props.label}
    </button>
  );
}
