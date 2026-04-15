import { supabase } from '../../lib/supabase';
 
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const { token, username } = req.body;
 
  if (!token || !username) {
    return res.status(400).json({ error: 'Missing token or username' });
  }
 
  // 1. Look up the token in the database
  const { data: pending, error } = await supabase
    .from('pending_verifications')
    .select('*')
    .eq('token', token)
    .single();
 
  if (error || !pending) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
 
  // 2. Look up Roblox user by username (modern API)
  const userRes = await fetch(`https://users.roblox.com/v1/usernames/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
  });
  const userData = await userRes.json();
  const robloxUser = userData.data?.[0];
 
  if (!robloxUser) {
    return res.status(400).json({ error: 'Roblox user not found' });
  }
 
  // 3. Check if they are a member of the group (modern API)
  const groupRes = await fetch(`https://groups.roblox.com/v2/users/${robloxUser.id}/groups/roles`);
  const groupData = await groupRes.json();
 
  const isMember = groupData.data?.some(g => g.group.id === 16689173);
 
  if (!isMember) {
    return res.status(400).json({ error: 'You must be a member of the Roblox group to verify!' });
  }
 
  // 4. Save the verified user
  await supabase.from('verified_users').upsert({
    discord_id: pending.discord_id,
    roblox_id: String(robloxUser.id),
    roblox_username: robloxUser.name,
  });
 
  // 5. Delete the pending verification
  await supabase.from('pending_verifications').delete().eq('token', token);
 
  return res.status(200).json({ success: true });
}