// Sub-calendar feature flag.
//
// Sub-calendars are the per-category city pages, e.g. /texas/austin/technology,
// /texas/dallas/real-estate, etc. (5 categories x 4 cities = 20 pages).
//
// Set to `true` to bring sub-calendars back live. When `true`:
//  - the 20 sub-calendar pages render normally again
//  - re-add their entries to public/sitemap.xml (search "SUB-CAL" comments)
//  - re-enable their links in Footer.tsx and the city page components
//    (search "SUB-CAL" comments)
//  - re-enable sub-calendar newsletter sends in
//    app/api/send-newsletter/route.ts and app/api/cron/monday-reminder/route.ts
//    (search "SUB-CAL" comments)
//
// When `false`, hitting a sub-calendar URL directly redirects to the parent
// city page (e.g. /texas/austin/technology -> /texas/austin), so nothing 404s
// but the content is not publicly browsable or linked anywhere.
export const SUB_CALENDARS_ENABLED = false;
