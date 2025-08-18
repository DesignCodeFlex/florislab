import { useNavigate } from "react-router-dom";
import Button from "@shared/components/Button";

export default function Applicant() {
  const navigate = useNavigate();

  // 예시: 더미 데이터 / 실제라면 props나 API로 받아온 목록
  const applicants = [
    { id: "1", title: "봄 시즌 스페셜 클래스 – 튤립 디자인" },
    { id: "2", title: "여름 시즌 클래스 – 라벤더 디자인" },
  ];

  return (
    <div>
      {applicants.map((a) => (
        <div key={a.id}>
          <span>{a.title}</span>
          <Button variant="outline" onClick={() => navigate(a.id)}>
            상세보기
          </Button>
        </div>
      ))}
    </div>
  );
}
