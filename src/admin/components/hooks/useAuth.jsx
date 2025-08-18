import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import ModalBase from "@admin/components/modals/ModalBase";

const AuthContext = createContext(null);
const AUTH_KEY = "fl.auth";

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // 새로고침 복원
  useEffect(() => {
    const uid = sessionStorage.getItem(AUTH_KEY);
    if (uid) setCurrentUser((u) => u ?? { id: uid, role: "admin" });
  }, []);

  // ---------- 공용 확인 모달 ----------
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmConfirmText, setConfirmConfirmText] = useState("확인");
  const [confirmCancelText, setConfirmCancelText] = useState("취소");
  const resolverRef = useRef(null);

  const askConfirm = useCallback(
    ({ message, confirmText = "확인", cancelText = "취소" }) => {
      setConfirmMessage(message);
      setConfirmConfirmText(confirmText);
      setConfirmCancelText(cancelText);
      setConfirmOpen(true);
      return new Promise((resolve) => {
        resolverRef.current = resolve;
      });
    },
    []
  );

  const closeConfirm = useCallback((result) => {
    setConfirmOpen(false);
    const resolve = resolverRef.current;
    resolverRef.current = null;
    if (resolve) resolve(result);
  }, []);

  // ---------- 로그인 / 로그아웃 ----------
  const login = useCallback(
    async (userId, _password, { redirectTo = "/admin/home" } = {}) => {
      sessionStorage.setItem(AUTH_KEY, userId || "admin");
      setCurrentUser({ id: userId || "admin", role: "admin" });
      navigate(redirectTo, { replace: true });
    },
    [navigate]
  );

  const logout = useCallback(
    async (options = {}) => {
      const {
        guard,
        redirectTo = "/admin/login",
        confirm, // { dirtyMessage?, cleanMessage?, confirmText?, cancelText? }
        onBeforeLogout,
        onAfterLogout,
      } = options;

      const dirty = Boolean(guard?.isDirty);
      const message = dirty
        ? confirm?.dirtyMessage ??
          "변경 사항이 있습니다. 저장하지 않고 로그아웃할까요?"
        : confirm?.cleanMessage ?? "로그아웃하시겠어요?";
      const confirmText = confirm?.confirmText ?? "로그아웃";
      const cancelText = confirm?.cancelText ?? "취소";

      const ok = await askConfirm({ message, confirmText, cancelText });
      if (!ok) return;

      try {
        onBeforeLogout?.();
        sessionStorage.removeItem(AUTH_KEY);
        setCurrentUser(null);
        guard?.markPristine?.();
      } finally {
        navigate(redirectTo, { replace: true });
        onAfterLogout?.();
      }
    },
    [askConfirm, navigate]
  );

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      login,
      logout,
      AUTH_KEY,
      // ✅ 외부에서 쓰기 위한 공용 confirm
      confirm: askConfirm,
    }),
    [currentUser, login, logout, askConfirm]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <ModalBase
        isOpen={confirmOpen}
        onClose={() => closeConfirm(false)}
        actions={[
          {
            label: confirmCancelText,
            autoFocus: true,
            onClick: () => closeConfirm(false),
          },
          {
            label: confirmConfirmText,
            color: "error",
            onClick: () => closeConfirm(true),
          },
        ]}
      >
        <div>{confirmMessage}</div>
      </ModalBase>
    </AuthContext.Provider>
  );
}

function useAuthInner() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
AuthProvider.useAuth = useAuthInner;
