# EV Auction Platform

A full-stack web application for auctioning used electric vehicles (EV). Administrators can create, manage, and monitor vehicle auctions, while registered dealers browse active listings, place bids, and track their bidding history. The platform provides real-time auction status, bid management, authentication, and role-based access control. The application is built with React, Next.js, NestJS, and PostgreSQL.

# Running the application locally

## Prerequisites

- Node.js (includes npm)
- Docker (for PostgreSQL)

## 1. Start the database

From the project root:

```bash
docker compose up -d
```

This starts a PostgreSQL database in a Docker container on port `5432`.

## 2. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

## 3. Configure environment variables

Copy the example environment files:

````bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

> **Note:** Use the same `JWT_SECRET` value in both files.

## 4. Run database migrations and seed the database

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
````

The seed script creates demo users, vehicles, auctions, and bids.

All seeded accounts use the password `password123`.

| Email                 | Role   |
| --------------------- | ------ |
| `admin@aampere.com`   | Admin  |
| `dealer1@example.com` | Dealer |
| `dealer2@example.com` | Dealer |
| `dealer3@example.com` | Dealer |

## 5. Start the applications

Run the backend and frontend in separate terminals.

Backend (`http://localhost:3001`):

```bash
cd backend
npm run start:dev
```

Frontend (`http://localhost:3000`):

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000` and sign in using one of the seeded accounts.

---

# Running tests

Tests are located in the backend.

```bash
cd backend
npm test
```

---

# API documentation

With the backend running, open:

`http://localhost:3001/api`

Swagger documents all public API endpoints.

Authentication endpoints are intentionally excluded because authentication relies on an HTTP-only cookie, which Swagger UI does not handle well. Use the frontend application to sign in before testing protected endpoints.

# Implementation decisions
