const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

// --- IMPORT MODELS ---
const Contest = require('../models/Contest');
const Exam = require('../models/Exam');
const ContestExam = require('../models/ContestExam');

const seedContestExams = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`--- ĐÃ KẾT NỐI: GoPass_Official ---`);

    // BỘ NHỚ TẠM ĐỂ LƯU MAPPING ID
    const contestMap = {};
    const examMap = {};

    console.log("🚀 Bắt đầu quy trình Seed ContestExams...\n");

    // 1. TÌM CONTEST contest-olympic-2025 VÀ EXAMS
    console.log("📋 Tìm kiếm contests và exams...");
    
    const contests = await Contest.find({});
    contests.forEach(c => {
      // Map both old string IDs if we can extract from name/other fields
      // In this case, we'll match by name
      if (c.name === 'Olympic THPT Quốc Gia 2025') {
        contestMap['contest-olympic-2025'] = c._id;
        console.log(`   ✓ Tìm thấy Contest "Olympic THPT Quốc Gia 2025": ${c._id}`);
      }
    });

    const exams = await Exam.find({});
    exams.forEach(e => {
      // Map exams by their original string IDs based on content or order
      // We'll create a flexible mapping based on exam data
      const examTitle = e.title || '';
      
      // Match exams - you may need to adjust this based on actual exam titles
      if (examTitle.includes('Toán') || examTitle.includes('Math')) {
        examMap['exam-0001'] = e._id;
      } else if (examTitle.includes('Tiếng Anh') || examTitle.includes('English')) {
        examMap['exam-0002'] = e._id;
      } else if (examTitle.includes('Ngữ Văn') || examTitle.includes('Literature')) {
        examMap['exam-0003'] = e._id;
      }
    });

    // If mapping by title doesn't work, try to use first 3 exams in order
    if (Object.keys(examMap).length < 3) {
      console.log("   ⚠️  Không tìm đủ exams theo tiêu đề, sử dụng exam đầu tiên...");
      examMap['exam-0001'] = exams[0]?._id;
      examMap['exam-0002'] = exams[1]?._id;
      examMap['exam-0003'] = exams[2]?._id;
    }

    // Validate we have the required contest
    if (!contestMap['contest-olympic-2025']) {
      console.error("❌ Không tìm thấy contest 'contest-olympic-2025'");
      console.log("   Danh sách contests hiện có:", contests.map(c => c.name));
      process.exit(1);
    }

    console.log("\n📊 Exam Mapping:");
    console.log(`   exam-0001 -> ${examMap['exam-0001']}`);
    console.log(`   exam-0002 -> ${examMap['exam-0002']}`);
    console.log(`   exam-0003 -> ${examMap['exam-0003']}`);

    // 2. XÓA CÁC CONTESTEXAM CŨ CHỈ CHO CONTEST NÀY (không ảnh hưởng đến contests khác)
    console.log("\n🗑️  Xóa ContestExams cũ của contest này...");
    await ContestExam.deleteMany({ contestId: contestMap['contest-olympic-2025'] });

    // 3. TẠO CONTESTEXAM MỚI
    const contestExamsData = [
      {
        contestId: contestMap['contest-olympic-2025'],
        examId: examMap['exam-0001'],
        order: 1,
        weight: 1
      },
      {
        contestId: contestMap['contest-olympic-2025'],
        examId: examMap['exam-0002'],
        order: 2,
        weight: 1
      },
      {
        contestId: contestMap['contest-olympic-2025'],
        examId: examMap['exam-0003'],
        order: 3,
        weight: 1
      }
    ];

    const createdContestExams = await ContestExam.insertMany(contestExamsData);

    console.log("\n✅ Đã nạp ContestExams thành công:");
    createdContestExams.forEach((ce, index) => {
      console.log(`   [${index + 1}] Order: ${ce.order}, Weight: ${ce.weight}, ID: ${ce._id}`);
    });

    console.log("\n--- ✨ SEED CONTESTEXAMS THÀNH CÔNG ---\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi Seed ContestExams:", error.message);
    console.error(error);
    process.exit(1);
  }
};

seedContestExams();
