# Sprout Fullstack Assessment

Team Task Tracker: Express API, PostgreSQL, React (Vite), Mocha tests.

## Prerequisites

- Node.js 18 or newer
- PostgreSQL 14 or newer (or Docker with Compose)

## Setup

The **project root** is the directory that contains `backend`, `frontend`, `package.json`, and `README.md`. Run every command below from that directory. Do not use a placeholder path: after you clone, `cd` into the folder Git created (whatever you named it).

1. Clone the repo and `cd` into it.

2. Create two empty databases if you do not have them yet (names can match your URLs in the next step). If Postgres says they already exist, skip this step.

```bash
createdb sprout_tasks 2>/dev/null || true
createdb sprout_tasks_test 2>/dev/null || true
```

3. Copy `.env.example` to `.env`. Set `DATABASE_URL` and `TEST_DATABASE_URL` to those two databases.

4. Install dependencies:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

5. Apply the schema to both databases:

```bash
npm run migrate --prefix backend
DATABASE_URL="$TEST_DATABASE_URL" npm run migrate --prefix backend
```

6. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` to the API base URL (default `http://localhost:3000`).

## Run the app

From the project root, start the API and the web app together:

```bash
npm run dev
```

API default port is `3000`, Vite may use `5173` or another port if that one is busy. Set `PORT` in `.env` if you change the API port.

In dev, if you do **not** set `VITE_API_URL` in `frontend/.env`, the Vite dev server proxies `/tasks` to `http://localhost:3000` (override with `VITE_API_PROXY_TARGET` if the API is elsewhere). If you **do** set `VITE_API_URL`, the browser calls that URL directly, so it must be the API base (not the Vite URL).

To run only one part:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

## Tests

With `TEST_DATABASE_URL` set in `.env` (and schema applied to that database):

```bash
npm test
```

## API

| Method | Path | Notes |
|--------|------|--------|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Body: `title` (required), `description` optional, `status` optional (`todo`, `in_progress`, `done`) |
| PUT | `/tasks/:id` | Body: `status` (required) |
| DELETE | `/tasks/:id` | Returns `204` when deleted |

## Docker Compose

`docker compose up -d` starts PostgreSQL with user `postgres`, password `postgres`, database `sprout_tasks`, and creates `sprout_tasks_test` on first boot. Point `DATABASE_URL` / `TEST_DATABASE_URL` at `postgresql://postgres:postgres@localhost:5432/...` and run migrations as above.

## CI

GitHub Actions workflow `.github/workflows/ci.yml` runs migrations and `npm test` against a PostgreSQL service container.
