const vnSocialService = require("./VnSocialService");
const vnSmartBotProvider = require("../providers/VnSmartBotProvider");

/**
 * Service để tạo debate topics từ bài báo nổi bật sử dụng AI
 * Tích hợp VnSocial để lấy bài báo và vnSmartBot để sinh debate topics
 */
class SocialDebateService {
  /**
   * Tạo prompt để yêu cầu AI sinh debate topics từ bài báo
   * @private
   */
  _createDebatePrompt(article) {
    // Facebook posts often have all content in title field
    const content = article.content || article.title || "Không có nội dung";

    // Truncate if too long (limit to 3000 chars to avoid token limits)
    const truncatedContent =
      content.length > 3000 ? content.substring(0, 3000) + "..." : content;

    // Tạo instruction rõ ràng cho AI
    const instruction = `Dựa trên bài đăng mạng xã hội sau, hãy tạo 3 câu hỏi tranh luận hấp dẫn và kích thích tư duy cho sinh viên.

Yêu cầu:
1. Mỗi câu hỏi phải liên quan trực tiếp đến nội dung bài đăng
2. Câu hỏi phải có tính tranh luận cao (có ít nhất 2 quan điểm đối lập)
3. Phù hợp với trình độ học sinh THPT tại Việt Nam
4. Trả về chính xác 3 câu hỏi, mỗi câu trên một dòng, đánh số 1. 2. 3.
5. Câu hỏi phải ngắn gọn, rõ ràng (mỗi câu không quá 100 chữ)

Nội dung bài đăng:
---
${truncatedContent}
---

Hãy trả về 3 câu hỏi tranh luận:`;

    return instruction;
  }

