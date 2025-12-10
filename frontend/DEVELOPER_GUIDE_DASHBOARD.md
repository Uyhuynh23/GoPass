# GoPass Dashboard - Developer Guide

## 📋 Tổng quan

Dashboard của GoPass được thiết kế theo **role-based architecture** với 3 loại người dùng: **Admin**, **Teacher**, và **Student**. Mỗi role có navigation tabs và nội dung riêng biệt.

### ✅ Đã hoàn thành:

- **Admin Dashboard**: 3 tabs (Đề thi, Ngân hàng đề, Tạo Contest) - **100% complete**
- **Teacher Dashboard**: Skeleton với placeholder - **TODO**
- **Student Dashboard**: Skeleton với placeholder - **TODO**

---

## 🏗️ Kiến trúc hệ thống

### 1. Context-based State Management

Dashboard sử dụng **React Context** để quản lý state chung:

```typescript
// src/features/dashboard/context/DashboardContext.tsx
interface DashboardContextType {
  activeTab: string; // Tab hiện tại đang active
  setActiveTab: (tab: string) => void;
  userRole: UserRole; // 'admin' | 'teacher' | 'student'
  userName: string;
}
```

**Cách sử dụng trong components:**

```typescript
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

const MyComponent = () => {
  const { activeTab, setActiveTab, userRole } = useDashboard();

  // Access current tab
  console.log(activeTab); // 'exams', 'question-bank', etc.

  // Change tab programmatically
  setActiveTab("overview");
};
```

### 2. Layout Structure

```
DashboardLayout (layout.tsx)
├─ DashboardProvider (Context)
│  └─ DashboardLayoutContent
│     ├─ DashboardHeader
│     ├─ DashboardNavigation (tabs thay đổi theo role)
│     └─ main (children - nội dung page)
│
└─ DashboardPage (page.tsx)
   └─ Role-based content rendering
```

### 3. File Structure

```
src/
├── app/(protected)/dashboard/
│   ├── layout.tsx              # Dashboard layout với Provider
│   ├── page.tsx                # Main page - route content dựa vào activeTab
│   └── loading.tsx             # Loading skeleton
│
├── components/
│   ├── ui/                     # Reusable components
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Dropdown.tsx
│   │   ├── StatCard.tsx
│   │   ├── SectionHeader.tsx
│   │   └── index.ts
│   │
│   └── layout/
│       ├── DashboardHeader.tsx
│       └── DashboardNavigation.tsx
│
└── features/dashboard/
    ├── context/
    │   └── DashboardContext.tsx    # ⭐ Context cho dashboard state
    │
    ├── types/
    │   ├── index.ts               # Common types (UserRole, Exam, etc.)
    │   ├── questionbank.ts        # Question bank types
    │   └── contest.ts             # Contest types
    │
    ├── data/
    │   ├── mock-admin.ts          # Mock data cho Admin
    │   ├── mock-questionbank.ts   # Mock data cho Question Bank
    │   └── [TODO] mock-teacher.ts
    │   └── [TODO] mock-student.ts
    │
    └── components/
        ├── admin/                 # ✅ COMPLETED
        │   ├── AdminDashboardView.tsx
        │   ├── AdminStatsGrid.tsx
        │   ├── AdminActionToolbar.tsx
        │   ├── ExamManagementTable.tsx
        │   └── index.ts
        │
        ├── questionbank/          # ✅ COMPLETED
        │   ├── QuestionBankView.tsx
        │   ├── SubjectTabs.tsx
        │   ├── QuestionTopicList.tsx
        │   └── index.ts
        │
        ├── contest/               # ✅ COMPLETED
        │   ├── CreateContestView.tsx
        │   ├── SubjectSelector.tsx
        │   ├── ContestPreview.tsx
        │   └── index.ts
        │
        ├── teacher/               # 🔄 TODO
        │   └── [Your components here]
        │
        └── student/               # 🔄 TODO
            └── [Your components here]
```

