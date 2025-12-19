# Frontend Migration Guide - Exam Taking API

**Date:** December 19, 2025  
**Purpose:** Guide for updating frontend services to use the new backend API

---

## Overview

The backend has been re-implemented to match the API specification. This guide shows how to update the frontend services.

---

## Changes Required

### 1. Update `src/services/exam/exam.service.ts`

**Update `getExamById` method:**

```typescript
async getExamById(id: string, assignmentId?: string, contestId?: string): Promise<ExamWithDetails | null> {
  try {
    const params = new URLSearchParams();
    if (assignmentId) params.append('assignmentId', assignmentId);
    if (contestId) params.append('contestId', contestId);

    const queryString = params.toString();
    const url = `/exams/${id}${queryString ? `?${queryString}` : ''}`;

    const response = await httpClient.get<{ success: boolean; data: any }>(
      url,
      { requiresAuth: true }
    );

    if (!response.success || !response.data) {
      console.error("Failed to fetch exam data");
      return null;
    }

    return response.data; // Backend now returns in correct format
  } catch (error) {
    console.error("Error fetching exam:", error);
    return null;
  }
}
```

**Add new method `createSubmission`:**

```typescript
async createSubmission(examId: string, assignmentId?: string, contestId?: string): Promise<any> {
  return httpClient.post(
    `/exams/${examId}/submissions`,
    { assignmentId, contestId },
    { requiresAuth: true }
  );
}
```

**Add new method `getMySubmissions`:**

```typescript
async getMySubmissions(examId: string, assignmentId?: string): Promise<any> {
  const params = new URLSearchParams();
  if (assignmentId) params.append('assignmentId', assignmentId);

  const queryString = params.toString();
  const url = `/exams/${examId}/my-submissions${queryString ? `?${queryString}` : ''}`;

  return httpClient.get(url, { requiresAuth: true });
}
```

---

### 2. Update `src/services/exam/submission.service.ts`

**Replace the mock implementation with real API calls:**

```typescript
import { httpClient } from "@/lib/http";
import { AnswerData, ExamSubmission } from "@/features/exam/types";

export const submissionService = {
  /**
   * Auto-save answers during exam
   * API: PATCH /api/submissions/:submissionId/answers
   */
  autoSaveAnswers: async (submissionId: string, answers: AnswerData[]) => {
    try {
      const response = await httpClient.patch(
        `/submissions/${submissionId}/answers`,
        { answers },
        { requiresAuth: true }
      );
      return response;
    } catch (error) {
      console.error("Error auto-saving answers:", error);
      throw error;
    }
  },

  /**
   * Submit exam (finalize)
   * API: POST /api/submissions/:submissionId/submit
   */
  submitExam: async (
    submissionId: string,
    answers: AnswerData[],
    timeSpentSeconds: number = 0
  ) => {
    try {
      const response = await httpClient.post(
        `/submissions/${submissionId}/submit`,
        { answers, timeSpentSeconds },
        { requiresAuth: true }
      );
      return response;
    } catch (error) {
      console.error("Error submitting exam:", error);
      throw error;
    }
  },

  /**
   * Get submission details for review
   * API: GET /api/submissions/:submissionId
   */
  getSubmissionDetails: async (submissionId: string) => {
    try {
      const response = await httpClient.get(`/submissions/${submissionId}`, {
        requiresAuth: true,
      });

      if (!response.success) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching submission details:", error);
      return null;
    }
  },

  /**
   * Get submission answers (for resume functionality)
   * API: GET /api/submissions/:submissionId/answers
   */
  getSubmissionAnswers: async (submissionId: string) => {
    try {
      const response = await httpClient.get(
        `/submissions/${submissionId}/answers`,
        { requiresAuth: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching submission answers:", error);
      throw error;
    }
  },

  /**
   * Get active in-progress submissions
   * API: GET /api/submissions/my-active
   */
  getMyActiveSubmissions: async () => {
    try {
      const response = await httpClient.get("/submissions/my-active", {
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching active submissions:", error);
      return [];
    }
  },
};
```

---

### 3. Update `src/features/exam/context/ExamContext.tsx`

**Update initialization logic:**

Remove mock data fetching and use real API:

```typescript
useEffect(() => {
  // If review mode, don't initialize
  if (isReviewMode) return;

  const initializeExam = async () => {
    // Check if user has existing in-progress submission
    if (initialExam.userSubmission?.status === "in_progress") {
      // Resume existing submission
      setSubmission(initialExam.userSubmission);

      // Load saved answers from backend (optional - can still use localStorage)
      try {
        const savedAnswers = await submissionService.getSubmissionAnswers(
          initialExam.userSubmission._id
        );
        if (savedAnswers?.answers) {
          const answersMap = new Map<string, AnswerData>();
          savedAnswers.answers.forEach((ans: any) => {
            answersMap.set(ans.questionId, {
              questionId: ans.questionId,
              answer: ans.answerText || ans.selectedOptions || "",
              isAnswered: true,
              lastModified: new Date(ans.updatedAt || Date.now()),
            });
          });
          setExamState({ answers: answersMap });
        }
      } catch (error) {
        console.error("Error loading saved answers:", error);
      }
    } else {
      // Start new submission
      try {
        const newSubmission = await examService.createSubmission(
          initialExam._id,
          assignmentId,
          contestId
        );
        setSubmission(newSubmission.data);
      } catch (error) {
        console.error("Error creating submission:", error);
        alert("Failed to start exam. Please try again.");
      }
    }
  };

  initializeExam();
}, [initialExam._id, initialExam.userSubmission, isReviewMode]);
```

