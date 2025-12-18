# 📁 GoPass Frontend - Cấu trúc & Hướng dẫn

## 🌳 Cấu trúc thư mục Frontend

```
frontend/
├── 📄 package.json                    # Dependencies và scripts của dự án
├── 📄 next.config.ts                  # Cấu hình Next.js
├── 📄 tsconfig.json                   # Cấu hình TypeScript
├── 📄 eslint.config.mjs               # Cấu hình ESLint
├── 📄 postcss.config.mjs              # Cấu hình PostCSS cho Tailwind
├── 📄 README.md                       # Tài liệu cơ bản
├── 📄 API_ENDPOINTS.md                # Tài liệu API endpoints
├── 📄 DEVELOPER_GUIDE_DASHBOARD.md    # Hướng dẫn phát triển dashboard
│
├── 📁 public/                         # Tài nguyên tĩnh
│   ├── 📁 images/
│   │   ├── student-learning.png       # Hình minh họa học sinh
│   │   └── teacher-teaching.png       # Hình minh họa giáo viên
│   ├── file.svg                       # Icons SVG
│   ├── globe.svg
│   ├── window.svg
│   ├── next.svg
│   └── vercel.svg
│
└── 📁 src/                            # Source code chính
    │
    ├── 📁 app/                        # Next.js App Router (routing & pages)
    │   ├── 📄 page.tsx                # Trang chủ landing page
    │   ├── 📄 layout.tsx              # Root layout cho toàn app
    │   ├── 📄 globals.css             # CSS global cho toàn ứng dụng
    │   ├── 📄 favicon.ico             # Icon website
    │   │
    │   ├── 📁 login/
    │   │   └── 📄 page.tsx            # Trang đăng nhập
    │   │
    │   ├── 📁 register/
    │   │   └── 📄 page.tsx            # Trang đăng ký
    │   │
    │   └── 📁 (protected)/            # Protected routes (cần xác thực)
    │       └── 📁 dashboard/          # Dashboard chính
    │           ├── 📄 page.tsx        # Trang dashboard chính (router logic)
    │           ├── 📄 layout.tsx      # Layout cho dashboard (header + nav)
    │           ├── 📄 loading.tsx     # Loading state
    │           └── 📁 classes/
    │               └── 📁 [classId]/
    │                   └── 📄 page.tsx # Trang chi tiết lớp học
    │
    ├── 📁 components/                 # UI Components tái sử dụng
    │   │
    │   ├── 📁 ui/                     # Basic UI components
    │   │   ├── 📄 Badge.tsx           # Component hiển thị badge/tag
    │   │   ├── 📄 Button.tsx          # Component nút bấm
    │   │   ├── 📄 Dropdown.tsx        # Component dropdown menu
    │   │   ├── 📄 Input.tsx           # Component input form
    │   │   ├── 📄 SectionHeader.tsx   # Component header cho sections
    │   │   ├── 📄 StatCard.tsx        # Component thẻ thống kê
    │   │   ├── 📄 Tabs.tsx            # Component tabs
    │   │   └── 📄 index.ts            # Export barrel file
    │   │
    │   ├── 📁 layout/                 # Layout components
    │   │   ├── 📄 Header.tsx          # Header cho landing page
    │   │   ├── 📄 Footer.tsx          # Footer cho landing page
    │   │   ├── 📄 DashboardHeader.tsx # Header cho dashboard (user info)
    │   │   └── 📄 DashboardNavigation.tsx # Navigation bar dashboard
    │   │
    │   └── 📁 landing/                # Components cho landing page
    │       ├── 📄 Hero.tsx            # Hero section (banner chính)
    │       ├── 📄 Features.tsx        # Features overview
    │       ├── 📄 MainFeatures.tsx    # Main features chi tiết
    │       ├── 📄 AIFeatures.tsx      # AI features section
    │       ├── 📄 TeacherTools.tsx    # Teacher tools section
    │       ├── 📄 Leaderboard.tsx     # Leaderboard display
    │       ├── 📄 Testimonials.tsx    # Testimonials/reviews
    │       └── 📄 CTA.tsx             # Call-to-action section
    │
    ├── 📁 features/                   # Feature modules (business logic)
    │   │
    │   ├── 📁 auth/                   # Authentication feature
    │   │   └── 📄 hooks.ts            # Custom hooks cho authentication
    │   │
    │   └── 📁 dashboard/              # Dashboard feature
    │       │
    │       ├── 📁 components/         # Dashboard specific components
    │       │   │
    │       │   ├── 📁 student/        # Student role components
    │       │   │   ├── 📄 index.ts
    │       │   │   │
    │       │   │   ├── 📁 overview/   # Student Overview tab
    │       │   │   │   ├── 📄 StudentDashboardView.tsx      # Main view (container)
    │       │   │   │   ├── 📄 StudentStatsGrid.tsx          # Grid 4 thẻ thống kê
    │       │   │   │   ├── 📄 MyClassesWidget.tsx           # Widget danh sách lớp
    │       │   │   │   ├── 📄 ActivityChartWidget.tsx       # Biểu đồ hoạt động
    │       │   │   │   ├── 📄 PerformanceChart.tsx          # Biểu đồ hiệu suất
    │       │   │   │   └── 📄 SubjectPerformanceWidget.tsx  # Widget môn học
    │       │   │   │
    │       │   │   ├── 📁 class/      # Student Class Detail
    │       │   │   │   ├── 📄 StudentClassDetailView.tsx    # Chi tiết lớp học
    │       │   │   │   └── 📄 ClassAssignmentItem.tsx       # Item bài tập
    │       │   │   │
    │       │   │   ├── 📁 contest/    # Student Contests
    │       │   │   │   ├── 📄 StudentContestsView.tsx       # Danh sách contest
    │       │   │   │   └── 📄 ContestCard.tsx               # Card hiển thị contest
    │       │   │   │
    │       │   │   ├── 📁 practice/   # Student Practice
    │       │   │   │   ├── 📄 StudentPracticeView.tsx       # Trang luyện tập
    │       │   │   │   └── 📄 PracticeExamCard.tsx          # Card đề luyện tập
    │       │   │   │
    │       │   │   └── 📁 history/    # Student History
    │       │   │       ├── 📄 StudentHistoryView.tsx        # Lịch sử làm bài
    │       │   │       ├── 📄 HistoryStatsOverview.tsx      # Tổng quan thống kê
    │       │   │       └── 📄 HistoryItemCard.tsx           # Card lịch sử
    │       │   │
    │       │   ├── 📁 teacher/        # Teacher role components
    │       │   │   ├── 📄 index.ts
    │       │   │   ├── 📄 TeacherOverviewView.tsx   # Overview teacher
    │       │   │   ├── 📄 TeacherStatsGrid.tsx      # Stats grid teacher
    │       │   │   ├── 📄 TeacherClassList.tsx      # Danh sách lớp của GV
    │       │   │   └── 📄 RecentActivityFeed.tsx    # Feed hoạt động gần đây
    │       │   │
    │       │   ├── 📁 admin/          # Admin role components
    │       │   │   ├── 📄 index.ts
    │       │   │   ├── 📄 AdminDashboardView.tsx    # Dashboard admin
    │       │   │   ├── 📄 AdminStatsGrid.tsx        # Stats grid admin
    │       │   │   ├── 📄 AdminActionToolbar.tsx    # Thanh công cụ admin
    │       │   │   └── 📄 ExamManagementTable.tsx   # Bảng quản lý đề thi
    │       │   │
    │       │   ├── 📁 contest/        # Contest management
    │       │   │   ├── 📄 index.ts
    │       │   │   ├── 📄 CreateContestView.tsx     # Tạo contest mới
    │       │   │   ├── 📄 ContestPreview.tsx        # Xem trước contest
    │       │   │   └── 📄 SubjectSelector.tsx       # Chọn môn học
    │       │   │
    │       │   └── 📁 questionbank/   # Question bank management
    │       │       ├── 📄 index.ts
    │       │       ├── 📄 QuestionBankView.tsx      # Ngân hàng câu hỏi
    │       │       ├── 📄 QuestionTopicList.tsx     # Danh sách topics
    │       │       └── 📄 SubjectTabs.tsx           # Tabs môn học
    │       │
    │       ├── 📁 context/            # React Context
    │       │   └── 📄 DashboardContext.tsx  # Context quản lý state dashboard
    │       │
    │       ├── 📁 data/               # Mock data cho development
    │       │   ├── 📄 mock-admin.ts           # Data mẫu admin
    │       │   ├── 📄 mock-student.ts         # Data mẫu student
    │       │   ├── 📄 mock-teacher.ts         # Data mẫu teacher
    │       │   ├── 📄 mock-my-classes.ts      # Data lớp học
    │       │   ├── 📄 mock-class-details.ts   # Chi tiết lớp
    │       │   ├── 📄 mock-contests.ts        # Data contests
    │       │   ├── 📄 mock-practice-exams.ts  # Đề luyện tập
    │       │   ├── 📄 mock-history.ts         # Lịch sử
    │       │   └── 📄 mock-questionbank.ts    # Ngân hàng câu hỏi
    │       │
    │       └── 📁 types/              # TypeScript types
    │           ├── 📄 index.ts                # Export types chính
    │           ├── 📄 student.ts              # Types cho student
    │           ├── 📄 teacher.ts              # Types cho teacher
    │           ├── 📄 class.ts                # Types cho class
    │           ├── 📄 contest.ts              # Types cho contest
    │           └── 📄 questionbank.ts         # Types cho question bank
    │
    ├── 📁 services/                   # API services
    │   └── 📄 example.txt             # Placeholder (sẽ chứa API calls)
    │
    ├── 📁 lib/                        # Utilities & helpers
    │   └── 📄 example.txt             # Placeholder
    │
    ├── 📁 store/                      # State management (Redux/Zustand)
    │   └── 📄 example.txt             # Placeholder
    │
    ├── 📁 types/                      # Global TypeScript types
    │   └── 📄 example.txt             # Placeholder
    │
    ├── 📁 utils/                      # Utility functions
    │   ├── 📄 example.txt
    │   └── 📄 role-helpers.ts         # Helper functions cho roles
    │
    └── 📁 styles/                     # Additional styles
        └── 📄 example.txt             # Placeholder
```

