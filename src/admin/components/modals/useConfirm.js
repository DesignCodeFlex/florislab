// C:\project\florislab\src\admin\components\modals\useConfirm.js
import { useContext } from "react";
import ConfirmContext from "./ConfirmContext";

/**
 * useConfirm
 * - 사용: const { confirm } = useConfirm();
 * - const ok = await confirm({ title, description, confirmText, cancelText });
 * - ok === true 이면 확인
 */
export default function useConfirm() {
  const ctx = useContext(ConfirmContext);
  return ctx; // { confirm } (Provider 없으면 window.confirm 폴백)
}
