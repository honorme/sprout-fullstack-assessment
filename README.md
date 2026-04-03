# Sprout Fullstack Assessment

Team Task Tracker: Express API, PostgreSQL, React (Vite), Mocha tests.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)

## Setup

1. Create the databases:

```bash
createdb sprout_tasks
createdb sprout_tasks_test
```

2. Copy `.env.example` to `.env` and set `DATABASE_URL` and `TEST_DATABASE_URL`.

3. Install dependencies:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

4. Run migrations:

```bash
npm run migrate --prefix backend
DATABASE_URL="$TEST_DATABASE_URL" npm run migrate --prefix backend
```

5. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` (default: `http://localhost:3000`).

## Running

```bash
npm run dev
```

API runs on port `3000`, frontend on `5173`. In dev the Vite proxy forwards `/tasks` to the API, so `VITE_API_URL` is optional locally.

## Tests

```bash
npm test
```

## API

| Method | Path | Notes |
|--------|------|-------|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | `title` (required), `description`, `status` (`todo`, `in_progress`, `done`) |
| PUT | `/tasks/:id` | `status` (required) |
| DELETE | `/tasks/:id` | Returns `204` |

## Docker

```bash
docker compose up -d
```

Starts Postgres with user/password `postgres`, database `sprout_tasks`, and creates `sprout_tasks_test` on first boot. Point your `.env` URLs at `postgresql://postgres:postgres@localhost:5432/<db>` and run migrations.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs migrations and `npm test` against a Postgres service container on every push.
