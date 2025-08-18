import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomNavigation from "@admin/layouts/BottomNavigation";
import AuthProvider from "@admin/components/hooks/useAuth";

/**
 * useDirtyGuard
 * - 변경 여부 추적 + 이동 전 확인
 * - 하단 내비에 자동 등록
 * - 확인 UI: 프로젝트 공용 ModalBase(confirm) 사용 (fallback: window.confirm)
 */
export default function useDirtyGuard(options = {}) {
  const {
    message = "변경사항이 있습니다. 저장하지 않고 이동할까요?",
    registerBottomNav = true,
    confirmText = "이동",
    cancelText = "취소",
  } = options;

  // ✅ 프로젝트 공용 confirm (ModalBase). Provider 내부가 보장된 페이지에서 사용.
  const { confirm: appConfirm } = AuthProvider.useAuth();

  const [dirty, setDirty] = useState(false);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  const markDirty = useCallback(() => setDirty(true), []);
  const markPristine = useCallback(() => setDirty(false), []);

  const shouldProceed = useCallback(
    async (msg = message) => {
      if (!dirtyRef.current) return true;

      // 우선 공용 모달 사용
      if (typeof appConfirm === "function") {
        return await appConfirm({ message: msg, confirmText, cancelText });
      }
      // 혹시 모달 컨텍스트가 없으면 브라우저 confirm으로 폴백
      return window.confirm(msg);
    },
    [appConfirm, message, confirmText, cancelText]
  );

  const withGuard = useCallback(
    (fn, msg = message) => {
      return async (...args) => {
        const ok = await shouldProceed(msg);
        if (!ok) return;
        return fn?.(...args);
      };
    },
    [message, shouldProceed]
  );

  // 하단 내비 자동 등록
  useEffect(() => {
    if (!registerBottomNav) return;

    BottomNavigation.bus.setGuard(
      {
        isDirty: () => dirtyRef.current,
        shouldProceed,
      },
      { message }
    );
    return () => BottomNavigation.bus.clearGuard();
  }, [message, registerBottomNav, shouldProceed]);

  return useMemo(
    () => ({
      isDirty: dirty,
      markDirty,
      markPristine,
      withGuard,
      shouldProceed,
    }),
    [dirty, markDirty, markPristine, withGuard, shouldProceed]
  );
}
