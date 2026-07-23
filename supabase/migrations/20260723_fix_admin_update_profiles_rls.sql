-- Allow Admin users to UPDATE profiles (status & suspended_until)
-- Execute this SQL query in your Supabase SQL Editor if RLS is enabled on the profiles table.

DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;

CREATE POLICY "Admins can update profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_profile
    WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles admin_profile
    WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
  )
);
