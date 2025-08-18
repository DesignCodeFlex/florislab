// C:\project\florislab\src\admin\layouts\Header.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft, Bolt, Check, SquarePen } from "lucide-react";
import Button from "@shared/components/Button";

export default function Header({ navConfig }) {
  const navigate = useNavigate();
  const location = useLocation();

  // --- navConfig 정규화: routes 우선, 없으면 items -> routes로 변환 ---
  const { icons = {}, routes, items } = navConfig || {};
  const normalizedRoutes =
    Array.isArray(routes) && routes.length
      ? routes
      : (items || []).map((it) => ({
          base: it.to || "",
          title: it.label || "",
          iconKey: it.key,
          // 설정 페이지(/admin/setting)는 하단 내비 제외 규칙 반영
          bottomNav: !/\/setting(?:$|\/)/.test(it.to || ""),
        }));

  // 현재 경로 기준 메타 계산
  const parts = location.pathname.split("/").filter(Boolean);
  const basePath =
    parts.length >= 2 ? `/${parts[0]}/${parts[1]}` : "/admin/home";
  const isRootPage = parts.length === 2;

  const meta = normalizedRoutes.find((r) => r.base === basePath) || {};
  const Icon = meta.iconKey ? icons[meta.iconKey] : null;

  // Header.bus 오버라이드(페이지에서 동적 제어)
  const [override, setOverride] = useState(null);
  useEffect(() => {
    Header.bus._register(setOverride);
    return () => Header.bus._register(null);
  }, []);
  useEffect(() => {
    setOverride(null); // 경로 변경 시 override 초기화
  }, [location.pathname]);

  const title = (override?.title ?? meta.title) || "";
  const backButton =
    typeof override?.backButton === "boolean"
      ? override.backButton
      : !!meta.backButton;

  // ✅ 페이지에서 넘어온 onBack(가드 포함)을 우선 사용
  const onBack = override?.onBack || meta.onBack || null;

  const rbProp = override?.rightButton ?? meta.rightButton ?? "settings";
  const rb =
    typeof rbProp === "object" && rbProp !== null ? rbProp : { type: rbProp };

  const showBack = backButton || !isRootPage;

  const fallbackBack = () => {
    const idx = window.history?.state?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate("/admin/home", { replace: true });
  };

  const handleBack = () => {
    if (typeof onBack === "function") {
      // 페이지에서 가드 래핑한 onBack을 준 경우 그대로 실행
      onBack();
      return;
    }
    fallbackBack();
  };

  const handleRight = () => {
    if (rb?.onClick) {
      rb.onClick();
      return;
    }
    if (rb?.to) {
      navigate(rb.to, { replace: !!rb.replace, state: rb.state });
      return;
    }
    if (rb.type === "save") console.log("저장");
    if (rb.type === "edit") console.log("수정");
    if (rb.type === "settings") navigate("/admin/setting");
  };

  const renderRightButton = () => {
    switch (rb.type) {
      case "save":
        return (
          <Button
            onClick={handleRight}
            color="success"
            icon={<Check size={18} />}
          >
            저장
          </Button>
        );
      case "edit":
        return (
          <Button
            onClick={handleRight}
            color="success"
            icon={<SquarePen size={18} />}
          >
            수정
          </Button>
        );
      case "settings":
      default:
        return (
          <Button onClick={handleRight} aria-label="설정">
            <Bolt size={20} />
          </Button>
        );
    }
  };

  return (
    <div className="headerContainer">
      <header className="headerWrap">
        <div className="headerIconWrap">
          {showBack ? (
            <Button
              icon={<ChevronLeft size={24} />}
              onClick={handleBack}
              aria-label="뒤로가기"
            />
          ) : Icon ? (
            <span className="menuIcon">
              <Icon size={20} />
            </span>
          ) : null}
        </div>

        <div className="headerTitleWrap">
          <h1>{title}</h1>
        </div>

        <div className="headerBtnWrap">{renderRightButton()}</div>
      </header>
    </div>
  );
}

/** Header.bus: 페이지에서 동적으로 제어 */
Header.bus = {
  _set: null,
  _pending: null,
  _register(fn) {
    this._set = fn;
    if (fn && this._pending) {
      fn(this._pending);
      this._pending = null;
    }
  },
  set(props) {
    if (typeof this._set === "function") this._set(props);
    else this._pending = props;
  },
};
