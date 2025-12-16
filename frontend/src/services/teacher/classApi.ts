import { apiClient } from '../api';

// Exact database model interfaces
export interface ClassModel {
  _id: string;
  teacher_user_id: string;
  class_name: string;
  description: string;
  class_code: string;
  created_at: string;
  updated_at?: string;
}

export interface ClassMemberModel {
  _id: string;
  class_id: string;
  student_user_id: string;
  joined_date: string;
  status: 'pending' | 'approved';
}

export interface ClassJoinRequestModel {
  _id: string;
  class_id: string;
  student_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at: string;
  processed_at?: string;
}

export interface UserModel {
  _id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
}

// API Response Types
export interface ClassDetailResponse {
  class: ClassModel;
  teacher: UserModel;
  members: (ClassMemberModel & { student: UserModel })[];
  joinRequests: (ClassJoinRequestModel & { student: UserModel })[];
  assignments: any[]; // Will be populated with exam assignments
}

export interface CreateClassData {
  class_name: string;
  description: string;
  subject: string; // This will be added to class model later
  grade: string;   // This will be added to class model later
}

// Frontend display types
export interface TeacherClass {
  id: string;
  name: string;
  description: string;
  classCode: string;
  subject: string;
  grade: string;
  studentCount: number;
  examCount: number;
  createdAt: string;
}

export interface ClassDetail {
  id: string;
  class_name: string;
  description: string;
  class_code: string;
  created_at: string;
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

export interface ClassMember {
  id: string;
  class_id: string;
  student_user_id: string;
  joined_date: string;
  status: 'pending' | 'approved';
  student: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface ClassJoinRequest {
  id: string;
  class_id: string;
  student_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at: string;
  processed_at?: string;
  student: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface ExamAssignment {
  id: string;
  exam_id: string;
  class_id: string;
  start_time: string;
  end_time: string;
  attempt_limit: number;
  created_at: string;
  exam: {
    id: string;
    title: string;
    description: string;
    subject: string;
    duration_min: number;
    total_score: number;
  };
}

export interface ClassStats {
  totalMembers: number;
  pendingRequests: number;
  activeAssignments: number;
  averageScore: number;
}

export const classApi = {
  // GET /api/classes?teacher_user_id=:teacherId
  getClasses: async (teacherId?: string): Promise<ApiResponse<TeacherClass[]>> => {
    const endpoint = teacherId 
      ? `/api/classes?teacher_user_id=${teacherId}`
      : '/api/classes';
    
    const response = await apiClient.get<ClassModel[]>(endpoint);
    
    if (response.success) {
      const transformedData: TeacherClass[] = response.data.map(cls => ({
        id: cls._id,
        name: cls.class_name,
        description: cls.description,
        classCode: cls.class_code,
        subject: "Toán", // TODO: Add to backend model
        grade: "Lớp 12", // TODO: Add to backend model
        studentCount: 0, // TODO: Calculate from members
        examCount: 0, // TODO: Calculate from assignments
        createdAt: cls.created_at,
      }));
      
      return {
        success: true,
        data: transformedData,
      };
    }
    
    return response as ApiResponse<TeacherClass[]>;
  },

  // GET /api/classes/:id/detail
  getClassDetail: async (classId: string): Promise<ApiResponse<ClassDetail>> => {
    const response = await apiClient.get<ClassDetailResponse>(`/api/classes/${classId}/detail`);
    
    if (response.success) {
      const { class: classData, teacher, members, joinRequests, assignments } = response.data;
      
      const transformedDetail: ClassDetail = {
        id: classData._id,
        class_name: classData.class_name,
        description: classData.description,
        class_code: classData.class_code,
        created_at: classData.created_at,
        teacher: {
          id: teacher._id,
          full_name: teacher.full_name,
          email: teacher.email,
        },
        members: members.map(member => ({
          id: member._id,
          class_id: member.class_id,
          student_user_id: member.student_user_id,
          joined_date: member.joined_date,
          status: member.status,
          student: {
            id: member.student._id,
            full_name: member.student.full_name,
            email: member.student.email,
          },
        })),
        joinRequests: joinRequests.map(request => ({
          id: request._id,
          class_id: request.class_id,
          student_user_id: request.student_user_id,
          status: request.status,
          requested_at: request.requested_at,
          processed_at: request.processed_at,
          student: {
            id: request.student._id,
            full_name: request.student.full_name,
            email: request.student.email,
          },
        })),
        assignments: assignments || [],
        stats: {
          totalMembers: members.filter(m => m.status === 'approved').length,
          pendingRequests: joinRequests.filter(r => r.status === 'pending').length,
          activeAssignments: assignments?.length || 0,
          averageScore: 8.5, // TODO: Calculate from submissions
        },
      };
      
      return {
        success: true,
        data: transformedDetail,
      };
    }
    
    return response as ApiResponse<ClassDetail>;
  },

  // POST /api/classes
  createClass: async (classData: CreateClassData): Promise<ApiResponse<ClassModel>> => {
    const payload = {
      class_name: classData.class_name,
      description: classData.description,
      class_code: `${classData.grade.replace('Lớp ', '')}-${Date.now()}`, // Auto generate
      // teacher_user_id will be set from auth token in backend
    };
    
    return await apiClient.post<ClassModel>('/api/classes', payload);
  },

  // PUT /api/classes/:id
  updateClass: async (classId: string, updateData: Partial<CreateClassData>): Promise<ApiResponse<ClassModel>> => {
    const payload: any = {};
    
    if (updateData.class_name) payload.class_name = updateData.class_name;
    if (updateData.description) payload.description = updateData.description;
    
    return await apiClient.put<ClassModel>(`/api/classes/${classId}`, payload);
  },

  // DELETE /api/classes/:id
  deleteClass: async (classId: string): Promise<ApiResponse<void>> => {
    return await apiClient.delete<void>(`/api/classes/${classId}`);
  },

  // POST /api/classes/:id/join-requests/:requestId/approve
  approveJoinRequest: async (classId: string, requestId: string): Promise<ApiResponse<void>> => {
    return await apiClient.post<void>(`/api/classes/${classId}/join-requests/${requestId}/approve`, {});
  },

  // POST /api/classes/:id/join-requests/:requestId/reject
  rejectJoinRequest: async (classId: string, requestId: string): Promise<ApiResponse<void>> => {
    return await apiClient.post<void>(`/api/classes/${classId}/join-requests/${requestId}/reject`, {});
  },

  // DELETE /api/classes/:id/members/:memberId
  removeMember: async (classId: string, memberId: string): Promise<ApiResponse<void>> => {
    return await apiClient.delete<void>(`/api/classes/${classId}/members/${memberId}`);
  },
};