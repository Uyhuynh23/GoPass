/**
 * Seed Script for Exam Taking System
 * 
 * This script populates the database with:
 * - Sample users (students, teachers, admin)
 * - Questions (multiple choice, true/false, short answer, essay)
 * - Exams with linked questions
 * - Classes and assignments (optional)
 * - Contests (optional)
 * 
 * Usage:
 *   node src/scripts/seed-exam-data.js
 *   node src/scripts/seed-exam-data.js --full  (includes classes, assignments, contests)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Question = require('../models/Question');
const Exam = require('../models/Exam');
const ExamQuestion = require('../models/ExamQuestion');
const ExamAssignment = require('../models/ExamAssignment');
const ExamSubmission = require('../models/ExamSubmission');
const ExamAnswer = require('../models/ExamAnswer');
const Class = require('../models/Class');
const ClassMember = require('../models/ClassMember');
const Contest = require('../models/Contest');
const ContestExam = require('../models/ContestExam');

// Configuration
const INCLUDE_FULL_DATA = process.argv.includes('--full');
const CLEAR_EXISTING = process.argv.includes('--clear');

// ============================================
// SAMPLE DATA DEFINITIONS
// ============================================

// Users
const USERS = [
  {
    username: 'test-exam-admin',
    email: 'test-exam-admin@gopass.com',
    password: 'admin123',
    fullName: '[TEST] System Administrator',
    role: 'admin',
  },
  {
    username: 'test-exam-teacher1',
    email: 'test-exam-teacher1@gopass.com',
    password: 'teacher123',
    fullName: '[TEST] Nguyễn Văn Giáo',
    role: 'teacher',
  },
  {
    username: 'test-exam-student1',
    email: 'test-exam-student1@gopass.com',
    password: 'student123',
    fullName: '[TEST] Trần Thị An',
    role: 'student',
  },
  {
    username: 'test-exam-student2',
    email: 'test-exam-student2@gopass.com',
    password: 'student123',
    fullName: '[TEST] Lê Văn Bình',
    role: 'student',
  },
  {
    username: 'test-exam-student3',
    email: 'test-exam-student3@gopass.com',
    password: 'student123',
    fullName: '[TEST] Phạm Thị Cúc',
    role: 'student',
  },
];

// Questions - Multiple Choice (Math)
const QUESTIONS_MC_MATH = [
  {
    type: 'multiple_choice',
    content: '<p>Tập xác định của hàm số y = √(x - 2) là:</p>',
    options: [
      { id: 'A', content: '(-∞, 2)' },
      { id: 'B', content: '[2, +∞)' },
      { id: 'C', content: '(-∞, 2]' },
      { id: 'D', content: '(2, +∞)' },
    ],
    correctAnswer: 'B',
    explanation: '<p>Hàm căn bậc hai xác định khi biểu thức dưới dấu căn không âm: x - 2 ≥ 0 ⟺ x ≥ 2</p>',
    difficulty: 'easy',
    subject: 'Toán Học',
    tags: ['tập xác định', 'hàm số'],
    points: 0.5,
  },
  {
    type: 'multiple_choice',
    content: '<p>Đạo hàm của hàm số y = x³ - 3x + 1 là:</p>',
    options: [
      { id: 'A', content: 'y\' = 3x² - 3' },
      { id: 'B', content: 'y\' = 3x² + 3' },
      { id: 'C', content: 'y\' = x² - 3' },
      { id: 'D', content: 'y\' = 3x² - 3x' },
    ],
    correctAnswer: 'A',
    explanation: '<p>Áp dụng công thức đạo hàm: (x³)\' = 3x², (3x)\' = 3, (1)\' = 0</p>',
    difficulty: 'easy',
    subject: 'Toán Học',
    tags: ['đạo hàm', 'giải tích'],
    points: 0.5,
  },
  {
    type: 'multiple_choice',
    content: '<p>Phương trình x² - 4x + 3 = 0 có nghiệm là:</p>',
    options: [
      { id: 'A', content: 'x = 1 và x = 3' },
      { id: 'B', content: 'x = -1 và x = -3' },
      { id: 'C', content: 'x = 2 và x = 2' },
      { id: 'D', content: 'Vô nghiệm' },
    ],
    correctAnswer: 'A',
    explanation: '<p>Phân tích: x² - 4x + 3 = (x - 1)(x - 3) = 0 ⟹ x = 1 hoặc x = 3</p>',
    difficulty: 'easy',
    subject: 'Toán Học',
    tags: ['phương trình', 'đại số'],
    points: 0.5,
  },
  {
    type: 'multiple_choice',
    content: '<p>Tích phân ∫₀¹ x² dx bằng:</p>',
    options: [
      { id: 'A', content: '1/3' },
      { id: 'B', content: '1/2' },
      { id: 'C', content: '1' },
      { id: 'D', content: '2/3' },
    ],
    correctAnswer: 'A',
    explanation: '<p>∫₀¹ x² dx = [x³/3]₀¹ = 1³/3 - 0³/3 = 1/3</p>',
    difficulty: 'medium',
    subject: 'Toán Học',
    tags: ['tích phân', 'giải tích'],
    points: 0.5,
  },
];

// Questions - True/False
const QUESTIONS_TF = [
  {
    type: 'true_false',
    content: '<p>Cho các mệnh đề sau, xác định đúng/sai:</p>' +
      '<p>a) Hàm số y = x² đồng biến trên ℝ</p>' +
      '<p>b) Hàm số y = x³ luôn đồng biến trên ℝ</p>' +
      '<p>c) Hàm số y = 1/x đồng biến trên (0, +∞)</p>' +
      '<p>d) Hàm số y = sin(x) tuần hoàn với chu kỳ 2π</p>',
    options: [
      { id: 'a', content: 'Hàm số y = x² đồng biến trên ℝ' },
      { id: 'b', content: 'Hàm số y = x³ luôn đồng biến trên ℝ' },
      { id: 'c', content: 'Hàm số y = 1/x đồng biến trên (0, +∞)' },
      { id: 'd', content: 'Hàm số y = sin(x) tuần hoàn với chu kỳ 2π' },
    ],
    correctAnswer: {
      a: 'false',
      b: 'true',
      c: 'false',
      d: 'true',
    },
    explanation: '<p>a) Sai - y = x² chỉ đồng biến trên (0, +∞)</p>' +
      '<p>b) Đúng - y\' = 3x² ≥ 0 ∀x</p>' +
      '<p>c) Sai - y = 1/x nghịch biến trên (0, +∞)</p>' +
      '<p>d) Đúng - sin(x + 2π) = sin(x)</p>',
    difficulty: 'medium',
    subject: 'Toán Học',
    tags: ['hàm số', 'tính chất'],
    points: 1,
  },
];

// Questions - Short Answer
const QUESTIONS_SHORT = [
  {
    type: 'short_answer',
    content: '<p>Tính giá trị của biểu thức: 2³ + 3² - 1</p>',
    correctAnswer: '16',
    explanation: '<p>2³ + 3² - 1 = 8 + 9 - 1 = 16</p>',
    difficulty: 'easy',
    subject: 'Toán Học',
    tags: ['tính toán', 'số học'],
    points: 0.5,
  },
  {
    type: 'short_answer',
    content: '<p>Cho phương trình x² - 6x + 8 = 0. Tổng hai nghiệm của phương trình là bao nhiêu?</p>',
    correctAnswer: '6',
    explanation: '<p>Theo định lý Vi-et: x₁ + x₂ = -b/a = 6/1 = 6</p>',
    difficulty: 'medium',
    subject: 'Toán Học',
    tags: ['phương trình', 'vi-et'],
    points: 0.5,
  },
];

// Questions - Essay
const QUESTIONS_ESSAY = [
  {
    type: 'essay',
    content: '<p>Cho hàm số y = x³ - 3x² + 2</p>' +
      '<p>a) Tìm tập xác định, tính đạo hàm</p>' +
      '<p>b) Xét tính đồng biến, nghịch biến của hàm số</p>' +
      '<p>c) Tìm cực trị của hàm số</p>',
    correctAnswer: null, // Essay questions don't have automatic correct answer
    explanation: '<p>Hướng dẫn giải:</p>' +
      '<p>a) TXĐ: D = ℝ; y\' = 3x² - 6x</p>' +
      '<p>b) y\' = 0 ⟺ x = 0 hoặc x = 2</p>' +
      '<p>   Hàm đồng biến trên (-∞, 0) và (2, +∞)</p>' +
      '<p>   Hàm nghịch biến trên (0, 2)</p>' +
      '<p>c) Điểm cực đại: x = 0, y = 2</p>' +
      '<p>   Điểm cực tiểu: x = 2, y = -2</p>',
    difficulty: 'hard',
    subject: 'Toán Học',
    tags: ['khảo sát hàm số', 'cực trị'],
    points: 2,
  },
];

// ============================================
// SEEDING FUNCTIONS
// ============================================

async function clearDatabase() {
  console.log('🗑️  Clearing existing data...');
  
  await User.deleteMany({});
  await Question.deleteMany({});
  await Exam.deleteMany({});
  await ExamQuestion.deleteMany({});
  await ExamSubmission.deleteMany({});
  await ExamAnswer.deleteMany({});
  await ExamAssignment.deleteMany({});
  await Class.deleteMany({});
  await ClassMember.deleteMany({});
  await Contest.deleteMany({});
  await ContestExam.deleteMany({});
  
  console.log('✅ Database cleared');
}

async function seedUsers() {
  console.log('\n👥 Seeding users...');
  
  const users = [];
  for (const userData of USERS) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });
    users.push(user);
    console.log(`   ✓ Created ${user.role}: ${user.username}`);
  }
  
  return users;
}

async function seedQuestions(createdBy) {
  console.log('\n📝 Seeding questions...');
  
  const allQuestions = [
    ...QUESTIONS_MC_MATH,
    ...QUESTIONS_TF,
    ...QUESTIONS_SHORT,
    ...QUESTIONS_ESSAY,
  ];
  
  const questions = [];
  for (const questionData of allQuestions) {
    const question = await Question.create({
      ...questionData,
      createdBy: createdBy._id,
      isPublic: true,
    });
    questions.push(question);
    console.log(`   ✓ Created ${question.type}: ${question.content.substring(0, 50)}...`);
  }
  
  return questions;
}

async function seedExam(createdBy, questions) {
  console.log('\n📋 Seeding exam...');
  
  // Calculate totals
  const totalQuestions = questions.length;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  
  // Create exam
  const exam = await Exam.create({
    title: '[TEST-EXAM] KỲ THI THỬ TỐT NGHIỆP THPT 2025 - Môn TOÁN',
    description: '[TEST DATA] Đề thi thử bám sát cấu trúc đề thi THPT Quốc gia. Thời gian: 90 phút.',
    subject: 'Toán Học',
    durationMinutes: 90,
    mode: 'test',
    shuffleQuestions: false,
    showResultsImmediately: true,
    createdBy: createdBy._id,
    isPublished: true,
    totalQuestions,
    totalPoints,
  });
  
  console.log(`   ✓ Created exam: ${exam.title}`);
  
  // Link questions to exam
  console.log('   Linking questions to exam...');
  let order = 1;
  const examQuestions = [];
  
  for (const question of questions) {
    const examQuestion = await ExamQuestion.create({
      examId: exam._id,
      questionId: question._id,
      order: order++,
      section: order <= 5 ? 'Phần I - Trắc nghiệm' : 'Phần II - Tự luận',
      maxScore: question.points,
    });
    examQuestions.push(examQuestion);
  }
  
  console.log(`   ✓ Linked ${examQuestions.length} questions to exam`);
  
  return { exam, examQuestions };
}

async function seedClass(teacher) {
  console.log('\n🏫 Seeding class...');
  
  const classData = await Class.create({
    name: '[TEST-EXAM] Lớp 12A1 - Toán Nâng Cao',
    description: '[TEST DATA] Lớp ôn thi THPT Quốc gia môn Toán',
    subject: 'Toán Học',
    teacherId: teacher._id,
    isActive: true,
  });
  
  console.log(`   ✓ Created class: ${classData.name}`);
  
  return classData;
}

async function seedClassMembers(classData, students) {
  console.log('\n👨‍🎓 Seeding class members...');
  
  const members = [];
  for (const student of students) {
    const member = await ClassMember.create({
      classId: classData._id,
      studentId: student._id,
      role: 'student',
      joinedAt: new Date(),
    });
    members.push(member);
    console.log(`   ✓ Added ${student.fullName} to class`);
  }
  
  return members;
}

async function seedExamAssignment(exam, classData) {
  console.log('\n📌 Seeding exam assignment...');
  
  const now = new Date();
  const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Started 1 day ago
  const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Ends in 7 days
  
  const assignment = await ExamAssignment.create({
    examId: exam._id,
    classId: classData._id,
    startTime,
    endTime,
    shuffleQuestions: false,
    allowLateSubmission: true,
    maxAttempts: 2,
  });
  
  console.log(`   ✓ Created assignment for class: ${classData.name}`);
  console.log(`      Start: ${startTime.toISOString()}`);
  console.log(`      End: ${endTime.toISOString()}`);
  
  return assignment;
}

async function seedContest(createdBy, exam) {
  console.log('\n🏆 Seeding contest...');
  
  const now = new Date();
  const startTime = new Date(now.getTime() - 2 * 60 * 60 * 1000); // Started 2 hours ago
  const endTime = new Date(now.getTime() + 22 * 60 * 60 * 1000); // Ends in 22 hours
  
  const contest = await Contest.create({
    name: '[TEST-EXAM] Cuộc Thi Toán Học Tháng 12',
    description: '[TEST DATA] Cuộc thi Toán học dành cho học sinh THPT',
    subjects: ['Toán Học'],
    startTime,
    endTime,
    createdBy: createdBy._id,
    isPublished: true,
  });
  
  console.log(`   ✓ Created contest: ${contest.name}`);
  
  // Link exam to contest
  const contestExam = await ContestExam.create({
    contestId: contest._id,
    examId: exam._id,
    order: 1,
  });
  
  console.log(`   ✓ Linked exam to contest`);
  
  return { contest, contestExam };
}

async function seedSampleSubmission(exam, student, assignment) {
  console.log('\n📤 Seeding sample submission...');
  
  // Get exam questions
  const examQuestions = await ExamQuestion.find({ examId: exam._id })
    .populate('questionId')
    .sort({ order: 1 });
  
  // Create submission
  const submission = await ExamSubmission.create({
    examId: exam._id,
    studentId: student._id,
    assignmentId: assignment ? assignment._id : null,
    status: 'submitted',
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
    submittedAt: new Date(),
    totalScore: 0, // Will be calculated
    maxScore: exam.totalPoints,
    attemptNumber: 1,
  });
  
  console.log(`   ✓ Created submission for student: ${student.fullName}`);
  
  // Create sample answers (student got some right, some wrong)
  const answers = [];
  let totalScore = 0;
  
  for (let i = 0; i < examQuestions.length; i++) {
    const examQuestion = examQuestions[i];
    const question = examQuestion.questionId;
    
    let answerData = {};
    let score = 0;
    let isCorrect = false;
    
    // Simulate answers - first 60% correct, rest wrong or empty
    const shouldBeCorrect = i < Math.floor(examQuestions.length * 0.6);
    
    switch (question.type) {
      case 'multiple_choice':
        if (shouldBeCorrect) {
          answerData.selectedOptions = [question.correctAnswer];
          score = question.points;
          isCorrect = true;
        } else {
          // Pick a random wrong answer
          const wrongOptions = question.options
            .map(opt => opt.id)
            .filter(id => id !== question.correctAnswer);
          answerData.selectedOptions = wrongOptions.length > 0 
            ? [wrongOptions[Math.floor(Math.random() * wrongOptions.length)]]
            : [];
        }
        break;
        
      case 'true_false':
        if (shouldBeCorrect) {
          answerData.selectedOptions = question.correctAnswer;
          score = question.points;
          isCorrect = true;
        } else {
          // Flip some answers
          const flipped = {};
          for (const key in question.correctAnswer) {
            flipped[key] = Math.random() > 0.5 
              ? question.correctAnswer[key] 
              : (question.correctAnswer[key] === 'true' ? 'false' : 'true');
          }
          answerData.selectedOptions = flipped;
          // Calculate partial score
          let correct = 0;
          for (const key in question.correctAnswer) {
            if (flipped[key] === question.correctAnswer[key]) correct++;
          }
          score = (correct / Object.keys(question.correctAnswer).length) * question.points;
        }
        break;
        
      case 'short_answer':
        if (shouldBeCorrect) {
          answerData.answerText = question.correctAnswer;
          score = question.points;
          isCorrect = true;
        } else {
          answerData.answerText = 'Wrong answer';
        }
        break;
        
      case 'essay':
        // Essay always needs manual grading
        answerData.answerText = shouldBeCorrect 
          ? 'Detailed answer with proper reasoning...'
          : 'Incomplete answer...';
        score = 0; // To be graded manually
        break;
    }
    
    totalScore += score;
    
    const answer = await ExamAnswer.create({
      submissionId: submission._id,
      questionId: question._id,
      answerText: answerData.answerText || null,
      selectedOptions: answerData.selectedOptions || null,
      score,
      maxScore: question.points,
      isCorrect,
      feedback: !isCorrect && question.type !== 'essay' 
        ? `Incorrect. Correct answer is: ${question.correctAnswer}`
        : null,
      gradedBy: question.type === 'essay' ? null : 'auto',
    });
    
    answers.push(answer);
  }
  
  // Update submission total score
  submission.totalScore = totalScore;
  await submission.save();
  
  console.log(`   ✓ Created ${answers.length} answers`);
  console.log(`   ✓ Total score: ${totalScore.toFixed(2)}/${exam.totalPoints}`);
  
  return { submission, answers };
}

// ============================================
// MAIN SEED FUNCTION
// ============================================

async function seed() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/GoPass_Official';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data if requested
    if (CLEAR_EXISTING) {
      await clearDatabase();
    }
    
    // 1. Seed Users
    const users = await seedUsers();
    const admin = users.find(u => u.role === 'admin');
    const teacher = users.find(u => u.role === 'teacher');
    const students = users.filter(u => u.role === 'student');
    
    // 2. Seed Questions
    const questions = await seedQuestions(admin);
    
    // 3. Seed Exam
    const { exam, examQuestions } = await seedExam(teacher, questions);
    
    // 4. Seed Full Data (if requested)
    let classData, assignment, contest;
    
    if (INCLUDE_FULL_DATA) {
      // Seed Class
      classData = await seedClass(teacher);
      
      // Seed Class Members
      await seedClassMembers(classData, students);
      
      // Seed Exam Assignment
      assignment = await seedExamAssignment(exam, classData);
      
      // Seed Contest
      const { contest: contestData } = await seedContest(admin, exam);
      contest = contestData;
    }
    
    // 5. Seed Sample Submission (for first student)
    if (students.length > 0) {
      await seedSampleSubmission(exam, students[0], assignment);
    }
    
    // Print Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Questions: ${questions.length}`);
    console.log(`   Exams: 1`);
    console.log(`   Exam Questions: ${examQuestions.length}`);
    if (INCLUDE_FULL_DATA) {
      console.log(`   Classes: 1`);
      console.log(`   Class Members: ${students.length}`);
      console.log(`   Assignments: 1`);
      console.log(`   Contests: 1`);
    }
    console.log(`   Sample Submissions: 1`);
    
    console.log('\n🔐 Test Credentials:');
    console.log('   Admin:    test-exam-admin@gopass.com / admin123');
    console.log('   Teacher:  test-exam-teacher1@gopass.com / teacher123');
    console.log('   Student:  test-exam-student1@gopass.com / student123');
    console.log('   Student:  test-exam-student2@gopass.com / student123');
    console.log('   Student:  test-exam-student3@gopass.com / student123');
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Start backend: cd backend && npm run dev');
    console.log('   2. Start frontend: cd frontend && npm run dev');
    console.log('   3. Login as test-exam-student1@gopass.com');
    console.log(`   4. Navigate to: http://localhost:3000/exam/${exam._id}`);
    if (assignment) {
      console.log(`   5. Or with assignment: http://localhost:3000/exam/${exam._id}?assignmentId=${assignment._id}`);
    }
    if (contest) {
      console.log(`   6. Or contest: http://localhost:3000/contest/${contest._id}`);
    }
    
    console.log('\n');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the seed function
seed();
