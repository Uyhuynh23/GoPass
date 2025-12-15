"use client";

import React, { useState } from "react";
// import { useRouter } from "next/navigation"; 
import { MOCK_PRACTICE_EXAMS } from "@/features/dashboard/data/student/mock-practice-exams";
import PracticeExamCard from "./PracticeExamCard"; // Import component vừa tách

const StudentPracticeView = () => {
  // const router = useRouter(); 
  const [filterSubject, setFilterSubject] = useState("all");

  const filteredExams = MOCK_PRACTICE_EXAMS.filter((exam) => {
    if (filterSubject === "all") return true;
    return exam.subject === filterSubject;
  });

  const subjects = Array.from(new Set(MOCK_PRACTICE_EXAMS.map((e) => e.subject)));

  // Handlers
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => setFilterSubject(e.target.value);
  const handleStartExam = (id: number) => console.log(`Starting: ${id}`);
  const handleReviewExam = (id: number) => console.log(`Reviewing: ${id}`);
  const handleRetryExam = (id: number) => console.log(`Retrying: ${id}`);

  return (
    <div className="pb-10">
      <div className="border border-teal-100 rounded-2xl overflow-hidden bg-white shadow-sm">
        
        {/* --- HEADER --- */}
        <div className="bg-teal-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-teal-100">
          <h2 className="font-bold text-teal-900 flex items-center gap-3 text-lg">
            <span className="text-teal-600 bg-white p-2 rounded-lg border border-teal-100 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
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
               {subjects.map(sub => (
                 <option key={sub} value={sub}>{sub}</option>
               ))}
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
               <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
             </div>
          </div>
        </div>

        {/* --- LIST (Using Component) --- */}
        <div className="p-6 bg-white space-y-4">
          {filteredExams.map((exam) => (
            <PracticeExamCard
              key={exam.id}
              exam={exam}
              onStart={handleStartExam}
              onReview={handleReviewExam}
              onRetry={handleRetryExam}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentPracticeView;