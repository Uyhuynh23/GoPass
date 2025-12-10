"use client";

import React from "react";
import { QuestionTopic } from "@/features/dashboard/types/questionbank";

interface QuestionTopicListProps {
  topics: QuestionTopic[];
}

const QuestionTopicList: React.FC<QuestionTopicListProps> = ({ topics }) => {
  const handleTopicClick = (topicId: string) => {
    console.log("View topic:", topicId);
    // TODO: Navigate to topic detail or show modal
  };

  return (
    <div className="space-y-3">
      {topics.map((topic) => (
        <div
          key={topic.id}
          onClick={() => handleTopicClick(topic.id)}
          className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            {/* Left: Topic Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                <svg
                  className="w-6 h-6 text-teal-600"
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
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {topic.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {topic.questionCount} câu hỏi
                </p>
              </div>
            </div>

            {/* Right: Difficulty Badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                <span className="text-xs font-medium text-green-700">Dễ:</span>
                <span className="text-sm font-bold text-green-700">
                  {topic.difficulty.easy}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-lg">
                <span className="text-xs font-medium text-yellow-700">TB:</span>
                <span className="text-sm font-bold text-yellow-700">
                  {topic.difficulty.medium}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
                <span className="text-xs font-medium text-red-700">Khó:</span>
                <span className="text-sm font-bold text-red-700">
                  {topic.difficulty.hard}
                </span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionTopicList;
