const VnSocialService = require("./VnSocialService");
const vnSmartBotProvider = require("../providers/VnSmartBotProvider");
const ForumTopicRepository = require("../repositories/ForumTopicRepository");
const ForumCommentRepository = require("../repositories/ForumCommentRepository");
const VnsocialTopicRepository = require("../repositories/VnsocialTopicRepository");
const VnsocialArticleRepository = require("../repositories/VnsocialArticleRepository");
const UsedArticleRepository = require("../repositories/UsedArticleRepository");

/**
 * Service quản lý Forum system
 * Orchestrate flow: VnSocial API → SmartBot AI → Forum Topics
 */
class ForumService {
  /**
   * Tạo forum topics từ hot articles (Admin only)
   * @param {Object} params - { topicId, count, source, startTime, endTime }
   * @param {string} adminUserId - ID của admin
   * @returns {Promise<Array>} Array of created forum topics
   */
  async generateForumTopics(params, adminUserId) {
    const {
      topicId, // VnSocial topic ID (external)
      count = 3, // Số lượng forum topics cần tạo
      source = "baochi", // Nguồn: baochi, facebook, youtube
      startTime,
      endTime,
    } = params;

    // Validate
    if (!topicId) {
      throw new Error("topicId is required");
    }

    // 1. Lấy topic từ DB hoặc fetch từ API
    let vnsocialTopic = await VnsocialTopicRepository.findByExternalId(topicId);

    if (!vnsocialTopic) {
      // Fetch topics từ API và lưu vào DB
      const { topics } = await VnSocialService.getTopics("keyword");
      const matchedTopic = topics.find((t) => t.id === topicId);

      if (!matchedTopic) {
        throw new Error(`Topic ${topicId} not found`);
      }

      vnsocialTopic = await VnsocialTopicRepository.upsertTopic(topicId, {
        externalId: topicId,
        name: matchedTopic.name || matchedTopic.projectName,
        description: matchedTopic.description,
        type: "TOPIC_POLICY",
        metadata: matchedTopic,
      });
    }

    // 2. Lấy danh sách article IDs đã sử dụng gần đây (24h)
    const usedArticleIds = await UsedArticleRepository.getUsedArticleIds(
      vnsocialTopic._id,
      24
    );

    // 3. Fetch hot posts từ VnSocial
    const { posts } = await VnSocialService.getHotPosts({
      project_id: topicId,
      source,
      start_time: startTime,
      end_time: endTime,
    });

    if (!posts || posts.length === 0) {
      throw new Error("No hot posts found for this topic");
    }

    // 4. Lọc bỏ articles đã sử dụng gần đây
    const availablePosts = posts.filter((post) => {
      const docId = post.docId || post.id;
      // Check if article exists in used list
      return !usedArticleIds.some((usedId) => usedId === docId);
    });

    if (availablePosts.length === 0) {
      throw new Error(
        "All recent articles have been used. Please try again later or use a different topic."
      );
    }

    // 5. Lấy N posts đầu tiên (theo count)
    const selectedPosts = availablePosts.slice(
      0,
      Math.min(count, availablePosts.length)
    );

    // 6. Với mỗi post, tạo forum topic
    const forumTopics = [];

    for (const post of selectedPosts) {
      try {
        // a. Lưu article vào DB
        const articleData = {
          externalId: post.docId || post.id,
          topicId: vnsocialTopic._id,
          title: post.title,
          content: post.content || post.description || post.title,
          url: post.postLink || post.url,
          source: post.domain || post.sourceName || source,
          author: post.userName || post.author,
          publishedDate: post.createDate || post.publishedDate,
          sentiment: post.senti || post.sentiment,
          rawPayload: post,
        };

        const article = await VnsocialArticleRepository.upsertArticle(
          articleData.externalId,
          articleData
        );

        // b. Gọi SmartBot để sinh forum content
        const aiContent = await this._generateForumContentWithAI(article);

        // c. Tạo forum topic
        const forumTopic = await ForumTopicRepository.create({
          title: aiContent.title,
          summary: aiContent.summary,
          debateQuestion: aiContent.debateQuestion,
          sourceArticle: {
            articleId: article._id,
            title: article.title,
            url: article.url,
          },
          vnsocialTopic: {
            topicId: vnsocialTopic._id,
            name: vnsocialTopic.name,
          },
          createdBy: adminUserId,
          seedComment: aiContent.seedComment,
          status: "published",
          tags: aiContent.tags || [],
          rawSmartbotPayload: aiContent.rawResponse,
        });

        // d. Tạo AI seed comment
        await ForumCommentRepository.create({
          topicId: forumTopic._id,
          userId: adminUserId,
          content: aiContent.seedComment,
          isAiGenerated: true,
          status: "active",
        });

        // e. Đánh dấu article đã sử dụng
        await UsedArticleRepository.markAsUsed(
          article._id,
          vnsocialTopic._id,
          adminUserId,
          forumTopic._id
        );

        forumTopics.push(forumTopic);
      } catch (error) {
        console.error(
          `Error generating forum topic for article ${post.docId || post.id}:`,
          error
        );
        // Continue with next post
      }
    }

    if (forumTopics.length === 0) {
      throw new Error("Failed to generate any forum topics");
    }

    return forumTopics;
  }

