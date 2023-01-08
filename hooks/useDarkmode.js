import { useEffect, useState } from "react";

export default function useDarkMode() {
  // get theme from storage.
  const defaultTheme =
    (typeof window !== "undefined" && localStorage.getItem("color-theme")) ||
    "light";
  // enable dark mode.
  const [theme, setTheme] = useState(defaultTheme);
  useEffect(() => {
    const checkNativeTheme = (e) => {
      if (e.matches) {
        setTheme("dark");
        localStorage.setItem("color-theme", "dark");
        document.documentElement.setAttribute("color-theme", "dark");
      } else {
        setTheme("light");
        localStorage.setItem("color-theme", "light");
        document.documentElement.setAttribute("color-theme", "light");
      }
    };

    const match =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const color = match ? "dark" : "light";
    setTheme(color);
    localStorage.setItem("color-theme", color);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", checkNativeTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("color-theme", theme);
  }, [theme]);

  return theme;
}
