"use client";

import React, { useState, useEffect } from "react";
import { ForumArticle, ForumTopic } from "@/features/dashboard/types/forum";
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  MessageCircle,
  Edit,
  FileText,
  User,
} from "lucide-react";
import { ForumService } from "@/services/forum/forum.service";

interface ArticleDetailModalProps {
  article: ForumArticle;
  onClose: () => void;
  onRefresh: () => void;
}

const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onRefresh,
}) => {
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchForumTopics();
  }, [article.id]);

  const fetchForumTopics = async () => {
    setLoading(true);
    try {
      // article.id is the packageId (_id from ForumPackage)
      const topics = await ForumService.getTopicsByPackageId(
        article.id.toString()
      );
      setForumTopics(topics);
    } catch (error) {
      console.error("Error fetching forum topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDiscussions = async () => {
    setGenerating(true);
    try {
      // TODO: Implement generate more topics for existing package
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Tính năng đang được phát triển!");
      fetchForumTopics();
    } catch (error) {
      console.error("Error generating discussions:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chủ đề thảo luận này?")) {
      return;
    }

    try {
      const success = await ForumService.deleteTopic(topicId);
      if (success) {
        setForumTopics(forumTopics.filter((t) => t._id !== topicId));
        alert("Xóa chủ đề thành công!");
      } else {
        alert("Không thể xóa chủ đề. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
      alert("Đã có lỗi xảy ra khi xóa chủ đề.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${article.categoryColor}15`,
                    color: article.categoryColor,
                  }}
                >
                  {article.category}
                </span>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                  VnSocial
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {article.title}
              </h2>
              <p className="text-gray-600">{article.excerpt}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Article Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Nội dung bài viết
            </h3>
            <div className="space-y-2 text-gray-700">
              {article.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Discussion Posts Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Chủ đề thảo luận ({forumTopics.length})
              </h3>
              <button
                onClick={handleGenerateDiscussions}
                disabled={generating}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                {generating ? "Đang tạo..." : "Tạo thêm thảo luận"}
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : forumTopics.length > 0 ? (
              <div className="space-y-6">
                {forumTopics.map((topic, index) => (
                  <div
                    key={topic._id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    {/* Topic Header */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold flex items-center gap-1 border border-indigo-200">
                              <Sparkles className="w-3 h-3" />
                              Chủ đề #{index + 1}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900 text-lg mb-1">
                            {topic.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {topic.stats.totalComments} bình luận
                            </div>
                            <div className="flex items-center gap-1">
                              ❤️ {topic.stats.totalLikes} lượt thích
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTopic(topic._id)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Seed Comment (AI-generated first comment) */}
                    <div className="p-4 bg-amber-50 border-b border-amber-200">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">
                              AI Gợi ý
                            </span>
                            <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded text-xs font-semibold">
                              Seed Comment
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {topic.seedComment}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Essay Prompt */}
                    {topic.essayPrompt && (
                      <div className="p-4 bg-blue-50 border-b border-blue-200">
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h5 className="font-semibold text-blue-900 mb-1">
                              Đề bài nghị luận
                            </h5>
                            <p className="text-blue-800 leading-relaxed">
                              {topic.essayPrompt}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* User Comments Section Placeholder */}
                    <div className="p-4 bg-gray-50">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>
                          {topic.stats.totalComments > 0
                            ? `${topic.stats.totalComments} bình luận từ học sinh`
                            : "Chưa có bình luận từ học sinh"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Chưa có chủ đề thảo luận</p>
                <p className="text-sm text-gray-500 mb-4">
                  Bài viết này chưa có chủ đề thảo luận nào
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-900">
                  {article.likes}
                </span>{" "}
                lượt thích
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  {article.commentsCount}
                </span>{" "}
                bình luận
              </div>
            </div>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Xem trên VnSocial →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailModal;
