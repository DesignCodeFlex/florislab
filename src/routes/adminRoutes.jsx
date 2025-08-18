// src/routes/adminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "@admin/layouts/AdminLayout";

import AdminHome from "@admin/pages/AdminHome";

import AdminLogin from "@admin/pages/AdminLogin";
import Setting from "@admin/pages/Setting";
import SampleInputs from "@admin/pages/SampleInputs";

import Workshop from "@admin/pages/workshop/Workshop";
import WorkshopDetail from "@admin/pages/workshop/WorkshopDetail";
import WorkshopManage from "@admin/pages/workshop/WorkshopManage";

import Applicant from "@admin/pages/applicant/Applicant";
import ApplicantDetail from "@admin/pages/applicant/ApplicantDetail";

import Message from "@admin/pages/message/Message";
import MessageDetail from "@admin/pages/message/MessageDetail";
import MessageManage from "@admin/pages/message/MessageManage";

export default function AdminRouter() {
  return (
    <Routes>
      {/* 로그인 단독 라우트 */}
      <Route path="login" element={<AdminLogin />} />

      {/* 어드민 레이아웃 */}
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="home" replace />} />

        {/* 홈 */}
        <Route path="home" element={<AdminHome />} />

        {/* 워크샵 */}
        <Route path="workshop">
          <Route index element={<Workshop />} />
          <Route path="preview" element={<WorkshopDetail />} />
          <Route path=":id" element={<WorkshopDetail />} />
          <Route path="manage" element={<WorkshopManage />} />
        </Route>

        {/* 신청자 */}
        <Route path="applicant">
          <Route index element={<Applicant />} />
          <Route path=":id" element={<ApplicantDetail />} />
        </Route>

        {/* 메시지 */}
        <Route path="message">
          <Route index element={<Message />} />
          <Route path=":id" element={<MessageDetail />} />
          <Route path="manage" element={<MessageManage />} />
        </Route>

        {/* 설정 & 샘플 */}
        <Route path="setting" element={<Setting />} />
        <Route path="SampleInputs" element={<SampleInputs />} />
      </Route>
    </Routes>
  );
}
