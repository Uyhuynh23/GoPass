"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui";
import { TeacherClass } from "../../types/teacher";

interface ClassCardProps {
  classData: TeacherClass;
  onEdit?: (classId: string) => void;
  onDelete?: (classId: string) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ 
  classData, 
  onEdit, 
  onDelete 
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/dashboard/teacher/classes/${classData.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(classData.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(classData.id);
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {classData.subject.charAt(0)}
          </span>
        </div>
        <div className="flex items-center gap-1 action-buttons">
          {onEdit && (
            <button
              onClick={handleEditClick}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Chỉnh sửa"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
            {classData.name}
          </h3>
          <Badge className="bg-gray-100 text-gray-700 text-xs">
            {classData.grade}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {classData.description}
        </p>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>Mã lớp:</span>
          <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">
            {classData.classCode}
          </code>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-semibold text-teal-600">
            {classData.studentCount}
          </div>
          <div className="text-xs text-gray-500">Học sinh</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">
            {classData.examCount}
          </div>
          <div className="text-xs text-gray-500">Đề thi</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-orange-600">
            8.5
          </div>
          <div className="text-xs text-gray-500">Điểm TB</div>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-center text-sm text-teal-600 font-medium">
          Click để xem chi tiết →
        </div>
      </div>
    </div>
  );
};

export default ClassCard;