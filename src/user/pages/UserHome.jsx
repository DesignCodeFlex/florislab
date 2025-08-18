import { useTheme } from "@shared/theme/ThemeProvider";
import Button from "@shared/components/Button";
export default function UserHome() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <p>Theme: {theme}</p>
      <Button variant="outline" onClick={toggleTheme}>
        Toggle Theme
      </Button>
    </>
  );
}
