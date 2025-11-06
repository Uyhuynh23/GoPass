'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', formData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back button */}
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-8 font-medium"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Quay lại
                </Link>

                {/* Login Form */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">G</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800">GoPass</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
                        <p className="text-gray-600">Đăng nhập vào tài khoản của bạn.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors text-gray-900 placeholder-gray-500"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors text-gray-900 placeholder-gray-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {showPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Remember me & Forgot password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Ghi nhớ tôi</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                        >
                            Đăng nhập
                        </button>

                        {/* Register Link */}
                        <p className="text-center text-sm text-gray-600">
                            Chưa có tài khoản?{' '}
                            <Link href="/register" className="text-teal-600 hover:text-teal-700 font-medium">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-4">
                        <span>🔒 Bảo mật 256-bit</span>
                        <span>•</span>
                        <span>✅ Dữ liệu được mã hóa</span>
                    </div>
                </div>
            </div>
        </div>
    );
}