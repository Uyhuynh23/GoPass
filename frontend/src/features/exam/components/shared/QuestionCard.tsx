"use client";

import React from "react";
import { Question } from "@/features/exam/types";
import MathText from "@/components/ui/MathText";
// Import đầy đủ các loại input
import MultipleChoiceInput from "@/features/exam/components/question-types/MultipleChoiceInput";
import TrueFalseInput from "@/features/exam/components/question-types/TrueFalseInput";
import ShortAnswerInput from "@/features/exam/components/question-types/ShortAnswerInput";
import EssayInput from "@/features/exam/components/question-types/EssayInput";

// --- SUB-COMPONENTS ---

const QuestionImage = ({
  data,
}: {
  data: { url: string; caption?: string };
}) => (
  <div className="my-5 flex flex-col items-center">
    <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm max-w-full">
      <img
        src={data.url}
        alt="Question illustration"
        className="max-h-[400px] w-auto object-contain bg-slate-50"
      />
    </div>
    {data.caption && (
      <p className="mt-2 text-sm text-slate-500 italic text-center">
        {data.caption}
      </p>
    )}
  </div>
);

const QuestionTable = ({
  data,
}: {
  data: { headers: string[]; rows: string[][] };
}) => (
  <div className="my-6 flex justify-center">
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm inline-block max-w-full">
      <table className="min-w-full text-sm text-slate-700">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {data.headers.map((head, i) => (
              <th
                key={i}
                className="px-6 py-3 font-bold text-center whitespace-nowrap text-slate-800 uppercase text-xs tracking-wider"
              >
                <MathText content={head} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-3 text-center whitespace-nowrap"
                >
                  <MathText content={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

interface QuestionCardProps {
  // Data props
  question: Question;
  questionNumber: number;
  sectionName: string;
  points: number;

  // Interaction props
  selectedAnswer?: string[] | string | Record<string, string>;
  onAnswerChange: (answer: string[] | string | Record<string, string>) => void;
  isFlagged: boolean;
  onToggleFlag: () => void;

  // Review Mode Props
  isReviewMode?: boolean;
  userScore?: number;
  maxScore?: number;
  correctAnswer?: any;
  explanation?: string;
  feedback?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  sectionName,
  points,
  selectedAnswer,
  onAnswerChange,
  isFlagged,
  onToggleFlag,
  isReviewMode = false,
  userScore = 0,
  maxScore = points,
  correctAnswer,
  explanation,
  feedback,
}) => {
  // Logic kiểm tra đúng sai
  const isCorrect = isReviewMode && Math.abs(userScore - maxScore) < 0.0001;
  const isEssay = question.type === "essay";

  // --- RENDER INPUT AREA ---
  const renderQuestionInput = () => {
    const commonProps = {
      disabled: isReviewMode,
    };

    switch (question.type) {
      // 1. TRẮC NGHIỆM
      case "multiple_choice":
        return (
          <div className="mt-5">
            <MultipleChoiceInput
              options={question.options || []}
              selectedOptions={
                Array.isArray(selectedAnswer) ? selectedAnswer : []
              }
              onChange={(val) => !isReviewMode && onAnswerChange(val)}
              correctAnswerId={
                isReviewMode ? (correctAnswer as string) : undefined
              }
              {...commonProps}
            />
          </div>
        );

      // 2. ĐÚNG / SAI
      case "true_false":
        // FIX LỖI CLICK: Parse JSON nếu selectedAnswer là string
        let parsedTrueFalse: Record<string, string> = {};
        if (
          typeof selectedAnswer === "object" &&
          selectedAnswer !== null &&
          !Array.isArray(selectedAnswer)
        ) {
          parsedTrueFalse = selectedAnswer as Record<string, string>;
        } else if (typeof selectedAnswer === "string") {
          try {
            // Cố gắng parse string thành object để component con hiểu được
            parsedTrueFalse = JSON.parse(selectedAnswer);
          } catch (e) {
            console.error("Error parsing True/False answer:", e);
          }
        }

        let parsedCorrectAnswerTF: Record<string, string> | undefined =
          undefined;
        if (isReviewMode && correctAnswer) {
          parsedCorrectAnswerTF =
            typeof correctAnswer === "string"
              ? JSON.parse(correctAnswer)
              : correctAnswer;
        }

        return (
          <div className="mt-6 w-full">
            <TrueFalseInput
              options={question.options || []}
              selectedAnswer={parsedTrueFalse}
              onChange={(newVal) => !isReviewMode && onAnswerChange(newVal)}
              correctAnswer={parsedCorrectAnswerTF}
              {...commonProps}
            />
          </div>
        );

      // 3. ĐIỀN ĐÁP ÁN NGẮN
      case "short_answer":
        let shortAnsValue = "";
        if (typeof selectedAnswer === "string") {
          shortAnsValue = selectedAnswer;
        } else if (Array.isArray(selectedAnswer) && selectedAnswer.length > 0) {
          shortAnsValue = selectedAnswer[0];
        }

        return (
          <div className="mt-5 w-full flex justify-center">
            <ShortAnswerInput
              value={shortAnsValue}
              onChange={(val) => !isReviewMode && onAnswerChange(val)}
              {...commonProps}
            />
          </div>
        );

      // 4. TỰ LUẬN
      case "essay":
        let essayValue = "";
        if (typeof selectedAnswer === "string") {
          essayValue = selectedAnswer;
        }

        return (
          <div className="mt-5">
            <EssayInput
              value={essayValue}
              onChange={(val) => !isReviewMode && onAnswerChange(val)}
              {...commonProps}
            />
          </div>
        );

      default:
        return (
          <div className="p-4 text-red-500 italic">
            Loại câu hỏi chưa hỗ trợ: {question.type}
          </div>
        );
    }
  };

  // --- HELPER: RENDER TEXT ĐÁP ÁN ĐÚNG ---
  const renderCorrectAnswerText = () => {
    if (!correctAnswer) return null;

    // 1. TRẮC NGHIỆM: Hiển thị "A. Nội dung"
    if (question.type === "multiple_choice") {
      const option = question.options?.find((o) => o.id === correctAnswer);
      const content = option
        ? `${option.id}. ${option.content}`
        : correctAnswer;
      return (
        <div className="font-bold text-base text-emerald-800">
          <MathText content={content} />
        </div>
      );
    }

    // 2. ĐÚNG/SAI: Hiển thị dạng Badges (Thẻ)
    if (question.type === "true_false") {
      const answerObj =
        typeof correctAnswer === "string"
          ? JSON.parse(correctAnswer)
          : correctAnswer;

      // HÀM CHUYỂN ĐỔI: Chuyển true/false sang "ĐÚNG"/"SAI"
      const formatValue = (value: boolean | string) => {
        if (typeof value === "boolean") {
          return value ? "ĐÚNG" : "SAI";
        }
        // Trường hợp giá trị đã là chuỗi ('Đúng', 'Sai', 'true', 'false')
        const upperVal = String(value).toUpperCase();
        if (upperVal === "TRUE" || upperVal === "ĐÚNG") return "ĐÚNG";
        if (upperVal === "FALSE" || upperVal === "SAI") return "SAI";
        return upperVal; // Giá trị khác
      };

      return (
        <div className="flex flex-wrap gap-3 mt-1">
          {Object.entries(answerObj).map(([key, val]) => {
            const valueToFormat = val as string | boolean;
            return (
              <span
                key={key}
                className="px-3 py-1 bg-white rounded-md border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm uppercase"
              >
                {/* SỬA: Dùng hàm formatValue để hiển thị "ĐÚNG" hoặc "SAI" */}
                {key}: {formatValue(valueToFormat)}
              </span>
            );
          })}
        </div>
      );
    }

    // 3. MẶC ĐỊNH (Short Answer / Essay):
    // CẬP NHẬT: Cho in đậm (font-bold) và màu xanh (text-emerald-800) giống hệt Multiple Choice
    return (
      <div className="font-bold text-base text-emerald-800">
        <MathText content={String(correctAnswer)} />
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-8">
      {/* CARD CONTAINER */}
      <div
        className={`bg-white rounded-[2rem] border overflow-hidden transition-all duration-300 
          ${
            isReviewMode
              ? isCorrect
                ? "border-emerald-500 ring-1 ring-emerald-500 shadow-emerald-100"
                : isEssay
                ? "border-blue-300 ring-1 ring-blue-300"
                : "border-red-500 ring-1 ring-red-500 shadow-red-100"
              : "border-slate-200 shadow-sm"
          }`}
      >
        {/* HEADER SECTION */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md text-white font-bold font-mono text-xl transition-colors
                    ${
                      !isReviewMode
                        ? "bg-[#00747F] shadow-teal-900/10"
                        : isCorrect
                        ? "bg-emerald-500 shadow-emerald-900/10"
                        : "bg-red-500 shadow-red-900/10"
                    }`}
                >
                  {questionNumber}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Câu hỏi {questionNumber}
                </h3>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="px-2.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-100">
                    {sectionName}
                  </span>
                  {isReviewMode ? (
                    <span
                      className={`px-2.5 py-0.5 rounded border ${
                        isCorrect
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {userScore}/{maxScore} điểm
                    </span>
                  ) : (
                    <span className="text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                      {points} điểm
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!isReviewMode && (
              <button
                onClick={onToggleFlag}
                className={`p-2 rounded-xl transition-all ${
                  isFlagged
                    ? "bg-amber-50 text-amber-500"
                    : "text-slate-300 hover:text-slate-500"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${
                    isFlagged ? "fill-current" : "fill-none"
                  }`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="mt-5 space-y-5">
            <div className="text-base text-slate-800 font-medium leading-7">
              <MathText content={question.content} />
            </div>
            {question.image && <QuestionImage data={question.image} />}
            {question.tableData && <QuestionTable data={question.tableData} />}
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="px-6 pb-8 pt-2 bg-white min-h-[100px]">
          {renderQuestionInput()}
        </div>

        {/* --- REVIEW FOOTER SECTION --- */}
        {isReviewMode && (
          <div className="border-t border-slate-200 bg-slate-50/50 divide-y divide-slate-200/60 animate-in slide-in-from-top-2 duration-300">
            {/* ĐÁP ÁN ĐÚNG */}
            {correctAnswer && !isEssay && (
              <div className="px-6 py-4 bg-emerald-50/30">
                <p className="text-xs font-bold text-emerald-600 uppercase mb-2 flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Đáp án chính xác
                </p>
                <div className="pl-6">{renderCorrectAnswerText()}</div>
              </div>
            )}

            {/* LỜI PHÊ (Tự luận) */}
            {isEssay && feedback && (
              <div className="px-6 py-4 bg-blue-50/40">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">✍️</span>
                  <p className="text-xs font-bold text-blue-600 uppercase">
                    Lời phê:
                  </p>
                </div>
                <div className="text-slate-700 text-sm leading-relaxed bg-white p-3 rounded-lg border border-blue-100 italic shadow-sm">
                  <MathText content={feedback} />
                </div>
              </div>
            )}

            {/* LỜI GIẢI CHI TIẾT */}
            {explanation && (
              <div className="px-6 py-5 bg-slate-50">
                <div className="flex items-center gap-2 mb-3 text-slate-500">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-slate-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-bold text-sm uppercase tracking-wide text-slate-600">
                    Lời giải chi tiết
                  </span>
                </div>
                <div className="text-slate-800 text-sm leading-relaxed pl-4 border-l-2 border-slate-300 ml-3 bg-white p-4 rounded-r-lg shadow-sm">
                  <MathText content={explanation} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
