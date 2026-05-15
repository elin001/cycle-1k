/**
 * Decode a Google-encoded polyline string into an array of [lat, lng] pairs.
 * Used to decode Strava's `map.summary_polyline`.
 * @param {string} encoded
 * @returns {Array<[number, number]>}
 */
export function decodePolyline(encoded) {
  const points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0; result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

/**
 * Normalize lat/lng points to an SVG viewBox.
 * Returns SVG path `d` attribute and the viewBox string.
 * @param {Array<[number, number]>} points
 * @param {number} width
 * @param {number} height
 * @param {number} padding
 */
export function pointsToSvgPath(points, width = 200, height = 80, padding = 6) {
  if (points.length < 2) return { d: '', viewBox: `0 0 ${width} ${height}` };

  const lats = points.map(p => p[0]);
  const lngs = points.map(p => p[1]);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);

  const scaleX = (width - padding * 2) / (maxLng - minLng || 1);
  const scaleY = (height - padding * 2) / (maxLat - minLat || 1);

  const coords = points.map(([lat, lng]) => [
    padding + (lng - minLng) * scaleX,
    height - padding - (lat - minLat) * scaleY, // flip y: north = up
  ]);

  const d = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return { d, viewBox: `0 0 ${width} ${height}` };
}
