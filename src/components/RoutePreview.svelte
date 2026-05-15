<script>
  import { decodePolyline, pointsToSvgPath } from '../lib/decodePolyline.js';

  /** @type {{ polyline: string | null }} */
  let { polyline } = $props();

  const W = 280, H = 72;

  // Design-branch placeholder: a hand-crafted path that reads like a cycling loop.
  const PLACEHOLDER_D =
    'M14,58 C30,52 44,38 58,28 C72,18 82,14 96,16 C114,18 128,26 140,22 ' +
    'C154,18 162,10 176,12 C190,14 200,24 210,30 C220,36 228,40 238,38 ' +
    'C248,36 256,28 264,26 L264,26 C256,36 244,44 232,50 C220,56 206,60 192,62 ' +
    'C172,64 150,60 130,58 C110,56 90,58 70,60 C52,62 32,64 14,58 Z';

  let path = $derived.by(() => {
    if (!polyline) return { d: PLACEHOLDER_D, viewBox: `0 0 ${W} ${H}` };
    const points = decodePolyline(polyline);
    return pointsToSvgPath(points, W, H);
  });
</script>

<div class="route-preview" aria-hidden="true">
  <svg
    viewBox={path.viewBox}
    preserveAspectRatio="xMidYMid meet"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d={path.d}
      stroke="var(--color-orange)"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      opacity="0.85"
    />
  </svg>
</div>

<style>
  .route-preview {
    width: 100%;
    height: 56px;
    margin-bottom: 0.5rem;
  }

  svg {
    width: 100%;
    height: 100%;
  }
</style>
