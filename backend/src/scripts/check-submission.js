/**
 * Check Submission Status Script
 * Quickly verify if a submission was updated in the database
 * 
 * Usage:
 *   node src/scripts/check-submission.js <submissionId>
 */

const mongoose = require('mongoose');
const ExamSubmission = require('../models/ExamSubmission');
const ExamAnswer = require('../models/ExamAnswer');

// Load environment variables
require('dotenv').config();

async function checkSubmission(submissionId) {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find submission
    console.log(`🔍 Looking for submission: ${submissionId}\n`);
    const submission = await ExamSubmission.findById(submissionId)
      .populate('examId', 'title durationMinutes')
      .populate('studentId', 'name email');

    if (!submission) {
      console.log('❌ Submission not found');
      process.exit(1);
    }

    // Display submission details
    console.log('📋 SUBMISSION DETAILS');
    console.log('='.repeat(60));
    console.log(`ID:              ${submission._id}`);
    console.log(`Exam:            ${submission.examId?.title || 'N/A'}`);
    console.log(`Student:         ${submission.studentId?.name || 'N/A'} (${submission.studentId?.email || 'N/A'})`);
    console.log(`Status:          ${submission.status}`);
    console.log(`Total Score:     ${submission.totalScore}/${submission.maxScore}`);
    console.log(`Started At:      ${submission.startedAt}`);
    console.log(`Submitted At:    ${submission.submittedAt || 'Not submitted yet'}`);
    console.log(`Duration:        ${submission.durationSeconds || 0} seconds`);
    console.log(`Attempt:         #${submission.attemptNumber}`);
    console.log('='.repeat(60));
    console.log('');

    // Find answers
    const answers = await ExamAnswer.find({ submissionId: submission._id })
      .populate('questionId', 'content type');

    console.log(`📝 ANSWERS (${answers.length} total)`);
    console.log('='.repeat(60));

    if (answers.length === 0) {
      console.log('No answers found for this submission');
    } else {
      answers.forEach((answer, index) => {
        console.log(`\nAnswer #${index + 1}:`);
        console.log(`  Question Type:   ${answer.questionId?.type || 'N/A'}`);
        console.log(`  Selected:        ${JSON.stringify(answer.selectedOptions || answer.answerText || 'No answer')}`);
        console.log(`  Score:           ${answer.score || 0}/${answer.maxScore || 0}`);
        console.log(`  Auto-graded:     ${answer.isAutoGraded ? 'Yes' : 'No'}`);
        console.log(`  Feedback:        ${answer.feedback || 'No feedback'}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('');

    // Summary
    const gradedAnswers = answers.filter(a => a.isAutoGraded).length;
    const pendingAnswers = answers.filter(a => !a.isAutoGraded && a.questionId?.type !== 'essay').length;
    const essayAnswers = answers.filter(a => a.questionId?.type === 'essay').length;

    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Answers:        ${answers.length}`);
    console.log(`Auto-graded:          ${gradedAnswers}`);
    console.log(`Pending Manual:       ${pendingAnswers}`);
    console.log(`Essays:               ${essayAnswers}`);
    console.log(`Total Score:          ${submission.totalScore}/${submission.maxScore}`);
    console.log(`Percentage:           ${((submission.totalScore / submission.maxScore) * 100).toFixed(1)}%`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Get submission ID from command line
const submissionId = process.argv[2];

if (!submissionId) {
  console.log('Usage: node src/scripts/check-submission.js <submissionId>');
  console.log('');
  console.log('Example:');
  console.log('  node src/scripts/check-submission.js 6945853f3af3b12345678901');
  process.exit(1);
}

// Run the check
checkSubmission(submissionId);
