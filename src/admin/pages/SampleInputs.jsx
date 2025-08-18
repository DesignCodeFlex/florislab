import React, { useState } from "react";
import {
  TextInput,
  TextareaInput,
  SelectInput,
  CheckboxInput,
  RadioGroupInput,
} from "@/admin/components/inputs";
import { Eye, EyeClosed, X, Braces } from "lucide-react";
import Button from "@shared/components/Button";

export default function SampleInputs() {
  // const { theme, setTheme } = useTheme();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState("ready");
  const [redirectMode, setRedirectMode] = useState("auto");

  return (
    <div style={{ padding: "20px" }}>
      <h3>텍스트 인풋</h3>
      <TextInput
        label="워크샵 타이틀"
        value={title}
        onChange={setTitle}
        placeholder="봄맞이 [차수] 워크샵"
        rightElement={
          <Button color="success" icon={<Braces size={16} />}>
            차수변경
          </Button>
        }
      />

      <h3>비밀번호 인풋</h3>
      <TextInput
        label="비밀번호 확인"
        value={password}
        onChange={setPassword}
        type={showPw ? "text" : "password"}
        errorMessage={
          <>
            비밀번호가 일치하지 않습니다 <X size={18} />
          </>
        }
        rightElement={
          <Button onClick={() => setShowPw((p) => !p)}>
            {showPw ? <EyeClosed size={18} /> : <Eye size={18} />}
          </Button>
        }
      />

      <h3>체크박스</h3>
      <CheckboxInput defaultSelected>자동저장</CheckboxInput>
      <CheckboxInput>알림 수신 동의</CheckboxInput>

      <h3>라디오 그룹</h3>
      <RadioGroupInput
        label="리다이렉트 모드"
        value={redirectMode}
        onChange={setRedirectMode}
        options={[
          { value: "auto", label: "자동" },
          { value: "manual", label: "수동" },
        ]}
      />

      <h3>셀렉트 인풋</h3>
      <SelectInput
        label="워크샵 상태"
        value={status}
        onChange={setStatus}
        options={[
          { value: "ready", label: "준비중" },
          { value: "open", label: "접수중" },
          { value: "closed", label: "접수마감" },
          { value: "on", label: "진행중" },
          { value: "none", label: "일정없음" },
        ]}
      />

      <h3>워크샵 설명</h3>
      <TextareaInput
        label="워크샵 설명"
        value={desc}
        onChange={setDesc}
        placeholder="워크샵에 대한 설명을 입력하세요"
      />
    </div>
  );
}
