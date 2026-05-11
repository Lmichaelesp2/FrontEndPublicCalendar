-- Add sub_calendar to newsletter_sends so each list is tracked independently
-- NULL = city-wide send, 'Networking' / 'Technology' / etc. = sub-cal send

alter table newsletter_sends
  add column if not exists sub_calendar text default null;

-- Update the index to cover city + sub_calendar + date for cap lookups
drop index if exists newsletter_sends_city_date_idx;

create index if not exists newsletter_sends_city_subcal_date_idx
  on newsletter_sends (city, sub_calendar, send_date);
