# Submission Flow Testing Guide

**Date:** December 20, 2025  
**Purpose:** Verify exam submission handling and database updates

---

## Submission Flow Overview

### Frontend Flow

1. **TakeExamClient.tsx** (Client Component)

   - User clicks "Submit Exam" button
   - Calls `handleFinishExam()` from `useExamSubmission` hook
   - This calls `submitExamCtx()` which is the `submitExam()` from ExamContext

2. **ExamContext.tsx** (Context Provider)

   - `submitExam()` function:
     - Checks if submission is allowed (not submitting, not review mode, has submission)
     - Sets `isSubmitting: true` to prevent duplicate submissions
     - Collects all answers from `examState.answers` Map
     - Calculates time spent
     - Calls `submissionService.submitExam()`
     - Clears localStorage on success
     - Shows error alert on failure

3. **submission.service.ts** (API Service)

   - `submitExam()` method:
     - Makes POST request to `/submissions/:submissionId/submit`
     - Sends `{ answers, timeSpentSeconds }` in body
     - Uses `httpClient` with `requiresAuth: true`
     - Returns `ExamSubmission | null`

4. **httpClient.ts** (HTTP Client)
   - Constructs full URL: `http://localhost:5001/api/submissions/:id/submit`
   - Adds JWT token from localStorage to Authorization header
   - Makes fetch() request to backend

---

### Backend Flow

1. **submission.routes.js** (Routes)

   ```javascript
   router.post("/:submissionId/submit", SubmissionController.submitExam);
   ```

   - Route: `POST /api/submissions/:submissionId/submit`
   - Middleware: `authenticate` (checks JWT token)

2. **SubmissionController.js** (Controller)

   - `submitExam()` method:
     - Extracts `submissionId` from params
     - Extracts `userId` from `req.user` (set by authenticate middleware)
     - Extracts `answers` and `timeSpentSeconds` from body
     - Calls `SubmissionService.submitExam()`
     - Returns success response with grading result

3. **SubmissionService.js** (Service/Business Logic)
   - `submitExam()` method performs:

     **Step 1: Validation**

     - Find submission by ID
     - Check ownership (studentId matches)
     - Check status (must be 'in_progress')

     **Step 2: Save Final Answers**

     - Loop through all answers
     - Call `saveAnswer()` for each (creates ExamAnswer document)

     **Step 3: Auto-Grading**

     - Fetch all saved answers from database
     - Fetch all exam questions with correct answers
     - For each answer:
       - **Multiple Choice:** Exact string match → Full score or 0
       - **True/False:** Partial credit based on correct options
       - **Short Answer:** String comparison → Auto-grade if match, else manual
       - **Essay:** Always requires manual grading
     - Update each ExamAnswer with score and feedback

     **Step 4: Update Submission**

     - Calculate total score
     - Set status: 'graded' (if all auto-graded) or 'submitted' (if needs manual grading)
     - Update ExamSubmission:
       ```javascript
       {
         status: 'graded' | 'submitted',
         totalScore: <calculated>,
         submittedAt: new Date(),
         durationSeconds: timeSpentSeconds
       }
       ```

     **Step 5: Contest Integration (if applicable)**

     - If submission has contestId
     - Find ContestParticipation for this student
     - Add exam score to participation
     - Recalculate rankings

     **Step 6: Return Result**

     ```javascript
     {
       submissionId,
         status,
         totalScore,
         maxScore,
         submittedAt,
         gradedAnswers,
         pendingManualGrading;
     }
     ```

---

## Database Updates

### Collections Modified

1. **ExamAnswer** (exam_answers collection)

   - **Insert:** One document per question answered
   - **Update:** Score, feedback, isAutoGraded fields
   - **Documents:**
     ```javascript
     {
       submissionId: ObjectId,
       questionId: ObjectId,
       selectedOptions: ["A"] | { "statement1": true },
       answerText: "...",
       score: 1.5,
       maxScore: 2,
       feedback: "Correct!" | "Pending manual grading",
       isAutoGraded: true | false
     }
     ```

2. **ExamSubmission** (exam_submissions collection)

   - **Update:** Single document update
   - **Fields Changed:**
     - `status`: 'in_progress' → 'graded' | 'submitted'
     - `totalScore`: 0 → <calculated total>
     - `submittedAt`: null → Date
     - `durationSeconds`: 0 → <actual time spent>

3. **ContestParticipation** (contest_participations collection) - Optional
   - **Update:** If submission is part of a contest
   - **Fields Changed:**
     - `examScores`: Appends new score
     - `totalScore`: Recalculated
     - `rank`: Recalculated
     - `percentile`: Recalculated

---

## Testing Checklist

### Pre-Test Setup

- [x] Backend running on port 5001
- [x] Frontend running on port 3000
- [ ] MongoDB connection active
- [ ] Test exam exists with questions
- [ ] Test user is logged in
- [ ] User has active submission (status: 'in_progress')

### Test Steps

1. **Start Exam**

   ```
   Navigate to: http://localhost:3000/exam/[examId]/take
   ```

   - Should load exam questions
   - Should show timer counting down
   - Should have submission ID in ExamContext

2. **Answer Questions**

   - Answer at least 2-3 questions
   - Mix of question types (multiple choice, true/false, etc.)
   - Check localStorage has draft answers

3. **Submit Exam**

   - Click "Submit Exam" button
   - Confirm submission in dialog

