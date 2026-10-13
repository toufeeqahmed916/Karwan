# Karwan: UI/UX Design

## 1. Idea
Calm, clear and fast to read under pressure. Dark ink on warm paper, with one bright lime accent for the main action. Colour is used for meaning, not decoration.

## 2. Logo
- The letter **K** is drawn as a person, with an open hand lifting up a second person. Help, in one shape.
- Use the lime app icon on light backgrounds and the white version on dark ones.
- Do not stretch or recolour it.
- Files: `assets/logo.png`, `assets/brand-sheet.png`

## 3. Colours

| Name | Hex | Used for |
|---|---|---|
| Ink | `#16181D` | Text, main buttons |
| Paper | `#F4F4EE` | Page background |
| Card | `#FFFFFF` | Panels |
| Line | `#DEDED6` | Borders |
| Mute | `#6B6F76` | Secondary text |
| Lime | `#C4F135` | Main accent. Hover `#9CC41A` |
| Night | `#101319` | Dark sections |

**Status colours (map markers and badges)**

| Meaning | Hex |
|---|---|
| Critical | `#D93636` |
| High | `#EF8A1F` |
| Waiting or medium | `#E3C21B` |
| In transit | `#2F6FDE` |
| Delivered | `#2E9D5B` |

Rule: delivered is always green, in transit always blue. Otherwise the marker shows urgency.

## 4. Type
- Headings: **Archivo**, bold, tight spacing
- Body: **Public Sans**
- Keep body text at 14px or larger.

## 5. Shape
- Small radius `6px` for buttons and fields
- Panel radius `10px`
- Thin 1px borders instead of heavy shadows

## 6. Main components
- **Button**: primary (ink), lime (key action), ghost (outline)
- **Panel**: white card with a thin border
- **KPI card**: label, big number, small note
- **Score bars**: five coloured parts adding up to the total
- **Weight sliders**: change weights, ranking re-sorts live
- **Status badge and pipeline**: pending, allocated, in transit, delivered
- **Map layers**: markers, routes, trucks, heat layers
- **Banner**: yellow bar when live updates pause

## 7. Screens

| Screen | Path | What is on it |
|---|---|---|
| Landing | `/` | Hero, how it works, live demo link. English and Urdu. |
| Request | `/requester` | Form on one side, map to drop a pin on the other |
| Tracker | `/tracker` | Progress bar, ETA, live truck map |
| Dashboard | `/dashboard` | 4 KPI cards, status pipeline, map, heat layer switch, Skip +6 hours |
| Requests | `/requests` | Ranked list, score breakdown, weight sliders |
| Allocation | `/allocation` | Plan table with reasons, baseline card, route on map, Approve |
| Simulator | `/simulator` | Action picker, before and after, Apply and Undo |
| Inventory | `/inventory` | Stock by item, capacity, trucks, stock log |
| Driver | `/driver` | Load, route, Start trip, Mark delivered |

## 8. Layout sketch (Dashboard)

```
+--------------------------------------------------------------+
| Karwan  [Coordinator]  Dashboard Requests Allocation  Reset  |
+--------------------------------------------------------------+
| [Active] [People waiting] [In progress] [Delivered]          |
| Pending -> Allocated -> In transit -> Delivered              |
| +---------------------------------+  Heat layer:             |
| |                                 |  (o) Need   ( ) Urgency  |
| |             MAP                 |  ( ) Supply gap          |
| |  red, orange, yellow markers    |  ( ) Delay  ( ) Access   |
| |  trucks and dashed routes       |  [ Skip +6 hours ]       |
| +---------------------------------+                          |
+--------------------------------------------------------------+
```

## 9. UX rules
1. **Explain every number.** Scores and allocations always show why.
2. **No dead ends.** Every error says what to do next.
3. **Safe to try.** Simulator changes are previews until applied, and can be undone.
4. **Show what is estimated.** Straight-line routes are dashed.
5. **One main action per screen.** It gets the lime button.
6. **Works on small screens.** Navigation scrolls sideways on phones.

## 10. Accessibility
- Visible focus outline on all controls
- Colour never carries meaning alone: badges also have text
- Animations switch off when the device asks for reduced motion
- Urdu uses right-to-left layout
