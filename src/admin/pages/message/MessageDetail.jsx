import { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Header from "@admin/layouts/Header";

const TITLES = {
  open: "워크샵 개설 안내",
  closed: "워크샵 신청 마감 안내",
  upcoming: "참가 예정",
  waiting: "순번 대기",
  confirmed: "참가 확정",
  canceled: "신청 취소",
  unpaid: "미입금 취소",
};

export default function MessageDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const type =
    location.state?.type || new URLSearchParams(location.search).get("type");
  const title = location.state?.title || TITLES[type] || "메시지 상세";

  useEffect(() => {
    Header.bus.set({
      title,
      rightButton: {
        type: "edit",
        to: {
          pathname: "/admin/message/manage",
          search: `?id=${id}&type=${type}`,
        },
      },
    });
  }, [id, type, title, navigate]);

  return <div>MessageDetail: {title}</div>;
}
