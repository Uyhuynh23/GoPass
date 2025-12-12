'use client';

import React from 'react';
import { QuestionType } from '@/features/dashboard/types/question';

interface QuestionTypeSummaryProps {
  questionType: QuestionType;
  passageOption: 'none' | 'existing' | 'new';
  passageTitle?: string;
  onEdit: () => void;
}

const QuestionTypeSummary: React.FC<QuestionTypeSummaryProps> = ({
  questionType,
  passageOption,
  passageTitle,
  onEdit,
}) => {
  const getTypeLabel = () => {
    switch (questionType) {
      case 'multiple_choice':
        return 'Trắc nghiệm';
      case 'true_false':
        return 'Đúng/Sai';
      case 'short_answer':
        return 'Câu trả lời ngắn';
      case 'long_answer':
        return 'Tự luận';
      default:
        return '';
    }
  };

  const getTypeColor = () => {
    switch (questionType) {
      case 'multiple_choice':
        return 'bg-blue-100 text-blue-700';
      case 'true_false':
        return 'bg-green-100 text-green-700';
      case 'short_answer':
        return 'bg-yellow-100 text-yellow-700';
      case 'long_answer':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPassageLabel = () => {
    switch (passageOption) {
      case 'none':
        return 'Không có đoạn văn';
      case 'existing':
        return passageTitle || 'Đoạn văn có sẵn';
      case 'new':
        return 'Đoạn văn mới';
      default:
        return '';
    }
  };

  return (
    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-teal-800 mb-3">Thông tin đã chọn</h3>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-xs text-teal-600 block mb-1">Loại câu hỏi</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor()}`}>
                {getTypeLabel()}
              </span>
            </div>
            <div className="w-px h-8 bg-teal-300" />
            <div>
              <span className="text-xs text-teal-600 block mb-1">Đoạn văn</span>
              <span className="text-sm font-medium text-teal-800">{getPassageLabel()}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Chỉnh sửa
        </button>
      </div>
    </div>
  );
};

export default QuestionTypeSummary;