---

## 🎯 Navigation System

### Tab Configuration per Role

File: `src/components/layout/DashboardNavigation.tsx`

```typescript
// Admin tabs
const adminTabs = [
  { id: "exams", label: "Đề thi", icon: <ExamIcon /> },
  { id: "question-bank", label: "Ngân hàng đề", icon: <BankIcon /> },
  { id: "contests", label: "Tạo Contest", icon: <ContestIcon /> },
];

// Teacher tabs
const teacherTabs = [
  { id: "overview", label: "Tổng quan", icon: <HomeIcon /> },
  { id: "classes", label: "Lớp học", icon: <ClassIcon /> },
  { id: "exams", label: "Đề thi", icon: <ExamIcon /> },
  { id: "students", label: "Học sinh", icon: <StudentIcon /> },
];

// Student tabs
const studentTabs = [
  { id: "overview", label: "Tổng quan", icon: <HomeIcon /> },
  { id: "practice", label: "Luyện tập", icon: <BookIcon /> },
  { id: "contests", label: "Contest", icon: <TrophyIcon /> },
  { id: "history", label: "Lịch sử", icon: <HistoryIcon /> },
];
```

### Routing Logic

File: `src/app/(protected)/dashboard/page.tsx`

```typescript
const DashboardPage = () => {
  const { activeTab, userRole } = useDashboard();

  const renderAdminContent = () => {
    switch (activeTab) {
      case "exams":
        return <AdminDashboardView />;
      case "question-bank":
        return <QuestionBankView />;
      case "contests":
        return <CreateContestView />;
      default:
        return <AdminDashboardView />;
    }
  };

  const renderTeacherContent = () => {
    switch (activeTab) {
      case "overview":
        return <TeacherOverviewView />; // TODO: Create this
      case "classes":
        return <TeacherClassesView />; // TODO: Create this
      case "exams":
        return <TeacherExamsView />; // TODO: Create this
      case "students":
        return <TeacherStudentsView />; // TODO: Create this
      default:
        return <TeacherOverviewView />;
    }
  };

  const renderStudentContent = () => {
    switch (activeTab) {
      case "overview":
        return <StudentOverviewView />; // TODO: Create this
      case "practice":
        return <StudentPracticeView />; // TODO: Create this
      case "contests":
        return <StudentContestsView />; // TODO: Create this
      case "history":
        return <StudentHistoryView />; // TODO: Create this
      default:
        return <StudentOverviewView />;
    }
  };

  // Role-based rendering
  switch (userRole) {
    case "admin":
      return renderAdminContent();
    case "teacher":
      return renderTeacherContent();
    case "student":
      return renderStudentContent();
  }
};
```

---

## 📝 Template cho Developer

### 1. Tạo View Component mới

**Pattern theo Admin Dashboard:**

```typescript
// src/features/dashboard/components/teacher/TeacherOverviewView.tsx
"use client";

import React, { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

const TeacherOverviewView: React.FC = () => {
  const { userRole } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader title="Tổng quan" subtitle="Dashboard giáo viên" />

      {/* Your content here */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stats cards, charts, lists, etc. */}
      </div>
    </div>
  );
};

export default TeacherOverviewView;
```

### 2. Sử dụng UI Components có sẵn

```typescript
import {
  Badge,
  Button,
  Input,
  Dropdown,
  StatCard,
  SectionHeader,
} from '@/components/ui';

// Stats Grid
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <StatCard
    title="Tổng lớp học"
    value={5}
    icon={<YourIcon />}
    iconBgColor="bg-blue-100"
    iconColor="text-blue-600"
  />
</div>

// Section with action
<SectionHeader
  title="Danh sách lớp học"
  subtitle="Quản lý lớp học của bạn"
  action={
    <Button variant="primary" onClick={handleCreate}>
      Tạo lớp mới
    </Button>
  }
/>

// Badges
<Badge variant="active">Đang hoạt động</Badge>
<Badge variant="completed">Đã hoàn thành</Badge>

// Button variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>
```

