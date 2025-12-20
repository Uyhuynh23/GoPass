/**
 * Cleanup Script for Test Exam Data
 * 
 * This script removes ONLY test data created by seed-exam-data.js
 * Identifies test data by the "test-exam" prefix and "[TEST]" markers
 * 
 * SAFE FOR PRODUCTION: Only deletes items with test markers, won't touch real data
 * 
 * Usage:
 *   node src/scripts/cleanup-test-data.js --dry-run  (RECOMMENDED: preview first)
 *   node src/scripts/cleanup-test-data.js --confirm  (actually delete)
 */

const mongoose = require('mongoose');
const readline = require('readline');
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

const DRY_RUN = process.argv.includes('--dry-run');
const CONFIRM = process.argv.includes('--confirm');

// Create readline interface for user confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

async function cleanup() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/GoPass_Official';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    if (DRY_RUN) {
      console.log('\n⚠️  DRY RUN MODE - No data will be deleted\n');
    }
    
    console.log('🔍 Finding test data...\n');
    
    // Find test users
    const testUsers = await User.find({
      $or: [
        { username: /^test-exam-/ },
        { email: /^test-exam-/ },
        { fullName: /^\[TEST\]/ }
      ]
    });
    console.log(`📦 Found ${testUsers.length} test users`);
    testUsers.forEach(u => console.log(`   - ${u.email}`));
    
    // Find test exams
    const testExams = await Exam.find({
      $or: [
        { title: /^\[TEST-EXAM\]/ },
        { description: /^\[TEST DATA\]/ }
      ]
    });
    console.log(`\n📦 Found ${testExams.length} test exams`);
    testExams.forEach(e => console.log(`   - ${e.title}`));
    
    // Find test classes
    const testClasses = await Class.find({
      $or: [
        { name: /^\[TEST-EXAM\]/ },
        { description: /^\[TEST DATA\]/ }
      ]
    });
    console.log(`\n📦 Found ${testClasses.length} test classes`);
    testClasses.forEach(c => console.log(`   - ${c.name}`));
    
    // Find test contests
    const testContests = await Contest.find({
      $or: [
        { name: /^\[TEST-EXAM\]/ },
        { description: /^\[TEST DATA\]/ }
      ]
    });
    console.log(`\n📦 Found ${testContests.length} test contests`);
    testContests.forEach(c => console.log(`   - ${c.name}`));
    
    // Get IDs for cascading deletes
    const userIds = testUsers.map(u => u._id);
    const examIds = testExams.map(e => e._id);
    const classIds = testClasses.map(c => c._id);
    const contestIds = testContests.map(c => c._id);
    
    // Find related data
    const examQuestions = await ExamQuestion.find({ examId: { $in: examIds } });
    const examSubmissions = await ExamSubmission.find({ examId: { $in: examIds } });
    const submissionIds = examSubmissions.map(s => s._id);
    const examAnswers = await ExamAnswer.find({ submissionId: { $in: submissionIds } });
    const examAssignments = await ExamAssignment.find({ examId: { $in: examIds } });
    const classMembers = await ClassMember.find({ classId: { $in: classIds } });
    const contestExams = await ContestExam.find({ contestId: { $in: contestIds } });
    const questions = await Question.find({ createdBy: { $in: userIds } });
    
    console.log(`\n📦 Found ${examQuestions.length} exam questions`);
    console.log(`📦 Found ${examSubmissions.length} exam submissions`);
    console.log(`📦 Found ${examAnswers.length} exam answers`);
    console.log(`📦 Found ${examAssignments.length} exam assignments`);
    console.log(`📦 Found ${classMembers.length} class members`);
    console.log(`📦 Found ${contestExams.length} contest exams`);
    console.log(`📦 Found ${questions.length} questions`);
    
    // Calculate totals
    const totalToDelete = 
      testUsers.length +
      testExams.length +
      testClasses.length +
      testContests.length +
      examQuestions.length +
      examSubmissions.length +
      examAnswers.length +
      examAssignments.length +
      classMembers.length +
      contestExams.length +
      questions.length;
    
    console.log(`\n📊 Total documents to delete: ${totalToDelete}`);
    
    if (DRY_RUN) {
      console.log('\n✅ Dry run complete - no data was deleted');
      console.log('💡 To actually delete, run: node src/scripts/cleanup-test-data.js --confirm');
      return;
    }
    
    if (!CONFIRM) {
      console.log('\n⚠️  Safety Check: --confirm flag required to delete data');
      console.log('💡 Review the data above, then run with --confirm flag:');
      console.log('   node src/scripts/cleanup-test-data.js --confirm');
      return;
    }
    
    // Double confirmation with user input
    console.log('\n⚠️  WARNING: This will permanently delete all test data listed above!');
    console.log('⚠️  Make sure you reviewed the list carefully.');
    console.log('');
    
    const answer1 = await askQuestion('Type "DELETE TEST DATA" to confirm (or anything else to cancel): ');
    
    if (answer1.trim() !== 'DELETE TEST DATA') {
      console.log('\n❌ Deletion cancelled - confirmation text did not match');
      return;
    }
    
    console.log('');
    const answer2 = await askQuestion(`Are you absolutely sure? This will delete ${totalToDelete} documents. Type "yes" to proceed: `);
    
    if (answer2.trim().toLowerCase() !== 'yes') {
      console.log('\n❌ Deletion cancelled');
      return;
    }
    
    console.log('\n🗑️  Deleting test data...\n');
    
    // Delete in correct order (to respect foreign keys)
    let deleted = 0;
    
    // 1. Delete exam answers
    if (examAnswers.length > 0) {
      const result = await ExamAnswer.deleteMany({ submissionId: { $in: submissionIds } });
      deleted += result.deletedCount;
      console.log(`   ✓ Deleted ${result.deletedCount} exam answers`);
    }
    
    // 2. Delete exam submissions
    if (examSubmissions.length > 0) {
      const result = await ExamSubmission.deleteMany({ examId: { $in: examIds } });
      deleted += result.deletedCount;
      console.log(`   ✓ Deleted ${result.deletedCount} exam submissions`);
    }
    
    // 3. Delete exam assignments
    if (examAssignments.length > 0) {
      const result = await ExamAssignment.deleteMany({ examId: { $in: examIds } });
      deleted += result.deletedCount;
      console.log(`   ✓ Deleted ${result.deletedCount} exam assignments`);
    }
    
    // 4. Delete exam questions
    if (examQuestions.length > 0) {
      const result = await ExamQuestion.deleteMany({ examId: { $in: examIds } });
      deleted += result.deletedCount;
      console.log(`   ✓ Deleted ${result.deletedCount} exam questions`);
    }
    
    // 5. Delete class members
    if (classMembers.length > 0) {
      const result = await ClassMember.deleteMany({ classId: { $in: classIds } });
      deleted += result.deletedCount;
      console.log(`   ✓ Deleted ${result.deletedCount} class members`);
    }
    
    // 6. Delete contest exams
    if (contestExams.length > 0) {
      const result = await ContestExam.deleteMany({ contestId: { $in: contestIds } });
      deleted += result.deletedCount;
      console.log(`   ✓ Deleted ${result.deletedCount} contest exams`);
    }
    
    // 7. Delete questions
    if (questions.length > 0) {
      const result = await Question.deleteMany({ createdBy: { $in: userIds } });
      deleted += result.deletedCount;
      console.log(`   ✓ Deleted ${result.deletedCount} questions`);
    }
    
    // 8. Delete exams
    if (testExams.length > 0) {
      const result = await Exam.deleteMany({ _id: { $in: examIds } });
      deleted += result.deletedCount;
      console.log(`   ✓ Deleted ${result.deletedCount} exams`);
    }
    
    // 9. Delete classes
    if (testClasses.length > 0) {
      const result = await Class.deleteMany({ _id: { $in: classIds } });
      deleted += result.deletedCount;
      console.log(`   ✓ Deleted ${result.deletedCount} classes`);
    }
    
    // 10. Delete contests
    if (testContests.length > 0) {
    rl.close();
      const result = await Contest.deleteMany({ _id: { $in: contestIds } });
      deleted += result.deletedCount;
      console.log(`   ✓ Deleted ${result.deletedCount} contests`);
    }
    
    // 11. Delete users (last, as they're referenced by other collections)
    if (testUsers.length > 0) {
      const result = await User.deleteMany({ _id: { $in: userIds } });
      deleted += result.deletedCount;
      console.log(`   ✓ Deleted ${result.deletedCount} users`);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ CLEANUP COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log(`\n📊 Total documents deleted: ${deleted}`);
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run cleanup
cleanup();
