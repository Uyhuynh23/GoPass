import React from "react";
import { TrendingUp } from "lucide-react";

interface RecommendedExam {
  title: string;
  subject: string;
  views: number;
}

const recommendedExams: RecommendedExam[] = [
  {
    title: "Đề thi thử THPT QG 2025 - Toán",
    subject: "Toán học",
    views: 1250,
  },
  {
    title: "Đề thi thử THPT QG 2025 - Văn",
    subject: "Ngữ văn",
    views: 980,
  },
  {
    title: "Đề thi thử THPT QG 2025 - Anh",
    subject: "Tiếng Anh",
    views: 1430,
  },
];

export function RecommendedWidget() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[var(--gopass-border)] p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[var(--gopass-primary)]" />
        <h3 className="text-[var(--gopass-text)]">Gợi ý cho bạn</h3>
      </div>

      <div className="space-y-4">
        {recommendedExams.map((exam, index) => (
          <a
            key={index}
            href="#"
            className="block p-3 rounded-lg hover:bg-[var(--gopass-background)] transition-colors border border-transparent hover:border-[var(--gopass-border)]"
          >
            <p className="text-[var(--gopass-text)] mb-1 line-clamp-2">
              {exam.title}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--gopass-text-muted)]">
                {exam.subject}
              </span>
            </div>
          </a>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-[var(--gopass-primary)] border border-[var(--gopass-primary)] rounded-lg hover:bg-[var(--gopass-primary)]/5 transition-colors">
        Xem thêm
      </button>
    </div>
  );
}
