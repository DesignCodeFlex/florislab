// C:\project\florislab\src\admin\components\hooks\useSaveAction.js
import { useRef, useState } from "react";
import ToastProvider from "@admin/components/modals/ToastProvider";

/**
 * useSaveAction
 * - validate()로 에러 맵 수집 { key: message }
 * - "첫 에러" 1건만 토스트 (order 우선 → 없으면 화면상 Top)
 * - 해당 필드로 스크롤 + 포커스
 * - (옵션) 변경 없음이면 저장 차단 + 안내 토스트
 * - 에러 없으면 onSave() 실행 후 성공 토스트
 */
export default function useSaveAction({
  validate,
  refs = {},
  order = [],
  onSave,
  successMessage = "저장되었습니다",
  focusBehavior = "scroll-and-focus",
  scrollRoot = null,

  // ✅ 추가 옵션
  requireDirty = false, // true면 변경 없을 때 저장 차단
  isDirty, // boolean 또는 () => boolean
  noChangeMessage = "변경된 값이 없습니다",
} = {}) {
  const { showToast } = ToastProvider.useToast();
  const [isSaving, setIsSaving] = useState(false);
  const lastErrorsRef = useRef({});

  const focusAndScroll = (el) => {
    if (!el) return;
    if (focusBehavior !== "focus-only") {
      try {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch {
        /* noop */
      }
    }
    try {
      el.focus({ preventScroll: true });
    } catch {
      /* noop */
    }
  };

  const pickFirstErrorKey = (errors) => {
    const keys = Object.keys(errors).filter((k) => errors[k]);
    if (!keys.length) return null;

    // 1) 우선순위 배열 우선
    if (order && order.length) {
      const k = order.find((name) => errors[name]);
      if (k) return k;
    }

    // 2) 화면상 Top(가시 요소 우선)
    const rootEl = scrollRoot instanceof HTMLElement ? scrollRoot : null;

    const isVisible = (el) => {
      if (!el || !(el instanceof HTMLElement)) return false;
      if (!el.offsetParent && getComputedStyle(el).position !== "fixed")
        return false;

      const root = rootEl || document.documentElement;
      const rootRect =
        root === document.documentElement
          ? { top: 0, bottom: window.innerHeight }
          : root.getBoundingClientRect();

      const rect = el.getBoundingClientRect();
      return rect.bottom > rootRect.top && rect.top < rootRect.bottom;
    };

    const topScore = (el) => {
      if (!el) return Number.POSITIVE_INFINITY;
      return el.getBoundingClientRect().top;
    };

    const scored = keys.map((k) => {
      const el = refs[k]?.current;
      return { key: k, el, visible: isVisible(el), score: topScore(el) };
    });

    const visibles = scored.filter((s) => s.visible);
    const targetList = visibles.length ? visibles : scored;
    targetList.sort((a, b) => a.score - b.score);
    return targetList[0]?.key ?? keys[0];
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();

    // ✅ 변경 없음 차단 (옵션)
    if (requireDirty) {
      const dirtyNow = typeof isDirty === "function" ? !!isDirty() : !!isDirty;
      if (!dirtyNow) {
        showToast(noChangeMessage, { variant: "info" });
        return false;
      }
    }

    const errors = (typeof validate === "function" ? validate() : {}) || {};
    lastErrorsRef.current = errors;

    // 에러가 있으면 첫 에러만 처리
    const firstKey = pickFirstErrorKey(errors);
    if (firstKey) {
      const msg = errors[firstKey];
      const el = refs[firstKey]?.current;
      if (el) focusAndScroll(el);
      if (msg) showToast(msg, { variant: "error" });
      return false;
    }

    // 통과 → 저장 실행
    if (typeof onSave === "function") {
      try {
        setIsSaving(true);
        await onSave();
        showToast(successMessage, { variant: "success" });
      } catch (err) {
        const fallback = err?.message || "저장 중 오류가 발생했습니다.";
        showToast(fallback, { variant: "error" });
        setIsSaving(false);
        return false;
      }
      setIsSaving(false);
    } else {
      // onSave 미지정이어도 UX 유지
      showToast(successMessage, { variant: "success" });
    }

    return true;
  };

  return {
    handleSave,
    isSaving,
    lastErrors: lastErrorsRef.current,
  };
}