### 3. Tạo Types

```typescript
// src/features/dashboard/types/teacher.ts
export interface TeacherClass {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  examCount: number;
  createdAt: string;
}

export interface TeacherStats {
  totalClasses: number;
  totalStudents: number;
  totalExams: number;
  totalContests: number;
}

export interface TeacherDashboardData {
  stats: TeacherStats;
  classes: TeacherClass[];
  recentActivity: Activity[];
  topStudents: Student[];
}
```

### 4. Tạo Mock Data

```typescript
// src/features/dashboard/data/mock-teacher.ts
import { TeacherDashboardData } from "../types/teacher";

export const mockTeacherData: TeacherDashboardData = {
  stats: {
    totalClasses: 5,
    totalStudents: 120,
    totalExams: 15,
    totalContests: 3,
  },
  classes: [
    {
      id: "1",
      name: "Lớp 12A1",
      subject: "Toán",
      studentCount: 40,
      examCount: 5,
      createdAt: "2025-09-01",
    },
    // ... more data
  ],
  recentActivity: [],
  topStudents: [],
};
```

### 5. Update Dashboard Page

```typescript
// src/app/(protected)/dashboard/page.tsx

// Add import
import TeacherOverviewView from "@/features/dashboard/components/teacher/TeacherOverviewView";

// Update renderTeacherContent
const renderTeacherContent = () => {
  switch (activeTab) {
    case "overview":
      return <TeacherOverviewView />;
    // ... other cases
  }
};
```

---

## 🎨 Design System Reference

### Colors

```typescript
// Primary
bg-teal-500, text-teal-600, border-teal-200

// Role Badges
Admin    → bg-purple-100 text-purple-700
Teacher  → bg-blue-100 text-blue-700
Student  → bg-teal-100 text-teal-700

// Status
Active     → bg-green-100 text-green-700
Upcoming   → bg-orange-100 text-orange-700
Completed  → bg-gray-100 text-gray-700

// Difficulty (for questions)
Easy       → bg-green-50 text-green-700
Medium     → bg-yellow-50 text-yellow-700
Hard       → bg-red-50 text-red-700
```

### Spacing & Layout

```typescript
// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

// Card
<div className="bg-white border border-gray-200 rounded-lg p-6">

// Section spacing
<div className="space-y-6">

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

### Common Patterns

```typescript
// Hover effect
className="hover:shadow-md transition-shadow cursor-pointer"

// Active state
className={`${isActive ? 'bg-teal-500 text-white' : 'bg-white text-gray-700'}`}

// Responsive text
className="text-sm md:text-base lg:text-lg"

// Icon + Text
<div className="flex items-center gap-2">
  <Icon />
  <span>Text</span>
</div>
```

---

## 🔄 Workflow để implement Teacher/Student Dashboard

### Bước 1: Phân tích Design

- Xem hình ảnh design của Teacher/Student dashboard
- List ra các components cần thiết
- Xác định data structure

### Bước 2: Tạo Types

```bash
# Create types file
src/features/dashboard/types/teacher.ts
src/features/dashboard/types/student.ts
```

### Bước 3: Tạo Mock Data

```bash
# Create mock data
src/features/dashboard/data/mock-teacher.ts
src/features/dashboard/data/mock-student.ts
```

### Bước 4: Tạo Components

```bash
# Teacher components
src/features/dashboard/components/teacher/
├── TeacherOverviewView.tsx
├── TeacherStatsGrid.tsx
├── TeacherClassList.tsx
├── RecentActivityFeed.tsx
└── index.ts

