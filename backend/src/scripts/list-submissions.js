/**
 * List Recent Submissions Script
 * Shows the most recent exam submissions with their status
 * 
 * Usage:
 *   node src/scripts/list-submissions.js [limit]
 */

const mongoose = require('mongoose');
const ExamSubmission = require('../models/ExamSubmission');

// Load environment variables
require('dotenv').config();

async function listRecentSubmissions(limit = 10) {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find recent submissions
    console.log(`🔍 Fetching ${limit} most recent submissions...\n`);
    const submissions = await ExamSubmission.find()
      .populate('examId', 'title')
      .populate('studentId', 'name email')
      .sort({ startedAt: -1 })
      .limit(limit);

    if (submissions.length === 0) {
      console.log('❌ No submissions found');
      process.exit(0);
    }

    // Display submissions
    console.log('📋 RECENT SUBMISSIONS');
    console.log('='.repeat(120));
    console.log(
      'ID'.padEnd(26) +
      'Exam'.padEnd(25) +
      'Student'.padEnd(20) +
      'Status'.padEnd(12) +
      'Score'.padEnd(12) +
      'Submitted'.padEnd(20)
    );
    console.log('='.repeat(120));

    submissions.forEach((sub) => {
      const id = sub._id.toString().substring(0, 24);
      const exam = (sub.examId?.title || 'N/A').substring(0, 23);
      const student = (sub.studentId?.name || 'N/A').substring(0, 18);
      const status = sub.status;
      const score = `${sub.totalScore}/${sub.maxScore}`;
      const submitted = sub.submittedAt 
        ? new Date(sub.submittedAt).toLocaleString()
        : 'In progress';

      console.log(
        id.padEnd(26) +
        exam.padEnd(25) +
        student.padEnd(20) +
        status.padEnd(12) +
        score.padEnd(12) +
        submitted.padEnd(20)
      );
    });

    console.log('='.repeat(120));
    console.log('');

    // Statistics
    const inProgress = submissions.filter(s => s.status === 'in_progress').length;
    const submitted = submissions.filter(s => s.status === 'submitted').length;
    const graded = submissions.filter(s => s.status === 'graded').length;

    console.log('📊 STATISTICS');
    console.log('='.repeat(60));
    console.log(`Total shown:       ${submissions.length}`);
    console.log(`In Progress:       ${inProgress}`);
    console.log(`Submitted:         ${submitted}`);
    console.log(`Graded:            ${graded}`);
    console.log('='.repeat(60));
    console.log('');

    console.log('💡 TIP: To check details of a submission, run:');
    console.log('   node src/scripts/check-submission.js <submissionId>');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Get limit from command line
const limit = parseInt(process.argv[2]) || 10;

// Run the list
listRecentSubmissions(limit);
