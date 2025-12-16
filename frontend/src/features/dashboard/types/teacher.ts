export interface TeacherStats {
    totalClasses: number;
    totalStudents: number;
    totalExams: number;
    totalContests: number;
}

export interface TeacherClass {
    id: string;
    name: string;
    subject: string;
    grade?: string;
    studentCount: number;
    examCount: number;
    description?: string;
    createdAt: string;
}

export interface TeacherExam {
    id: string;
    title: string;
    subject: string;
    classId: string;
    className: string;
    totalQuestions: number;
    duration: number; // in minutes
    status: "upcoming" | "active" | "completed";
    totalStudents: number;
    totalSubmissions: number;
    averageScore: number;
    createdAt: string;
    startTime: string;
    endTime: string;
    description?: string;
}

export interface RecentActivity {
    id: string;
    type: "exam_completion" | "student_joined" | "exam_created" | "reminder";
    message: string;
    timestamp: string;
    studentName?: string;
    examTitle?: string;
}

export interface TopStudent {
    id: string;
    name: string;
    className: string;
    averageScore: number;
    totalExams: number;
    trend: "up" | "down" | "stable";
}

export interface RecentExam {
    id: string;
    title: string;
    classId: string;
    className: string;
    totalSubmissions: number;
    totalStudents: number;
    completionRate: number;
    createdAt: string;
    duration: number;
}

export interface TeacherDashboardData {
    stats: TeacherStats;
    classes: TeacherClass[];
    exams: TeacherExam[];
    recentActivity: RecentActivity[];
    topStudents: TopStudent[];
    recentExams: RecentExam[];
}


// Add new interfaces for Class Detail functionality
export interface ClassDetailStats {
    totalMembers: number;
    pendingRequests: number;
    activeAssignments: number;
    averageScore: number;
}

export interface ClassMemberProgress {
    memberId: string;
    studentName: string;
    email: string;
    joinDate: string;
    completedAssignments: number;
    totalAssignments: number;
    averageScore: number;
    lastActivity: string;
    trend: "up" | "down" | "stable";
    recentScores: number[];
}

export interface ClassProgressSummary {
    totalAssignments: number;
    completedAssignments: number;
    averageCompletionRate: number;
    classAverageScore: number;
    topPerformer: {
        name: string;
        score: number;
    };
    strugglingStudents: {
        name: string;
        completionRate: number;
        avgScore: number;
    }[];
    recentTrends: {
        week: string;
        averageScore: number;
        completionRate: number;
    }[];
}