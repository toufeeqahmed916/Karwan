# Karwan: Product Requirements (PRD)

Problem: **CL-03, Disaster Relief Resource Optimizer**

## 1. The problem
In a flood, relief supplies are often sent to the wrong places. Requests, stock and truck capacity are spread across calls, notebooks and messages. Nobody sees them together, so the worst-hit and hardest-to-reach areas can wait longest.

## 2. Goal
Give relief teams one shared screen that shows:
- who needs what,
- what is in stock,
- who should get it first, and why,
- where every delivery is right now.

## 3. Who it is for

| User | What they need |
|---|---|
| Community member | Ask for help easily. See when it will arrive. |
| Coordinator | Know who is most urgent. Approve a fair plan. Test "what if". |
| Depot manager | Keep stock, capacity and trucks up to date. |
| Driver | See the load, the route, and confirm delivery. |

## 4. MVP features (from the brief)

| # | Feature | Done |
|---|---|:--:|
| 1 | Register requests with location, urgency and supplies | ✅ |
| 2 | Record inventory and delivery capacity | ✅ |
| 3 | Rank requests with clear, visible criteria | ✅ |
| 4 | Recommend allocations from stock, demand and distance | ✅ |
| 5 | Show allocation status and delivery progress on a dashboard and map | ✅ |
| 6 | Show how plans change when supply or need changes | ✅ |

## 5. Extra features
- What-if simulator with apply and undo
- Road-block zones
- Comparison with first-come-first-served
- Five map heat layers
- Driver app and live truck tracking
- Requester tracker with ETA
- English and Urdu landing page
- One-click demo reset

## 6. Success looks like
- A request can be sent in under a minute.
- Every priority score can be explained in one sentence.
- Every allocation row has a plain-language reason.
- A coordinator can test a change and undo it without risk.
- A community member can see where their delivery is.

## 7. Out of scope (for now)
- Real data or real roads status
- Real login system
- Multi-stop truck routes
- SMS or WhatsApp intake
- Offline mode

## 8. Rules for the demo
All data is simulated: 12 locations in Sindh, 3 depots (Hyderabad, Sukkur, Karachi), 6 trucks, 4 supply types (food, water, medicine, shelter kits).
