# Texas Business Calendars — Setup & Maintenance Guide
**Last Updated: April 2026**

---

## What This App Is

A public-facing website showing business events across four Texas cities — San Antonio, Austin, Dallas, and Houston. Each city has a main calendar page plus sub-calendar pages by category:

- Technology
- Real Estate
- Small Business
- Networking
- Chambers

Events live in a Supabase database and display automatically. You don't manage events one by one — you run a cleaning script and upload the results.

---

## How Everything Connects

```
Source Supabase (raw data)
        ↓
Export 2 CSV files (events + organizations)
        ↓
Upload to Claude in Cowork
        ↓
Cleaning script runs (process_events_orgs.py)
        ↓
Clean city CSV files produced
        ↓
Upload to Calendar Supabase
        ↓
Website updates automatically
```

### Key File Locations

| File | Location |
|------|----------|
| Cleaning script | `Projects → Bolt.new AI Event assistant → CSV Pipeline → process_events_orgs.py` |
| Clean output files | `Projects → calendar_events_san_antonio.csv`, `calendar_events_austin.csv`, etc. |
| Upload-ready files | `Projects → san_antonio_upload_ready.csv`, `austin_upload_ready.csv`, etc. |
| App code | `FrontEndPublicCalendar` folder on your Mac |
| This guide | `FrontEndPublicCalendar/CALENDAR_APP_SETUP_AND_MAINTENANCE.md` |

---

## Monthly Update Process

### Step 1 — Export Raw Data from Source Supabase
1. Go to your source Supabase project (the one with all your organizations)
2. Run the 4-week window SQL export query for events
3. Download as CSV
4. Do the same for organizations
5. You need BOTH files — events AND organizations

> ⚠️ The cleaning script needs the organizations file to assign event categories. Without it, all events will be uncategorized.

### Step 2 — Upload Raw Files to Claude in Cowork
1. Open Cowork, go to the **Event and organizational enhancement** project
2. Tell Claude: "I have new events to process" and drag both CSV files into the chat
3. Claude runs the cleaning script and produces clean city files automatically

### Step 3 — Upload Clean Files to Calendar Supabase
**Calendar Supabase URL:** https://supabase.com/dashboard/project/qpcfmygdzvohwjshtfxa

1. Open the SQL editor and delete old events for the city you're updating:
   ```sql
   DELETE FROM events WHERE city_calendar = 'San Antonio';
   ```
   Repeat for each city: Austin, Dallas, Houston

2. Go to **Table Editor → events table**
3. Click **Insert → Import data from CSV**
4. Upload `san_antonio_upload_ready.csv` (use the `*_upload_ready.csv` files — NOT the `calendar_events_*.csv` files)
5. Repeat for each city

### Step 4 — Verify It Worked
Run this SQL to confirm all cities and categories loaded:
```sql
SELECT city_calendar, event_category, COUNT(*) as total
FROM events
GROUP BY city_calendar, event_category
ORDER BY city_calendar, total DESC;
```

Then open the website and check a few sub-calendar pages visually.

---

## How Event Categories Are Assigned

Events don't come with categories. The cleaning script figures it out automatically using two methods:

**Method 1 — Organization Match (most accurate)**
If the event's host organization is in your organizations database, the event inherits that org's category. Example: Greater SA Chamber hosts an event → category = Chambers.

**Method 2 — Keyword Matching (fallback)**
For events from Meetup, Eventbrite, etc. where the host isn't in your database, the script reads the title and description and guesses based on keywords:
- "Tech", "AI", "software", "developer" → Technology
- "Realtor", "property", "MLS", "listing" → Real Estate
- And so on

**Events with no category** show on main city pages but NOT on sub-calendar pages. Improve this over time by adding more organizations to the source database.

---

## Important Settings

### Calendar Supabase (the app's database)
- **URL:** https://supabase.com/dashboard/project/qpcfmygdzvohwjshtfxa
- This is **separate** from your source/main Supabase project
- Row Level Security is ON — events must have `status = approved` or `active` to show
- Key columns: `name`, `start_date`, `city_calendar`, `event_category`, `status`, `org_name`

### Calendar App Behavior
- **City pages** (San Antonio, Austin, etc.) → show ONE day at a time, left/right arrows to navigate, mini month picker to jump to a date
- **Sub-calendar pages** (Technology, Real Estate, etc.) → show a FULL WEEK of events
- Events are fetched from Supabase: today through 60 days forward
- App runs locally on your Mac via `npm run dev` in the FrontEndPublicCalendar folder
- GitHub repo: **PublicCalendarV2**

### The Cleaning Script
- Outputs `status = approved` (compatible with Supabase security rules)
- Skips past events automatically
- Renames `group_name` → `org_name` to match the Supabase column names

### .env.local File (never delete this)
Located in the FrontEndPublicCalendar folder. Contains:
```
NEXT_PUBLIC_SUPABASE_URL=https://qpcfmygdzvohwjshtfxa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_wsMhwrZFVm0WHSM0wt2o8Q_Q9wB6Q2-
```
If the app stops loading events, check this file exists and has these values.

---

## What Was Fixed in April 2026

These problems are already solved — listed here so you understand what was done.

| Problem | Fix |
|---------|-----|
| App not loading events (placeholder URL) | Removed fake fallback URL from code |
| Mini calendar clicks not updating events | Fixed EventGate to pass selected date to Calendar |
| Today button not working | Fixed MonthCalendar to trigger event list refresh |
| Sub-calendars showing no events | Uploaded cleaned CSVs with correct event_category values |
| City pages showing full week instead of one day | Added day-by-day navigation with arrows and month picker |
| Sub-calendars in day mode instead of week mode | Set weekMode=true for all sub-calendar pages |
| New events blocked by Supabase security | Updated RLS policy to allow both `approved` and `active` status |
| CSV column mismatch on import | Renamed `group_name` → `org_name` in upload-ready files |

---

## Quick Reference — Common Problems

**Sub-calendar shows no events**
Run in Supabase SQL editor:
```sql
SELECT event_category, COUNT(*) FROM events GROUP BY event_category;
```
If the category has 0 rows, the data wasn't uploaded or the category name doesn't match exactly.

**Event showing in wrong sub-calendar**
The host organization has the wrong category in your source database. Update it, re-export, re-run the pipeline, re-upload.

**Website stops loading events**
Check the `.env.local` file in the FrontEndPublicCalendar folder still exists with the correct Supabase URL and key (see above).

**Adding a new city**
Tell Claude in Cowork. Requires: (1) adding the city to the pipeline script, (2) creating new page files in the app code, (3) uploading the city's events to Supabase.

**Need to push code changes to GitHub**
Open Terminal, navigate to the FrontEndPublicCalendar folder, and run `git push`.

---

## Current Event Counts (April 2026)

| City | Total | Technology | Real Estate | Small Business | Networking | Chambers | No Category |
|------|-------|------------|-------------|----------------|------------|----------|-------------|
| San Antonio | 208 | 14 | 67 | 49 | 15 | 44 | 19 |
| Austin | 185 | 6 | 26 | 55 | 34 | 4 | 60 |
| Dallas | 293 | 6 | 29 | 56 | 81 | 9 | 112 |
| Houston | 308 | 11 | 31 | 41 | 67 | 12 | 146 |

---

*This guide is maintained by Claude in Cowork. Ask Claude to update it whenever something changes.*
