<script>
  import PostCard from '#lib/components/PostCard.svelte';
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.language.name} — The Monoblogue</title>
  <meta name="description" content={data.language.note} />
</svelte:head>

<section class="page-shell language-detail">
  <a class="back-link" href="/languages">← All languages</a>
  <header>
    <span class="language-glyph" aria-hidden="true">{data.language.glyph}</span>
    <div><span class="eyebrow">{data.language.level} · {data.language.cefr}</span><h1>{data.language.name}</h1><p class="lede">{data.language.note}</p></div>
  </header>
  <div class="section-heading"><div><span class="eyebrow">Linked marginalia</span><h2>Entries</h2></div></div>
  {#if data.posts.length}
    <div class="entry-grid">{#each data.posts as post}<PostCard {post} compact />{/each}</div>
  {:else}
    <p>No entries yet. The notebook is open.</p>
  {/if}
</section>

<style>
  .back-link { display: inline-block; margin-bottom: 2rem; font-family: var(--sans); font-size: 0.78rem; }
  header { display: grid; grid-template-columns: auto 1fr; gap: clamp(2rem, 7vw, 6rem); align-items: center; margin-bottom: 6rem; }
  .language-glyph { display: grid; width: clamp(10rem, 25vw, 18rem); aspect-ratio: 1; place-items: center; border: 4px double var(--ink); border-radius: 50%; background: var(--green-soft); box-shadow: inset 0 0 0 8px color-mix(in srgb, var(--paper) 35%, transparent), 8px 9px 0 color-mix(in srgb, var(--ink) 15%, transparent); color: var(--ink-deep); font-family: var(--display); font-size: clamp(5rem, 12vw, 9rem); }
  .entry-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
  @media (max-width: 700px) { header { grid-template-columns: 1fr; } .entry-grid { grid-template-columns: 1fr; } }
</style>
