import { apiClient } from '../api';

// Backend Model Interfaces
export interface ExamModel {
    _id: string;
    title: string;
    description: string;
    subject: string;
    duration_min: number;
    total_score: number;
    created_by: string;
    totalQuestions: number;
    readingPassages: any[];
    created_at: string;
    updated_at: string;
}

export interface ExamAssignmentModel {
    _id: string;
    exam_id: string;
    class_id: string;
    start_time: string;
    end_time: string;
    attempt_limit: number;
    created_at: string;
}

export interface ExamSubmissionModel {
    _id: string;
    exam_id: string;
    student_user_id: string;
    class_id?: string;
    started_at: string;
    submitted_at?: string;
    status: 'in_progress' | 'submitted' | 'graded' | 'late';
    objective_score: number;
    final_score: number;
    correctQuestionsCount: number;
}

// Frontend Types
export interface TeacherExam {
    id: string;
    title: string;
    subject: string;
    description: string;
    totalQuestions: number;
    duration: number;
    totalScore: number;
    status: "upcoming" | "active" | "completed";
    // Assignment info (if assigned)
    classId?: string;
    className?: string;
    startTime?: string;
    endTime?: string;
    // Stats
    totalStudents: number;
    totalSubmissions: number;
    averageScore: number;
    createdAt: string;
}

export interface ExamDetail extends TeacherExam {
    readingPassages: any[];
    assignments: ExamAssignment[];
    submissions: ExamSubmissionSummary[];
    statistics: ExamStatistics;
}

export interface ExamAssignment {
    id: string;
    classId: string;
    className: string;
    startTime: string;
    endTime: string;
    maxAttempts: number;
    // Stats for this assignment
    totalStudents: number;
    totalSubmissions: number;
    completionRate: number;
    averageScore: number;
}

export interface ExamSubmissionSummary {
    id: string;
    studentId: string;
    studentName: string;
    className: string;
    submittedAt: string;
    status: 'in_progress' | 'submitted' | 'graded' | 'late';
    score: number;
    maxScore: number;
    correctAnswers: number;
    totalQuestions: number;
}

export interface ExamStatistics {
    totalAssignments: number;
    totalStudents: number;
    totalSubmissions: number;
    completionRate: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    scoreDistribution: {
        range: string;
        count: number;
        percentage: number;
    }[];
}

export interface CreateExamData {
    title: string;
    description: string;
    subject: string;
    totalQuestions: string;
    duration: string; // minutes
    classIds?: string[];
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    showAnswers?: boolean;
}

export interface AssignExamData {
    examId: string;
    classIds: string[];
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    maxAttempts?: number;
}

