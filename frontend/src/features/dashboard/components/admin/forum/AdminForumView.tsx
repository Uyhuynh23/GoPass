"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Plus, RefreshCw, Trash2, Edit, Eye } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  ForumArticle,
  ForumDiscussionPost,
} from "@/features/dashboard/types/forum";
import { ForumService } from "@/services/forum/forum.service";
import AdminForumStats from "@/features/dashboard/components/admin/forum/AdminForumStats";
import ArticleCard from "@/features/dashboard/components/admin/forum/ArticleCard";
import ArticleDetailModal from "@/features/dashboard/components/admin/forum/ArticleDetailModal";
import GenerateArticleModal from "@/features/dashboard/components/admin/forum/GenerateArticleModal";

// Mock data for testing
const MOCK_ARTICLES: ForumArticle[] = [
  {
    id: "1",
    title: "Thuỳ Tiên bị bắt 2 năm: Bài học về danh hiệu và trách nhiệm xã hội",
    content: [
      "Vụ việc Hoa hậu Thuỳ Tiên bị bắt với mức án 2 năm tù đã gây chấn động dư luận. Đây là một trong những vụ việc pháp lý nghiêm trọng liên quan đến người nổi tiếng trong thời gian gần đây, đặt ra nhiều câu hỏi về đạo đức và trách nhiệm của những người có ảnh hưởng trong xã hội.",
      "Việc này cũng mở ra cuộc thảo luận sâu rộng về vai trò của pháp luật trong việc quản lý hành vi của người nổi tiếng và tầm quan trọng của việc giữ gìn hình ảnh công chúng.",
      "Nhiều chuyên gia cho rằng người nổi tiếng cần có ý thức cao hơn về trách nhiệm xã hội của mình, vì hành động của họ có thể ảnh hưởng đến hàng triệu người theo dõi.",
    ],
    excerpt:
      "Vụ việc này đặt ra nhiều câu hỏi về đạo đức, luật pháp và vai trò của người nổi tiếng trong xã hội hiện đại.",
    category: "Xã hội",
    categoryColor: "#3B82F6",
    source: "VnSocial",
    sourceUrl: "https://vnsocial.vn/article/1",
    timeAgo: "2 giờ trước",
    views: 2458,
    likes: 342,
    discussionPostsCount: 3,
    commentsCount: 248,
    isTrending: true,
    createdAt: "2025-12-19T10:00:00Z",
    updatedAt: "2025-12-19T10:00:00Z",
    tags: ["pháp luật", "xã hội", "người nổi tiếng"],
    relatedExamId: "exam_1",
    forumTopics: [],
  },
  {
    id: "2",
    title:
      "AI có thể thay thế giáo viên không? Quan điểm từ nghiên cứu mới nhất",
    content: [
      "Công nghệ AI đang phát triển nhanh chóng trong lĩnh vực giáo dục. Tuy nhiên, nghiên cứu mới nhất cho thấy vai trò của con người trong giáo dục vẫn không thể thay thế hoàn toàn.",
      "Các chuyên gia cho rằng AI chỉ nên được sử dụng như một công cụ hỗ trợ, không phải thay thế hoàn toàn giáo viên trong việc truyền đạt kiến thức và định hướng phát triển cho học sinh.",
      "Sự tương tác trực tiếp giữa giáo viên và học sinh mang lại những giá trị về cảm xúc, đồng cảm và kỹ năng mềm mà AI hiện tại chưa thể đáp ứng được.",
    ],
    excerpt:
      "Công nghệ AI đang phát triển nhanh chóng, nhưng vai trò của con người trong giáo dục vẫn không thể thay thế.",
    category: "Khoa học",
    categoryColor: "#10B981",
    source: "VnSocial",
    sourceUrl: "https://vnsocial.vn/article/2",
    timeAgo: "4 giờ trước",
    views: 1892,
    likes: 278,
    discussionPostsCount: 4,
    commentsCount: 189,
    isTrending: true,
    createdAt: "2025-12-19T08:00:00Z",
    updatedAt: "2025-12-19T08:00:00Z",
    tags: ["AI", "giáo dục", "công nghệ"],
    relatedExamId: "exam_2",
    forumTopics: [],
  },
  {
    id: "3",
    title: "Văn học Việt Nam trong thời đại số: Cơ hội hay thách thức?",
    content: [
      "Sự phát triển của mạng xã hội và nền tảng số đang thay đổi cách chúng ta tiếp cận và sáng tạo văn học.",
      "Nhiều tác giả trẻ đã tìm được tiếng nói của mình qua các nền tảng trực tuyến, mở ra cơ hội mới cho sự sáng tạo văn học.",
      "Tuy nhiên, điều này cũng đặt ra thách thức về chất lượng và bản quyền trong môi trường số.",
    ],
    excerpt:
      "Sự phát triển của mạng xã hội và nền tảng số đang thay đổi cách chúng ta tiếp cận và sáng tạo văn học.",
    category: "Văn hóa",
    categoryColor: "#8B5CF6",
    source: "VnSocial",
    sourceUrl: "https://vnsocial.vn/article/3",
    timeAgo: "5 giờ trước",
    views: 1567,
    likes: 234,
    discussionPostsCount: 3,
    commentsCount: 156,
    isTrending: false,
    createdAt: "2025-12-19T07:00:00Z",
    updatedAt: "2025-12-19T07:00:00Z",
    tags: ["văn học", "số hóa", "sáng tạo"],
    relatedExamId: "exam_3",
    forumTopics: [],
  },
  {
    id: "4",
    title: "Biến đổi khí hậu và giải pháp bền vững cho Việt Nam",
    content: [
      "Biến đổi khí hậu đang tác động nghiêm trọng đến Việt Nam, đặc biệt là vùng đồng bằng sông Cửu Long.",
      "Các nhà khoa học đề xuất nhiều giải pháp bền vững, từ chuyển đổi nông nghiệp xanh đến phát triển năng lượng tái tạo.",
      "Sự tham gia của cộng đồng là yếu tố quan trọng để các giải pháp này thành công.",
    ],
    excerpt:
      "Biến đổi khí hậu đang đặt ra thách thức lớn, nhưng Việt Nam đang tích cực tìm kiếm các giải pháp bền vững.",
    category: "Khoa học",
    categoryColor: "#10B981",
    source: "VnSocial",
    sourceUrl: "https://vnsocial.vn/article/4",
    timeAgo: "1 ngày trước",
    views: 1234,
    likes: 189,
    discussionPostsCount: 4,
    commentsCount: 95,
    isTrending: false,
    createdAt: "2025-12-18T12:00:00Z",
    updatedAt: "2025-12-18T12:00:00Z",
    tags: ["khí hậu", "môi trường", "bền vững"],
    relatedExamId: "exam_4",
    forumTopics: [],
  },
  {
    id: "5",
    title: "Chuyển đổi số trong giáo dục: Kinh nghiệm từ các nước phát triển",
    content: [
      "Nhiều quốc gia trên thế giới đã thành công trong việc chuyển đổi số giáo dục, mang lại hiệu quả học tập cao hơn.",
      "Việt Nam có thể học hỏi những bài học quý báu từ Singapore, Phần Lan và Hàn Quốc trong việc ứng dụng công nghệ vào giảng dạy.",
      "Đầu tư vào đào tạo giáo viên và cơ sở hạ tầng công nghệ là hai yếu tố then chốt cho sự thành công.",
    ],
    excerpt:
      "Kinh nghiệm chuyển đổi số từ các nước phát triển mang lại nhiều bài học giá trị cho Việt Nam.",
    category: "Giáo dục",
    categoryColor: "#F59E0B",
    source: "VnSocial",
    sourceUrl: "https://vnsocial.vn/article/5",
    timeAgo: "2 ngày trước",
    views: 987,
    likes: 156,
    discussionPostsCount: 3,
    commentsCount: 78,
    isTrending: false,
    createdAt: "2025-12-17T14:00:00Z",
    updatedAt: "2025-12-17T14:00:00Z",
    tags: ["chuyển đổi số", "giáo dục", "công nghệ"],
    relatedExamId: "exam_5",
    forumTopics: [],
  },
];

