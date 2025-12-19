import { httpClient } from '@/lib/http';
import { AnswerData, ExamSubmission } from "@/features/exam/types";

/**
 * Submission Service - Handles all submission-related API calls
 * Uses httpClient for automatic JWT token handling
 */
export const submissionService = {
  /**
   * Auto-save answers during exam
   * API: PATCH /api/submissions/:submissionId/answers
   * Auth: Required
   */
  autoSaveAnswers: async (submissionId: string, answers: AnswerData[]): Promise<boolean> => {
    try {
      const response = await httpClient.patch<{ success: boolean; message: string }>(
        `/submissions/${submissionId}/answers`,
        { answers },
        { requiresAuth: true }
      );
      return response.success;
    } catch (error) {
      console.error('Error auto-saving answers:', error);
      return false;
    }
  },

  /**
   * Submit exam (finalize)
   * API: POST /api/submissions/:submissionId/submit
   * Auth: Required
   */
  submitExam: async (
    submissionId: string,
    answers: AnswerData[],
    timeSpentSeconds: number = 0
  ): Promise<ExamSubmission | null> => {
    try {
      const response = await httpClient.post<{ success: boolean; data: ExamSubmission }>(
        `/submissions/${submissionId}/submit`,
        { answers, timeSpentSeconds },
        { requiresAuth: true }
      );

      if (!response.success || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Error submitting exam:', error);
      return null;
    }
  },

  /**
   * Get submission details for review
   * API: GET /api/submissions/:submissionId
   * Auth: Required
   */
  getSubmissionDetails: async (submissionId: string): Promise<any> => {
    try {
      const response = await httpClient.get<{ success: boolean; data: any }>(
        `/submissions/${submissionId}`,
        { requiresAuth: true }
      );
      
      if (!response.success || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching submission details:', error);
      return null;
    }
  },

  /**
   * Get submission answers (for resume functionality)
   * API: GET /api/submissions/:submissionId/answers
   * Auth: Required
   */
  getSubmissionAnswers: async (submissionId: string): Promise<AnswerData[]> => {
    try {
      const response = await httpClient.get<{ success: boolean; data: { answers: AnswerData[] } }>(
        `/submissions/${submissionId}/answers`,
        { requiresAuth: true }
      );

      if (!response.success || !response.data) {
        return [];
      }

      return response.data.answers || [];
    } catch (error) {
      console.error('Error fetching submission answers:', error);
      return [];
    }
  },

  /**
   * Get active in-progress submissions
   * API: GET /api/submissions/my-active
   * Auth: Required
   */
  getMyActiveSubmissions: async (): Promise<ExamSubmission[]> => {
    try {
      const response = await httpClient.get<{ success: boolean; data: ExamSubmission[] }>(
        '/submissions/my-active',
        { requiresAuth: true }
      );

      if (!response.success || !response.data) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching active submissions:', error);
      return [];
    }
  },

  /**
   * Legacy method for backward compatibility
   * Use autoSaveAnswers instead
   */
  saveAnswers: async (examId: string, answers: AnswerData[]): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 300));
  },
};
