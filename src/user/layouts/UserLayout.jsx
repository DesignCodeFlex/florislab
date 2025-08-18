import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="userRoot" style={{ padding: 20 }}>
      <h2>User Layout</h2>
      <Outlet />
    </div>
  );
}
