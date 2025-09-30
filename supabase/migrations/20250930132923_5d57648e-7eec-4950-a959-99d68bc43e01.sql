-- Phase 1: Critical Security Fixes

-- 1.1 Fix Profiles Table RLS - Prevent Email Harvesting
-- Drop existing policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new restrictive SELECT policy for authenticated users only
CREATE POLICY "Authenticated users can view only their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Add explicit DENY policy for anonymous users
CREATE POLICY "Deny anonymous access to profiles" 
ON public.profiles 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

-- 1.2 Fix Admin Role Management
-- Update handle_new_user() trigger to use default role only (no user-supplied role)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, admin_role)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'Mosque Manager'::admin_role  -- Default role, not user-supplied
  );
  RETURN NEW;
END;
$$;

-- 1.3 Fix Foreign Key Reference
-- Drop foreign key constraint from namaz_timings.updated_by to auth.users
ALTER TABLE public.namaz_timings 
DROP CONSTRAINT IF EXISTS namaz_timings_updated_by_fkey;

-- Add foreign key to profiles.user_id instead
ALTER TABLE public.namaz_timings 
ADD CONSTRAINT namaz_timings_updated_by_fkey 
FOREIGN KEY (updated_by) 
REFERENCES public.profiles(user_id) 
ON DELETE SET NULL;