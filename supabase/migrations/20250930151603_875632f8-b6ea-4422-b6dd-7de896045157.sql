-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_count integer;
BEGIN
  -- Check if this is the first user
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  INSERT INTO public.profiles (user_id, email, full_name, admin_role, qiadat, aims_id, approved)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'admin_role')::admin_role, 'Mosque Manager'::admin_role),
    NEW.raw_user_meta_data->>'qiadat',
    NEW.raw_user_meta_data->>'aims_id',
    user_count = 0  -- First user is auto-approved, rest need approval
  );
  RETURN NEW;
END;
$function$;