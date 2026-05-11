-- newsletter_sends: tracks every manual or automated newsletter send
-- Used for: SA ramp-up daily cap enforcement, send history, analytics

create table if not exists newsletter_sends (
  id          bigint generated always as identity primary key,
  city        text        not null,
  send_date   date        not null,          -- date in CT (used for daily cap)
  count_sent  integer     not null default 0,
  event_count integer     not null default 0,
  week_start  date,
  week_end    date,
  sent_at     timestamptz not null default now()
);

-- Index for quick "how many sent today for SA?" lookups
create index if not exists newsletter_sends_city_date_idx
  on newsletter_sends (city, send_date);

-- RLS: only service-role can insert/read (admin panel uses service role key)
alter table newsletter_sends enable row level security;

-- No anon access needed — API route uses service role key directly
create policy "Service role full access"
  on newsletter_sends
  for all
  using (true)
  with check (true);
