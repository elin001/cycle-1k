<script>
  /** @type {{ sections: string[], activeIndex: number }} */
  let { sections, activeIndex } = $props();

  /** @param {string} id */
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<nav class="dot-nav md:hidden" aria-label="Page navigation">
  {#each sections as id, i (id)}
    <button
      class="dot"
      class:active={i === activeIndex}
      aria-label="Go to section {i + 1}"
      onclick={() => scrollTo(id)}
    ></button>
  {/each}
</nav>

<style>
  .dot-nav {
    position: fixed;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 50;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--color-ink-muted);
    opacity: 0.35;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
  }

  .dot.active {
    opacity: 1;
    transform: scale(1.4);
    background: var(--color-ink);
  }
</style>
