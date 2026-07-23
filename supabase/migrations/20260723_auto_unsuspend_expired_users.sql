-- Migration: Add auto-unsuspend function for expired user suspensions
CREATE OR REPLACE FUNCTION public.auto_unsuspend_expired_users()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET status = 'active',
      suspended_until = NULL
  WHERE status = 'suspended'
    AND suspended_until IS NOT NULL
    AND suspended_until <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
