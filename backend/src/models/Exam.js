const mongoose = require("mongoose");
// 1. Tạo Sub-schema cho Bài đọc (Reading Passage)
// Nhúng trực tiếp vào Exam vì nó gắn liền với đề thi cụ thể
const readingPassageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  }, // ID thủ công (VD: "passage-eng-01") để khớp với linkedPassageId bên Question
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }, // Nội dung HTML của bài đọc
  }, { _id: false }); // Tắt _id tự động của Mongo để dùng id string cho dễ map


const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  subject: {
    type: String,
    required: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
    default: 60,
  },
  mode: {
    type: String,
    enum: ['practice_test', 'practice_global', 'contest'],
    default: 'practice_test',
  },
  shuffleQuestions: {
    type: Boolean,
    default: false,
  },
  showResultsImmediately: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
 
  // --- BỔ SUNG CÁC TRƯỜNG THIẾU ---


  // 2. Mảng chứa các bài đọc hiểu (Quan trọng cho môn Văn/Anh)
  readingPassages: [readingPassageSchema],


  // 3. Cache số lượng câu hỏi và tổng điểm
  // Giúp hiển thị nhanh ngoài danh sách mà không cần count lại từ bảng ExamQuestion
  totalQuestions: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 10
  },


  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}
);

// Index for queries
examSchema.index({ createdBy: 1 });
examSchema.index({ subject: 1 });

module.exports = mongoose.model("Exam", examSchema);
