"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ForumService } from "@/services/forum/forum.service";
import {
  ForumArticle,
  ForumTopic,
  ForumComment,
} from "@/features/dashboard/types/forum";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Eye,
  Clock,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ArticleDetailPage({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [articleId, setArticleId] = useState<string>("");
  const [article, setArticle] = useState<ForumArticle | null>(null);
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<{
    [key: string]: boolean;
  }>({});
  const [topicLikes, setTopicLikes] = useState<{ [key: string]: boolean }>({});
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [topicComments, setTopicComments] = useState<{
    [key: string]: ForumComment[];
  }>({});
  const [replyingTo, setReplyingTo] = useState<{
    [key: string]: string | null;
  }>({});
  const [expandedReplies, setExpandedReplies] = useState<{
    [key: string]: boolean;
  }>({});
  const topicRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [targetTopicId, setTargetTopicId] = useState<string | null>(null);

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setArticleId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Fetch article and topics data
  useEffect(() => {
    const fetchData = async () => {
      if (!articleId) return;

      setLoading(true);
      try {
        // Fetch article by ID (this is actually a ForumPackage)
        const articleData = await ForumService.getArticleById(articleId);
        setArticle(articleData);
        console.log("Fetched article data:", articleData);

        // Fetch forum topics for this package
        const topics = await ForumService.getTopicsByPackageId(articleId);
        setForumTopics(topics);

        // Auto-expand topic if topicId is provided via query
        const topicIdFromQuery = searchParams?.get("topicId");
        if (topicIdFromQuery) {
          setExpandedTopics((prev) => ({ ...prev, [topicIdFromQuery]: true }));
          setTargetTopicId(topicIdFromQuery);
        }
      } catch (error) {
        console.error("Error fetching article data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articleId, searchParams]);

  useEffect(() => {
    if (!targetTopicId) return;
    const node = topicRefs.current[targetTopicId];
    if (!node) return;

    // Scroll slightly after render to ensure layout is ready
    const timer = setTimeout(() => {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);

    return () => clearTimeout(timer);
  }, [targetTopicId, forumTopics]);

  const toggleTopic = async (topicId: string) => {
    const isExpanding = !expandedTopics[topicId];

    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: isExpanding,
    }));

    // Fetch comments when expanding
    if (isExpanding && !topicComments[topicId]) {
      try {
        const comments = await ForumService.getTopicComments(topicId);
        setTopicComments((prev) => ({
          ...prev,
          [topicId]: comments,
        }));
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  const toggleTopicLike = async (topicId: string) => {
    try {
      if (topicLikes[topicId]) {
        await ForumService.unlikeTopic(topicId);
      } else {
        await ForumService.likeTopic(topicId);
      }
      setTopicLikes((prev) => ({
        ...prev,
        [topicId]: !prev[topicId],
      }));

      // Refresh topics to update like count
      const topics = await ForumService.getTopicsByPackageId(articleId);
      setForumTopics(topics);
    } catch (error) {
      console.error("Error toggling topic like:", error);
    }
  };

  const handleSubmitComment = async (topicId: string) => {
    const commentText = newComments[topicId];
    if (!commentText || !commentText.trim()) return;

    const parentCommentId = replyingTo[topicId];

    try {
      if (parentCommentId) {
        // Reply to a comment
        await ForumService.createReply(parentCommentId, commentText);
      } else {
        // Top-level comment
        await ForumService.createComment(topicId, commentText);
      }

      // Clear input and reply state
      setNewComments((prev) => ({ ...prev, [topicId]: "" }));
      setReplyingTo((prev) => ({ ...prev, [topicId]: null }));

      // Refresh comments for this topic
      const comments = await ForumService.getTopicComments(topicId);
      setTopicComments((prev) => ({
        ...prev,
        [topicId]: comments,
      }));

      // Refresh topics to update counts
      const topics = await ForumService.getTopicsByPackageId(articleId);
      setForumTopics(topics);
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Không thể gửi bình luận. Vui lòng thử lại.");
    }
  };

  const handleReplyClick = (
    topicId: string,
    commentId: string,
    authorName: string
  ) => {
    setReplyingTo((prev) => ({ ...prev, [topicId]: commentId }));
    setNewComments((prev) => ({
      ...prev,
      [topicId]: `@${authorName} `,
    }));
    // Expand replies for this comment
    setExpandedReplies((prev) => ({ ...prev, [commentId]: true }));
  };

  const handleCancelReply = (topicId: string, commentId?: string) => {
    setReplyingTo((prev) => ({ ...prev, [topicId]: null }));
    setNewComments((prev) => ({ ...prev, [topicId]: "" }));
    // Collapse replies when canceling
    if (commentId) {
      setExpandedReplies((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const renderComment = (
    comment: ForumComment,
    topicId: string,
    depth: number = 0
  ) => {
    const isAISeed = comment.isAISeed;
    const paddingLeft = depth * 32;
    const isReplyingToThis = replyingTo[topicId] === comment._id;

    return (
      <div key={comment._id} className="space-y-2">
        <div
          onClick={() => {
            const authorName = isAISeed
              ? "AI Assistant"
              : comment.author?.name || "user";
            handleReplyClick(topicId, comment._id, authorName);
          }}
          className={`p-4 rounded-lg transition-all cursor-pointer ${
            isAISeed
              ? "bg-amber-50 border-l-4 border-amber-400 hover:bg-amber-100"
              : "bg-white border border-gray-200 hover:border-teal-300 hover:shadow-sm"
          }`}
          style={{ marginLeft: `${paddingLeft}px` }}
        >
          <div className="flex items-start gap-3">
            {isAISeed ? (
              <div className="flex-shrink-0 w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-700" />
              </div>
            ) : (
              <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-teal-700">
                  {comment.author?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">
                  {isAISeed
                    ? "AI Assistant"
                    : comment.author?.name || "Anonymous"}
                </span>
                {isAISeed && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                    🤖 Seed Comment
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-2">
                {comment.content}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="text-teal-600 font-medium">
                  Nhấp để trả lời
                </span>
                {comment.likes && comment.likes.length > 0 && (
                  <span>{comment.likes.length} thích</span>
                )}
                {comment.replies && comment.replies.length > 0 && (
                  <span>{comment.replies.length} phản hồi</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reply Input - Show below this comment if replying to it */}
        {isReplyingToThis && (
          <div
            className="bg-white p-4 rounded-lg border-2 border-teal-200 shadow-sm"
            style={{ marginLeft: `${paddingLeft}px` }}
          >
            <div className="mb-2 flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
              <span className="text-sm text-blue-700">
                Đang trả lời{" "}
                {isAISeed
                  ? "AI Assistant"
                  : comment.author?.name || "người dùng"}
                ...
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelReply(topicId, comment._id);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Hủy
              </button>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Nhập câu trả lời..."
                value={newComments[topicId] || ""}
                onChange={(e) =>
                  setNewComments((prev) => ({
                    ...prev,
                    [topicId]: e.target.value,
                  }))
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment(topicId);
                  }
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                autoFocus
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmitComment(topicId);
                }}
                disabled={!newComments[topicId]?.trim()}
                className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Send className="w-4 h-4" />
                Trả lời
              </button>
            </div>
          </div>
        )}

        {/* Render replies recursively - only when expanded */}
        {comment.replies &&
          comment.replies.length > 0 &&
          expandedReplies[comment._id] && (
            <div className="space-y-2">
              {comment.replies.map((reply) =>
                renderComment(reply, topicId, depth + 1)
              )}
            </div>
          )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy bài viết</p>
          <Link
            href="/dashboard/forum"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại diễn đàn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <Link
          href="/dashboard/forum"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại diễn đàn</span>
        </Link>

        {/* Package Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="inline-block px-3 py-1 rounded text-sm font-medium text-white"
                style={{ backgroundColor: article.categoryColor || "#3B82F6" }}
              >
                {article.category || "Tổng hợp"}
              </span>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                {article.source || "VnSocial"}
              </span>
              <span className="text-sm text-gray-500">• {article.timeAgo}</span>
            </div>

            {/* Package Title - from ForumPackage.packageTitle */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {/* Package Summary - from ForumPackage.packageSummary */}
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  <span>{forumTopics.length} chủ đề thảo luận</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4" />
                  <span>
                    {forumTopics.reduce(
                      (sum, t) => sum + (t.stats?.totalLikes || 0),
                      0
                    )}{" "}
                    lượt thích
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Discussion Topics Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-transparent">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-teal-600" />
              Chủ đề thảo luận ({forumTopics.length})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Tham gia thảo luận về các khía cạnh khác nhau của bài viết
            </p>
          </div>

          {/* Topics List */}
          <div className="space-y-6 p-6">
            {forumTopics.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  Chưa có chủ đề thảo luận nào
                </p>
                <p className="text-sm mt-1">
                  Các chủ đề sẽ được tạo tự động bởi AI
                </p>
              </div>
            ) : (
              forumTopics.map((topic) => (
                <div
                  key={topic._id}
                  className="bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Topic Header - Clickable to expand/collapse */}
                  <div
                    onClick={() => toggleTopic(topic._id)}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer border-b-2 border-gray-200"
                  >
                    <div className="mb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {topic.seedComment && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                                🤖 AI Seed
                              </span>
                            )}
                            {topic.essayPrompt && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                ✍️ Gợi ý viết
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(topic.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>

                          {/* Topic Title */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {topic.title}
                          </h3>
                          {topic.examId && (
                            <button
                              onClick={() =>
                                router.push(
                                  `/dashboard/practice?focusExamId=${topic.examId}`
                                )
                              }
                              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
                            >
                              <Sparkles className="w-4 h-4" />
                              Luyện đề liên quan
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => toggleTopic(topic._id)}
                          className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                        >
                          {expandedTopics[topic._id] ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Thu gọn
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Xem thảo luận
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Essay Prompt (if exists) - shown as a hint, not part of comment thread */}
                    {topic.essayPrompt && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r mb-3">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          💡 Gợi ý viết bài:
                        </p>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          {topic.essayPrompt}
                        </p>
                      </div>
                    )}

                    {/* Topic Stats & Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTopicLike(topic._id);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          topicLikes[topic._id]
                            ? "bg-teal-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{topic.stats?.totalLikes || 0}</span>
                      </button>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <MessageCircle className="w-4 h-4" />
                        <span>{topic.stats?.totalComments || 0} bình luận</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content - Comments Thread */}
                  {expandedTopics[topic._id] && (
                    <div className="px-6 pb-6 pt-4 bg-gray-50">
                      {/* Comment Input - At the top for new comments only */}
                      {!replyingTo[topic._id] && (
                        <div className="bg-white p-4 rounded-lg border-2 border-teal-100 mb-4 shadow-sm">
                          <div className="flex gap-3">
                            <input
                              type="text"
                              placeholder="Viết bình luận của bạn..."
                              value={newComments[topic._id] || ""}
                              onChange={(e) =>
                                setNewComments((prev) => ({
                                  ...prev,
                                  [topic._id]: e.target.value,
                                }))
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSubmitComment(topic._id);
                                }
                              }}
                              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                            <button
                              onClick={() => handleSubmitComment(topic._id)}
                              disabled={!newComments[topic._id]?.trim()}
                              className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                              <Send className="w-4 h-4" />
                              Gửi
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Comments Thread */}
                      <div className="space-y-3">
                        {topicComments[topic._id] &&
                        topicComments[topic._id].length > 0 ? (
                          topicComments[topic._id]
                            .filter((comment) => !comment.parentComment) // Only top-level comments
                            .sort((a, b) => {
                              // AI comments first
                              if (a.isAISeed && !b.isAISeed) return -1;
                              if (!a.isAISeed && b.isAISeed) return 1;
                              // Then by date
                              return (
                                new Date(a.createdAt).getTime() -
                                new Date(b.createdAt).getTime()
                              );
                            })
                            .map((comment) =>
                              renderComment(comment, topic._id, 0)
                            )
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm">
                              Chưa có bình luận. Hãy là người đầu tiên chia sẻ ý
                              kiến!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
