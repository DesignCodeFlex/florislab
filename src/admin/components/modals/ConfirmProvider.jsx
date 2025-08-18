// C:\project\florislab\src\admin\components\modals\ConfirmProvider.jsx
import React, { useRef, useState } from "react";
import ConfirmContext from "./ConfirmContext";
import ModalBase from "./ModalBase"; // 이미 존재하는 공용 모달 베이스 사용

/**
 * ConfirmProvider
 * - 전역에서 쓸 수 있는 확인 모달
 * - useConfirm() 훅으로 confirm(options) 호출 → Promise<boolean>
 * - 이 파일은 컴포넌트만 export (Fast Refresh 경고 회피)
 */
export default function ConfirmProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState({
    title: "확인",
    description: "",
    confirmText: "확인",
    cancelText: "취소",
  });

  const resolverRef = useRef(null);

  const close = (result) => {
    setOpen(false);
    const resolver = resolverRef.current;
    resolverRef.current = null;
    if (resolver) resolver(result);
  };

  const confirm = (options = {}) =>
    new Promise((resolve) => {
      resolverRef.current = resolve;
      setOpts((prev) => ({
        ...prev,
        ...options,
        // 기본 텍스트
        title: options.title ?? prev.title ?? "확인",
        description: options.description ?? prev.description ?? "",
        confirmText: options.confirmText ?? prev.confirmText ?? "확인",
        cancelText: options.cancelText ?? prev.cancelText ?? "취소",
      }));
      setOpen(true);
    });

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {open && (
        <ModalBase
          isOpen={open}
          onClose={() => close(false)}
          className="confirmModal"
        >
          <div className="modalHeader">
            <h3 className="modalTitle">{opts.title}</h3>
          </div>

          <div className="modalBody">
            {opts.description && (
              <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                {opts.description}
              </p>
            )}
          </div>

          <div
            className="modalFooter"
            style={{ display: "flex", gap: 8, marginTop: 16 }}
          >
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => close(false)}
              aria-label={opts.cancelText}
            >
              {opts.cancelText}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => close(true)}
              aria-label={opts.confirmText}
            >
              {opts.confirmText}
            </button>
          </div>
        </ModalBase>
      )}
    </ConfirmContext.Provider>
  );
}
