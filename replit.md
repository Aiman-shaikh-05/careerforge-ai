# CareerForge AI — Workspace

## Overview

CareerForge AI is a production-style full-stack web application — an AI-powered career copilot for students. It helps students with resume review, project suggestions, roadmap generation, skill-gap analysis, mock interview questions, and job role recommendations.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + TypeScript + Tailwind CSS (artifacts/careerforge)
- **Backend**: Express 5 + TypeScript (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT-based (bcryptjs + jsonwebtoken)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
workspace/
├── artifacts/
│   ├── api-server/         # Express API server
│   │   ├── src/
│   │   │   ├── lib/auth.ts         # JWT signing/verification, requireAuth middleware
│   │   │   ├── routes/             # auth, profile, resume, projects, roadmap, jobs, interview
│   │   │   └── services/ai.ts      # Mock AI service (resume analysis, recommendations, etc.)
│   │   └── uploads/                # Local resume file storage (S3-ready)
│   └── careerforge/        # React frontend
│       └── src/
│           ├── context/AuthContext.tsx
│           ├── components/layout/   # Sidebar, DashboardLayout
│           ├── pages/               # login, register, dashboard, profile, resume, projects, roadmap, jobs, interview
│           └── index.css            # Design tokens (HSL variables)
├── lib/
│   ├── api-spec/openapi.yaml        # Full OpenAPI 3.1 spec for all modules
│   ├── api-client-react/            # Generated React Query hooks
│   ├── api-zod/                     # Generated Zod schemas
│   └── db/src/schema/               # users, profiles, resumes, recommendations
└── scripts/
```

## Modules

1. **Auth** — Student signup/login with JWT, protected routes
2. **Student Profile** — Full profile with skills, interests, target role, completion %
3. **Dashboard** — Welcome card, profile completion, quick actions
4. **Resume Upload & Analysis** — PDF upload, mock AI feedback (ATS score, strengths, improvements)
5. **Project Recommendations** — Personalized projects based on skills/interests/target role
6. **Roadmap Generator** — Step-by-step learning milestones (beginner → advanced)
7. **Job Role Recommendations** — Match % scores for AI Engineer, ML Engineer, etc.
8. **Mock Interview** — Technical, HR, and project-based questions

## Environment Variables

- `DATABASE_URL` — Auto-provided by Replit
- `JWT_SECRET` — Set in production (defaults to dev secret)
- `PORT` — Auto-provided by Replit

## Database

Tables: `users`, `student_profiles`, `resumes`, `resume_feedback`, `recommended_projects`, `roadmaps`, `role_recommendations`, `mock_interview_sessions`

Run migrations: `pnpm --filter @workspace/db run push`

## Run Locally

```bash
pnpm install
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/careerforge run dev
```

## AI Architecture

Currently uses mock service functions in `artifacts/api-server/src/services/ai.ts`. To connect real AI:
- Replace `generateResumeFeedback()` with OpenAI/Anthropic API call
- Replace `generateProjectRecommendations()`, `generateRoadmap()`, etc.
- Add `OPENAI_API_KEY` to environment variables

## File Storage

Resume PDFs are stored in `artifacts/api-server/uploads/`. To move to AWS S3:
- Replace `multer.diskStorage` with `multer-s3`
- Add `AWS_BUCKET_NAME`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` env vars
