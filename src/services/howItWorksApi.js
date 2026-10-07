import defaultHowItWorksData from "../data/home/howItWorksData";

export async function fetchHowItWorksData() {
  try {
    const res = await fetch("/api/homepage/how-it-works");
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn("Could not load How It Works data from API, using default fallback:", err);
  }
  return null;
}

export { defaultHowItWorksData };
