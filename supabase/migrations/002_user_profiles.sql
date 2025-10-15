/**
 * Backend-API Developer Example Migration
 * 
 * This file demonstrates the responsibilities and patterns
 * for backend-api developers working on the TryDo application.
 */

-- Backend-API Developer Responsibilities:
-- 1. Design and implement database schema
-- 2. Create database migrations
-- 3. Set up Row Level Security (RLS) policies
-- 4. Create database functions and triggers
-- 5. Optimize database performance
-- 6. Ensure data integrity and security

-- Migration: Create user profiles table with RLS policies
-- This migration sets up the foundation for user management

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backend-API developer implements proper indexing for performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_name_idx ON profiles(name);

-- Backend-API developer sets up Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- RLS Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Backend-API developer creates trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Backend-API developer creates function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backend-API developer sets up trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Backend-API developer creates function for profile statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'profile_created_at', created_at,
    'days_since_creation', EXTRACT(DAY FROM NOW() - created_at),
    'has_avatar', avatar_url IS NOT NULL,
    'name_length', LENGTH(name)
  )
  INTO result
  FROM profiles
  WHERE id = user_id;
  
  RETURN COALESCE(result, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backend-API developer grants necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats(UUID) TO authenticated;

-- Backend-API Developer Notes:
-- - This migration sets up secure user profile management
-- - Implements proper RLS policies for data security
-- - Creates optimized indexes for performance
-- - Sets up automatic profile creation for new users
-- - Provides utility functions for common operations
-- - Follows database best practices for security and performance
