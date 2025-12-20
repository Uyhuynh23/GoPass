// src/services/student/studentPracticeApi.ts
import { httpClient } from '@/lib/http';
import { PracticeExam } from '@/features/dashboard/types/student';

interface PracticeExamsResponse {
  success: boolean;
  data: {
    exams: PracticeExam[];
    total: number;
  };
}

/**
 * Fetch available practice exams for student
 * Returns global practice exams (mode: 'practice_global')
 */
export const fetchPracticeExams = async (
  subject?: string
): Promise<PracticeExam[]> => {
  try {
    const queryParams = subject && subject !== 'all' 
      ? `?subject=${encodeURIComponent(subject)}` 
      : '';
    
    const response = await httpClient.get<PracticeExamsResponse>(
      `/students/practice${queryParams}`, 
      { requiresAuth: true }
    );

    if (!response.success || !response.data?.exams) {
      return [];
    }

    return response.data.exams;

  } catch (error) {
    console.error('Error fetching practice exams:', error);
    return [];
  }
};
