// src/services/studentStatsApi.ts
import { StudentStats, HistoryDataResponse, PerformanceDataPoint } from "@/features/dashboard/types/student/";
import { httpClient } from "@/lib/http";

/**
 * Fetch student statistics for dashboard
 * Backend handles all calculations
 */
export const fetchStudentStats = async (): Promise<StudentStats> => {
  try {
    const response = await httpClient.get<{ 
      success: boolean; 
      data: StudentStats 
    }>('/students/stats', { requiresAuth: true });

    return response.success && response.data 
      ? response.data 
      : { joinedClasses: 0, examsTaken: 0, averageScore: 0, daysUntilExam: 0 };

  } catch (error) {
    console.error("API Error fetching student stats:", error);
    return { joinedClasses: 0, examsTaken: 0, averageScore: 0, daysUntilExam: 0 };
  }
};

/**
 * Fetch student history with detailed stats
 * Backend returns fully processed history data
 */
export const fetchStudentHistory = async (): Promise<HistoryDataResponse> => {
  try {
    const response = await httpClient.get<{ 
      success: boolean; 
      data: HistoryDataResponse 
    }>('/students/history', { requiresAuth: true });

    if (!response.success || !response.data) {
      return {
        list: [],
        stats: {
          totalExams: 0, avgScore: 0, totalContests: 0, totalPractice: 0,
          highestScore: 0, bestSubject: "---", totalTime: 0
        }
      };
    }

    return response.data;

  } catch (error) {
    console.error("Error fetching history:", error);
    return {
      list: [],
      stats: {
        totalExams: 0, avgScore: 0, totalContests: 0, totalPractice: 0,
        highestScore: 0, bestSubject: "---", totalTime: 0
      }
    };
  }
};

/**
 * Fetch student activity for the last 7 days
 * Backend aggregates submission data by date
 */
export const fetchStudentActivity = async (): Promise<PerformanceDataPoint[]> => {
  try {
    const response = await httpClient.get<{ 
      success: boolean; 
      data: { activity: PerformanceDataPoint[] } 
    }>('/students/activity', { requiresAuth: true });

    return response.success && response.data?.activity 
      ? response.data.activity 
      : [];

  } catch (error) {
    console.error("Error fetching activity:", error);
    return [];
  }
};