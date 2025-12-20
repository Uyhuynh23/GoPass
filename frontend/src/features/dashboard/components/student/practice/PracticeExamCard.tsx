import React from "react";
import { PracticeExam } from "@/features/dashboard/types/student";
import { useRouter } from "next/navigation";
interface PracticeExamCardProps {
  exam: PracticeExam;
  onStart: (id: string) => void;
  onReview: (id: string) => void;
  onRetry: (id: string) => void;
  highlight?: boolean;
}

const PracticeExamCard: React.FC<PracticeExamCardProps> = ({
  exam,
  onStart,
  onReview,
  onRetry,
  highlight = false,
}) => {
  const router = useRouter();

  const handleViewForum = () => {
    if (!exam.forumPackageId || !exam.forumTopicId) return;
    router.push(
      `/dashboard/forum/article/${exam.forumPackageId}?topicId=${exam.forumTopicId}`
    );
  };

  return (
    <div
      className={`group bg-white p-5 rounded-xl border ${
        highlight
          ? "border-amber-300 ring-2 ring-amber-200 shadow-lg animate-[pulse_1.2s_ease-in-out_3]"
          : "border-gray-100 hover:border-teal-200 hover:shadow-md"
      } transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}
    >
      {/* Left Column: Exam Info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-bold text-gray-800 text-base group-hover:text-teal-700 transition-colors">
            {exam.title}
          </h3>

          {/* Badges */}
          {exam.tags.includes("Đã hoàn thành") && (
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Đã hoàn thành
            </span>
          )}
          {exam.tags.includes("Từ contest") && (
            <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Từ contest
            </span>
          )}
          {exam.forumPackageId && exam.forumTopicId && (
            <button
              onClick={handleViewForum}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-200 bg-white text-blue-700 text-[10px] font-semibold shadow-sm hover:border-blue-300 hover:bg-blue-50 hover:shadow transition-all"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.102-1.101m1.396-4.555a4 4 0 005.656 0l3-3a4 4 0 10-5.656-5.656l-1.1 1.1"
                />
              </svg>
              {"Đến diễn đàn"}
            </button>
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
          <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
            <svg
              className="w-3.5 h-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            {exam.subject}
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
            <svg
              className="w-3.5 h-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {exam.duration} phút
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
            <svg
              className="w-3.5 h-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {exam.questionCount} câu
          </span>
        </div>
      </div>

      {/* Right Column: Action Buttons */}
      <div className="flex items-center gap-3 shrink-0">
        {exam.status === "completed" ? (
          <>
            <button
              onClick={() => onReview(exam.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-teal-200 text-teal-700 text-sm font-medium hover:bg-teal-50 hover:border-teal-300 transition-all bg-white shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Xem lại
            </button>
            <button
              onClick={() => onRetry(exam.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-teal-200 text-teal-700 text-sm font-medium hover:bg-teal-50 hover:border-teal-300 transition-all bg-white shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Làm lại
            </button>
          </>
        ) : (
          <button
            onClick={() => onStart(exam.id)}
            className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Bắt đầu
          </button>
        )}
      </div>
    </div>
  );
};

export default PracticeExamCard;
