<div align="center">

# ai-learning-companion

### Your next learning step, chosen around your goals.

An AI-powered learning companion that turns a career or study goal into a structured roadmap, tracks your progress, and suggests what to learn or revisit next.

[Getting Started](#getting-started) · [Features](#what-you-can-do) · [Architecture](#how-it-works) · [API](#api-overview)

![React](https://img.shields.io/badge/React-18-149eca?logo=react&logoColor=white)
![Express](https://img.shields.io/badge/API-Express-333333?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169e1?logo=postgresql&logoColor=white)
![AI](https://img.shields.io/badge/AI-OpenAI%20or%20built--in%20fallback-e06a2e)

</div>

---

## What it does

PathLift helps learners turn a broad goal such as **“Become a Full Stack Developer”** or **“Learn Machine Learning”** into a practical sequence of topics. As you study, you can update topic status, record notes, and rate your confidence. Recommendations use that progress to suggest next topics, practice projects, resources, and revision areas.

The app works without an AI key using curated learning paths and rule-based suggestions. Add an OpenAI key to enable AI-generated paths and coaching.

## What you can do

- Create an account and save your learning profile, interests, experience level, and weekly study target.
- Define a learning goal and generate an ordered roadmap.
- Track pending, in-progress, and completed topics, plus confidence scores and notes.
- See completion, topic counts, and study streaks on the dashboard.
- Generate personalized next-step recommendations, practice ideas, learning resources, and revision suggestions.
- Keep roadmap and recommendation data in PostgreSQL.

## Product journey

![PathLift learning journey](docs/assets/learning-journey.svg)

## How it works

![PathLift system architecture](docs/assets/architecture.svg)

The React client calls the Express API. The API stores profiles, goals, roadmap topics, progress, and recommendation snapshots in PostgreSQL. When configured, the AI service calls OpenAI; otherwise, curated topic blueprints and local recommendation logic keep the core flow usable.

## Database model

![PathLift database relationships](docs/assets/data-model.svg)

The full SQL definition is in [`server/sql/schema.sql`](server/sql/schema.sql). It creates `users`, `learning_goals`, `topics`, `user_progress`, and `recommendations`, including the main foreign keys and indexes.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, React Router, plain CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL 16, `pg` connection pool |
| Authentication | JWT, bcrypt password hashing |
| AI | OpenAI API with curated local fallback |
| Local database | Docker Compose |

## Getting started

### Requirements

- Node.js 20 or newer
- npm
- Docker Desktop with Docker Compose, or a PostgreSQL server you configure yourself

### 1. Install dependencies

Run these commands from the repository root:

```powershell
npm.cmd install
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

On macOS or Linux, use `npm install` and `cp server/.env.example server/.env` / `cp client/.env.example client/.env`.

### 2. Start PostgreSQL

Start Docker Desktop, then run:

```powershell
docker compose up -d postgres
```

The Compose service maps PostgreSQL to **localhost:5433** so it can coexist with a local PostgreSQL service using the default port `5432`. The database name and local credentials are `personalized_learning` / `postgres` / `postgres`.

### 3. Create the tables

PowerShell:

```powershell
Get-Content server\sql\schema.sql | docker exec -i personalized-learning-db psql -U postgres -d personalized_learning
```

macOS/Linux:

```bash
docker exec -i personalized-learning-db psql -U postgres -d personalized_learning < server/sql/schema.sql
```

The schema uses `IF NOT EXISTS`, so it is safe to apply again to this local development database.

### 4. Configure the server

`server/.env` is prefilled from the example. For local Docker, it should contain:

```dotenv
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/personalized_learning
JWT_SECRET=replace-this-with-a-long-random-secret
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

Set `OPENAI_API_KEY` to enable OpenAI-generated roadmaps and recommendations. Leave it empty to use the local fallback. Keep `.env` files private and never commit API keys or production credentials.

The client example uses `http://localhost:5000/api`. Change `VITE_API_BASE_URL` in `client/.env` if your API runs elsewhere.

### 5. Run the app

From the repository root:

```powershell
npm.cmd run dev
```

This starts both the API and Vite development server. Open **http://localhost:5173**. The API health endpoint is **http://localhost:5000/api/health**.

Create an account, choose interests, enter a goal, and save the onboarding form to generate your first roadmap. Existing users can log in and update their goal from the Goals page.

### Useful commands

```powershell
npm.cmd run dev:client
npm.cmd run dev:server
npm.cmd run build
docker compose down
```

`docker compose down` stops the local database container but keeps its named volume and data. To remove that database volume too, use `docker compose down -v` only when you intend to erase local database data.

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `PORT` | `server/.env` | Express port; defaults to `5000` |
| `DATABASE_URL` | `server/.env` | PostgreSQL connection string |
| `JWT_SECRET` | `server/.env` | Signs authentication tokens; use a private random value |
| `CLIENT_URL` | `server/.env` | Allowed frontend origins, comma-separated |
| `OPENAI_API_KEY` | `server/.env` | Optional key for OpenAI features |
| `OPENAI_MODEL` | `server/.env` | Model name used by the AI service |
| `VITE_API_BASE_URL` | `client/.env` | API base URL used by the browser |

## API overview

Authenticated routes require `Authorization: Bearer <token>` unless marked public.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Public API health check |
| `POST` | `/api/auth/signup` | Create an account and return a token |
| `POST` | `/api/auth/login` | Sign in and return a token |
| `GET` | `/api/auth/me` | Return the signed-in user |
| `GET`, `PUT` | `/api/profile` | Read or update profile details |
| `GET`, `POST` | `/api/goals` | List or create learning goals |
| `GET` | `/api/learning-path` | Read a goal's roadmap |
| `POST` | `/api/learning-path/generate` | Generate or retrieve a roadmap |
| `GET` | `/api/progress` | Read topic progress and summary |
| `PATCH` | `/api/progress/:topicId` | Update topic status, confidence, and notes |
| `GET` | `/api/dashboard` | Read dashboard summary and latest recommendation |
| `GET` | `/api/recommendations/latest` | Read the latest recommendation snapshot |
| `GET` | `/api/recommendations/insights` | Read recommendation insights |
| `POST` | `/api/recommendations/generate` | Generate and save new recommendations |

## Project layout

```text
client/
  src/api/             Browser API client
  src/components/      Shared UI components
  src/context/         Authentication state
  src/pages/           Landing, auth, onboarding, dashboard, progress, AI coach
  src/styles/          Responsive visual system
server/
  sql/schema.sql       PostgreSQL schema
  src/controllers/     Request handlers
  src/routes/          Express route definitions
  src/services/        Learning, database, and AI logic
docs/
  assets/              README diagrams (SVG)
  system-design.md     Detailed architecture, prompts, and wireframes
```

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Browser shows “Failed to fetch” | Confirm the server is running on port `5000`, the page uses port `5173`, and `CLIENT_URL` includes the browser origin. Restart the server after changing `server/.env`. |
| Database connection refused | Confirm Docker Desktop is running, then run `docker compose up -d postgres` and check that port `5433` is available. |
| Relation/table does not exist | Apply `server/sql/schema.sql` using the command above. |
| OpenAI suggestions are unavailable | Confirm `OPENAI_API_KEY` is set in `server/.env` and restart the server. The local fallback works without it. |
| `npm` is blocked in Windows PowerShell | Use `npm.cmd` in place of `npm`. |

## Design documentation

See [`docs/system-design.md`](docs/system-design.md) for the detailed architecture, entity relationships, route list, React component map, example AI prompts, and text wireframes.

## Current scope

This is a development-focused MVP. It includes the main learning workflow and local Docker database setup. Before deploying publicly, configure a strong JWT secret, secure and rotate API credentials, add production-grade request validation and rate limiting, and use a managed database with production backups.
