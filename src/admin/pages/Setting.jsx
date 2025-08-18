import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@admin/layouts/Header";
import { useOverlayTriggerState } from "react-stately";
import ModalBase from "@admin/components/modals/ModalBase";
import { TextInput } from "@admin/components/inputs";
import ThemeToggleSwitch from "@shared/theme/ThemeToggleSwitch";
import Button from "@shared/components/Button";
import { Eye, EyeClosed, X, LogOut, HelpCircle } from "lucide-react";

import useSaveAction from "@admin/components/hooks/useSaveAction";
import useDirtyGuard from "@admin/components/hooks/useDirtyGuard";
import AuthProvider from "@admin/components/hooks/useAuth";

// -------- 래퍼: Provider만 감싼 뒤 내부 실제 화면 렌더 --------
export default function SettingPage() {
  return (
    <AuthProvider>
      <SettingView />
    </AuthProvider>
  );
}

// -------- 실제 화면 로직 --------
function SettingView() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, AUTH_KEY, logout } =
    AuthProvider.useAuth();

  // 현재 로그인 ID
  const currentId = currentUser?.id ?? sessionStorage.getItem(AUTH_KEY) ?? "";

  // ---------------- 상태 ----------------
  // 🔑 새로고침시 빨간선 플래시 방지: 초기값을 '현재 로그인 값'으로 바로 세팅
  const [title, setTitle] = useState(() => currentId); // 아이디
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [email, setEmail] = useState("");

  // 실시간 에러 메시지 표시용 상태
  const [errors, setErrors] = useState({
    userId: "",
    passwordConfirm: "",
    email: "",
  });

  // ---------------- refs: 에러 시 포커스 이동 ----------------
  const userIdRef = useRef(null);
  const pwConfirmRef = useRef(null);
  const emailRef = useRef(null);

  // ---------------- 유틸 ----------------
  const validateEmail = useCallback(
    (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    []
  );

  // 🔕 첫 렌더에서는 유효성 검사 스킵 → 빨간 선 깜빡임 방지
  const bootedRef = useRef(false);
  useEffect(() => {
    bootedRef.current = true;
  }, []);

  // ---------------- 실시간 검사 ----------------
  useEffect(() => {
    if (!bootedRef.current) return;
    const msg = title.trim() ? "" : "아이디를 입력해주세요";
    setErrors((prev) =>
      prev.userId === msg ? prev : { ...prev, userId: msg }
    );
  }, [title]);

  useEffect(() => {
    if (!bootedRef.current) return;
    const msg =
      password || passwordConfirm
        ? password === passwordConfirm
          ? ""
          : "비밀번호가 일치하지 않습니다"
        : "";
    setErrors((prev) =>
      prev.passwordConfirm === msg ? prev : { ...prev, passwordConfirm: msg }
    );
  }, [password, passwordConfirm]);

  useEffect(() => {
    if (!bootedRef.current) return;
    const msg =
      email && !validateEmail(email) ? "이메일 형식이 올바르지 않습니다" : "";
    setErrors((prev) => (prev.email === msg ? prev : { ...prev, email: msg }));
  }, [email, validateEmail]);

  // ---------------- 더티 가드 ----------------
  const guard = useDirtyGuard();

  // ---------------- 저장 액션 ----------------
  const { handleSave } = useSaveAction({
    requireDirty: true,
    isDirty: guard.isDirty,
    noChangeMessage: "변경된 값이 없습니다",
    validate: () => ({
      userId: title.trim() ? "" : "아이디를 입력해주세요",
      passwordConfirm:
        (password || passwordConfirm) && password !== passwordConfirm
          ? "비밀번호가 일치하지 않습니다"
          : "",
      email:
        email && !validateEmail(email) ? "이메일 형식이 올바르지 않습니다" : "",
    }),
    refs: { userId: userIdRef, passwordConfirm: pwConfirmRef, email: emailRef },
    order: ["userId", "passwordConfirm", "email"],
    onSave: async () => {
      // 실제 저장 로직 자리
      await new Promise((r) => setTimeout(r, 250));

      // ✅ 아이디가 바뀌었다면 세션/컨텍스트도 동기화
      const nextId = title.trim();
      if (nextId && nextId !== currentId) {
        sessionStorage.setItem(AUTH_KEY, nextId);
        setCurrentUser((u) => ({ ...(u ?? {}), id: nextId }));
      }

      guard.markPristine();
    },
  });

  // ---------------- 헤더 ----------------
  useEffect(() => {
    Header.bus.set({
      title: "설정",
      backButton: true,
      onBack: guard.withGuard(() => navigate(-1)),
      rightButton: { type: "save", onClick: handleSave },
    });
    return () => Header.bus.set(null);
  }, [guard, handleSave, navigate]);

  // ---------------- 모달 ----------------
  const helpDialog = useOverlayTriggerState({});

  // ---------------- 로그아웃(더티가드+확인모달 포함) ----------------
  const handleLogout = () => {
    logout({ guard }); // 더티면 "저장하지 않고 로그아웃할까요?", 아니면 "로그아웃하시겠어요?"
  };

  const isTempAccount = /^temp\d+$/.test(currentId);

  // ---------------- 렌더 ----------------
  return (
    <div className="settingContainer">
      <form id="form-setting" onSubmit={handleSave} onChange={guard.markDirty}>
        {/* 계정 설정 */}
        <dl className="formList">
          <dt>계정 설정</dt>

          <dd>
            <TextInput
              ref={userIdRef}
              label="아이디"
              value={title}
              onChange={setTitle}
              placeholder="아이디"
              errorMessage={
                errors.userId && (
                  <>
                    {errors.userId} <X size={18} />
                  </>
                )
              }
            />
          </dd>

          <dd>
            <TextInput
              label="비밀번호 변경"
              value={password}
              onChange={setPassword}
              placeholder="비밀번호 변경시에만 입력하세요"
              type={showPw1 ? "text" : "password"}
              rightElement={
                <Button type="button" onClick={() => setShowPw1((p) => !p)}>
                  {showPw1 ? <Eye size={18} /> : <EyeClosed size={18} />}
                </Button>
              }
            />
          </dd>

          <dd>
            <TextInput
              ref={pwConfirmRef}
              label="비밀번호 변경 확인"
              value={passwordConfirm}
              onChange={setPasswordConfirm}
              placeholder="변경할 비밀번호와 동일하게 입력하세요"
              type={showPw2 ? "text" : "password"}
              errorMessage={
                errors.passwordConfirm && (
                  <>
                    {errors.passwordConfirm} <X size={18} />
                  </>
                )
              }
              rightElement={
                <Button type="button" onClick={() => setShowPw2((p) => !p)}>
                  {showPw2 ? <Eye size={18} /> : <EyeClosed size={18} />}
                </Button>
              }
            />
          </dd>

          <dd>
            <TextInput
              ref={emailRef}
              type="email"
              label="관리자 이메일"
              value={email}
              onChange={setEmail}
              placeholder="알림을 받을 이메일을 입력해주세요"
              errorMessage={
                errors.email && (
                  <>
                    {errors.email} <X size={18} />
                  </>
                )
              }
            />
          </dd>
        </dl>

        {/* 환경 설정 */}
        <dl className="formList">
          <dt>환경 설정</dt>
          <dd>
            <div className="inputLabelRow" id="themeLabel">
              <span className="inputLabel">테마 변경</span>
            </div>
            <ThemeToggleSwitch aria-labelledby="themeLabel" />
          </dd>
        </dl>
      </form>

      <div className="settingBottomWrap">
        <Button
          color="error"
          icon={<LogOut size={18} />}
          size="sm"
          aria-label="로그아웃"
          onClick={handleLogout}
        >
          로그아웃
        </Button>
        <Button
          aria-label="문의 안내 열기"
          size="sm"
          icon={<HelpCircle size={20} />}
          onClick={helpDialog.open}
        />
      </div>

      {/* 문의 모달 */}
      <ModalBase
        isOpen={helpDialog.isOpen}
        onClose={helpDialog.close}
        actions={[{ label: "닫기" }]}
      >
        {isTempAccount && (
          <div>
            현재 아이디 <strong>{currentId}</strong> 는 임시로 발급된
            계정입니다.
            <br />
            필요한 경우 직접 수정하여 사용하세요.
          </div>
        )}
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
