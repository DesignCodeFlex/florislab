// C:\project\florislab\src\admin\components\modals\ToastContext.js
import { createContext } from "react";

// Provider 미장착 시 안전하게 동작하도록 no-op 기본값
const fallbackToast = { showToast: () => {}, hideAll: () => {} };

const ToastContext = createContext(fallbackToast);
export default ToastContext;
