import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import "@admin/styles/modal.css"; // .toastRegion / .toast / .toast--success / .toast--error

// 파일 내부 전용 컨텍스트(외부 export 없음)
const Ctx = createContext({
  showToast: () => {},
  hideAll: () => {},
  info: () => {},
  success: () => {},
  error: () => {},
});

export default function ToastProvider({ children }) {
  const [stack, setStack] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setStack((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ✅ variant 우선, 없으면 type.
  //    요청대로 error/success만 특별 취급, 그 외는 info.
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
      const kind = normalize(variant ?? type);
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
      info: (m, o) => showToast(m, { ...(o || {}), variant: "info" }),
      success: (m, o) => showToast(m, { ...(o || {}), variant: "success" }),
      error: (m, o) => showToast(m, { ...(o || {}), variant: "error" }),
    }),
    [showToast, hideAll]
  );

  return (
    <Ctx.Provider value={api}>
      {children}

      {/* modal.css 클래스 사용 */}
      <div className="toastRegion" aria-live="polite" aria-atomic="true">
        {stack.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`toast toast--${t.type}`} // toast--error / toast--success / (기본) toast
            data-type={t.type}
          >
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

/** 사용: import ToastProvider ...; const toast = ToastProvider.useToast(); */
ToastProvider.useToast = function useToast() {
  return useContext(Ctx);
};
