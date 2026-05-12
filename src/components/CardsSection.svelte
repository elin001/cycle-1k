<script>
  import UserCard from './UserCard.svelte';
  import ProgressTracker from './ProgressTracker.svelte';

  /**
   * @type {{
   *   userData: Array<{ name: string, photo: string, stats: any, loading: boolean }>
   * }}
   */
  let { userData } = $props();

  let progressUsers = $derived(
    userData.map(u => ({ name: u.name, miles: u.stats?.totalMiles ?? 0 }))
  );
</script>

<section id="cards" class="cards-section bg-cream flex flex-col">
  <div class="flex flex-col md:flex-row flex-1 min-h-0">
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
  <div class="hidden md:block w-full border-t border-ink/10">
    <ProgressTracker users={progressUsers} orientation="horizontal" />
  </div>
</section>

<style>
  .cards-section {
    min-height: 100svh;
    scroll-snap-align: start;
  }
</style>
