# Quick Reference: Frontend-Backend Integration

## API Endpoints Used

### Exam Endpoints

```typescript
// Get exam with user's submission
GET /api/exams/:examId?assignmentId=xxx&contestId=xxx
Response: ExamWithDetails & { userSubmission?: ExamSubmission }

// Create new submission
POST /api/exams/:examId/submissions
Body: { assignmentId?: string, contestId?: string }
Response: ExamSubmission

// Get user's submissions for exam
GET /api/exams/:examId/my-submissions
Response: ExamSubmission[]
```

### Submission Endpoints

```typescript
// Auto-save answers
PATCH /api/submissions/:submissionId/answers
Body: { answers: ExamAnswer[] }
Response: { success: true, message: string }

// Submit exam for grading
POST /api/submissions/:submissionId/submit
Body: { answers: ExamAnswer[], timeSpent: number }
Response: { success: true, data: ExamSubmission }

// Get submission details (for review)
GET /api/submissions/:submissionId
Response: { submission: ExamSubmission, exam: Exam, questions: Question[] }

// Get submission answers
GET /api/submissions/:submissionId/answers
Response: ExamAnswer[]

// Get active submissions
GET /api/submissions/my-active
Response: ExamSubmission[]
```

## Service Methods

### exam.service.ts

```typescript
// Get exam by ID with context
examService.getExamById(
  examId: string,
  assignmentId?: string,
  contestId?: string
): Promise<ExamWithDetails>

// Create submission
examService.createSubmission(
  examId: string,
  assignmentId?: string,
  contestId?: string
): Promise<ExamSubmission>

// Get user submissions
examService.getMySubmissions(
  examId: string
): Promise<ExamSubmission[]>
```

### submission.service.ts

```typescript
// Auto-save answers
submissionService.autoSaveAnswers(
  submissionId: string,
  answers: ExamAnswer[]
): Promise<void>

// Submit exam
submissionService.submitExam(
  submissionId: string,
  answers: ExamAnswer[],
  timeSpent: number
): Promise<ExamSubmission>

// Get submission details
submissionService.getSubmissionDetails(
  submissionId: string
): Promise<{ submission: ExamSubmission, exam: Exam, questions: Question[] }>

// Get submission answers
submissionService.getSubmissionAnswers(
  submissionId: string
): Promise<ExamAnswer[]>

// Get active submissions
submissionService.getMyActiveSubmissions(): Promise<ExamSubmission[]>
```

## Type Definitions

### ExamWithDetails

```typescript
interface ExamWithDetails {
  _id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  totalQuestions: number;
  totalPoints: number;
  questions: ExamQuestionPopulated[];
  userSubmission?: ExamSubmission; // Added by backend
}
```

### ExamSubmission

```typescript
interface ExamSubmission {
  _id: string;
  examId: string;
  studentId: string;
  assignmentId?: string;
  contestId?: string;
  status: "ongoing" | "submitted";
  answers: ExamAnswer[];
  totalScore: number;
  maxScore: number;
  timeSpent: number;
  startedAt: Date;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### ExamAnswer

```typescript
interface ExamAnswer {
  questionId: string;
  answerText?: string;
  selectedOptions?: string[];
  score: number;
  maxScore: number;
  isCorrect: boolean;
  feedback?: string;
  gradedBy: "auto" | "manual";
  createdAt: Date;
  updatedAt: Date;
}
```

## URL Patterns

### Direct Exam Access

```
/exam/[examId]                    // View exam details
/exam/[examId]/take               // Take exam
```

### Assignment-Based Access

```
/exam/[examId]?assignmentId=xxx               // View exam (assignment context)
/exam/[examId]/take?assignmentId=xxx          // Take exam (assignment context)
```

### Contest-Based Access

```
/exam/[examId]?contestId=xxx&returnUrl=/contest/[contestId]/hub    // View exam
/exam/[examId]/take?contestId=xxx&returnUrl=/contest/[contestId]/hub  // Take exam
```

### Review Submission

```
/exam/submission/[submissionId]   // Review submitted exam
```

## Common Code Patterns

### Server Component - Fetch Exam

```typescript
// app/(protected)/exam/[examId]/page.tsx
export default async function ExamDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ examId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { examId } = await params;
  const search = await searchParams;

  const assignmentId =
    typeof search.assignmentId === "string" ? search.assignmentId : undefined;
  const contestId =
    typeof search.contestId === "string" ? search.contestId : undefined;

  const exam = await examService.getExamById(examId, assignmentId, contestId);

  if (!exam) return notFound();

  return <ExamDetailClient exam={exam} />;
}
```

### Client Component - Use Exam Context

```typescript
// TakeExamClient.tsx
export default function TakeExamClient({ exam }: { exam: ExamWithDetails }) {
  return (
    <ExamProvider initialExam={exam}>
      <ExamInterface />
    </ExamProvider>
  );
}