const AdminForumView: React.FC = () => {
  const [articles, setArticles] = useState<ForumArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ForumArticle | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await ForumService.getArticles();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewArticle = (article: ForumArticle) => {
    setSelectedArticle(article);
    setShowDetailModal(true);
  };

  const handleGenerateArticles = () => {
    setShowGenerateModal(true);
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn xóa bài viết này? Tất cả các chủ đề thảo luận liên quan cũng sẽ bị xóa."
      )
    ) {
      return;
    }

    try {
      const success = await ForumService.deletePackage(articleId);
      if (success) {
        setArticles(articles.filter((a) => a.id !== articleId));
        alert("Xóa bài viết thành công!");
      } else {
        alert("Không thể xóa bài viết. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Đã có lỗi xảy ra khi xóa bài viết.");
    }
  };

  const stats = {
    totalArticles: articles.length,
    totalDiscussionPosts: articles.reduce(
      (sum, a) => sum + (a.discussionPostsCount || 0),
      0
    ),
    totalComments: articles.reduce((sum, a) => sum + (a.commentsCount || 0), 0),
    avgEngagement:
      articles.length > 0
        ? Math.round(
            articles.reduce((sum, a) => sum + a.views + a.likes, 0) /
              articles.length
          )
        : 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Quản lý Diễn đàn"
          subtitle={`Quản lý bài viết và thảo luận từ VnSocial - Tổng cộng ${articles.length} bài viết`}
        />
        <button
          onClick={handleGenerateArticles}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">Tạo bài viết mới</span>
        </button>
      </div>

      {/* Stats */}
      <AdminForumStats stats={stats} />

      {/* Action Toolbar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Tất cả danh mục</option>
            <option value="xa-hoi">Xã hội</option>
            <option value="khoa-hoc">Khoa học</option>
            <option value="van-hoa">Văn hóa</option>
            <option value="giao-duc">Giáo dục</option>
          </select>
        </div>
        <button
          onClick={fetchArticles}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Làm mới
        </button>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onView={() => handleViewArticle(article)}
              onDelete={() => handleDeleteArticle(article.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có bài viết nào
          </h3>
          <p className="text-gray-600 mb-4">
            Bắt đầu bằng cách tạo bài viết mới từ VnSocial
          </p>
          <button
            onClick={handleGenerateArticles}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Tạo bài viết đầu tiên
          </button>
        </div>
      )}

      {/* Modals */}
      {showDetailModal && selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedArticle(null);
          }}
          onRefresh={fetchArticles}
        />
      )}

      {showGenerateModal && (
        <GenerateArticleModal
          onClose={() => setShowGenerateModal(false)}
          onGenerated={fetchArticles}
        />
      )}
    </div>
  );
};

export default AdminForumView;
