# VentureLens - AI-Powered Startup Idea Validator

> Submit your startup idea. Get a comprehensive AI-generated validation report in under 15 seconds.

![VentureAI](https://img.shields.io/badge/Built%20with-Next.js%2014-black?style=flat-square&logo=next.js)
![Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue?style=flat-square)
![Supabase](https://img.shields.io/badge/DB-Supabase-green?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square)

---

## What This Is

VentureAI is a full-stack SaaS application that lets founders validate startup ideas using AI. Users submit a title and description, and receive a structured report covering:

- **Problem Summary** — Core problem being solved
- **Customer Persona** — Who your customer is and why they need this
- **Market Overview** — TAM/SAM/SOM estimates and growth trends
- **Competitor Analysis** — 3 real competitors with your differentiation
- **Tech Stack** — Practical 4-6 tech recommendations for MVP
- **Risk Level** — Low / Medium / High with reasoning
- **Profitability Score** — 0-100 with honest justification

---

## Architecture Note

> The assignment specifies `/client` and `/server` folders. This project uses **Next.js 14 App Router** which integrates both in a single codebase — a superior architecture for Vercel deployment:
> - **Client** = `src/app/` pages and `src/components/` (React)
> - **Server** = `src/app/api/` routes (Node.js equivalent)
> This is industry standard for modern full-stack Next.js applications.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR + API routes, single Vercel deployment |
| Language | TypeScript | Type safety, better code quality |
| Auth | Supabase Auth | Email + Google OAuth, free tier |
| Database | Supabase PostgreSQL | RLS security, free tier, real-time |
| AI | Google Gemini 1.5 Flash | Fast, free tier, excellent JSON output |
| Styling | Tailwind CSS + Framer Motion | Utility-first + animations |
| Validation | Zod | Runtime type-safe input validation |
| PDF Export | jsPDF | Client-side PDF generation |
| Deployment | Vercel | Zero-config Next.js deployment |

---

## Project Structure

```
ventureai/
├── docs/                    # Documentation
│   ├── API.md               # API reference
│   ├── SYSTEM_DESIGN.md     # Architecture & decisions
│   └── DATABASE.md          # Schema & RLS policies
├── src/
│   ├── app/                 # Next.js pages + API routes
│   │   ├── api/             # Backend API routes (server)
│   │   │   ├── ideas/       # CRUD for ideas
│   │   │   └── auth/        # Auth callbacks
│   │   ├── auth/            # Auth pages
│   │   ├── dashboard/       # User dashboard
│   │   ├── ideas/           # Idea detail + new
│   │   └── share/           # Public share pages
│   ├── components/          # React components (client)
│   ├── lib/                 # Utilities + integrations
│   └── types/               # TypeScript types
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- A Supabase account (free)
- A Google Gemini API key (free)

### Step 1 — Clone and install

```bash
git clone https://github.com/yourusername/ventureai.git
cd ventureai
npm install
```

### Step 2 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) → New Project
2. Go to **SQL Editor** → paste the entire schema from `docs/DATABASE.md`
3. Go to **Settings → API** → copy your Project URL and keys
4. Go to **Authentication → Providers → Google** → enable it
   - Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com)
   - Authorized redirect URI: `https://yourproject.supabase.co/auth/v1/callback`

### Step 3 — Get Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → Create API key
3. Copy the key starting with `AIza...`

### Step 4 — Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=AIzaYourKeyHere
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5 — Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add all environment variables from `.env.local` in Vercel dashboard
4. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
5. In Supabase → Authentication → URL Configuration:
   - Site URL: `https://yourapp.vercel.app`
   - Redirect URLs: `https://yourapp.vercel.app/api/auth/callback`
6. Click **Deploy**

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/ideas` | Required | List user's ideas |
| POST | `/api/ideas` | Required | Submit + analyze idea |
| GET | `/api/ideas/:id` | Required | Get single idea report |
| DELETE | `/api/ideas/:id` | Required | Delete idea |
| PATCH | `/api/ideas/:id/share` | Required | Toggle public/private |

Full API docs: see `docs/API.md`

---

## AI Prompt

The Gemini prompt is engineered to return structured JSON with exactly 8 fields. See `src/lib/gemini.ts` for the full prompt and validation logic.

---

## Extra Features

- **Shareable Links** — Public report URLs via `share_token`
- **PDF Export** — Download report as formatted PDF
- **Dashboard Analytics** — Aggregate stats across all your ideas
- **Animated AI Steps** — Step-by-step loader during analysis
- **Password Strength Indicator** — Real-time on signup
- **Skeleton Loading** — Glassmorphism skeleton cards

---

