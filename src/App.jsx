import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import ThemeProvider from "@shared/theme/ThemeProvider";

import LandingLayout from "@landing/layouts/LandingLayout";
import LandingHome from "@landing/pages/LandingHome";

import AdminRouter from "@routes/adminRoutes";
import UserRouter from "@routes/userRoutes";

/** 라우트 스코프: 랜딩 테마 */
function LandingThemeScope() {
  return (
    <ThemeProvider storageKey="landing-theme">
      <Outlet />
    </ThemeProvider>
  );
}

/** 라우트 스코프: 어드민 테마 (로그인 포함 /admin 전체 공유) */
function AdminThemeScope() {
  return (
    <ThemeProvider storageKey="admin-theme">
      <Outlet />
    </ThemeProvider>
  );
}

/** 라우트 스코프: 유저 테마 */
function UserThemeScope() {
  return (
    <ThemeProvider storageKey="user-theme">
      <Outlet />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 랜딩: 테마 스코프 -> 레이아웃 -> 홈 */}
        <Route element={<LandingThemeScope />}>
          <Route element={<LandingLayout />}>
            <Route path="/" element={<LandingHome />} />
          </Route>
        </Route>

        {/* 어드민: 테마 스코프 한 번만 (AdminLayout 유무와 무관하게 /admin 전체에 적용) */}
        <Route element={<AdminThemeScope />}>
          <Route path="/admin/*" element={<AdminRouter />} />
        </Route>

        {/* 유저: 테마 스코프 한 번만 */}
        <Route element={<UserThemeScope />}>
          <Route path="/user/*" element={<UserRouter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
