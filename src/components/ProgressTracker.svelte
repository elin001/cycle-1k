<script>
  /**
   * @type {{
   *   users: Array<{ name: string, miles: number }>,
   *   orientation: 'horizontal' | 'vertical'
   * }}
   */
  let { users, orientation } = $props();

  const GOAL = 1000;

  /** @param {number} miles */
  function pct(miles) {
    // Clamp between 2–98 so emojis never clip outside the rail bounds
    return Math.min(Math.max((miles / GOAL) * 100, 2), 98);
  }
</script>

{#if orientation === "horizontal"}
  <div class="w-full px-8 py-6 bg-cream">
    <div class="track-h relative">
      <div class="rail-h"></div>

      {#each users as user, i (user.name)}
        <div class="rider-h" class:rider-h--below={i % 2 === 1} style="left: {pct(user.miles)}%">
          <span class="rider-label font-sans text-xs font-medium text-ink-muted">{user.name}</span>
          <span class="text-2xl leading-none">🚴</span>
        </div>
      {/each}

      <div class="flag-h">
        <span class="text-2xl leading-none">🏁</span>
      </div>

      <div
        class="flex justify-between mt-2 font-sans text-xs text-ink-muted font-medium tracking-wide"
      >
        <span>0 mi</span>
        <span>1,000 mi</span>
      </div>
    </div>
  </div>
{:else}
  <section
    id="progress"
    class="h-svh bg-cream flex items-center justify-center px-12"
  >
    <div class="track-v relative flex flex-col items-center h-full py-12">
      <span
        class="font-sans text-xs text-ink-muted font-medium tracking-wide mb-2"
        >0 mi</span
      >

      <div class="rail-v relative flex-1">
        {#each users as user, i (user.name)}
          <div
            class="rider-v"
            style="top: {pct(user.miles)}%; {i === 1
              ? 'left: 2.5rem;'
              : 'left: -2.5rem;'}"
          >
            <span class="text-2xl leading-none">🚴</span>
            <span
              class="rider-label font-sans text-xs font-medium text-ink-muted mt-1"
              >{user.name}</span
            >
          </div>
        {/each}
      </div>

      <span class="text-2xl leading-none mt-2">🏁</span>
      <span
        class="font-sans text-xs text-ink-muted font-medium tracking-wide mt-1"
        >1,000 mi</span
      >
    </div>
  </section>
{/if}

<style>
  section {
    scroll-snap-align: start;
  }

  /* Horizontal track */
  .track-h {
    height: 96px;
  }

  .rail-h {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--color-ink-muted);
    opacity: 0.2;
    transform: translateY(-50%);
  }

  /* Rider 0: label above, emoji below (sits on top of rail) */
  .rider-h {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  /* Rider 1: emoji above (sits on rail), label below */
  .rider-h--below {
    transform: translate(-50%, 0%);
    flex-direction: column-reverse;
  }

  .flag-h {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  /* Vertical track */
  .track-v {
    width: 80px;
  }

  .rail-v {
    width: 2px;
    background: var(--color-ink-muted);
    opacity: 0.2;
    margin: 0 auto;
  }

  .rider-v {
    position: absolute;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .rider-label {
    white-space: nowrap;
  }
</style>
