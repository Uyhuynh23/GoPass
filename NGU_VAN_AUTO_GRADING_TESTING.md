# Testing Guide: Ngữ Văn Auto-Grading

## Prerequisites

1. Backend server running on port 5001
2. VnSmartBot API credentials configured
3. MongoDB connection active
4. At least one Ngữ Văn exam in database

## Test Scenario 1: Automatic Grading on Submission

### Setup

1. Create a Ngữ Văn exam with essay questions
2. Ensure questions have `explanation` field populated (reference answer)
3. Assign exam to a class

### Steps

1. **Login as student**

   ```bash
   POST /api/auth/login
   {
     "email": "student@test.com",
     "password": "password"
   }
   ```

2. **Start exam**

   ```bash
   POST /api/submissions/start/:assignmentId
   Authorization: Bearer <student-token>
   ```

3. **Save answers**

   ```bash
   POST /api/submissions/:submissionId/answers
   {
     "questionId": "...",
     "answerText": "Bài văn của học sinh về chủ đề..."
   }
   ```

4. **Submit exam**
   ```bash
   POST /api/submissions/:submissionId/submit
   Authorization: Bearer <student-token>
   {
     "answers": [...],
     "timeSpentSeconds": 1800
   }
   ```

### Expected Behavior

- Submission returns immediately with status 200
- Console logs show:
  ```
  ✅ Submission successful
  📝 Triggering auto-grading for Ngữ Văn exam...
  ```
- Within 5-10 seconds, see:
  ```
  ✅ Auto-grading completed: { gradedCount: X, totalScore: Y }
  ```

### Verification

1. **Check ExamAnswer collection**:

   ```javascript
   db.examanswers.find({ submissionId: ObjectId("...") });
   ```

   - `score` field populated (0, 0.25, 0.5, 0.75, or 1)
   - `feedback` field contains Vietnamese feedback
   - `isAutoGraded` is `true`
   - `gradedAt` has timestamp

2. **Check ExamSubmission collection**:
   ```javascript
   db.examsubmissions.find({ _id: ObjectId("...") });
   ```
   - `totalScore` updated with sum of all scores
   - `status` is "graded" (if all questions auto-graded)
   - `gradedAt` has timestamp

## Test Scenario 2: Manual Re-Grading (Teacher)

### Steps

1. **Login as teacher**

   ```bash
   POST /api/auth/login
   {
     "email": "teacher@test.com",
     "password": "password"
   }
   ```

2. **Trigger auto-grading**
   ```bash
   POST /api/grading/submissions/:submissionId/auto-grade-ngu-van
   Authorization: Bearer <teacher-token>
   ```

### Expected Response

```json
{
  "success": true,
  "data": {
    "success": true,
    "gradedCount": 3,
    "totalScore": 2.5,
    "results": [
      {
        "examAnswerId": "65f...",
        "questionId": "65f...",
        "score": 0.75,
        "feedback": "Ưu điểm: ...\nNhược điểm: ...\nThiếu sót: ...",
        "isAutoGraded": true
      }
    ]
  }
}
```

## Test Scenario 3: Non-Ngữ Văn Exam

### Steps

1. Submit exam for different subject (e.g., "Toán học")
2. Verify auto-grading does NOT trigger
3. Console should NOT show "Triggering auto-grading"

### Expected Behavior

- Normal grading flow continues
- No SmartBot API calls made
- Essay questions remain "Pending manual grading"

## Test Scenario 4: Error Handling

### Test Case 4.1: SmartBot API Failure

1. Temporarily disable SmartBot API or use invalid credentials
2. Submit Ngữ Văn exam
3. Expected: Error logged but submission completes successfully
   ```
   ❌ Auto-grading failed: [error message]
   ```
4. Answers remain ungradable, status "submitted"

### Test Case 4.2: Invalid JSON Response

1. Mock SmartBot to return malformed JSON
2. Expected: Error logged, graceful fallback
   ```
   ❌ Failed to parse SmartBot response
   ```

### Test Case 4.3: Missing Explanation

1. Create question without `explanation` field
2. Expected: Question skipped, others graded normally
   ```
   ⚠️ Skipping question without explanation
   ```

## Monitoring & Debugging

### Console Logs to Watch

```
📝 Triggering auto-grading for Ngữ Văn exam...
📋 Auto-grading submission: <submissionId>
📋 Preparing grading items...
🤖 Calling SmartBot for grading...
✅ Grading response received, length: X
📊 Extracted JSON response
💾 Updating answer score: <examAnswerId> = <score>
💾 Updating submission total score: <totalScore>
✅ Auto-grading completed
```

### Error Logs to Debug

```
❌ Auto-grading failed: [error message]
❌ Failed to parse SmartBot response
❌ Invalid response structure from SmartBot
⚠️ Skipping question without explanation
```

### Database Queries for Verification

**Check grading status**:

```javascript
db.examsubmissions.aggregate([
  { $match: { _id: ObjectId("...") } },
  {
    $lookup: {
      from: "examanswers",
      localField: "_id",
      foreignField: "submissionId",
      as: "answers",
    },
  },
  {
    $project: {
      totalScore: 1,
      status: 1,
      "answers.score": 1,
      "answers.isAutoGraded": 1,
      "answers.feedback": 1,
    },
  },
]);
```

**Find all auto-graded submissions**:

```javascript
db.examanswers
  .find({
    isAutoGraded: true,
    gradedAt: { $exists: true },
  })
  .count();
```

**Check SmartBot feedback**:

```javascript
db.examanswers
  .find({
    isAutoGraded: true,
  })
  .forEach((a) => {
    print(`Score: ${a.score}`);
    print(`Feedback: ${a.feedback.substring(0, 100)}...`);
    print("---");
  });
```

## Performance Testing

### Load Test

1. Submit 10 Ngữ Văn exams simultaneously
2. Monitor:
   - Response time for submission endpoint
   - SmartBot API rate limits
   - Database connection pool
   - Memory usage

### Expected Metrics

- Submission response: < 500ms
- Auto-grading completion: 5-15 seconds per submission
- Success rate: > 95%

## Troubleshooting

### Issue: Auto-grading not triggering

**Check**:

1. Exam subject is exactly "Ngữ Văn" (case-sensitive)
2. Questions have `answerText` populated
3. GradingService import in SubmissionService.js
4. Console logs show "Triggering auto-grading..."

### Issue: Scores not updating

**Check**:

1. SmartBot response contains valid JSON
2. Scores are in allowed range [0, 0.25, 0.5, 0.75, 1]
3. examAnswerId matches database records
4. Database write permissions

### Issue: Feedback in wrong language

**Check**:

1. Grading prompt specifies Vietnamese output
2. SmartBot bot_id configured for Vietnamese

## Success Criteria

✅ All essay questions in Ngữ Văn exams are auto-graded
✅ Scores are valid (0, 0.25, 0.5, 0.75, 1)
✅ Feedback is detailed and in Vietnamese
✅ Submission response time not affected
✅ Manual grading still available for teachers
✅ Error handling prevents submission failures
✅ Database consistently updated