4. **Check Frontend Logs** (Browser DevTools Console)

   ```
   Expected logs:
   📤 Submitting exam: { submissionId, answersCount, timeSpent }
   🔄 Calling API POST /submissions/:id/submit
   🌐 HTTP POST http://localhost:5001/api/submissions/:id/submit
   📥 API Response: { success: true, data: {...} }
   ✅ Exam submitted successfully
   ✅ Cleared storage for [examId]
   ```

5. **Check Backend Logs** (Terminal running `npm run dev`)

   ```
   Expected logs:
   📥 Submit Exam Request: { submissionId, userId, answersCount, timeSpent }
   🔍 SubmissionService.submitExam called
   📋 Submission found: { id, examId, status, studentId }
   💾 Saving final answers: X
   📊 Grading complete: { totalScore, gradedCount, pendingManualGrading }
   💾 Updating submission in database...
   ✅ Submission updated in database
   🎉 Submit exam complete
   ✅ Submission successful: { submissionId, status, totalScore }
   ```

6. **Verify Database Updates**

   **Option A: MongoDB Compass**

   - Connect to: `mongodb+srv://uy123:GOPASS300@cs300.obc6qzc.mongodb.net/`
   - Database: `GoPass_Official`
   - Collection: `exam_submissions`
   - Find submission by ID
   - Verify fields:
     - `status`: 'graded' or 'submitted'
     - `totalScore`: > 0
     - `submittedAt`: Recent timestamp
     - `durationSeconds`: > 0

   **Option B: Backend Script**

   ```javascript
   // In backend terminal
   node -e "
   const mongoose = require('mongoose');
   const ExamSubmission = require('./src/models/ExamSubmission');

   mongoose.connect(process.env.MONGODB_URI).then(async () => {
     const submission = await ExamSubmission.findById('SUBMISSION_ID_HERE');
     console.log(JSON.stringify(submission, null, 2));
     process.exit(0);
   });
   "
   ```

---

## Common Issues & Solutions

### Issue: "Submission not found"

**Cause:** User doesn't have an active submission  
**Solution:** Create submission first via `POST /exams/:examId/submissions`

### Issue: "Submission has already been finalized"

**Cause:** Trying to submit a submission that's already 'submitted' or 'graded'  
**Solution:** Create a new submission (new attempt)

### Issue: "Unauthorized"

**Cause:** JWT token missing or submission belongs to different user  
**Solution:** Check localStorage for ACCESS_TOKEN, verify user is logged in

### Issue: Network request to localhost:3000 instead of localhost:5001

**Cause:** Frontend is Server Component, can't access env variables  
**Solution:** Already fixed - pages are now Client Components

### Issue: Answers not saved

**Cause:** Auto-save failing silently  
**Solution:** Check `autoSaveAnswers()` logs, verify submission is 'in_progress'

---

## Expected Database State After Submission

### Before Submission

```javascript
// exam_submissions
{
  _id: "sub-123",
  examId: "exam-456",
  studentId: "user-789",
  status: "in_progress",
  totalScore: 0,
  submittedAt: null,
  durationSeconds: 0
}

// exam_answers (may have some auto-saved)
[
  {
    submissionId: "sub-123",
    questionId: "q-1",
    selectedOptions: ["B"],
    score: null,
    feedback: null,
    isAutoGraded: false
  }
]
```

### After Submission

```javascript
// exam_submissions
{
  _id: "sub-123",
  examId: "exam-456",
  studentId: "user-789",
  status: "graded", // or "submitted" if needs manual grading
  totalScore: 8.5,
  submittedAt: "2025-12-20T10:30:00.000Z",
  durationSeconds: 1800
}

// exam_answers
[
  {
    submissionId: "sub-123",
    questionId: "q-1",
    selectedOptions: ["B"],
    score: 0,
    maxScore: 1,
    feedback: "Incorrect. Correct answer is D.",
    isAutoGraded: true
  },
  {
    submissionId: "sub-123",
    questionId: "q-2",
    selectedOptions: { "statement1": true, "statement2": false },
    score: 1.5,
    maxScore: 2,
    feedback: "Partially correct. 3/4 options correct.",
    isAutoGraded: true
  }
]
```

---

## Next Steps After Verification

1. **If Submission Works:**

   - Remove excessive logging from production
   - Add error tracking (Sentry, etc.)
   - Add submission analytics
   - Implement retry logic for failed submissions

2. **If Database Not Updating:**

   - Check MongoDB connection in backend logs
   - Verify ExamSubmissionRepository.update() implementation
   - Check for database permission issues
   - Verify schema matches model definitions

3. **Performance Optimization:**
   - Add database indexes for faster queries
   - Implement caching for exam questions
   - Batch update answers in single transaction
   - Add rate limiting for submit endpoint

---

## How to Run Tests

1. **Start Backend:**

   ```powershell
   cd C:\LEARNING\GoPass\backend
   npm run dev
   ```

2. **Start Frontend:**

   ```powershell
   cd C:\LEARNING\GoPass\frontend
   npm run dev
   ```

3. **Open Browser:**

   - Navigate to http://localhost:3000
   - Login as test user
   - Go to exam page
   - Take and submit exam

4. **Monitor Logs:**

   - **Frontend:** Browser DevTools Console (F12)
   - **Backend:** Terminal running backend
   - **Database:** MongoDB Compass or Studio 3T

5. **Verify Results:**
   - Check success dialog appears
   - Check database shows updated submission
   - Check exam answers are graded
   - Check total score is calculated correctly

---

**Summary:**  
The submission flow is fully implemented with comprehensive logging. You can now test by:

1. Taking an exam
2. Submitting it
3. Checking console logs (frontend & backend)
4. Verifying database changes in MongoDB

All logs are now in place to track the entire flow from button click to database update.
