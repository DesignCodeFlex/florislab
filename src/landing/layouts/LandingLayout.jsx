import { Outlet } from "react-router-dom";
import { useTheme } from "@shared/theme/ThemeProvider";
import Button from "@shared/components/Button";
export default function LandingLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landingRoot" style={{ padding: 20 }}>
      <h2>Landing Layout</h2>
      <p>Theme: {theme}</p>
      <Button variant="outline" onClick={toggleTheme}>
        Toggle Theme
      </Button>
      <Outlet />
    </div>
  );
}
