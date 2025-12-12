# Question Creation System Documentation

## Overview

The Question Creation System allows teachers and administrators to create various types of questions for exams and assessments. It supports 4 question types with a user-friendly modal interface and auto-save functionality.

## Features

### Supported Question Types

1. **Multiple Choice** - Questions with 4 options (A, B, C, D)
2. **True/False** - Multiple true/false statements
3. **Short Answer** - Text, numeric, or pattern-based answers
4. **Long Answer** - Essay questions with rubric-based grading

### Key Features

- ✅ **2-Step Wizard**: Select question type → Fill question details
- ✅ **Auto-save**: Drafts saved every 10 seconds to localStorage
- ✅ **Draft Recovery**: Restore unsaved work on next visit
- ✅ **Passage Support**: Link questions to reading passages
- ✅ **Keyboard Shortcuts**: `Ctrl+N` to create new question, `Esc` to close
- ✅ **Validation**: Real-time form validation with error messages
- ✅ **Common Fields**: Title, tags, difficulty, points, time limit, language

## Usage

### Opening the Modal

#### From UI

Click the **"Thêm câu hỏi"** button in the Question Bank view.

#### Using Keyboard Shortcut

Press `Ctrl+N` anywhere in the Question Bank page.

### Creating a Question

#### Step 1: Select Question Type

Choose one of 4 question types:

- **Trắc nghiệm** (Multiple Choice)
- **Đúng/Sai** (True/False)
- **Câu trả lời ngắn** (Short Answer)
- **Tự luận** (Long Answer)

#### Step 2: Optional Passage

Select how to handle passages:

- **Không có đoạn văn** - Question stands alone
- **Chọn đoạn văn có sẵn** - Link to existing passage
- **Tạo đoạn văn mới** - Create new passage with the question

#### Step 3: Fill Question Details

Complete the form fields based on question type (see below).

#### Step 4: Save

- **Lưu câu hỏi** - Save and close modal
- **Lưu nháp** - Save as draft (auto-saved every 10s)
- **Quay lại** - Return to previous step
- **Esc** - Close modal (with confirmation if unsaved changes)

## Question Type Details

### 1. Multiple Choice

**Fields:**

- **Tiêu đề** (Title) - Optional identifier
- **Tags** - Comma-separated tags for organization
- **Độ khó** (Difficulty) - Easy, Medium, Hard
- **Điểm** (Points) - Point value for correct answer
- **Thời gian** (Time Limit) - Optional time limit in seconds
- **Ngôn ngữ** (Language) - Vietnamese, English
- **Câu hỏi** (Question) - The question stem **(required)**
- **Đáp án** (Options) - 4 options (A, B, C, D) **(required)**
- **Cho phép nhiều đáp án đúng** - Toggle for multiple correct answers
- **Giải thích** (Explanation) - Optional explanation for correct answer

**Validation:**

- Question stem cannot be empty
- All 4 options must be filled
- At least one correct answer must be selected

**Example:**

```
Question: What is the capital of Vietnam?
A. Hanoi ✓
B. Ho Chi Minh City
C. Da Nang
D. Hue
```

### 2. True/False

**Fields:**

- **Common Fields** (Title, Tags, Difficulty, Points, Time Limit, Language)
- **Câu phát biểu** (Statements) - List of true/false statements **(required)**
- **Nhập nhanh** - Bulk paste mode (one statement per line)

**Validation:**

- At least one statement required
- Each statement must have text
- Each statement must be marked as true or false

**Example:**

```
1. Vietnam is in Southeast Asia. [TRUE]
2. The capital of Vietnam is Ho Chi Minh City. [FALSE]
3. Vietnamese uses Latin alphabet. [TRUE]
```

**Bulk Paste Format:**

```
Vietnam is in Southeast Asia
The capital of Vietnam is Ho Chi Minh City
Vietnamese uses Latin alphabet
```

### 3. Short Answer

**Fields:**

- **Common Fields**
- **Câu hỏi** (Question) - The question text **(required)**
- **Loại đáp án** (Answer Type) **(required)**:
  - **Văn bản (Text)**: Free text with multiple accepted answers
  - **Số (Numeric)**: Numeric range with tolerance
  - **Pattern (Regex)**: Regular expression pattern
- **Tự động chấm điểm** - Toggle for auto-grading

**Text Mode:**

- **Đáp án được chấp nhận** - List of accepted text answers
- **Phân biệt chữ hoa/thường** - Case sensitive toggle

**Numeric Mode:**

- **Giá trị nhỏ nhất** (Min value)
- **Giá trị lớn nhất** (Max value)
- **Sai số cho phép** (Tolerance)

**Regex Mode:**

- **Regular Expression Pattern** - Regex pattern for validation

**Example (Text):**

```
Question: What is the largest ocean?
Accepted Answers:
- Pacific Ocean
- Pacific
- The Pacific
```

