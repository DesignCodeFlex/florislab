import { NavLink, useLocation } from "react-router-dom";

export default function BottomNavigation({ navConfig }) {
  // --- navConfig 정규화: routes 우선, 없으면 items -> routes로 변환 ---
  const { icons = {}, routes, items } = navConfig || {};
  const normalizedRoutes =
    Array.isArray(routes) && routes.length
      ? routes
      : (items || []).map((it) => ({
          base: it.to || "",
          title: it.label || "",
          iconKey: it.key,
          bottomNav: !/\/setting(?:$|\/)/.test(it.to || ""),
        }));

  const navItems = normalizedRoutes.filter((r) => r.bottomNav);

  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  const currentBase =
    parts.length >= 2 ? `/${parts[0]}/${parts[1]}` : "/admin/home";

  return (
    <div className="bottomNavigationContainer">
      <nav className="bottomNavigation">
        {navItems.map((item) => {
          const Icon = icons[item.iconKey];
          const active = currentBase === item.base;
          return (
            <NavLink
              key={item.base}
              to={item.base}
              className={active ? "active" : ""}
              aria-label={item.title}
            >
              <span>{Icon ? <Icon size={24} /> : null}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
