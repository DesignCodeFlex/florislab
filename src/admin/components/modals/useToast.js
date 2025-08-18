import { useContext } from "react";
import ToastContext from "./ToastContext";

/** 사용: const toast = useToast(); toast.showToast("메시지"); */
export default function useToast() {
  const ctx = useContext(ToastContext);
  return ctx; // { showToast, hideAll, info, success, error }
}