**Example (Numeric):**

```
Question: What is the value of π (pi) rounded to 2 decimals?
Min: 3.14
Max: 3.14
Tolerance: 0.01
```

**Example (Regex):**

```
Question: Enter a valid email address
Pattern: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

### 4. Long Answer

**Fields:**

- **Common Fields**
- **Yêu cầu bài viết** (Prompt) - Essay prompt **(required)**
- **Giới hạn từ** (Word Limit) - Optional maximum word count
- **Loại chấm điểm** (Grading Type):
  - **Chấm thủ công** (Manual) - Teacher grades manually
  - **AI hỗ trợ** (AI-assisted) - AI suggests score
- **Tiêu chí chấm điểm** (Rubric) - Grading criteria **(required)**

**Rubric Fields:**

- **Tên tiêu chí** (Criterion Name) - e.g., "Content", "Grammar"
- **Mô tả** (Description) - Detailed criteria description
- **Điểm** (Points) - Points for this criterion

**Validation:**

- Prompt cannot be empty
- At least one rubric criterion required
- Each criterion must have name and points > 0
- Sum of rubric points must equal question points

**Example:**

```
Prompt: Write an essay about climate change (500 words)
Word Limit: 500

Rubric:
1. Content (5 points)
   - Clear thesis statement
   - Supporting evidence
   - Logical flow

2. Grammar (3 points)
   - Proper sentence structure
   - Correct punctuation
   - No spelling errors

3. Creativity (2 points)
   - Original ideas
   - Engaging writing style

Total: 10 points
```

## Component Architecture

### File Structure

```
frontend/src/features/dashboard/
├── components/
│   └── questionbank/
│       ├── CreateQuestionModal.tsx        # Main modal orchestrator
│       ├── QuestionTypeSelector.tsx       # Step 1: Select type
│       ├── PassageSelector.tsx            # Step 1: Select passage
│       ├── QuestionFormContainer.tsx      # Form router
│       ├── CommonFields.tsx               # Shared form fields
│       └── forms/
│           ├── MultipleChoiceForm.tsx
│           ├── TrueFalseForm.tsx
│           ├── ShortAnswerForm.tsx
│           └── LongAnswerForm.tsx
└── types/
    └── question.ts                        # TypeScript interfaces
```

### Component Hierarchy

```
CreateQuestionModal
├── QuestionTypeSelector (step 1)
├── PassageSelector (step 1)
└── QuestionFormContainer (step 2)
    ├── CommonFields
    └── [One of 4 form components]
        ├── MultipleChoiceForm
        ├── TrueFalseForm
        ├── ShortAnswerForm
        └── LongAnswerForm
