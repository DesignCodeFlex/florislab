import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "@admin/layouts/Header";
import BottomNavigation from "./BottomNavigation";
import ToastProvider from "@admin/components/modals/ToastProvider";
import "@admin/styles/layouts.css";

import { Home, Clipboard, UsersRound, MessageSquare, Bolt } from "lucide-react";

const NAV_CONFIG = {
  icons: {
    home: Home,
    clipboard: Clipboard,
    users: UsersRound,
    message: MessageSquare,
    bolt: Bolt,
  },
  items: [
    { key: "home", label: "홈", to: "/admin/home" },
    { key: "clipboard", label: "워크샵", to: "/admin/workshop" },
    { key: "users", label: "신청자", to: "/admin/applicant" },
    { key: "message", label: "메시지", to: "/admin/message" },
    { key: "bolt", label: "설정", to: "/admin/setting" },
  ],
};
const AUTH_KEY = "fl.auth";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authed = !!sessionStorage.getItem(AUTH_KEY);
    if (!authed) {
      // 주소 직입 접근 차단: 원래 가려던 경로를 state.from에 담아 보냄
      const from = location.pathname + location.search;
      navigate("/admin/login", { replace: true, state: { from } });
    }
  }, [location.pathname, location.search, navigate]);

  return (
    <ToastProvider>
      <div className="adminRoot">
        <Header navConfig={NAV_CONFIG} />
        <div className="adminWrap">
          <Outlet />
        </div>
        <BottomNavigation navConfig={NAV_CONFIG} />
      </div>
    </ToastProvider>
  );
}
