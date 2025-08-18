import { Routes, Route } from "react-router-dom";
import UserLayout from "@user/layouts/UserLayout";
import UserHome from "@user/pages/UserHome";

export default function userRoutes() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route index element={<UserHome />} />
        <Route path="*" element={<UserHome />} />
      </Route>
    </Routes>
  );
}
