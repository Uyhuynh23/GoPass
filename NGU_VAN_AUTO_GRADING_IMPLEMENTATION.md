# Ngữ Văn Auto-Grading Implementation Summary

## Overview

Implemented automatic grading system for Ngữ Văn (Vietnamese Literature) essay questions using VnSmartBot AI. The system automatically grades essay submissions when students submit their exams.

## Architecture

### Flow Diagram

```
Student submits exam (Ngữ Văn)
    ↓
SubmissionService.submitExam()
    ↓
Check if subject === "Ngữ Văn"
    ↓
Trigger GradingService.autoGradeNguVan() (async)
    ↓
For each essay answer:
    - Build prompt with explanation + answerText
    - Call VnSmartBot API
    - Parse JSON response
    - Validate score (0, 0.25, 0.5, 0.75, 1)
    - Update ExamAnswer (score, feedback, isAutoGraded)
    ↓
Update ExamSubmission (totalScore, status)
```

## Implementation Details

### 1. Backend Components

#### GradingService.js

**Location**: `backend/src/services/GradingService.js`

**New Methods**:

- `autoGradeNguVan(submissionId)` - Main orchestration method

  - Validates submission is "Ngữ Văn" subject
  - Filters answers that have text and aren't already graded
  - Prepares payload for each question
  - Calls SmartBot API
  - Updates database with scores and feedback
  - Returns grading summary

- `_callSmartBotGrading(payload)` - SmartBot API integration

  - Builds grading prompt
  - Sends to VnSmartBot provider
  - Handles SSE response format
  - Extracts JSON from markdown code blocks
  - Validates response structure

- `_buildGradingPrompt(payload)` - Prompt generator
  - Creates structured prompt per specification
  - Includes explanation and student answer for each item
  - Defines grading criteria
  - Specifies output format (strict JSON)

#### GradingController.js

**Location**: `backend/src/controllers/GradingController.js`

**New Endpoint**:

```javascript
async autoGradeNguVan(req, res) {
  // POST /api/grading/submissions/:submissionId/auto-grade-ngu-van
  // Can be called manually by teachers to re-grade
}
```

#### Routing

**Location**: `backend/src/routes/grading.routes.js`

**New Route**:

```javascript
router.post(
  "/submissions/:submissionId/auto-grade-ngu-van",
  GradingController.autoGradeNguVan
);
```

#### SubmissionService.js

**Location**: `backend/src/services/SubmissionService.js`

**Integration Point**: Added in `submitExam()` method

```javascript
// After submission is finalized
const exam = await ExamRepository.findById(submission.examId);
if (exam && exam.subject === "Ngữ Văn") {
  // Run async without blocking response
  setImmediate(async () => {
    await GradingService.autoGradeNguVan(submissionId);
  });
}
```

### 2. Grading Criteria

The AI evaluates essays based on:

1. **Ưu điểm** (Strengths) - What the student did well
2. **Nhược điểm** (Weaknesses) - Areas that need improvement
3. **Thiếu sót** (Missing elements) - Important points not addressed
4. **Ngữ pháp** (Grammar) - Language usage issues
5. **Lời khuyên** (Advice) - Suggestions for improvement

### 3. Score Validation

**Allowed Scores**: 0, 0.25, 0.5, 0.75, 1

**Rounding Logic**:

```javascript
const roundedScore = Math.round(score * 4) / 4; // Round to nearest 0.25
const finalScore = Math.min(roundedScore, maxScore); // Cap at maxScore
```

### 4. SmartBot Integration

**API Endpoint**: `https://assistant-stream.vnpt.vn/v1/conversation`

**Request Format**:

```json
{
  "text": "Full grading prompt with all questions",
  "bot_id": "your-bot-id"
}
```

**Response Format**:

- SSE stream with `data:` prefix
- Contains `card_data.text` with AI response
- May include markdown code blocks with JSON

**JSON Extraction**:

1. Try extracting from markdown: ` ```json...``` `
2. Fallback: Find first `{` to last `}`
3. Cleanup: Remove stray markdown markers

### 5. Database Updates

**ExamAnswer Updates**:

- `score` - Calculated score (0-1 scale)
- `feedback` - Detailed AI feedback
- `isAutoGraded` - Set to `true`
- `gradedAt` - Timestamp

**ExamSubmission Updates**:

- `totalScore` - Sum of all question scores
- `status` - Set to "graded" if all questions graded
- `gradedAt` - Timestamp

## Testing

### Manual Testing Endpoint

```bash
POST /api/grading/submissions/:submissionId/auto-grade-ngu-van
Authorization: Bearer <teacher-token>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "success": true,
    "gradedCount": 3,
    "totalScore": 2.5,
    "results": [
      {
        "examAnswerId": "...",
        "score": 0.75,
        "feedback": "..."
      }
    ]
  }
}
```

### Automatic Trigger

- Submit any Ngữ Văn exam through normal submission flow
- Auto-grading runs in background
- Check console logs for grading progress
- Check database for updated scores

## Error Handling

**Graceful Degradation**:

- Auto-grading failures don't block submission
- Errors logged to console
- Submissions remain in "submitted" status (pending manual grading)
- Teachers can manually re-trigger grading via endpoint

**Common Issues**:

1. **SmartBot API errors** - Logged, submission remains gradable manually
2. **JSON parsing errors** - Logged, submission remains gradable manually
3. **Invalid scores** - Validation ensures scores in allowed range
4. **Database errors** - Transactional updates, rollback on failure

## Configuration

**Required Environment Variables**:

- SmartBot credentials configured in `VnSmartBotProvider.js`
- Bot ID for grading tasks

**Subject Detection**:

- Exam must have `subject: "Ngữ Văn"` field
- Case-sensitive match

## Future Enhancements

1. **Retry Logic** - Automatic retry on transient failures
2. **Batch Grading** - Grade multiple submissions in parallel
3. **Confidence Scores** - Track AI confidence levels
4. **Audit Trail** - Store all AI responses for review
5. **Manual Override** - Allow teachers to adjust AI scores
6. **Fine-tuning** - Adjust prompts based on feedback
7. **Multi-language Support** - Extend to other subjects

## Files Modified

1. `backend/src/services/GradingService.js` - +300 lines (grading logic)
2. `backend/src/controllers/GradingController.js` - +15 lines (endpoint)
3. `backend/src/routes/grading.routes.js` - +1 line (route)
4. `backend/src/services/SubmissionService.js` - +25 lines (integration)

## Notes

- Auto-grading runs asynchronously to not block submission response
- Only grades essay questions with `answerText`
- Respects existing manual grades (doesn't overwrite)
- Uses same scoring scale as manual grading (0-1 with 0.25 increments)
- Feedback is stored in Vietnamese for student readability
