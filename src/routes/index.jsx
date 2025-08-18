import { BrowserRouter, Routes, Route } from "react-router-dom";

// 랜딩
import LandingLayout from "@landing/layouts/LandingLayout";
import LandingHome from "@landing/pages/LandingHome";

// 어드민
import AdminRouter from "./adminRouter";

// 유저
import UserRouter from "./userRouter";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 랜딩 */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingHome />} />
        </Route>

        {/* 어드민 */}
        <Route path="/admin/*" element={<AdminRouter />} />

        {/* 유저 */}
        <Route path="/user/*" element={<UserRouter />} />
      </Routes>
    </BrowserRouter>
  );
}
