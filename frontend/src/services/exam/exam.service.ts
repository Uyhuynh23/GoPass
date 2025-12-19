// src/services/exam/exam.service.ts
import { httpClient } from '@/lib/http';
import { ExamWithDetails, ExamSubmission } from "@/features/exam/types";

/**
 * Exam Service - Handles all exam-related API calls
 * Uses httpClient for automatic JWT token handling
 */
export const examService = {
  /**
   * Get exam by ID with full details
   * API: GET /api/exams/:examId
   * Auth: Required
   * 
   * @param id - Exam ID
   * @param assignmentId - Optional assignment ID if taking via class assignment
   * @param contestId - Optional contest ID if taking via contest
   */
  getExamById: async (
    id: string, 
    assignmentId?: string, 
    contestId?: string
  ): Promise<ExamWithDetails | null> => {
    try {
      const params = new URLSearchParams();
      if (assignmentId) params.append('assignmentId', assignmentId);
      if (contestId) params.append('contestId', contestId);
      
      const queryString = params.toString();
      const url = `/exams/${id}${queryString ? `?${queryString}` : ''}`;
      
      const response = await httpClient.get<{ success: boolean; data: ExamWithDetails }>(
        url,
        { requiresAuth: true }
      );

      if (!response.success || !response.data) {
        console.error("Failed to fetch exam data");
        return null;
      }

      return response.data;
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

  /**
   * Create submission (start exam)
   * API: POST /api/exams/:examId/submissions
   * Auth: Required
   * 
   * @param examId - Exam ID
   * @param assignmentId - Optional assignment ID
   * @param contestId - Optional contest ID
   */
  createSubmission: async (
    examId: string,
    assignmentId?: string,
    contestId?: string
  ): Promise<ExamSubmission | null> => {
    try {
      const response = await httpClient.post<{ success: boolean; data: ExamSubmission }>(
        `/exams/${examId}/submissions`,
        { assignmentId, contestId },
        { requiresAuth: true }
      );

      if (!response.success || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating submission:", error);
      return null;
    }
  },

  /**
   * Get user's submissions for an exam
   * API: GET /api/exams/:examId/my-submissions
   * Auth: Required
   * 
   * @param examId - Exam ID
   * @param assignmentId - Optional assignment ID to filter
   */
  getMySubmissions: async (examId: string, assignmentId?: string): Promise<ExamSubmission[]> => {
    try {
      const params = new URLSearchParams();
      if (assignmentId) params.append('assignmentId', assignmentId);
      
      const queryString = params.toString();
      const url = `/exams/${examId}/my-submissions${queryString ? `?${queryString}` : ''}`;
      
      const response = await httpClient.get<{ success: boolean; data: ExamSubmission[] }>(
        url,
        { requiresAuth: true }
      );

      if (!response.success || !response.data) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching submissions:", error);
      return [];
    }
  },
};
