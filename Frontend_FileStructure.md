frontend/
├─ public/  
│ └─ # Static assets served directly (images, icons, fonts)
│
├─ src/
│ ├─ app/  
│ │ └─ # Next.js App Router: pages, layouts, routes, server components
│ │
│ ├─ components/  
│ │ └─ # Reusable UI components (buttons, inputs, layout components)
│ │
│ ├─ features/  
│ │ └─ # Domain-specific modules (Auth, User, Exam, Contest, etc.)
│ │
│ ├─ lib/  
│ │ └─ # Core utilities (http client, configs, constants)
│ │
│ ├─ services/  
│ │ └─ # API service layer calling backend endpoints
│ │
│ ├─ store/  
│ │ └─ # Global state management (Zustand/Redux)
│ │
│ ├─ styles/  
│ └─ # Global styles, Tailwind config overrides, theme
│
│ ├─ types/  
│ └─ # Global TypeScript types & interfaces
│
│ └─ utils/  
│ └─ # Helper functions shared across project
│
├─ .env.local # Environment variables (API URL, secrets)
├─ next.config.js # Next.js configuration
├─ package.json # Project dependencies and scripts
├─ tsconfig.json # TypeScript configuration
└─ README.md # Project documentation

Detailed Explanation:
GOPASS/
└─ frontend/
├─ .next/ # build output (gitignored)
├─ node_modules/
├─ public/ # static assets (images, svgs, favicon)
│ ├─ favicon.ico
│ └─ images/
├─ src/
│ ├─ app/ # Next.js App Router (routes + layouts)
│ │ ├─ layout.tsx # root layout (providers + global UI)
│ │ ├─ head.tsx # <head> meta
│ │ ├─ page.tsx # app root page (dashboard or landing)
│ │ ├─ loading.tsx
│ │ ├─ error.tsx
│ │ ├─ (auth)/ # route group hidden from URL (auth layout)
│ │ │ ├─ layout.tsx
│ │ │ └─ login/page.tsx
│ │ ├─ dashboard/
│ │ │ └─ page.tsx
│ │ ├─ classes/
│ │ │ ├─ page.tsx
│ │ │ └─ [id]/page.tsx
│ │ ├─ exams/
│ │ │ ├─ page.tsx
│ │ │ └─ [id]/page.tsx
│ │ ├─ submissions/
│ │ │ ├─ page.tsx
│ │ │ └─ [id]/page.tsx
│ │ ├─ grading/
│ │ │ └─ [submissionId]/page.tsx
│ │ ├─ contest/
│ │ │ ├─ page.tsx
│ │ │ └─ [id]/page.tsx
│ │ └─ admin/
│ │ └─ page.tsx
│ │
│ ├─ components/ # UI primitives & layout pieces
│ │ ├─ ui/ # tiny, reusable primitives
│ │ │ ├─ Button.tsx
│ │ │ ├─ Input.tsx
│ │ │ ├─ Modal.tsx
│ │ │ ├─ Table.tsx
│ │ │ └─ Pagination.tsx
│ │ ├─ layout/ # header, footer, sidebar
│ │ │ ├─ Header.tsx
│ │ │ ├─ Sidebar.tsx
│ │ │ └─ AppShell.tsx
│ │ └─ feature/ # commonly shared larger components
│ │ ├─ ClassCard.tsx
│ │ └─ ExamCard.tsx
│ │
│ ├─ features/ # domain folders (colocate code per feature)
│ │ ├─ auth/
│ │ │ ├─ components/ # LoginForm, RegisterForm, ForgotPassword
│ │ │ ├─ hooks.ts # useLogin, useRegister (feature hooks)
│ │ │ ├─ service.ts # AuthApi wrapper functions
│ │ │ └─ types.ts
│ │ ├─ user/
│ │ ├─ class/
│ │ ├─ exam/
│ │ ├─ submission/
│ │ ├─ grading/
│ │ ├─ contest/
│ │ └─ questionbank/
│ │
│ ├─ lib/ # low-level shared helpers
│ │ ├─ api.ts # central http client (axios/fetch wrapper)
│ │ ├─ http/ # infra & error handling
│ │ │ ├─ httpClient.ts
│ │ │ ├─ apiConfig.ts
│ │ │ └─ errorHandler.ts
│ │ └─ jwt.ts # token helpers (parse/refresh helpers)
│ │
│ ├─ services/ # API service layer (high-level)
│ │ ├─ auth.api.ts # AuthApi (login/logout/me)
│ │ ├─ user.api.ts
│ │ ├─ class.api.ts
│ │ ├─ exam.api.ts
│ │ ├─ submission.api.ts
│ │ ├─ grading.api.ts
│ │ ├─ contest.api.ts
│ │ └─ questionbank.api.ts
│ │
│ ├─ store/ # global state (zustand or redux)
│ │ ├─ index.ts
│ │ └─ authStore.ts
│ │
│ ├─ hooks/ # app-wide hooks
│ │ ├─ useAuth.ts
│ │ ├─ useFetch.ts
│ │ └─ useDebounce.ts
│ │
│ ├─ styles/ # global css / tailwind or css modules
│ │ ├─ globals.css
│ │ └─ tailwind.css
│ │
│ ├─ types/ # shared TypeScript types / domain models
│ │ ├─ domain.ts
│ │ └─ api.ts
│ │
│ ├─ constants/ # route names, roles, status codes, etc.
│ │ └─ routes.ts
│ │
│ ├─ utils/ # pure helper functions (formatters)
│ │ └─ date.ts
│ │
│ └─ tests/ # unit / integration tests
│ └─ **mocks**/
│
├─ .env.example
├─ .env.local # NEXT_PUBLIC_API_BASE_URL=...
├─ next.config.js
├─ tsconfig.json
├─ package.json
├─ README.md
└─ .eslintrc.js
