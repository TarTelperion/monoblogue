<script>
  import PostCard from '#lib/components/PostCard.svelte';
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  let { data } = $props();
  let selectedCategory = $state('all');
  let selectedLanguage = $state('');
  let reducedMotion = $state(false);
  let visiblePosts = $derived(data.posts.filter((post) => {
    const categoryMatch = selectedCategory === 'all' || post.categories.includes(selectedCategory);
    const languageMatch = !selectedLanguage || post.languages.includes(selectedLanguage);
    return categoryMatch && languageMatch;
  }));

  onMount(() => {
    const query = new URLSearchParams(window.location.search);
    selectedCategory = query.get('category') || 'all';
    selectedLanguage = query.get('language') || '';
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => reducedMotion = media.matches;
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  });

  function driftFor(slug, index) {
    const direction = [...slug].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 2 ? 1 : -1;
    return { x: direction * (22 + index * 4), y: 20 };
  }
</script>

<svelte:head>
  <title>Library — The Monoblogue</title>
  <meta name="description" content="Essays, notes, marginalia, and other items returned in unconfirmed condition." />
</svelte:head>

<section class="page-shell">
  <header class="page-intro">
    <span class="eyebrow">Order, theoretically</span>
    <h1>The Library</h1>
    <p class="lede">Essays, notes, marginalia, and other items returned in unconfirmed condition.</p>
  </header>

  <div class="catalogue-tools">
    <span>Filter the catalogue</span>
    <div class="filter-row" aria-label="Filter posts by category">
      <button class:active={selectedCategory === 'all'} onclick={() => selectedCategory = 'all'}>All</button>
      {#each data.categories as category}
        <button class:active={selectedCategory === category.slug} onclick={() => selectedCategory = category.slug}>{category.label}</button>
      {/each}
    </div>
  </div>

  {#if selectedLanguage}
    <p class="active-note">Showing entries linked to <strong>{selectedLanguage}</strong>. <button onclick={() => selectedLanguage = ''}>Clear</button></p>
  {/if}

  {#if visiblePosts.length}
    <div class="library-grid">
      {#each visiblePosts as post, index (post.slug)}
        {@const drift = driftFor(post.slug, index)}
        <div
          class="library-card"
          animate:flip={{ duration: reducedMotion ? 0 : 520 }}
          in:fly={{ x: drift.x, y: drift.y, duration: reducedMotion ? 0 : 420 }}
          out:fly={{ x: -drift.x, y: -12, duration: reducedMotion ? 0 : 260 }}
        >
          <PostCard {post} compact tilt={index % 2 === 0 ? -0.45 : 0.45} />
        </div>
      {/each}
    </div>
  {:else}
    <p class="empty-state">I thought I already filled this shelf... I'll get to it eventually.</p>
  {/if}
</section>

<style>
  .page-intro { max-width: 55rem; margin-bottom: 4rem; }
  .catalogue-tools { display: grid; grid-template-columns: 12rem 1fr; gap: 1rem; align-items: start; margin-bottom: 3rem; padding: 1.2rem 0; border-block: 4px double var(--ink); font-family: var(--sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; }
  .filter-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .filter-row button, .active-note button { padding: 0.35rem 0.65rem; border: 1px solid var(--ink); border-radius: 0; background: color-mix(in srgb, var(--paper) 84%, transparent); color: var(--ink); font-family: var(--sans); cursor: pointer; box-shadow: 2px 2px 0 color-mix(in srgb, var(--ink) 14%, transparent); }
  .filter-row button.active { border-color: var(--ink-deep); background: var(--ink-deep); color: var(--paper); }
  .library-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
  .library-card { min-width: 0; }
  .library-card :global(.post-card) { height: 100%; }
  .active-note { padding: 0.8rem 1rem; background: var(--green-soft); font-family: var(--sans); font-size: 0.82rem; }
  .empty-state { min-height: 18rem; padding: 4rem 0; font-size: 1.4rem; font-style: italic; }
  @media (max-width: 700px) { .catalogue-tools { grid-template-columns: 1fr; } .library-grid { grid-template-columns: 1fr; } }
</style>
