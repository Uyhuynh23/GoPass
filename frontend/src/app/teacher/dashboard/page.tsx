"use client";
import { useAuth } from "@/hooks/features/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TeacherDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "teacher")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (!user || user.role !== "teacher") return null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Bảng điều khiển Giáo viên
              </h1>
              <p className="text-gray-600 mt-2">Xin chào, {user.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Đăng xuất
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-blue-600 text-sm font-semibold mb-2">
                Email
              </div>
              <div className="text-gray-800 font-medium">{user.email}</div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="text-purple-600 text-sm font-semibold mb-2">
                Vai trò
              </div>
              <div className="text-gray-800 font-medium">Giáo viên</div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="text-green-600 text-sm font-semibold mb-2">
                Trạng thái
              </div>
              <div className="text-gray-800 font-medium">
                {user.status === "active" ? "Hoạt động" : "Khóa"}
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              👋 Chào mừng đến với GoPass!
            </h2>
            <p className="text-gray-600">
              Bạn đã đăng nhập thành công với tài khoản giáo viên. Dashboard
              hoàn chỉnh sẽ được phát triển tiếp theo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