**Update auto-save logic:**

```typescript
const autoSaveToApi = async () => {
  if (examState.answers.size === 0 || isReviewMode || !submission) return;

  setExamState({ autoSaveStatus: "saving" });

  try {
    await submissionService.autoSaveAnswers(
      submission._id,
      Array.from(examState.answers.values())
    );
    setExamState({ autoSaveStatus: "saved" });
    setTimeout(() => setExamState({ autoSaveStatus: "idle" }), 2000);
  } catch (error) {
    console.error("Auto-save error:", error);
    setExamState({ autoSaveStatus: "error" });
  }
};
```

**Update submit logic:**

```typescript
const submitExam = async () => {
  if (examState.isSubmitting || isReviewMode || !submission) return;

  setExamState({ isSubmitting: true });

  try {
    const answersArray = Array.from(examState.answers.values());
    const timeSpent =
      initialExam.durationMinutes * 60 - examState.timeRemaining;

    await submissionService.submitExam(submission._id, answersArray, timeSpent);

    // Clear local storage
    examStorage.clear(initialExam._id);
    console.log("✅ Exam submitted and storage cleared");
  } catch (error) {
    console.error("Submit failed:", error);
    alert("Failed to submit exam. Please try again.");
    setExamState({ isSubmitting: false });
  }
};
```

---

### 4. Update `src/app/(protected)/exam/[examId]/page.tsx`

**Use real API to fetch exam:**

```typescript
export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;

  // Get assignmentId and contestId from searchParams if needed
  // const searchParams = await useSearchParams(); // If needed

  const exam = await examService.getExamById(examId);

  if (!exam) {
    notFound();
  }

  return <ExamDetailClient exam={exam} />;
}
```

---

### 5. Update `src/app/(protected)/exam/submission/[submissionId]/page.tsx`

**Use real API:**

```typescript
export default async function ReviewSubmissionPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;

  const data = await submissionService.getSubmissionDetails(submissionId);

  if (!data) return notFound();

  return <ReviewExamClient data={data} />;
}
```

---

## Testing Steps

### Step 1: Test Exam Loading

1. Navigate to `/exam/[examId]`
2. Verify exam details load correctly
3. Check that correct answers are NOT visible
4. Verify reading passages load

### Step 2: Test Starting Exam

1. Click "Start Exam"
2. Verify submission is created in backend
3. Check that timer starts correctly
4. Verify questions are displayed

### Step 3: Test Auto-Save

1. Answer some questions
2. Wait 30-60 seconds
3. Check network tab for PATCH request to `/submissions/:id/answers`
4. Verify "Saved" indicator appears

### Step 4: Test Submission

1. Click "Submit Exam"
2. Verify POST request to `/submissions/:id/submit`
3. Check response contains:
   - `totalScore`
   - `gradedAnswers`
   - `pendingManualGrading`
4. Verify redirect to review page

### Step 5: Test Review

1. Navigate to `/exam/submission/[submissionId]`
2. Verify user's answers are displayed
3. Verify correct answers are NOW visible
4. Verify explanations are shown
5. Verify score breakdown is correct

### Step 6: Test Multi-Attempt

1. Complete exam once
2. Return to exam detail page
3. Click "Start New Attempt"
4. Verify new submission is created
5. Check that previous answers are NOT loaded

---

## Common Issues & Solutions

### Issue 1: 401 Unauthorized

**Solution:** Make sure JWT token is being sent in Authorization header

```typescript
// In httpClient config
headers: {
  'Authorization': `Bearer ${getToken()}`,
}
```

### Issue 2: Exam data format mismatch

**Solution:** Backend now returns data in correct format, no transformation needed

### Issue 3: Auto-save not working

**Solution:** Check that submission.\_id exists and status is 'in_progress'

### Issue 4: Scores not showing in review

**Solution:** Make sure submission status is 'graded' or 'submitted'

---

## Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## API Error Codes Reference

| Code | Meaning      | Solution                             |
| ---- | ------------ | ------------------------------------ |
| 400  | Bad Request  | Check request body format            |
| 401  | Unauthorized | User not logged in                   |
| 403  | Forbidden    | Permission denied (e.g., exam ended) |
| 404  | Not Found    | Exam or submission doesn't exist     |
| 500  | Server Error | Backend issue, check logs            |

---

## Migration Checklist

- [ ] Update `examService.ts` with new methods
- [ ] Replace mock implementation in `submissionService.ts`
- [ ] Update `ExamContext.tsx` initialization
- [ ] Update auto-save logic to use API
- [ ] Update submit logic to use API
- [ ] Update exam detail page to use real API
- [ ] Update review page to use real API
- [ ] Remove all mock data imports
- [ ] Test complete exam-taking flow
- [ ] Test review functionality
- [ ] Test error scenarios
- [ ] Update TypeScript types if needed

---

**Migration Complete!** 🎉

Your frontend should now be fully integrated with the real backend API.