# Student components
src/features/dashboard/components/student/
├── StudentOverviewView.tsx
├── StudentStatsGrid.tsx
├── MyClassesList.tsx
├── SubjectPerformance.tsx
└── index.ts
```

### Bước 5: Implement View Components

- Sử dụng pattern giống Admin Dashboard
- Reuse UI components có sẵn
- Follow design system

### Bước 6: Update Routing

- Update `page.tsx` để handle tab switching
- Test navigation flow

### Bước 7: Testing

- Test trên mobile, tablet, desktop
- Test role switching
- Test tab navigation

---

## 📚 API Integration (Future)

Khi Backend APIs sẵn sàng, thay thế mock data:

```typescript
// src/features/dashboard/services/teacher.service.ts
export const getTeacherDashboard = async (): Promise<TeacherDashboardData> => {
  const response = await fetch("/api/teacher/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// In component
import { getTeacherDashboard } from "@/features/dashboard/services/teacher.service";

const TeacherOverviewView = () => {
  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeacherDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;

  return <div>{/* Render with data */}</div>;
};
```

Hoặc dùng React Query:

```typescript
import { useQuery } from "@tanstack/react-query";

const TeacherOverviewView = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["teacher-dashboard"],
    queryFn: getTeacherDashboard,
  });

  // ...
};
```

---

## ✅ Checklist cho Developer

### Khi implement Teacher Dashboard:

- [ ] Tạo folder `src/features/dashboard/components/teacher/`
- [ ] Tạo types trong `src/features/dashboard/types/teacher.ts`
- [ ] Tạo mock data trong `src/features/dashboard/data/mock-teacher.ts`
- [ ] Implement `TeacherOverviewView.tsx` (default tab)
- [ ] Implement các tab views khác (classes, exams, students)
- [ ] Tạo index.ts để export components
- [ ] Update `page.tsx` - renderTeacherContent()
- [ ] Test navigation giữa các tabs
- [ ] Test responsive design
- [ ] Verify với design mockup

### Khi implement Student Dashboard:

- [ ] Tạo folder `src/features/dashboard/components/student/`
- [ ] Tạo types trong `src/features/dashboard/types/student.ts`
- [ ] Tạo mock data trong `src/features/dashboard/data/mock-student.ts`
- [ ] Implement `StudentOverviewView.tsx` (default tab)
- [ ] Implement các tab views khác (practice, contests, history)
- [ ] Add charts nếu cần (Recharts recommended)
- [ ] Tạo index.ts để export components
- [ ] Update `page.tsx` - renderStudentContent()
- [ ] Test navigation giữa các tabs
- [ ] Test responsive design
- [ ] Verify với design mockup

---

## 🚨 Important Notes

1. **KHÔNG thay đổi cấu trúc Context** - Sử dụng `useDashboard()` hook có sẵn
2. **LUÔN follow naming convention** - `[Role][Feature]View.tsx`
3. **SỬ DỤNG UI components có sẵn** - Không tạo duplicate components
4. **FOLLOW color scheme** - Dùng đúng màu sắc đã định nghĩa
5. **TEST trên nhiều screen sizes** - Mobile-first approach
6. **EXPORT qua index.ts** - Để imports clean hơn
7. **COMMENT TODO** - Nếu có feature chưa hoàn thành
8. **MOCK DATA trước** - Test UI trước khi integrate API

---

## 📞 Support

- **Tham khảo Admin implementation**: `src/features/dashboard/components/admin/`
- **UI Components**: `src/components/ui/`
- **API Documentation**: `frontend/API_ENDPOINTS.md`
- **Visual Guide**: `frontend/DASHBOARD_VISUAL_GUIDE.md`

---

## 🎯 Expected Deliverables

### Teacher Dashboard:

1. TeacherOverviewView với stats và recent activity
2. TeacherClassesView với danh sách lớp học
3. TeacherExamsView với quản lý đề thi
4. TeacherStudentsView với danh sách học sinh

### Student Dashboard:

1. StudentOverviewView với stats và charts
2. StudentPracticeView với đề luyện tập
3. StudentContestsView với danh sách contest
4. StudentHistoryView với lịch sử làm bài

---

**Happy Coding! 🚀**

_Last updated: December 11, 2025_
