import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@admin/layouts/Header";

const TITLES = {
  open: "워크샵 개설 안내 수정",
  closed: "워크샵 신청 마감 안내 수정",
  upcoming: "참가 예정 수정",
  waiting: "순번 대기 수정",
  confirmed: "참가 확정 수정",
  canceled: "신청 취소 수정",
  unpaid: "미입금 취소 수정",
};

export default function MessageManage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const type = params.get("type");

  useEffect(() => {
    Header.bus.set({
      title: TITLES[type] ?? "메시지 수정",
      rightButton: { type: "save" },
    });
  }, [type]);

  return <div>{TITLES[type] ?? "메시지 수정"} 페이지</div>;
}
