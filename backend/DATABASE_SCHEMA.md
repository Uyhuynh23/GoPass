# Database Schema Documentation

## Overview

This document describes all database tables (collections), their attributes, data types, and relationships in the GoPass application backend.

---

## Table of Contents

1. [User](#user)
2. [Class](#class)
3. [ClassMember](#classmember)
4. [ClassJoinRequest](#classjoinrequest)
5. [Exam](#exam)
6. [Question](#question)
7. [ExamQuestion](#examquestion)
8. [ExamAssignment](#examassignment)
9. [ExamSubmission](#examsubmission)
10. [ExamAnswer](#examanswer)
11. [ManualGrading](#manualgrading)
12. [Contest](#contest)
13. [ContestExam](#contestexam)

---

## 1. User

**Collection Name:** `users`

**Description:** Stores information about users in the system (students, teachers, and admins).

### Attributes

| Field          | Type     | Required | Default      | Description                                            |
| -------------- | -------- | -------- | ------------ | ------------------------------------------------------ |
| `_id`          | ObjectId | Yes      | Auto         | Primary key                                            |
| `name`         | String   | Yes      | -            | User's full name (trimmed)                             |
| `email`        | String   | Yes      | -            | User's email (unique, lowercase, trimmed)              |
| `role`         | String   | Yes      | `'student'`  | User role: `'student'`, `'teacher'`, or `'admin'`      |
| `status`       | String   | Yes      | `'active'`   | Account status: `'active'`, `'locked'`, or `'pending'` |
| `passwordHash` | String   | Yes      | -            | Hashed password                                        |
| `avatar`       | String   | No       | -            | URL to user's avatar image                             |
| `phone`        | String   | No       | -            | User's phone number                                    |
| `createdAt`    | Date     | Yes      | `Date.now()` | Timestamp of creation                                  |
| `updatedAt`    | Date     | Yes      | `Date.now()` | Timestamp of last update                               |

### Indexes

- `email` (unique)
- `role`, `status` (compound)

### Relationships

- **One-to-Many** with `Class` (as teacher)
- **One-to-Many** with `ClassMember` (as student)
- **One-to-Many** with `Exam` (as creator)
- **One-to-Many** with `Question` (as creator)
- **One-to-Many** with `Contest` (as owner)

---

## 2. Class

**Collection Name:** `classes`

**Description:** Represents a class or course in the system.

### Attributes

| Field             | Type     | Required | Default      | Description                       |
| ----------------- | -------- | -------- | ------------ | --------------------------------- |
| `_id`             | ObjectId | Yes      | Auto         | Primary key                       |
| `name`            | String   | Yes      | -            | Class name (trimmed)              |
| `code`            | String   | Yes      | -            | Unique class code (uppercase)     |
| `teacherId`       | ObjectId | Yes      | -            | Reference to User (teacher)       |
| `description`     | String   | No       | -            | Class description (trimmed)       |
| `requireApproval` | Boolean  | Yes      | `false`      | Whether joining requires approval |
| `isActive`        | Boolean  | Yes      | `true`       | Whether the class is active       |
| `createdAt`       | Date     | Yes      | `Date.now()` | Timestamp of creation             |
| `updatedAt`       | Date     | Yes      | `Date.now()` | Timestamp of last update          |

### Indexes

- `code` (unique)
- `teacherId`

### Relationships

- **Many-to-One** with `User` (teacher)
- **One-to-Many** with `ClassMember`
- **One-to-Many** with `ClassJoinRequest`
- **One-to-Many** with `ExamAssignment`

---

## 3. ClassMember

**Collection Name:** `classmembers`

**Description:** Junction table linking students to classes.

### Attributes

| Field       | Type     | Required | Default      | Description                                  |
| ----------- | -------- | -------- | ------------ | -------------------------------------------- |
| `_id`       | ObjectId | Yes      | Auto         | Primary key                                  |
| `classId`   | ObjectId | Yes      | -            | Reference to Class                           |
| `studentId` | ObjectId | Yes      | -            | Reference to User (student)                  |
| `status`    | String   | Yes      | `'active'`   | Membership status: `'active'` or `'removed'` |
| `joinedAt`  | Date     | Yes      | `Date.now()` | Timestamp when student joined                |
| `createdAt` | Date     | Yes      | Auto         | Timestamp of creation                        |
| `updatedAt` | Date     | Yes      | Auto         | Timestamp of last update                     |

### Indexes

- `classId`, `studentId` (compound, unique)
- `studentId`

### Relationships

- **Many-to-One** with `Class`
- **Many-to-One** with `User` (student)

---

## 4. ClassJoinRequest

**Collection Name:** `classjoinrequests`

**Description:** Stores requests from students to join classes that require approval.

### Attributes

| Field         | Type     | Required | Default      | Description                                                |
| ------------- | -------- | -------- | ------------ | ---------------------------------------------------------- |
| `_id`         | ObjectId | Yes      | Auto         | Primary key                                                |
| `classId`     | ObjectId | Yes      | -            | Reference to Class                                         |
| `studentId`   | ObjectId | Yes      | -            | Reference to User (student)                                |
| `status`      | String   | Yes      | `'pending'`  | Request status: `'pending'`, `'accepted'`, or `'rejected'` |
| `requestedAt` | Date     | Yes      | `Date.now()` | Timestamp of request                                       |
| `processedAt` | Date     | No       | -            | Timestamp when request was processed                       |
| `processedBy` | ObjectId | No       | -            | Reference to User who processed the request                |
| `createdAt`   | Date     | Yes      | Auto         | Timestamp of creation                                      |
| `updatedAt`   | Date     | Yes      | Auto         | Timestamp of last update                                   |

### Indexes

- `classId`, `status` (compound)
- `studentId`

### Relationships

- **Many-to-One** with `Class`
- **Many-to-One** with `User` (student)
- **Many-to-One** with `User` (processor)

---

## 5. Exam

**Collection Name:** `exams`

**Description:** Stores exam/test templates.

### Attributes

| Field                    | Type     | Required | Default      | Description                                       |
| ------------------------ | -------- | -------- | ------------ | ------------------------------------------------- |
| `_id`                    | ObjectId | Yes      | Auto         | Primary key                                       |
| `title`                  | String   | Yes      | -            | Exam title (trimmed)                              |
| `description`            | String   | No       | -            | Exam description                                  |
| `subject`                | String   | Yes      | -            | Subject/topic of the exam                         |
| `durationMinutes`        | Number   | Yes      | `60`         | Exam duration in minutes                          |
| `mode`                   | String   | Yes      | `'practice'` | Exam mode: `'practice'`, `'test'`, or `'contest'` |
| `shuffleQuestions`       | Boolean  | Yes      | `false`      | Whether to shuffle question order                 |
| `showResultsImmediately` | Boolean  | Yes      | `false`      | Whether to show results after submission          |
| `createdBy`              | ObjectId | Yes      | -            | Reference to User (creator)                       |
| `isPublished`            | Boolean  | Yes      | `false`      | Whether the exam is published                     |
| `createdAt`              | Date     | Yes      | `Date.now()` | Timestamp of creation                             |
| `updatedAt`              | Date     | Yes      | `Date.now()` | Timestamp of last update                          |

### Indexes

- `createdBy`
- `subject`

### Relationships

- **Many-to-One** with `User` (creator)
- **One-to-Many** with `ExamQuestion`
- **One-to-Many** with `ExamAssignment`
- **One-to-Many** with `ExamSubmission`

---

## 6. Question

**Collection Name:** `questions`

**Description:** Question bank storing individual questions.

### Attributes

| Field                 | Type          | Required | Default      | Description                                                                        |
| --------------------- | ------------- | -------- | ------------ | ---------------------------------------------------------------------------------- |
| `_id`                 | ObjectId      | Yes      | Auto         | Primary key                                                                        |
| `type`                | String        | Yes      | -            | Question type: `'multiple_choice'`, `'essay'`, `'short_answer'`, or `'true_false'` |
| `content`             | String        | Yes      | -            | Question text/content                                                              |
| `options`             | Array         | No       | -            | Array of options for multiple choice questions                                     |
| `options[].text`      | String        | No       | -            | Option text                                                                        |
| `options[].isCorrect` | Boolean       | No       | -            | Whether this option is correct                                                     |
| `correctAnswer`       | String        | No       | -            | Correct answer for short answer or essay                                           |
| `difficulty`          | String        | Yes      | `'medium'`   | Difficulty level: `'easy'`, `'medium'`, or `'hard'`                                |
| `subject`             | String        | Yes      | -            | Subject/topic of the question                                                      |
| `tags`                | Array[String] | No       | -            | Tags for categorization                                                            |
| `points`              | Number        | Yes      | `1`          | Default points for this question                                                   |
| `createdBy`           | ObjectId      | No       | -            | Reference to User (creator)                                                        |
| `isPublic`            | Boolean       | Yes      | `false`      | Whether the question is public                                                     |
| `createdAt`           | Date          | Yes      | `Date.now()` | Timestamp of creation                                                              |
| `updatedAt`           | Date          | Yes      | `Date.now()` | Timestamp of last update                                                           |

### Indexes

- `subject`, `difficulty` (compound)
- `tags`
- `createdBy`

### Relationships

- **Many-to-One** with `User` (creator)
- **One-to-Many** with `ExamQuestion`
- **One-to-Many** with `ExamAnswer`

---

## 7. ExamQuestion

**Collection Name:** `examquestions`

**Description:** Junction table linking questions to exams with ordering and scoring.

### Attributes

| Field        | Type     | Required | Default      | Description                                  |
| ------------ | -------- | -------- | ------------ | -------------------------------------------- |
| `_id`        | ObjectId | Yes      | Auto         | Primary key                                  |
| `examId`     | ObjectId | Yes      | -            | Reference to Exam                            |
| `questionId` | ObjectId | Yes      | -            | Reference to Question                        |
| `order`      | Number   | Yes      | -            | Order of question in the exam                |
| `maxScore`   | Number   | Yes      | `1`          | Maximum score for this question in this exam |
| `createdAt`  | Date     | Yes      | `Date.now()` | Timestamp of creation                        |
| `updatedAt`  | Date     | Yes      | Auto         | Timestamp of last update                     |

### Indexes

- `examId`, `questionId` (compound, unique)
- `examId`, `order` (compound)

### Relationships

- **Many-to-One** with `Exam`
- **Many-to-One** with `Question`

---

## 8. ExamAssignment

**Collection Name:** `examassignments`

**Description:** Assigns exams to classes with specific time windows and settings.

### Attributes

| Field                 | Type     | Required | Default      | Description                          |
| --------------------- | -------- | -------- | ------------ | ------------------------------------ |
| `_id`                 | ObjectId | Yes      | Auto         | Primary key                          |
| `examId`              | ObjectId | Yes      | -            | Reference to Exam                    |
| `classId`             | ObjectId | Yes      | -            | Reference to Class                   |
| `startTime`           | Date     | Yes      | -            | When the exam becomes available      |
| `endTime`             | Date     | Yes      | -            | When the exam closes                 |
| `shuffleQuestions`    | Boolean  | Yes      | `false`      | Whether to shuffle questions         |
| `allowLateSubmission` | Boolean  | Yes      | `false`      | Whether late submissions are allowed |
| `maxAttempts`         | Number   | Yes      | `1`          | Maximum number of attempts allowed   |
| `createdAt`           | Date     | Yes      | `Date.now()` | Timestamp of creation                |
| `updatedAt`           | Date     | Yes      | Auto         | Timestamp of last update             |

### Indexes

- `examId`
- `classId`
- `startTime`, `endTime` (compound)

### Relationships

- **Many-to-One** with `Exam`
- **Many-to-One** with `Class`
- **One-to-Many** with `ExamSubmission`

---

## 9. ExamSubmission

**Collection Name:** `examsubmissions`

**Description:** Tracks student submissions for assigned exams.

### Attributes

| Field           | Type     | Required | Default         | Description                                                                |
| --------------- | -------- | -------- | --------------- | -------------------------------------------------------------------------- |
| `_id`           | ObjectId | Yes      | Auto            | Primary key                                                                |
| `assignmentId`  | ObjectId | Yes      | -               | Reference to ExamAssignment                                                |
| `examId`        | ObjectId | Yes      | -               | Reference to Exam                                                          |
| `studentId`     | ObjectId | Yes      | -               | Reference to User (student)                                                |
| `status`        | String   | Yes      | `'in_progress'` | Submission status: `'in_progress'`, `'submitted'`, `'graded'`, or `'late'` |
| `startedAt`     | Date     | Yes      | `Date.now()`    | When the student started the exam                                          |
| `submittedAt`   | Date     | No       | -               | When the student submitted the exam                                        |
| `totalScore`    | Number   | Yes      | `0`             | Total score achieved                                                       |
| `maxScore`      | Number   | No       | -               | Maximum possible score                                                     |
| `attemptNumber` | Number   | Yes      | `1`             | Attempt number for this student                                            |
| `createdAt`     | Date     | Yes      | Auto            | Timestamp of creation                                                      |
| `updatedAt`     | Date     | Yes      | Auto            | Timestamp of last update                                                   |

### Indexes

- `assignmentId`, `studentId` (compound)
- `examId`
- `studentId`
- `status`

### Relationships

- **Many-to-One** with `ExamAssignment`
- **Many-to-One** with `Exam`
- **Many-to-One** with `User` (student)
- **One-to-Many** with `ExamAnswer`

---

## 10. ExamAnswer

**Collection Name:** `examanswers`

**Description:** Stores individual answers for each question in a submission.

### Attributes

| Field              | Type          | Required | Default      | Description                            |
| ------------------ | ------------- | -------- | ------------ | -------------------------------------- |
| `_id`              | ObjectId      | Yes      | Auto         | Primary key                            |
| `submissionId`     | ObjectId      | Yes      | -            | Reference to ExamSubmission            |
| `questionId`       | ObjectId      | Yes      | -            | Reference to Question                  |
| `answerText`       | String        | No       | -            | Text answer for essay or short answer  |
| `selectedOptions`  | Array[String] | No       | -            | Selected option(s) for multiple choice |
| `score`            | Number        | Yes      | `0`          | Score awarded for this answer          |
| `maxScore`         | Number        | No       | -            | Maximum possible score                 |
| `feedback`         | String        | No       | -            | Feedback or comments on the answer     |
| `isAutoGraded`     | Boolean       | Yes      | `false`      | Whether this was auto-graded           |
| `isManuallyGraded` | Boolean       | Yes      | `false`      | Whether this was manually graded       |
| `createdAt`        | Date          | Yes      | `Date.now()` | Timestamp of creation                  |
| `updatedAt`        | Date          | Yes      | `Date.now()` | Timestamp of last update               |

### Indexes

- `submissionId`, `questionId` (compound, unique)
- `submissionId`

### Relationships

- **Many-to-One** with `ExamSubmission`
- **Many-to-One** with `Question`
- **One-to-Many** with `ManualGrading`

---

## 11. ManualGrading

**Collection Name:** `manualgradings`

**Description:** Records manual grading actions by teachers for essay/short answer questions.

### Attributes

| Field       | Type     | Required | Default      | Description                        |
| ----------- | -------- | -------- | ------------ | ---------------------------------- |
| `_id`       | ObjectId | Yes      | Auto         | Primary key                        |
| `answerId`  | ObjectId | Yes      | -            | Reference to ExamAnswer            |
| `graderId`  | ObjectId | Yes      | -            | Reference to User (grader/teacher) |
| `score`     | Number   | Yes      | -            | Score awarded by grader            |
| `comment`   | String   | No       | -            | Grader's comment or feedback       |
| `gradedAt`  | Date     | Yes      | `Date.now()` | Timestamp when graded              |
| `createdAt` | Date     | Yes      | Auto         | Timestamp of creation              |
| `updatedAt` | Date     | Yes      | Auto         | Timestamp of last update           |

### Indexes

- `answerId`
- `graderId`

### Relationships

- **Many-to-One** with `ExamAnswer`
- **Many-to-One** with `User` (grader)

---

## 12. Contest

**Collection Name:** `contests`

**Description:** Represents competitive exam contests.

### Attributes

| Field         | Type     | Required | Default      | Description                                             |
| ------------- | -------- | -------- | ------------ | ------------------------------------------------------- |
| `_id`         | ObjectId | Yes      | Auto         | Primary key                                             |
| `name`        | String   | Yes      | -            | Contest name (trimmed)                                  |
| `description` | String   | No       | -            | Contest description                                     |
| `startTime`   | Date     | Yes      | -            | Contest start time                                      |
| `endTime`     | Date     | Yes      | -            | Contest end time                                        |
| `ownerId`     | ObjectId | Yes      | -            | Reference to User (owner)                               |
| `isPublic`    | Boolean  | Yes      | `true`       | Whether the contest is public                           |
| `status`      | String   | Yes      | `'upcoming'` | Contest status: `'upcoming'`, `'ongoing'`, or `'ended'` |
| `createdAt`   | Date     | Yes      | `Date.now()` | Timestamp of creation                                   |
| `updatedAt`   | Date     | Yes      | `Date.now()` | Timestamp of last update                                |

### Indexes

- `ownerId`
- `startTime`, `endTime` (compound)
- `status`

### Relationships

- **Many-to-One** with `User` (owner)
- **One-to-Many** with `ContestExam`

---

## 13. ContestExam

**Collection Name:** `contestexams`

**Description:** Junction table linking exams to contests with ordering and weighting.

### Attributes

| Field       | Type     | Required | Default      | Description                                  |
| ----------- | -------- | -------- | ------------ | -------------------------------------------- |
| `_id`       | ObjectId | Yes      | Auto         | Primary key                                  |
| `contestId` | ObjectId | Yes      | -            | Reference to Contest                         |
| `examId`    | ObjectId | Yes      | -            | Reference to Exam                            |
| `order`     | Number   | Yes      | -            | Order of exam in the contest                 |
| `weight`    | Number   | Yes      | `1`          | Weight/importance of exam in contest scoring |
| `createdAt` | Date     | Yes      | `Date.now()` | Timestamp of creation                        |
| `updatedAt` | Date     | Yes      | Auto         | Timestamp of last update                     |

### Indexes

- `contestId`, `examId` (compound, unique)
- `contestId`, `order` (compound)

### Relationships

- **Many-to-One** with `Contest`
- **Many-to-One** with `Exam`

---

## Entity Relationship Diagram (ERD) Summary

```
User
├── 1:N → Class (as teacher)
├── 1:N → ClassMember (as student)
├── 1:N → ClassJoinRequest (as student)
├── 1:N → Exam (as creator)
├── 1:N → Question (as creator)
├── 1:N → Contest (as owner)
├── 1:N → ExamSubmission (as student)
└── 1:N → ManualGrading (as grader)

Class
├── N:1 → User (teacher)
├── 1:N → ClassMember
├── 1:N → ClassJoinRequest
└── 1:N → ExamAssignment

Exam
├── N:1 → User (creator)
├── 1:N → ExamQuestion
├── 1:N → ExamAssignment
├── 1:N → ExamSubmission
└── 1:N → ContestExam

Question
├── N:1 → User (creator)
├── 1:N → ExamQuestion
└── 1:N → ExamAnswer

Contest
├── N:1 → User (owner)
└── 1:N → ContestExam

ExamAssignment
├── N:1 → Exam
├── N:1 → Class
└── 1:N → ExamSubmission

ExamSubmission
├── N:1 → ExamAssignment
├── N:1 → Exam
├── N:1 → User (student)
└── 1:N → ExamAnswer

ExamAnswer
├── N:1 → ExamSubmission
├── N:1 → Question
└── 1:N → ManualGrading
```

---

## Data Types Reference

| MongoDB Type | JavaScript Type | Description               |
| ------------ | --------------- | ------------------------- |
| `ObjectId`   | Object          | 12-byte unique identifier |
| `String`     | String          | UTF-8 string              |
| `Number`     | Number          | Double-precision float    |
| `Boolean`    | Boolean         | true or false             |
| `Date`       | Date            | Unix timestamp            |
| `Array`      | Array           | Ordered list of values    |

---

## Notes

### Timestamps

All models use Mongoose timestamps feature which automatically manages `createdAt` and `updatedAt` fields.

### Validation

- Email fields are automatically converted to lowercase
- String fields with `trim: true` remove leading/trailing whitespace
- Enum fields enforce specific allowed values
- Unique indexes prevent duplicate entries

### Indexes

Indexes are created to optimize common query patterns:

- Single field indexes for foreign keys and commonly queried fields
- Compound indexes for queries involving multiple fields
- Unique indexes to enforce data integrity

### Relationships

The database uses MongoDB's reference pattern (normalized design) with ObjectId references instead of embedded documents for better flexibility and to avoid document size limits.
