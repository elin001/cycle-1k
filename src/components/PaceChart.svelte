<script>
  /**
   * Compact sparkline: cumulative miles vs. ideal pace toward 1,000 mi goal.
   * @type {{ weeklyMiles: number[], goal?: number, weeks?: number }}
   */
  let { weeklyMiles, goal = 1000, weeks = 15 } = $props();

  const W = 240;   // viewBox width
  const H = 56;    // viewBox height
  const PAD = { top: 6, right: 8, bottom: 4, left: 4 };

  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  // x: position of week index (0 = start, weeks = finish)
  function xScale(i) {
    return PAD.left + (i / weeks) * chartW;
  }

  // y: 0 mi = bottom, goal mi = top
  function yScale(miles) {
    return PAD.top + chartH - (miles / goal) * chartH;
  }

  // Cumulative actuals
  let cumulative = $derived.by(() => {
    let sum = 0;
    return weeklyMiles.map(w => { sum += w; return sum; });
  });

  // Current week index (last data point)
  let currentWeek = $derived(weeklyMiles.length);

  // Actual polyline points
  let actualPoints = $derived(
    [[0, 0], ...cumulative.map((m, i) => [i + 1, m])]
      .map(([i, m]) => `${xScale(i).toFixed(2)},${yScale(m).toFixed(2)}`)
      .join(' ')
  );

  // Pace reference line: origin → current position on perfect-pace trajectory
  let pacePoints = $derived(
    `${xScale(0).toFixed(2)},${yScale(0).toFixed(2)} ` +
    `${xScale(weeks).toFixed(2)},${yScale(goal).toFixed(2)}`
  );

  // Tip of actual line (for the current-position dot)
  let tipX = $derived(xScale(currentWeek));
  let tipY = $derived(yScale(cumulative[cumulative.length - 1] ?? 0));

  // Is the rider ahead of or behind pace?
  let paceAtCurrentWeek = $derived((currentWeek / weeks) * goal);
  let ahead = $derived((cumulative[cumulative.length - 1] ?? 0) >= paceAtCurrentWeek);
</script>

<div class="pace-wrap">
  <svg viewBox="0 0 {W} {H}" class="pace-svg" aria-label="Pace to goal chart">

    <!-- Pace reference line -->
    <polyline
      points={pacePoints}
      fill="none"
      stroke="var(--color-ink-muted)"
      stroke-width="1"
      stroke-dasharray="3 3"
      opacity="0.35"
    />

    <!-- Actual progress line -->
    <polyline
      points={actualPoints}
      fill="none"
      stroke="var(--color-orange)"
      stroke-width="1.5"
      stroke-linejoin="round"
      stroke-linecap="round"
      class="actual-line"
    />

    <!-- Current position dot -->
    {#if currentWeek > 0}
      <circle
        cx={tipX}
        cy={tipY}
        r="3"
        fill={ahead ? 'var(--color-orange)' : 'var(--color-ink-muted)'}
        class="tip-dot"
      />
    {/if}

  </svg>

  <div class="pace-labels font-sans text-ink-muted">
    <span>0</span>
    <span class="pace-label-goal">1,000 mi</span>
  </div>
</div>

<style>
  .pace-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .pace-svg {
    width: 100%;
    height: auto;
    display: block;
    overflow: visible;
  }

  .actual-line {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: draw-line 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .tip-dot {
    opacity: 0;
    animation: dot-appear 0.3s ease forwards 1.1s;
  }

  @keyframes draw-line {
    to { stroke-dashoffset: 0; }
  }

  @keyframes dot-appear {
    to { opacity: 1; }
  }

  .pace-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.6rem;
    letter-spacing: 0.05em;
    opacity: 0.5;
    padding: 0 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    .actual-line { animation: none; stroke-dashoffset: 0; }
    .tip-dot     { animation: none; opacity: 1; }
  }
</style>
