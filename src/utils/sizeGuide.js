export function openSizeGuide(setOpenSections) {
  if (typeof setOpenSections === "function") {
    setOpenSections((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      return list.includes("size") ? list : [...list, "size"];
    });
  }
  requestAnimationFrame(() => {
    const nodes = Array.from(document.querySelectorAll("[data-size-guide]"));
    const target =
      nodes.find((el) => el.offsetParent !== null) || nodes[0];
    if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}
