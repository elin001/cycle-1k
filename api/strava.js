const MEMORIAL_DAY_2026 = 1779667200; // 2026-05-25 00:00:00 UTC

async function refreshAccessToken(refreshToken) {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

async function fetchAllRides(accessToken) {
  const rides = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=200&after=${MEMORIAL_DAY_2026}&page=${page}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) throw new Error(`Activities fetch failed: ${res.status}`);
    const batch = await res.json();
    const filtered = batch.filter(a => a.sport_type === 'Ride' || a.type === 'Ride');
    rides.push(...filtered);
    if (batch.length < 200) break;
    page++;
  }
  return rides;
}

function computeStats(rides) {
  const toMiles = m => +(m / 1609.34).toFixed(1);

  if (!rides.length) {
    return { totalMiles: 0, avgMilesPerWeek: 0, recentRides: [] };
  }

  const totalMiles = toMiles(rides.reduce((sum, r) => sum + r.distance, 0));
  const sorted = [...rides].sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  const msElapsed = Date.now() - MEMORIAL_DAY_2026 * 1000;
  const weeksElapsed = Math.max(msElapsed / (7 * 24 * 60 * 60 * 1000), 1);
  const avgMilesPerWeek = +(totalMiles / weeksElapsed).toFixed(1);

  const recentRides = sorted.slice(0, 3).map(r => ({
    title: r.name || null,
    description: r.description || null,
    miles: toMiles(r.distance),
    date: (r.start_date_local || r.start_date || '').slice(0, 10),
    polyline: r.map?.summary_polyline || null,
  }));

  return { totalMiles, avgMilesPerWeek, recentRides };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const user = req.query?.user;
  if (user !== '1' && user !== '2') {
    return res.status(400).json({ error: 'user must be 1 or 2' });
  }

  const refreshToken = process.env[`STRAVA_USER${user}_REFRESH_TOKEN`];
  if (!refreshToken) {
    return res.status(500).json({ error: `STRAVA_USER${user}_REFRESH_TOKEN not configured` });
  }

  try {
    const accessToken = await refreshAccessToken(refreshToken);
    const rides = await fetchAllRides(accessToken);
    const stats = computeStats(rides);
    return res.status(200).json(stats);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
