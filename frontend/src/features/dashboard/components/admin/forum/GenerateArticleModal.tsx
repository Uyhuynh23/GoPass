"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, TrendingUp } from "lucide-react";
import { ForumService } from "@/services/forum/forum.service";
import { vnsocialTopic } from "@/features/dashboard/types/forum";

interface GenerateArticleModalProps {
  onClose: () => void;
  onGenerated: () => void;
}

const GenerateArticleModal: React.FC<GenerateArticleModalProps> = ({
  onClose,
  onGenerated,
}) => {
  const [step, setStep] = useState<
    "select" | "configure" | "generating" | "success"
  >("select");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [articleCount, setArticleCount] = useState(3);
  const [discussionCount, setDiscussionCount] = useState(3);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; color: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  // Color palette for categories
  const colors = [
    "#3B82F6",
    "#10B981",
    "#8B5CF6",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
    "#14B8A6",
    "#F97316",
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const topics = await ForumService.getVnSocialTopics("keyword");
        const formattedCategories = topics
          .filter((topic) => topic.status)
          .map((topic, index) => ({
            id: topic.id,
            name: topic.name,
            color: colors[index % colors.length],
          }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching VnSocial topics:", error);
        // Fallback to default categories
        setCategories([
          { id: "xa-hoi", name: "Xã hội", color: "#3B82F6" },
          { id: "khoa-hoc", name: "Khoa học", color: "#10B981" },
          { id: "van-hoa", name: "Văn hóa", color: "#8B5CF6" },
          { id: "giao-duc", name: "Giáo dục", color: "#F59E0B" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleGenerate = async () => {
    setStep("generating");
    try {
      // Calculate time range (last 7 days) in Unix timestamps (milliseconds)
      const endTime = Date.now();
      const startTime = endTime - 7 * 24 * 60 * 60 * 1000;

      console.log("🚀 Starting forum generation...");
      console.log("📝 Parameters:", {
        topicId: selectedCategory,
        count: discussionCount,
        source: "baochi",
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });

      // Call API to generate articles (this can take 1-3 minutes)
      const response = await ForumService.generateArticles({
        topicId: selectedCategory,
        count: discussionCount, // Use discussionCount as the number of forum topics to create
        source: "baochi",
        startTime: startTime,
        endTime: endTime,
      });

      console.log("✅ Generation successful:", response);

      if (response.success) {
        setStep("success");
        setTimeout(() => {
          onGenerated();
          onClose();
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to generate articles");
      }
    } catch (error: any) {
      console.error("❌ Error generating articles:", error);

      // Better error message for timeout
      let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";
      if (
        error.message?.includes("timeout") ||
        error.message?.includes("Request timeout")
      ) {
        errorMessage =
          "Quá trình tạo bài viết mất nhiều thời gian. Vui lòng kiểm tra lại danh sách bài viết - bài viết có thể đã được tạo thành công.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
      setStep("configure");
    }
  };

  const renderSelectStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Chọn chủ đề:
        </h3>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setStep("configure");
                }}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md hover:bg-indigo-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-semibold text-gray-900 group-hover:text-indigo-700">
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">AI sẽ tự động:</p>
            <ul className="space-y-1 text-blue-800">
              <li>• Lấy bài viết mới nhất từ VnSocial</li>
              <li>• Tạo 3-4 chủ đề thảo luận cho mỗi bài</li>
              <li>• Gợi ý các câu hỏi thảo luận sâu</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfigureStep = () => {
    const selectedCat = categories.find((c) => c.id === selectedCategory);
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setStep("select")}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Quay lại
            </button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedCat?.color }}
            />
            <h3 className="text-lg font-semibold text-gray-900">
              Chủ đề: {selectedCat?.name}
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số chủ đề thảo luận mỗi bài
            </label>
            <input
              type="number"
              min="2"
              max="6"
              disabled
              value={discussionCount}
              onChange={(e) => setDiscussionCount(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-medium cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mặc định: <span className="font-semibold text-gray-700">3 chủ đề</span> mỗi bài viết. Tùy chọn khác sẽ có trong phiên bản tiếp theo.
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <input
              type="checkbox"
              id="autoGenerate"
              checked={autoGenerate}
              onChange={(e) => setAutoGenerate(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="autoGenerate"
              className="flex-1 text-sm text-indigo-900"
            >
              <span className="font-semibold">
                Tự động tạo chủ đề thảo luận
              </span>
              <p className="text-indigo-700 text-xs mt-1">
                AI sẽ phân tích nội dung và tạo câu hỏi thảo luận phù hợp
              </p>
            </label>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-semibold"
        >
          <Sparkles className="w-5 h-5" />
          <span>Tạo bài viết</span>
        </button>
      </div>
    );
  };

  const renderGeneratingStep = () => (
    <div className="py-12 text-center">
      <div className="relative inline-block mb-6">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-purple-600"></div>
        <Sparkles className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Đang tạo bài viết...
      </h3>
      <p className="text-gray-600 mb-4">
        AI đang phân tích và tạo nội dung từ VnSocial
      </p>
      <div className="max-w-md mx-auto space-y-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          Đang lấy bài viết mới từ VnSocial...
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-100"></div>
          Đang tạo chủ đề thảo luận...
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse delay-200"></div>
          Đang phân tích nội dung...
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="py-12 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Tạo thành công!
      </h3>
      <p className="text-gray-600">
        Đã tạo {articleCount} bài viết với {discussionCount} chủ đề thảo luận
        mỗi bài
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Tạo bài viết mới
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              AI sẽ tự động tạo bài viết và chủ đề thảo luận từ VnSocial
            </p>
          </div>
          {step !== "generating" && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "select" && renderSelectStep()}
          {step === "configure" && renderConfigureStep()}
          {step === "generating" && renderGeneratingStep()}
          {step === "success" && renderSuccessStep()}
        </div>
      </div>
    </div>
  );
};

export default GenerateArticleModal;
