"use client";

import React from "react";
import { ForumArticle } from "@/features/dashboard/types/forum";
import { TrendingUp, MessageCircle, ThumbsUp, Eye } from "lucide-react";

interface ForumTopicCardProps {
  topic: ForumArticle;
  onClick?: () => void;
}

export const ForumTopicCard: React.FC<ForumTopicCardProps> = ({
  topic,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition-all group cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: topic.categoryColor }}
            >
              {topic.category}
            </span>
            {topic.isTrending && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                Trending
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {topic.title}
          </h3>
        </div>
      </div>

      {/* Excerpt */}
      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{topic.excerpt}</p>

      {/* Meta */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
            {topic.source}
          </span>
          <span>•</span>
          <span>{topic.timeAgo}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-gray-600">
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm font-medium">
            {topic.likes.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">
            {topic.commentsCount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
