"use client";

import React, { useState, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
import { fetchPracticeExams } from "@/services/student/studentPracticeApi";
import { PracticeExam } from "@/features/dashboard/types/student";
import PracticeExamCard from "./PracticeExamCard";
import { useRouter, useSearchParams } from "next/navigation";
const StudentPracticeView = () => {
  // const router = useRouter();
  const [filterSubject, setFilterSubject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [exams, setExams] = useState<PracticeExam[]>([]);
  const [allExams, setAllExams] = useState<PracticeExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightExamId, setHighlightExamId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
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
        
        // Store all exams on first load to get all subjects
        if (filterSubject === "all") {
          setAllExams(data);
        }
      } catch (err) {
        console.error("Error loading practice exams:", err);
        setError("Không thể tải danh sách bài luyện tập");
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [filterSubject]);

  // Get unique subjects from ALL exams, not filtered ones
  const subjects = Array.from(new Set(allExams.map((e) => e.subject)));

  const focusExamId = searchParams?.get("focusExamId");

  // Filter + prioritize focused exam
  const filteredExams = useMemo(() => {
    const base = exams.filter((exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!focusExamId) return base;

    const idx = base.findIndex((e) => e.id === focusExamId);
    if (idx === -1) return base;

    const [target] = base.splice(idx, 1);
    return [target, ...base];
  }, [exams, searchTerm, focusExamId]);

  // Highlight focused exam briefly
  useEffect(() => {
    if (focusExamId && exams.some((e) => e.id === focusExamId)) {
      setHighlightExamId(focusExamId);
      const timer = setTimeout(() => setHighlightExamId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [focusExamId, exams]);

  // Handlers
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFilterSubject(e.target.value);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);
  const handleStartExam = (id: string) => {
    router.push(`/exam/${id}`);
  };
  const handleReviewExam = (id: string) => console.log(`Reviewing: ${id}`);
  const handleRetryExam = (id: string) => {
    router.push(`/exam/${id}`);
  };

  return (
    <div className="pb-10">
      <div className="border border-teal-100 rounded-2xl overflow-hidden bg-white shadow-sm">
        {/* --- HEADER --- */}
        <div className="bg-teal-50 px-6 py-4 border-b border-teal-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search Input */}
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Tìm kiếm đề thi..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full bg-white border border-teal-200 text-gray-700 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm hover:border-teal-300 transition-colors shadow-sm"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Subject Filter */}
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-teal-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer text-sm font-medium hover:border-teal-300 transition-colors shadow-sm w-full sm:w-auto"
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
          ) : filteredExams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {searchTerm 
                  ? `Không tìm thấy đề thi nào với từ khóa "${searchTerm}"`
                  : "Không có bài luyện tập nào"}
              </p>
            </div>
          ) : (
            filteredExams.map((exam) => (
              <PracticeExamCard
                key={exam.id}
                exam={exam}
                onStart={handleStartExam}
                onReview={handleReviewExam}
                onRetry={handleRetryExam}
                highlight={highlightExamId === exam.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPracticeView;
