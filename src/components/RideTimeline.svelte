<script>
  import { slide } from 'svelte/transition';

  /**
   * @type {{ rides: Array<{ title: string|null, description: string|null, miles: number, date: string, polyline: string|null }> }}
   */
  let { rides } = $props();

  /** @param {string} dateStr */
  function formatDate(dateStr) {
    if (!dateStr) return '';
    // Parse as local date to avoid UTC-offset drift
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
</script>

<div class="flex flex-col">
  {#each rides as ride, i (`${ride.date}-${i}`)}
    <div class="flex gap-3 items-start" transition:slide={{ duration: 300, axis: 'y' }}>
      <!-- Dot + connecting line column -->
      <div class="flex flex-col items-center flex-shrink-0" style="width:16px;">
        <!-- mt aligns dot center with the cap-height of the title text (~0.35rem) -->
        <div class="w-2 h-2 rounded-full bg-ink-muted/40 flex-shrink-0 mt-[0.35rem]"></div>
        {#if i < rides.length - 1}
          <div class="w-px flex-1 bg-ink-muted/20 mt-1 mb-0"></div>
        {/if}
      </div>

      <!-- Ride content -->
      <div class="flex-1 pb-5">
        <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
          <span class="font-sans font-medium text-[0.7rem] text-orange">{formatDate(ride.date)}</span>
          {#if ride.title}
            <span class="font-sans font-medium text-sm text-ink">{ride.title}</span>
          {/if}
          <span class="font-sans font-normal text-[0.75rem] text-ink-muted">{ride.miles} mi</span>
        </div>
        {#if ride.description}
          <p class="font-sans font-normal text-xs text-ink-muted leading-relaxed m-0">
            {ride.description}
          </p>
        {/if}
      </div>
    </div>
  {/each}
</div>
