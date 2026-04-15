import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  const { data: pending, error } = await supabase
    .from('pending_verifications')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !pending) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  return res.status(200).json({ code: pending.code });
}