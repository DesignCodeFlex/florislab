import { useNavigate } from "react-router-dom";
import Button from "@shared/components/Button";

// 더미 데이터 (추후 API 연동 가능)
const WORKSHOPS = [
  { id: "101", title: "봄 시즌 플라워 클래스", status: "Ready" },
  { id: "102", title: "여름 시즌 플라워 클래스", status: "Open" },
];

export default function Workshop() {
  const navigate = useNavigate();

  return (
    <div>
      <Button variant="outline" onClick={() => navigate("manage")}>
        신규작성
      </Button>
      {WORKSHOPS.map((ws) => (
        <div key={ws.id}>
          <span>{ws.title}</span>
          <Button
            variant="outline"
            onClick={() => navigate(ws.id, { state: ws })}
          >
            상세
          </Button>
        </div>
      ))}
    </div>
  );
}
