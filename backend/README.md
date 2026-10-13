# Karwan Backend

Node.js and Express API for the Karwan disaster relief resource optimizer.

## Implemented phases

Phase 1 contains the backend foundation:

- Express application startup
- Environment validation
- Supabase server clients
- Database constants and shared repository utilities
- Snake case and camel case mappers
- Standard API error handling
- Liveness and database readiness checks
- Foundation tests

Phase 2 contains transparent priority scoring and the agreed weight endpoints:

- `GET /api/settings/weights`
- `PUT /api/settings/weights`
- Weighted score parts that add up to the displayed total
- Immediate re-scoring and sorting of requests after a weight update

Feature endpoints for requests, inventory, allocation, simulation, routes,
deliveries, dashboard, and reset remain deferred to their phases.

## Setup

1. Use Node.js 22 or newer.
2. Copy `.env.example` to `.env` and provide the Supabase values.
3. Install dependencies with `npm install`.
4. Start development mode with `npm run dev`.

The backend defaults to `http://localhost:4000`.

## Checks

```text
npm test
npm run check:db
```

HTTP checks:

```text
GET /health/live
GET /health/ready
```

The readiness endpoint expects the database seed defined by the agreed SQL:
3 depots, 12 requests, 6 vehicles, and 41 request items.

## Secrets

The Supabase secret key belongs only in `.env`. The file is ignored by Git.
Never include the secret key in frontend code, commits, screenshots, or logs.
