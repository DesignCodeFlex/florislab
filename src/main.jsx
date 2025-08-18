import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/* 개발 중 전역 <html data-theme> 잔여가 있다면 제거 */
document.documentElement.removeAttribute("data-theme");

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
