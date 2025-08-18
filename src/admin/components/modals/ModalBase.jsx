import { ModalOverlay, Modal, Dialog } from "react-aria-components";
import "@admin/styles/modal.css";

/**
 * 만능 모달 쉘
 * - title이 있으면 헤더 노출, 없으면 헤더 생략
 * - actions 배열이 있으면 푸터 버튼 자동 생성
 * - variant="dialog" | "sheet" (하단 슬라이드)
 * - ariaLabel은 title이 없을 때 접근성 레이블로 사용
 */
export default function ModalBase({
  isOpen = false,
  onClose = () => {},
  title, // string | ReactNode | undefined
  ariaLabel = "dialog", // title이 없을 때만 사용
  actions = [], // [{label, onPress, variant, autoFocus}]
  variant = "dialog", // "dialog" | "sheet"
  className = "",
  children,
}) {
  const containerClass =
    variant === "sheet"
      ? `modalContainer modalContainer--sheet ${className}`
      : `modalContainer ${className}`;

  return (
    <ModalOverlay
      isOpen={isOpen}
      isDismissable
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className="modalBackdrop"
    >
      <Modal className={containerClass}>
        <Dialog
          className="modalDialog"
          aria-label={title ? undefined : ariaLabel}
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Header (옵션) */}
          {title && (
            <div className="modalHeader">
              <h2 id="modal-title" className="modalTitle">
                {title}
              </h2>
            </div>
          )}

          {/* 시트형 핸들 (옵션) */}
          {variant === "sheet" && <div className="sheetHandle" aria-hidden />}

          {/* Body */}
          <div className="modalBody">{children}</div>

          {/* Footer (옵션) */}
          {Array.isArray(actions) && actions.length > 0 && (
            <div className="modalFooter">
              {actions.map((btn, idx) => {
                const {
                  label,
                  onPress,
                  variant: v = "primary", // primary | secondary | danger | ghost
                  autoFocus,
                } = btn;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`modalButton modalButton--${v}`}
                    autoFocus={autoFocus}
                    onClick={async () => {
                      if (onPress) await onPress(); // 이동 확정/취소 먼저 결정
                      onClose(); // 그 다음 닫기 (두 번 닫혀도 내부에서 안전)
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
