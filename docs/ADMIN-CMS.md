# Admin CMS Documentation

Complete guide to the admin content management system for the NVIDIA SC Club website.

---

## Overview

The admin CMS allows authorized administrators to manage all website content through a secure dashboard. Admins can update the homepage, manage events, and manage team members — all without touching code.

---

## Authentication

### Login Methods

| Provider | Flow |
|----------|------|
| Google OAuth 2.0 | Click "Sign in with Google" → Google consent screen → Redirect back |
| GitHub OAuth 2.0 | Click "Sign in with GitHub" → GitHub consent screen → Redirect back |

### Access Control

- Only users with a record in the `adminusers` MongoDB collection can access the CMS
- Regular users cannot access admin routes — the server checks the JWT `role` field
- Admin role is checked server-side on every protected API call via auth middleware
- JWT token expires after 1 hour; client must re-authenticate after expiry

### Login Flow

```
1. User visits /admin/login
2. User clicks Google or GitHub button
3. Frontend calls GET /api/auth/google (or /api/auth/github)
4. Passport.js redirects to OAuth provider
5. User authenticates with provider
6. Provider redirects back to /api/auth/google/callback
7. Passport.js callback controller finds or creates user in MongoDB adminusers collection
8. Server generates JWT token with userId, email, role
9. JWT is returned to frontend, stored in localStorage
10. Frontend redirects to /admin/dashboard
```

### JWT Token

```javascript
// Payload stored in token
{
  userId: "64f1a2b3c4d5e6f7a8b9c0d1",
  email: "admin@university.edu",
  role: "admin",
  iat: 1234567890,
  exp: 1234571490
}
```

---

## Dashboard

The dashboard is the landing page after login.

### Features

- **Overview Stats:** Total events, total team members, upcoming events count
- **Quick Actions:** "Add Event" and "Add Team Member" buttons
- **Recent Activity:** Last 5 changes made by any admin
- **Navigation:** Sidebar links to all CMS sections

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Admin Header  [User Avatar] [User Name] [Logout]           │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │  Dashboard Content                                │
│          │                                                   │
│ Dashboard│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│ Homepage │  │ Events │ │ Members│ │ Upcoming│ │ Total  │    │
│ Events   │  │  25    │ │  12    │ │   5    │ │  37    │    │
│ Team     │  └────────┘ └────────┘ └────────┘ └────────┘    │
│          │                                                   │
│          │  Quick Actions                                    │
│          │  [+ Add Event]  [+ Add Team Member]              │
│          │                                                   │
│          │  Recent Activity                                  │
│          │  • Jane edited "CUDA Workshop" - 2h ago          │
│          │  • John added "ML Seminar" - 5h ago               │
│          │  • Jane updated hero section - 1d ago             │
└──────────┴──────────────────────────────────────────────────┘
```

---

## Homepage CMS

Manage the content of the landing page sections.

### Sections

| Section | Editable Fields |
|---------|----------------|
| **Hero** | Title, Subtitle, CTA Text, CTA Link, Background Image |
| **About** | Title, Body (paragraphs), Image |
| **Stats** | Individual stat items (label + number) |
| **Featured** | Featured events selection, Featured team selection |
| **Footer** | Club description, Social links |

### Editing a Section

1. Navigate to Homepage CMS from the sidebar
2. See a list of all sections with their current content
3. Click "Edit" on any section
4. A form/modal opens with the section's fields
5. Modify the fields
6. Click "Save" to update
7. Changes are immediately reflected on the public website

### Image Upload

- Click the image upload area or drag and drop
- Supported formats: JPG, PNG, WebP
- Max file size: 5MB
- Image is uploaded to Cloudinary via the backend
- A preview is shown before saving
- Old images remain in Cloudinary (not auto-deleted)

---

## Events CMS

Manage all club events.

### Features

- **List View:** Table of all events with columns: Title, Date, Category, Featured, Actions
- **Search:** Filter events by title
- **Filter:** By category (All, Workshop, Hackathon, Talk, Social)
- **Sort:** By date, title, or creation date

### Event Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Title | Text | Yes | Event name (max 200 chars) |
| Description | Textarea | No | Event details (max 2000 chars) |
| Date | DateTime picker | Yes | Event date and time |
| Location | Text | No | Venue or "Online" (max 200 chars) |
| Category | Dropdown | Yes | Workshop, Hackathon, Talk, Social |
| Image | File upload | No | Event cover image |
| Featured | Toggle | No | Highlight on landing page |

### CRUD Operations

#### Create Event

1. Click "Add Event" button
2. Fill in the form fields
3. Upload an image (optional)
4. Click "Create Event"
5. Event appears in the list and on the public Events page

#### Edit Event

1. Click the edit icon on any event row
2. Form pre-fills with current values
3. Modify fields
4. Click "Update Event"
5. Changes are live immediately

#### Delete Event

1. Click the delete icon on any event row
2. Confirmation modal appears: "Are you sure you want to delete [Event Name]?"
3. Click "Delete" to confirm or "Cancel" to abort
4. Event is removed from the list and public pages

#### Toggle Featured

1. Click the featured toggle in the table row
2. Event is immediately marked as featured/unfeatured
3. Featured events appear in the landing page Featured section

---

## Team CMS

Manage club team members.

### Features

- **Grid View:** Card layout showing photo, name, role
- **Table View:** Compact list with all details
- **Reorder:** Drag-and-drop or manual order number
- **Toggle:** Show/hide members on the public page

### Team Member Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Name | Text | Yes | Full name (max 100 chars) |
| Role | Text | Yes | Position/title (max 100 chars) |
| Bio | Textarea | No | Short bio (max 500 chars) |
| Photo | File upload | No | Profile picture |
| GitHub URL | URL | No | GitHub profile link |
| LinkedIn URL | URL | No | LinkedIn profile link |
| Twitter/X URL | URL | No | X/Twitter profile link |
| Display Order | Number | No | Order in the team grid (lower = first) |
| Active | Toggle | No | Show on public page |

### CRUD Operations

#### Add Team Member

1. Click "Add Member" button
2. Fill in name, role, and optional fields
3. Upload a profile photo
4. Set display order
5. Click "Create Member"

#### Edit Member

1. Click edit on a member card/row
2. Modify fields
3. Click "Update Member"

#### Remove Member

1. Click delete on a member
2. Confirm in the modal
3. Member is soft-deleted (hidden from public, kept in database)

#### Reorder Members

- **Option A:** Drag and drop in the admin grid view
- **Option B:** Edit the display_order number manually
- Lower numbers appear first on the public Team page

---

## Image Management

### Upload Flow

1. Click upload area or drag file
2. Client validates file type and size
3. File is sent to `POST /api/upload` as `multipart/form-data`
4. Server validates with multer, then uploads to Cloudinary
5. Cloudinary returns the public URL
6. URL is saved in the MongoDB document field
7. Image is displayed in preview

### Cloudinary Folder Structure

```
nvidia-sc-website/
├── events/
│   ├── event-cover-1.jpg
│   └── event-cover-2.png
├── team/
│   ├── member-photo-1.jpg
│   └── member-photo-2.jpg
└── homepage/
    ├── hero-bg.jpg
    └── about-image.jpg
