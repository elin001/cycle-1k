export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Missing code parameter');
  }

  const tokenRes = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return res.status(500).send(`Strava error: ${err}`);
  }

  const data = await tokenRes.json();
  const { refresh_token, athlete } = data;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(`<!doctype html>
<html>
<head><title>Strava Setup</title>
<style>body{font-family:monospace;padding:40px;background:#FAF8F3;}</style>
</head>
<body>
  <h2>Authorization successful!</h2>
  <p>Athlete: <strong>${athlete?.firstname} ${athlete?.lastname}</strong></p>
  <p>Copy this refresh token and add it to your Vercel environment variables:</p>
  <pre style="background:#fff;padding:16px;border-radius:8px;word-break:break-all;">${refresh_token}</pre>
  <p style="color:#888;">Set it as <code>STRAVA_USER1_REFRESH_TOKEN</code> or <code>STRAVA_USER2_REFRESH_TOKEN</code> in your Vercel project settings, then redeploy.</p>
</body>
</html>`);
}