  /**
   * Parse response từ AI để lấy ra 3 debate topics
   * @private
   */
  _parseDebateTopics(aiResponse) {
    try {
      // Lấy text từ card_data
      const cardData = aiResponse?.object?.sb?.card_data;
      if (!cardData || cardData.length === 0) {
        return [];
      }

      // Tìm card có type text
      const textCard = cardData.find(
        (card) => card.type === "text" && card.text
      );
      if (!textCard) {
        return [];
      }

      const text = textCard.text;

      const debateTopics = [];

      // Strategy 1: Parse theo số thứ tự (1. 2. 3. hoặc 1) 2) 3))
      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      for (const line of lines) {
        // Chỉ lấy tối đa 3 topics
        if (debateTopics.length >= 3) {
          break;
        }

        // Match patterns:
        // - "1. Câu hỏi"
        // - "1) Câu hỏi"
        // - "1. **"Câu hỏi"**" (markdown bold + quotes)
        // - "1. **Câu hỏi**" (markdown bold)
        // - "- Câu hỏi"
        let match =
          line.match(/^[\d]+[\.\)]\s*(.+)$/) || line.match(/^[-*]\s*(.+)$/);

        if (match && match[1]) {
          let topic = match[1].trim();

          // Clean markdown: Remove **"..."** or **...**
          topic = topic.replace(/^\*\*[""]?(.+?)[""]?\*\*/, "$1");

          // Remove markdown bold ** at start/end
          topic = topic.replace(/^\*\*/, "").replace(/\*\*$/, "");

          // Remove quotes at start/end
          topic = topic.replace(/^[""]/, "").replace(/[""]$/, "");

          // Skip if it's a markdown heading or too short
          if (topic.startsWith("#") || topic.length < 10) {
            continue;
          }

          // Skip lines that start with "Từ vấn đề" (đây là phần đề văn, không phải câu hỏi)
          if (topic.startsWith("Từ vấn đề")) {
            continue;
          }

          // Only take first sentence before newline or "   -"
          const firstSentence = topic.split(/\n|   -/)[0].trim();

          if (firstSentence.length > 10) {
            debateTopics.push(firstSentence);
          }
        }
      }

      // Strategy 2: Nếu không parse được theo số, tìm các dòng có dấu hỏi
      if (debateTopics.length === 0) {
        const questionLines = lines.filter(
          (line) => line.includes("?") && line.length > 15
        );
        debateTopics.push(...questionLines.slice(0, 3));
      }

      // Strategy 3: Nếu vẫn không có, lấy các dòng dài có từ khóa tranh luận
      if (debateTopics.length === 0) {
        const potentialTopics = lines.filter(
          (line) =>
            line.length > 20 &&
            (line.includes("nên") ||
              line.includes("không") ||
              line.includes("có") ||
              line.includes("liệu"))
        );
        debateTopics.push(...potentialTopics.slice(0, 3));
      }

      const finalTopics = debateTopics.slice(0, 3);

      return finalTopics;
    } catch (error) {
      console.error("❌ Error parsing debate topics:", error);
      return [];
    }
  }

  /**
   * Sinh debate topics từ một bài báo
   * @private
   */
  async _generateDebateTopicsForArticle(article, senderId) {
    try {
      const prompt = this._createDebatePrompt(article);

      // Gửi prompt đến vnSmartBot với system_prompt
      const response = await vnSmartBotProvider.sendMessage({
        sender_id: senderId,
        text: prompt,
        input_channel: "platform",
        session_id: `debate_gen_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        settings: {
          system_prompt:
            "Bạn là một trợ lý AI chuyên tạo câu hỏi tranh luận cho giáo dục. Nhiệm vụ của bạn là phân tích bài báo và tạo ra các câu hỏi kích thích tư duy, có tính tranh luận cao, phù hợp với sinh viên đại học.",
        },
      });

      // VnSmartBotProvider trả về raw response (có thể là SSE format string)
      let parsedResponse = response;

      // Nếu response là string SSE format "data:{...}\n\n", parse nó
      if (typeof response === "string" && response.startsWith("data:")) {
        try {
          const jsonStr = response.substring(5).trim(); // Remove "data:" and whitespace
          parsedResponse = JSON.parse(jsonStr);
        } catch (parseError) {
          console.error("Failed to parse SSE format:", parseError.message);
          return [];
        }
      }

      // Parse debate topics từ response
      const debateTopics = this._parseDebateTopics(parsedResponse);

      return debateTopics;
    } catch (error) {
      console.error("Error generating debate topics:", error);
      return [];
    }
  }

  /**
   * Lấy danh sách debate topics từ các bài báo nổi bật
   * @param {Object} params - Tham số thời gian
   * @param {string} senderId - ID của người dùng (để tracking với bot)
   * @returns {Promise<Array>} Array of {topicName, articleTitle, articleUrl, debateTopics[]}
   */
  async getSocialDebateTopics(params, senderId = "admin_system") {
    try {
      const { start_time, end_time, source = "baochi" } = params;

      // Lấy topics với hot posts từ VnSocial
      const topicsWithPosts = await vnSocialService.getTopicsWithHotPosts({
        start_time,
        end_time,
        source,
      });

      if (topicsWithPosts.length === 0) {
        return [];
      }

      // Với mỗi bài báo, sinh debate topics bằng AI
      const results = await Promise.all(
        topicsWithPosts.map(async (item) => {
          const { topic, hotPost } = item;

          // Bỏ qua nếu không có hot post
          if (!hotPost) {
            return null;
          }

          // Sinh debate topics cho bài báo này
          const debateTopics = await this._generateDebateTopicsForArticle(
            hotPost,
            senderId
          );

          return {
            topicId: topic.id,
            topicName: topic.name,
            topicDescription: topic.description,
            article: {
              id: hotPost.id,
              title: hotPost.title,
              url: hotPost.url,
              source: hotPost.source,
              author: hotPost.author,
              publishedDate: hotPost.publishedDate,
              sentiment: hotPost.sentiment,
            },
            debateTopics: debateTopics,
            generatedAt: new Date().toISOString(),
          };
        })
      );

      // Lọc bỏ null và những item không có debate topics
      const validResults = results.filter(
        (item) => item !== null && item.debateTopics.length > 0
      );

      return validResults;
    } catch (error) {
      console.error("Error in getSocialDebateTopics:", error);
      throw error;
    }
  }

  /**
   * Lấy debate topics cho một bài báo cụ thể
   * @param {Object} article - Thông tin bài báo
   * @param {string} senderId - ID của người dùng
   * @returns {Promise<Array>} Array of debate topics
   */
  async generateDebateTopicsForSingleArticle(
    article,
    senderId = "admin_system"
  ) {
    try {
      return await this._generateDebateTopicsForArticle(article, senderId);
    } catch (error) {
      console.error(
        "Error generating debate topics for single article:",
        error
      );
      throw error;
    }
  }
}

module.exports = new SocialDebateService();
