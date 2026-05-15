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

<section id="cards" class="cards-section bg-cream flex flex-col">
  {#if updatedLabel}
    <p class="text-center font-sans text-[0.65rem] tracking-widest uppercase text-blue pt-6 pb-0 m-0 opacity-60">
      {updatedLabel}
    </p>
  {/if}

  <div class="flex flex-col md:flex-row flex-1 min-h-0 gap-4 md:gap-8 px-6 py-8 md:py-12 max-w-4xl w-full mx-auto">
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
</section>

<style>
  .cards-section {
    min-height: 100svh;
    scroll-snap-align: start;
  }
</style>
