// ─── Feature Flags ───────────────────────────────────────────────────────────
//
// SHOW_SPONSOR_NAV      — Sponsors dropdown in the nav bar (Our Sponsors + Become a Sponsor)
// SHOW_SPONSOR_SECTIONS — Sponsor cards/branding on city pages, Texas layout, submit section
// SHOW_ENM_SECTION      — Event Networking Method section on homepage + city pages
// SHOW_MORE_MENU        — "More" dropdown in the nav bar (hide when Sponsors nav is shown)
// SHOW_SUB_CALENDARS    — Sub-calendar links on subscribe page
// SHOW_EVENT_ASSISTANT  — Event Assistant / premium upsell anywhere it's user-facing:
//                         Pricing page premium tier, /upgrade + /upgrade/success pages,
//                         the in-calendar 30-day upgrade nudge, and FAQ entries that
//                         describe it. Existing premium subscribers and Premium Login
//                         (the separate .app login) are NOT affected by this flag —
//                         this only controls whether NEW signups can be pitched/started.
//                         Set back to true to resume selling Event Assistant.
//
// ─────────────────────────────────────────────────────────────────────────────

export const SHOW_SPONSOR_NAV      = true;   // Sponsors menu item always visible
export const SHOW_SPONSOR_SECTIONS = false;  // page-level sponsor blocks hidden for launch
export const SHOW_ENM_SECTION      = false;
export const SHOW_MORE_MENU        = false;  // More menu hidden while Sponsors menu is shown
export const SHOW_SUB_CALENDARS    = false;  // Sub-calendar links on subscribe page hidden for launch
export const SHOW_EVENT_ASSISTANT  = false;  // Event Assistant paused — see note above
export const SHOW_TRAINING_NAV     = false;  // Training link — hidden until ready to launch
export const SHOW_CHALLENGE_NAV    = false;  // Networking Challenge link — hidden until ready to launch
