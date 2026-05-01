# Full-Stack Task Manager (Angular + Express + MongoDB)

Production-ready full-stack task manager with clean architecture:

- Frontend: Angular 21 (standalone components)
- Backend: Node.js + Express (MVC)
- Database: MongoDB with Mongoose

## Quick Start (Single Command)

From project root:

```bash
npm install
npm run install:all
```

Create `backend/.env` from `backend/.env.example`, set `MONGODB_URI`, then run:

```bash
npm run dev
```

This starts:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:4200`

## Folder Structure

```text
Ethara ai assignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── env.js
│   │   │   └── loadEnv.js
│   │   ├── controllers/
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── notFound.js
│   │   ├── models/
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   └── taskRoutes.js
│   │   ├── utils/
│   │   │   ├── AppError.js
│   │   │   └── asyncHandler.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   └── task-manager/
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/
│       │   │   │   ├── task-form/
│       │   │   │   ├── task-item/
│       │   │   │   └── task-list/
│       │   │   ├── models/task.model.ts
│       │   │   ├── services/task.service.ts
│       │   │   ├── app.config.ts
│       │   │   ├── app.css
│       │   │   ├── app.html
│       │   │   └── app.ts
│       │   ├── environments/
│       │   │   ├── environment.ts
│       │   │   └── environment.prod.ts
│       │   ├── index.html
│       │   ├── main.ts
│       │   └── styles.css
│       ├── proxy.conf.json
│       ├── angular.json
│       └── package.json
└── README.md
```

## Backend Setup

1. Open terminal in `backend`:

   ```bash
   cd backend
   npm install
   ```

2. Create env file:

   - Copy `.env.example` to `.env`
   - Update:
     - `MONGODB_URI`
     - `PORT` (optional)
     - `CORS_ORIGIN` (optional, comma-separated)

3. Run backend:

   ```bash
   npm run dev
   ```

4. Health check:

   - `GET http://localhost:5000/health`

## Frontend Setup

1. Open new terminal in `frontend/task-manager`:

   ```bash
   cd frontend/task-manager
   npm install
   ```

2. Start frontend:

   ```bash
   npm start
   ```

3. Open:

   - `http://localhost:4200`

## API Endpoints

Base URL: `/api/tasks`

- `POST /api/tasks` - Create task
- `GET /api/tasks` - List all tasks
- `GET /api/tasks?status=pending|completed` - Filter tasks
- `PUT /api/tasks/:id` - Update task (title/description/status)
- `DELETE /api/tasks/:id` - Delete task

## Deployment Notes

- Frontend uses `apiBaseUrl: '/api'` in environment config (no hardcoded host).
- Local development uses `proxy.conf.json` to forward `/api` to backend.
- To serve frontend from backend in production, set:
  - `SERVE_STATIC=true` in backend `.env`
  - Build frontend first: `npm run build` inside `frontend/task-manager`
- Backend includes security middleware (`helmet`), CORS, centralized error handling, and modular MVC structure.

