import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function BottomNavigation({ navConfig }) {
  const navigate = useNavigate();
  const location = useLocation();

  // --- navConfig 정규화: routes 우선, 없으면 items -> routes로 변환 ---
  const { icons = {}, routes, items } = navConfig || {};
  const normalizedRoutes = useMemo(() => {
    if (Array.isArray(routes) && routes.length) return routes;
    return (items || []).map((it) => ({
      base: it.to || "",
      title: it.label || "",
      iconKey: it.key,
      bottomNav: !/\/setting(?:$|\/)/.test(it.to || ""),
    }));
  }, [routes, items]);

  const navItems = useMemo(
    () => normalizedRoutes.filter((r) => r.bottomNav),
    [normalizedRoutes]
  );

  // 현재 베이스 경로 계산
  const parts = location.pathname.split("/").filter(Boolean);
  const currentBase =
    parts.length >= 2 ? `/${parts[0]}/${parts[1]}` : "/admin/home";

  // 공통 네비 핸들러: 더티가드 확인 후 이동
  const handleNavigate = (e, to) => {
    if (!to || to === currentBase) return; // 동일 경로면 무시
    e.preventDefault();

    const run = async () => {
      const ok = await BottomNavigation.bus.shouldProceed?.();
      if (ok === false) return;
      navigate(to);
    };
    run();
  };

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
              onClick={(e) => handleNavigate(e, item.base)}
            >
              <span>{Icon ? <Icon size={24} /> : null}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

/**
 * BottomNavigation.bus
 * - 페이지에서 더티가드를 등록/해제하여 하단 내비 클릭 시 확인 모달을 띄웁니다.
 * - useDirtyGuard의 반환 객체(shouldProceed, isDirty 등)를 그대로 넘기면 됩니다.
 *
 * 사용 예)
 *   BottomNavigation.bus.setGuard(guard, { message: "저장 안 하고 이동할까요?" });
 *   return () => BottomNavigation.bus.clearGuard();
 */
BottomNavigation.bus = {
  _guard: null,
  _message: undefined,
  setGuard(guard, options) {
    this._guard = guard || null;
    this._message = options?.message;
  },
  clearGuard() {
    this._guard = null;
    this._message = undefined;
  },
  async shouldProceed(message) {
    const g = this._guard;
    const msg =
      message ??
      this._message ??
      "변경사항이 있습니다. 저장하지 않고 이동하시겠습니까?";

    if (!g) return true;

    // useDirtyGuard의 shouldProceed(message)가 있으면 그대로 사용
    if (typeof g.shouldProceed === "function") {
      return await g.shouldProceed(msg);
    }

    // fallback: isDirty만 있으면 브라우저 confirm
    const dirty = typeof g.isDirty === "function" ? g.isDirty() : !!g.isDirty;
    if (!dirty) return true;
    return window.confirm(msg);
  },
};
