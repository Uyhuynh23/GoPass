const VnSocialService = require("./VnSocialService");
const vnSmartBotProvider = require("../providers/VnSmartBotProvider");
const ForumPackageRepository = require("../repositories/ForumPackageRepository");
const ForumTopicRepository = require("../repositories/ForumTopicRepository");
const ForumCommentRepository = require("../repositories/ForumCommentRepository");
const VnsocialTopicRepository = require("../repositories/VnsocialTopicRepository");
const VnsocialArticleRepository = require("../repositories/VnsocialArticleRepository");
const UsedArticleRepository = require("../repositories/UsedArticleRepository");
const { FORUM_CONTENT_GENERATION_PROMPT } = require("../config/prompts");
const Exam = require("../models/Exam");
const Question = require("../models/Question");
const ExamQuestion = require("../models/ExamQuestion");

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

    console.log("🚀 [ForumService.generateForumTopics] START");
    console.log("📝 Params:", JSON.stringify(params, null, 2));
    console.log("👤 Admin User ID:", adminUserId);

    // Validate
    if (!topicId) {
      throw new Error("topicId is required");
    }

    try {
      // 1. Lấy topic từ DB hoặc fetch từ API
      console.log("📌 Step 1: Fetching VnSocial topic...");
      let vnsocialTopic = await VnsocialTopicRepository.findByExternalId(
        topicId
      );

      if (!vnsocialTopic) {
        console.log("⚠️ Topic not in DB, fetching from API...");
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

      console.log("✅ VnSocial Topic:", vnsocialTopic.name);

      // 2. Lấy danh sách article IDs đã sử dụng gần đây (24h)
      console.log("📌 Step 2: Getting used articles...");
      const usedArticleIds = await UsedArticleRepository.getUsedArticleIds(
        vnsocialTopic._id,
        24
      );
      console.log(`📊 Used articles (24h): ${usedArticleIds.length}`);
      if (usedArticleIds.length > 0) {
        console.log(`📋 Used externalIds:`, usedArticleIds.slice(0, 5)); // Show first 5
      }

      // 3. Fetch hot posts từ VnSocial
      console.log("📌 Step 3: Fetching hot posts from VnSocial...");
      const { posts } = await VnSocialService.getHotPosts({
        project_id: topicId,
        source,
        start_time: startTime,
        end_time: endTime,
      });

      console.log(`📰 Hot posts received: ${posts ? posts.length : 0}`);

      if (!posts || posts.length === 0) {
        throw new Error("No hot posts found for this topic");
      }

      // 4. Lọc bỏ articles đã sử dụng gần đây
      const availablePosts = posts.filter((post) => {
        const docId = post.docId || post.id;
        const isUsed = usedArticleIds.includes(docId);
        if (isUsed) {
          console.log(
            `⏭️  Skipping used article: ${docId} - ${post.title?.substring(
              0,
              50
            )}`
          );
        }
        return !isUsed;
      });

      console.log(
        `📊 Available posts after filtering: ${availablePosts.length}/${posts.length}`
      );

      if (availablePosts.length === 0) {
        throw new Error(
          "All recent articles have been used. Please try again later or use a different topic."
        );
      }

      // 5. Chọn bài viết để tạo topics
      // Logic mới: Mỗi bài viết sẽ tạo ra nhiều forum topics
      // Tính toán số bài viết cần chọn
      const topicsPerArticle = 3; // Mỗi article tạo 3 topics
      const articlesNeeded = Math.ceil(count / topicsPerArticle);
      const selectedPosts = availablePosts.slice(
        0,
        Math.min(articlesNeeded, availablePosts.length)
      );

      // 6. Với mỗi post, tạo nhiều forum topics
      const forumTopics = [];

      console.log(`📌 Step 6: Processing ${selectedPosts.length} articles...`);

      for (const post of selectedPosts) {
        try {
          console.log(`\n📰 Processing article: ${post.title}`);

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

          console.log("💾 Saving article to DB...");
          const article = await VnsocialArticleRepository.upsertArticle(
            articleData.externalId,
            articleData
          );
          console.log("✅ Article saved:", article._id);

          // b. Gọi SmartBot để sinh forum content (package + topics)
          console.log("🤖 Calling SmartBot AI...");
          const aiContent = await this._generateForumContentWithAI(
            article,
            topicsPerArticle
          );
          console.log("✅ AI content generated");
          console.log("AI Response structure:", {
            hasPackageTitle: !!aiContent.packageTitle,
            hasPackageSummary: !!aiContent.packageSummary,
            hasTopics: !!aiContent.topics,
            topicsCount: aiContent.topics?.length,
          });

          // c. Tạo ForumPackage trước
          if (
            !aiContent.packageTitle ||
            !aiContent.packageSummary ||
            !aiContent.topics
          ) {
            throw new Error(
              "AI response missing required fields: packageTitle, packageSummary, or topics"
            );
          }

          const forumPackage = await ForumPackageRepository.create({
            packageTitle: aiContent.packageTitle,
            packageSummary: aiContent.packageSummary,
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
            status: "published",
            tags: aiContent.tags || [],
            rawSmartbotPayload: aiContent.rawResponse,
          });

          console.log("✅ ForumPackage created:", forumPackage._id);

          // d. Tạo các ForumTopics thuộc package này
          for (const topicData of aiContent.topics) {
            if (forumTopics.length >= count) break; // Đủ số lượng topics yêu cầu

            const forumTopic = await ForumTopicRepository.create({
              title: topicData.topicTitle,
              packageId: forumPackage._id,
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
              seedComment: topicData.seedComment,
              essayPrompt: topicData.essayPrompt,
              status: "published",
              tags: aiContent.tags || [],
            });

            // Thêm topic vào package
            await ForumPackageRepository.addForumTopic(
              forumPackage._id,
              forumTopic._id
            );

            // Tạo AI seed comment
            await ForumCommentRepository.create({
              topicId: forumTopic._id,
              userId: adminUserId,
              content: topicData.seedComment,
              isAiGenerated: true,
              status: "active",
            });

            // Create corresponding exam for this forum topic
            try {
              console.log("📝 Creating exam for forum topic...");
              const exam = await this._createExamForForumTopic(
                forumTopic,
                article,
                topicData,
                adminUserId
              );
              console.log(`✅ Exam created: ${exam._id}`);
            } catch (examError) {
              console.error(
                `⚠️ Failed to create exam for topic ${forumTopic._id}:`,
                examError.message
              );
              // Continue even if exam creation fails
            }

            forumTopics.push(forumTopic);
          }

          console.log(
            `✅ Created ${forumTopics.length} topics for package ${forumPackage._id}`
          );

          // e. Đánh dấu article đã sử dụng
          await UsedArticleRepository.markAsUsed(
            article._id,
            vnsocialTopic._id,
            adminUserId,
            null // forumTopic._id - nhiều topics nên để null
          );

          console.log(
            `✅ Article processed successfully. Total topics created so far: ${forumTopics.length}`
          );
        } catch (error) {
          console.error(
            `❌ Error generating forum topic for article ${
              post.docId || post.id
            }:`,
            error.message
          );
          console.error("Error stack:", error.stack);
          // Continue with next post
        }

        // Stop nếu đã đủ số lượng topics
        if (forumTopics.length >= count) break;
      }

      if (forumTopics.length === 0) {
        throw new Error("Failed to generate any forum topics");
      }

      console.log(
        `🎉 [ForumService.generateForumTopics] SUCCESS: Created ${forumTopics.length} topics`
      );
      return forumTopics;
    } catch (error) {
      console.error("❌ [ForumService.generateForumTopics] ERROR:");
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      throw error;
    }
  }

  /**
   * Gọi SmartBot AI để sinh nội dung forum topic
   * Sử dụng prompt mới để tạo nhiều topics từ một bài viết
   * @private
   */
  async _generateForumContentWithAI(article, numberOfTopics = 3) {
    const content = article.content || article.title;

    if (!content || content.length < 50) {
      throw new Error("Article content is too short for AI generation");
    }

    // Truncate content để tránh token limit
    const truncatedContent =
      content.length > 4000 ? content.substring(0, 4000) + "..." : content;

    // Tạo full prompt với template từ prompts.js
    // Thay thế placeholders: {{numberOfTopics}}, ${title}, ${content}
    const fullPrompt = FORUM_CONTENT_GENERATION_PROMPT.replace(
      /\{\{numberOfTopics\}\}/g,
      numberOfTopics
    )
      .replace("${title}", article.title || "")
      .replace("${content}", truncatedContent);

    // Gọi SmartBot - truyền toàn bộ prompt vào text
    const response = await vnSmartBotProvider.sendMessage({
      sender_id: "forum_generator",
      text: fullPrompt,
      input_channel: "platform",
      session_id: `forum_gen_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      metadata: {
        article_id: article._id.toString(),
        number_of_topics: numberOfTopics,
      },
    });

    // Parse response từ SmartBot
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

    console.log("🤖 [AI Response] Raw text from SmartBot:");
    console.log("=".repeat(80));
    console.log(aiText);
    console.log("=".repeat(80));

    // Parse JSON response
    let generatedContent;
    try {
      // Clean up response - extract JSON aggressively
      let cleanedText = aiText.trim();

      // Strategy 1: Extract from markdown code block
      const jsonBlockMatch = cleanedText.match(/```json\s*\n([\s\S]*?)\n```/);
      if (jsonBlockMatch) {
        cleanedText = jsonBlockMatch[1].trim();
        console.log("✅ Extracted JSON from markdown block");
      }
      // Strategy 2: Find JSON between first { and last }
      else if (cleanedText.includes("{") && cleanedText.includes("}")) {
        const firstBrace = cleanedText.indexOf("{");
        const lastBrace = cleanedText.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
          console.log("✅ Extracted JSON by finding { ... }");
        }
      }
      // Strategy 3: Remove markdown if starts with ```
      else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText
          .replace(/```(json)?\n?/g, "")
          .replace(/```\n?$/g, "");
        console.log("✅ Removed markdown markers");
      }

      console.log("📝 Cleaned text length:", cleanedText.length);
      console.log("📝 First 100 chars:", cleanedText.substring(0, 100));

      generatedContent = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error(
        "❌ Error parsing SmartBot JSON response:",
        parseError.message
      );
      console.error("📄 AI Text (first 500 chars):", aiText.substring(0, 500));
      console.error(
        "📄 AI Text (last 500 chars):",
        aiText.substring(Math.max(0, aiText.length - 500))
      );
      console.error("📄 Full AI Text for debugging:");
      console.error(aiText);
      throw new Error(
        `Failed to parse SmartBot JSON response: ${parseError.message}`
      );
    }

    // Validate generated content structure
    if (
      !generatedContent.packageTitle ||
      !generatedContent.packageSummary ||
      !Array.isArray(generatedContent.topics)
    ) {
      console.error("❌ Invalid forum content structure");
      console.error("Missing fields:", {
        hasPackageTitle: !!generatedContent.packageTitle,
        hasPackageSummary: !!generatedContent.packageSummary,
        hasTopics: Array.isArray(generatedContent.topics),
      });
      throw new Error(
        "AI response missing required fields: packageTitle, packageSummary, or topics"
      );
    }

    // Validate each topic has required fields
    for (let i = 0; i < generatedContent.topics.length; i++) {
      const topic = generatedContent.topics[i];
      if (!topic.topicTitle || !topic.seedComment || !topic.essayPrompt) {
        console.error(`❌ Topic #${i + 1} missing required fields:`, {
          hasTopicTitle: !!topic.topicTitle,
          hasSeedComment: !!topic.seedComment,
          hasEssayPrompt: !!topic.essayPrompt,
        });
        throw new Error(`Topic #${i + 1} missing required fields`);
      }
    }

    // Return new format with package + multiple topics
    return {
      packageTitle: generatedContent.packageTitle,
      packageSummary: generatedContent.packageSummary,
      topics: generatedContent.topics, // Array of {topicTitle, seedComment, essayPrompt}
      tags: generatedContent.tags || [],
      rawResponse: parsedResponse,
    };
  }

  /**
   * Tạo đề thi Ngữ Văn từ forum topic
   * @private
   * @param {Object} forumTopic - Forum topic đã tạo
   * @param {Object} article - Article gốc
   * @param {Object} topicData - Data từ AI (chứa essayPrompt)
   * @param {string} adminUserId - ID của admin
   * @returns {Promise<Object>} Created exam
   */
  async _createExamForForumTopic(forumTopic, article, topicData, adminUserId) {
    try {
      // 1. Tạo Exam
      const exam = await Exam.create({
        title: `Nghị luận xã hội - ${topicData.topicTitle}`,
        description: "Đề thi ngữ văn nghị luận xã hội",
        subject: "Ngữ Văn",
        durationMinutes: 30,
        mode: "practice_global",
        shuffleQuestions: false,
        showResultsImmediately: false,
        createdBy: adminUserId,
        isPublished: true,
        readingPassages: [],
        totalQuestions: 1,
        totalPoints: 10,
      });

      console.log(`✅ Exam created: ${exam._id}`);

      // 2. Tạo Question (Essay)
      const question = await Question.create({
        type: "essay",
        content: `Câu 1 (VDC). ${topicData.essayPrompt}`,
        options: [],
        correctAnswer: null,
        explanation:
          "<p><b>Phương pháp:</b></p><p>Vận dụng kiến thức về cách viết đoạn văn nghị luận xã hội, phân tích vấn đề, đưa ra luận điểm và luận cứ chặt chẽ.</p>",
        linkedPassageId: null, // Có thể link đến article URL nếu cần
        image: {
          url: "",
          caption: "",
          position: "top",
        },
        tableData: {
          headers: [],
          rows: [],
        },
        difficulty: "hard",
        subject: "Ngữ Văn",
        tags: ["viết"],
        points: 2,
        createdBy: adminUserId,
        isPublic: true,
      });

      console.log(`✅ Question created: ${question._id}`);

      // 3. Tạo ExamQuestion (liên kết Exam và Question)
      const examQuestion = await ExamQuestion.create({
        examId: exam._id,
        questionId: question._id,
        order: 1,
        maxScore: 10,
        section: "Viết",
        points: 10,
      });

      console.log(`✅ ExamQuestion created: ${examQuestion._id}`);

      // 4. Cập nhật forumTopic với examId (optional - để link ngược)
      await ForumTopicRepository.update(forumTopic._id, {
        examId: exam._id, // Lưu examId vào forum topic
      });

      return exam;
    } catch (error) {
      console.error("❌ Error creating exam for forum topic:", error);
      throw error;
    }
  }

  /**
   * Lấy danh sách forum packages
   */
  async getForumPackages({ status, topicId, page, limit }) {
    return await ForumPackageRepository.findAll({ status, topicId, page, limit });
  }

  /**
   * Lấy chi tiết forum package
   */
  async getForumPackageById(packageId) {
    const pkg = await ForumPackageRepository.findById(packageId);
    if (!pkg) {
      throw new Error("Forum package not found");
    }
    return pkg;
  }

  /**
   * Cập nhật forum package (Admin)
   */
  async updateForumPackage(packageId, updateData) {
    const pkg = await ForumPackageRepository.findById(packageId);
    if (!pkg) {
      throw new Error("Forum package not found");
    }

    return await ForumPackageRepository.update(packageId, updateData);
  }

  /**
   * Xóa forum package (Admin)
   */
  async deleteForumPackage(packageId) {
    const pkg = await ForumPackageRepository.findById(packageId);
    if (!pkg) {
      throw new Error("Forum package not found");
    }

    // Get all topics for this package
    const topics = await ForumTopicRepository.find({ packageId });
    const topicIds = topics.map(t => t._id.toString());

    // Delete all comments for all topics
    if (topicIds.length > 0) {
      await ForumCommentRepository.deleteMany({ topicId: { $in: topicIds } });
    }

    // Delete all related topics
    await ForumTopicRepository.deleteMany({ packageId });

    return await ForumPackageRepository.delete(packageId);
  }

  /**
   * Lấy danh sách forum topics
   */
  async getForumTopics({ status, tags, page, limit }) {
    return await ForumTopicRepository.getTopics({ status, tags, page, limit });
  }

  /**
   * Lấy forum topics theo packageId
   */
  async getForumTopicsByPackageId(packageId) {
    return await ForumTopicRepository.getTopicsByPackageId(packageId);
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
   * Cập nhật forum topic (Admin)
   */
  async updateForumTopic(topicId, updateData) {
    const topic = await ForumTopicRepository.findById(topicId);
    if (!topic) {
      throw new Error("Forum topic not found");
    }

    return await ForumTopicRepository.update(topicId, updateData);
  }

  /**
   * Xóa forum topic (Admin)
   */
  async deleteForumTopic(topicId) {
    const topic = await ForumTopicRepository.findById(topicId);
    if (!topic) {
      throw new Error("Forum topic not found");
    }

    // Delete all comments for this topic
    await ForumCommentRepository.deleteMany({ topicId });

    return await ForumTopicRepository.delete(topicId);
  }

  /**
   * Lấy comments cho một topic
   */
  async getTopicComments(topicId, { page, limit }) {
    return await ForumCommentRepository.getTopicComments(topicId, { page, limit });
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
   * Cập nhật comment
   */
  async updateComment(commentId, userId, content) {
    const comment = await ForumCommentRepository.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check ownership
    if (comment.userId.toString() !== userId.toString()) {
      throw new Error("Not authorized to update this comment");
    }

    return await ForumCommentRepository.update(commentId, { content });
  }

  /**
   * Xóa comment
   */
  async deleteComment(commentId, userId) {
    const comment = await ForumCommentRepository.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check ownership
    if (comment.userId.toString() !== userId.toString()) {
      throw new Error("Not authorized to delete this comment");
    }

    // Soft delete - set status to deleted
    await ForumCommentRepository.update(commentId, { status: "deleted" });

    // Update topic stats
    await ForumTopicRepository.decrementCommentsCount(comment.topicId);

    return { success: true };
  }

  /**
   * Like comment
   */
  async likeComment(commentId, userId) {
    const comment = await ForumCommentRepository.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if already liked
    if (comment.likedBy && comment.likedBy.includes(userId)) {
      throw new Error("Already liked this comment");
    }

    await ForumCommentRepository.addLike(commentId, userId);
    return { success: true };
  }

  /**
   * Unlike comment
   */
  async unlikeComment(commentId, userId) {
    const comment = await ForumCommentRepository.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    await ForumCommentRepository.removeLike(commentId, userId);
    return { success: true };
  }

  /**
   * Giảm comment count cho topic
   */
  async decrementCommentsCount(topicId) {
    await ForumTopicRepository.decrementCommentsCount(topicId);
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
