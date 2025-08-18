/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import "./theme.css";

const ThemeContext = createContext(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

export default function ThemeProvider({ children, storageKey = "theme" }) {
  const [theme, setTheme] = useState(() => {
    // 로컬스토리지에서 저장된 값 불러오기 (없으면 light)
    const saved = localStorage.getItem(storageKey);
    return saved || "light";
  });

  useEffect(() => {
    // 로컬스토리지 저장
    localStorage.setItem(storageKey, theme);
    // HTML data-theme 속성 변경
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, storageKey]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
