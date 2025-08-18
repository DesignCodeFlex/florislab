import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "@admin/layouts/Header";

export default function WorkshopDetail() {
  const { id } = useParams();
  const location = useLocation();
  const wsData = location.state; // 목록에서 전달받은 워크샵 데이터 (id, title, status)

  useEffect(() => {
    if (!wsData) {
      Header.bus.set({ title: "워크샵 상세" });
      return;
    }

    const { title, status } = wsData;

    if (status === "Ready") {
      // 준비중 → 수정 버튼
      Header.bus.set({
        title,
        rightButton: {
          type: "edit",
          to: {
            pathname: "/admin/workshop/manage",
            search: `?id=${id}&mode=edit`,
          },
        },
      });
    } else {
      // 준비중이 아닌 경우 → 설정 버튼
      Header.bus.set({
        title,
        rightButton: { type: "settings" },
      });
    }
  }, [id, wsData]);

  return <div>WorkshopDetail: {wsData?.title ?? id}</div>;
}
