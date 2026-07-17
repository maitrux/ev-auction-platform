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

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

> **Note:** Use the same `JWT_SECRET` value in both files.

## 4. Run database migrations and seed the database

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

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

## Admin and dealer separation

The application keeps admin and dealer concerns in separate areas in both frontend and backend.

- **Frontend routes:** `/admin/*` for administrators, `/dealer/*` for dealers. Each role has its own pages, navigation, and server-side API clients.
- **Backend API:** Endpoints are guarded by role. This keeps the codebase easier to maintain and reduces complexity. If an administrator needs to experience the application from a dealer's perspective, a separate dealer test account should be used.

## Auction status

An auction can be in one of five statuses:


| Status      | Meaning                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `DRAFT`     | Created but not yet published. Settings are optional and the auction is hidden from dealers. Only drafts can be edited. |
| `SCHEDULED` | Published and waiting to start. Not yet open for bidding.                                                               |
| `LIVE`      | Published and currently running. Dealers can place bids.                                                                |
| `ENDED`     | The auction window has closed.                                                                                          |
| `CANCELLED` | Cancelled by an admin. Terminal state — no bidding accepted.                                                            |


## Auction outcome

Once an auction has ended, an admin must confirm the result. Outcomes are immutable after confirmation.

### Admin view


| Outcome   | Meaning                                                   |
| --------- | --------------------------------------------------------- |
| `PENDING` | Auction has ended but no decision has been made yet.      |
| `SOLD`    | Highest bid accepted. That bid is recorded as the winner. |
| `UNSOLD`  | All bids rejected. No winner.                             |


When resolving an auction, an administrator may reject the highest bid even if it exceeds the reserve price. However, if a bid is accepted, it must always be the highest valid bid.

### Dealer view

Dealers see a simplified outcome model:


| Outcome    | Meaning                                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| `PENDING`  | Auction has ended; final result not yet available to dealers.                                             |
| `RESOLVED` | Admin has made a decision (sold or unsold). Dealers are not shown whether the auction was sold or unsold. |


## Cancelled auctions

An admin can cancel an auction while it is `DRAFT`, `SCHEDULED`, or `LIVE`. Cancelled auctions cannot be reopened. Allowing reopening would be complicated once dealers have already placed bids.

## Vehicle images

When creating an auction, vehicle photos are optional. In a production application, at least one image should be required.

Photos are entered as comma-separated image URLs in the create-auction form (no file upload in the current implementation). For testing, free stock photos can be sourced from [Pexels](https://www.pexels.com). Copy the direct image URL and paste it into the form — for example:

`https://images.pexels.com/photos/10029878/pexels-photo-10029878.jpeg`

## Immutable bids

Once submitted, bids cannot be edited, canceled, or deleted.
