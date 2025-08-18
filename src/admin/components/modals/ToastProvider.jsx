import { useCallback, useMemo, useRef, useState } from "react";
import ToastContext from "./ToastContext";
import "@admin/styles/modal.css"; // .toastRegion / .toast / .toast--success / .toast--error

export default function ToastProvider({ children }) {
  const [stack, setStack] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setStack((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ✅ variant 우선, 없으면 type 참조. 오직 'error'/'success'만 특별 취급.
  const normalize = useCallback((v) => {
    const t = String(v || "")
      .toLowerCase()
      .trim();
    if (t === "error") return "error";
    if (t === "success") return "success";
    return "info";
  }, []);

  const showToast = useCallback(
    (message, opts = {}) => {
      const { variant, type, duration } = opts;
      const id = ++idRef.current;
      const kind = normalize(variant ?? type); // ← 여기서 variant를 우선 반영
      const ms = Number.isFinite(duration) ? duration : 2800;

      setStack((prev) => [...prev, { id, message, type: kind }]);
      if (ms > 0) window.setTimeout(() => remove(id), ms);
      return id;
    },
    [normalize, remove]
  );

  const hideAll = useCallback(() => setStack([]), []);

  const api = useMemo(
    () => ({
      showToast,
      hideAll,
      // sugar 메서드 (둘 다 동작)
      info: (m, o) => showToast(m, { ...(o || {}), variant: "info" }),
      success: (m, o) => showToast(m, { ...(o || {}), variant: "success" }),
      error: (m, o) => showToast(m, { ...(o || {}), variant: "error" }),
    }),
    [showToast, hideAll]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* modal.css 클래스 사용 */}
      <div className="toastRegion" aria-live="polite" aria-atomic="true">
        {stack.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`toast toast--${t.type}`} // => toast--error / toast--success / (기본) toast
            data-type={t.type} // 디버깅 확인용
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
