import { useTheme } from "@shared/theme/ThemeProvider";
import "@admin/styles/page.css";
import ThemeToggleSwitch from "@shared/theme/ThemeToggleSwitch";
export default function AdminLogin() {
  const { theme } = useTheme();

  return (
    <div className="loginContainer">
      <div className="loginWrap">
        <h1>Floris Lab</h1>
        <h2>플로리스 랩, 계절의 꽃을 배우다</h2>
        <p>theme: {theme}</p>

        <ThemeToggleSwitch id="theme-toggle" />
      </div>
    </div>
  );
}
