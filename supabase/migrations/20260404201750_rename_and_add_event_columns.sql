/*
  # Rename and Add Columns to Events Table

  1. Renamed Columns
    - `group_name` → `org_name` (organization name)
    - `group_type` → `org_type` (organization type/category)

  2. New Columns Added
    - `org_id` (text, nullable) — unique ID linking event to its host organization
    - `event_type` (text, nullable) — VA classification: Networking, Education, Combination
    - `event_city` (text, nullable) — city name the event is in
    - `state` (text, nullable) — state the event is in
    - `source` (text, nullable) — who inputted the event: Jovelyn, Michael, Matthew, Rebecca
    - `notes` (text, nullable) — internal notes about the event
    - `internal_type` (text, nullable) — publishing status: Active, Preview, Archived

  3. Notes
    - All renames use ALTER TABLE ... RENAME COLUMN (non-destructive)
    - New columns are nullable to avoid breaking existing rows
    - No data is dropped or deleted
*/

ALTER TABLE events RENAME COLUMN group_name TO org_name;
ALTER TABLE events RENAME COLUMN group_type TO org_type;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'org_id'
  ) THEN
    ALTER TABLE events ADD COLUMN org_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'event_type'
  ) THEN
    ALTER TABLE events ADD COLUMN event_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'event_city'
  ) THEN
    ALTER TABLE events ADD COLUMN event_city text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'state'
  ) THEN
    ALTER TABLE events ADD COLUMN state text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'source'
  ) THEN
    ALTER TABLE events ADD COLUMN source text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'notes'
  ) THEN
    ALTER TABLE events ADD COLUMN notes text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'internal_type'
  ) THEN
    ALTER TABLE events ADD COLUMN internal_type text;
  END IF;
END $$;
