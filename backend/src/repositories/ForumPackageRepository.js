const ForumPackage = require("../models/ForumPackage");

class ForumPackageRepository {
  /**
   * Tạo forum package mới
   */
  async create(data) {
    const forumPackage = new ForumPackage(data);
    return await forumPackage.save();
  }

  /**
   * Tìm package theo ID
   */
  async findById(packageId) {
    return await ForumPackage.findById(packageId)
      .populate("sourceArticle.articleId")
      .populate("vnsocialTopic.topicId")
      .populate("createdBy", "firstName lastName email")
      .populate("forumTopics");
  }

  /**
   * Lấy danh sách packages
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 20,
      status = "published",
      topicId,
      sortBy = "-createdAt",
    } = options;

    const filter = { status };
    if (topicId) {
      filter["vnsocialTopic.topicId"] = topicId;
    }

    const packages = await ForumPackage.find(filter)
      .sort(sortBy)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("createdBy", "firstName lastName email")
      .populate("forumTopics", "title stats");

    const total = await ForumPackage.countDocuments(filter);

    return {
      packages,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Cập nhật package
   */
  async update(packageId, updateData) {
    return await ForumPackage.findByIdAndUpdate(packageId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Thêm forumTopic vào package
   */
  async addForumTopic(packageId, topicId) {
    return await ForumPackage.findByIdAndUpdate(
      packageId,
      { $push: { forumTopics: topicId } },
      { new: true }
    );
  }

  /**
   * Xóa package
   */
  async delete(packageId) {
    return await ForumPackage.findByIdAndDelete(packageId);
  }
}

module.exports = new ForumPackageRepository();
