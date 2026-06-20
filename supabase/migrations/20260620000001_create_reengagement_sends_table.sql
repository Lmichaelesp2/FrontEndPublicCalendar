-- reengagement_sends: one-time legacy/free-subscriber re-engagement campaign.
-- Separate from newsletter_sends (which tracks the recurring weekly send).
-- Each row = one successful send to one free_subscribers.id. Used to:
--   1. Guarantee no double-send if the endpoint is re-run
--   2. Track daily volume per "group" (warm vs cold) for the deliverability ramp
--   3. Give a simple per-city / per-group send history for reporting

create table if not exists reengagement_sends (
  id                 bigint generated always as identity primary key,
  free_subscriber_id integer     not null references free_subscribers(id) on delete cascade,
  email              text        not null,
  city               text,
  send_group         text        not null,        -- 'warm' (Group A) or 'cold' (Group B)
  send_date          date        not null,         -- date in CT, used for daily cap
  sent_at            timestamptz not null default now(),
  test_send          boolean     not null default false
);

create unique index if not exists reengagement_sends_unique_subscriber
  on reengagement_sends (free_subscriber_id)
  where test_send = false;

create index if not exists reengagement_sends_date_group_idx
  on reengagement_sends (send_date, send_group);

alter table reengagement_sends enable row level security;

create policy "Service role full access"
  on reengagement_sends
  for all
  using (true)
  with check (true);
