import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ToastProvider from "@admin/components/modals/ToastProvider";
import ThemeToggleSwitch from "@shared/theme/ThemeToggleSwitch";
import ModalBase from "@admin/components/modals/ModalBase";
import { useOverlayTriggerState } from "react-stately";
import Button from "@shared/components/Button";
import { TextInput, CheckboxInput } from "@admin/components/inputs";
import { Eye, EyeClosed, X, HelpCircle } from "lucide-react";

// 더미 계정(포트폴리오용)
const USERS = {
  admin: "1111",
  temp01: "1111",
};

const AUTH_KEY = "fl.auth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = ToastProvider.useToast();

  // 로그인 페이지 진입 시, 이미 로그인 상태면 홈으로
  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY)) {
      navigate("/admin/home", { replace: true });
    }
  }, [navigate]);

  // 폼 상태
  const [id, setId] = useState(() => localStorage.getItem("fl.lastId") || "");
  const [pw, setPw] = useState(() => localStorage.getItem("fl.lastPw") || "");
  const [remember, setRemember] = useState(
    localStorage.getItem("fl.rememberPw") === "1"
  );
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({ id: "", pw: "" });
  const pwRef = useRef(null);

  const validate = () => {
    const next = {
      id: id.trim() ? "" : "아이디를 입력하세요",
      pw: pw ? "" : "비밀번호를 입력하세요",
    };
    setErrors(next);
    return !next.id && !next.pw;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("입력값을 확인하세요");
      return;
    }

    const uid = id.trim().toLowerCase();
    const ok = USERS[uid] && USERS[uid] === pw;

    if (!ok) {
      setErrors((p) => ({ ...p, pw: "비밀번호가 맞지 않습니다" }));
      toast.error("로그인 실패");
      pwRef.current?.focus();
      return;
    }

    // ✅ 로그인 성공: 세션 토큰 저장(단일 기준), 마지막 로그인 정보 관리
    sessionStorage.setItem(AUTH_KEY, uid);
    localStorage.setItem("fl.lastId", id.trim());
    localStorage.setItem("fl.rememberPw", remember ? "1" : "0");
    if (remember) localStorage.setItem("fl.lastPw", pw);
    else localStorage.removeItem("fl.lastPw");

    toast.success("환영합니다");

    // 이전에 보호 경로 접근 시도(from)가 있었다면 그리로 복귀, 없으면 홈
    const to = location.state?.from || "/admin/home";
    navigate(to, { replace: true });
  };
  const helpDialog = useOverlayTriggerState({});
  return (
    <div className="loginContainer">
      <div className="loginWrap">
        <form id="form-setting" onSubmit={submit} noValidate>
          <div className="loginBrand">
            <h1>Floris Lab</h1>
            <h2>플로리스 랩, 계절의 꽃을 배우다</h2>
          </div>

          <ul className="formList">
            <li>
              <TextInput
                label="아이디"
                value={id}
                onChange={setId}
                placeholder="아이디를 입력하세요"
                errorMessage={
                  errors.id && (
                    <>
                      {errors.id} <X size={18} />
                    </>
                  )
                }
              />
            </li>

            <li>
              <TextInput
                label="비밀번호"
                value={pw}
                onChange={setPw}
                type={showPw ? "text" : "password"}
                ref={pwRef}
                placeholder="비밀번호를 입력하세요"
                errorMessage={
                  errors.pw && (
                    <>
                      {errors.pw} <X size={18} />
                    </>
                  )
                }
                rightElement={
                  <Button type="button" onClick={() => setShowPw((p) => !p)}>
                    {showPw ? <Eye size={18} /> : <EyeClosed size={18} />}
                  </Button>
                }
              />
            </li>

            <li>
              <CheckboxInput defaultSelected={remember} onChange={setRemember}>
                비밀번호 저장
              </CheckboxInput>
              <ThemeToggleSwitch id="theme-toggle" />
            </li>

            <li>
              <Button type="submit" variant="outline">
                로그인
              </Button>
            </li>
          </ul>
        </form>
        <div className="helpButtonWrap">
          <Button
            aria-label="문의 안내 열기"
            size="sm"
            icon={<HelpCircle size={20} />}
            onClick={helpDialog.open}
          />
        </div>
      </div>
      <ModalBase
        isOpen={helpDialog.isOpen}
        onClose={helpDialog.close}
        actions={[{ label: "닫기" }]}
      >
        로그인 문제가 있을 경우, 아래로 문의하세요.
        <ul>
          <li>
            <span>메일</span>
            <a href="mailto:support@example.com">support@example.com</a>
          </li>
          <li>
            <span>인스타</span>
            <a
              href="https://instagram.com/floris_lab"
              target="_blank"
              rel="noopener noreferrer"
            >
              @floris_lab
            </a>
          </li>
        </ul>
      </ModalBase>
    </div>
  );
}
