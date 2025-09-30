-- Add qiadat field to events table for local event filtering
ALTER TABLE public.events ADD COLUMN qiadat TEXT;

-- Add new fields to profiles table for admin signup
ALTER TABLE public.profiles 
  ADD COLUMN qiadat TEXT,
  ADD COLUMN aims_id VARCHAR(5);

-- Update admin_role enum to include new roles
ALTER TYPE admin_role ADD VALUE IF NOT EXISTS 'Local Nazim';
ALTER TYPE admin_role ADD VALUE IF NOT EXISTS 'Sadar Jamaat';
ALTER TYPE admin_role ADD VALUE IF NOT EXISTS 'Other';

-- Create index for qiadat filtering
CREATE INDEX IF NOT EXISTS idx_events_qiadat ON public.events(qiadat);
CREATE INDEX IF NOT EXISTS idx_profiles_qiadat ON public.profiles(qiadat);