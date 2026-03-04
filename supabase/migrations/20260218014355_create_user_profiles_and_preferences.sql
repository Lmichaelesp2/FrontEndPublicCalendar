/*
  # User Profiles and Preferences System

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key) - References auth.users
      - `email` (text, required) - User email
      - `subscription_tier` (text) - 'free' or 'premium'
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `user_preferences`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid, foreign key) - References user_profiles
      - `category` (text, required) - Event category preference
      - `city` (text) - Preferred city filter
      - `participation_type` (text) - 'In-Person', 'Virtual', 'Hybrid'
      - `cost_preference` (text) - 'Free', 'Paid', 'Both'
      - `created_at` (timestamptz) - Creation timestamp
    
    - `event_categories`
      - `id` (uuid, primary key) - Unique identifier
      - `event_id` (uuid, foreign key) - References events
      - `category` (text, required) - Category name
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all new tables
    - Users can only read/update their own profiles and preferences
    - Anyone can read event categories (public data)
    - Only authenticated users can manage their own data

  3. Indexes
    - Add indexes for faster queries on user_id and category lookups
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  subscription_tier text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  city text,
  participation_type text,
  cost_preference text,
  created_at timestamptz DEFAULT now()
);

-- Create event_categories table
CREATE TABLE IF NOT EXISTS event_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for event_categories
CREATE POLICY "Anyone can view event categories"
  ON event_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert event categories"
  ON event_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_category ON user_preferences(category);
CREATE INDEX IF NOT EXISTS idx_event_categories_event_id ON event_categories(event_id);
CREATE INDEX IF NOT EXISTS idx_event_categories_category ON event_categories(category);

-- Create updated_at trigger for user_profiles
CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
