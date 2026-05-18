import { useEffect, useState } from "react";

const THEME_KEY = "smart-leads-theme";

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => window.localStorage.getItem(THEME_KEY) === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return {
    isDark,
    toggleDarkMode: () => setIsDark((current) => !current)
  };
};
