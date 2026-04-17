/*
  # Add event_category column to events table

  ## Summary
  Adds a new nullable text column `event_category` to the public.events table.

  ## Changes
  - Modified table: `events`
    - New column: `event_category` (text, nullable, default NULL)

  ## Notes
  - Uses IF NOT EXISTS to be safe and idempotent
  - No RLS changes required; existing policies cover this column
*/

ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS event_category text DEFAULT NULL;