  /**
   * Gọi SmartBot AI để sinh nội dung forum topic
   * @private
   */
  async _generateForumContentWithAI(article) {
    const content = article.content || article.title;

    if (!content || content.length < 50) {
      throw new Error("Article content is too short for AI generation");
    }

    // Truncate content để tránh token limit
    const truncatedContent =
      content.length > 3000 ? content.substring(0, 3000) : content;

    // Tạo prompt cho AI
    const prompt = `Dựa trên bài báo sau, hãy tạo:

BÀI BÁO:
---
${truncatedContent}
---

YÊU CẦU TẠO:
1. **TIÊU ĐỀ FORUM** (1 dòng): Tạo tiêu đề hấp dẫn, khác với tiêu đề bài báo gốc, dài 50-100 ký tự
2. **TÓM TẮT** (150-300 từ): Tóm tắt nội dung chính của bài báo
3. **CÂU HỎI TRANH LUẬN** (1 câu): Câu hỏi mở, có tính tranh luận cao, kích thích thảo luận
4. **COMMENT MỒI** (50-100 từ): Comment đầu tiên để khởi động thảo luận, đưa ra 1 quan điểm rõ ràng

ĐỊNH DẠNG TRẢ VỀ (CHÍNH XÁC):
TITLE: [tiêu đề forum]
SUMMARY: [tóm tắt]
QUESTION: [câu hỏi tranh luận]
SEED: [comment mồi]

KHÔNG thêm markdown, emoji hay ký tự đặc biệt.`;

    // Gọi SmartBot
    const response = await vnSmartBotProvider.sendMessage({
      sender_id: "forum_generator",
      text: prompt,
      input_channel: "platform",
      session_id: `forum_gen_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      settings: {
        system_prompt:
          "Bạn là một trợ lý AI chuyên tạo nội dung thảo luận forum. Nhiệm vụ của bạn là phân tích bài báo và tạo nội dung hấp dẫn để kích thích thảo luận.",
      },
    });

    // Parse response
    let parsedResponse = response;

    // Xử lý SSE format nếu cần
    if (typeof response === "string" && response.startsWith("data:")) {
      try {
        const jsonStr = response.substring(5).trim();
        parsedResponse = JSON.parse(jsonStr);
      } catch (error) {
        throw new Error("Failed to parse SSE response from SmartBot");
      }
    }

    // Extract text từ response
    const cardData = parsedResponse?.object?.sb?.card_data;
    if (!cardData || cardData.length === 0) {
      throw new Error("No card_data in SmartBot response");
    }

    const textCard = cardData.find((card) => card.type === "text" && card.text);
    if (!textCard) {
      throw new Error("No text card in SmartBot response");
    }

    const aiText = textCard.text;

    // Parse AI response theo format
    const parsed = this._parseAIForumContent(aiText);

    return {
      ...parsed,
      rawResponse: parsedResponse,
    };
  }

  /**
   * Parse AI response text
   * @private
   */
  _parseAIForumContent(text) {
    const lines = text.split("\n").map((line) => line.trim());

    let title = "";
    let summary = "";
    let question = "";
    let seed = "";

    let currentSection = null;
    let buffer = [];

    for (const line of lines) {
      if (line.startsWith("TITLE:")) {
        if (buffer.length > 0 && currentSection) {
          this._assignSection(currentSection, buffer.join("\n").trim(), {
            title,
            summary,
            question,
            seed,
          });
        }
        currentSection = "title";
        buffer = [line.replace("TITLE:", "").trim()];
      } else if (line.startsWith("SUMMARY:")) {
        if (buffer.length > 0 && currentSection) {
          const result = this._assignSection(
            currentSection,
            buffer.join("\n").trim(),
            { title, summary, question, seed }
          );
          title = result.title;
          summary = result.summary;
          question = result.question;
          seed = result.seed;
        }
        currentSection = "summary";
        buffer = [line.replace("SUMMARY:", "").trim()];
      } else if (line.startsWith("QUESTION:")) {
        if (buffer.length > 0 && currentSection) {
          const result = this._assignSection(
            currentSection,
            buffer.join("\n").trim(),
            { title, summary, question, seed }
          );
          title = result.title;
          summary = result.summary;
          question = result.question;
          seed = result.seed;
        }
        currentSection = "question";
        buffer = [line.replace("QUESTION:", "").trim()];
      } else if (line.startsWith("SEED:")) {
        if (buffer.length > 0 && currentSection) {
          const result = this._assignSection(
            currentSection,
            buffer.join("\n").trim(),
            { title, summary, question, seed }
          );
          title = result.title;
          summary = result.summary;
          question = result.question;
          seed = result.seed;
        }
        currentSection = "seed";
        buffer = [line.replace("SEED:", "").trim()];
      } else if (line.length > 0 && currentSection) {
        buffer.push(line);
      }
    }

    // Assign last section
    if (buffer.length > 0 && currentSection) {
      const result = this._assignSection(
        currentSection,
        buffer.join("\n").trim(),
        { title, summary, question, seed }
      );
      title = result.title;
      summary = result.summary;
      question = result.question;
      seed = result.seed;
    }

    // Validate
    if (!title || !summary || !question || !seed) {
      throw new Error("AI response missing required sections");
    }

    return {
      title,
      summary,
      debateQuestion: question,
      seedComment: seed,
      tags: [], // TODO: Extract tags from content if needed
    };
  }

  /**
   * Helper để assign parsed value
   * @private
   */
  _assignSection(section, value, current) {
    const result = { ...current };
    if (section === "title") result.title = value;
    if (section === "summary") result.summary = value;
    if (section === "question") result.question = value;
    if (section === "seed") result.seed = value;
    return result;
  }

  /**
   * Lấy danh sách forum topics
   */
  async getForumTopics({ status, tags, page, limit }) {
    return await ForumTopicRepository.getTopics({ status, tags, page, limit });
  }

  /**
   * Lấy chi tiết forum topic
   */
  async getForumTopicDetail(topicId) {
    const topic = await ForumTopicRepository.getTopicWithComments(topicId);

    if (!topic) {
      throw new Error("Forum topic not found");
    }

    // Increment views
    await ForumTopicRepository.incrementViewsCount(topicId);

    // Lấy comments (top-level only)
    const commentsData = await ForumCommentRepository.getTopicComments(
      topicId,
      {
        page: 1,
        limit: 20,
      }
    );

    return {
      topic,
      comments: commentsData.comments,
      commentsTotal: commentsData.total,
    };
  }

  /**
   * Tạo comment cho forum topic
   */
  async createComment(topicId, userId, content) {
    const topic = await ForumTopicRepository.findById(topicId);

    if (!topic) {
      throw new Error("Forum topic not found");
    }

    const comment = await ForumCommentRepository.create({
      topicId,
      userId,
      content,
      status: "active",
      isAiGenerated: false,
    });

    // Update topic stats
    await ForumTopicRepository.incrementCommentsCount(topicId);

    return comment;
  }

  /**
   * Tạo reply cho comment
   */
  async createReply(parentCommentId, userId, content) {
    const parentComment = await ForumCommentRepository.findById(
      parentCommentId
    );

    if (!parentComment) {
      throw new Error("Parent comment not found");
    }

    const reply = await ForumCommentRepository.create({
      topicId: parentComment.topicId,
      userId,
      content,
      parentCommentId,
      status: "active",
      isAiGenerated: false,
    });

    // Update topic stats
    await ForumTopicRepository.incrementCommentsCount(parentComment.topicId);

    return reply;
  }

  /**
   * Like forum topic
   */
  async likeTopic(topicId, userId) {
    const topic = await ForumTopicRepository.findById(topicId);

    if (!topic) {
      throw new Error("Forum topic not found");
    }

    // TODO: Track user likes (tạo UserLike model nếu cần)
    // Hiện tại chỉ increment counter
    await ForumTopicRepository.incrementLikesCount(topicId);

    return { success: true };
  }

  /**
   * Unlike forum topic
   */
  async unlikeTopic(topicId, userId) {
    await ForumTopicRepository.decrementLikesCount(topicId);
    return { success: true };
  }
}

module.exports = new ForumService();
