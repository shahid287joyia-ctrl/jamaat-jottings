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