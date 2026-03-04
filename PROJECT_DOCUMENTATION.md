# Texas Business Calendars -- Project Documentation

A comprehensive reference for understanding, maintaining, and extending this project.

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Directory Structure](#directory-structure)
4. [Tech Stack and Dependencies](#tech-stack-and-dependencies)
5. [Routing](#routing)
6. [Component Reference](#component-reference)
   - [Public Components](#public-components)
   - [Admin Components](#admin-components)
7. [Context Providers](#context-providers)
8. [Library and Utility Files](#library-and-utility-files)
9. [Database Schema](#database-schema)
10. [Row Level Security Policies](#row-level-security-policies)
11. [Migration History](#migration-history)
12. [Edge Functions](#edge-functions)
13. [CSS Architecture and Design System](#css-architecture-and-design-system)
14. [Key Data Flows](#key-data-flows)
15. [Security Notes](#security-notes)
16. [Environment Variables Reference](#environment-variables-reference)

---

## Overview

**Texas Business Calendars** is a React + TypeScript single-page application that aggregates business networking events across four major Texas cities: **San Antonio**, **Austin**, **Dallas**, and **Houston**.

### What the App Does

- Displays upcoming business networking events on an interactive calendar
- Lets visitors filter events by city or search by keyword
- Provides a public form for anyone to submit new events (subject to admin approval)
- Offers an admin panel for managing events, reviewing submissions, and bulk-importing events via CSV/TSV
- Collects email signups for an upcoming AI-powered event assistant feature

### Who It Serves

- **Business professionals** looking for networking events in Texas
- **Event organizers** who want to list their events
- **Site administrators** who curate and manage the event database

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- A Supabase project with the migrations applied

### Environment Variables

Create a `.env` file at the project root with:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Install and Run

```bash
npm install
npm run dev       # Start development server
npm run build     # Production build
npm run preview   # Preview production build
npm run typecheck # TypeScript type checking
npm run lint      # ESLint
```

---

## Directory Structure

```
project/
├── public/
│   ├── _redirects                      # Netlify SPA redirect rules
│   └── Untitled_design_(21).png        # Logo image
│
├── src/
│   ├── main.tsx                        # App entry point, mounts React
│   ├── App.tsx                         # Root component, routing config
│   ├── index.css                       # Global styles and design system
│   ├── vite-env.d.ts                   # Vite type declarations
│   │
│   ├── components/
│   │   ├── Navigation.tsx              # Sticky header with city dropdown
│   │   ├── Hero.tsx                    # Hero banner with SEO metadata
│   │   ├── Calendar.tsx                # Core event browsing interface
│   │   ├── EventCard.tsx               # Individual event card
│   │   ├── CitySelector.tsx            # City filter buttons
│   │   ├── MiniCalendar.tsx            # Interactive monthly mini-calendar
│   │   ├── CityPreviewSection.tsx      # Grouped city event display
│   │   ├── EventSubmission.tsx         # Public event submission form
│   │   ├── SubmitEventPage.tsx         # Page wrapper for submission
│   │   ├── EventAssistantBanner.tsx    # AI assistant waitlist signup
│   │   ├── FAQ.tsx                     # Accordion FAQ section
│   │   ├── SocialProof.tsx             # Stats and testimonials
│   │   ├── SEOHead.tsx                 # Dynamic meta tag management
│   │   ├── Footer.tsx                  # Site footer
│   │   │
│   │   └── admin/
│   │       ├── AdminPanel.tsx          # Admin container and layout
│   │       ├── AdminLogin.tsx          # Password login screen
│   │       ├── AdminDashboard.tsx      # Stats overview and upload history
│   │       ├── PendingEvents.tsx       # Approve/reject submissions
│   │       ├── ClearPastEvents.tsx     # Bulk delete via edge function
│   │       ├── CSVUpload.tsx           # CSV/TSV file and paste upload
│   │       └── EventPreview.tsx        # Preview/edit before publishing
│   │
│   ├── contexts/
│   │   ├── CityContext.tsx             # City selection state (URL-driven)
│   │   └── AdminContext.tsx            # Admin authentication state
│   │
│   └── lib/
│       ├── supabase.ts                 # Supabase client + Event type
│       ├── utils.ts                    # Date formatting and sorting
│       ├── cities.ts                   # City configs and SEO data
│       └── csvParser.ts               # CSV/TSV parsing and validation
│
├── supabase/
│   ├── functions/
│   │   └── admin-operations/
│   │       └── index.ts                # Edge function for admin actions
│   │
│   └── migrations/
│       ├── 20260213000018_create_events_table.sql
│       ├── 20260213003623_allow_anon_event_inserts.sql
│       ├── 20260213003945_add_pending_event_management_policies.sql
│       ├── 20260213011942_add_city_calendar_column.sql
│       ├── 20260213013917_create_assistant_waitlist_table.sql
│       ├── 20260213041114_fix_rls_security_issues.sql
│       ├── 20260213045747_add_delete_past_events_policy.sql
│       ├── 20260213050209_update_delete_all_events_policy.sql
│       ├── 20260213050933_remove_insecure_delete_policy.sql
│       └── 20260214190241_create_upload_history_table.sql
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
└── eslint.config.js
```

---

## Tech Stack and Dependencies

### Runtime Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | UI library |
| `react-dom` | ^18.3.1 | React DOM rendering |
| `react-router-dom` | ^7.13.0 | Client-side routing |
| `@supabase/supabase-js` | ^2.57.4 | Supabase client SDK (database, auth, edge functions) |
| `lucide-react` | ^0.344.0 | Icon library |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^5.4.2 | Build tool and dev server |
| `@vitejs/plugin-react` | ^4.3.1 | React support for Vite |
| `typescript` | ^5.5.3 | Type checking |
| `tailwindcss` | ^3.4.1 | Utility CSS framework (available but styles are custom) |
| `postcss` | ^8.4.35 | CSS processing pipeline |
| `autoprefixer` | ^10.4.18 | Vendor prefix automation |
| `eslint` | ^9.9.1 | Code linting |
| `eslint-plugin-react-hooks` | ^5.1.0-rc.0 | React hooks lint rules |
| `eslint-plugin-react-refresh` | ^0.4.11 | React refresh lint rules |
| `typescript-eslint` | ^8.3.0 | TypeScript-specific lint rules |

### Build Configuration

- **Vite** serves as the build tool with the React plugin enabled
- `lucide-react` is excluded from Vite's dependency optimization to prevent bundling issues
- TypeScript is configured in strict mode targeting ES2020
- The project uses ESM (`"type": "module"` in package.json)

---

## Routing

Routing is handled by React Router v7 in `src/App.tsx`.

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `MainLayout` | Home page showing all Texas events |
| `/:citySlug` | `MainLayout` | City-specific view (san-antonio, austin, dallas, houston) |
| `/submit` | `SubmitEventPage` | Public event submission form |
| `/admin` | `AdminPanel` | Password-protected admin panel |

### MainLayout Structure

The `MainLayout` component (defined inline in `App.tsx`) renders the following in order:

1. `Navigation` -- sticky header
2. `Hero` -- hero banner with city-aware SEO
3. `CitySelector` -- city filter buttons
4. `Calendar` -- event list and mini calendar
5. `CityPreviewSection` -- grouped city views (when viewing "All Texas")
6. `EventAssistantBanner` -- AI assistant waitlist signup
7. `SocialProof` -- testimonials and stats
8. `FAQ` -- expandable questions and answers
9. `Footer` -- site footer

### Context Wrapping

- The entire app is wrapped in `CityProvider` (URL-driven city state)
- The `/admin` route is additionally wrapped in `AdminProvider` (authentication state)

---

## Component Reference

### Public Components

#### Navigation (`src/components/Navigation.tsx`)

Sticky top navigation bar with the site logo, navigation links, and a city dropdown selector.

- **Links**: Cities, Calendar, Submit Event, Subscribe, Admin
- **City Dropdown**: Renders a dropdown menu with city options. Clicking a city navigates to its URL slug and updates the CityContext
- **Behavior**: Dropdown closes when clicking outside (via document event listener)

#### Hero (`src/components/Hero.tsx`)

Large hero banner at the top of every public page.

- **Dynamic Content**: Uses `useCity()` to display city-specific or all-Texas messaging
- **SEO**: Renders `SEOHead` with title and description pulled from `cities.ts` config
- **Elements**: Badge ("Live"), heading, subheading, CTA buttons

#### Calendar (`src/components/Calendar.tsx`)

The primary event browsing interface. This is the largest and most complex public component.

- **State**:
  - `events` -- all approved events fetched from Supabase
  - `currentDate` -- the date currently being viewed
  - `calendarMonth` / `calendarYear` -- mini-calendar navigation state
  - `currentView` -- `'day'` (single day) or `'all'` (all upcoming)
  - `searchQuery` -- keyword filter
- **Data Fetching**: Queries the `events` table for `status = 'approved'` and `start_date >= today`, ordered by `start_date` ascending
- **Filtering**:
  - By city (from CityContext)
  - By search query (matches against name, description, group_name, address)
  - By date (in day view)
- **Views**:
  - **Day View**: Shows events for the selected date with left/right date navigation arrows
  - **All Upcoming**: Shows all future events, grouped by city when viewing "All Texas"
- **Mini Calendar Integration**: Passes event dates to MiniCalendar so it can show dots on dates that have events

#### EventCard (`src/components/EventCard.tsx`)

Renders a single event in the calendar list.

- **Props**: `event: Event`, `index: number`
- **Displays**: Event name, date, start/end time, description (truncated to 3 lines), city tag, "View Details" link
- **Animation**: Staggered `fadeUp` animation based on `index`

#### MiniCalendar (`src/components/MiniCalendar.tsx`)

An interactive monthly calendar widget displayed alongside the event list.

- **Props**: `currentDate`, `calendarMonth`, `calendarYear`, `eventDates` (Set of date strings), `onDateSelect`, `onMonthChange`
- **Features**:
  - Full month grid with day-of-week headers
  - Previous/next month navigation
  - "Today" button to jump to current date
  - Green dots below dates that have events
  - Visual highlighting for selected date and today's date

#### CitySelector (`src/components/CitySelector.tsx`)

Row of buttons for filtering events by city.

- **Options**: "All Texas", San Antonio, Austin, Dallas, Houston
- **Behavior**: Updates the CityContext by navigating to the appropriate URL slug

#### CityPreviewSection (`src/components/CityPreviewSection.tsx`)

When viewing "All Texas", this component shows events grouped by city in separate sections.

- **Props**: `events: Event[]`, `cityName: string`
- **Behavior**: Displays up to 6 events per city with a "View all" link if more exist

#### EventSubmission (`src/components/EventSubmission.tsx`)

Public form for submitting new events.

- **Form Fields**:
  - Event Name (required)
  - Start Date and Start Time
  - End Date and End Time
  - Website URL
  - Description
  - Cost (Free / Paid / Both / Unknown)
  - Participation Format (In-Person / Virtual / Hybrid)
  - City (required, dropdown)
  - Address, ZIP Code
  - Organization Name
  - Part of Town
- **Behavior**: Inserts the event with `status: 'pending'` so it requires admin approval before appearing on the calendar
- **Feedback**: Shows success or error message for 5 seconds after submission

#### SubmitEventPage (`src/components/SubmitEventPage.tsx`)

Page wrapper that renders Navigation, a hero section, the EventSubmission form, and the Footer.

#### SEOHead (`src/components/SEOHead.tsx`)

Dynamically updates the document's `<title>` and Open Graph meta tags.

- **Props**: `title: string`, `description: string`
- **Updates**: `document.title`, `meta[name="description"]`, `meta[property="og:title"]`, `meta[property="og:description"]`

#### EventAssistantBanner (`src/components/EventAssistantBanner.tsx`)

Promotional banner for an upcoming AI event assistant feature with email signup.

- **Behavior**: Validates email, inserts into `assistant_waitlist` table, handles duplicate emails gracefully (shows success)
- **States**: idle, loading, success, error

#### FAQ (`src/components/FAQ.tsx`)

Accordion-style frequently asked questions.

- **Contains**: 7 pre-defined Q&A items
- **Behavior**: Click to expand/collapse. Plus/minus icon toggle.

#### SocialProof (`src/components/SocialProof.tsx`)

Displays static statistics (500+ events/month, 5000+ subscribers, 800+ organizations) and three testimonial cards with 5-star ratings.

#### Footer (`src/components/Footer.tsx`)

Site footer with city links, event assistant CTA, copyright notice, and disclaimer about event data accuracy.

---

### Admin Components

#### AdminPanel (`src/components/admin/AdminPanel.tsx`)

Top-level admin container. Checks `isAuthenticated` from AdminContext and renders either `AdminLogin` or the full admin dashboard.

- **Layout**: Header with logout button, then stacked sections for Dashboard, Pending Events, Clear Past Events, CSV Upload, and Event Preview
- **State**: Manages the `events` array that flows between CSVUpload and EventPreview

#### AdminLogin (`src/components/admin/AdminLogin.tsx`)

Simple password input form.

- **Behavior**: Calls `login(password)` from AdminContext. Shows error message on failure, clears password field.

#### AdminDashboard (`src/components/admin/AdminDashboard.tsx`)

Overview panel showing:

- **Total event count** in the database
- **Per-city event counts** (San Antonio, Austin, Dallas, Houston)
- **Upload history table** showing the last 20 uploads with: timestamp, event count, cities, source (csv/tsv/paste), and notes
- **Refresh button** with spinning animation during reload

#### PendingEvents (`src/components/admin/PendingEvents.tsx`)

Lists all events with `status = 'pending'` for review.

- **Actions per event**: Approve (sets status to `'approved'`) or Reject (sets status to `'rejected'`)
- **Displays**: Event name, organization, date/time, address, website, cost/participation badges
- **Behavior**: Removes the event from the list immediately after action

#### ClearPastEvents (`src/components/admin/ClearPastEvents.tsx`)

Danger zone for deleting all events from the database.

- **Workflow**: Click "Delete All Events" -> Confirmation dialog with warning -> Calls edge function `admin-operations` with `delete_all` action
- **Auth**: Sends admin password to the edge function for verification

#### CSVUpload (`src/components/admin/CSVUpload.tsx`)

Bulk event import interface.

- **Input Methods**:
  - Drag and drop file(s)
  - File browser (accepts .csv and .tsv)
  - Paste text area (for copying from Excel/Google Sheets)
- **Processing**: Auto-detects CSV vs TSV format, parses with `csvParser.ts`, validates each event
- **Output**: Calls `onEventsLoaded` callback with parsed events, passing them to EventPreview

#### EventPreview (`src/components/admin/EventPreview.tsx`)

Displays parsed events before publishing.

- **Features**:
  - Valid/invalid event counts
  - Edit form for individual events (inline editing of all fields)
  - Delete individual events
  - Clear all button
  - "Publish All Valid Events" button
- **Publishing**: Inserts valid events into the `events` table and records the batch in `upload_history`

---

## Context Providers

### CityContext (`src/contexts/CityContext.tsx`)

Manages the currently selected city for filtering events.

- **Type**: `City | 'All'` where `City` is `'San Antonio' | 'Austin' | 'Dallas' | 'Houston'`
- **Reads from URL**: Uses `useParams()` to read `citySlug` from the route and converts it to a city name via `getCityBySlug()`
- **Updates URL**: `setSelectedCity()` navigates to the corresponding route (e.g., `/san-antonio` or `/` for "All")
- **Hook**: `useCity()` returns `{ selectedCity, setSelectedCity }`

### AdminContext (`src/contexts/AdminContext.tsx`)

Manages admin authentication state.

- **State**: `isAuthenticated: boolean` (persisted in `localStorage` under key `'admin_auth'`)
- **Functions**:
  - `login(password)`: Validates against the hardcoded admin password. Returns true/false.
  - `logout()`: Clears auth state and localStorage
  - `getAdminPassword()`: Returns the password string if authenticated (used by edge function calls)
- **Hook**: `useAdmin()` returns `{ isAuthenticated, login, logout, getAdminPassword }`

---

## Library and Utility Files

### supabase.ts (`src/lib/supabase.ts`)

- **Exports**:
  - `supabase` -- singleton Supabase client instance created with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  - `CITIES` -- array of the four supported city names
  - `Event` -- TypeScript type matching the `events` table schema

### utils.ts (`src/lib/utils.ts`)

Date and time utility functions:

| Function | Input | Output | Example |
|----------|-------|--------|---------|
| `parseDate(dateString)` | `"2026-03-15"` | `Date` object | Parses YYYY-MM-DD strings |
| `formatDate(date)` | `Date` | `"Saturday, March 15"` | Full day and month format |
| `formatShortDate(date)` | `Date` | `"Sat. Mar 15"` | Abbreviated format |
| `dateKey(date)` | `Date` | `"2026-03-15"` | YYYY-MM-DD string key |
| `parseTime(timeString)` | `"9:00 AM"` | `{hours: 9, minutes: 0}` | Parses 12-hour time strings |
| `sortEventsByTime(events)` | `Event[]` | `Event[]` | Sorts by start_time ascending |

### cities.ts (`src/lib/cities.ts`)

City configuration and SEO metadata:

- **`CITY_CONFIGS`**: Array of 4 city config objects, each containing:
  - `slug` -- URL path segment (e.g., `"san-antonio"`)
  - `name` -- Display name (e.g., `"San Antonio"`)
  - `seoTitle` -- Page title for SEO
  - `seoDescription` -- Meta description for SEO
  - `h1` -- Main heading text
  - `heroSub` -- Hero subheading text
- **`HOME_SEO`**: SEO metadata for the home page (All Texas view)
- **Functions**:
  - `getCityBySlug(slug)` -- Returns city name from URL slug, or null
  - `getSlugForCity(city)` -- Returns URL slug from city name
  - `getCityConfig(slug)` -- Returns full config object for a city slug

### csvParser.ts (`src/lib/csvParser.ts`)

CSV and TSV parsing for bulk event import:

- **`EventInput`** type: All Event fields except `id`, `created_at`, `updated_at`
- **Column Mapping**: Supports multiple column name variations per field:
  - `name` / `event_name` / `title` -> `name`
  - `start_date` / `date` / `event_date` -> `start_date`
  - And so on for all fields
- **Functions**:
  - `convertDateToISO(dateStr)` -- Normalizes various date formats to YYYY-MM-DD
  - `splitCSVIntoRows(text)` -- Splits CSV text respecting quoted fields
  - `mapRowToEvent(headers, values)` -- Maps a CSV row to an EventInput object
  - `parseCSV(csvText)` -- Full CSV parser
  - `parseTSV(tsvText)` -- TSV parser (converts tabs, delegates to CSV parser)
  - `validateEvent(event)` -- Returns array of validation error strings (requires name and start_date at minimum)
- **Defaults Applied**: `paid = 'Unknown'`, `participation = 'In-Person'`, `status = 'approved'`

---

## Database Schema

The database runs on PostgreSQL via Supabase. There are three tables.

### events

The primary data table storing all event information.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | uuid | PRIMARY KEY | `gen_random_uuid()` | Unique identifier |
| `name` | text | NOT NULL | -- | Event name |
| `start_date` | date | NOT NULL | -- | Event start date (YYYY-MM-DD) |
| `start_time` | text | | -- | Start time (e.g., "9:00 AM") |
| `end_date` | date | | -- | Event end date |
| `end_time` | text | | -- | End time |
| `website` | text | | -- | Event URL |
| `description` | text | | -- | Event description |
| `paid` | text | | `'Unknown'` | Cost: Free, Paid, Both, Unknown |
| `address` | text | | -- | Physical address |
| `zipcode` | text | | -- | ZIP code |
| `group_name` | text | | -- | Organizing group or company |
| `participation` | text | | `'In-Person'` | Format: In-Person, Virtual, Hybrid |
| `part_of_town` | text | | -- | Area description |
| `city_calendar` | text | | -- | City: San Antonio, Austin, Dallas, Houston |
| `status` | text | | `'pending'` | Workflow: pending, approved, rejected |
| `created_at` | timestamptz | | `now()` | Record creation time |
| `updated_at` | timestamptz | | `now()` | Auto-updated by trigger |

**Indexes:**
- `idx_events_start_date` on `start_date`
- `idx_events_status` on `status`

**Trigger:**
- `update_updated_at` -- automatically sets `updated_at` to `now()` on every row update

### assistant_waitlist

Stores email signups for the upcoming AI event assistant feature.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | uuid | PRIMARY KEY | `gen_random_uuid()` | Unique identifier |
| `email` | text | UNIQUE, NOT NULL | -- | Subscriber email |
| `created_at` | timestamptz | | `now()` | Signup timestamp |

### upload_history

Tracks bulk CSV/TSV upload batches for the admin dashboard.

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | uuid | PRIMARY KEY | `gen_random_uuid()` | Unique identifier |
| `event_count` | integer | NOT NULL | -- | Number of events in the batch |
| `cities` | text[] | | -- | Array of city names in the batch |
| `source` | text | | -- | Upload method: csv, tsv, paste |
| `notes` | text | | -- | Optional notes about the upload |
| `uploaded_at` | timestamptz | | `now()` | Upload timestamp |

**Index:**
- `idx_upload_history_uploaded_at` on `uploaded_at`

---

## Row Level Security Policies

All three tables have RLS enabled. Below are the active policies.

### events

| Policy Name | Operation | Role | Rule |
|-------------|-----------|------|------|
| Anon can view all events | SELECT | anon | Allows reading all events (needed for admin panel which uses client-side auth) |
| Authenticated can view approved events | SELECT | authenticated | `status = 'approved'` |
| Anon can insert events with valid data | INSERT | anon | Validates that `name`, `start_date`, and `status` are not null |
| Authenticated can submit pending events | INSERT | authenticated | Forces `status = 'pending'` |
| Anon can update event status | UPDATE | anon | Allows status field changes only |

### assistant_waitlist

| Policy Name | Operation | Role | Rule |
|-------------|-----------|------|------|
| Anyone can join the waitlist | INSERT | anon | Open insert for email signups |
| Authenticated users can view waitlist | SELECT | authenticated | Read access for authenticated users |

### upload_history

| Policy Name | Operation | Role | Rule |
|-------------|-----------|------|------|
| Anon can insert upload history | INSERT | anon | Requires `event_count > 0` |
| Anon can read upload history | SELECT | anon | Limited to records from the last year |

---

## Migration History

Migrations are applied in chronological order. Each builds on the previous state.

| # | Filename | Purpose |
|---|----------|---------|
| 1 | `20260213000018_create_events_table.sql` | Creates the `events` table with core columns, indexes, RLS, and the `update_updated_at` trigger |
| 2 | `20260213003623_allow_anon_event_inserts.sql` | Adds INSERT policy for anonymous users so the public submission form works |
| 3 | `20260213003945_add_pending_event_management_policies.sql` | Adds SELECT, UPDATE, DELETE policies for anonymous role to support admin panel operations |
| 4 | `20260213011942_add_city_calendar_column.sql` | Adds the `city_calendar` text column for multi-city support |
| 5 | `20260213013917_create_assistant_waitlist_table.sql` | Creates the `assistant_waitlist` table with email uniqueness and RLS |
| 6 | `20260213041114_fix_rls_security_issues.sql` | Consolidates and tightens RLS policies, fixes function `search_path` for the trigger |
| 7 | `20260213045747_add_delete_past_events_policy.sql` | Adds a DELETE policy restricted to past-dated events |
| 8 | `20260213050209_update_delete_all_events_policy.sql` | Broadens the DELETE policy to all events (for admin bulk delete) |
| 9 | `20260213050933_remove_insecure_delete_policy.sql` | Removes the unrestricted DELETE policy (bulk delete now handled by edge function with service role) |
| 10 | `20260214190241_create_upload_history_table.sql` | Creates the `upload_history` table for tracking CSV upload batches |

---

## Edge Functions

### admin-operations

**Location**: `supabase/functions/admin-operations/index.ts`

A Deno-based Supabase Edge Function that performs privileged admin operations using the service role key (bypasses RLS).

**Endpoint**: `POST` or `DELETE` to `{SUPABASE_URL}/functions/v1/admin-operations`

**Authentication**: Requires the admin password in the request body. The function validates it against the `ADMIN_PASSWORD` environment variable.

**Actions**:

| Action | Method | Body | Description |
|--------|--------|------|-------------|
| `delete_all` | POST/DELETE | `{ "action": "delete_all", "password": "..." }` | Deletes all rows from the `events` table |
| `delete_event` | POST/DELETE | `{ "action": "delete_event", "password": "...", "event_id": "uuid" }` | Deletes a single event by ID |

**Response Format**:
```json
{
  "success": true,
  "message": "Deleted X events",
  "count": 42
}
```

**CORS**: Allows all origins with GET, POST, DELETE methods.

**Environment Variables Used** (automatically available in Supabase):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

---

## CSS Architecture and Design System

All styles live in `src/index.css` using custom CSS (not Tailwind utility classes). The file defines CSS custom properties and component-specific styles.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--navy` | `#0056b3` | Primary brand color |
| `--navy-dark` | `#004494` | Darker navy for hover states |
| `--navy-mid` | `#1a75d2` | Lighter navy variant |
| `--blue` | `#2563eb` | Accent blue |
| `--sky` | `#e8f0fe` | Light blue backgrounds |
| `--gold` | `#d4a843` | Secondary accent |
| `--gold-bright` | `#efc75e` | Bright gold accent |
| `--green` | `#16a34a` | Success states |
| `--gray-50` through `--gray-800` | Various | Neutral scale |

### Spacing and Sizing

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `12px` | Default border radius |
| `--radius-sm` | `8px` | Small border radius |
| `--radius-xs` | `6px` | Extra-small border radius |
| `--shadow` | subtle | Default box shadow |
| `--shadow-md` | medium | Medium elevation shadow |
| `--shadow-lg` | large | High elevation shadow |

### Component Class Conventions

The CSS uses a component-prefix naming convention:

| Prefix | Component | Examples |
|--------|-----------|---------|
| `.nav-` | Navigation | `.nav-logo`, `.nav-links`, `.nav-dropdown-menu` |
| `.hero-` | Hero | `.hero-badge`, `.hero-cities` |
| `.cal-` | Calendar | `.cal-section`, `.cal-controls` |
| `.ev-` | Event Card | `.ev-card`, `.ev-card-head`, `.ev-city-tag` |
| `.city-sel-` | City Selector | `.city-sel-btns` |
| `.mc-` | Mini Calendar | `.mc-table`, `.mc-td-sel`, `.mc-td-today` |
| `.cps-` | City Preview Section | `.cps-header`, `.cps-events` |
| `.form-` | Forms | `.form-group`, `.form-row`, `.form-message` |
| `.admin-` | Admin Panel | `.admin-header`, `.admin-section` |
| `.dash-` | Dashboard | `.dash-stats`, `.dash-history` |
| `.pending-` | Pending Events | `.pending-card`, `.pending-actions` |
| `.btn-` | Buttons | `.btn-gold`, `.btn-secondary`, `.btn-danger` |

### Animations

| Name | Usage |
|------|-------|
| `pulse` | Badge dot pulsing effect |
| `dropIn` | Dropdown menu entrance |
| `fadeUp` | Staggered event card appearance |
| `dashSpin` | Refresh button rotation |

### Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| `max-width: 768px` | Tablet and below |
| `max-width: 640px` | Mobile (stats grid) |
| `max-width: 500px` | Small mobile (navigation) |

---

## Key Data Flows

### 1. Event Display Flow

```
User visits site
  -> App.tsx routes to MainLayout
  -> CityContext reads city from URL
  -> Calendar.tsx fetches approved events from Supabase
  -> Events filtered by city (from context) and search query
  -> Day view: filtered by selected date
  -> All view: grouped by city via CityPreviewSection
  -> EventCard renders each event with staggered animation
```

### 2. Public Event Submission Flow

```
User navigates to /submit
  -> SubmitEventPage renders EventSubmission form
  -> User fills required fields (name, city) and optional details
  -> Form submits to Supabase with status='pending'
  -> Success message displayed
  -> Event awaits admin review in PendingEvents
```

### 3. Admin Event Approval Flow

```
Admin navigates to /admin
  -> AdminLogin validates password via AdminContext
  -> AdminPanel renders PendingEvents section
  -> PendingEvents fetches events where status='pending'
  -> Admin clicks Approve -> status set to 'approved' (event now visible)
  -> Admin clicks Reject -> status set to 'rejected' (event hidden)
```

### 4. CSV Bulk Upload Flow

```
Admin opens CSV Upload section
  -> Drops file(s) or pastes spreadsheet data
  -> csvParser detects format (CSV vs TSV)
  -> Parser maps columns, normalizes dates, applies defaults
  -> validateEvent checks each row
  -> CSVUpload passes parsed events to EventPreview
  -> Admin reviews, edits, or deletes individual events
  -> "Publish All" inserts valid events into events table
  -> Upload batch recorded in upload_history table
```

### 5. Bulk Delete Flow

```
Admin clicks "Delete All Events" in ClearPastEvents
  -> Confirmation dialog appears with warning
  -> Admin confirms
  -> Frontend calls admin-operations edge function
  -> Edge function validates admin password
  -> Uses service role key to delete all events (bypasses RLS)
  -> Returns count of deleted events
```

### 6. AI Assistant Waitlist Signup

```
User enters email in EventAssistantBanner
  -> Email validated on client
  -> Inserted into assistant_waitlist table
  -> Duplicate emails handled gracefully (shows success)
  -> Success confirmation displayed
```

---

## Security Notes

### Authentication Model

The admin panel uses **client-side password authentication**. There is no server-side session or JWT-based auth for admin access. The admin password is validated in the AdminContext and stored in localStorage.

For destructive operations (bulk delete), the edge function provides a second layer of verification by requiring the password in the request body and validating it against a server-side environment variable.

### Row Level Security

- All tables have RLS enabled
- Public visitors can only read approved events
- The anon role is used for both public visitors and the admin panel (since admin auth is client-side)
- The edge function uses the **service role key** to bypass RLS for admin delete operations

### Data Validation

- Public event submissions require `name` and `city_calendar` on the frontend
- RLS INSERT policies validate that `name`, `start_date`, and `status` are not null
- CSV imports validate that each event has at least a `name` and `start_date`

### Known Limitations

- Admin password is stored in the frontend source code (AdminContext)
- Client-side auth means the admin panel's read access relies on the anon role having SELECT access to all events
- No rate limiting on the public submission form or waitlist signup

---

## Environment Variables Reference

### Client-Side (Vite -- prefixed with VITE_)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public API key |

### Server-Side (Edge Function -- auto-populated by Supabase)

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key (full database access) |
| `SUPABASE_ANON_KEY` | Yes | Anonymous API key |
| `SUPABASE_DB_URL` | Yes | Direct PostgreSQL connection string |

---

*This document was generated as a complete reference for the Texas Business Calendars project. For questions or contributions, refer to the codebase and migration files for the most up-to-date implementation details.*
