// /src/admin/components/hooks/useDirtyGuard.js
import { createElement, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ModalBase from "@admin/components/modals/ModalBase";

/**
 * useDirtyGuard
 * - 폼 변경(더티) 상태를 추적하고, 이탈 시 확인을 강제합니다.
 * - (중요) 외부 confirmLeave를 사용하지 않고,
 *   ModalBase 기반의 "타이틀 없는" 내부 확인 모달만 사용합니다.
 */
export default function useDirtyGuard({
  isDirty, // boolean 또는 () => boolean
  watchBeforeUnload = true,
} = {}) {
  const [dirtyState, setDirtyState] = useState(false);
  const isFn = typeof isDirty === "function";

  const isDirtyGetter = useCallback(() => {
    return isFn ? !!isDirty() : !!(isDirty ?? dirtyState);
  }, [isFn, isDirty, dirtyState]);

  const markDirty = useCallback(() => {
    if (!isFn) setDirtyState(true);
  }, [isFn]);

  const markPristine = useCallback(() => {
    if (!isFn) setDirtyState(false);
  }, [isFn]);

  const setDirty = useCallback(
    (val) => {
      if (!isFn) setDirtyState(!!val);
    },
    [isFn]
  );

  useEffect(() => {
    if (!watchBeforeUnload) return;
    const handler = (e) => {
      if (!isDirtyGetter()) return;
      e.preventDefault();
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [watchBeforeUnload, isDirtyGetter]);

  const defaultConfirm = (message) => {
    return new Promise((resolve) => {
      const container = document.createElement("div");
      document.body.appendChild(container);
      const root = createRoot(container);

      let closed = false;
      const cleanup = (ok) => {
        if (closed) return;
        closed = true;
        try {
          root.unmount();
        } catch (e) {
          void e;
        }
        if (container.parentNode) document.body.removeChild(container);
        resolve(ok);
      };

      root.render(
        createElement(
          ModalBase,
          {
            isOpen: true,
            ariaLabel: "확인",
            onClose: () => cleanup(false),
            actions: [
              {
                label: "머무르기",
                onPress: () => cleanup(false),
              },
              {
                label: "이동",
                onPress: () => cleanup(true),
              },
            ],
          },
          createElement("p", null, message)
        )
      );
    });
  };

  const shouldProceed = useCallback(
    async (
      message = "변경사항이 있습니다. 저장하지 않고 이동하시겠습니까?"
    ) => {
      if (!isDirtyGetter()) return true;
      return await defaultConfirm(message);
    },
    [isDirtyGetter]
  );

  const withGuard = useCallback(
    (fn, message) => {
      return async (...args) => {
        const ok = await shouldProceed(message);
        if (!ok) return false;
        return fn?.(...args);
      };
    },
    [shouldProceed]
  );

  return {
    isDirty: isDirtyGetter(),
    markDirty,
    markPristine,
    setDirty,
    shouldProceed,
    withGuard,
  };
}
