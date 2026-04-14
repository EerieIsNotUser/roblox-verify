export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { password } = req.body;

  const admins = {
    Eerie: process.env.ADMIN_EERIE,
    KKG: process.env.ADMIN_KKG,
    KA: process.env.ADMIN_KA,
  };

  for (const [name, adminPassword] of Object.entries(admins)) {
    if (password === adminPassword) {
      return res.status(200).json({ success: true, name });
    }
  }

  return res.status(401).json({ success: false });
}