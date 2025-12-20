"use client";

import React, { useState, useEffect, use } from "react";
// import { useRouter } from "next/navigation";
import { fetchPracticeExams } from "@/services/student/studentPracticeApi";
import { PracticeExam } from "@/features/dashboard/types/student";
import PracticeExamCard from "./PracticeExamCard";
import { useRouter } from "next/navigation";
const StudentPracticeView = () => {
  // const router = useRouter();
  const [filterSubject, setFilterSubject] = useState("all");
  const [exams, setExams] = useState<PracticeExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // Fetch practice exams
  useEffect(() => {
    const loadExams = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPracticeExams(
          filterSubject === "all" ? undefined : filterSubject
        );
        setExams(data);
      } catch (err) {
        console.error("Error loading practice exams:", err);
        setError("Không thể tải danh sách bài luyện tập");
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [filterSubject]);

  // Get unique subjects from exams
  const subjects = Array.from(new Set(exams.map((e) => e.subject)));

  // Handlers
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFilterSubject(e.target.value);
  const handleStartExam = (id: number) => {
    router.push(`/exam/${id}`);
  };
  const handleReviewExam = (id: number) => console.log(`Reviewing: ${id}`);
  const handleRetryExam = (id: number) => console.log(`Retrying: ${id}`);

  return (
    <div className="pb-10">
      <div className="border border-teal-100 rounded-2xl overflow-hidden bg-white shadow-sm">
        {/* --- HEADER --- */}
        <div className="bg-teal-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-teal-100">
          <h2 className="font-bold text-teal-900 flex items-center gap-3 text-lg">
            <span className="text-teal-600 bg-white p-2 rounded-lg border border-teal-100 shadow-sm">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </span>
            Bài luyện tập
          </h2>

          <div className="relative">
            <select
              className="appearance-none bg-white border border-teal-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer text-sm font-medium hover:border-teal-300 transition-colors shadow-sm"
              value={filterSubject}
              onChange={handleFilterChange}
            >
              <option value="all">Tất cả môn học</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* --- LIST (Using Component) --- */}
        <div className="p-6 bg-white space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-600">Đang tải...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Không có bài luyện tập nào</p>
            </div>
          ) : (
            exams.map((exam) => (
              <PracticeExamCard
                key={exam.id}
                exam={exam}
                onStart={handleStartExam}
                onReview={handleReviewExam}
                onRetry={handleRetryExam}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPracticeView;
