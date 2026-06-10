# CLAUDE.md — LBC Front-End Project Context

Read this first in every session before making any changes.

---

## What This Repo Is

This is the localbusinesscalendar.com (no S) front-end — a public-facing Next.js calendar site showing business and networking events across San Antonio, Austin, Dallas, and Houston, Texas.

- Live URL: https://www.localbusinesscalendar.com
- GitHub: https://github.com/Lmichaelesp2/FrontEndPublicCalendar
- Vercel org: local-business-calendars
- Local path: /Users/michaelespinoza/Documents/Claude/Projects/|| 2026 Business Calendars websites/lbc-work
- Deploy: push to main branch, Vercel auto-deploys in ~60 seconds

---

## The Two Separate Products — CRITICAL

### 1. localbusinesscalendars.app (with S, .app)
- The premium calendar app — live, paying users
- Fed by: Jovelyn via Retool → public.events → Review tab → events_published
- DO NOT touch this pipeline ever.

### 2. localbusinesscalendar.com (no S, .com) — THIS REPO
- The new public front-end
- Reads from: events_published_view in Supabase (lbc project)
- Events inserted into events_published directly by Claude each week

---

## Supabase Database

- Active project: lbc (ID: noilusnecqyveosmqeyl)
- Source table: public.events — Jovelyn pipeline, DO NOT modify
- Front-end table: public.events_published — read via events_published_view
- source_event_id links events_published back to public.events

---

## Weekly Events Pipeline (Claude runs every Sunday)

1. Query public.events for 2-week window, internal_type = 'Current'
2. Check duplicates (name + start_date + start_time + city_calendar) — keep row with group_id
3. Fix missing group_names — derive from event name or URL; use NA if unknown
4. Insert into events_published skipping already-published (check source_event_id)
5. Verify counts match localbusinesscalendars.app per city

---

## Key Files

- src/lib/supabase-server.ts — fetchApprovedEvents(), fetchThisWeekCounts()
- src/lib/utils.ts — getCurrentWeekRange(), getTwoWeekRange(), date helpers
- src/components/EventGate.tsx — controls date window on city pages
- app/texas/[city]/page.tsx — city page server components

---

## How Claude Makes Code Changes

1. curl raw.githubusercontent.com to read files
2. Give Louis exact terminal commands
3. Louis runs: git add, git commit, git push
4. Vercel auto-deploys

Claude cannot write to Louis's local filesystem directly.

---

## What NOT To Do

- Do not use Bolt.new
- Do not modify public.events or the Retool/Jovelyn pipeline
- Do not touch localbusinesscalendars.app

---

Last updated: June 10, 2026
