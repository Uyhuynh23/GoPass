"use client";

import React, { useState, useMemo } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import AdminStatsGrid from "./AdminStatsGrid";
import AdminActionToolbar from "./AdminActionToolbar";
import ExamManagementTable from "./ExamManagementTable";
import { ExamMode } from "@/features/exam/types";

const AdminDashboardView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ExamMode | "all">("all");

  // TODO: Fetch from API
  const exams: any[] = [];
  const stats = {
    totalExams: 0,
    contestExams: 0,
    publicExams: 0,
    totalParticipants: 0,
  };

  // Filter exams based on search and filter
  const filteredExams = useMemo(() => {
    let filtered = exams;

    // Filter by mode
    if (filterType !== "all") {
      filtered = filtered.filter((exam) => exam.mode === filterType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exam) =>
          exam.title.toLowerCase().includes(query) ||
          exam.subject.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, filterType]);

  const handleCreateNew = () => {
    console.log("Create new exam");
    // TODO: Navigate to exam creation page
  };

  const handleView = (examId: string) => {
    console.log("View exam:", examId);
    // TODO: Navigate to exam detail page
  };

  const handleEdit = (examId: string) => {
    console.log("Edit exam:", examId);
    // TODO: Navigate to exam edit page
  };

  const handleDelete = (examId: string) => {
    console.log("Delete exam:", examId);
    // TODO: Show confirmation dialog and delete
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <SectionHeader
        title="Quản lý đề thi"
        subtitle={`Đề thi do Admin tạo - Tổng cộng ${exams.length} đề`}
      />

      {/* Stats Grid */}
      <AdminStatsGrid stats={stats} />

      {/* Action Toolbar */}
      <AdminActionToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterType={filterType}
        onFilterChange={setFilterType}
        onCreateNew={handleCreateNew}
      />

      {/* Exam List */}
      {filteredExams.length > 0 ? (
        <ExamManagementTable
          exams={filteredExams}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Không tìm thấy đề thi nào
          </h3>
          <p className="text-gray-500">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardView;
