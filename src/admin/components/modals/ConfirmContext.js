// C:\project\florislab\src\admin\components\modals\ConfirmContext.js
import { createContext } from "react";

// Provider 미장착 시에도 죽지 않도록 window.confirm 기반 폴백 제공
const fallback = {
  // 사용법: await confirm({ title, description, confirmText, cancelText })
  confirm: async ({ description }) => {
    return window.confirm(description || "계속하시겠습니까?");
  },
};

const ConfirmContext = createContext(fallback);
export default ConfirmContext;
