"use client";

import React from "react";
import MathText from "@/components/ui/MathText";

interface ReadingPassagePanelProps {
  title: string;
  content: string;
  audioUrl?: string;
}

const ReadingPassagePanel: React.FC<ReadingPassagePanelProps> = ({
  title,
  content,
  audioUrl,
}) => {
  // Hàm xử lý hiển thị nội dung: Tự động tách đoạn khi gặp dấu xuống dòng
  const renderContent = () => {
    // Nếu nội dung đã là HTML (có thẻ <p>, <div>...), render trực tiếp
    if (content.includes("<p>") || content.includes("<br>")) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    // Nếu là text thường: Tách theo dấu xuống dòng
    return content.split("\n").map((paragraph, index) => {
      // Bỏ qua các dòng trống hoàn toàn
      if (!paragraph.trim()) return null;

      return (
        <div key={index} className="mb-4 text-justify">
          {/* mb-4: Tạo khoảng cách giữa các đoạn */}
          <MathText content={paragraph} />
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 shadow-[inset_-10px_0_15px_-10px_rgba(0,0,0,0.03)]">
      {/* === HEADER === */}
      <div className="flex-shrink-0 px-8 py-5 border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-teal-100/50 rounded-lg text-[#00747F]">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
            {title}
          </h3>
        </div>
      </div>

      {/* === CONTENT === */}
      <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar scroll-smooth">
        <div className="prose prose-slate max-w-none">
          <div className="font-sans-serif text-base text-slate-800 leading-7">
            {renderContent()}
          </div>
        </div>
        <div className="h-20" />
      </div>
    </div>
  );
};

export default ReadingPassagePanel;
