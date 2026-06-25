<script>
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import RoutePreview from './RoutePreview.svelte';
  import RideTimeline from './RideTimeline.svelte';

  /** @type {{ name: string, photo: string, stats: any, loading: boolean }} */
  let { name, photo, stats, loading } = $props();

  let photoFailed = $state(false);
  let initial = $derived(name.charAt(0).toUpperCase());
  let mostRecent = $derived(stats?.recentRides?.[0] ?? null);

  const tweenOpts = { duration: 700, easing: cubicOut };
  let tweenMiles = new Tween(stats?.totalMiles ?? 0, tweenOpts);
  let tweenAvg   = new Tween(stats?.avgMilesPerWeek ?? 0, tweenOpts);

  $effect(() => {
    tweenMiles.set(stats?.totalMiles ?? 0);
    tweenAvg.set(stats?.avgMilesPerWeek ?? 0);
  });
</script>

<article class="card flex flex-col items-center flex-1 max-h-[40dvh] md:max-h-none min-w-0 px-8 py-8 bg-white rounded-2xl shadow-sm">
  {#if photoFailed}
    <div class="w-20 h-20 rounded-full mb-3 flex items-center justify-center bg-light-blue">
      <span class="font-sans font-black text-ink-muted text-2xl">{initial}</span>
    </div>
  {:else}
    <img
      src={photo}
      alt={name}
      class="w-20 h-20 rounded-full object-cover mb-3"
      onerror={() => { photoFailed = true; }}
    />
  {/if}

  <h2 class="font-sans font-medium text-xs tracking-widest uppercase text-ink-muted m-0 mb-6">
    {name}
  </h2>

  {#if loading}
    <div class="flex flex-col gap-4 w-full">
      <div class="skeleton h-12 rounded"></div>
      <div class="skeleton h-12 rounded"></div>
      <div class="skeleton h-12 rounded"></div>
    </div>

  {:else if stats}
    <!-- Top stats: only 2 numbers now that last-ride detail lives below -->
    <div class="grid grid-cols-2 gap-x-4 gap-y-6 w-full text-center mb-8">
      <div class="flex flex-col items-center gap-1">
        <span class="font-sans font-bold text-ink leading-none" style="font-size:2.75rem;">
          {tweenMiles.current.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        </span>
        <span class="font-sans font-medium text-[0.65rem] tracking-widest uppercase text-ink-muted">
          total mi
        </span>
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-sans font-bold text-ink leading-none" style="font-size:2.75rem;">
          {tweenAvg.current.toFixed(1)}
        </span>
        <span class="font-sans font-medium text-[0.65rem] tracking-widest uppercase text-ink-muted">
          avg mi / wk
        </span>
      </div>
    </div>

    <!-- Recent rides module -->
    {#if stats.recentRides?.length}
      <div class="w-full">
        <span class="font-sans font-medium text-[0.65rem] tracking-widest uppercase text-orange block mb-3">
          Last ride
        </span>

        <!-- Route preview: always show for the most recent ride -->
        {#if mostRecent}
          <RoutePreview polyline={mostRecent.polyline} />
        {/if}

        <!-- Mobile: single ride, no timeline chrome -->
        <div class="md:hidden">
          {#if mostRecent?.title}
            <p class="font-sans font-medium text-sm text-ink m-0 mb-0.5">{mostRecent.title}
              <span class="font-normal text-ink-muted"> · {mostRecent.miles} mi</span>
            </p>
          {/if}
          {#if mostRecent?.description}
            <p class="font-sans text-xs text-ink-muted leading-relaxed m-0">{mostRecent.description}</p>
          {/if}
        </div>

        <!-- Desktop: full dot timeline across all recent rides -->
        <div class="hidden md:block mt-2">
          <RideTimeline rides={stats.recentRides} />
        </div>
      </div>
    {/if}

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
