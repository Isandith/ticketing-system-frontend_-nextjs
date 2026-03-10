# Mini Task Management System - Frontend (Next.js)

This repository contains the frontend application for the Mini Task Management System assignment. The backend is implemented separately in Spring Boot and exposes JWT-protected REST APIs.

## Project Overview

The frontend is built with Next.js (App Router), TypeScript, Redux Toolkit, and Axios.

Implemented capabilities:
- User registration and login
- JWT-based authenticated API calls
- Role-aware dashboard behavior (`ADMIN` and `USER`)
- Task CRUD: create, read, update, delete
- Mark task as completed
- Filter tasks by status and priority
- Sort tasks by due date or priority
- Pagination support for task list
- Basic loading, error, and toast feedback states

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Redux Toolkit + React Redux
- Axios
- Tailwind CSS (utility styling)

## Environment Variables

Create `.env` in the frontend root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Required keys:
- `NEXT_PUBLIC_API_BASE_URL`: Base URL of the Spring Boot backend (for example `http://localhost:8080`)

Notes:
- `NEXT_PUBLIC_*` variables are exposed to the browser by Next.js.
- Backend secrets (JWT signing secret, DB credentials) must remain in backend environment configuration only.

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
# create .env manually and add NEXT_PUBLIC_API_BASE_URL
```

You can also use `.env.local` if preferred; both are supported by Next.js.

3. Start the development server:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev` - Run in development mode
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Frontend Pages

- `/login` - User authentication
- `/register` - User registration
- `/dashboard` - Task management dashboard (protected)

## Authentication and Authorization Flow

- On successful login, JWT token and user info are stored in local storage.
- Auth state is restored on app load before protected-route checks.
- Axios request interceptor injects stored token into outgoing requests.
- On `401` responses, local auth storage is cleared and user is redirected to `/login`.
- `ADMIN` users can access additional controls (user filtering and admin registration UI).

## Task Features Implemented

- Create task
- Edit task
- Delete task
- View paginated task list
- Mark as completed
- Filter by:
  - `status`: `TODO`, `IN_PROGRESS`, `DONE`
  - `priority`: `LOW`, `MEDIUM`, `HIGH`
- Sort by:
  - due date
  - priority
- Sort direction: ascending / descending
- Page size selection and previous/next pagination controls

## API Integration Notes

Axios client uses `NEXT_PUBLIC_API_BASE_URL` and calls backend endpoints under:
- `/api/v1/auth/*`
- `/api/v1/tasks/*`
- `/api/v1/users/*`

The frontend expects paginated task responses in Spring Data style:
- `content`
- `number`
- `size`
- `totalElements`
- `totalPages`

## Project Structure

```text
app/
  login/page.tsx
  register/page.tsx
  dashboard/page.tsx
components/
  auth/
  dashboard/
  ui/
lib/
  API_Folder/
  Interfaces/
  Services/
  storage.ts
  types.ts
store/
  slices/
  index.ts
  ReduxProvider.tsx
```

## Build/Commit Hygiene

Do not commit generated directories such as:
- `node_modules/`
- `.next/`

Keep environment files private unless intentionally sharing non-secret sample values.

## Assignment Coverage (Frontend)

Completed for frontend scope:
- Next.js frontend implementation
- Login and registration pages
- Task listing and task create/update/delete functionality
- Axios-based API integration
- State management and component organization
- Basic loading/error handling

Out of frontend scope (implemented in backend repository):
- Database schema and DB setup
- JWT signing/security internals
- Global exception handler and backend validation rules
- API documentation generation tools
