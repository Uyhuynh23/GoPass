export * from './classApi';
export * from './examApi';

// Re-export specific types for easier importing
export type {
    TeacherClass,
    ClassDetail,
    ClassMember,
    ClassJoinRequest,
    ClassAssignment,
    ClassStats,
    CreateClassData,
    UpdateClassData
} from './classApi';

export type {
    TeacherExam,
    ExamDetail,
    ExamAssignment,
    ExamSubmissionSummary,
    ExamStatistics,
    CreateExamData,
    AssignExamData
} from './examApi';