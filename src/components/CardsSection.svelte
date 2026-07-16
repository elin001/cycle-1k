<script>
  import { createSubscriber } from 'svelte/reactivity';
  import UserCard from './UserCard.svelte';
  import ProgressTracker from './ProgressTracker.svelte';

  /**
   * @type {{
   *   userData: Array<{ name: string, photo: string, stats: any, loading: boolean }>,
   *   fetchedAt: Date | null
   * }}
   */
  let { userData, fetchedAt } = $props();

  let progressUsers = $derived(
    userData.map(u => ({ name: u.name, miles: u.stats?.totalMiles ?? 0 }))
  );

  // Ticks every 30 s so updatedLabel stays fresh without an effect.
  const subscribeTick = createSubscriber(update => {
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  });

  let updatedLabel = $derived.by(() => {
    subscribeTick();
    if (!fetchedAt) return null;
    const secs = Math.floor((Date.now() - fetchedAt.getTime()) / 1000);
    if (secs < 60) return 'Updated just now';
    const mins = Math.floor(secs / 60);
    return `Updated ${mins} min ago`;
  });
</script>

<section id="cards" class="cards-section bg-light-blue flex flex-col">
  {#if updatedLabel}
    <p class="text-center font-sans text-[0.65rem] tracking-widest uppercase text-blue pt-3 pb-0 m-0">
      {updatedLabel}
    </p>
  {/if}

  <div class="flex flex-col md:flex-row md:flex-1 md:min-h-0 gap-3 md:gap-8 px-6 py-6 md:py-12 max-w-4xl w-full mx-auto">
    {#each userData as user (user.name)}
      <UserCard
        name={user.name}
        photo={user.photo}
        stats={user.stats}
        loading={user.loading}
      />
    {/each}
  </div>

  <!-- Desktop: full-width horizontal progress tracker -->
  <div class="hidden md:block w-full">
    <ProgressTracker users={progressUsers} orientation="horizontal" />
  </div>

  <!-- Strava attribution — required by API agreement -->
  <div class="flex justify-center pb-6 pt-2">
    <a href="https://www.strava.com" target="_blank" rel="noopener noreferrer" aria-label="Powered by Strava">
      <img src="/strava-badge.svg" alt="Powered by Strava" class="strava-badge" />
    </a>
  </div>
</section>

<style>
  .cards-section {
    min-height: 100svh;
    scroll-snap-align: start;
  }

  .strava-badge {
    height: 13px;
    width: auto;
    opacity: 0.4;
    transition: opacity 0.2s;
  }

  .strava-badge:hover {
    opacity: 0.7;
  }
</style>
