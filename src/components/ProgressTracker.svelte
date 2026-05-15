<script>
  /**
   * @type {{
   *   users: Array<{ name: string, miles: number }>,
   *   orientation: 'horizontal' | 'vertical'
   * }}
   */
  let { users, orientation } = $props();

  const GOAL = 1000;
  const COLLISION_THRESHOLD = 8;

  /** @param {number} miles */
  function pct(miles) {
    return Math.min(Math.max((miles / GOAL) * 100, 2), 98);
  }

  let p0 = $derived(pct(users[0]?.miles ?? 0));
  let p1 = $derived(pct(users[1]?.miles ?? 0));
  let collision = $derived(Math.abs(p0 - p1) < COLLISION_THRESHOLD);

  // Bind to the vertical track height so SVG arrow paths use real px.
  let trackH = $state(0);
  let p0y = $derived(trackH * p0 / 100);
  let p1y = $derived(trackH * p1 / 100);

  /**
   * Quadratic bezier swoopy arrow. Control point is perpendicular to the midpoint.
   * @param {number} x1 @param {number} y1
   * @param {number} x2 @param {number} y2
   * @param {boolean} clockwise @param {number} tension
   */
  function swoopyDraw(x1, y1, x2, y2, clockwise = true, tension = 0.4) {
    const cx = (x1 + x2) / 2 + (clockwise ? 1 : -1) * (y2 - y1) * tension;
    const cy = (y1 + y2) / 2 + (clockwise ? 1 : -1) * -(x2 - x1) * tension;
    return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
  }
</script>

{#if orientation === 'horizontal'}
  <!-- ─── DESKTOP: full-width horizontal bar ────────────────────────────── -->
  <div class="w-full px-10 py-6 bg-cream">
    <div class="h-track relative">
      <!-- Rail -->
      <div class="absolute top-1/2 left-0 right-0 h-px bg-ink-muted opacity-20 -translate-y-1/2"></div>

      <!-- Rider 0: emoji on rail centerline, name above -->
      <div class="rider-emoji" style="left: {p0}%;">
        <span class="text-xl leading-none">🚴</span>
      </div>
      <div class="rider-label-above font-sans text-[0.65rem] font-medium text-ink-muted whitespace-nowrap"
           style="left: {p0}%;">{users[0]?.name}</div>

      <!-- Rider 1: emoji on rail centerline, name below -->
      <div class="rider-emoji" style="left: {p1}%;">
        <span class="text-xl leading-none">🚴</span>
      </div>
      <div class="rider-label-below font-sans text-[0.65rem] font-medium text-ink-muted whitespace-nowrap"
           style="left: {p1}%;">{users[1]?.name}</div>

      <!-- Flag -->
      <div class="absolute top-1/2 right-0 -translate-y-1/2 text-xl leading-none">🏁</div>
    </div>

    <div class="flex justify-between mt-1 font-sans text-[0.65rem] text-ink-muted font-medium tracking-wide">
      <span>0 mi</span>
      <span>1,000 mi</span>
    </div>
  </div>

{:else}
  <!-- ─── MOBILE: full-height vertical section ─────────────────────────── -->
  <section id="progress" class="h-svh bg-cream flex items-center justify-center">
    <div class="track-v-wrap relative flex flex-col items-center h-full py-12">
      <span class="font-sans text-[0.65rem] text-ink-muted font-medium tracking-wide mb-2">0 mi</span>

      <!-- Track: rail + riders share the same positioned parent -->
      <div class="track-v-inner relative flex-1" bind:clientHeight={trackH}>
        <!-- Rail: sibling of riders, NOT a parent, so opacity doesn't bleed -->
        <div class="rail"></div>

        {#if collision}
          <!-- ── Collision: both centered, swoopy arrows to side labels ── -->
          <div class="rider" style="top:{p0}%">🚴</div>
          <div class="rider" style="top:{p1}%">🚴</div>

          <svg class="absolute inset-0 overflow-visible pointer-events-none" width="100%" height="100%">
            <defs>
              <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 Z" fill="var(--color-ink-muted)" opacity="0.6" />
              </marker>
            </defs>
            <!-- Arrow: rider 0 name (left) ──> emoji; counter-clockwise (bows down) -->
            <path
              d={swoopyDraw(-52, p0y, 4, p0y, false, 0.35)}
              stroke="var(--color-ink-muted)" stroke-width="1" fill="none"
              opacity="0.5" marker-end="url(#arr)"
              vector-effect="non-scaling-stroke"
            />
            <text x="-56" y={p0y} dominant-baseline="middle" text-anchor="end"
              font-family="var(--font-sans)" font-size="10" fill="var(--color-ink-muted)">
              {users[0]?.name}
            </text>
            <!-- Arrow: rider 1 name (right) ──> emoji; counter-clockwise (bows up) -->
            <path
              d={swoopyDraw(64, p1y, 8, p1y, false, 0.35)}
              stroke="var(--color-ink-muted)" stroke-width="1" fill="none"
              opacity="0.5" marker-end="url(#arr)"
              vector-effect="non-scaling-stroke"
            />
            <text x="68" y={p1y} dominant-baseline="middle" text-anchor="start"
              font-family="var(--font-sans)" font-size="10" fill="var(--color-ink-muted)">
              {users[1]?.name}
            </text>
          </svg>

        {:else}
          <!-- ── No collision: emoji + name stacked, centered on rail ── -->
          {#each users as user, i (user.name)}
            {@const p = i === 0 ? p0 : p1}
            <div class="rider-labeled" style="top:{p}%">
              <span class="text-2xl leading-none">🚴</span>
              <span class="font-sans text-[0.65rem] font-medium text-ink-muted whitespace-nowrap mt-0.5">
                {user.name}
              </span>
            </div>
          {/each}
        {/if}
      </div>

      <span class="text-2xl leading-none mt-2">🏁</span>
      <span class="font-sans text-[0.65rem] text-ink-muted font-medium tracking-wide mt-1">1,000 mi</span>
    </div>
  </section>
{/if}

<style>
  section { scroll-snap-align: start; }

  /* Horizontal */
  .h-track { height: 120px; }

  .rider-emoji {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.25rem;
    line-height: 1;
    transition: left 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .rider-label-above {
    position: absolute;
    top: calc(50% - 2.1rem);
    transform: translateX(-50%);
    transition: left 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .rider-label-below {
    position: absolute;
    top: calc(50% + 1.4rem);
    transform: translateX(-50%);
    transition: left 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Vertical */
  .track-v-wrap { width: 160px; }

  .track-v-inner {
    width: 12px;
    position: relative;
  }

  /* Rail is a sibling of rider divs — no opacity inheritance */
  .rail {
    position: absolute;
    top: 0; bottom: 0;
    left: 50%;
    width: 2px;
    transform: translateX(-50%);
    background: var(--color-ink-muted);
    opacity: 0.2;
    border-radius: 1px;
  }

  /* Single emoji (collision mode), centered on rail */
  .rider {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    line-height: 1;
    transition: top 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Emoji + name label stacked, centered on rail */
  .rider-labeled {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: top 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
</style>