// Inside ExamInterface
const ExamInterface = () => {
  const { exam, submission, currentQuestion, examState } = useExam();

  // submission is available from exam.userSubmission
  // Use submission._id for API calls
};
```

### Auto-Save Implementation

```typescript
// ExamContext.tsx
const autoSaveToApi = useCallback(async () => {
  if (!submission?._id) return;

  const answersArray = Array.from(examState.answers.values());

  try {
    await submissionService.autoSaveAnswers(submission._id, answersArray);
    console.log("Auto-saved successfully");
  } catch (error) {
    console.error("Auto-save failed:", error);
  }
}, [submission, examState.answers]);
```

### Submit Exam

```typescript
// ExamContext.tsx
const submitExam = async () => {
  if (!submission?._id) return;

  const answersArray = Array.from(examState.answers.values());
  const timeSpent = examState.timeElapsed;

  try {
    const result = await submissionService.submitExam(
      submission._id,
      answersArray,
      timeSpent
    );

    // result contains graded submission
    return result;
  } catch (error) {
    console.error("Submit failed:", error);
    throw error;
  }
};
```

### Review Submission

```typescript
// app/(protected)/exam/submission/[submissionId]/page.tsx
"use client";

export default function ReviewSubmissionPage() {
  const params = useParams();
  const submissionId = params?.submissionId as string;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await submissionService.getSubmissionDetails(submissionId);
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [submissionId]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <NotFound />;

  return <ReviewExamClient data={data} />;
}
```

## Environment Setup

### Backend URL Configuration

```typescript
// src/lib/http-client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
```

### Required Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Debugging Tips

### Check Submission ID

```typescript
// In ExamContext
console.log("Submission ID:", submission?._id);
console.log("Exam ID:", exam._id);
```

### Check API Calls

```typescript
// In browser DevTools Network tab
// Look for:
// - PATCH /api/submissions/:id/answers (auto-save)
// - POST /api/submissions/:id/submit (submit)
// - GET /api/submissions/:id (review)
```

### Verify Data Structure

```typescript
// In component
console.log("Exam data:", exam);
console.log("Has submission?", !!exam.userSubmission);
console.log("Submission status:", exam.userSubmission?.status);
```

## Common Issues & Solutions

### Issue: Auto-save not working

**Solution**: Check that `submission._id` exists in ExamContext

### Issue: Submit returns 404

**Solution**: Ensure using `submission._id` not `exam._id`

### Issue: Review page shows no answers

**Solution**: Verify submission status is 'submitted'

### Issue: Assignment/Contest context not working

**Solution**: Check searchParams extraction in page.tsx

### Issue: User can submit multiple times

**Solution**: Backend prevents this, but check frontend disables submit button

## Testing Commands

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

### Test Flow

1. Navigate to `/exam/:examId`
2. Click "Start Exam"
3. Answer some questions
4. Wait 30s for auto-save
5. Submit exam
6. View results at `/exam/submission/:submissionId`
