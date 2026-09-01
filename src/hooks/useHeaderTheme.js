import { useEffect, useState } from "react";

const useHeaderTheme = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const darkSections =
      document.querySelectorAll(
        '[data-header-theme="dark"]'
      );

    if (!darkSections.length) return;

    const observer =
      new IntersectionObserver(
        (entries) => {
          const hasDarkSectionVisible =
            entries.some(
              (entry) =>
                entry.isIntersecting
            );

          setTheme(
            hasDarkSectionVisible
              ? "dark"
              : "light"
          );
        },
        {
          threshold: 0.25,
        }
      );

    darkSections.forEach((section) =>
      observer.observe(section)
    );

    return () => observer.disconnect();
  }, []);

  return theme;
};

export default useHeaderTheme;