export const examApi = {
    // GET /api/teacher/exams - Lấy danh sách đề thi
    getExams: async (teacherId?: string): Promise<ApiResponse<TeacherExam[]>> => {
        const endpoint = teacherId
            ? `/api/teacher/exams?created_by=${teacherId}`
            : '/api/teacher/exams';

        const response = await apiClient.get<ExamModel[]>(endpoint);

        if (response.success) {
            const transformedData: TeacherExam[] = response.data.map(exam => ({
                id: exam._id,
                title: exam.title,
                subject: exam.subject,
                description: exam.description,
                totalQuestions: exam.totalQuestions,
                duration: exam.duration_min,
                totalScore: exam.total_score,
                status: "upcoming", // TODO: Calculate based on assignments
                totalStudents: 0, // TODO: Calculate from assignments
                totalSubmissions: 0, // TODO: Calculate from submissions
                averageScore: 0, // TODO: Calculate from submissions
                createdAt: exam.created_at,
            }));

            return {
                success: true,
                data: transformedData,
            };
        }

        return response as ApiResponse<TeacherExam[]>;
    },

    // GET /api/teacher/exams/:id - Lấy chi tiết đề thi
    getExamDetail: async (examId: string): Promise<ApiResponse<ExamDetail>> => {
        const response = await apiClient.get<any>(`/api/teacher/exams/${examId}/detail`);

        if (response.success) {
            const examData = response.data;

            const transformedDetail: ExamDetail = {
                id: examData._id,
                title: examData.title,
                subject: examData.subject,
                description: examData.description,
                totalQuestions: examData.totalQuestions,
                duration: examData.duration_min,
                totalScore: examData.total_score,
                status: "upcoming", // TODO: Calculate
                totalStudents: 0, // TODO: Calculate
                totalSubmissions: 0, // TODO: Calculate
                averageScore: 0, // TODO: Calculate
                createdAt: examData.created_at,
                readingPassages: examData.readingPassages || [],
                assignments: examData.assignments?.map((assignment: any) => ({
                    id: assignment._id,
                    classId: assignment.class_id,
                    className: assignment.class?.class_name || 'Unknown',
                    startTime: assignment.start_time,
                    endTime: assignment.end_time,
                    maxAttempts: assignment.attempt_limit,
                    totalStudents: assignment.class?.studentCount || 0,
                    totalSubmissions: 0, // TODO: Calculate
                    completionRate: 0, // TODO: Calculate
                    averageScore: 0, // TODO: Calculate
                })) || [],
                submissions: examData.submissions?.map((submission: any) => ({
                    id: submission._id,
                    studentId: submission.student_user_id,
                    studentName: submission.student?.full_name || 'Unknown',
                    className: submission.class?.class_name || 'N/A',
                    submittedAt: submission.submitted_at || submission.started_at,
                    status: submission.status,
                    score: submission.final_score,
                    maxScore: examData.total_score,
                    correctAnswers: submission.correctQuestionsCount,
                    totalQuestions: examData.totalQuestions,
                })) || [],
                statistics: {
                    totalAssignments: examData.assignments?.length || 0,
                    totalStudents: 0, // TODO: Calculate
                    totalSubmissions: examData.submissions?.length || 0,
                    completionRate: 0, // TODO: Calculate
                    averageScore: 0, // TODO: Calculate
                    highestScore: 0, // TODO: Calculate
                    lowestScore: 0, // TODO: Calculate
                    scoreDistribution: [], // TODO: Calculate
                },
            };

            return {
                success: true,
                data: transformedDetail,
            };
        }

        return response as ApiResponse<ExamDetail>;
    },

    // POST /api/teacher/exams - Tạo đề thi mới
    createExam: async (examData: CreateExamData): Promise<ApiResponse<ExamModel>> => {
        const payload = {
            title: examData.title,
            description: examData.description,
            subject: examData.subject,
            duration_min: parseInt(examData.duration),
            total_score: 10.0, // Default
            totalQuestions: parseInt(examData.totalQuestions),
            readingPassages: [],
            // created_by will be set by backend from auth token
        };

        return await apiClient.post<ExamModel>('/api/teacher/exams', payload);
    },

    // PUT /api/teacher/exams/:id - Cập nhật đề thi
    updateExam: async (examId: string, examData: Partial<CreateExamData>): Promise<ApiResponse<ExamModel>> => {
        const payload = {
            ...(examData.title && { title: examData.title }),
            ...(examData.description && { description: examData.description }),
            ...(examData.subject && { subject: examData.subject }),
            ...(examData.duration && { duration_min: parseInt(examData.duration) }),
            ...(examData.totalQuestions && { totalQuestions: parseInt(examData.totalQuestions) }),
        };

        return await apiClient.put<ExamModel>(`/api/teacher/exams/${examId}`, payload);
    },

    // DELETE /api/teacher/exams/:id - Xóa đề thi
    deleteExam: async (examId: string): Promise<ApiResponse<void>> => {
        return await apiClient.delete<void>(`/api/teacher/exams/${examId}`);
    },

    // POST /api/teacher/exams/:id/assign - Gán đề thi cho lớp
    assignExam: async (assignmentData: AssignExamData): Promise<ApiResponse<ExamAssignmentModel[]>> => {
        const assignments = assignmentData.classIds.map(classId => ({
            exam_id: assignmentData.examId,
            class_id: classId,
            start_time: `${assignmentData.startDate}T${assignmentData.startTime}:00Z`,
            end_time: `${assignmentData.endDate}T${assignmentData.endTime}:00Z`,
            attempt_limit: assignmentData.maxAttempts || 1,
        }));

        return await apiClient.post<ExamAssignmentModel[]>(`/api/teacher/exams/${assignmentData.examId}/assign`, {
            assignments,
        });
    },

    // GET /api/teacher/exams/:id/submissions - Lấy danh sách bài nộp
    getExamSubmissions: async (examId: string): Promise<ApiResponse<ExamSubmissionSummary[]>> => {
        const response = await apiClient.get<ExamSubmissionModel[]>(`/api/teacher/exams/${examId}/submissions`);

        if (response.success) {
            // Transform to frontend format
            const transformedData: ExamSubmissionSummary[] = response.data.map(submission => ({
                id: submission._id,
                studentId: submission.student_user_id,
                studentName: 'Unknown', // TODO: Join with User data
                className: 'Unknown', // TODO: Join with Class data
                submittedAt: submission.submitted_at || submission.started_at,
                status: submission.status,
                score: submission.final_score,
                maxScore: 10, // TODO: Get from exam
                correctAnswers: submission.correctQuestionsCount,
                totalQuestions: 0, // TODO: Get from exam
            }));

            return {
                success: true,
                data: transformedData,
            };
        }

        return response as ApiResponse<ExamSubmissionSummary[]>;
    },

    // GET /api/teacher/exams/:examId/statistics - Lấy thống kê đề thi
    getExamStatistics: async (examId: string): Promise<ApiResponse<ExamStatistics>> => {
        return await apiClient.get<ExamStatistics>(`/api/teacher/exams/${examId}/statistics`);
    },
};