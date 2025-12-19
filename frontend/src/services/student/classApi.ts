// src/services/student/classApi.ts
import {
  ClassDetail,
  ClassAssignment,
  AssignmentStatus,
} from "@/features/dashboard/types/student/";
import { httpClient } from "@/lib/http";

const formatDate = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const getClassDetailById = async (
  classId: string
): Promise<ClassDetail | null> => {
  try {
    console.log("Fetching class details for ID:", classId);
    const response = await httpClient.get<{ success: boolean; data: any }>(
      `/classes/${classId}`,
      { requiresAuth: true }
    );

    if (!response.success || !response.data) return null;
    
    const classData = response.data;

    // Extract data from backend response
    const teacherName = classData.teacher?.name || "Giáo viên";
    const studentCount = classData.studentCount || 0;
    
    // Fetch class assignments (student-facing)
    const assignmentsRes = await httpClient.get<{
      success: boolean;
      data: { assignments: any[] };
    }>(`/classes/${classId}/assignments`, { requiresAuth: true });

    const rawAssignments =
      assignmentsRes?.success && assignmentsRes.data?.assignments
        ? assignmentsRes.data.assignments
        : [];

    // Submission completion status only; availability is handled in the component
    const mapStatus = (myAttemptCount?: number): AssignmentStatus => {
      return myAttemptCount && myAttemptCount > 0 ? "completed" : "incomplete";
    };

    const assignments: ClassAssignment[] = rawAssignments.map((a) => {
      const status: AssignmentStatus = mapStatus(a.myAttemptCount);

      return {
        id: a._id || a.assignmentId || a.id || "",
        examId: a.examId || "",
        title: a.title || "Bài kiểm tra",
        startTime: a.startTime ? new Date(a.startTime).toISOString() : "",
        endTime: a.endTime ? new Date(a.endTime).toISOString() : "",
        deadlineDisplay: a.endTime ? formatDate(a.endTime) : "",
        duration: a.duration || 0,
        questionCount: a.questionCount || 0,
        status,
        score: typeof a.myScore === "number" ? a.myScore : null,
        maxScore: typeof a.maxScore === "number" ? a.maxScore : 0,
        attemptLimit: typeof a.attemptLimit === "number" ? a.attemptLimit : 1,
        myAttemptCount: typeof a.myAttemptCount === "number" ? a.myAttemptCount : 0,
        submittedCount: typeof a.submittedCount === "number" ? a.submittedCount : 0,
        totalStudents: studentCount,
      };
    });

    const totalAssignments = assignments.length;
    const assignmentsDone = assignments.filter(
      (a) => a.status === "completed"
    ).length;
    const scored = assignments.filter((a) => a.score !== null && a.maxScore);
    const avgScore =
      scored.length > 0
        ? scored.reduce((sum, a) => sum + (a.score || 0), 0) / scored.length
        : 0;

    return {
      id: classData._id,
      code: classData.classCode,
      name: classData.className,
      subject: classData.subject || "Tổng hợp",
      teacher: teacherName,
      studentsCount: studentCount,
      description: classData.description || "",

      stats: {
        rank: 0,
        totalStudents: studentCount,
        assignmentsDone,
        totalAssignments,
        avgScore,
      },

      assignments,
    };

  } catch (error) {
    console.error("Failed to fetch class details:", error);
    return null;
  }
};