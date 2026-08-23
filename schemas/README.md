# Database Schemas

This folder contains all PostgreSQL/Supabase schema definitions for the NVIDIA Supercomputing Club website.

## Files

| File | Table | Description |
|---|---|---|
| `events.sql` | `events` | Club events, workshops, hackathons |
| `team.sql` | `team` | Team members / leadership directory |
| `applications.sql` | `applications` | Join/membership applications |
| `00_migrate_all.sql` | — | Master file — runs all schemas in order |

## How to Apply

### Option A — Supabase SQL Editor (Recommended)
1. Go to your Supabase dashboard → **SQL Editor**
2. Copy and paste the contents of each `.sql` file (in order: `events.sql` → `team.sql` → `applications.sql`)
3. Click **Run**

### Option B — Supabase CLI
```bash
supabase db push
# or run individual files:
psql $DATABASE_URL -f schemas/events.sql
psql $DATABASE_URL -f schemas/team.sql
psql $DATABASE_URL -f schemas/applications.sql
```

## Schema Overview

### `events`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, auto-generated |
| `title` | `text` | Required |
| `description` | `text` | |
| `date` | `date` | Required |
| `time` | `text` | e.g. "10:00 AM IST" |
| `location` | `text` | |
| `type` | `text` | enum: event/workshop/hackathon/seminar/competition |
| `image_url` | `text` | |
| `registration_url` | `text` | |
| `is_featured` | `boolean` | default false |
| `is_published` | `boolean` | default false |
| `capacity` | `integer` | |
| `created_at` | `timestamptz` | auto |
| `updated_at` | `timestamptz` | auto-updated on change |

### `team`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `name` | `text` | Required |
| `role` | `text` | e.g. "President", "ML Lead" |
| `department` | `text` | |
| `year` | `text` | e.g. "3rd Year" |
| `bio` | `text` | |
| `avatar_url` | `text` | |
| `linkedin_url` | `text` | |
| `github_url` | `text` | |
| `email` | `text` | |
| `order` | `integer` | Sort order, default 0 |
| `is_active` | `boolean` | default true |
| `created_at` | `timestamptz` | auto |
| `updated_at` | `timestamptz` | auto-updated |

### `applications`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `name` | `text` | Required |
| `email` | `text` | Required |
| `phone` | `text` | |
| `enrollment_no` | `text` | |
| `branch` | `text` | |
| `year` | `text` | |
| `why_join` | `text` | Applicant motivation |
| `experience` | `text` | Prior skills |
| `linkedin_url` | `text` | |
| `github_url` | `text` | |
| `portfolio_url` | `text` | |
| `status` | `text` | enum: pending/reviewed/accepted/rejected |
| `admin_notes` | `text` | Internal reviewer notes |
| `created_at` | `timestamptz` | auto |
| `updated_at` | `timestamptz` | auto-updated |

## RLS Policy Summary

| Table | Public SELECT | Public INSERT | Auth UPDATE/DELETE |
|---|---|---|---|
| `events` | ✅ (published only) | ❌ | ✅ |
| `team` | ✅ (active only) | ❌ | ✅ |
| `applications` | ❌ | ✅ (anyone can apply) | ✅ |
