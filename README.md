# Itineris — API (trip-planner-api)

Backend for **Itineris**, a collaborative trip-planning app. Users create trips, add places to them, and invite others to collaborate on a specific trip.

## Stack

- Node.js + Express + TypeScript
- PostgreSQL + Prisma 7 (Docker for local DB)
- Zod (validation)
- JWT (auth) + bcrypt (password hashing)
- Resend (transactional email — verification, password reset, invites)
- Multer + Cloudinary (image uploads — avatars, trip banners)
- Stripe (contributions to trip payments — see "Extra features" below)

## Architecture

Every feature module follows the same layered pattern:

```
schema → repository → service → controller → routes
```

- **schema** — Zod input validation
- **repository** — Prisma queries, no business logic
- **service** — business rules, orchestrates repositories
- **controller** — parses request, calls service, shapes response
- **routes** — wires HTTP verbs/paths to controllers + middleware

Modules: `auth`, `trips`, `places`, `invites`, `payment`.

## Roles & permissions

- **Owner** (creator of a trip): full CRUD on the trip, can invite collaborators, full CRUD on places.
- **Collaborator** (accepted an invite): CRUD on places within that trip, cannot delete the trip.
- **User** with no relation to a trip: no access to it at all.

Ownership/membership is resolved relationally via a `TripMember` join table (`@@unique([tripId, userId])`) — never assumed from a scalar field on `Trip`. Trip-scoped routes go through `requireTripRole` middleware, which checks membership against the database rather than trusting the JWT alone.

## Auth flows

- `/register`, `/login` — standard JWT issuance.
- `/verify-email`, `/forgot-password` — token-based, **not** gated behind the auth middleware (these routes are meant to be reachable by users without a valid session).
- Reset/verification tokens are hashed (SHA-256) before storage; the incoming token is re-hashed and compared — plaintext tokens are never stored or compared directly.
- Password reset responses are non-committal ("If that email exists, a reset link has been sent") to avoid leaking account existence.

## Invites

- Owner sends an invite by email from the trip's access page.
- One active invite per (email, trip) pair — enforced at the service level.
- Self-invites are blocked.
- Invite acceptance grants Collaborator access to that trip only.

## Extra features beyond the MVP spec

These weren't required by the original brief but were added to round out the app:

- **Profile page** — view/edit account details, upload a profile picture (Cloudinary).
- **Sent invitations view** — see invites you've sent and their status, from the profile page.
- **Trip banner images** — upload a cover image per trip (Cloudinary).
- **Stripe payments** — collaborators can contribute money toward a trip; tracked via the `payment` module.

## Setup

```bash
# install
npm install

# start Postgres locally
docker-compose up -d

# run migrations
npx prisma migrate dev

# start dev server
npm run dev
```

Copy `.env.example` to `.env` and fill in:

- Database connection string
- JWT secret
- Resend API key
- Cloudinary credentials
- Stripe keys