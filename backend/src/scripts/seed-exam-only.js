/**
 * Simple Exam Seeding Script
 * 
 * This script only creates exam-related data (questions and exam).
 * No users, classes, or other entities needed.
 * 
 * Perfect for testing the exam-taking API endpoints.
 * 
 * Usage:
 *   node src/scripts/seed-exam-only.js
 *   node src/scripts/seed-exam-only.js --clear  (clear existing test exams first)
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Question = require('../models/Question');
const Exam = require('../models/Exam');
const ExamQuestion = require('../models/ExamQuestion');

const CLEAR_EXISTING = process.argv.includes('--clear');

// ============================================
// SAMPLE QUESTIONS
// ============================================

const QUESTIONS = [
  // Multiple Choice Questions
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
    isPublic: true,
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
    isPublic: true,
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
    isPublic: true,
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
    isPublic: true,
  },
  
  // True/False Question
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
    isPublic: true,
  },
  
  // Short Answer Questions
  {
    type: 'short_answer',
    content: '<p>Tính giá trị của biểu thức: 2³ + 3² - 1</p>',
    correctAnswer: '16',
    explanation: '<p>2³ + 3² - 1 = 8 + 9 - 1 = 16</p>',
    difficulty: 'easy',
    subject: 'Toán Học',
    tags: ['tính toán', 'số học'],
    points: 0.5,
    isPublic: true,
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
    isPublic: true,
  },
  
  // Essay Questions
  {
    type: 'essay',
    content: '<p>Cho hàm số y = x³ - 3x² + 2</p>' +
      '<p>a) Tìm tập xác định, tính đạo hàm</p>' +
      '<p>b) Xét tính đồng biến, nghịch biến của hàm số</p>' +
      '<p>c) Tìm cực trị của hàm số</p>',
    correctAnswer: null,
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
    isPublic: true,
  },
  {
    type: 'essay',
    content: '<p>Giải phương trình: √(2x + 1) = x - 1</p>',
    correctAnswer: null,
    explanation: '<p>Điều kiện: x ≥ 1</p>' +
      '<p>Bình phương hai vế: 2x + 1 = (x - 1)²</p>' +
      '<p>⟺ 2x + 1 = x² - 2x + 1</p>' +
      '<p>⟺ x² - 4x = 0</p>' +
      '<p>⟺ x(x - 4) = 0</p>' +
      '<p>⟺ x = 0 hoặc x = 4</p>' +
      '<p>Kết hợp điều kiện: x = 4</p>',
    difficulty: 'medium',
    subject: 'Toán Học',
    tags: ['phương trình', 'căn thức'],
    points: 1.5,
    isPublic: true,
  },
];

// ============================================
// SEEDING FUNCTIONS
// ============================================

async function clearTestExams() {
  console.log('🗑️  Clearing existing test exams...');
  
  // Find test exams
  const testExams = await Exam.find({
    $or: [
      { title: /^\[TEST-EXAM\]/ },
      { description: /^\[TEST DATA\]/ }
    ]
  });
  
  const examIds = testExams.map(e => e._id);
  
  // Delete related data
  await ExamQuestion.deleteMany({ examId: { $in: examIds } });
  await Exam.deleteMany({ _id: { $in: examIds } });
  
  // Delete test questions (public ones created by this script)
  await Question.deleteMany({
    isPublic: true,
    subject: 'Toán Học',
    $or: [
      { tags: 'tập xác định' },
      { tags: 'đạo hàm' },
      { tags: 'tích phân' },
      { tags: 'vi-et' }
    ]
  });
  
  console.log(`✅ Cleared ${testExams.length} test exams and related data`);
}

async function seedQuestions() {
  console.log('\n📝 Seeding questions...');
  
  const questions = [];
  for (const questionData of QUESTIONS) {
    const question = await Question.create(questionData);
    questions.push(question);
    console.log(`   ✓ Created ${question.type}: ${question.content.substring(0, 50)}...`);
  }
  
  return questions;
}

async function seedExam(questions) {
  console.log('\n📋 Seeding exam...');
  
  // Calculate totals
  const totalQuestions = questions.length;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  
  // Get or create a dummy user ID for createdBy
  // Using a fixed ObjectId so we can clean it up later
  const dummyUserId = new mongoose.Types.ObjectId('676565656565656565656565');
  
  // Create exam
  const exam = await Exam.create({
    title: '[TEST-EXAM] KỲ THI THỬ TỐT NGHIỆP THPT 2025 - Môn TOÁN',
    description: '[TEST DATA] Đề thi thử bám sát cấu trúc đề thi THPT Quốc gia. Thời gian: 90 phút.',
    subject: 'Toán Học',
    durationMinutes: 90,
    mode: 'practice_test',
    shuffleQuestions: false,
    showResultsImmediately: true,
    createdBy: dummyUserId,
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
    
    // Clear existing test data if requested
    if (CLEAR_EXISTING) {
      await clearTestExams();
    }
    
    // Seed Questions
    const questions = await seedQuestions();
    
    // Seed Exam
    const { exam, examQuestions } = await seedExam(questions);
    
    // Print Summary
    console.log('\n' + '='.repeat(70));
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(70));
    console.log('\n📊 Summary:');
    console.log(`   Questions: ${questions.length}`);
    console.log(`   Exams: 1`);
    console.log(`   Exam Questions: ${examQuestions.length}`);
    console.log(`   Total Points: ${exam.totalPoints}`);
    
    console.log('\n📋 Exam Details:');
    console.log(`   ID: ${exam._id}`);
    console.log(`   Title: ${exam.title}`);
    console.log(`   Duration: ${exam.durationMinutes} minutes`);
    console.log(`   Questions: ${exam.totalQuestions}`);
    console.log(`   Points: ${exam.totalPoints}`);
    
    console.log('\n🎯 Test URLs:');
    console.log(`   Direct access: http://localhost:3000/exam/${exam._id}`);
    console.log(`   Take exam: http://localhost:3000/exam/${exam._id}/take`);
    
    console.log('\n💡 API Test:');
    console.log(`   GET http://localhost:5001/api/exams/${exam._id}`);
    
    console.log('\n📝 Question Types:');
    const questionTypes = questions.reduce((acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    }, {});
    Object.entries(questionTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} question(s)`);
    });
    
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