---

## 📝 Mô tả chi tiết các file quan trọng

### 🎯 App Router (`src/app/`)

| File                               | Chức năng                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------- |
| `page.tsx`                         | **Landing page chính** - Hiển thị trang giới thiệu với Hero, Features, Testimonials |
| `layout.tsx`                       | **Root layout** - Wrap toàn bộ app, setup font, metadata                            |
| `globals.css`                      | **Global styles** - Tailwind directives và custom CSS                               |
| `login/page.tsx`                   | **Trang đăng nhập** - Form login cho users                                          |
| `register/page.tsx`                | **Trang đăng ký** - Form register tài khoản mới                                     |
| `(protected)/dashboard/page.tsx`   | **Dashboard router** - Logic điều hướng theo role (admin/teacher/student) và tab    |
| `(protected)/dashboard/layout.tsx` | **Dashboard layout** - Header + Navigation + Main content area                      |

### 🧩 UI Components (`src/components/`)

#### Basic UI (`components/ui/`)

| Component           | Chức năng                                       |
| ------------------- | ----------------------------------------------- |
| `Badge.tsx`         | Hiển thị badge/tag (status, category)           |
| `Button.tsx`        | Nút bấm với variants (primary, secondary, etc.) |
| `Dropdown.tsx`      | Menu dropdown                                   |
| `Input.tsx`         | Input field với validation                      |
| `StatCard.tsx`      | **Thẻ thống kê** với icon, số liệu, màu sắc     |
| `Tabs.tsx`          | Tab navigation component                        |
| `SectionHeader.tsx` | Header cho các sections                         |

