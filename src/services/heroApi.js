import defaultHeroData from "../data/home/heroData";

export async function fetchHeroData() {
  try {
    const res = await fetch("/api/homepage/hero");
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn("Could not load Hero data from API, using default fallback:", err);
  }
  return null;
}

export { defaultHeroData };
