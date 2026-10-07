/**
 * House of Kaira - Care Verdict Tag Component (Component C9)
 * Section 5.9 of Build Specification 2.0
 */

import React from "react";

export default function CareVerdictTag({ tag }) {
  if (!tag || !tag.label) return null;

  const colorClass =
    tag.type === "sage"
      ? "v-yes"
      : tag.type === "gold"
      ? "v-mid"
      : tag.type === "terracotta"
      ? "v-no"
      : "v-mid";

  return <span className={`vd ${colorClass}`}>{tag.label}</span>;
}