#### Layout Components (`components/layout/`)

| Component                 | Chức năng                                                                    |
| ------------------------- | ---------------------------------------------------------------------------- |
| `Header.tsx`              | Header landing page với logo, navigation                                     |
| `Footer.tsx`              | Footer landing page với links                                                |
| `DashboardHeader.tsx`     | **Header dashboard** - Hiển thị user info, notifications, logout             |
| `DashboardNavigation.tsx` | **Navigation tabs** - Tabs theo role (Overview, Practice, Contests, History) |

### 🎓 Student Dashboard (`features/dashboard/components/student/`)

#### Overview Tab

| Component                      | Chức năng                                                              |
| ------------------------------ | ---------------------------------------------------------------------- |
| `StudentDashboardView.tsx`     | **Container chính** - Layout tổng thể overview dashboard               |
| `StudentStatsGrid.tsx`         | **Grid 4 thẻ thống kê**: Exams Completed, Avg Score, Classes, Contests |
| `MyClassesWidget.tsx`          | **Widget lớp học** - Danh sách các lớp đang tham gia                   |
| `ActivityChartWidget.tsx`      | **Biểu đồ hoạt động** - Chart performance theo thời gian               |
| `PerformanceChart.tsx`         | Biểu đồ hiệu suất chi tiết                                             |
| `SubjectPerformanceWidget.tsx` | **Widget môn học** - Performance theo từng môn                         |

