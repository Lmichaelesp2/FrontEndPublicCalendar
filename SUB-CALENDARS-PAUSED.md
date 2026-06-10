# Sub-Calendars — Temporarily Hidden (paused 2026-06-09)

The 20 sub-calendar pages (5 categories × 4 cities: technology, real-estate,
chamber, networking, small-business) are hidden from the public while not
ready for launch.

## What was changed

1. **`src/lib/subCalendars.ts`** — new file. `SUB_CALENDARS_ENABLED = false`
   is the single switch controlling everything below.

2. **20 page files** at `app/texas/{city}/{category}/page.tsx` — each now
   redirects to `/texas/{city}` and sets `robots: noindex` when the flag is
   off. Direct links/bookmarks land on the city's main page, no 404s.

3. **`src/components/Footer.tsx`** — the per-city "Technology / Real Estate /
   Chamber / Small Business" footer links are hidden when the flag is off
   (falls back to the normal "More Coming Soon" footer).

4. **City pages** (`AustinPage.tsx`, `DallasPage.tsx`, `HoustonPage.tsx`,
   `SanAntonioPage.tsx`) — the "EVENT TYPES" hero panel tags (Chamber,
   Technology, Real Estate, Small Business) become plain text instead of
   links when the flag is off.

5. **`public/sitemap.xml`** — the 20 sub-calendar URLs were removed entirely.

6. **`app/api/send-newsletter/route.ts`** — requests with a `subCalendar`
   param are rejected (503) while the flag is off, so no emails point people
   at hidden pages.

## How to bring sub-calendars back

1. Open `src/lib/subCalendars.ts` and set:
   ```ts
   export const SUB_CALENDARS_ENABLED = true;
   ```

2. Re-add the 20 sub-calendar URLs to `public/sitemap.xml`. Insert a `<url>`
   block for each line below (use the same `<changefreq>`/`<priority>`
   pattern as the other city pages already in the sitemap):

   ```
   https://www.localbusinesscalendars.com/texas/austin/technology
   https://www.localbusinesscalendars.com/texas/austin/real-estate
   https://www.localbusinesscalendars.com/texas/austin/chamber
   https://www.localbusinesscalendars.com/texas/austin/networking
   https://www.localbusinesscalendars.com/texas/austin/small-business
   https://www.localbusinesscalendars.com/texas/dallas/technology
   https://www.localbusinesscalendars.com/texas/dallas/real-estate
   https://www.localbusinesscalendars.com/texas/dallas/chamber
   https://www.localbusinesscalendars.com/texas/dallas/networking
   https://www.localbusinesscalendars.com/texas/dallas/small-business
   https://www.localbusinesscalendars.com/texas/houston/technology
   https://www.localbusinesscalendars.com/texas/houston/real-estate
   https://www.localbusinesscalendars.com/texas/houston/chamber
   https://www.localbusinesscalendars.com/texas/houston/networking
   https://www.localbusinesscalendars.com/texas/houston/small-business
   https://www.localbusinesscalendars.com/texas/san-antonio/technology
   https://www.localbusinesscalendars.com/texas/san-antonio/real-estate
   https://www.localbusinesscalendars.com/texas/san-antonio/chamber
   https://www.localbusinesscalendars.com/texas/san-antonio/networking
   https://www.localbusinesscalendars.com/texas/san-antonio/small-business
   ```

   (Note: the entries removed from sitemap.xml during this change actually
   used the old `businesscalendar.link` domain — use the current live
   domain, `localbusinesscalendars.com`, when re-adding.)

3. Commit and push to `main` (Vercel auto-deploys). That's it — the
   redirects, footer links, hero panel links, and newsletter sends all key
   off the `SUB_CALENDARS_ENABLED` flag and will re-enable automatically.

## Notes

- The underlying sub-calendar page components and routes were **not**
  deleted — only gated. Nothing needs to be rebuilt.
- Search the codebase for `SUB-CAL` comments to find every touchpoint if you
  want to review the changes in detail.
