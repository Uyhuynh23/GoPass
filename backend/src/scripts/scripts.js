const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const passwordHasher = require('../providers/PasswordHasher');

require('dotenv').config();

// --- IMPORT MODELS ---
const User = require('../models/User');
const Exam = require('../models/Exam');
const Class = require('../models/Class');
const ClassMember = require('../models/ClassMember');
const ClassJoinRequest = require('../models/ClassJoinRequest');
const Question = require('../models/Question');
const Contest = require('../models/Contest');
const ExamAssignment = require('../models/ExamAssignment');
const ExamSubmission = require('../models/ExamSubmission');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`--- ĐÃ KẾT NỐI: GoPass_Official ---`);

    const dbPath = path.join(__dirname, '../../../frontend/mock/db.json');
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    // BỘ NHỚ TẠM ĐỂ LƯU MAPPING ID (Old String ID -> New Mongo ObjectId)
    const userMap = {};
    const classMap = {};
    const examMap = {};
    const questionMap = {};
    const contestMap = {};

    console.log("🚀 Bắt đầu quy trình Seed (Auto-gen IDs & Mapping refs)...");

    // 1. SEED USERS - Hash mật khẩu mặc định 123456
    const hashedPassword = await passwordHasher.hash('123456');
    
    if (data.users) {
      await User.deleteMany({});
      const saltRounds = 10;
      const defaultPasswordHash = hashedPassword;
      
      for (const u of data.users) {
        const { id, passwordHash, ...userData } = u; // Loại bỏ id và pass cũ nếu có
        const newUser = await User.create({
          ...userData,
          name: u.name || u.full_name,
          passwordHash: defaultPasswordHash // Tất cả đều là 123456 đã hash
        });
        userMap[id] = newUser._id;
      }
      console.log(`✅ Đã nạp Users (Password mặc định: 123456).`);
    }

    // 2. SEED CLASSES
    if (data.classes) {
      await Class.deleteMany({});
      for (const c of data.classes) {
        const { id, ...classData } = c; // Loại bỏ id cũ
        const newClass = await Class.create({
          ...classData,
          teacherUserId: userMap[c.teacherUserId] || null
        });
        classMap[id] = newClass._id;
      }
      console.log("✅ Đã nạp Classes.");
    }

    // 3. SEED CLASS MEMBERS
    if (data.classmembers) {
      await ClassMember.deleteMany({});
      const membersToInsert = data.classmembers.map(cm => {
        const { id, ...rest } = cm; // Loại bỏ id cũ
        return {
          ...rest,
          classId: classMap[cm.classId],
          studentUserId: userMap[cm.studentUserId]
        };
      });
      await ClassMember.insertMany(membersToInsert);
      console.log("✅ Đã nạp Class Members.");
    }

    // 4. SEED JOIN REQUESTS
    if (data.classjoinrequests) {
      await ClassJoinRequest.deleteMany({});
      const reqsToInsert = data.classjoinrequests.map(r => {
        const { id, ...rest } = r; // Loại bỏ id cũ
        return {
          ...rest,
          classId: classMap[r.classId],
          studentUserId: userMap[r.studentUserId]
        };
      });
      await ClassJoinRequest.insertMany(reqsToInsert);
      console.log("✅ Đã nạp Join Requests.");
    }

    // 5. SEED EXAMS
    if (data.exams) {
      await Exam.deleteMany({});
      for (const e of data.exams) {
        const { id, ...examData } = e; // Loại bỏ id cũ
        const newExam = await Exam.create({
          ...examData,
          createdBy: userMap[e.createdBy] || null
        });
        examMap[id] = newExam._id;
      }
      console.log("✅ Đã nạp Exams.");
    }

    // 6. SEED QUESTIONS
    if (data.questions) {
      await Question.deleteMany({});
      for (const q of data.questions) {
        const { id, ...qData } = q; // Loại bỏ id cũ
        const newQuestion = await Question.create({
          ...qData,
          createdBy: userMap[q.createdBy] || null
          // Lưu ý: Nếu có linkedPassageId, bạn có thể map thêm ở đây
        });
        questionMap[id] = newQuestion._id;
      }
      console.log("✅ Đã nạp Questions.");
    }

    // 7. SEED CONTESTS
    if (data.contests) {
      await Contest.deleteMany({});
      for (const ct of data.contests) {
        const { id, ...contestData } = ct;
        // Xử lý trường hợp JSON dùng 'id' hoặc 'contest_id'
        const oldId = id || ct.contest_id;
        const newContest = await Contest.create({
          ...contestData,
          ownerId: userMap[ct.ownerId] || null
        });
        contestMap[oldId] = newContest._id;
      }
      console.log("✅ Đã nạp Contests.");
    }

    // 8. SEED EXAM ASSIGNMENTS
    if (data.examassignments) {
      await ExamAssignment.deleteMany({});
      const assignmentsToInsert = data.examassignments.map((assign) => {
        const { assignmentID, ...rest } = assign; // Loại bỏ assignmentID cũ
        return {
          ...rest,
          examId: examMap[assign.examId] || null,
          classId: classMap[assign.classId] || null,
          shuffleQuestions: assign.shuffleQuestions || false,
          allowLateSubmission: assign.allowLateSubmission || false,
        };
      });
      await ExamAssignment.insertMany(assignmentsToInsert);
      console.log("✅ Đã nạp Exam Assignments.");
    }

    // 9. SEED SUBMISSIONS
    const allSubmissions = [...(data.examsubmissions || []), ...(data.submissions || [])];

    if (allSubmissions.length > 0) {
      await ExamSubmission.deleteMany({});
      const subsToInsert = allSubmissions.map(s => {
        const { id, submission_id, ...rest } = s; // Loại bỏ mọi loại id cũ
        return {
          ...rest,
          examId: examMap[s.examId] || null,
          studentUserId: userMap[s.studentUserId || s.studentId] || null,
          classId: classMap[s.classId] || null,
          contestId: contestMap[s.contestId] || null
        };
      });
      await ExamSubmission.insertMany(subsToInsert);
      console.log("✅ Đã nạp Submissions.");
    }

    console.log("\n--- ✨ SEED THÀNH CÔNG: DỮ LIỆU SẠCH & REF CHUẨN ---");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi Seed:", error);
    process.exit(1);
  }
};

seedData();