/**
 * GET /api/setup
 * Redirects to Strava OAuth using the server-side STRAVA_CLIENT_ID env var.
 * After approval, Strava calls /api/auth-callback with the code.
 */
export default function handler(req, res) {
  const clientId = process.env.STRAVA_CLIENT_ID;
  if (!clientId) {
    res.status(500).send('STRAVA_CLIENT_ID is not set in environment variables.');
    return;
  }

  const redirectUri = encodeURIComponent(`${req.headers['x-forwarded-proto'] ?? 'https'}://${req.headers.host}/api/auth-callback`);
  const url = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&approval_prompt=force&scope=activity:read_all`;

  res.redirect(302, url);
}
