# Coy Discover — Take-home Assignment

Swipe-based discovery (like Bumble/Tinder) as a **Discover** tab alongside a blank Home placeholder. Mutual matches only — who liked you is never revealed unless both sides liked.

## Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind + Framer Motion
- **Backend:** Node.js + Express
- **Data:** JSON file (`backend/data/db.json`) — persists across reloads

## Quick start

Open two terminals from the project root:

```bash
# Terminal 1 — API (port 4000)
cd backend
npm install
npm run seed
npm run dev
```

```bash
# Terminal 2 — UI (port 3000)
cd frontend
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Demo tips

1. Open the **Discover** tab and swipe (drag on mobile, buttons on desktop).
2. Profiles `user-1`, `user-3`, `user-5`, `user-8`, `user-12`, `user-15`, `user-18`, `user-22`, and `user-27` have **already liked you** — liking them creates an **It’s a match!** screen.
3. Open **Matches** to see mutual matches only.
4. Use **Reset demo data** at the bottom to re-seed and swipe again.

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/feed` | Profiles you haven’t swiped on yet |
| `POST` | `/swipe` | Body: `{ "profileId": "user-1", "action": "like" \| "pass" }` → `{ matched, match }` |
| `GET` | `/matches` | Mutual matches for the logged-in user |
| `POST` | `/reset` | Re-seed demo data |

Assumes a single logged-in user (`user-0` / Alex). No auth required.

## Project layout

```
backend/
  src/server.js   # Express routes
  src/seed.js     # 32 mock profiles + inbound likes
  data/db.json    # Persisted swipes & matches
frontend/
  src/app/        # Next.js pages
  src/components/ # Swipe deck, match modal, matches list, tab bar
```
