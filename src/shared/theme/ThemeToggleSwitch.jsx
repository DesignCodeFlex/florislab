import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import "./ThemeToggleSwitch.css";

export default function ThemeToggleSwitch({ id }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "다크 모드" : "라이트 모드"}
      onClick={toggleTheme}
      className={`theme-switch ${isDark ? "dark" : "light"}`}
    >
      <span className="switch-track">
        <span className="track-icon left">
          <Sun size={18} />
        </span>
        <span className="track-icon right">
          <Moon size={16} />
        </span>

        <span className="switch-thumb">
          {isDark ? (
            <>
              <Moon size={16} />
              <span className="switch-label">Dark</span>
            </>
          ) : (
            <>
              <Sun size={18} />
              <span className="switch-label">Light</span>
            </>
          )}
        </span>
      </span>
    </button>
  );
}
