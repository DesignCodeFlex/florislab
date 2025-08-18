import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@admin/layouts/Header";

// TODO: 실제 API 연동 전 더미 데이터
const APPLICANTS = [
  { id: "1", title: "봄 시즌 스페셜 클래스 – 튤립 디자인을 함께 해보아요" },
  { id: "2", title: "여름 시즌 클래스 – 라벤더 디자인" },
  { id: "3", title: "가을 시즌 클래스 – 국화 디자인" },
];

export default function ApplicantDetail() {
  const { id } = useParams();
  const applicant = APPLICANTS.find((a) => a.id === id);

  useEffect(() => {
    if (applicant) {
      Header.bus.set({ title: applicant.title });
    } else {
      Header.bus.set({ title: "신청자 상세보기" });
    }
  }, [id, applicant]);

  return (
    <div>
      <p>ApplicantDetail 화면입니다.</p>
      {applicant ? (
        <p>선택된 클래스: {applicant.title}</p>
      ) : (
        <p>잘못된 접근입니다.</p>
      )}
    </div>
  );
}
