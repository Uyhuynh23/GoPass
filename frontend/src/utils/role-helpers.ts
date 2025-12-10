import { UserRole } from '../features/dashboard/types';

export const isAdmin = (role: UserRole): boolean => role === 'admin';
export const isTeacher = (role: UserRole): boolean => role === 'teacher';
export const isStudent = (role: UserRole): boolean => role === 'student';

export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    admin: 'Quản trị viên',
    student: 'Học sinh',
    teacher: 'Giáo viên',
  };
  return labels[role];
};