#### Practice Tab

| Component                 | Chức năng                          |
| ------------------------- | ---------------------------------- |
| `StudentPracticeView.tsx` | Trang luyện tập với các đề thi mẫu |
| `PracticeExamCard.tsx`    | Card hiển thị từng đề luyện tập    |

#### Contests Tab

| Component                 | Chức năng                       |
| ------------------------- | ------------------------------- |
| `StudentContestsView.tsx` | Danh sách các contest available |
| `ContestCard.tsx`         | Card hiển thị thông tin contest |

#### History Tab

| Component                  | Chức năng                       |
| -------------------------- | ------------------------------- |
| `StudentHistoryView.tsx`   | Lịch sử các bài thi đã làm      |
| `HistoryStatsOverview.tsx` | Tổng quan thống kê lịch sử      |
| `HistoryItemCard.tsx`      | Card từng bài thi trong lịch sử |

#### Class Detail

| Component                    | Chức năng                              |
| ---------------------------- | -------------------------------------- |
| `StudentClassDetailView.tsx` | Chi tiết lớp học, assignments, members |
| `ClassAssignmentItem.tsx`    | Item hiển thị bài tập trong lớp        |

### 👨‍🏫 Teacher Dashboard (`features/dashboard/components/teacher/`)

| Component                 | Chức năng                                                     |
| ------------------------- | ------------------------------------------------------------- |
| `TeacherOverviewView.tsx` | Dashboard tổng quan cho giáo viên                             |
| `TeacherStatsGrid.tsx`    | Stats: Total Students, Active Classes, Assignments, Avg Score |
| `TeacherClassList.tsx`    | Danh sách lớp học của giáo viên                               |
| `RecentActivityFeed.tsx`  | Feed hoạt động gần đây của học sinh                           |

### 👨‍💼 Admin Dashboard (`features/dashboard/components/admin/`)

| Component                 | Chức năng                                                 |
| ------------------------- | --------------------------------------------------------- |
| `AdminDashboardView.tsx`  | Dashboard quản trị viên                                   |
| `AdminStatsGrid.tsx`      | Stats: Total Users, Active Exams, Questions, System Usage |
| `AdminActionToolbar.tsx`  | Thanh công cụ với các actions admin                       |
| `ExamManagementTable.tsx` | Bảng quản lý các đề thi                                   |

### 🎯 Other Features

#### Contest Management (`features/dashboard/components/contest/`)

| Component               | Chức năng                          |
| ----------------------- | ---------------------------------- |
| `CreateContestView.tsx` | Form tạo contest mới               |
| `ContestPreview.tsx`    | Preview contest trước khi publish  |
| `SubjectSelector.tsx`   | Component chọn môn học cho contest |

#### Question Bank (`features/dashboard/components/questionbank/`)

| Component               | Chức năng                   |
| ----------------------- | --------------------------- |
| `QuestionBankView.tsx`  | Giao diện ngân hàng câu hỏi |
| `QuestionTopicList.tsx` | Danh sách topics/chủ đề     |
| `SubjectTabs.tsx`       | Tabs lọc theo môn học       |

### 🔧 Context & State (`features/dashboard/`)

| File                           | Chức năng                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| `context/DashboardContext.tsx` | **Context quản lý state** - activeTab, userRole, userName                                |
| `data/mock-*.ts`               | **Mock data** - Dữ liệu mẫu cho development (student, teacher, admin, classes, contests) |
| `types/*.ts`                   | **TypeScript types** - Interface definitions cho student, teacher, class, contest        |

---

## 🚀 Hướng dẫn chạy Frontend

### 1. Cài đặt Dependencies

```bash
cd frontend
npm install
```

### 2. Chạy Development Server

```bash
npm run dev
```

Server sẽ chạy tại: **http://localhost:3000**

### 3. Truy cập các trang

| URL                               | Mô tả                             |
| --------------------------------- | --------------------------------- |
| `http://localhost:3000`           | Landing page                      |
| `http://localhost:3000/login`     | Trang đăng nhập                   |
| `http://localhost:3000/register`  | Trang đăng ký                     |
| `http://localhost:3000/dashboard` | Dashboard (student/teacher/admin) |

---

