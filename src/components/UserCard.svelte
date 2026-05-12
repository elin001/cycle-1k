<script>
  /** @type {{ name: string, photo: string, stats: import('../types').UserStats | null, loading: boolean }} */
  let { name, photo, stats, loading } = $props();

  let photoFailed = $state(false);
  let initial = $derived(name.charAt(0).toUpperCase());
</script>

<article class="flex flex-col items-center flex-1 min-w-0 px-6 py-8">
  {#if photoFailed}
    <div
      class="w-20 h-20 rounded-full mb-3 flex items-center justify-center bg-skeleton-a"
    >
      <span class="font-sans font-black text-ink-muted text-2xl">{initial}</span
      >
    </div>
  {:else}
    <img
      src={photo}
      alt={name}
      class="w-20 h-20 rounded-full object-cover mb-3"
      onerror={() => {
        photoFailed = true;
      }}
    />
  {/if}

  <h2
    class="font-sans font-medium text-xs tracking-widest uppercase text-ink-muted m-0 mb-6"
  >
    {name}
  </h2>

  {#if loading}
    <div class="flex flex-col gap-4 w-full">
      <div class="skeleton h-12 rounded"></div>
      <div class="skeleton h-12 rounded"></div>
      <div class="skeleton h-12 rounded"></div>
    </div>
  {:else if stats}
    <div class="grid grid-cols-2 gap-x-4 gap-y-6 w-full text-center">
      <div class="flex flex-col items-center gap-1">
        <span
          class="font-serif font-bold text-ink leading-none"
          style="font-size: 2.75rem;">{stats.totalMiles.toLocaleString()}</span
        >
        <span
          class="font-sans font-medium text-[0.7rem] tracking-widest uppercase text-ink-muted"
          >total miles</span
        >
      </div>
      <div class="flex flex-col items-center gap-1">
        <span
          class="font-serif font-bold text-ink leading-none"
          style="font-size: 2.75rem;">{stats.lastRideMiles}</span
        >
        <span
          class="font-sans font-medium text-[0.7rem] tracking-widest uppercase text-ink-muted"
          >last ride</span
        >
      </div>
      <div class="flex flex-col items-center gap-1">
        <span
          class="font-serif font-bold text-ink leading-none"
          style="font-size: 2.75rem;">{stats.avgMilesPerWeek}</span
        >
        <span
          class="font-sans font-medium text-[0.7rem] tracking-widest uppercase text-ink-muted"
          >avg mi / week</span
        >
      </div>
      {#if stats.lastRideTitle}
        <div class="col-span-2 flex flex-col items-center gap-1">
          <span class="font-serif font-bold text-ink text-xl leading-snug"
            >{stats.lastRideTitle}</span
          >
          <span
            class="font-sans font-medium text-[0.7rem] tracking-widest uppercase text-ink-muted"
            >last ride title</span
          >
        </div>
      {/if}
      {#if stats.lastRideDescription}
        <div class="col-span-2 flex flex-col items-center gap-1">
          <span class="font-serif font-bold text-ink text-xl leading-snug"
            >{stats.lastRideDescription}</span
          >
          <span
            class="font-sans font-medium text-[0.7rem] tracking-widest uppercase text-ink-muted"
            >last ride note</span
          >
        </div>
      {/if}
    </div>
  {:else}
    <p class="text-sm text-ink-muted">Could not load data</p>
  {/if}
</article>

<style>
  .skeleton {
    background: linear-gradient(90deg, #ede9e0 25%, #e5e1d8 50%, #ede9e0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
</style>
