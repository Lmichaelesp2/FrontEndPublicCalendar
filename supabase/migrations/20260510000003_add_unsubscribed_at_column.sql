-- Track when a subscriber unsubscribed for compliance/analytics
alter table newsletter_subscriptions
  add column if not exists unsubscribed_at timestamptz default null;
