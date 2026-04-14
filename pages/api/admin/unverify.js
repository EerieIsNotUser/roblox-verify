import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { password, discordId } = req.body;

  const admins = [
    process.env.ADMIN_EERIE,
    process.env.ADMIN_KKG,
    process.env.ADMIN_KA,
  ];

  if (!admins.includes(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { error } = await supabase
    .from('verified_users')
    .delete()
    .eq('discord_id', discordId);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true });
}