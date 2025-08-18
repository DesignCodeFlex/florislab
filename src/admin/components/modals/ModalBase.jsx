import { ModalOverlay, Modal, Dialog } from "react-aria-components";
import Button from "@shared/components/Button";
import "@admin/styles/modals.css";

/**
 * 만능 모달 쉘
 * - title이 있으면 헤더 노출, 없으면 헤더 생략
 * - actions 배열이 있으면 푸터 버튼 자동 생성(공용 Button 사용)
 * - footer(ReactNode)가 있으면 footer를 우선 렌더(actions 무시)
 * - variant="dialog" | "sheet" (하단 슬라이드)
 * - ariaLabel은 title이 없을 때 접근성 레이블로 사용
 */
export default function ModalBase({
  isOpen = false,
  onClose = () => {},
  title, // string | ReactNode | undefined
  ariaLabel = "dialog", // title이 없을 때만 사용
  actions = [], // [{ label, onClick|onPress, color, variant, size, icon, autoFocus }]
  footer, // ReactNode 커스텀 풋터 (있으면 actions 무시)
  variant = "dialog", // "dialog" | "sheet"
  className = "",
  children,
}) {
  const containerClass =
    variant === "sheet"
      ? `modalContainer modalContainer--sheet ${className}`
      : `modalContainer ${className}`;

  const handleActionClick = async (action) => {
    const { onClick, onPress } = action || {};
    if (typeof onClick === "function") await onClick();
    else if (typeof onPress === "function") await onPress();
    onClose(); // 동작 후 닫기
  };

  // (하위 호환) 기존 variant 값(danger/secondary 등)을 Button props로 매핑
  const mapLegacyVariant = (v) => {
    if (v === "danger") return { color: "error", variant: "solid" };
    return {}; // primary or unknown -> Button 기본
  };

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

          {/* Footer */}
          {footer ? (
            <div className="modalFooter">{footer}</div>
          ) : Array.isArray(actions) && actions.length > 0 ? (
            <div className="modalFooter">
              {actions.map((a, idx) => {
                const {
                  label,
                  color, // success | warning | error
                  icon,
                  autoFocus,
                  ...rest
                } = a || {};

                // 레거시 v 매핑(primary/secondary/danger/ghost)
                const legacy = mapLegacyVariant(a?.variant);

                return (
                  <Button
                    key={idx}
                    color={color ?? legacy.color}
                    icon={icon}
                    autoFocus={autoFocus}
                    onClick={() => handleActionClick(a)}
                    {...rest}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          ) : null}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
