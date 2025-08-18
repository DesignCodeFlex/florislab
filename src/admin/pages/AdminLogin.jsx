import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ToastProvider from "@admin/components/modals/ToastProvider";
import ThemeToggleSwitch from "@shared/theme/ThemeToggleSwitch";
import { TextInput, CheckboxInput } from "@admin/components/inputs";
import Button from "@shared/components/Button";
import { Eye, EyeClosed, X } from "lucide-react";

// 더미 계정(포트폴리오용) — 필요시 교체
const USERS = {
  admin: "0000",
  teacher01: "1111",
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const toast = ToastProvider.useToast();

  const [id, setId] = useState(() => localStorage.getItem("fl.lastId") || "");
  const [pw, setPw] = useState(() => localStorage.getItem("fl.lastPw") || "");
  const [remember, setRemember] = useState(
    localStorage.getItem("fl.rememberPw") === "1"
  );
  const [showPw, setShowPw] = useState(false);
  const [caps, setCaps] = useState(false);

  const [errors, setErrors] = useState({ id: "", pw: "" });
  const pwRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem("fl.auth"))
      navigate("/admin/home", { replace: true });
  }, [navigate]);

  const onCapsCheck = (e) =>
    setCaps(e.getModifierState && e.getModifierState("CapsLock"));

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

    // 성공 처리
    sessionStorage.setItem("fl.auth", uid);
    localStorage.setItem("fl.lastId", id.trim());
    localStorage.setItem("fl.rememberPw", remember ? "1" : "0");
    if (remember) localStorage.setItem("fl.lastPw", pw);
    else localStorage.removeItem("fl.lastPw");

    toast.success("환영합니다");
    navigate("/admin/home", { replace: true });
  };
  return (
    <div className="loginContainer">
      <form className="loginWrap" onSubmit={submit} noValidate>
        <h1 className="loginBrand">Floris Lab</h1>
        <p className="loginSub">플로리스 랩, 계절의 꽃을 배우다</p>

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
              {showPw ? <EyeClosed size={18} /> : <Eye size={18} />}
            </Button>
          }
          onKeyUp={onCapsCheck}
          onKeyDown={onCapsCheck}
        />
        {caps && <div className="caption">Caps Lock이 켜져 있습니다</div>}

        <div style={{ marginTop: 8 }}>
          <CheckboxInput defaultSelected={remember} onChange={setRemember}>
            비밀번호 저장
          </CheckboxInput>
        </div>
        <ThemeToggleSwitch id="theme-toggle" />
        <Button
          type="submit"
          color="primary"
          style={{ width: "100%", marginTop: 16 }}
        >
          로그인
        </Button>
      </form>
    </div>
  );
}
