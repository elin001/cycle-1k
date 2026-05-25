<script>
  import "./app.css";
  import HeroSection from "./components/Hero.svelte";
  import CardsSection from "./components/CardsSection.svelte";
  import ProgressTracker from "./components/ProgressTracker.svelte";
  import DotNav from "./components/DotNav.svelte";

  let innerWidth = $state(0);
  let isMobile = $derived(innerWidth < 768);

  // Hard-coded user metadata — names and photos don't change.
  const USERS = [
    { name: "Alex Boyd", photo: "/photos/alex.jpg" },
    { name: "Ellie Lin", photo: "/photos/ellie.jpg" },
  ];

  // Mobile sections: hero → cards → progress
  const SECTION_IDS = ["hero", "cards", "progress"];

  // Stats state — raw API responses, never mutated so $state.raw is appropriate.
  let stats1 = $state.raw(null);
  let stats2 = $state.raw(null);
  let loading1 = $state(true);
  let loading2 = $state(true);
  let fetchedAt = $state.raw(null);

  let activeIndex = $state(0);

  let userData = $derived([
    { ...USERS[0], stats: stats1, loading: loading1 },
    { ...USERS[1], stats: stats2, loading: loading2 },
  ]);

  let progressUsers = $derived(
    userData.map((u) => ({ name: u.name, miles: u.stats?.totalMiles ?? 0 })),
  );

  // Fetch both users' stats on mount.
  async function loadStats() {
    loading1 = true;
    loading2 = true;
    const [res1, res2] = await Promise.allSettled([
      fetch("/api/strava?user=1").then((r) => r.json()),
      fetch("/api/strava?user=2").then((r) => r.json()),
    ]);
    stats1 = res1.status === "fulfilled" ? res1.value : null;
    stats2 = res2.status === "fulfilled" ? res2.value : null;
    loading1 = false;
    loading2 = false;
    fetchedAt = new Date();
  }

  loadStats();

  // Drive dot nav via IntersectionObserver.
  // $effect runs after all children are mounted, so getElementById reliably finds
  // every section. Re-runs when isMobile changes so the observer picks up the
  // progress section if it was just added to the DOM.
  $effect(() => {
    isMobile; // explicit dependency — re-init when mobile layout appears/disappears

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = SECTION_IDS.indexOf(entry.target.id);
            if (idx !== -1) activeIndex = idx;
          }
        }
      },
      { threshold: 0.5 },
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  });
</script>

<svelte:window bind:innerWidth />

<div>
  <HeroSection />
  <CardsSection {userData} {fetchedAt} />
  {#if isMobile}
    <div class="md:hidden">
      <ProgressTracker users={progressUsers} orientation="vertical" />
    </div>
  {/if}
</div>

{#if isMobile}
  <div class="md:hidden">
    <DotNav sections={SECTION_IDS} {activeIndex} />
  </div>
{/if}
