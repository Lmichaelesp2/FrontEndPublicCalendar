/*
  # Add Time of Day Preference to User Preferences

  1. Changes
    - Add `time_of_day` column to `user_preferences` table to store user's preferred event times
      - Can be values like 'Morning', 'Afternoon', 'Evening', 'Anytime'
  
  2. Notes
    - Column is nullable to support existing records
    - No RLS changes needed as existing policies cover this column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'time_of_day'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN time_of_day text;
  END IF;
END $$;