import React from "react";
import { Trophy, Flame, MessageCircle } from "lucide-react";

interface TopTopic {
  id: string;
  rank: number;
  title: string;
  comments: number;
  category: string;
}

interface TopInteractionsWidgetProps {
  topTopics: TopTopic[];
  onTopicClick?: (id: string) => void;
}

export function TopInteractionsWidget({ topTopics, onTopicClick }: TopInteractionsWidgetProps) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-white";
      case 2:
        return "bg-gray-400 text-white";
      case 3:
        return "bg-orange-600 text-white";
      default:
        return "bg-gray-200 text-gray-900";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[var(--gopass-border)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-[var(--gopass-primary)]" />
        <h3 className="text-gray-900">Top Tương Tác</h3>
      </div>

      <div className="space-y-4">
        {topTopics.length > 0 ? (
          topTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onTopicClick?.(topic.id)}
              className="block group cursor-pointer"
            >
              <div className="flex gap-3 items-start">
                {/* Rank Badge */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getRankColor(
                    topic.rank
                  )}`}
                >
                  {topic.rank}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 line-clamp-2 mb-1 group-hover:text-[var(--gopass-primary)] transition-colors">
                    {topic.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span>{topic.category}</span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {topic.comments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            Chưa có dữ liệu
          </div>
        )}
      </div>

      <button className="w-full mt-4 py-2 text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm">
        Xem tất cả
      </button>
    </div>
  );
}