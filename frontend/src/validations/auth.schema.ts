import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

// Register validation schema
export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ và tên là bắt buộc')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không được quá 100 ký tự'),
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ'),
  role: z.enum(['student', 'teacher'], {
    message: 'Vai trò không hợp lệ',
  }),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự'),
  confirmPassword: z
    .string()
    .min(1, 'Xác nhận mật khẩu là bắt buộc'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

// Type inference
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
