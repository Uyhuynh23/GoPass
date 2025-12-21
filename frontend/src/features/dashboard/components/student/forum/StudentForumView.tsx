"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ForumLeftNav } from "./components/ForumLeftNav";
import { ForumTopicCard } from "./components/TopicCard";
import { TopInteractionsWidget } from "./components/TopInteractionsWidget";
import { ForumBanner } from "./components/ForumBanner";
import { ForumService } from "@/services/forum/forum.service";
import { ForumArticle, ForumStats } from "@/features/dashboard/types/forum";

const POSTS_PER_PAGE = 3;

const StudentForumView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("trending");
  const [articles, setArticles] = useState<ForumArticle[]>([]);
  const [forumStats, setForumStats] = useState<ForumStats>({
    totalArticles: 0,
    totalDiscussionPosts: 0,
    totalComments: 0,
    activeUsers: 0,
  });
  const [displayedArticles, setDisplayedArticles] = useState<ForumArticle[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Use getArticles() to match admin view data source
        const articlesData = await ForumService.getArticles();
        setArticles(articlesData);

        // Calculate stats from articles (aggregated from forum topics)
        const stats: ForumStats = {
          totalArticles: articlesData.length,
          totalDiscussionPosts: articlesData.reduce(
            (sum, a) => sum + (a.discussionPostsCount || 0),
            0
          ), // Sum of all forum topics
          totalComments: articlesData.reduce(
            (sum, a) => sum + (a.commentsCount || 0),
            0
          ), // Sum of all comments from all topics
          activeUsers: 0, // This can be calculated separately if needed
        };
        setForumStats(stats);

        // Hiển thị 3 articles đầu tiên
        setDisplayedArticles(articlesData.slice(0, POSTS_PER_PAGE));
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching forum data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);

    // Simulate loading delay
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE;
      const newArticles = articles.slice(startIndex, endIndex);

      setDisplayedArticles((prev) => [...prev, ...newArticles]);
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }, 500);
  };

  const hasMoreArticles = displayedArticles.length < articles.length;

  const handleArticleClick = (article: ForumArticle) => {
    router.push(`/dashboard/forum/article/${article.id}`);
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const articlesData = await ForumService.getArticles();
      setArticles(articlesData);
      setDisplayedArticles(articlesData.slice(0, POSTS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải diễn đàn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Left Navigation */}
          <ForumLeftNav
            activeItem={activeFilter}
            onItemClick={setActiveFilter}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Diễn đàn học tập
              </h1>
              <p className="text-gray-600">
                Kết nối sự kiện thời sự với kiến thức học tập
              </p>
            </div>

            {/* Filter and Sort */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Hiển thị</span>
                  <span className="text-sm font-medium text-blue-600">
                    {articles.length} bài viết
                  </span>
                </div>
                <select className="text-sm border border-gray-200 rounded px-3 py-1.5">
                  <option>Mới nhất</option>
                  <option>Phổ biến nhất</option>
                  <option>Nhiều bình luận nhất</option>
                </select>
              </div>
            </div>

            {/* Articles */}
            <div className="space-y-4 mb-6">
              {displayedArticles.map((article) => (
                <ForumTopicCard
                  key={article.id}
                  topic={article}
                  onClick={() => handleArticleClick(article)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreArticles && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      Đang tải...
                    </span>
                  ) : (
                    "Tải thêm chủ đề"
                  )}
                </button>
              </div>
            )}

            {/* No more articles message */}
            {!hasMoreArticles && displayedArticles.length > 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">
                  Đã hiển thị tất cả {articles.length} bài viết
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              {/* Forum Banner */}
              <ForumBanner />

              {/* Top Interactions */}
              <TopInteractionsWidget
                topTopics={articles
                  .sort((a, b) => b.commentsCount - a.commentsCount)
                  .slice(0, 3)
                  .map((article, index) => ({
                    id: article.id,
                    rank: index + 1,
                    title: article.title,
                    comments: article.commentsCount,
                    category: article.category,
                  }))}
                onTopicClick={(id) =>
                  router.push(`/dashboard/forum/article/${id}`)
                }
              />

              {/* Community Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Thống kê cộng đồng
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Bài viết</span>
                    <span className="text-teal-600 font-semibold">
                      {forumStats.totalArticles.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Chủ đề</span>
                    <span className="text-teal-600 font-semibold">
                      {forumStats.totalDiscussionPosts.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Bình luận</span>
                    <span className="text-teal-600 font-semibold">
                      {forumStats.totalComments.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentForumView;
