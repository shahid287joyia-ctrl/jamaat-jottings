-- Create security definer function to check if user is approved admin
CREATE OR REPLACE FUNCTION public.is_approved_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND approved = true
  )
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Approved admins can update user approval" ON public.profiles;
DROP POLICY IF EXISTS "Approved admins can view all profiles" ON public.profiles;

-- Recreate policies using the security definer function
CREATE POLICY "Approved admins can update user approval" 
ON public.profiles
FOR UPDATE
USING (public.is_approved_admin(auth.uid()));

CREATE POLICY "Approved admins can view all profiles" 
ON public.profiles
FOR SELECT
USING (public.is_approved_admin(auth.uid()) OR auth.uid() = user_id);