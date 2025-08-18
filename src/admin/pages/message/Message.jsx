import { useNavigate } from "react-router-dom";
import Button from "@shared/components/Button";

const MENUS = [
  { type: "open", label: "워크샵 개설 안내" },
  { type: "closed", label: "워크샵 신청 마감 안내" },
  { type: "upcoming", label: "참가 예정" },
  { type: "waiting", label: "순번 대기" },
  { type: "confirmed", label: "참가 확정" },
  { type: "canceled", label: "신청 취소" },
  { type: "unpaid", label: "미입금 취소" },
];

export default function Message() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>메시지 목록</h2>
      {MENUS.map((m) => (
        <Button
          variant="outline"
          key={m.type}
          onClick={() =>
            navigate("123", { state: { type: m.type, title: m.label } })
          }
        >
          {m.label}
        </Button>
      ))}
    </div>
  );
}
