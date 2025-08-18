// import { useTheme } from "@shared/theme/ThemeProvider";
import { useNavigate } from "react-router-dom";

export default function LandingHome() {
  // const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h1>Landing</h1>
      {/* <p>theme: {theme}</p>
      <button onClick={toggleTheme} style={{ marginRight: 10 }}>
        Toggle Theme
      </button> */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => navigate("/admin")} style={{ marginRight: 10 }}>
          관리자 페이지로
        </button>
        <button onClick={() => navigate("/user")} style={{ marginRight: 10 }}>
          사용자 페이지로
        </button>
      </div>
    </div>
  );
}