```

### Data Flow

1. **Modal Opens** → Check localStorage for draft → Prompt user to restore
2. **Step 1** → User selects question type and passage option
3. **Step 2** → QuestionFormContainer renders appropriate form
4. **Form Fill** → Auto-save to localStorage every 10s
5. **Save** → Call parent's `onSave(questionData)` → Close modal

### State Management

**CreateQuestionModal State:**

```typescript
{
  step: 1 | 2,
  selectedType: QuestionType | null,
  passageOption: 'none' | 'existing' | 'new',
  selectedPassageId?: string,
  newPassage?: Partial<Passage>,
  formData: any,
  hasUnsavedChanges: boolean
}
```

**Draft Structure (localStorage):**

```typescript
interface QuestionDraft {
  step: 1 | 2;
  type?: QuestionType;
  passage?: "none" | "existing" | "new";
  passageId?: string;
  newPassage?: Partial<Passage>;
  formData?: any;
  timestamp: number;
}
```

## TypeScript Interfaces

### Base Question

```typescript
interface QuestionBase {
  id?: string;
  type: QuestionType;
  title: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  points: number;
  timeLimit?: number;
  language: "vi" | "en";
  passageId?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### Multiple Choice

```typescript
interface MultipleChoiceQuestion extends QuestionBase {
  type: "multiple_choice";
  stem: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  allowMultipleCorrect: boolean;
  explanation?: string;
  attachments?: string[];
}
```

### True/False

```typescript
interface TrueFalseQuestion extends QuestionBase {
  type: "true_false";
  statements: Array<{
    id: string;
    text: string;
    isTrue: boolean;
  }>;
}
```

### Short Answer

```typescript
interface ShortAnswerQuestion extends QuestionBase {
  type: "short_answer";
  stem: string;
  answerType: "text" | "numeric" | "regex";
  acceptedAnswers?: string[];
  caseSensitive?: boolean;
  numericConfig?: {
    min: number;
    max: number;
    tolerance: number;
  };
  regexPattern?: string;
  autoGrading: boolean;
}
```

### Long Answer

```typescript
interface LongAnswerQuestion extends QuestionBase {
  type: "long_answer";
  prompt: string;
  wordLimit?: number;
  gradingType: "manual" | "ai_assisted";
  rubric: Array<{
    id: string;
    criterion: string;
    description: string;
    points: number;
  }>;
}
```

## Keyboard Shortcuts

| Shortcut | Action                                     |
| -------- | ------------------------------------------ |
| `Ctrl+N` | Open question creation modal               |
| `Esc`    | Close modal (with confirmation if unsaved) |
| `Enter`  | Add tag in tag input field                 |

## Auto-Save Behavior

### Save Frequency

- Every **10 seconds** while modal is open
- On **component unmount** if there are unsaved changes

### What is Saved

- Current step (1 or 2)
- Selected question type
- Passage selection
- All form data entered

### Draft Recovery

- On next modal open, user is prompted to restore draft
- If user declines, draft is deleted
- Draft expires after modal close (next save overwrites)

## Form Validation

### Real-time Validation

- Fields are validated as user types
- Error messages appear below invalid fields
- Red border indicates invalid fields

### Submit Validation

- All required fields must be filled
- Type-specific validations applied
- Modal shows all errors at once

### Common Validation Rules

- Title: Optional, no validation
- Tags: Optional, no validation
- Difficulty: Required, must be one of 3 values
- Points: Required, must be > 0
- Time Limit: Optional, must be > 0 if provided
- Language: Required, must be 'vi' or 'en'

## Integration Guide

### Using the Modal in Your Component

```typescript
import CreateQuestionModal from "@/features/dashboard/components/questionbank/CreateQuestionModal";

function YourComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (question: QuestionBase) => {
    console.log("Saved question:", question);
    // Call API to save question
    // api.createQuestion(question);
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Create Question</button>

      {isModalOpen && (
        <CreateQuestionModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
```

### API Integration

The `onSave` callback receives a complete question object. You should:

1. Call your backend API to save the question
2. Handle success/error states
3. Close the modal on success
4. Show error message on failure

```typescript
const handleSave = async (question: QuestionBase) => {
  try {
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(question),
    });

    if (!response.ok) throw new Error("Save failed");

    const savedQuestion = await response.json();
    console.log("Question saved:", savedQuestion);
    setIsModalOpen(false);

    // Optionally refresh question list
    // refreshQuestionList();
  } catch (error) {
    console.error("Error saving question:", error);
    alert("Failed to save question");
  }
};
```

## Accessibility

### Keyboard Navigation

- Modal can be closed with `Esc` key
- Tab order follows logical flow
- All interactive elements are keyboard accessible

### Screen Readers

- Form labels are properly associated with inputs
- Error messages are announced
- Required fields are marked with aria-required

### Color Contrast

- Text meets WCAG AA standards
- Error states use both color and icons
- Focus indicators are visible

## Future Enhancements

### Planned Features

- [ ] Question preview panel (student view)
- [ ] Rich text editor for prompts
- [ ] Image/audio attachments for questions
- [ ] Question templates
- [ ] Import from Word/PDF
- [ ] Export to various formats
- [ ] Question versioning
- [ ] Collaborative editing
- [ ] AI question generation
- [ ] Question analytics

### API Endpoints (TODO)

```
POST   /api/questions          - Create question
GET    /api/questions/:id      - Get question
PUT    /api/questions/:id      - Update question
DELETE /api/questions/:id      - Delete question
GET    /api/questions          - List questions (with filters)
POST   /api/passages           - Create passage
GET    /api/passages           - List passages
```

## Troubleshooting

### Modal doesn't open

- Check if parent component state is properly set
- Verify `isModalOpen` state is true
- Check browser console for errors

### Auto-save not working

- Check localStorage is enabled in browser
- Verify no privacy extensions blocking localStorage
- Check browser console for errors

### Draft not restoring

- Ensure draft was saved (check localStorage in DevTools)
- Check `question_draft` key in localStorage
- Verify JSON structure is valid

### Form validation issues

- Check all required fields are filled
- Verify field values match expected types
- Check browser console for validation errors

## Browser Support

### Minimum Requirements

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Browser Features

- localStorage API
- ES6+ JavaScript
- CSS Grid and Flexbox
- Modern form controls

## Performance Notes

### Optimization Techniques

- Auto-save debounced to 10 seconds
- Form components re-render only on relevant state changes
- Large lists use virtual scrolling (if needed in future)

### Bundle Size

- Modal code-split from main bundle
- Forms lazy-loaded based on question type
- Estimated bundle size: ~50KB (gzipped)

## Contributing

When adding new question types:

1. Define TypeScript interface in `types/question.ts`
2. Create form component in `forms/`
3. Add case to `QuestionFormContainer.tsx`
4. Add icon and description to `QuestionTypeSelector.tsx`
5. Update this documentation
6. Add tests (when test framework is set up)

## License

Internal use only - GoPass Learning Platform
