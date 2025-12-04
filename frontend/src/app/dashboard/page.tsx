"use client";
import { useAuth } from "@/hooks/features/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
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

  if (!user) return null;

  // Redirect based on role
  useEffect(() => {
    if (user) {
      if (user.role === "teacher") {
        router.push("/teacher/dashboard");
      } else if (user.role === "student") {
        router.push("/student/dashboard");
      }
    }
  }, [user, router]);

  return null;
}
