# Karwan: User Flows

Arrows show the order of steps. Rounded boxes are people, square boxes are screens, diamonds are decisions.

## 1. Big picture: from request to delivery

```mermaid
flowchart LR
  A([Community member]) --> B[Send request<br/>/requester]
  B --> C[Score is created]
  C --> D([Coordinator])
  D --> E[Review ranking<br/>/requests]
  E --> F[Generate plan<br/>/allocation]
  F --> G{Happy with plan?}
  G -- No --> H[Test change<br/>/simulator]
  H --> F
  G -- Yes --> I[Approve]
  I --> J([Driver])
  J --> K[Start trip<br/>/driver]
  K --> L[Truck moves on map]
  L --> M[Mark delivered]
  M --> N([Community tracks it<br/>/tracker])
```

## 2. Community member

```mermaid
flowchart TD
  A[Open Karwan] --> B[Submit a request]
  B --> C[Drop pin on map]
  C --> D[Choose urgency and access]
  D --> E[Enter people affected and supplies]
  E --> F[Send]
  F --> G[See priority score]
  G --> H[Track delivery]
  H --> I[See ETA and truck on map]
```

## 3. Coordinator

```mermaid
flowchart TD
  A[Login] --> B[Dashboard<br/>KPIs, map, heat layers]
  B --> C[Requests<br/>read score, move weight sliders]
  C --> D[Allocation<br/>generate plan]
  D --> E[Read reason for each row]
  E --> F[Compare with first-come-first-served]
  F --> G{Approve?}
  G -- Yes --> H[Stock drops, trucks assigned]
  G -- No --> I[Simulator]
  I --> J[Pick a what-if<br/>stock, population, request, capacity, road block]
  J --> K[See who gains and loses]
  K --> L{Keep it?}
  L -- Apply --> D
  L -- Undo --> D
  H --> B
```

## 4. Depot manager

```mermaid
flowchart LR
  A[Login] --> B[Inventory]
  B --> C[Update stock]
  B --> D[Set daily capacity]
  B --> E[Add or remove trucks]
  C --> F{Below threshold?}
  F -- Yes --> G[Low-stock alert]
  F -- No --> H[Entry saved in stock log]
  G --> H
```

## 5. Driver

```mermaid
flowchart LR
  A[Login] --> B[See assigned load]
  B --> C[Check route and ETA]
  C --> D[Start trip]
  D --> E[Truck moves live]
  E --> F[Arrive]
  F --> G[Mark delivered]
  G --> H[Truck free again]
```

## 6. What happens in the system after approval

```mermaid
sequenceDiagram
  participant C as Coordinator
  participant API as API
  participant DB as Database
  participant D as Driver
  participant T as Tracker
  C->>API: Approve plan
  API->>DB: Deduct stock, save allocations, write log
  D->>API: Start trip
  API->>DB: Update progress every second
  DB-->>T: Live position and progress
  D->>API: Mark delivered
  API->>DB: Request delivered, truck free
```
