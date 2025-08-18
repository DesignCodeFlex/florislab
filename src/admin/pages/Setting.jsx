// C:\project\florislab\src\admin\pages\Setting.jsx
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

export default function SettingPage() {
  const navigate = useNavigate();

  // ---------------- 상태 ----------------
  const [currentUser] = useState("temp01"); // 예시
  const isTempAccount = /^temp\d+$/.test(currentUser);

  const [title, setTitle] = useState(""); // 아이디
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

  // ---------------- 실시간 검사 ----------------
  useEffect(() => {
    const msg = title.trim() ? "" : "아이디를 입력해주세요";
    setErrors((prev) =>
      prev.userId === msg ? prev : { ...prev, userId: msg }
    );
  }, [title]);

  useEffect(() => {
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
    const msg =
      email && !validateEmail(email) ? "이메일 형식이 올바르지 않습니다" : "";
    setErrors((prev) => (prev.email === msg ? prev : { ...prev, email: msg }));
  }, [email, validateEmail]);

  // ---------------- 더티 가드 ----------------
  const guard = useDirtyGuard();

  // ---------------- 저장 액션 ----------------
  const { handleSave } = useSaveAction({
    // ✅ 변경 없음 차단 옵션
    requireDirty: true,
    isDirty: guard.isDirty,
    noChangeMessage: "변경된 값이 없습니다",

    validate: () => ({
      userId: title.trim() ? "" : "아이디를 입력해주세요",
      passwordConfirm:
        (password || passwordConfirm) && password !== passwordConfirm
          ? "비밀번호가 일치하지 않습니다"
          : "",
      // 이메일은 빈 값 허용, 형식 체크
      email:
        email && !validateEmail(email) ? "이메일 형식이 올바르지 않습니다" : "",
    }),
    refs: { userId: userIdRef, passwordConfirm: pwConfirmRef, email: emailRef },
    order: ["userId", "passwordConfirm", "email"],
    onSave: async () => {
      // TODO: 실제 저장 로직
      await new Promise((r) => setTimeout(r, 250));
      guard.markPristine(); // ✅ 저장 성공 시 더티 해제
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
  useEffect(() => setTitle(currentUser), [currentUser]);

  // ---------------- 렌더 ----------------
  return (
    <div className="settingContainer">
      <form
        id="form-setting"
        onSubmit={handleSave}
        onChange={guard.markDirty} // ✅ 어떤 입력이든 바뀌면 더티로 표시
      >
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
            현재 아이디 <strong>{currentUser}</strong> 는 임시로 발급된
            계정입니다.
            <br />
            필요한 경우 직접 수정하여 사용하세요.
          </div>
        )}
        로그인 문제가 있을 경우, 아래로 문의하세요.
        <ul style={{ marginTop: 8 }}>
          <li>메일: support@example.com</li>
          <li>인스타: @floris_lab</li>
        </ul>
      </ModalBase>
    </div>
  );
}