```

### Image Optimization

- Cloudinary automatically resizes images on upload
- WebP conversion applied via Cloudinary transformation
- Original file is kept as backup
- Thumbnails generated for list views using Cloudinary URL transforms (e.g., `?w=400`)

---

## Admin Routes

| Route | Description |
|-------|-------------|
| `/admin/login` | Login page (redirects to dashboard if already logged in) |
| `/admin/dashboard` | Main dashboard with stats and quick actions |
| `/admin/homepage` | Homepage CMS editor |
| `/admin/events` | Events CMS (list + CRUD) |
| `/admin/team` | Team CMS (list + CRUD) |

### Route Protection

- All `/admin/*` routes (except `/admin/login`) are protected
- Auth check happens in a route guard component
- If not authenticated → redirect to `/admin/login`
- If authenticated but not admin → show "Access Denied"
- If authenticated and admin → render the page

---

## Error Handling

### Common Scenarios

| Error | Handling |
|-------|----------|
| Network error | Toast notification: "Connection lost. Please try again." |
| Auth expired | Redirect to login with message: "Session expired. Please log in again." |
| Validation error | Inline field errors with red borders and messages |
| Upload failed | Toast: "Upload failed. File may be too large or in wrong format." |
| Delete failed | Toast: "Delete failed. Please try again." |
| Permission denied | Full-page "Access Denied" with link back to home |

### Success Feedback

- All CRUD operations show a green toast notification
- "Event created successfully"
- "Team member updated"
- "Content saved"
- Toast auto-dismisses after 3 seconds

---

## Data Flow

```
Admin Action → React State Update → API Call → Express → Mongoose → MongoDB → Response → UI Update
                                     ↓
                               Optimistic Update
                            (UI updates immediately,
                             reverts on error)
```

- Forms use controlled components (React state)
- API calls go through `client/src/services/` functions
- Services call the backend REST API
- Backend validates, then runs Mongoose queries against MongoDB
- Response flows back to the UI
- Optimistic updates for better UX (toggle featured, delete)

---

## Security Considerations

1. **JWT Verification:** Every admin API call includes the JWT in the Authorization header
2. **Server-side Role Check:** Auth middleware verifies the user's role from the JWT payload against the `adminusers` collection
3. **JWT Secret:** Only on the server, never exposed to the client
4. **Input Validation:** All inputs validated server-side before processing
5. **File Type Checking:** Server verifies MIME type via multer, not just extension
6. **Rate Limiting:** Admin endpoints rate-limited to prevent abuse
7. **Audit Trail:** All admin changes logged with timestamp and user ID (optional)
