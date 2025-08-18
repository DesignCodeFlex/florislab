import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@admin/layouts/Header";

export default function WorkshopManage() {
  const location = useLocation();
  const q = new URLSearchParams(location.search);
  const isEdit = !!q.get("id") || q.get("mode") === "edit";

  useEffect(() => {
    Header.bus.set({
      title: isEdit ? "워크샵 수정" : "워크샵 만들기",
      rightButton: { type: "save" },
    });
  }, [isEdit]);

  return <div>WorkshopManage</div>;
}
