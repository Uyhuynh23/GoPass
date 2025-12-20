// src/services/student/studentContestApi.ts
import { httpClient } from '@/lib/http';
import { StudentContest } from '@/features/dashboard/types/student/exam';

interface StudentContestsResponse {
  success: boolean;
  data: {
    contests: Array<
      Omit<StudentContest, 'id' | 'status'> & { id: string; status: 'upcoming' | 'ongoing' | 'completed' }
    >;
    total: number;
  };
}

/**
 * Fetch contests for student dashboard
 * Optional status filter: 'upcoming' | 'ongoing' | 'completed'
 */
export const fetchStudentContests = async (
  status?: 'upcoming' | 'ongoing' | 'completed'
): Promise<StudentContest[]> => {
  try {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const response = await httpClient.get<StudentContestsResponse>(
      `/students/contests${query}`,
      { requiresAuth: true }
    );

    if (!response.success || !response.data?.contests) return [];

    // Cast ids to string while preserving expected shape for UI
    return response.data.contests.map((c) => ({
      ...c,
      // The UI uses keys only; if strict typing is needed later, update StudentContest.id to string
      id: (c.id as unknown as any),
    })) as unknown as StudentContest[];
  } catch (error) {
    console.error('Error fetching student contests:', error);
    return [];
  }
};
