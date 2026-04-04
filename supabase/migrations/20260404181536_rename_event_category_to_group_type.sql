/*
  # Rename event_category column to group_type

  ## Changes
  - Renames the `event_category` column on the `events` table to `group_type`

  ## Notes
  - This is a non-destructive rename; all existing data is preserved
  - Any indexes or policies referencing event_category will need to be reviewed
*/

ALTER TABLE events RENAME COLUMN event_category TO group_type;
