# API Reference

REST API for the NVIDIA Super Computing Club website. All endpoints return JSON.

**Base URL:** `http://localhost:5000/api` (development)  
**Production:** `https://api.nvidia-sc.dev/api`

---

## Authentication

Most admin endpoints require a valid JWT token.

```
Authorization: Bearer <jwt-access-token>
```

Obtain a token via OAuth login (`POST /api/auth/login`) or by authenticating through Google/GitHub.

### Public vs Protected

| Endpoint Type | Auth Required | Example |
|--------------|---------------|---------|
| Public (GET) | No | `GET /api/events` |
| Admin (CRUD) | Yes | `POST /api/events` |

---

## Response Format

### Success

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Paginated

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": { "field": "title" }
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (not an admin) |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

## Events API

### GET /api/events

List all events. Public endpoint.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | string | — | Filter by category: `workshop`, `hackathon`, `talk`, `social` |
| `featured` | boolean | — | Filter featured events only |
| `upcoming` | boolean | — | Only future events |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Results per page (max 50) |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "CUDA Workshop Series",
      "description": "Hands-on CUDA programming workshop",
      "date": "2026-08-15T18:00:00Z",
      "location": "Room 301, CS Building",
      "image_url": "https://res.cloudinary.com/...",
      "category": "workshop",
      "is_featured": true,
      "created_at": "2026-07-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### GET /api/events/:id

Get a single event by ID. Public endpoint.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "CUDA Workshop Series",
    "description": "Hands-on CUDA programming workshop",
    "date": "2026-08-15T18:00:00Z",
    "location": "Room 301, CS Building",
      "image_url": "https://res.cloudinary.com/your-cloud/image/upload/...",
    "category": "workshop",
    "is_featured": true,
    "created_at": "2026-07-01T10:00:00Z",
    "updated_at": "2026-07-10T14:30:00Z"
  }
}
```

---

### POST /api/events

Create a new event. **Admin only.**

**Request Body:**

```json
{
  "title": "GPU Computing Seminar",
  "description": "Introduction to GPU computing paradigms",
  "date": "2026-09-01T14:00:00Z",
  "location": "Auditorium",
  "image_url": "https://res.cloudinary.com/demo/image/upload/...",
  "category": "talk",
  "is_featured": false
}
```

**Validation:**
- `title` — required, string, max 200 chars
- `description` — optional, string, max 2000 chars
- `date` — required, valid ISO 8601 datetime, must be in the future
- `location` — optional, string, max 200 chars
- `category` — optional, one of: `workshop`, `hackathon`, `talk`, `social`
- `is_featured` — optional, boolean, default `false`

**Response:** `201 Created`

```json
{
  "success": true,
  "data": { "id": "uuid", ... },
  "message": "Event created successfully"
}
```

---

### PUT /api/events/:id

Update an existing event. **Admin only.**

**Request Body:** Same as POST, all fields optional (partial update).

**Response:** `200 OK`

```json
{
  "success": true,
  "data": { "id": "uuid", ... },
  "message": "Event updated successfully"
}
```

---

### DELETE /api/events/:id

Delete an event. **Admin only.**

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

## Team API

### GET /api/team

List all team members. Public endpoint.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `active` | boolean | `true` | Only active members |
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Results per page |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Jane Smith",
      "role": "President",
      "bio": "CS major specializing in distributed systems",
      "image_url": "https://res.cloudinary.com/...",
      "github_url": "https://github.com/janesmith",
      "linkedin_url": "https://linkedin.com/in/janesmith",
      "twitter_url": "https://x.com/janesmith",
      "display_order": 1,
      "is_active": true
    }
  ]
}
```

---

### GET /api/team/:id

Get a single team member. Public endpoint.

---

### POST /api/team

Add a team member. **Admin only.**

**Request Body:**

```json
{
  "name": "John Doe",
  "role": "Vice President",
  "bio": "ML researcher focused on large language models",
  "image_url": "https://res.cloudinary.com/demo/image/upload/...",
  "github_url": "https://github.com/johndoe",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "twitter_url": null,
  "display_order": 2,
  "is_active": true
}
```

**Validation:**
- `name` — required, string, max 100 chars
- `role` — required, string, max 100 chars
- `bio` — optional, string, max 500 chars
- `display_order` — optional, integer, default 0

---

### PUT /api/team/:id

Update a team member. **Admin only.**

---

### DELETE /api/team/:id

Remove a team member (soft delete — sets `is_active` to false). **Admin only.**

---

## Homepage CMS API

### GET /api/homepage

Get all homepage sections. Public endpoint.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "section": "hero",
      "title": "NVIDIA Super Computing Club",
      "subtitle": "Building the future with GPU computing",
      "body": {
        "cta_text": "Join Us",
        "cta_link": "/events"
      },
      "image_url": "https://res.cloudinary.com/demo/image/upload/..."
    },
    {
      "id": "uuid",
      "section": "about",
      "title": "About Us",
      "body": {
        "paragraphs": [
          "We are a student organization dedicated to..."
        ]
      }
    }
  ]
}
```

---

### GET /api/homepage/:section

Get a specific section (e.g., `hero`, `about`, `stats`, `featured`).

---

### PUT /api/homepage/:section

Update a homepage section. **Admin only.**

**Request Body:**

```json
{
  "title": "Updated Title",
  "subtitle": "Updated subtitle",
  "body": {
    "key": "value"
  },
  "image_url": "https://res.cloudinary.com/demo/image/upload/..."
}
```

---

## Auth API

### POST /api/auth/login

Initiate OAuth login. Redirects to provider.

**Request Body:**

```json
{
  "provider": "google"
}
```

**Supported providers:** `google`, `github`

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://accounts.google.com/o/oauth2/..."
  }
}
```

---

### POST /api/auth/callback

Handle OAuth callback. Exchange code for session.

---

### GET /api/auth/me

Get current user profile. **Requires auth.**

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@university.edu",
    "full_name": "Jane Smith",
    "role": "admin"
  }
}
```

---

### POST /api/auth/logout

Sign out. **Requires auth.**

---

## File Upload API

### POST /api/upload

Upload an image to Cloudinary. **Admin only.**

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | Image file (jpg, png, webp, max 5MB) |
| `folder` | string | Yes | Storage folder: `events`, `team`, `homepage` |

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/...",
    "path": "events/event-cover.jpg"
  }
}
```

**Validation:**
- Max file size: 5MB
- Allowed types: `image/jpeg`, `image/png`, `image/webp`
- File is renamed to `{uuid}.{ext}` to prevent collisions
