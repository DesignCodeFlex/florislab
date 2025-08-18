import { Outlet } from "react-router-dom";
import Header from "@admin/layouts/Header";
import BottomNavigation from "./BottomNavigation";
import ToastProvider from "@admin/components/modals/ToastProvider";
import ConfirmProvider from "@admin/components/modals/ConfirmProvider";
import "@admin/styles/layout.css";

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

export default function AdminLayout() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <div className="adminRoot">
          <Header navConfig={NAV_CONFIG} />
          <div className="adminWrap">
            <div className="contentWrap">
              <Outlet />
            </div>
          </div>
          <BottomNavigation navConfig={NAV_CONFIG} />
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
}
