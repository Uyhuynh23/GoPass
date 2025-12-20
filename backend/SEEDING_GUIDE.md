# Database Seeding Guide

This guide explains how to populate your MongoDB database with test data for the exam-taking system.

## Quick Start

### Basic Seeding (Minimal Data)

Populates users, questions, and one exam:

```bash
cd backend
node src/scripts/seed-exam-data.js
```

### Full Seeding (Complete Test Environment)

Includes classes, assignments, and contests:

```bash
cd backend
node src/scripts/seed-exam-data.js --full
```

### Clear & Reseed

Remove all existing data and start fresh:

```bash
cd backend
node src/scripts/seed-exam-data.js --clear --full
```

## What Gets Seeded

### Basic Mode (Default)

1. **Users** (5 users)

   - 1 Admin
   - 1 Teacher
   - 3 Students

2. **Questions** (9 questions)

   - 4 Multiple Choice (Math)
   - 1 True/False (Math)
   - 2 Short Answer (Math)
   - 2 Essay (Math)

3. **Exam** (1 exam)

   - Title: "[TEST-EXAM] KỲ THI THỬ TỐT NGHIỆP THPT 2025 - Môn TOÁN"
   - Duration: 90 minutes
   - All questions linked

4. **Sample Submission** (1 submission)
   - Student 1's completed submission
   - ~60% correct answers
   - Auto-graded (except essays)

### Full Mode (`--full` flag)

Everything from Basic Mode, plus:

5. **Class** (1 class)

   - Name: "[TEST-EXAM] Lớp 12A1 - Toán Nâng Cao"
   - Teacher: test-exam-teacher1
   - Students: All 3 students enrolled

6. **Assignment** (1 assignment)

   - Exam assigned to class
   - Start: 1 day ago
   - End: 7 days from now
   - Max attempts: 2

7. **Contest** (1 contest)
   - Name: "[TEST-EXAM] Cuộc Thi Toán Học Tháng 12"
   - Start: 2 hours ago
   - End: 22 hours from now
   - Exam linked to contest

## Test Credentials

After seeding, you can log in with these accounts:

| Role    | Email                         | Password   | Name                        |
| ------- | ----------------------------- | ---------- | --------------------------- |
| Admin   | test-exam-admin@gopass.com    | admin123   | [TEST] System Administrator |
| Teacher | test-exam-teacher1@gopass.com | teacher123 | [TEST] Nguyễn Văn Giáo      |
| Student | test-exam-student1@gopass.com | student123 | [TEST] Trần Thị An          |
| Student | test-exam-student2@gopass.com | student123 | [TEST] Lê Văn Bình          |
| Student | test-exam-student3@gopass.com | student123 | [TEST] Phạm Thị Cúc         |

## Testing Workflows

### 1. Direct Exam Access (Practice Mode)

```
1. Login as test-exam-student2@gopass.com
2. Navigate to: http://localhost:3000/exam/{examId}
3. Click "Start Exam"
4. Take the exam
5. Submit
6. View results
```

### 2. Assignment-Based Exam (Class Mode)

```
1. Login as test-exam-student2@gopass.com
2. Navigate to: http://localhost:3000/exam/{examId}?assignmentId={assignmentId}
3. See assignment deadline
4. Start and complete exam
5. Submission linked to assignment
```

### 3. Contest-Based Exam

```
1. Login as test-exam-student2@gopass.com
2. Navigate to: http://localhost:3000/contest/{contestId}
3. View contest details
4. Start exam from contest hub
5. Submit
6. See leaderboard update
```

### 4. Review Previous Submission

```
1. Login as test-exam-student1@gopass.com
2. Navigate to exam detail page
3. See "View Previous Attempt" button
4. Click to review
5. See all answers, scores, and explanations
```

### 5. Teacher Grading (Manual)

```
1. Login as test-exam-teacher1@gopass.com
2. Navigate to class
3. View assignment submissions
4. Grade essay questions manually
5. Provide feedback
```

## Database Collections After Seeding

```
GoPass_Official
├── users (5 documents)
├── questions (9 documents)
├── exams (1 document)
├── examquestions (9 documents)
├── examsubmissions (1 document)
├── examanswers (9 documents)
└── [Full mode only]
    ├── classes (1 document)
    ├── classmembers (3 documents)
    ├── examassignments (1 document)
    ├── contests (1 document)
    └── contestexams (1 document)
```

## Sample Data Details

### Question Types Distribution

- **Multiple Choice**: 4 questions (0.5 points each)
- **True/False**: 1 question (1 point, 4 statements)
- **Short Answer**: 2 questions (0.5 points each)
- **Essay**: 2 questions (2 points each)

**Total Points**: 8 points

### Sample Submission Scoring

The seeded submission for `student1` demonstrates:

- **Correct Answers**: ~60% (first 5-6 questions)
- **Incorrect Answers**: ~40% (remaining questions)
- **Auto-graded**: All except essay questions
- **Total Score**: ~4.8 / 8 points

This shows both correct and incorrect answer handling.

## Customization

### Adding More Questions

Edit `seed-exam-data.js` and add to the question arrays:

```javascript
const QUESTIONS_MC_MATH = [
  // Add your questions here
  {
    type: "multiple_choice",
    content: "<p>Your question</p>",
    options: [
      { id: "A", content: "Option A" },
      { id: "B", content: "Option B" },
      { id: "C", content: "Option C" },
      { id: "D", content: "Option D" },
    ],
    correctAnswer: "A",
    explanation: "<p>Explanation</p>",
    difficulty: "medium",
    subject: "Your Subject",
    tags: ["tag1", "tag2"],
    points: 1,
  },
];
```

### Adding More Exams

Modify the `seedExam()` function to create multiple exams:

```javascript
// Create Exam 1
const exam1 = await seedExam(teacher, mathQuestions);

// Create Exam 2
const exam2 = await seedExam(teacher, physicsQuestions);
```

### Changing Dates

Adjust time calculations in the script:

```javascript
// Assignment dates
const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
```

## Troubleshooting

### "Cannot find module" Error

Ensure you're in the backend directory:

```bash
cd backend
node src/scripts/seed-exam-data.js
```

### MongoDB Connection Error

Check your `.env` file has correct connection string:

```env
MONGODB_URI=mongodb://localhost:27017/GoPass_Official
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/GoPass_Official
```

### "Collection already exists" Warning

This is normal. Use `--clear` flag to remove existing data:

```bash
node src/scripts/seed-exam-data.js --clear
```

### Foreign Key Errors

Make sure you're using `--clear` when re-seeding to avoid orphaned references.

## Production Warning

⚠️ **NEVER run this script in production!**

This script is for development and testing only. It will:

- Create users with weak passwords
- Overwrite existing data (with `--clear` flag)
- Create test data that shouldn't be in production

## Next Steps After Seeding

1. **Start the Backend**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the Flow**

   - Login as `student2@gopass.com`
   - Navigate to exam
   - Take exam
   - Submit
   - Review results

4. **Verify Database**

   ```bash
   mongosh
   use GoPass_Official
   db.exams.find()
   db.examsubmissions.find()
   ```

5. **Check API Responses**
   - Open browser DevTools
   - Go to Network tab
   - Take an exam
   - Verify API calls match specification

## Additional Resources

- [API Specification](../EXAM_TAKING_API_SPECIFICATION.md)
- [Frontend Implementation](../frontend/FRONTEND_IMPLEMENTATION_SUMMARY.md)
- [Quick Reference](../frontend/QUICK_REFERENCE.md)
- [Migration Checklist](../frontend/MIGRATION_CHECKLIST.md)

## Cleanup Test Data

To remove all test data created by the seed script:

```bash
cd backend

# STEP 1: Always preview first (REQUIRED)
node src/scripts/cleanup-test-data.js --dry-run

# STEP 2: Review the output carefully, then confirm deletion
node src/scripts/cleanup-test-data.js --confirm

# OPTIONAL: List test data anytime
node src/scripts/list-test-data.js
```

### Safety Features

The cleanup script is **SAFE for production databases** because it:

1. **Only targets test data** - Identifies by specific markers:

   - Username/email starting with `test-exam-`
   - Names starting with `[TEST]`
   - Titles/descriptions starting with `[TEST-EXAM]` or `[TEST DATA]`

2. **Shows exactly what will be deleted** - Lists all items before any deletion

3. **Requires double confirmation**:

   - Must use `--confirm` flag
   - Must type "DELETE TEST DATA" exactly
   - Must type "yes" to final prompt

4. **Deletes in correct order** - Respects foreign key relationships to avoid orphaned data

5. **Won't touch production data** - Only deletes documents with test markers and their direct children

### What Gets Deleted

- ✅ Test users (and their submissions/answers)
- ✅ Test exams (and linked questions/submissions)
- ✅ Test classes (and members)
- ✅ Test contests (and linked exams)
- ✅ Questions created by test users
- ❌ Any data without test markers (SAFE)

## Cleanup Test Data

To remove all test data created by the seed script:

```bash
cd backend

# Preview what will be deleted (dry run)
node src/scripts/cleanup-test-data.js --dry-run

# Actually delete the test data
node src/scripts/cleanup-test-data.js
```

The cleanup script identifies test data by:

- Username/email starting with `test-exam-`
- Names starting with `[TEST]`
- Titles/descriptions starting with `[TEST-EXAM]` or `[TEST DATA]`

It safely deletes all related data in the correct order to respect foreign key relationships.
