/**
 * List Test Data Script
 * 
 * This script lists all test data without deleting anything.
 * Use this to verify what test data exists in your database.
 * 
 * Usage:
 *   node src/scripts/list-test-data.js
 *   node src/scripts/list-test-data.js --json  (output as JSON)
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Exam = require('../models/Exam');
const Class = require('../models/Class');
const Contest = require('../models/Contest');

const JSON_OUTPUT = process.argv.includes('--json');

async function listTestData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/GoPass_Official';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
    
    // Find test users
    const testUsers = await User.find({
      $or: [
        { username: /^test-exam-/ },
        { email: /^test-exam-/ },
        { fullName: /^\[TEST\]/ }
      ]
    }).select('username email fullName role createdAt');
    
    // Find test exams
    const testExams = await Exam.find({
      $or: [
        { title: /^\[TEST-EXAM\]/ },
        { description: /^\[TEST DATA\]/ }
      ]
    }).select('title subject totalQuestions createdAt');
    
    // Find test classes
    const testClasses = await Class.find({
      $or: [
        { name: /^\[TEST-EXAM\]/ },
        { description: /^\[TEST DATA\]/ }
      ]
    }).select('name subject createdAt');
    
    // Find test contests
    const testContests = await Contest.find({
      $or: [
        { name: /^\[TEST-EXAM\]/ },
        { description: /^\[TEST DATA\]/ }
      ]
    }).select('name startTime endTime createdAt');
    
    if (JSON_OUTPUT) {
      // Output as JSON
      const output = {
        summary: {
          users: testUsers.length,
          exams: testExams.length,
          classes: testClasses.length,
          contests: testContests.length,
          total: testUsers.length + testExams.length + testClasses.length + testContests.length
        },
        data: {
          users: testUsers,
          exams: testExams,
          classes: testClasses,
          contests: testContests
        }
      };
      console.log(JSON.stringify(output, null, 2));
    } else {
      // Human-readable output
      console.log('📊 TEST DATA SUMMARY');
      console.log('='.repeat(70));
      
      console.log(`\n👥 Users: ${testUsers.length}`);
      if (testUsers.length > 0) {
        console.log('─'.repeat(70));
        testUsers.forEach(u => {
          console.log(`   ${u.role.padEnd(8)} | ${u.email.padEnd(35)} | ${u.fullName}`);
        });
      }
      
      console.log(`\n📋 Exams: ${testExams.length}`);
      if (testExams.length > 0) {
        console.log('─'.repeat(70));
        testExams.forEach(e => {
          console.log(`   ${e.subject.padEnd(12)} | ${e.totalQuestions} questions | ${e.title}`);
        });
      }
      
      console.log(`\n🏫 Classes: ${testClasses.length}`);
      if (testClasses.length > 0) {
        console.log('─'.repeat(70));
        testClasses.forEach(c => {
          console.log(`   ${c.subject.padEnd(12)} | ${c.name}`);
        });
      }
      
      console.log(`\n🏆 Contests: ${testContests.length}`);
      if (testContests.length > 0) {
        console.log('─'.repeat(70));
        testContests.forEach(c => {
          const startDate = new Date(c.startTime).toLocaleDateString();
          console.log(`   ${startDate.padEnd(12)} | ${c.name}`);
        });
      }
      
      console.log('\n' + '='.repeat(70));
      console.log(`📦 Total test items: ${testUsers.length + testExams.length + testClasses.length + testContests.length}`);
      
      if (testUsers.length + testExams.length + testClasses.length + testContests.length === 0) {
        console.log('\n✅ No test data found in database');
      } else {
        console.log('\n💡 To delete this test data:');
        console.log('   1. node src/scripts/cleanup-test-data.js --dry-run');
        console.log('   2. node src/scripts/cleanup-test-data.js --confirm');
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error listing test data:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    if (!JSON_OUTPUT) {
      console.log('👋 Disconnected from MongoDB');
    }
  }
}

// Run the listing
listTestData();
