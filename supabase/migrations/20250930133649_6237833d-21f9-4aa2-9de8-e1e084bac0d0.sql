-- Add approved column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN approved boolean NOT NULL DEFAULT false;

-- Update the handle_new_user function to auto-approve the first user only
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  user_count integer;
BEGIN
  -- Check if this is the first user
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  INSERT INTO public.profiles (user_id, email, full_name, admin_role, approved)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'Mosque Manager'::admin_role,
    user_count = 0  -- First user is auto-approved, rest need approval
  );
  RETURN NEW;
END;
$function$;

-- Update events policies to require approval
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;

CREATE POLICY "Approved admins can delete events" 
ON public.events 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND approved = true
  )
);

CREATE POLICY "Approved admins can insert events" 
ON public.events 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND approved = true
  )
);

CREATE POLICY "Approved admins can update events" 
ON public.events 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND approved = true
  )
);

-- Update namaz_timings policies to require approval
DROP POLICY IF EXISTS "Admins can delete namaz timings" ON public.namaz_timings;
DROP POLICY IF EXISTS "Admins can insert namaz timings" ON public.namaz_timings;
DROP POLICY IF EXISTS "Admins can update namaz timings" ON public.namaz_timings;

CREATE POLICY "Approved admins can delete namaz timings" 
ON public.namaz_timings 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND approved = true
  )
);

CREATE POLICY "Approved admins can insert namaz timings" 
ON public.namaz_timings 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND approved = true
  )
);

CREATE POLICY "Approved admins can update namaz timings" 
ON public.namaz_timings 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND approved = true
  )
);

-- Update profiles policies
DROP POLICY IF EXISTS "Authenticated users can view only their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Approved admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND approved = true
  )
);

-- Allow approved admins to update other users' approval status
CREATE POLICY "Approved admins can update user approval" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND approved = true
  )
);