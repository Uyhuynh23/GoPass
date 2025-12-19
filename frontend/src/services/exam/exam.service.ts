// src/services/exam/exam.service.ts
import { httpClient } from '@/lib/http';
import { ExamWithDetails } from "@/features/exam/types";

/**
 * Exam Service - Handles all exam-related API calls
 * Uses httpClient for automatic JWT token handling
 */
export const examService = {
  /**
   * Get exam by ID with full details
   * API: GET /api/exams/:examId
   * Auth: Required
   */
  getExamById: async (id: string): Promise<ExamWithDetails | null> => {
    try {
      const response = await httpClient.get<{ success: boolean; data: any }>(
        `/exams/${id}`,
        { requiresAuth: true }
      );

      if (!response.success || !response.data) {
        console.error("Failed to fetch exam data");
        return null;
      }

      const examData = response.data;

      // Transform backend data to frontend format
      return {
        ...examData,
        _id: examData.examId || examData._id,
        questions: examData.questions?.map((q: any) => ({
          _id: q.examQuestionId,
          examId: examData.examId,
          questionId: q.questionId,
          order: q.orderIndex,
          maxScore: q.points,
          section: q.section || null,
          question: {
            _id: q.questionId,
            type: q.questionType,
            content: q.questionText,
            options: q.options || [],
            points: q.points,
            tags: q.tags || [],
            linkedPassageId: q.linkedPassageId || null,
          },
        })) || [],
      };
    } catch (error) {
      console.error("Error fetching exam:", error);
      return null;
    }
  },

  /**
   * Create a new exam
   * API: POST /api/exams
   * Auth: Required (Teacher)
   */
  createExam: async (examData: any): Promise<any> => {
    return httpClient.post('/exams', examData, { requiresAuth: true });
  },

  /**
   * Update exam
   * API: PUT /api/exams/:examId
   * Auth: Required (Teacher, must be owner)
   */
  updateExam: async (examId: string, examData: any): Promise<any> => {
    return httpClient.put(`/exams/${examId}`, examData, { requiresAuth: true });
  },

  /**
   * Delete exam
   * API: DELETE /api/exams/:examId
   * Auth: Required (Teacher, must be owner)
   */
  deleteExam: async (examId: string): Promise<any> => {
    return httpClient.delete(`/exams/${examId}`, { requiresAuth: true });
  },

  /**
   * Add questions to exam
   * API: POST /api/exams/:examId/questions
   * Auth: Required (Teacher, must be owner)
   */
  addQuestionsToExam: async (examId: string, questions: any[]): Promise<any> => {
    return httpClient.post(`/exams/${examId}/questions`, { questions }, { requiresAuth: true });
  },

  /**
   * Assign exam to class
   * API: POST /api/exams/:examId/assign-to-class
   * Auth: Required (Teacher, must be owner)
   */
  assignExamToClass: async (examId: string, assignmentData: any): Promise<any> => {
    return httpClient.post(`/exams/${examId}/assign-to-class`, assignmentData, { requiresAuth: true });
  },

  /**
   * Generate exam from question bank
   * API: POST /api/exams/generate-from-bank
   * Auth: Required (Teacher)
   */
  generateExamFromBank: async (criteria: any): Promise<any> => {
    return httpClient.post('/exams/generate-from-bank', criteria, { requiresAuth: true });
  },
};