## 👨‍🎓 Hướng dẫn xem Student Dashboard

### Bước 1: Khởi động Frontend

```bash
cd frontend
npm run dev
```

### Bước 2: Truy cập Dashboard

Mở browser và truy cập: **http://localhost:3000/dashboard**

### Bước 3: Thay đổi Role thành Student

Vì hiện tại đang dùng mock data, bạn cần chỉnh sửa role trong code:

**File:** `frontend/src/features/dashboard/context/DashboardContext.tsx`

```tsx
// Tìm dòng này (khoảng line 36):
const [userRole] = useState<UserRole>("student"); // ✅ Đã là "student"

// Nếu đang là "admin" hoặc "teacher", đổi thành "student"
```

### Bước 4: Xem các tab khác nhau

Dashboard Student có 4 tabs chính:

1. **Overview** (Mặc định)

   - URL: `http://localhost:3000/dashboard`
   - Tab: "Overview"
   - Hiển thị: Stats cards, My Classes, Performance charts

2. **Practice**

   - Click tab "Practice" trên navigation
   - Hiển thị: Danh sách đề thi luyện tập

3. **Contests**

   - Click tab "Contests"
   - Hiển thị: Các cuộc thi có thể tham gia

4. **History**
   - Click tab "History"
   - Hiển thị: Lịch sử các bài thi đã làm

### Bước 5: Xem chi tiết lớp học

Từ Overview tab → Click vào một class card trong "My Classes" → Chuyển đến trang chi tiết lớp học

URL: `http://localhost:3000/dashboard/classes/[classId]`

---

## 🎨 Các thành phần trên Student Dashboard Overview

### Top Section: Stats Grid (4 thẻ)

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Exams       │ Average     │ Classes     │ Contests    │
│ Completed   │ Score       │ Joined      │ Entered     │
│ 42 (Teal)   │ 87.5 (Green)│ 6 (Blue)    │ 8 (Pink)    │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Middle Section: My Classes (Full width)

```
┌──────────────────────────────────────────────────────────┐
│ My Classes                                         [View]│
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ Math 101 │ │ Physics  │ │ Chem     │ │ English  │   │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└──────────────────────────────────────────────────────────┘
```

### Bottom Section: Charts (Split 50/50)

```
┌────────────────────────────┬────────────────────────────┐
│ Activity Chart             │ Subject Performance        │
│ (Line chart)               │ (Bar chart/Progress bars)  │
│                            │                            │
└────────────────────────────┴────────────────────────────┘
```

---

## 🔑 Key Features của Student Dashboard

### 📊 Overview Tab

- ✅ 4 thẻ thống kê với màu sắc riêng biệt
- ✅ Widget danh sách lớp học
- ✅ Biểu đồ hoạt động theo thời gian
- ✅ Biểu đồ performance theo môn học

### 📝 Practice Tab

- ✅ Danh sách đề thi luyện tập
- ✅ Filter theo môn học, độ khó
- ✅ Start practice exam

### 🏆 Contests Tab

- ✅ Danh sách contests available
- ✅ Thông tin contest (time, participants)
- ✅ Join contest

### 📜 History Tab

- ✅ Lịch sử bài thi đã làm
- ✅ Điểm số, thời gian làm bài
- ✅ Review answers

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts
- **State Management:** React Context (có thể mở rộng với Redux/Zustand)
- **UI Components:** Custom components với Tailwind

---

## 📚 Tài liệu tham khảo

- `API_ENDPOINTS.md` - Danh sách API endpoints
- `DEVELOPER_GUIDE_DASHBOARD.md` - Hướng dẫn phát triển dashboard
- `README.md` - Thông tin cơ bản Next.js

---

## 🐛 Troubleshooting

### Lỗi: "Module not found"

```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

### Port 3000 đã được sử dụng

```bash
# Chạy trên port khác
npm run dev -- -p 3001
```

### Thay đổi role để test

Chỉnh sửa file: `frontend/src/features/dashboard/context/DashboardContext.tsx`

```tsx
const [userRole] = useState<UserRole>("student"); // "admin", "teacher", or "student"
```

---

## 📞 Liên hệ & Hỗ trợ

Nếu có vấn đề, vui lòng tham khảo:

1. `DEVELOPER_GUIDE_DASHBOARD.md` trong folder frontend
2. Next.js Documentation: https://nextjs.org/docs

---

**🎉 Happy Coding! 🚀**
