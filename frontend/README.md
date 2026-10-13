# Karwan client (Person B)
```
cp .env.example .env
npm install
npm run dev
```
`VITE_USE_MOCKS=true` keeps unfinished features on mock data. Regenerate mocks from the seed values with `npm run mocks`.

Requests and priority weights now use the real backend through `MOCK_OFF` in
`src/lib/api.js`. Inventory, vehicle management, dashboard, allocation, reset,
simulation, routes, and deliveries remain mocked until their backend phases are
completed and pass the integration checklist.

Mock frontend screens:

- `/inventory` — stock, capacity, dynamic vehicles, alerts and stock log
- `/dashboard` — KPIs, status pipeline, map details and time advance
- `/allocation` — generate, compare, inspect routes and approve a plan
- `/simulator` — six what-if actions, road blocks, before/after diff, Apply and Undo
- `/driver` — assigned load, route, live truck, Start Trip and Mark Delivered
- `/tracker` — requester-facing delivery status, ETA, progress and live map

The Dashboard includes five client-computed heat layers: Need, Urgency, Supply
gap, Delivery delay and Accessibility. Dashboard and Allocation use the shared
mock route layer; dashed lines identify estimated fallback routes.

Delivery screens use a two-second frontend polling loop while mock mode is on.
The same module is the fallback boundary for Realtime after backend integration.

Run both applications during development:

```text
cd ../backend
npm run dev

cd ../frontend
npm run dev
```
