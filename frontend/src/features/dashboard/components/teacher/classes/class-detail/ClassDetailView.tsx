"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { classApi } from "@/services/teacher";
import ClassDetailHeader from "./ClassDetailHeader";
import ClassDetailTabs from "./ClassDetailTabs";
import ClassMembersView from "./members/ClassMembersView";
import ClassProgressView from "./progress/ClassProgressView";

// Types matching database models
interface ClassDetail {
  id: string;
  class_name: string;
  description: string;
  class_code: string;
  teacher_user_id: string;
  created_at: string;
  // Joined data
  teacher: {
    id: string;
    full_name: string;
    email: string;
  };
  members: ClassMember[];
  joinRequests: ClassJoinRequest[];
  assignments: ExamAssignment[];
  stats: ClassStats;
}

interface ClassMember {
  id: string;
  class_id: string;
  student_user_id: string;
  joined_date: string;
  status: 'pending' | 'approved';
  // Student details
  student: {
    id: string;
    full_name: string;
    email: string;
  };
}

interface ClassJoinRequest {
  id: string;
  class_id: string;
  student_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at: string;
  processed_at?: string;
  // Student details
  student: {
    id: string;
    full_name: string;
    email: string;
  };
}

interface ExamAssignment {
  id: string;
  exam_id: string;
  class_id: string;
  start_time: string;
  end_time: string;
  attempt_limit: number;
  created_at: string;
  // Exam details
  exam: {
    id: string;
    title: string;
    description: string;
    subject: string;
    duration_min: number;
    total_score: number;
  };
}

interface ClassStats {
  totalMembers: number;
  pendingRequests: number;
  activeAssignments: number;
  averageScore: number;
}

type TabType = "members" | "progress";

const ClassDetailView: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("members");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClassDetail();
  }, [classId]);

  const loadClassDetail = async () => {
    try {
      setLoading(true);
      
      // For now, use mock data that matches database structure
      const mockClassDetail: ClassDetail = {
        id: classId,
        class_name: "Lớp 12A1 - THPT Nguyễn Huệ",
        description: "Lớp chuyên Toán - Lý, chuẩn bị thi THPT Quốc Gia 2025",
        class_code: "12A1-NH-2025",
        teacher_user_id: "teacher-1",
        created_at: "2025-09-01T00:00:00Z",
        teacher: {
          id: "teacher-1",
          full_name: "Thầy Nguyễn Văn A",
          email: "teacher@gopass.com"
        },
        members: [
          {
            id: "member-1",
            class_id: classId,
            student_user_id: "student-1",
            joined_date: "2025-09-02T00:00:00Z",
            status: 'approved',
            student: {
              id: "student-1",
              full_name: "Nguyễn Văn B",
              email: "student1@gopass.com"
            }
          }
        ],
        joinRequests: [
          {
            id: "request-1",
            class_id: classId,
            student_user_id: "student-2",
            status: 'pending',
            requested_at: "2025-12-15T10:00:00Z",
            student: {
              id: "student-2",
              full_name: "Trần Thị C",
              email: "student2@gopass.com"
            }
          }
        ],
        assignments: [
          {
            id: "assignment-1",
            exam_id: "exam-1",
            class_id: classId,
            start_time: "2025-12-20T09:00:00Z",
            end_time: "2025-12-20T10:30:00Z",
            attempt_limit: 1,
            created_at: "2025-12-15T00:00:00Z",
            exam: {
              id: "exam-1",
              title: "Đề thi thử THPT QG lần 1 - Toán",
              description: "Đề thi thử theo cấu trúc mới",
              subject: "Toán",
              duration_min: 90,
              total_score: 10.0
            }
          }
        ],
        stats: {
          totalMembers: 45,
          pendingRequests: 2,
          activeAssignments: 12,
          averageScore: 8.5
        }
      };

      setClassDetail(mockClassDetail);
      
      // TODO: Replace with actual API call
      // const response = await classApi.getClassDetail(classId);
      // if (response.success) {
      //   setClassDetail(response.data);
      // } else {
      //   setError(response.error || "Không thể tải thông tin lớp học");
      // }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push("/dashboard/teacher/classes");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin lớp học...</p>
        </div>
      </div>
    );
  }

  if (error || !classDetail) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không thể tải thông tin lớp học</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Quay lại danh sách lớp
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "members":
        return <ClassMembersView classDetail={classDetail} onUpdate={loadClassDetail} />;
      case "progress":
        return <ClassProgressView classDetail={classDetail} />;
      default:
        return <ClassMembersView classDetail={classDetail} onUpdate={loadClassDetail} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ClassDetailHeader 
        classDetail={classDetail} 
        onGoBack={handleGoBack}
      />
      
      {/* Tabs */}
      <ClassDetailTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        stats={classDetail.stats}
      />
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ClassDetailView;