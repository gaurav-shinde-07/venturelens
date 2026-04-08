# VentureAI — API Documentation

Base URL (local): `http://localhost:3000/api`  
Base URL (production): `https://yourapp.vercel.app/api`

All endpoints return JSON. All protected endpoints require a valid Supabase session cookie (set automatically on login).

---

## Authentication

VentureAI uses Supabase Auth with cookie-based sessions. The session is automatically included in requests from the browser. For API testing, log in via the UI first.

---

## Endpoints

### `GET /api/ideas`

Returns all ideas belonging to the authenticated user, ordered newest first.

**Auth:** Required

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "AI legal doc reviewer",
      "description": "...",
      "status": "completed",
      "problem": "...",
      "customer": "...",
      "market": "...",
      "competitor": [{"name": "...", "differentiation": "..."}],
      "tech_stack": ["Next.js", "PostgreSQL"],
      "risk_level": "Medium",
      "profitability": 72,
      "justification": "...",
      "share_token": "uuid",
      "is_public": false,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Response 401:**
```json
{ "success": false, "error": "Unauthorized" }
```

---

### `POST /api/ideas`

Submits a new startup idea and triggers AI analysis synchronously.

**Auth:** Required  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "title": "AI-powered legal document reviewer",
  "description": "Freelancers spend hours reviewing contracts..."
}
```

**Validation Rules:**
- `title`: 5-100 characters, required
- `description`: 20-2000 characters, required

**Response 201:**
```json
{
  "success": true,
  "data": { /* full idea object with AI results */ }
}
```

**Response 422 (Validation Error):**
```json
{
  "success": false,
  "error": "Description must be at least 20 characters"
}
```

**Response 500 (AI Failed):**
```json
{
  "success": false,
  "error": "AI analysis failed. Please try again."
}
```

---

### `GET /api/ideas/:id`

Returns a single idea with its full AI report.

**Auth:** Required (must own the idea)

**Response 200:**
```json
{
  "success": true,
  "data": { /* full idea object */ }
}
```

**Response 404:**
```json
{ "success": false, "error": "Idea not found" }
```

---

### `DELETE /api/ideas/:id`

Permanently deletes an idea and its AI report.

**Auth:** Required (must own the idea)

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Idea deleted successfully" }
}
```

---

### `PATCH /api/ideas/:id/share`

Toggles an idea between public and private. When made public, the `share_token` can be used to construct a shareable URL.

**Auth:** Required (must own the idea)  
**Constraint:** Idea must have `status: "completed"`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "is_public": true,
    "share_token": "uuid"
  }
}
```

Share URL format: `https://yourapp.vercel.app/share/{share_token}`

---

## Error Response Format

All errors follow this format:
```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

## Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad request |
| 401 | Unauthorized |
| 404 | Not found |
| 422 | Validation error |
| 500 | Server / AI error |