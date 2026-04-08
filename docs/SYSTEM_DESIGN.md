# VentureAI — System Design

## Architecture Overview

```
Browser (React)
    │
    ├─── Next.js Pages (SSR / Client Components)
    │        /                → Landing page (SSG)
    │        /dashboard       → Server Component (fetches from Supabase)
    │        /ideas/new       → Client Component (form + fetch)
    │        /ideas/[id]      → Server Component (SSR)
    │        /share/[token]   → Server Component (public, no auth)
    │
    └─── Next.js API Routes (Node.js runtime on Vercel)
             POST /api/ideas      → Validate input → Insert DB → Call Gemini → Update DB
             GET  /api/ideas      → Auth check → Supabase query
             GET  /api/ideas/:id  → Auth check → Supabase query
             DELETE /api/ideas/:id → Auth check → Supabase delete
             PATCH /api/ideas/:id/share → Toggle is_public
             GET  /api/auth/callback → Exchange OAuth code for session

External Services:
    Supabase  — PostgreSQL + Auth + Row Level Security
    Gemini    — AI analysis (gemini-1.5-flash model)
```

## Key Decisions

### 1. Next.js App Router (not Pages Router)
App Router gives us React Server Components. Dashboard and detail pages fetch data server-side — no loading spinners, no client-side fetch waterfalls, better SEO.

### 2. Synchronous AI call (not async/queue)
We call Gemini synchronously in the POST route. This means the API call waits for AI completion (~5-10s). Alternative would be a background job queue (BullMQ, Inngest) but that's overengineered for this MVP. The frontend shows an animated loader so UX is smooth.

### 3. Supabase RLS as the security layer
Row Level Security policies enforce data ownership at the database level — even if our API code has a bug, users cannot read each other's data. This is a defense-in-depth approach.

### 4. share_token for public sharing
Instead of exposing the numeric/UUID idea ID in share URLs, we use a separate `share_token` UUID. This means making an idea private immediately revokes access even if someone has the old URL bookmarked (we check `is_public = true` on every share page load).

### 5. Idea status flow
```
[pending] → [analyzing] → [completed]
                       ↘ [failed]
```
We immediately save the idea as `analyzing` before calling Gemini. This means the user can navigate away and come back — the idea exists in DB regardless of AI outcome.

## Scalability Considerations

- **Caching**: Dashboard page could add `revalidate = 30` for ISR in production
- **Rate limiting**: Add Upstash Redis rate limiter on POST /api/ideas to prevent Gemini API abuse
- **Queue**: Replace synchronous AI call with Inngest background jobs for scale
- **Streaming**: Switch to Gemini streaming API for real-time report generation UX